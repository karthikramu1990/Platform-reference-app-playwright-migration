import { test, expect } from './baseTest.js';
import { CONFIG } from '../config.js';
import { setup, setupAndClickModel, verifyViewerScreenshot, waitForApplicationLoad } from '../helpers/appHelpers.js';
import { clickViewOption, clickShadingOption, openCuttingPlane, dragPlaneSlider, selectElement, dragLocator, verifyCuttingPlaneScreenshot } from '../helpers/viewerHelpers.js';
import { Locator } from '../helpers/locators.js';

test('Viewer Toolbar - Reset View', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupAndClickModel(page);

  await expect(page.locator(Locator.resetView)).toBeVisible({ timeout: CONFIG.timeout.medium });
  await page.locator(Locator.resetView).click();
  await verifyViewerScreenshot(page, 'Reset-View-visible');
});

test('Viewer Toolbar - Projection', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await page.waitForTimeout(3000);
  await verifyViewerScreenshot(page, 'Projection-before-click');

  await page.locator(Locator.projection).click();
  await expect(page.locator(Locator.viewer2D)).toBeVisible({ timeout: CONFIG.timeout.medium });
  await verifyViewerScreenshot(page, 'Projection-after-click');
});

test('Viewer Toolbar - Top View', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);
  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await clickViewOption(page, 'topView');
  await verifyViewerScreenshot(page, 'Top-View');
});

test('Viewer Toolbar - Bottom View', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);
  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await clickViewOption(page, 'bottomView');
  await verifyViewerScreenshot(page, 'Bottom-View');
});

test('Viewer Toolbar - Left View', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);
  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await clickViewOption(page, 'leftView');
  await verifyViewerScreenshot(page, 'Left-View');
});

test('Viewer Toolbar - Right View', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);
  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await clickViewOption(page, 'rightView');
  await verifyViewerScreenshot(page, 'Right-View');
});

test('Viewer Toolbar - Front View', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);
  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await clickViewOption(page, 'frontView');
  await verifyViewerScreenshot(page, 'Front-View');
});

test('Viewer Toolbar - Back View', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);
  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await clickViewOption(page, 'backView');
  await verifyViewerScreenshot(page, 'Back-View');
});

test('Viewer Toolbar - Shading Options', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await clickShadingOption(page, 'fullShadingWithLines');
  await verifyViewerScreenshot(page, 'Shading-Full-With-Lines');

  await clickShadingOption(page, 'fullShadingNoLines');
  await verifyViewerScreenshot(page, 'Shading-Full-No-Lines');

  await clickShadingOption(page, 'edgesAndLines');
  await verifyViewerScreenshot(page, 'Shading-Edges-And-Lines');

  await clickShadingOption(page, 'glassView');
  await verifyViewerScreenshot(page, 'Shading-Glass-View');
});

test('Viewer Toolbar - Cutting Plane - Standard Planes with Show Planes ON', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await openCuttingPlane(page);

  await page.locator('xpath=(//div[text()="Standard Planes"])[1]').click();
  await page.locator(`xpath=${Locator.standardPlanesToggle}`).click();
  await expect(page.locator(`xpath=${Locator.showPlanesToggle}`)).toBeChecked({ timeout: CONFIG.timeout.medium });
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Default');

  await dragPlaneSlider(page, 'topPlaneSlider', 50);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Top-50');
  await dragPlaneSlider(page, 'topPlaneSlider', 100);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Top-100');
  await dragPlaneSlider(page, 'topPlaneSlider', 0);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Top-0');

  await dragPlaneSlider(page, 'bottomPlaneSlider', 50);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Bottom-50');
  await dragPlaneSlider(page, 'bottomPlaneSlider', 100);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Bottom-100');
  await dragPlaneSlider(page, 'bottomPlaneSlider', 0);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Bottom-0');

  await dragPlaneSlider(page, 'frontPlaneSlider', 50);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Front-50');
  await dragPlaneSlider(page, 'frontPlaneSlider', 100);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Front-100');
  await dragPlaneSlider(page, 'frontPlaneSlider', 0);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Front-0');

  await dragPlaneSlider(page, 'backPlaneSlider', 50);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Back-50');
  await dragPlaneSlider(page, 'backPlaneSlider', 100);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Back-100');
  await dragPlaneSlider(page, 'backPlaneSlider', 0);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Back-0');

  await dragPlaneSlider(page, 'leftPlaneSlider', 50);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Left-50');
  await dragPlaneSlider(page, 'leftPlaneSlider', 100);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Left-100');
  await dragPlaneSlider(page, 'leftPlaneSlider', 0);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Left-0');

  await dragPlaneSlider(page, 'rightPlaneSlider', 50);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Right-50');
  await dragPlaneSlider(page, 'rightPlaneSlider', 100);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Right-100');
  await dragPlaneSlider(page, 'rightPlaneSlider', 0);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-Right-0');
});

test('Viewer Toolbar - Cutting Plane - Standard Planes with Show Planes OFF', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await openCuttingPlane(page);

  await page.locator('xpath=(//div[text()="Standard Planes"])[1]').click();
  await page.locator(`xpath=${Locator.standardPlanesToggle}`).click();
  await page.locator(`xpath=${Locator.showPlanesToggle}`).click();
  await expect(page.locator(`xpath=${Locator.showPlanesToggle}`)).not.toBeChecked({ timeout: CONFIG.timeout.medium });

  await dragPlaneSlider(page, 'topPlaneSlider', 50);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Top-50');
  await dragPlaneSlider(page, 'topPlaneSlider', 100);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Top-100');
  await dragPlaneSlider(page, 'topPlaneSlider', 0);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Top-0');

  await dragPlaneSlider(page, 'bottomPlaneSlider', 50);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Bottom-50');
  await dragPlaneSlider(page, 'bottomPlaneSlider', 100);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Bottom-100');
  await dragPlaneSlider(page, 'bottomPlaneSlider', 0);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Bottom-0');

  await dragPlaneSlider(page, 'frontPlaneSlider', 50);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Front-50');
  await dragPlaneSlider(page, 'frontPlaneSlider', 100);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Front-100');
  await dragPlaneSlider(page, 'frontPlaneSlider', 0);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Front-0');

  await dragPlaneSlider(page, 'backPlaneSlider', 50);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Back-50');
  await dragPlaneSlider(page, 'backPlaneSlider', 100);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Back-100');
  await dragPlaneSlider(page, 'backPlaneSlider', 0);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Back-0');

  await dragPlaneSlider(page, 'leftPlaneSlider', 50);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Left-50');
  await dragPlaneSlider(page, 'leftPlaneSlider', 100);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Left-100');
  await dragPlaneSlider(page, 'leftPlaneSlider', 0);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Left-0');

  await dragPlaneSlider(page, 'rightPlaneSlider', 50);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Right-50');
  await dragPlaneSlider(page, 'rightPlaneSlider', 100);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Right-100');
  await dragPlaneSlider(page, 'rightPlaneSlider', 0);
  await verifyCuttingPlaneScreenshot(page, 'CuttingPlane-ShowOff-Right-0');
});

test('Viewer Toolbar - Cutting Plane - Focused Planes', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await selectElement(page);
  await openCuttingPlane(page);

  const focusedPlanes = page.locator('xpath=(//div[text()="Focused Planes"])[1]');
  await expect(focusedPlanes).toBeVisible({ timeout: CONFIG.timeout.medium });
  await focusedPlanes.click();

  const focusedPlanesToggle = page.locator(`xpath=${Locator.focusedPlanesToggle}`);
  await expect(focusedPlanesToggle).toBeVisible({ timeout: CONFIG.timeout.medium });
  await focusedPlanesToggle.click();

  await dragPlaneSlider(page, 'focusedPlanesSizeSlider', 100);

  const changeFocusBtn = page.locator(`xpath=${Locator.changeFocusBtn}`);
  await expect(changeFocusBtn).toBeVisible({ timeout: CONFIG.timeout.medium });
  await changeFocusBtn.click();
  await verifyCuttingPlaneScreenshot(page, 'FocusedPlanes-Size-100');

  await dragPlaneSlider(page, 'focusedPlanesSizeSlider', 75);
  await verifyCuttingPlaneScreenshot(page, 'FocusedPlanes-Size-75');

  await dragPlaneSlider(page, 'focusedPlanesSizeSlider', 50);
  await verifyCuttingPlaneScreenshot(page, 'FocusedPlanes-Size-50');

  await dragPlaneSlider(page, 'focusedPlanesSizeSlider', 25);
  await verifyCuttingPlaneScreenshot(page, 'FocusedPlanes-Size-25');

  await dragPlaneSlider(page, 'focusedPlanesSizeSlider', 0);
  await verifyCuttingPlaneScreenshot(page, 'FocusedPlanes-Size-0');
});

test('Viewer Toolbar - 3D Viewer', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const viewer3DBtn = page.locator(Locator.viewer3DToolbar);
  await expect(viewer3DBtn).toBeVisible({ timeout: CONFIG.timeout.medium });

  await viewer3DBtn.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('3DViewer-Disabled.png', { maxDiffPixelRatio: 0.03 });

  await viewer3DBtn.click();
  await verifyViewerScreenshot(page, '3DViewer-Enabled');
});

test('Viewer Toolbar - 2D Viewer - Full Screen', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const fullScreen = page.locator(`xpath=${Locator.twoDFullScreen}`);
  await expect(fullScreen).toBeVisible({ timeout: CONFIG.timeout.medium });
  await fullScreen.click();
  await expect(page).toHaveScreenshot('2DViewer-FullScreen.png', { maxDiffPixelRatio: 0.03 });
});

test('Viewer Toolbar - 2D Viewer - Half Screen', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const halfScreen = page.locator(`xpath=${Locator.twoDHalfScreen}`);
  await expect(halfScreen).toBeVisible({ timeout: CONFIG.timeout.medium });
  await halfScreen.click();
  await expect(page).toHaveScreenshot('2DViewer-HalfScreen.png', { maxDiffPixelRatio: 0.03 });
});

test('Viewer Toolbar - 2D Viewer - Zoom In', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const fullScreen = page.locator(`xpath=${Locator.twoDFullScreen}`);
  await expect(fullScreen).toBeVisible({ timeout: CONFIG.timeout.medium });
  await fullScreen.click();

  const zoomIn = page.locator(`xpath=${Locator.twoDZoomIn}`);
  await expect(zoomIn).toBeVisible({ timeout: CONFIG.timeout.medium });
  await zoomIn.click();
  await expect(page).toHaveScreenshot('2DViewer-ZoomIn.png', { maxDiffPixelRatio: 0.03 });
});

test('Viewer Toolbar - 2D Viewer - Zoom Out', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const fullScreen = page.locator(`xpath=${Locator.twoDFullScreen}`);
  await expect(fullScreen).toBeVisible({ timeout: CONFIG.timeout.medium });
  await fullScreen.click();

  const zoomOut = page.locator(`xpath=${Locator.twoDZoomOut}`);
  await expect(zoomOut).toBeVisible({ timeout: CONFIG.timeout.medium });
  await zoomOut.click();
  await expect(page).toHaveScreenshot('2DViewer-ZoomOut.png', { maxDiffPixelRatio: 0.03 });
});

test('Viewer Toolbar - 2D Viewer - Drag Area', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const dragArea = page.locator(`xpath=${Locator.twoDDragArea}`);
  await dragLocator(page, dragArea, 300, 200);
  await expect(page).toHaveScreenshot('2DViewer-DragArea.png', { maxDiffPixelRatio: 0.03 });
});

test('Viewer Toolbar - 2D Viewer - Disable and Enable', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const viewer2DBtn = page.locator(Locator.viewer2DToolbar);
  await expect(viewer2DBtn).toBeVisible({ timeout: CONFIG.timeout.medium });

  await viewer2DBtn.click();
  await verifyViewerScreenshot(page, '2DViewer-Disabled');

  await viewer2DBtn.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('2DViewer-Enabled.png', { maxDiffPixelRatio: 0.03 });
});

test('Viewer Toolbar - Focus Mode Enable', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await selectElement(page);
  await verifyViewerScreenshot(page, 'FocusMode-Enabled');
});

test('Viewer Toolbar - Focus Mode Disable', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const focusModeBtn = page.locator(`xpath=${Locator.focusMode}`);
  await expect(focusModeBtn).toBeVisible({ timeout: CONFIG.timeout.medium });
  await focusModeBtn.click();

  await selectElement(page);
  await verifyViewerScreenshot(page, 'FocusMode-Disabled');
});
