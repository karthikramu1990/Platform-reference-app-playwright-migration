import { expect } from '@playwright/test';
import { Locator } from "./locators"
import fs from 'fs';
import path from 'path';

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

  await clearAnnotations(page, annotationsBtn);

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

export async function clearAnnotations(page, annotationsBtn) {
  await annotationsBtn.click();
  const deleteAll = page.locator(`xpath=${Locator.annotationsDeleteAllMarkup}`);
  const isVisible = await deleteAll.isVisible({ timeout: 5000 }).catch(() => false);
  if (isVisible) {
    await deleteAll.click();
  }
  await annotationsBtn.click();
}

async function getCanvasPositions(canvas) {
  const box = await canvas.boundingBox();
  return {
    box,
    left:   box.x + box.width  * 0.3,
    top:    box.y + box.height * 0.25,
    cx:     box.x + box.width  * 0.5,
    cy:     box.y + box.height * 0.4,
    right:  box.x + box.width  * 0.7,
    bottom: box.y + box.height * 0.55,
  };
}

export async function drawLine(page, annotationsBtn, canvas) {
  await clearAnnotations(page, annotationsBtn);
  const { cx, cy, right, bottom } = await getCanvasPositions(canvas);

  await selectAnnotationTool(page, annotationsBtn, 'Line', 60000);
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(right, bottom);
  await releaseMouse(page, canvas, right, bottom);
}

export async function drawCircle(page, annotationsBtn, canvas) {
  await clearAnnotations(page, annotationsBtn);
  const { box, cx, cy } = await getCanvasPositions(canvas);
  const endX = cx + box.width * 0.15;

  await selectAnnotationTool(page, annotationsBtn, 'Circle', 60000);
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(endX, cy);
  await releaseMouse(page, canvas, endX, cy);
}

export async function drawRectangle(page, annotationsBtn, canvas) {
  await clearAnnotations(page, annotationsBtn);
  const { cx, cy, right, bottom } = await getCanvasPositions(canvas);

  await selectAnnotationTool(page, annotationsBtn, 'Rectangle', 60000);
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(right, bottom, { steps: 10 });
  await releaseMouse(page, canvas, right, bottom);
}

export async function drawPolygon(page, annotationsBtn, canvas) {
  await clearAnnotations(page, annotationsBtn);
  const { box, cx, cy } = await getCanvasPositions(canvas);
  const dx = box.width  * 0.1;
  const dy = box.height * 0.1;

  await selectAnnotationTool(page, annotationsBtn, 'Polygon', 60000);
  await page.waitForTimeout(500);

  await page.mouse.click(cx - dx, cy + dy);
  await page.mouse.click(cx, cy - dy);
  await page.mouse.click(cx + dx, cy + dy);
  await page.keyboard.press('Enter');
}

export async function drawPolyline(page, annotationsBtn, canvas) {
  await clearAnnotations(page, annotationsBtn);
  const { box, cx, cy } = await getCanvasPositions(canvas);
  const dx = box.width  * 0.1;
  const dy = box.height * 0.1;

  await selectAnnotationTool(page, annotationsBtn, 'Polyline', 60000);
  await page.waitForTimeout(500);

  await page.mouse.click(cx - dx, cy + dy);
  await page.mouse.click(cx, cy - dy);
  await page.mouse.click(cx + dx, cy + dy);
  await page.mouse.click(cx + dx, cy + dy, { button: 'right' });
}

export async function drawCheckDistance(page, annotationsBtn, canvas) {
  await clearAnnotations(page, annotationsBtn);
  const { left, top, cx, cy, right, bottom } = await getCanvasPositions(canvas);

  // X direction
  await selectAnnotationTool(page, annotationsBtn, 'Check Distance', 60000);
  await page.mouse.click(left, cy);
  await page.mouse.click(right, cy);

  // Y direction
  await selectAnnotationTool(page, annotationsBtn, 'Check Distance', 60000);
  await page.mouse.click(cx, top);
  await page.mouse.click(cx, bottom);
}

export async function drawLeaderNote(page, annotationsBtn, canvas) {
  await clearAnnotations(page, annotationsBtn);
  const { cx, cy } = await getCanvasPositions(canvas);

  await selectAnnotationTool(page, annotationsBtn, 'Leader Note', 60000);
  await page.waitForTimeout(500);

  await page.mouse.click(cx, cy);

  const noteInput = page.getByRole('textbox').last();
  await expect(noteInput).toBeVisible({ timeout: 10000 });
  await noteInput.click();
  await noteInput.fill('Test');
  await page.keyboard.press('Enter');
}

export async function drawText(page, annotationsBtn, canvas) {
  await clearAnnotations(page, annotationsBtn);
  const { cx, cy } = await getCanvasPositions(canvas);

  await selectAnnotationTool(page, annotationsBtn, 'Text', 60000);
  await page.waitForTimeout(500);

  await page.mouse.click(cx, cy);
  await page.waitForTimeout(500);
  await page.keyboard.type('Test');
  await page.keyboard.press('Enter');
}

export async function drawFreehand(page, annotationsBtn, canvas) {
  await clearAnnotations(page, annotationsBtn);
  const { box, cx, cy } = await getCanvasPositions(canvas);
  const r = box.width * 0.08;

  await selectAnnotationTool(page, annotationsBtn, 'Freehand', 60000);
  await page.waitForTimeout(500);

  await page.mouse.move(cx + r, cy);
  await page.mouse.down();
  await page.mouse.move(cx, cy + r, { steps: 5 });
  await page.mouse.move(cx - r, cy, { steps: 5 });
  await page.mouse.move(cx, cy - r, { steps: 5 });
  await page.mouse.move(cx + r, cy, { steps: 5 });
  await releaseMouse(page, canvas, cx + r, cy);
}

export async function drawExportAnnotations(page, annotationsBtn, canvas) {
  await clearAnnotations(page, annotationsBtn);
  const { box, cx, cy, right, bottom } = await getCanvasPositions(canvas);
  const endX = cx + box.width * 0.15;

  await selectAnnotationTool(page, annotationsBtn, 'Line', 60000);
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(right, bottom);
  await releaseMouse(page, canvas, right, bottom);

  await selectAnnotationTool(page, annotationsBtn, 'Circle', 60000);
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(endX, cy);
  await releaseMouse(page, canvas, endX, cy);
}

export async function exportAnnotations(page, annotationsBtn) {
  await annotationsBtn.click();
  const exportBtn = page.locator(`xpath=${Locator.annotationsExport}`);
  await exportBtn.scrollIntoViewIfNeeded();
  await expect(exportBtn).toBeVisible({ timeout: 10000 });

  const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
  await exportBtn.click();
  const download = await downloadPromise;

  fs.mkdirSync('tests/files', { recursive: true });
  const filePath = path.join('tests/files', 'iaf-viewer-annotations.json');
  await download.saveAs(filePath);
  return filePath;
}

export async function importAnnotations(page, annotationsBtn, filePath) {
  await annotationsBtn.click();
  const importBtn = page.locator(`xpath=${Locator.annotationsImport}`);
  await importBtn.scrollIntoViewIfNeeded();
  await expect(importBtn).toBeVisible({ timeout: 10000 });

  const fileChooserPromise = page.waitForEvent('filechooser');
  await importBtn.click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(filePath);
}


