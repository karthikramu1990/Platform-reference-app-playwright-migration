import { Page } from '@playwright/test';
import { HomePage } from '../page/HomePage';
import { UserGroupPage } from '../page/UserGroupPage';
import testData from '../testdata/TestData.json';
import config from '../testdata/config.json';

export class AdminUserGroupTest {
  private page: Page;
  private flag: boolean = true;
  private user: UserGroupPage;
  private hp: HomePage;

  private email: string;
  private filecontribution: string;
  private projadmin: string;
  private viewer: string;
  private usertype: string;

  constructor(page: Page) {
    this.page = page;
    this.user = new UserGroupPage(page);
    this.hp   = new HomePage(page);
    const project = config.Environments[config.Env].ProjectList;
    this.email            = testData['Collection-User group'].Email;
    this.filecontribution = `${project} File Contributor`;
    this.projadmin        = `${project} Proj Admin`;
    this.viewer           = `${project} Viewer`;
    this.usertype         = `${project} File Contributor`;
  }

  async sendInvites(): Promise<void> {
    await this.hp.selectAdminMenu();
    await this.hp.selectUserGroupScreen();
    await this.page.waitForTimeout(10000);

    if (!await this.user.clickUserAddIcon()) {
      this.flag = false;
    }
    await this.user.selectUserGroup(this.filecontribution);
    await this.user.selectUserGroup(this.projadmin);
    await this.user.selectUserGroup(this.viewer);
    await this.user.enterEmail(this.email);
    await this.user.clickAddEmail();

    if (!await this.user.verify_AddeEmailInSentoSection(this.email)) {
      this.flag = false;
      return;
    }
    await this.user.clickSendInvites();
    if (!await this.user.verify_SentMessage()) {
      this.flag = false;
    }
  }

  async pendinginvites(): Promise<void> {
    if (!this.flag) {
      console.log('SKIP: Please check the Send Invites Testcase');
      return;
    }
    await this.page.reload({ waitUntil: 'networkidle' });
    await this.user!.click_userType(this.filecontribution);
    await this.user!.verify_UserInSentInvitesSection(this.email);
    await this.user!.click_userType(this.projadmin);
    await this.user!.verify_UserInSentInvitesSection(this.email);
    await this.user!.click_userType(this.viewer);
    await this.user!.verify_UserInSentInvitesSection(this.email);
  }

  async removeInvites(): Promise<void> {
    if (!this.flag) {
      console.log('SKIP: Please check the Send Invites Testcase');
      return;
    }

    await this.user!.click_userType(this.filecontribution);
    await this.user!.click_Deleteicon(this.email);
    await this.user!.clickRemovelinktext(this.email);
    await this.page.reload({ waitUntil: 'networkidle' });
    await this.user!.verify_RemoveInvites(this.email);

    await this.user!.click_userType(this.projadmin);
    await this.user!.click_Deleteicon(this.email);
    await this.user!.clickRemovelinktext(this.email);
    await this.page.reload({ waitUntil: 'networkidle' });
    await this.user!.verify_RemoveInvites(this.email);

    await this.user!.click_userType(this.viewer);
    await this.user!.click_Deleteicon(this.email);
    await this.user!.clickRemovelinktext(this.email);
    await this.page.reload({ waitUntil: 'networkidle' });
    await this.user!.verify_RemoveInvites(this.email);
  }
}
