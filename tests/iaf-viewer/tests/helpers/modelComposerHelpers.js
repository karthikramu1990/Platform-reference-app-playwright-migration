import { expect } from '@playwright/test';
import { CONFIG } from '../config';
import { Locator } from './locators';
import { verifyViewerScreenshot } from './appHelpers';

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
