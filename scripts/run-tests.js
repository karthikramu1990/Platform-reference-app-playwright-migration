// Runs one application's Playwright suite, or both one after the other, and exits non-zero if
// any run failed (cmd's `a & b` chaining reported only the last command's exit code).
//
//   node scripts/run-tests.js <reference-app|iaf-viewer|all> [extra playwright args]
//
// Each app keeps its own config, output folder and JUnit file; `all` is two separate runs.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const playwrightCli = require.resolve('@playwright/test/cli', { paths: [root] });

const APPS = {
  'reference-app': {
    config: 'playwright.config.ts',
    defaultArgs: [],
    before: () => fs.rmSync(path.join(root, 'allure-results'), { recursive: true, force: true }),
    after: () => spawnSync(process.execPath, [path.join(root, 'generate-allure-report.js')], { cwd: root, stdio: 'inherit' }),
  },
  'iaf-viewer': {
    config: 'tests/iaf-viewer/playwright.config.js',
    // Only chromium is maintained; 2 workers + 1 retry is what qa2 can sustain without load timeouts.
    defaultArgs: ['--project=chromium', '--workers=2', '--retries=1'],
  },
};

function run(appName, extraArgs) {
  const app = APPS[appName];
  console.log(`\n=== ${appName} ===`);
  app.before?.();
  const result = spawnSync(
    process.execPath,
    [playwrightCli, 'test', '-c', app.config, ...app.defaultArgs, ...extraArgs],
    { cwd: root, stdio: 'inherit' },
  );
  app.after?.();
  return result.status ?? 1;
}

const [target, ...extraArgs] = process.argv.slice(2);
const targets = target === 'all' ? Object.keys(APPS) : [target];

if (!targets.every(name => APPS[name])) {
  console.error(`Usage: node scripts/run-tests.js <${[...Object.keys(APPS), 'all'].join('|')}> [playwright args]`);
  process.exit(2);
}

const failed = targets.filter(name => run(name, extraArgs) !== 0);
if (failed.length) console.error(`\nFailed: ${failed.join(', ')}`);
process.exit(failed.length ? 1 : 0);
