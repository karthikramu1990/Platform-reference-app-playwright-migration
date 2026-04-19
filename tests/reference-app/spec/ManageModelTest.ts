import { Page } from '@playwright/test';
import { HomePage } from '../page/HomePage';
import { ManageModelPage } from '../page/ManageModelPage';
import testData from '../testdata/TestData.json';

export class ManageModelTest {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async relatedGraphandAPIValidation(): Promise<void> {
    const hp = new HomePage(this.page);
    const mp = new ManageModelPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await hp.selectAdminMenuManageModel();
    await hp.selectManageModelScreen();
    await mp.selectRelatedGraph();
    await mp.clickExpandAllRelatedGraph();
    await mp.clickExpandAllRelatedGraph();
    await mp.selectViewAPI(testData.ManageModel.ViewApiConfig);
    await mp.clickExpandAllViewAPI();
    await mp.clickExpandAllViewAPI();
  }

  async mapBoxActivation(): Promise<void> {
    const hp = new HomePage(this.page);
    const mp = new ManageModelPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await hp.selectAdminMenuManageModel();
    await hp.selectManageModelScreen();
    await mp.enterMapBoxUserName(testData.ManageModel.MapboxUsername);
    await mp.enterMapBoxScopes(testData.ManageModel.MapboxScopes);
    await mp.enterMapBoxExpiry(testData.ManageModel.MapboxExpiry);
    await mp.enterMapBoxSecretToken(testData.ManageModel.MapboxSecretToken);
    await mp.clickAddTempTokenConfig();
    await mp.verify_MapboxActivation();
  }
}
