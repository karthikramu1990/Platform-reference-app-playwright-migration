import { expect } from '@playwright/test';
import { CONFIG } from '../config';
import { Locator } from "./locators"

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

  const projectDropdown = page.locator('.select__control').first();
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
    state: 'visible',
    timeout: CONFIG.timeout.short
  }).catch(() => {});

  await page.locator('#modelSpinner').waitFor({
    state: 'hidden',
    timeout
  });
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



