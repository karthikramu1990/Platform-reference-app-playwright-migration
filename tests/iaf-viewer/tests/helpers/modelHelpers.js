import { expect } from '@playwright/test';
import { waitForAnySpinnerVisible, waitForSpinnersHidden } from './spinner.js';

export const LayerType = {
    Structural: "Structural"
  , Architectural: "Architectural"
  , Mechanical: "Mechanical"
  , Electrical: "Electrical"
  , Plumbing: "Plumbing"
  , GUIHelper: "isEnableComposerHelper"
};

export async function switchModel(page, modelName, timeout) {

    await page.locator('.navigator-bottom-search').first().click();

    await page.locator('.models-container').locator('input').first().click();

    const option = page.getByRole('option', { name: modelName });
    await expect(option).toBeVisible({ timeout });
    await option.click();

    const changeBtn = page.getByRole('button', { name: 'Change model' });
    await expect(changeBtn).toBeVisible({ timeout });
    await changeBtn.click();

    // Give the switch a moment to start loading, then wait for every viewer's spinner to clear.
    await waitForAnySpinnerVisible(page, 15000);
    await waitForSpinnersHidden(page, 120000);
}