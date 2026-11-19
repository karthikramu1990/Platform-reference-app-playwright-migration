import path from 'path';
import { test, expect, BrowserContext, Page } from '@playwright/test';
import { envConfig } from '../config/env';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage, uniqueNewUser, NewUser } from '../pages/SignUpPage';
import { ConsolePage } from '../pages/ConsolePage';
import { ProjectSelectionPage } from '../pages/ProjectSelectionPage';
import { logStep } from '../utils/logger';
import { ADMIN_GROUP, consoleWorkspace, newUserProject, requiredEnv, saveNewUser } from '../fixtures/new-user';

// Stage 1 of the new-user regression: a new user gets admin access from the Console and creates
// the project the regression then runs on. One test per step, in order; the new user's Reference
// App window and the Console window stay open across the tests.
test.describe('New User - Setup', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(5 * 60 * 1000);

  let user: NewUser;
  let refContext: BrowserContext;
  let consoleContext: BrowserContext;
  let refPage: Page;
  let consoleWindow: Page;
  let consolePage: ConsolePage;

  test.beforeAll(async ({ browser }, workerInfo) => {
    user = uniqueNewUser(requiredEnv('NEWUSER_PASSWORD'));
    const videos = { dir: path.join(workerInfo.project.outputDir, 'videos') };
    refContext = await browser.newContext({ viewport: null, recordVideo: videos });
    consoleContext = await browser.newContext({ viewport: null, recordVideo: videos });
    refPage = await refContext.newPage();
    consoleWindow = await consoleContext.newPage();
    consolePage = new ConsolePage(consoleWindow);
  });

  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status === testInfo.expectedStatus) return;
    for (const [name, page] of [['reference-app', refPage], ['console', consoleWindow]] as const) {
      const shot = await page.screenshot().catch(() => null);
      if (shot) await testInfo.attach(`${name} screenshot`, { body: shot, contentType: 'image/png' });
    }
  });

  test.afterAll(async () => {
    await refContext?.close();
    await consoleContext?.close();
  });

  test('NU-01 - Reference App: sign up a new user', async () => {
    await logStep(`New user: ${user.email} (${user.firstName} ${user.lastName})`);
    await refPage.goto(envConfig.RfUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await new SignUpPage(refPage).signUp(user);
    saveNewUser(user);
    await logStep('PASS: Account created');
  });

  test('NU-02 - Console: sign in as admin', async () => {
    await consolePage.signIn(ConsolePage.urlFor(envConfig.RfUrl), requiredEnv('CONSOLE_USERNAME'), requiredEnv('CONSOLE_PASSWORD'));
    await logStep(`PASS: Signed in to the Console as ${requiredEnv('CONSOLE_USERNAME')}`);
  });

  test('NU-03 - Console: load organization, application and workspace', async () => {
    await consolePage.loadWorkspace(consoleWorkspace);
    await logStep(`PASS: Loaded ${consoleWorkspace.organization} / ${consoleWorkspace.application} / ${consoleWorkspace.workspace}`);
  });

  test('NU-04 - Console: open Passport service > User Groups', async () => {
    await consolePage.openUserGroups();
    await logStep('PASS: User Groups listed');
  });

  test(`NU-05 - Console: give the new user admin access (invite into ${ADMIN_GROUP})`, async () => {
    await consolePage.inviteUser(ADMIN_GROUP, user.email);
    await logStep(`PASS: Invitation sent to ${user.email}`);
  });

  test('NU-06 - Reference App: refresh and sign in as the new user', async () => {
    await refPage.reload({ waitUntil: 'networkidle', timeout: 60000 });
    const login = new LoginPage(refPage);
    await login.enterUserName(user.email);
    await login.enterPassword(user.password);
    await expect(refPage.getByRole('heading', { name: 'Pending invitations' })).toBeVisible({ timeout: 150000 });
    await logStep('PASS: Signed in; pending invitation shown');
  });

  test('NU-07 - Reference App: accept the invitation', async () => {
    const invite = await new ProjectSelectionPage(refPage).acceptPendingInvite();
    await logStep(`PASS: Accepted "${invite}"`);
  });

  test('NU-08 - Reference App: refresh, new user has admin access (Create Project)', async () => {
    await refPage.reload({ waitUntil: 'networkidle', timeout: 60000 });
    await expect(refPage.getByRole('button', { name: 'Create Project' })).toBeVisible({ timeout: 150000 });
    await logStep('PASS: Create Project is available');
  });

  test(`NU-09 - Reference App: create project "${newUserProject.name}" (Advanced mode)`, async () => {
    test.setTimeout(75 * 60 * 1000);
    const started = Date.now();
    await new ProjectSelectionPage(refPage).createProject(newUserProject, 'Advanced');
    await logStep(`PASS: Project "${newUserProject.name}" set up in ${Math.round((Date.now() - started) / 1000)}s`);
  });
});
