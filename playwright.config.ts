import { defineConfig, ReporterDescription } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });
import config from './tests/reference-app/config/environments.json';

type EnvKey = keyof typeof config.Environments;
const activeEnv = (process.env.TEST_ENV as EnvKey) || (config.Env as EnvKey);
const envConfig = config.Environments[activeEnv];

if (!envConfig) {
  throw new Error(`Unknown environment "${activeEnv}". Valid options: ${Object.keys(config.Environments).join(', ')}`);
}

// scripts/run-tests.js sets RUN_DIR to this run's folder (reports/reference-app/<ENV>/<time>) and
// builds the Allure report and run summary there; a plain `npx playwright test` writes its JUnit to
// reports/reference-app/<ENV>/adhoc instead.
const runDir = process.env.RUN_DIR || path.join(__dirname, 'reports', 'reference-app', activeEnv.toUpperCase(), 'adhoc');

const reporter: ReporterDescription[] = [
  ['allure-playwright', {
    detail: false,
    outputFolder: './allure-results',
    suiteTitle: true,
    attachmentsBaseDirectory: './allure-results'
  }],
  ['list'],
  ['junit', { outputFile: path.join(runDir, 'junit.xml') }],
];
// Counts for run-summary.json (the JSON reporter is the only one that reports flaky tests).
if (process.env.RUN_DIR) reporter.push(['json', { outputFile: path.join(runDir, '.results.json') }]);

export default defineConfig({
  testDir: './tests/reference-app/specs',
  snapshotDir: './imagevalidation',
  snapshotPathTemplate: '{snapshotDir}/{arg}{ext}',
  timeout: 300000,
  expect: { timeout: 30000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter,
  use: {
    baseURL: envConfig.RfUrl,
    headless: config.Headless === 'yes',
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],
  outputDir: path.join(__dirname, 'artifacts', 'reference-app'),
});
