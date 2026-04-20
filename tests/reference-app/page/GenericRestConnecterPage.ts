import { Page, Locator } from '@playwright/test';
import { step } from 'allure-js-commons';

export class GenericRestConnecterPage {
  private page: Page;
  private genericConnectorButton: Locator;
  private selectDropDown: Locator;
  private expandAllGeneric: Locator;

  constructor(page: Page) {
    this.page = page;
    this.genericConnectorButton = page.getByRole('button', { name: 'Generic Rest Connectors' });
    this.selectDropDown         = page.locator("//div[@class='css-5l2uyf-control']");
    this.expandAllGeneric       = page.locator("(//*[@class='css-8mmkcg'])").first();
  }

  private async logStep(message: string): Promise<void> {
    await this.logStep(message);
    await step(message, async () => {});
  }

  async clickGenericConnectorButton(): Promise<void> {
    try {
      await this.genericConnectorButton.click();
      await this.logStep('PASS: genericConnectorButton clicked successfully');
    } catch (e) {
      console.error('FAIL: Failed to click genericConnectorButton');
    }
  }

  async selectGenericRestConnector(name: string): Promise<void> {
    try {
      await this.selectDropDown.waitFor({ state: 'visible', timeout: 10000 });
      await this.selectDropDown.click();
      const option = this.page.getByRole('option', { name, exact: true });
      await option.waitFor({ state: 'visible', timeout: 10000 });
      await option.click();
      await this.logStep('PASS: genericConnector selected successfully');
    } catch (e: any) {
      console.error(`FAIL: Failed to select genericConnector: ${e.message}`);
    }
  }

  async clickExpandAllGeneric(): Promise<void> {
    try {
      await this.expandAllGeneric.click();
      await this.logStep('PASS: Expand all clicked successfully');
    } catch (e) {
      console.error('FAIL: Failed to click Expand all');
    }
  }
}
