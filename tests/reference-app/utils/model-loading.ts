import { Page, expect } from '@playwright/test';

// Waits until the model has finished loading. Two details matter:
// - The 3D and 2D viewers each render a spinner with the same id, so wait until none is visible
//   (a single-element wait fails on the duplicate id).
// - The spinner appears a moment after a model starts loading, so checking straight away sees
//   "not visible" and returns too early; give it a chance to show first.
export async function waitForModelLoaded(page: Page, timeout = 600000): Promise<void> {
  const visibleSpinners = page.locator('#modelSpinner:visible');
  await visibleSpinners.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  await expect(visibleSpinners).toHaveCount(0, { timeout });
}
