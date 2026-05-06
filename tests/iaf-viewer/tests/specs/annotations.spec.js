import { test, expect } from './baseTest.js';
import { CONFIG } from '../config.js';
import { login, selectProject, waitForApplicationLoad, waitForAnnotationsEnabled } from '../helpers/appHelpers.js';
import { runAnnotations } from '../helpers/annotationHelpers.js';

test('Annotations test', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await page.goto(CONFIG.url);

  await login(page, CONFIG.credentials, CONFIG.timeout.medium);

  await selectProject(page, CONFIG.project, "Navigator", CONFIG.timeout.medium);

  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await waitForAnnotationsEnabled(page, CONFIG.timeout.long);

  await runAnnotations(page);
});

test('Environment readiness', async ({ page }) => {
  await page.goto(CONFIG.url);

  const client = await page.context().newCDPSession(page);

  const viewport = page.viewportSize();

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 2,
    mobile: false,
  });

  const dpr = await page.evaluate(() => window.devicePixelRatio);
  console.log('DPR:', dpr);

  const result = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    let renderer = null;

    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }

    return {
      dpr: window.devicePixelRatio,
      hasWebGL: !!gl,
      renderer,
      width: window.innerWidth,
      height: window.innerHeight
    };
  });

  // WebGL must exist
  expect(result.hasWebGL).toBeTruthy();

  // DPR should be valid (Mac=2, Windows=1 or scaled)
  expect(result.dpr).toBe(2);

  // Viewport must be valid
  expect(result.width).toBeGreaterThan(0);
  expect(result.height).toBeGreaterThan(0);

  // Optional: Ensure NOT software rendering
  if (result.renderer) {
    expect(result.renderer.toLowerCase()).not.toContain('swiftshader');
  }
});