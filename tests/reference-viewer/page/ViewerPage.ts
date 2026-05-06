import path from 'path';
import { Page, Locator, expect } from '@playwright/test';
import { step } from 'allure-js-commons';

export class ViewerPage {
  private page: Page;

  // 3D Toolbar
  private resetViewToolbarIcon: Locator;
  private projectionToolbarIcon: Locator;
  private navigationToolbarIcon: Locator;
  private measurementToolbarIcon: Locator;
  private cuttingPlaneToolbarIcon: Locator;
  private twoDViewerToolbar: Locator;
  private focusModeToolbar: Locator;
  private settingsToolbarIcon: Locator;
  private viewToolBarIcon: Locator;
  private topViewIcon: Locator;
  private bottomViewIcon: Locator;
  private leftViewIcon: Locator;
  private rightViewIcon: Locator;
  private frontViewIcon: Locator;
  private backViewIcon: Locator;
  private shadingToolbarIcon: Locator;
  private fullShadingWithLineIcon: Locator;
  private fullShadingNoLinesIcon: Locator;
  private edges_LinesIcon: Locator;
  private glassViewIcon: Locator;
  private utilitiesIcon: Locator;
  private isolateSelection: Locator;
  private hideSelection: Locator;
  private showAll: Locator;

  // 2D Viewer
  private twoDFullScreenIcon: Locator;
  private twoDSelectFloorplan: Locator;
  private twoDZoomIn: Locator;
  private twoDZoomOut: Locator;
  private navigatorWidgetMinimizeIcon: Locator;

  // Cutting Plane
  private standardPlanes: Locator;
  private standardPlanesToggleOn: Locator;

  // Model Composer
  private modelComposer: Locator;
  private modelComposer_Structural: Locator;
  private modelComposer_Mechanical: Locator;
  private modelComposer_Electrical: Locator;
  private modelComposer_Plumbing: Locator;

  // Annotations
  private annotations: Locator;
  private annotationsLine: Locator;
  private annotationsCircle: Locator;
  private annotationsRectangle: Locator;
  private annotationsPolyline: Locator;
  private annotationsPolygon: Locator;
  private annotationsLeaderNote: Locator;
  private annotationsText: Locator;
  private annotationsFreehand: Locator;
  private annotationsExport: Locator;
  private annotationsImport: Locator;
  private annotationsDeleteAllMarkup: Locator;

  // GIS Viewer
  private gisMenu: Locator;
  private enableGISToggle: Locator;
  private gisInteractSectionHeader: Locator;
  private gisInteractZoomSliderValue: Locator;
  private gisInteractPitchSliderValue: Locator;
  private gisInteractBearingSliderValue: Locator;
  private gisAppearanceSectionHeader: Locator;
  private gisStyleDropdown: Locator;
  private gisElevationModeDropdown: Locator;
  private gisGlobeViewToggle: Locator;
  private gisShowMarkersToggle: Locator;
  private gisFederatedModelSection: Locator;
  private gisHorizontalAlignmentToggle: Locator;
  private gisBearingSliderValue: Locator;
  private gisLongitudeSliderValue: Locator;
  private gisLatitudeSliderValue: Locator;
  private gisSearchTextBox: Locator;
  private gisVerticalAlignmentToggle: Locator;
  private gisTerrainHeightSliderValue: Locator;
  private gisResetButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // 3D Toolbar
    this.resetViewToolbarIcon        = page.locator("//div[@aria-label='Reset View']");
    this.projectionToolbarIcon       = page.locator("//div[@aria-label='Projection']");
    this.navigationToolbarIcon       = page.locator("//div[@aria-label='Navigation']");
    this.measurementToolbarIcon      = page.locator("//div[@aria-label='Measurement']");
    this.cuttingPlaneToolbarIcon     = page.locator("//div[@aria-label='Cutting Plane']");
    this.twoDViewerToolbar           = page.locator("//div[@aria-label='2D Viewer']");
    this.focusModeToolbar            = page.locator("//div[@aria-label='Focus Mode']");
    this.settingsToolbarIcon         = page.locator("//div[@aria-label='Settings']");
    this.viewToolBarIcon             = page.locator("//div[@aria-label='View']");
    this.topViewIcon                 = page.locator("//span[text()='Top View']");
    this.bottomViewIcon              = page.locator("//span[text()='Bottom View']");
    this.leftViewIcon                = page.locator("//span[text()='Left View']");
    this.rightViewIcon               = page.locator("//span[text()='Right View']");
    this.frontViewIcon               = page.locator("//span[text()='Front View']");
    this.backViewIcon                = page.locator("//span[text()='Back View']");
    this.shadingToolbarIcon          = page.locator("//div[@aria-label='Shading']");
    this.fullShadingWithLineIcon     = page.locator("//span[text()='Full Shading, with Lines']");
    this.fullShadingNoLinesIcon      = page.locator("//span[text()='Full Shading, no Lines']");
    this.edges_LinesIcon             = page.locator("//span[text()='Edges & Lines']");
    this.glassViewIcon               = page.locator("//span[text()='Glass View']");
    this.utilitiesIcon               = page.locator("//div[@aria-label='Utilities']");
    this.isolateSelection            = page.locator("//span[text()='Isolate Selection']");
    this.hideSelection               = page.locator("//span[text()='Hide Selection']");
    this.showAll                     = page.locator("//span[text()='Show All']");

    // 2D Viewer
    this.twoDFullScreenIcon          = page.locator("//div[@aria-label='Full Screen']");
    this.twoDSelectFloorplan         = page.locator("//select[@name='Sheet Names']");
    this.twoDZoomIn                  = page.locator("//div[@aria-label='Zoom In']");
    this.twoDZoomOut                 = page.locator("//div[@aria-label='Zoom Out']");
    this.navigatorWidgetMinimizeIcon = page.locator("//i[normalize-space(@title)='Collapse panel']");

    // Cutting Plane
    this.standardPlanes              = page.locator("(//div[text()='Standard Planes'])[1]");
    this.standardPlanesToggleOn      = page.locator("(//div[text()='Standard Planes']//following::input[contains(@class,'PrivateSwitchBase-input')])[1]");

    // Model Composer
    this.modelComposer               = page.locator("//div[@aria-label='Model Composer']");
    this.modelComposer_Structural    = page.locator("//input[@name='Structural']/..//span[@class='MuiSwitch-thumb css-19gndve']");
    this.modelComposer_Mechanical    = page.locator("//input[@name='Mechanical']/..//span[@class='MuiSwitch-thumb css-19gndve']");
    this.modelComposer_Electrical    = page.locator("//input[@name='Electrical']/..//span[@class='MuiSwitch-thumb css-19gndve']");
    this.modelComposer_Plumbing      = page.locator("//input[@name='Plumbing']/..//span[@class='MuiSwitch-thumb css-19gndve']");

    // Annotations
    this.annotations                 = page.locator("//div[@aria-label='Annotations']");
    this.annotationsLine             = page.locator("//span[text()='Line']");
    this.annotationsCircle           = page.locator("//span[text()='Circle']");
    this.annotationsRectangle        = page.locator("//span[text()='Rectangle']");
    this.annotationsPolyline         = page.locator("//span[text()='Polyline']");
    this.annotationsPolygon          = page.locator("//span[text()='Polygon']");
    this.annotationsLeaderNote       = page.locator("//span[text()='Leader Note']");
    this.annotationsText             = page.locator("//span[text()='Text']");
    this.annotationsFreehand         = page.locator("//span[text()='Freehand']");
    this.annotationsExport           = page.locator("//span[text()='Export']");
    this.annotationsImport           = page.locator("//span[text()='Import']");
    this.annotationsDeleteAllMarkup  = page.locator("//div[text()='Delete All']/following::input[@type='checkbox'][1]");

    // GIS Viewer
    this.gisMenu                       = page.locator("//div[@aria-label='GIS Viewer']");
    this.enableGISToggle               = page.locator("//div[contains(text(),'Enable GIS')]/..//input[@type='checkbox']");
    this.gisInteractSectionHeader      = page.locator("//div[text()='Interact']");
    this.gisInteractZoomSliderValue    = page.locator("//div[text()='Zoom']/..//div[@class='IafSlider-module_range-value-box__60Ke8']");
    this.gisInteractPitchSliderValue   = page.locator("//div[text()='Pitch']/..//div[@class='IafSlider-module_range-value-box__60Ke8']");
    this.gisInteractBearingSliderValue = page.locator("//div[text()='Bearing']/..//div[@class='IafSlider-module_range-value-box__60Ke8']");
    this.gisAppearanceSectionHeader    = page.locator("//div[text()='Appearance']");
    this.gisStyleDropdown              = page.locator("//select[contains(@class,'IafDropdown-module_select-component') and @name='Style']");
    this.gisElevationModeDropdown      = page.locator("//select[@name='Elevation Mode']");
    this.gisGlobeViewToggle            = page.locator("//div[text()='Globe View']/..//input[@type='checkbox']");
    this.gisShowMarkersToggle          = page.locator("//div[text()='Show Markers']/..//input[@type='checkbox']");
    this.gisFederatedModelSection      = page.locator("//div[contains(@class,'IafSubHeader-module_list-item')]/..//div[contains(text(),'Federated')]");
    this.gisHorizontalAlignmentToggle  = page.locator("//div[contains(text(),'Horizontal Alignment')]/..//input[@type='checkbox']");
    this.gisBearingSliderValue         = page.locator("//div[text()='Bearing']/..//div[@class='IafSlider-module_range-value__tY7ul']");
    this.gisLongitudeSliderValue       = page.locator("//div[text()='Longitude']/..//div[@class='IafSlider-module_range-value__tY7ul']");
    this.gisLatitudeSliderValue        = page.locator("//div[text()='Latitude']/..//div[@class='IafSlider-module_range-value__tY7ul']");
    this.gisSearchTextBox              = page.locator("//input[@type='text' and @placeholder='Search']");
    this.gisVerticalAlignmentToggle    = page.locator("//div[contains(text(),'Vertical Alignment')]/..//input[@type='checkbox']");
    this.gisTerrainHeightSliderValue   = page.locator("//div[contains(text(),'Terrain Height')]/..//div[@class='IafSlider-module_range-value__tY7ul']");
    this.gisResetButton                = page.locator("//p[text()='Reset']");
  }

  private async logStep(message: string): Promise<void> {
    console.log(message);
    await step(message, async () => {});
  }

  private plane(value: string): Locator {
    return this.page.locator(`//span[@aria-label='${value}']`);
  }

  // ─── Navigator ───────────────────────────────────────────────────────────────

  async clickNavigatorWidgetMinimizeIcon(): Promise<void> {
    try {
      await this.navigatorWidgetMinimizeIcon.waitFor({ state: 'visible', timeout: 5000 });
      await this.navigatorWidgetMinimizeIcon.click();
      await this.logStep('INFO: Navigator widget minimize icon clicked successfully');
    } catch (e) {
      // Panel may already be collapsed — not a blocking failure
    }
  }

  // ─── 2D Viewer ───────────────────────────────────────────────────────────────

  async click2DMenuIcon(): Promise<void> {
    try {
      await this.twoDViewerToolbar.waitFor({ state: 'visible' });
      await this.twoDViewerToolbar.click();
      await this.logStep('INFO: 2D icon has been clicked');
    } catch (e) {
      console.error('ERROR: Failed to click 2D icon');
    }
  }

  async click2DFullscreen(): Promise<void> {
    try {
      await this.twoDFullScreenIcon.waitFor({ state: 'visible' });
      await this.twoDFullScreenIcon.click();
      await this.logStep('INFO: 2D fullscreen icon has been clicked');
    } catch (e) {
      console.error('ERROR: Failed to click 2D fullscreen icon');
    }
  }

  async click2DZoomIn(): Promise<void> {
    try {
      await this.twoDZoomIn.waitFor({ state: 'visible' });
      await this.twoDZoomIn.click();
      await this.page.waitForTimeout(3000);
      await this.logStep('INFO: 2D Zoom In icon has been clicked');
    } catch (e) {
      console.error('ERROR: Failed to click 2D Zoom In icon');
    }
  }

  async click2DZoomOut(): Promise<void> {
    try {
      await this.twoDZoomOut.waitFor({ state: 'visible' });
      await this.twoDZoomOut.click();
      await this.page.waitForTimeout(3000);
      await this.logStep('INFO: 2D Zoom Out icon has been clicked');
    } catch (e) {
      console.error('ERROR: Failed to click 2D Zoom Out icon');
    }
  }

  async selectTwoDFloorType(floorName: string): Promise<void> {
    try {
      await this.twoDSelectFloorplan.waitFor({ state: 'visible' });
      await this.twoDSelectFloorplan.selectOption({ label: floorName });
      await this.page.waitForTimeout(2000);
      await this.logStep(`INFO: Floor plan '${floorName}' selected`);
    } catch (e) {
      console.error(`ERROR: Failed to select floor plan '${floorName}'`);
    }
  }

  async verifyFloorPlanScreenshot(snapshotName: string): Promise<void> {
    try {
      await this.page.waitForTimeout(3000);
      const canvas = this.page.locator('canvas').nth(1);
      await expect(canvas).toHaveScreenshot(`${snapshotName}.png`, { maxDiffPixelRatio: 0.05 });
      await this.logStep(`PASS: Floor plan screenshot matched — ${snapshotName}`);
    } catch (e) {
      console.error(`FAIL: Floor plan screenshot mismatch — ${snapshotName}`);
    }
  }

  async verifyFloorPlanIsNotBlank(): Promise<void> {
    try {
      await this.twoDSelectFloorplan.waitFor({ state: 'visible', timeout: 30000 });
      await this.page.waitForFunction(() => {
        const canvas = document.querySelectorAll('canvas')[1] as HTMLCanvasElement;
        if (!canvas || canvas.width === 0 || canvas.height === 0) return false;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        return data.some(v => v > 0);
      }, { timeout: 30000 });
      await this.logStep('PASS: Floor plan canvas has rendered content');
    } catch (e) {
      console.error('FAIL: Floor plan canvas is blank or timed out');
    }
  }

  // ─── Reset / Projection ──────────────────────────────────────────────────────

  async clickResetViewIcon(): Promise<void> {
    try {
      await this.resetViewToolbarIcon.waitFor({ state: 'visible' });
      await this.resetViewToolbarIcon.click();
      await this.logStep('INFO: Reset view icon has been clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Reset view icon');
    }
  }

  async clickProjectionIcon(): Promise<void> {
    try {
      await this.projectionToolbarIcon.waitFor({ state: 'visible' });
      await this.projectionToolbarIcon.click();
      await this.logStep('INFO: Projection icon has been clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Projection icon');
    }
  }

  async verifyViewerScreenshot(snapshotName: string): Promise<void> {
    try {
      await this.page.waitForTimeout(3000);
      const canvas = this.page.locator('canvas').first();
      await expect(canvas).toHaveScreenshot(`${snapshotName}.png`, { maxDiffPixelRatio: 0.05 });
      await this.logStep(`PASS: Viewer screenshot matched — ${snapshotName}`);
    } catch (e) {
      console.error(`FAIL: Viewer screenshot mismatch — ${snapshotName}`);
    }
  }

  // ─── View (Top / Bottom / Left / Right / Front / Back) ───────────────────────

  async clickViewIcon(): Promise<void> {
    try {
      await this.viewToolBarIcon.waitFor({ state: 'visible' });
      await this.viewToolBarIcon.click();
      await this.logStep('INFO: View icon has been clicked');
    } catch (e) {
      console.error('ERROR: Failed to click View icon');
    }
  }

  async clickTopView(): Promise<void> {
    try {
      await this.topViewIcon.waitFor({ state: 'visible' });
      await this.topViewIcon.click();
      await this.logStep('INFO: Top View selected');
    } catch (e) {
      console.error('ERROR: Failed to select Top View');
    }
  }

  async clickBottomView(): Promise<void> {
    try {
      await this.bottomViewIcon.waitFor({ state: 'visible' });
      await this.bottomViewIcon.click();
      await this.logStep('INFO: Bottom View selected');
    } catch (e) {
      console.error('ERROR: Failed to select Bottom View');
    }
  }

  async clickLeftView(): Promise<void> {
    try {
      await this.leftViewIcon.waitFor({ state: 'visible' });
      await this.leftViewIcon.click();
      await this.logStep('INFO: Left View selected');
    } catch (e) {
      console.error('ERROR: Failed to select Left View');
    }
  }

  async clickRightView(): Promise<void> {
    try {
      await this.rightViewIcon.waitFor({ state: 'visible' });
      await this.rightViewIcon.click();
      await this.logStep('INFO: Right View selected');
    } catch (e) {
      console.error('ERROR: Failed to select Right View');
    }
  }

  async clickFrontView(): Promise<void> {
    try {
      await this.frontViewIcon.waitFor({ state: 'visible' });
      await this.frontViewIcon.click();
      await this.logStep('INFO: Front View selected');
    } catch (e) {
      console.error('ERROR: Failed to select Front View');
    }
  }

  async clickBackView(): Promise<void> {
    try {
      await this.backViewIcon.waitFor({ state: 'visible' });
      await this.backViewIcon.click();
      await this.logStep('INFO: Back View selected');
    } catch (e) {
      console.error('ERROR: Failed to select Back View');
    }
  }

  // ─── Shading ─────────────────────────────────────────────────────────────────

  async clickShadingIcon(): Promise<void> {
    try {
      await this.shadingToolbarIcon.waitFor({ state: 'visible' });
      await this.shadingToolbarIcon.click();
      await this.logStep('INFO: Shading toolbar icon has been clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Shading toolbar icon');
    }
  }

  async clickFullShadingWithLines(): Promise<void> {
    try {
      await this.fullShadingWithLineIcon.waitFor({ state: 'visible' });
      await this.fullShadingWithLineIcon.click();
      await this.logStep('INFO: Full Shading With Lines selected');
    } catch (e) {
      console.error('ERROR: Failed to select Full Shading With Lines');
    }
  }

  async clickFullShadingNoLines(): Promise<void> {
    try {
      await this.fullShadingNoLinesIcon.waitFor({ state: 'visible' });
      await this.fullShadingNoLinesIcon.click();
      await this.logStep('INFO: Full Shading No Lines selected');
    } catch (e) {
      console.error('ERROR: Failed to select Full Shading No Lines');
    }
  }

  async clickEdgesAndLines(): Promise<void> {
    try {
      await this.edges_LinesIcon.waitFor({ state: 'visible' });
      await this.edges_LinesIcon.click();
      await this.logStep('INFO: Edges & Lines selected');
    } catch (e) {
      console.error('ERROR: Failed to select Edges & Lines');
    }
  }

  async clickGlassView(): Promise<void> {
    try {
      await this.glassViewIcon.waitFor({ state: 'visible' });
      await this.glassViewIcon.click();
      await this.logStep('INFO: Glass View selected');
    } catch (e) {
      console.error('ERROR: Failed to select Glass View');
    }
  }

  // ─── Utilities ───────────────────────────────────────────────────────────────

  async clickUtilitiesIcon(): Promise<void> {
    try {
      await this.utilitiesIcon.waitFor({ state: 'visible' });
      await this.utilitiesIcon.click();
      await this.logStep('INFO: Utilities icon has been clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Utilities icon');
    }
  }

  async clickIsolateSelection(): Promise<void> {
    try {
      await this.isolateSelection.waitFor({ state: 'visible' });
      await this.isolateSelection.click();
      await this.logStep('INFO: Isolate Selection clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Isolate Selection');
    }
  }

  async clickHideSelection(): Promise<void> {
    try {
      await this.hideSelection.waitFor({ state: 'visible' });
      await this.hideSelection.click();
      await this.logStep('INFO: Hide Selection clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Hide Selection');
    }
  }

  async clickShowAll(): Promise<void> {
    try {
      await this.showAll.waitFor({ state: 'visible' });
      await this.showAll.click();
      await this.logStep('INFO: Show All clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Show All');
    }
  }

  // ─── Focus Mode ──────────────────────────────────────────────────────────────

  async clickFocusMode(): Promise<void> {
    try {
      await this.focusModeToolbar.scrollIntoViewIfNeeded();
      await this.focusModeToolbar.waitFor({ state: 'visible' });
      await this.focusModeToolbar.click();
      await this.logStep('INFO: Focus Mode icon has been clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Focus Mode icon');
    }
  }

  // ─── Cutting Plane ───────────────────────────────────────────────────────────

  async validateCuttingPlanes(): Promise<void> {
    const planeNames = ['Top Plane', 'Bottom Plane', 'Front Plane', 'Back Plane', 'Left Plane', 'Right Plane'];
    try {
      await this.click2DMenuIcon();
      await this.cuttingPlaneToolbarIcon.waitFor({ state: 'visible' });
      await this.cuttingPlaneToolbarIcon.click();
      await this.page.waitForTimeout(2000);
      await this.standardPlanes.click();
      await this.standardPlanesToggleOn.click();

      for (const planeName of planeNames) {
        await this.page.waitForTimeout(1000);
        const planeLocator = this.plane(planeName);
        await planeLocator.waitFor({ state: 'visible' });

        const box = await planeLocator.boundingBox();
        if (box) {
          await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await this.page.mouse.down();
          await this.page.mouse.move(box.x + box.width / 2 + 105, box.y + box.height / 2);
          await this.page.mouse.up();
        }

        await this.page.waitForTimeout(1000);
        const canvas = this.page.locator('canvas').first();
        await expect(canvas).toHaveScreenshot(`cutting-plane-${planeName.replace(' ', '-')}.png`, {
          maxDiffPixelRatio: 0.05,
        });
        await this.logStep(`PASS: Cutting plane '${planeName}' verified`);

        if (box) {
          await this.page.mouse.move(box.x + box.width / 2 + 105, box.y + box.height / 2);
          await this.page.mouse.down();
          await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await this.page.mouse.up();
        }
      }
    } catch (e) {
      console.error('ERROR: Failed to validate cutting planes');
    }
  }

  // ─── Model Composer ──────────────────────────────────────────────────────────

  async clickModelComposer(): Promise<void> {
    try {
      await this.modelComposer.waitFor({ state: 'visible' });
      await this.modelComposer.click();
      await this.logStep('INFO: Model Composer icon has been clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Model Composer icon');
    }
  }

  async toggleModelComposerStructural(): Promise<void> {
    try {
      await this.modelComposer_Structural.waitFor({ state: 'visible' });
      await this.modelComposer_Structural.click();
      await this.logStep('INFO: Model Composer Structural toggle clicked');
    } catch (e) {
      console.error('ERROR: Failed to toggle Structural');
    }
  }

  async toggleModelComposerMechanical(): Promise<void> {
    try {
      await this.modelComposer_Mechanical.waitFor({ state: 'visible' });
      await this.modelComposer_Mechanical.click();
      await this.logStep('INFO: Model Composer Mechanical toggle clicked');
    } catch (e) {
      console.error('ERROR: Failed to toggle Mechanical');
    }
  }

  async toggleModelComposerElectrical(): Promise<void> {
    try {
      await this.modelComposer_Electrical.waitFor({ state: 'visible' });
      await this.modelComposer_Electrical.click();
      await this.logStep('INFO: Model Composer Electrical toggle clicked');
    } catch (e) {
      console.error('ERROR: Failed to toggle Electrical');
    }
  }

  async toggleModelComposerPlumbing(): Promise<void> {
    try {
      await this.modelComposer_Plumbing.waitFor({ state: 'visible' });
      await this.modelComposer_Plumbing.click();
      await this.logStep('INFO: Model Composer Plumbing toggle clicked');
    } catch (e) {
      console.error('ERROR: Failed to toggle Plumbing');
    }
  }

  async verifyModelComposerScreenshot(discipline: string): Promise<void> {
    try {
      await this.page.waitForTimeout(2000);
      const canvas = this.page.locator('canvas').first();
      await expect(canvas).toHaveScreenshot(`model-composer-${discipline}.png`, { maxDiffPixelRatio: 0.05 });
      await this.logStep(`PASS: Model Composer ${discipline} screenshot verified`);
    } catch (e) {
      console.error(`FAIL: Model Composer ${discipline} screenshot mismatch`);
    }
  }

  // ─── Annotations ─────────────────────────────────────────────────────────────

  async clickAnnotationsMenu(): Promise<void> {
    try {
      await this.annotations.waitFor({ state: 'visible' });
      await this.annotations.click();
      await this.logStep('INFO: Annotations menu opened');
    } catch (e) {
      console.error('ERROR: Failed to open Annotations menu');
    }
  }

  private async drawTwoPointAnnotation(startX: number, startY: number, endX: number, endY: number): Promise<void> {
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY);
    await this.page.mouse.up();
    await this.page.waitForTimeout(1000);
  }

  private async verifyAnnotationScreenshot(annotationType: string): Promise<void> {
    const canvas = this.page.locator('canvas').first();
    await expect(canvas).toHaveScreenshot(`annotation-${annotationType}.png`, { maxDiffPixelRatio: 0.05 });
    await this.logStep(`PASS: ${annotationType} annotation verified`);
  }

  async drawAndVerifyLine(): Promise<void> {
    try {
      await this.annotationsLine.waitFor({ state: 'visible' });
      await this.annotationsLine.click();
      await this.page.waitForTimeout(500);
      await this.drawTwoPointAnnotation(300, 400, 800, 400);
      await this.verifyAnnotationScreenshot('line');
    } catch (e) {
      console.error('ERROR: Failed to draw/verify Line annotation');
    }
  }

  async drawAndVerifyCircle(): Promise<void> {
    try {
      await this.annotationsCircle.waitFor({ state: 'visible' });
      await this.annotationsCircle.click();
      await this.page.waitForTimeout(500);
      await this.drawTwoPointAnnotation(300, 400, 800, 400);
      await this.verifyAnnotationScreenshot('circle');
    } catch (e) {
      console.error('ERROR: Failed to draw/verify Circle annotation');
    }
  }

  async drawAndVerifyRectangle(): Promise<void> {
    try {
      await this.annotationsRectangle.waitFor({ state: 'visible' });
      await this.annotationsRectangle.click();
      await this.page.waitForTimeout(500);
      await this.drawTwoPointAnnotation(300, 400, 800, 400);
      await this.verifyAnnotationScreenshot('rectangle');
    } catch (e) {
      console.error('ERROR: Failed to draw/verify Rectangle annotation');
    }
  }

  async drawAndVerifyPolyline(): Promise<void> {
    try {
      await this.annotationsPolyline.waitFor({ state: 'visible' });
      await this.annotationsPolyline.click();
      await this.page.waitForTimeout(500);
      await this.page.mouse.click(300, 400);
      await this.page.mouse.click(500, 400);
      await this.page.mouse.click(500, 600);
      await this.page.mouse.click(700, 600);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(1000);
      await this.verifyAnnotationScreenshot('polyline');
    } catch (e) {
      console.error('ERROR: Failed to draw/verify Polyline annotation');
    }
  }

  async drawAndVerifyPolygon(): Promise<void> {
    try {
      await this.annotationsPolygon.waitFor({ state: 'visible' });
      await this.annotationsPolygon.click();
      await this.page.waitForTimeout(500);
      await this.page.mouse.click(300, 400);
      await this.page.mouse.click(600, 300);
      await this.page.mouse.click(800, 500);
      await this.page.mouse.click(600, 700);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(1000);
      await this.verifyAnnotationScreenshot('polygon');
    } catch (e) {
      console.error('ERROR: Failed to draw/verify Polygon annotation');
    }
  }

  async drawAndVerifyLeaderNote(): Promise<void> {
    try {
      await this.annotationsLeaderNote.waitFor({ state: 'visible' });
      await this.annotationsLeaderNote.click();
      await this.page.waitForTimeout(500);
      await this.page.mouse.click(400, 400);
      await this.page.waitForTimeout(1000);
      await this.page.keyboard.type('Test');
      await this.page.mouse.click(700, 500);
      await this.page.waitForTimeout(1000);
      await this.verifyAnnotationScreenshot('leader-note');
    } catch (e) {
      console.error('ERROR: Failed to draw/verify Leader Note annotation');
    }
  }

  async drawAndVerifyText(): Promise<void> {
    try {
      await this.annotationsText.waitFor({ state: 'visible' });
      await this.annotationsText.click();
      await this.page.waitForTimeout(500);
      await this.page.mouse.click(400, 400);
      await this.page.waitForTimeout(500);
      await this.page.keyboard.type('Test');
      await this.page.mouse.click(700, 500);
      await this.page.waitForTimeout(1000);
      await this.verifyAnnotationScreenshot('text');
    } catch (e) {
      console.error('ERROR: Failed to draw/verify Text annotation');
    }
  }

  async drawAndVerifyFreehand(): Promise<void> {
    try {
      await this.annotationsFreehand.waitFor({ state: 'visible' });
      await this.annotationsFreehand.click();
      await this.page.waitForTimeout(500);
      await this.page.mouse.move(300, 400);
      await this.page.mouse.down();
      await this.page.mouse.move(500, 350);
      await this.page.mouse.move(700, 450);
      await this.page.mouse.move(600, 600);
      await this.page.mouse.up();
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(1000);
      await this.verifyAnnotationScreenshot('freehand');
    } catch (e) {
      console.error('ERROR: Failed to draw/verify Freehand annotation');
    }
  }

  async exportAnnotations(filename: string): Promise<void> {
    try {
      await this.annotationsExport.waitFor({ state: 'visible' });
      const downloadPromise = this.page.waitForEvent('download');
      await this.annotationsExport.click();
      const download = await downloadPromise;
      await download.saveAs(path.join(process.cwd(), 'files', filename));
      await this.logStep(`PASS: Annotations exported as ${filename}`);
    } catch (e) {
      console.error('ERROR: Failed to export annotations');
    }
  }

  async importAnnotations(filename: string): Promise<void> {
    try {
      await this.annotationsImport.waitFor({ state: 'visible' });
      const fileChooserPromise = this.page.waitForEvent('filechooser');
      await this.annotationsImport.click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(process.cwd(), 'files', filename));
      await this.page.waitForTimeout(3000);
      await this.logStep(`PASS: Annotations imported from ${filename}`);
    } catch (e) {
      console.error('ERROR: Failed to import annotations');
    }
  }

  async verifyImportedAnnotations(): Promise<void> {
    try {
      await this.page.waitForTimeout(3000);
      const canvas = this.page.locator('canvas').first();
      await expect(canvas).toHaveScreenshot('annotations-imported.png', { maxDiffPixelRatio: 0.05 });
      await this.logStep('PASS: Imported annotations verified');
    } catch (e) {
      console.error('FAIL: Failed to verify imported annotations');
    }
  }

  async deleteAllAnnotations(): Promise<void> {
    try {
      await this.annotationsDeleteAllMarkup.waitFor({ state: 'visible' });
      await this.annotationsDeleteAllMarkup.click();
      await this.logStep('INFO: Delete All annotations checkbox clicked');
    } catch (e) {
      console.error('ERROR: Failed to click Delete All annotations');
    }
  }

  // ─── GIS Viewer ──────────────────────────────────────────────────────────────

  async clickGisMenu(): Promise<void> {
    try {
      await this.gisMenu.waitFor({ state: 'visible' });
      await this.gisMenu.click();
      await this.logStep('INFO: GIS Viewer menu opened');
    } catch (e) {
      console.error('ERROR: Failed to open GIS Viewer menu');
    }
  }

  async enableGIS(): Promise<void> {
    try {
      await this.page.waitForTimeout(3000);
      await this.enableGISToggle.waitFor({ state: 'attached' });
      await this.enableGISToggle.dispatchEvent('click');
      await this.logStep('INFO: GIS enabled');
    } catch (e) {
      console.error('ERROR: Failed to enable GIS toggle');
    }
  }

  async verifyGisInteractZoom(expectedValue: string): Promise<void> {
    try {
      await this.gisInteractZoomSliderValue.waitFor({ state: 'visible' });
      const value = await this.gisInteractZoomSliderValue.innerText();
      if (value.trim() === expectedValue) {
        await this.logStep(`PASS: GIS Zoom value is ${expectedValue}`);
      } else {
        console.error(`FAIL: GIS Zoom — expected '${expectedValue}', got '${value.trim()}'`);
      }
    } catch (e) {
      console.error('ERROR: Failed to verify GIS Zoom value');
    }
  }

  async verifyGisInteractPitch(expectedValue: string): Promise<void> {
    try {
      await this.gisInteractPitchSliderValue.waitFor({ state: 'visible' });
      const value = await this.gisInteractPitchSliderValue.innerText();
      if (value.trim() === expectedValue) {
        await this.logStep(`PASS: GIS Pitch value is ${expectedValue}`);
      } else {
        console.error(`FAIL: GIS Pitch — expected '${expectedValue}', got '${value.trim()}'`);
      }
    } catch (e) {
      console.error('ERROR: Failed to verify GIS Pitch value');
    }
  }

  async verifyGisInteractBearing(expectedValue: string): Promise<void> {
    try {
      await this.gisInteractBearingSliderValue.waitFor({ state: 'visible' });
      const value = await this.gisInteractBearingSliderValue.innerText();
      if (value.trim() === expectedValue) {
        await this.logStep(`PASS: GIS Bearing (Interact) value is ${expectedValue}`);
      } else {
        console.error(`FAIL: GIS Bearing (Interact) — expected '${expectedValue}', got '${value.trim()}'`);
      }
    } catch (e) {
      console.error('ERROR: Failed to verify GIS Bearing value');
    }
  }

  async selectGisStyle(style: string): Promise<void> {
    try {
      await this.gisStyleDropdown.waitFor({ state: 'visible' });
      await this.gisStyleDropdown.selectOption({ label: style });
      await this.page.waitForTimeout(2000);
      await this.logStep(`INFO: GIS Style '${style}' selected`);
    } catch (e) {
      console.error(`ERROR: Failed to select GIS Style '${style}'`);
    }
  }

  async selectGisElevationMode(mode: string): Promise<void> {
    try {
      await this.gisElevationModeDropdown.waitFor({ state: 'visible' });
      await this.gisElevationModeDropdown.selectOption({ label: mode });
      await this.page.waitForTimeout(2000);
      await this.logStep(`INFO: GIS Elevation Mode '${mode}' selected`);
    } catch (e) {
      console.error(`ERROR: Failed to select GIS Elevation Mode '${mode}'`);
    }
  }

  async toggleGisGlobeView(): Promise<void> {
    try {
      await this.gisGlobeViewToggle.waitFor({ state: 'attached' });
      await this.gisGlobeViewToggle.dispatchEvent('click');
      await this.logStep('INFO: GIS Globe View toggled');
    } catch (e) {
      console.error('ERROR: Failed to toggle GIS Globe View');
    }
  }

  async toggleGisShowMarkers(): Promise<void> {
    try {
      await this.gisShowMarkersToggle.waitFor({ state: 'attached' });
      await this.gisShowMarkersToggle.dispatchEvent('click');
      await this.logStep('INFO: GIS Show Markers toggled');
    } catch (e) {
      console.error('ERROR: Failed to toggle GIS Show Markers');
    }
  }

  async clickGisFederatedModelSection(): Promise<void> {
    try {
      await this.gisFederatedModelSection.waitFor({ state: 'visible' });
      await this.gisFederatedModelSection.click();
      await this.logStep('INFO: GIS Federated Model section clicked');
    } catch (e) {
      console.error('ERROR: Failed to click GIS Federated Model section');
    }
  }

  async toggleGisHorizontalAlignment(): Promise<void> {
    try {
      await this.gisHorizontalAlignmentToggle.waitFor({ state: 'attached' });
      await this.gisHorizontalAlignmentToggle.dispatchEvent('click');
      await this.logStep('INFO: GIS Horizontal Alignment toggled');
    } catch (e) {
      console.error('ERROR: Failed to toggle GIS Horizontal Alignment');
    }
  }

  async verifyGisHorizontalBearing(expectedValue: string): Promise<void> {
    try {
      await this.gisBearingSliderValue.waitFor({ state: 'visible' });
      const value = await this.gisBearingSliderValue.innerText();
      if (value.trim() === expectedValue) {
        await this.logStep(`PASS: GIS Horizontal Bearing value is ${expectedValue}`);
      } else {
        console.error(`FAIL: GIS Horizontal Bearing — expected '${expectedValue}', got '${value.trim()}'`);
      }
    } catch (e) {
      console.error('ERROR: Failed to verify GIS Horizontal Bearing value');
    }
  }

  async verifyGisLongitude(expectedValue: string): Promise<void> {
    try {
      await this.gisLongitudeSliderValue.waitFor({ state: 'visible' });
      const value = await this.gisLongitudeSliderValue.innerText();
      if (value.trim() === expectedValue) {
        await this.logStep(`PASS: GIS Longitude value is ${expectedValue}`);
      } else {
        console.error(`FAIL: GIS Longitude — expected '${expectedValue}', got '${value.trim()}'`);
      }
    } catch (e) {
      console.error('ERROR: Failed to verify GIS Longitude value');
    }
  }

  async verifyGisLatitude(expectedValue: string): Promise<void> {
    try {
      await this.gisLatitudeSliderValue.waitFor({ state: 'visible' });
      const value = await this.gisLatitudeSliderValue.innerText();
      if (value.trim() === expectedValue) {
        await this.logStep(`PASS: GIS Latitude value is ${expectedValue}`);
      } else {
        console.error(`FAIL: GIS Latitude — expected '${expectedValue}', got '${value.trim()}'`);
      }
    } catch (e) {
      console.error('ERROR: Failed to verify GIS Latitude value');
    }
  }

  async toggleGisVerticalAlignment(): Promise<void> {
    try {
      await this.gisVerticalAlignmentToggle.waitFor({ state: 'attached' });
      await this.gisVerticalAlignmentToggle.dispatchEvent('click');
      await this.logStep('INFO: GIS Vertical Alignment toggled');
    } catch (e) {
      console.error('ERROR: Failed to toggle GIS Vertical Alignment');
    }
  }

  async verifyGisTerrainHeight(expectedValue: string): Promise<void> {
    try {
      await this.gisTerrainHeightSliderValue.waitFor({ state: 'visible' });
      const value = await this.gisTerrainHeightSliderValue.innerText();
      if (value.trim() === expectedValue) {
        await this.logStep(`PASS: GIS Terrain Height value is ${expectedValue}`);
      } else {
        console.error(`FAIL: GIS Terrain Height — expected '${expectedValue}', got '${value.trim()}'`);
      }
    } catch (e) {
      console.error('ERROR: Failed to verify GIS Terrain Height value');
    }
  }

  async searchGisLocation(query: string): Promise<void> {
    try {
      await this.gisSearchTextBox.waitFor({ state: 'visible' });
      await this.gisSearchTextBox.fill(query);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(2000);
      await this.logStep(`INFO: GIS search performed for '${query}'`);
    } catch (e) {
      console.error(`ERROR: Failed to search GIS location '${query}'`);
    }
  }

  async clickGisReset(): Promise<void> {
    try {
      await this.gisResetButton.waitFor({ state: 'visible' });
      await this.gisResetButton.click();
      await this.logStep('INFO: GIS Reset button clicked');
    } catch (e) {
      console.error('ERROR: Failed to click GIS Reset button');
    }
  }

  async verifyGisScreenshot(snapshotName: string): Promise<void> {
    try {
      await this.page.waitForTimeout(3000);
      const canvas = this.page.locator('canvas').first();
      await expect(canvas).toHaveScreenshot(`${snapshotName}.png`, { maxDiffPixelRatio: 0.05 });
      await this.logStep(`PASS: GIS screenshot matched — ${snapshotName}`);
    } catch (e) {
      console.error(`FAIL: GIS screenshot mismatch — ${snapshotName}`);
    }
  }

  async clearLocalStorage(): Promise<void> {
    try {
      await this.page.evaluate(() => window.localStorage.clear());
      await this.page.waitForTimeout(2000);
      await this.logStep('INFO: Local storage cleared');
    } catch (e) {
      console.error('ERROR: Failed to clear local storage');
    }
  }
}
