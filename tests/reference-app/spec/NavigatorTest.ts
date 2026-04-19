import { Page } from '@playwright/test';
import { HomePage } from '../page/HomePage';
import { NavigatorPage } from '../page/NavigatorPage';
import testData from '../testdata/TestData.json';

export class NavigatorTest {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyModelDetails(): Promise<void> {
    const hp = new HomePage(this.page);
    const navigator = new NavigatorPage(this.page);
    await hp.selectElementMenu();
    await hp.selectNavigatorScreen();
    await navigator.clickNavigatorSearch();
    await navigator.selectElementCategory(testData.ModelElement[0].Category);
    await navigator.selectElementType(testData.ModelElement[0].Type);
    await navigator.clickfetchbutton();
    await navigator.selectNavigatorGroupBy(testData.ModelElement[0].GroupBy);
    await navigator.selectNavigatorProperty(testData.ModelElement[0].Property);
    await navigator.selectNavigatorFunction(testData.ModelElement[0].Function);
    await navigator.selectNavigatorValue(testData.ModelElement[0].Value);
    await navigator.clickNavigatorAddButton();
    await navigator.selectNavigatorList();
    await navigator.selectNavigatorShowingResult();
    await navigator.validateElementProperties();
    await navigator.validateTelemetryRestAPI();
    await navigator.validateWarrantyData();
    await navigator.validateTelemetryviaMQTT();
    await navigator.validateFilesMenu();
  }

  async verifyModelImage(): Promise<void> {
    const navigator = new NavigatorPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await navigator.clickNavigatorSearch();
    await navigator.selectElementCategory(testData.ModelElement[0].Category);
    await navigator.selectElementType(testData.ModelElement[0].Type);
    await navigator.clickfetchbutton();
    await navigator.selectNavigatorList();
    await navigator.selectNavigatorShowingResult();
    await navigator.selectNavigatorList();
    await navigator.clickNavigatorFilter();
    await navigator.verifyingModelImage(testData.ModelImage.devConfig_DslModel);
  }

  async verifyWarrantyDataDetails(): Promise<void> {
    const navigator = new NavigatorPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await navigator.clickNavigatorSearch();
    await navigator.selectElementCategory(testData.ModelElement[0].Category);
    await navigator.selectElementType(testData.ModelElement[0].Type);
    await navigator.clickfetchbutton();
    await navigator.selectNavigatorList();
    await navigator.selectNavigatorShowingResult();
    await navigator.addNavigatorWarrantyData();
    await navigator.editNavigatorWarrantyData();
    await navigator.deleteNavigatorWarrantyData();
  }

  async verifyTelemetryviaRestAPI(): Promise<void> {
    const navigator = new NavigatorPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await navigator.clickNavigatorSearch();
    await navigator.selectElementCategory(testData.ModelElement[1].Category);
    await navigator.selectElementType(testData.ModelElement[1].Type);
    await navigator.clickfetchbutton();
    await navigator.selectNavigatorList();
    await navigator.selectNavigatorShowingResult();
    await navigator.validateTelemetryRestAPI();
    await navigator.verifyTelemetryviaRestAPI();
  }

  async verifyTelemetryMQTTReadings(): Promise<void> {
    const navigator = new NavigatorPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await navigator.clickNavigatorSearch();
    await navigator.selectElementCategory(testData.ModelElement[1].Category);
    await navigator.selectElementType(testData.ModelElement[1].Type);
    await navigator.clickfetchbutton();
    await navigator.selectNavigatorList();
    await navigator.selectNavigatorShowingResult();
    await navigator.verifyTelemetryviaMQTT();
  }

  async uploadDeleteFiles(): Promise<void> {
    const navigator = new NavigatorPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await navigator.clickNavigatorSearch();
    await navigator.selectElementCategory(testData.ModelElement[1].Category);
    await navigator.selectElementType(testData.ModelElement[1].Type);
    await navigator.clickfetchbutton();
    await navigator.selectNavigatorList();
    await navigator.selectNavigatorShowingResult();
    await navigator.uploadFile(testData.FilesRename[0].FileName);
    await navigator.deleteFile();
  }
}
