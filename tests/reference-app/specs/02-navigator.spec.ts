import { test } from '../fixtures';
import testData from '../data/test-data.json';

const [ceilingPanel, tankProbe] = testData.ModelElement;

test.describe('Navigator', () => {
  // 03-07 reload and continue on the Navigator screen that 02 opens.
  test.describe.configure({ mode: 'serial' });

  test('02 - Verify Model Details', async ({ homePage, navigatorPage }) => {
    await homePage.selectElementMenu();
    await homePage.selectNavigatorScreen();
    await navigatorPage.ensureModel1801Selected();
    await navigatorPage.clickNavigatorSearch();
    await navigatorPage.selectElementCategory(ceilingPanel.Category);
    await navigatorPage.selectElementType(ceilingPanel.Type);
    await navigatorPage.clickfetchbutton();
    await navigatorPage.selectNavigatorGroupBy(ceilingPanel.GroupBy);
    await navigatorPage.selectNavigatorProperty(ceilingPanel.Property);
    await navigatorPage.selectNavigatorFunction(ceilingPanel.Function);
    await navigatorPage.selectNavigatorValue(ceilingPanel.Value);
    await navigatorPage.clickNavigatorAddButton();
    await navigatorPage.selectNavigatorList();
    await navigatorPage.selectNavigatorShowingResult();
    await navigatorPage.validateElementProperties();
    await navigatorPage.validateTelemetryRestAPI();
    await navigatorPage.validateWarrantyData();
    await navigatorPage.validateTelemetryviaMQTT();
    await navigatorPage.validateFilesMenu();
  });

  test('03 - Verify Model Image', async ({ appPage, navigatorPage }) => {
    await appPage.reload({ waitUntil: 'networkidle' });
    await navigatorPage.ensureModel1801Selected();
    await navigatorPage.clickNavigatorSearch();
    await navigatorPage.selectElementCategory(ceilingPanel.Category);
    await navigatorPage.selectElementType(ceilingPanel.Type);
    await navigatorPage.clickfetchbutton();
    await navigatorPage.selectNavigatorList();
    await navigatorPage.selectNavigatorShowingResult();
    await navigatorPage.selectNavigatorList();
    await navigatorPage.clickNavigatorFilter();
    await navigatorPage.verifyingModelImage(testData.ModelImage.devConfig_DslModel);
  });

  test('04 - Verify Warranty Data Details', async ({ appPage, navigatorPage }) => {
    await appPage.reload({ waitUntil: 'networkidle' });
    await navigatorPage.searchAndOpenElement(ceilingPanel);
    await navigatorPage.addNavigatorWarrantyData();
    await navigatorPage.editNavigatorWarrantyData();
    await navigatorPage.deleteNavigatorWarrantyData();
  });

  test('05 - Verify Telemetry via REST API', async ({ appPage, navigatorPage }) => {
    await appPage.reload({ waitUntil: 'networkidle' });
    await navigatorPage.searchAndOpenElement(tankProbe);
    await navigatorPage.validateTelemetryRestAPI();
    await navigatorPage.verifyTelemetryviaRestAPI();
  });

  test('06 - Verify Telemetry MQTT Readings', async ({ appPage, navigatorPage }) => {
    await appPage.reload({ waitUntil: 'networkidle' });
    await navigatorPage.searchAndOpenElement(tankProbe);
    await navigatorPage.verifyTelemetryviaMQTT();
  });

  test('07 - Upload and Delete Files', async ({ appPage, navigatorPage }) => {
    await appPage.reload({ waitUntil: 'networkidle' });
    await navigatorPage.searchAndOpenElement(tankProbe);
    await navigatorPage.uploadFile(testData.FilesRename[0].FileName);
    await navigatorPage.deleteFile();
  });
});
