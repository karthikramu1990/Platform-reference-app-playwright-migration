// Where each run's report lives. One place for the layout used by run-tests.js, the Xray scripts
// and the report:open / report:clean commands:
//
//   reports/<app>/<ENV>/<yyyy-mm-dd_hh-mm-ss>/   one folder per run
//   reports/<app>/<ENV>/latest/                  copy of the newest run
//   artifacts/<app>/                             traces, videos, screenshots (Playwright outputDir)
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APPS = ['reference-app', 'iaf-viewer'];

// TEST_ENV wins; otherwise the viewer's own setting from .env, then the Reference App default.
// The folder name must match the environment the tests actually ran against.
function resolveEnv(app) {
  const fromConfig = () =>
    JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/reference-app/config/environments.json'), 'utf8')).Env;
  const env = process.env.TEST_ENV
    || (app === 'iaf-viewer' ? process.env.IAFVIEWER_ENVIRONMENT : undefined)
    || fromConfig();
  return String(env).toLowerCase();
}

function envDir(app, env) {
  return path.join(ROOT, 'reports', app, env.toUpperCase());
}

function timestamp(date = new Date()) {
  const p = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`
    + `_${p(date.getHours())}-${p(date.getMinutes())}-${p(date.getSeconds())}`;
}

const latestDir = (app, env) => path.join(envDir(app, env), 'latest');
const artifactsDir = app => path.join(ROOT, 'artifacts', app);

module.exports = { ROOT, APPS, resolveEnv, envDir, latestDir, artifactsDir, timestamp };
