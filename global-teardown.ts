import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

async function globalTeardown() {
  const resultsFolder = path.join(process.cwd(), 'allure-results');
  const reportsFolder = path.join(process.cwd(), 'allure-report');

  if (!fs.existsSync(resultsFolder)) {
    console.log('No allure-results folder found, skipping report generation.');
    return;
  }

  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}-${String(now.getMinutes()).padStart(2,'0')}-${String(now.getSeconds()).padStart(2,'0')}`;
  const reportFolder = path.join(reportsFolder, `Reference-App-Automation-${timestamp}`);

  fs.mkdirSync(reportsFolder, { recursive: true });

  console.log('Generating Allure report...');
  execSync(
    `npx allure classic "${resultsFolder}" -o "${reportFolder}"`,
    { stdio: 'inherit' }
  );

  console.log(`Allure report saved: ${reportFolder}`);
  console.log(`View it with: npx allure open "${reportFolder}"`);
}

export default globalTeardown;
