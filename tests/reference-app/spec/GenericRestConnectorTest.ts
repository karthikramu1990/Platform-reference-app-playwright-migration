import { Page } from '@playwright/test';
import { HomePage } from '../page/HomePage';
import { GenericRestConnecterPage } from '../page/GenericRestConnecterPage';
import testData from '../testdata/TestData.json';

export class GenericRestConnectorTest {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyGenericRestConnector(): Promise<void> {
    const hp = new HomePage(this.page);
    const grc = new GenericRestConnecterPage(this.page);
    await hp.selectAdminMenuManageModel();
    await hp.selectGenericRestConnectorPage();
    await grc.clickGenericConnectorButton();
    await grc.selectGenericRestConnector(testData.GenericRestConnector.ConnectorName);
    await grc.clickExpandAllGeneric();
  }
}
