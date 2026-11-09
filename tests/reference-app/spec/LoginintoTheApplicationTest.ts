import { Page } from '@playwright/test';
import { LoginPage } from '../page/LoginPage';
import { ProjectSelectionPage } from '../page/ProjectSelectionPage';
import { credentials, envConfig } from '../testdata/env';

export class LoginintoTheApplicationTest {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async loginTheApplication(): Promise<void> {
    const lp = new LoginPage(this.page);
    await lp.enterUserName(credentials.username);
    await lp.enterPassword(credentials.password);
    await this.ProjectSelection();
  }

  async ProjectSelection(): Promise<void> {
    const psp = new ProjectSelectionPage(this.page);
    await psp.selectProjectFromDd(envConfig.ProjectList);
    await psp.selectUserGroupFromDd(envConfig.UserGroup);
  }
}
