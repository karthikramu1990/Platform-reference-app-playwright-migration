// Release 5.2 (Graphics / iaf-viewer) — PLG ticket automation.
//
// Convention: one test() per PLG ticket/scenario, all collected in this file
// for the release. Before writing a new test:
//   1. Check tests/helpers/*.js (appHelpers, gisHelpers, modelHelpers,
//      modelComposerHelpers, annotationHelpers, viewerHelpers) for an
//      existing reusable function that already does what the ticket needs.
//   2. Check tests/helpers/locators.js for an existing Locator entry before
//      writing a new selector.
//   3. Only add a brand-new helper function (in the matching *Helpers.js
//      file) or a new Locator entry if nothing reusable already covers it —
//      follow the same style as the existing functions in that file
//      (accept `page` first, use CONFIG.timeout.*, use expect(...).toBeVisible
//      with a timeout before interacting, etc.).
//
// Each test should:
//   - call test.setTimeout(CONFIG.timeout.long) first (matches the rest of
//     the suite — viewer/model loads are slow).
//   - call setup(page) (or setupAndClickModel(page) if the scenario needs an
//     element pre-selected) to log in, pick the project, and land on Navigator.
//   - drive the scenario using helpers, not raw locators, wherever a helper
//     already exists.
//   - end with a verify*Screenshot helper (verifyViewerScreenshot /
//     verifyGISScreenshot / verifyAnnotationScreenshot / etc.) when the
//     ticket is about visual/rendering behavior, or explicit expect(...)
//     assertions when it's about functional/state behavior.

import { test, expect } from './baseTest.js';
import { CONFIG } from '../config.js';
import {
  setup,
  setupAndClickModel,
  setupWithAccount,
  waitForApplicationLoad,
  verifyViewerScreenshot,
  measureElapsed,
} from '../helpers/appHelpers.js';
import { switchModel } from '../helpers/modelHelpers.js';
import { Locator } from '../helpers/locators.js';
import {
  goToWorkflowScreen,
  selectWorkflow,
  goLive,
  stopLive,
  assertActionLogContains,
  assertClockIsAdvancing,
  assertCanvasIsAnimating,
} from '../helpers/workflow2DHelpers.js';

// ── PLG-1471 - Review initial loading performance of BIAL T2 project ────
// Regression check for large federated model load time. Does not cover
// console-error checking (known pre-existing noise) or cross-app perf
// comparison vs Digital Twin (no shared login/threshold for that).
test.skip('PLG-1471 - T2-ELEC-Federated model loads correctly', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.skinnyBial.credentials, CONFIG.skinnyBial.project, CONFIG.skinnyBial.userGroup);

  const loadTimeMs = await measureElapsed(() =>
    switchModel(page, CONFIG.skinnyBial.switchModel, CONFIG.timeout.long)
  );

  console.log(`PLG-1471: "${CONFIG.skinnyBial.switchModel}" loaded in ${loadTimeMs} ms`);
  test.info().annotations.push({
    type: 'load-time-ms',
    description: String(loadTimeMs),
  });

  await verifyViewerScreenshot(page, 'PLG-1471-T2-ELEC-Federated-Loaded');
});

// ── PLG-1417 - Review 2D Animations in Multisheet environment ───────────
// No multisheet project available, so this uses the single-sheet
// "autocad 2D animations" project instead. Canvas isn't DOM-locatable,
// so this checks Go Live state + Action Log entry + clock advancement +
// a multi-frame canvas diff as proxies for "the animation is live".
// Requires Proj Admin (Workflow nav item is hidden otherwise).
test('PLG-1417 - 2D animation workflow goes live and animates correctly', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.autocad2D.credentials, CONFIG.autocad2D.project, CONFIG.autocad2D.userGroup);
  await goToWorkflowScreen(page);

  await selectWorkflow(page, CONFIG.autocad2D.workflow);
  await goLive(page);

  await assertActionLogContains(page, 'Activating workflow');
  await assertClockIsAdvancing(page, 5000);
  await assertCanvasIsAnimating(page, Locator.viewer2D, 4, 1500);

  await stopLive(page);
});
