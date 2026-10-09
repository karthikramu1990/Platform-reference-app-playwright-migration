import { test } from '@playwright/test';

test('Keep browser active', async ({ page }) => {
  const duration = 10 * 60 * 1000; // 10 minutes
  const interval = 20 * 1000;      // 20 seconds

  const startTime = Date.now();

  while (Date.now() - startTime < duration) {
    await page.keyboard.press('Space');
    await page.keyboard.press('Backspace');

    await page.waitForTimeout(interval);
  }
});