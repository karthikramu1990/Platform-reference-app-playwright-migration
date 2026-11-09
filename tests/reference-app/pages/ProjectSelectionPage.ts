import { Page, Locator } from '@playwright/test';

export class ProjectSelectionPage {
  private page: Page;
  private loadProjectBtn: Locator;
  private textProjectSelection: Locator;
  private projectSelectionDd: Locator;
  private userGroupDd: Locator;
  private createNewProjectBtn: Locator;
  private createNewProjectName: Locator;
  private createNewProjectshort: Locator;
  private createNewProjectDesc: Locator;
  private createNewProjectSetup: Locator;
  private createNewProjectAgree: Locator;
  private createNewProjectDone: Locator;
  private profileDropdown: Locator;
  private switchProject: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadProjectBtn        = page.getByRole('button', { name: 'Load Project' });
    this.textProjectSelection  = page.getByText('Project Selection', { exact: true });
    // Located by the select's input name: the generated css-* class names change between builds,
    // and a missed user-group dropdown silently loads whichever group "Remember" kept.
    this.projectSelectionDd    = page.locator('input[name="projectSelect"]').locator('..').locator('.select__control');
    this.userGroupDd           = page.locator('input[name="userGroupSelect"]').locator('..').locator('.select__control');
    this.createNewProjectBtn   = page.getByRole('button', { name: 'Create Project' });
    this.createNewProjectName  = page.locator('#_name');
    this.createNewProjectshort = page.locator('#_shortName');
    this.createNewProjectDesc  = page.locator('#_description');
    this.createNewProjectSetup = page.getByRole('button', { name: 'Set up' });
    this.createNewProjectAgree = page.getByRole('button', { name: 'Agree' });
    this.createNewProjectDone  = page.locator('button.done');
    this.profileDropdown       = page.locator("//div[@class='session-dropdown']");
    this.switchProject         = page.getByText('Switch Project', { exact: true });
  }

  async verifyProjectSelectionText(): Promise<boolean> {
    try {
      return await this.textProjectSelection.isVisible();
    } catch (e) {
      console.error('ERROR: Unable To Login');
      return false;
    }
  }

  // No try/catch here: if the project or user group can't be chosen, Login must fail rather than
  // carry on in the wrong project or group.
  async selectProjectFromDd(name: string): Promise<void> {
    await this.loadProjectBtn.waitFor({ state: 'visible', timeout: 150000 });
    await this.projectSelectionDd.click();
    const option = this.page.getByRole('option', { name: name, exact: true });
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
  }

  async selectUserGroupFromDd(name: string): Promise<void> {
    // Accounts with a single group for the project get no user-group dropdown.
    if (await this.userGroupDd.isVisible()) {
      await this.userGroupDd.click();
      const option = this.page.getByRole('option', { name: name, exact: true });
      await option.waitFor({ state: 'visible', timeout: 10000 });
      await option.click();
    }
    await this.loadProjectBtn.click();
    await this.loadProjectBtn.waitFor({ state: 'hidden', timeout: 120000 });
  }
}
