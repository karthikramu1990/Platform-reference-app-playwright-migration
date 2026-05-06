import { expect } from '@playwright/test';
import { Locator } from "./locators"

export function toolRow(page, label) {
  return page.getByText(label, { exact: true }).locator('xpath=..');
}

export async function selectAnnotationTool(page, annotationsBtn, label, timeout) {
  await annotationsBtn.click();

  const tool = toolRow(page, label);
  await tool.scrollIntoViewIfNeeded();
  await expect(tool).toBeVisible({ timeout });

  await tool.click();
}

export async function runAnnotations(page) {
  const annotationsBtn = page.locator(Locator.annotationsBtn);
  await expect(annotationsBtn).toBeVisible({ timeout: 60000 });
  await expect(annotationsBtn).not.toHaveClass(/disabled/, { timeout: 120000 });

  const toolRow = (label) => page.getByText(label, { exact: true }).locator('xpath=..');

  async function selectAnnotationTool(toolLabel) {
    await annotationsBtn.click();
    const tool = toolRow(toolLabel);
    await tool.scrollIntoViewIfNeeded();
    await expect(tool).toBeVisible({ timeout: 60000 });
    await tool.click();
  }

  const canvas = page.locator(Locator.viewer3D);
  await expect(canvas).toBeVisible({ timeout: 60000 });

  await page.locator('#modelSpinner').waitFor({ state: 'hidden', timeout: 60000 });

  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();

  const cx = box.x + box.width * 0.5;
  const cy = box.y + box.height * 0.4;
  const left = box.x + box.width * 0.3;
  const right = box.x + box.width * 0.7;
  const top = box.y + box.height * 0.25;
  const bottom = box.y + box.height * 0.55;

  async function releaseMouseAt(x, y) {
    await page.mouse.move(x, y);
    await page.mouse.up();
    await canvas.dispatchEvent('pointerup', { clientX: x, clientY: y });
    await canvas.dispatchEvent('mouseup', { clientX: x, clientY: y });
  }

  // LINE
  await selectAnnotationTool('Line');
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(right, bottom);
  await releaseMouseAt(right, bottom);

  // DISTANCE
  await selectAnnotationTool('Check Distance');
  await page.mouse.click(left, top);
  await page.mouse.click(right, bottom);

  // CIRCLE
  await selectAnnotationTool('Circle');
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + box.width * 0.15, cy);
  await releaseMouseAt(cx + box.width * 0.15, cy);

  // RECTANGLE
  await selectAnnotationTool('Rectangle');
  await page.mouse.move(left, top);
  await page.mouse.down();
  await page.mouse.move(right, bottom);
  await releaseMouseAt(right, bottom);

  // NOTE
  await selectAnnotationTool('Leader Note');
  await page.mouse.click(cx, cy);

  const noteInput = page.getByRole('textbox').last();
  await noteInput.fill('Test note');

  // await canvas.screenshot({
  //   quality: 100,
  //   path: `screenshots/annotation-${Date.now()}.jpeg`,
  //   scale: 'device'
  // });

  await expect(canvas).toHaveScreenshot('annotations.png', {
    maxDiffPixelRatio: 0.02
  });
}

export async function releaseMouse(page, canvas, x, y) {
  await page.mouse.move(x, y);
  await page.mouse.up();

  await canvas.dispatchEvent('pointerup', { clientX: x, clientY: y, button: 0, buttons: 0 });
  await canvas.dispatchEvent('mouseup', { clientX: x, clientY: y, button: 0, buttons: 0 });
}
