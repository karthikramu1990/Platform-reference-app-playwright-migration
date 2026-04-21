import path from 'path';
import { Page, Locator } from '@playwright/test';
import { step } from 'allure-js-commons';

export class ManageModelPage {
  private page: Page;
  private relatedGraphDropdown: Locator;
  private viewApiConfigDropdown: Locator;
  private expandAllRelatedGraph: Locator;
  private expandAllViewAPI: Locator;
  private upload: Locator;
  private importBtn: Locator;
  private importModel: Locator;
  private uploadTypeMapBtn: Locator;
  private uploadTypeMap: Locator;
  private deleteExistingModel: Locator;
  private checkbox: Locator;
  private importCompleteMsg: Locator;
  private elementUsedForScroll: Locator;
  private elementUsedForScrollAPI: Locator;
  private mapBoxUserName: Locator;
  private mapBoxScopes: Locator;
  private mapBoxExpiry: Locator;
  private mapBoxSecretToken: Locator;
  private mapBoxAddTempTokenConfig: Locator;
  private mapBoxSuccessMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.relatedGraphDropdown     = page.locator("//div[@class='select__input-container css-19bb58m']").nth(1);
    this.viewApiConfigDropdown    = page.locator("//div[@class='select__input-container css-19bb58m']").nth(2);
    this.expandAllRelatedGraph    = page.locator("(//*[@class='css-8mmkcg'])").nth(1);
    this.expandAllViewAPI         = page.locator("(//*[@class='css-8mmkcg'])").nth(2);
    this.upload                   = page.getByRole('button', { name: 'Upload' });
    this.importBtn                = page.locator("//button[text()='Import']/parent::button[contains(@style,'margin-right: 15px; color: white; background-color: var(--app-accent-color);')]");
    this.importModel              = page.getByRole('button', { name: 'Import' });
    this.uploadTypeMapBtn         = page.getByRole('button', { name: 'Upload type map' });
    this.uploadTypeMap            = page.locator("//button[text()='Upload type map']/parent::button[contains(@style,'margin-right: 15px; color: white; background-color: var(--app-accent-color);')]");
    this.deleteExistingModel      = page.getByRole('button', { name: 'Delete' }).nth(1);
    this.checkbox                 = page.locator('[type="checkbox"]');
    this.importCompleteMsg        = page.getByRole('heading', { name: 'Import Complete' });
    this.elementUsedForScroll     = page.getByText('_referencedItems', { exact: true });
    this.elementUsedForScrollAPI  = page.getByText('schema_version', { exact: true });
    this.mapBoxUserName           = page.locator('#\\:rg\\:');
    this.mapBoxScopes             = page.locator('#\\:rh\\:');
    this.mapBoxExpiry             = page.locator('#\\:ri\\:');
    this.mapBoxSecretToken        = page.locator('#\\:rj\\:');
    this.mapBoxAddTempTokenConfig = page.getByRole('button', { name: 'Add temp token config' });
    this.mapBoxSuccessMsg         = page.locator("//p[contains(text(),'Mapbox temp token config uploaded')]");
  }

  private async logStep(message: string): Promise<void> {
    console.log(message);
    await step(message, async () => {});
  }

  async selectRelatedGraph(): Promise<void> {
    try {
      await this.relatedGraphDropdown.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(2000);
      await this.relatedGraphDropdown.waitFor({ state: 'visible' });
      await this.relatedGraphDropdown.click();
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
      await this.elementUsedForScroll.scrollIntoViewIfNeeded();
      await this.logStep('PASS: Related Graph selected successfully');
    } catch (e) {
      console.error('FAIL: Failed to click Related Graph');
    }
  }

  async clickExpandAllRelatedGraph(): Promise<void> {
    try {
      await this.page.waitForTimeout(2000);
      await this.expandAllRelatedGraph.click();
      await this.logStep('PASS: Expand all clicked successfully');
    } catch (e) {
      console.error('FAIL: Failed to click Expand all');
    }
  }

  async selectViewAPI(name: string): Promise<void> {
    try {
      await this.viewApiConfigDropdown.waitFor({ state: 'visible' });
      await this.viewApiConfigDropdown.click();
      await this.page.keyboard.press('Enter');
      await this.elementUsedForScrollAPI.scrollIntoViewIfNeeded();
      await this.logStep('PASS: View Config API selected successfully');
    } catch (e) {
      console.error('FAIL: Failed to click View Config API');
    }
  }

  async clickExpandAllViewAPI(): Promise<void> {
    try {
      await this.page.waitForTimeout(2000);
      await this.expandAllViewAPI.click();
      await this.logStep('PASS: Expand all clicked successfully');
    } catch (e) {
      console.error('FAIL: Failed to click Expand all');
    }
  }

  async uploadModel(filename: string): Promise<void> {
    try {
      await this.upload.scrollIntoViewIfNeeded();
      const fileChooserPromise = this.page.waitForEvent('filechooser');
      await this.upload.click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(process.cwd(), 'files', filename));
      await this.page.waitForTimeout(3000);
      const deleteVisible = await this.deleteExistingModel.isVisible().catch(() => false);
      if (deleteVisible) {
        await this.deleteExistingModel.click();
      }
      await this.page.waitForTimeout(10000);
      await this.importBtn.waitFor({ state: 'visible', timeout: 3600000 });
      await this.logStep(`PASS: Uploaded ${filename} successfully`);
    } catch (e) {
      console.error('FAIL: Failed to Upload the model');
    }
  }

  async selectModelVersion(): Promise<void> {
    try {
      await this.page.waitForTimeout(5000);
      await this.checkbox.waitFor({ state: 'visible' });
      await this.page.waitForTimeout(2000);
      await this.checkbox.click();
      await this.logStep('PASS: Checkbox clicked successfully');
    } catch (e) {
      console.error('FAIL: Failed to click Checkbox');
    }
  }

  async importModelAction(): Promise<void> {
    try {
      await this.importBtn.waitFor({ state: 'visible' });
      await this.importBtn.click();
      await this.page.waitForTimeout(4000);
      await this.uploadTypeMap.waitFor({ state: 'visible', timeout: 3600000 });
      await this.page.waitForTimeout(2000);
      const msgVisible = await this.importCompleteMsg.isVisible();
      if (!msgVisible) throw new Error('Import complete message not visible');
      await this.logStep('PASS: Model imported successfully');
    } catch (e) {
      console.error('FAIL: Failed to import model');
    }
  }

  async uploadTypemap(typemap: string): Promise<void> {
    try {
      await this.uploadTypeMap.waitFor({ state: 'visible' });
      const fileChooserPromise = this.page.waitForEvent('filechooser');
      await this.uploadTypeMap.click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(process.cwd(), 'files', typemap));
      await this.uploadTypeMap.waitFor({ state: 'visible', timeout: 3600000 });
      await this.logStep(`PASS: Uploaded ${typemap} successfully`);
    } catch (e) {
      console.error('FAIL: Failed to upload typemap');
    }
  }

  async enterMapBoxUserName(userName: string): Promise<void> {
    try {
      await this.mapBoxUserName.waitFor({ state: 'visible' });
      await this.mapBoxUserName.click();
      await this.mapBoxUserName.fill(userName);
      await this.logStep('PASS: Mapbox username entered successfully');
    } catch (e) {
      console.error('FAIL: Failed to enter mapbox username');
    }
  }

  async enterMapBoxScopes(scopes: string): Promise<void> {
    try {
      await this.mapBoxScopes.waitFor({ state: 'visible' });
      await this.mapBoxScopes.click();
      await this.mapBoxScopes.fill(scopes);
      await this.logStep('PASS: Mapbox scopes entered successfully');
    } catch (e) {
      console.error('FAIL: Failed to enter mapbox scopes');
    }
  }

  async enterMapBoxExpiry(expiry: string): Promise<void> {
    try {
      await this.mapBoxExpiry.waitFor({ state: 'visible' });
      await this.mapBoxExpiry.click();
      await this.mapBoxExpiry.fill(expiry);
      await this.logStep('PASS: Mapbox expiry entered successfully');
    } catch (e) {
      console.error('FAIL: Failed to enter mapbox expiry');
    }
  }

  async enterMapBoxSecretToken(secretToken: string): Promise<void> {
    try {
      await this.mapBoxSecretToken.waitFor({ state: 'visible' });
      await this.mapBoxSecretToken.click();
      await this.mapBoxSecretToken.fill(secretToken);
      await this.logStep('PASS: Mapbox secret token entered successfully');
    } catch (e) {
      console.error('FAIL: Failed to enter mapbox secret token');
    }
  }

  async clickAddTempTokenConfig(): Promise<void> {
    try {
      await this.page.waitForTimeout(2000);
      await this.mapBoxAddTempTokenConfig.click();
      await this.logStep('PASS: Add temp token config clicked successfully');
    } catch (e) {
      console.error('FAIL: Failed to click Add temp token config');
    }
  }

  async verify_MapboxActivation(): Promise<boolean> {
    let flag = false;
    try {
      await this.mapBoxSuccessMsg.waitFor({ state: 'visible', timeout: 15000 });
      flag = true;
      await this.logStep('PASS: Mapbox temp token config uploaded message displayed');
    } catch (e: any) {
      console.error(`FAIL: Mapbox activation message not displayed: ${e.message}`);
    }
    return flag;
  }
}
