import { Page } from '@playwright/test';
import { HomePage }    from '../../reference-app/page/HomePage';
import { ViewerPage }  from '../page/ViewerPage';
import testData from '../../reference-app/testdata/TestData.json';

export class ViewerTest {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToViewer(): Promise<void> {
    const hp = new HomePage(this.page);
    const vp = new ViewerPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await hp.selectNavigatorScreen();
    await vp.clickNavigatorWidgetMinimizeIcon();
  }

  async verify2DViewer(): Promise<void> {
    const vp = new ViewerPage(this.page);
    await vp.click2DMenuIcon();
    await vp.verifyFloorPlanIsNotBlank();
    
    for (const floor of testData.TwoDfloorDetails) {
      await vp.selectTwoDFloorType(floor.FloorType);
      await vp.verifyFloorPlanScreenshot(`floorplan-${floor.FloorType.replace(/[^a-z0-9]/gi, '-')}`);
    }
    await vp.click2DZoomIn();
    await vp.verifyFloorPlanScreenshot('floorplan-zoom-in');
    await vp.click2DZoomOut();
    await vp.verifyFloorPlanScreenshot('floorplan-zoom-out');
    await vp.click2DFullscreen();
    await vp.click2DFullscreen();
  }

  async verifyResetAndProjection(): Promise<void> {
    const vp = new ViewerPage(this.page);
    await vp.verifyViewerScreenshot('before-reset-view');
    await vp.clickResetViewIcon();
    await vp.verifyViewerScreenshot('after-reset-view');
    await vp.clickProjectionIcon();
    await vp.verifyViewerScreenshot('projection-model');
    await vp.clickProjectionIcon();
    await vp.verifyViewerScreenshot('projection-element');
  }

  async verifyViewOptions(): Promise<void> {
    const vp = new ViewerPage(this.page);
    const views: Array<{ click: () => Promise<void>; name: string }> = [
      { click: () => vp.clickTopView(),    name: 'top-view'    },
      { click: () => vp.clickBottomView(), name: 'bottom-view' },
      { click: () => vp.clickLeftView(),   name: 'left-view'   },
      { click: () => vp.clickRightView(),  name: 'right-view'  },
      { click: () => vp.clickFrontView(),  name: 'front-view'  },
      { click: () => vp.clickBackView(),   name: 'back-view'   },
    ];
    await vp.clickViewIcon();
    for (const view of views) {
      await view.click();
      await vp.verifyViewerScreenshot(view.name);
      await vp.clickViewIcon();
    }
  }

  async verifyShadingOptions(): Promise<void> {
    const vp = new ViewerPage(this.page);
    await vp.clickShadingIcon();
    await vp.clickFullShadingWithLines();
    await vp.verifyViewerScreenshot('shading-full-with-lines');
    await vp.clickShadingIcon();
    await vp.clickFullShadingNoLines();
    await vp.verifyViewerScreenshot('shading-full-no-lines');
    await vp.clickShadingIcon();
    await vp.clickEdgesAndLines();
    await vp.verifyViewerScreenshot('shading-edges-lines');
    await vp.clickShadingIcon();
    await vp.clickGlassView();
    await vp.verifyViewerScreenshot('shading-glass-view');
    await vp.clickShadingIcon();
    await vp.clickFullShadingWithLines();
  }

  async verifyUtilities(): Promise<void> {
    const vp = new ViewerPage(this.page);
    await vp.clickUtilitiesIcon();
    await vp.clickIsolateSelection();
    await vp.verifyViewerScreenshot('utilities-isolate');
    await vp.clickUtilitiesIcon();
    await vp.clickShowAll();
    await vp.verifyViewerScreenshot('utilities-show-all');
    await vp.clickUtilitiesIcon();
    await vp.clickHideSelection();
    await vp.verifyViewerScreenshot('utilities-hide');
    await vp.clickUtilitiesIcon();
    await vp.clickShowAll();
  }

  async verifyFocusMode(): Promise<void> {
    const vp = new ViewerPage(this.page);
    await vp.clickFocusMode();
    await vp.verifyViewerScreenshot('focus-mode-on');
    await vp.clickFocusMode();
    await vp.verifyViewerScreenshot('focus-mode-off');
  }

  async verifyCuttingPlanes(): Promise<void> {
    const vp = new ViewerPage(this.page);
    await vp.validateCuttingPlanes();
  }

  async verifyModelComposer(): Promise<void> {
    const vp = new ViewerPage(this.page);
    await vp.clickModelComposer();
    await vp.toggleModelComposerStructural();
    await vp.verifyModelComposerScreenshot('structural-off');
    await vp.toggleModelComposerStructural();
    await vp.toggleModelComposerMechanical();
    await vp.verifyModelComposerScreenshot('mechanical-off');
    await vp.toggleModelComposerMechanical();
    await vp.toggleModelComposerElectrical();
    await vp.verifyModelComposerScreenshot('electrical-off');
    await vp.toggleModelComposerElectrical();
    await vp.toggleModelComposerPlumbing();
    await vp.verifyModelComposerScreenshot('plumbing-off');
    await vp.toggleModelComposerPlumbing();
  }
}
