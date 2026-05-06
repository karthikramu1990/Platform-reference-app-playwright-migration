import { test } from '@playwright/test';
import config from '../../reference-app/testdata/config.json';

import { LoginintoTheApplicationTest } from '../../reference-app/spec/LoginintoTheApplicationTest';
import { ViewerTest }                  from './ViewerTest';
import { AnnotationsTest }             from './AnnotationsTest';
import { GISViewerTest }               from './GISViewerTest';

import { Browser, BrowserContext, Page } from '@playwright/test';

let sharedPage: Page;
let sharedContext: BrowserContext;

test.describe('Reference Viewer Suite', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ browser }: { browser: Browser }) => {
    sharedContext = await browser.newContext({
      viewport: null,
      ignoreHTTPSErrors: true,
      recordVideo: { dir: 'C:/pw-test-results/' },
    });
    sharedPage = await sharedContext.newPage();
    await sharedPage.goto(config.Environments[config.Env].RfUrl, { waitUntil: 'networkidle', timeout: 60000 });
  });

  test.afterAll(async ({}, testInfo) => {
    const videoPath = await sharedPage.video()?.path();

    await sharedPage.route('**/*', route => route.abort()).catch(() => {});
    await sharedPage.goto('about:blank', { timeout: 5000 }).catch(() => {});
    await Promise.race([
      sharedContext.close(),
      new Promise(resolve => setTimeout(resolve, 8000)),
    ]);

    if (videoPath) {
      await testInfo.attach('video', { path: videoPath, contentType: 'video/webm' });
    }
  });

  test('01 - Login and Project Setup', async () => {
    const loginTest = new LoginintoTheApplicationTest(sharedPage);
    await loginTest.loginTheApplication();
  });

  test('02 - Navigate to Viewer', async () => {
    const vt = new ViewerTest(sharedPage);
    await vt.navigateToViewer();
  });

  test('03 - Verify 2D Floor Plan Viewer', async () => {
    const vt = new ViewerTest(sharedPage);
    await vt.verify2DViewer();
  });

  test('04 - Verify Reset View and Projection', async () => {
    const vt = new ViewerTest(sharedPage);
    await vt.verifyResetAndProjection();
  });

  test('05 - Verify View Options', async () => {
    const vt = new ViewerTest(sharedPage);
    await vt.verifyViewOptions();
  });

  test('06 - Verify Shading Options', async () => {
    const vt = new ViewerTest(sharedPage);
    await vt.verifyShadingOptions();
  });

  test('07 - Verify Utilities', async () => {
    const vt = new ViewerTest(sharedPage);
    await vt.verifyUtilities();
  });

  test('08 - Verify Focus Mode', async () => {
    const vt = new ViewerTest(sharedPage);
    await vt.verifyFocusMode();
  });

  test('09 - Verify Cutting Planes', async () => {
    const vt = new ViewerTest(sharedPage);
    await vt.verifyCuttingPlanes();
  });

  test('10 - Verify Model Composer Disciplines', async () => {
    const vt = new ViewerTest(sharedPage);
    await vt.verifyModelComposer();
  });

  test('11 - Verify All Annotation Types', async () => {
    const at = new AnnotationsTest(sharedPage);
    await at.verifyAnnotations();
  });

  test('12 - Verify GIS Viewer', async () => {
    const gt = new GISViewerTest(sharedPage);
    await gt.verifyGISViewer();
  });
});
