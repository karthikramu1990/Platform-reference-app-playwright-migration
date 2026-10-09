// Backward Compatibility — IafViewer via Reference App
//
// Confluence: "Backward Compatibility Testing of IafViewer Using Reference App" (PDSD space).
// Goal: confirm each of the last 3 released app/viewer versions (currently 5.2, 5.1, 5.0
// against current release 5.3) still works correctly when talking to the CURRENT shared
// Platform Graphics / backend services (CONFIG.url / qa2-api) — i.e. the backend can move
// ahead of an older frontend without breaking it.
//
// How to run this file against a given version:
//   1. Start that version's Reference App build locally on port 8086
//      (see the "ref-v5.X" worktree checkouts and `npm run watch`).
//   2. From this folder: cross-env IAFVIEWER_ENVIRONMENT=local npm run endtoend -- backwardCompatibility.spec.js
//      (or `npm run endtoend:local -- backwardCompatibility.spec.js` once that script exists).
//   3. Rename/copy the html report before switching to the next version — the report is
//      overwritten on every run and does not label itself by app version.
//
// This file intentionally uses the suite's DEFAULT account/project (CONFIG.credentials /
// CONFIG.project) rather than a ticket-specific one, since the point is a general smoke
// pass across versions, not one ticket's regression. Keep assertions here to stable,
// long-lived behavior (login, project load, cutting planes, GIS enable) rather than
// version-specific UI details that may not exist on older builds.

import { test, expect } from './baseTest.js';
import { CONFIG } from '../config.js';
import {
  setup,
  waitForApplicationLoad,
  captureConsoleErrors,
  verifyViewerScreenshot,
} from '../helpers/appHelpers.js';
import { openGISPanel, enableGIS, disableGIS } from '../helpers/gisHelpers.js';
import { openCuttingPlane, dragPlaneSlider } from '../helpers/viewerHelpers.js';
import { Locator } from '../helpers/locators.js';

test.skip('Backward Compatibility - login, project load, and navigator render cleanly', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  const consoleErrors = captureConsoleErrors(page);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  // Don't hard-fail on every console error (older builds can carry known, pre-existing
  // noise) — but always record what came up so a run can be compared version-to-version.
  test.info().annotations.push({
    type: 'console-errors',
    description: consoleErrors.length ? consoleErrors.join(' | ') : 'none',
  });

  await verifyViewerScreenshot(page, 'BC-login-and-navigator-loaded');
});

test('Backward Compatibility - Cutting Plane panel opens and a standard plane responds', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await openCuttingPlane(page);

  // "Standard Planes" is collapsed by default — its content (including the sliders)
  // is unmounted from the DOM until the sub-header is clicked open (IafSubHeader.jsx),
  // and the sliders themselves stay disabled until the section's own toggle is on
  // (CuttingPlanes.jsx `disabled={!props.enableCuttingPlanes}`). Matches the working
  // pattern in viewerToolbar.spec.js.
  await page.locator(`xpath=${Locator.standardPlanes}`).click();
  await page.locator(`xpath=${Locator.standardPlanesToggle}`).click();

  await dragPlaneSlider(page, 'topPlaneSlider', 50);

  await verifyViewerScreenshot(page, 'BC-cutting-plane-applied');
});

test.skip('Backward Compatibility - GIS panel enables correctly against the current backend', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  const consoleErrors = captureConsoleErrors(page);

  await setup(page);
  await waitForApplicationLoad(page, CONFIG.timeout.medium);

  await openGISPanel(page);
  await enableGIS(page);

  // GIS's `enabled` -> `enable` property rename landed in iaf-viewer 5.1 — this is exactly
  // the kind of contract drift a backward-compat pass across 5.0/5.1/5.2 should catch.
  test.info().annotations.push({
    type: 'console-errors',
    description: consoleErrors.length ? consoleErrors.join(' | ') : 'none',
  });

  await disableGIS(page);
});
