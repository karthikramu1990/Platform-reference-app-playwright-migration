import path from 'path';
import { defineConfig } from '@playwright/test';
import base from './playwright.config';

// New-user regression (npm run ref:regression:newuser -- <env>), one Playwright run in three stages,
// all from tests/reference-app/specs:
//   1. new-user-setup     00-new-user-setup: sign up > Console admin access > accept > create the project
//   2. regression         01..08, signed in as that new user
//   3. new-user-teardown  99-new-user-teardown: Console removes the admin access; runs only if every
//                         regression test passed
// The setup stage hands the user to the others through NEWUSER_STATE_FILE (set here, so workers
// inherit it). Shares the Reference App's reports and artifacts folders, so don't run it at the
// same time as the normal regression: Playwright empties artifacts/reference-app when a run starts.
const outputDir = path.join(__dirname, 'artifacts', 'reference-app');
process.env.NEWUSER_STATE_FILE = path.join(outputDir, '.new-user.json');

const chromium = base.projects![0].use;

export default defineConfig({
  ...base,
  testIgnore: [], // the base config ignores the new-user specs; each stage below picks its own files
  outputDir,
  projects: [
    { name: 'new-user-setup', testMatch: /00-new-user-setup\.spec\.ts/, use: chromium },
    { name: 'regression', testIgnore: /new-user-/, use: chromium, dependencies: ['new-user-setup'] },
    { name: 'new-user-teardown', testMatch: /99-new-user-teardown\.spec\.ts/, use: chromium, dependencies: ['regression'] },
  ],
});
