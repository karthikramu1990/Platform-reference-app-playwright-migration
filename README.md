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

The two applications run independently, each with its own config and report folder (see Reports):

| Command | Runs |
|---|---|
| `npm run test:ref` (same as `npm test`) | Reference App (`playwright.config.ts`) |
| `npm run test:viewer` | IAF Viewer (`tests/iaf-viewer/playwright.config.js`, chromium, 2 workers, 1 retry) |
| `npm run test:all` | Reference App, then IAF Viewer, as two separate runs |

Extra Playwright arguments go after `--`, e.g. `npm run test:viewer -- -g "PLG-1479"`. The command fails
(non-zero exit code) if any test fails.


### Default environment (uses `Env` from environments.json)
```
npm test
```

### Run against a specific environment
| Command | Environment |
|---|---|
| `npm run test:qa1` | QA1 — https://apps.qa1.oci.in.twinit.io/reference/#/ |
| `npm run test:qa2` | QA2 — https://qa2-app.in.invicara.com/reference/#/ |
| `npm run test:eu-staging` | EU Staging — https://staging.invicara.com/reference/#/ |
| `npm run test:oci-staging` | OCI Staging — https://apps.staging3.oci.in.twinit.io/reference/#/ |
| `npm run test:oci-qa3` | OCI QA3 — https://apps.qa3.oci.in.twinit.io/reference/#/ |

### Other test commands
```
npm run test:headed   # Run with browser visible
npm run test:debug    # Run in debug mode
```

## Reports

Every run of `npm run test:ref` / `test:viewer` / `test:all` produces one self-contained folder per app
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
