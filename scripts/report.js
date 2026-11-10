// Report housekeeping.
//   node scripts/report.js open <reference-app|iaf-viewer> [env]   open the latest run's report
//   node scripts/report.js clean [keep]                             keep the newest runs (default 10)
//                                                                   per app/env, delete the rest
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { ROOT, APPS, resolveEnv, latestDir } = require('./report-paths');

require('dotenv').config({ path: path.join(ROOT, '.env') });

const RUN_FOLDER = /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/;

function open(app, env) {
  if (!APPS.includes(app)) {
    console.error(`Usage: npm run report:open -- <${APPS.join('|')}> [env]`);
    process.exit(2);
  }
  const file = path.join(latestDir(app, (env || resolveEnv(app)).toLowerCase()), 'report', 'index.html');
  if (!fs.existsSync(file)) {
    console.error(`No report at ${file}. Run the tests first (npm run test:${app === 'iaf-viewer' ? 'viewer' : 'ref'}).`);
    process.exit(1);
  }
  console.log(`Opening ${file}`);
  const [cmd, args] = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', file]]
    : process.platform === 'darwin' ? ['open', [file]] : ['xdg-open', [file]];
  spawn(cmd, args, { detached: true, stdio: 'ignore' }).unref();
}

function clean(keep) {
  const reportsDir = path.join(ROOT, 'reports');
  let removed = 0;
  for (const app of APPS) {
    const appDir = path.join(reportsDir, app);
    if (!fs.existsSync(appDir)) continue;
    for (const env of fs.readdirSync(appDir)) {
      const envPath = path.join(appDir, env);
      // Run folders are named by timestamp, so name order is age order. latest/ and adhoc/ are kept.
      const runs = fs.readdirSync(envPath).filter(name => RUN_FOLDER.test(name)).sort().reverse();
      for (const old of runs.slice(keep)) {
        fs.rmSync(path.join(envPath, old), { recursive: true, force: true });
        console.log(`Deleted ${path.join('reports', app, env, old)}`);
        removed++;
      }
    }
  }
  console.log(`Kept the newest ${keep} run(s) per app/env; deleted ${removed}.`);
}

const [command, ...args] = process.argv.slice(2);
if (command === 'open') {
  open(args[0], args[1]);
} else if (command === 'clean') {
  const keep = args[0] === undefined ? 10 : Number(args[0]);
  if (!Number.isInteger(keep) || keep < 1) {
    console.error('Usage: npm run report:clean -- [number of runs to keep, default 10]');
    process.exit(2);
  }
  clean(keep);
} else {
  console.error('Usage: node scripts/report.js <open|clean> ...');
  process.exit(2);
}
