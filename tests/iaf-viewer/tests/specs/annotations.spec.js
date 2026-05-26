import { test, expect } from './baseTest.js';
import { CONFIG } from '../config.js';
import { login, selectProject, setup, waitForApplicationLoad, waitForAnnotationsEnabled, verifyAnnotationScreenshot, captureAnnotationScreenshot } from '../helpers/appHelpers.js';
import { runAnnotations, selectAnnotationTool, drawCheckDistance, drawLine, drawCircle, drawRectangle, drawPolyline, drawPolygon, drawLeaderNote, drawText, drawFreehand, drawExportAnnotations, exportAnnotations, importAnnotations, clearAnnotations } from '../helpers/annotationHelpers.js';
import { Locator } from '../helpers/locators.js';

// test('Annotations test', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);

//   await page.goto(CONFIG.url);

//   await login(page, CONFIG.credentials, CONFIG.timeout.medium);

//   await selectProject(page, CONFIG.project, "Navigator", CONFIG.timeout.medium);

//   await waitForApplicationLoad(page, CONFIG.timeout.medium);

//   await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

//   await runAnnotations(page);
// });

// test('Environment readiness', async ({ page }) => {
//   await page.goto(CONFIG.url);

//   const client = await page.context().newCDPSession(page);

//   const viewport = page.viewportSize();

//   await client.send('Emulation.setDeviceMetricsOverride', {
//     width: viewport.width,
//     height: viewport.height,
//     deviceScaleFactor: 2,
//     mobile: false,
//   });

//   const dpr = await page.evaluate(() => window.devicePixelRatio);
//   console.log('DPR:', dpr);

//   const result = await page.evaluate(() => {
//     const canvas = document.createElement('canvas');
//     const gl =
//       canvas.getContext('webgl') ||
//       canvas.getContext('experimental-webgl');

//     let renderer = null;

//     if (gl) {
//       const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
//       if (debugInfo) {
//         renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
//       }
//     }

//     return {
//       dpr: window.devicePixelRatio,
//       hasWebGL: !!gl,
//       renderer,
//       width: window.innerWidth,
//       height: window.innerHeight
//     };
//   });

//   // WebGL must exist
//   expect(result.hasWebGL).toBeTruthy();

//   // DPR should be valid (Mac=2, Windows=1 or scaled)
//   expect(result.dpr).toBe(2);

//   // Viewport must be valid
//   expect(result.width).toBeGreaterThan(0);
//   expect(result.height).toBeGreaterThan(0);

//   // Optional: Ensure NOT software rendering
//   if (result.renderer) {
//     expect(result.renderer.toLowerCase()).not.toContain('swiftshader');
//   }
// });

// test('Annotations - Check Distance', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);

//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

//   const annotationsBtn = page.locator(Locator.annotationsBtn);
//   const canvas = page.locator(Locator.viewer3D);

//   await drawCheckDistance(page, annotationsBtn, canvas);
//   await verifyAnnotationScreenshot(page, 'Annotations-CheckDistance');
// });

// test('Annotations - Line', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);

//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

//   const annotationsBtn = page.locator(Locator.annotationsBtn);
//   const canvas = page.locator(Locator.viewer3D);

//   await drawLine(page, annotationsBtn, canvas);
//   await verifyAnnotationScreenshot(page, 'Annotations-Line');
// });

// test('Annotations - Circle', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);

//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

//   const annotationsBtn = page.locator(Locator.annotationsBtn);
//   const canvas = page.locator(Locator.viewer3D);

//   await drawCircle(page, annotationsBtn, canvas);
//   await verifyAnnotationScreenshot(page, 'Annotations-Circle');
// });

// test('Annotations - Rectangle', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);

//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

//   const annotationsBtn = page.locator(Locator.annotationsBtn);
//   const canvas = page.locator(Locator.viewer3D);

//   await drawRectangle(page, annotationsBtn, canvas);
//   await verifyAnnotationScreenshot(page, 'Annotations-Rectangle');
// });

// test('Annotations - Polyline', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);

//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

//   const annotationsBtn = page.locator(Locator.annotationsBtn);
//   const canvas = page.locator(Locator.viewer3D);

//   await drawPolyline(page, annotationsBtn, canvas);
//   await verifyAnnotationScreenshot(page, 'Annotations-Polyline');
// });

// test('Annotations - Polygon', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);

//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

//   const annotationsBtn = page.locator(Locator.annotationsBtn);
//   const canvas = page.locator(Locator.viewer3D);

//   await drawPolygon(page, annotationsBtn, canvas);
//   await verifyAnnotationScreenshot(page, 'Annotations-Polygon');
// });

// test('Annotations - Leader Note', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);

//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

//   const annotationsBtn = page.locator(Locator.annotationsBtn);
//   const canvas = page.locator(Locator.viewer3D);

//   await drawLeaderNote(page, annotationsBtn, canvas);
//   await verifyAnnotationScreenshot(page, 'Annotations-LeaderNote');
// });

// test('Annotations - Text', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);

//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

//   const annotationsBtn = page.locator(Locator.annotationsBtn);
//   const canvas = page.locator(Locator.viewer3D);

//   await drawText(page, annotationsBtn, canvas);
//   await verifyAnnotationScreenshot(page, 'Annotations-Text');
// });

// test('Annotations - Freehand', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);

//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

//   const annotationsBtn = page.locator(Locator.annotationsBtn);
//   const canvas = page.locator(Locator.viewer3D);

//   await drawFreehand(page, annotationsBtn, canvas);
//   await verifyAnnotationScreenshot(page, 'Annotations-Freehand');
// });

test('Annotations - Export', async ({ page }, testInfo) => {
  test.skip(testInfo.config.updateSnapshots === 'none', 'Only runs with --update-snapshots');
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

  const annotationsBtn = page.locator(Locator.annotationsBtn);
  const canvas = page.locator(Locator.viewer3D);

  await drawExportAnnotations(page, annotationsBtn, canvas);
  await captureAnnotationScreenshot(page, 'Annotations-ExportImport');
  await exportAnnotations(page, annotationsBtn);
});

test('Annotations - Import', async ({ page }, testInfo) => {
  test.skip(testInfo.config.updateSnapshots !== 'none', 'Skipped during --update-snapshots');
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);
  await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

  const annotationsBtn = page.locator(Locator.annotationsBtn);

  await importAnnotations(page, annotationsBtn, 'tests/files/iaf-viewer-annotations.json');
  await page.waitForTimeout(2000);
  await verifyAnnotationScreenshot(page, 'Annotations-ExportImport');
  await clearAnnotations(page, annotationsBtn);
});
