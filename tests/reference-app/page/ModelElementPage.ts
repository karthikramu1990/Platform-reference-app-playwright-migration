import path from 'path';
import { Page, Locator } from '@playwright/test';
import { step } from 'allure-js-commons';
import testData from '../testdata/TestData.json';

export class ModelElementPage {
  private page: Page;
  private invicaraLogo: Locator;
  private elementCategory: Locator;
  private elementType: Locator;
  private fetchButton: Locator;
  private showingModel: Locator;
  private elementProperties: Locator;
  private files: Locator;
  private warrantyData: Locator;
  private telemetryRestAPI: Locator;
  private elementPropertiesTable: Locator;
  private filesTable: Locator;
  private warrantyDataTable: Locator;
  private telemetryRestAPITable: Locator;
  private fileUploadButton: Locator;
  private fileDeleteButton: Locator;
  private dialogDelete: Locator;
  private warrantyAdd: Locator;
  private warrantyDescription: Locator;
  private warrantyStartDate: Locator;
  private warrantyDuration: Locator;
  private warrantySave: Locator;
  private warrantyEdit: Locator;
  private warrantyDelete: Locator;
  private warrantyDeleteDialog: Locator;
  private modelElementExpandButton: Locator;
  private telemetryCreateOrchestrator: Locator;
  private telemetryGenerateReadings: Locator;
  private telemetryMQTT: Locator;
  private createTelemetryMQTT: Locator;
  private telemetryPublishData: Locator;
  private cancelTelemetryData: Locator;
  private selectTelemetryData: Locator;
  private telemetryMQTTTable: Locator;
  private drawerToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.invicaraLogo                = page.getByText('Reference App', { exact: true });
    this.elementCategory             = page.locator("//div[@class='ipa-select__indicators css-1wy0on6']").first();
    this.elementType                 = page.locator("//div[@class='ipa-select__indicators css-1wy0on6']").nth(1);
    this.fetchButton                 = page.getByRole('button', { name: /Fetch/ });
    this.showingModel                = page.locator("//div[contains(@class,'content-row')]").first();
    this.elementProperties           = page.locator("//label[contains(text(),'Element Properties')]/..//input[@type='checkbox']");
    this.files                       = page.locator("//label[contains(text(),'Files')]/..//input[@type='checkbox']");
    this.warrantyData                = page.locator("//label[contains(text(),'Warranty Data')]/..//input[@type='checkbox']");
    this.telemetryRestAPI            = page.locator("//label[contains(text(),'Telemetry via REST API')]/..//input[@type='checkbox']");
    this.elementPropertiesTable      = page.locator("//h1[contains(text(),'Element Properties')]");
    this.filesTable                  = page.locator("//h1[contains(text(),'Files')]");
    this.warrantyDataTable           = page.locator("//h1[contains(text(),'Warranty Data')]");
    this.telemetryRestAPITable       = page.locator("//h1[contains(text(),'Telemetry via REST API')]");
    this.fileUploadButton            = page.locator("//i[@class='icofont-upload-alt']");
    this.fileDeleteButton            = page.locator("[title='Delete']");
    this.dialogDelete                = page.getByRole('button', { name: /Delete/ });
    this.warrantyAdd                 = page.locator('button.systems-secondary-button', { hasText: 'Add' });
    this.warrantyDescription         = page.locator('input.enabled_warranty_input[name="description"]');
    this.warrantyStartDate           = page.locator('input.enabled_warranty_input[name="startDate"]');
    this.warrantyDuration            = page.locator('input.enabled_warranty_input[name="duration"]');
    this.warrantySave                = page.locator('button.systems-secondary-button', { hasText: 'Save' });
    this.warrantyEdit                = page.locator('button.systems-secondary-button', { hasText: 'Edit' });
    this.warrantyDelete              = page.locator("//button[text()='Delete']").first();
    this.warrantyDeleteDialog        = page.locator("(//button[text()='Delete'])[2]");
    this.modelElementExpandButton    = page.locator("//i[@class='fas fa-sitemap']");
    this.telemetryCreateOrchestrator = page.getByRole('button', { name: /Create Orchestrator/ });
    this.telemetryGenerateReadings   = page.getByRole('button', { name: /Generate Reading/ });
    this.telemetryMQTT               = page.locator("//label[text()='Telemetry via MQTT']/..//input[@type='checkbox']");
    this.createTelemetryMQTT         = page.getByRole('button', { name: 'Create Telemetry channel' });
    this.telemetryPublishData        = page.getByRole('button', { name: 'Publish Data' });
    this.cancelTelemetryData         = page.getByRole('button', { name: 'Cancel Telemetry channel' });
    this.selectTelemetryData         = page.locator("//div[@class='css-19bb58m']").nth(4);
    this.telemetryMQTTTable          = page.locator("//h1[contains(text(),'Telemetry via MQTT')]");
    this.drawerToggle                = page.locator("//div[contains(@class,'drawer-toggle')]");
  }

  private async logStep(message: string): Promise<void> {
    await this.logStep(message);
    await step(message, async () => {});
  }

  async selectElementCategory(name: string): Promise<void> {
    try {
      await this.page.waitForTimeout(12000);
      await this.elementCategory.click();
      await this.page.locator(`//div[contains(text(),'${name}')]`).evaluate((el: HTMLElement) => el.click());
      await this.logStep('INFO: Element category selected');
    } catch (e) {
      console.error('ERROR: Unable to select Element category');
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
      console.error('ERROR: Unable to select Element type');
    }
  }

  async clickFetchButton(): Promise<void> {
    try {
      await this.fetchButton.click();
      await this.logStep('INFO: Fetch button clicked');
    } catch (e) {
      console.error('ERROR: Unable to click Fetch button');
    }
  }

  async selectShowingModel(): Promise<void> {
    try {
      await this.page.waitForTimeout(2000);
      await this.showingModel.waitFor({ state: 'visible' });
      await this.showingModel.click();
      await this.logStep('INFO: Showing element selected');
    } catch (e) {
      console.error('ERROR: Unable to select showing element');
    }
  }

  async validateElementProperties(): Promise<void> {
    try {
      const propSelected = await this.elementProperties.isChecked();
      const filesSelected = await this.files.isChecked();
      if (propSelected && filesSelected) {
        await this.files.click();
        await this.elementPropertiesTable.waitFor({ state: 'visible' });
        await this.logStep('INFO: Element properties Table validated');
      }
    } catch (e) {
      console.error('ERROR: Unable to validate element properties Table');
    }
  }

  async validateFiles(): Promise<void> {
    try {
      const propSelected = await this.elementProperties.isChecked();
      if (propSelected) {
        await this.elementProperties.click();
        await this.files.click();
        await this.filesTable.waitFor({ state: 'visible' });
        await this.logStep('PASS: Files Table validated');
      }
    } catch (e) {
      console.error('ERROR: Unable to validate Files Table');
    }
  }

  async validateWarrantyData(): Promise<void> {
    try {
      await this.page.waitForTimeout(5000);
      const filesSelected = await this.files.isChecked();
      if (filesSelected) {
        await this.files.click();
        await this.warrantyData.click();
        await this.warrantyDataTable.waitFor({ state: 'visible' });
        await this.logStep('PASS: Warranty data table validated');
      }
    } catch (e) {
      console.error('ERROR: Unable to validate Warranty data table');
    }
  }

  async validateTelemetryRestAPI(): Promise<void> {
    try {
      const warrantySelected = await this.warrantyData.isChecked();
      if (warrantySelected) {
        await this.warrantyData.click();
        await this.telemetryRestAPI.click();
        await this.telemetryRestAPITable.waitFor({ state: 'visible' });
        await this.logStep('PASS: Telemetry collection table validated');
      }
    } catch (e) {
      console.error('ERROR: Unable to validate telemetry collection table');
    }
  }

  async validateTelemetryMQTT(): Promise<void> {
    try {
      const warrantySelected = await this.warrantyData.isChecked();
      if (warrantySelected) {
        await this.warrantyData.click();
        await this.telemetryMQTT.click();
        await this.telemetryMQTTTable.waitFor({ state: 'visible' });
        await this.logStep('PASS: Telemetry channels table validated');
      }
    } catch (e) {
      console.error('ERROR: Unable to validate telemetry channels table');
    }
  }

  async uploadFile(file: string): Promise<void> {
    try {
      await this.elementProperties.click();
      const fileChooserPromise = this.page.waitForEvent('filechooser');
      await this.fileUploadButton.click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(process.cwd(), 'files', file));
      await this.page.waitForTimeout(5000);
      await this.logStep('PASS: File uploaded');
    } catch (e) {
      console.error('ERROR: Unable to upload file');
    }
  }

  async deleteFile(): Promise<void> {
    try {
      await this.page.waitForTimeout(3000);
      await this.fileDeleteButton.evaluate((el: HTMLElement) => el.click());
      await this.dialogDelete.evaluate((el: HTMLElement) => el.click());
      await this.page.waitForTimeout(3000);
      await this.logStep('PASS: File deleted successfully');
    } catch (e) {
      console.error('ERROR: Unable to delete file');
    }
  }

  async addWarrantyData(): Promise<void> {
    try {
      
      await this.page.waitForTimeout(3000);
      await this.elementProperties.waitFor({ state: 'visible' });
      await this.elementProperties.click();
      //await this.drawerToggle.click();
      await this.files.click();
      await this.warrantyData.click();
      await this.warrantyAdd.waitFor({ state: 'visible' });
      await this.warrantyAdd.click();
      await this.warrantyDescription.fill(testData.WarrantyDetails[0].Description);
      await this.warrantyStartDate.fill(testData.WarrantyDetails[0].StartDate);
      await this.warrantyDuration.fill(testData.WarrantyDetails[0].Duration);
      await this.warrantySave.click();
      await this.logStep('PASS: New Warranty Details added');
    } catch (e) {
      console.error('ERROR: Unable to add new warranty details');
    }
  }

  async editWarrantyData(): Promise<void> {
    try {
      await this.page.waitForTimeout(3000);
      await this.warrantyEdit.click();
      await this.warrantyDescription.fill(testData.WarrantyDetails[1].Description);
      await this.warrantyStartDate.fill(testData.WarrantyDetails[1].StartDate);
      await this.warrantyDuration.fill(testData.WarrantyDetails[1].Duration);
      await this.warrantySave.click();
      await this.logStep('PASS: Warranty Details Edited successfully');
    } catch (e) {
      console.error('ERROR: Unable to Edit warranty details');
    }
  }

  async deleteWarrantyData(): Promise<void> {
    try {
      await this.page.waitForTimeout(2000);
      await this.warrantyDelete.click();
      await this.warrantyDeleteDialog.click();
      await this.page.waitForTimeout(3000);
      await this.logStep('PASS: Warranty Details Deleted successfully');
    } catch (e) {
      console.error('ERROR: Unable to delete warranty details');
    }
  }

  async verifyTelemetryRestAPI(): Promise<void> {
    await this.page.waitForTimeout(3000);
    await this.elementProperties.click();
    await this.files.click();
    await this.telemetryRestAPI.click();
    await this.modelElementExpandButton.click();
    await this.telemetryCreateOrchestrator.click();
    try {
      await this.telemetryGenerateReadings.waitFor({ state: 'visible' });
      await this.telemetryGenerateReadings.click();
      await this.page.waitForTimeout(3000);
      await this.logStep('PASS: Telemetry collection Fetch reading');
    } catch (e) {
      console.error('FAIL: Failed to Fetch Reading');
    }
    await this.page.waitForTimeout(2000);
  }

  async verifyTelemetryMQTT(): Promise<void> {
    await this.page.waitForTimeout(3000);
    await this.elementProperties.click();
    await this.files.click();
    await this.telemetryMQTT.click();
    await this.modelElementExpandButton.click();
    try {
      const cancelVisible = await this.cancelTelemetryData.isVisible().catch(() => false);
      if (cancelVisible) {
        await this.cancelTelemetryData.click();
      }
      await this.createTelemetryMQTT.waitFor({ state: 'visible' });
      await this.createTelemetryMQTT.click();
      await this.telemetryPublishData.waitFor({ state: 'visible' });
      await this.telemetryPublishData.click();
      await this.page.waitForTimeout(10000);
      await this.selectTelemetryDataselection(testData.TelemetryChannelSupport.DataType);
      await this.logStep('PASS: Telemetry Channels readings captured');
    } catch (e) {
      console.error('FAIL: Failed to Fetch Telemetry Channels readings');
    }
    await this.page.waitForTimeout(2000);
  }

  async selectTelemetryDataselection(name: string): Promise<void> {
    try {
      await this.page.waitForTimeout(5000);
      await this.selectTelemetryData.click();
      await this.page.locator(`//div[contains(text(),'${name}')]`).click();
      await this.logStep(`INFO: Telemetry data '${name}' selected`);
    } catch (e) {
      console.error('ERROR: Unable to select Telemetry data type');
    }
  }
}
