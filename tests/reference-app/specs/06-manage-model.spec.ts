import { test } from '../fixtures';
import testData from '../data/test-data.json';
import { mapboxSecretToken } from '../config/env';

test.describe('Manage Model', () => {
  test('19 - MapBox Activation', async ({ appPage, homePage, manageModelPage }) => {
    await appPage.reload({ waitUntil: 'networkidle' });
    await homePage.selectAdminMenuManageModel();
    await homePage.selectManageModelScreen();
    await manageModelPage.enterMapBoxUserName(testData.ManageModel.MapboxUsername);
    await manageModelPage.enterMapBoxScopes(testData.ManageModel.MapboxScopes);
    await manageModelPage.enterMapBoxExpiry(testData.ManageModel.MapboxExpiry);
    await manageModelPage.enterMapBoxSecretToken(mapboxSecretToken());
    await manageModelPage.clickAddTempTokenConfig();
    await manageModelPage.verify_MapboxActivation();
  });
});
