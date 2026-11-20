import { expect } from '@playwright/test';

// Some projects (e.g. "BIAL T2 Skinny" on qa2) render more than one viewer container, each with its
// own #modelSpinner, so a plain locator('#modelSpinner').waitFor() fails with a strict-mode violation.
// These helpers work for any number of spinners.

// Waits until no #modelSpinner is visible.
export async function waitForSpinnersHidden(page, timeout) {
  await expect(page.locator('#modelSpinner').filter({ visible: true })).toHaveCount(0, { timeout });
}

// Waits for any #modelSpinner to become visible (resolves false instead of throwing on timeout).
export async function waitForAnySpinnerVisible(page, timeout) {
  return page.locator('#modelSpinner').filter({ visible: true }).first()
    .waitFor({ state: 'visible', timeout })
    .then(() => true, () => false);
}
