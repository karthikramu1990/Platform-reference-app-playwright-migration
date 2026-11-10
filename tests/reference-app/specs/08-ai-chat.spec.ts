import { test, expect } from '../fixtures';
import testData from '../data/test-data.json';
import { waitForModelLoaded } from '../utils/model-loading';

// N days from today, formatted YYYY-MM-DD - never hardcode a literal date.
// The Energy Prediction feature only forecasts within the next 15 days (confirmed live:
// asking for +20 days gets "I can only provide predictions for dates within the next 15 days").
function daysFromNowIso(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

// AI Chat (PA-1261/PA-1370/PA-1594)
test.describe('AI Chat', () => {
  // 22 and 23 continue in the chat panel and settings that 21 opens and configures.
  test.describe.configure({ mode: 'serial' });

  // Switch to the EX model, activate the LLM key (or close settings if already activated), then BIM Query Team + prompt + validate response.
  test('21 - Verify BIM Query Team Chat Response', async ({ appPage, homePage, navigatorPage, aiChatPage }) => {
    // Start from a clean screen: panels left open by the previous spec block the model switch.
    await appPage.reload({ waitUntil: 'networkidle' });
    await homePage.selectElementMenu();
    await homePage.selectNavigatorScreen();
    await navigatorPage.ensureModelExSelected();
    // Opening the chat while the model is still loading leaves the panel empty (no team list).
    await waitForModelLoaded(appPage);
    await aiChatPage.openChatPanel();
    await aiChatPage.openSettings();
    await aiChatPage.openLlmSecretKeyTab();

    if (!(await aiChatPage.isSecretKeyConfigured())) {
      await aiChatPage.enterSecretKey(process.env.REFAPP_AI_CHAT_SECRET_KEY ?? '');
    }
    await aiChatPage.closeSettings();
    await aiChatPage.ensureChatResourcesConfigured();

    await aiChatPage.selectTeam('BIM Query Team');
    await aiChatPage.askQuestion(testData.AIchat.BimQueryQuestion);
    const response = await aiChatPage.waitForResponse();
    expect(response.length, 'Expected a non-empty AI chat response').toBeGreaterThan(0);
    expect(response, 'Expected no error in AI chat response').not.toContain('Request Failed');
  });

  // Energy Prediction MCP tab - Setup Resources, Get Latest Readings, then close.
  test('22 - Verify Energy Prediction MCP Setup', async ({ aiChatPage }) => {
    await aiChatPage.openSettings();
    await aiChatPage.openEnergyPredictionMcpTab();
    await aiChatPage.runSetupResources();
    await aiChatPage.runGetLatestReadings();
    await aiChatPage.closeSettings();
  });

  // Energy Prediction Team + energy prompt + validate response. Reload first - PA-1594's own AC notes AiPrompt doesn't see a newly created team without a refresh.
  test('23 - Verify Energy Prediction Team Chat Response', async ({ appPage, aiChatPage }) => {
    await appPage.reload();
    await aiChatPage.openChatPanel();
    await aiChatPage.ensureChatResourcesConfigured();

    // One reload isn't always enough for the newly-created team to appear - confirmed live on
    // the staging environment (backend propagation is slower there than on qa3/staging3). Retry
    // with a fresh reload once before giving up.
    try {
      await aiChatPage.selectTeam('Energy Prediction Team');
    } catch {
      await appPage.reload();
      await aiChatPage.openChatPanel();
      await aiChatPage.selectTeam('Energy Prediction Team');
    }
    const expectedDate = daysFromNowIso(10);
    const question = testData.AIchat.EnergyPredictionQuestionTemplate.replace('{date}', expectedDate);
    await aiChatPage.askQuestion(question);
    const response = await aiChatPage.waitForResponse();

    expect(response, 'Expected a kWh prediction value').toContain('kWh');
    expect(response, 'Expected a ±10% range').toMatch(/Range.*±10%/i);
    expect(await aiChatPage.responseHasChart(), 'Expected a rendered Mermaid line chart in the response').toBeTruthy();
    expect(await aiChatPage.responseHasHistoricalReference(), 'Expected a "Based on" historical reference section').toBeTruthy();

    // 1. Predicted date must equal the date actually requested, not just mention a date.
    const predictedDate = aiChatPage.extractPredictedDate(response);
    expect(predictedDate, 'Expected a parseable "Date:" line in the response').not.toBeNull();
    expect(predictedDate, `Expected the AI to predict for ${expectedDate} (the date requested)`).toBe(expectedDate);

    // 2. Schema-only checks: the actual kWh figures vary run to run (weather/model-dependent),
    // so only confirm the expected fields are present and well-formed - don't assert on their values.
    const consumption = aiChatPage.extractPredictedConsumption(response);
    expect(consumption, 'Expected parseable "Predicted consumption" and "Range (±10%)" lines').not.toBeNull();
    if (consumption) {
      const { value, rangeLow, rangeHigh } = consumption;
      expect(Number.isFinite(value) && value > 0, `Predicted consumption should be a positive number, got ${value}`).toBe(true);
      expect(Number.isFinite(rangeLow) && rangeLow > 0, `Range lower bound should be a positive number, got ${rangeLow}`).toBe(true);
      expect(Number.isFinite(rangeHigh) && rangeHigh > rangeLow, `Range upper bound should be a positive number greater than the lower bound, got ${rangeHigh}`).toBe(true);

      const historicalValues = aiChatPage.extractHistoricalConsumptionValues(response);
      expect(historicalValues.length, 'Expected at least one historical "Based on" consumption figure').toBeGreaterThan(0);
      expect(historicalValues.every(v => Number.isFinite(v) && v > 0), `Expected every historical consumption figure to be a positive number, got ${JSON.stringify(historicalValues)}`).toBe(true);
    }
  });
});
