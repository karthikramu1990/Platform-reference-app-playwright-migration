import { test, expect } from './baseTest.js';
import { CONFIG } from '../config.js';
import { closeDrawer, getDropdown, login, openDrawer, selectElementOnCanvas, selectProject, setup, verifyViewerScreenshot, verifyGISScreenshot, waitForAnnotationsEnabled, waitForApplicationLoad, waitForGISEnabled, waitForModelcomposerEnabled, setSliderValue } from '../helpers/appHelpers.js';
import { openGISPanel, enableGIS, disableGIS } from '../helpers/gisHelpers.js';
import { Locator } from '../helpers/locators.js';

// test('GIS - Show/Hide model on Mapbox', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);

//   await page.goto(CONFIG.url);

//   await login(page, CONFIG.credentials, CONFIG.timeout.medium);

//   await selectProject(page, CONFIG.project, 'Navigator', CONFIG.timeout.medium);

//   await waitForGISEnabled(page, CONFIG.timeout.medium);

//   await page.goto(`${CONFIG.url}?examplesview=true`);

//   await page.getByRole('heading', { name: 'Mapbox Standalone' }).click();

//   await page.getByRole('button', { name: 'Show configuration panel' }).click();

//   const tokenInput = page.getByRole('textbox', { name: 'Mapbox Token' });

//   await tokenInput.clear();
//   await tokenInput.fill(CONFIG.mapboxToken);

//   await page.getByRole('button', { name: 'Hide configuration panel' }).click();

//   await waitForGISEnabled(page, CONFIG.timeout.medium);

//   await page.getByText('Federated').click();

//   const federatedMode = page.locator('select[name="Federated Mode"]');
//   await expect(federatedMode).toHaveValue('0');
//   await expect(federatedMode.locator('option:checked')).toHaveText('None');

//   await verifyViewerScreenshot(page, 'gis-only-view', Locator.gisViewer);
//   await federatedMode.selectOption('1');
//   await expect(federatedMode).toHaveValue('1');
//   await expect(federatedMode.locator('option:checked')).toHaveText('Outline');
//   await verifyViewerScreenshot(page, 'gis-3d-view', Locator.gisViewer);
// });

test('GIS Viewer - Enable and Disable GIS', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await openGISPanel(page);

  const toggle = page.locator(`xpath=${Locator.enableGISToggle}`);

  await enableGIS(page);
  await expect(toggle).toBeChecked({ timeout: CONFIG.timeout.medium });
  await verifyGISScreenshot(page, 'GIS-Enable');

  await disableGIS(page);
  await expect(toggle).not.toBeChecked({ timeout: CONFIG.timeout.medium });
  await verifyGISScreenshot(page, 'GIS-Disable');
});

test('GIS Viewer - Interact - Zoom', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await openGISPanel(page);
  await enableGIS(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const interactHeader = page.locator(`xpath=${Locator.gisInteractSectionHeader}`);
  await expect(interactHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await interactHeader.click();

  await setSliderValue(page, 'Zoom', 2);
  await verifyGISScreenshot(page, 'GIS-Interact-Zoom-Low');

  await setSliderValue(page, 'Zoom', 10);
  await verifyGISScreenshot(page, 'GIS-Interact-Zoom-Medium');

  await setSliderValue(page, 'Zoom', 18);
  await verifyGISScreenshot(page, 'GIS-Interact-Zoom-High');
});

test('GIS Viewer - Interact - Pitch', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await openGISPanel(page);
  await enableGIS(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const interactHeader = page.locator(`xpath=${Locator.gisInteractSectionHeader}`);
  await expect(interactHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await interactHeader.click();

  await setSliderValue(page, 'Zoom', 18);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await setSliderValue(page, 'Pitch', 0);
  await verifyGISScreenshot(page, 'GIS-Interact-Pitch-0');

  await setSliderValue(page, 'Pitch', 20);
  await verifyGISScreenshot(page, 'GIS-Interact-Pitch-20');

  await setSliderValue(page, 'Pitch', 40);
  await verifyGISScreenshot(page, 'GIS-Interact-Pitch-40');

  await setSliderValue(page, 'Pitch', 60);
  await verifyGISScreenshot(page, 'GIS-Interact-Pitch-60');

  await setSliderValue(page, 'Pitch', 80);
  await verifyGISScreenshot(page, 'GIS-Interact-Pitch-80');
});

test('GIS Viewer - Interact - Bearing', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await openGISPanel(page);
  await enableGIS(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const interactHeader = page.locator(`xpath=${Locator.gisInteractSectionHeader}`);
  await expect(interactHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await interactHeader.click();

  await setSliderValue(page, 'Zoom', 18);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await setSliderValue(page, 'Bearing', -170);
  await verifyGISScreenshot(page, 'GIS-Interact-Bearing--170');

  await setSliderValue(page, 'Bearing', -70);
  await verifyGISScreenshot(page, 'GIS-Interact-Bearing--70');

  await setSliderValue(page, 'Bearing', 0);
  await verifyGISScreenshot(page, 'GIS-Interact-Bearing-0');

  await setSliderValue(page, 'Bearing', 70);
  await verifyGISScreenshot(page, 'GIS-Interact-Bearing-70');

  await setSliderValue(page, 'Bearing', 170);
  await verifyGISScreenshot(page, 'GIS-Interact-Bearing-170');
});

test('GIS Viewer - Appearance - Style', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await openGISPanel(page);
  await enableGIS(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const interactHeader = page.locator(`xpath=${Locator.gisInteractSectionHeader}`);
  await expect(interactHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await interactHeader.click();

  await setSliderValue(page, 'Zoom', 18);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const appearanceHeader = page.locator(`xpath=${Locator.gisAppearanceSectionHeader}`);
  await expect(appearanceHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await appearanceHeader.click();

  const styleDropdown = page.locator(`xpath=${Locator.gisStyleDropdown}`);
  await expect(styleDropdown).toBeVisible({ timeout: CONFIG.timeout.medium });

  const styles = ['Streets', 'Satellite Streets', 'Light', 'Dark', 'Outdoors'];

  for (const style of styles) {
    await styleDropdown.selectOption({ label: style });
    await waitForApplicationLoad(page, CONFIG.timeout.medium);
    await verifyGISScreenshot(page, `GIS-Appearance-Style-${style.replace(' ', '-')}`);
  }
});

test('GIS Viewer - Appearance - Layer', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await openGISPanel(page);
  await enableGIS(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const appearanceHeader = page.locator(`xpath=${Locator.gisAppearanceSectionHeader}`);
  await expect(appearanceHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await appearanceHeader.click();

  const layerDropdown = page.locator(`xpath=${Locator.gisLayerDropdown}`);
  await expect(layerDropdown).toBeVisible({ timeout: CONFIG.timeout.medium });

  const layers = ['None', 'Buildings', 'Terrains'];

  for (const layer of layers) {
    await layerDropdown.selectOption({ label: layer });
    await waitForApplicationLoad(page, CONFIG.timeout.medium);
    await verifyGISScreenshot(page, `GIS-Appearance-Layer-${layer}`);
  }
});

test('GIS Viewer - Appearance - Elevation Mode', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await openGISPanel(page);
  await enableGIS(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const interactHeader = page.locator(`xpath=${Locator.gisInteractSectionHeader}`);
  await expect(interactHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await interactHeader.click();

  await setSliderValue(page, 'Zoom', 18);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const appearanceHeader = page.locator(`xpath=${Locator.gisAppearanceSectionHeader}`);
  await expect(appearanceHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await appearanceHeader.click();

  const elevationDropdown = page.locator(`xpath=${Locator.gisElevationModeDropdown}`);
  await expect(elevationDropdown).toBeVisible({ timeout: CONFIG.timeout.medium });

  const elevationModes = [
    'None',
    'Quick Flat Surface View',
    'Quick Flat Subsurface View',
    'Surface View',
    'Mixed View',
    'Subsurface View'
  ];

  for (const mode of elevationModes) {
    await elevationDropdown.selectOption({ label: mode });
    await waitForApplicationLoad(page, CONFIG.timeout.medium);
    await verifyGISScreenshot(page, `GIS-Appearance-Elevation-${mode.replaceAll(' ', '-')}`);
  }
});

test('GIS Viewer - Appearance - Globe View', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await openGISPanel(page);
  await enableGIS(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const interactHeader = page.locator(`xpath=${Locator.gisInteractSectionHeader}`);
  await expect(interactHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await interactHeader.click();

  await setSliderValue(page, 'Zoom', 18);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const appearanceHeader = page.locator(`xpath=${Locator.gisAppearanceSectionHeader}`);
  await expect(appearanceHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await appearanceHeader.click();

  const globeViewToggle = page.locator(`xpath=${Locator.gisGlobeViewToggle}`);
  await expect(globeViewToggle).toBeVisible({ timeout: CONFIG.timeout.medium });

  await verifyGISScreenshot(page, 'GIS-Appearance-GlobeView-Off');

  await globeViewToggle.click();
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await verifyGISScreenshot(page, 'GIS-Appearance-GlobeView-On');
});

test('GIS Viewer - Appearance - Show Markers', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await openGISPanel(page);
  await enableGIS(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const interactHeader = page.locator(`xpath=${Locator.gisInteractSectionHeader}`);
  await expect(interactHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await interactHeader.click();

  await setSliderValue(page, 'Zoom', 18);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const appearanceHeader = page.locator(`xpath=${Locator.gisAppearanceSectionHeader}`);
  await expect(appearanceHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await appearanceHeader.click();

  const showMarkersToggle = page.locator(`xpath=${Locator.gisShowMarkersToggle}`);
  await expect(showMarkersToggle).toBeVisible({ timeout: CONFIG.timeout.medium });

  await showMarkersToggle.click();
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await verifyGISScreenshot(page, 'GIS-Appearance-ShowMarkers-Off');

  await showMarkersToggle.click();
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await verifyGISScreenshot(page, 'GIS-Appearance-ShowMarkers-On');
});