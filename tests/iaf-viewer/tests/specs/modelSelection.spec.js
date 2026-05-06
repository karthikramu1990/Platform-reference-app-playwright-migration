import { test, expect } from './baseTest.js';
import { CONFIG } from '../config.js';
import { closeDrawer, getDropdown, login, openDrawer, selectProject, setup, verifyViewerScreenshot, waitForAnnotationsEnabled, waitForApplicationLoad } from '../helpers/appHelpers.js';
import { Locator } from '../helpers/locators.js';
import { isolatedElements, singleSelection } from '../data/isolationElements.js';

test('Model Selection - Direct Viewer Click', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await page.goto(CONFIG.url);

  await login(page, CONFIG.credentials, CONFIG.timeout.medium);

  await selectProject(page, CONFIG.project, "Navigator", CONFIG.timeout.medium);

  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await page.waitForTimeout(20000);

  const canvas = page.locator(Locator.viewer3D);
  await expect(canvas).toBeVisible({ timeout: 60000 });

  await page.locator('#modelSpinner').waitFor({ state: 'hidden', timeout: 60000 });

  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();

  const cx = box.x + box.width;
  const cy = box.y + box.height;

  // select element
  await page.mouse.click(cx * 0.45 , cy  * 0.4);
  await expect(canvas).toHaveScreenshot('selection.png', {
    maxDiffPixelRatio: 0.02
  });

  const hasViewer = await page.evaluate(() => {
    return !!window.viewer;
  });
  if (hasViewer) {
    const selection = await page.evaluate(() => {
      return window.viewer.props.selection;
    });

    expect(selection).toEqual(singleSelection);
  }

  // unselect an element
  await page.mouse.click(cx * 0.85 , cy  * 0.4);

  if (hasViewer) {
    const selection = await page.evaluate(() => {
      return window.viewer.props.selection;
    });

    expect(selection).toEqual([]);
  }
  await expect(canvas).toHaveScreenshot('un-selection.png', {
    maxDiffPixelRatio: 0.02
  });
});

test('Model Isolation - Search and select model elements (Glass mode)', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);

  await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

  const searchIcon = page.locator('.fas.fa-search');
  const filterIcon = page.locator('.fas.fa-filter');
  const listIcon = page.locator('.navigator-bottom-data').filter({
    has: page.locator('.fa-list')
  });

  await expect(searchIcon).toBeVisible({ timeout: CONFIG.timeout.medium });
  await openDrawer(page, searchIcon, 'ElementCategory');

  const elementCategory = await getDropdown(page, 'ElementCategory');
  await elementCategory.click();
  await page.getByRole('option', { name: 'Ceiling' }).click();
  await page.keyboard.press('Escape');

  const elementType = getDropdown(page, 'ElementType');
  await elementType.click();
  await page.getByRole('option', { name: 'Suspended Ceiling' }).click();
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Fetch' }).click();

  await expect(listIcon).toBeVisible({ timeout: CONFIG.timeout.medium });
  await openDrawer(page, listIcon, 'Entity Name');
  await page.waitForTimeout(8000);

  // Close drawers (reverse order)
  await closeDrawer(page, searchIcon, 'Search For');
  await closeDrawer(page, filterIcon, 'Group By');

  const selectAll = page.locator('.header-column.checkbox input[type="checkbox"]');
  await expect(selectAll).toBeVisible({ timeout: CONFIG.timeout.medium });

  // Select all
  await selectAll.click();
  await expect(selectAll).toBeChecked();

  // Row checkboxes
  const rowCheckboxes = page.locator('.content-column input[type="checkbox"]');

  // Wait until ALL are checked
  const count = await rowCheckboxes.count();

  for (let i = 0; i < count; i++) {
    await expect(rowCheckboxes.nth(i)).toBeChecked();
  }
  await closeDrawer(page, listIcon, 'Entity Name');

  await page.locator('.bottom-panel__icons--right-icons').getByLabel('Collapse panel').click();

  const hasViewer = await page.evaluate(() => {
    return !!window.viewer;
  });
  if (hasViewer) {
    const selection = await page.evaluate(() => {
      return window.viewer.props.selection;
    });

    expect(selection).toEqual(isolatedElements);
  }

  await verifyViewerScreenshot(page, "isolatedElements_glass");

  await openDrawer(page, listIcon, 'Entity Name');

  // unselect all
  await selectAll.click();

  // await page.locator('.navigator-bottom-reset').click({ force: true });

  const clearFiltersBtn = page
    // .locator('.navigator-bottom-reset')
    .locator('i[aria-label="Clear filters"]');
  await clearFiltersBtn.click({ force: true });

  await closeDrawer(page, filterIcon, 'No data');
  await closeDrawer(page, listIcon, 'Entity Name');

  if (hasViewer) {
    const selection = await page.evaluate(() => {
      return window.viewer.props.selection;
    });

    expect(selection).toEqual([]);
  }

  await verifyViewerScreenshot(page, "isolatedElements_shaded");
});

test('Model Isolation - BookMark', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await page.goto(CONFIG.url);
  await login(page, CONFIG.credentials, CONFIG.timeout.medium);
  await selectProject(page, CONFIG.project, "Model Elements", CONFIG.timeout.medium);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  const elementCategory = await getDropdown(page, 'ElementCategory');
  await elementCategory.click();
  await page.getByRole('option', { name: 'Ceiling' }).click();
  await page.keyboard.press('Escape');

  const elementType = getDropdown(page, 'ElementType');
  await elementType.click();
  await page.getByRole('option', { name: 'Suspended Ceiling' }).click();
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Fetch' }).click();

  await expect(page.getByText("Group By")).toBeVisible({ timeout: CONFIG.timeout.medium });
  await expect(page.getByText("Entity Name")).toBeVisible({ timeout: CONFIG.timeout.medium });

  const selectAll = page.locator('.header-column.checkbox input[type="checkbox"]');
  await expect(selectAll).toBeVisible({ timeout: CONFIG.timeout.medium });

  // Select all
  await selectAll.click();
  await expect(selectAll).toBeChecked();

  // Row checkboxes
  const rowCheckboxes = page.locator('.content-column input[type="checkbox"]');

  // Wait until ALL are checked
  const count = await rowCheckboxes.count();

  for (let i = 0; i < count; i++) {
    await expect(rowCheckboxes.nth(i)).toBeChecked();
  }

  await page.locator('.entity-actions-panel').locator('i[aria-label="Navigator"]').click();

  await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

  await page.locator('.bottom-panel__icons--right-icons').getByLabel('Collapse panel').click();

  const filterIcon = page.locator('.fas.fa-filter');
  await filterIcon.click();

  await verifyViewerScreenshot(page, "isolatedElements_glass_book");

  // Refresh
  await page.reload();
  await waitForAnnotationsEnabled(page, CONFIG.timeout.long);
  const decodedUrl = decodeURIComponent(page.url());
  expect(decodedUrl).toContain('/navigator');
  expect(decodedUrl).toContain('[ElementCategory][0]=Ceiling');
  expect(decodedUrl).toContain('[ElementType][0]=Suspended Ceiling');

  await page.locator('.bottom-panel__icons--right-icons').getByLabel('Collapse panel').click();
  await filterIcon.click();
  // Refresh
  await verifyViewerScreenshot(page, "isolatedElements_glass_book_refresh");
});
