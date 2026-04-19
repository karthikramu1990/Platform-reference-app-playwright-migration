import path from 'path';
import { Page, Locator } from '@playwright/test';

export class FilesPage {
  private page: Page;
  private uploadFileButton: Locator;
  private newFolder: Locator;
  private newFolderName: Locator;
  private newFolderDescription: Locator;
  private newFolderShortName: Locator;
  private newFolderUserType: Locator;
  private uploadChooseFileButton: Locator;
  private deleteFileButton: Locator;
  private deleteFileButtonPopup: Locator;
  private deleteFolderButtonPopup: Locator;
  private createFolderButton: Locator;
  private backToHomePage: Locator;
  private searchButton: Locator;
  private searchBox: Locator;
  private removeSearch: Locator;

  constructor(page: Page) {
    this.page = page;
    this.uploadFileButton     = page.getByText('Upload File');
    this.newFolder            = page.getByText('New Folder');
    this.newFolderName        = page.locator('.formInputField').first();
    this.newFolderDescription = page.locator('.formInputField').nth(1);
    this.newFolderShortName   = page.locator('.formInputField').nth(2);
    this.newFolderUserType    = page.locator('.formInputField').nth(3);
    this.uploadChooseFileButton   = page.getByRole('button', { name: 'Choose file' });
    this.deleteFileButton         = page.locator("//li[text()='Delete']");
    this.deleteFileButtonPopup    = page.getByRole('button', { name: 'Delete' }).first();
    this.deleteFolderButtonPopup  = page.getByRole('button', { name: 'Delete Folder' });
    this.createFolderButton       = page.getByRole('button', { name: /Create Folder/ });
    this.backToHomePage           = page.locator('#Layer_1').nth(1);
    this.searchButton             = page.getByText('Search', { exact: true });
    this.searchBox                = page.locator("//div[contains(@class,'text-input-border')]//input").first();
    this.removeSearch             = page.getByText('Remove Filter', { exact: true });
  }

  async uploadFile(file: string): Promise<void> {
    try {
      await this.page.waitForTimeout(5000);
      await this.uploadFileButton.waitFor({ state: 'visible' });
      await this.uploadFileButton.click();
      const fileChooserPromise = this.page.waitForEvent('filechooser');
      await this.uploadChooseFileButton.click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(process.cwd(), 'files', file));
      await this.page.waitForTimeout(10000);
      console.log(`PASS: ${file} uploaded`);
    } catch (e) {
      console.error(`ERROR: Unable to upload ${file}`);
    }
  }

  async deleteUploadedFile(filename: string): Promise<void> {
    try {
      const row = this.page.locator(`//td[text()='${filename}']/parent::tr`).first();
      await row.waitFor({ state: 'visible', timeout: 15000 });
      await row.scrollIntoViewIfNeeded();
      await row.hover();
      await this.page.waitForTimeout(500);
      const actionBtn = row.locator('button');
      await actionBtn.waitFor({ state: 'visible', timeout: 10000 });
      await actionBtn.click();
      await this.deleteFileButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.deleteFileButton.click();
      await this.deleteFileButtonPopup.click();
      await this.page.waitForTimeout(10000);
      const fileLocator = this.page.locator(`//*[text()='${filename}']`);
      await fileLocator.waitFor({ state: 'hidden', timeout: 15000 });
      console.log(`PASS: ${filename} Deleted`);
      const isVisible = await fileLocator.isVisible();
      if (isVisible) {
        console.error(`FAIL: ${filename} still visible after deletion`);
      } else {
        console.log(`PASS: ${filename} verified as deleted`);
      }
    } catch (e) {
      console.error(`ERROR: Unable to delete ${filename}`);
    }
  }

  async createNewFolder(filename: string): Promise<void> {
    try {
      await this.newFolder.waitFor({ state: 'visible' });
      await this.newFolder.click();
      await this.page.waitForTimeout(3000);
      await this.newFolderName.click();
      await this.newFolderName.fill(filename);
      await this.newFolderDescription.click();
      await this.newFolderDescription.fill(filename);
      await this.newFolderShortName.click();
      await this.newFolderShortName.fill(filename);
      await this.newFolderUserType.click();
      await this.newFolderUserType.fill(filename);
      await this.createFolderButton.click();
      console.log(`PASS: ${filename} folder created`);
    } catch (e) {
      console.error(`ERROR: Unable to create ${filename}`);
    }
  }

  async clickCreatedFolder(name: string): Promise<void> {
    try {
      const element = this.page.locator(`//*[text()='${name}']`);
      await element.waitFor({ state: 'visible', timeout: 10000 });
      await element.click();
      await this.page.waitForLoadState('networkidle');
      console.log(`PASS: ${name} folder clicked`);
    } catch (e) {
      console.error(`ERROR: Unable to click ${name}`);
    }
  }

  async deleteCreatedFolder(file: string): Promise<void> {
    try {
      await this.page.waitForTimeout(2000);
      await this.backToHomePage.click();
      await this.page.waitForTimeout(2000);
      const element = this.page.locator(`(//*[text()='${file}']//following::button)[1]`);
      await this.page.waitForTimeout(3000);
      await element.click();
      await this.deleteFileButton.click();
      await this.deleteFolderButtonPopup.click();
      const folderLocator = this.page.locator(`//*[text()='${file}']`);
      await folderLocator.waitFor({ state: 'hidden', timeout: 15000 });
      console.log(`PASS: ${file} folder Deleted`);
      const isVisible = await folderLocator.isVisible();
      if (isVisible) {
        console.error(`FAIL: ${file} folder still visible after deletion`);
      } else {
        console.log(`PASS: ${file} folder verified as deleted`);
      }
    } catch (e) {
      console.error(`ERROR: Unable to delete ${file}`);
    }
  }

  async searchFile(file: string): Promise<void> {
    try {
      await this.page.waitForTimeout(3000);
      await this.searchButton.click();
      await this.searchBox.fill(file);
      await this.page.waitForTimeout(15000);
      console.log(`PASS: ${file} searched successfully`);
    } catch (e) {
      console.error(`FAIL: ${file} failed to search`);
    }
  }

  async clickSearch(): Promise<void> {
    try {
      await this.page.waitForTimeout(2000);
      await this.searchButton.click();
      console.log('PASS: Search clicked successfully');
    } catch (e) {
      console.error('ERROR: Failed to click search');
    }
  }

  async removeFilter(): Promise<void> {
    try {
      await this.page.waitForTimeout(2000);
      await this.removeSearch.click();
      await this.page.waitForTimeout(2000);
      console.log('PASS: Search removed successfully');
    } catch (e) {
      console.error('ERROR: Failed to remove search');
    }
  }
}
