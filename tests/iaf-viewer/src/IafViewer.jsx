/**
 * ****************************************************************************
 *
 * INVICARA INC CONFIDENTIAL __________________
 *
 * Copyright (C) [2012] - [2023] INVICARA INC, INVICARA Pte Ltd, INVICARA INDIA
 * PVT LTD All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of
 * Invicara Inc and its suppliers, if any. The intellectual and technical
 * concepts contained herein are proprietary to Invicara Inc and its suppliers
 * and may be covered by U.S. and Foreign Patents, patents in process, and are
 * protected by trade secret or copyright law. Dissemination of this information
 * or reproduction of this material is strictly forbidden unless prior written
 * permission is obtained from Invicara Inc.
 */

// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 06-01-23    ATK        PLAT-2709   New UX UI Foundation Project
//                                    Code Restructuring.
//                                    Introduced iafCallbackModelStructureReady
// 18-04-23    HSK        PLAT-2652   Removed event listner from window listner and added to mainViewer div
//                                    To resolve default context menu and viewer context menu conflict 
// 26-04-23    HSK        PLAT-2727   Added toolbar size property to IafViewer Object so that we can 
//                                    create toolbar according to received size from app
// 10-05-23    HSK        PLAT-2813   Add mouseevents and handle new ui submenus
// 24-05-23    HSK        PLAT-2730   Revamed IafViewer Panels - Cutting Planes
// 26-05-23    HSK                    Implemented validations and checks to ensure execution of functions when specific data is loaded. 
// 22-06-23    HSK                    Introduced renameCameraObjectKeys
// 23-06-23    HSK                    Handeled viewer width according to toolbar size
// 01-08-23    ATK        PLAT-3117   Selection and highlighting enhancements
// 17-07-23    HSK                    Implemented line select color and face select color as seperate properies
// 10-01-23    ATK                    Heat maps & GIS Research
// 26-06-23    ATK                    Important! mapboxViewer styling matching up with mainViewer's for the overlay
// 03-07-23    ATK        PLAT-2939   Model Viewer and Mapbox viewer should accurately overlap. Warn otherwise!
// 24-08-23    HSK        PLAT-3235   Console Errors fixes on missing 3D and/or 2D objects
// 01-09-23    HSK                    Commented Context menu code, Made Pan operator as default
// 01-09-23    HSK                    Resolved a bug in handleHide function, added guard clause in handlehide, handeIsolate and handleZoom function
// 01-09-23    HSK                    Added states and functions to handle iafNotification operations
// 04-09-23    HSK                    Added 'severity' state to determine severity of message
// 03-10-23    HSK                    Imported Custom Select Operator for 2d viewer to manage the selections
// 05-10-23    HSK                    Added measurment and related functionality in 2d viewer
// 27-09-23    HSK                    Added state, function for aletring toolbarSize
// 22-Oct-23   ATK        PLAT-2414   Performance - CSDL - On Demand
// 04-Nov-23   ATK        PLAT-3583   Model Composition 3D - Linked Files - graphicsResources.getNodeIds
// 08-11-23    HSk        PLAT-3402   Set bimWalk by default based on value coming from walk operator or true
// 22-11-23    HSK                    Removed Action functions,states of IafNotification
// 28-Nov-23   ATK        PLAT-3585   Productise 2D Sheets CSDL. 
// 01-Dec-23   ATK        PLAT-3647   Notification Store
// 02-Dec-23   ATK        PLAT-3646   CSDL - Revit Element Driven Dynamic Load. 
//                                    Asynchronous (await) graphicsResources.getNodeIds
// 27-11-23    HSK                    Used saved view class to show demo in resetAll function
// 05-11-23    HSK                    Console error around resizeCanvas
// 10-12-23    ATK        MK-149      Added viewer callbacks for error handling
// 11-12-23    HSK        DB-2134     QA6: 2.3.13: Navigator: Focus mode is not working 
//                        PLAT-3769   Changed Zoom on node according to zoom state instead of always true
// 08-12-23    HSK        PLAT-3793   IafViewer DevTools - Camera Callback Panel under IafUtils.debugIaf
// 29-Dec-23   ATK                    Optimize setDrawMode to executed only when needed
//                                    this.props.idMapping[0][nodeId] is replaced by this.props.graphicsResources.getPkgId(nodeId)
// 30-Dec-23   ATK                    Introduced IafViewer.graphicsResourceManager(viewer)
// 10-01-24    RRP        PLAT-3917   Introduce a new IafViewer property enableFocusMode
// 05-01-24    HSK        PLAT-3656   Introduce enable2DViewer in PropertyStore
// 16-01-24    ATK        PLAT-4038   Websocket connection failure due to timing issue for segmented load
// 08-01-24    HSK        PLAT-3614   Added Try catch block around node mapping functions
// 12-01-24    HSK        PLAT-3521   3D Element Selection with Inactive 2D Sheet
// 18-01-24    HSK        PLAT-3521   Added isSynchronisationActive flag to control 2d/3d synchronisation
// 19-01-24    RRP        PLAT-3129   Review Interactive Zoom Performance
//                                    Typo - renameCameraObjectKeys/projection to renameCameraObjectKeys/_projection
// 19-01-24    HSK        PLAT-3446   Define and demonstrate reusable Measurement Json Object (3d and 2d)
// 29-01-24    ATK        PLAT-2957   Graphics Server Connection State Notifications
// 31-01-24    ATK        PLAT-4125   GraphicsDbLoadConfig.ConfigType ComposeByNavigation, ComposeByAssets
// 01-Feb-24   ATK        PLAT-4125   Compose By Disciplines
// 02-02-24    HSK        PLAT-3829   Measurement functions (e..g clickMeasurePoint) don't take into account ONLY 2D Project
// 08-02-24    RRP        PLAT-3258   Intuitive default orientation on enabling the walk mode
// 20-02-24    RRP        PLAT-4281   Selection issues with DWG Projects (2D Only Projects)
// 23-02-24    RRP        PLAT-4069   IafViewer Callback Property OnSelectedElementChangeCallback should return PackageId(ElementId)
// 23-02-24    RRP        PLAT-4134   unselectParts function in applySelection, doesn't work properly
// 23-02-24    RRP        PLAT-4060   Glass mode (Sliced elements) is not reset after clearing the sliceElementId array
//                                    Introduced PropertyStore.enableOptimizedSelection
// 29-02-24    HSK        PLAT-4269   The Full Screen/Half Screen 2D Mode does not resize on window resize
// 11-03-24    HSK        PLAT-4343   Apply & Save / Apply buttons should not reset Camera
// 12-03-24    HSK        PLAT-4347   In Settings Panel / Save Current (View) added a generic (common) entry to local storage for all projects, which is project id specific.
// 06-02-24    HSK        PLAT-3422   Markups
// 06-02-24    ATK        PLAT-3422   Markups Restructuring.
// 10-04-24    ATK        PLAT-3422   Markups Restructuring - iafCallbackKeyDown
// 12-04-24    ATK        PLAT-4466   Keyboard functions don't work for 2D
// 06-05-24    ATK        PLAT-4628   Animation Foundation
// 11-06-24    HSK        PLAT-4891   Bug - 3D Text Markup is editable only on creation
// 12-05-25    RRP        PLG-1519    Added handling for undefined entries and empty strings in the props.selection array
// -------------------------------------------------------------------------------------

/*
IafViewer properties
  model: model NamedCompositeItem containing _id. _name and _namespaces
  ref:
  fileSet: files of the model
  authToken:
  sliceElementIds: if some sliceElementIds is passed in, model will be default to glass mode
  selection: selected elements
  hiddenElementIds: hidden elements
  wsUri: Graphics Service location, sample: 'wss://general-dev.invicara.com'
  settings:
  saveSettings: callback to save settings. Parameter: settings
  idMapping: array of ID mapping between viewer nodeId and BIMPK package ID like {node: xx, bimpkid: xx}
  viewerResizeCanvas: a flag to tell the viewer it needs to resize the canvas when the size of container of the viewer is changed

 */

import React from "react";
import ViewerManager from "./common/ViewerManager.js";
import PropTypes from "prop-types";
import { SelectOperator } from "./operators/SelectOperator.js";
import { IafOrbitOperator } from "./operators/IafOrbitOperator.js";
import { IafZoomOperator } from "./operators/IafZoomOperator.js";
import { IafCameraZoomOperator } from "./operators/IafCameraZoomOperator.js";
import { IafCameraWalkOperator } from "./operators/IafCameraWalkOperator.js";
import { IafCameraKeyboardWalkOperator } from "./operators/IafCameraKeyboardWalkOperator.js";
import { IafCameraWalkModeOperator } from "./operators/IafCameraWalkModeOperator.js";
import ViewerIsolateZoomHelper from "./common/ViewerIsolateZoomHelper.js";
import { IafDrawMode } from "./common/IafDrawMode.js";
import IafOperatorUtils from './operators/IafOperatorUtils';
import { SelectOperator2d } from "./operators/SelectOperator2D.js";
import IafSavedViews from "./common/iafSavedViews.js";
import { IafProj } from '@dtplatform/platform-api'
// import { mousedown, contextmenu} from "./callbacks/mouse";

//import ViewerPropertyWindow from "./ViewerPropertyWindow.jsx";
// import SettingsModal from "./SettingsModal.jsx";
// import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import "./ui/styles/ReactContextmenu.scss";
import _, { set } from "lodash-es";
// import { QUERY_RESULT } from "./query_data_2.js";
import IafCuttingPlanesUtils from './core/IafCuttingPlanes.js'
import IafSpaceUtils from "./core/SpaceUtils.js";
import IafCanvasElement from "./ui/layouts/canvasElement.jsx";

import iafCallbackCamera, { setIafCameraProjection } from "./core/camera";
import { updateInfoOnCanvas } from "./core/camera";


import iafCallbackModelStructureReady from "./callbacks/modelStructureReady.js"
import iafLogNodes from "./common/nodes";
import IafUtils, { IafObjectUtils, IafPerfLogger, IafStorageUtils } from "./core/IafUtils.js";
import iafCallbackModelStructureReady2D, { loadSheet } from "./callbacks/modelStructrureReady2D";
import { getCompositeFileName } from "./core/IsomorphicFileUtils.js";
import { linkedModelItemsFromGraphicsResources } from "./common/LinkedModels";
import IafMeasurementManager from "./common/IafMeasurementManager.js";
import { iafAddCuttingSection, iafCuttingPlaneDragStart, iafMarkupViewLoaded, iafModelLoaded, iafModelStructureHeaderParsed, iafModelStructureLoadBegin, iafModelStructureLoadEnd, iafModelStructureParseBegin, iafModelSwitched, iafModelSwitchStart, iafRemoveCuttingSection, iafStreamingActivated, iafStreamingDeactivated, iafSubtreeDeleted, iafSubtreeLoaded, iafWebGlContextLost, iafWebsocketConnectionClosed, iafWebsocketTimeout, iafWebsocketTimeoutWarning, setClientTimeout } from "./callbacks/connection.js";
import { iafAssemblyTreeReady, iafHoopsInfo, iafMissingModel, iafModelLoadBegin, iafModelLoadFailure, iafSheetActivated, iafSheetDeactivated } from "./callbacks/lifecycle.js";
import { IafWebSocketTracker } from "./core/IafWebSocketTracker.js";
import { GraphicsDbGeomViews, GraphicsDbLoadConfig } from "./core/database.js";
import { getLayerState, isPrivilegedLayerType } from "./common/Layers.js";
import { IafMarkupManager, IafMarkupManager2d } from "./core/IafMarkupManager.js";
import { iafCallbackKeyDown } from "./callbacks/keyboard.js";
import { IafAnimationManager, IafAnimationManager2d } from "./core/IafAnimationManager.js";
import { iafCallbackWindowResize, iafCallbackWindowResize2d } from "./callbacks/window.js";
import { NotificationStore } from "./store/notificationStore.js";
import { compareObjects, DEFAULT_GIS_ZOOM_SPEED, DEFAULT_GIS_DISTANCE_SCALE_FACTOR } from "./core/gis/utils.js";
import { useLogChangedPropertiesForClass } from "./common/hooks/useLogChangedProperties.jsx";
import styles from "./IafViewer.module.scss";
import { IafBoundingBoxMarkup } from "./core/markups/IafBoundingBoxMarkup.js";
import { IafDatabaseManager, IafApiClientModelComposition } from "./core/database/IafDatabaseManager.js";
import IafMapBoxGl from "./core/gis/iafMapBoxGl.js";
import { IafTuner } from "./core/gis/tuner.js";
import IafGraphicsResourceManager, { IafGraphicsResourceManager2d } from "./core/IafGraphicsResourceManager.js";
import { IafMathUtils } from "./core/IafMathUtils.js";
import { IafGltfManager } from "./core/gis/iafGltfManager.js";
import { GisElevationMode, GisFederatedMode } from "./common/enums/gis.js";
import { HoopsViewer } from "./ui/component-high/ModelTree/HoopsViewer.jsx";
import EvmUtils, { EvmElementIdManager } from "./common/evmUtils.js";
import IafSet from "./common/iafSet.js";
import { permissionManager } from "./core/database/permission/iafPermissionManager.js";
import IafFileManager from "./core/database/IafFileManager.js";
import { IafResourceUtils } from "./core/IafResourceUtils.js";
import { EModelComposerQuality } from "./common/IafViewerEnums.js";
import { IafDisposer } from "./core/IafDisposer.js";

  // import iafCallbackCamera from "./core/camera"
let bdSelectColor;
export function initBdSelectColor() {
  bdSelectColor = new window.Communicator.Color(74, 255, 255, 0.3);
}
let lineSelectColor;
export function initLineSelectColor() {
  lineSelectColor = new window.Communicator.Color(74, 255, 255);
}
let faceSelectColor;
export function initFaceSelectColor() {
  faceSelectColor = new window.Communicator.Color(74, 255, 255);
}
const zoomLevel2D = 10;
var stateOf2DViewer = false;
/**
 * IafViewer class perform viewer related operations
 * @module IafViewer
 */
export class IafViewer extends React.Component {
  constructor(props) {
    super(props);
    // to get access to newToolbar method to open cutting plane menu
    this.newToolbarElement = React.createRef();
    this.evmElementIdManager = new EvmElementIdManager();
    this.state = {
      devToolsCamera:null,
      enableDevTools: IafUtils.debugIaf || IafUtils.devToolsIaf,
      severity:null,
      visible: props.view2d.enable ?? false,
      visible3d: props.view3d.enable ?? false,
      visibleArcgis: this.props.arcgis?.enable ?? false,
      visibleArcgisOverview: this.props.arcgisOverview?.enable ?? false,
      visibleUnrealEngine: this.props.ue?.enable ?? false,
      visiblePhotosphere: this.props.photosphere?.enable ?? false,
      // Shared state for ue properties - can be updated from both props and toolbar buttons
      ue: {
        displayMode: props?.ue?.displayMode ?? EvmUtils.EVMDisplayMode.DEFAULT,
        enable: props?.ue?.enable ?? false,
        showToolbar: props?.ue?.showToolbar ?? true,
        alignment: props?.ue?.alignment ?? EvmUtils.EVMWidgetAlignment.RIGHT_BOTTOM,
        margin: props?.ue?.margin ?? 0
      },
      // Shared state for arcgis properties - can be updated from both props and toolbar buttons
      arcgis: {
        displayMode: props?.arcgis?.displayMode ?? EvmUtils.EVMDisplayMode.FULLSCREEN,
        enable: props?.arcgis?.enable ?? false,
        showToolbar: props?.arcgis?.showToolbar ?? true,
        alignment: props?.arcgis?.alignment ?? EvmUtils.EVMWidgetAlignment.LEFT_TOP,
        margin: props?.arcgis?.margin ?? 0
      },
      spinnerStatus: "",
      visibleViewer2D: false,
      visibleDisciplines: false,
      visibleModelTree: false,
      nodesModelTree: [],
      nodesModelTree2d: [],
      nodesDisciplines: [],
      hwvInstantiated: false,
      isMaxUiButtonActive: false,
      isMinUiButtonActive: false,
      //isModelLoading: false,
      currentJsonCamara: null,
      showModelViewer: IafStorageUtils.getSceneGraph() || false,
      isGisEnabled: false,
      isLoadConfigLoaded: true,
      isLinkedModelLoaded: true,
      isModelStructureReady: false,
      isModelStructureReady2d: false,
      isFrameDrawn: false,
      isSetCuttingPlaneActive: false,
      //latest selected node
      _activeLayerName: null,
      _activeType: null,
      _activeItemId: null,
      isShowSettings: false,
      isShowMarkups: false,
      showMarkupsContent : false,
      markupHandler: {
        manager: null,
        uuid: null,
        markupType: null
      },
      settings: {},
      //the nodeIds in the viewer of the slice
      //sliceNodeIds: [],
      //selectedNodeIds: [],
      hiddenNodeIds: [],
      //glassMode: false,
      isGlassIsolate:
        _.size(props.settings) == 0 ||
        props.settings.hasOwnProperty("isGlassIsolate")
          ? false
          : props.settings.isGlassIsolate,
      isContextDisabled: false,
      //drawMode can be one of Communicator.DrawMode or GlassMode

      // ATK: At the moment 3d and 2d viewers are instantiated in iafviewer
      // They should ideally be instantitated via widgets components of IafWidgetRenderers.jsx
      drawMode: IafDrawMode?.Shaded,
      sheetIdx: 0,
      sheetIds: [],
      sheetNames: [],
      width2d: 312,
      height2d: 243,
      marginLeft2d: 24,
      marginTop2d: 54,
      zoomOnSelection: props.enableFocusMode,
      positionOf2DViewer: {
        x: 0,
        y: 0,
      },
      multiplier: 12.0 * 25.4, //Set multiplier default value in feets 
      initialCameraPosition: {},
      prevSelectdUnits: "foot(ft)",
      forceShowModal: false,
      topSliderValue: null,
      
      bottomSliderValue: null,
      leftSliderValue: null,
      rightSliderValue: null,
      backSliderValue: null,
      frontSliderValue: null,
      gisViewInfo: "",
      modelViewInfo: "",
      tunerInfo: "",
      isShowCuttingPlanes:false,
      isShowGisViewer:false,
      isShowCuttingPlanes:false,
      isShowLoadConfig:false,
      toolbarSize : IafUtils.devToolsIaf ? 'small' : props.toolbarSize,
      linkedModelItems: [],
      enableSheetSwitch: true,
      isSynchronisationActive : false,
      isGisDistanceScale: true,
      isModelCacheEnabled: true,
      isVerticalGeoAlignmentEnabled: true,
      glassOpacity: 0.05,
      // gisGltfModelRenderingZoom: 18.5,
      gisGltfModelDynamicSwitching: true,
      // gisModelRenderingDistanceFromCenter: 30,
      isUtilitiesActive: false,
      windowWidth: window.innerWidth, // HSK PLAT-4269: The Full Screen / Half Screen 2D Mode does not resize on window resize
      showSandbox: false,
      showPDF: false,
      composeType: GraphicsDbLoadConfig.ConfigType.AutoCompose,
      showBoundingBoxWireframe: false,
      viewer2DWidget: null,
      activeAnimationUuid: undefined,
      isAnimationPlaying: false

      // Dev Tools
      , isDevGisInfoEnabled: false      
      , modelComposition: {
        _properties: {
          layers: {},
          categories: [],
          quality: this.props.modelComposition.quality ?? EModelComposerQuality.Low
        },
        _transient: {composeType: undefined}
      },
      // isVerticalAlignmentFixEnabled: true,
      isGltfViewEnabled: true,
      gisZoomSpeed: DEFAULT_GIS_ZOOM_SPEED,
      gisDistanceScaleFactor: DEFAULT_GIS_DISTANCE_SCALE_FACTOR,
      isDevGisMeasEnabled: false,
      skipPersistedDisciplineSelection: true,
      isModelLayered: true,
      isCompressEnabled: true,
      isModelComposerProgress: false,
      resourcePermissions: null,
      enforcePermission: false,
      modelId: this.props.model?._id || null,
      modelVersionId: this.props.modelVersionId || null,
      showAnnotations: true,
      enablePreSignedUrls: props.enablePreSignedUrls ?? IafResourceUtils.enablePreSignedUrls,
      enableTokenAuthentication: props.enableTokenAuthentication ?? IafResourceUtils.enableTokenAuthentication, // Default: false
      gis: {
        ...this.props.gis,
        enable: this.props.gis?.enable ?? false,
        elevationMode: EvmUtils.EvmElevationMode.None,
        federatedMode: EvmUtils.EvmFederatedMode.None,
        primaryModelId: this.props.graphicsResources?.dbModel?._id ?? this.props.model?._id,
        displayMode: props?.gis?.displayMode ?? EvmUtils.EVMDisplayMode.FULLSCREEN,
        showToolbar: props?.gis?.showToolbar ?? false,
        alignment: props?.gis?.alignment ?? EvmUtils.EVMWidgetAlignment.LEFT_TOP,
        margin: props?.gis?.margin ?? 0,
        showMapMarkers: props?.gis?.showMapMarkers ?? true,
        isLoaded: true, // PLG-1646: Gis is not considered loaded until view3d is completely loaded if enabled
        dynamicRenderingDistance: props.gis?.dynamicRenderingDistance ?? 750,
        dynamicRenderingZoom: props.gis?.dynamicRenderingZoom ?? 14,
      },
      view3d: {
        displayMode: props?.view3d?.displayMode ?? EvmUtils.EVMDisplayMode.FULLSCREEN,
        enable: props?.view3d?.enable ?? false,
        showToolbar: props?.view3d?.showToolbar ?? false,
        alignment: props?.view3d?.alignment ?? EvmUtils.EVMWidgetAlignment.LEFT_TOP,
        margin: props?.view3d?.margin ?? 0,
        isLoaded: true // PLG-1646: Gis is not considered loaded until view3d is completely loaded if enabled
      },
      view2d: {
        displayMode: props?.view2d?.displayMode ?? EvmUtils.EVMDisplayMode.DEFAULT,
        enable: props?.view2d?.enable ?? false,
        showToolbar: props?.view2d?.showToolbar ?? true,
        alignment: props?.view2d?.alignment ?? EvmUtils.EVMWidgetAlignment.LEFT_TOP,
        margin: props?.view2d?.margin ?? 0,
        isLoaded: true // PLG-1646: Gis is not considered loaded until view2d is completely loaded if enabled
      },
    };
    this.isOthersComposed = false;
    this.isAutoComposed = true;
    this.projectId = null;
    this.cameraDuration = 1000; // animation for camera duration (ms)
    this.isZoomOptimized = true;
    this.isHighlightActiveViews = false;
    this.spinnerStatusArray = [];
    this.measurementManager = null,
    this.measurementManager2d = null,
    this.enableFocusMode= props.enableFocusMode,
    this.savedViewsManager = null;
    this.markupManager = null;
    this.markupManager2d = null;
    this.animationManager = null;
    this.animationManager2d = null;
    this.uiConfig = { toolbarSize : props.toolbarSize}
    this.PrevHiddenElements = [];
    this.leftOfMainViewer = null;
    this._viewerInitialized = false;
    this._viewer = undefined;
    this._viewer2d = undefined;
    this.modelBounding = null;
    (this.isMax2DViewer = false), (this._hwvManager = new ViewerManager());
    this._isolateZoomHelper = undefined;
    this._isolateZoomHelper2d = undefined;
    this._transparencyIdHash = new Map();
    this.settingsModal = undefined;
    this.allChildren = [];
    this.selectOperator = undefined;
    this.selectOperatorId = undefined;
    this.orbitOperator = undefined;
    this.orbitOperatorId = undefined;
    this.zoomOperator = undefined;
    this.zoomOperatorId = undefined;

    this.zoomOperator2d = undefined;
    this.zoomOperatorId2d = undefined;

    this.selectOperator2d = undefined;
    this.selectOperator2dId = undefined;

    this.mouseWalkOperator = undefined;
    this.mouseWalkOperatorId = undefined;
    this.keyboardWalkOperator = undefined;
    this.keyboardWalkOperatorId = undefined;
    this.walkOperator = undefined;
    this.walkOperatorId = undefined;
    this.forceUpdateViewerElements = false;
    this.navOperator = undefined;
    this.navOperatorId = undefined;
    this.prevSelection = [];
    this.prevSelection2D = [];//RRP PLAT-4281 Selection issues with DWG Projects (2D Only Projects)
    this.glassModeFromToolbar = false;
    this.SpaceElementSet = [];
    this.IsolateElementSet = [];
    this.HiddenElementSet = [];
    this.ZoomElementSet = [],
    this.applySelectioncalled = false;
    this.planeValuesStored = {};
    //drawMode can be one of Communicator.DrawMode or GlassMode
    //no need to store this in the state
    // ATK: At the moment 3d and 2d viewers are instantiated in iafviewer
    // They should ideally be instantitated via widgets components of IafWidgetRenderers.jsx
    this._drawMode = IafDrawMode?.Shaded;
    this.isSceneReady = false;
    this.contextTrigger = null;
    this.prevBoundryElements = [];
    this._boundingBoxMarkup = null;
    this._boundingBoxMarkupHandle = null;
    this.resetSelection = true;
    this.handleResize = this.handleResize.bind(this);
    this._getProperties = this._getProperties.bind(this);
    this._createViewer = this._createViewer.bind(this);
    this.recreate3DViewerAfterWebsocketClose =
      this.recreate3DViewerAfterWebsocketClose.bind(this);
    this._create2DViewer = this._create2DViewer.bind(this);
    this.getColorGroupThemeIds = this.getColorGroupThemeIds.bind(this);
    this.getSlicedNodeIDs = this.getSlicedNodeIDs.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onResize = this.onResize.bind(this);
    this.handleFocusMode = this.handleFocusMode.bind(this);
    //this.switchModelReset = this.switchModelReset.bind(this)
    this.handleUnitConversion = this.handleUnitConversion.bind(this);
    this.getModelBoundingBox = this.getModelBoundingBox.bind(this);
    this.getplaneValues = this.getplaneValues.bind(this);

    this.showSettingsModal = this.showSettingsModal.bind(this);
    this.handleChangeSliderTopPlane =
      this.handleChangeSliderTopPlane.bind(this);
    this.handleChangeSliderBottomPlane =
      this.handleChangeSliderBottomPlane.bind(this);
    this.handleChangeSliderFrontPlane =
      this.handleChangeSliderFrontPlane.bind(this);
    this.handleChangeSliderBackPlane =
      this.handleChangeSliderBackPlane.bind(this);
    this.handleChangeSliderLeftPlane =
      this.handleChangeSliderLeftPlane.bind(this);
    this.handleChangeSliderRightPlane =
      this.handleChangeSliderRightPlane.bind(this);
    this.closeSettingsModal = this.closeSettingsModal.bind(this);
    this.handleCtxmenuClick = this.handleCtxmenuClick.bind(this);
    this.getContextItemIds = this.getContextItemIds.bind(this);
    this.handleIsolate = this.handleIsolate.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.handleTransparent = this.handleTransparent.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleShowAll = this.handleShowAll.bind(this);
    this.handleGetMarkup = this.handleGetMarkup.bind(this);

    this.getSecondLevelNodes = this.getSecondLevelNodes.bind(this);
    this.generateRecursive = this.generateRecursive.bind(this);
    this.getSettings = this.getSettings.bind(this);
    this.loadSettings = this.loadSettings.bind(this);

    this.setNodesColors = this.setNodesColors.bind(this);
    this.getAllChildren = this.getAllChildren.bind(this);
    this.getNodeIds = this.getNodeIds.bind(this);
    this.handleElementsIdsChange = this.handleElementsIdsChange.bind(this);
    this.resetThemeandSelection = this.resetThemeandSelection.bind(this);
    this.handleHiddenElementIds = this.handleHiddenElementIds.bind(this);
    this.handleSpaceElementIdsChnage =this.handleSpaceElementIdsChnage.bind(this);
    this.applyColorTheme = this.applyColorTheme.bind(this);
    this.isolateSlicedElementIds = this.isolateSlicedElementIds.bind(this);
    this.applySelection = this.applySelection.bind(this);
    this.getThemeColors = this.getThemeColors.bind(this);

    this.prevElementTheme = null;
    //this.handleTopicsChanges = this.handleTopicsChanges.bind(this)
    this.toggleVisibilityViewer2d = this.toggleVisibilityViewer2d.bind(this);
    this.toggleVisibilityViewer3d = this.toggleVisibilityViewer3d.bind(this);
    this.toggleVisibilityArcgis = this.toggleVisibilityArcgis.bind(this);
    this.toggleVisibilityArcgisOverview = this.toggleVisibilityArcgisOverview.bind(this);
    this.toggleVisibilityUnrealEngine = this.toggleVisibilityUnrealEngine.bind(this);
    this.toggleVisibilityPhotosphere = this.toggleVisibilityPhotosphere.bind(this);
    this.toggleFocusModeOnWalkModeChange =
      this.toggleFocusModeOnWalkModeChange.bind(this);
    this.handleSheetNext = this.handleSheetNext.bind(this);
    this.handleSheetPrev = this.handleSheetPrev.bind(this);

    this.handleMax2d = this.handleMax2d.bind(this);
    this.handleMin2d = this.handleMin2d.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.getAllChildrenForNodeIds = this.getAllChildrenForNodeIds.bind(this);
    this.applyBoundries = this.applyBoundries.bind(this);

    this.isElementThemingIdExists = this.isElementThemingIdExists.bind(this);
    this.setDrawMode = this.setDrawMode.bind(this);
    this.bcfTest = this.bcfTest.bind(this);
    this.handleForceShowModal = this.handleForceShowModal.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.renameCameraObjectKeys = this.renameCameraObjectKeys.bind(this);
    this.enable2dMeasurment = this.enable2dMeasurment.bind(this);
    this.handleToolbarSize = this.handleToolbarSize.bind(this);
    this.handleDevToolsPanel = this.handleDevToolsPanel.bind(this);

    // PLG-1519 Keep only valid items (remove null, undefined, and empty strings)
    this.filteredSelection = (selection) => Array.isArray(selection)
        ? selection.filter(v => v != null && v !== "")
        : [];
    // PLG-1519 Get the current selection array from props
    this.getSelection = () => {
      return this.filteredSelection(this.props.selection);
    };
    
    this.commands = {
      getSelectedEntities: async () => {
        try{
        let pkgIds = [];
        let entities = [];
        if (this._viewer) entities = this._viewer.selectionManager.getResults();
        let i = 0;
        if (_.size(entities) > 0 
            && this._viewer
            // && _.size(this.props.idMapping[0])
          ) {
          for (let j = 0; j < entities.length; j++) {
            let hidden = false;
            let activeNode = entities[j];
            if (_.size(this._viewer.hiddenNodeIds) > 0) {
              //check if this active node is being hidden, if so, add all parent nodes into hiddenNodeIds
              hidden = this._viewer.hiddenNodeIds.includes(activeNode._nodeId);
            }
            while (activeNode && i < 20 && activeNode != 0 
                    && activeNode._nodeId) //ATK: May end up in 'cannot read properties of null' error due to missing idmapping table
              { 
              i++;
              // let pkgId =
              //   this.props.idMapping[0][activeNode._nodeId.toString()];
              let pkgId = this.props.graphicsResources.getPkgId(activeNode._nodeId);                
              if (_.size(pkgId) == 0) {
                let pId = this._viewer.model.getNodeParent(activeNode._nodeId);
                IafUtils.devToolsIaf && console.log('IafViewer.commands.getSelectedEntities'
                  , pId
                );
                activeNode = { _nodeId: pId };
                if (hidden) {
                  this._viewer.hiddenNodeIds.push(pId);
                }
              } else {
                break;
              }
            }

            if (activeNode) {
              let pkgId;
              if (activeNode._nodeId) {
                // pkgId = this.props.idMapping[0][activeNode._nodeId.toString()];
                pkgId = this.props.graphicsResources.getPkgId(activeNode._nodeId);  
              }
              if (_.size(pkgId) > 0) {
                pkgIds.push(pkgId);
              }
            }
          }
          pkgIds.length && IafUtils.devToolsIaf && console.log('IafViewer.commands.getSelectedEntities'
            , '3d selections found', JSON.stringify(pkgIds)
          );  
          this._viewer.hiddenNodeIds && this._viewer.hiddenNodeIds.length && IafUtils.devToolsIaf && console.log('IafViewer.commands.getSelectedEntities'
            , '3d hiddenNodeIds found', JSON.stringify(this._viewer.hiddenNodeIds)
          );  
          return _.uniq(pkgIds);
        } else {
          IafUtils.devToolsIaf && console.log('IafViewer.commands.getSelectedEntities'
            , 'no selections found'
          );  
          return [];
        }
        } catch (error) {
          console.error('An error occurred in getSelectedEntities:', error);
          throw error;
        }
      },
      setDrawMode: (glassMode, glassModeFromToolbar, newDrawMode) => {
        this.glassModeFromToolbar = glassModeFromToolbar;
        this.setDrawMode(glassMode, newDrawMode);
      },

      getSettings: async () => {
        let settings = await this.getSettings();
        return settings;
      },
      getIsolatedElements: () => {
        return this.IsolateElementSet;
      },

      getHiddenElemets: () => {
        return this.HiddenElementSet;
      },
      zoomToElements: () => {
        return this.ZoomElementSet;
      },
      getCuttingPlanes: () => {
        let modelBoundingValues = this.getModelBoundingBox();
        let planeValue = {
          max: {
            x: this.state.leftSliderValue
              ? this.state.leftSliderValue
              : modelBoundingValues.max.x,
            y: this.state.backSliderValue
              ? this.state.backSliderValue
              : modelBoundingValues.max.y,
            z: this.state.topSliderValue
              ? this.state.topSliderValue
              : modelBoundingValues.max.z,
          },
          min: {
            x: this.state.rightSliderValue
              ? this.state.rightSliderValue
              : modelBoundingValues.min.x,
            y: this.state.frontSliderValue
              ? this.state.frontSliderValue
              : modelBoundingValues.min.y,
            z: this.state.bottomSliderValue
              ? this.state.bottomSliderValue
              : modelBoundingValues.min.z,
          },
        };
        return planeValue;
      },
      /* Cutting plane object format.
          object contain min and max object with 
          min contain x,y,z values for frontSliderValuev, rightSliderValue, bottomSliderValue  resp.
          max contain x,y,z values for backSliderValue, leftSliderValue, topSliderValue  resp.
        let planeObj= {
          "max": {
              "x": 60665.3359375,
              "y": 48933.6171875,
              "z": 14610
          },
          "min": {
              "x": -72522.125,
              "y": -72522.125,
              "z": -72522.125
          }
      } */
      setCuttingPlanes: (cuttingPlane) => {
        if (!cuttingPlane) return;
        let plane = {
          max: {
            x: cuttingPlane.max.x
              ? cuttingPlane.max.x
              : this.modelBounding.max.x,
            y: cuttingPlane.max.y
              ? cuttingPlane.max.y
              : this.modelBounding.max.y,
            z: cuttingPlane.max.z
              ? cuttingPlane.max.z
              : this.modelBounding.max.z,
          },
          min: {
            x: cuttingPlane.min.x
              ? cuttingPlane.min.x
              : this.modelBounding.min.x,
            y: cuttingPlane.min.y
              ? cuttingPlane.min.y
              : this.modelBounding.min.y,
            z: cuttingPlane.min.z
              ? cuttingPlane.min.z
              : this.modelBounding.min.z,
          },
        };
        this.planeValuesStored = plane;
        this.setState({
          isSetCuttingPlaneActive: true,
        });
      },

      getCamera: () => {
        let currentcamera = this._viewer.view.getCamera();
        let jsoncamera = currentcamera.toJson();
        this.setState({ currentJsonCamara: jsoncamera });
        return jsoncamera;
      },
      /*   Camera object format
            you get this format of camera from getCamera() method.
          let jsoncamera=  {
        "position": {
            "x": -71503.14101725465,
            "y": -77040.72626505737,
            "z": 75165.62786425062
        },
        "target": {
            "x": 770.4948303222656,
            "y": -4767.090417480468,
            "z": 2891.9920166737224
        },
        "up": {
            "x": 0.4082482904638631,
            "y": 0.4082482904638631,
            "z": 0.8164965809277261
        },
        "width": 181899.5258131281,
        "height": 181899.5258131281,
        "projection": 1,
        "nearLimit": 0.001,
        "className": "Communicator.Camera"
        }*/
      setCamera: (jsoncamera) => {
        if (jsoncamera === null) {
          return;
        }
        let newcamera = Communicator.Camera.fromJson(jsoncamera);
        this._viewer.view.setCamera(newcamera);
      },
      getView: () => {
        let viewObject = {
          camera: null,
          cuttingPlnaes: null,
          drawMode: null,
          selection: null,
        };
        viewObject.camera = this.commands.getCamera();
        viewObject.cuttingPlnaes = this.commands.getCuttingPlanes();
        viewObject.drawMode = this._viewer.view.getDrawMode();
        viewObject.selection = this.getSelection();
        return viewObject;
      },
      setView: async (obj) => {
        /*sample object for input contain camera,cuttingplane object,draw mode value and selection array.
              let letobjData={
                camera:{
                "position": {
                    "x": -71503.14101725465,
                    "y": -77040.72626505737,
                    "z": 75165.62786425062
                },
                "target": {
                    "x": 770.4948303222656,
                    "y": -4767.090417480468,
                    "z": 2891.9920166737224
                },
                "up": {
                    "x": 0.4082482904638631,
                    "y": 0.4082482904638631,
                    "z": 0.8164965809277261
                },
                "width": 181899.5258131281,
                "height": 181899.5258131281,
                "projection": 1,
                "nearLimit": 0.001,
                "className": "Communicator.Camera"
            },
              "cuttingPlnaes": {
                  "max": {
                      "x": 60665.3359375,
                      "y": 48933.6171875,
                      "z": 14610
                  },
                  "min": {
                      "x": -72522.125,
                      "y": -72522.125,
                      "z": -72522.125
                  }
              },
              "drawMode": 1,
              "selection":[
                9192
            ]
          
          }*/
        if (obj === null) {
          return;
        }
        if (obj.camera) this.commands.setCamera(obj.camera);
        if (obj.cuttingPlnaes)
          this.commands.setCuttingPlanes(obj.cuttingPlnaes);
        if (obj.drawMode) this._viewer.view.setDrawMode(obj.drawMode);
        if (obj.selection) {
          if (_.size(this.props.idMapping) > 0 && this._viewer)
            await this.applySelection(
              [],
              obj.selection,
              this._viewer,
              this.props.idMapping[1]
            );
          if (this.props.idMapping2d && this._viewer2d)
            await this.applySelection(
              [],
              obj.selection,
              this._viewer2d,
              this.props.idMapping2d[
                this.state.sheetNames[this.state.sheetIdx]
              ][1]
            );
        }
      },
    };

    // Instantiate IafDatabaseManager with the markupApiClient and an auto-persist interval of 5 minutes
    this.iafDatabaseManager = new IafDatabaseManager(60000, this); // Auto-persist every 1 minute
    if(props.enablePersistence){
      this.iafDatabaseManager.enable();
    }

    // Initialize WebSocket tracking and monitoring
    if (IafUtils.debugIaf) {
      IafWebSocketTracker.initialize(this, {
        enableDebug: true,
        monitoringInterval: 30000,
        enableGlobalDebugTools: true
      });
    }

    this.iafFileManager = new IafFileManager();

    /** @type {IafMapBoxGl} */
    this.iafMapBoxGl = null;
    /** @type {IafGltfManager} */
    this.iafGltfManager = null;
    /** @type {IafTuner} */
    this.iafTuner = null;
    /** @type {IafCuttingPlanesUtils} */
    this.iafCuttingPlanesUtils = null;

    this._unmounted = false;
    this._setNodesVisibilityFlushTimeoutId = undefined;
    this._createViewerDelayTimeoutId = undefined;
    this._handle3DViewerLoadDelayTimeoutId = undefined;
  }
  // This can be retrived from DB.
  getDefaultTags = () => {
    return [
      {
      id: "default",
      name: "Default View",
      group: "custom",
      isSelected: true,
      isDeleted: false
    },{
      id: "miscellaneous",
      name: "Miscellaneous",
      group: "system",
      isSelected: false,
      isDeleted: false
    },
    ]
  }
  
  updateResourcePermissions = () => {
    try {
      permissionManager.enforcePermission = this.state.enforcePermission;
      const resourcePermissions = permissionManager.getResourcePermissions();
      this.setState({ resourcePermissions: {...resourcePermissions} });
      IafUtils.devToolsIaf && console.log('Resource permissions updated:', resourcePermissions);
    } catch (error) {
      console.error('Error updating resource permissions:', error);
    }
  };

  async initalizeModelComposer(){
    try {
        let cachedCategories= []
        let modelComposition = {...this.state.modelComposition};
        // Read discipline switches only from localstorage if persistence is disabled OR skipPersistedDisciplineSelection is true.
        if (!this.iafDatabaseManager._enablePersistence
          || !permissionManager.hasReadAccess("modelComposition")
        ) {
            const localData = await IafStorageUtils.getDataFromLocalStorage(IafUtils.getModelCompositionKey()) || {};
             modelComposition = {
              ...modelComposition,
              _properties: {
                ...localData?._properties,
                quality: localData?._properties?.quality ?? modelComposition._properties.quality
              }
            };
            cachedCategories = localData?._properties?.categories || [];
        }
        else {
            let dbResult = {}
            try {
              const modelComposerArrayFromDb = await this.iafDatabaseManager.queueRead({
                apiClient: IafApiClientModelComposition,
                readByType: true,
                immediateProcess: true
              });
              dbResult = modelComposerArrayFromDb[0] || {};
            } catch(err) {
              console.warn("Error while reading model composition from DB:", err);
            }
            
            // Respect skipPersistedDisciplineSelection for `layers`
            if (this.state.skipPersistedDisciplineSelection) {
                const local = await IafStorageUtils.getDataFromLocalStorage(IafUtils.getModelCompositionKey()) || {};
                const dbCategories = dbResult?._properties?.categories || [];
                cachedCategories = local?._properties?.categories || [];

                const cachedSelectionMap = Object.fromEntries(
                  cachedCategories.map((cat) => [cat.id, cat.isSelected])
                );

                const mergedCategories = dbCategories.map((cat) => ({
                  ...cat,
                  isSelected: cachedSelectionMap.hasOwnProperty(cat.id)
                    ? cachedSelectionMap[cat.id]
                    : this.getDefaultTags().some(x => x.id === cat.id && x.isSelected && x.id === 'default')
                }));
                modelComposition = {
                    ...dbResult,
                    _properties:{
                        ...dbResult?._properties,
                        layers: local?._properties?.layers || {},
                        categories: mergedCategories,
                        quality: local?._properties?.quality ?? modelComposition._properties.quality
                    }
                };
            } else {
               modelComposition = {
                ...dbResult,
                _properties: {
                  ...dbResult?._properties,
                  quality: dbResult?._properties?.quality ?? modelComposition._properties.quality
                }
              };
            }
        }

        // Dynamic Layer Composition
        const storedLayers = modelComposition?._properties?.layers || {};
        // Ensure _properties and layers exist
        modelComposition._properties = modelComposition._properties || {};
        modelComposition._properties.layers = modelComposition._properties.layers || {};
        modelComposition._properties.categories = modelComposition._properties.categories || [];
        modelComposition._properties.linkedModelItems = modelComposition?._properties?.linkedModelItems || {};

        // Following are neither persisted nor cached
        modelComposition._transient = { 
          composeType: GraphicsDbLoadConfig.ConfigType.AutoCompose 
        };
        
        Object.keys(GraphicsDbGeomViews.LayerType).forEach((key) => {
          if (this?.props?.graphicsResources?.isLayerlessModel?.()) {
            modelComposition._properties.layers[key] = { load: false, visible: false };
          } else if (storedLayers.hasOwnProperty(key)) {
            modelComposition._properties.layers[key] = getLayerState(storedLayers[key]);
          } else if (this?.props?.graphicsResources?.views?.length <= 1) {
            // PLG-1109: Enable All Disciplines for Non-optimized Projects as a Default Setting
            modelComposition._properties.layers[key] = { load: true, visible: true };
          } else {
            modelComposition._properties.layers[key] = isPrivilegedLayerType(key, this.props);
          }
        });
        
        if (this?.props?.graphicsResources?.isLayerlessModel?.()) {
          const defaultTags = [...this.getDefaultTags()]
          const categories = modelComposition._properties.categories || [];
          defaultTags.forEach(tag => {
            const existing = categories.find(cat => cat.id === tag.id);
            existing ? (existing.group = tag.group) : categories.push(tag);
          });
          modelComposition._properties.categories = categories;
          
          const systemTagIds = defaultTags.filter(tag => tag.id === 'miscellaneous').map(tag => tag.id);
          const defaultTagsIds = defaultTags.filter(tag => tag.id === 'default').map(tag => tag.id);
          
          for (let i = 0; i < this.props.graphicsResources.views.length; i++) {
            const viewId = this.props.graphicsResources.views[i]?._id;
            const gfxResObject = this.props.graphicsResources.csdlMapByViewId.get(viewId);
            if (!viewId || !gfxResObject) continue;
            const tags = i === 0 ? defaultTagsIds : systemTagIds;
            if (!gfxResObject.categories?.length || !cachedCategories?.length) {
              gfxResObject.categories = tags;
            }
            const item = modelComposition._properties.linkedModelItems[viewId] || {};
            if (!item.categories?.length || !cachedCategories?.length) {
              item.categories = tags;
            }
            modelComposition._properties.linkedModelItems[viewId] = item;
          }
        }
        
        await new Promise((resolve) => {
          this.setState({ modelComposition }, resolve);
        });
        NotificationStore.notifyModelComposerDataLoadSuccess(this.viewer);
    } catch (error) {
        console.error("Error while loading model data:", error);
        NotificationStore.notifyModelComposerDataLoadFail(this.viewer);
    }
  }

  saveModelCompositionProperties(modelComposition, skipPersistence = false) {
    return new Promise((resolve, reject) => {
      try {
        const { _enablePersistence } = this.iafDatabaseManager;

        // First update the viewer state
        this.setState({ modelComposition: { ...modelComposition } }, () => {
          const updatedProps = modelComposition._properties || {};

          // Save to local storage if skipping persistence or persistence is disabled
          if (skipPersistence || !_enablePersistence) {
            const dataToStore = (skipPersistence && _enablePersistence )
              ? { 
                layers: updatedProps.layers, 
                categories: updatedProps.categories,
                quality: updatedProps.quality
              } : updatedProps;

            IafStorageUtils.saveToLocalStorage(
              IafUtils.getModelCompositionKey(),
              dataToStore
            );
          }

          // Save to persistent store if enabled
          if (_enablePersistence
            && permissionManager.hasWriteAccess("modelComposition")
          ) {
            this.createOrUpdateModelCompositionData(modelComposition)
              .then(resolve)
              .catch(reject);
          } else {
            resolve(); // Resolve immediately if no async action is required
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // HSK PLAT-4269: The Full Screen / Half Screen 2D Mode does not resize on window resize
  handleResize() {
    // Update the state with the new window width when a resize occurs
    this.setState({
      windowWidth: window.innerWidth,
    });
  }

  handleDevToolsPanel(flag){
    this.setState({enableDevTools:flag})
  }
  handleShowSandbox(showSandbox){
    this.setState({showSandbox})
  }
  handleShowPDF(showPDF){
    this.setState({showPDF})
  }
  handleShowModelViewer(showModelViewer){
    this.setState({showModelViewer})
  }
  // This function is used to enable measurment in 2d viewer
  enable2dMeasurment(){
    this._viewer2d.operatorManager.set(
      Communicator.OperatorId.MeasurePointPointDistance,
      1
    );
  }
  // This function is used to enable select functionality in 2d viewer
  enable2dSelect(){
    this._viewer2d.operatorManager.set(this.selectOperator2dId, 1);
  }

  //This functions is used to change size of toolbar
  handleToolbarSize(val){
    this.setState({
      toolbarSize: val,
    });
  }

  buildMarkupManager = () => {
    if (this._viewer && !this.markupManager) {
      this.markupManager = new IafMarkupManager(this._viewer, this);
    }
    if (this._viewer && !this.markupManager.initialized) {
      this.markupManager.init();
      
      // 20-Jun-24   ATK        PLAT-3422   Moved Unit Tests to Dev Tools
      // IafUtils.devToolsIaf && this.markupManager.unittest();
    }

    return this.markupManager;
  }

  buildAnimationManager = () => {
    if (this._viewer && !this.animationManager) {
      this.animationManager = new IafAnimationManager(this._viewer, this);
    }
    if (this._viewer && !this.animationManager.initialized) {
      this.animationManager.init();
      // setTimeout (()=>this.animationManager.unittest(), 3000);
    }
    return this.animationManager;
  }  

  buildMarkupManager2d = () => {
    if (this._viewer2d && !this.markupManager2d) {
      this.markupManager2d = new IafMarkupManager2d(this._viewer2d, this);
    }
    if (this._viewer2d && !this.markupManager2d.initialized) {
      this.markupManager2d.init();
      
      // 20-Jun-24   ATK        PLAT-3422   Moved Unit Tests to Dev Tools
      // IafUtils.devToolsIaf && this.markupManager2d.unittest();
    }
    return this.markupManager2d;
  }

  //ATK        PLAT-4628   Animation Foundation
  buildAnimationManager2d = () => {
    if (this._viewer2d && !this.animationManager2d) {
      this.animationManager2d = new IafAnimationManager2d(this._viewer2d, this);
    }
    if (this._viewer2d && !this.animationManager2d.initialized) {
      this.animationManager2d.init();
      // setTimeout (()=>this.animationManager2d.unittest(), 3000);
      this.animationManager2d?.updateWorkflows(this.props.workflow);
    }
    return this.animationManager2d;
  }  

  // HandleForceShowModal
  handleForceShowModal(val) {
    this.setState({
      forceShowModal: val,
    });
  }
  renameCameraObjectKeys(obj) {
    /* ATK:
        Local storage may have invalid keys for camera object properties 
        Correct if that's the case
        To Do: Document why local storage ends up in this situation and any work to be done
    */
    let object = {
      position: {
        x: obj._position.x,
        y: obj._position.y,
        z: obj._position.z,
      },
      target: {
        x: obj._target.x,
        y: obj._target.y,
        z: obj._target.z,
      },
      up: {
        x: obj._up.x,
        y: obj._up.y,
        z: obj._up.z,
      },
      width: obj._width,
      height: obj._height,
        /* Raja.r:
          Corrected a typo: changed from 'obj.projection' to 'obj._projection'.
          Fixing this typo is important as it addresses an issue causing slowness of zoom operation.
        */
      projection: obj._projection,
      nearLimit: obj._nearLimit,
      className: "Communicator.Camera",
    };
    return object;
  }

  isCameraPositionEqual(cam1, cam2) { return cam1.x === cam2.x && cam1.y === cam2.y && cam1.z === cam2.z }

  //updated per DBM-926
  async resetAll() {
    // Made Camera change for DBM-1497 (Zoom becomes slower after reset model)
    if (this._viewer) {
      if (
        this.props.settings &&
        (!this.props.settings.initialCameraPosition ||
          _.isEmpty(this.props.settings.initialCameraPosition))
      ) {
        var camera = this._viewer.view.getCamera();
        var target = this._viewer.view._initialCamera.getTarget();
        var position = this._viewer.view._initialCamera.getPosition();
        var height = this._viewer.view._initialCamera.getHeight();
        var width = this._viewer.view._initialCamera.getWidth();
        var up = this._viewer.view._initialCamera.getUp();
        camera.setTarget(target);
        camera.setPosition(position);
        camera.setHeight(height);
        camera.setWidth(width);
        camera.setUp(up);
        this._viewer.view.setCamera(camera, this.cameraDuration);
      } else {
        const orignal = this._viewer.view.getCamera().copy()
        // set saved intial camera position
        let settings = await this.getSettings();
        let camObject; // As per new implementation of project specific camera saving we need to check how we are getting camera obj

        if (settings.initialCameraPosition?.[this.props.modelVersionId]) {
          camObject = settings.initialCameraPosition[this.props.modelVersionId];
        } else {
          camObject = settings.initialCameraPosition;
        }
        // remove the  underscore from key in object
        if (camObject._position)
          camObject = this.renameCameraObjectKeys(settings.initialCameraPosition);
        let camera = window.Communicator.Camera.fromJson(camObject);

        // 08-02-24 RRP PLAT-3258 Intuitive default orientation on enabling the walk mode
        const isCameraSettingsSaved = !_.isEmpty(this.state.initialCameraPosition);
        if(isCameraSettingsSaved || !this.newToolbarElement.current.state.isWalkMode){
          const isCameraPositionEl = this.isCameraPositionEqual(orignal._position, camera._position)
          this._viewer.view.setCamera(camera, !isCameraPositionEl ? this.cameraDuration: null);
        }
        // END RRP PLAT-3258
        
        //demo showing save view 
        this.savedViewsManager.saveView(camera);
      }
      this.markupManager && this.markupManager.setMode(IafMarkupManager.InteractionMode.Select);
      this.markupManager2d && this.markupManager2d.setMode(IafMarkupManager.InteractionMode.Select);
      if (
        this._viewer.operatorManager._operatorStack[0] === this.walkOperatorId
      )
        this.keyboardWalkOperator._calculateInitialPosition();
      // PLG-1320 Distance Measurement Gets Cleared on Reset Button Click
      // this._viewer && this._viewer.measureManager.removeAllMeasurements();
      // this._viewer2d && this._viewer2d.measureManager.removeAllMeasurements(); // used to remove measurment from 2d viewer 
      // reset cutting plane
      this.setState({
        isSetCuttingPlaneActive: false,
      });
      await this.props.graphicsResources.offsetGraphicsResourceElevation(0);
    }
    if (this._viewer2d) {
      await this._viewer2d.view.fitWorld();
      // PLG-1320 Distance Measurement Gets Cleared on Reset Button Click
      // this._viewer2d && this._viewer2d.measureManager.removeAllMeasurements(); // used to remove measurment from 2d viewer 
    }
      this.props.OnResetCallback ? this.props.OnResetCallback() : "";
  }
  /**
   * converts hex string color to rgb color
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result !== null) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return new window.Communicator.Color(r, g, b);
    }
    return window.Communicator.Color.black();
  }

  handleFocusMode(isFocusModeActivated){
      this.setState({zoomOnSelection:isFocusModeActivated},()=>{
        //console.log("FocusMode : "+this.state.zoomOnSelection);
      })
      
  }

  /**
   * @function getModelBoundingBox()
   * This function return model bounding box
   * @returns {ModelBoundingBox} returns Communicator.Box of current model
   */
  getModelBoundingBox() {
    // if(!this.state.isSetCuttingPlaneActive)
    return this.modelBounding;
    // return this.planeValuesStored;
  }
  getplaneValues() {
    return this.planeValuesStored;
  }

  /**
   * @function setNodesColors()
   * This function sets color to nodes.
   * @param {Array} nodeIds Array of nodeids
   * @param {hexColor} hexColor any color in hex form
   */

  async setNodesColors(nodeIds, hexColor) {
    const colorMap = new Map();
    if (_.size(nodeIds) > 0) {
      const color = this.hexToRgb(hexColor);
      for (let id in nodeIds) {
        colorMap.set(id, color);
      }
      await this._viewer.model.setNodesColors(colorMap);
    }
  }

  /**
   * @function getAllChildren
   * This function recursively get child nodes of given node.
   * @param {Number} nodeId any nodeId
   */
  getAllChildren(nodeId, viewer = this._viewer, result=[], skipNodeIds = new Set()) {
    if (viewer) {
      let children = viewer.model.getNodeChildren(nodeId);
      if (_.size(children) > 0) {
        this.allChildren.push(...children); // RRP:- legacy/shared  need to remove as part of performance.
        if(this.props.enableOptimizedSelection){
          for (let id of children) {
              if (skipNodeIds?.has(id)) {
                continue;
              }
              result.push(id);   
              this.getAllChildren(id, viewer, result, skipNodeIds);
            // this.getAllChildren(children[id]); // ATK : Should it be this ?
          }
        }else{
          for (let id in children) {
            result.push(id);          
            this.getAllChildren(id, viewer, result);
            // this.getAllChildren(children[id]); // ATK : Should it be this ?
          }
        }
      }
    }
    return result;
  }

  /**
   * @function setXrayModeSettings
   * This function applies XRay settnig to model
   * XRay setting includes setXRayOpacity to Lines and faces, setXRayTransparencyMode, setDrawMode to XRay and setLineVisibility as false
   * @param {object} viewer viewer object
   */
  async setXrayModeSettings(viewer) {
    if (viewer === this._viewer) {
      // viewer.view.setXRayOpacity(0.05, Communicator.ElementType.Lines);
      await viewer.view.setXRayOpacity(this.state.glassOpacity, Communicator.ElementType.Faces);
      await viewer.view.setXRayTransparencyMode(
        Communicator.XRayTransparencyMode.Unsorted
      );
      await viewer.view.setDrawMode(Communicator.DrawMode.XRay);
      await viewer.view.setLineVisibility(false);
    }
  }

  /**
   * @function This function returns current applied settings
   * @returns setting
   */
  async getSettings() {
    if (!this._viewer) {
      return null;
    }
    let viewer = this._viewer;
    let minimumFrameRate = await viewer.getMinimumFramerate();
    let streamCutoffScaleValue = viewer.getStreamCutoffScale();
    let cameraPosition;
    // if we are not chnageing the camera position
    if (_.isEmpty(this.state.initialCameraPosition)) {
      var camera = this._viewer.view.getCamera();
      var target = this._viewer.view._initialCamera.getTarget();
      var position = this._viewer.view._initialCamera.getPosition();
      var height = this._viewer.view._initialCamera.getHeight();
      var width = this._viewer.view._initialCamera.getWidth();
      var up = this._viewer.view._initialCamera.getUp();
      camera.setTarget(target);
      camera.setPosition(position);
      camera.setHeight(height);
      camera.setWidth(width);
      camera.setUp(up);

      cameraPosition = camera;
    } else {
      cameraPosition = this.state.initialCameraPosition;
    }
    let settings = {
      isTriad: viewer.view.getAxisTriad().getEnabled(),
      isNavCube: viewer.view.getNavCube().getEnabled(),
      isHighlightLineSelection:
        viewer.selectionManager.getHighlightLineElementSelection(),
      isBackface: viewer.view.getBackfacesVisible(),
      isAmbientOcclusion: viewer.view.getAmbientOcclusionEnabled(),
      isSynchronisationActive : this.state.isSynchronisationActive,
      isGisDistanceScale : this.state.isGisDistanceScale,
      isModelCacheEnabled : this.state.isModelCacheEnabled,
      isVerticalGeoAlignmentEnabled: this.state.isVerticalGeoAlignmentEnabled,
      isUtilitiesActive: this.state.isUtilitiesActive,
      glassOpacity: this.state.glassOpacity,
      ambientOcclusionRadius: viewer.view.getAmbientOcclusionRadius(),
      isBloom: viewer.view.getBloomEnabled(),
      bloomIntensityScale: viewer.view.getBloomIntensityScale(),
      bloomThreshold: viewer.view.getBloomThreshold(),

      isSilhouette: viewer.view.getSilhouetteEnabled(),
      isReflection: viewer.view.getSimpleReflectionEnabled(),

      isShadow: viewer.view.getSimpleShadowEnabled(),
      isShadowInteractive:
        viewer.view.getSimpleShadowInteractiveUpdateEnabled(),
      shadowBlurSamples: viewer.view.getSimpleShadowBlurSamples(),

      projectionMode: viewer.view.getProjectionMode(),
      frameRate: minimumFrameRate > 0 ? minimumFrameRate : 13,
      hiddenLineOpacity: viewer.view
        .getHiddenLineSettings()
        .getObscuredLineOpacity(),

      //walk
      walkMode: this.walkOperator ? this.walkOperator.getWalkMode() : 0,
      isBimWalk: this.walkOperator ? this.walkOperator.getBimModeEnabled() : 0,
      isCollisionDetection: this.walkOperator
        ? this.walkOperator.getCollisionEnabled()
        : 0,

      topBgColor: viewer.view.getBackgroundColor().top,
      bottomBgColor: viewer.view.getBackgroundColor().bottom,
      bdSelectColor: viewer.selectionManager.getNodeSelectionColor(),
      lineSelectColor: viewer.selectionManager.getNodeElementSelectionOutlineColor(),
      faceSelectColor: viewer.selectionManager.getNodeElementSelectionColor(),
      measureColor: viewer.measureManager.getMeasurementColor(),

      streamCutoffScale: streamCutoffScaleValue,
      //don't save the camera
      //camera: viewer.view.getCamera().toJson(),
      multiplier: this.state.multiplier,
      prevSelectdUnits: this.state.prevSelectdUnits,
      isGlassIsolate: this.state.isGlassIsolate,
      initialCameraPosition: cameraPosition,
      projectId : this.projectId,
      modelVersionId: this.props.modelVersionId,
      defaultFederationType: this.state.settings?.defaultFederationType
    };

    if (this.props.settings) {
      settings.isSaveCamera = this.props.settings.isSaveCamera;
      settings.isSingleChannelMode = this.props.settings.isSingleChannelMode;
      settings.defaultFederationType = this.props.settings.defaultFederationType;
    }

    return settings;
  }

  /**
   * @function This function sets settings
   */
  async loadSettings(settings,saveSettings, changeView = false) { // Added new key to check we wanted to change the camera position or not on Saving
    let ps = [];
    const viewer = this._viewer;
    const viewer2D = this._viewer2d; //destructured 2d viewer
    let zoomOp = this.zoomOperator;

    if (settings.hasOwnProperty("mouseWheelZoomDelta")) {
      zoomOp.setMouseWheelZoomDelta(settings.mouseWheelZoomDelta);
    }
    if (settings.hasOwnProperty("dollyZoomEnabled")) {
      zoomOp.setDollyZoomEnabled(settings.dollyZoomEnabled);
    }

    if (settings.hasOwnProperty("isBackface")) {
      ps.push(viewer.view.setBackfacesVisible(settings.isBackface));
    }
    //no cutting plane features yet
    //ps.push(viewer.cuttingManager.setCappingGeometryVisibility(showCappingGeometry));
    if(settings.hasOwnProperty("isTriad")){
      if (settings.isTriad) {
        ps.push(viewer.view.getAxisTriad().enable());
      } else {
        ps.push(viewer.view.getAxisTriad().disable());
      }
    }

    if(settings.hasOwnProperty("isNavCube")){
      if (settings.isNavCube) {
        ps.push(viewer.view.getNavCube().enable());
        ps.push(
          viewer.view
            .getNavCube()
            .setAnchor(window.Communicator.OverlayAnchor.LowerRightCorner)
        );
      } else {
        ps.push(viewer.view.getNavCube().disable());
      }
    }

    if (settings.hasOwnProperty("isHighlightLineSelection")) {
      ps.push(
        viewer.selectionManager.setHighlightFaceElementSelection(
          settings.isHighlightLineSelection
        )
      );
      ps.push(
        viewer.selectionManager.setHighlightLineElementSelection(
          settings.isHighlightLineSelection
        )
      );
    }
    if (settings.hasOwnProperty("hiddenLineOpacity")) {
      let hiddenLineOpacity = parseFloat(settings.hiddenLineOpacity);
      viewer.view
        .getHiddenLineSettings()
        .setObscuredLineOpacity(hiddenLineOpacity);
      if (viewer.view.getDrawMode() === Communicator.DrawMode.HiddenLine) {
        ps.push(viewer.view.setDrawMode(Communicator.DrawMode.HiddenLine));
      }
    }

    if (settings.hasOwnProperty("frameRate")) {
      let minFrameRate = parseInt(settings.frameRate, 10);
      if (minFrameRate > 0) {
        ps.push(viewer.setMinimumFramerate(minFrameRate));
      }
    }

    if (settings.hasOwnProperty("projectionMode")) {
      let p = parseInt(settings.projectionMode, 10);
      // viewer.view.setProjectionMode(p);
      setIafCameraProjection(this._viewer, p);
    }

    // set ambient occlusion mode and radius
    if (settings.hasOwnProperty("isAmbientOcclusion")) {
      ps.push(
        viewer.view.setAmbientOcclusionEnabled(settings.isAmbientOcclusion)
      );
      ps.push(
        viewer.view.setAmbientOcclusionRadius(
          parseFloat(settings.ambientOcclusionRadius)
        )
      );
    }
    // set ambient occlusion mode and radius
    if (settings.hasOwnProperty("isSynchronisationActive")) {
      this.setState({isSynchronisationActive : settings.isSynchronisationActive})
    }

    if (settings.hasOwnProperty("isGisDistanceScale")) {
      this.setState({isGisDistanceScale : settings.isGisDistanceScale})
    }

    if (settings.hasOwnProperty("isModelCacheEnabled")) {
      this.setState({isModelCacheEnabled : settings.isModelCacheEnabled})
    }

    if (settings.hasOwnProperty("isVerticalGeoAlignmentEnabled")) {
      this.setState({isVerticalGeoAlignmentEnabled : settings.isVerticalGeoAlignmentEnabled})
    }

    if (settings.hasOwnProperty("glassOpacity")) {
      this.setState({glassOpacity : settings.glassOpacity})
    } 
    // set show  utilities in right navigation menu.
    if (settings.hasOwnProperty("isUtilitiesActive")) {
      this.setState({isUtilitiesActive : settings.isUtilitiesActive})
    }
    
    //bloom
    if (settings.hasOwnProperty("isBloom")) {
      viewer.view.setBloomEnabled(settings.isBloom);
    }
    if (settings.hasOwnProperty("bloomIntensityScale")) {
      viewer.view.setBloomIntensityScale(
        parseFloat(settings.bloomIntensityScale)
      );
    }
    if (settings.hasOwnProperty("bloomThreshold")) {
      viewer.view.setBloomThreshold(parseFloat(settings.bloomThreshold));
    }
    //
    if (settings.hasOwnProperty("isSilhouette")) {
      ps.push(viewer.view.setSilhouetteEnabled(settings.isSilhouette));
    }
    if (settings.hasOwnProperty("isReflection")) {
      ps.push(viewer.view.setSimpleReflectionEnabled(settings.isReflection));
    }
    //shadow
    if (settings.hasOwnProperty("isShadow")) {
      viewer.view.setSimpleShadowEnabled(settings.isShadow);
    }
    if (settings.hasOwnProperty("isShadowInteractive")) {
      viewer.view.setSimpleShadowInteractiveUpdateEnabled(
        settings.isShadowInteractive
      );
    }
    if (settings.hasOwnProperty("shadowBlurSamples")) {
      viewer.view.setSimpleShadowBlurSamples(
        parseFloat(settings.shadowBlurSamples)
      );
    }

    // Walk
    if (settings.hasOwnProperty("walkMode")) {
      if (this.walkOperator) {
        let w = parseInt(settings.walkMode, 10);
        this.walkOperator._active = true;
        this.walkOperator.setWalkMode(
          w ? Communicator.WalkMode.Keyboard : Communicator.WalkMode.Mouse
        );
      }
    }
    if (settings.hasOwnProperty("isBimWalk")) {
      if (this.walkOperator) {
        this.walkOperator.setBimModeEnabled(settings.isBimWalk);
      }
    }
    if (settings.hasOwnProperty("isCollisionDetection")) {
      if (this.walkOperator) {
        this.walkOperator.setCollisionEnabled(settings.isCollisionDetection);
      }
    }

    //color
    if (
      settings.hasOwnProperty("topBgColor") &&
      settings.hasOwnProperty("bottomBgColor")
    ) {
      if (settings.topBgColor && settings.bottomBgColor) {
        ps.push(
          viewer.view.setBackgroundColor(
            new window.Communicator.Color(
              settings.topBgColor.r,
              settings.topBgColor.g,
              settings.topBgColor.b
            ),
            new window.Communicator.Color(
              settings.bottomBgColor.r,
              settings.bottomBgColor.g,
              settings.bottomBgColor.b
            )
          )
        );
      }
    } else if (settings.hasOwnProperty("topBgColor")) {
      if (settings.topBgColor && settings.bottomBgColor) {
        ps.push(
          viewer.view.setBackgroundColor(
            new window.Communicator.Color(
              settings.topBgColor.r,
              settings.topBgColor.g,
              settings.topBgColor.b
            ),
            new window.Communicator.Color(
              settings.topBgColor.r,
              settings.topBgColor.g,
              settings.topBgColor.b
            )
          )
        );
      }
    }
    //set selection color
    if (settings.hasOwnProperty("bdSelectColor")) {
      ps.push(
        // viewer.selectionManager.setNodeSelectionColor(settings.bdSelectColor)
        this.setNodeSelectionColor(viewer, settings.bdSelectColor)
      );
      ps.push(
        // viewer.selectionManager.setNodeSelectionOutlineColor(
        //   settings.bdSelectColor
        // )
        this.setNodeSelectionOutlineColor(viewer, settings.bdSelectColor)
      );
    }
    // set face selection color
    if (settings.hasOwnProperty("faceSelectColor")) {
      ps.push(
        // viewer.selectionManager.setNodeElementSelectionColor(
        //   settings.faceSelectColor
        // )
        this.setNodeElementSelectionColor(viewer, settings.faceSelectColor)
      );
    }

    // set line selection color
    if (settings.hasOwnProperty("lineSelectColor")) {
      ps.push(
        // viewer.selectionManager.setNodeElementSelectionOutlineColor(
        //   settings.lineSelectColor
        // )
        this.setNodeElementSelectionOutlineColor(viewer, settings.lineSelectColor)
      );
    }
    
    //set measurement color
    if (settings.hasOwnProperty("measureColor")) {
      viewer && viewer.measureManager.setMeasurementColor(settings.measureColor);
      viewer2D && viewer2D.measureManager.setMeasurementColor(settings.measureColor); // set measurment color for 2d viewer 
    }

    //don't save camera yet
    if (settings.hasOwnProperty("initialCameraPosition")) {
      if (settings.initialCameraPosition.hasOwnProperty(this.props.modelVersionId)) {
        // let projID = this.projectId;
        let camObject = settings.initialCameraPosition?.[this.props.modelVersionId]
        if (camObject._position) camObject = this.renameCameraObjectKeys(settings.initialCameraPosition?.[this.props.modelVersionId]);
        // set new camera position
        let newCamera = window.Communicator.Camera.fromJson(
          camObject
        );
        changeView && viewer.view.setCamera(newCamera); // We dont need to reset the camera position to initial one.
        this.setState({ initialCameraPosition: settings.initialCameraPosition });
      }
    }
    //state flags: isGlassIsolate
    if (settings.hasOwnProperty("isGlassIsolate")) {
      this.setState({ isGlassIsolate: settings.isGlassIsolate });
    }

    if (settings.hasOwnProperty("streamCutoffScale")) {
      var streamCutoffScale = parseFloat(settings.streamCutoffScale);
      viewer.setStreamCutoffScale(streamCutoffScale);
    }
    if(settings.hasOwnProperty("multiplier")){
      this.setState({ multiplier: settings.multiplier });
      this.handleUnitConversion(this._viewer,settings.multiplier); // change measurment unit for 3d viewer
      this.handleUnitConversion(this._viewer2d,settings.multiplier); // change measurment unit for 2d viewer
    }
    if (settings.hasOwnProperty('prevSelectdUnits')){
      this.setState({ prevSelectdUnits: settings.prevSelectdUnits });
    }
    if (settings.hasOwnProperty('defaultFederationType')){
      this.setState({ 
        settings: {
          ...this.state.settings,
          defaultFederationType: settings.defaultFederationType
        }
      });
    }
    if(this.props.saveSettings && saveSettings){
      let settingsToSave = await this.getSettings();
      // Merge passed settings (from UI) into settingsToSave to ensure UI changes are persisted
      // Object.assign safely overwrites only properties that exist in settings, preserving all others from getSettings()
      // This ensures both computed values (from getSettings) and user changes (from UI) are saved
      Object.assign(settingsToSave, settings);
      this.props.saveSettings(settingsToSave);
    }
    if(ps.length > 0){
      this._viewer.focusInput(true);
      return window.Communicator.Util.waitForAll(ps);
    }
  }
  getSecondLevelNodes() {
    let rootid = this._viewer.model.getAbsoluteRootNode();
    //level 0: rootid is -2, level 1: children of rootid is [0],
    return this.generateRecursive(rootid, 0);
  }

  async setNodesVisibilityDelayed (viewer, nodeIds, visibility, initiallyHiddenStayHidden) {
    if (!viewer) return;
    // Helper: merge nodeIds into a set to avoid duplicates
    const mergeNodeIds = (existing, additional) => {
      return Array.from(new Set([...(existing || []), ...(additional || [])]));
    };

    const addToQueue = () => {
      // Try to find an existing queued call for same viewer and visibility
      let found = false;
      for (let i = 0; i < this._setNodesVisibilityQueue.length; i++) {
        const entry = this._setNodesVisibilityQueue[i];
        if (
          entry.viewer === viewer &&
          entry.visibility === visibility &&
          entry.initiallyHiddenStayHidden === initiallyHiddenStayHidden
        ) {
          // Merge nodeIds, replace with the union
          entry.nodeIds = mergeNodeIds(entry.nodeIds, nodeIds);
          IafUtils.devToolsIaf && console.log('IafViewer.setNodesVisibility', 'is being queued (existing)', entry);
          found = true;
          break;
        }
      }
      if (!found) {
        // If not found, add new queue entry
        const entry = {
          viewer,
          nodeIds: [...(nodeIds || [])],
          visibility,
          initiallyHiddenStayHidden,
        };
        this._setNodesVisibilityQueue.push(entry);
        IafUtils.devToolsIaf && console.log('IafViewer.setNodesVisibility', 'is being queued (new)', entry);
      }
    }

    if (!this._setNodesVisibilityQueue) {
      this._setNodesVisibilityQueue = [];
    }

    addToQueue();

    // Set up a one-time listener to flush when model is ready (if not already set)
    if (!this._queuedSetNodesVisibilityListenerAdded) {
      this._queuedSetNodesVisibilityListenerAdded = true;

      // Use a polling approach on componentDidUpdate, or setTimeout check if needed
      const checkAndFlushQueue = async () => {
        if (this._unmounted) return;
        const isViewerReady = (!this._viewer || this.state.view3d.isLoaded) && (!this._viewer2d || this.state.view2d.isLoaded);
        const camera = this.linkedCamera;
        const canApplyVisibility = (camera?.toBeActiveViews?.length ?? 0) === 0 && (camera?.toBeInactiveViews?.length ?? 0) === 0;

        if (isViewerReady && canApplyVisibility) {
          // Flush all queued visibility changes
          this._setNodesVisibilityQueue.length && NotificationStore.notifyNodesVisibilityChange(this);
          for (const entry of this._setNodesVisibilityQueue) {
            if (entry.nodeIds && entry.nodeIds.length) {
              try {
                this._captureVisibilityStats(entry.nodeIds, entry.visibility, "queued");
                IafUtils.devToolsIaf && console.log('IafViewer.setNodesVisibility', 'is being executed (queued flush)', entry);
                await entry.viewer?.model?.setNodesVisibility(entry.nodeIds, entry.visibility, entry.initiallyHiddenStayHidden);
              } catch (e) {
                // Log error but continue
                console.warn("Queued setNodesVisibility failed:", e);
              }
            }
          }
          this._setNodesVisibilityQueue = [];
          this._queuedSetNodesVisibilityListenerAdded = false;
          this._setNodesVisibilityFlushTimeoutId = undefined;

          // Update bounding box after delayed visibility settings are complete
          if (viewer && this.props.graphicsResources && typeof this.props.graphicsResources.updateBoundingBox === 'function') {
            await this.props.graphicsResources.updateBoundingBox('IafViewer.setNodesVisibilityDelayed');
          }
        } else {
          this._setNodesVisibilityFlushTimeoutId && clearTimeout(this._setNodesVisibilityFlushTimeoutId);
          this._setNodesVisibilityFlushTimeoutId = setTimeout(checkAndFlushQueue, 250);
        }
      };
      this._setNodesVisibilityFlushTimeoutId && clearTimeout(this._setNodesVisibilityFlushTimeoutId);
      this._setNodesVisibilityFlushTimeoutId = setTimeout(checkAndFlushQueue, 250);
    }
  }

  async setNodesVisibility(viewer, nodeIds, visibility, initiallyHiddenStayHidden) {
    if (!viewer) return;
    // ATK PLG-1604: Performance - Queue setNodesVisibility to avoid flicker
    try {
      // -- Hook for batching nodes visibility changes until the viewer is loaded --

      // If viewer is not loaded, queue this call
      const is3d = _.isEqual(viewer, this._viewer);
      const is2d = _.isEqual(viewer, this._viewer2d);
      const isLoaded = (is3d && this.state.view3d.isLoaded) || (is2d && this.state.view2d.isLoaded);

      const camera = this.linkedCamera
      const canApplyVisibility = (camera?.toBeActiveViews?.length ?? 0) === 0 && (camera?.toBeInactiveViews?.length ?? 0) === 0;
      if (!isLoaded || !canApplyVisibility) return this.setNodesVisibilityDelayed(viewer, nodeIds, visibility, initiallyHiddenStayHidden);

      if (nodeIds && nodeIds.length) {
        this._captureVisibilityStats(nodeIds, visibility, "direct");
        IafUtils.devToolsIaf && console.log('IafViewer.setNodesVisibility'
          , 'is being executed (direct call)'
          , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D", JSON.stringify(nodeIds)
          , '/visibility', visibility
        );
        await viewer?.model?.setNodesVisibility(nodeIds, visibility, initiallyHiddenStayHidden);
      }
    } catch (error) {
      console.error('IafViewer.setNodesVisibility:', error);
      throw error;
    }
  }

  _captureVisibilityStats(nodeIds, visibility) {
    if (!this.testModelCompoer) return;
    if (!Array.isArray(nodeIds) || nodeIds.length === 0) return;

    if (!this._visibilityStats) {
      this._visibilityStats = {
        enabled: 0,
        disabled: 0
      };
    }

    const count = nodeIds.length;

    if (visibility) {
      this._visibilityStats.enabled += count;
    } else {
      this._visibilityStats.disabled += count;
    }
  }

  canApplyViewerVisibility() {
    const camera = this.linkedCamera;
    return (camera?.toBeActiveViews?.length ?? 0) === 0 && (camera?.toBeInactiveViews?.length ?? 0) === 0;
  }

  async setNodesOpacity(viewer, nodeIds, opacity) {
    if (nodeIds && nodeIds.length) {
      IafUtils.devToolsIaf && console.log('IafViewer.setNodesOpacity'
        , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D", JSON.stringify(nodeIds)
        , '/opacity', opacity
      );
      await viewer.model.setNodesOpacity(nodeIds, opacity);
    }
  }

  async batchSetNodesOpacity(viewer, nodeIds, opacity, batchSize = 100) {
    if (!nodeIds || !nodeIds.length) return; // Exit if no nodeIds provided
  
    IafUtils.devToolsIaf && console.log(`IafViewer.batchSetNodesOpacity: ${nodeIds.length} nodes in total`);
  
    for (let i = 0; i < nodeIds.length; i += batchSize) {
      const batch = nodeIds.slice(i, i + batchSize); // Create batches of size batchSize or less
      IafUtils.devToolsIaf && console.log('IafViewer.batchSetNodesOpacity, Processing batch:', batch); // Optional log for debugging
      await viewer.model.setNodesOpacity(batch, opacity); // Apply opacity batch by batch
    }
  }
 
  async addTranslationOffset(viewer, nodeId, { x = 0, y = 0, z = 0 } = {}) {
    IafUtils.devToolsIaf && console.log('IafViewer.addTranslationOffset'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D", nodeId
      , '/offset', {x, y, z}
    );
    // await viewer.model.resetNodeMatrixToInitial(nodeId);
    const nodeMatrix = viewer.model.getNodeMatrix(nodeId);
    // IafMathUtils.addTranslationOffset(nodeMatrix, {x, y, z});
    await viewer.model.setNodeMatrix(nodeId, nodeMatrix);
  }

  async setNodesMatrix(viewer, nodeIds, matrix) {
    if (nodeIds && nodeIds.length) {
      IafUtils.devToolsIaf && console.log('IafViewer.setNodesMatrix'
        , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D", JSON.stringify(nodeIds)
        , '/matrix', matrix
      );
      nodeIds.forEach((nodeId)=>viewer.model.setNodeMatrix(nodeId, matrix));
    }
  }


  async resetNodesOpacity(viewer, nodeIds) {
    if (nodeIds && nodeIds.length) {
      IafUtils.devToolsIaf && console.log('IafViewer.resetNodesOpacity'
        , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D", JSON.stringify(nodeIds)
      );
      await viewer.model.resetNodesOpacity(nodeIds);
    }
  }

  async addSelectionFilterNodeIds(viewer, nodeIds) {
    if (this.is3dViewer(viewer)) {
      this.selectOperator.addSelectionFilterNodeIds(nodeIds);
    }
  }

  clearSelectionFilter(viewer) {
    this.is3dViewer(viewer) && this.selectOperator.clearSelectionFilter();
  }

  enableSelectionFilter(viewer) {
    this.is3dViewer(viewer) && this.selectOperator.enableSelectionFilter();
  }

  generateRecursive(nodeId, level) {
    let type = this._viewer.model.getNodeType(nodeId);
    let nodes = [];
    if (
      type === window.Communicator.NodeType.Part ||
      type === window.Communicator.NodeType.PartInstance ||
      type === window.Communicator.NodeType.AssemblyNode ||
      type === window.Communicator.NodeType.BodyInstance
    ) {
      this._viewer.model.getNodeProperties(nodeId).then((properties) => {
        IafUtils.devToolsIaf && console.log(properties);
      });
      let children = this._viewer.model.getNodeChildren(nodeId);
      for (let i = 0; i < children.length; i++) {
        if (level === 2) {
          nodes.push(children[i]);
        } else {
          this.generateRecursive(children[i], level + 1);
        }
      }
    }
    if (level === 2) {
      return nodes;
    }
  }

  getNodeIds(pkgIdsIn, idmapping, viewer = this._viewer, recursive = true) {
    const pkgIds = [...new Set(pkgIdsIn)];
    let nodeIds = [];
    if (pkgIds && idmapping) {
      IafUtils.devToolsIaf && console.log('IafViewer.getNodeIds'
        , '/pkgIds', JSON.stringify(pkgIds)
      );
      for (let s of pkgIds) {
        if (s) {
          let nodeIdStr = idmapping[s.toString()];
          if (_.size(nodeIdStr) > 0) {
            let id = parseInt(nodeIdStr);
            nodeIds.push(id);
            //added to make sure all nodes are included
            this.allChildren = [];
            if (recursive) {
              if(this.props.enableOptimizedSelection){
                this.getAllChildren(id, viewer);
              }else{
              this.getAllChildren(id);
              }  
            }
            nodeIds.push(...this.allChildren);
          }
        }
      }
    }
    nodeIds.length == 0 && IafUtils.devToolsIaf && console.log('IafViewer.getNodeIds', 'not found');
    return nodeIds;
  }

  getClosestElementIds(nodeIds) {
    try{
    let elementIds = [];
    // console.log ('_.size(this.props.idMapping[0])', _.size(this.props.idMapping[0]));
    if (nodeIds) {
      for (let s of nodeIds) {
        if (s) {
          let activeNode = { _nodeId: s };
          let i = 0;
          while (activeNode && i < 20 && activeNode != 0) {
            i++;
            // let pkgId = this.props.idMapping[0][activeNode._nodeId.toString()];
            let pkgId = this.props.graphicsResources.getPkgId(activeNode._nodeId);
            if (_.size(pkgId) == 0 && this._viewer) {
              let pId = this._viewer.model.getNodeParent(activeNode._nodeId);
              activeNode = { _nodeId: pId };
            } else {
              let pkgId;
              if (activeNode._nodeId) {
                // pkgId = this.props.idMapping[0][activeNode._nodeId.toString()];
                pkgId = this.props.graphicsResources.getPkgId(activeNode._nodeId);
              }
              if (_.size(pkgId) > 0) {
                elementIds.push(pkgId);
              }
              break;
            }
          }
        }
      }
    }
    return _.uniq(elementIds);
    } catch (error) {
      console.error('An error occurred in getClosestElementIds:', error);
      throw error;
    }
  }

  // This function returns found node id along with floorName
  // using whole idMapping2d set
  getNodeIds2d(pkgIdsIn, idMapping) {
    const pkgIds = [...new Set(pkgIdsIn)];
    let nodeIds = [];
    let targetFloor = [];
  
    if (pkgIds && idMapping) {
      IafUtils.devToolsIaf && console.log(
        'IafViewer.getNodeIds',
        '/pkgIds',
        JSON.stringify(pkgIds)
      );
  
      for (let s of pkgIds) {
        if (s) {
          // Assuming idMapping is an object with floor names as keys
          for (const floorName in idMapping) {
            if (idMapping.hasOwnProperty(floorName)) {
              const floorData = idMapping[floorName][1];
              
              let nodeIdStr = floorData[s.toString()];
  
              if (_.size(nodeIdStr) > 0) {
                let id = parseInt(nodeIdStr);
                targetFloor.push(floorName);
                // added to make sure all nodes are included
                this.allChildren = [];
                this.getAllChildren(id);
                nodeIds.push([id, ...this.allChildren]);
                // break;
              }
            }
          }
        }
      }
    }
  
    nodeIds.length === 0 && IafUtils.devToolsIaf && console.log('IafViewer.getNodeIds', 'not found');
    return [nodeIds,targetFloor];
  }

  getClosestElementIds2D(nodeIds) {
    try{
    IafUtils.devToolsIaf && console.log('IafViewer.create2DViewer.getClosestElementIds2D'
      , '/nodeIds', JSON.stringify(nodeIds)
    );
    let elementIds = [];
    const { sheetIdx, sheetNames } = this.state;
    if (nodeIds && nodeIds.length) {
      let sheetName = sheetNames[sheetIdx];
      
      let currentSheetIdMapping = this.props.graphicsResources2d.csdlEnabled ? 
                                          this.props.graphicsResources2d.csdlMapByFilesetIndex.get(sheetIdx).idMappingCsdl : 
                                          this.props.idMapping2d[sheetName];

      IafUtils.devToolsIaf && console.log('IafViewer.getClosestElementIds2D'
        , '/currentSheetIdMapping', currentSheetIdMapping
        , '/nodeIds', nodeIds
      );

      if (!currentSheetIdMapping) return elementIds;

      for (let s of nodeIds) {
        if (s) {
          let activeNode = { _nodeId: s };
          let i = 0;
          while (activeNode && i < 20 && activeNode != 0) {
            i++;
            let pkgId =activeNode._nodeId? currentSheetIdMapping[0][activeNode._nodeId.toString()] : undefined;
            if (_.size(pkgId) == 0) {
              let pId = this._viewer2d.model.getNodeParent(activeNode._nodeId);
              activeNode = { _nodeId: pId };
              IafUtils.devToolsIaf && console.log('IafViewer.create2DViewer.getClosestElementIds2D | _.size(pkgId) == 0'
                , '/parentOfactiveNode', activeNode
              );
            } else {
              let pkgId;
              if (activeNode._nodeId) {
                pkgId = currentSheetIdMapping[0][activeNode._nodeId.toString()];
              }
              if (_.size(pkgId) > 0) {
                elementIds.push(pkgId);
              }
              IafUtils.devToolsIaf && console.log('IafViewer.create2DViewer.getClosestElementIds2D | _.size(pkgId) != 0'
                , '/pkgId', pkgId
                , '/elementIds', JSON.stringify(elementIds)
              );
              break;
            }
          }
          //let elementIdStr = currentSheetIdMapping[0][s.toString()];
          //let elementIdStr = this.props.idMapping[1][s.toString()]
          //if (_.size(elementIdStr) > 0) {
          //let id = parseInt(elementIdStr)
          //elementIds.push(id)
        }
      }
    }
    return _.uniq(elementIds);
    } catch (error) {
      console.error('An error occurred in getClosestElementIds2D:', error);
      throw error;
    }
  }

  componentDidMount() {
    console.log('IafViewer.componentDidMount - ', this.props.title
        , '/props', this.props
        , '/state', this.state
    );
    this.logLoadStatus('componentDidMount');
    this.props.enablePersistence ? this.iafDatabaseManager.enable() : this.iafDatabaseManager.disable();
    const { model, fileSet2d, fileSet} = this.props;
    const currentProject = IafProj.getCurrent();
    const projectId = currentProject && currentProject._id;
    this.projectId = projectId;
    const mainViewer = this.evmElementIdManager.getEvmElementById(EvmUtils.EVMMode.View3d);
    const mapboxViewer = this.evmElementIdManager.getEvmElementById(EvmUtils.EVMMode.Mapbox);
    
    //Set initial permission.
    this.setState({ resourcePermissions: permissionManager.getResourcePermissions()});
    // persistence
    this.props.enablePersistence ? this.iafDatabaseManager.enable() : this.iafDatabaseManager.disable();

    // gis
    if (this.props?.gis?.enable) {
      const mapboxViewerSize = mapboxViewer ? { width: mapboxViewer.offsetWidth, height: mapboxViewer.offsetHeight } : null; 
      IafUtils.devToolsIaf && console.log('IafViewer.componentDidMount'
            , '/mapboxViewerSize', mapboxViewerSize
      );
    }

    // view3d
    if (this.props?.view3d?.enable ) {
      const mainViewerSize = mainViewer ? { width: mainViewer.offsetWidth, height: mainViewer.offsetHeight } : null;
      IafUtils.devToolsIaf && console.log('IafViewer.componentDidMount'
            , '/mainViewerSize', mainViewerSize
      );
      // this.initalizeModelComposer();
    }

    // view3d && gis
    if (this.props?.view3d?.enable && this.props?.gis?.enable) {
      const mapboxViewerSize = mapboxViewer ? { width: mapboxViewer.offsetWidth, height: mapboxViewer.offsetHeight } : null; 
      const mainViewerSize = mainViewer ? { width: mainViewer.offsetWidth, height: mainViewer.offsetHeight } : null;

      if (mainViewerSize && mapboxViewerSize && !compareObjects(mainViewerSize, mapboxViewerSize)) {
        console.warn ('IafViewer.componentDidMount'
            , 'Styling issue mismatch between Model Viewer and Mapbox Viewer'
        );
      }      
    }

    if (model && _.size(model._name) > 0) {
      // view2d - Create 2D viewer only if all required dependencies are available
      const viewer2dEnabled = _.size(fileSet2d) > 0 && 
                               this.props.enable2DViewer && 
                               this.props.view2d.enable &&
                               this.props.graphicsResources2d;
      if (viewer2dEnabled) { // ATK PLAT-4038: Websocket connection failure due to timing issue for segmented load
        // ATK - Following ends up in websocket connection for one of 2D & 3D go in forever wait loop
        // this._create2DViewer();
        // ATK PLAT-4038: Websocket connection failure due to timing issue for segmented load
        // setTimeout(() => this._create2DViewer(), 3000);
        this._create2DViewer();
      }

      // view3d - Create 3D viewer only if all required dependencies are available
      const viewer3dEnabled = !this._viewer && 
                              _.size(fileSet) > 0 && 
                              this.props.view3d.enable &&
                              this.props.graphicsResources;
      if (viewer3dEnabled) { 
        // ATK PLAT-4038: Websocket connection failure due to timing issue for segmented load
        if (viewer2dEnabled) {
          this._createViewerDelayTimeoutId && clearTimeout(this._createViewerDelayTimeoutId);
          this._createViewerDelayTimeoutId = setTimeout(() => {
            this._createViewerDelayTimeoutId = undefined;
            if (this._unmounted) return;
            this._createViewer();
          }, 3000);
        } else {
          this._createViewer();
        }
      }
    }

    // view2d
    const resizeObserver = new ResizeObserver((entries) => {
      if (this._viewer2d) {
        this._viewer2d.resizeCanvas();
      }
    });
    if (fileSet2d && this._viewer2d) {
      resizeObserver.observe(this.evmElementIdManager.getEvmElementById(EvmUtils.EVMMode.View2d));
    }

    // view3d
    const resizeViewerObserver = new ResizeObserver((entries) => {
      if (this._viewer  && this.isSceneReady && this.state.isModelStructureReady) this._viewer.resizeCanvas();
    });
    
    if (mainViewer) {
      resizeViewerObserver.observe(mainViewer);
    }
    
    // mapbox(gis)
    if (mapboxViewer) {
      resizeViewerObserver.observe(mapboxViewer);
    }

    // view3d / view2d
    if (this.props.units !== undefined) {
      switch (this.props.units) {
        case "millimeter":
        case "mm":
          this.setState({ multiplier: 1 });
          break;
        case "foot":
        case "ft":
          this.setState({ multiplier: 12.0 * 25.4 });
          break;
        case "inch":
        case "in":
          this.setState({ multiplier: 25.4 });
          break;
        default:
          this.setState({ multiplier: 12.0 * 25.4 });
      }
    }

    // Common
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener('resize', (e) => iafCallbackWindowResize(this));
  }

  /**
   * @function getColorGroupThemeIds function return colormap from colorGrop object and idmapping
   * @param {object} colorGroup object that contains theming data
   * @param {map} idmapping any color in hex form
   * @returns {colorMap} map that contains nodeIds and their respective colors
   */
  async getColorGroupThemeIds(colorGroup, idmapping, viewer) {
    if (colorGroup) {
      const lengthOfColorGroupsProp = colorGroup.colors.length;
      var colorMap = new Map();

      for (var i = 0; i < lengthOfColorGroupsProp; i++) {
        let data = colorGroup.colors[i];
        let pkgIds = data.elementIds;
        // let nodeIds = this.getNodeIds(pkgIds, idmapping);
        let nodeIds = await this.graphicsResourceManager(viewer).getNodeIds(pkgIds, idmapping);
        let color = data.color;
        const rgbColor = this.hexToRgb(color);
        for (var j = 0; j < nodeIds.length; j++) {
          colorMap.set(nodeIds[j], rgbColor);
        }
      }
      return colorMap;
    }
  }

  getScopedElements = () => {
    const combinedIds = [
      ...(this.props.sliceElementIds ?? []),
      ...(this.props.spaceElementIds ?? [])
    ];
    return combinedIds
  };

  getViewerScopedNodeIds = (viewer) => {
    const sliceNodeIds = this._viewer?.sliceNodeIds ?? [];
    return [...sliceNodeIds];
  };

  async getSlicedNodeIDs(viewer, idmapping) {
    const { hiddenNodeIds, sheetIdx, sheetNames } = this.state;
    let nodeIds = []; //this.getSecondLevelNodes()
    let pkgIds = this.props?.sliceElementIds;
    if (_.size(pkgIds) > 0) {
      for (let id of pkgIds) {
        if (id) {
          //PLAT-539, cover the case when id is not defined. Some assets don't have pkg Id associated
          // let nodeIdStr = idmapping[id.toString()];
          let nodeIdArr = await this.graphicsResourceManager(viewer).getNodeIds([id], idmapping);
          //DBM-872, check if nodeIdStr is undefined
          if (nodeIdArr.length) { // if (nodeIdStr) {
            let nodeId = nodeIdArr[0]; // parseInt(nodeIdStr);
            nodeIds.push(nodeId);
            this.allChildren = [];
            if(this.props.enableOptimizedSelection){
              this.getAllChildren(nodeId, viewer);
            }else{
            this.getAllChildren(nodeId);
            }
            nodeIds.push(...this.allChildren);
          }
        }
      }
    }
    nodeIds.length == 0 && IafUtils.devToolsIaf && console.log('IafViewer.getSlicedNodeIDs', 'not found');
    return nodeIds;
  }

   /** RRP PLAT-3855 - On demand loading of linked models - Hidden Elements
   * Asynchronously sets the visibility of hidden elements based on the provided list of hidden element IDs.
   * Retrieves active view node IDs for the hidden elements, then sets their visibility to false.
   * @returns {Promise<Array>} Array of hidden node IDs.
   */
  async setHiddenElements() {
    if (!this._viewer) return [];
    
    const hiddenNodeIds = await this.props.graphicsResources.getActiveNodeIds(this.props.hiddenElementIds);
    if (_.size(hiddenNodeIds) > 0) {
      await this.setNodesVisibility(this._viewer, hiddenNodeIds, false);
    }
    this._viewer && (this._viewer.hiddenIds = hiddenNodeIds);
    return hiddenNodeIds;
  }

  /**
   * @function This function handles hiddel element ids
   * @param {object} viewer viewer object
   * @param {map} idmapping idmapping data
   * @param {Array} hiddenElementIds Array of hidden elementIds
   */
  async handleHiddenElementIds(viewer, idmapping, hiddenElementIds, prevHiddenElementIds) {
    if (this._viewer === viewer && this.state.isModelStructureReady) {
      if(hiddenElementIds && hiddenElementIds.length > 0){
        const nodeIds = await this.graphicsResourceManager(viewer).getActiveNodeIds(hiddenElementIds, idmapping);
        viewer.hiddenIds = nodeIds;
        if (_.size(nodeIds) > 0) {
          await this.setNodesVisibility(viewer, viewer.hiddenIds, false);
        }
      } else{
        const nodeIds = await this.graphicsResourceManager(viewer).getActiveNodeIds(prevHiddenElementIds, idmapping);
        await this.setNodesVisibility(viewer, nodeIds, true);
      }
    }
  }

  /**
   * @function This functions resets theming and selection.
   * @param {object} viewer viewer object
   */
  async resetThemeandSelection(viewer) {
    const selection = this.getSelection();

    //RESET
    if (_.size(selection) == 0) {
      // viewer.selectionManager.clear();
      if(!this.props.enableOptimizedSelection){
      this.clearSelection(viewer);
      }
    }
    const isReady = this.props.enableOptimizedSelection ? (this.state.isModelStructureReady || this.state.isModelStructureReady2d) 
    : this.state.isModelStructureReady
    if (isReady) {
      let ps = [];
      ps.push(
        viewer.model.setNodesHighlighted(
          [viewer.model.getAbsoluteRootNode()],
          false
        )
      );
      ps.push(
        viewer.model.setInstanceModifier(
          Communicator.InstanceModifier.DoNotSelect,
          [viewer.model.getAbsoluteRootNode()],
          false
        )
      );
      ps.push(
        viewer.model.setInstanceModifier(
          Communicator.InstanceModifier.DoNotXRay,
          [viewer.model.getAbsoluteRootNode()],
          false
        )
      );
      ps.push(viewer.model.resetNodesColor());
      viewer.sliceNodeIds = [];
      viewer.selectedNodeIds = [];
      viewer.hiddenNodeIds = [];
      viewer.themedNodeIds = [];
      return Communicator.Util.waitForAll(ps);
    }
  }

  /**
   * @function applyColorTheme
   * This function applies color theme to nodes.
   * @param {object} viewer viewer object
   * @param {map} idmapping idmapping data
   * @param {object} colorGroups object represents theming data
   */
  async applyColorTheme(viewer, idmapping, colorGroups) {
    // THEMDED ELEMETS ONLY
    if (this.state.isModelStructureReady) {
      if (this.isElementThemingIdExists(colorGroups)) {
        this.prevElementTheme = colorGroups; // Remove this varialbe dependency it is only for debugging purpose.
        viewer.themedNodeIds = new Map();
        viewer.themedNodeIds = await this.getColorGroupThemeIds(
          colorGroups[0],
          idmapping,
          viewer
        );
        //below map contains nodeids and color
        var ColorMaps = viewer.themedNodeIds;
        if(this.props.enableOptimizedSelection){
          const notSelectedNodesMap = new Map()
          for (let [nodeId, color] of ColorMaps) {
            // Check if the node is not selected
            if (!viewer.selectionManager.isNodeSelected(nodeId)) {
                //Set if already not selected item, otherwise it is reseting the existing selection.
                notSelectedNodesMap.set(nodeId, color);
            }
          }
          await viewer.model.setNodesColors(notSelectedNodesMap);
        } else {
          await viewer.model.setNodesColors(ColorMaps);
        }
      } else {
        this.prevElementTheme = colorGroups;
        viewer.themedNodeIds = [];
      }
    }
  }
  
  /* Selection Optimization: created globally to apply/remove xray mode
   while isolateSlicedElementIds & loadSheets (toggle 2d sheets)
  */
  async applySliceElements(viewer, slicedNodeIds) {
    IafUtils.devToolsIaf && console.log('IafViewer.isolateSlicedElementIds'
    , 'enabling Glass Mode'
    )
   // PLG-1603: Only apply XRay if application explicitly sets Glass mode.
   // Otherwise, just set the viewer draw mode as specified by renderingMode.
    this._drawMode = this.props.view3d?.renderingMode;
    if(this._drawMode && this._drawMode !== IafDrawMode.Glass) {
      await viewer.view.setDrawMode(this.props.view3d?.renderingMode);
      // Ensure sliced elements remain visible regardless of the current rendering mode (e.g., during search)
      await this.setNodesVisibility(viewer, slicedNodeIds, true);
      return
    };
    await this.setXrayModeSettings(viewer);
    viewer.sliceNodeIds = slicedNodeIds;
    await viewer.model.setInstanceModifier(
      Communicator.InstanceModifier.DoNotSelect,
      [viewer.model.getAbsoluteRootNode()],
      true
    );
    await viewer.model.setInstanceModifier(
      Communicator.InstanceModifier.DoNotSelect,
      slicedNodeIds,
      false
    );
    await viewer.model.setInstanceModifier(
      Communicator.InstanceModifier.DoNotXRay,
      slicedNodeIds,
      true
    );
    await this.setNodesVisibility(viewer, slicedNodeIds, true);
    // await this.setNodesOpacity(viewer, slicedNodeIds, 1.);//ATK: This does not have any effect
    this._drawMode = IafDrawMode.Glass;
  }

  /** RRP:- PLG-1603
   * Syncs the viewer's draw mode with the application's view3d.renderingMode prop.
   *  Converts Glass (application-level) to XRay (viewer-level) when needed.
   *  Clears previous Glass effects if switching to a different mode.
   *  Sets the appropriate draw mode in the viewer via commands.setDrawMode.
   * 
   * This ensures that the viewer always respects the application's prop rendering mode
   * for isolated/sliced elements.
   */
  async syncRenderingMode(prevProps) {
    const prevMode = prevProps.view3d?.renderingMode;
    const currMode = this.props.view3d?.renderingMode;

    if (this._viewer && prevMode !== currMode) {
      const wasGlass = prevMode === IafDrawMode.Glass;
      const isGlass  = currMode === IafDrawMode.Glass;

      // Clear previous Glass mode
      if (wasGlass && !isGlass && this._viewer.sliceNodeIds?.length) {
        const rootNode = this._viewer.model.getAbsoluteRootNode();
        await this._viewer.view.setXRayOpacity(1, Communicator.ElementType.Faces);
        await this._viewer.model.setInstanceModifier(Communicator.InstanceModifier.DoNotXRay, this._viewer.sliceNodeIds, false);
        await this._viewer.model.setInstanceModifier(Communicator.InstanceModifier.DoNotSelect, [rootNode], false);
      }

      // Apply draw mode
      this.commands.setDrawMode(
        !wasGlass && isGlass,
        !wasGlass && isGlass,
        isGlass ? Communicator.DrawMode.XRay : currMode
      );
    }
  }
  
  async removeSliceElements(viewer){
      if (this.glassModeFromToolbar && this._drawMode === IafDrawMode.Glass) {
        if (viewer === this._viewer) {
          //RRP: PLAT-4060 Reset to Shader mode if slicedNodeIds empty from application side
          this.glassModeFromToolbar = false;
          this.setDrawMode(false, undefined);
          // this.setXrayModeSettings(viewer);
          // this._drawMode = IafDrawMode.Glass;
        }
      } else {
        // we want to persist drawmode when serached elements are resset from search panel
        if (viewer === this._viewer) viewer.view.setDrawMode(this._drawMode);
        // this._drawMode=IafDrawMode.Shaded;
      }

      /// if(!(_.size(selection) > 0) && !_.isEqual(_.sortBy(sliceElementIds), _.sortBy(prevProps.sliceElementIds)))
      //  await viewer.view.resetCamera();
  }
  
  /**
   * @function isolateSlicedElementIds
   * This function islaotes sliced nodes
   * @param {object} viewer viewer object
   * @param {map} idmapping idmapping data
   * @param {object} prevProps prevProps data
   */
  async isolateSlicedElementIds(viewer, idmapping, prevProps) {

    // ATK: This function can be called only 3D View at the moment
    
    if (!_.isEqual(viewer, this._viewer)) {
      IafUtils.devToolsIaf && console.log('IafViewer.isolateSlicedElementIds', 'skipping for 2d viewer');
      if(!this.props.enableOptimizedSelection){
        return;
      }
    }

    const { selection, sliceElementIds } = this.props;

    IafUtils.devToolsIaf && console.log('IafViewer.isolateSlicedElementIds'
      , '/sliceElementIds', JSON.stringify(sliceElementIds)
      , '/glassModeFromToolbar', JSON.stringify(this.glassModeFromToolbar)
      , 'sliceElementIds?.length > 0 && !this.glassModeFromToolbar', (sliceElementIds?.length > 0 && !this.glassModeFromToolbar)
      , '!_.isEqual(_.sortBy(sliceElementIds), _.sortBy(prevProps.sliceElementIds))', !_.isEqual(_.sortBy(sliceElementIds), _.sortBy(prevProps.sliceElementIds))
      , '/this.state.isModelStructureReady', this.state.isModelStructureReady
    );

    // ATK - enable glassModelToolbar on refresh
    if ((sliceElementIds?.length > 0 && !this.glassModeFromToolbar))
    {
      this.glassModeFromToolbar = true;
      IafUtils.devToolsIaf && console.log('IafViewer.isolateSlicedElementIds'
        , '/glassModeFromToolbar', JSON.stringify(this.glassModeFromToolbar)
      );
    }

    // ISOLATE (THEMED AND SLICED ELEMENTS)
    if (
      !_.isEqual(_.sortBy(sliceElementIds), _.sortBy(prevProps.sliceElementIds))
          // || this.forceUpdateViewerElements // ATK : Shouldn't this be there ?
    ) {
      this.glassModeFromToolbar = true;
      IafUtils.devToolsIaf && console.log('IafViewer.isolateSlicedElementIds'
        , '/glassModeFromToolbar', JSON.stringify(this.glassModeFromToolbar)
      );
    }
    const isReady = this.props.enableOptimizedSelection ? (this.state.isModelStructureReady || this.state.isModelStructureReady2d) 
                                                        : this.state.isModelStructureReady
    if (isReady) {
      var slicedNodeIds = await this.getSlicedNodeIDs(viewer, idmapping);
      if (
        this.props.spaceElementIds
          ? this.props.spaceElementIds?.length > 0
          : false
      ) {
        // let spaceNodeIds = this.getNodeIds(
        //   this.props.spaceElementIds,
        //   idmapping
        // );
        let spaceNodeIds = await this.graphicsResourceManager(viewer).getNodeIds(this.props.spaceElementIds, idmapping);

        // let spaceNodeIds = this.getSpaceNodeIds(idmapping);

        IafUtils.devToolsIaf && console.log('IafViewer.isolateSlicedElementIds'
          , '/spaceNodeIds', JSON.stringify(spaceNodeIds)
        );

        slicedNodeIds = slicedNodeIds.concat(spaceNodeIds);
      }
      IafUtils.devToolsIaf && console.log('IafViewer.isolateSlicedElementIds'
        , '/slicedNodeIds', JSON.stringify(slicedNodeIds)
        , '/glassModeFromToolbar', JSON.stringify(this.glassModeFromToolbar)
      );

      if(slicedNodeIds.length > 0 && this.glassModeFromToolbar){
        await this.applySliceElements(viewer, slicedNodeIds)
      } else if(slicedNodeIds.length === 0 && this.glassModeFromToolbar){
        // Although we want the viewer to be driven by the application (one diemnsional) as much as possible,
        // there would be a few cases where viewer ui may have some temporarily overriding actions as long as it is not overriden by the application
        // Following is such case, where application says there is no element in glass mode, but the user has initiated the glass mode from the toolbar overriding the application slice ids prop
        await this.applySliceElements(viewer, []) //Glass
      } else {
        await this.removeSliceElements(viewer)
      }
    }
  }
  /**
   * @function getThemeColors
   * This function return color map from nodeids
   * @param {nodeIds} nodeIds array of node ids
   * @param {object} viewer viewer object
   * @returns colorMap containing nodeids
   */
  async getThemeColors(nodeIds, viewer) {
    var colorMap = new Map();

    if (_.size(viewer.themedNodeIds) <= 0) return colorMap;

    for (let id of nodeIds)
      if (viewer.themedNodeIds && viewer.themedNodeIds.has(id))
        colorMap.set(id, viewer.themedNodeIds.get(id));

    return colorMap;
  }

  /**
   * @function setDrawMode
   * This function sets draw mode for viewer
   * @param {object} viewer viewer object
   * @param {map} idmapping idmapping data
   * @param {object} prevProps prevProps data
   */
  async setDrawMode(glassMode, newDrawMode) {
    IafUtils.devToolsIaf && console.log('IafViewer.setDrawMode'
      , '/glassMode', glassMode
      , '/newDrawMode', newDrawMode
    );
    if (glassMode && this._drawMode !== IafDrawMode.Glass) {
      this._drawMode = IafDrawMode.Glass;
      this.setState({ drawMode: IafDrawMode.Glass });
      this.forceUpdateViewerElements = true;  
    } else {
      // this.resetThemeandSelection(this._viewer)
      if (newDrawMode && this._drawMode !== newDrawMode) {
        this._viewer.view.setDrawMode(newDrawMode);
        this._drawMode = newDrawMode;
        this.setState({ drawMode: newDrawMode });
        this.forceUpdateViewerElements = true;
        //      } else if (newDrawMode !== undefined) {
      } else if (newDrawMode === undefined && this._drawMode !== IafDrawMode.Shaded) {//ATK - Draw Mode should be shaded if undefined
        // PLG-1603 If no specific draw mode is provided (newDrawMode is undefined),
        // fallback to the application’s renderingMode prop (or default Shaded).
        // Ensures the viewer always stays in sync with the app prop.
        
        // const mode = IafDrawMode.Shaded
        const mode = this.props.view3d?.renderingMode;
        this._viewer.view.setDrawMode(mode);
        this._drawMode = mode;
        this.setState({ drawMode: mode });
        this.forceUpdateViewerElements = true;
      }
    }
  }

  graphicsResourceManager = (viewer) => {
    return this.is3dViewer(viewer) ? this.props.graphicsResources : this.props.graphicsResources2d;
  }

  async handleSpaceElementIdsChnage(
    prevSpaceElementIds,
    spaceElementIDs,
    viewer,
    idmapping
  ) {
    if (this.state.isModelStructureReady) {
      IafUtils.devToolsIaf && console.log('IafViewer.handleSpaceElementIdsChnage'
        , 'rendering', spaceElementIDs ? spaceElementIDs.length : 0, 'elements'
      )
      if (!_.isEqual(prevSpaceElementIds, spaceElementIDs)) {
        // let prevNodeIds = this.getNodeIds(prevSpaceElementIds, idmapping);
        let prevNodeIds = await this.graphicsResourceManager(viewer).getNodeIds(prevSpaceElementIds, idmapping);

        await this.setNodesVisibility(viewer, prevNodeIds, false);
        // await this.resetNodesOpacity(viewer, prevNodeIds);//ATK: This does not have any effect
      }
      // let currentNodeIds = this.getNodeIds(spaceElementIDs, idmapping);
      let currentNodeIds = await this.graphicsResourceManager(viewer).getNodeIds(spaceElementIDs, idmapping);
      await this.setNodesVisibility(viewer, currentNodeIds, true);
      // await this.setNodesOpacity(viewer, currentNodeIds, 1.);//ATK: This does not have any effect
    }
  }
  /**
   * @function applySelection
   * This function handles selection of nodes
   * @param {object} prevSelection object containing array on nodeIds
   * @param {selection} selection array of selected nodeids
   * @param {object} viewer viewer object
   * @param {map} idmapping idmapping
   */
  async applySelection(prevSelection, selection, viewer, idmapping) {
    // const { selection } = this.props;
    // SELECTION

    //RRP PLAT-4281 Selection issues with DWG Projects (2D Only Projects)
    let prevSelectedElementIds = []
    if(this.props.enableOptimizedSelection){
      prevSelectedElementIds = this.is3dViewer(viewer) ? this.getClosestElementIds(this.prevSelection)  : this.getClosestElementIds2D(this.prevSelection2D) 
      const checkIsEqual = _.isEqual(prevSelectedElementIds?.slice().sort(), selection?.slice().sort());
      if(checkIsEqual) return;
    }
    
    const isModelStructureReady = this.is3dViewer(viewer) ? this.state.isModelStructureReady : this.state.isModelStructureReady2d;

    if (isModelStructureReady) {
      //selection difference

      // let nodeIds = this.getNodeIds(selection, idmapping);
      let nodeIds = await this.graphicsResourceManager(viewer).getNodeIds(selection, idmapping);

      // let prevSelectionNodes = this.getNodeIds(prevSelection, idmapping);
      let prevSelectionNodes = await this.graphicsResourceManager(viewer).getNodeIds(prevSelection, idmapping);
      if(this.props.enableOptimizedSelection){
        prevSelectionNodes = prevSelectionNodes.length ? prevSelectionNodes : prevSelectedElementIds
      }
      let selectionToAdd = _.difference(nodeIds, prevSelectionNodes);
      let selectionToRemove = _.difference(prevSelectionNodes, nodeIds);
      

      IafUtils.devToolsIaf && console.log('IafViewer.applySelection'
        , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
        , '/selection', JSON.stringify(nodeIds)
        , '/prevSelection', JSON.stringify(prevSelectionNodes)
        , '/this.prevSelection', JSON.stringify(this.prevSelection)
        , '/selectionToAdd', JSON.stringify(selectionToAdd)
        , '/selectionToRemove', JSON.stringify(selectionToRemove)
      );

      // viewer.selectionManager.clear(true);
      // await this.clearSelection(viewer);
      // unhighlight removed selection
      if (_.size(selectionToRemove) > 0) {
        await this.unselectParts(viewer, selectionToRemove);
        this.logSelection(viewer, selectionToRemove, 'Viewer.applySelection.logSelection.unselectParts.selectionToRemove');
        // await viewer.model.unsetNodesFaceColor(selectionToRemove);
        // await viewer.model.unsetNodesLineColor(selectionToRemove);
        // var themeColors = await this.getThemeColors(selectionToRemove, viewer);
        // await viewer.model.setNodesColors(themeColors);
        // if (viewer === this._viewer) {
        //   const filteredArray = selectionToRemove.filter((value) =>
        //     viewer.hiddenIds.includes(value)
        //   );
        //   if (filteredArray.length > 0)
        //     await viewer.model.setNodesVisibility(filteredArray, false);
        // }

        // if (viewer === this._viewer && selectionToRemove.length > 0) {
        //   for (let i = 0; i < selectionToRemove.length; i++) {
        //     if (
        //       _.size(this.SpaceElementSet) &&
        //       this.SpaceElementSet.has(selectionToRemove[i])
        //     )
        //       if (this.prevBoundryElements.includes(selectionToRemove[i])) {
        //         const index = this.prevBoundryElements.indexOf(
        //           selectionToRemove[i]
        //         );
        //         if (index > -1) {
        //           // only splice array when item is found
        //           this.prevBoundryElements.splice(index, 1); // 2nd parameter means remove one item only
        //         }

        //         //check for nodetype
        //         if (
        //           Communicator.model.getNodeType(id) ===
        //           Communicator.NodeType.BodyInstance
        //         ) {
        //           let data = await this._viewer.model.getNodeMeshData(
        //             selectionToRemove[i]
        //           );
        //           for (let j = 0; j < data.lines.vertexCount / 2 - 1; j++) {
        //             await this._viewer.model.setNodeLineVisibility(
        //               selectionToRemove[i],
        //               j,
        //               false
        //             );
        //           }
        //         }
        //       }
        //   }
        // }
      }

      if (_.size(nodeIds) > 0) {
      // if (_.size(selectionToAdd) > 0) {
        // for (let id of nodeIds) {
        //   viewer.selectPart(id, Communicator.SelectionMode.Add);
        // }
        await this.selectParts(viewer, nodeIds, window.Communicator.SelectionMode.Add, 
            this.state.zoomOnSelection); // PLAT-3769: Focus mode should take into account the active state
        this.logSelection(viewer, nodeIds, 'Viewer.applySelection.logSelection.selectParts.nodeIds');
        // await viewer.model.setNodesFaceColor(nodeIds, bdSelectColor);
        // await viewer.model.setNodesLineColor(nodeIds, bdSelectColor);
      }

      // viewer.selectedNodeIds = nodeIds;
      // let zoomHelper = _.isEqual(viewer, this._viewer)
      //   ? this._isolateZoomHelper
      //   : this._isolateZoomHelper2d;
      // if (_.size(nodeIds) > 0) {
      //   //fit selection
      //   if (this.state.zoomOnSelection) await zoomHelper.fitNodes(nodeIds);
      // }
      if (viewer === this._viewer2d) this.forceUpdate2DViewerElements = false;
      await this.setNodesVisibility(
        this._viewer,
        this.PrevHiddenElements,
        false
      );
    }
  }

  /**
   * @function handleElementsIdsChange
   * This function handles change in sliced, themed and selection nodesids
   * @param {object} prevProps object representing previous props
   * @param {object} viewer viewer object
   * @param {map} idmapping idmapping
   */
  async handleElementsIdsChange(prevState, prevProps, viewer, idmapping) {
    const selection = this.getSelection();
    const { sliceElementIds, colorGroups, hiddenElementIds, spaceElementIds } =
      this.props;

    if(this.is3dViewer(viewer)) {
      if (!this.state.isModelStructureReady) {
        this.handleElementsIdsChangeTimer && clearTimeout(this.handleElementsIdsChangeTimer);
        const timer = 3000;
        // console.log ('IafViewer.handleElementsIdsChange 3D'
        //                 , 'isModelStructureReady is false'
        //                 , 'initializing setTimeout after', timer/1000, 'seconds'
        //             );
        this.handleElementsIdsChangeTimer = setTimeout (() => {
          this.handleElementsIdsChange(prevState, prevProps, viewer, idmapping);
        }, timer);
        return;
      }
    } else {
      if (!this.state.isModelStructureReady2d) {
        this.handleElementsIdsChangeTimer2d && clearTimeout(this.handleElementsIdsChangeTimer2d);
        const timer = 3000;
        // console.log ('IafViewer.handleElementsIdsChange 2D'
        //                 , 'isModelStructureReady2d is false'
        //                 , 'initializing setTimeout after', timer/1000, 'seconds'
        //             );
        this.handleElementsIdsChangeTimer2d = setTimeout (() => {
          this.handleElementsIdsChange(prevState, prevProps, viewer, idmapping);
        }, timer);
        return;
      }
    }

    await this.zoomIsolatedElements(prevProps, viewer, idmapping)

    // console.log ('IafViewer.handleElementsIdsChange'
    //   , 'for', viewer === this._viewer ? "3D" : "2D"
    //   , '/forceUpdateViewerElements', this.forceUpdateViewerElements
    //   // , '/idmapping', JSON.stringify(idmapping)
    // );    
    if (
      !_.isEqual(prevProps.colorGroups, colorGroups) ||
      !_.isEqual(
        _.sortBy(sliceElementIds),
        _.sortBy(prevProps.sliceElementIds)
      ) ||
      this.forceUpdateViewerElements ||
      !_.isEqual(prevProps.spaceElementIds, this.props.spaceElementIds) ||
      //enableOptimizedSelection: the below is not required. this is reseting the current selection. when you change the 2d sheets.
      (sliceElementIds?.length > 0 && !this.glassModeFromToolbar && !this.props.enableOptimizedSelection)//ATK: Refresh case
    ) {
      this.forceUpdateViewerElements = false; // ATK - Performance | Avoid unnecessary renders? Needs testing

      if(!this.props.enableOptimizedSelection || selection.length <= 0 || sliceElementIds?.length <= 0){
        await this.resetThemeandSelection(viewer);
      }

      // THEMDED ELEMETS ONLY
      await this.applyColorTheme(viewer, idmapping, colorGroups);

      // ISOLATE (THEMED AND SLICED ELEMENTS)
      await this.isolateSlicedElementIds(viewer, idmapping, prevProps);

      // Selection
      await this.applySelection(
        prevProps.selection ? this.filteredSelection(prevProps.selection) : [],
        selection,
        viewer,
        idmapping
      );

      // PLG-1603 Not needed anymore, handled by isolateSlicedElementIds.
      // Previously this set Glass mode on initial load if sliceElementIds existed,
      // but syncRenderingMode now handles mode setting from application props.
      // if (!this.state.isModelStructureReady) {
      //   if (_.size(sliceElementIds) > 0) {
      //     this._drawMode = IafDrawMode.Glass;
      //     if (this.isSceneReady) this.setXrayModeSettings(viewer);
      //   }
      // }

      // if (_.size(sliceElementIds) > 0 && !this.isSceneReady)
      //   this._drawMode = IafDrawMode.Glass;
    }
    if (
      !_.isEqual(this.props.hiddenElementIds, prevProps.hiddenElementIds) ||
      !_.isEqual(prevProps.selection ? this.filteredSelection(prevProps.selection) : [], this.getSelection()) ||
      !_.isEqual(
        _.sortBy(sliceElementIds),
        _.sortBy(prevProps.sliceElementIds)
      ) ||
      this.forceUpdateViewerElements ||
      !_.isEqual(prevProps.spaceElementIds, this.props.spaceElementIds)
    )
      await this.handleHiddenElementIds(viewer, idmapping, hiddenElementIds, prevProps.hiddenElementIds);
    
    if (
      !_.isEqual(prevProps.spaceElementIds, this.props.spaceElementIds) ||
      this.forceUpdateViewerElements ||
      !_.isEqual(this.props.hiddenElementIds, prevProps.hiddenElementIds) ||
      !_.isEqual(prevProps.selection ? this.filteredSelection(prevProps.selection) : [], this.getSelection())
    )
      await this.handleSpaceElementIdsChnage(
        prevProps.spaceElementIds,
        this.props.spaceElementIds,
        viewer,
        idmapping
      );
    // SELECTION
    if (
      !_.isEqual(prevProps.selection ? this.filteredSelection(prevProps.selection) : [], this.getSelection()) ||
      this.forceUpdateViewerElements ||
      this.forceUpdate2DViewerElements ||
      !_.isEqual(prevState.zoomOnSelection, this.state.zoomOnSelection)
    )
      await this.applySelection(
        prevProps.selection ? this.filteredSelection(prevProps.selection) : [],
        selection,
        viewer,
        idmapping
      );
    this.forceUpdate2DViewerElements = false; // ATK: Shouldn't this be set to false // ATK - Performance | Avoid unnecessary renders? Needs testing Moved up
  }

  async zoomIsolatedElements(prevProps, viewer, idmapping) {
    const currentZoomIds = this.props.sliceElementIds || [];
    const prevZoomIds = prevProps.sliceElementIds || [];
    const { enable: enable3d } = this.props.view3d || {};
    const { enable: enable2d } = this.props.view2d || {};
    const enabled = this.is3dViewer(viewer) ? enable3d : enable2d;

    if (enabled && currentZoomIds?.length > 0 && this.state.zoomOnSelection &&
      !_.isEqual(_.sortBy(currentZoomIds), _.sortBy(prevZoomIds))) {
      const zoomNodeIds = await this.getSlicedNodeIDs(viewer, currentZoomIds, idmapping);
      if (zoomNodeIds?.length) {
        if (this.is3dViewer(viewer)) {
          // Cache model bounding once if not done before 
          if (!this.modelBounding) {
            this.modelBounding = await viewer.model.getModelBounding(true, false);
          }
          const isSpread = await IafMathUtils.nodesSpreadAcross(viewer, zoomNodeIds, this.modelBounding, 30); // Percentage
          const isSmall = await IafMathUtils.nodesTooSmall(viewer, zoomNodeIds, this.modelBounding, 0.5); // Percentage
          if (isSpread && isSmall) {
            NotificationStore.notifyZoomElementsTooSpread(this);
          }
        }
        await viewer.view.fitNodes(zoomNodeIds);
      }
    } else if (prevZoomIds.length > 0 && currentZoomIds.length === 0) {
      await viewer.view.fitWorld();
    }
  }

  getActiveIdMapping2d() {

    const { sheetIdx } = this.state;

    return this.getIdMapping2d(sheetIdx);
  }

  getIdMapping2d(sheetIdx) {
    const { sheetNames } = this.state;
    const sheetName = sheetNames[sheetIdx];

    let idMapping2d;

    if (this.props.graphicsResources2d.csdlEnabled) {
      idMapping2d = this.props.graphicsResources2d.csdlMapByFilesetIndex.get(sheetIdx).idMappingCsdl;
    } else {
      idMapping2d = this.props.idMapping2d ? this.props.idMapping2d[sheetName] : undefined;      
    }

    const result = idMapping2d && _.size(idMapping2d[1]) ? idMapping2d[1] : undefined;

    // result && console.log ('IafViewer.getActiveIdMapping2d', '/result', result);
    !result && IafUtils.devToolsIaf && console.log('IafViewer.getActiveIdMapping2d is not found');

    return result;
  }

  // ATK PLG-1604: Performance – Load Status
  // setModelIsLoaded(viewer, value) {
  //   console.log ('IafViewer.modelIsLoaded to being set to'
  //     , value
  //     , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
  //   );

  //   if (this.is3dViewer(viewer)) {
  //     if (this.state.view3d.isLoaded === value) return;
  //     this.setState({ view3d: { ...this.state.view3d, isLoaded: value },
  //       view2d: { ...this.state.view2d, isLoaded: value }
  //      }, () => {
  //       console.log ('IafViewer.modelIsLoaded is set to'
  //         , value
  //         , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
  //       );
  //       this.logLoadStatus('modelIsLoaded');
  //     });  
  //   } else {
  //     if (this.state.view2d.isLoaded === value) return;
  //     this.setState({ view2d: { ...this.state.view2d, isLoaded: value } }, () => {
  //       console.log ('IafViewer.modelIsLoaded is set to'
  //         , value
  //         , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
  //       );
  //     });
  //   }
  // }

  updateGraphicsResources_2d(
    nextGraphicsResources2d // ATK PLG-1726: Ensures the 2D viewer uses the latest graphics resource references from props or an explicit value.
  ){
      const resources = nextGraphicsResources2d !== undefined ? nextGraphicsResources2d : this.props.graphicsResources2d;
      if (!resources) return;
      if (this._viewer2d) {
        this._viewer2d.graphicsResources = resources;
        resources.setIafViewer(this, this._viewer2d);
      }
  }

  updateGraphicsResources(
    nextGraphicsResources // ATK PLG-1726: Ensures the 3D viewer uses the latest graphics resource references from props or an explicit value.
  ){
      const resources = nextGraphicsResources !== undefined ? nextGraphicsResources : this.props.graphicsResources;
      if (!resources) return;
      if (this._viewer) {
        this._viewer.graphicsResources = resources;
        resources.setIafViewer(this, this._viewer);
        if (this._viewer.graphicsResources?.viewer?.linkedModelsNodeId != undefined) {
          this._viewer.graphicsResources.viewer.linkedModelsNodeId = null;
        }
      }
  }

  logLoadStatus(parent) {
    IafUtils.devToolsIaf && console.log('IafViewer.logLoadStatus', parent ?? "", 'isView3dLoaded', this.state.view3d.isLoaded);
    IafUtils.devToolsIaf && console.log('IafViewer.logLoadStatus', parent ?? "", 'isView2dLoaded', this.state.view2d.isLoaded);
    IafUtils.devToolsIaf && console.log('IafViewer.logLoadStatus', parent ?? "", 'isGisLoaded', this.state.gis.isLoaded);
  }

  // Handles reloading of the 2D model when the model changes.
  // NOTE: Previously, this logic recreated the 2D viewer and opened a new WebSocket each time.
  // Now, it reuses the existing viewer instance to avoid unnecessary WebSocket connections.
  async onModelChange2D(model, fileSet2d) {
      IafUtils.devToolsIaf && console.log('IafViewer.onModelChange2D', 'CALLED', {
        modelId: model?._id,
        modelName: model?._name,
        fileSet2dId: fileSet2d?._id,
        fileSet2dFilesCount: fileSet2d?._files?.length,
        hasViewer: !!this._viewer2d,
        is2dModelLoaded: this.state.view2d.isLoaded
      });
      this.logLoadStatus('onModelChange2D');
      this.updateGraphicsResources_2d();
      let fileName = IafUtils.buildFileName(model, fileSet2d, 0);
      let rootNodeId = this._viewer2d.model.getAbsoluteRootNode();
      await this._viewer2d.model.clear();
      let modelLoaded = false;
      try {
        // Mark all graphics resources as not loaded, since a new model is being loaded
        for (let i = 0; i < this.props.graphicsResources2d.views.length; i++) {
          const viewId = this.props.graphicsResources2d.views[i]?._id;
          const gfxResObject = this.props.graphicsResources2d.csdlMapByViewId.get(viewId);
          if (gfxResObject) gfxResObject.loaded = false;
        }
        const file = fileSet2d?._files?.[0];
        if (!file) {
          throw new Error("onModelChange2D: No file found in fileSet2d");
        }
        fileName = this.props.isSingleWsEnabled ? getCompositeFileName(fileName, file._fileVersionId) : fileName;
        await this.props.graphicsResources2d.createFileSet({ _files: [file] });
        // Load and set the new model into the existing 2D viewer.
        // This replaces the current root model content while keeping the same viewer session (no new WebSocket).
        // Note: loadSubtreeFromModel may fail if master model is not available after clear().
        // If it fails, we'll fall back to recreating the viewer.
        await this._viewer2d.model.loadSubtreeFromModel(rootNodeId, fileName);
        modelLoaded = true;
      } catch (error) {
        console.error("onModelChange2D.loadSubtreeFromModel failed:", error);
        // If loadSubtreeFromModel fails (e.g., "Could not find master model key"), 
        // fall back to recreating the viewer
        console.warn("onModelChange2D: Falling back to recreating 2D viewer due to loadSubtreeFromModel failure");
        this._viewer2d = undefined;
        this._create2DViewer();
        return;
      }
      
      // Only call callback if model loaded successfully
      if (modelLoaded) {
        await iafCallbackModelStructureReady2D(this);
      }
      // Resize the viewer canvas to fit new content
      this._viewer2d.resizeCanvas();
  }

  // Handles reloading of the 3D model when the model changes.
  // NOTE: Previously, this logic recreated the 3D viewer and opened a new WebSocket each time.
  // Now, it reuses the existing viewer instance to avoid creating new WebSocket sessions.
  async onModelChange3D(model, fileSet) {
      IafUtils.devToolsIaf && console.log('IafViewer.onModelChange3D', 'CALLED', {
        modelId: model?._id,
        modelName: model?._name,
        fileSetId: fileSet?._id,
        fileSetFilesCount: fileSet?._files?.length,
        hasViewer: !!this._viewer,
        isModelLoaded: this.state.view3d.isLoaded,
        is2dModelLoaded: this.state.view2d.isLoaded,
        fileSetProp: this.props.fileSet?._id,
        fileSet2dProp: this.props.fileSet2d?._id,
        stackTrace: new Error().stack?.split('\n').slice(1, 8).join('\n')
      });
      this.logLoadStatus('onModelChange3D');
      this.updateGraphicsResources();
      let fileName = IafUtils.buildFileName(model, fileSet, 0);
      let rootNodeId = this._viewer.model.getAbsoluteRootNode();
      
      // ATK PLG-1585: Handle errors during model.clear() - can fail with scStateFailure if viewer
      // is in an invalid state (e.g., during GIS operations or model loading)
      try {
        await this._viewer.model.clear();
      } catch (error) {
        console.warn("onModelChange3D.model.clear failed:", error);
        // If clear fails, try to continue anyway - the model might already be in a cleared state
        // or the error might be recoverable. Log the error but don't block model loading.
      }
      
      // Reset initialCameraPosition so getSettings() uses the new model's _initialCamera instead of old saved position
      // This ensures the camera position is correct for the new model
      // Set flag to skip loading saved camera position in loadSettings - we want to use new model's _initialCamera
      this.setState({ initialCameraPosition: {} });
      let modelLoaded = false;
      try {
        const file = fileSet?._files?.[0];
        if (!file) {
          throw new Error("onModelChange3D: No file found in fileSet");
        }
        fileName = this.props.isSingleWsEnabled ? getCompositeFileName(fileName, file._fileVersionId) : fileName;
        await this.props.graphicsResources.createFileSet({ _files: [file] });
        // Load and set the new model into the existing 3D viewer.
        // This replaces the current root model content while keeping the same viewer session (no new WebSocket).
        // Note: loadSubtreeFromModel may fail if master model is not available after clear().
        // If it fails, we'll fall back to recreating the viewer.
        await this._viewer.model.loadSubtreeFromModel(rootNodeId, fileName);
        modelLoaded = true;
      } catch (error) {
        console.error("onModelChange3D.loadSubtreeFromModel failed:", error);
        // If loadSubtreeFromModel fails (e.g., "Could not find master model key"), 
        // fall back to recreating the viewer
        console.warn("onModelChange3D: Falling back to recreating 3D viewer due to loadSubtreeFromModel failure");
        this._viewer = undefined;
        this._createViewer();
        return;
      }
      
      // Only call callback if model loaded successfully
      if (modelLoaded) {
        await iafCallbackModelStructureReady(this);
      }
      // Resize the viewer canvas to fit new content
      this._viewer.resizeCanvas();
  }
  
  toggleOffGis(){
    if (this?.state?.gis?.enable) {
        const gisInstance = this?.newToolbarElement?.current?.reactGisRef?.current;
        gisInstance?.handleEnableMapBox({target: {
                checked: false
          }})
        this.setViewerState("gis", "enable", false)
      }
      this.clearMarkupManager();
  }

  // PLG-1582 Clean previous markup manager instances on switching model.
  clearMarkupManager = () =>{
    this.markupManager = null;
    this.markupManager2d = null;
    this.animationManager = null;
    this.animationManager2d = null;
    this.iafDatabaseManager && this.iafDatabaseManager.resetInitialData();
  }

  getViewerState(key, property) {
    const stateObj = this.state[key];
    const propsObj = this.props[key];

    // If property exists in state use state
    if (stateObj && stateObj[property] !== undefined && stateObj[property] !== null) {
      return stateObj[property];
    }

    // Otherwise fallback to props
    if (propsObj) {
      return propsObj[property];
    }

    return undefined;
  }

  setViewerState(key, property, value, callback = undefined) {
    this.setState(prev => ({
      [key]: {
        ...(prev[key] || {}),
        [property]: value
      }
    }), callback);
  }
  
  // Generic method to update nested state properties from toolbar buttons or other internal sources
  // Usage: updateViewerState('ue.displayMode', value) or updateViewerState(['ue', 'displayMode'], value)
  updateViewerState = (path, value) => {
    const pathArray = Array.isArray(path) ? path : path.split('.');
    const currentValue = pathArray.reduce((obj, key) => obj?.[key], this.state);
    
    if (currentValue !== value) {
      IafUtils.devToolsIaf && console.log('[IafViewer] Updating state', {
        path: pathArray.join('.'),
        prev: currentValue,
        curr: value
      });
      
      // Build nested state update object by creating a deep copy of the nested structure
      const update = {};
      let current = update;
      let stateRef = this.state;
      
      for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        // Create a shallow copy of the nested object if it exists, otherwise create empty object
        current[key] = stateRef[key] ? { ...stateRef[key] } : {};
        current = current[key];
        stateRef = stateRef[key] || {};
      }
      
      // Set the final value
      current[pathArray[pathArray.length - 1]] = value;
      
      this.setState(update);
    }
  }

  /**
   * Sync UE properties from props to internal state
   * Only updates state when props actually change (prevProps vs currentProps comparison)
   * This prevents overriding state values that were changed via UI (like toolbar buttons)
   * UE component will handle prop-by-prop comparison for its own logic
   */
  syncUePropsToState(prevProps) {
    // Sync ue.displayMode from props to internal state
    const currentUeDisplayMode = this.props?.ue?.displayMode ?? EvmUtils.EVMDisplayMode.DEFAULT;
    const prevUeDisplayMode = prevProps?.ue?.displayMode ?? EvmUtils.EVMDisplayMode.DEFAULT;
    if (currentUeDisplayMode !== prevUeDisplayMode && currentUeDisplayMode !== this.state.ue?.displayMode) {
      IafUtils.devToolsIaf && console.log('[IafViewer] Syncing ue.displayMode from props to state', {
        prev: prevUeDisplayMode,
        curr: currentUeDisplayMode,
        state: this.state.ue?.displayMode
      });
      this.setState({ 
        ue: { 
          ...this.state.ue, 
          displayMode: currentUeDisplayMode 
        } 
      });
    }

    // Sync ue.enable from props to internal state
    const currentUeEnable = this.props?.ue?.enable ?? false;
    const prevUeEnable = prevProps?.ue?.enable ?? false;
    if (currentUeEnable !== prevUeEnable && currentUeEnable !== this.state.ue?.enable) {
      IafUtils.devToolsIaf && console.log('[IafViewer] Syncing ue.enable from props to state', {
        prev: prevUeEnable,
        curr: currentUeEnable,
        state: this.state.ue?.enable
      });
      this.setState({
        visibleUnrealEngine: currentUeEnable,
        ue: { 
          ...this.state.ue, 
          enable: currentUeEnable 
        } 
      });
    }

    // Sync ue.showToolbar from props to internal state
    const currentUeShowToolbar = this.props?.ue?.showToolbar ?? true;
    const prevUeShowToolbar = prevProps?.ue?.showToolbar ?? true;
    if (currentUeShowToolbar !== prevUeShowToolbar && currentUeShowToolbar !== this.state.ue?.showToolbar) {
      IafUtils.devToolsIaf && console.log('[IafViewer] Syncing ue.showToolbar from props to state', {
        prev: prevUeShowToolbar,
        curr: currentUeShowToolbar,
        state: this.state.ue?.showToolbar
      });
      this.setState({ 
        ue: { 
          ...this.state.ue, 
          showToolbar: currentUeShowToolbar 
        } 
      });
    }

    // Sync ue.alignment from props to internal state
    const currentUeAlignment = this.props?.ue?.alignment ?? EvmUtils.EVMWidgetAlignment.RIGHT_BOTTOM;
    const prevUeAlignment = prevProps?.ue?.alignment ?? EvmUtils.EVMWidgetAlignment.RIGHT_BOTTOM;
    if (currentUeAlignment !== prevUeAlignment && currentUeAlignment !== this.state.ue?.alignment) {
      IafUtils.devToolsIaf && console.log('[IafViewer] Syncing ue.alignment from props to state', {
        prev: prevUeAlignment,
        curr: currentUeAlignment,
        state: this.state.ue?.alignment
      });
      this.setState({ 
        ue: { 
          ...this.state.ue, 
          alignment: currentUeAlignment 
        } 
      });
    }

    // Sync ue.margin from props to internal state
    const currentUeMargin = this.props?.ue?.margin ?? 0;
    const prevUeMargin = prevProps?.ue?.margin ?? 0;
    if (currentUeMargin !== prevUeMargin && currentUeMargin !== this.state.ue?.margin) {
      IafUtils.devToolsIaf && console.log('[IafViewer] Syncing ue.margin from props to state', {
        prev: prevUeMargin,
        curr: currentUeMargin,
        state: this.state.ue?.margin
      });
      this.setState({ 
        ue: { 
          ...this.state.ue, 
          margin: currentUeMargin 
        } 
      });
    }
  }

  /**
   * Sync ArcGIS properties from props to internal state
   * Only updates state when props actually change (prevProps vs currentProps comparison)
   * This prevents overriding state values that were changed via UI (like toolbar buttons)
   * ArcGIS component will handle prop-by-prop comparison for its own logic
   */
  syncArcgisPropsToState(prevProps) {
    // Sync arcgis.displayMode from props to internal state
    const currentArcgisDisplayMode = this.props?.arcgis?.displayMode ?? EvmUtils.EVMDisplayMode.FULLSCREEN;
    const prevArcgisDisplayMode = prevProps?.arcgis?.displayMode ?? EvmUtils.EVMDisplayMode.FULLSCREEN;
    if (currentArcgisDisplayMode !== prevArcgisDisplayMode && currentArcgisDisplayMode !== this.state.arcgis?.displayMode) {

      this.setState({ 
        arcgis: { 
          ...this.state.arcgis, 
          displayMode: currentArcgisDisplayMode 
        } 
      }, () => {
        IafUtils.devToolsIaf && console.log('[IafViewer] Synced arcgis.displayMode from props to state', {
          prev: prevArcgisDisplayMode,
          curr: currentArcgisDisplayMode,
          state: this.state.arcgis?.displayMode
        });
      });
    }

    // Sync arcgis.enable from props to internal state
    const currentArcgisEnable = this.props?.arcgis?.enable ?? false;
    const prevArcgisEnable = prevProps?.arcgis?.enable ?? false;
    if (currentArcgisEnable !== prevArcgisEnable) {
      this.setState({ 
        visibleArcgis: currentArcgisEnable,
        arcgis: { 
          ...this.state.arcgis, 
          enable: currentArcgisEnable 
        } 
      }, () => {
        IafUtils.devToolsIaf && console.log('[IafViewer] Synced arcgis.enable from props to state', {
          prev: prevArcgisEnable,
          curr: currentArcgisEnable,
          state: this.state.arcgis?.enable
        });
      });
    }

    // Sync arcgis.showToolbar from props to internal state
    const currentArcgisShowToolbar = this.props?.arcgis?.showToolbar ?? true;
    const prevArcgisShowToolbar = prevProps?.arcgis?.showToolbar ?? true;
    if (currentArcgisShowToolbar !== prevArcgisShowToolbar && currentArcgisShowToolbar !== this.state.arcgis?.showToolbar) {
      this.setState({ 
        arcgis: { 
          ...this.state.arcgis, 
          showToolbar: currentArcgisShowToolbar 
        } 
      }, () => {
        IafUtils.devToolsIaf && console.log('[IafViewer] Synced arcgis.showToolbar from props to state', {
          prev: prevArcgisShowToolbar,
          curr: currentArcgisShowToolbar,
          state: this.state.arcgis?.showToolbar
        });
      });
    }

    // Sync arcgis.alignment from props to internal state
    const currentArcgisAlignment = this.props?.arcgis?.alignment ?? EvmUtils.EVMWidgetAlignment.LEFT_TOP;
    const prevArcgisAlignment = prevProps?.arcgis?.alignment ?? EvmUtils.EVMWidgetAlignment.LEFT_TOP;
    if (currentArcgisAlignment !== prevArcgisAlignment && currentArcgisAlignment !== this.state.arcgis?.alignment) {
      this.setState({ 
        arcgis: { 
          ...this.state.arcgis, 
          alignment: currentArcgisAlignment 
        } 
      }, () => {
        IafUtils.devToolsIaf && console.log('[IafViewer] Synced arcgis.alignment from props to state', {
          prev: prevArcgisAlignment,
          curr: currentArcgisAlignment,
          state: this.state.arcgis?.alignment
        });
      });
    }

    // Sync arcgis.margin from props to internal state
    const currentArcgisMargin = this.props?.arcgis?.margin ?? 0;
    const prevArcgisMargin = prevProps?.arcgis?.margin ?? 0;
    if (currentArcgisMargin !== prevArcgisMargin && currentArcgisMargin !== this.state.arcgis?.margin) {
      this.setState({ 
        arcgis: { 
          ...this.state.arcgis, 
          margin: currentArcgisMargin 
        } 
      }, () => {
        IafUtils.devToolsIaf && console.log('[IafViewer] Synced arcgis.margin from props to state', {
          prev: prevArcgisMargin,
          curr: currentArcgisMargin,
          state: this.state.arcgis?.margin
        });
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const { model, modelVersionId, idMapping, viewerResizeCanvas, fileSet2d, colorGroups, fileSet } =
      this.props;

    IafUtils.debugIaf && IafObjectUtils.logChangedProperties(prevProps, this.props, 
              IafUtils.devToolsIaf ? 5 : 3, `IafViewer.componentDidUpdate Props (${this._uuid})`);

    // Sync UE properties from props to internal state
    this.syncUePropsToState(prevProps);

    // Sync ArcGIS properties from props to internal state
    this.syncArcgisPropsToState(prevProps);

    // Apply the current rendering mode based on props (Shaded, Glass, etc.)
    await this.syncRenderingMode(prevProps);

    if (this.props.graphicsHandler !== prevProps.graphicsHandler) {
      IafUtils.devToolsIaf && console.log('IafViewer.componentDidUpdate: graphicsHandler updated', {
        prevGraphicsHandler: prevProps.graphicsHandler,
        newGraphicsHandler: this.props.graphicsHandler
      });
    }
    
    if (this.props.graphicsResources !== prevProps.graphicsResources) {
      IafUtils.devToolsIaf && console.log('IafViewer.componentDidUpdate: graphicsResources updated', {
        prevGraphicsResources: prevProps.graphicsResources,
        newGraphicsResources: this.props.graphicsResources
      });
    }

    // IafObjectUtils.logChangedProperties(prevState, this.state, 
    //           IafUtils.devToolsIaf ? 5 : 3, "IafViewer.componentDidUpdate State");

    const { selection, sliceElementIds, hiddenElementIds, spaceElementIds } =
    this.props;

    // console.log ('IafViewer.componentDidUpdate.workflow'
    //     , '/workflow', this.props.workflow
    //     , '/prevWorkflow', prevProps.workflow
    // );

    // useLogChangedPropertiesForClass("IafViewer Props", this.props, prevProps);

    // PLG-1494 view3d.enable = false but gis true need to enable isModelStructureReady
    if (!this.props.model || !this.props.view3d.enable) {
      // No model ensure 3D state is marked ready only once
      if (!prevState.isModelStructureReady) {
        this.setState({ isModelStructureReady: true });
      }
      // //PLG - 1522 When empty model just return
      // if (!this.props.model) {
      //   return;
      // }
    }

    if (this.props.view3d?.enable !== prevProps.view3d?.enable) {
      this.setState({ isModelStructureReady: !this.props.view3d?.enable });
      
      // When view3d.enable is toggled off, ensure Mapbox unblends and disables interaction with the viewer
      if (!this.props.view3d?.enable && this.iafMapBoxGl) {
        IafUtils.devToolsIaf && console.log('IafViewer.componentDidUpdate: view3d disabled, unblending Mapbox from viewer');
        this.iafMapBoxGl.unblendWithIafViewer();
        // Enable Mapbox interaction since viewer is no longer available
        this.iafMapBoxGl.enableInteraction();
      }
    }

    if (this.props.view2d?.enable !== prevProps.view2d?.enable) {
      this.setState({ isModelStructureReady2d: !this.props.view2d?.enable });
    }

    // Reset GIS state (elevationMode, federatedMode, primaryModelId) when view3d.enable, model, or modelVersionId change
    // This must happen before other state updates to prevent inconsistencies
    // When view3d.enable is toggled off, reset all GIS-related state to defaults

    // There are a few of use cases here
    // 1. When model changes from the application side when in 3D mode
    // 2. When model changes from the application side when in 3D & Gis mode
    // 3. When model changes from the Viewer (GIS UI) side when in 2D mode
    // 4. When model changes from the Viewer (Dev Tools Model Switching) side when in 3D
    // 4. When model changes from the Viewer (Dev Tools Model Switching) side when in 3D & GIS

    IafUtils.devToolsIaf && console.log('IafViewer.componentDidUpdate: Resetting GIS state', {
      view3dEnabled: this.props.view3d?.enable,
      modelChanged: this.props.model !== prevProps.model,
      modelVersionIdChanged: this.props.modelVersionId !== prevProps.modelVersionId
    });

    const shouldResetGisState = (
      (this.props.view3d?.enable !== prevProps.view3d?.enable)
      // PLG-1506: Outlined Model Import - The main model has changed
      || (this.props.graphicsHandler !== prevProps.graphicsHandler
          && this.props.defaultFederationType === "SingleModel"
      )
    );

    const shouldResetGisElevationMode = !shouldResetGisState && (
       (this.props.model !== prevProps.model)
        || (this.props.modelVersionId !== prevProps.modelVersionId)
        || (this.props.graphicsHandler !== prevProps.graphicsHandler)
    );

    if (shouldResetGisState && this.state.gis) {
      // Reset all GIS state variables to defaults
      this.setState({
        gis: {
          ...this.state.gis,
          elevationMode: GisElevationMode.None,
          federatedMode: GisFederatedMode.None,
          primaryModelId: this.props.view3d?.enable ? undefined : this.props.gis?.primaryModelId ?? this.props.model?._id
        }
      });
    } else if (shouldResetGisElevationMode && this.state.gis) {
      this.setState({
        gis: {
          ...this.state.gis,
          elevationMode: GisElevationMode.None
        }
      });
    }

    if (this.props.view3d?.camera != prevProps.view3d?.camera) {
      this._viewer?.view.setCamera(Communicator.Camera.fromJson(this.props.view3d?.camera));
    }   

    if (this.props.gis?.enable !== prevProps.gis?.enable) {
      this.setState({
        gis: {
          ...this.state.gis,
          enable: this.props.gis?.enable // ATK PLG-1502: GIS 2.0 - Review the GIS Properties - enable and showToolbar
        }
      }, () => {
        // If GIS is enabled and viewer is already initialized, ensure background is transparent
        if (this.props.gis?.enable && this._viewer && this.iafMapBoxGl) {
          this.iafMapBoxGl.blendWithIafViewer();
        } else if (!this.props.gis?.enable && this._viewer && this.iafMapBoxGl) {
          this.iafMapBoxGl.unblendWithIafViewer();
        }
      });
    }   
    if (this.props.gis?.elevationMode !== prevProps.gis?.elevationMode) {
      this.setState({
        gis: {
          ...this.state.gis,
          elevationMode: this.props.gis?.elevationMode
        }
      });
    }
    if (this.props.gis?.federatedMode !== prevProps.gis?.federatedMode) {
      this.setState({
        gis: {
          ...this.state.gis,
          federatedMode: this.props.gis?.federatedMode
        }
      });
    }
    if (this.props.gis?.primaryModelId !== prevProps.gis?.primaryModelId) {
      this.setState({
        gis: {
          ...this.state.gis,
          primaryModelId: this.props.gis?.primaryModelId
        }
      });
    }
    if (this.props.gis?.dynamicRenderingDistance !== prevProps.gis?.dynamicRenderingDistance) {
      const v = this.props.gis?.dynamicRenderingDistance;
      this.setState(
        {
          gis: {
            ...this.state.gis,
            dynamicRenderingDistance:
              typeof v === "number" && Number.isFinite(v) ? v : 750,
          },
        },
        () => {
          const z = this.iafMapBoxGl?.map?.getZoom?.();
          if (typeof z === "number") {
            this.iafTuner?.updateModelDisplay(z);
          }
        }
      );
    }
    if (this.props.gis?.dynamicRenderingZoom !== prevProps.gis?.dynamicRenderingZoom) {
      const v = this.props.gis?.dynamicRenderingZoom;
      this.setState(
        {
          gis: {
            ...this.state.gis,
            dynamicRenderingZoom:
              typeof v === "number" && Number.isFinite(v) ? v : 14,
          },
        },
        () => {
          const z = this.iafMapBoxGl?.map?.getZoom?.();
          if (typeof z === "number") {
            this.iafTuner?.updateModelDisplay(z);
          }
        }
      );
    }
    if (this.props.arcgisOverview?.enable !== prevProps.arcgisOverview?.enable 
        || this.props.photosphere?.enable !== prevProps.photosphere?.enable
        || this.props.view2d?.enable !== prevProps.view2d?.enable
        || this.props.view3d?.enable !== prevProps.view3d?.enable
      ) {
      this.setState({
        visibleArcgisOverview: this.props.arcgisOverview?.enable,
        visiblePhotosphere: this.props.photosphere?.enable,
        visible: this.props.view2d?.enable,
        visible3d: this.props.view3d?.enable
      });
    }
    
    if (!prevState.isModelStructureReady && this.state.isModelStructureReady) {
      if (this.props.OnViewerReadyCallback) {
        // ATK PLG-1585: Call callback with full model information when model structure is ready
        const modelId = this.props.model?._id;
        const modelVersionId = this.props.modelVersionId || this.props.model?._versionId;
        if (modelId) {
          this.props.OnViewerReadyCallback({
            modelType: '3d',
            modelId: modelId,
            modelVersionId: modelVersionId
          });
        } else {
          // Fallback to string format for backward compatibility if model info is not available
          this.props.OnViewerReadyCallback('3d');
        }
      }
    }
    
    if (!prevState.isModelStructureReady2d && this.state.isModelStructureReady2d) {
      if (this.props.OnViewerReadyCallback) {
        // ATK PLG-1585: Call callback with full model information when model structure is ready
        const modelId = this.props.model?._id;
        const modelVersionId = this.props.modelVersionId || this.props.model?._versionId;
        if (modelId) {
          this.props.OnViewerReadyCallback({
            modelType: '2d',
            modelId: modelId,
            modelVersionId: modelVersionId
          });
        } else {
          // Fallback to string format for backward compatibility if model info is not available
          this.props.OnViewerReadyCallback('2d');
        }
      }
    }

    if (this.props.enablePersistence !== prevProps.enablePersistence) {
      this.props.enablePersistence ? this.iafDatabaseManager.enable() : this.iafDatabaseManager.disable();
    }

    if (model) {
      // ATK PLAT-5046: Foundation | Handle switching between multiple animation workflows
      if (JSON.stringify(this.props.workflow) !== JSON.stringify(prevProps.workflow)) {
        IafUtils.devToolsIaf && console.log("IafViewer.componentDidUpdate"
          , "props.workflow", this.props.workflow
          , "prevProps.workflow", prevProps.workflow
        );
        this.animationManager2d?.updateWorkflows(this.props.workflow);
      }

      const { sheetIdx, sheetNames } = this.state;
      let checkforfileset = false;

      let chnageInIdMapping = false;
      try {
        if (!idMapping && _.size(this.props.fileSet) > 0 && !this._viewerInitialized) {
          checkforfileset = true;
        } else {
          checkforfileset = false;
        }
        const changeInIdMapping = (_.size(idMapping) > 0 &&
            // _.size(prevProps.idMapping) > 0 &&
            !_.isEqual(idMapping[0], prevProps.idMapping[0]))

        const changeInFileSet = (_.size(fileSet) > 0 &&
            // _.size(prevProps.fileSet) > 0 &&
            !_.isEqual(fileSet, prevProps.fileSet))

        const changeInFileSet2d = (_.size(fileSet2d) > 0 &&
            // _.size(prevProps.fileSet) > 0 &&
            !_.isEqual(fileSet2d, prevProps.fileSet2d));

        const isview3dEnabled = this.props.view3d?.enable && this.props.view3d?.enable != prevProps.view3d?.enable;
        const isview2dEnabled = this.props.view2d?.enable && this.props.view2d?.enable != prevProps.view2d?.enable;

        if(this.iafDatabaseManager && (model._id != prevProps.model?._id || modelVersionId != prevProps.modelVersionId)){
          this.iafDatabaseManager?.refreshModelContext()
        }

        const shouldTriggerViewerCreation = changeInFileSet ||
          changeInFileSet2d ||
          // changeInIdMapping ||
          checkforfileset ||
          isview3dEnabled ||
          isview2dEnabled;

        if (shouldTriggerViewerCreation) {
          IafUtils.devToolsIaf && console.log('IafViewer.componentDidUpdate', 'TRIGGERING viewer creation', {
            changeInFileSet: changeInFileSet,
            changeInFileSet2d: changeInFileSet2d,
            checkforfileset: checkforfileset,
            isview3dEnabled: isview3dEnabled,
            isview2dEnabled: isview2dEnabled,
            prevFileSetId: prevProps.fileSet?._id,
            currentFileSetId: fileSet?._id,
            prevFileSet2dId: prevProps.fileSet2d?._id,
            currentFileSet2dId: fileSet2d?._id,
            prevFileSetSize: _.size(prevProps.fileSet),
            currentFileSetSize: _.size(fileSet),
            prevFileSet2dSize: _.size(prevProps.fileSet2d),
            currentFileSet2dSize: _.size(fileSet2d),
            isModelLoaded: this.state.view3d.isLoaded,
            is2dModelLoaded: this.state.view2d.isLoaded,
            hasViewer: !!this._viewer,
            hasViewer2d: !!this._viewer2d
          });
          //create a new viewer for a different model from different project
          //model is loaded in modelStructureReady callback now so it's safer to just
          //create a new viewer
          this.setState({
            isModelStructureReady: false,
            isModelStructureReady2d: false,
            // isModelLoaded: false,
            // is2DModelLoaded: false,
            hwvInstantiated: false,
            modelId: this.props.model._id,
            modelVersionId: this.props.modelVersionId,
            // Reset initialCameraPosition when model changes so getSettings() uses new model's _initialCamera
            // initialCameraPosition: {},
          });
          // this.setModelIsLoaded(this._viewer, false);
          this._hwvManager = new ViewerManager();

          // Create 2D viewer only if all required dependencies are available
          const canCreate2DViewer = _.size(fileSet2d) > 0 && 
                                    this.props.view2d?.enable && 
                                    !!this.props.graphicsResources2d &&
                                    !!model;
          
          if (canCreate2DViewer) {
            // this.setModelIsLoaded(this._viewer2d, false);
            if (this.props.isSingleWsEnabled) {
              // RRP:- PLG-1419 Previously, this would recreate the 2D viewer and open a new WebSocket each time.
              // Now, onModelChange2D reuses the existing viewer instance to avoid creating a new WebSocket.
              this._viewer2d ? this.onModelChange2D(model, fileSet2d) : this._create2DViewer();
            } else {
              // Fallback mode — always recreate viewer
              this._viewer2d = undefined;
              this._create2DViewer();
            }
          } else if (fileSet2d && this.props.view2d?.enable) {
            console.warn('IafViewer.componentDidUpdate: Cannot create 2D viewer - missing dependencies', {
              fileSet2d: !!fileSet2d,
              view2dEnabled: this.props.view2d?.enable,
              graphicsResources2d: !!this.props.graphicsResources2d,
              model: !!model
            });
          }
          
          // Create 3D viewer only if all required dependencies are available
          const canCreate3DViewer = _.size(this.props.fileSet) > 0 && 
                                    this.props.view3d?.enable && 
                                    !!this.props.graphicsResources &&
                                    !!model;
          
          if (canCreate3DViewer) {
            const handle3DViewerLoad = () => {
              if (this._unmounted) return;
              IafUtils.devToolsIaf && console.log('IafViewer.componentDidUpdate', 'handle3DViewerLoad called', {
                isSingleWsEnabled: this.props.isSingleWsEnabled,
                hasViewer: !!this._viewer,
                modelId: model?._id,
                fileSetId: fileSet?._id,
                isModelLoaded: this.state.view3d.isLoaded,
                is2dModelLoaded: this.state.view2d.isLoaded,
                willCallOnModelChange3D: this.props.isSingleWsEnabled && !!this._viewer,
                willCallCreateViewer: !this.props.isSingleWsEnabled || !this._viewer
              });
              if (this.props.isSingleWsEnabled) {
                // RRP:- PLG-1419 Previously, this would recreate the 3D viewer and open a new WebSocket each time.
                  // Now, onModelChange3D reuses the existing viewer instance to avoid creating a new WebSocket.
                this._viewer ? this.onModelChange3D(model, fileSet) : this._createViewer();
              } else {
                // Fallback mode — always recreate viewer
                this._viewer = undefined;
                this._createViewer();
              }
            };
            this._handle3DViewerLoadDelayTimeoutId && clearTimeout(this._handle3DViewerLoadDelayTimeoutId);
            this._handle3DViewerLoadDelayTimeoutId = undefined;
            if (fileSet2d && this.props.view2d?.enable) {
              this._handle3DViewerLoadDelayTimeoutId = setTimeout(() => {
                this._handle3DViewerLoadDelayTimeoutId = undefined;
                handle3DViewerLoad();
              }, 3000); // Delay to avoid 2d and 3d at the same time
            } else {
              handle3DViewerLoad();
            }
          } else {
            this._handle3DViewerLoadDelayTimeoutId && clearTimeout(this._handle3DViewerLoadDelayTimeoutId);
            this._handle3DViewerLoadDelayTimeoutId = undefined;
            if (_.size(this.props.fileSet) > 0 && this.props.view3d?.enable) {
              console.warn('IafViewer.componentDidUpdate: Cannot create 3D viewer - missing dependencies', {
                fileSet: !!this.props.fileSet && _.size(this.props.fileSet) > 0,
                view3dEnabled: this.props.view3d?.enable,
                graphicsResources: !!this.props.graphicsResources,
                model: !!model
              });
            }
          }
        }

        //Take care of selection changes first
        //when sliceElementIds is changed, usually the selection is changed to 0 also,
        //so we need to remove previous selection first.

        //we can not add glassMode flag in the if statement here, as setting to glassMode
        //takes some time and this line could be reached while setting glassMode is in progress
        if (this._viewer) {
          if (
            viewerResizeCanvas &&
            viewerResizeCanvas != prevProps.viewerResizeCanvas
          ) {
            // this._viewer.resizeCanvas();
            iafCallbackWindowResize(this);
          }
        }

        // if(this._viewer2d){
        //   this.is2DModelLoaded && this.onResize2DCanvas(); // Resize canvas for 2d viewer
        // }
        iafCallbackWindowResize2d(this);

        if (this.props.idMapping && _.size(this.props.idMapping) > 0  // ATK: Handle Console Errors
            && _.size(this.props.fileSet) > 0) {
          await this.handleElementsIdsChange(
            prevState,
            prevProps,
            this._viewer,
            this.props.idMapping[1]
          );    
        }
        if (this.props.idMapping2d && _.size(this.props.idMapping2d) > 0 // ATK: Handle Console Errors
            && _.size(this.props.fileSet2d) > 0
            && sheetNames && sheetNames.length) {
          // console.log ('IafViewer.componentDidUpdate'
          //   // , '/idMapping2d', JSON.stringify(this.props.idMapping2d)
          //   , '/sheetNames', sheetNames
          //   , '/sheetIdx', sheetIdx
          //   , '/sheetNames[sheetIdx]', sheetNames[sheetIdx]
          // );
          await this.handleElementsIdsChange(
            prevState,
            prevProps,
            this._viewer2d,
            this.getActiveIdMapping2d()
          );
        }
      } catch (err) {
        IafUtils.devToolsIaf && console.log(err);
      }      
    }

  }

  async componentWillUnmount() {
    IafUtils.devToolsIaf && console.log('IafViewer.componentWillUnmount', this.props.title);

    this._unmounted = true;
    
    this.handleElementsIdsChangeTimer && clearTimeout(this.handleElementsIdsChangeTimer); this.handleElementsIdsChangeTimer = undefined;
    this.handleElementsIdsChangeTimer2d && clearTimeout(this.handleElementsIdsChangeTimer2d); this.handleElementsIdsChangeTimer2d = undefined;
    this._setNodesVisibilityFlushTimeoutId && clearTimeout(this._setNodesVisibilityFlushTimeoutId); this._setNodesVisibilityFlushTimeoutId = undefined; this._queuedSetNodesVisibilityListenerAdded = false;
    this._createViewerDelayTimeoutId && clearTimeout(this._createViewerDelayTimeoutId); this._createViewerDelayTimeoutId = undefined;
    this._handle3DViewerLoadDelayTimeoutId && clearTimeout(this._handle3DViewerLoadDelayTimeoutId); this._handle3DViewerLoadDelayTimeoutId = undefined;
    this.iafTuner?._updateModelDisplayTimeout && clearTimeout(this.iafTuner._updateModelDisplayTimeout); if (this.iafTuner) this.iafTuner._updateModelDisplayTimeout = undefined;
    this.updateInfoOnCanvasTimer && clearTimeout(this.updateInfoOnCanvasTimer); this.updateDistanceScaleTimeout && clearTimeout(this.updateDistanceScaleTimeout); this.updateDistanceScaleTimeout = undefined;
    this.devToolsCameraTimeout && clearTimeout(this.devToolsCameraTimeout); this.devToolsCameraTimeout = undefined;
    this.renderCameraVectorTimeout && clearTimeout(this.renderCameraVectorTimeout); this.renderCameraVectorTimeout = undefined;
    
    await this.iafDatabaseManager?.stopAutoPersist();

    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener('resize', this._boundWindowResize);

    this.gisInstance = null;

    NotificationStore.clear(this);
    void IafDisposer.cleanupAllResources(this).catch((err) => {
      console.error('IafViewer.componentWillUnmount cleanupAllResources', err);
    });
    
    this.props.graphicsResource?.stopKeepAlive();
    this.props.graphicsResources2d?.stopKeepAlive();
  }

  onWheel(event) {
    IafUtils.devToolsIaf && console.log(
      "deltaX: " +
        event.deltaX +
        ", deltaY: " +
        event.deltaY +
        ", deltaMode: " +
        event.deltaMode
    );
  }
  /**
   * @function onResize2DCanvas
   * This function fires resize canvas function if 2D viewer div changes its dimensions
   * @param {event} event resize event for 2D viewer
   */
  onResize2DCanvas(event) {
    this._viewer2d.resizeCanvas();
  }

  /**
   * @function onResize
   * This function fires resize canvas function if 3D viewer div changes its dimensions
   * @param {event} event resize event for 2D viewer
   */
  onResize(event) {
    // jQuery resizable triggers onresize, check that the call is not coming from a DOM element object
    if (typeof event.target.getAttribute !== "function") {
      this._viewer.resizeCanvas();
    }
  }

  async onKeyDown(event) {
    //We put the current select operator at pos 1 in _operatorStack
    this._viewer && iafCallbackKeyDown(event
      , this._viewer
      , this.props.idMapping[1]
      , this
      , this.markupManager
    );

    //ATK PLAT-4466: Keyboard functions don't work for 2D
    this._viewer2d && iafCallbackKeyDown(event
      , this._viewer2d
      , this.props.idMapping2d[this.state.sheetNames[this.state.sheetIdx]]
      , this
      , this.markupManager2d
    );    
  }

  async setNodeLineVisibility(viewer, partId, lineId, visibility) {
    IafUtils.devToolsIaf && console.log('IafViewer.setNodeLineVisibility'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
      , '/partId', JSON.stringify(partId)
      , '/lineId', JSON.stringify(lineId)
      , '/visibility', JSON.stringify(visibility)
    );
    await viewer.model.setNodeLineVisibility(partId, lineId, visibility);
  }

  async applyBoundries(id) {
    const type = this._viewer.model.getNodeType(id);
    // node type check
    if (type === window.Communicator.NodeType.BodyInstance) {
      IafUtils.devToolsIaf && console.log('IafViewer.applyBoundries on 3D'
        , '/type', type
        , '/id', JSON.stringify(id)
        , 'executed'
      );
      let data = await this._viewer.model.getNodeMeshData(id);
      for (let i = 0; i < data.lines.vertexCount / 2 - 1; i++) {
        this.setNodeLineVisibility(this._viewer, id, i, true);
      }
    } else  {
      IafUtils.devToolsIaf && console.log('IafViewer.applyBoundries on 3D'
        , '/type', type
        , '/id', JSON.stringify(id)
        , 'skipped'
      );
    }    
  }
  getAllChildrenForNodeIds(nodeId) {
    let children = this._viewer.model.getNodeChildren(nodeId);
    if (_.size(children) > 0) {
      this.Children.push(...children);
      for (let id in children) {
        this.getAllChildren(id);
      }
    }
  }
  /**
   * @function _create2DViewer
   * This function creates 2D viewer
   */
  _create2DViewer() {
    // Guard: Ensure all required dependencies are available before creating viewer
    if (!this.props.view2d.enable) {
      console.warn('IafViewer._create2DViewer: view2d.enable is false');
      return;
    }
    if (!this.props.fileSet2d || _.size(this.props.fileSet2d) === 0) {
      console.warn('IafViewer._create2DViewer: fileSet2d is not available');
      return;
    }
    if (!this.props.graphicsResources2d) {
      console.warn('IafViewer._create2DViewer: graphicsResources2d is not available');
      return;
    }
    if (!this.props.model) {
      console.warn('IafViewer._create2DViewer: model is not available');
      return;
    }
    const { model, authToken, wsUri, fileSet2d } = this.props;
    const { sheetIdx, sheetIds, sheetNames } = this.state;
    if (fileSet2d) {

      if (this.props.graphicsResources2d.csdlEnabled) {
        // this.props.openNotification ("The drawings sheet (" 
        //   + this.props.graphicsResources2d.views[0].title 
        //   + ") is being loaded..."        );
        NotificationStore.notifyDrawingSheetIsBeingLoaded(this, 0);
      } else {
        // this.props.openNotification ("The project may not be optimized. Attempting to load all the drawings sheets " 
        //   + "(" + this.props.graphicsResources2d.views.length + ") "       
        // );
        NotificationStore.notifyDrawingSheetsAreBeingLoaded(this);
      }

      const perfLogger = new IafPerfLogger("IafViewer.defaultView2d");

      let viewer2DPromise = this._hwvManager.createRemoteViewer(
        this.evmElementIdManager.getEvmUuid(EvmUtils.EVMMode.View2d),
        model,
        fileSet2d,
        authToken,
        wsUri,
        0, // streamCutoffScale
        0, // viewIndex
        this.props.isSingleWsEnabled,
        true, // usePresignedUrl (will be checked against state flag)
        this // iafViewer
      );

      viewer2DPromise.then((viewer) => {
        this._viewer2d = viewer;
        setClientTimeout(this._viewer2d, '2d', 60, 5);
        this._viewer2d.graphicsResources = this.props.graphicsResources2d;
        this.props.graphicsResources2d.setIafViewer(this, this._viewer2d);
        this._isolateZoomHelper2d = new ViewerIsolateZoomHelper(viewer, this);
        // Registered Select Operator for 2d viewer
        this.selectOperator2d = new SelectOperator2d(
          this._viewer2d,
          this._viewer2d.noteTextManager,
          this
        );
        this.selectOperator2dId = this._viewer2d.registerCustomOperator(
          this.selectOperator2d
        );
        this._viewer2d.operatorManager.set(this.selectOperator2dId, 1);
        this.measurementManager2d = new IafMeasurementManager(this._viewer2d,"Measurement2d",this.projectId);
        // Once the viewer is instantiated, we can set the state to true to have the React update the DOM
        this.setState({
          hwvInstantiated: true,
          view2d: { ...this.state.view2d, isLoaded: false }, // PLG-1646: Gis is not considered loaded until view2d is completely loaded if enabled
        }, () => {
          this.logLoadStatus('_create2DViewer');
        });

        this._viewer2d.setCallbacks({
        // Add new callbacks at the top, so that they don't accidentally replace the earlier ones
          // HOOPS CallbackMap: assemblyTreeReady before modelStructureReady; info/sheets per docs
          assemblyTreeReady: () => iafAssemblyTreeReady(this, "2d"),
          info: (infoType, message) => iafHoopsInfo(this, "2d", infoType, message),
          sheetActivated: (nodeId) => iafSheetActivated(this, "2d", nodeId),
          sheetDeactivated: () => iafSheetDeactivated(this, "2d"),
          // 10-12-23 ATK MK-149 Added viewer callbacks for error handling
          modelStructureHeaderParsed: (fileName, fileType) =>
            iafModelStructureHeaderParsed(this, "2d", fileName, fileType),
          missingModel: (modelPath) => iafMissingModel(this, "2d", modelPath),
          modelLoadBegin: () => iafModelLoadBegin(this, "2d"),
          modelLoadFailure: (modelName, reason, error) =>
            iafModelLoadFailure(this, "2d", modelName, reason, error),
          modelLoaded: (modelRootIds, source) =>
            iafModelLoaded(this, "2d", modelRootIds, source),
          modelStructureLoadBegin: () => iafModelStructureLoadBegin(this, "2d"),
          modelStructureLoadEnd: () => iafModelStructureLoadEnd(this, "2d"),
          modelStructureParseBegin: () =>
            iafModelStructureParseBegin(this, "2d"),
          modelSwitchStart: (clearOnly) =>
            iafModelSwitchStart(this, "2d", clearOnly),
          modelSwitched: (clearOnly, modelRootIds) =>
            iafModelSwitched(this, "2d", clearOnly, modelRootIds),
          viewLoaded: (markupView) =>
            iafMarkupViewLoaded(this, "2d", markupView),
          websocketConnectionClosed: async () => iafWebsocketConnectionClosed(this.props.graphicsResources2d),
          webGlContextLost: async () => iafWebGlContextLost(this, '2d'),
          timeout: () => iafWebsocketTimeout(this, '2d'),
          timeoutWarning: () => iafWebsocketTimeoutWarning(this, '2d'),
          subtreeLoaded: (modelRootIds, source) => iafSubtreeLoaded(this, '2d', modelRootIds, source),
          subtreeDeleted: (modelRootIds) => iafSubtreeDeleted(this, '2d', modelRootIds),
          streamingActivated: () => iafStreamingActivated(this, '2d'),
          streamingDeactivated: async () => iafStreamingDeactivated(this, '2d'),

          modelStructureReady: () => {
            perfLogger.end();
            iafCallbackModelStructureReady2D(this);
          },
          selectionArray: async (selectionEvents) => {

            if (selectionEvents.length === 0) return;
            //selectionEvents only represents the latest select event
            //use viewer.selectionManager.getResults to get current selected nodes
            // or selectionEvents[0]._selection._nodeId

            //selectionEvents only represents the latest select event
            //use viewer.selectionManager.getResults to get current selected nodes
            // or selectionEvents[0]._selection._nodeId
            let id = this.getActiveSelectionNodeId(this._viewer2d, selectionEvents);
            let elementId = id ? this.getClosestElementIds2D([id]) : undefined;
            
            if (!id || !_.size(elementId)
                // || this._drawMode == IafDrawMode.Glass
                ) {
              IafUtils.devToolsIaf && console.log('Viewer.selectionArray.2D'
                , 'Invalid callback'
                , '!id || !_.size(elementId)'
                , '/id', JSON.stringify(id)
                , '/elementId', JSON.stringify(elementId)
                );
              /* For multiselect if you every time clear the selection.
                 will not have good user experiance
              */
              if(!this.props.enableOptimizedSelection){
              this.clearSelection(this._viewer2d);
              }
              // HSK PLAT-4891: Bug - 3D Text Markup is editable only on creation
              // this.markupManager2d && this.markupManager2d.drawTextOperator.selectTextboxItem(id);
              return;
            }
          
            IafUtils.devToolsIaf && console.log('Viewer.selectionArray.3D'
              , '/id', id
              , '/this.prevSelection', JSON.stringify(this.prevSelection)
              , '/elementId', JSON.stringify(elementId)
            );
                        
            this.handleElementGraphicsSelection(elementId, true)
          },
          sceneReady: () => {
            IafUtils.devToolsIaf && console.log('IafViewer.callbacks.2d.sceneReady'
            );
            let zoomOp = this._viewer2d.operatorManager.getOperator(
              Communicator.OperatorId.Zoom
            );
            //Default changed from 0.25 to 0.04
            zoomOp.setMouseWheelZoomDelta(0.04);

            //set IafZoomOperator as default
            /*this.zoomOperator2d = new IafZoomOperator(this._viewer2d, this);
            this.zoomOperatorId2d = this._viewer2d.registerCustomOperator(this.zoomOperator2d);
            this._viewer2d.operatorManager.set(this.zoomOperatorId2d, 0);
            */
          },
          //Callback function for measurment in 2d viewer
          measurementValueSet: async (m) => {
            const { multiplier } = this.state;
            let mValue = m.getMeasurementValue();
            let uMultiplier = m.getUnitMultiplier();
            let mmUnits = mValue * uMultiplier;
            let newUnitMul = multiplier;
            m.setUnitMultiplier(newUnitMul);
  
            m._measurementValue = mmUnits / newUnitMul;
            m.setMeasurementText(
              Communicator.Util.formatWithUnit(m._measurementValue, newUnitMul)
            );
          },
          // HSK PLAT-4861: UX - Move markup options to under Measurements (Annotations)
          measurementCreated: (measurement) => {
            !this.markupManager2d.repeatLastMode && this._viewer2d.operatorManager.set(this.selectOperator2dId, IafOperatorUtils.IafOperatorPosition.Operation);
          }
        });

        this.props.graphicsResources2d.initKeepAlive();
      });
    }
  }

  logSelectionType(selectionType) {
    let selectionTypeAsString = "Unknown";
    switch (selectionType) {
      case window.Communicator.SelectionType.Face:
        selectionTypeAsString = "SelectionType.Face";
        break;

      case window.Communicator.SelectionType.None:
        selectionTypeAsString = "SelectionType.None";
        break;

      case window.Communicator.SelectionType.Point:
        selectionTypeAsString = "SelectionType.Point";
        break;

      case window.Communicator.SelectionType.Line:
        selectionTypeAsString = "SelectionType.Line";
        break;

      case window.Communicator.SelectionType.Part:
        selectionTypeAsString = "SelectionType.Part";
        break;
        
      default:
        break;
    }

    return selectionTypeAsString;
  }

  getSelectedNodes(viewer, nodeIds) {
    let selectedNodes = [];
    for (var b = 0; b < _.size(nodeIds); ++b) {
      if (this.isSelected(viewer, nodeIds[b])) {
        selectedNodes.push(nodeIds[b]);
      }
    }
    return selectedNodes;
  }
  
  getNonSelectedNodes(viewer, nodeIds) {
    let nonSelectedNodes = [];
    for (var b = 0; b < _.size(nodeIds); ++b) {
      if (!this.isSelected(viewer, nodeIds[b])) {
        nonSelectedNodes.push(nodeIds[b]);
      }
    }
    return nonSelectedNodes;
  }

  getZoomHelper(viewer) {
    return _.isEqual(viewer, this._viewer) ? this._isolateZoomHelper : this._isolateZoomHelper2d;
  }

  is3dViewer(viewer) {
    return _.isEqual(viewer, this._viewer);
  }

  async setNodesFaceColor(viewer, nodeIds, color) {
    IafUtils.devToolsIaf && console.log('IafViewer.setNodesFaceColor'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D", JSON.stringify(nodeIds)
      , '/color', JSON.stringify(color)
    );
    await viewer.model.setNodesFaceColor(nodeIds, bdSelectColor);
  }
  
  async unsetNodesFaceColor(viewer, nodeIds) {
    IafUtils.devToolsIaf && console.log('IafViewer.unsetNodesFaceColor'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D" , JSON.stringify(nodeIds)
    );
    await viewer.model.unsetNodesFaceColor(nodeIds);
  }

  async setNodesLineColor(viewer, nodeIds, color) {
    IafUtils.devToolsIaf && console.log('IafViewer.setNodesLineColor'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D", JSON.stringify(nodeIds)
      , '/color', JSON.stringify(color)
    );
    await viewer.model.setNodesLineColor(nodeIds, bdSelectColor);
  }
  
  async unsetNodesLineColor(viewer, nodeIds) {
    IafUtils.devToolsIaf && console.log('IafViewer.unsetNodesLineColor'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D" , JSON.stringify(nodeIds)
    );
    await viewer.model.unsetNodesLineColor(nodeIds);
  }

  getHighlightMode(selectionHighlightMode) {
    let selectionHighlightModeAsString = "undefined";
    switch (selectionHighlightMode) {
      case window.Communicator.SelectionHighlightMode.HighlightAndOutline:
        selectionHighlightModeAsString = "SelectionHighlightMode.HighlightAndOutline";
        break;

      case window.Communicator.SelectionHighlightMode.HighlightOnly:
        selectionHighlightModeAsString = "SelectionHighlightMode.HighlightOnly";
        break;

      case window.Communicator.SelectionHighlightMode.OutlineOnly:
        selectionHighlightModeAsString = "SelectionHighlightMode.OutlineOnly";
        break;          
        
      default:
        break;
    }
    return selectionHighlightModeAsString;
  }

  selectNodesSilent(viewer, nodeId) {
    const selItem = window.Communicator.Selection.SelectionItem.create(nodeId);
    const highlightNodeSelection = viewer.selectionManager.getHighlightNodeSelection();
    const highlightFaceElementSelection = viewer.selectionManager.getHighlightFaceElementSelection();
    const highlightLineElementSelection = viewer.selectionManager.getHighlightLineElementSelection();
    const highlightPointElementSelection = viewer.selectionManager.getHighlightPointElementSelection();
    viewer.selectionManager.add(selItem, true);
    IafUtils.devToolsIaf && console.log('IafViewer.selectNodesSilent'
      , '/nodeId', nodeId
      , '/selectionItem', JSON.stringify(selItem)
      // , '/highlightNodeSelection', highlightNodeSelection
      // , '/highlightFaceElementSelection', highlightFaceElementSelection
      // , '/highlightLineElementSelection', highlightLineElementSelection
      // , '/highlightPointElementSelection', highlightPointElementSelection
      // , '/nodeSelectionHighlightMode', this.getHighlightMode(viewer.selectionManager.getNodeSelectionHighlightMode())
      // , '/nodeElementSelectionHighlightMode', this.getHighlightMode(viewer.selectionManager.getNodeElementSelectionHighlightMode())
    );  
  }

  unselectNodesSilent(viewer, nodeId) {
    
    if(this.props.enableOptimizedSelection) {
      const selectedNodes = viewer.selectionManager.getResults();
        const nodesToBeDeleted = selectedNodes.filter(x=>x._nodeId === nodeId)
        if(nodesToBeDeleted.length){
          viewer.selectionManager.remove(nodesToBeDeleted, true);
          IafUtils.devToolsIaf && console.log('IafViewer.unselectNodesSilent'
            , '/nodeId', nodeId
          ); 
        }
    } else {
      const selItem = window.Communicator.Selection.SelectionItem.create(nodeId);
      viewer.selectionManager.remove(selItem, true);
      IafUtils.devToolsIaf && console.log('IafViewer.unselectNodesSilent'
        , '/nodeId', nodeId
      );  
    }
  }


  async selectParts(viewer, nodeIds, selectionMode, zoomOnSelection) {

    if (!nodeIds || !viewer) return;

    // Following would create 2 items in the Asset Panel
    // !Array.isArray(nodeIds) && (nodeIds = [nodeIds]);

    IafUtils.devToolsIaf && console.log('IafViewer.selectParts'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D", JSON.stringify(nodeIds)
      , '/zoomOnSelection', zoomOnSelection
    );
    // viewer.selectionManager.clear();
    let nonSelectedNodeIds = this.getNonSelectedNodes(viewer, nodeIds);

    // The nodes being selected might have been hidden my model composer
    this.is3dViewer(viewer) && this.setNodesVisibility(viewer, nodeIds, true, true);

    IafUtils.devToolsIaf && console.log('IafViewer.selectParts'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
      , '/nonSelectedNodeIds', JSON.stringify(nonSelectedNodeIds)
      , '/this.prevSelection', this.prevSelection
    );

    if (nonSelectedNodeIds !== undefined && nonSelectedNodeIds.length > 0) {
      if (selectionMode === window.Communicator.SelectionMode.Set) {
        //ATK: Review if Set needs to be called one by one unlike Add which is added all at once
        for (let p = 0; p < _.size(nonSelectedNodeIds); ++p) {
          // const selectionType = viewer.selectPart(
          //   nonSelectedNodeIds[p],
          //   selectionMode
          // );
          // console.log ('IafViewer.selectParts.selectPart'
          //   , '/selectionMode', 'Set'
          //   , '/selectionType', this.logSelectionType(selectionType)
          // )
          this.selectNodesSilent(viewer, nonSelectedNodeIds[p]);
        }
    } else if (selectionMode === window.Communicator.SelectionMode.Add) {
        // const selectionType = viewer.selectPart(
        //   nonSelectedNodeIds,
        //   selectionMode
        // );
        // console.log ('IafViewer.selectParts.selectPart'
        //   , '/selectionMode', 'Add'
        //   , '/selectionType', this.logSelectionType(selectionType)
        // )

        for (let p = 0; p < _.size(nonSelectedNodeIds); ++p) {
          // if(!this.isSelected(viewer, nonSelectedNodeIds[p])) //ATK: Review this (parent-child nodes)
          {
            // const selectionType = viewer.selectPart(
            //   nonSelectedNodeIds[p],
            //   selectionMode
            // );
            // console.log ('IafViewer.selectParts.selectPart'
            //   , '/selectionMode', 'Add'
            //   , '/selectionType', this.logSelectionType(selectionType)
            // )  
            // const selItem = window.Communicator.Selection.SelectionItem.create(nonSelectedNodeIds[p]);
            // viewer.selectionManager.add(selItem, true);
            // console.log ('IafViewer.unselectParts.add'
            //   , '/nonSelectedNodeIds[p]', nonSelectedNodeIds[p]
            // );
            this.selectNodesSilent(viewer, nonSelectedNodeIds[p]);
          }
        }
      }
    }

    !Array.isArray(nodeIds) && (nodeIds = [nodeIds]);

    // Fetch Asset Node Ids
    let assetNodeIds=[]
    assetNodeIds = await this.graphicsResourceManager(viewer).getNodeIds(this.getSelection(), this.props.idMapping[1]);
    
    // Graphics selection should not override the Asset Selection Node Ids
    // this.prevSelection = id3D;
    if(this.is3dViewer(viewer)){
      // ATK - Review the need of below. This should be automatically driven by the selection color
      await this.setNodesFaceColor(viewer, nodeIds, bdSelectColor);
      await this.setNodesLineColor(viewer, nodeIds, bdSelectColor);
      this.prevSelection = this.props.enableOptimizedSelection
      ? this.props?.sliceElementIds?.length > 0
          ? [...new Set([...assetNodeIds, ...nodeIds])]
          : nodeIds
      : nodeIds.filter(id => this._drawMode !== IafDrawMode.Glass || !assetNodeIds.includes(id));
    } else {
      this.prevSelection2D = this.props.enableOptimizedSelection
          ? nodeIds
          : nodeIds.filter(id => this._drawMode !== IafDrawMode.Glass || !assetNodeIds.includes(id));
    }

    let overlappedNodes = [];
    if (this.is3dViewer(viewer)) {
      overlappedNodes = nodeIds.filter((id) => assetNodeIds.includes(id));
      if (nodeIds.length != this.prevSelection.length) {
        IafUtils.devToolsIaf && console.log('IafViewer.selectParts'
            , 'an overlap found between graphics selection nodes and asset selection nodes'
            , JSON.stringify(overlappedNodes)
        );
      }  
    }

    // Zoom to the previous selection
    if (zoomOnSelection) {
      // const zoomHelper = _.isEqual(viewer, this._viewer) ? this._isolateZoomHelper : this._isolateZoomHelper2d;
      let nodeIdsToZoom = overlappedNodes.length ? overlappedNodes : nodeIds;
      if(this.props.enableOptimizedSelection){
        const selectedNodeIds = this.is3dViewer(viewer) ? this.prevSelection : this.prevSelection2D;
        nodeIdsToZoom = selectedNodeIds.length ? selectedNodeIds : nodeIds;
        
        // PLG-1115: When enableOptimizedSelection is true, CTRL-based multi-selection does not work. 
        // Ensure that already selected items from the selection props are considered along with the current selection.
        await this.getZoomHelper(viewer).fitNodes([...nodeIdsToZoom, ...assetNodeIds]);
      } else {
        await this.getZoomHelper(viewer).fitNodes(nodeIdsToZoom);
      }
      
      IafUtils.devToolsIaf && console.log('IafViewer.selectParts'
        , '/nodeIdsToZoom', JSON.stringify(nodeIdsToZoom)
      );
      // !overlappedNodes.length && this.getZoomHelper(viewer).fitNodes(nodeIds);
      // overlappedNodes.length && this.getZoomHelper(viewer).fitNodes(overlappedNodes);
    }

    // Merge Asset Nodes Into Graphics Selection Nodes // ATK Review if following is required
    // if (assetNodeIds.length > 0) nodeIds = nodeIds.concat(assetNodeIds);
    // let nodeIds_noDuplicates = [...new Set(nodeIds)];
    // if (nodeIds.length != nodeIds_noDuplicates.length) {
    //   console.log ('IafViewer.selectParts duplicates removed'
    //     , 'earlier', JSON.stringify(nodeIds)
    //     , 'now', JSON.stringify(nodeIds_noDuplicates));
    //     nodeIds = nodeIds_noDuplicates;
    // }

    IafUtils.devToolsIaf && console.log('IafViewer.selectParts complete'
      , '/this.prevSelection2D', JSON.stringify(this.prevSelection2D)
      , '/this.prevSelection', JSON.stringify(this.prevSelection)
      , '/this.prevBoundryElements', JSON.stringify(this.prevBoundryElements)
      , '/assetNodeIds', JSON.stringify(assetNodeIds)
    );

  }

  async unselectParts(viewer, nodeIds) {
    IafUtils.devToolsIaf && console.log('IafViewer.unselectParts'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
      , '/nodeIds', JSON.stringify(nodeIds)
    );
    if (nodeIds !== undefined && nodeIds.length > 0) {

      let selectedNodeIds = this.getSelectedNodes(viewer, nodeIds);

      IafUtils.devToolsIaf && console.log('IafViewer.unselectParts'
        , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
        , '/selectedNodes', JSON.stringify(selectedNodeIds)
        , '/this.prevSelection', this.prevSelection
      );
      
      if (selectedNodeIds !== undefined && selectedNodeIds.length > 0) {
        for (let p = 0; p < _.size(selectedNodeIds); ++p) {
          //RRP PLAT-4281 Selection issues with DWG Projects (2D Only Projects)
          //RRP - Previous selection is not necassary as we are already passing them from parent.
          // if(prevSelection.includes(selectedNodeIds[p])) {
            // const selectionType = viewer.selectPart(
            //   selectedNodeIds[p],
            //   window.Communicator.SelectionMode.Toggle
            // );
            // const selItem = window.Communicator.Selection.SelectionItem.create(selectedNodeIds[p]);
            // viewer.selectionManager.remove(selItem, true);
            // console.log ('IafViewer.unselectParts.remove'
            //   , '/selectedNodeIds[p]', selectedNodeIds[p]
            // );  
            this.unselectNodesSilent(viewer, selectedNodeIds[p]);
          // }
        }      
      }

      //RRP - this need to be reviewed below code is not valid as filter value will create new instance and 
      //      will not update the prevSelection.
      //Reset this.prevSelection
      // RRP PLAT-4281 Selection issues with DWG Projects (2D Only Projects)
      // this.is3dViewer(viewer) && (this.prevSelection.filter((nodeId) => !nodeIds.includes(nodeId)));

      this.is3dViewer(viewer) && await this.unsetNodesFaceColor(viewer, nodeIds);
      this.is3dViewer(viewer) && await this.unsetNodesLineColor(viewer, nodeIds);
      let themeColors = await this.getThemeColors(nodeIds, viewer);
      await viewer.model.setNodesColors(themeColors);

      if (viewer === this._viewer &&  viewer.hiddenIds) {
        const filteredArray = nodeIds.filter((value) =>
          viewer.hiddenIds.includes(value)
        );
        if (filteredArray.length > 0)
          await this.setNodesVisibility(viewer, filteredArray, false);
      }

      //ATK - To find out what below exactly does
      if (viewer === this._viewer && nodeIds.length > 0) {
        _.size(this.SpaceElementSet) && IafUtils.devToolsIaf && console.log('IafViewer.unselectParts'
          , '/unselecting any space nodes'
          , JSON.stringify(this.SpaceElementSet)
        );

        for (let i = 0; i < nodeIds.length; i++) {
          if (
            _.size(this.SpaceElementSet) &&
            this.SpaceElementSet.has(nodeIds[i])
          )
            if (this.prevBoundryElements.includes(nodeIds[i])) {
              const index = this.prevBoundryElements.indexOf(
                nodeIds[i]
              );
              if (index > -1) {
                // only splice array when item is found
                this.prevBoundryElements.splice(index, 1); // 2nd parameter means remove one item only
              }

              //check for nodetype
              if (
                //fixed bug the typo from id -> nodeIds[i].
                this._viewer.model.getNodeType(nodeIds[i]) ===
                window.Communicator.NodeType.BodyInstance
              ) {
                let data = await this._viewer.model.getNodeMeshData(
                  nodeIds[i]
                );
                for (let j = 0; j < data.lines.vertexCount / 2 - 1; j++) {
                  await this.setNodeLineVisibility(this._viewer,
                    nodeIds[i],
                    j,
                    false
                  );
                }
              }
            }
        }
      }      
      /* This is to clear the current selected elements as 
         we are considering this values to reconsile 
         it to make sure application is not rerendering
      */
      if(this.props.enableOptimizedSelection){
          const assetNodeIds = await this.graphicsResourceManager(viewer).getNodeIds(this.getSelection());
          if(this.is3dViewer(viewer)){
            this.prevSelection = assetNodeIds.filter(x=> !nodeIds.includes(x))
          } else{
            this.prevSelection2D = assetNodeIds.filter(x=> !nodeIds.includes(x))
          } 
      }
    }

    IafUtils.devToolsIaf && console.log('IafViewer.unselectParts complete'
      , '/this.prevSelection', JSON.stringify(this.prevSelection)
      , '/this.prevBoundryElements', JSON.stringify(this.prevBoundryElements)
      // , '/assetNodeIds', JSON.stringify(assetNodeIds)
    );

  }

  async clearSelection(viewer) {
    if(viewer) {
    if (this.is3dViewer(viewer)) {
      this.unselectParts(viewer, this.prevSelection);
      viewer.selectionManager.clear();
    } else {
      // viewer.view.fitWorld();

      // In case there are assets selected from Asset Panel
      let selItems = viewer.selectionManager.getResults();
      if (selItems.length) {
        viewer.selectionManager.clear();
        this.handleAssetsSelection2d();  
      }
    }

    IafUtils.devToolsIaf && console.log('IafViewer.clearSelection'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
      , '/complete'
    );
  }
  }

  //Both 2d & 3d selections should be in sync
  clearSelectionAll() {
    this.clearSelection(this._viewer);
    this.clearSelection(this._viewer2d);
  }

  logSelection(viewer, nodeIds, logTitle) {
    if (nodeIds !== undefined && nodeIds.length > 0) {
      let selectedArr = [];
      let unselectedArr = [];
      for (let p = 0; p < _.size(nodeIds); ++p) {
          const selected = this.isSelected(viewer, nodeIds[p]);
          selected && selectedArr.push(nodeIds[p]);
          !selected && unselectedArr.push(nodeIds[p]); 
      }
      selectedArr.length && IafUtils.devToolsIaf && console.log(logTitle, JSON.stringify(selectedArr), "true");
      unselectedArr.length && IafUtils.devToolsIaf && console.log(logTitle, JSON.stringify(unselectedArr), "false");
    }  
  }

  isSelected(viewer, nodeId) {
    if(this.props.enableOptimizedSelection){
      const result = viewer.selectionManager.getResults();
      const selected = result.find(x=>x._nodeId === nodeId)
      if (selected) {
        return true;
      }
      return false;
    }else{
      let selectionItem = window.Communicator.Selection.SelectionItem.create(nodeId);
      if (viewer.selectionManager.isSelected(selectionItem)) {
        return true;
      }
      return false;
    }
  }

  setNodeSelectionColor(viewer, bdSelectColor) {
    IafUtils.devToolsIaf && console.log('IafViewer.setNodeSelectionColor'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
      , 'to', JSON.stringify(bdSelectColor)
    );
    viewer.selectionManager.setNodeSelectionColor(bdSelectColor);
  }

  setNodeSelectionOutlineColor(viewer, bdSelectColor) {
    IafUtils.devToolsIaf && console.log('IafViewer.setNodeSelectionOutlineColor'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
      , 'to', JSON.stringify(bdSelectColor)
    );
    viewer.selectionManager.setNodeSelectionOutlineColor(bdSelectColor);
  }

  setNodeElementSelectionColor(viewer, faceSelectColor) {
    IafUtils.devToolsIaf && console.log('IafViewer.setNodeElementSelectionColor'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
      , 'to', JSON.stringify(faceSelectColor)
    );
    viewer.selectionManager.setNodeElementSelectionColor(faceSelectColor);
  }

  setNodeElementSelectionOutlineColor(viewer, lineSelectColor) {
    IafUtils.devToolsIaf && console.log('IafViewer.setNodeElementSelectionOutlineColor'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
      , 'to', JSON.stringify(lineSelectColor)
    );
    viewer.selectionManager.setNodeElementSelectionOutlineColor(lineSelectColor);
  }

  async handleAssetsSelection2d() {
    let assetNodeIds2d = await this.props.graphicsResources2d.getNodeIds(this.getSelection(), this.getActiveIdMapping2d());
    IafUtils.devToolsIaf && console.log('Viewer.handleAssetsSelection2d'
      , '2d asset node ids taking preference over the graphics selection'
      , '/assetNodeIds2d', JSON.stringify(assetNodeIds2d)
    );

    // Don't make it recursive
    // await this.clearSelection(this._viewer2d);
    
    if (_.size(assetNodeIds2d) > 0) {
      // Select the 2D Association
      await this.selectParts(this._viewer2d, assetNodeIds2d, window.Communicator.SelectionMode.Add, 
        this.state.zoomOnSelection); // PLAT-3769: Focus mode should take into account the active state 
      this.logSelection(this._viewer2d, assetNodeIds2d, 'Viewer.selectionArray.2d.handleAssetsSelection2d.logSelection.2d');
      // assetNodeIds2d.length > 1 && this._viewer2d.view.fitWorld();
    } else {
      // this._viewer2d.view.fitWorld(); //Commented this code to avoid zoom out on double click of element in 2d viewer      
    }
  }

  async handleElementGraphicsSelection(elementId, twodim) {
    let id3D = undefined;
    // Get the 3D Nodes
    if(this._viewer){
      id3D = await this.props.graphicsResources.getNodeIds(elementId, this.props.idMapping[1]);

      elementId && !id3D.length && NotificationStore.notifyNo3dAssociationFound(this);

      IafUtils.devToolsIaf && console.log('IafViewer.handleElementGraphicsSelection'
        , '/id3D', id3D
      )
  
      // Boundaries on 3D Elements
      for (let p = 0; p < _.size(id3D); ++p) {
        let id = id3D[p];
        if (this.prevBoundryElements.indexOf(id) === -1)
          this.prevBoundryElements.push(id);
        // if (_.size(this.SpaceElementSet) && this.SpaceElementSet.has(id))
          await this.applyBoundries(id);  
      };
  
      //3D Graphics nodes can be multiselectable in glass mode (this.props?.sliceElementIds > 0)
      let unSelectNodeIds = [...this.prevSelection]
      if(this.props?.sliceElementIds?.length > 0 && this.props.enableOptimizedSelection){
        const assetNodeIds = await this.props.graphicsResources.getNodeIds(this.getSelection());
        unSelectNodeIds = id3D.filter(id => assetNodeIds.includes(id));
        id3D = id3D.filter(id => !assetNodeIds.includes(id));
      }
      // Clear Previous Selection
      await this.unselectParts(this._viewer, unSelectNodeIds);
      this.logSelection(this._viewer, unSelectNodeIds, 'Viewer.selectPackage.logSelection.prevSelection');  
    }else {
      IafUtils.devToolsIaf && console.log('Viewer.handleElementGraphicsSelection'
        , '3D viewer do not exist'
      );
    }
    // Fetch the 2D Association
    let id2D = [];
    if (this._viewer2d) {
      IafUtils.devToolsIaf && console.log('Viewer.handleElementGraphicsSelection'
        , '2D Sheets do exist'
      );
      // id2D = this.getNodeIds(elementId, this.getActiveIdMapping2d());
      id2D = await this.getNodeIds(elementId, this.getActiveIdMapping2d(), this._viewer2d);
      if(id2D.length === 0 && this.state.isSynchronisationActive) {// ATK PLAT-4092: Revise Sync Inactive Sheets with Segmented Sheets
        if (!this.props.graphicsResources2d.csdlEnabled) {
          let targetFloor;
          let targetBatch = this.getNodeIds2d(elementId, this.props.idMapping2d);
          if (targetBatch[0] && targetBatch[0].length
              && targetBatch[1] && targetBatch[1].length
          ) {
            id2D = targetBatch[0][0];

            if(targetBatch[1].length>1) {
              IafUtils.devToolsIaf && console.log("Multiple 2d sheets found for selection.", targetBatch[1])
              NotificationStore.notifyMultiple2dAssociationsFoundInInactiveSheets(this, targetBatch[1]);
            }

            // Set targetFloor as selected floor in sheet
            targetFloor = targetBatch[1][0];
            targetFloor && await this.handleSheetSelection(targetFloor);  
          }
        } else {
          // ATK PLAT-4092: Revise Sync Inactive Sheets with Segmented Sheets
          // This is already handled in graphicsResources2d.getNodeIds
          // If we are still here, 2d association is not found the 3d selection with segmented model
        }
      }

      elementId && !id2D.length && NotificationStore.notifyNo2dAssociationFound(this);
      
      // Clear Previous Selection
      //2D Graphics nodes can be multiselectable in glass mode (this.props?.sliceElementIds > 0)
      let unSelectNodeIds2d = [...this.prevSelection2D]
      if(this.props?.sliceElementIds?.length > 0 && this.props.enableOptimizedSelection){
        const assetNodeIds = await this.getNodeIds(this.getSelection(), this.getActiveIdMapping2d(), this._viewer2d);
        unSelectNodeIds2d = id2D.filter(id => assetNodeIds.includes(id));
        id2D = id2D.filter(id => !assetNodeIds.includes(id));
        //This is hack for 2D any click event happens it is unselection or clearning previously selected node.
        id2D = [...assetNodeIds.filter(x=>!unSelectNodeIds2d.includes(x)), ...id2D]
      }
      await this.unselectParts(this._viewer2d, unSelectNodeIds2d);
      this.logSelection(this._viewer2d, unSelectNodeIds2d, 'Viewer.selectPackage.logSelection.prevSelection2D');  
    } else {
      IafUtils.devToolsIaf && console.log('Viewer.handleElementGraphicsSelection'
        , '2D Sheets do not exist'
      );
    }

    // Fetch Asset Node Ids
    //Can we remove this? As it is not referenced/used any where in function.
    if(!this.props.enableOptimizedSelection){
       let assetNodeIds = [];
       this._drawMode === IafDrawMode.Glass && (assetNodeIds = await this.props.graphicsResources.getNodeIds(this.getSelection(), this.props.idMapping[1]));
    }
    //RRP PLAT-4281 Selection issues with DWG Projects (2D Only Projects)
    //RRP: this will remove simply everything we need to only remove the previous selection.
    // if (this._viewer2d) 
    // await this.clearSelection(this._viewer2d);

    if (_.size(id2D) > 0) {
      IafUtils.devToolsIaf && console.log('Viewer.handleElementGraphicsSelection'
        , '2d element assciation is found'
        , '/id2D', JSON.stringify(id2D)
      );
      // if(!assetNodeIds.length || assetNodeIds.includes(id3D[0]))
      {
        // Select the 2D Association
        await this.selectParts(this._viewer2d, id2D, window.Communicator.SelectionMode.Add, this.state.zoomOnSelection);
        this.logSelection(this._viewer2d, id2D, 'Viewer.handleElementGraphicsSelection.logSelection.2d');
      } 
      // else {
      //   console.log ('Viewer.handleElementGraphicsSelection'
      //     , '2d element assciation is found but skipped'
      //   );
      // }
    }    

    // if (!_.size(assetNodeIds)) { //if asset panel selection is not active
    //   // Clear Previous 2D Selection 
    //   await this.clearSelection(this._viewer2d);
    //   if (_.size(id2D) > 0) {
    //     console.log ('Viewer.selectPackage'
    //       , '2d element assciation is found'
    //     );
    //     // Select the 2D Association
    //     await this.selectParts(this._viewer2d, id2D, window.Communicator.SelectionMode.Add, this.state.zoomOnSelection);
    //     this.logSelection(this._viewer2d, id2D, 'Viewer.selectionArray.logSelection.2d');
    //   } else {
    //     console.log ('Viewer.selectPackage'
    //       , '2d element assciation is not found'
    //     );
    //     this._viewer2d.view.fitWorld();
    //   }  
    // } else {
    //   // this.handleAssetsSelection2d();
    //   await this.clearSelection(this._viewer2d);
    //   // if (twodim) {
    //   //   console.log ('Viewer.selectPackage'
    //   //       , '2d asset node ids taking preference over the graphics selection'
    //   //   );
    //   //   let assetNodeIds2d = this.getNodeIds(this.props.selection, this.getActiveIdMapping2d());
    //   //   await this.clearSelection(this._viewer2d);
    //   //   if (_.size(assetNodeIds2d) > 0) {
    //   //     // Select the 2D Association
    //   //     await this.selectParts(this._viewer2d, assetNodeIds2d, window.Communicator.SelectionMode.Add);
    //   //     this.logSelection(this._viewer2d, assetNodeIds2d, 'Viewer.selectionArray.logSelection.2d');

    //   //     this._viewer2d.view.fitWorld();
    //   //   }
    //   // }
    // }

    // Select the 3D Nodes
    if(this._viewer){
    let ids;
    if(this.props.enableOptimizedSelection){
      ids = id3D
    }else{
      ids = twodim ? id3D : id3D[0]
    }
    id3D.length && await this.selectParts(this._viewer, ids, window.Communicator.SelectionMode.Add, this.state.zoomOnSelection);
    this.logSelection(this._viewer, id3D, 'Viewer.handleElementGraphicsSelection.logSelection.id3D');                    

    // Other formalities
    await this.setNodesVisibility(
      this._viewer,
      this.PrevHiddenElements,
      false
    );    
    }

    //Callback to application consumer.
    this.props.OnSelectedElementChangeCallback(_.uniq(elementId));
  }

  async getNodesByGenericType(viewer, type) {
    const nodeIds = await viewer.model.getNodesByGenericType(type);
    IafUtils.devToolsIaf && console.log('IafViewer.getNodesByGenericType'
      , 'on', _.isEqual(viewer, this._viewer) ? "3D" : "2D"
      , '/type', type
      , '/nodeIds', JSON.stringify(nodeIds)
    );
    return nodeIds;
  }

  getActiveSelectionNodeId(viewer, selectionEvents) {
    let id = undefined;
    if (selectionEvents.length > 0) {
      let latestSelected = selectionEvents[selectionEvents.length - 1];
      let sItem = latestSelected.getSelection();
      id = sItem.getNodeId();
      //Already driving from event selection. so no need to check isSelected.
      if(this.props.enableOptimizedSelection){
        return id;
      }

      if (this.isSelected(viewer, id)) {
        IafUtils.devToolsIaf && console.log('Viewer.getActiveSelectionNodeId'
            , '/id', id
            , 'is already processed in selectionManager, returning'
            , '/this.prevSelection', JSON.stringify(this.prevSelection)
            , '/this.prevSelection2D', JSON.stringify(this.prevSelection2D)
        );
        id = undefined;
      }
    }

    return id;
  }

  /**
   * Refresh 3D fileSet via Graphics Service (same pattern as IafGraphicsResourceManager.build).
   * Clears graphicsResources.viewer / model, 3D session helpers, linked-camera / devTools state,
   * and the setNodesVisibility queue on this instance, then updates graphicsResources.fileSet so a
   * new WebViewer gets a new session id / URLs.
   */
  async refreshGraphicsResources3DFileSet() {
    const gr = this.props.graphicsResources;
    if (!gr || typeof gr.createFileSet !== 'function') {
      console.warn(
        'IafViewer.refreshGraphicsResources3DFileSet: missing graphicsResources.createFileSet'
      );
      return;
    }
    if (!gr.fileSetIn || !gr.fileSetIn.length) {
      console.warn(
        'IafViewer.refreshGraphicsResources3DFileSet: missing fileSetIn; skipping refresh'
      );
      return;
    }
    await IafDisposer.cleanupResourcesByEvmId(
      this,
      EvmUtils.EVMMode.View3d,
      false
    );
    this.setState({ devToolsCamera: null });
    const linked = gr.fileSetInExternal || [];
    IafUtils.devToolsIaf && console.log('IafViewer.refreshGraphicsResources3DFileSet start', {
      csdlEnabled: !!gr.csdlEnabled,
      fileSetInLength: gr.fileSetIn.length,
    });
    try {
      let newFileSet;
      if (gr.csdlEnabled) {
        newFileSet = await gr.createFileSet({
          _files: gr.fileSetIn.slice(0, 1),
          _linkedFiles: [...gr.fileSetIn.slice(1), ...linked],
        });
        if (newFileSet && gr.views && gr.views.length > 1) {
          for (let v = 1; v < gr.views.length; v++) {
            newFileSet._files.push(undefined);
          }
        }
      } else {
        newFileSet = await gr.createFileSet({
          _files: gr.fileSetIn,
          _linkedFiles: linked,
        });
      }
      if (newFileSet) {
        gr.fileSet = newFileSet;
        if (typeof gr.reset === 'function') {
          gr.reset();
        }
        IafUtils.devToolsIaf && console.log(
          'IafViewer.refreshGraphicsResources3DFileSet complete',
          'fileSet._id',
          newFileSet._id
        );
      } else {
        console.warn(
          'IafViewer.refreshGraphicsResources3DFileSet: createFileSet returned undefined'
        );
      }
    } catch (e) {
      console.warn('IafViewer.refreshGraphicsResources3DFileSet failed', e);
    }
  }

  /**
   * Tear down and recreate 3D WebViewer after graphics WebSocket closes.
   * Reuses the same EVM container id as _createViewer (no new canvas host).
   * Shuts down the old WebViewer before refreshing the fileSet so Communicator deferred work
   * (markup/render) does not run after shutdown ("member called after shutdown").
   */
  async recreate3DViewerAfterWebsocketClose() {
    IafUtils.devToolsIaf && console.log('IafViewer.recreate3DViewerAfterWebsocketClose start');
    if (this._viewer) {
      try {
        if (typeof this._viewer.shutdown === 'function') {
          this._viewer.shutdown();
          IafUtils.devToolsIaf && console.log(
            'IafViewer.recreate3DViewerAfterWebsocketClose shutdown completed'
          );
        } else {
          IafUtils.devToolsIaf && console.log(
            'IafViewer.recreate3DViewerAfterWebsocketClose no shutdown(); skipping'
          );
        }
      } catch (e) {
        console.warn(
          'IafViewer.recreate3DViewerAfterWebsocketClose shutdown failed',
          e
        );
      }
    } else {
      IafUtils.devToolsIaf && console.log(
        'IafViewer.recreate3DViewerAfterWebsocketClose no existing _viewer'
      );
    }
    this._viewer = undefined;
    // Let HOOPS drain pending updateLater / markup callbacks before new WebViewer on same container
    // await new Promise((resolve) => setTimeout(resolve, 100));
    await this.refreshGraphicsResources3DFileSet();
    IafUtils.devToolsIaf && console.log(
      'IafViewer.recreate3DViewerAfterWebsocketClose calling _createViewer'
    );
    this._createViewer();
    IafUtils.devToolsIaf && console.log(
      'IafViewer.recreate3DViewerAfterWebsocketClose _createViewer returned (async viewer creation continues)'
    );
  }

  /**
   * @function _createViewer
   * This function creates 3D viewer
   */
  _createViewer() {
    IafUtils.devToolsIaf && console.log('Iaf3DViewer _createViewer');

    // Guard: Ensure all required dependencies are available before creating viewer
    if (!this.props.view3d.enable) {
      console.warn('IafViewer._createViewer: view3d.enable is false');
      return;
    }
    if (!this.props.graphicsResources) {
      console.warn('IafViewer._createViewer: graphicsResources is not available');
      return;
    }
    if (!this.props.model) {
      console.warn('IafViewer._createViewer: model is not available');
      return;
    }
    const gr = this.props.graphicsResources;
    const fileSet =
      gr.fileSet && _.size(gr.fileSet._files) > 0
        ? gr.fileSet
        : this.props.fileSet;
    if (!fileSet || _.size(fileSet) === 0) {
      console.warn('IafViewer._createViewer: fileSet is not available');
      return;
    }

    const { model, authToken, wsUri, settings } = this.props;
    let viewerPromise;
    let streamCutoffScale = 0.5;
    this._viewerInitialized = true;
    if (settings && settings.hasOwnProperty("streamCutoffScale"))
      streamCutoffScale = parseFloat(settings.streamCutoffScale);

    // this.props.openNotification ("The model is being loaded (" + this.props.graphicsResources.views[0].title + ")");
    NotificationStore.notifyModelIsBeingLoaded(this, 0);

    const perfLogger = new IafPerfLogger("IafViewer.defaultView3d");

    // RRP:- Duplicate as it is called from modelStructure ready.
    // this.initalizeModelComposer();

    viewerPromise = this._hwvManager.createRemoteViewer(
      this.evmElementIdManager.getEvmUuid(EvmUtils.EVMMode.View3d),
      model,
      fileSet,
      authToken,
      wsUri,
      streamCutoffScale,
      0,
      this.props.isSingleWsEnabled,
      true, // usePresignedUrl (will be checked against state flag)
      this // iafViewer
    );
    this.isSceneReady = false;

    viewerPromise.then((viewer) => {
      this.websocketConnectionClosed = false;
      this._viewer = viewer;
      this._boundingBoxMarkup = new IafBoundingBoxMarkup(this._viewer);
      this._viewer.graphicsResources = this.props.graphicsResources;
      this.props.graphicsResources.setIafViewer(this, this._viewer);
      this._isolateZoomHelper = new ViewerIsolateZoomHelper(viewer, this);
      setClientTimeout(this._viewer, '3d', 60, 5);

      // Once the viewer is instantiated, we can set the state to true to have the React update the DOM
      this.setState({
        hwvInstantiated: true,
        view3d: { ...this.state.view3d, isLoaded: false }, // PLG-1646: Gis is not considered loaded until view3d is completely loaded if enabled
      }, () => {
        this.logLoadStatus('_createViewer');
      });

      //use our own Select Operator

      this.selectOperator = new SelectOperator(
        this._viewer,
        this._viewer.noteTextManager,
        this
      );
      this.selectOperatorId = this._viewer.registerCustomOperator(
        this.selectOperator
      );
      this.iafCuttingPlanesUtils = new IafCuttingPlanesUtils(this._viewer
                                                        , this.newToolbarElement ? this.newToolbarElement.current : undefined);

      this._viewer.operatorManager.set(this.selectOperatorId, 1);
      this.measurementManager = new IafMeasurementManager(this._viewer,"Measurement3d",this.projectId);
      // Storing the callback in its own function to avoid registering a bound callback
      // (more difficult to unregister that in HC)
      //let parent = this;
      this._viewer.setCallbacks({
        // Add new callbacks at the top, so that they don't accidentally replace the earlier ones
        // HOOPS CallbackMap: assemblyTreeReady before modelStructureReady; info/sheets per docs
        assemblyTreeReady: () => iafAssemblyTreeReady(this, "3d"),
        info: (infoType, message) => iafHoopsInfo(this, "3d", infoType, message),
        sheetActivated: (nodeId) => iafSheetActivated(this, "3d", nodeId),
        sheetDeactivated: () => iafSheetDeactivated(this, "3d"),
        // 10-12-23 ATK MK-149 Added viewer callbacks for error handling
        modelStructureHeaderParsed: (fileName, fileType) =>
          iafModelStructureHeaderParsed(this, "3d", fileName, fileType),
        missingModel: (modelPath) => iafMissingModel(this, "3d", modelPath),
        modelLoadBegin: () => iafModelLoadBegin(this, "3d"),
        modelLoadFailure: (modelName, reason, error) =>
          iafModelLoadFailure(this, "3d", modelName, reason, error),
        modelLoaded: (modelRootIds, source) =>
          iafModelLoaded(this, "3d", modelRootIds, source),
        modelStructureLoadBegin: () => iafModelStructureLoadBegin(this, "3d"),
        modelStructureLoadEnd: () => iafModelStructureLoadEnd(this, "3d"),
        modelStructureParseBegin: () =>
          iafModelStructureParseBegin(this, "3d"),
        modelSwitchStart: (clearOnly) =>
          iafModelSwitchStart(this, "3d", clearOnly),
        modelSwitched: (clearOnly, modelRootIds) =>
          iafModelSwitched(this, "3d", clearOnly, modelRootIds),
        viewLoaded: (markupView) =>
          iafMarkupViewLoaded(this, "3d", markupView),
        timeout: () => iafWebsocketTimeout(this, '3d'),
        timeoutWarning: () => iafWebsocketTimeoutWarning(this, '3d'),
        websocketConnectionClosed: async () => iafWebsocketConnectionClosed(this.props.graphicsResources),
        webGlContextLost: async () => iafWebGlContextLost(this, '3d'),
        subtreeLoaded: (modelRootIds, source) => iafSubtreeLoaded(this, '3d', modelRootIds, source),
        subtreeDeleted: (modelRootIds) => iafSubtreeDeleted(this, '3d', modelRootIds),
        streamingActivated: () => iafStreamingActivated(this, '3d'),
        streamingDeactivated: async () => iafStreamingDeactivated(this, '3d'),
        addCuttingSection: (cuttingSection /* : Communicator.CuttingSection */) =>
          iafAddCuttingSection(this, cuttingSection),
        removeCuttingSection: () => iafRemoveCuttingSection(this),
        cuttingPlaneDragStart: (
          cuttingSection /* : Communicator.CuttingSection */,
          planeIndex /* : number */
        ) => iafCuttingPlaneDragStart(this, cuttingSection, planeIndex),
        cuttingPlaneDragEnd: async (cuttingSection /* : Communicator.CuttingSection */,
                                    planeIndex /* : number */) => {
          // console.log ('IafViewer.Callbacks.cuttingPlaneDragEnd', 
          //               '/cuttingSection', cuttingSection,
          //               '/cuttingSection.planeIndex.logical', cuttingSection.planeIndex.logical,
          //               '/planeIndex', cuttingSection.planeIndex,
          //               '/d', cuttingSection.getPlane(0).d);
          this.iafCuttingPlanesUtils.onDragCuttingPlaneFromGraphics(cuttingSection);

        },
        cuttingPlaneDrag: async (cuttingSection /* : Communicator.CuttingSection */,
                                  planeIndex /* : number */) => {
          // console.log ('IafViewer.Callbacks.cuttingPlaneDrag', 
          //               '/cuttingSection', cuttingSection,
          //               '/cuttingSection.planeIndex.logical', cuttingSection.planeIndex.logical,
          //               '/planeIndex', cuttingSection.planeIndex,
          //               '/d', cuttingSection.getPlane(0).d
          //               );
          this.iafCuttingPlanesUtils.onDragCuttingPlaneFromGraphics(cuttingSection);
        },
        // ATK: To Do: Get rid of the following as it appears redundant
        // sceneReady: () => {
        //   const camera = this._viewer.view.getCamera();
        //   // set saved intial camera position
        //   if (this.props.settings.initialCameraPosition) {
        //     let newCamera = window.Communicator.Camera.fromJson(
        //       this.props.settings.initialCameraPosition
        //     );
        //     this._viewer.view.setCamera(newCamera);
        //   }
        // },
        modelStructureReady: async () => {
          perfLogger.end();
          iafCallbackModelStructureReady(this);
        },
        measurementValueSet: async (m) => {
          const { multiplier } = this.state;
          let mValue = m.getMeasurementValue();
          let uMultiplier = m.getUnitMultiplier();
          let mmUnits = mValue * uMultiplier;
          let newUnitMul = multiplier;
          m.setUnitMultiplier(newUnitMul);

          m._measurementValue = mmUnits / newUnitMul;
          m.setMeasurementText(
            Communicator.Util.formatWithUnit(m._measurementValue, newUnitMul)
          );
        },

        selectionArray: async (selectionEvents) => {
          if (selectionEvents.length === 0) return;

          //selectionEvents only represents the latest select event
          //use viewer.selectionManager.getResults to get current selected nodes
          // or selectionEvents[0]._selection._nodeId

          let id = this.getActiveSelectionNodeId(this._viewer, selectionEvents);
          let elementId = id ? this.getClosestElementIds([id]) : undefined;
          // let csdlOffset = this._viewer.model.getNodeIdOffset(id);

          if (!id || !_.size(elementId)) {
            IafUtils.devToolsIaf && console.log('Viewer.selectionArray.3D'
              , 'Invalid callback'
              , '!id || !_.size(elementId)'
              , '/id', JSON.stringify(id)
              // , '/csdlOffset', csdlOffset
              , '/elementId', JSON.stringify(elementId)
            );
            // HSK PLAT-4891: Bug - 3D Text Markup is editable only on creation
            // this.markupManager && this.markupManager.drawTextOperator.selectTextboxItem(id);
            NotificationStore.notifyNoBimAssociationFound(this);
            return;
          }
        
          IafUtils.devToolsIaf && console.log('Viewer.selectionArray.3D'
            , '/id', id
            , '/this.prevSelection', JSON.stringify(this.prevSelection)
            , '/elementId', JSON.stringify(elementId)
          );
        
          return this.handleElementGraphicsSelection(elementId, false);
        },
        sceneReady: async () => {
          IafUtils.devToolsIaf && console.log('IafViewer.callbacks.sceneReady');
          let camPos, target, upVec;
          /*camPos = new window.Communicator.Point3(0, 200, 400);
          target = new window.Communicator.Point3(0, 1, 0);
          upVec = new window.Communicator.Point3(0.2, 1, 0.5);
          const defaultCam = window.Communicator.Camera.create(
            camPos, target, upVec, 1, 720, 720, 0.01);
          this._viewer.view.setCamera(defaultCam);*/

          // Background color for viewers
          // If GIS is enabled, set background to null to allow GIS to show through
          // Otherwise, set a solid background color
          if (this.state.gis?.enable) {
            this._viewer.view.setBackgroundColor(null);
            // Ensure blendWithIafViewer is called if GIS is already initialized
            if (this.iafMapBoxGl) {
              this.iafMapBoxGl.blendWithIafViewer();
            }
          } else {
            this._viewer.view.setBackgroundColor(
              new window.Communicator.Color(252, 252, 252),
              new window.Communicator.Color(230, 230, 230)
            );
          }

          //check
          // if opacity works
          this.setNodeSelectionColor(this._viewer, bdSelectColor);
          this.setNodeSelectionOutlineColor(this._viewer, bdSelectColor);
          this.setNodeElementSelectionColor(this._viewer, faceSelectColor);
          this.setNodeElementSelectionOutlineColor(this._viewer, lineSelectColor);

          //PLAT-575: turn off parent selecting for now as it's not a helpful feature now
          this._viewer.selectionManager.setSelectParentIfSelected(false);
          //Default draw mode to Shaded rather than WireframeOnShaded
          this._viewer.view.setDrawMode(Communicator.DrawMode.Shaded);
          //if silhouetted edges are enabled, be sure to disable them in glass mode
          this._viewer.view.setSilhouetteEnabled(true);
          // set ambient occlusion mode and radius
          this._viewer.view.setAmbientOcclusionEnabled(true);
          this._viewer.view.setAmbientOcclusionRadius(0.01);
          //this._viewer.view.setBloomEnabled(true)
          //this._viewer.view.setBloomIntensityScale(0.1)
          
          try {
            // Calling initializeOperators to set up navigation operators
            await this.initializeOperators();
            IafUtils.devToolsIaf && console.log('Navigation operators successfully initialized.');
          } catch (error) {
            console.error('Error initializing navigation operators:', error.message);
          }
          
          // if(this._drawMode === IafDrawMode.Glass)
          //   this.setXrayModeSettings()
          
          // object of IafSavedViews class
          this.savedViewsManager = new IafSavedViews();
          // Create Navigation cube
          if(this.props.isShowNavCube || typeof this.props.isShowNavCube  === "undefined"){
            await this._viewer.view.getNavCube().enable();
          await this._viewer.view
            .getNavCube()
            .setAnchor(window.Communicator.OverlayAnchor.LowerRightCorner);
          }
          if (
            this.isElementThemingIdExists(this.props.colorGroups) ||
            this.props?.sliceElementIds?.length > 0
          )
            this.forceUpdateViewerElements = true;

          this.isSceneReady = true;
          IafUtils.devToolsIaf && console.log("Web Viewer has been initialized.");
        },
        timeout: () => {
          IafUtils.devToolsIaf && console.log('IafViewer.callbacks.timeout');
          if (
            window.confirm(
              "This page timed out due to inactivity. Press OK to refresh."
            )
          ) {
            location.reload();
          }
        },
        camera: (camera) => {
          iafCallbackCamera(this, camera);
        },
        // HSK PLAT-4861: UX - Move markup options to under Measurements (Annotations)
        measurementCreated: (measurement) => {
          !this.markupManager.repeatLastMode && this._viewer.operatorManager.set(this.selectOperatorId, IafOperatorUtils.IafOperatorPosition.Operation);
        }
      });
      // window.addEventListener("resize", this.onResize);
      // this.evmElementIdManager.getEvmElementById(EvmUtils.EVMMode.View3d).addEventListener("contextmenu", (e) => contextmenu(e, this));
      // added click listner to close active submenu when clicked on viewer
      // this.evmElementIdManager.getEvmElementById(EvmUtils.EVMMode.View3d).addEventListener("mousedown", (e) => mousedown(this));
      // document.addEventListener("click", (e) => {this.contextMenu.style.display = "none";})

      this.props.graphicsResources?.initKeepAlive();
    });
  }

  _getProperties(latestSelected) {
    let _this = this;
    let model = this._viewer.model;
    let id = latestSelected.getSelection().getNodeId();
    if (id === null || !model.isNodeLoaded(id)) {
      return Promise.resolve();
    }
    let nodeName = model.getNodeName(id);
    model.getNodeProperties(id).then(function (props) {
      _this.setState({ selectedNode: { name: nodeName, properties: props } });
    });
  }

  async closeSettingsModal(isSave) {
    //this.context.ifefShowModal(false)
    if (isSave && this.props.saveSettings) {
      let settings = await this.getSettings();
      this.props.saveSettings(settings);
    }
    if (this._viewer?.focusInput) {
      this._viewer.focusInput(true);
    }
    this.setState({ isShowSettings: false });
  }

  closeMarkupModal() {
    if (!this.state.isShowMarkups) return;
    const manager = this.state.markupHandler.manager
    if (manager.getMode() === IafMarkupManager.InteractionMode.Edit) 
      manager.setMode(IafMarkupManager.InteractionMode.Select);
    this.setState({ 
      isShowMarkups: false,
      markupHandler: {
        ...this.state.markupHandler,
        uuid: null,
        markupItem: null
      }
    });
  }

  showMarkupModal(manager, uuid, markupItem) {
    this.setState({ 
      isShowMarkups: true,
      markupHandler: {
        manager,
        uuid,
        markupItem
      }
    });
  }

  toggleMarkupSubmenu(flag, callback) {
    this.setState({
      showMarkupsContent: flag !== undefined ? flag : !this.state.showMarkupsContent
    }, callback);
  }

  async toggleCuttingPlanesDiv(){
  this.setState({isShowCuttingPlanes:!this.state.isShowCuttingPlanes})
  }

  async toggleGisViewerDiv(){
    this.setState({isShowGisViewer:!this.state.isShowGisViewer})
  }

  async toggleLoadConfigDiv(){
    this.setState({isShowLoadConfig:!this.state.isShowLoadConfig})
  }
  
  async showSettingsModal() {
    //this.context.ifefShowModal(this.settingsModal)
    let settings = await this.getSettings();
    if (
      // this._viewer || this._viewer2d
      true
    ) {
      this.setState({ settings: settings, isShowSettings: true, enableDevTools: IafUtils.debugIaf || IafUtils.devToolsIaf });
    }
  }

  handleChangeSliderTopPlane(topSliderValue) {
    this.setState({
      topSliderValue: topSliderValue,
    });
  }
  handleChangeSliderBottomPlane(bottomSliderValue) {
    this.setState({
      bottomSliderValue: bottomSliderValue,
    });
  }
  handleChangeSliderFrontPlane(frontSliderValue) {
    this.setState({
      frontSliderValue: frontSliderValue,
    });
  }
  handleChangeSliderBackPlane(backSliderValue) {
    this.setState({
      backSliderValue: backSliderValue,
    });
  }
  handleChangeSliderLeftPlane(leftSliderValue) {
    this.setState({
      leftSliderValue: leftSliderValue,
    });
  }
  handleChangeSliderRightPlane(rightSliderValue) {
    this.rightSliderValue = rightSliderValue;
    this.setState({
      rightSliderValue: rightSliderValue,
    });
  }

  /**
   * @function initializeOperators
   * This asynchronous function sets up navigation operators, including walk mode, zoom, orbit, and pan,
   * to setup interactive user experience and control in a 3D environment.
   */
    async initializeOperators(){
      //let zoomOp = this._viewer.operatorManager.getOperator(Communicator.OperatorId.Zoom)
      //Default changed from 0.25 to 0.03
      //zoomOp.setMouseWheelZoomDelta(0.04)
      //zoomOp.setDollyZoomEnabled(true)
      //let navOp = this._viewer.operatorManager.getOperator(Communicator.OperatorId.Navigate)
      //navOp.setBimNavigationEnabled(true)
      const zoomOperatorClass = this.isZoomOptimized ? IafCameraZoomOperator : IafZoomOperator;
      this.zoomOperator = new zoomOperatorClass(this._viewer, this);
      
      this.zoomOperatorId = this._viewer.registerCustomOperator(
        this.zoomOperator
      );
      this.zoomOperator.clearMapping();
      this.zoomOperator.setMapping(Communicator.Button.Middle);
      /*let orbitOp = this._viewer.operatorManager.getOperator(Communicator.OperatorId.Orbit)
      orbitOp.setBimOrbitEnabled(true)
      orbitOp.setPrimaryButton(Communicator.Button.Left)
      //this._viewer.operatorManager.set(Communicator.OperatorId.Orbit, 0)
      */
      //use IafOrbitOperator
      this.orbitOperator = new IafOrbitOperator(this._viewer);
      this.orbitOperatorId = this._viewer.registerCustomOperator(
        this.orbitOperator
      );
      this.orbitOperator.setBimOrbitEnabled(true);
      this.orbitOperator.clearMapping();
      this.orbitOperator.setMapping(Communicator.Button.Right);
      //this._viewer.operatorManager.set(this.orbitOperatorId, 0);

      let panOp = this._viewer.operatorManager.getOperator(
        Communicator.OperatorId.Pan
      );
      panOp.clearMapping();
      panOp.setMapping(Communicator.Button.Left);

      //By default, 6 operators are active, one of which is Navigate (which is a combo of orbit, pan, and zoom)
      //instead we set Orbit + Zoom as default
      //this._viewer.operatorManager.push(this.zoomOperatorId)
      //this._viewer.operatorManager.push(Communicator.OperatorId.Pan)

      this.navOperator = new Communicator.Operator.CameraNavigationOperator(
        this._viewer,
        this.orbitOperator,
        panOp,
        this.zoomOperator
      );
      this.navOperatorId = this._viewer.registerCustomOperator(
        this.navOperator
      );
      // this._viewer.operatorManager.set(this.navOperatorId, 0);
      this._viewer.operatorManager.set(this.navOperatorId, IafOperatorUtils.IafOperatorPosition.Navigation);

      // Walk operators.
      this.mouseWalkOperator = new IafCameraWalkOperator(this._viewer);
      this.mouseWalkOperatorId = this._viewer.registerCustomOperator(
        this.mouseWalkOperator
      );

      this.keyboardWalkOperator = new IafCameraKeyboardWalkOperator(
        this._viewer,
        this.zoomOperator
      );
      this.keyboardWalkOperatorId = this._viewer.registerCustomOperator(
        this.keyboardWalkOperator
      );

      this.walkOperator = new IafCameraWalkModeOperator(
        this._viewer,
        this.mouseWalkOperator,
        this.keyboardWalkOperator
      );
      this.walkOperator.setWalkMode(Communicator.WalkMode.Mouse);
      this.walkOperatorId = this._viewer.registerCustomOperator(
        this.walkOperator
      );
      // set collision detection by default off
      this.walkOperator.setCollisionEnabled(false);
      if (this.props.settings &&  this.props.settings.hasOwnProperty("isCollisionDetection")) {
        this.props.settings.isCollisionDetection = false;
        this.props.saveSettings(this.props.settings);
      }
      //set bim walk by default based on value coming from settings or true
      if (this.props.settings && this.props.settings.hasOwnProperty("isBimWalk")) {
          this.walkOperator.setBimModeEnabled(this.props.settings.isBimWalk);
      }
      else{
        this.walkOperator.setBimModeEnabled(true);
      }
  }

  /**
   * @function toggleVisibilityViewer2d
   * This function toggles 2D viewer size
   */
  toggleVisibilityViewer2d() {
    this.setState({ visible: !this.state.visible });
    // if (this._viewer) this._viewer.resizeCanvas();
    // this._viewer2d.resizeCanvas();
  }

  toggleVisibilityViewer3d() {
    this.setState({ visible3d: !this.state.visible3d });
  } 

  toggleVisibilityArcgis() {
    this.setState({ visibleArcgis: !this.state.visibleArcgis });
  }

  toggleVisibilityArcgisOverview() {
    this.setState({ visibleArcgisOverview: !this.state.visibleArcgisOverview });
  }

  toggleVisibilityUnrealEngine() {
    this.setState({ visibleUnrealEngine: !this.state.visibleUnrealEngine });
  }

  toggleVisibilityPhotosphere() {
    this.setState({ visiblePhotosphere: !this.state.visiblePhotosphere });
  }

  async toggleFocusModeOnWalkModeChange() {
    if (this.state.zoomOnSelection) this.setState({ zoomOnSelection: false });
  }
  
  //Deprecated
  onControlledDragStop = (e, position) => {
    this.setState({ positionOf2DViewer: position });
  };
  handleCtxmenuClick(e, data) {
    IafUtils.devToolsIaf && console.log(data.foo);
  }

  getContextItemIds(includeSelected, includeClicked, includeRoot) {
    if (includeRoot === void 0) {
      includeRoot = true;
    }
    const { _activeLayerName, _activeType, _activeItemId } = this.state;
    let selectionManager = this._viewer.selectionManager;
    let model = this._viewer.model;
    let rootId = model.getAbsoluteRootNode();
    let itemIds = [];
    // selected items
    if (includeSelected) {
      let selectedItems = selectionManager.getResults();
      for (
        let _i = 0, selectedItems_1 = selectedItems;
        _i < selectedItems_1.length;
        _i++
      ) {
        let item = selectedItems_1[_i];
        let id = item.getNodeId();
        if (
          model.isNodeLoaded(id) &&
          (includeRoot || (!includeRoot && id !== rootId))
        ) {
          itemIds.push(id);
        }
      }
    }
    if (_activeLayerName !== null) {
      let layerIds = this._viewer.model.getLayerIdsFromName(_activeLayerName);
      if (layerIds !== null) {
        for (let _a = 0, layerIds_1 = layerIds; _a < layerIds_1.length; _a++) {
          let layerId = layerIds_1[_a];
          let nodeIds = this._viewer.model.getNodesFromLayer(layerId);
          if (nodeIds !== null) {
            for (let _b = 0, nodeIds_1 = nodeIds; _b < nodeIds_1.length; _b++) {
              let nodeId = nodeIds_1[_b];
              let selectionItem =
                window.Communicator.Selection.SelectionItem.create(nodeId);
              if (!selectionManager.contains(selectionItem)) {
                itemIds.push(nodeId);
              }
            }
          }
        }
      }
    }
    if (_activeType !== null) {
      let nodeIds = this._viewer.model.getNodesByIfcType(_activeType);
      if (nodeIds !== null) {
        nodeIds.forEach(function (nodeId) {
          let selectionItem =
            window.Communicator.Selection.SelectionItem.create(nodeId);
          if (!selectionManager.contains(selectionItem)) {
            itemIds.push(nodeId);
          }
        });
      }
    }
    if (_activeItemId !== null) {
      let selectionItem =
        window.Communicator.Selection.SelectionItem.create(_activeItemId);
      let containsParent =
        selectionManager.containsParent(selectionItem) !== null;
      let containsItem = itemIds.indexOf(_activeItemId) !== -1;
      // also include items if they are clicked on but not selected (and not a child of a parent that is selected)
      if (
        includeClicked &&
        (includeRoot ||
          (!includeRoot &&
            _activeItemId !== rootId &&
            (itemIds.length === 0 || (!containsItem && !containsParent))))
      ) {
        itemIds.push(_activeItemId);
      }
    }
    return itemIds;
  }

  transparentCalc(contextItemIds) {
    IafUtils.devToolsIaf && console.log('transparentCalc'
      , '/contextItemIds', JSON.stringify(contextItemIds)
    );
    if (this._transparencyIdHash.get(contextItemIds[0]) === undefined) {
      for (
        let _i = 0, contextItemIds_1 = contextItemIds;
        _i < contextItemIds_1.length;
        _i++
      ) {
        let id = contextItemIds_1[_i];
        this._transparencyIdHash.set(id, 1);
      }
      this._viewer.model.setNodesOpacity(contextItemIds, 0.5);
    } else {
      for (
        let _a = 0, contextItemIds_2 = contextItemIds;
        _a < contextItemIds_2.length;
        _a++
      ) {
        let id = contextItemIds_2[_a];
        this._transparencyIdHash.delete(id);
      }
      this._viewer.model.resetNodesOpacity(contextItemIds);
    }
  }

  async handleIsolate() {
    let arr = [];
    if (this.prevSelection.length > 0) {
        await this._isolateZoomHelper.isolateNodes(this.prevSelection);
      arr.push(this.prevSelection);
    } else {
      if (this.getSelection().length > 0) {
        let id3D = await this.props.graphicsResources.getNodeIds(
          this.getSelection(),
          this.props.idMapping[1]
        );
          await this._isolateZoomHelper.isolateNodes(id3D);
        arr.push(id3D);
      }
    }
    if(arr.length === 0) return;
    let findId = arr[0][0].toString();
    // let pkgId = this.props.idMapping[0][findId];
    let pkgId = this.props.graphicsResources.getPkgId(findId);
    this.IsolateElementSet.push(pkgId);
    this.props.OnIsolateElementChangeCallback ? 
    	this.props.OnIsolateElementChangeCallback(this.IsolateElementSet) : "";
    return Promise.resolve();
  }
  handleGetMarkup() {
    const markupData = JSON.stringify(
      this._viewer.markupManager.exportMarkup()
    );
    IafUtils.devToolsIaf && console.log("Markup", markupData);
    // if (this.prevSelection.length > 0) {
    //   // this._isolateZoomHelper.isolateNodes(this.prevSelection);
    //   // arr.push(this.prevSelection);
    //   let MarkupView= this._viewer.markupManager.getMarkupView(this.prevSelection)//: MarkupView | null
    //  // console.log("Markup",this._viewer.Markup.MarkupView.getMarkup())
    //   console.log("Markup",MarkupView)
    // } else {
    //   if (this.props.selection.length > 0) {
    //     let id3D = this.getNodeIds(
    //       this.props.selection,
    //       this.props.idMapping[1]
    //     );

    //   let MarkupView=  this._viewer.markupManager.getMarkupView(id3D)//: MarkupView | null

    //   //  console.log("Markup",this._viewer.Markup.MarkupView.getMarkup())

    //   }
    // }
  }

  async handleZoom() {
    let arr = [];
    this.ZoomElementSet = [];
    if (_.size(this.ZoomElementSet)) arr = this.ZoomElementSet;
    if (this.getSelection().length > 0) {
      let id3D = await this.props.graphicsResources.getNodeIds(this.getSelection(), this.props.idMapping[1]);
      this._isolateZoomHelper.fitNodes(id3D);
      arr.push(id3D);
    } else {
      if (this.prevSelection.length > 0) {
        this._isolateZoomHelper.fitNodes(this.prevSelection);
        arr.push(this.prevSelection);
      }
    }
    if(arr.length === 0) return;
    let findId = arr[0][0].toString();
    // let pkgId = this.props.idMapping[0][findId];
    let pkgId = this.props.graphicsResources.getPkgId(findId);
    this.ZoomElementSet.push(pkgId);
  }

  handleTransparent() {
    let contextItemIds = this.getContextItemIds(true, true);
    this.transparentCalc(contextItemIds);
  }

  async handleHide() {
    let arr = [];
    if (this.prevSelection.length > 0) {
      this.PrevHiddenElements = this.PrevHiddenElements.concat(
        this.prevSelection
      );
      this._viewer.hiddenIds.concat(this.PrevHiddenElements);
      await this.setNodesVisibility(this._viewer, 
        this.PrevHiddenElements,
        false
      );
      arr.push(this.PrevHiddenElements);
    } else {
      if (this.getSelection().length > 0) {
        let id3D = await this.props.graphicsResources.getNodeIds(
          this.getSelection(),
          this.props.idMapping[1]
        );
        this.PrevHiddenElements = this.PrevHiddenElements.concat(id3D);
        this._viewer.hiddenIds.concat(this.PrevHiddenElements);
        await this.setNodesVisibility(this._viewer, 
          this.PrevHiddenElements,
          false
        );
        arr.push(id3D);
      }
    }
    if(arr.length === 0) return;
    let findId = arr[0][arr[0].length - 1].toString();
    // let pkgId = this.props.idMapping[0][findId];
    let pkgId = this.props.graphicsResources.getPkgId(findId);
    this.HiddenElementSet.push(pkgId);
    this.props.OnHiddenElementChangeCallback(arr);

    if (!this._viewer.hiddenNodeIds) this._viewer.hiddenNodeIds = [];
  

  }

    async handleShowAll() {
      await this._isolateZoomHelper.showAll();
      IafUtils.devToolsIaf && console.log('IafViewer.handleShowAll complete');
      this.PrevHiddenElements = [];
      this.IsolateElementSet = [];
      this.HiddenElementSet = [];
      this.ZoomElementSet = [];
      if (_.size(this._viewer.hiddenNodeIds) > 0) {
        this._viewer.hiddenNodeIds = [];
      }
      return Promise.resolve();
    }

  handleSheetNext() {
    const { sheetIdx, sheetIds } = this.state;
    if (sheetIdx >= sheetIds.length - 1) {
      this._viewer2d.sheetManager.setActiveSheetId(sheetIds[0]);
      this.setState({ sheetIdx: 0 });
    } else {
      let idx = sheetIdx + 1;
      this._viewer2d.sheetManager.setActiveSheetId(sheetIds[idx]);
      this.setState({ sheetIdx: idx });
    }
  }

  handleSheetPrev() {
    const { sheetIdx, sheetIds } = this.state;
    if (sheetIdx === 0) {
      this._viewer2d.sheetManager.setActiveSheetId(
        sheetIds[sheetIds.length - 1]
      );
      this.setState({ sheetIdx: sheetIds.length - 1 });
    } else {
      let idx = sheetIdx - 1;
      this._viewer2d.sheetManager.setActiveSheetId(sheetIds[idx]);
      this.setState({ sheetIdx: idx });
    }
  }
  /**
   * deprecated @function handleMax2d
   * This function changes 2D viewer size to full screen
   *
   */
  handleMax2d() {
    const { positionOf2DViewer } = this.state;
    var MinButtonstate = this.state.isMinUiButtonActive;
    this.setState({ isMinUiButtonActive: false });
    var doc = this.evmElementIdManager.getEvmElementById(EvmUtils.EVMMode.View2d);
    var main2DViewer = document.getElementById(this.evmElementIdManager.getEvmUuid(EvmUtils.EVMMode.View2d));
    var positionWRTVieweport = main2DViewer.getBoundingClientRect();
    var mainViewer = this.evmElementIdManager.getEvmElementById(EvmUtils.EVMMode.View3d);
    if (!stateOf2DViewer || MinButtonstate) {
      if (MinButtonstate) {
        doc.style.left = -positionWRTVieweport.x + 84 + "px";
        doc.style.top = -positionWRTVieweport.y + 40 + "px";
        doc.style.width = mainViewer.clientWidth * 2 + "px";
        doc.style.height = mainViewer.clientHeight + "px";
        mainViewer.style.width = mainViewer.clientWidth * 2 + "px";
        // mainViewer.style.left = -positionWRTVieweport.x + 84 + 'px';
        mainViewer.style.left = "0px";
      } else {
        doc.style.left = -positionWRTVieweport.x + 84 + "px";
        doc.style.top = -positionWRTVieweport.y + 40 + "px";
        doc.style.width = mainViewer.clientWidth + "px";
        doc.style.height = mainViewer.clientHeight + "px";
      }
      this.setState({ isMaxUiButtonActive: true });
      stateOf2DViewer = true;
    } else {
      doc.style.left = positionOf2DViewer.x + "px";
      doc.style.top = positionOf2DViewer.y + "px";
      doc.style.width = 312 + "px";
      doc.style.height = 243 + "px";

      this.setState({ isMaxUiButtonActive: false });
      stateOf2DViewer = false;
    }
    this._viewer2d.resizeCanvas();
    if (this._viewer !== undefined) this._viewer.resizeCanvas();
  }

  isElementThemingIdExists(colorGroups) {
    if (colorGroups) {
      if (colorGroups.length === 0) return false;
      for (let i = 0; i < colorGroups.length; i++) {
        let colors = colorGroups[i].colors;
        if (colors !== null && colors !== undefined) {
          for (let j = 0; j < colors.length; j++) {
            if (colors[j].elementIds && colors[j].elementIds.length > 0)
              return true;
          }
        }
      }
    }
    return false;
  }
  /**
   * deprecated @function handleMin2d
   *  This function changes 2D viewer div to original size
   */
  handleMin2d() {
    const { positionOf2DViewer } = this.state;
    var MaxButtonstate = this.state.isMaxUiButtonActive;
    this.setState({ isMaxUiButtonActive: false });
    var doc = this.evmElementIdManager.getEvmElementById(EvmUtils.EVMMode.View2d);
    var main2DViewer = document.getElementById(this.evmElementIdManager.getEvmUuid(EvmUtils.EVMMode.View2d));
    var mainViewer = this.evmElementIdManager.getEvmElementById(EvmUtils.EVMMode.View3d);
    var positionWRTVieweport = main2DViewer.getBoundingClientRect();
    if (!stateOf2DViewer || MaxButtonstate) {
      doc.style.left = -positionWRTVieweport.x + 84 + "px";
      doc.style.top = -positionWRTVieweport.y + 40 + "px";
      doc.style.width = mainViewer.clientWidth / 2 + "px";
      doc.style.height = mainViewer.clientHeight + "px";
      mainViewer.style.left = mainViewer.clientWidth / 2 + "px";
      mainViewer.style.width = doc.style.width;

      this.setState({ isMinUiButtonActive: true });
      stateOf2DViewer = true;
    } else {
      mainViewer.style.width = doc.clientWidth * 2 + "px";
      mainViewer.style.left = 0 + "px";
      doc.style.left = positionOf2DViewer.x + "px";
      doc.style.top = positionOf2DViewer.y + "px";
      doc.style.width = 312 + "px";
      doc.style.height = 243 + "px";

      this.setState({ isMinUiButtonActive: false });
      stateOf2DViewer = false;
    }
    this._viewer2d.resizeCanvas();
    if (this._viewer) this._viewer.resizeCanvas();
  }
  handleZoomIn(e) {
    var camera = this._viewer2d.view.getCamera();
    var zoomop = this._viewer2d.operatorManager.getOperator(
      Communicator.OperatorId.Zoom
    );
    var wheel = new Communicator.Event.MouseWheelInputEvent();
    wheel._wheelDelta = zoomLevel2D;
    zoomop.onMousewheel(wheel);
  }
  handleZoomOut(e) {
    var zoomop = this._viewer2d.operatorManager.getOperator(
      Communicator.OperatorId.Zoom
    );
    var wheel = new Communicator.Event.MouseWheelInputEvent();
    wheel._wheelDelta = -zoomLevel2D;
    zoomop.onMousewheel(wheel);
  }

  toggleMenu(e) {
    if (this.contextTrigger) {
      this.contextTrigger.handleContextClick(e);
    }
  }

  async bcfTest() {
    const { topics } = this.props;
    if (!topics) return;
    IafUtils.devToolsIaf && console.log("Generate BCF Results");

    let bcfData = this._viewer.BCFManager.createBCFData("bcf-results");

    let bcfDataId = bcfData.getId();
    let bcfFilename = bcfData.getFilename();

    let markupView = this._viewer.markupManager.getActiveMarkupView();
    let index = 1;
    for (const t of topics) {
      if (!t) continue;
      IafUtils.devToolsIaf && console.log(t.title, t.description);
      let topicId = Communicator.UUID.create();
      let topic = await Communicator.BCFTopic.createTopic(
        this._viewer,
        bcfDataId,
        bcfFilename,
        t.title,
        markupView
      );
      bcfData.addTopic(topicId, topic); // create markup for this new topic

      let markup = topic.getMarkup();
      markup.setTopicType(t.type);
      markup.setTopicStatus(t.status);
      markup.setTopicPriority(t.priority);
      markup.setTopicIndex(index++);
      markup.setTopicCreationAuthor(t.author);
      markup.setTopicDueDate(t.dueDate);
      markup.setTopicAssignedTo(t.assignedTo);
      markup.setTopicDescription(t.description);

      markup._topic.guid = topicId; // create viewpoint for this topic  -- TODO: HACK ALERT!!! - can't find API for this

      let ifcGuids = t.idMapping.map((f) => sourceIdToIfcGuid(f.source_id));
      let packageIds = t.idMapping.map((f) => f.id); // first, set viewer selection to failure elements before creating snapshot

      // this._viewer.selectionManager.clear();
      this.clearSelection(this._viewer);

      // let ids = this.getNodeIds(packageIds, this._viewer);
      let ids = await this.props.graphicsResources.getNodeIds(packageIds, this._viewer);

      if (ids && ids.length > 0) {
        for (let id of ids) {
          this._viewer.selectPart(id, window.Communicator.SelectionMode.Add);
        }

        //await this._viewer.model.setNodesFaceColor(ids, bdSelectColor);
        await this._isolateZoomHelper.fitNodes(ids);
      }

      let viewpointId = Communicator.UUID.create();
      let image = await this._viewer.takeSnapshot();
      let snapshotFilename = viewpointId + ".png";
      let snapshot = Communicator.BCFSnapshot.createFromImage(
        snapshotFilename,
        image
      );
      topic.setSnapshot(snapshotFilename, snapshot);
      let viewpointFilename = viewpointId + ".bcfv";
      let viewpoint = await Communicator.BCFViewpoint.createViewpoint(
        this._viewer,
        viewpointFilename
      );
      viewpoint.setSelection(ifcGuids);
      viewpoint.setDefaultVisibility(false);
      viewpoint.setVisibilityExceptions(ifcGuids);
      topic.setViewpoint(viewpointFilename, viewpoint);
      markup.addViewpoint(viewpointId, viewpointFilename, snapshotFilename);
    }

    IafUtils.devToolsIaf && console.log("exporting the bcf");
    bcfData.exportBCF(bcfFilename);
  }
  
  /* After 2d sheet switched slice/remove the selected elements in 2d sheet. 
     and select if any node is matching. 
  */
  async selectAndSlice2DSheet() {
    if(this.props.enableOptimizedSelection){
      if(this.props?.sliceElementIds?.length > 0){
        const slicedNodeIds = await this.graphicsResourceManager(this._viewer2d).getNodeIds(this.props?.sliceElementIds);
        await this.applySliceElements(this._viewer2d, slicedNodeIds)
      } else {
        await this.unselectParts(this._viewer2d, this.prevSelection2D)
        await this.removeSliceElements(this._viewer2d, [])
      }
      await this.handleAssetsSelection2d()
    }
  }
  
  async handleSheetSelection(targetFloor) {
    const { sheetIdx, sheetIds, sheetNames } = this.state;
    let index = 0;
    for (let i = 0; i < sheetNames.length; i++) {
      if (sheetNames[i] === targetFloor) {
        index = i;
        break;
      }
    }
    await this._viewer2d.sheetManager.setActiveSheetId(sheetIds[index]);
    if(!this.props.enableOptimizedSelection){
      this.clearSelectionAll();
      this.forceUpdateViewerElements = true;
      this.forceUpdate2DViewerElements = true;
    }
    this.setState({ sheetIdx: index });
    this.props.graphicsResources2d && this.props.graphicsResources2d.csdlEnabled && this.setState({enableSheetSwitch: false});
    this.props.graphicsResources2d && this.props.graphicsResources2d.csdlEnabled && loadSheet(this, index);
    //This if for IPUT 4.2Ish project. 
    if(this.props.enableOptimizedSelection){
      this.props.graphicsResources2d && !this.props.graphicsResources2d.csdlEnabled && this.selectAndSlice2DSheet();
    }
  }
  // This function is used to convert units of measurment according to viewer
  handleUnitConversion(viewer,multiplier) {
    let allMeasurements = viewer ? viewer.measureManager.getAllMeasurements() : [];
    for (let i = 0; i < allMeasurements.length; i++) {
      let mValue = allMeasurements[i].getMeasurementValue();
      let uMultiplier = allMeasurements[i].getUnitMultiplier();
      let mmUnits = mValue * uMultiplier;
      let newUnitMul = multiplier;
      allMeasurements[i].setUnitMultiplier(newUnitMul);
      allMeasurements[i]._measurementValue = mmUnits / newUnitMul;
      allMeasurements[i].setMeasurementText(
        Communicator.Util.formatWithUnit(
          allMeasurements[i]._measurementValue,
          newUnitMul
        )
      );
    }
  }

  bcfTestSimple = async () => {
    //console.log("BCF Test");

    IafUtils.devToolsIaf && console.log("creating bcf data");
    let bcfData = this._viewer.BCFManager.createBCFData("example");

    IafUtils.devToolsIaf && console.log("creating a topic");
    let bcfDataId = bcfData.getId();
    let bcfFilename = bcfData.getFilename();
    let topicId = Communicator.UUID.create();
    let markupView = this._viewer.markupManager.getActiveMarkupView();
    let topic = await Communicator.BCFTopic.createTopic(
      this._viewer,
      bcfDataId,
      bcfFilename,
      "Scooby Snacks",
      markupView
    );

    IafUtils.devToolsIaf && console.log("adding the topic to bcf data");
    bcfData.addTopic(topicId, topic);

    IafUtils.devToolsIaf && console.log("creating markup for the topic");
    let creationDate = new Date();
    let markup = topic.getMarkup();
    markup.setTopicType("Issue");
    markup.setTopicStatus("Active");
    markup.setTopicPriority("Normal");
    markup.setTopicIndex(1);
    markup.setTopicCreationAuthor("Scooby Doo");
    markup.setTopicDueDate(
      new Date(creationDate.getTime() + 1000 * 60 * 60 * 24 * 7)
    );
    markup.setTopicAssignedTo("Shaggy");
    markup.setTopicDescription("Mmmm, love those snacks");
    // TODO: HACK ALERT!!! - can't find API for this
    markup._topic.guid = topicId;

    IafUtils.devToolsIaf && console.log("adding default viewpoint to topic");
    let viewpointId = Communicator.UUID.create();
    let viewpoint = topic.getViewpoint("viewpoint.bcfv");
    markup.addViewpoint(viewpointId, "viewpoint.bcfv", "snapshot.png");

    IafUtils.devToolsIaf && console.log("setting selection");
    viewpoint.setSelection(["foo"]); // <-- just junk for now - just want to see it appear in output bcf file.

    IafUtils.devToolsIaf && console.log("adding a comment");
    let comment = markup.addComment(
      creationDate,
      "Scooby Doo",
      "Where are the snacks?"
    );
    comment.setViewpointGuid(viewpointId);

    IafUtils.devToolsIaf && console.log("exporting the bcf");
    IafUtils.devToolsIaf && console.log(bcfData);
    bcfData
      .exportBCF(bcfFilename)
      .then((a, b, c, d) => IafUtils.devToolsIaf && console.log(a, b, c, d));

    IafUtils.devToolsIaf && console.log("finished BCF Test");
  };

  render() {
    // console.log ('IafViewer.render', this.props);

    //Since iOS 13, we can't detect if a Safari is from iOS or Mac by userAgent,
    //the only way is to check TouchPoints where on Mac it's 0 and on iPad Pro it's 5
    //maxTouchPoints is supported by all browsers, but in Safari, only in render() (after it's rendered).
    //not available as a global variable.
    const isTablet = navigator.maxTouchPoints > 1;
    const { isShowSettings, isContextDisabled } = this.state;

    return  <div id={this.evmElementIdManager.getEvmElementUuidIafContainer()} className={styles["iaf-container"]}>
        {this.state.hwvInstantiated  && this._viewer && this.state.showModelViewer && <HoopsViewer viewer={this._viewer} visible={this.state.showModelViewer} iafViewer={this} />}
        <IafCanvasElement 
          iafViewer={this} 
          graphicsHandler={this.props.graphicsHandler} 
          graphicsResources={this.props.graphicsResources} 
          graphicsResources2d={this.props.graphicsResources2d} 
          models={this.props.models}
        />
  </div>;
  }
}

IafViewer.contextTypes = {
  ifefShowModal: PropTypes.func,
};

export default IafViewer;

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

const IFCBASE64CHARS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$";

function guidToIfcGuid(guid) {
  const cv_to_64 = (number, result, start, len) => {
    if (len > 4) throw new Error("len too long");
    let act = number,
      nDigits = len;
    for (let iDigit = 0; iDigit < nDigits; iDigit++, act = Math.floor(act / 64))
      result[start + len - iDigit - 1] = IFCBASE64CHARS[act % 64];
    if (act >= 1) throw new Error("Logic failed, act was not null: " + act);
  };

  let g = guid.replace(/\-/g, "");
  let num = [
    Math.floor(parseInt(g.substr(0, 8), 16) / 16777216),
    parseInt(g.substr(0, 8), 16) % 16777216,
    Math.floor(
      parseInt(g.substr(8, 4), 16) * 256 + parseInt(g.substr(12, 4), 16) / 256
    ),
    (parseInt(g.substr(12, 4), 16) % 256) * 65536 +
      parseInt(g.substr(16, 4), 16),
    parseInt(g.substr(20, 6), 16),
    parseInt(g.substr(26), 16),
  ];
  let n = 2,
    pos = 0,
    str = [];
  for (let i = 0; i < 6; i++) {
    cv_to_64(num[i], str, pos, n);
    pos += n;
    n = 4;
  }
  return str.join("");
}

function sourceIdToGuid(sourceId) {
  let guid = sourceId.substring(0, 36);
  let guidStart = guid.substring(0, 28);
  let guidEnd = guid.substring(28);
  let elementId = sourceId.substring(37);
  guidEnd = (parseInt(guidEnd, 16) >>> 0) ^ (parseInt(elementId, 16) >>> 0);
  guidEnd = guidEnd >>> 0;
  guidEnd = guidEnd.toString(16);
  return guidStart + guidEnd;
}

function sourceIdToIfcGuid(sourceId) {
  return guidToIfcGuid(sourceIdToGuid(sourceId));
}