import { test } from '@playwright/test';
import config from '../testdata/config.json';

import { LoginintoTheApplicationTest } from './LoginintoTheApplicationTest';
import { NavigatorTest }               from './NavigatorTest';
import { ModelElementTest }            from './ModelElementTest';
import { FilesMenuTest }               from './FilesMenuTest';
import { AdminUserGroupTest }          from './AdminUserGroupTest';
import { ManageModelTest }             from './ManageModelTest';
import { GenericRestConnectorTest }    from './GenericRestConnectorTest';

import { Browser, BrowserContext, Page } from '@playwright/test';

let sharedPage: Page;
let sharedContext: BrowserContext;

test.describe('Reference App Suite', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ browser }: { browser: Browser }) => {
    sharedContext = await browser.newContext({
      viewport: null,
      ignoreHTTPSErrors: true,
      recordVideo: { dir: 'C:/pw-test-results/' },
    });
    sharedPage = await sharedContext.newPage();
    await sharedPage.goto(config.Environments[config.Env].RfUrl, { waitUntil: 'networkidle', timeout: 60000 });
  });

  test.afterAll(async ({}, testInfo) => {
    const videoPath = await sharedPage.video()?.path();

    await sharedPage.route('**/*', route => route.abort()).catch(() => {});
    await sharedPage.goto('about:blank', { timeout: 5000 }).catch(() => {});
    await Promise.race([
      sharedContext.close(),
      new Promise(resolve => setTimeout(resolve, 8000))
    ]);

    if (videoPath) {
      await testInfo.attach('video', {
        path: videoPath,
        contentType: 'video/webm',
      });
    }
  });

  // ── Login ──────────────────────────────────────────────────────────────────
  test('01 - Login and Project Setup', async () => {
    const loginTest = new LoginintoTheApplicationTest(sharedPage);
    await loginTest.loginTheApplication();
  });

  //── Navigator ──────────────────────────────────────────────────────────────
  test.describe('Navigator', () => {

    test('02 - Verify Model Details', async () => {
      const navTest = new NavigatorTest(sharedPage);
      await navTest.verifyModelDetails();
    });

    test('03 - Verify Model Image', async () => {
      const navTest = new NavigatorTest(sharedPage);
      await navTest.verifyModelImage();
    });

    test('04 - Verify Warranty Data Details', async () => {
      const navTest = new NavigatorTest(sharedPage);
      await navTest.verifyWarrantyDataDetails();
    });

    test('05 - Verify Telemetry via REST API', async () => {
      const navTest = new NavigatorTest(sharedPage);
      await navTest.verifyTelemetryviaRestAPI();
    });

    test('06 - Verify Telemetry MQTT Readings', async () => {
      const navTest = new NavigatorTest(sharedPage);
      await navTest.verifyTelemetryMQTTReadings();
    });

    test('07 - Upload and Delete Files', async () => {
      const navTest = new NavigatorTest(sharedPage);
      await navTest.uploadDeleteFiles();
    });
  });

  //── Model Elements ─────────────────────────────────────────────────────────
  test.describe('Model Elements', () => {
    test('08 - Verify Model Details', async () => {
      const modelTest = new ModelElementTest(sharedPage);
      await modelTest.verifyModelDetails();
    });

    test('09 - Upload and Delete Files', async () => {
      const modelTest = new ModelElementTest(sharedPage);
      await modelTest.uploadDeleteFiles();
    });

    test('10 - Verify Warranty Data', async () => {
      const modelTest = new ModelElementTest(sharedPage);
      await modelTest.verifyWarrantyDataDetails();
    });

    test('11 - Verify Telemetry REST API', async () => {
      const modelTest = new ModelElementTest(sharedPage);
      await modelTest.verifyTelemetryRestAPI();
    });

    test('12 - Verify Telemetry MQTT', async () => {
      const modelTest = new ModelElementTest(sharedPage);
      await modelTest.verifyTelemetryMQTT();
    });
  });

  // ── Files Menu ─────────────────────────────────────────────────────────────
 test.describe('Files Menu', () => {
    test('13 - Upload Rename Delete File', async () => {
      const filesTest = new FilesMenuTest(sharedPage);
      await filesTest.uploadRenameDeleteFile();
    });

    test('14 - Create Folder Handling Files', async () => {
      const filesTest = new FilesMenuTest(sharedPage);
      await filesTest.createFolderHandlingFiles();
    });

    test('15 - Handling Multiple Files with Search', async () => {
      const filesTest = new FilesMenuTest(sharedPage);
      await filesTest.handlingMultipleFileswithsearch();
    });
    });
  // ── Admin User Group ───────────────────────────────────────────────────────
  test.describe('Admin User Group', () => {
    test('16 - Send Invites', async () => {
      const adminTest = new AdminUserGroupTest(sharedPage);
      await adminTest.sendInvites();
    });

    test('17 - Pending Invites', async () => {
      const adminTest = new AdminUserGroupTest(sharedPage);
      await adminTest.pendinginvites();
    });

    test('18 - Remove Invites', async () => {
      const adminTest = new AdminUserGroupTest(sharedPage);
      await adminTest.removeInvites();
    });
  });

  // ── Manage Model ───────────────────────────────────────────────────────────
  test.describe('Manage Model', () => {
    test('19 - MapBox Activation', async () => {
      const manageTest = new ManageModelTest(sharedPage);
      await manageTest.mapBoxActivation();
    });
  });

  // // ── Generic REST Connector ─────────────────────────────────────────────────
  test.describe('Generic REST Connector', () => {
    test('20 - Verify Connector', async () => {
      const grcTest = new GenericRestConnectorTest(sharedPage);
      await grcTest.verifyGenericRestConnector();
    });
  });

});
