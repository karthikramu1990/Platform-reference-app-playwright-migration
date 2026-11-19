import { Page, Locator, expect } from '@playwright/test';

export interface NewUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

// A new, unique user for every run: testuser<yyyyMMddHHmmss>@yopmail.com. No "+" alias, because
// the sign-up form may reject it; yopmail accepts any mailbox name.
export function uniqueNewUser(password: string): NewUser {
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  return {
    email: `testuser${stamp}@yopmail.com`,
    firstName: 'test',
    lastName: `user${stamp}`,
    password,
  };
}

// Reference App > Sign In page > Sign Up. Recorded on qa2 (Nov 2026): no email verification step;
// after Sign Up a confirmation screen offers Sign In, which goes to the password page.
export class SignUpPage {
  private page: Page;
  private signUpLink: Locator;
  private email: Locator;
  private firstName: Locator;
  private lastName: Locator;
  private password: Locator;
  private confirmPassword: Locator;
  private termsCheckbox: Locator;
  private signUpBtn: Locator;
  private signInBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signUpLink      = page.getByRole('link', { name: 'Sign Up' });
    this.email           = page.getByRole('textbox', { name: 'Email' });
    this.firstName       = page.getByRole('textbox', { name: 'First name' });
    this.lastName        = page.getByRole('textbox', { name: 'Last name' });
    this.password        = page.getByRole('textbox', { name: 'Password', exact: true });
    this.confirmPassword = page.getByRole('textbox', { name: 'Confirm password' });
    this.termsCheckbox   = page.getByRole('checkbox', { name: 'I confirm that I have read' });
    this.signUpBtn       = page.getByRole('button', { name: 'Sign Up' });
    this.signInBtn       = page.getByRole('button', { name: 'Sign In' });
  }

  async signUp(user: NewUser): Promise<void> {
    await this.signUpLink.click();
    await this.email.fill(user.email);
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.password.fill(user.password);
    await this.confirmPassword.fill(user.password);
    await this.termsCheckbox.check();
    await this.signUpBtn.click();
    await expect(this.signInBtn).toBeVisible({ timeout: 60000 });
  }

  // Confirmation screen > Sign In: lands on the password page for the new account.
  async continueToSignIn(): Promise<void> {
    await this.signInBtn.click();
  }
}
