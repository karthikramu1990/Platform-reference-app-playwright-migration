import * as fs from 'fs';
import * as path from 'path';

const ALLURE_RESULTS = path.join(process.cwd(), 'allure-results');
const OUTPUT_FILE = path.join(process.cwd(), 'test-results', 'results.xml');

interface AllureResult {
  uuid: string;
  name: string;
  status: 'passed' | 'failed' | 'broken' | 'skipped' | 'unknown';
  statusDetails?: { message?: string; trace?: string };
  start: number;
  stop: number;
  fullName?: string;
  labels?: { name: string; value: string }[];
}

function escape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const resultFiles = fs.readdirSync(ALLURE_RESULTS).filter(f => f.endsWith('-result.json'));

if (resultFiles.length === 0) {
  console.error('No allure result files found in', ALLURE_RESULTS);
  process.exit(1);
}

const results: AllureResult[] = resultFiles.map(f =>
  JSON.parse(fs.readFileSync(path.join(ALLURE_RESULTS, f), 'utf-8'))
);

// Group by suite label
const suites = new Map<string, AllureResult[]>();
for (const r of results) {
  const suite = r.labels?.find(l => l.name === 'suite')?.value ?? 'Default Suite';
  if (!suites.has(suite)) suites.set(suite, []);
  suites.get(suite)!.push(r);
}

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<testsuites>\n';

for (const [suiteName, tests] of suites) {
  const total = tests.length;
  const failures = tests.filter(t => t.status === 'failed' || t.status === 'broken').length;
  const skipped = tests.filter(t => t.status === 'skipped').length;
  const totalTime = tests.reduce((sum, t) => sum + ((t.stop - t.start) / 1000), 0);

  xml += `  <testsuite name="${escape(suiteName)}" tests="${total}" failures="${failures}" errors="0" skipped="${skipped}" time="${totalTime.toFixed(3)}">\n`;

  for (const t of tests) {
    const duration = ((t.stop - t.start) / 1000).toFixed(3);
    const classname = escape(t.fullName ?? suiteName);
    xml += `    <testcase name="${escape(t.name)}" classname="${classname}" time="${duration}">\n`;

    if (t.status === 'failed' || t.status === 'broken') {
      const msg = escape(t.statusDetails?.message ?? t.status);
      const trace = escape(t.statusDetails?.trace ?? '');
      xml += `      <failure message="${msg}">${trace}</failure>\n`;
    } else if (t.status === 'skipped') {
      xml += `      <skipped/>\n`;
    }

    xml += `    </testcase>\n`;
  }

  xml += `  </testsuite>\n`;
}

xml += '</testsuites>\n';

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, xml, 'utf-8');
console.log(`JUnit XML written to ${OUTPUT_FILE} (${results.length} tests across ${suites.size} suites)`);
