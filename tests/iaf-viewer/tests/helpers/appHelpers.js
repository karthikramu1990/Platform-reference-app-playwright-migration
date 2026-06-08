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

  // const projectDropdown = page.locator('.select__control');
  const projectDropdown = page.locator('input[name="projectSelect"]').locator('..').locator('.select__control');
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

export async function waitForApplicationLoad(page, timeout = CONFIG.timeout.medium) {
  await page.locator('#modelSpinner').waitFor({
    state: 'visible',
    timeout: CONFIG.timeout.short
  }).catch(() => {});

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
    await openPanel(page, CONFIG.timeout.medium, panel);
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

export async function waitForCuttingPlaneEnabled(page, timeout) {
  const cuttingPlaneButton = page.getByLabel(Locator.cuttingPlane);

  await expect(cuttingPlaneButton).toBeVisible({ timeout });
  await expect(cuttingPlaneButton).not.toHaveClass(/disabled/, { timeout });

  await cuttingPlaneButton.click();

  return cuttingPlaneButton;
}

export async function waitForGISEnabled(page, timeout) {
  const gisBtn = await page.locator(Locator.gisViewerBtn).first()

  await expect(gisBtn).toBeVisible({ timeout });
  await expect(gisBtn).not.toHaveClass(/disabled/, { timeout });

  await gisBtn.click();

  return gisBtn;
}

export async function displayAccuracyRange(page) {
  const wrapper = page.getByTestId("display-accuracy-slider");
  await expect(wrapper).toBeVisible();
  return wrapper.locator('input[type="range"]').first();
}

export async function setRangeValue(locator, value) {
  await expect(locator).toBeVisible();
  await locator.evaluate((el, val) => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    )?.set;

    setter?.call(el, val);

    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
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

export async function verifyViewerScreenshot(page, name, canvasContainer = Locator.viewer3D, settleMs = 10000) {
  await waitForApplicationLoad(page, 120000);

  await page.waitForTimeout(settleMs);

  // Wait for network + rendering readiness
  await page.waitForLoadState('networkidle');

  const canvas = page.locator(canvasContainer);
  await expect(canvas).toBeVisible({ timeout: 120000 });

  // Wait until canvas has valid size
  await page.waitForFunction(() => {
    const c = document.querySelector('canvas');
    return c && c.width > 0 && c.height > 0;
  });

  // freeze rendering if possible
  await page.evaluate(() => {
    if (window.viewer?.pause) {
      window.viewer.pause();
    }
  });

  // Screenshot with proper timeout
  await expect(canvas).toHaveScreenshot(`${name}.png`, {
    maxDiffPixelRatio: 0.03,
    timeout: 30000
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

export async function setSliderByAria(slider, ratio = 0.5) {
  await expect(slider).toBeVisible();

  const min = parseFloat(await slider.getAttribute('min'));
  const max = parseFloat(await slider.getAttribute('max'));

  const value = min + (max - min) * ratio;

  // console.log("actual", min, max, value);


  // More reliable than fill for MUI sliders
  await slider.evaluate((el, val) => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    )?.set;

    setter?.call(el, val);

    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);

  // const actual = parseFloat(await slider.inputValue());
  // console.log("actual", value, actual);
  // const tolerance = 0.05;
  // console.log("s", actual , value)
  // // expect(Math.abs(actual - value)).toBeLessThanOrEqual(tolerance);
}

export const getToggle = (container, label) =>
  container
    .locator('div[class*="IafSwitch-module_switch-title"]', { hasText: label })
    .locator('xpath=ancestor::div[.//input[@type="checkbox"]][1]')
    .locator('span.MuiSwitch-switchBase input');

export const getSlider = (container, label) =>
  container
    .locator(`text=${label}`)
    .locator('xpath=ancestor::div[.//input[@type="range"]][1]')
    .locator('input[type="range"]');

export const ensureToggle = async (toggle, state) => {
  if ((await toggle.isChecked()) !== state) {
    await toggle.click({ force: true });
  }
  state ? await expect(toggle).toBeChecked() : await expect(toggle).not.toBeChecked();
};

export const expectSliders = async (container, planes, enabled) => {
  for (const plane of planes) {
    const slider = getSlider(container, plane);
    await expect(slider).toBeVisible();

    if (enabled) {
      await expect(slider).toBeEnabled();
    } else {
      const disabled =
        (await slider.isDisabled()) ||
        (await slider.getAttribute('aria-disabled')) === 'true';
      expect(disabled).toBeTruthy();
    }
  }
};

export async function waitForGraphicsSettle(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

export async function selectElementOnCanvas(page, canvas,options = {}) {
  const { timeout = 5000, xRatio = 0.45, yRatio = 0.4 } = options;

  // wait for canvas
  await expect(canvas).toBeVisible({ timeout });

  // get bounds
  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error('Canvas bounding box is null');
  }

  // calculate click position
  const cx = box.x + box.width * xRatio;
  const cy = box.y + box.height * yRatio;

  // click
  await page.mouse.click(cx, cy);
}

export async function setupAndClickModel(page) {
  await page.goto(CONFIG.url);
  await login(page, CONFIG.credentials, CONFIG.timeout.medium);
  await selectProject(page, CONFIG.project, "Navigator", CONFIG.timeout.medium);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await page.waitForTimeout(20000);

  const canvas = page.locator(Locator.viewer3D);
  await expect(canvas).toBeVisible({ timeout: 60000 });
  await page.locator('#modelSpinner').waitFor({ state: 'hidden', timeout: 60000 });

  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();

  const cx = box.x + box.width;
  const cy = box.y + box.height;

  await page.mouse.click(cx * 0.45, cy * 0.4);
}

export async function verifyGISScreenshot(page, name) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);

  const interactHeader = page.locator(`xpath=${Locator.gisInteractSectionHeader}`);
  await expect(interactHeader).toBeVisible({ timeout: 60000 });

  await expect(page).toHaveScreenshot(`${name}.png`, {
    maxDiffPixelRatio: 0.03,
    timeout: 30000
  });
}

export async function verifyAnnotationScreenshot(page, name) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  await expect(page).toHaveScreenshot(`${name}.png`, {
    maxDiffPixelRatio: 0.03,
    timeout: 30000
  });
}

export async function captureAnnotationScreenshot(page, name) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  const snapshotPath = `tests/snapshots/annotations.spec.js/${name}-chromium.png`;
  await page.screenshot({ path: snapshotPath });
}

export async function setSliderValue(page, label, value) {
  const sliderInput = page.locator(`xpath=//div[text()="${label}"]/following::input[@type="range"][1]`).first();
  await expect(sliderInput).toBeAttached({ timeout: CONFIG.timeout.medium });

  const min = parseFloat(await sliderInput.getAttribute('min') ?? '0');
  const max = parseFloat(await sliderInput.getAttribute('max') ?? '100');
  const clamped = Math.max(min, Math.min(max, value));

  const rail = page.locator(`xpath=//div[text()="${label}"]/following::span[contains(@class,"MuiSlider-rail")][1]`);
  await expect(rail).toBeVisible({ timeout: CONFIG.timeout.medium });

  const box = await rail.boundingBox();
  const margin = 5;
  const targetX = box.x + margin + ((box.width - 2 * margin) * (clamped - min) / (max - min));
  const targetY = box.y + box.height / 2;

  await page.mouse.click(targetX, targetY);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
}
