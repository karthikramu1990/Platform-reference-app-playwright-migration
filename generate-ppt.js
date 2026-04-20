const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();

const DARK_BLUE  = '1A237E';
const MID_BLUE   = '1565C0';
const ACCENT     = '00BCD4';
const WHITE      = 'FFFFFF';
const LIGHT_GRAY = 'F5F5F5';
const DARK_TEXT  = '212121';
const GREEN      = '2E7D32';
const ORANGE     = 'E65100';

pptx.layout  = 'LAYOUT_WIDE';
pptx.author  = 'Karthik Ramu';
pptx.company = 'Invicara';
pptx.title   = 'Platform Reference App - Automation Migration';

function addSlideHeader(slide, title, subtitle) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.2, fill: { color: DARK_BLUE } });
  slide.addText(title, { x: 0.3, y: 0.1, w: 12, h: 0.7, fontSize: 24, bold: true, color: WHITE, fontFace: 'Calibri' });
  if (subtitle) slide.addText(subtitle, { x: 0.3, y: 0.75, w: 12, h: 0.4, fontSize: 13, color: ACCENT, fontFace: 'Calibri', italic: true });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 1.2, w: '100%', h: 0.05, fill: { color: ACCENT } });
}

function addFooter(slide, num, total) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 7.2, w: '100%', h: 0.3, fill: { color: DARK_BLUE } });
  slide.addText('Invicara  |  Platform Reference App Automation  |  Confidential', { x: 0.3, y: 7.22, w: 10, h: 0.25, fontSize: 9, color: WHITE, fontFace: 'Calibri' });
  slide.addText(`${num} / ${total}`, { x: 12.2, y: 7.22, w: 1.1, h: 0.25, fontSize: 9, color: WHITE, fontFace: 'Calibri', align: 'right' });
}

const TOTAL = 15;

// ─── Slide 1 – Title ──────────────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: DARK_BLUE } });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 4.5, w: '100%', h: 3.1, fill: { color: MID_BLUE } });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 4.45, w: '100%', h: 0.1, fill: { color: ACCENT } });
  s.addText('Platform Reference App', { x: 0.5, y: 0.8, w: 12.5, h: 0.8, fontSize: 20, color: ACCENT, fontFace: 'Calibri', bold: true });
  s.addText('Automation Migration', { x: 0.5, y: 1.5, w: 12.5, h: 1.2, fontSize: 44, color: WHITE, fontFace: 'Calibri', bold: true });
  s.addText('Selenium Java  \u2192  TypeScript + Playwright', { x: 0.5, y: 2.8, w: 12.5, h: 0.7, fontSize: 24, color: ACCENT, fontFace: 'Calibri', bold: true });
  s.addText('Karthik Ramu  |  Invicara  |  2025', { x: 0.5, y: 4.7, w: 12.5, h: 0.5, fontSize: 16, color: WHITE, fontFace: 'Calibri' });
  s.addText('Advanced Framework Architecture & Features', { x: 0.5, y: 5.3, w: 12.5, h: 0.5, fontSize: 14, color: LIGHT_GRAY, fontFace: 'Calibri', italic: true });
}

// ─── Slide 2 – Why Migrate? ───────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_GRAY };
  addSlideHeader(s, 'Why Migrate?', 'Pain points with Selenium Java');
  const pains = [
    ['Verbose & Boilerplate-Heavy', 'Selenium required extensive setup: WebDriverManager, explicit waits, browser factories for every test'],
    ['Flaky Tests & Synchronisation Issues', 'Manual explicit/implicit waits led to race conditions and intermittent false failures'],
    ['Slow Execution', 'No native parallel test runner; third-party tools (TestNG/JUnit) added complexity and overhead'],
    ['Limited Modern Features', 'No built-in video recording, trace, visual testing, or network interception out of the box'],
    ['Complex Reporting Setup', 'Allure integration required many extra libraries, plugins, and manual configuration steps'],
    ['Constant Maintenance Overhead', 'WebDriver version mismatches with every browser update caused repeated framework breakage'],
  ];
  pains.forEach(([title, desc], i) => {
    const y = 1.45 + i * 0.9;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.4, y, w: 12.7, h: 0.78, fill: { color: 'FFF3E0' }, line: { color: ORANGE, width: 1 }, rectRadius: 0.08 });
    s.addText(`X  ${title}`, { x: 0.6, y: y + 0.04, w: 5.2, h: 0.35, fontSize: 13, bold: true, color: ORANGE, fontFace: 'Calibri' });
    s.addText(desc, { x: 0.6, y: y + 0.38, w: 12.2, h: 0.3, fontSize: 11, color: DARK_TEXT, fontFace: 'Calibri', italic: true });
  });
  addFooter(s, 2, TOTAL);
}

// ─── Slide 3 – Why Playwright + TS? ──────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_GRAY };
  addSlideHeader(s, 'Why Playwright + TypeScript?', 'Modern, reliable, and feature-rich test automation');
  const pros = [
    ['Auto-Wait Built-In',       'Playwright waits for elements automatically - no manual waits or sleep() calls needed'],
    ['TypeScript Type Safety',    'Compile-time error detection, IntelliSense support, and better refactoring in VS Code'],
    ['Rich Built-in Features',    'Video, Trace, Screenshots, Visual Testing - zero extra libraries required'],
    ['Fast & Reliable Execution', 'Out-of-process browser control provides much less flakiness compared to Selenium'],
    ['First-class Allure Support','allure-playwright plugin integrates seamlessly with step logging and attachments'],
    ['Network Interception',      'page.route() lets you intercept and mock API calls directly in test code'],
    ['Single Command Execution',  'npx playwright test - one command to discover, run, and generate reports'],
    ['No Driver Management',      'No WebDriver version mismatches ever - Playwright manages browsers internally'],
  ];
  pros.forEach(([title, desc], i) => {
    const y = 1.45 + i * 0.73;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.4, y, w: 12.7, h: 0.62, fill: { color: 'E8F5E9' }, line: { color: GREEN, width: 1 }, rectRadius: 0.08 });
    s.addText(`OK  ${title}`, { x: 0.6, y: y + 0.04, w: 4.2, h: 0.55, fontSize: 13, bold: true, color: GREEN, fontFace: 'Calibri', valign: 'middle' });
    s.addText(desc, { x: 5.0, y: y + 0.04, w: 8.0, h: 0.55, fontSize: 12, color: DARK_TEXT, fontFace: 'Calibri', valign: 'middle' });
  });
  addFooter(s, 3, TOTAL);
}

// ─── Slide 4 – Framework Architecture ────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_GRAY };
  addSlideHeader(s, 'Framework Architecture', 'Clean separation of concerns - layered design');
  const layers = [
    { label: 'Test Runner Layer',   color: DARK_BLUE, text: 'RunnerClass.spec.ts  --  single entry point, serial execution, shared browser context across all tests' },
    { label: 'Test Class Layer',    color: MID_BLUE,  text: '7 Test Classes  --  one per feature area, orchestrate page objects, manage test flow logic' },
    { label: 'Page Object Layer',   color: '0277BD',  text: '9 Page Objects  --  encapsulate all locators, expose high-level async action methods' },
    { label: 'Configuration Layer', color: '01579B',  text: 'config.json + TestData.json  --  environment URLs, credentials, test inputs in one place' },
    { label: 'Utilities Layer',     color: '006064',  text: 'pixelmatch (visual diff)  |  allure step logging  |  file path helpers  |  React-Select helper' },
    { label: 'Reporting Layer',     color: '004D40',  text: 'allure-playwright  |  global-teardown auto-generates timestamped single-file HTML report' },
  ];
  layers.forEach((l, i) => {
    const y = 1.4 + i * 0.93;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.4, y, w: 12.7, h: 0.8, fill: { color: l.color }, rectRadius: 0.1 });
    s.addText(l.label, { x: 0.6, y: y + 0.1, w: 3.4, h: 0.6, fontSize: 14, bold: true, color: WHITE, fontFace: 'Calibri', valign: 'middle' });
    s.addShape(pptx.ShapeType.rect, { x: 4.05, y: y + 0.15, w: 0.04, h: 0.5, fill: { color: ACCENT } });
    s.addText(l.text, { x: 4.25, y: y + 0.1, w: 8.7, h: 0.6, fontSize: 12, color: WHITE, fontFace: 'Calibri', valign: 'middle', italic: true });
  });
  addFooter(s, 4, TOTAL);
}

// ─── Slide 5 – Test Class Pattern ────────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_GRAY };
  addSlideHeader(s, 'Test Class Pattern', 'Orchestration layer separating test logic from UI actions');

  s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 1.35, w: 8.2, h: 5.75, fill: { color: WHITE }, line: { color: MID_BLUE, width: 1 }, rectRadius: 0.1 });
  s.addText('7 Test Classes (Feature Orchestrators)', { x: 0.5, y: 1.5, w: 7.9, h: 0.4, fontSize: 14, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  const classes = [
    ['LoginintoTheApplicationTest', 'Authentication + project selection setup for entire suite'],
    ['NavigatorTest',               '6 tests - 3D model, GIS, warranty, telemetry, file operations'],
    ['ModelElementTest',            '5 tests - element filtering, properties, warranty, telemetry'],
    ['FilesMenuTest',               '3 tests - file upload/delete, folder creation, multi-file search'],
    ['AdminUserGroupTest',          '3 tests - invite, view pending, remove user invitations'],
    ['ManageModelTest',             '1 test  - BIM model import & Mapbox activation'],
    ['GenericRestConnectorTest',    '1 test  - REST connector configuration & verification'],
  ];
  classes.forEach(([name, desc], i) => {
    const y = 2.1 + i * 0.72;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.5, y, w: 7.85, h: 0.6, fill: { color: 'E3F2FD' }, line: { color: MID_BLUE, width: 0.5 }, rectRadius: 0.06 });
    s.addText(name, { x: 0.65, y: y + 0.04, w: 4.5, h: 0.28, fontSize: 12, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
    s.addText(desc, { x: 0.65, y: y + 0.3, w: 7.5, h: 0.25, fontSize: 11, color: DARK_TEXT, fontFace: 'Calibri', italic: true });
  });

  s.addShape(pptx.ShapeType.roundRect, { x: 8.8, y: 1.35, w: 4.6, h: 5.75, fill: { color: WHITE }, line: { color: ACCENT, width: 1 }, rectRadius: 0.1 });
  s.addText('Why This Pattern?', { x: 9.0, y: 1.5, w: 4.2, h: 0.4, fontSize: 14, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  const whys = [
    'Single entry point (RunnerClass) for clean CI execution',
    'Feature-isolated classes make maintenance easy',
    'Shared browser context passed via constructor',
    'Feature flags skip dependent tests on failure',
    'Clear separation: test logic vs UI code',
    'Add new features without touching the runner',
  ];
  whys.forEach((w, i) => {
    s.addText(`OK  ${w}`, { x: 9.0, y: 2.1 + i * 0.82, w: 4.2, h: 0.65, fontSize: 12, color: DARK_TEXT, fontFace: 'Calibri', valign: 'top' });
  });
  addFooter(s, 5, TOTAL);
}

// ─── Slide 6 – Configuration & Test Data ─────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_GRAY };
  addSlideHeader(s, 'Configuration & Test Data Management', 'JSON-driven, environment-aware setup');

  s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 1.35, w: 6.5, h: 2.8, fill: { color: WHITE }, line: { color: MID_BLUE, width: 1 }, rectRadius: 0.1 });
  s.addText('config.json  -  Environment Config', { x: 0.5, y: 1.5, w: 6.1, h: 0.4, fontSize: 13, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  s.addText(['- Env selector: "qa2" | "staging"', '- Per-env URLs, project names, user groups', '- Login credentials (Rfusername / RfPassword)', '- Headless flag: "yes" / "no" toggle', '- Base URL injected into playwright.config.ts'].join('\n'), { x: 0.5, y: 2.0, w: 6.1, h: 2.0, fontSize: 12, color: DARK_TEXT, fontFace: 'Calibri' });

  s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 4.3, w: 6.5, h: 2.8, fill: { color: WHITE }, line: { color: ACCENT, width: 1 }, rectRadius: 0.1 });
  s.addText('TestData.json  -  Centralised Test Inputs', { x: 0.5, y: 4.45, w: 6.1, h: 0.4, fontSize: 13, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  s.addText(['- ModelElement: 4 objects (category, type, property)', '- FilesRename: 3 files with target folder names', '- WarrantyDetails: 2 entries with dates & durations', '- ManageModel: Mapbox credentials & scopes', '- GIS: 5 map styles, elevation & camera configs', '- GenericRestConnector, User group invite email'].join('\n'), { x: 0.5, y: 4.9, w: 6.1, h: 2.0, fontSize: 11, color: DARK_TEXT, fontFace: 'Calibri' });

  s.addShape(pptx.ShapeType.roundRect, { x: 7.1, y: 1.35, w: 6.3, h: 5.75, fill: { color: WHITE }, line: { color: GREEN, width: 1 }, rectRadius: 0.1 });
  s.addText('Why JSON-Driven Data?', { x: 7.3, y: 1.5, w: 5.9, h: 0.4, fontSize: 14, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  const benefits = [
    ['One-click env switch',   'Change "Env": "qa2" to "staging" to run against a different environment instantly'],
    ['No hardcoding in tests', 'All inputs in one file - test classes are completely data-agnostic'],
    ['Reusable across suites', 'Same TestData.json consumed by all 7 test classes'],
    ['Real file assets',       '70+ reference PNGs + BIM models stored for reproducible runs'],
    ['Non-dev friendly',       'Testers can adjust test data without touching any TypeScript files'],
    ['CI/CD ready',            'Environment can be injected via env var for pipeline runs'],
  ];
  benefits.forEach(([title, desc], i) => {
    const y = 2.1 + i * 0.87;
    s.addText(`>>  ${title}`, { x: 7.3, y, w: 5.9, h: 0.3, fontSize: 13, bold: true, color: MID_BLUE, fontFace: 'Calibri' });
    s.addText(desc, { x: 7.3, y: y + 0.28, w: 5.9, h: 0.42, fontSize: 11, color: DARK_TEXT, fontFace: 'Calibri', italic: true });
  });
  addFooter(s, 6, TOTAL);
}

// ─── Slide 7 – Advanced: Video + Trace + Screenshots ─────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_GRAY };
  addSlideHeader(s, 'Advanced Feature: Artefact Collection', 'Video  |  Trace  |  Screenshots  -  Zero extra setup');
  const cards = [
    { title: 'Video Recording', color: '4A148C', lightColor: 'F3E5F5',
      points: ["video: 'on' - every test run", 'Captured as MP4 video file', 'Stored in C:/pw-test-results/', 'Auto-attached to Allure report', 'Great for debugging race conditions'] },
    { title: 'Trace Recording', color: '1A237E', lightColor: 'E8EAF6',
      points: ["trace: 'retain-on-failure'", 'DOM snapshots at every action', 'Full network request log', 'Playwright Inspector playback', 'Pinpoints exact line of failure'] },
    { title: 'Screenshots', color: '006064', lightColor: 'E0F7FA',
      points: ["screenshot: 'only-on-failure'", 'Manual: page.screenshot() in tests', 'Used for telemetry visual verify', 'Saved to screenshots/ folder', 'Attached to Allure report'] },
  ];
  cards.forEach((c, i) => {
    const x = 0.4 + i * 4.5;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.4, w: 4.2, h: 5.7, fill: { color: c.lightColor }, line: { color: c.color, width: 1.5 }, rectRadius: 0.12 });
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.4, w: 4.2, h: 0.9, fill: { color: c.color }, rectRadius: 0.12 });
    s.addText(c.title, { x: x + 0.15, y: 1.5, w: 3.9, h: 0.7, fontSize: 16, bold: true, color: WHITE, fontFace: 'Calibri', valign: 'middle' });
    c.points.forEach((p, pi) => {
      s.addText(`- ${p}`, { x: x + 0.2, y: 2.45 + pi * 0.85, w: 3.8, h: 0.72, fontSize: 12.5, color: c.color, fontFace: 'Calibri', valign: 'top', bold: pi === 0 });
    });
  });
  addFooter(s, 7, TOTAL);
}

// ─── Slide 8 – Advanced: Allure Reporting ────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_GRAY };
  addSlideHeader(s, 'Advanced Feature: Allure Reporting', 'Auto-generated, timestamped, rich HTML reports');

  s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 1.35, w: 5.8, h: 5.75, fill: { color: WHITE }, line: { color: MID_BLUE, width: 1 }, rectRadius: 0.1 });
  s.addText('Reporter Configuration', { x: 0.5, y: 1.5, w: 5.4, h: 0.4, fontSize: 14, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  s.addText([
    "reporter: [",
    "  ['allure-playwright', {",
    "    detail: false,",
    "    outputFolder:",
    "      './allure-results',",
    "    suiteTitle: true,",
    "    attachmentsBaseDirectory:",
    "      './allure-results'",
    "  }],",
    "  ['list']",
    "]",
    "",
    "globalTeardown:",
    "  './global-teardown.ts'",
  ].join('\n'), { x: 0.5, y: 2.05, w: 5.5, h: 4.8, fontSize: 11, fontFace: 'Courier New', color: DARK_BLUE, valign: 'top' });

  s.addShape(pptx.ShapeType.roundRect, { x: 6.4, y: 1.35, w: 7.0, h: 5.75, fill: { color: WHITE }, line: { color: ACCENT, width: 1 }, rectRadius: 0.1 });
  s.addText('Advanced Reporting Features', { x: 6.6, y: 1.5, w: 6.6, h: 0.4, fontSize: 14, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  const rFeatures = [
    ['Auto-Generation',     'global-teardown.ts fires after every run - report created automatically, no manual step'],
    ['Timestamped Archive', 'Each run: reports/YYYY-MM-DD_HH-MM-SS/allure-report.html saved permanently'],
    ['Video Attachments',   'MP4 recordings embedded directly in each test result in the report'],
    ['Screenshot Links',    'Failure & manual screenshots linked to individual test steps'],
    ['Step-Level Logging',  'logStep() writes human-readable steps inside each Allure test'],
    ['Suite Organisation',  'suiteTitle:true groups tests by describe block for better navigation'],
    ['Single-File HTML',    'generate-allure-report.js bundles everything into one self-contained file'],
  ];
  rFeatures.forEach(([title, desc], i) => {
    const y = 2.1 + i * 0.72;
    s.addText(`>>  ${title}`, { x: 6.6, y, w: 6.6, h: 0.28, fontSize: 12, bold: true, color: MID_BLUE, fontFace: 'Calibri' });
    s.addText(desc, { x: 6.6, y: y + 0.26, w: 6.6, h: 0.3, fontSize: 11, color: DARK_TEXT, fontFace: 'Calibri', italic: true });
  });
  addFooter(s, 8, TOTAL);
}

// ─── Slide 9 – Advanced: Visual Testing ──────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_GRAY };
  addSlideHeader(s, 'Advanced Feature: Pixel-Perfect Visual Testing', 'Custom image comparison with pixelmatch library');

  s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 1.35, w: 13.1, h: 1.5, fill: { color: 'E8EAF6' }, line: { color: MID_BLUE, width: 1 }, rectRadius: 0.1 });
  s.addText('5-Step Visual Validation Process', { x: 0.5, y: 1.45, w: 12.7, h: 0.4, fontSize: 14, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  ['[1] Collapse UI\npanels - isolate 3D', '[2] page.screenshot()\nCapture full-page PNG', '[3] Load reference\nPNG imagevalidation/', '[4] pixelmatch compare\nSliding window 10px', '[5] PASS / FAIL\n40% threshold'].forEach((st, i) => {
    const x = 0.5 + i * 2.58;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.88, w: 2.4, h: 0.85, fill: { color: MID_BLUE }, rectRadius: 0.08 });
    s.addText(st, { x, y: 1.88, w: 2.4, h: 0.85, fontSize: 10.5, color: WHITE, fontFace: 'Calibri', align: 'center', valign: 'middle' });
    if (i < 4) s.addText('->', { x: x + 2.42, y: 2.1, w: 0.16, h: 0.4, fontSize: 14, color: MID_BLUE, fontFace: 'Calibri', align: 'center' });
  });

  s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 3.0, w: 6.5, h: 4.1, fill: { color: WHITE }, line: { color: MID_BLUE, width: 1 }, rectRadius: 0.1 });
  s.addText('Implementation Details', { x: 0.5, y: 3.12, w: 6.1, h: 0.38, fontSize: 13, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  s.addText([
    '- Library: pixelmatch v7 + pngjs v7',
    '- Sliding window search (10-pixel steps)',
    '- Threshold: 40% pixel difference tolerance',
    '- 70+ reference PNGs in imagevalidation/',
    '- NavigatorPage.verifyingModelImage() method',
    '- isImageFound(actual, expected) helper',
    '- Covers: 3D models, GIS views, 2D floor plans,',
    '  annotations, elevation modes, camera positions',
  ].join('\n\n'), { x: 0.5, y: 3.6, w: 6.1, h: 3.3, fontSize: 12, color: DARK_TEXT, fontFace: 'Calibri' });

  s.addShape(pptx.ShapeType.roundRect, { x: 7.1, y: 3.0, w: 6.3, h: 4.1, fill: { color: WHITE }, line: { color: GREEN, width: 1 }, rectRadius: 0.1 });
  s.addText('What Visual Testing Validates', { x: 7.3, y: 3.12, w: 5.9, h: 0.38, fontSize: 13, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  ['OK  3D Model rendering in Navigator', 'OK  GIS map style changes (5 styles)', 'OK  Elevation mode toggle validation', 'OK  Camera position presets', 'OK  2D floor plan display', 'OK  Annotation overlays', 'OK  Telemetry chart screenshots'].forEach((v, i) => {
    s.addText(v, { x: 7.3, y: 3.65 + i * 0.48, w: 5.9, h: 0.4, fontSize: 12.5, color: DARK_TEXT, fontFace: 'Calibri' });
  });
  addFooter(s, 9, TOTAL);
}

// ─── Slide 10 – Advanced: Shared Context & Serial Execution ──────────────────
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_GRAY };
  addSlideHeader(s, 'Advanced Feature: Shared Browser Context & Serial Execution', 'Single auth session reused across all 20 tests');

  [{ label: 'beforeAll\ncreateContext()', color: GREEN }, { label: 'Login Test\n(Auth once)', color: MID_BLUE }, { label: 'All 20 Tests\nReuse sharedPage', color: MID_BLUE }, { label: 'afterAll\nContext closed', color: DARK_BLUE }].forEach((f, i) => {
    const x = 0.5 + i * 3.35;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.4, w: 3.0, h: 0.9, fill: { color: f.color }, rectRadius: 0.1 });
    s.addText(f.label, { x, y: 1.4, w: 3.0, h: 0.9, fontSize: 12, bold: true, color: WHITE, fontFace: 'Calibri', align: 'center', valign: 'middle' });
    if (i < 3) s.addText('->', { x: x + 3.0, y: 1.7, w: 0.35, h: 0.4, fontSize: 20, color: DARK_BLUE, fontFace: 'Calibri', align: 'center' });
  });

  s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 2.55, w: 6.5, h: 4.55, fill: { color: WHITE }, line: { color: MID_BLUE, width: 1 }, rectRadius: 0.1 });
  s.addText('beforeAll Setup', { x: 0.5, y: 2.7, w: 6.1, h: 0.4, fontSize: 13, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  s.addText(['browser.newContext({', '  viewport: null,', '  ignoreHTTPSErrors: true', '})', '', '// Navigate once to app URL', 'sharedPage.goto(RfUrl, {', "  waitUntil: 'networkidle',", '  timeout: 60000', '})', '', '// All 20 tests reuse', '// the same sharedPage'].join('\n'), { x: 0.5, y: 3.2, w: 6.1, h: 3.7, fontSize: 11, fontFace: 'Courier New', color: DARK_BLUE });

  s.addShape(pptx.ShapeType.roundRect, { x: 7.1, y: 2.55, w: 6.3, h: 4.55, fill: { color: WHITE }, line: { color: ACCENT, width: 1 }, rectRadius: 0.1 });
  s.addText('afterAll Cleanup', { x: 7.3, y: 2.7, w: 5.9, h: 0.4, fontSize: 13, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  [['Abort all pending routes', "page.route('**/*', r => r.abort())"], ['Navigate to blank page', "page.goto('about:blank')"], ['8-second close timeout', 'Promise.race([context.close(), timeout(8000)])'], ['Prevents hanging tests', 'Ensures clean teardown even on network issues'], ['HTTPS cert bypass', 'ignoreHTTPSErrors:true for dev/QA environments'], ['No re-login overhead', 'Auth state persists across all 20 test cases']].forEach(([title, desc], i) => {
    const y = 3.2 + i * 0.63;
    s.addText(`>>  ${title}`, { x: 7.3, y, w: 5.9, h: 0.27, fontSize: 12, bold: true, color: MID_BLUE, fontFace: 'Calibri' });
    s.addText(desc, { x: 7.3, y: y + 0.25, w: 5.9, h: 0.27, fontSize: 11, color: DARK_TEXT, fontFace: 'Calibri', italic: true });
  });
  addFooter(s, 10, TOTAL);
}

// ─── Slide 11 – Advanced: Global Teardown ────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_GRAY };
  addSlideHeader(s, 'Advanced Feature: Global Teardown & Auto Report Generation', 'Zero manual steps - reports appear automatically after every run');

  ['All Tests Complete', 'global-teardown.ts fires', 'Check allure-results/', 'Run generate-allure-report.js', 'Timestamp the filename', 'Save to allure-report/', 'Clean temp files'].forEach((step, i) => {
    const y = 1.4 + i * 0.77;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.4, y, w: 5.5, h: 0.62, fill: { color: i === 0 ? DARK_BLUE : MID_BLUE }, rectRadius: 0.08 });
    s.addText(`[${i}]  ${step}`, { x: 0.55, y, w: 5.2, h: 0.62, fontSize: 13, bold: i === 0, color: WHITE, fontFace: 'Calibri', valign: 'middle' });
  });

  s.addShape(pptx.ShapeType.roundRect, { x: 6.3, y: 1.35, w: 7.1, h: 5.75, fill: { color: WHITE }, line: { color: ACCENT, width: 1 }, rectRadius: 0.1 });
  s.addText('Key Benefits', { x: 6.5, y: 1.5, w: 6.7, h: 0.4, fontSize: 14, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  [['Auto-archived reports', 'Every run saved with timestamp - full history preserved forever'], ['Single-file HTML', 'Self-contained allure-report.html - no server needed to open'], ['globalTeardown config', "playwright.config.ts: globalTeardown: './global-teardown.ts'"], ['Temp file cleanup', 'generate-allure-report.js cleans intermediate files post-build'], ['CI/CD compatible', 'Reports generated as part of pipeline - zero human intervention'], ['Easy distribution', 'Single HTML file can be emailed or attached to JIRA tickets']].forEach(([title, desc], i) => {
    const y = 2.1 + i * 0.82;
    s.addText(`>>  ${title}`, { x: 6.5, y, w: 6.7, h: 0.3, fontSize: 13, bold: true, color: MID_BLUE, fontFace: 'Calibri' });
    s.addText(desc, { x: 6.5, y: y + 0.27, w: 6.7, h: 0.38, fontSize: 11.5, color: DARK_TEXT, fontFace: 'Calibri', italic: true });
  });
  addFooter(s, 11, TOTAL);
}

// ─── Slide 12 – Advanced: Timeout Strategy & Error Handling ──────────────────
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_GRAY };
  addSlideHeader(s, 'Timeout Strategy & Error Handling', 'Layered timeouts + safe method-level error recovery');

  s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 1.35, w: 6.5, h: 5.75, fill: { color: WHITE }, line: { color: MID_BLUE, width: 1 }, rectRadius: 0.1 });
  s.addText('Layered Timeout Strategy', { x: 0.5, y: 1.5, w: 6.1, h: 0.4, fontSize: 14, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  [['Global test timeout', '300s', 'Long BIM model operations'], ['Navigation timeout', '60s', 'Page loads & URL navigations'], ['Action timeout', '30s', 'User interactions (click, fill)'], ['Expect timeout', '30s', 'Assertion checks'], ['Project selection', '150s', 'Slow project load wait'], ['Model import', '10 min', 'Heavy BIM model processing'], ['Context close', '8s max', 'Graceful teardown via Promise.race()']].forEach(([name, time, reason], i) => {
    const y = 2.05 + i * 0.7;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.5, y, w: 6.1, h: 0.6, fill: { color: 'E3F2FD' }, line: { color: MID_BLUE, width: 0.5 }, rectRadius: 0.06 });
    s.addText(name, { x: 0.65, y: y + 0.04, w: 3, h: 0.28, fontSize: 11.5, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
    s.addText(time, { x: 3.7, y: y + 0.04, w: 1.2, h: 0.28, fontSize: 11.5, bold: true, color: ORANGE, fontFace: 'Calibri' });
    s.addText(reason, { x: 0.65, y: y + 0.3, w: 5.8, h: 0.24, fontSize: 10, color: DARK_TEXT, fontFace: 'Calibri', italic: true });
  });

  s.addShape(pptx.ShapeType.roundRect, { x: 7.1, y: 1.35, w: 6.3, h: 5.75, fill: { color: WHITE }, line: { color: ORANGE, width: 1 }, rectRadius: 0.1 });
  s.addText('Error Handling Patterns', { x: 7.3, y: 1.5, w: 5.9, h: 0.4, fontSize: 14, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
  [['try-catch per method', 'Every page method catches exceptions - test continues and logs to console'], ['.catch(()=>false)', 'Safe visibility: isVisible().catch(()=>false) avoids crashes'], ['Feature flags', 'AdminUserGroupTest.flag skips later steps if invite fails'], ['Conditional branches', 'Checks visibility before clicking optional UI controls'], ['networkidle waits', "waitUntil:'networkidle' for dynamic 3D content - no arbitrary sleep"], ['Promise.race()', 'Context close with 8s timeout - prevents infinite hang on teardown']].forEach(([pattern, desc], i) => {
    const y = 2.1 + i * 0.83;
    s.addText(`!  ${pattern}`, { x: 7.3, y, w: 5.9, h: 0.28, fontSize: 12, bold: true, color: ORANGE, fontFace: 'Calibri' });
    s.addText(desc, { x: 7.3, y: y + 0.27, w: 5.9, h: 0.42, fontSize: 11, color: DARK_TEXT, fontFace: 'Calibri', italic: true });
  });
  addFooter(s, 12, TOTAL);
}

// ─── Slide 13 – Migration Comparison ─────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_GRAY };
  addSlideHeader(s, 'Migration Comparison', 'Selenium Java  vs  Playwright TypeScript  -  side by side');

  const rows = [
    ['Aspect',            'Selenium Java',                          'Playwright TypeScript',                  true],
    ['Language',          'Java (verbose, boilerplate)',             'TypeScript (type-safe, concise)',         false],
    ['Browser Control',   'In-process via WebDriver',               'Out-of-process (faster, stable)',         false],
    ['Wait Handling',     'Manual explicit/implicit waits',         'Built-in auto-wait - zero manual waits',  false],
    ['Video Recording',   'External tool required',                 "Native - video:'on' in config",           false],
    ['Trace / Debug',     'No equivalent built-in tool',            'Playwright Trace Inspector built-in',     false],
    ['Visual Testing',    'Ashot (extra dependency)',               'pixelmatch + page.screenshot() native',   false],
    ['Reporting',         'Allure + TestNG + many libs',            'allure-playwright - 1 plugin only',       false],
    ['File Handling',     'Robot class / AutoIT',                   'waitForEvent("filechooser")',              false],
    ['Network Control',   'Browser proxy / 3rd party',              'page.route() built-in interception',      false],
    ['Config Management', 'Properties files / TestNG XML',          'JSON + playwright.config.ts',             false],
    ['Execution Speed',   'Slower (WebDriver overhead)',            'Faster (direct browser protocol)',        false],
    ['Driver Management', 'WebDriver version mismatch issues',      'No driver management ever needed',        false],
    ['IDE Support',       'Good (Java IDEs)',                       'Excellent (VS Code + Playwright ext)',     false],
  ];
  const colWidths = [2.5, 4.8, 4.9];
  const rowH = 0.42;
  rows.forEach((row, ri) => {
    const y = 1.35 + ri * rowH;
    const isHeader = row[3];
    let xOffset = 0.3;
    colWidths.forEach((w, ci) => {
      s.addShape(pptx.ShapeType.rect, { x: xOffset, y, w, h: rowH, fill: { color: isHeader ? DARK_BLUE : (ri % 2 === 0 ? WHITE : 'F5F5F5') }, line: { color: 'DDDDDD', width: 0.5 } });
      const textColor = isHeader ? WHITE : (ci === 2 ? GREEN : (ci === 1 ? ORANGE : DARK_BLUE));
      s.addText(String(row[ci]), { x: xOffset + 0.08, y: y + 0.05, w: w - 0.12, h: rowH - 0.1, fontSize: isHeader ? 12 : 11, bold: isHeader || ci === 0, color: textColor, fontFace: 'Calibri', valign: 'middle' });
      xOffset += w;
    });
  });
  addFooter(s, 13, TOTAL);
}

// ─── Slide 14 – Summary & Key Takeaways ──────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: LIGHT_GRAY };
  addSlideHeader(s, 'Summary & Key Takeaways', 'What makes this framework production-grade');
  [
    { title: 'Solid Architecture',        desc: 'POM + Test Class pattern - 9 page objects, 7 test classes, 1 runner entry point' },
    { title: 'Full Artefact Collection',  desc: 'Video (every run) + Trace (on failure) + Screenshots - all auto-attached to Allure' },
    { title: 'Visual Regression Testing', desc: '70+ reference PNGs validated with pixelmatch - pixel-level accuracy for 3D/GIS/2D views' },
    { title: 'Rich Allure Reporting',     desc: 'Auto-generated, timestamped, single-file HTML with video, steps, and suite grouping' },
    { title: 'Reliable Serial Execution', desc: 'Serial mode + shared context = login-once, stable stateful chain of 20 tests' },
    { title: 'Flexible Configuration',    desc: 'One JSON change switches environments - CI/CD ready without touching test code' },
    { title: 'Robust Error Handling',     desc: 'Try-catch per method, feature flags, safe visibility checks - no single failure crashes the suite' },
    { title: 'Comprehensive Coverage',    desc: '20 tests across 3D models, GIS, telemetry (REST+MQTT), files, user admin, REST connectors' },
  ].forEach((t, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i < 4 ? i : i - 4;
    const x = col === 0 ? 0.3 : 7.0;
    const y = 1.4 + row * 1.47;
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 6.4, h: 1.3, fill: { color: WHITE }, line: { color: DARK_BLUE, width: 1 }, rectRadius: 0.1 });
    s.addText(`>>  ${t.title}`, { x: x + 0.2, y: y + 0.1, w: 6.0, h: 0.38, fontSize: 14, bold: true, color: DARK_BLUE, fontFace: 'Calibri' });
    s.addText(t.desc, { x: x + 0.2, y: y + 0.5, w: 6.0, h: 0.66, fontSize: 11.5, color: DARK_TEXT, fontFace: 'Calibri', italic: true });
  });
  addFooter(s, 14, TOTAL);
}

// ─── Slide 15 – Thank You ─────────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: DARK_BLUE } });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 3.8, w: '100%', h: 3.8, fill: { color: MID_BLUE } });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 3.75, w: '100%', h: 0.1, fill: { color: ACCENT } });
  s.addText('Thank You', { x: 0.5, y: 0.9, w: 12.5, h: 1.5, fontSize: 60, bold: true, color: WHITE, fontFace: 'Calibri', align: 'center' });
  s.addText('Questions & Live Demo', { x: 0.5, y: 2.5, w: 12.5, h: 0.8, fontSize: 28, color: ACCENT, fontFace: 'Calibri', align: 'center', bold: true });
  s.addText('Karthik Ramu  |  karthik.r@invicara.com', { x: 0.5, y: 4.1, w: 12.5, h: 0.5, fontSize: 16, color: WHITE, fontFace: 'Calibri', align: 'center' });
  s.addText('Platform Reference App - Playwright TypeScript Automation', { x: 0.5, y: 4.7, w: 12.5, h: 0.5, fontSize: 14, color: LIGHT_GRAY, fontFace: 'Calibri', align: 'center', italic: true });
  s.addText('Playwright 1.59  |  TypeScript 6  |  Allure 3.7  |  pixelmatch 7', { x: 0.5, y: 5.4, w: 12.5, h: 0.4, fontSize: 12, color: ACCENT, fontFace: 'Calibri', align: 'center' });
}

pptx.writeFile({ fileName: 'Selenium-to-Playwright-Migration.pptx' })
  .then(() => console.log('PPT saved: Selenium-to-Playwright-Migration.pptx'))
  .catch(err => { console.error('Error:', err); process.exit(1); });