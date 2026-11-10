import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
// Which results to upload (one is required, so one app's results are never sent as the other's):
//   --app=reference-app | --app=iaf-viewer   (or XRAY_APP)
//   XRAY_RESULTS_FILE   - explicit path to a JUnit XML; overrides --app
//   XRAY_TEST_EXEC_KEY  - upload into an existing Test Execution (default: create a new one)
const APP_RESULTS: Record<string, string> = {
  'reference-app': path.join('test-results', 'reference-app', 'xray-results.xml'),
  'iaf-viewer': path.join('test-results', 'iaf-viewer', 'junit.xml'),
};
const APP = process.argv.find(a => a.startsWith('--app='))?.slice('--app='.length) || process.env.XRAY_APP;
const EXEC_KEY = process.env.XRAY_TEST_EXEC_KEY;
const XRAY_ENDPOINT =
  'https://invicara.atlassian.net/rest/raven/1.0/import/execution/junit?projectKey=PLG' +
  (EXEC_KEY ? `&testExecKey=${encodeURIComponent(EXEC_KEY)}` : '');

if (!process.env.XRAY_RESULTS_FILE && !(APP && APP_RESULTS[APP])) {
  console.error(`Error: say which results to upload: --app=${Object.keys(APP_RESULTS).join(' | --app=')}, or set XRAY_RESULTS_FILE`);
  process.exit(1);
}
const RESULTS_FILE = path.resolve(process.env.XRAY_RESULTS_FILE || APP_RESULTS[APP!]);

if (!JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error('Error: JIRA_EMAIL and JIRA_API_TOKEN must be defined in .env');
  process.exit(1);
}

if (!fs.existsSync(RESULTS_FILE)) {
  console.error(`Error: JUnit results not found at ${RESULTS_FILE}`);
  console.error('Run your Playwright tests first to generate the JUnit XML.');
  process.exit(1);
}

const xml = fs.readFileSync(RESULTS_FILE, 'utf-8');
const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

const url = new URL(XRAY_ENDPOINT);
const options: https.RequestOptions = {
  hostname: url.hostname,
  path: url.pathname + url.search,
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'text/xml',
    'Content-Length': Buffer.byteLength(xml),
  },
};

console.log('Uploading JUnit results to Xray...');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
      try {
        const result = JSON.parse(body);
        const key = result.testExecIssue?.key;
        if (key) {
          console.log(`Test Execution created: https://invicara.atlassian.net/browse/${key}`);
        } else {
          console.log('Upload successful. Response:', body);
        }
      } catch {
        console.log('Upload successful. Response:', body);
      }
    } else {
      console.error(`Upload failed (HTTP ${res.statusCode}):`, body);
      process.exit(1);
    }
  });
});

req.on('error', (err: Error) => {
  console.error('Request error:', err.message);
  process.exit(1);
});

req.write(xml);
req.end();
