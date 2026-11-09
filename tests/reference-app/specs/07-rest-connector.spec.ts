import { test } from '../fixtures';
import testData from '../data/test-data.json';

test.describe('Generic REST Connector', () => {
  test('20 - Verify Connector', async ({ homePage, restConnectorPage }) => {
    await homePage.selectAdminMenuManageModel();
    await homePage.selectGenericRestConnectorPage();
    await restConnectorPage.clickGenericConnectorButton();
    await restConnectorPage.selectGenericRestConnector(testData.GenericRestConnector.ConnectorName);
    await restConnectorPage.clickExpandAllGeneric();
  });
});
