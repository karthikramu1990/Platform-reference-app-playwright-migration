const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const now = new Date();
const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}-${String(now.getMinutes()).padStart(2,'0')}-${String(now.getSeconds()).padStart(2,'0')}`;

const resultsFolder = path.join(__dirname, 'allure-results');
const reportFolder  = path.join(__dirname, 'reports', timestamp);
const htmlOutput    = path.join(reportFolder, 'allure-report.html');

// Resolve environment: TEST_ENV var → config.json Env → fallback "qa1"
let environment = process.env.TEST_ENV;
if (!environment) {
  try {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'tests/reference-app/testdata/config.json'), 'utf8'));
    environment = config.Env || 'qa1';
  } catch { environment = 'qa1'; }
}

const date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

const envProps = [
  `Environment=${environment.toUpperCase()}`,
  `Project=Reference App Automation`,
  `Date=${date}`,
  `Time=${time}`,
].join('\n');

fs.mkdirSync(resultsFolder, { recursive: true });
fs.writeFileSync(path.join(resultsFolder, 'environment.properties'), envProps);

fs.mkdirSync(reportFolder, { recursive: true });

console.log(`Generating Allure single-file report: ${timestamp}`);
execSync(`npx allure generate "${resultsFolder}" --single-file -o "${path.join(reportFolder, 'allure-html')}" --clean`, { stdio: 'inherit' });

fs.renameSync(path.join(reportFolder, 'allure-html', 'index.html'), htmlOutput);
fs.rmSync(path.join(reportFolder, 'allure-html'), { recursive: true });

console.log(`Report saved: ${htmlOutput}`);
