import { Page } from '@playwright/test';
import { HomePage } from '../page/HomePage';
import { ModelElementPage } from '../page/ModelElementPage';
import testData from '../testdata/TestData.json';

export class ModelElementTest {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyModelDetails(): Promise<void> {
    const hp = new HomePage(this.page);
    const model = new ModelElementPage(this.page);
    await hp.selectElementMenu();
    await hp.selectModelElementScreen();
    await model.selectElementCategory(testData.ModelElement[0].Category);
    await model.selectElementType(testData.ModelElement[0].Type);
    await model.clickFetchButton();
    await model.selectShowingModel();
    await model.validateElementProperties();
    await model.validateFiles();
    await model.validateWarrantyData();
    await model.validateTelemetryRestAPI();
    await model.validateTelemetryMQTT();
  }

  async uploadDeleteFiles(): Promise<void> {
    const hp = new HomePage(this.page);
    const model = new ModelElementPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await hp.selectElementMenu();
    await hp.selectModelElementScreen();
    await model.selectElementCategory(testData.ModelElement[0].Category);
    await model.selectElementType(testData.ModelElement[0].Type);
    await model.clickFetchButton();
    await model.selectShowingModel();
    await model.uploadFile(testData.FilesRename[0].FileName);
    await model.deleteFile();
  }

  async verifyWarrantyDataDetails(): Promise<void> {
    const hp = new HomePage(this.page);
    const model = new ModelElementPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await hp.selectElementMenu();
    await hp.selectModelElementScreen();
    await model.selectElementCategory(testData.ModelElement[0].Category);
    await model.selectElementType(testData.ModelElement[0].Type);
    await model.clickFetchButton();
    await model.selectShowingModel();
    await model.addWarrantyData();
    await model.editWarrantyData();
    await model.deleteWarrantyData();
  }

  async verifyTelemetryRestAPI(): Promise<void> {
    const hp = new HomePage(this.page);
    const model = new ModelElementPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await hp.selectElementMenu();
    await hp.selectModelElementScreen();
    await model.selectElementCategory(testData.ModelElement[1].Category);
    await model.selectElementType(testData.ModelElement[1].Type);
    await model.clickFetchButton();
    await model.selectShowingModel();
    await model.verifyTelemetryRestAPI();
  }

  async verifyTelemetryMQTT(): Promise<void> {
    const hp = new HomePage(this.page);
    const model = new ModelElementPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await hp.selectElementMenu();
    await hp.selectModelElementScreen();
    await model.selectElementCategory(testData.ModelElement[1].Category);
    await model.selectElementType(testData.ModelElement[1].Type);
    await model.clickFetchButton();
    await model.selectShowingModel();
    await model.verifyTelemetryMQTT();
  }
}
