import { test, expect } from './baseTest.js';
import { CONFIG } from '../config.js';
import { login, selectProject, setup, verifyViewerScreenshot, waitForApplicationLoad } from '../helpers/appHelpers.js';
import { setAccuracy, toggleAllLayers, toggleLayers, verifyAllDisciplineStatus, verifyDisciplineStatus, waitForModelcomposerEnabled, clickHelpers, federatedShowAll, federatedHideAll, federatedSwitchToLoadEverything, structuralSubItemActions, architecturalSubItemActions, mechanicalSubItemActions, electricalSubItemActions, plumbingSubItemActions, fireProtectionSubItemActions } from '../helpers/modelComposerHelpers.js';
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
  await verifyViewerScreenshot(page, "All disipline-Toggled-low");

  await setAccuracy(page, EModelComposerQuality.High);
  await verifyViewerScreenshot(page, "All disipline-Toggled-high");
});

test('Model Composer - No disciplines - Low vs High', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");

  await toggleAllLayers(page, false);

  await setAccuracy(page, EModelComposerQuality.Low);
  await verifyViewerScreenshot(page, "No disciplines-Toggled-low");

  await setAccuracy(page, EModelComposerQuality.High);
  await verifyViewerScreenshot(page, "No disciplines-Toggled-high");
});

test('Model Composer - Architectural only Low & High', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");

  await toggleAllLayers(page, false);

  await toggleLayers(page, [
    LayerType.Architectural
  ], true);

  await setAccuracy(page, EModelComposerQuality.Low);
  await verifyViewerScreenshot(page, "architectural-Toggled-low");

  await setAccuracy(page, EModelComposerQuality.High);
  await verifyViewerScreenshot(page, "architectural-Toggled-high");
});

test('Model Composer - Plumbing only Low & High', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");

  await toggleAllLayers(page, false);

  await toggleLayers(page, [
    LayerType.Plumbing
  ], true);

  await setAccuracy(page, EModelComposerQuality.Low);
  await verifyViewerScreenshot(page, "plumbling-Toggled-low");

  await setAccuracy(page, EModelComposerQuality.High);
  await verifyViewerScreenshot(page, "Plumbing-Toggled-high");
});

test('Model Composer - Electrical only Low & High', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");

  await toggleAllLayers(page, false);
  await page.mouse.move(0, 0);

  await toggleLayers(page, [
    LayerType.Electrical
  ], true);

  await setAccuracy(page, EModelComposerQuality.Low);
  await verifyViewerScreenshot(page, "Electrical-Toggled-low");

  await setAccuracy(page, EModelComposerQuality.High);
  await verifyViewerScreenshot(page, "Electrical-Toggled-high");
});

test('Model Composer - GUI Helper only Low & High', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");

  await toggleAllLayers(page, false);
  await clickHelpers(page);
  await toggleLayers(page, [
    LayerType.GUIHelper
  ], true);

  await setAccuracy(page, EModelComposerQuality.Low);
  await verifyViewerScreenshot(page, "GUI Helper-Toggled-low");

  await setAccuracy(page, EModelComposerQuality.High);
  await verifyViewerScreenshot(page, "GUI Helper-Toggled-high");
});

test('Model Composer - Federated - Switch to Load Everything', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");
  const autoComposer = page.locator(Locator.autoCompose);
  await autoComposer.uncheck();
  await federatedSwitchToLoadEverything(page);
  await verifyViewerScreenshot(page, "Federated-SwitchToLoadEverything");
});

test('Model Composer - Federated - Show All', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");
  const autoComposer = page.locator(Locator.autoCompose);
  await autoComposer.uncheck();
  await federatedShowAll(page);
  await verifyViewerScreenshot(page, "Federated-ShowAll");
});

test('Model Composer - Federated - Hide All', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");
  const autoComposer = page.locator(Locator.autoCompose);
  await autoComposer.uncheck();
  await federatedHideAll(page);
  await verifyViewerScreenshot(page, "Federated-HideAll");
});

test('Model Composer - Structural Sub-Item Actions', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");
  const autoComposer = page.locator(Locator.autoCompose);
  await autoComposer.uncheck();
  await structuralSubItemActions(page);
});

test('Model Composer - Architectural Sub-Item Actions', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");
  const autoComposer = page.locator(Locator.autoCompose);
  await autoComposer.uncheck();
  await architecturalSubItemActions(page);
});

test('Model Composer - Mechanical Sub-Item Actions', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");
  const autoComposer = page.locator(Locator.autoCompose);
  await autoComposer.uncheck();
  await mechanicalSubItemActions(page);
});

test('Model Composer - Electrical Sub-Item Actions', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");
  const autoComposer = page.locator(Locator.autoCompose);
  await autoComposer.uncheck();
  await electricalSubItemActions(page);
});

test('Model Composer - Plumbing Sub-Item Actions', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");
  const autoComposer = page.locator(Locator.autoCompose);
  await autoComposer.uncheck();
  await plumbingSubItemActions(page);
});

test('Model Composer - FireProtection Sub-Item Actions', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");
  const autoComposer = page.locator(Locator.autoCompose);
  await autoComposer.uncheck();
  await fireProtectionSubItemActions(page);
});

