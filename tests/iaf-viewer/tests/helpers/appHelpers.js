import { expect } from '@playwright/test';
import { CONFIG } from '../config';
import { Locator } from "./locators"
import { LayerType } from './modelHelpers';

export async function login(page, credentials, timeout) {
  const emailInput = page.getByRole('textbox', { name: 'Enter your email address' });
  await expect(emailInput).toBeVisible({ timeout });
  await emailInput.fill(credentials.email);

  const loginBtn = page.getByRole('button', { name: 'Login' });
  await loginBtn.click();

  const passwordInput = page.getByRole('textbox', { name: 'Password' });
  await expect(passwordInput).toBeVisible({ timeout });
  await passwordInput.fill(credentials.password);

  await page.getByRole('button', { name: 'Login' }).click();
}

export async function selectProject(page, projectName, path, timeout) {
  await expect(page.getByText('Project Selection')).toBeVisible({ timeout });

  const projectDropdown = page.locator('.select__control');
  await projectDropdown.click();

  const projectOption = page.getByRole('option', { name: projectName });
  await expect(projectOption).toBeVisible({ timeout });
  await projectOption.click();

  const loadProjectBtn = page.getByRole('button', { name: 'Load Project' });
  await expect(loadProjectBtn).toBeVisible({ timeout: 15000 });
  await loadProjectBtn.click();

  const navigatorHeading = page.getByRole('heading', { name: path });
  await expect(navigatorHeading).toBeVisible({ timeout: 60000 });
  await navigatorHeading.click();
}

export async function waitForApplicationLoad(page, timeout) {
  await page.locator('#modelSpinner').waitFor({
    state: 'hidden',
    timeout
  });
}

export async function openPanel(page, timeout, panel = "model", ) {
  const cfg = getPanels(page, panel);

  // const ready = page.getByTestId(cfg.ready);
  const ready = await cfg.ready;


  // already open
  if (await ready.isVisible().catch(() => false)) return;

  // const btn = page.getByTestId(cfg.btn);
  const btn = await page.locator(cfg.btn);


  await expect(btn).toBeVisible({ timeout });
  await expect(btn).not.toHaveClass(/disabled/, { timeout });

  await btn.click();

  await expect(ready).toBeVisible({ timeout });
}

export const getPanels = (page, panelName) => {
  const panels = {
    model: {
      btn: Locator.modelcomposerBtn,
      ready: page.locator('xpath=//div[text()="Display Accuracy"]/ancestor::div[2]//input[@type="range"]').first()
    },

    annotations: {
      btn: Locator.annotationsBtn,
      ready: page.locator('[class*="viewerSubMenu"]')
        .getByText('Check Distance', { exact: true })
    }
  };

  return panels[panelName];
};

export async function setup(page, panel = null) {
  await page.goto(CONFIG.url);
  await login(page, CONFIG.credentials, CONFIG.timeout.medium);
  await selectProject(page, CONFIG.project, "Navigator", CONFIG.timeout.medium);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  if(panel){
    await openPanel(page, CONFIG.timeout.long, panel);
  }
}

export function getDropdown(page, label) {
  return page.locator(
    `.ipa-select:has(label:has-text("${label}")) .ipa-select__control`
  );
}

export async function openDrawer(page, trigger, text) {
  await trigger.click();

  const openDrawer = await page.locator('.drawer-content.drawer-content-open').filter({
    has: page.getByText(text)
  });

  await expect(openDrawer).toBeVisible({ timeout: CONFIG.timeout.medium });

  return openDrawer.first();
}

export async function closeDrawer(page, trigger, text) {
  const openDrawer = await page.locator('.drawer-content.drawer-content-open').filter({
    has: page.getByText(text)
  }).first()
  // Ensure it's actually open before closing
  await expect(openDrawer).toHaveClass(/drawer-content-open/, {
    timeout: CONFIG.timeout.medium
  });

  await trigger.click();

  await expect(openDrawer).not.toBeVisible({ timeout: CONFIG.timeout.medium }); // or not.toHaveClass
}

export async function waitForAnnotationsEnabled(page, timeout) {
  // const annotationsBtn = page.getByTestId('annotations-submenu-btn');
  const annotationsBtn = await page.locator(Locator.annotationsBtn).first()

  await expect(annotationsBtn).toBeVisible({ timeout });
  await expect(annotationsBtn).not.toHaveClass(/disabled/, { timeout });

  return annotationsBtn;
}

export async function waitForModelcomposerEnabled(page, timeout) {
  // const modelcomposerBtn = page.getByTestId('modelcomposer-submenu');
  const modelcomposerBtn = await page.locator(Locator.modelcomposerBtn).first()

  await expect(modelcomposerBtn).toBeVisible({ timeout });
  await expect(modelcomposerBtn).not.toHaveClass(/disabled/, { timeout });

  await modelcomposerBtn.click();

  return modelcomposerBtn;
}

export async function displayAccuracyRange(page) {
  const wrapper = page.getByTestId("display-accuracy-slider");
  await expect(wrapper).toBeVisible();
  return wrapper.locator('input[type="range"]').first();
}

export async function setRangeValue(locator, value) {
  await locator.evaluate((el, v) => {
    el.value = String(v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
  await expect(locator).toHaveValue(String(value));
}

export async function verifyDisciplineStatus(page, layer, isEnabled) {
  const container = page.locator(
    'xpath=//div[normalize-space()="Disciplines"]/following-sibling::div[1]'
  );

  const checkboxes = container.locator(`input[type="checkbox"][name="${layer}"]`);
  const count = await checkboxes.count();

  for (let i = 0; i < count; i++) {
    const checkbox = checkboxes.nth(i);
    if (isEnabled) {
      await expect(checkbox).toBeEnabled({ timeout: 60000 });
    } else {
      await expect(checkbox).toBeDisabled({ timeout: 60000 });
    }
  }
}

export async function verifyAllDisciplineStatus(page, isEnabled) {
  for (const layer of Object.values(LayerType)) {
    await verifyDisciplineStatus(page, layer, isEnabled);
  }
}

export async function verifyMenuItems(page) {
  const menu = page.getByRole('menu');

  // Rename should be enabled
  const rename = menu.getByRole('menuitem', { name: 'Rename' });
  await expect(rename).toBeEnabled();

  // All other menu items should be disabled
  const items = menu.getByRole('menuitem');
  const count = await items.count();

  for (let i = 0; i < count; i++) {
    const item = items.nth(i);
    const text = await item.textContent();

    if (text?.trim() !== 'Rename') {
      await expect(item).toBeDisabled();
    }
  }
}

export async function getAllLayerKeys(page) {
  //  get the container right after "Disciplines"
  const container = page.locator(
    'xpath=//div[normalize-space()="Disciplines"]/following-sibling::div[1]'
  );

  const checkboxes = container.locator('input[type="checkbox"][name]');
  const count = await checkboxes.count();

  const keys = [];

  for (let i = 0; i < count; i++) {
    const checkbox = checkboxes.nth(i);

    await checkbox.waitFor({ state: 'attached' });

    if (await checkbox.isDisabled()) continue;

    const name = await checkbox.getAttribute('name');
    if (name) keys.push(name);
  }

  return keys;
}

export async function toggleAllLayers(page, enable = true) {
  const keys = await getAllLayerKeys(page);
  await toggleLayers(page, keys, enable);
}

export async function setAccuracy(page, quality) {
  const map = { low: 0, medium: 1, high: 2 };
  const value = map[quality];

  // const wrapper = page.getByTestId("display-accuracy-slider");
  const slider = page.locator(Locator.displayAccuracyBtn).first();
  await slider.waitFor({
    state: "visible",
    timeout: CONFIG.timeout.medium
  });

  // focus slider
  await slider.focus();

  // reset to min
  await slider.press('Home');

  // move to target
  for (let i = 0; i < value; i++) {
    await slider.press('ArrowRight');
  }

  // ✅ verify UI (IMPORTANT)
  // const label = wrapper.locator('[class*="range-value"]');
  // await expect(label).toHaveText(
  //   quality.charAt(0).toUpperCase() + quality.slice(1)
  // );
}

export async function verifyViewerScreenshot(page, name) {
  await waitForApplicationLoad(page, 120000);

  await page.waitForTimeout(10000);

  // Wait for network + rendering readiness
  await page.waitForLoadState('networkidle');

  const canvas = page.locator(Locator.viewer3D);
  await expect(canvas).toBeVisible({ timeout: 120000 });

  // Wait until canvas has valid size
  await page.waitForFunction(() => {
    const c = document.querySelector('canvas');
    return c && c.width > 0 && c.height > 0;
  });

  // OPTIONAL (BEST): freeze rendering if possible
  await page.evaluate(() => {
    if (window.viewer?.pause) {
      window.viewer.pause();
    }
  });

  // Screenshot with proper timeout
  await expect(canvas).toHaveScreenshot(`${name}.png`, {
    maxDiffPixelRatio: 0.03,   // relaxed for CI
    timeout: 30000             // VERY IMPORTANT
  });
}

export async function toggleLayers(page, keys, enable = true) {
  for (const key of keys) {
    const checkbox = page.locator(`input[type="checkbox"][name="${key}"]`);

    await expect(checkbox).toBeVisible();

    const checked = await checkbox.isChecked();

    if (checked !== enable) {
      await checkbox.click();
      await expect(checkbox).toBeChecked({ checked: enable });
    }
  }
}
