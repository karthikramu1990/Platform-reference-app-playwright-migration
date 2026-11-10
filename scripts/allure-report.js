// Builds the Reference App's Allure single-file HTML report into <runDir>/report/index.html.
// Called by scripts/run-tests.js after each Reference App run; can also be run by hand:
//   node scripts/allure-report.js <runDir>
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { ROOT, resolveEnv } = require('./report-paths');

const resultsFolder = path.join(ROOT, 'allure-results');

function generateAllureReport(runDir, environment) {
  if (!fs.existsSync(resultsFolder)) {
    console.log('No allure-results folder found, skipping Allure report.');
    return null;
  }

  const now = new Date();
  const p = n => String(n).padStart(2, '0');
  fs.writeFileSync(path.join(resultsFolder, 'environment.properties'), [
    `Environment=${environment.toUpperCase()}`,
    'Project=Reference App Automation',
    `Date=${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`,
    `Time=${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`,
  ].join('\n'));

  const reportDir = path.join(runDir, 'report');
  const tempDir = path.join(runDir, '.allure-temp');
  fs.mkdirSync(reportDir, { recursive: true });

  console.log('Generating Allure single-file report...');
  execSync(`npx allure awesome "${resultsFolder}" --single-file -o "${tempDir}"`, { cwd: ROOT, stdio: 'inherit' });
  const htmlFile = path.join(reportDir, 'index.html');
  fs.renameSync(path.join(tempDir, 'index.html'), htmlFile);
  fs.rmSync(tempDir, { recursive: true, force: true });
  return htmlFile;
}

module.exports = { generateAllureReport };

if (require.main === module) {
  const runDir = process.argv[2];
  if (!runDir) {
    console.error('Usage: node scripts/allure-report.js <runDir>');
    process.exit(2);
  }
  const file = generateAllureReport(path.resolve(runDir), resolveEnv('reference-app'));
  if (file) console.log(`Report saved: ${file}`);
}
