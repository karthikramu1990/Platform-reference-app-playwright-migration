import { test, expect } from './baseTest.js';
import { CONFIG } from '../config.js';
import { login, selectProject, setAccuracy, setup, toggleAllLayers, toggleLayers, verifyAllDisciplineStatus, verifyDisciplineStatus, verifyViewerScreenshot, waitForApplicationLoad, waitForModelcomposerEnabled } from '../helpers/appHelpers.js';
import { Locator } from '../helpers/locators.js';
import { EModelComposerQuality } from '../../src/common/IafViewerEnums.js';
import { LayerType } from '../helpers/modelHelpers.js';

test('Model Composer - Node Counts', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);
  await setup(page, "model");
  const res = await page.evaluate(async () => {
    const result = await window.generateModelComposerBenchmark(window.viewer, true)
    return result;
  });

  console.log('Benchmark Result:', res);

  // assertions
  expect(res).toBeTruthy();
  expect(res.results.length).toBeGreaterThan(0);

  // snapshot (like screenshot comparison)
  expect(JSON.stringify(res, null, 2))
    .toMatchSnapshot('model-composer-benchmark.json');
});

test('Model Composer - Auto Compose Visiblity', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await page.goto(CONFIG.url);

  await login(page, CONFIG.credentials, CONFIG.timeout.medium);

  await selectProject(page, CONFIG.project, "Navigator", CONFIG.timeout.medium);

  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await page.waitForTimeout(20000);

  await page.locator('#modelSpinner').waitFor({ state: 'hidden', timeout: 60000 });

  await waitForModelcomposerEnabled(page, CONFIG.timeout.medium);

  const autoComposer = page.locator(Locator.autoCompose);

  const designerView = page.locator(Locator.designerView);

  await designerView.click();
  await autoComposer.uncheck();

  await verifyAllDisciplineStatus(page, false);

  const list = page.locator('ul.MuiList-root').first();
  const menuButton =  list.locator(Locator.designerMenu).first()
  await menuButton.click();
  const menu = page.getByRole('menu');
    await expect(menu.getByRole('menuitem', { name: 'Rename' })).toBeEnabled();
  await expect(menu.getByRole('menuitem', { name: 'Switch to Load Everything' })).toBeEnabled();
  await expect(menu.getByRole('menuitem', { name: 'Show All' })).toBeEnabled();
  await expect(menu.getByRole('menuitem', { name: 'Hide All' })).toBeEnabled();
  await page.keyboard.press('Escape');

  await autoComposer.check();

  await verifyAllDisciplineStatus(page, true);
  await menuButton.click();
  await expect(menu.getByRole('menuitem', { name: 'Rename' })).toBeEnabled();
  await expect(menu.getByRole('menuitem', { name: 'Switch to Load Everything' })).toBeDisabled();
  await expect(menu.getByRole('menuitem', { name: 'Show All' })).toBeDisabled();
  await expect(menu.getByRole('menuitem', { name: 'Hide All' })).toBeDisabled();
});

test('Model Composer - All disciplines - Low vs High', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");

  await toggleAllLayers(page, true);

  await setAccuracy(page, EModelComposerQuality.Low);
  await verifyViewerScreenshot(page, "case1-all-low");

  await setAccuracy(page, EModelComposerQuality.High);
  await verifyViewerScreenshot(page, "case1-all-high");
});

test('Model Composer - No disciplines - Low vs High', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");

  await toggleAllLayers(page, false);

  await setAccuracy(page, EModelComposerQuality.Low);
  await verifyViewerScreenshot(page, "case2-none-low");

  await setAccuracy(page, EModelComposerQuality.High);
  await verifyViewerScreenshot(page, "case2-none-high");
});

test('Model Composer - Architectural only Low & High', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");

  await toggleAllLayers(page, false);

  await toggleLayers(page, [
    LayerType.Architectural
  ], true);

  await setAccuracy(page, EModelComposerQuality.Low);
  await verifyViewerScreenshot(page, "case3-arch-low");

  await setAccuracy(page, EModelComposerQuality.High);
  await verifyViewerScreenshot(page, "case3-arch-high");
});

test('Model Composer - Plumbing only Low & High', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");

  await toggleAllLayers(page, false);

  await toggleLayers(page, [
    LayerType.Plumbing
  ], true);

  await setAccuracy(page, EModelComposerQuality.Low);
  await verifyViewerScreenshot(page, "case4-mixed-low");

  await setAccuracy(page, EModelComposerQuality.High);
  await verifyViewerScreenshot(page, "case4-mixed-high");
});