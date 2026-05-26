import { expect } from '@playwright/test';
import { CONFIG } from '../config';
import { Locator } from './locators';
import { LayerType } from './modelHelpers';
import { verifyViewerScreenshot } from './appHelpers';

export async function waitForModelcomposerEnabled(page, timeout) {
  const modelcomposerBtn = await page.locator(Locator.modelcomposerBtn).first();

  await expect(modelcomposerBtn).toBeVisible({ timeout });
  await expect(modelcomposerBtn).not.toHaveClass(/disabled/, { timeout });

  await modelcomposerBtn.click();

  return modelcomposerBtn;
}

export async function displayAccuracyRange(page) {
  const wrapper = page.getByTestId("display-accuracy-slider");
  await expect(wrapper).toBeVisible();
  return wrapper.locator('input[type="range"]').first();
}

export async function setRangeValue(locator, value) {
  await locator.evaluate((el, v) => {
    el.value = String(v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
  await expect(locator).toHaveValue(String(value));
}

export async function verifyDisciplineStatus(page, layer, isEnabled) {
  const container = page.locator(
    'xpath=//div[normalize-space()="Disciplines"]/following-sibling::div[1]'
  );

  const checkboxes = container.locator(`input[type="checkbox"][name="${layer}"]`);
  const count = await checkboxes.count();

  for (let i = 0; i < count; i++) {
    const checkbox = checkboxes.nth(i);
    if (isEnabled) {
      await expect(checkbox).toBeEnabled({ timeout: 60000 });
    } else {
      await expect(checkbox).toBeDisabled({ timeout: 60000 });
    }
  }
}

export async function verifyAllDisciplineStatus(page, isEnabled) {
  for (const layer of Object.values(LayerType)) {
    await verifyDisciplineStatus(page, layer, isEnabled);
  }
}

export async function verifyMenuItems(page) {
  const menu = page.getByRole('menu');

  const rename = menu.getByRole('menuitem', { name: 'Rename' });
  await expect(rename).toBeEnabled();

  const items = menu.getByRole('menuitem');
  const count = await items.count();

  for (let i = 0; i < count; i++) {
    const item = items.nth(i);
    const text = await item.textContent();

    if (text?.trim() !== 'Rename') {
      await expect(item).toBeDisabled();
    }
  }
}

export async function getAllLayerKeys(page) {
  const container = page.locator(
    'xpath=//div[normalize-space()="Disciplines"]/following-sibling::div[1]'
  );

  const checkboxes = container.locator('input[type="checkbox"][name]');
  const count = await checkboxes.count();

  const keys = [];

  for (let i = 0; i < count; i++) {
    const checkbox = checkboxes.nth(i);

    await checkbox.waitFor({ state: 'attached' });

    if (await checkbox.isDisabled()) continue;

    const name = await checkbox.getAttribute('name');
    if (name) keys.push(name);
  }

  return keys;
}

export async function toggleLayers(page, keys, enable = true) {
  for (const key of keys) {
    const checkbox = page.locator(`input[type="checkbox"][name="${key}"]`);

    await expect(checkbox).toBeVisible();

    const checked = await checkbox.isChecked();

    if (checked !== enable) {
      await checkbox.click();
      await expect(checkbox).toBeChecked({ checked: enable });
    }
  }
}

export async function toggleAllLayers(page, enable = true) {
  const keys = await getAllLayerKeys(page);
  await toggleLayers(page, keys, enable);
}

export async function setAccuracy(page, quality) {
  const map = { low: 0, medium: 1, high: 2 };
  const value = map[quality];

  const slider = page.locator(Locator.displayAccuracyBtn).first();
  await slider.waitFor({
    state: "visible",
    timeout: CONFIG.timeout.medium
  });

  await slider.focus();
  await slider.press('Home');

  for (let i = 0; i < value; i++) {
    await slider.press('ArrowRight');
  }
}

export async function clickHelpers(page) {
  const helpers = page.locator(`xpath=${Locator.helpers}`);
  await expect(helpers).toBeVisible({ timeout: CONFIG.timeout.medium });
  await helpers.click();
}

async function clickFederatedMenuItem(page, menuLocatorKey) {
  const panelTitle = page.locator(`xpath=${Locator.federatedPanelTitle}`);
  await expect(panelTitle).toBeVisible({ timeout: CONFIG.timeout.medium });
  await panelTitle.scrollIntoViewIfNeeded();
  await panelTitle.click();

  await page.keyboard.press('End');

  const threeDots = page.locator(Locator.federatedThreeDots);
  await expect(threeDots).toBeVisible({ timeout: CONFIG.timeout.medium });
  await threeDots.click();

  const menuItem = page.locator(`xpath=${Locator[menuLocatorKey]}`);
  await expect(menuItem).toBeVisible({ timeout: CONFIG.timeout.medium });
  await menuItem.click();
}

async function clickSubItemIfEnabled(page, threeDotsLocator, menuLocatorKey, screenshotName) {
  const threeDots = page.locator(threeDotsLocator);
  await expect(threeDots).toBeVisible({ timeout: CONFIG.timeout.medium });
  await threeDots.click();

  const menuItem = page.locator(`xpath=${Locator[menuLocatorKey]}`);
  await expect(menuItem).toBeVisible({ timeout: CONFIG.timeout.medium });

  const isEnabled = await menuItem.isEnabled();
  if (isEnabled) {
    await menuItem.click();
  } else {
    await page.keyboard.press('Escape');
  }
  await verifyViewerScreenshot(page, screenshotName);
}

async function runSubItemActions(page, threeDotsLocatorKey, disciplineName) {
  const panelTitle = page.locator(`xpath=${Locator.federatedPanelTitle}`);
  await expect(panelTitle).toBeVisible({ timeout: CONFIG.timeout.medium });
  await panelTitle.scrollIntoViewIfNeeded();
  await panelTitle.click();

  await clickSubItemIfEnabled(page, Locator[threeDotsLocatorKey], 'menuLoad', `${disciplineName}-Load`);
  await clickSubItemIfEnabled(page, Locator[threeDotsLocatorKey], 'menuHide', `${disciplineName}-Hide`);
  await clickSubItemIfEnabled(page, Locator[threeDotsLocatorKey], 'menuShow', `${disciplineName}-Show`);
}

export async function structuralSubItemActions(page)     { await runSubItemActions(page, 'federatedSThreeDots', 'Structural'); }
export async function architecturalSubItemActions(page)  { await runSubItemActions(page, 'federatedAThreeDots', 'Architectural'); }
export async function mechanicalSubItemActions(page)     { await runSubItemActions(page, 'federatedHThreeDots', 'Mechanical'); }
export async function electricalSubItemActions(page)     { await runSubItemActions(page, 'federatedEThreeDots', 'Electrical'); }
export async function plumbingSubItemActions(page)       { await runSubItemActions(page, 'federatedPThreeDots', 'Plumbing'); }
export async function fireProtectionSubItemActions(page) { await runSubItemActions(page, 'federatedFThreeDots', 'FireProtection'); }

export async function federatedShowAll(page) {
  await clickFederatedMenuItem(page, 'menuShowAll');
}

export async function federatedHideAll(page) {
  await clickFederatedMenuItem(page, 'menuHideAll');
}

export async function federatedSwitchToLoadEverything(page) {
  await clickFederatedMenuItem(page, 'menuSwitchToLoadEverything');
}
