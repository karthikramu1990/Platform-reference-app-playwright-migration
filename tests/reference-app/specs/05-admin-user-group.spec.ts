import { test } from '../fixtures';
import testData from '../data/test-data.json';
import { envConfig } from '../config/env';

const email = testData['Collection-User group'].Email;
const fileContributor = `${envConfig.ProjectList} File Contributor`;
const projAdmin = `${envConfig.ProjectList} Proj Admin`;
const viewer = `${envConfig.ProjectList} Viewer`;

test.describe('Admin User Group', () => {
  // 17 and 18 check and remove the invites that 16 sends.
  test.describe.configure({ mode: 'serial' });

  test('16 - Send Invites', async ({ appPage, homePage, userGroupPage }) => {
    await homePage.selectAdminMenu();
    await homePage.selectUserGroupScreen();
    await appPage.waitForTimeout(10000);

    await userGroupPage.clickUserAddIcon();
    await userGroupPage.selectUserGroup(fileContributor);
    await userGroupPage.selectUserGroup(projAdmin);
    await userGroupPage.selectUserGroup(viewer);
    await userGroupPage.enterEmail(email);
    await userGroupPage.clickAddEmail();

    if (!await userGroupPage.verify_AddeEmailInSentoSection(email)) {
      return;
    }
    await userGroupPage.clickSendInvites();
    await userGroupPage.verify_SentMessage();
  });

  test('17 - Pending Invites', async ({ appPage, userGroupPage }) => {
    await appPage.reload({ waitUntil: 'networkidle' });
    for (const group of [fileContributor, projAdmin, viewer]) {
      await userGroupPage.click_userType(group);
      await userGroupPage.verify_UserInSentInvitesSection(email);
    }
  });

  test('18 - Remove Invites', async ({ appPage, userGroupPage }) => {
    for (const group of [fileContributor, projAdmin, viewer]) {
      await userGroupPage.click_userType(group);
      await userGroupPage.click_Deleteicon(email);
      await userGroupPage.clickRemovelinktext(email);
      await appPage.reload({ waitUntil: 'networkidle' });
      await userGroupPage.verify_RemoveInvites(email);
    }
  });
});
