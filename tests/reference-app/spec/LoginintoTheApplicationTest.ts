import { Page } from '@playwright/test';
import { LoginPage } from '../page/LoginPage';
import { ProjectSelectionPage } from '../page/ProjectSelectionPage';
import config from '../testdata/config.json';

export class LoginintoTheApplicationTest {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async loginTheApplication(): Promise<void> {
    const lp = new LoginPage(this.page);
    await lp.enterUserName(config.Rfusername);
    await lp.enterPassword(config.RfPassword);
    await this.ProjectSelection();
  }

  async ProjectSelection(): Promise<void> {
    const env = config.Environments[config.Env];
    const psp = new ProjectSelectionPage(this.page);
    await psp.selectProjectFromDd(env.ProjectList);
    await psp.selectUserGroupFromDd(env.UserGroup);
  }
}
