import { expect } from '@playwright/test';
import { CONFIG } from '../config';
import { Locator } from './locators';

export async function openGISPanel(page) {
  const gisMenu = page.locator(`xpath=${Locator.gisMenu}`);
  await expect(gisMenu).toBeVisible({ timeout: CONFIG.timeout.medium });
  await gisMenu.click();

  const enableToggle = page.locator(`xpath=${Locator.enableGISToggle}`);
  await expect(enableToggle).toBeVisible({ timeout: CONFIG.timeout.medium });
}

export async function enableGIS(page) {
  const toggle = page.locator(`xpath=${Locator.enableGISToggle}`);
  await expect(toggle).toBeVisible({ timeout: CONFIG.timeout.medium });
  const isChecked = await toggle.isChecked();
  if (!isChecked) {
    await toggle.click();
  }
  await expect(toggle).toBeChecked({ timeout: CONFIG.timeout.medium });

  // Wait until GIS panel content is fully loaded
  const interactHeader = page.locator(`xpath=${Locator.gisInteractSectionHeader}`);
  await expect(interactHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
}

export async function disableGIS(page) {
  const toggle = page.locator(`xpath=${Locator.enableGISToggle}`);
  await expect(toggle).toBeVisible({ timeout: CONFIG.timeout.medium });
  const isChecked = await toggle.isChecked();
  if (isChecked) {
    await toggle.click();
  }
  await expect(toggle).not.toBeChecked({ timeout: CONFIG.timeout.medium });
}
