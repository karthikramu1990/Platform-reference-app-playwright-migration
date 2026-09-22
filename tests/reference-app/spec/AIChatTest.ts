import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { HomePage } from '../page/HomePage';
import { NavigatorPage } from '../page/NavigatorPage';
import { AIChatPage } from '../page/AIChatPage';
import testData from '../testdata/TestData.json';

// N days from today, formatted YYYY-MM-DD - never hardcode a literal date.
// The Energy Prediction feature only forecasts within the next 15 days (confirmed live:
// asking for +20 days gets "I can only provide predictions for dates within the next 15 days").
function daysFromNowIso(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export class AIChatTest {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Scenario 1: switch to the EX model, activate LLM key (or close settings if already activated), then BIM Query Team + prompt + validate response.
  async verifyBimQueryTeamChatResponse(): Promise<void> {
    const hp = new HomePage(this.page);
    const navigator = new NavigatorPage(this.page);
    const chat = new AIChatPage(this.page);

    await hp.selectElementMenu();
    await hp.selectNavigatorScreen();
    await navigator.ensureModelExSelected();
    await chat.openChatPanel();
    await chat.openSettings();
    await chat.openLlmSecretKeyTab();

    if (!(await chat.isSecretKeyConfigured())) {
      await chat.enterSecretKey(process.env.REFAPP_AI_CHAT_SECRET_KEY ?? '');
    }
    await chat.closeSettings();
    await chat.ensureChatResourcesConfigured();

    await chat.selectTeam('BIM Query Team');
    await chat.askQuestion(testData.AIchat.BimQueryQuestion);
    const response = await chat.waitForResponse();
    expect(response.length, 'Expected a non-empty AI chat response').toBeGreaterThan(0);
    expect(response, 'Expected no error in AI chat response').not.toContain('Request Failed');
  }

  // Scenario 2: Energy Prediction MCP tab - Setup Resources, Refresh MCP Server Tokens, Get Latest Readings, then close.
  async verifyEnergyPredictionMcpSetup(): Promise<void> {
    const chat = new AIChatPage(this.page);
    await chat.openSettings();
    await chat.openEnergyPredictionMcpTab();
    await chat.runSetupResources();
    await chat.runRefreshMcpTokens();
    await chat.runGetLatestReadings();
    await chat.closeSettings();
  }

  // Scenario 3: Energy Prediction Team + energy prompt + validate response. Reload first - PA-1594's own AC notes AiPrompt doesn't see a newly created team without a refresh.
  async verifyEnergyPredictionChatResponse(): Promise<void> {
    await this.page.reload();
    const chat = new AIChatPage(this.page);
    await chat.openChatPanel();
    await chat.ensureChatResourcesConfigured();

    // One reload isn't always enough for the newly-created team to appear - confirmed live on
    // the staging environment (backend propagation is slower there than on qa3/staging3). Retry
    // with a fresh reload once before giving up.
    try {
      await chat.selectTeam('Energy Prediction Team');
    } catch {
      await this.page.reload();
      await chat.openChatPanel();
      await chat.selectTeam('Energy Prediction Team');
    }
    const expectedDate = daysFromNowIso(10);
    const question = testData.AIchat.EnergyPredictionQuestionTemplate.replace('{date}', expectedDate);
    await chat.askQuestion(question);
    const response = await chat.waitForResponse();

    expect(response, 'Expected a kWh prediction value').toContain('kWh');
    expect(response, 'Expected a ±10% range').toMatch(/Range.*±10%/i);
    expect(await chat.responseHasChart(), 'Expected a rendered Mermaid line chart in the response').toBeTruthy();
    expect(await chat.responseHasHistoricalReference(), 'Expected a "Based on" historical reference section').toBeTruthy();

    // 1. Predicted date must equal the date actually requested, not just mention a date.
    const predictedDate = chat.extractPredictedDate(response);
    expect(predictedDate, 'Expected a parseable "Date:" line in the response').not.toBeNull();
    expect(predictedDate, `Expected the AI to predict for ${expectedDate} (the date requested)`).toBe(expectedDate);

    // 2. Schema-only checks: the actual kWh figures vary run to run (weather/model-dependent),
    // so only confirm the expected fields are present and well-formed - don't assert on their values.
    const consumption = chat.extractPredictedConsumption(response);
    expect(consumption, 'Expected parseable "Predicted consumption" and "Range (±10%)" lines').not.toBeNull();
    if (consumption) {
      const { value, rangeLow, rangeHigh } = consumption;
      expect(Number.isFinite(value) && value > 0, `Predicted consumption should be a positive number, got ${value}`).toBe(true);
      expect(Number.isFinite(rangeLow) && rangeLow > 0, `Range lower bound should be a positive number, got ${rangeLow}`).toBe(true);
      expect(Number.isFinite(rangeHigh) && rangeHigh > rangeLow, `Range upper bound should be a positive number greater than the lower bound, got ${rangeHigh}`).toBe(true);

      const historicalValues = chat.extractHistoricalConsumptionValues(response);
      expect(historicalValues.length, 'Expected at least one historical "Based on" consumption figure').toBeGreaterThan(0);
      expect(historicalValues.every(v => Number.isFinite(v) && v > 0), `Expected every historical consumption figure to be a positive number, got ${JSON.stringify(historicalValues)}`).toBe(true);
    }
  }
}
