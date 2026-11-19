# PlatformReferenceAppAutomation
UI automation for platform reference app

## Prerequisites

- Node.js
- npm
- Playwright browsers: `npx playwright install`

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values. All credentials and tokens live in `.env`
   (gitignored); nothing secret goes in `environments.json` or `test-data.json`. An environment can
   use its own Reference App account through `REFAPP_USERNAME_<ENV>` / `REFAPP_PASSWORD_<ENV>`.

3. Set the default environment via the `Env` field in
   `tests/reference-app/config/environments.json`, or per run with `TEST_ENV`.

## Reference App structure

```
tests/reference-app/
  config/     env.ts (active environment, credentials from .env), environments.json (URLs, project, user group)
  data/       test-data.json
  fixtures/   index.ts (signed-in page + page objects), sign-in.ts
  pages/      one page object per screen
  utils/      logger.ts (logStep -> console + Allure step), image-compare.ts
  specs/      one spec per feature, numbered so they run in the original order
```

- Specs import `test` from `../fixtures` and receive page objects as fixtures
  (`async ({ navigatorPage }) => ...`); they never construct pages or sign in themselves.
- The suite signs in once per worker and shares that page across tests. If a test fails, Playwright
  starts a new worker, so the tests after it begin from a fresh sign-in.
- A spec is `serial` only where its tests really depend on each other (Navigator, Files, Admin User
  Group, AI Chat); a failure then skips the rest of that spec only.
- Test titles (`"02 - Verify Model Details"`) are what Xray matches on. Don't rename them.
- Adding a feature: add a page object in `pages/`, register it in `fixtures/index.ts`, add a
  `NN-feature.spec.ts` in `specs/`.

## Running Tests

The environment goes after `--` (without it, `Env` in environments.json is used for the
Reference App and `IAFVIEWER_ENVIRONMENT` in .env for the IAF Viewer):

| Command | Runs |
|---|---|
| `npm run ref:regression -- qa2` | Reference App regression on the environment's existing project ("Automation" on qa1/qa2, "5.3 Testing" elsewhere) with the default account |
| `npm run ref:regression:newuser -- qa2` | Reference App regression as a brand-new user (see below) |
| `npm run viewer:regression -- qa2` | IAF Viewer regression (chromium, 2 workers, 1 retry) |
| `npm run viewer:regression:update -- qa2` | IAF Viewer suite with `--update-snapshots=all`: rewrites every screenshot baseline. Its report is not copied to `latest/`, so it never replaces the results Xray uploads. Review the changed PNGs in git before committing |

Reference App environments: `qa1`, `qa2`, `staging` (EU staging), `staging3` (OCI staging), `qa3` (OCI QA3).

Extra Playwright arguments go after the environment, e.g. `npm run viewer:regression -- qa2 -g "PLG-1479"`
or `npm run ref:regression -- qa2 --headed`. The command fails (non-zero exit code) if any test fails.

### New-user regression

`ref:regression:newuser` is one Playwright run (`playwright.new-user.config.ts`) in three stages:

1. **Setup** (`tests/reference-app/specs/00-new-user-setup.spec.ts`, NU-01 to NU-09): sign up a unique user
   (`testuser<yyyyMMddHHmmss>@yopmail.com`), give it admin access in the Console (invite into "Application
   Owner"), accept the invite, then create the project (same name as the environment's regression project,
   Advanced mode).
2. **Regression**: specs 01 to 08 in `tests/reference-app/specs`, signed in as the new user.
3. **Teardown** (`99-new-user-teardown.spec.ts`, NU-10 to NU-14): the Console removes the admin access. Runs only
   if every regression test passed.

Needs `CONSOLE_USERNAME`, `CONSOLE_PASSWORD` and `NEWUSER_PASSWORD` in .env. Its report goes to
`reports/reference-app/<ENV>/` like the normal regression (and replaces `latest/`). Don't run it at the same
time as `ref:regression`: both use `artifacts/reference-app`, which Playwright empties when a run starts.

## Reports

Every run of `npm run ref:regression` / `ref:regression:newuser` / `viewer:regression` produces one self-contained folder per app
(all of this is gitignored):

```
reports/
  reference-app/
    QA2/
      2026-11-09_23-10-04/
        report/index.html      Allure single-file report (Reference App) | Playwright HTML report (IAF Viewer)
        junit.xml              the run's JUnit results
        run-summary.json       app, env, branch, commit, startedAt, durationSec, passed, failed, flaky, skipped, total
      latest/                  copy of the newest run
  iaf-viewer/
    QA2/ ...
artifacts/
  reference-app/               traces, videos, screenshots of the last run (Playwright outputDir)
  iaf-viewer/
```

`<ENV>` is `TEST_ENV` (for the viewer, `IAFVIEWER_ENVIRONMENT` from `.env` when `TEST_ENV` is not set), else
`Env` in `tests/reference-app/config/environments.json`. Running `npx playwright test` directly still works; its
JUnit goes to `reports/<app>/<ENV>/adhoc/` and no Allure report or summary is built.

| Command | Does |
|---|---|
| `npm run report:open -- reference-app` | Open the latest Reference App report (add an env, e.g. `-- iaf-viewer qa3`) |
| `npm run report:clean` | Keep the 10 newest run folders per app/env, delete the rest (`-- 5` to keep 5) |

## Xray (Jira) Integration

### Setup
Add to `.env`:
```
JIRA_EMAIL=your-email@invicara.com
JIRA_API_TOKEN=your-atlassian-api-token
```
Generate your API token at: https://id.atlassian.com/manage-profile/security/api-tokens

### Upload test results to Xray
The upload sends Playwright's JUnit file from the latest run of the app you name,
`reports/<app>/<ENV>/latest/junit.xml`:
```
npm run xray:upload:ref
npm run xray:upload:viewer
```
Set `TEST_ENV` to pick another environment's latest run, `XRAY_RESULTS_FILE` to upload some other file, and
`XRAY_TEST_EXEC_KEY` to add results to an existing Test Execution instead of creating a new one.

Results are uploaded to project key `PLG` in Jira: https://invicara.atlassian.net
