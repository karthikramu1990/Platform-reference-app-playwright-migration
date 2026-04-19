import { defineConfig } from '@playwright/test';
import config from './tests/reference-app/testdata/config.json';

export default defineConfig({
  globalTeardown: './global-teardown.ts',
  testDir: './tests',
  snapshotDir: './imagevalidation',
  snapshotPathTemplate: '{snapshotDir}/{arg}{ext}',
  timeout: 300000,
  expect: { timeout: 30000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [
    ['allure-playwright', {
      detail: false,
      outputFolder: './allure-results',
      suiteTitle: true,
      attachmentsBaseDirectory: './allure-results'
    }],
['list']
  ],
  use: {
    baseURL: config.Environments[config.Env].RfUrl,
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
  outputDir: 'C:/pw-test-results/',
});
