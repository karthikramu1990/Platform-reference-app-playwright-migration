import { Page, Locator } from '@playwright/test';
import { step } from 'allure-js-commons';

// PA-1370/PA-1261 chat panel + PA-1269 setup status, both in the same Navigator settings dialog.
export class AIChatPage {
  private page: Page;

  // Bottom toolbar comments icon, confirmed live.
  private chatToggleIcon: Locator;

  // Chat panel - confirmed live
  private chatPanelHeading: Locator;
  private noSecretKeyMessage: Locator;
  private chatSettingsIcon: Locator;

  // AI Chat Settings dialog - confirmed live
  private settingsDialogHeading: Locator;
  private llmSecretKeyTab: Locator;
  private energyPredictionMcpTab: Locator;
  private secretKeyInput: Locator;
  private secretKeyUpdateButton: Locator;
  private settingsDialogCloseButton: Locator;

  // Energy Prediction MCP tab - confirmed live
  private setupResourcesButton: Locator;
  private refreshMcpTokensButton: Locator;
  private getLatestReadingsButton: Locator;
  private mcpSetupCompleteMessage: Locator;
  private mcpTokensRefreshedMessage: Locator;
  private mcpReadingsGeneratedMessage: Locator;

  // Gates the chat panel body until clicked, separate from the LLM secret key - confirmed live.
  private setupAIResourcesButton: Locator;

  // Team selector (MUI Autocomplete) - confirmed live.
  private teamSelect: Locator;

  // Chat conversation area - confirmed live.
  private chatInputBox: Locator;
  private chatSendButton: Locator;
  private chatMessageList: Locator;
  private chatLatestResponse: Locator;

  constructor(page: Page) {
    this.page = page;

    this.chatToggleIcon = page.locator("//i[@class='fas fa-comments']");

    this.chatPanelHeading = page.getByRole('heading', { name: 'Model element chat' });
    this.noSecretKeyMessage = page.getByText('No AI secret key found for this namespace');
    this.chatSettingsIcon = page.locator('.ai-settings i.fa-cog');

    this.settingsDialogHeading = page.getByRole('heading', { name: 'AI Chat Settings' });
    this.llmSecretKeyTab = page.getByRole('tab', { name: 'LLM secret key' });
    this.energyPredictionMcpTab = page.getByRole('tab', { name: 'Energy Prediction MCP' });
    this.secretKeyInput = page.getByPlaceholder('Paste your LLM secret key here...');
    this.secretKeyUpdateButton = page.getByRole('button', { name: 'Update' });
    this.settingsDialogCloseButton = page.locator('button.closeButton');

    this.setupResourcesButton = page.getByRole('button', { name: 'Setup Resources' });
    this.refreshMcpTokensButton = page.getByRole('button', { name: 'Refresh MCP Server Tokens' });
    this.getLatestReadingsButton = page.getByRole('button', { name: 'Get Latest Readings' });
    this.mcpSetupCompleteMessage = page.getByText('MCP resources setup completed successfully');
    this.mcpTokensRefreshedMessage = page.getByText('MCP server tokens update completed successfully');
    this.mcpReadingsGeneratedMessage = page.getByText('Tool scripts update completed successfully');

    this.setupAIResourcesButton = page.getByRole('button', { name: 'Setup AI Resources' });
    this.teamSelect = page.getByPlaceholder('Select a Team');

    this.chatInputBox = page.locator('textarea.chat-input');
    this.chatSendButton = page.locator('.chat-input-bar .chat-send-btn');
    this.chatMessageList = page.locator('.chat-display');
    this.chatLatestResponse = page.locator('.chat-message-assistant').last();
  }

  private async logStep(message: string): Promise<void> {
    console.log(message);
    await step(message, async () => {});
  }

  async openChatPanel(): Promise<void> {
    try {
      await this.chatToggleIcon.waitFor({ state: 'visible' });
      await this.chatToggleIcon.click();
      await this.chatPanelHeading.waitFor({ state: 'visible' });
      await this.logStep('INFO: Model element chat panel opened');
    } catch (e) {
      console.error('ERROR: Failed to open Model element chat panel');
    }
  }

  async verifyChatPanelVisible(): Promise<void> {
    await this.chatPanelHeading.waitFor({ state: 'visible' });
    await this.logStep('PASS: Model element chat heading is visible');
  }

  async isSecretKeyConfigured(): Promise<boolean> {
    return !(await this.noSecretKeyMessage.isVisible().catch(() => false));
  }

  async openSettings(): Promise<void> {
    try {
      await this.chatSettingsIcon.click();
      await this.settingsDialogHeading.waitFor({ state: 'visible' });
      await this.logStep('INFO: AI Chat Settings dialog opened');
    } catch (e) {
      console.error('ERROR: Failed to open AI Chat Settings dialog');
    }
  }

  async openLlmSecretKeyTab(): Promise<void> {
    await this.llmSecretKeyTab.click();
    await this.secretKeyInput.waitFor({ state: 'visible' });
  }

  async openEnergyPredictionMcpTab(): Promise<void> {
    await this.energyPredictionMcpTab.click();
    await this.setupResourcesButton.waitFor({ state: 'visible' });
  }

  // Success message only appears in-session, right after this click.
  async runSetupResources(timeout = 5 * 60 * 1000): Promise<void> {
    await this.setupResourcesButton.click();
    await this.mcpSetupCompleteMessage.waitFor({ state: 'visible', timeout });
    await this.logStep('INFO: MCP resources setup completed successfully');
  }

  async runRefreshMcpTokens(timeout = 60000): Promise<void> {
    await this.refreshMcpTokensButton.click();
    await this.mcpTokensRefreshedMessage.waitFor({ state: 'visible', timeout });
    await this.logStep('INFO: MCP server tokens refreshed successfully');
  }

  async runGetLatestReadings(timeout = 5 * 60 * 1000): Promise<void> {
    await this.getLatestReadingsButton.click();
    await this.mcpReadingsGeneratedMessage.waitFor({ state: 'visible', timeout });
    await this.logStep('INFO: Latest readings generated successfully');
  }

  // secretKey comes from process.env.REFAPP_AI_CHAT_SECRET_KEY (.env, gitignored - never a tracked file). One-time per-namespace setup - guard callers with isSecretKeyConfigured().
  async enterSecretKey(secretKey: string): Promise<void> {
    if (!secretKey) {
      throw new Error('enterSecretKey() requires a non-empty key sourced from an env var, not a literal.');
    }
    await this.secretKeyInput.fill(secretKey);
    await this.secretKeyUpdateButton.click();
    await this.logStep('INFO: LLM secret key submitted for this namespace');
  }

  async closeSettings(): Promise<void> {
    await this.settingsDialogCloseButton.click();
  }

  // An instant isVisible() check right after closeSettings() can race the panel's own
  // re-render and miss the button - confirmed live. Wait for whichever of the two shows up
  // first instead: if "Select a Team" wins, resources are already configured, no-op; if the
  // setup button wins, click it and then wait for "Select a Team" (button disappears within
  // 5s of clicking, team select appears by ~15s - confirmed live).
  //
  // After a page.reload(), the setup button can also render as a brief transient state
  // before the panel settles on "already configured" and swaps to the team selector on its
  // own - confirmed live. If it vanishes before the click lands, don't treat that as a
  // failure; just fall through to waiting for the team selector.
  async ensureChatResourcesConfigured(timeout = 60000): Promise<void> {
    const winner = await Promise.race([
      this.setupAIResourcesButton.waitFor({ state: 'visible', timeout }).then(() => 'setup' as const),
      this.teamSelect.waitFor({ state: 'visible', timeout }).then(() => 'team' as const),
    ]);

    if (winner === 'setup') {
      try {
        await this.setupAIResourcesButton.click({ timeout: 10000 });
        await this.logStep('INFO: Setup AI Resources clicked');
      } catch {
        // Vanished on its own - fall through.
      }
      await this.teamSelect.waitFor({ state: 'visible', timeout });
    }
  }

  // Opens dropdown then clicks the matching option - confirmed live.
  async selectTeam(teamName: string): Promise<void> {
    await this.teamSelect.click();
    await this.page.getByRole('option', { name: teamName }).click();
    await this.logStep(`INFO: Selected AI chat team "${teamName}"`);
  }

  async askQuestion(question: string): Promise<void> {
    await this.chatInputBox.fill(question);
    await this.chatSendButton.click();
    await this.logStep(`INFO: Asked chat: "${question}"`);
  }

  // LLM + BIM query round trip can take 20-45s+, sometimes well past 60s under load - confirmed live.
  async waitForResponse(timeout = 180000): Promise<string> {
    await this.chatLatestResponse.waitFor({ state: 'visible', timeout });
    return (await this.chatLatestResponse.textContent())?.trim() ?? '';
  }

  // Energy prediction responses render an actual mermaid xychart svg, not just text - confirmed live.
  // The text response can become visible before the Mermaid syntax finishes rendering
  // into an SVG client-side - confirmed live. Wait for it rather than checking instantly.
  async responseHasChart(timeout = 15000): Promise<boolean> {
    return this.chatLatestResponse.locator('.mermaid-container svg').first()
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);
  }

  async responseHasHistoricalReference(): Promise<boolean> {
    const text = await this.chatLatestResponse.textContent();
    return /Based on:/i.test(text ?? '');
  }

  private static readonly MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];

  // The predicted date's label and surrounding structure vary between calls - confirmed live in three
  // shapes: ISO inline prose ("Date: 2026-08-22, Day: Saturday"), a long-form bullet
  // ("Date: Saturday, August 22, 2026"), and an unlabeled-prefix form ("Predicted day: Chennai, India,
  // September 17, 2026, Thursday, Weekday"). Rather than chase label wording, scope to the text before
  // "Based on:" (which only ever contains the predicted date, never historical ones) and pull the first
  // date-shaped match there. Try ISO first since it needs no month-name lookup, then the long form.
  // Returns YYYY-MM-DD or null.
  extractPredictedDate(response: string): string | null {
    const header = response.split(/Based on:/i)[0];

    const isoMatch = header.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

    const longMatch = header.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
    if (!longMatch) return null;
    const monthIndex = AIChatPage.MONTHS.indexOf(longMatch[1].toLowerCase());
    if (monthIndex === -1) return null;
    const month = String(monthIndex + 1).padStart(2, '0');
    const day = longMatch[2].padStart(2, '0');
    return `${longMatch[3]}-${month}-${day}`;
  }

  // "Predicted consumption: X kWh" + "Range (±10%): LOW – HIGH kWh" - confirmed live (en dash between bounds).
  extractPredictedConsumption(response: string): { value: number; rangeLow: number; rangeHigh: number } | null {
    const valueMatch = response.match(/Predicted consumption:\s*([\d.]+)\s*kWh/);
    const rangeMatch = response.match(/Range \(±10%\):\s*([\d.]+)\s*[–-]\s*([\d.]+)\s*kWh/);
    if (!valueMatch || !rangeMatch) return null;
    return { value: parseFloat(valueMatch[1]), rangeLow: parseFloat(rangeMatch[1]), rangeHigh: parseFloat(rangeMatch[2]) };
  }

  // The label wording before each historical kWh figure varies between calls - confirmed live in at
  // least 4 forms ("Energy Consumption 125 kWh", "Energy Consumption: 167.9 kWh", "Energy: 147.6 kWh",
  // plus varying historical date formats). Schema-only per team direction: don't chase label wording,
  // just pull every "<number> kWh" figure out of the isolated "Based on:" section.
  extractHistoricalConsumptionValues(response: string): number[] {
    const section = response.split(/Based on:/i)[1]?.split(/Reasoning:/i)[0] ?? '';
    return [...section.matchAll(/([\d.]+)\s*kWh/gi)].map(m => parseFloat(m[1]));
  }
}
