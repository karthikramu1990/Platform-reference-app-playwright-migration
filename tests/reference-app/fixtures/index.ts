import path from 'path';
import { test as base, expect, Page } from '@playwright/test';
import { signInAndLoadProject } from './sign-in';
import { HomePage } from '../pages/HomePage';
import { NavigatorPage } from '../pages/NavigatorPage';
import { ModelElementPage } from '../pages/ModelElementPage';
import { FilesPage } from '../pages/FilesPage';
import { UserGroupPage } from '../pages/UserGroupPage';
import { ManageModelPage } from '../pages/ManageModelPage';
import { GenericRestConnectorPage } from '../pages/GenericRestConnectorPage';
import { AIChatPage } from '../pages/AIChatPage';

type WorkerFixtures = {
  appPage: Page;
};

type TestFixtures = {
  homePage: HomePage;
  navigatorPage: NavigatorPage;
  modelElementPage: ModelElementPage;
  filesPage: FilesPage;
  userGroupPage: UserGroupPage;
  manageModelPage: ManageModelPage;
  restConnectorPage: GenericRestConnectorPage;
  aiChatPage: AIChatPage;
  screenshotOnFailure: void;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // One signed-in page per worker, shared by the tests that worker runs. The suite runs on a
  // single worker, so this is one sign-in per run. When a test fails Playwright replaces the
  // worker, so the tests after it start again from a fresh sign-in instead of a broken page.
  appPage: [async ({ browser }, use, workerInfo) => {
    const context = await browser.newContext({
      viewport: null,
      ignoreHTTPSErrors: true,
      recordVideo: { dir: path.join(workerInfo.project.outputDir, 'videos') },
    });
    const page = await context.newPage();
    await signInAndLoadProject(page);

    await use(page);

    // The app keeps polling after the run; abort its requests so closing the context can't hang.
    await page.route('**/*', route => route.abort()).catch(() => {});
    await page.goto('about:blank', { timeout: 5000 }).catch(() => {});
    await Promise.race([context.close(), new Promise(resolve => setTimeout(resolve, 8000))]);
  }, { scope: 'worker' }],

  // The shared page is not Playwright's built-in `page`, so its automatic failure screenshot
  // doesn't apply; attach one here instead.
  screenshotOnFailure: [async ({ appPage }, use, testInfo) => {
    await use();
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await appPage.screenshot().catch(() => null);
      if (screenshot) await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    }
  }, { auto: true }],

  homePage: async ({ appPage }, use) => use(new HomePage(appPage)),
  navigatorPage: async ({ appPage }, use) => use(new NavigatorPage(appPage)),
  modelElementPage: async ({ appPage }, use) => use(new ModelElementPage(appPage)),
  filesPage: async ({ appPage }, use) => use(new FilesPage(appPage)),
  userGroupPage: async ({ appPage }, use) => use(new UserGroupPage(appPage)),
  manageModelPage: async ({ appPage }, use) => use(new ManageModelPage(appPage)),
  restConnectorPage: async ({ appPage }, use) => use(new GenericRestConnectorPage(appPage)),
  aiChatPage: async ({ appPage }, use) => use(new AIChatPage(appPage)),
});

export { expect };
