import { expect } from '@playwright/test';

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

    const spinners = page.locator('#modelSpinner');
    const count = await spinners.count();

    for (let i = 0; i < count; i++) {
        await spinners.nth(i).waitFor({
            state: 'hidden',
            timeout: 120000
        });
    }
}