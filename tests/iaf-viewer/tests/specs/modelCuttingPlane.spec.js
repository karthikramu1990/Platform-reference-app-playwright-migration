import { test, expect } from './baseTest.js';
import { CONFIG } from '../config.js';
import { selectElementOnCanvas, ensureToggle, expectSliders, getSlider, getToggle, login, selectProject, setRangeValue, setSliderByAria, waitForApplicationLoad, waitForGraphicsSettle, waitForCuttingPlaneEnabled, waitForModelcomposerEnabled } from '../helpers/appHelpers.js';
import { Locator, Notifications } from '../helpers/locators.js';

test('Cutting Planes - Sliders + Toggle', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await page.goto(CONFIG.url);
  await login(page, CONFIG.credentials, CONFIG.timeout.medium);
  await selectProject(page, CONFIG.project, "Navigator", CONFIG.timeout.medium);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await page.waitForTimeout(20000);
  
  await page.locator('#modelSpinner').waitFor({ state: 'hidden', timeout: 60000 });

  await waitForModelcomposerEnabled(page, CONFIG.timeout.medium);

  // --- Open panel ---
  // await page.getByLabel(Locator.cuttingPlane).click();
  await waitForCuttingPlaneEnabled(page,  CONFIG.timeout.medium)
  const standardPlane = page.getByText(Locator.standardPlanes, { exact: true }).first();
  await standardPlane.click();

  const container = standardPlane.locator('xpath=ancestor::div[4]');

  const planes = [
    'Top Plane',
    'Bottom Plane',
    'Front Plane',
    'Back Plane',
    'Left Plane',
    'Right Plane'
  ];

  const standardToggle = getToggle(container, 'Standard Planes');
  const showPlanesToggle = getToggle(container, 'Show planes');

  // ============================================================
  // 1. Initial → disabled
  // ============================================================
  await expectSliders(container, planes, false);

  // ============================================================
  // 2. Enable Standard → sliders enabled
  // ============================================================
  await ensureToggle(standardToggle, true);
  await expectSliders(container, planes, true);

  // ============================================================
  // 3. Adjust sliders
  // ============================================================
  for (const plane of planes) {
    await setSliderByAria(getSlider(container, plane), 0.2);
    await page.waitForTimeout(100);
  }

  await page.waitForLoadState('networkidle');

  // ============================================================
  // 4. Screenshot
  // ============================================================
  await expect(page).toHaveScreenshot('cutting-planes-helpers.png', {
    maxDiffPixelRatio: 0.03,
    timeout: CONFIG.timeout.medium
  });

  // ============================================================
  // 5. Dependency check
  // ============================================================
  await ensureToggle(showPlanesToggle, false);
  await expect(page).toHaveScreenshot('cutting-planes-show-planes.png', {
    maxDiffPixelRatio: 0.03,
    timeout: CONFIG.timeout.medium
  });
  await ensureToggle(standardToggle, false);
  await expectSliders(container, planes, false);

  // Turn ON Standard → Show should auto ON
  await ensureToggle(standardToggle, true);
  await expect(showPlanesToggle).toBeChecked({ timeout: CONFIG.timeout.medium });
  await expectSliders(container, planes, true);


  // const focusedPlanesTitle = page.getByText(Locator.focusedPlanes, { exact: true }).first();
  const sidePanel = page.locator('[class*="SidePanel-module_sidePanelContent"]');

  console.log('Side panel count:', await sidePanel.count());
  
  const subTitles = sidePanel.locator('[class*="IafSubHeader-module_list-item-sub-title"]');
  
  console.log('Subtitle count:', await subTitles.count());
  
  const allTexts = await subTitles.allTextContents();
  
  console.log('All subtitle texts:', allTexts);
  
  const focusedPlanesTitle = subTitles.filter({ hasText: Locator.focusedPlanes }).first();
  
  console.log('Focused planes count:', await focusedPlanesTitle.count());
  
  await expect(focusedPlanesTitle).toBeVisible({
    timeout: CONFIG.timeout.medium,
  });
  
  await focusedPlanesTitle.click();

  const focusedPlanesContainer = focusedPlanesTitle.locator(
    'xpath=ancestor::div[4]'
  );
  await expect(focusedPlanesContainer).toBeVisible({ timeout: CONFIG.timeout.medium });

  const focusedPlanesSwitch = getToggle(focusedPlanesContainer, Locator.focusedPlanes);
  await ensureToggle(focusedPlanesSwitch, true);

  await expect(page).toHaveScreenshot('focused-planes-toggle-off.png', {
    maxDiffPixelRatio: 0.03,
    timeout: CONFIG.timeout.medium
  });

  const sizeSlider = getSlider(focusedPlanesContainer, "Size");
  await expect(sizeSlider).toBeVisible({ timeout: CONFIG.timeout.medium });
  await expect(sizeSlider).toHaveValue('30');

  const changeFocusButton = focusedPlanesContainer.getByRole('button', { name: 'Change Focus' });
  await expect(changeFocusButton).toBeVisible({ timeout: CONFIG.timeout.medium });

  await changeFocusButton.click();
  await expect(page.getByText(Notifications.focusPlane))
    .toBeVisible({ timeout:  CONFIG.timeout.medium });

  const canvas = page.locator(Locator.viewer3D);

  await selectElementOnCanvas(page, canvas,
    {
      timeout: CONFIG.timeout.medium,
      xRatio: 0.45,
      yRatio: 0.4,
    }
  );

  const targets = [10, 50, 100];

  for (const target of targets) {
    await setRangeValue(sizeSlider, target);
    await expect(sizeSlider).toHaveValue(String(target), {
      timeout: CONFIG.timeout.medium
    });
    await expect(changeFocusButton).toBeEnabled({
      timeout: CONFIG.timeout.medium,
    });

    await expect(changeFocusButton).toBeVisible({
      timeout: CONFIG.timeout.medium,
    });
    await waitForGraphicsSettle(page);
    await changeFocusButton.click({force: true});
    await waitForGraphicsSettle(page);
    await expect(page).toHaveScreenshot(`focused-planes-${target}.png`, {
      maxDiffPixelRatio: 0.03,
      timeout: CONFIG.timeout.medium
    });
  }
  
});