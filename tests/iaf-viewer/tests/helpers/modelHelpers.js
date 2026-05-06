import { expect } from '@playwright/test';

export const LayerType = {
    Structural: "Structural"
  , Architectural: "Architectural"
  , Mechanical: "Mechanical"
  , Electrical: "Electrical"
  , Plumbing: "Plumbing"
//   , FireProtection: "Fire Protection"
//   , Infrastructural: "Infrastructural"
//   , NoLayer: "No layer"
};

export async function switchModel(page, modelName, timeout) {

    await page.locator('.navigator-bottom-search').first().click();

    await page.locator('.models-container').locator('input').first().click();

    // select model
    const option = page.getByRole('option', { name: modelName });
    await expect(option).toBeVisible({ timeout });
    await option.click();

    // confirm change
    const changeBtn = page.getByRole('button', { name: 'Change model' });
    await expect(changeBtn).toBeVisible({ timeout });
    await changeBtn.click();

    const spinners = page.locator('#modelSpinner');
    const count = await spinners.count();

    for (let i = 0; i < count; i++) {
        await spinners.nth(i).waitFor({
            state: 'hidden',
            timeout: 120000
        });
    }
}