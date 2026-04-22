import { Page } from '@playwright/test';
import { HomePage }   from '../../reference-app/page/HomePage';
import { ViewerPage } from '../page/ViewerPage';
import testData from '../../reference-app/testdata/TestData.json';

export class AnnotationsTest {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyAnnotations(): Promise<void> {
    const hp = new HomePage(this.page);
    const vp = new ViewerPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await hp.selectNavigatorScreen();
    await vp.clickNavigatorWidgetMinimizeIcon();

    await vp.clickAnnotationsMenu();
    await vp.drawAndVerifyLine();
    await vp.deleteAllAnnotations();

    await vp.clickAnnotationsMenu();
    await vp.drawAndVerifyCircle();
    await vp.deleteAllAnnotations();

    await vp.clickAnnotationsMenu();
    await vp.drawAndVerifyRectangle();
    await vp.deleteAllAnnotations();

    await vp.clickAnnotationsMenu();
    await vp.drawAndVerifyPolyline();
    await vp.deleteAllAnnotations();

    await vp.clickAnnotationsMenu();
    await vp.drawAndVerifyPolygon();
    await vp.deleteAllAnnotations();

    await vp.clickAnnotationsMenu();
    await vp.drawAndVerifyLeaderNote();
    await vp.deleteAllAnnotations();

    await vp.clickAnnotationsMenu();
    await vp.drawAndVerifyText();
    await vp.deleteAllAnnotations();

    await vp.clickAnnotationsMenu();
    await vp.drawAndVerifyFreehand();

    await vp.clickAnnotationsMenu();
    await vp.exportAnnotations(testData.annotations?.exportFile ?? 'annotations-export.json');
    await vp.deleteAllAnnotations();

    await vp.clickAnnotationsMenu();
    await vp.importAnnotations(testData.annotations?.importFile ?? 'annotations-export.json');
    await vp.verifyImportedAnnotations();
    await vp.deleteAllAnnotations();
  }
}
