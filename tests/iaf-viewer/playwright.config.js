// @ts-check
import { defineConfig, devices } from '@playwright/test';
const isMac = process.platform === 'darwin';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// TEST_ENV selects the environment like it does for the Reference App; tests/config.js reads it as
// IAFVIEWER_ENVIRONMENT, so TEST_ENV overrides the value from .env.
if (process.env.TEST_ENV) process.env.IAFVIEWER_ENVIRONMENT = process.env.TEST_ENV;
const env = (process.env.IAFVIEWER_ENVIRONMENT
  || JSON.parse(fs.readFileSync(path.resolve(__dirname, '../reference-app/config/environments.json'), 'utf8')).Env)
  .toUpperCase();

// scripts/run-tests.js sets RUN_DIR to this run's folder (reports/iaf-viewer/<ENV>/<time>) and writes
// the run summary there; a plain `npx playwright test` reports to reports/iaf-viewer/<ENV>/adhoc instead.
const runDir = process.env.RUN_DIR || path.resolve(__dirname, '../../reports/iaf-viewer', env, 'adhoc');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  outputDir: path.resolve(__dirname, '../../artifacts/iaf-viewer'),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: path.join(runDir, 'report'), open: 'never' }],
    ['junit', { outputFile: path.join(runDir, 'junit.xml') }],
    ['list'],
    // Counts for run-summary.json (the JSON reporter is the only one that reports flaky tests).
    ...(process.env.RUN_DIR ? [['json', { outputFile: path.join(runDir, '.results.json') }]] : []),
  ],
  snapshotPathTemplate: '{testDir}/snapshots/{testFileName}/{arg}-{projectName}{ext}',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',
     ...devices['Desktop Chrome'],
    viewport: {
      width: 1920, height: 1080
    },
    deviceScaleFactor: 2,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    launchOptions: {
      args: [
        isMac ? '--use-angle=metal' : '--use-angle=d3d11',
        '--enable-gpu',
        '--ignore-gpu-blocklist',
        '--enable-zero-copy',
        '--enable-features=VaapiVideoDecoder,CanvasOopRasterization',
        '--disable-features=UseSkiaRenderer',
        '--enable-gpu-compositing',
        '--enable-threaded-compositing',
      ],
      // channel: 'chrome'
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

