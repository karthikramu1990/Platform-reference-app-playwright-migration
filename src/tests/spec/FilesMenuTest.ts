import { Page } from '@playwright/test';
import { HomePage } from '../page/HomePage';
import { FilesPage } from '../page/FilesPage';
import testData from '../testdata/TestData.json';

export class FilesMenuTest {
  private page: Page;
  private hp: HomePage | null = null;
  private fp: FilesPage | null = null;

  constructor(page: Page) {
    this.page = page;
  }

  async uploadRenameDeleteFile(): Promise<void> {
    this.hp = new HomePage(this.page);
    this.fp = new FilesPage(this.page);
    await this.hp.selectFilesMenu();
    await this.hp.selectInnerFilesMenu();
    await this.page.waitForTimeout(10000);
    await this.fp.uploadFile(testData.FilesRename[0].FileName);
    await this.fp.deleteUploadedFile(testData.FilesRename[0].FileName);
  }

  async createFolderHandlingFiles(): Promise<void> {
    this.fp = new FilesPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await this.fp.createNewFolder(testData.FilesRename[0].FolderName);
    await this.fp.clickCreatedFolder(testData.FilesRename[0].FolderName);
    await this.page.waitForTimeout(5000);
    await this.fp.uploadFile(testData.FilesRename[0].FileName);
    await this.fp.deleteCreatedFolder(testData.FilesRename[0].FolderName);
  }

  async handlingMultipleFileswithsearch(): Promise<void> {
    this.fp = new FilesPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await this.fp.uploadFile(testData.FilesRename[0].FileName);
    await this.fp.uploadFile(testData.FilesRename[1].FileName);
    await this.fp.uploadFile(testData.FilesRename[2].FileName);
    await this.fp.searchFile(testData.FilesRename[0].FileName);
    await this.fp.removeFilter();
    await this.fp.clickSearch();
    await this.fp.searchFile(testData.FilesRename[1].FileName);
    await this.fp.removeFilter();
    await this.fp.clickSearch();
    await this.fp.searchFile(testData.FilesRename[2].FileName);
    await this.fp.removeFilter();
    await this.fp.deleteUploadedFile(testData.FilesRename[0].FileName);
    await this.fp.deleteUploadedFile(testData.FilesRename[1].FileName);
    await this.fp.deleteUploadedFile(testData.FilesRename[2].FileName);
  }
}
