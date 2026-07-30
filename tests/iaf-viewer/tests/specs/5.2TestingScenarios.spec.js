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

// ── PLG-XXXX - <ticket title> ────────────────────────────────────────────
// test('PLG-XXXX - <short scenario description>', async ({ page }) => {
//   test.setTimeout(CONFIG.timeout.long);
//   await setup(page);
//   await waitForApplicationLoad(page, CONFIG.timeout.medium);
//   // ... scenario steps using reusable helpers ...
// });

// ── PLG-1471 - Review initial loading performance of BIAL T2 project ────
// Support ticket: switching to the large T2-ELEC-Federated model must load
// in a reasonable amount of time.
// Verified manually in qa2 by Karthik Ramu (ticket closed) — this is a
// regression test so a future performance regression on this large
// federated model gets caught automatically instead of relying on another
// manual pass.
//
// Covers (from the linked Xray tests):
//   PLG-2732 - Verify Initial Model Load Time in Reference App for Large Project
// Does NOT cover PLG-2734 (Verify Reference App Loads Large Project Without
// Errors or Timeouts) — console-error checking was dropped from this test
// (2026-07-29); the model consistently logs known 404/401 resource errors
// and a "No entity data" error on load that are being tracked separately,
// not as part of this test.
// Does NOT cover PLG-2733 (Compare Initial Loading Performance: Reference App
// vs Digital Twin) — that requires driving a second, separate application
// (digitaltwin.invicara.io) that this framework has no login/config/helpers
// for, and "compare performance across two apps" has no defined pass/fail
// threshold, so it isn't a good fit for an automated assertion here. Flagged
// as a manual/exploratory check instead.
test('PLG-1471 - T2-ELEC-Federated model loads correctly', async ({ page }) => {
  test.setTimeout(CONFIG.timeout.long);

  await setupWithAccount(page, CONFIG.skinnyBial.credentials, CONFIG.skinnyBial.project);

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
