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
    this.projectSelectionDd    = page.locator("//div[@class='select__single-value css-1dimb5e-singleValue']").first();
    this.userGroupDd           = page.locator("//div[@class='select__single-value css-1dimb5e-singleValue']").nth(1);
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

  async selectProjectFromDd(name: string): Promise<void> {
    await this.loadProjectBtn.waitFor({ state: 'visible', timeout: 150000 });
    try {
      await this.projectSelectionDd.click();
      const option = this.page.getByRole('option', { name: name, exact: true });
      await option.waitFor({ state: 'visible', timeout: 10000 });
      await option.click();
      await this.projectSelectionDd.waitFor({ state: 'visible', timeout: 5000 });
    } catch (e: any) {
      console.error(`ERROR: selectProjectFromDd failed: ${e.message}`);
    }
  }

  async selectUserGroupFromDd(name: string): Promise<void> {
    try {
      const visible = await this.userGroupDd.isVisible().catch(() => false);
      if (visible) {
        await this.userGroupDd.click();
        const option = this.page.getByRole('option', { name: name, exact: true });
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
      }
      await this.loadProjectBtn.click();
    } catch (e: any) {
      console.error(`ERROR: selectUserGroupFromDd failed: ${e.message}`);
    }
  }
}
