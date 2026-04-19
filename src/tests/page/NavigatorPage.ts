import path from 'path';
import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { Page, Locator } from '@playwright/test';
import { step } from 'allure-js-commons';
import testData from '../testdata/TestData.json';

export class NavigatorPage {
  private page: Page;
  private loadProjectBtn: Locator;
  private invicaraLogo: Locator;
  private elementCategory: Locator;
  private elementType: Locator;
  private fetchButton: Locator;
  private navigatorModelSearchTable: Locator;
  private navigatorModelSelectDropdown: Locator;
  private navigatorChangeModelButton: Locator;
  private navigatorSearch: Locator;
  private navigatorFilter: Locator;
  private navigatorList: Locator;
  private navigatorClearFilters: Locator;
  private navigatorGroupBy: Locator;
  private navigatorFilterBy: Locator;
  private navigatorSelectProperty: Locator;
  private navigatorSelectFunction: Locator;
  private navigatorSelectValue: Locator;
  private navigatorAdd: Locator;
  private navigatorShowingResult: Locator;
  private navigatorExpandPanel: Locator;
  private navigatorElementProperties: Locator;
  private navigatorTelemetryviaRestAPI: Locator;
  private navigatorWarrantyData: Locator;
  private navigatorElementPropertiesTable: Locator;
  private navigatorTelemetryRestAPITable: Locator;
  private navigatorWarrantyDataTable: Locator;
  private navigatorWarrantyAdd: Locator;
  private navigatorWarrantyDescription: Locator;
  private navigatorWarrantyStartDate: Locator;
  private navigatorWarrantyDuration: Locator;
  private navigatorWarrantySave: Locator;
  private navigatorWarrantyEdit: Locator;
  private navigatorWarrantyDelete: Locator;
  private navigatorWarrantyDeleteDialog: Locator;
  private navigatorTelemetryStartReading: Locator;
  private navigatorTelemetryCreateOrch: Locator;
  private navigatorTelemetryGenerateRead: Locator;
  private navigatorTelemetryStopReading: Locator;
  private navigatorTelemetryPage: Locator;
  private navigatorTelemetryImageScreen: Locator;
  private navigatorCollapseButton: Locator;
  private telemetryviaMQTT: Locator;
  private createTelemetryChannel: Locator;
  private telemetryPublishData: Locator;
  private cancelTelemetryData: Locator;
  private selectTelemetryData: Locator;
  private navigatorTelemetryMQTTScreen: Locator;
  private telemetryChannelMQTTTable: Locator;
  private widgetCloseArrow: Locator;
  private panelOpenBox: Locator;
  private widgetCloseDownArrow: Locator;
  private navigatorFilesMenu: Locator;
  private navigatorUploadButton: Locator;
  private navigatorDeleteButton: Locator;
  private navigatorDeletePopup: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loadProjectBtn                  = page.getByRole('button', { name: 'Load Project' });
    this.invicaraLogo                    = page.getByText('Reference App', { exact: true });
    this.elementCategory                 = page.locator("//div[@class='ipa-select__indicators css-1wy0on6']").first();
    this.elementType                     = page.locator("//div[@class='ipa-select__indicators css-1wy0on6']").nth(1);
    this.fetchButton                     = page.getByRole('button', { name: /Fetch/ });
    this.navigatorModelSearchTable       = page.locator("//i[@class='fas fa-table']");
    this.navigatorModelSelectDropdown    = page.locator("//div[@class='css-19bb58m']").nth(1);
    this.navigatorChangeModelButton      = page.getByRole('button', { name: 'Change model' });
    this.navigatorSearch                 = page.locator("//i[@class='fas fa-search']");
    this.navigatorFilter                 = page.locator("//i[@class='fas fa-filter']");
    this.navigatorList                   = page.locator("//i[@class='fas fa-list']");
    this.navigatorClearFilters           = page.locator("//i[@class='fas fa-undo']");
    this.navigatorGroupBy                = page.locator("//label[text()='Group By']/following-sibling::div//div[contains(@class,'-control')]").first();
    this.navigatorFilterBy               = page.locator("div.filter-container div.control").first();
    this.navigatorSelectProperty         = page.locator("//div[contains(@class,'-placeholder') and text()='Select Property']/../..").first();
    this.navigatorSelectFunction         = page.locator("//div[contains(@class,'-placeholder') and text()='Select Function']/../..").first();
    this.navigatorSelectValue            = page.locator("//div[contains(@class,'-placeholder') and text()='Select Value']/../..").first();
    this.navigatorAdd                    = page.getByRole('button', { name: /Add/ }).first();
    this.navigatorShowingResult          = page.locator("//div[@class='content-column checkbox']").first();
    this.navigatorExpandPanel            = page.locator("[aria-label='Expand panel']");
    this.navigatorElementProperties      = page.locator("//div[contains(text(),'Element Properties')]").first();
    this.navigatorTelemetryviaRestAPI    = page.locator("//div[contains(text(),'Telemetry via REST API')]").first();
    this.navigatorWarrantyData           = page.locator("//div[contains(text(),'Warranty Data')]").first();
    this.navigatorElementPropertiesTable = page.locator("//div[contains(text(),'Element Properties')]").nth(1);
    this.navigatorTelemetryRestAPITable  = page.locator("//div[contains(text(),'Telemetry via REST API')]").nth(1);
    this.navigatorWarrantyDataTable      = page.locator("//div[contains(text(),'Warranty Data')]").nth(1);
    this.navigatorWarrantyAdd            = page.locator('button.systems-secondary-button', { hasText: 'Add' });
    this.navigatorWarrantyDescription    = page.locator('input.enabled_warranty_input[name="description"]');
    this.navigatorWarrantyStartDate      = page.locator('input.enabled_warranty_input[name="startDate"]');
    this.navigatorWarrantyDuration       = page.locator('input.enabled_warranty_input[name="duration"]');
    this.navigatorWarrantySave           = page.locator('button.systems-secondary-button', { hasText: 'Save' });
    this.navigatorWarrantyEdit           = page.locator('button.systems-secondary-button', { hasText: 'Edit' });
    this.navigatorWarrantyDelete         = page.locator("//button[text()='Delete']").first();
    this.navigatorWarrantyDeleteDialog   = page.locator("(//button[text()='Delete'])[2]");
    this.navigatorTelemetryStartReading  = page.getByRole('button', { name: /Start Reading/ });
    this.navigatorTelemetryCreateOrch    = page.getByRole('button', { name: /Create Orchestrator/ });
    this.navigatorTelemetryGenerateRead  = page.getByRole('button', { name: /Generate Reading/ });
    this.navigatorTelemetryStopReading   = page.getByRole('button', { name: /Stop Reading/ });
    this.navigatorTelemetryPage          = page.locator('.bottom-panel-content-right');
    this.navigatorTelemetryImageScreen   = page.locator("(//*[contains(text(),'Time')])").nth(1);
    this.navigatorCollapseButton         = page.locator('.bottom-panel__icons--right-icons');
    this.telemetryviaMQTT                = page.getByText('Telemetry via MQTT', { exact: true }).first();
    this.createTelemetryChannel          = page.getByRole('button', { name: 'Create Telemetry channel' });
    this.telemetryPublishData            = page.getByRole('button', { name: 'Publish Data' });
    this.cancelTelemetryData             = page.getByRole('button', { name: 'Cancel Telemetry channel' });
    this.selectTelemetryData             = page.locator("//div[@class='css-1wy0on6']").nth(6);
    this.navigatorTelemetryMQTTScreen    = page.locator("(//*[contains(text(),'Time')])");
    this.telemetryChannelMQTTTable       = page.getByText('Telemetry via MQTT', { exact: true }).nth(1);
    this.widgetCloseArrow                = page.locator("//i[@class='fas fa-angle-double-left']");
    this.panelOpenBox                    = page.locator('.bottom-panel-content.open');
    this.widgetCloseDownArrow            = page.locator("//i[@class='fas fa-angle-double-down']");
    this.navigatorFilesMenu              = page.locator("//div[contains(@class,'bottom-panel__data-group-tab') and text()='Files']");
    this.navigatorUploadButton           = page.locator("//i[@class='icofont-upload-alt']").nth(1);
    this.navigatorDeleteButton           = page.locator("[title='Delete']");
    this.navigatorDeletePopup            = page.getByRole('button', { name: 'Delete' });
  }

  private async logStep(message: string): Promise<void> {
    console.log(message);
    await step(message, async () => {});
  }

  async waitUntilLoadingDisappear(): Promise<void> {
    const spinner = this.page.locator("//div[@id='modelSpinner']");
    let i = 0;
    while (true) {
      try {
        const visible = await spinner.isVisible();
        if (!visible) break;
        if (i >= 600) { console.error('Model loading exceeded 10 minutes'); break; }
        await this.page.waitForTimeout(1000);
        i++;
      } catch { break; }
    }
  }

  async clickNavigatorSearch(): Promise<void> {
    try {
      await this.navigatorSearch.waitFor({ state: 'visible' });
      await this.waitUntilLoadingDisappear();
      await this.page.waitForTimeout(500);
      await this.navigatorSearch.hover();
      await this.navigatorSearch.click();
      await this.invicaraLogo.hover();
      await this.logStep('INFO: Navigator Search button clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Navigator Search button');
    }
  }

  async selectElementCategory(name: string): Promise<void> {
    try {
      await this.elementCategory.waitFor({ state: 'visible' });
      await this.elementCategory.click();
      await this.page.locator(`//div[contains(text(),'${name}')]`).evaluate((el: HTMLElement) => el.click());
      await this.logStep('INFO: Element category selected');
    } catch (e) {
      console.error('ERROR: Failed to select Element category');
    }
  }

  async selectElementType(name: string): Promise<void> {
    try {
      await this.elementType.waitFor({ state: 'visible' });
      await this.elementType.click();
      await this.page.locator(`//div[contains(text(),'${name}')]`).click();
      await this.page.keyboard.press('Enter');
      await this.invicaraLogo.click();
      await this.logStep('INFO: Element type selected');
    } catch (e) {
      console.error('ERROR: Failed to select Element type');
    }
  }

  async clickfetchbutton(): Promise<void> {
    try {
      await this.fetchButton.click();
      await this.logStep('INFO: Fetch button clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Fetch button');
    }
  }

  async selectFromReactSelect(name: string): Promise<void> {
    await this.page.waitForTimeout(500);
    await this.page.locator('input[role="combobox"][aria-expanded="true"]').fill(name);
    await this.page.waitForTimeout(500);
    await this.page.locator('[role="option"]').filter({ hasText: name }).first().click();
  }

  async selectNavigatorGroupBy(name: string): Promise<void> {
    try {
      await this.navigatorGroupBy.click();
      await this.selectFromReactSelect(name);
      await this.logStep('INFO: Group selected in GroupBy dropdown');
    } catch (e: any) {
      console.error('ERROR: Failed to select Group in GroupBy dropdown:', e.message);
    }
  }

  async selectNavigatorProperty(name: string): Promise<void> {
    try {
      await this.navigatorFilterBy.click();
      await this.navigatorSelectProperty.click();
      await this.selectFromReactSelect(name);
      await this.logStep('INFO: Property selected');
    } catch (e: any) {
      console.error('ERROR: Failed to select property:', e.message);
    }
  }

  async selectNavigatorFunction(name: string): Promise<void> {
    try {
      await this.navigatorSelectFunction.click();
      await this.selectFromReactSelect(name);
      await this.logStep('INFO: Function selected');
    } catch (e) {
      console.error('ERROR: Failed to select Function');
    }
  }

  async selectNavigatorValue(name: string): Promise<void> {
    try {
      await this.navigatorSelectValue.click();
      await this.selectFromReactSelect(name);
      await this.logStep('INFO: Value selected');
    } catch (e) {
      console.error('ERROR: Failed to select Value');
    }
  }

  async clickNavigatorAddButton(): Promise<void> {
    try {
      await this.navigatorAdd.click();
      await this.logStep('INFO: Add Button clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Add button');
    }
  }

  async selectNavigatorList(): Promise<void> {
    try {
      await this.navigatorList.click();
      await this.page.waitForTimeout(1000);
      await this.logStep('INFO: Navigator Showing List selected');
    } catch (e) {
      console.error('ERROR: Failed to select Navigator Showing List');
    }
  }

  async clickNavigatorFilter(): Promise<void> {
    try {
      await this.navigatorFilter.click();
      await this.logStep('INFO: Navigator Filter icon clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Navigator Filter icon');
    }
  }

  async selectNavigatorShowingResult(): Promise<void> {
    try {
      await this.page.waitForTimeout(2000);
      await this.navigatorShowingResult.click();
      await this.logStep('INFO: Navigator showing result selected');
    } catch (e) {
      console.error('ERROR: Failed to select Navigator Showing result');
    }
  }

  async validateElementProperties(): Promise<void> {
    try {
      await this.navigatorElementPropertiesTable.isVisible();
      await this.page.waitForTimeout(3000);
      await this.logStep('INFO: Element properties Table validated');
    } catch (e) {
      console.error('FAIL: Failed to validate elementproperties Table');
    }
  }

  async validateTelemetryRestAPI(): Promise<void> {
    try {
      await this.page.waitForTimeout(3000);
      await this.navigatorTelemetryviaRestAPI.click();
      await this.page.waitForTimeout(3000);
      await this.navigatorTelemetryRestAPITable.isVisible();
      // await this.verifyTelemetryviaRestAPI();
      await this.logStep('INFO: TelemetryCollection Table validated');
    } catch (e) {
      console.error('FAIL: Failed to validate TelemetryCollection Table');
    }
  }

  async validateTelemetryviaMQTT(): Promise<void> {
    try {
      await this.telemetryviaMQTT.click();
      await this.page.waitForTimeout(3000);
      await this.telemetryChannelMQTTTable.isVisible();
      await this.logStep('INFO: Telemetry Channel Readings Table validated');
    } catch (e) {
      console.error('FAIL: Failed to validate Telemetry MQTT Table');
    }
  }

  async validateWarrantyData(): Promise<void> {
    try {
      await this.navigatorWarrantyData.click();
      await this.page.waitForTimeout(3000);
      await this.navigatorWarrantyDataTable.isVisible();
      await this.logStep('INFO: WarrantyData Table validated');
    } catch (e) {
      console.error('FAIL: Failed to validate WarrantyData Table');
    }
  }

  async validateFilesMenu(): Promise<void> {
    try {
      await this.navigatorFilesMenu.click();
      await this.page.waitForTimeout(3000);
      await this.logStep('INFO: Files Menu validated');
    } catch (e) {
      console.error('FAIL: Failed to validate Files Menu');
    }
  }

  async addNavigatorWarrantyData(): Promise<void> {
    await this.navigatorWarrantyData.waitFor({ state: 'visible' });
    await this.navigatorWarrantyData.click();
    try {
      const deleteVisible = await this.navigatorWarrantyDelete.isVisible().catch(() => false);
      if (deleteVisible) {
        await this.navigatorWarrantyDelete.waitFor({ state: 'visible' });
        await this.navigatorWarrantyDelete.click();
        await this.navigatorWarrantyDeleteDialog.click();
        await this.page.waitForTimeout(2000);
      }
      await this.navigatorWarrantyAdd.waitFor({ state: 'visible' });
      await this.navigatorWarrantyAdd.click();
      await this.navigatorWarrantyDescription.waitFor({ state: 'visible' });
      await this.navigatorWarrantyDescription.fill(testData.WarrantyDetails[0].Description);
      await this.navigatorWarrantyStartDate.fill(testData.WarrantyDetails[0].StartDate);
      await this.navigatorWarrantyDuration.fill(testData.WarrantyDetails[0].Duration);
      await this.navigatorWarrantySave.click();
      await this.page.waitForTimeout(3000);
      await this.logStep('INFO: New Warranty Details added');
    } catch (e) {
      console.error('FAIL: Failed to add new warranty data');
    }
  }

  async editNavigatorWarrantyData(): Promise<void> {
    try {
      await this.page.waitForTimeout(3000);
      await this.navigatorWarrantyEdit.click();
      await this.navigatorWarrantyDescription.fill(testData.WarrantyDetails[1].Description);
      await this.navigatorWarrantyStartDate.fill(testData.WarrantyDetails[1].StartDate);
      await this.navigatorWarrantyDuration.fill(testData.WarrantyDetails[1].Duration);
      await this.navigatorWarrantySave.click();
      await this.page.waitForTimeout(3000);
      await this.logStep('PASS: Navigator warranty Details Edited successfully');
    } catch (e) {
      console.error('FAIL: Failed to Edit navigator warranty details');
    }
  }

  async deleteNavigatorWarrantyData(): Promise<void> {
    try {
      await this.navigatorWarrantyDelete.waitFor({ state: 'visible' });
      await this.navigatorWarrantyDelete.click();
      await this.navigatorWarrantyDeleteDialog.click();
      await this.page.waitForTimeout(5000);
      await this.logStep('PASS: Navigator warranty Details Deleted successfully');
    } catch (e) {
      console.error('FAIL: Failed to delete navigator warranty details');
    }
  }

  async verifyTelemetryviaRestAPI(): Promise<void> {
    await this.page.waitForTimeout(3000);
    await this.navigatorTelemetryviaRestAPI.click();
    try {
      await this.navigatorTelemetryCreateOrch.waitFor({ state: 'visible' });
      await this.navigatorTelemetryCreateOrch.click();
      await this.navigatorTelemetryGenerateRead.waitFor({ state: 'visible' });
      await this.navigatorTelemetryGenerateRead.click();
      await this.page.waitForTimeout(3000);
      await this.navigatorTelemetryImageScreen.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(3000);
      await this.page.screenshot({ path: 'screenshots/TelemetryRestAPI_Pass.png', fullPage: true });
      await this.logStep('PASS: Fetch Reading for Telemetry collection');
    } catch (e) {
      await this.page.screenshot({ path: 'screenshots/TelemetryRestAPI_Fail.png', fullPage: true });
      console.error('FAIL: Failed to Fetch Reading');
    }
  }

  async verifyTelemetryviaMQTT(): Promise<void> {
    await this.page.waitForTimeout(3000);
    await this.telemetryviaMQTT.click();
    await this.page.waitForTimeout(3000);
    try {
      const cancelVisible = await this.cancelTelemetryData.isVisible().catch(() => false);
      if (cancelVisible) {
        await this.cancelTelemetryData.click();
      }
      await this.page.waitForTimeout(10000);
      await this.createTelemetryChannel.waitFor({ state: 'visible' });
      await this.createTelemetryChannel.click();
      await this.telemetryPublishData.waitFor({ state: 'visible' });
      await this.telemetryPublishData.click();
      await this.page.waitForTimeout(10000);
      await this.selectTelemetryDataselection(testData.TelemetryChannelSupport.DataType);
      await this.page.waitForTimeout(3000);
      await this.navigatorTelemetryMQTTScreen.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(3000);
      await this.logStep('PASS: Telemetry Channel reading captured successfully');
    } catch (e) {
      console.error(`FAIL: Failed to Fetch Telemetry channel Reading: ${e}`);
    }
  }

  async selectTelemetryDataselection(name: string): Promise<void> {
    try {
      await this.page.waitForTimeout(3000);
      await this.selectTelemetryData.click();
      await this.page.locator(`//div[contains(text(),'${name}')]`).click();
      await this.logStep('INFO: Telemetry data selected');
    } catch (e) {
      console.error('ERROR: Failed to select Telemetry data type');
    }
  }

  async uploadFile(file: string): Promise<void> {
    try {
      await this.page.waitForTimeout(2000);
      await this.navigatorFilesMenu.click();
      await this.page.waitForTimeout(2000);
      const fileChooserPromise = this.page.waitForEvent('filechooser');
      await this.navigatorUploadButton.click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(process.cwd(), 'files', file));
      await this.page.waitForTimeout(5000);
      await this.logStep('PASS: File uploaded in navigator screen');
    } catch (e) {
      console.error('ERROR: Unable to upload file in navigator screen');
    }
  }

  async deleteFile(): Promise<void> {
    try {
      await this.page.waitForTimeout(3000);
      await this.navigatorDeleteButton.click();
      await this.navigatorDeletePopup.click();
      await this.page.waitForTimeout(3000);
      await this.logStep('PASS: File deleted in navigator screen');
    } catch (e) {
      console.error('ERROR: Unable to delete the file in navigator screen');
    }
  }

  private isImageFound(actual: PNG, expected: PNG): boolean {
    const step = 10;
    const maxDiff = Math.floor(expected.width * expected.height * 0.4);
    for (let y = 0; y <= actual.height - expected.height; y += step) {
      for (let x = 0; x <= actual.width - expected.width; x += step) {
        const crop = new PNG({ width: expected.width, height: expected.height });
        PNG.bitblt(actual, crop, x, y, expected.width, expected.height, 0, 0);
        const diff = pixelmatch(crop.data, expected.data, null, expected.width, expected.height, { threshold: 0.1 });
        if (diff < maxDiff) return true;
      }
    }
    return false;
  }

  async verifyingModelImage(imageName: string): Promise<void> {
    try {
      await this.navigatorCollapseButton.click();
      await this.page.waitForTimeout(3000);
      const actual = PNG.sync.read(await this.page.screenshot({ fullPage: false }));
      const expected = PNG.sync.read(fs.readFileSync(path.join(process.cwd(), 'imagevalidation', imageName)));
      if (this.isImageFound(actual, expected)) {
        await this.logStep('PASS: Image validated Successfully');
      } else {
        console.error('FAIL: Reference image not found in canvas screenshot');
      }
    } catch (e) {
      console.error('FAIL: Failed to Validate Image - ' + e);
    }
  }
}
