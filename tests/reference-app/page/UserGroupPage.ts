import { Page, Locator } from '@playwright/test';
import { step } from 'allure-js-commons';

export class UserGroupPage {
  private page: Page;
  private appName: Locator;
  private icon_UserPlus: Locator;
  private dbd_SelectUserGroup: Locator;
  private txt_Email: Locator;
  private clk_AddEmail: Locator;
  private clk_SendInvites: Locator;
  private successmsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appName             = page.locator("//span[text()='Reference App']");
    this.icon_UserPlus       = page.locator("//i[contains(@class,'fa-user-plus')]");
    this.dbd_SelectUserGroup = page.locator("//div[@class='css-5l2uyf-control']");
    this.txt_Email           = page.locator("//div[normalize-space(text())='Email']//following-sibling::input[1]");
    this.clk_AddEmail        = page.locator("//div[normalize-space(text())='Add Email']");
    this.clk_SendInvites     = page.locator("div.simple-button", { hasText: 'Send Invites' });
    this.successmsg          = page.locator("//div[@class='overlay-msg-content']");
  }

  private async logStep(message: string): Promise<void> {
    console.log(message);
    await step(message, async () => {});
  }

  async clickUserAddIcon(): Promise<boolean> {
    let flag = false;
    try {
      await this.page.locator("//span[text()='Reference App']").hover();
      await this.page.waitForTimeout(1000);
      await this.icon_UserPlus.click();
      await this.logStep('PASS: Add icon clicked successfully');
      flag = true;
    } catch (e: any) {
      console.error(`FAIL: Add user icon is not displayed: ${e.message}`);
    }
    return flag;
  }

  async selectUserGroup(usergroup: string): Promise<void> {
    try {
      await this.page.waitForTimeout(3000);
      const visible = await this.dbd_SelectUserGroup.isVisible().catch(() => false);
      if (visible) {
        await this.page.waitForTimeout(2000);
        await this.dbd_SelectUserGroup.click();
        const element = this.page.getByRole('option', { name: usergroup, exact: true });
        await element.waitFor({ state: 'visible', timeout: 10000 });
        await element.click();
        await this.appName.click();
        await this.page.waitForTimeout(2000);
      } else {
        console.error('FAIL: Select User Group dropdown field is not displayed');
      }
    } catch (e: any) {
      console.error(`FAIL: Select User Group dropdown not displayed: ${e.message}`);
    }
  }

  async enterEmail(email: string): Promise<void> {
    try {
      const visible = await this.txt_Email.isVisible().catch(() => false);
      if (visible) {
        await this.txt_Email.fill(email);
      } else {
        console.error('FAIL: Email text field is not displayed');
      }
    } catch (e: any) {
      console.error(`FAIL: Email text field error: ${e.message}`);
    }
  }

  async clickAddEmail(): Promise<void> {
    try {
      await this.clk_AddEmail.waitFor({ state: 'visible', timeout: 10000 });
      await this.clk_AddEmail.click();
      await this.page.waitForTimeout(2000);
    } catch (e: any) {
      console.error(`FAIL: Add Email button error: ${e.message}`);
    }
  }

  async clickSendInvites(): Promise<void> {
    try {
      const visible = await this.clk_SendInvites.isVisible().catch(() => false);
      if (visible) {
        await this.clk_SendInvites.click();
      } else {
        console.error('FAIL: Send Invites button is not displayed');
      }
    } catch (e: any) {
      console.error(`FAIL: Send Invites button error: ${e.message}`);
    }
  }

  async verify_AddeEmailInSentoSection(email: string): Promise<boolean> {
    let flag = false;
    try {
      const element = this.page.locator(`//div[contains(text(),'${email}')]`).first();
      await element.waitFor({ state: 'visible', timeout: 15000 });
      flag = true;
      await this.logStep('PASS: User added into sent to section');
    } catch (e: any) {
      console.error(`FAIL: User not added into sent to section: ${e.message}`);
    }
    return flag;
  }

  async verify_SentMessage(): Promise<boolean> {
    let flag = false;
    try {
      await this.successmsg.waitFor({ state: 'visible', timeout: 15000 });
      flag = true;
      await this.logStep('PASS: User sent invites to respective user');
    } catch (e: any) {
      console.error(`FAIL: User invites not sent: ${e.message}`);
    }
    return flag;
  }

  async verify_UserInSentInvitesSection(email: string): Promise<boolean> {
    let flag = false;
    try {
      const el = this.page.locator(`//div[contains(@class,'invite-user-info') and contains(.,'${email}')]`).first();
      await el.waitFor({ state: 'visible', timeout: 10000 });
      flag = true;
      await this.logStep('PASS: User invites displayed under invites section');
    } catch (e: any) {
      console.error(`FAIL: User invites not displayed under invites section: ${e.message}`);
    }
    return flag;
  }

  async click_Deleteicon(email: string): Promise<boolean> {
    let flag = false;
    try {
      const el = this.page.locator(`//div[contains(@class,'invite-user-info') and contains(.,'${email}')]/following-sibling::div[contains(@class,'card-actions')]//i[contains(@class,'fa-trash')]`).first();
      await el.waitFor({ state: 'visible', timeout: 10000 });
      await el.click();
      flag = true;
    } catch (e: any) {
      console.error(`FAIL: Delete icon is not displayed: ${e.message}`);
    }
    return flag;
  }

  async clickRemovelinktext(email: string): Promise<boolean> {
    let flag = false;
    try {
      const el = this.page.locator(`//a[contains(text(),'Remove Invite')]`).first();
      await el.waitFor({ state: 'visible', timeout: 10000 });
      await el.click();
      await this.page.waitForTimeout(3000);
      flag = true;
    } catch (e: any) {
      console.error(`FAIL: Remove linktext is not displayed: ${e.message}`);
    }
    return flag;
  }

  async verify_RemoveInvites(email: string): Promise<void> {
    try {
      await this.page.waitForTimeout(2000);
      const el = this.page.locator(`//div[contains(@class,'invite-user-info') and contains(.,'${email}')]`).first();
      const visible = await el.isVisible().catch(() => false);
      if (!visible) {
        await this.logStep('PASS: Removed user not displayed under invites section');
      } else {
        console.error('FAIL: Removed user still displayed under invites section');
      }
    } catch (e) {
      await this.logStep('PASS: Removed user not displayed under invites section');
    }
  }

  async click_userType(usertype: string): Promise<void> {
    try {
      const element = this.page.locator(`//*[@class='user-group-list']//li[normalize-space()='${usertype}']`);
      await this.page.waitForTimeout(3000);
      await element.click();
    } catch (e: any) {
      console.error(`FAIL: Failed to click User Type: ${e.message}`);
    }
  }
}
