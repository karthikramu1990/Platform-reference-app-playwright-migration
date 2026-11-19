import { Page, Locator, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';

export interface ConsoleWorkspace {
  organization: string;
  application: string;
  workspace: string;
}

// Console app > Passport service > User Groups > Edit > "Invite and remove users". Recorded on qa2 (Nov 2026).
// The Console URL is the Reference App URL with /reference/ replaced by /console/.
export class ConsolePage {
  private page: Page;
  private organizationInput: Locator;
  private applicationInput: Locator;
  private workspaceInput: Locator;
  private loadNowBtn: Locator;
  private passportServiceLink: Locator;
  private userGroupsTab: Locator;
  private groupRows: Locator;
  private dialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.organizationInput   = page.getByRole('textbox', { name: 'Choose an organization' });
    this.applicationInput    = page.getByRole('textbox', { name: 'Choose an application' });
    this.workspaceInput      = page.getByRole('textbox', { name: 'Choose a workspace' });
    this.loadNowBtn          = page.getByRole('button', { name: 'Load Now' });
    this.passportServiceLink = page.getByRole('link', { name: 'Passport service' });
    this.userGroupsTab       = page.getByRole('tab', { name: 'User Groups' });
    // Group rows are the ones with a "more" (⋮) menu; header rows have none.
    this.groupRows           = page.getByRole('row').filter({ has: page.getByLabel('more') });
    this.dialog              = page.getByRole('dialog');
  }

  static urlFor(referenceAppUrl: string): string {
    return referenceAppUrl.replace('/reference/', '/console/');
  }

  async signIn(url: string, username: string, password: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    const login = new LoginPage(this.page);
    await login.enterUserName(username);
    await login.enterPassword(password);
    await expect(this.organizationInput.or(this.passportServiceLink)).toBeVisible({ timeout: 60000 });
  }

  // Loads the given organization/application/workspace when the Console asks for one.
  async loadWorkspace(ws: ConsoleWorkspace): Promise<void> {
    if (await this.organizationInput.isVisible()) {
      await this.choose(this.organizationInput, ws.organization);
      await this.choose(this.applicationInput, ws.application);
      await this.choose(this.workspaceInput, ws.workspace);
      await this.loadNowBtn.click();
    }
  }

  private async choose(input: Locator, value: string): Promise<void> {
    await input.click();
    await this.page.getByText(value, { exact: true }).click();
  }

  async openUserGroups(): Promise<void> {
    await this.passportServiceLink.click();
    await this.userGroupsTab.click();
    await expect(this.groupRows.first()).toBeVisible({ timeout: 60000 });
  }

  // groupKey: any text unique to the group's row, e.g. the start of its id.
  private async editGroup(groupKey: string): Promise<void> {
    const row = this.groupRows.filter({ hasText: groupKey }).first();
    await expect(row, `user group "${groupKey}" not listed`).toBeVisible({ timeout: 60000 });
    // The table re-renders while it settles and closes the ⋮ menu, so open it and click Edit again
    // until the edit dialog is actually open.
    const editItem = this.page.getByRole('menuitem', { name: 'Edit' });
    const inviteTab = this.page.getByRole('tab', { name: 'Invite and remove users' });
    await expect(async () => {
      if (!(await editItem.isVisible())) await row.getByLabel('more').click({ timeout: 5000 });
      await editItem.click({ timeout: 5000 });
      await expect(inviteTab).toBeVisible({ timeout: 10000 });
    }).toPass({ timeout: 90000 });
    await inviteTab.click();
  }

  async inviteUser(groupKey: string, email: string): Promise<void> {
    await this.editGroup(groupKey);
    await this.page.getByRole('button', { name: 'Add More' }).click();
    // Add More appends an empty email row at the end; the recorded nth-child() path depended on
    // how many members the group already had.
    await this.dialog.getByRole('textbox').last().fill(email);
    await this.page.getByRole('button', { name: 'Save & Close' }).click();
    await expect(this.page.getByText('Invitation sent!')).toBeVisible({ timeout: 60000 });
  }

  // Each member is a row (email field + delete button); the row is found by the email it holds.
  async removeUser(groupKey: string, email: string): Promise<void> {
    await this.editGroup(groupKey);
    const memberRows = this.dialog.locator('.d-flex.align-items-end');
    await expect(memberRows.first()).toBeVisible({ timeout: 60000 });

    let target: Locator | null = null;
    for (let i = 0, n = await memberRows.count(); i < n; i++) {
      const row = memberRows.nth(i);
      const input = row.getByRole('textbox');
      if ((await input.count()) && (await input.first().inputValue()) === email) { target = row; break; }
    }
    if (!target) throw new Error(`${email} is not a member of user group "${groupKey}"`);

    await target.locator(':scope > .MuiButtonBase-root').click();
    await this.page.getByRole('button', { name: 'Yes, delete it' }).click();
    await expect(this.page.getByText(`User ${email} was`)).toBeVisible({ timeout: 60000 });
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }
}
