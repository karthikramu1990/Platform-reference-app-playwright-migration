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

  // Project Selection > "Pending invitations": accepts the invite (a new user has only one) and
  // returns its text, e.g. "User Group: Application Developer Application Developer".
  async acceptPendingInvite(): Promise<string> {
    const invite = this.page.getByRole('heading', { name: 'Pending invitations' })
      .locator('xpath=following-sibling::*').getByRole('listitem').first();
    await invite.waitFor({ state: 'visible', timeout: 150000 });
    const text = (await invite.innerText()).replace(/\s+/g, ' ').replace(/\b(Accept|Reject)\b/g, '').trim();
    await invite.getByRole('button', { name: 'Accept' }).click();
    await invite.waitFor({ state: 'detached', timeout: 60000 });
    return text;
  }

  // Create Project > Choose a mode > Continue > Setup Project form > Set up > Agree > ... > Done.
  // Same form locators as the IAF Viewer's createProject (PLG-1690), which runs on qa2.
  async createProject(
    project: { name: string; shortName: string; description: string },
    mode: 'Basic' | 'Advanced' = 'Advanced',
    setupTimeoutMs = 70 * 60 * 1000,
  ): Promise<void> {
    await this.createNewProjectBtn.click();

    await this.page.getByText('Choose a mode').waitFor({ state: 'visible', timeout: 60000 });
    await this.page.getByText(`${mode} mode`, { exact: true }).click();
    await this.page.getByRole('button', { name: 'Continue' }).click();

    const input = (label: string) => this.page.locator(`xpath=//*[normalize-space(text())="${label}"]/following::input[1]`);
    await input('Name').waitFor({ state: 'visible', timeout: 60000 });
    await input('Name').fill(project.name);
    await input('Short Name').fill(project.shortName);
    await input('Description').fill(project.description);
    await this.page.locator("xpath=//label[text()='Enable multiple model support']/..//input[@type='checkbox']").check();

    await this.page.getByRole('button', { name: 'Set Up' }).click();
    await this.page.getByRole('button', { name: 'Agree', exact: true }).click();

    // Fail fast on a setup error instead of waiting out the whole setup timeout.
    const done = this.page.getByRole('button', { name: 'Done' });
    const setupError = this.page.getByText('Setup did not complete');
    await done.or(setupError).waitFor({ state: 'visible', timeout: setupTimeoutMs });
    if (await setupError.isVisible()) {
      throw new Error(`Project setup for "${project.name}" failed: "Setup did not complete. An error occured during setup!"`);
    }
    await done.click();
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
