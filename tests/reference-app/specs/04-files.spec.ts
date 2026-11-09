import { test } from '../fixtures';
import testData from '../data/test-data.json';

const [pdf, xlsx, png] = testData.FilesRename;

test.describe('Files Menu', () => {
  // 14 and 15 reload and continue on the Files screen that 13 opens.
  test.describe.configure({ mode: 'serial' });

  test('13 - Upload Rename Delete File', async ({ appPage, homePage, filesPage }) => {
    await homePage.selectFilesMenu();
    await homePage.selectInnerFilesMenu();
    await appPage.waitForTimeout(10000);
    await filesPage.uploadFile(pdf.FileName);
    await filesPage.deleteUploadedFile(pdf.FileName);
  });

  test('14 - Create Folder Handling Files', async ({ appPage, filesPage }) => {
    await appPage.reload({ waitUntil: 'networkidle' });
    await filesPage.createNewFolder(pdf.FolderName);
    await filesPage.clickCreatedFolder(pdf.FolderName);
    await appPage.waitForTimeout(5000);
    await filesPage.uploadFile(pdf.FileName);
    await filesPage.deleteCreatedFolder(pdf.FolderName);
  });

  test('15 - Handling Multiple Files with Search', async ({ appPage, filesPage }) => {
    await appPage.reload({ waitUntil: 'networkidle' });
    await filesPage.uploadFile(pdf.FileName);
    await filesPage.uploadFile(xlsx.FileName);
    await filesPage.uploadFile(png.FileName);
    await filesPage.searchFile(pdf.FileName);
    await filesPage.removeFilter();
    await filesPage.clickSearch();
    await filesPage.searchFile(xlsx.FileName);
    await filesPage.removeFilter();
    await filesPage.clickSearch();
    await filesPage.searchFile(png.FileName);
    await filesPage.removeFilter();
    await filesPage.deleteUploadedFile(pdf.FileName);
    await filesPage.deleteUploadedFile(xlsx.FileName);
    await filesPage.deleteUploadedFile(png.FileName);
  });
});
