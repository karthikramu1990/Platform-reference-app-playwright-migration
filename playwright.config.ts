import { defineConfig } from '@playwright/test';
import config from './tests/reference-app/testdata/config.json';

type EnvKey = keyof typeof config.Environments;
const activeEnv = (process.env.TEST_ENV as EnvKey) || (config.Env as EnvKey);
const envConfig = config.Environments[activeEnv];

if (!envConfig) {
  throw new Error(`Unknown environment "${activeEnv}". Valid options: ${Object.keys(config.Environments).join(', ')}`);
}

export default defineConfig({
  globalTeardown: './global-teardown.ts',
  testDir: './tests',
  testIgnore: ['**/iaf-viewer/**'],
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
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
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
  outputDir: 'C:/pw-test-results/',
});
