import { test, expect } from './baseTest.js';
import { CONFIG } from '../config.js';
import {
  setup,
  setupAndClickModel,
  setupWithAccount,
  waitForApplicationLoad,
  waitForAnnotationsEnabled,
  openDrawer,
  closeDrawer,
  verifyViewerScreenshot,
  verifyGISScreenshot,
  measureElapsed,
  getDropdown,
  toggleAllLayers,
  toggleLayers,
  setAccuracy,
  captureGraphicsSvcOrigin,
  getAuthContext,
  captureConsoleErrors,
} from '../helpers/appHelpers.js';
import { switchModel, LayerType } from '../helpers/modelHelpers.js';
import { openGISPanel, enableGIS } from '../helpers/gisHelpers.js';
import { openCuttingPlane, dragPlaneSlider, verifyCuttingPlaneScreenshot, clickViewOption } from '../helpers/viewerHelpers.js';
import { Locator } from '../helpers/locators.js';
import { EModelComposerQuality } from '../../src/common/IafViewerEnums.js';
import {
  goToWorkflowScreen,
  selectWorkflow,
  goLive,
  stopLive,
  assertActionLogContains,
  assertClockIsAdvancing,
  assertCanvasIsAnimating,
} from '../helpers/workflow2DHelpers.js';

// PLG-1471 - T2-ELEC-Federated model loads within acceptable time.
test('PLG-1471 - T2-ELEC-Federated model loads correctly', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.skinnyBial.credentials, CONFIG.skinnyBial.project, CONFIG.skinnyBial.userGroup);

  const loadTimeMs = await measureElapsed(() =>
    switchModel(page, CONFIG.skinnyBial.switchModel, CONFIG.timeout.long)
  );

  console.log(`PLG-1471: "${CONFIG.skinnyBial.switchModel}" loaded in ${loadTimeMs} ms`);
  test.info().annotations.push({
    type: 'load-time-ms',
    description: String(loadTimeMs),
  });

  await verifyViewerScreenshot(page, 'PLG-1471-T2-ELEC-Federated-Loaded');
});

// PLG-1671 - Non-optimized project loads successfully and the UI stays usable, instead of hanging with the UI disabled.
test('PLG-1671 - Non-optimized project loads successfully and UI stays usable', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.iputNonOptimised.credentials, CONFIG.iputNonOptimised.project, CONFIG.iputNonOptimised.userGroup);

  const searchIcon = page.locator(Locator.searchIcon);
  await expect(searchIcon).toBeVisible({ timeout: CONFIG.timeout.medium });
  await searchIcon.click();

  const categorySelect = await getDropdown(page, 'ElementCategory');
  await expect(categorySelect).toBeVisible({ timeout: CONFIG.timeout.medium });

  await verifyViewerScreenshot(page, 'PLG-1671-NonOptimizedProject-Loaded');
});

// PLG-1417 - 2D animation workflow goes live and animates correctly.
test('PLG-1417 - 2D animation workflow goes live and animates correctly', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.autocad2D.credentials, CONFIG.autocad2D.project, CONFIG.autocad2D.userGroup);
  await goToWorkflowScreen(page);

  await selectWorkflow(page, CONFIG.autocad2D.workflow);
  await goLive(page);

  await assertActionLogContains(page, 'Activating workflow');
  await assertClockIsAdvancing(page, 5000);
  await ensureProjectDialogDismissed(page);
  await assertCanvasIsAnimating(page, Locator.viewer2D, 4, 1500);

  await stopLive(page);
});

// PLG-1517 - Cutting Planes custom levels cut, update, and restore correctly.
test('PLG-1517 - Cutting Planes custom levels: slider cuts model, updates instantly across values, and restores view/cut on disable-enable', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await openCuttingPlane(page);

  await page.locator(`xpath=${Locator.standardPlanes}`).click();
  await page.locator(`xpath=${Locator.standardPlanesToggle}`).click();

  await dragPlaneSlider(page, 'topPlaneSlider', 30);
  await verifyCuttingPlaneScreenshot(page, 'PLG-1517-CustomLevel-30');

  await dragPlaneSlider(page, 'topPlaneSlider', 65);
  await verifyCuttingPlaneScreenshot(page, 'PLG-1517-CustomLevel-65');
  await dragPlaneSlider(page, 'topPlaneSlider', 45);
  await verifyCuttingPlaneScreenshot(page, 'PLG-1517-CustomLevel-45');

  await page.locator(`xpath=${Locator.standardPlanesToggle}`).click();
  await verifyCuttingPlaneScreenshot(page, 'PLG-1517-FullView-Restored');

  await page.locator(`xpath=${Locator.standardPlanesToggle}`).click();
  await verifyCuttingPlaneScreenshot(page, 'PLG-1517-CustomLevel-45');
});

// PLG-1607 - Search Isolation: matched elements are isolated into a non-blank Glass Mode view.
test('PLG-1607 - Search Isolation: small spread elements are isolated without blank Glass Mode', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForAnnotationsEnabled(page, CONFIG.timeout.medium);

  const searchIcon = page.locator(Locator.searchIcon);
  await expect(searchIcon).toBeVisible({ timeout: CONFIG.timeout.medium });
  await openDrawer(page, searchIcon, 'ElementCategory');

  const categorySelect = await getDropdown(page, 'ElementCategory');
  await categorySelect.click();
  const categoryOption = page.getByRole('option', { name: 'Safety and Security' });
  await expect(categoryOption).toBeVisible({ timeout: CONFIG.timeout.medium });
  await categoryOption.click();
  await page.keyboard.press('Escape');
  await expect(categorySelect).toContainText('Safety and Security', { timeout: CONFIG.timeout.medium });

  const typeSelect = getDropdown(page, 'ElementType');
  await typeSelect.click();
  const typeOption = page.getByRole('option', { name: 'Access Controller' });
  await expect(typeOption).toBeVisible({ timeout: CONFIG.timeout.medium });
  await typeOption.click();
  await page.keyboard.press('Escape');
  await expect(typeSelect).toContainText('Access Controller', { timeout: CONFIG.timeout.medium });

  await page.getByRole('button', { name: 'Fetch' }).click();

  const listIcon = page.locator(Locator.listIconContainer).filter({ has: page.locator(Locator.listIconGlyph) });
  await expect(listIcon).toBeVisible({ timeout: CONFIG.timeout.medium });
  await openDrawer(page, listIcon, 'Entity Name');

  const filterIcon = page.locator(Locator.filterIcon);
  await closeDrawer(page, searchIcon, 'Search For');
  await closeDrawer(page, filterIcon, 'Group By');

  const matchingNameColumn = page.locator(Locator.resultContentColumn).filter({ hasText: 'Door Controller' }).first();
  await expect(matchingNameColumn).toBeVisible({ timeout: CONFIG.timeout.medium });

  const selectAll = page.locator(Locator.selectAllCheckbox);
  await expect(selectAll).toBeVisible({ timeout: CONFIG.timeout.medium });
  await selectAll.click();
  await expect(selectAll).toBeChecked({ timeout: CONFIG.timeout.medium });

  const matchingRow = matchingNameColumn.locator(`xpath=${Locator.rowAncestorWithCheckbox}`);
  const matchingCheckbox = matchingRow.locator('input[type="checkbox"]').first();
  await expect(matchingCheckbox).toBeChecked({ timeout: CONFIG.timeout.medium });

  await closeDrawer(page, listIcon, 'Entity Name');
  await closeDrawer(page, filterIcon, 'Group By');
  await page.locator(Locator.collapsePanelIcons).getByLabel('Collapse panel').click();

  await verifyViewerScreenshot(page, 'PLG-1607-SearchIsolation-AccessController');
});

// PLG-1670 - Reselecting the full isolated group after a single-element selection zooms the camera back out to the original fit-to-group framing.
test('PLG-1670 - Navigator: camera zooms back out after selecting a single element post-isolation', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForAnnotationsEnabled(page, CONFIG.timeout.medium);

  const searchIcon = page.locator(Locator.searchIcon);
  await expect(searchIcon).toBeVisible({ timeout: CONFIG.timeout.medium });
  await openDrawer(page, searchIcon, 'ElementCategory');

  const categorySelect = await getDropdown(page, 'ElementCategory');
  await categorySelect.click();
  const categoryOption = page.getByRole('option', { name: 'Safety and Security' });
  await expect(categoryOption).toBeVisible({ timeout: CONFIG.timeout.medium });
  await categoryOption.click();
  await page.keyboard.press('Escape');
  await expect(categorySelect).toContainText('Safety and Security', { timeout: CONFIG.timeout.medium });

  const typeSelect = getDropdown(page, 'ElementType');
  await typeSelect.click();
  const typeOption = page.getByRole('option', { name: 'Access Controller' });
  await expect(typeOption).toBeVisible({ timeout: CONFIG.timeout.medium });
  await typeOption.click();
  await page.keyboard.press('Escape');
  await expect(typeSelect).toContainText('Access Controller', { timeout: CONFIG.timeout.medium });

  await page.getByRole('button', { name: 'Fetch' }).click();

  const listIcon = page.locator(Locator.listIconContainer).filter({ has: page.locator(Locator.listIconGlyph) });
  await expect(listIcon).toBeVisible({ timeout: CONFIG.timeout.medium });
  await openDrawer(page, listIcon, 'Entity Name');

  const filterIcon = page.locator(Locator.filterIcon);
  await closeDrawer(page, searchIcon, 'Search For');
  await closeDrawer(page, filterIcon, 'Group By');

  const selectAll = page.locator(Locator.selectAllCheckbox);
  await expect(selectAll).toBeVisible({ timeout: CONFIG.timeout.medium });
  await selectAll.click();
  await expect(selectAll).toBeChecked({ timeout: CONFIG.timeout.medium });
  await closeDrawer(page, listIcon, 'Entity Name');
  await page.locator(Locator.collapsePanelIcons).getByLabel('Collapse panel').click();
  await verifyViewerScreenshot(page, 'PLG-1670-ZoomOut-FitToGroup');

  await page.locator(Locator.collapsePanelIcons).getByLabel('Expand panel').click();
  await openDrawer(page, listIcon, 'Entity Name');
  await selectAll.click();
  await expect(selectAll).not.toBeChecked({ timeout: CONFIG.timeout.medium });

  const singleRowCheckbox = page.locator(Locator.resultRowCheckbox).first();
  await expect(singleRowCheckbox).toBeVisible({ timeout: CONFIG.timeout.medium });
  await singleRowCheckbox.click();
  await expect(singleRowCheckbox).toBeChecked({ timeout: CONFIG.timeout.medium });
  await closeDrawer(page, listIcon, 'Entity Name');
  await page.locator(Locator.collapsePanelIcons).getByLabel('Collapse panel').click();
  await verifyViewerScreenshot(page, 'PLG-1670-ZoomIn-SingleElement');

  await page.locator(Locator.collapsePanelIcons).getByLabel('Expand panel').click();
  await openDrawer(page, listIcon, 'Entity Name');
  await selectAll.click();
  await expect(selectAll).toBeChecked({ timeout: CONFIG.timeout.medium });
  await closeDrawer(page, listIcon, 'Entity Name');
  await page.locator(Locator.collapsePanelIcons).getByLabel('Collapse panel').click();
  await verifyViewerScreenshot(page, 'PLG-1670-ZoomOut-FitToGroup');
});

// PLG-1688 - EVM Demo Mode: the viewer's WASM engine loads without the engine-wasm.js 404 / getCamera / onResize console errors that used to leave it uninitialized.
test('PLG-1688 - EVM Demo Mode: WASM engine loads without console errors', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  const errors = captureConsoleErrors(page);

  await setup(page);

  await page.goto(`${CONFIG.url}?enableEvmDemo=true`);
  await page.reload();
  await page.waitForTimeout(CONFIG.timeout.medium);
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: CONFIG.timeout.long });

  const engineErrors = errors.filter((message) => /engine-wasm|failed to load engine|getCamera|onResize/i.test(message));
  expect(engineErrors, `unexpected viewer engine errors: ${engineErrors.join('; ')}`).toEqual([]);

  await verifyViewerScreenshot(page, 'PLG-1688-EVMDemo-Loaded', 'canvas');
});

// PLG-1666 - graphicssvc permissions API returns 200, not 500.
test('PLG-1666 - graphicssvc permissions API returns 200, not 500', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.medium);

  const graphicsSvc = captureGraphicsSvcOrigin(page);
  await setup(page);
  await page.waitForTimeout(5000);
  graphicsSvc.stop();

  const origin = graphicsSvc.get();
  expect(origin, 'expected the app to have made at least one graphicssvc request during load').toBeTruthy();

  const { token, namespace } = await getAuthContext(page);
  expect(token, 'expected an access token in the authenticated session').toBeTruthy();
  expect(namespace, 'expected a project namespace in the authenticated session').toBeTruthy();

  const response = await page.request.get(`${origin}/graphicssvc/api/v1/permissions`, {
    params: {
      _namespace: namespace,
      patternmatch: 'true',
      '_resourceDesc._irn': '*:*:*',
      nsfilter: namespace,
    },
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(response.status()).toBe(200);
});

// PLG-1689 - GIS 2.0: cycling the layer Style while Federated Mode is Dynamic produces no console errors (verified live: setupOutlineFiles' pre-existing "No outline file URL" warning fires on load regardless of this action and is unrelated noise, so only errors newly logged during the Style changes are asserted).
test('PLG-1689 - GIS Dynamic Mode: updating Style produces no console errors', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  const errors = captureConsoleErrors(page);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await openGISPanel(page);
  await enableGIS(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const federatedHeader = page.locator(`xpath=${Locator.gisFederatedSectionHeader}`);
  await expect(federatedHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await federatedHeader.click();

  const federatedModeDropdown = page.locator(`xpath=${Locator.gisFederatedModeDropdown}`);
  await expect(federatedModeDropdown).toBeVisible({ timeout: CONFIG.timeout.medium });
  await federatedModeDropdown.selectOption({ label: 'Dynamic' });

  const appearanceHeader = page.locator(`xpath=${Locator.gisAppearanceSectionHeader}`);
  await expect(appearanceHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await appearanceHeader.click();

  const styleDropdown = page.locator(`xpath=${Locator.gisStyleDropdown}`);
  await expect(styleDropdown).toBeVisible({ timeout: CONFIG.timeout.medium });

  const baselineErrorCount = errors.length;
  const styles = ['Satellite Streets', 'Light', 'Dark', 'Outdoors', 'Streets'];

  for (const style of styles) {
    await styleDropdown.selectOption({ label: style });
    await page.waitForTimeout(2000);
  }

  const styleUpdateErrors = errors.slice(baselineErrorCount);
  expect(styleUpdateErrors, `unexpected console errors while updating GIS style in Dynamic mode: ${styleUpdateErrors.join('; ')}`).toEqual([]);
});

// PLG-1685 - GIS Outline model should render centered on its federated position instead of displaced (screenshot baseline only: this browser's Mapbox token never lands in localStorage, so the map canvas can't be visually confirmed from this sandbox — review the generated PNG locally to confirm centering).
test('PLG-1685 - GIS Outline model renders at its federated position', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.iput51.credentials, CONFIG.iput51.project, CONFIG.iput51.userGroup);

  await openGISPanel(page);
  await enableGIS(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const federatedHeader = page.locator(`xpath=${Locator.gisFederatedSectionHeader}`);
  await expect(federatedHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
  await federatedHeader.click();

  const federatedModeDropdown = page.locator(`xpath=${Locator.gisFederatedModeDropdown}`);
  await expect(federatedModeDropdown).toBeVisible({ timeout: CONFIG.timeout.medium });
  await federatedModeDropdown.selectOption({ label: 'Outline' });

  const outlineModelItem = page.locator(`xpath=${Locator.gisFederatedIPUTExchangeItem}`);
  await expect(outlineModelItem).toBeVisible({ timeout: CONFIG.timeout.medium });
  await outlineModelItem.click();

  const showModelToggle = page.locator(`xpath=${Locator.gisOutlineShowModelToggle}`);
  await expect(showModelToggle).toBeChecked({ timeout: CONFIG.timeout.long });

  await verifyGISScreenshot(page, 'PLG-1685-OutlineModel-Position');
});

// PLG-1725 - A model with a geometry-less node ("Cannot get the bounding of node without geometry") should be caught internally and load fully instead of crashing the viewer.
test('PLG-1725 - Model with geometry-less node loads without crashing the viewer', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  const errors = captureConsoleErrors(page);

  await setupWithAccount(page, CONFIG.skinnyBial.credentials, CONFIG.skinnyBial.project, CONFIG.skinnyBial.userGroup);

  await switchModel(page, CONFIG.skinnyBial.badGeometryModel, CONFIG.timeout.long);

  const geometryErrors = errors.filter((message) => /bounding of node|without geometry/i.test(message));
  expect(geometryErrors, `expected the bounding-box error to be caught internally, not surfaced as an uncaught error: ${geometryErrors.join('; ')}`).toEqual([]);

  const searchIcon = page.locator(Locator.searchIcon);
  await expect(searchIcon).toBeVisible({ timeout: CONFIG.timeout.medium });
  await searchIcon.click();

  const categorySelect = await getDropdown(page, 'ElementCategory');
  await expect(categorySelect).toBeVisible({ timeout: CONFIG.timeout.medium });

  await verifyViewerScreenshot(page, 'PLG-1725-BadGeometryModel-Loaded');
});

// PLG-1726 - Toggling each Model Composition discipline, and re-toggling one, on iput 5.1's federated model produces no console errors (verified live on iput 5.1 as a substitute for Karthik's "bial models" verification, per his closing comment).
test('PLG-1726 - Model Composition discipline toggles produce no console errors', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  const errors = captureConsoleErrors(page);

  await setupWithAccount(page, CONFIG.iput51.credentials, CONFIG.iput51.project, CONFIG.iput51.userGroup, 'model');

  const disciplines = [LayerType.Structural, LayerType.Architectural, LayerType.Mechanical, LayerType.Electrical, LayerType.Plumbing];

  for (const discipline of disciplines) {
    const baselineErrorCount = errors.length;
    await toggleLayers(page, [discipline], true);
    await page.waitForTimeout(3000);
    const disciplineErrors = errors.slice(baselineErrorCount);
    expect(disciplineErrors, `unexpected console errors while enabling ${discipline}: ${disciplineErrors.join('; ')}`).toEqual([]);
  }

  const reToggleBaseline = errors.length;
  await toggleLayers(page, [LayerType.Structural], false);
  await page.waitForTimeout(3000);
  await toggleLayers(page, [LayerType.Structural], true);
  await page.waitForTimeout(3000);
  const reToggleErrors = errors.slice(reToggleBaseline);
  expect(reToggleErrors, `unexpected console errors re-toggling Structural: ${reToggleErrors.join('; ')}`).toEqual([]);

  await verifyViewerScreenshot(page, 'PLG-1726-AllDisciplines-ReToggled');
});

// PLG-1760 - Model Composition UX: a "please wait" notification and loading spinner appear while composition settings (discipline switches, display accuracy) are being applied.
test('PLG-1760 - Model Composition shows notification and spinner while settings are applied', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.iput51.credentials, CONFIG.iput51.project, CONFIG.iput51.userGroup, 'model');

  const structuralCheckbox = page.locator('input[type="checkbox"][name="Structural"]');
  await expect(structuralCheckbox).toBeVisible({ timeout: CONFIG.timeout.medium });
  const wasChecked = await structuralCheckbox.isChecked();

  await structuralCheckbox.click();

  const composingNotification = page.locator(Locator.compositionApplyingNotification);
  await expect(composingNotification).toBeVisible({ timeout: CONFIG.timeout.medium });

  const spinner = page.locator(Locator.modelSpinner);
  await expect(spinner).toBeVisible({ timeout: CONFIG.timeout.medium });
  await expect(spinner).toBeHidden({ timeout: CONFIG.timeout.long });

  await structuralCheckbox.click();
  await expect(structuralCheckbox).toBeChecked({ checked: wasChecked, timeout: CONFIG.timeout.medium });

  const accuracySlider = page.locator(Locator.displayAccuracyBtn).first();
  await expect(accuracySlider).toBeVisible({ timeout: CONFIG.timeout.medium });
  await accuracySlider.focus();
  await accuracySlider.press('End');

  const accuracyNotification = page.locator(Locator.compositionAccuracyOverrideNotification);
  await expect(accuracyNotification).toBeVisible({ timeout: CONFIG.timeout.medium });

  await verifyViewerScreenshot(page, 'PLG-1760-CompositionUpdate-Settled');
});

// PLG-1764 - Model Composition: hiding two linked files at once, then showing one back, correctly re-renders it on the large T2-All-Federated model (BIAL Terminal 2).
test('PLG-1764 - Show re-renders a previously hidden linked model', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.t2AllFederated.credentials, CONFIG.t2AllFederated.project, CONFIG.t2AllFederated.userGroup, 'model', CONFIG.timeout.long);

  const autoCompose = page.locator(Locator.autoCompose);
  await expect(autoCompose).toBeVisible({ timeout: CONFIG.timeout.long });
  await autoCompose.uncheck();

  const panelTitle = page.locator(`xpath=${Locator.federatedPanelTitle}`);
  await expect(panelTitle).toBeVisible({ timeout: CONFIG.timeout.medium });
  await panelTitle.click();

  const archThreeDots = page.locator(Locator.plg1764ArchLinkedFileThreeDots);
  await expect(archThreeDots).toBeVisible({ timeout: CONFIG.timeout.long });
  await archThreeDots.click();

  const hideMenuItem = page.locator(`xpath=${Locator.menuHide}`);
  await expect(hideMenuItem).toBeVisible({ timeout: CONFIG.timeout.medium });
  await hideMenuItem.click();

  const intPartitionThreeDots = page.locator(Locator.plg1764IntPartitionLinkedFileThreeDots);
  await expect(intPartitionThreeDots).toBeVisible({ timeout: CONFIG.timeout.medium });
  await intPartitionThreeDots.click();

  const intPartitionListItem = intPartitionThreeDots.locator('xpath=ancestor::li');
  if (await intPartitionListItem.filter({ hasText: 'Unloaded' }).isVisible().catch(() => false)) {
    const loadMenuItem = page.locator(`xpath=${Locator.menuLoad}`);
    await expect(loadMenuItem).toBeVisible({ timeout: CONFIG.timeout.medium });
    await loadMenuItem.click();
    await expect(intPartitionListItem).not.toContainText('Unloaded', { timeout: CONFIG.timeout.long });
    await intPartitionThreeDots.click();
  }

  const secondHideMenuItem = page.locator(`xpath=${Locator.menuHide}`);
  await expect(secondHideMenuItem).toBeVisible({ timeout: CONFIG.timeout.medium });
  await secondHideMenuItem.click();

  await archThreeDots.click();

  const showMenuItem = page.locator(`xpath=${Locator.menuShow}`);
  await expect(showMenuItem).toBeVisible({ timeout: CONFIG.timeout.medium });
  await showMenuItem.click();

  const archListItem = archThreeDots.locator('xpath=ancestor::li');
  await expect(archListItem).not.toContainText('Invisible', { timeout: CONFIG.timeout.long });

  await verifyViewerScreenshot(page, 'PLG-1764-LinkedFile-ShownAfterHide');
});

// PLG-1774 - Switching to a second discipline model after the tab sits idle for 1-2 minutes loads cleanly, with no "Bad Model" console error.
test('PLG-1774 - Switching discipline models after an idle period produces no Bad Model error', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  const consoleMessages = [];
  page.on('console', (msg) => consoleMessages.push(msg.text()));

  await setupWithAccount(page, CONFIG.skinnyBial.credentials, CONFIG.skinnyBial.project, CONFIG.skinnyBial.userGroup);

  await switchModel(page, CONFIG.skinnyBial.switchModel, CONFIG.timeout.long);

  await page.waitForTimeout(90000);

  const baseline = consoleMessages.length;

  await switchModel(page, CONFIG.skinnyBial.secondSwitchModel, CONFIG.timeout.long);

  const postIdleMessages = consoleMessages.slice(baseline);
  const badModelMessages = postIdleMessages.filter((m) => /bad model/i.test(m));
  expect(badModelMessages, `unexpected Bad Model error after idle discipline switch: ${badModelMessages.join('; ')}`).toEqual([]);

  await verifyViewerScreenshot(page, 'PLG-1774-SecondDiscipline-AfterIdle');
});

// PLG-1793 - Asset-level discipline composition (initial {load: true, visible: false}) hides/reshows Architectural instantly with no reload, and leaves other disciplines unaffected.
test('PLG-1793 - Asset-level discipline visibility toggles instantly without affecting other disciplines', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.iput51.credentials, CONFIG.iput51.project, CONFIG.iput51.userGroup, 'model');

  const architecturalCheckbox = page.locator('input[type="checkbox"][name="Architectural"]');
  const structuralCheckbox = page.locator('input[type="checkbox"][name="Structural"]');
  await expect(architecturalCheckbox).toBeChecked({ timeout: CONFIG.timeout.medium });
  await expect(structuralCheckbox).toBeVisible({ timeout: CONFIG.timeout.medium });
  const structuralInitiallyChecked = await structuralCheckbox.isChecked();

  await toggleLayers(page, [LayerType.Architectural], false);

  await expect(page.locator(Locator.privilegedDisciplineTooltip)).toBeVisible({ timeout: CONFIG.timeout.medium });
  await expect(page.locator(Locator.disciplineVisibilityUpdatingNotification)).toBeVisible({ timeout: CONFIG.timeout.medium });
  await expect(structuralCheckbox).toBeChecked({ checked: structuralInitiallyChecked, timeout: CONFIG.timeout.medium });

  await verifyViewerScreenshot(page, 'PLG-1793-Architectural-Hidden');

  const reshowElapsed = await measureElapsed(async () => {
    await toggleLayers(page, [LayerType.Architectural], true);
    await expect(page.locator(Locator.disciplineVisibilityUpdatingNotification)).toBeVisible({ timeout: CONFIG.timeout.medium });
  });
  expect(reshowElapsed, `Architectural re-show took ${reshowElapsed}ms; expected an instant visibility toggle, not a reload`).toBeLessThan(10000);

  await expect(structuralCheckbox).toBeChecked({ checked: structuralInitiallyChecked, timeout: CONFIG.timeout.medium });
  await toggleLayers(page, [LayerType.Structural], false);
  await expect(structuralCheckbox).toBeChecked({ checked: false, timeout: CONFIG.timeout.medium });
  await toggleLayers(page, [LayerType.Structural], true);
  await expect(structuralCheckbox).toBeChecked({ timeout: CONFIG.timeout.medium });

  await verifyViewerScreenshot(page, 'PLG-1793-Architectural-Reshown');
});

// PLG-1805 - Appending devToolsIaf=true to the query string shows the Dev Tools panel.
test('PLG-1805 - Dev Tools panel appears when devToolsIaf=true is added to the query string', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.iput51.credentials, CONFIG.iput51.project, CONFIG.iput51.userGroup);

  await page.goto(`${CONFIG.url}?&devToolsIaf=true`);
  await page.reload();
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const devToolsHeading = page.locator(Locator.devToolsPanelHeading);
  await expect(devToolsHeading).toBeVisible({ timeout: CONFIG.timeout.long });

  const gltfToolsLink = page.locator(Locator.devToolsGltfToolsLink);
  await expect(gltfToolsLink).toBeVisible({ timeout: CONFIG.timeout.medium });

  await verifyViewerScreenshot(page, 'PLG-1805-DevTools-Visible');
});

// PLG-1624 - Disabled discipline has no impact when the Model Composer quality slider moves.
test('PLG-1624 - Model Composition: disabled discipline has no impact when quality slider moves', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page, "model");

  const disciplinesContainer = page.locator(`xpath=${Locator.disciplinesContainer}`);
  const disabledCheckbox = disciplinesContainer.locator(Locator.disabledDisciplineCheckbox).first();
  await expect(disabledCheckbox).toBeVisible({ timeout: CONFIG.timeout.medium });

  await toggleAllLayers(page, false);

  await setAccuracy(page, EModelComposerQuality.Low);
  await verifyViewerScreenshot(page, 'PLG-1624-DisabledDiscipline-NoImpact');

  await setAccuracy(page, EModelComposerQuality.High);

  await expect(disabledCheckbox).toBeDisabled();
  await expect(disabledCheckbox).not.toBeChecked();
  await verifyViewerScreenshot(page, 'PLG-1624-DisabledDiscipline-NoImpact');
});

// PLG-1570 - Switching models loads the new model's own initial camera view.
test('PLG-1570 - Model Switching: initial camera view is correct when switching from Model A to Model B', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.skinnyBial.credentials, CONFIG.skinnyBial.project, CONFIG.skinnyBial.userGroup);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await verifyViewerScreenshot(page, 'PLG-1570-ModelA-InitialView');

  await switchModel(page, CONFIG.skinnyBial.modelB, CONFIG.timeout.long);
  await verifyViewerScreenshot(page, 'PLG-1570-ModelB-InitialView');
});

// PLG-1570 - Camera position on Model A is restored after switching away and back.
test('PLG-1570 - Model Switching: camera position is restored correctly after switching away and back to the same model', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.skinnyBial.credentials, CONFIG.skinnyBial.project, CONFIG.skinnyBial.userGroup);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await clickViewOption(page, 'topView');
  await verifyViewerScreenshot(page, 'PLG-1570-ModelA-TopView');

  await switchModel(page, CONFIG.skinnyBial.modelB, CONFIG.timeout.long);
  await switchModel(page, CONFIG.skinnyBial.modelA, CONFIG.timeout.long);

  await verifyViewerScreenshot(page, 'PLG-1570-ModelA-TopView-AfterSwitch');
});

// PLG-1570 - Saved camera position survives a full page reload.
test('PLG-1570 - Model Switching: saved camera position survives a page reload', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.skinnyBial.credentials, CONFIG.skinnyBial.project, CONFIG.skinnyBial.userGroup);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await clickViewOption(page, 'topView');
  await verifyViewerScreenshot(page, 'PLG-1570-ModelA-TopView-Reload');

  await page.reload();
  await waitForApplicationLoad(page, CONFIG.timeout.long);

  await verifyViewerScreenshot(page, 'PLG-1570-ModelA-TopView-AfterReload');
});
