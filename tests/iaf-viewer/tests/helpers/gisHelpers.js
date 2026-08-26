import { expect } from '@playwright/test';
import { CONFIG } from '../config';
import { Locator } from './locators';

export async function openGISPanel(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(30000);

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
    await toggle.click({ timeout: CONFIG.timeout.medium });
  }
  await expect(toggle).toBeChecked({ timeout: CONFIG.timeout.medium });

  const interactHeader = page.locator(`xpath=${Locator.gisInteractSectionHeader}`);
  await expect(interactHeader).toBeVisible({ timeout: CONFIG.timeout.medium });
}

export async function configureMapboxTempToken(page, mapbox, timeout) {
  const sectionHeading = page.locator(Locator.mapboxTempTokenConfigHeading);
  await expect(sectionHeading).toBeVisible({ timeout });
  await sectionHeading.click();

  const usernameInput = page.getByLabel('Pass your Mapbox account username');
  await expect(usernameInput).toBeVisible({ timeout });
  await usernameInput.fill(mapbox.username);

  const scopesInput = page.getByLabel(/tokens:write/);
  await scopesInput.fill(mapbox.scopes);

  const expiryInput = page.getByLabel(/expiry time in seconds/);
  await expiryInput.fill(mapbox.expiry);

  const secretTokenInput = page.getByLabel('Mapbox secret token for current model');
  await secretTokenInput.fill(mapbox.secretToken);

  const addBtn = page.getByRole('button', { name: 'Add Temp Token Config' });
  await addBtn.click();

  await expect(secretTokenInput).toHaveValue('', { timeout });
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
