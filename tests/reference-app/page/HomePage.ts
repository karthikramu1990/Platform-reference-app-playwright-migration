import { Page, Locator } from '@playwright/test';

export class HomePage {
  private page: Page;
  private switchProjectDd: Locator;
  private invicaraLogo: Locator;
  private elementMenu: Locator;
  private navigator: Locator;
  private modelElements: Locator;
  private adminMenu: Locator;
  private usergroupMenu: Locator;
  private filesMenu: Locator;
  private innerFilesmenu: Locator;
  private manageModel: Locator;
  private genericRestConnector: Locator;

  constructor(page: Page) {
    this.page = page;
    this.switchProjectDd      = page.locator("//div[@class='session-dropdown']");
    this.invicaraLogo         = page.locator('#logo');
    this.elementMenu          = page.locator("//i[@class='inv-icon-svg inv-icon-assets' or @class='inv-icon-svg inv-icon-assets purple active']").first();
    this.navigator            = page.getByText('Navigator', { exact: true }).first();
    this.modelElements        = page.getByText('Model Elements', { exact: true }).first();
    this.adminMenu            = page.locator("li[class^='nav-group-li']").nth(2);
    this.usergroupMenu        = page.locator("a[href='#/UserGroupView'] span.menu-item");
    this.filesMenu            = page.locator("//i[@class='inv-icon-svg inv-icon-download']");
    this.innerFilesmenu       = page.locator("a[href='#/uploadFile'] span.menu-item");
    this.manageModel          = page.getByText('Manage Model', { exact: true });
    this.genericRestConnector = page.getByText('Rest Connectors', { exact: true });
  }

  async selectElementMenu(): Promise<void> {
    try {
      await this.elementMenu.waitFor({ state: 'visible' });
      await this.elementMenu.hover();
      await this.page.waitForTimeout(1000);
      await this.invicaraLogo.hover();
      console.log('INFO: 2D/3D menu hovered');
    } catch (e) {
      console.error('ERROR: Unable to select 2D/3D menu');
    }
  }

  async selectModelElementScreen(): Promise<void> {
    try {
      await this.elementMenu.waitFor({ state: 'visible' });
      await this.elementMenu.hover();
      await this.page.waitForTimeout(1000);
      await this.modelElements.waitFor({ state: 'visible' });
      await this.modelElements.click();
      await this.invicaraLogo.hover();
      console.log('INFO: Model element menu Selected');
    } catch (e) {
      console.error('ERROR: Unable to select Model element menu');
    }
  }

  async selectNavigatorScreen(): Promise<void> {
    try {
      await this.elementMenu.waitFor({ state: 'visible' });
      await this.elementMenu.hover();
      await this.page.waitForTimeout(1000);
      await this.navigator.waitFor({ state: 'visible' });
      await this.navigator.click();
      await this.page.waitForTimeout(1000);
      await this.invicaraLogo.hover();
      await this.page.waitForTimeout(5000);
      console.log('INFO: Navigator menu Selected');
    } catch (e) {
      console.error('ERROR: Unable to select navigator menu');
    }
  }

  async selectAdminMenu(): Promise<void> {
    try {
      await this.adminMenu.waitFor({ state: 'visible' });
      await this.adminMenu.hover();
      await this.page.waitForTimeout(1000);
      await this.invicaraLogo.hover();
      console.log('INFO: Admin menu Selected');
    } catch (e) {
      console.error('ERROR: Unable to select Admin menu');
    }
  }

  async selectAdminMenuManageModel(): Promise<void> {
    try {
      await this.adminMenu.waitFor({ state: 'visible' });
      await this.adminMenu.hover();
      await this.page.waitForTimeout(1000);
      await this.invicaraLogo.hover();
      console.log('INFO: Admin menu Selected');
    } catch (e) {
      console.error('ERROR: Unable to select Admin menu');
    }
  }

  async selectUserGroupScreen(): Promise<void> {
    try {
      await this.adminMenu.waitFor({ state: 'visible' });
      await this.adminMenu.hover();
      await this.page.waitForTimeout(1000);
      await this.usergroupMenu.waitFor({ state: 'visible' });
      await this.usergroupMenu.click();
      await this.invicaraLogo.hover();
      console.log('INFO: usergroupMenu Selected');
    } catch (e) {
      console.error('ERROR: Unable to select usergroupMenu');
    }
  }

  async selectManageModelScreen(): Promise<void> {
    try {
      await this.adminMenu.waitFor({ state: 'visible' });
      await this.adminMenu.hover();
      await this.page.waitForTimeout(1000);
      await this.manageModel.waitFor({ state: 'visible' });
      await this.manageModel.click();
      await this.invicaraLogo.hover();
      console.log('INFO: manageModel menu Selected');
    } catch (e) {
      console.error('ERROR: Unable to select manageModel menu');
    }
  }

  async selectFilesMenu(): Promise<void> {
    try {
      await this.filesMenu.waitFor({ state: 'visible' });
      await this.filesMenu.hover();
      await this.page.waitForTimeout(1000);
      await this.invicaraLogo.hover();
      console.log('INFO: Files menu Selected');
    } catch (e) {
      console.error('ERROR: Unable to select files menu');
    }
  }

  async selectInnerFilesMenu(): Promise<void> {
    try {
      await this.filesMenu.waitFor({ state: 'visible' });
      await this.filesMenu.hover();
      await this.page.waitForTimeout(1000);
      await this.innerFilesmenu.waitFor({ state: 'visible' });
      await this.innerFilesmenu.click();
      await this.invicaraLogo.hover();
      console.log('INFO: Inner Files menu Selected');
    } catch (e) {
      console.error('ERROR: Unable to select Inner Files menu');
    }
  }

  async selectGenericRestConnectorPage(): Promise<void> {
    try {
      await this.genericRestConnector.waitFor({ state: 'visible' });
      await this.genericRestConnector.click();
      await this.invicaraLogo.hover();
      console.log('INFO: Generic Rest Connector page Selected');
    } catch (e) {
      console.error('ERROR: Unable to select Generic Rest Connector page');
    }
  }
}
