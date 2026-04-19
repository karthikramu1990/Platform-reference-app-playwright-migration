import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private page: Page;
  private invicaraLogo: Locator;
  private userName: Locator;
  private loginButton: Locator;
  private passWord: Locator;
  private invalidUserNameMsg: Locator;
  private signUpButton: Locator;
  private signInHeaderName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.invicaraLogo       = page.locator('.logo').first();
    this.userName           = page.locator('[name="username"]');
    this.loginButton        = page.getByRole('button', { name: 'Login' });
    this.passWord           = page.locator('#password');
    this.invalidUserNameMsg = page.locator('.alert.alert-danger.alert-warning');
    this.signUpButton       = page.locator('button.secondary').first();
    this.signInHeaderName   = page.getByRole('heading', { name: 'Sign In' });
  }

  async invicaroLogoIsDisplayed(): Promise<boolean> {
    return await this.invicaraLogo.isVisible();
  }

  async signInNameIsDisplayed(): Promise<boolean> {
    return await this.signInHeaderName.isVisible();
  }

  async enterUserName(uName: string): Promise<void> {
    await this.userName.evaluate((el: HTMLInputElement, val: string) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, uName);
    await this.loginButton.click();
  }

  async enterPassword(psw: string): Promise<void> {
    await this.passWord.waitFor({ state: 'visible' });
    await this.passWord.fill(psw);
    await this.loginButton.click();
  }

  async LoginTest(uName: string, psw: string): Promise<void> {
    await this.userName.evaluate((el: HTMLInputElement, val: string) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, uName);
    await this.loginButton.click();
    await this.page.waitForTimeout(5000);
    const passwordVisible = await this.passWord.isVisible().catch(() => false);
    if (passwordVisible) {
      await this.passWord.fill(psw);
      await this.loginButton.click();
      await this.page.waitForTimeout(3000);
    } else {
      const errorVisible = await this.invalidUserNameMsg.isVisible().catch(() => false);
      if (errorVisible) {
        console.log('Invalid User Name');
      }
    }
  }

  async clickSignUp(): Promise<void> {
    await this.signUpButton.click();
  }
}
