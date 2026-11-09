import { Page } from '@playwright/test';

// Waits for the model spinner to finish. The spinner appears a moment after a model starts
// loading, so checking it straight away sees "not visible" and returns too early; give it a
// chance to show first, then wait for it to go away.
export async function waitForModelLoaded(page: Page, timeout = 600000): Promise<void> {
  const spinner = page.locator('#modelSpinner');
  await spinner.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  await spinner.waitFor({ state: 'hidden', timeout });
}
