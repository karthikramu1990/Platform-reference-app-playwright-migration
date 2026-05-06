export const WidgetIds = {
    Mapbox: "gis",
    View3d: "view3d",
    View2d: "view2d",
    TerrainViewer: "terrainViewer",
    PdfViewer: "pdfViewer",
    Arcgis: "arcgis",
    ArcgisOverview: "arcgisOverview",
    Ue: "ue",
    Photosphere: "photosphere"    
}

export const WidgetMode = Object.freeze({
    DEFAULT: "default",
    SPLIT: "split",
    FULLSCREEN: "fullscreen",
    FIXED: "fixed"
  });
  
// Define the enum for actions
export const WidgetAction = Object.freeze({
    MINIMIZE: "minimize",
    MAXIMIZE: "maximize",
    ZOOM_IN: "zoomin",
    ZOOM_OUT: "zoomout",
    CLOSE: "close"
});

export const WidgetPosition = {
    LEFT: "left",
    RIGHT: "right"
}