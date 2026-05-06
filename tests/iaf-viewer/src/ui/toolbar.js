// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 06-01-23    ATK        PLAT-2709   New UX UI Foundation Project
//                                    Code Restructuring.
// 26-05-23    HSK        PLAT-2891   Revamped IafViewer Icons - Toolbar, Submenu
// 10-08-23    HSK                    Added Toolbar Config
// 01-09-23    HSK                    Added manipulateList, iconIsolate, iconZoom, iconHide objects
// -------------------------------------------------------------------------------------

import iconOrthographic from "./img/icon-viewer-orthographic.svg";
import iconCuttingPlane from "./img/icon-Plane.svg";
import iconModelComposer from "./img/compose_light.svg"
import iconGis from "./img/icon-gis.svg"
import iconAnimationPlay from "./img/icon-play-circle.svg"
import iconAnimationStop from "./img/icon-stop-circle.svg"
import iconAnalytics from "./img/icon-analytics.svg";
import icon2Dviewer from "./img/icon-2d-view.svg";
import icon3Dviewer from "./img/icon-3d-view.svg";
import iconArcgis from "./img/icon-arcgis.svg";
import iconArcgisOverview from "./img/icon-arcgis-overview.svg";
import iconUnrealEngine from "./img/icon-unreal-engine.svg";
import iconPhotosphere from "./img/icon-photosphere.svg";
import iconReset from "./img/icon-reset.svg"
import iconCamera from "./img/icon-hoops-general-camera.svg";
import iconSettings from "./img/icon-settings.svg";

import iconPerspective from "./img/icon-on.svg";
import iconOrtho from "./img/icon-off.svg";
import iconShowAll from "./img/icon-toggleIsolation.svg";
import iconAngle from "./img/icon-hoops-measurement-angle.svg";
import iconEdges from "./img/icon-hoops-measurement-distance-edges.svg";
import iconFaces from "./img/icon-hoops-measurement-distance-faces.svg";
import iconPoints from "./img/icon-betweenPoints.svg";
import iconSelect from "./img/icon-selection.svg";
import iconLine from "./img/icon-line.svg";
import iconOval from "./img/icon-oval.svg";
import iconImport from "./img/icon-import.svg"
import iconExport from "./img/icon-export.svg"
import iconArrow from "./img/icon-arrow.svg";
import iconFreehand from "./img/icon-freehand.svg";
import iconHighlighter from "./img/icon-highlighter.svg";
import iconPolygon from "./img/icon-polygon.svg";
import iconImage from "./img/icon-image.svg";
import iconCircle from "./img/icon-circle.svg";
import iconRectangle from "./img/icon-rectangle.svg";
import iconSprite from "./img/icon-sprite.svg";
import iconPolyline from "./img/icon-polyline.svg";
import iconText from "./img/icon-text.svg";
import icon3DText from "./img/icon-3d-text.svg";
import iconComment from "./img/icon-comment.svg";
import iconViewerMove from "./img/icon-viewer-move.svg";
import iconNavCamera from "./img/icon-orbit-camera.svg";
import iconNavRotate from "./img/icon-rotate.svg";
import iconNavFirstP from "./img/icon-walk.svg";
import iconNavPan from "./img/icon-pan.svg";
import iconNavZoom from "./img/icon-zoom-in.svg";
import iconFocusMode from "./img/icon-focus-mode.svg";
import iconBack from "./img/icon-back-view.svg";
import iconBottom from "./img/icon-bottom-view.svg";
import iconFront from "./img/icon-front-view.svg";
import iconLeft from "./img/icon-left-view.svg";
import iconRight from "./img/icon-right-view.svg";
import iconTop from "./img/icon-top-view.svg";
import iconDragArea from "./img/icon-dragArea.svg";
import iconFullNoLines from "./img/icon-full.svg";
import iconFullWithLines from "./img/icon-fullWithLines.svg";
import iconGlass from "./img/icon-glass.svg";
import iconHiddlenLines from "./img/icon-hiddenLines.svg";
import iconWireFrame from "./img/icon-hoops-views-shading-wireFrame.svg";
import iconShading from "./img/icon-viewer-shading.svg";
import iconViewsCamera from "./img/icon-viewer-views.svg";
import iconEdit from "./img/icon-edit.svg"

export const ToolbarButtons = {
  Reset: { display: true },
  Projection: { display: true },
  View: { display: true, submenu: { top: { display: true } } },
  Shading: { display: true },
  Navigation: { display: true },
  Measurement: { display: true },
  Settings: { display: true },
};
export let unitsArray = [
  "millimeter(mm)",
  "centimeter(cm)",
  "meter(m)",
  " ",
  "foot(ft)",
  "yard(yd)",
  "inch(in)",
];
export const ToolbarIcons = {
  iconFocusMode: {
    img: iconFocusMode,
    content: "Focus Mode",
    id: "tools-item5", displayDisabled:false, isDragDisabled:false
  },
  iconShading: { img: iconShading, tooltip: "Shading Icon", id: "iconShading" },
  iconHome: { img: iconReset, content: "Reset View", id: "tools-item1", displayDisabled:false, isDragDisabled:false }, 
  iconSettings: { img: iconSettings, content: "Settings", id: "tools-item6", displayDisabled:false, isDragDisabled:false },
  iconShowAll: { img: iconShowAll, content: "Show All", id: "manipulate-item3",displayDisabled:false, isDragDisabled:false },
  iconIsolate: { img: iconShowAll, content: "Isolate Selection", id: "manipulate-item1",displayDisabled:false, isDragDisabled:false },
  iconZoom: { img: iconShowAll, content: "Zoom Selection", id: "manipulate-item4",displayDisabled:false, isDragDisabled:false },
  iconHide: { img: iconShowAll, content: "Hide Selection", id: "manipulate-item2",displayDisabled:false, isDragDisabled:false },
  iconPerspective: {
    img: iconPerspective,
    tooltip: "Switch to Orthographic",
    id: "iconPerspective",
  },
  iconOrtho: {
    img: iconOrtho,
    tooltip: "Switch to Perspective",
    id: "iconOrtho",
  },
  iconAngle: {
    img: iconAngle,
    tooltip: "Measure Angle Between Faces",
    id: "iconAngle",
  },
  iconEdges: { img: iconEdges, content: "Measure Edges", id: "shading-item3",
  displayDisabled: false, isDragDisabled:false },
  iconFaces: {
    img: iconFaces,
    tooltip: "Distance Between Faces",
    id: "shading-item3",
    displayDisabled: false, isDragDisabled:false
  },
  iconPoints: {
    img: iconPoints,
    content: "Check Distance",
    id: "measurement-item1", displayDisabled:false, isDragDisabled:false
  },
  iconSelect: { img: iconSelect, content: "Select Elements", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconImport: { img: iconImport, content: "Import", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconExport: { img: iconExport, content: "Export", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconCircle: { img: iconCircle, content: "Circle", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconLine: { img: iconLine, content: "Line", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconPolyline: { img: iconPolyline, content: "Polyline", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconTextbox: { img: iconText, content: "Leader Note", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  icon3DTextbox: { img: icon3DText, content: "Text", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconRectangle: { img: iconRectangle, content: "Rectangle", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconFreehand: { img: iconFreehand, content: "Freehand", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconOval: { img: iconOval, content: "Oval", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconArrow: { img: iconArrow, content: "Arrow", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconHighlighter: { img: iconHighlighter, content: "Highlighter", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconPolygon: { img: iconPolygon, content: "Polygon", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconImage: { img: iconImage, content: "Image", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconSprite: { img: iconSprite, content: "Sprite", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconComment: { img: iconComment, content: "Comment", id: "measurement-item2", displayDisabled:false, isDragDisabled:false },
  iconOrthographic: {
    img: iconOrthographic,
    content: "Projection",
    id: "tools-item2", displayDisabled:false, isDragDisabled:false
  },
  iconCuttingPlane: {
    img: iconCuttingPlane,
    content: "Cutting Plane",
    id: "tools-item3", displayDisabled:false, isDragDisabled:false
  },
  iconMarkup: {
    img: iconCuttingPlane,
    content: "Markup",
    id: "tools-item3", displayDisabled:false, isDragDisabled:false
  },
  iconGis: {
    img: iconGis,
    tooltip: "",
    id: "iconGis",
  },
  iconModelComposer: {
    img: iconModelComposer,
    content: "Composer",
    id: "tools-item3", displayDisabled:false, isDragDisabled:false
  },
  iconAnimationPlay: {
    img: iconAnimationPlay,
    content: "Go Live",
    id: "tools-item3", displayDisabled:false, isDragDisabled:false
  },
  iconAnimationStop: {
    img: iconAnimationStop,
    content: "Stop Live",
    id: "tools-item3", displayDisabled:false, isDragDisabled:false
  },
  iconAnalytics: { img: iconAnalytics, tooltip: "", id: "iconAnalytics" },
  icon2Dviewer: { img: icon2Dviewer, content: '2D Viewer', id: "tools-item4", displayDisabled:false, isDragDisabled:false },
  icon3Dviewer: { img: icon3Dviewer, content: '3D Viewer', id: "tools-item4", displayDisabled:false, isDragDisabled:false },
  iconArcgis: { img: iconArcgis, content: 'ArcGIS', id: "tools-item4", displayDisabled:false, isDragDisabled:false },
  iconArcgisOverview: { img: iconArcgisOverview, content: 'ArcGIS Overview', id: "tools-item4", displayDisabled:false, isDragDisabled:false },
  iconUnrealEngine: { img: iconUnrealEngine, content: 'Unreal Engine', id: "tools-item4", displayDisabled:false, isDragDisabled:false },
  iconPhotosphere: { img: iconPhotosphere, content: 'Photosphere', id: "tools-item4", displayDisabled:false, isDragDisabled:false },
  iconNavCamera: {
    img: iconNavCamera,
    content: "Orbit Camera",
    id: "navigation-item4", displayDisabled: false, isDragDisabled:false
  },
  iconNavRotate: {
    img: iconNavRotate,
    content: "Turntable",
    id: "navigation-item3", displayDisabled: false, isDragDisabled:false,
  },
  iconNavFirstP: { img: iconNavFirstP, content: "Walk", id: "navigation-item5", displayDisabled: false, isDragDisabled:false },
  iconNavPan: { img: iconNavPan, content: "Pan", id: "navigation-item2", displayDisabled: false, isDragDisabled:false },
  iconNavZoom: { img: iconNavZoom, content: "Zoom", id: "navigation-item1", displayDisabled: false, isDragDisabled:false },
  iconViewerMove: {
    img: iconViewerMove,
    tooltip: "iconViewerMove",
    id: "iconViewerMove",
  },
  iconBack: { img: iconBack, content: "Back View", id: "view-item6", displayDisabled: false, isDragDisabled:false },
  iconBottom: { img: iconBottom, content: "Bottom View", id: "view-item2", displayDisabled: false, isDragDisabled:false },
  iconFront: { img: iconFront, content: "Front View", id: "view-item5", displayDisabled: false, isDragDisabled:false },
  iconTop: { img: iconTop, content: "Top View", id: "view-item1", displayDisabled: false, isDragDisabled:false },
  iconLeft: { img: iconLeft, content: "Left View", id: "view-item3", displayDisabled: false, isDragDisabled:false },
  iconRight: { img: iconRight, content: "Right View", id: "view-item4", displayDisabled: false, isDragDisabled:false },

  iconFullNoLines: {
    img: iconFullNoLines,
    content: "Full Shading, no Lines",
    id: "shading-item2",
    displayDisabled: false, isDragDisabled:false
  },
  iconFullWithLines: {
    img: iconFullWithLines,
    content: "Full Shading, with Lines",
    id: "shading-item1",
    displayDisabled: false, isDragDisabled:false
  },
  iconGlass: { img: iconGlass, content: "Glass View", id: "shading-item4",
  displayDisabled: false, isDragDisabled:false },
  iconHiddlenLines: {
    img: iconHiddlenLines,
    content: "Edges & Lines",
    id: "iconHiddlenLines",
  },
  iconWireFrame: {
    img: iconWireFrame,
    tooltip: "Wireframe",
    id: "iconWireFrame",
  },

  iconViewsCamera: {
    img: iconViewsCamera,
    tooltip: "Views",
    id: "iconViewsCamera",
  },
  iconDragArea: { img: iconDragArea, tooltip: "Drag Area", id: "iconDragArea" },
  iconEditToolbar: { img: iconEdit, content: "Customize", id: "iconEdit" },
};
export const ToolBarConfig = {
  toolbarList: [
    ToolbarIcons.iconHome,
    ToolbarIcons.iconOrthographic,
    ToolbarIcons.iconCuttingPlane,
    ToolbarIcons.icon2Dviewer,
    ToolbarIcons.iconFocusMode,
    ToolbarIcons.iconSettings,
  ],
  viewList: [
    ToolbarIcons.iconTop,
    ToolbarIcons.iconBottom,
    ToolbarIcons.iconLeft,
    ToolbarIcons.iconRight,
    ToolbarIcons.iconFront,
    ToolbarIcons.iconBack,
  ],      
  shadingList: [
    ToolbarIcons.iconFullWithLines,
    ToolbarIcons.iconFullNoLines,
    ToolbarIcons.iconEdges,
    ToolbarIcons.iconGlass,
  ],
  navigationList: [
    ToolbarIcons.iconNavZoom,
    ToolbarIcons.iconNavPan,
    ToolbarIcons.iconNavRotate,
    ToolbarIcons.iconNavCamera,
    ToolbarIcons.iconNavFirstP,
  ],
  measurementList: [
    ToolbarIcons.iconPoints,
    ToolbarIcons.iconSelect,
  ],
  manipulateList: [
    ToolbarIcons.iconIsolate,
    ToolbarIcons.iconHide,
    ToolbarIcons.iconShowAll,
    // ToolbarIcons.iconZoom,
  ]
}
