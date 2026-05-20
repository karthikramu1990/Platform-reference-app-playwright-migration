import { test, expect } from './baseTest.js';
import { CONFIG } from '../config.js';
import { setup, setupAndClickModel, clickViewOption, clickShadingOption, verifyViewerScreenshot, waitForApplicationLoad } from '../helpers/appHelpers.js';
import { Locator } from '../helpers/locators.js';

// test('Viewer Toolbar - Reset View', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);

//   await setupAndClickModel(page);

//   await expect(page.locator(Locator.resetView)).toBeVisible({ timeout: CONFIG.timeout.medium });
//   await page.locator(Locator.resetView).click();
//   await verifyViewerScreenshot(page, 'Reset-View-visible');
// });

// test('Viewer Toolbar - Projection', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);

//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await page.waitForTimeout(3000);
//   await verifyViewerScreenshot(page, 'Projection-before-click');

//   await page.locator(Locator.projection).click();
//   await expect(page.locator(Locator.viewer2D)).toBeVisible({ timeout: CONFIG.timeout.medium });
//   await verifyViewerScreenshot(page, 'Projection-after-click');
// });

// test('Viewer Toolbar - Top View', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);
//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);  
//   await clickViewOption(page, 'topView');
//   await verifyViewerScreenshot(page, 'Top-View');
// });

// test('Viewer Toolbar - Bottom View', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);
//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await clickViewOption(page, 'bottomView');
//   await verifyViewerScreenshot(page, 'Bottom-View');
// });

// test('Viewer Toolbar - Left View', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);
//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await clickViewOption(page, 'leftView');
//   await verifyViewerScreenshot(page, 'Left-View');
// });

// test('Viewer Toolbar - Right View', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);
//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await clickViewOption(page, 'rightView');
//   await verifyViewerScreenshot(page, 'Right-View');
// });

// test('Viewer Toolbar - Front View', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);
//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await clickViewOption(page, 'frontView');
//   await verifyViewerScreenshot(page, 'Front-View');
// });

// test('Viewer Toolbar - Back View', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);
//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await clickViewOption(page, 'backView');
//   await verifyViewerScreenshot(page, 'Back-View');
// });

test('Viewer Toolbar - Shading Options', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await page.waitForTimeout(3000);
  await clickShadingOption(page, 'fullShadingWithLines');
  await verifyViewerScreenshot(page, 'Shading-Full-With-Lines');

  await clickShadingOption(page, 'fullShadingNoLines');
  await verifyViewerScreenshot(page, 'Shading-Full-No-Lines');

  await clickShadingOption(page, 'edgesAndLines');
  await verifyViewerScreenshot(page, 'Shading-Edges-And-Lines');

  await clickShadingOption(page, 'glassView');
  await verifyViewerScreenshot(page, 'Shading-Glass-View');
});
