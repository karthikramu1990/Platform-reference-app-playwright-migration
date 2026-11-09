import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProjectSelectionPage } from '../pages/ProjectSelectionPage';
import { credentials, envConfig } from '../config/env';

// Opens the Reference App, signs in and loads the configured project and user group.
export async function signInAndLoadProject(page: Page): Promise<void> {
  await page.goto(envConfig.RfUrl, { waitUntil: 'networkidle', timeout: 60000 });

  const loginPage = new LoginPage(page);
  await loginPage.enterUserName(credentials.username);
  await loginPage.enterPassword(credentials.password);

  const projectSelection = new ProjectSelectionPage(page);
  await projectSelection.selectProjectFromDd(envConfig.ProjectList);
  await projectSelection.selectUserGroupFromDd(envConfig.UserGroup);
}
