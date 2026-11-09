import { test } from '../fixtures';
import testData from '../data/test-data.json';

const [ceilingPanel, tankProbe] = testData.ModelElement;

test.describe('Model Elements', () => {
  test('08 - Verify Model Details', async ({ homePage, modelElementPage }) => {
    await homePage.selectElementMenu();
    await homePage.selectModelElementScreen();
    await modelElementPage.fetchAndOpenElement(ceilingPanel);
    await modelElementPage.validateElementProperties();
    await modelElementPage.validateFiles();
    await modelElementPage.validateWarrantyData();
    await modelElementPage.validateTelemetryRestAPI();
    await modelElementPage.validateTelemetryMQTT();
  });

  test('09 - Upload and Delete Files', async ({ appPage, homePage, modelElementPage }) => {
    await appPage.reload({ waitUntil: 'networkidle' });
    await homePage.selectElementMenu();
    await homePage.selectModelElementScreen();
    await modelElementPage.fetchAndOpenElement(ceilingPanel);
    await modelElementPage.uploadFile(testData.FilesRename[0].FileName);
    await modelElementPage.deleteFile();
  });

  test('10 - Verify Warranty Data', async ({ appPage, homePage, modelElementPage }) => {
    await appPage.reload({ waitUntil: 'networkidle' });
    await homePage.selectElementMenu();
    await homePage.selectModelElementScreen();
    await modelElementPage.fetchAndOpenElement(ceilingPanel);
    await modelElementPage.addWarrantyData();
    await modelElementPage.editWarrantyData();
    await modelElementPage.deleteWarrantyData();
  });

  test('11 - Verify Telemetry REST API', async ({ appPage, homePage, modelElementPage }) => {
    await appPage.reload({ waitUntil: 'networkidle' });
    await homePage.selectElementMenu();
    await homePage.selectModelElementScreen();
    await modelElementPage.fetchAndOpenElement(tankProbe);
    await modelElementPage.verifyTelemetryRestAPI();
  });

  test('12 - Verify Telemetry MQTT', async ({ appPage, homePage, modelElementPage }) => {
    await appPage.reload({ waitUntil: 'networkidle' });
    await homePage.selectElementMenu();
    await homePage.selectModelElementScreen();
    await modelElementPage.fetchAndOpenElement(tankProbe);
    await modelElementPage.verifyTelemetryMQTT();
  });
});
