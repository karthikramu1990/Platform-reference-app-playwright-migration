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

The two applications run independently, each with its own config, output folder and JUnit file:

| Command | Runs |
|---|---|
| `npm run test:ref` (same as `npm test`) | Reference App (`playwright.config.ts`) |
| `npm run test:viewer` | IAF Viewer (`tests/iaf-viewer/playwright.config.js`, chromium, 2 workers, 1 retry) |
| `npm run test:all` | Reference App, then IAF Viewer, as two separate runs |

Extra Playwright arguments go after `--`, e.g. `npm run test:viewer -- -g "PLG-1479"`. The command fails
(non-zero exit code) if any test fails.


### Default environment (uses `Env` from config.json)
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

### Allure Report
```
npm run allure:generate   # Generate report
npm run allure:open       # Open in browser
```

## Xray (Jira) Integration

### Setup
Create a `.env` file in the project root:
```
JIRA_EMAIL=your-email@invicara.com
JIRA_API_TOKEN=your-atlassian-api-token
```
Generate your API token at: https://id.atlassian.com/manage-profile/security/api-tokens

### Upload test results to Xray
Each app writes its own JUnit XML:

| App | File |
|---|---|
| Reference App | `test-results/reference-app/junit.xml` (Playwright); `npm run xray:convert` writes the Xray file `test-results/reference-app/xray-results.xml` from `allure-results` |
| IAF Viewer | `test-results/iaf-viewer/junit.xml` |

The upload always needs to know which app it is sending:
```
npm run xray:convert          # Reference App only: Allure results -> xray-results.xml
npm run xray:upload:ref
npm run xray:upload:viewer
```
Set `XRAY_RESULTS_FILE` to upload some other file, and `XRAY_TEST_EXEC_KEY` to add results to an
existing Test Execution instead of creating a new one.

Results are uploaded to project key `PLG` in Jira: https://invicara.atlassian.net
