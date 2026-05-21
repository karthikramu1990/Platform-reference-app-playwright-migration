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

2. Configure credentials in `tests/reference-app/testdata/config.json`:
   ```json
   "Rfusername": "your-email@invicara.com",
   "RfPassword": "your-password"
   ```

3. Set the default environment via the `Env` field in `config.json` (default: `qa1`).

## Running Tests

### Default environment (uses `Env` from config.json)
```
npm test
```

### Run against a specific environment
| Command | Environment |
|---|---|
| `npm run test:qa1` | QA1 — https://qa1-app.in.invicara.com/reference/#/ |
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
JUnit XML is auto-generated at `test-results/results.xml` after every test run.

To upload manually via script:
```
npm run xray:upload
```

To convert existing Allure results to JUnit XML (without re-running tests):
```
npm run xray:convert
npm run xray:upload
```

Results are uploaded to project key `PLG` in Jira: https://invicara.atlassian.net
