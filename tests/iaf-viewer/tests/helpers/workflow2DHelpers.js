import { expect } from '@playwright/test';
import { CONFIG } from '../config';
import { Locator } from './locators';

async function nativeClick(locator) {
  await locator.evaluate((el) => {
    const opts = { bubbles: true, cancelable: true, view: window };
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
  });
}

export async function goToWorkflowScreen(page, timeout = CONFIG.timeout.medium) {
  const elementMenu = page.locator(Locator.elementMenuIcon).first();
  await expect(elementMenu).toBeVisible({ timeout });

  const workflowLink = page.locator(Locator.workflowNavLink);

  let opened = false;
  for (let attempt = 0; attempt < 5 && !opened; attempt++) {
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);
    await elementMenu.hover();
    opened = await workflowLink.isVisible({ timeout: 5000 }).catch(() => false);
  }

  await expect(workflowLink).toBeVisible({ timeout });
  await workflowLink.click();

  await page.mouse.move(0, 0);
  await page.waitForTimeout(1000);
}

export async function selectWorkflow(page, workflowName, timeout = CONFIG.timeout.medium) {
  const dropdown = page.locator(Locator.workflowSelectDropdown);

  if (!(await dropdown.isVisible().catch(() => false))) {
    const filterToggle = page.locator(Locator.workflowFilterToggle);
    await expect(filterToggle).toBeVisible({ timeout });
    await nativeClick(filterToggle);
  }

  await expect(dropdown).toBeVisible({ timeout });
  await nativeClick(dropdown);

  const option = page.getByRole('option', { name: workflowName, exact: true });
  await expect(option).toBeVisible({ timeout });
  await nativeClick(option);
}

export async function goLive(page, timeout = CONFIG.timeout.medium) {
  const btn = page.locator(Locator.workflowGoLiveBtn);
  await expect(btn).toBeVisible({ timeout });
  await btn.click();

  await expect(page.locator(Locator.workflowStopLiveBtn)).toBeVisible({ timeout });

  await expect(page.locator(Locator.workflowLiveToast))
    .toBeVisible({ timeout: CONFIG.timeout.short })
    .catch(() => {
      console.log('INFO: "now live" toast was not caught before it dismissed - button-state flip already confirmed activation.');
    });
}

export async function stopLive(page, timeout = CONFIG.timeout.medium) {
  const btn = page.locator(Locator.workflowStopLiveBtn);
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
    await expect(page.locator(Locator.workflowGoLiveBtn)).toBeVisible({ timeout });
  }
}

export async function getSimulatedClockText(page, timeout = CONFIG.timeout.medium) {
  const clock = page.locator(Locator.workflowClockDisplay);
  await clock.waitFor({ state: 'attached', timeout });
  return ((await clock.textContent()) ?? '').trim();
}

export async function assertActionLogContains(page, expectedSubstring, timeout = CONFIG.timeout.medium) {
  const entries = page.locator(Locator.workflowActionLogEntries);
  await expect(entries.first()).toBeVisible({ timeout });

  const latest = (await entries.first().textContent()) ?? '';
  expect(
    latest.includes(expectedSubstring),
    `expected the most recent Action Log entry to contain "${expectedSubstring}", got: "${latest}"`
  ).toBeTruthy();
}

export async function assertClockIsAdvancing(page, waitMs = 5000, timeout = CONFIG.timeout.medium) {
  const before = await getSimulatedClockText(page, timeout);
  await page.waitForTimeout(waitMs);
  const after = await getSimulatedClockText(page, timeout);

  expect(after, `expected simulated clock to advance past "${before}" after ${waitMs}ms`).not.toBe(before);
}

export async function assertCanvasIsAnimating(page, canvasLocator = Locator.viewer2D, frames = 4, intervalMs = 1500) {
  const canvas = page.locator(canvasLocator);
  await expect(canvas).toBeVisible();

  const buffers = [];
  for (let i = 0; i < frames; i++) {
    buffers.push(await canvas.screenshot());
    if (i < frames - 1) await page.waitForTimeout(intervalMs);
  }

  let changedCount = 0;
  for (let i = 1; i < buffers.length; i++) {
    if (!buffers[i].equals(buffers[i - 1])) changedCount++;
  }

  expect(
    changedCount,
    `expected at least one visual change across ${frames} canvas frames captured ${intervalMs}ms apart`
  ).toBeGreaterThan(0);
}
