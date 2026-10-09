#!/usr/bin/env node
/**
 * Backward Compatibility runner — IafViewer via Reference App
 * -----------------------------------------------------------------------------
 * Drives backwardCompatibility.spec.js across the last three Reference App
 * releases plus the current one, per the Confluence page (PDSD space):
 *   "Backward Compatibility Testing of IafViewer Using Reference App"
 *
 *   5.3  -> deployed qa2, no local build
 *   5.2  -> local build from branch ref-5.2, pointed at qa2
 *   5.1  -> local build from branch ref-5.1, pointed at qa2
 *   5.0  -> local build from branch ref-5.0, pointed at qa2
 *
 * PlatformReferenceApp is a DEVELOPMENT repo and this script never edits or
 * deletes anything tracked in it. It does not edit app/public/config.js, does
 * not touch package-lock.json or .npmrc, and does not commit anything. Two
 * things it DOES do against that repo, because neither one modifies a single
 * file on disk:
 *   - start/stop `npm run watch` as a plain child process (default behavior,
 *     opt out with --no-watch) — running an existing, unmodified npm script
 *     is not "touching code", it's the whole point of automating this
 *   - (opt-in only, --manage-repo) git checkout/pull + `npm ci`
 *
 * Default ("attended") flow, per version:
 *   1. you check out the branch and npm install yourself (once, per repo state)
 *   2. the script verifies the branch and the config origins
 *   3. the script starts `npm run watch` itself and waits for the server to
 *      answer
 *   4. it runs the spec with REF_APP_VERSION set so snapshots stay separate
 *   5. it stops `npm run watch` and moves on to the next version
 *
 * Usage (from tests/iaf-viewer):
 *   node scripts/backwardCompat.mjs                  # full matrix, attended
 *   node scripts/backwardCompat.mjs --only 5.1       # single version
 *   node scripts/backwardCompat.mjs --no-verify-repo # skip git/config checks
 *   node scripts/backwardCompat.mjs --no-watch       # don't start/stop the dev server yourself
 *   node scripts/backwardCompat.mjs --manage-repo    # also opt in to git checkout + npm ci
 *
 * Environment overrides:
 *   REF_APP_REPO   path to the PlatformReferenceApp checkout (read-only use)
 *   BC_BACKEND     backend origin the app should point at (default qa2)
 *   BC_APP_URL     local app URL to poll
 * -----------------------------------------------------------------------------
 */

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, openSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';

const HERE = dirname(fileURLToPath(import.meta.url));
const SUITE_DIR = resolve(HERE, '..');
const IS_WIN = process.platform === 'win32';

// ---------------------------------------------------------------- configuration

const APP_REPO = process.env.REF_APP_REPO
  || (IS_WIN ? 'C:\\Users\\KarthikRamu\\sources\\PlatformReferenceApp'
             : `${process.env.HOME}/sources/PlatformReferenceApp`);

const APP_URL = process.env.BC_APP_URL || 'http://localhost:8086/referenceapp/';
const BACKEND = process.env.BC_BACKEND || 'https://qa2-api.in.invicara.com';

/**
 * Branch names as they exist on origin ("ref-v5.1"). The Confluence page writes
 * them as "ref-5.1" — that form does not match the actual branches.
 */
const VERSIONS = [
  { version: '5.3', mode: 'remote', env: 'qa2', label: 'current release, deployed qa2' },
  { version: '5.2', mode: 'local',  branch: 'ref-v5.2' },
  { version: '5.1', mode: 'local',  branch: 'ref-v5.1' },
  { version: '5.0', mode: 'local',  branch: 'ref-v5.0' },
];

/** Origins the Confluence page says must all point at the same backend. */
const SERVICE_ORIGIN_KEYS = [
  'workflowServiceOrigin', 'aisvcServiceOrigin', 'itemServiceOrigin',
  'passportServiceOrigin', 'fileServiceOrigin', 'datasourceServiceOrigin',
  'graphicsServiceOrigin', 'objectModelServiceOrigin',
];

const SERVER_READY_TIMEOUT_MS = 15 * 60 * 1000;
const SERVER_POLL_INTERVAL_MS = 5000;

// ---------------------------------------------------------------- args

const argv = process.argv.slice(2);
const only        = flagValue('--only');
const verifyRepo  = !argv.includes('--no-verify-repo');
const manageRepo  = argv.includes('--manage-repo');
const noWatch     = argv.includes('--no-watch');

function flagValue(f) { const i = argv.indexOf(f); return i !== -1 ? argv[i + 1] : null; }

const targets = only ? VERSIONS.filter(v => v.version === only) : VERSIONS;
if (!targets.length) {
  console.error(`No release matches --only ${only}. Known: ${VERSIONS.map(v => v.version).join(', ')}`);
  process.exit(1);
}

const LOG_DIR = join(SUITE_DIR, 'bc-logs');
mkdirSync(LOG_DIR, { recursive: true });

const log  = m => console.log(`[backward-compat] ${m}`);
const warn = m => console.log(`[backward-compat] WARNING: ${m}`);
const sleep = ms => new Promise(r => setTimeout(r, ms));

function capture(cmd, cwd) {
  const r = spawnSync(cmd, { cwd, shell: true, encoding: 'utf8' });
  return { status: r.status, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

function runInherit(cmd, cwd, label) {
  log(label || cmd);
  const r = spawnSync(cmd, { cwd, shell: true, stdio: 'inherit' });
  return r.status;
}

async function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim().toLowerCase();
}

// ---------------------------------------------------------------- read-only checks

/** Which branch is currently checked out. Read-only. */
function currentBranch() {
  if (!existsSync(join(APP_REPO, '.git'))) return null;
  const r = capture('git rev-parse --abbrev-ref HEAD', APP_REPO);
  return r.status === 0 ? r.out : null;
}

/**
 * Read app/public/config.js and report whether every service origin points at
 * BACKEND. Never writes — if something is wrong the operator fixes it, because
 * config.js is tracked source in a development repo.
 */
function inspectConfig() {
  const configPath = join(APP_REPO, 'app', 'public', 'config.js');
  if (!existsSync(configPath)) return { ok: false, reason: `config.js not found at ${configPath}` };

  const src = readFileSync(configPath, 'utf8');
  const mismatched = [];
  const missing = [];

  for (const key of SERVICE_ORIGIN_KEYS) {
    const m = src.match(new RegExp(`${key}\\s*:\\s*(['"])(.*?)\\1`));
    if (!m) { missing.push(key); continue; }
    if (m[2] !== BACKEND) mismatched.push(`${key} = ${m[2]}`);
  }
  return { ok: mismatched.length === 0 && missing.length === 0, mismatched, missing };
}

/** Warn if the working tree is dirty — we won't act on it, but you should know. */
function reportDirtyTree() {
  const r = capture('git status --porcelain', APP_REPO);
  if (r.out) {
    warn(`${APP_REPO} has uncommitted changes:`);
    r.out.split('\n').slice(0, 10).forEach(l => console.log(`    ${l}`));
  }
}

async function waitForServer(timeoutMs = SERVER_READY_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs;
  let attempt = 0;
  while (Date.now() < deadline) {
    attempt++;
    try {
      const res = await fetch(APP_URL, { redirect: 'manual' });
      if (res.status > 0 && res.status < 500) {
        log(`server responding — HTTP ${res.status} after ${attempt} poll(s)`);
        return true;
      }
    } catch { /* still building / not started */ }
    if (attempt % 12 === 0) log(`  still waiting for ${APP_URL}`);
    await sleep(SERVER_POLL_INTERVAL_MS);
  }
  return false;
}

// ------------------------------------------------- opt-in repo management

/**
 * Only runs with --manage-repo. Even then it stays non-destructive:
 *   - aborts on a dirty tree instead of clobbering it
 *   - uses `npm ci`, which does not rewrite package-lock.json
 *   - never deletes .npmrc, package-lock.json or any tracked file
 *   - never edits config.js
 */
function manageRepoFor(branch) {
  const dirty = capture('git status --porcelain', APP_REPO);
  if (dirty.out) {
    log('refusing to switch branches — working tree is dirty. Commit or stash first.');
    return false;
  }
  if (runInherit('git fetch origin --prune', APP_REPO, 'git fetch') !== 0) return false;
  if (runInherit(`git checkout ${branch}`, APP_REPO, `git checkout ${branch}`) !== 0) return false;
  if (runInherit(`git pull origin ${branch}`, APP_REPO, `git pull`) !== 0) return false;

  const code = runInherit('npm ci', APP_REPO, 'npm ci');
  if (code !== 0) {
    log('npm ci failed. If this is a 403 "Permission denied: read_package", your GitHub');
    log('token needs read access to the @dtplatform packages — see the Confluence page.');
    log('If it is a lockfile mismatch, run npm install yourself and re-run without --manage-repo.');
    return false;
  }
  return true;
}

/**
 * Start `npm run watch` as a plain child process in APP_REPO. This does not
 * write, edit, or delete anything on disk — it just runs an npm script that
 * is already part of that repo, the same as if you typed it into a terminal
 * yourself. Default behavior; opt out with --no-watch. Returns the child or
 * null.
 */
function startWatch(version) {
  const logPath = join(LOG_DIR, `watch-${version}.log`);
  log(`starting npm run watch in ${APP_REPO} (log: ${logPath})`);
  const out = openSync(logPath, 'w');
  const child = spawn('npm run watch', {
    cwd: APP_REPO, shell: true, stdio: ['ignore', out, out], detached: !IS_WIN,
  });
  child.unref?.();
  return child;
}

function stopWatch(child) {
  if (!child) return;
  log('stopping npm run watch');
  try {
    if (IS_WIN) spawnSync(`taskkill /PID ${child.pid} /T /F`, { shell: true, stdio: 'ignore' });
    else process.kill(-child.pid, 'SIGTERM');
  } catch { /* already gone */ }
  freePort8086();
}

/** Port 8086 is a single lane — a survivor means the next leg tests the wrong bundle. */
function freePort8086() {
  if (!IS_WIN) return;
  const held = capture('netstat -ano | findstr :8086 | findstr LISTENING', SUITE_DIR);
  if (!held.out) return;
  const pids = [...new Set(held.out.split('\n').map(l => l.trim().split(/\s+/).pop()).filter(Boolean))];
  warn(`port 8086 still held by pid(s) ${pids.join(', ')} — force killing`);
  pids.forEach(p => spawnSync(`taskkill /PID ${p} /T /F`, { shell: true, stdio: 'ignore' }));
}

// ---------------------------------------------------------------- spec run

function runSpec(version, iafEnv) {
  const cmd = `npx cross-env IAFVIEWER_ENVIRONMENT=${iafEnv} REF_APP_VERSION=${version} `
            + `playwright test backwardCompatibility.spec.js --project=chromium --workers=1`;
  return runInherit(cmd, SUITE_DIR, `playwright — ${version} (${iafEnv})`);
}

// ---------------------------------------------------------------- main

async function main() {
  const results = [];
  log(`backend under test: ${BACKEND}`);
  log(`app repo: ${APP_REPO}`);
  if (manageRepo) warn('--manage-repo is on: this will run git checkout and npm ci in the app repo.');
  log(noWatch
    ? 'watch management is OFF (--no-watch) — start/stop npm run watch yourself.'
    : 'this script will start/stop `npm run watch` itself for each local leg.');

  for (const target of targets) {
    const { version, mode } = target;
    console.log('\n' + '='.repeat(78));
    log(`${version} — ${mode === 'remote' ? target.label : `local build from ${target.branch}`}`);
    console.log('='.repeat(78));

    if (mode === 'remote') {
      const code = runSpec(version, target.env);
      results.push({ version, source: target.env, status: code === 0 ? 'PASS' : 'FAIL' });
      continue;
    }

    let watch = null;
    try {
      if (manageRepo) {
        if (!manageRepoFor(target.branch)) {
          results.push({ version, source: target.branch, status: 'SETUP FAILED' });
          continue;
        }
      } else {
        console.log(
          `\n  Set up ${version} in ${APP_REPO}:\n` +
          `    git checkout ${target.branch} && git pull origin ${target.branch}\n` +
          `    npm install\n` +
          `    confirm app/public/config.js origins point at ${BACKEND}\n` +
          (noWatch ? `    npm run watch\n` : `  (the script will start \`npm run watch\` itself once you confirm)\n`)
        );
        const answer = await ask(`  Ready for ${version}? [y = run / s = skip] `);
        if (answer === 's') {
          results.push({ version, source: target.branch, status: 'SKIPPED' });
          continue;
        }
      }

      if (verifyRepo && existsSync(join(APP_REPO, '.git'))) {
        const branch = currentBranch();
        if (branch && branch !== target.branch) {
          warn(`checked-out branch is "${branch}", expected "${target.branch}"`);
          const go = await ask('  Continue anyway? [y/N] ');
          if (go !== 'y') { results.push({ version, source: branch, status: 'SKIPPED' }); continue; }
        } else if (branch) {
          log(`branch confirmed: ${branch}`);
        }

        reportDirtyTree();

        const cfg = inspectConfig();
        if (cfg.reason) warn(cfg.reason);
        else if (!cfg.ok) {
          warn(`config.js is not fully pointed at ${BACKEND}:`);
          cfg.mismatched.forEach(m => console.log(`    ${m}`));
          cfg.missing.forEach(m => console.log(`    ${m} (key not found)`));
          console.log('    Fix these by hand — this script will not edit a development repo.');
          const go = await ask('  Continue anyway? [y/N] ');
          if (go !== 'y') { results.push({ version, source: target.branch, status: 'SKIPPED' }); continue; }
        } else {
          log(`config.js origins all point at ${BACKEND}`);
        }
      }

      // Starting the dev server is the default for every local leg — this is
      // just running the repo's own npm script as a process, not modifying it.
      if (!noWatch) {
        // A leftover watch process from a previous run/version would answer
        // on 8086 immediately with the WRONG build, so clear the port first.
        freePort8086();
        watch = startWatch(version);
      }

      if (!await waitForServer(manageRepo || !noWatch ? SERVER_READY_TIMEOUT_MS : 60_000)) {
        warn(`${APP_URL} is not responding.`);
        results.push({ version, source: target.branch, status: 'SERVER NOT UP' });
        continue;
      }

      const code = runSpec(version, 'local');
      results.push({ version, source: target.branch, status: code === 0 ? 'PASS' : 'FAIL' });
    } catch (err) {
      warn(`unexpected failure on ${version}: ${err.message}`);
      results.push({ version, source: target.branch, status: 'ERROR', error: err.message });
    } finally {
      if (watch) { stopWatch(watch); await sleep(3000); }
    }
  }

  console.log('\n' + '='.repeat(78));
  console.log('Backward Compatibility — summary');
  console.log('='.repeat(78));
  console.log('Version  Source            Result');
  console.log('-------  ----------------  --------------');
  results.forEach(r => console.log(`${r.version.padEnd(9)}${String(r.source).padEnd(18)}${r.status}`));

  const summaryPath = join(LOG_DIR, 'summary.json');
  writeFileSync(summaryPath, JSON.stringify(
    { backend: BACKEND, generatedAt: new Date().toISOString(), results }, null, 2));
  console.log(`\nSummary: ${summaryPath}`);

  process.exit(results.some(r => r.status !== 'PASS') ? 1 : 0);
}

main().catch(e => { console.error(e.stack || e.message); process.exit(1); });
