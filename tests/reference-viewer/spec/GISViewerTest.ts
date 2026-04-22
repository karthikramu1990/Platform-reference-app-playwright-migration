import { Page } from '@playwright/test';
import { HomePage }   from '../../reference-app/page/HomePage';
import { ViewerPage } from '../page/ViewerPage';
import testData from '../../reference-app/testdata/TestData.json';

export class GISViewerTest {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyGISViewer(): Promise<void> {
    const hp = new HomePage(this.page);
    const vp = new ViewerPage(this.page);
    await this.page.reload({ waitUntil: 'networkidle' });
    await hp.selectNavigatorScreen();
    await vp.clickNavigatorWidgetMinimizeIcon();

    await vp.clickGisMenu();
    await vp.enableGIS();
    await vp.verifyGisScreenshot('gis-enabled');

    const mapSettings = testData.GIS.MapSettings[0];
    await vp.verifyGisInteractZoom(String(mapSettings.Zoom));
    await vp.verifyGisInteractPitch(String(mapSettings.Pitch));
    await vp.verifyGisInteractBearing(String(mapSettings.Bearing));

    for (const style of testData.GIS.Styles) {
      await vp.selectGisStyle(style);
      await vp.verifyGisScreenshot(`gis-style-${style.replace(/\s+/g, '-').toLowerCase()}`);
    }

    for (const mode of testData.GIS.ElevationModes) {
      await vp.selectGisElevationMode(mode);
      await vp.verifyGisScreenshot(`gis-elevation-${mode.replace(/\s+/g, '-').toLowerCase()}`);
    }

    await vp.toggleGisGlobeView();
    await vp.verifyGisScreenshot('gis-globe-view-on');
    await vp.toggleGisGlobeView();

    await vp.toggleGisShowMarkers();
    await vp.verifyGisScreenshot('gis-show-markers-on');
    await vp.toggleGisShowMarkers();

    await vp.clickGisFederatedModelSection();
    await vp.toggleGisHorizontalAlignment();
    await vp.verifyGisHorizontalBearing(String(mapSettings.HorizontalBearing));
    await vp.verifyGisLongitude(String(mapSettings.Longitude));
    await vp.verifyGisLatitude(String(mapSettings.Latitude));
    await vp.verifyGisScreenshot('gis-horizontal-alignment');

    await vp.toggleGisVerticalAlignment();
    await vp.verifyGisTerrainHeight(String(mapSettings.TerrainHeight));
    await vp.verifyGisScreenshot('gis-terrain-height');

    await vp.clickGisReset();
    await vp.verifyGisScreenshot('gis-after-reset');
  }
}
