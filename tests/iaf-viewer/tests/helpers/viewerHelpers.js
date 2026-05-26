import { expect } from '@playwright/test';
import { CONFIG } from '../config';
import { Locator } from './locators';
import { waitForApplicationLoad } from './appHelpers';

export async function clickViewOption(page, locatorKey) {
  const viewToolbar = page.locator(Locator.viewToolbar);
  await expect(viewToolbar).toBeVisible({ timeout: CONFIG.timeout.medium });
  await viewToolbar.click();

  const viewOption = page.locator(`xpath=${Locator[locatorKey]}`);
  await expect(viewOption).toBeVisible({ timeout: CONFIG.timeout.medium });
  await viewOption.click();
}

export async function clickShadingOption(page, locatorKey) {
  const shadingToolbar = page.locator(Locator.shadingToolbar);
  await expect(shadingToolbar).toBeVisible({ timeout: CONFIG.timeout.medium });
  await shadingToolbar.click();

  const shadingOption = page.locator(`xpath=${Locator[locatorKey]}`);
  await expect(shadingOption).toBeVisible({ timeout: CONFIG.timeout.medium });
  await shadingOption.click();

  await waitForApplicationLoad(page, CONFIG.timeout.medium);
}

export async function openCuttingPlane(page) {
  const cuttingPlane = page.locator(Locator.cuttingPlaneToolbar);
  await expect(cuttingPlane).toBeVisible({ timeout: CONFIG.timeout.medium });
  await cuttingPlane.click();

  const standardPlanes = page.locator(`xpath=${Locator.standardPlanes}`);
  await expect(standardPlanes).toBeVisible({ timeout: CONFIG.timeout.medium });
}

export async function dragPlaneSlider(page, locatorKey, value) {
  const slider = page.locator(`xpath=${Locator[locatorKey]}`);
  await expect(slider).toBeVisible({ timeout: CONFIG.timeout.medium });

  const rail = slider.locator('.MuiSlider-rail');
  const box = await rail.boundingBox();
  const margin = 1;
  const targetX = box.x + margin + ((box.width - 2 * margin) * value / 100);
  const targetY = box.y + box.height / 2;

  await page.mouse.click(targetX, targetY);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
}

export async function selectElement(page) {
  const canvas = page.locator(Locator.viewer3D);
  await expect(canvas).toBeVisible({ timeout: 60000 });

  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();

  const cx = box.x + box.width;
  const cy = box.y + box.height;

  await page.mouse.click(cx * 0.45, cy * 0.4);

  const hasViewer = await page.evaluate(() => !!window.viewer);
  if (!hasViewer) return null;

  return page.evaluate(() => window.viewer.props.selection);
}

export async function dragLocator(page, locator, offsetX, offsetY) {
  await expect(locator).toBeVisible({ timeout: CONFIG.timeout.medium });

  const box = await locator.boundingBox();
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + offsetX, startY + offsetY, { steps: 10 });
  await page.mouse.up();
}
