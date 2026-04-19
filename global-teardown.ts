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
  const tempFolder = path.join(process.cwd(), 'allure-temp');
  const htmlFile   = path.join(reportsFolder, `Reference-App-Automation-${timestamp}.html`);

  fs.mkdirSync(reportsFolder, { recursive: true });

  console.log('Generating Allure single-file report...');
  execSync(
    `npx allure generate "${resultsFolder}" --single-file -o "${tempFolder}" --clean`,
    { stdio: 'inherit' }
  );

  fs.renameSync(path.join(tempFolder, 'index.html'), htmlFile);
  fs.rmSync(tempFolder, { recursive: true });

  console.log(`Allure report saved: ${htmlFile}`);
}

export default globalTeardown;
