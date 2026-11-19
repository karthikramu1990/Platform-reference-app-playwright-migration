import { test, expect } from '@playwright/test';
import { envConfig } from '../config/env';
import { LoginPage } from '../pages/LoginPage';
import { ConsolePage } from '../pages/ConsolePage';
import { logStep } from '../utils/logger';
import { ADMIN_GROUP, consoleWorkspace, loadNewUser, requiredEnv } from '../fixtures/new-user';

// Stage 3 of the new-user regression: runs only when every regression test passed (the config
// makes it depend on the regression stage). Removes the new user's admin access in the Console.
test.describe('New User - Remove admin access', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(5 * 60 * 1000);

  // Read in beforeAll, not at load time: Playwright loads every spec before the setup stage runs.
  let user: ReturnType<typeof loadNewUser>;
  let consolePage: ConsolePage;

  test.beforeAll(async ({ browser }) => {
    user = loadNewUser();
    const context = await browser.newContext({ viewport: null });
    consolePage = new ConsolePage(await context.newPage());
  });

  test('NU-10 - Console: sign in as admin', async () => {
    await consolePage.signIn(ConsolePage.urlFor(envConfig.RfUrl), requiredEnv('CONSOLE_USERNAME'), requiredEnv('CONSOLE_PASSWORD'));
    await logStep(`PASS: Signed in to the Console as ${requiredEnv('CONSOLE_USERNAME')}`);
  });

  test('NU-11 - Console: load organization, application and workspace', async () => {
    await consolePage.loadWorkspace(consoleWorkspace);
    await logStep(`PASS: Loaded ${consoleWorkspace.organization} / ${consoleWorkspace.application} / ${consoleWorkspace.workspace}`);
  });

  test('NU-12 - Console: open Passport service > User Groups', async () => {
    await consolePage.openUserGroups();
    await logStep('PASS: User Groups listed');
  });

  test(`NU-13 - Console: remove the new user from ${ADMIN_GROUP}`, async () => {
    await consolePage.removeUser(ADMIN_GROUP, user.email);
    await logStep(`PASS: ${user.email} removed from ${ADMIN_GROUP}`);
  });

  test('NU-14 - Reference App: new user signs in again and has no admin access', async ({ browser }) => {
    const context = await browser.newContext({ viewport: null });
    try {
      const page = await context.newPage();
      await page.goto(envConfig.RfUrl, { waitUntil: 'networkidle', timeout: 60000 });
      const login = new LoginPage(page);
      await login.enterUserName(user.email);
      await login.enterPassword(user.password);
      await expect(page.getByText("You don't have permission to create a project in the Reference App.")).toBeVisible({ timeout: 150000 });
      await expect(page.getByRole('button', { name: 'Create Project' })).toHaveCount(0);
      await logStep('PASS: Create Project is no longer available');
    } finally {
      await context.close();
    }
  });
});
