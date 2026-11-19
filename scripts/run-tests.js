// Runs one application's Playwright suite and exits non-zero if it failed.
//
//   node scripts/run-tests.js <reference-app|new-user|iaf-viewer|all> [env] [extra playwright args]
//
// env (e.g. qa2, qa1, staging) selects the environment; without it the default from
// environments.json (Reference App) or IAFVIEWER_ENVIRONMENT in .env (IAF Viewer) is used.
// The npm scripts are the usual way in:  npm run ref:regression -- qa2
//
// Every app run gets one self-contained folder (see report-paths.js):
//   reports/<app>/<ENV>/<yyyy-mm-dd_hh-mm-ss>/  report/, junit.xml, run-summary.json
// which is then copied to reports/<app>/<ENV>/latest/.
const { spawnSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { ROOT, resolveEnv, envDir, latestDir, timestamp } = require('./report-paths');
const { generateAllureReport } = require('./allure-report');

require('dotenv').config({ path: path.join(ROOT, '.env') });

const playwrightCli = require.resolve('@playwright/test/cli', { paths: [ROOT] });

const APPS = {
  'reference-app': {
    config: 'playwright.config.ts',
    defaultArgs: [],
    allure: true,
  },
  // New user > Console admin access > create project > every spec as that user > Console removal.
  // Creates real users, so it's only run explicitly (npm run ref:regression:newuser), never by `all`.
  'new-user': {
    config: 'playwright.new-user.config.ts',
    reportApp: 'reference-app', // its reports go with the Reference App's: reports/reference-app/<ENV>/
    defaultArgs: [],
    allure: true,
  },
  'iaf-viewer': {
    config: 'tests/iaf-viewer/playwright.config.js',
    // Only chromium is maintained; 2 workers + 1 retry is what qa2 can sustain without load timeouts.
    defaultArgs: ['--project=chromium', '--workers=2', '--retries=1'],
  },
  // Same viewer suite, but rewrites every screenshot baseline (npm run viewer:regression:update).
  // Its report is kept under reports/iaf-viewer/<ENV>/<time>/ but never copied to latest/, so an
  // update run can't replace the regression results that xray:upload:viewer sends.
  'iaf-viewer-update': {
    config: 'tests/iaf-viewer/playwright.config.js',
    reportApp: 'iaf-viewer',
    defaultArgs: ['--project=chromium', '--workers=2', '--retries=1', '--update-snapshots=all'],
    skipLatest: true,
  },
};

function git(args) {
  try {
    return execSync(`git ${args}`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
}

// Counts come from Playwright's JSON reporter (the only one that reports flaky tests); the
// configs write it to RUN_DIR/.results.json when RUN_DIR is set, and it's removed here.
function writeSummary(app, env, runDir, startedAt) {
  const resultsFile = path.join(runDir, '.results.json');
  let stats = null;
  try {
    stats = JSON.parse(fs.readFileSync(resultsFile, 'utf8')).stats;
  } catch {
    console.error(`No Playwright results at ${resultsFile}; run-summary.json will have no counts.`);
  }
  fs.rmSync(resultsFile, { force: true });

  const count = key => (stats ? stats[key] : null);
  const summary = {
    app,
    env: env.toUpperCase(),
    branch: git('rev-parse --abbrev-ref HEAD'),
    commit: git('rev-parse --short HEAD'),
    startedAt: startedAt.toISOString(),
    durationSec: Math.round((Date.now() - startedAt.getTime()) / 1000),
    passed: count('expected'),
    failed: count('unexpected'),
    flaky: count('flaky'),
    skipped: count('skipped'),
    total: stats ? stats.expected + stats.unexpected + stats.flaky + stats.skipped : null,
  };
  fs.writeFileSync(path.join(runDir, 'run-summary.json'), JSON.stringify(summary, null, 2) + '\n');
  return summary;
}

function run(appName, extraArgs) {
  const app = APPS[appName];
  const reportApp = app.reportApp || appName;
  const env = resolveEnv(reportApp);
  const startedAt = new Date();
  const runDir = path.join(envDir(reportApp, env), timestamp(startedAt));
  fs.mkdirSync(runDir, { recursive: true });
  console.log(`\n=== ${appName} (${env.toUpperCase()}) ===\nRun folder: ${runDir}\n`);

  if (app.allure) fs.rmSync(path.join(ROOT, 'allure-results'), { recursive: true, force: true });

  const result = spawnSync(
    process.execPath,
    [playwrightCli, 'test', '-c', app.config, ...app.defaultArgs, ...extraArgs],
    { cwd: ROOT, stdio: 'inherit', env: { ...process.env, TEST_ENV: env, RUN_DIR: runDir } },
  );

  if (app.allure) {
    try {
      generateAllureReport(runDir, env);
    } catch (e) {
      console.error(`Allure report generation failed: ${e.message}`);
    }
  }
  const summary = writeSummary(appName, env, runDir, startedAt);

  const latest = latestDir(reportApp, env);
  if (!app.skipLatest) {
    fs.rmSync(latest, { recursive: true, force: true });
    fs.cpSync(runDir, latest, { recursive: true });
  }

  console.log(`\n${appName}: ${summary.passed ?? '?'} passed, ${summary.failed ?? '?'} failed, `
    + `${summary.flaky ?? '?'} flaky, ${summary.skipped ?? '?'} skipped`);
  console.log(`Report: ${path.join(runDir, 'report', 'index.html')}`);
  if (!app.skipLatest) console.log(`Latest: ${latest}`);
  return result.status ?? 1;
}

const [target, ...rest] = process.argv.slice(2);
// The first argument after the app is the environment unless it is a Playwright flag (-g, --headed ...).
if (rest.length && !rest[0].startsWith('-')) process.env.TEST_ENV = rest.shift().toLowerCase();
const extraArgs = rest;
const targets = target === 'all' ? ['reference-app', 'iaf-viewer'] : [target];

if (!targets.every(name => APPS[name])) {
  console.error(`Usage: node scripts/run-tests.js <${[...Object.keys(APPS), 'all'].join('|')}> [playwright args]`);
  process.exit(2);
}

const failed = targets.filter(name => run(name, extraArgs) !== 0);
if (failed.length) console.error(`\nFailed: ${failed.join(', ')}`);
process.exit(failed.length ? 1 : 0);
