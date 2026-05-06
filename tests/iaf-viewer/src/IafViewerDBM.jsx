/**
 * ****************************************************************************
 *
 * INVICARA INC CONFIDENTIAL __________________
 *
 * Copyright (C) [2012] - [2020] INVICARA INC, INVICARA Pte Ltd, INVICARA INDIA
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
// 26-04-23    HSK        PLAT-2727   Added toolbar size property to IafViewer Object so that we can 
//                                    create toolbar according to received size from app   
// 31-05-23    ATK        PLAT-2740   Handle the asynchronous model load apis
//                                    in the correct sequence in loadModelInfo
// 13-06-23    HSK        PLAT-2728   Revamped IafViewer Coloring Mechanism
// 14-06-23    ATK        PLAT-2728   Introduced PropertyStore
//             ATK        PLAT-2728   Sidepanels did not launch when toolbarSize was not set from app side
//                                    Refer to PropertyStore for toolbarSize and showTooltip to consider undefined case
// 01-08-23    ATK        PLAT-3117   Selection and highlighting enhancements
// 13-07-23    HSK                    Created a function to update toolbar
// 21-07-23    HSK                    Creaed a flag in toolist to determine dragging enable/disable
// 09-08-23    HSK                    Introduced callback function on 2d,3d and default menu selection
// 10-08-23    HSK                    Revamped code of updateNewToolbar
// 01-09-23    HSK                    Added new toolcolumn 'manipulateList' and functionality related to it
// 01-09-23    HSK                    Passed showNotification flag to IafViewer
// 01-09-23    HSK                    Added Callback function for iafNotification
// 22-Oct-23   ATK        PLAT-2414   Performance - CSDL - On Demand
//                                    Read Layers Info
// 23-Oct-23   ATK        PLAT-3420   Graphics Database - Added GraphicsDbLoadConfig
// 22-11-23    HSK                    Added IafNotification component and it's related function,states 
// 28-Nov-23   ATK        PLAT-3585   Productise 2D Sheets CSDL. 
// 10-01-24    RRP        PLAT-3917   Introduce a new IafViewer property enableFocusMode
// 05-01-23    HSK        PLAT-3656   Allow IAFViewerDBM commands to control and track show/hide of 2D viewer
// 08-01-24    HSK        PLAT-3834   Added JSDocumentation comment for openNotification function
// 18-01-24    RRP        PLAT-4001   Property Store | modelVersionId to load the specified model version | Latest version by default as it happens now
// 18-01-24    ATK        PLAT-4001   Merge modelVersionId changes into GraphicsDb
// 23-02-24    RRP        PLAT-4069   IafViewer Callback Property OnSelectedElementChangeCallback should return PackageId(ElementId)
// 04-03-24    RRP                    Introduced IafNotificationRef Component
// 14-MAR-24   ATK        PLAT-4283   Add missing Progress Spinners | Consume IafSpinner
// 30-APR-24   RRP        PLAT-4607   Review if loadModelInfo can further be made performant
// -------------------------------------------------------------------------------------

/*
IafViewerDBM properties
  model: model NamedCompositeItem containing _id. _name and _namespaces
  ref:
  sliceElementIds: if some sliceElementIds is passed in, model will be default to glass mode
  selection: selected elements
  hiddenElementIds: hidden elements
  serverUri: Item Service & also will be used as Graphics Service location by switch protocal to wss, sample: 'https://general-dev.invicara.com'
  settings:
  saveSettings: callback to save settings. Parameter: settings
  viewerResizeCanvas: a flag to tell the viewer it needs to resize the canvas when the size of container of the viewer is changed
  colorGroups:
  btns:
  topics:
 */

import React from 'react';
import { IafFileSvc, IafSession, IafItemSvc, IafGraphicsSvc, IafFetch, IafProj } from '@dtplatform/platform-api'
import _ from 'lodash-es'
import PropertyStore from './store/propertyStore.js'
import { mergeGisProperties } from './common/propertyUtils.js'
import { IafModelComposition } from './core/IafModelComposition.js';
import { ToolBarConfig } from './ui/toolbar.js'
import IafGraphicsResourceManager, { IafGraphicsResourceManager2d, IafGraphicsResourceHandler } from './core/IafGraphicsResourceManager.js';
import { GraphicsDbLoadConfig, GraphicsDbGeomViews, GraphicsDbRevitElementProps } from './core/database.js';
import IafNotification from './ui/component-low/iafNotification/IafNotification.jsx';
import { NotificationStore } from './store/notificationStore.js';
import { IafNotificationRef } from "./ui/component-low/iafNotification/IafNotificationRef.js"
import { IafConfirmDialogRef } from "./ui/component-low/iafConfirmDialog/IafConfirmDialogRef.js"
import IafSpinner from './ui/component-low/IafSpinner/IafSpinner.jsx';
import { useLogChangedPropertiesForClass } from './common/hooks/useLogChangedProperties.jsx';
import IafViewer from './IafViewer.jsx'
import { IafResourceUtils } from './core/IafResourceUtils.js';
import { IafLegacy } from './core/IafLegacy.js';
import IafUtils, { IafObjectUtils, IafPerfLogger, IafProjectUtils, IafStorageUtils } from './core/IafUtils.js';
import { ModelContext } from "./IafContextApi.js";
import { permissionManager } from './core/database/permission/iafPermissionManager.js';
import IafSpinnerManager from './core/IafSpinnerManager.js';
import { IafDisposer } from './core/IafDisposer.js';
import EvmUtils from './common/evmUtils.js';
  
/**
 * @module IafViewerDBM 
 * This class is wrapper for iafViewer 
 */
class IafViewerDBM extends React.Component {
  constructor(props) {
    super(props);
    console.log ('IafViewerDBM.constructor', props.title);
    this.iafNotificationRef = React.createRef();
    this.confirmDialogRef = React.createRef();
    this.state = {
      scriptLoadedCommunicator: false,
      snackbarDuration: null,
      snackbarMessage : " ",
      isModelLoaded: false,
      is2dModelLoaded: false,
      units: undefined,
      idMapping: [],
      idMappingSet: [],
      idMapping2d: [],
      toolbarList: ToolBarConfig.toolbarList,
      viewList:ToolBarConfig.viewList,
      shadingList:ToolBarConfig.shadingList,
      navigationList:ToolBarConfig.navigationList,
      measurementList:ToolBarConfig.measurementList,
      manipulateList : ToolBarConfig.manipulateList,
      authToken: null,
      models: [],
      selectedModel: null,
      permissionsInitialized: false,
      isSingleWsEnabled: false,
      enablePreSignedUrls: false,
      graphicsHandler: null,
      fileSet: null,
      fileSet2d: null
    }
    this.showNotification = this.props.showNotification !==undefined  ? this.props.showNotification : PropertyStore.showNotification
    this.graphicsServiceOrigin =  props.serverUri ;

    if (!props.serverUri) {
      console.warn("IafViewerDBM.constructor", this.props.title, "No Graphics Service URI provided");
      return;
    }
    this.isFirstLoad = true

    if (IafUtils.localGraphicsSvc) {
      this.graphicsServiceOrigin = "http://localhost:11182";
    }

    console.log ('IafViewerDBM.constructor', this.props.title, '/graphicsServiceOrigin', this.graphicsServiceOrigin);

    if (props.serverUri) {
      IafSession.setConfig({
        itemServiceOrigin: props.serverUri,
        passportServiceOrigin: props.serverUri,
        fileServiceOrigin: props.serverUri,
        datasourceServiceOrigin: props.serverUri,
        graphicsServiceOrigin: this.graphicsServiceOrigin,
      })
    }
    this.iafviewerRef = React.createRef()

    //callback functions
    this.OnIsolateElementChangeCallback = this.OnIsolateElementChangeCallback.bind(this);
    this.OnSelectedElementChangeCallback = this.OnSelectedElementChangeCallback.bind(this);
    this.OnResetCallback = this.OnResetCallback.bind(this);
    this.OnHiddenElementChangeCallback = this.OnHiddenElementChangeCallback.bind(this);
    this.On2dToolbarConfigCallback = this.On2dToolbarConfigCallback.bind(this);
    this.On3dToolbarConfigCallback = this.On3dToolbarConfigCallback.bind(this);
    this.OnDefaultToolbarConfigCallback = this.OnDefaultToolbarConfigCallback.bind(this);
    this.updateNewToolbar = this.updateNewToolbar.bind(this);
    this.OnNotificationCallback = this.OnNotificationCallback.bind(this);
    this.OnViewerReadyCallback = this.OnViewerReadyCallback.bind(this);
    this.OnModelCompositionReadyCallback = this.OnModelCompositionReadyCallback.bind(this);
    this.OnGisIafMapReady = this.OnGisIafMapReady.bind(this);
    this.OnGisFederatedModeChanged = this.OnGisFederatedModeChanged.bind(this);
    this.OnGisReferenceModelChanged = this.OnGisReferenceModelChanged.bind(this);
    this.OnGisElevationModeChanged = this.OnGisElevationModeChanged.bind(this);
    this.OnGisModelSelect = this.OnGisModelSelect.bind(this);
    this.OnGisOutlineLoaded = this.OnGisOutlineLoaded.bind(this);
    this.OnGisLongitudeChange = this.OnGisLongitudeChange.bind(this);
    this.OnGisLatitudeChange = this.OnGisLatitudeChange.bind(this);
    this.OnGisBearingChange = this.OnGisBearingChange.bind(this);
    this.OnGisAltitudeChange = this.OnGisAltitudeChange.bind(this);
    this.OnArcgisEventHandler = this.OnArcgisEventHandler.bind(this);
    this.OnArcgisIafMapReady = this.OnArcgisIafMapReady.bind(this);
    this.OnUeEventHandler = this.OnUeEventHandler.bind(this);
    this.OnUeReady = this.OnUeReady.bind(this);
    this.OnView3dRenderingModeChange = this.OnView3dRenderingModeChange.bind(this);
    this.OnView3dCameraUpdateCallback = this.OnView3dCameraUpdateCallback.bind(this);
    this.openNotification = this.openNotification.bind(this);
    this.closeNotification = this.closeNotification.bind(this)
    //DBM-1003: control these as local variables instead of state variables
    //because render() has been called too many times whenever there's a change in
    //props (like model) or states
    this._fileSet = []
    this._fileSet2d = []
    this._model = undefined
    this._backendVersionPromise = null // Shared promise for backend version initialization
  
    // IafUtils.devToolsIaf && console.clear();

    this.handleModelSelection = this.handleModelSelection.bind(this);
  }

  /**
   * Fetches graphics service version via IafGraphicsSvc.getStatus() and returns major/minor.
   * @returns {Promise<{ major: number, minor: number } | null>} version object or null on error
   */
  async getGraphicsServiceVersion() {
    if (!this.graphicsServiceOrigin) return null;
    try {
      const res = await IafGraphicsSvc.getStatus();
      const versionStr = res?.version || '';
      const match = versionStr.match(/(\d+)\.(\d+)(?:\.(\d+))?/);
      if (!match) return null;
      return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10)
      };
    } catch (err) {
      console.warn('IafViewerDBM.getGraphicsServiceVersion', 'failed to fetch graphics status', err?.message || err);
      return null;
    }
  }

  /**
   * Opens a notification with the specified message, duration, and severity.
   * @param {string} message - The message to be displayed in the notification.
   * @param {number} duration - The duration (in milliseconds) for which the notification should be visible.
   * @param {'error' | 'warning'} [severity] - The severity of the notification (error or warning). Optional.
   * @returns {void}
  */
  openNotification(message,duration,severity){
    // if(this.state.snackbarMessage !== message || this.state.isSnackbarOpen === false){
    //   this.setState({isSnackbarOpen:true, snackbarMessage:message,snackbarDuration:duration,severity:severity})
    // }
    //RRP: Isolated the notification component to avoid unnecessary rerender.
    if(this.iafNotificationRef?.current){
      this.showNotification && this.iafNotificationRef.current.openNotification(message,duration,severity);
      this.OnNotificationCallback(message);
    }
  }
  
  //closesnackbar
  closeNotification(){
    // this.setState({isSnackbarOpen :false})
    if(this.iafNotificationRef?.current){
      this.showNotification && this.iafNotificationRef.current.closeNotification();
    }
  }

  /**
   * Programmatic confirm dialog (IafConfirmDialogRef). Passed to IafViewer for callbacks (e.g. websocket reconnect).
   * Maps confirmText/cancelText to confirmLabel/cancelLabel for IafConfirmDialogRef.show.
   */
  showConfirmDialog = async (options = {}) => {
    const mapped = {
      ...options,
      title: options.title ?? 'Confirm',
      message: options.message ?? 'Are you sure?',
      confirmLabel:
        options.confirmLabel ?? options.confirmText ?? 'Confirm',
      cancelLabel: options.cancelLabel ?? options.cancelText ?? 'Cancel',
    };
    if (this.confirmDialogRef?.current?.show) {
      return this.confirmDialogRef.current.show(mapped);
    }
    return window.confirm(mapped.message);
  };

  updateNewToolbar(toolColumns,toolbarConfig) {
    const defaultToolItems = toolColumns.toolColumn1.items.concat(
      toolColumns.toolColumn2.items
    );
    const sortedDefaultToolItems = defaultToolItems.sort((toolListItem, currentToolbar) =>
      toolListItem.id.localeCompare(currentToolbar.id)
    );

    sortedDefaultToolItems.map((item, index) => {
      this.setState((prevState) => {
        const updatedList = [...prevState.toolbarList];
        updatedList[index].displayDisabled = item.displayDisabled;
        return { toolbarList: updatedList };
      });
    });

    if(toolColumns.toolColumn3){
    const viewItems = toolColumns.toolColumn3.items.concat(
      toolColumns.toolColumn4.items
    );
    const sortedViewItems = viewItems.sort((toolListItem, currentToolbar) => toolListItem.id.localeCompare(currentToolbar.id));

    sortedViewItems.map((item, index) => {
      this.setState((prevState) => {
        const updatedList = [...prevState.viewList];
        updatedList[index].displayDisabled = item.displayDisabled;
        return { viewList: updatedList };
      });
    });
    }
    
    if(toolColumns.toolColumn5){
    const shadingItems = toolColumns.toolColumn5.items.concat(
      toolColumns.toolColumn6.items
    );
    const sortedShadingItems = shadingItems.sort((toolListItem, currentToolbar) =>
      toolListItem.id.localeCompare(currentToolbar.id)
    );
    

    sortedShadingItems.map((item, index) => {
      this.setState((prevState) => {
        const updatedList = [...prevState.shadingList];
        updatedList[index].displayDisabled = item.displayDisabled;
        return { shadingList: updatedList };
      });
    });
    }

    if(toolColumns.toolColumn7){
    const navigationItems = toolColumns.toolColumn7.items.concat(
      toolColumns.toolColumn8.items
    );
    const sortedNavigationItems = navigationItems.sort((toolListItem, currentToolbar) =>
      toolListItem.id.localeCompare(currentToolbar.id)
    );

    sortedNavigationItems.map((item, index) => {
      this.setState((prevState) => {
        const updatedList = [...prevState.navigationList];
        updatedList[index].displayDisabled = item.displayDisabled;
        return { navigationList: updatedList };
      });
    });
    }

    if(toolColumns.toolColumn9){
    const measurementItems = toolColumns.toolColumn9.items.concat(
      toolColumns.toolColumn10.items
    );
    const sortedMeasurementItems = measurementItems.sort((toolListItem, currentToolbar) =>
      toolListItem.id.localeCompare(currentToolbar.id)
    );

    sortedMeasurementItems.map((item, index) => {
      this.setState((prevState) => {
        const updatedList = [...prevState.measurementList];
        updatedList[index].displayDisabled = item.displayDisabled;
        return { measurementList: updatedList };
      });
    });
    }

    if(toolColumns.toolColumn11){
      const manipulateItems = toolColumns.toolColumn11.items.concat(
        toolColumns.toolColumn12.items
      );
      const sortedManipulateItems = manipulateItems.sort((toolListItem, currentToolbar) =>
        toolListItem.id.localeCompare(currentToolbar.id)
      );
  
      sortedManipulateItems.map((item, index) => {
        this.setState((prevState) => {
          const updatedList = [...prevState.manipulateList];
          updatedList[index].displayDisabled = item.displayDisabled;
          return { manipulateList: updatedList };
        });
      });
      }

    if(toolbarConfig === 'default'){
      this.OnDefaultToolbarConfigCallback();
    }
    if(toolbarConfig === '2d'){
      this.On2dToolbarConfigCallback();
    }
    if(toolbarConfig === '3d'){
      this.On3dToolbarConfigCallback();
    }
  }

  // Write a function to sort numbers
  // ** Private helper Methods ** //
  
  // ATK PLG-1643: UX - Review Single Channel as a Setting in the Settings Pane
  /**
   * Get the combined isSingleWsEnabled value, ORing with isSingleChannelMode from settings
   * @returns {boolean} true if either isSingleWsEnabled state or isSingleChannelMode setting is enabled
   */
  getIsSingleWsEnabled() {
    // If backend version is < 5.1, return false (feature not supported)
    if (!IafLegacy.isBackendVersionAtLeast(this._backendVersion, 5, 1)) {
      return false;
    }
    
    const isSingleChannelMode = this.props.settings?.isSingleChannelMode ?? 
      (typeof localStorage !== 'undefined' && localStorage.iafviewer_settings 
        ? JSON.parse(localStorage.iafviewer_settings)?.isSingleChannelMode 
        : false);
    return this.state.isSingleWsEnabled || isSingleChannelMode;
  }

  /**
   * Get the default federation type from props.settings, localStorage, props.modelComposition, or PropertyStore
   * @returns {string} "SingleModel", "Project", or "MultiModel"
   */
  getDefaultFederationType() {
    // modelComposition first (highest priority)
    if (this.props.modelComposition?.defaultFederationType) {
      IafUtils.devToolsIaf && console.log ('IafViewerDBM.getDefaultFederationType', this.props.title, '/this.props.modelComposition?.defaultFederationType', this.props.modelComposition.defaultFederationType);
      return this.props.modelComposition.defaultFederationType;
    }
    // Then props.settings (e.g. from SettingPanel)
    if (this.props.settings?.defaultFederationType) {
      IafUtils.devToolsIaf && console.log ('IafViewerDBM.getDefaultFederationType', this.props.title, '/this.props.settings?.defaultFederationType', this.props.settings.defaultFederationType);
      return this.props.settings.defaultFederationType;
    }
    // Then localStorage (cached settings)
    if (typeof localStorage !== 'undefined' && localStorage.iafviewer_settings) {
      const cachedSettings = JSON.parse(localStorage.iafviewer_settings);
      if (cachedSettings?.defaultFederationType) {
        IafUtils.devToolsIaf && console.log ('IafViewerDBM.getDefaultFederationType', this.props.title, '/cachedSettings.defaultFederationType', cachedSettings.defaultFederationType);
        return cachedSettings.defaultFederationType;
      }
    }
    // Finally fallback to PropertyStore default
    IafUtils.devToolsIaf && console.log ('IafViewerDBM.getDefaultFederationType', this.props.title, '/PropertyStore.modelComposition.defaultFederationType', PropertyStore.modelComposition.defaultFederationType);
    return PropertyStore.modelComposition.defaultFederationType ?? "SingleModel";
  }
  
  async _initializeModels() {
    console.log('IafViewerDBM._initializeModels', this.props.title,  this.props);
    
    // Get view3d and view2d from props merged with PropertyStore defaults
    const view3d = { ...PropertyStore.view3d, ...this.props?.view3d };
    const view2d = { ...PropertyStore.view2d, ...this.props?.view2d };
    const gis = mergeGisProperties(PropertyStore.gis, this.props?.gis);
    
    // Early return: Both view3d and view2d are disabled
    if (!view3d?.enable && !view2d?.enable && !gis?.enable) {
      console.log("IafViewerDBM._initializeModels", this.props.title, "Both view3d and view2d are disabled, skipping model initialization");
      await new Promise(resolve => this.setState({
        models: [],
        selectedModel: null
      }, resolve));
      return;
    }
    
    // Early return: modelId is absent
    // if (!this.props.model?._id) {
    //   console.warn("IafViewerDBM._initializeModels", this.props.title, "modelId is absent from props, skipping model initialization");
    //   await new Promise(resolve => this.setState({
    //     models: [],
    //     selectedModel: null
    //   }, resolve));
    //   return;
    // }
    
    // Early return: modelVersionId is absent (if it's a required prop)
    // Note: modelVersionId might be optional, but if it's explicitly required, uncomment this check
    // if (!this.props.modelVersionId && !this.props.model?._versionId) {
    //   console.warn("IafViewerDBM._initializeModels", this.props.title, "modelVersionId is absent from props, skipping model initialization");
    //   await new Promise(resolve => this.setState({
    //     models: [],
    //     selectedModel: null
    //   }, resolve));
    //   return;
    // }
    
    // Early return: Check for other required props (e.g., serverUri)
    if (!this.props.serverUri) {
      console.warn("IafViewerDBM._initializeModels", this.props.title, "serverUri is absent from props, skipping model initialization");
      await new Promise(resolve => this.setState({
        models: [],
        selectedModel: null
      }, resolve));
      return;
    }

    // Must initialize synchronously so it's ready before componentDidUpdate runs.
    !this.iafSpinnerManager && (this.iafSpinnerManager = new IafSpinnerManager(this, "isModelLoaded", [
      "IafViewerDBM.loadModelInfo",
      "IafGraphicsResourceHandler.setupOutlineFiles",
      "IafGraphicsResourceHandler.initializeGraphicsResources",
      "IafGraphicsResourceManager.build"
    ], {
      label: "IafSpinnerManager(IafViewerDBM)",
      notificationMessage: "The viewer is busy loading graphics resources",
      frequency: 5000
    }));
    
    let models = await IafProjectUtils.getModels(this.props);
    const modelComposition = this.props.modelComposition ?? PropertyStore.modelComposition;
    const federationType = this.getDefaultFederationType();
    const { useClusters, flatModelIds } = IafModelComposition.getClusteredModelsContext(modelComposition, federationType);
    if (useClusters && flatModelIds.size > 0) {
      const filtered = (models || []).filter((m) => flatModelIds.has(m._id));
      if (filtered.length > 0) {
        models = filtered;
      } else {
        console.warn("IafViewerDBM._initializeModels", this.props.title, "clusteredModels filter produced no models; using full project model list");
      }
    }
    let selectedModel = IafProjectUtils.getModel(this.props, models);
    // When props.model._id is not specified, use the project's first model if available
    if (!selectedModel && models?.length > 0) {
      selectedModel = models[0];
      console.log("IafViewerDBM._initializeModels", this.props.title, "modelId not in props, using project's first model:", selectedModel?._id, selectedModel?._name);
    }

    console.log ('IafViewerDBM._initializeModels', this.props.title
      , '/models', models
      , '/selectedModel', selectedModel
    );

    if (!selectedModel) {
      console.error("IafViewerDBM._initializeModels", this.props.title, "No valid model found to load");
    }
    
    const isFederated = IafProjectUtils.isFederatedProject();
    const message = isFederated ? "The viewer is busy extracting 3D and 2D Views information for federated (multiple) models" : "The viewer is busy extracting 3D Views information";
    this.iafSpinnerManager?.updateNotificationMessage(message);
    
    await new Promise(resolve => this.setState({
      models: models || [],
      selectedModel: selectedModel || null
    }, resolve));
  }

  _shouldReloadModel(prevProps, prevState) {
    const view3d = { ...PropertyStore.view3d, ...this.props?.view3d };
    const view2d = { ...PropertyStore.view2d, ...this.props?.view2d };
    const gis = mergeGisProperties(PropertyStore.gis, this.props?.gis);

    const prevView3d = { ...PropertyStore.view3d, ...prevProps?.view3d };
    const prevView2d = { ...PropertyStore.view2d, ...prevProps?.view2d }; 
    const prevGis = mergeGisProperties(PropertyStore.gis, prevProps?.gis);

    const modelChanged =
      prevProps?.model?._id !== this.props?.model?._id ||
      prevProps?.modelVersionId !== this.props?.modelVersionId;

    const toggled3d = view3d?.enable !== prevView3d?.enable;
    const toggled2d = view2d?.enable !== prevView2d?.enable;
    const toggledGis = gis?.enable !== prevGis?.enable;

    const view3dDisabled = prevView3d?.enable && !view3d?.enable;
    const view2dDisabled = prevView2d?.enable && !view2d?.enable;
    const gisDisabled = prevGis?.enable && !gis?.enable;
    const viewerDisabled = view3dDisabled && view2dDisabled && gisDisabled;

    const viewChanged = toggled3d || toggled2d || toggledGis;
    
    const selectedModelChanged =
      prevState.selectedModel?._id !== this.state.selectedModel?._id ||
      prevState.selectedModel?._versionId !== this.state.selectedModel?._versionId;

    // Check if view3d/view2d was just enabled and models need initialization
    const needsInitialization = ((!prevView3d?.enable && view3d?.enable) 
    || (!prevView2d?.enable && view2d?.enable
    || (!prevGis?.enable && gis?.enable)
    )) && !this.state.models.length;

    const shouldReload =
      (view3d?.enable || view2d?.enable || gis?.enable) &&
      (modelChanged || viewChanged || selectedModelChanged || needsInitialization);

    IafUtils.devToolsIaf && console.log ('IafViewerDBM', this.props.title, '_shouldReloadModel'
                  , '/modelChanged', modelChanged
                  , '/prevProps.model._id', prevProps?.model?._id
                  , '/this.props.model._id', this.props?.model?._id
                  , '/prevProps.modelVersionId', prevProps?.modelVersionId
                  , '/this.props.modelVersionId', this.props?.modelVersionId
                  , '/viewChanged', viewChanged
                  , '/selectedModelChanged', selectedModelChanged
                  , '/prevState.selectedModel._id', prevState.selectedModel?._id
                  , '/this.state.selectedModel._id', this.state.selectedModel?._id
                  , '/needsInitialization', needsInitialization
                  , '/shouldReload', shouldReload
                );

    return { shouldReload, modelChanged, viewerDisabled, needsInitialization };
  }
  
  async handleModelChange(modelChanged) {
    console.log ('IafViewerDBM.handleModelChange', this.props.title, '/modelChanged', modelChanged);
    let selectedModel;

    if (modelChanged) {
      this._fileSet = [];
      this._fileSet2d = [];
      const iafViewer = this.iafviewerRef?.current;
      
      // Application side if model changes then first toggle off the GIS.
      // iafViewer?.toggleOffGis()

      // RRP: PLG-1582 was reopened because `iafViewer?.toggleOffGis()` was commented out.
      // This prevented the previous markup manager instance from being cleared,
      // causing annotation creation to fail after a model switch. The fix below resolves this issue.
      iafViewer?.clearMarkupManager()
      
      // Revist in next commit. when model changes without unmounting IafViewer.
      if (this.iafviewerRef?.current) {
        // const federationType = this.getDefaultFederationType();
        // await cleanupAllResources(this.iafviewerRef.current, federationType === "SingleModel");
        await IafDisposer.cleanupAllResources(this.iafviewerRef.current, !this.getIsSingleWsEnabled());
      }

      selectedModel = IafProjectUtils.getModel(this.props, this.state.models);
      
    } else {
      selectedModel = this.state.selectedModel;
    }
    await this.resetModelFlags();

    await new Promise(resolve =>
      this.setState({ selectedModel: selectedModel || null }, resolve)
    );

    // RRP:- PLG-1501 Adds modelId support in IafStorageUtils to enable storing GIS data, model composer data, and annotations to localstorage.
    if (selectedModel) {
        IafStorageUtils.setModelContext({
          modelId: selectedModel._id,
          modelVersionId: selectedModel._versionId || null,
      });
    }

    // ATK PLG-1585: Sync primaryModelId when selectedModel changes and GIS is enabled
    // This ensures gis.primaryModelId stays in sync with selectedModel (the source of truth)
    if (selectedModel && this.iafviewerRef?.current) {
      const iafViewer = this.iafviewerRef.current;
      const newPrimaryModelId = selectedModel._id;
      
      // Only update if GIS is enabled and primaryModelId is different
      if (iafViewer.state?.gis?.enable && iafViewer.state.gis?.primaryModelId !== newPrimaryModelId) {
        iafViewer.setState({
          gis: {
            ...iafViewer.state.gis,
            primaryModelId: newPrimaryModelId
          }
        });
        
        // Update GIS instance if available and viewer is ready
        if (iafViewer.gisInstance && iafViewer.state.isModelStructureReady) {
          iafViewer.gisInstance.primaryModelId = newPrimaryModelId;
          // Don't call updatePrimaryModel here as it will be called from componentDidUpdate
          // when it detects the primaryModelId change
        }
      }
    }

    return this.state.selectedModel;
  }
  
  async resetModelFlags() {
    // Reset both 3D and 2D in parent component state
    if(this.iafviewerRef?.current){
      if(this.props.view3d.enable){
        await new Promise(resolve => this.iafviewerRef?.current?.setState({ 
            isModelLoaded: false,
            isModelStructureReady: false
          },resolve)
        );
      }
      if(this.props.view2d.enable){
        await new Promise(resolve => this.iafviewerRef?.current?.setState({ 
            is2DModelLoaded: false,
            is2DModelStructureReady: false
          },resolve)
        );
      }
    }
    // Reset both 3D and 2D in current component state
      if(this.props.view3d.enable){
        await new Promise(resolve =>this.setState({
          isModelLoaded: false,
        }, resolve));
      }
      if(this.props.view2d.enable){
        await new Promise(resolve =>this.setState({
          is2dModelLoaded: false,
        }, resolve));
      }
  }
  // ** Private helper Methods ** //

  async componentDidUpdate(prevProps, prevState, snapshot) {
    // useLogChangedPropertiesForClass("IafViewerDBM Props", this.props, prevProps,
    //   [
    //     'On2dToolbarConfigCallback',
    //     'On3dToolbarConfigCallback',
    //     'OnDefaultToolbarConfigCallback',
    //     'OnHiddenElementChangeCallback',
    //     'OnIsolateElementChangeCallback',
    //     'OnResetCallback',
    //     'OnSelectedElementChangeCallback',
    //     'OnSnackbarOpenCallback',
    //     'idMapping'
    //   ]
    // );

    // useLogChangedPropertiesForClass("IafViewerDBM State", this.state, prevState, '', false, ['idMapping']);

    IafUtils.debugIaf && IafObjectUtils.logChangedProperties(prevProps, this.props, 
              IafUtils.devToolsIaf ? 5 : 3, "IafViewerDBM.componentDidUpdate Props");
    
    // Initialize backend version (reuse promise if already in progress)
    if (!this._backendVersionPromise) {
      this._backendVersionPromise = IafLegacy.initializeBackendVersion(this);
    }
    await this._backendVersionPromise;
    
    const reloadInfo = this._shouldReloadModel(prevProps, prevState);
    // Handle initial model loading - when models haven't been loaded yet
    const modelChanged = this.isFirstLoad || reloadInfo.modelChanged;
    const shouldReload = this.isFirstLoad || reloadInfo.shouldReload;

    IafUtils.devToolsIaf && console.log ('IafViewerDBM.componentDidUpdate', this.props.title
      , '/isFirstLoad', this.isFirstLoad
      , '/modelChanged', modelChanged
      , '/shouldReload', shouldReload
      , '/viewerDisabled', reloadInfo.viewerDisabled
    )

    // Cleanup resources when view3d or view2d is disabled
    if (reloadInfo.viewerDisabled && this.iafviewerRef?.current) {
      IafUtils.devToolsIaf && console.log('IafViewerDBM.componentDidUpdate', this.props.title, 'Cleaning up resources due to viewer being disabled');
      await IafDisposer.cleanupAllResources(this.iafviewerRef.current);
    }

    //PLG-1522 When model empty or not enabled by application then mark as loaded for GIS.
    const view3d = { ...PropertyStore.view3d, ...this.props?.view3d };
    const view2d = { ...PropertyStore.view2d, ...this.props?.view2d };
    const gis = mergeGisProperties(PropertyStore.gis, this.props?.gis);
    const needsModel = view3d?.enable || view2d?.enable || gis?.enable;
    
    const prevView3d = { ...PropertyStore.view3d, ...prevProps?.view3d };
    const prevView2d = { ...PropertyStore.view2d, ...prevProps?.view2d };
    const prevGis = mergeGisProperties(PropertyStore.gis, prevProps?.gis);
    const prevNeedsModel = prevView3d?.enable || prevView2d?.enable || prevGis?.enable;
    
    // Clear graphicsHandler, fileSet, fileSet2d and related state when both view3d and view2d are disabled
    // (needsModel is false when both are disabled)
    if (prevNeedsModel && !needsModel) {
      IafUtils.devToolsIaf && console.log('IafViewerDBM.componentDidUpdate', this.props.title, 'Clearing graphicsHandler, fileSet, fileSet2d and related state - both viewers disabled');
      // Reset instance variables
      this._fileSet = [];
      this._fileSet2d = [];
      // Clear state variables to trigger re-render with null props
      this.setState({
        graphicsHandler: null,
        fileSet: null,
        fileSet2d: null,
        idMapping: [],
        idMappingSet: [],
        idMapping2d: [],
        idMappingSet2d: [],
        units: undefined,
        isModelLoaded: true,
        is2dModelLoaded: true
      });
    }
    
    // For non-model modes (GIS, arcgis, etc.) - both view3d and view2d disabled
    // (needsModel is false when both are disabled)
    if (!needsModel) {
      if (!prevState.isModelLoaded) {   
        this.setState({ isModelLoaded: true });
      }
      // PLG-1533 set selected model only if view3d & view2d is false. 
      // no need to download the fileSets geometry etc.
      if(reloadInfo.modelChanged) {
        await this.handleModelChange(modelChanged);
      }
      return;
    }
    
    // For model-based modes (view3d or view2d enabled), require model ID
    // if (!this.props.model?._id) {
    //   console.warn("IafViewerDBM", this.props.title, "No model id found in props, skipping model load.");
    //   if (!prevState.isModelLoaded) {   
    //     this.setState({ isModelLoaded: true });
    //   }
    //   return;
    // }
    
    if(shouldReload){
      this.isFirstLoad = false;
      
      // Reset fileSet, fileSet2d, and graphicsHandler when view3d/view2d is enabled
      // This ensures _createViewer() doesn't get stale values before build() completes
      const view3dJustEnabled = !prevProps.view3d?.enable && view3d?.enable;
      const view2dJustEnabled = !prevProps.view2d?.enable && view2d?.enable;
      const gisJustEnabled = !prevProps.gis?.enable && gis?.enable;

      if (view3dJustEnabled || view2dJustEnabled || gisJustEnabled) {
        IafUtils.devToolsIaf && console.log('IafViewerDBM.componentDidUpdate', this.props.title, 'Resetting fileSet, fileSet2d, and graphicsHandler before loadModelInfo');
        // Reset instance variables
        this._fileSet = [];
        this._fileSet2d = [];
        // Reset state variables to trigger re-render with null props
        // This ensures _createViewer() gets null values and waits for build() to complete
        this.setState({ 
          fileSet: null,
          fileSet2d: null,
          graphicsHandler: null 
        });
      }
      
      // Initialize models if needed (when view3d/view2d just enabled or model changed without models)
      if (reloadInfo.needsInitialization || (modelChanged && !this.state.models.length)) {
        await this._initializeModels();
      }
      
      if (modelChanged) {
        await this.handleModelChange(modelChanged);
      }
      
      // Only call loadModelInfoSync if we have a valid selectedModel
      // _initializeModels may have returned early due to missing properties
      if (this.state.selectedModel) {
        this.loadModelInfoSync(this.state.selectedModel, "(IafViewerDBM.componentDidUpdate)" + this.props.title);
      } else {
        console.warn("IafViewerDBM.componentDidUpdate", this.props.title, "Skipping loadModelInfoSync - no valid selectedModel (likely due to missing required props)", {
          hasSelectedModel: !!this.state.selectedModel,
          selectedModel: this.state.selectedModel,
          modelsLength: this.state.models?.length,
          modelId: this.props.model?._id
        });
      }
    }
  }

  // async loadModel() {
  //   const view3d = this.props?.view3d ?? PropertyStore.view3d;
  //   const view2d = this.props?.view2d ?? PropertyStore.view2d;
  
  //   if (view3d?.enable || view2d?.enable) {
  //     // Check for valid Input Model
  //     if (!this.state.selectedModel) return;

  //     // Check for valid Communicator Libraries
  //     !this.state.scriptLoadedCommunicator && await IafResourceUtils.loadCommunicatorResources(this);
  //     if (!this.state.scriptLoadedCommunicator) return;

  //     // Load
  //     this.loadModelInfoSync(this.state.selectedModel);
  //   }
  // }

  async componentDidMount() {
    console.log ('IafViewerDBM.componentDidMount - ' + this.props.title, this.props)

    // Initialize backend version and store promise for reuse
    if (!this._backendVersionPromise) {
      this._backendVersionPromise = IafLegacy.initializeBackendVersion(this);
    }
    await this._backendVersionPromise;

    if(!this.props.model?._id){
      console.warn("No model id found in props, skipping model load.");
    }

    await this._initializeModels();

    await this.initializeViewerPermissions();
    
    if (this.props.arcgis?.enable 
                || this.props.arcgisOverview?.enable 
                || this.props.ue?.enable
                || this.props.photosphere?.enable
                || this.props.gis?.enable
              ) {
      this.setState({authToken: IafSession.getAuthToken()});
    }
  }

  async componentWillUnmount() {
    console.log ('IafViewerDBM.componentWillUnmount', this.props.title);
    this.iafSpinnerManager && this.iafSpinnerManager.endMonitoring();
    this.iafSpinnerManager = null;
    this.confirmDialogRef && (this.confirmDialogRef.current = null);
    this.iafNotificationRef.current = null;
    this.iafviewerRef && (this.iafviewerRef.current = null);
    this.iafviewerRef = null;
    this.iafNotificationRef = null;
    this.confirmDialogRef = null;
  }
  
  async initializeViewerPermissions() {
    try {
      NotificationStore.notifyExtractingViewerPermissions(this);

      const session = await IafSession.getCurrentUser();
      IafUtils.devToolsIaf && console.log('IafViewerDBM.initializeViewerPermissions', session);
      
      const currentUser = session?._email?.split('@')[0] || 'default.user';

      const currentProject = IafProj.getCurrent();
      const projectName = currentProject?._name || 'Default Project';

      await permissionManager.initialize(currentUser, projectName);
      this.setState({ permissionsInitialized: true, currentUser, projectName });
    } catch (error) {
      console.error('Error initializing iafViewer permissions:', error);
      permissionManager.initialize('default.user', 'Default Project');
      this.setState({ permissionsInitialized: true, currentUser: 'default.user', projectName: 'Default Project' });
    }
  }
  
  handleModelSelection = async (selectedModel) => {
    const iafViewer = this.iafviewerRef?.current
    // ATK PLG-1502: GIS 2.0 - Review the GIS Properties - enable and showToolbar
    // Moved inside cleanupAllResources
    // iafViewer?.toggleOffGis()

    // RRP: PLG-1582 was reopened because `iafViewer?.toggleOffGis()` was commented out.
    // This prevented the previous markup manager instance from being cleared,
    // causing annotation creation to fail after a model switch. The fix below resolves this issue.

    if(iafViewer){
      // const federationType = this.getDefaultFederationType();
      // await cleanupAllResources(this.iafviewerRef.current, federationType === "SingleModel")
      // await IafDisposer.cleanupAllResources(this.iafviewerRef.current, !this.getIsSingleWsEnabled())
      await IafDisposer.cleanupResourcesByEvmId(this.iafviewerRef.current, EvmUtils.EVMMode.View3d, !this.getIsSingleWsEnabled());
      await IafDisposer.cleanupResourcesByEvmId(this.iafviewerRef.current, EvmUtils.EVMMode.View2d, !this.getIsSingleWsEnabled());
      iafViewer?.clearMarkupManager()

    }
    await this.resetModelFlags();

    // PLG-1726: Model Switching does not update graphicsResources causing incorrect view node Ids to be used for GIS.
    // Sync 3D and 2D graphics resources for the selected model before setState so the viewer
    // sees the active model's resources in the same turn (no wait for next render).
    if (iafViewer && selectedModel) {
      const newGraphicsResources = this.state.graphicsHandler?.graphicsResourcesMap.get(selectedModel._id);
      const newGraphicsResources2d = this.state.graphicsHandler?.graphicsResources2dMap.get(selectedModel._id);
      if (iafViewer._viewer && newGraphicsResources) {
        iafViewer.updateGraphicsResources(newGraphicsResources);
      }
      if (iafViewer._viewer2d && newGraphicsResources2d) {
        iafViewer.updateGraphicsResources_2d(newGraphicsResources2d);
      }
    }

    this.setState({selectedModel: selectedModel}, () => {
      // ATK PLG-1585: Sync primaryModelId when selectedModel changes via handleModelSelection
      // This ensures gis.primaryModelId stays in sync with selectedModel (the source of truth)
      if (selectedModel && iafViewer) {
        const newPrimaryModelId = selectedModel._id;
        
        // Only update if GIS is enabled and primaryModelId is different
        if (iafViewer.state?.gis?.enable && iafViewer.state.gis?.primaryModelId !== newPrimaryModelId) {
          iafViewer.setState({
            gis: {
              ...iafViewer.state.gis,
              primaryModelId: newPrimaryModelId
            }
          });
          
          // Update GIS instance if available and viewer is ready
          if (iafViewer.gisInstance && iafViewer.state.isModelStructureReady) {
            iafViewer.gisInstance.primaryModelId = newPrimaryModelId;
            // Don't call updatePrimaryModel here as it will be called from componentDidUpdate
            // when it detects the primaryModelId change
          }
        }
      }
    });
    // RRP:- PLG-1501 Adds modelId support in IafStorageUtils to enable storing GIS data, model composer data, and annotations to localstorage.
    if (selectedModel) {
      IafStorageUtils.setModelContext({
        modelId: selectedModel._id,
        modelVersionId: selectedModel._versionId || null,
      });
    }
    // This is commented as this will be called from componentDidUpdate it self.
    // this.resetModelFlags().then(() => {
    //     this.loadModelInfoSync(selectedModel, "(IafViewerDBM.handleModelSelection)");
    // });
  };

  /**
 * @function getUnits
 * function gets units from the model's properties
 * @param {*} propCollId 
 * @returns 
 */
  async getUnits(propCollId) {
    let resources = await IafItemSvc.getRelatedItems(propCollId);
    if (resources && resources._list) {
      let elev = resources._list[0].properties.Elevation
      if (elev) {
        let uom = elev.uom
        return uom
      }
    }
  }

  async OnIsolateElementChangeCallback(isolateElementIDs) {
    console.log("IafViewerDBM Callbacks: OnIsolateElementChangeCallback is called");
    if (this.props?.OnIsolateElementChangeCallback) this.props.OnIsolateElementChangeCallback(isolateElementIDs);
    else console.warn("IafViewerDBM Callbacks: OnIsolateElementChangeCallback not found");
  }

  OnSelectedElementChangeCallback(selectedElementIDs) {
    console.log("IafViewerDBM Callbacks: OnSelectedElementChangeCallback is called");
    if (this.props?.OnSelectedElementChangeCallback) this.props.OnSelectedElementChangeCallback(selectedElementIDs);
    else console.warn("IafViewerDBM Callbacks: OnSelectedElementChangeCallback not found");
    // this.openNotification("Element is Selected",2000)
  }

  OnResetCallback() {
    console.log("IafViewerDBM Callbacks: OnResetCallback is called");
    if (this.props?.OnResetCallback) this.props.OnResetCallback();
    else console.warn("IafViewerDBM Callbacks: OnResetCallback not found");
  }

  OnHiddenElementChangeCallback(hiddenElementIDs) {
    console.log("IafViewerDBM Callbacks: OnHiddenElementChangeCallback is called");
    if (this.props?.OnHiddenElementChangeCallback) this.props.OnHiddenElementChangeCallback(hiddenElementIDs);
    else console.warn("IafViewerDBM Callbacks: OnHiddenElementChangeCallback not found");
  }

  On2dToolbarConfigCallback(){
    console.log("IafViewerDBM Callbacks: On2dToolbarConfigCallback is called");
    const {toolbarList,measurementList,viewList,navigationList,shadingList,manipulateList} = this.state;
    if (this.props?.On2dToolbarConfigCallback) this.props.On2dToolbarConfigCallback(toolbarList,measurementList,viewList,navigationList,shadingList,manipulateList);
    else console.warn("IafViewerDBM Callbacks: On2dToolbarConfigCallback not found");
  }

  On3dToolbarConfigCallback(){
    console.log("IafViewerDBM Callbacks: On3dToolbarConfigCallback is called");
    const {toolbarList,measurementList,viewList,navigationList,shadingList,manipulateList} = this.state;
    if (this.props?.On3dToolbarConfigCallback) this.props.On3dToolbarConfigCallback(toolbarList,measurementList,viewList,navigationList,shadingList,manipulateList);
    else console.warn("IafViewerDBM Callbacks: On3dToolbarConfigCallback not found");
  }
  OnDefaultToolbarConfigCallback(){
    console.log("IafViewerDBM Callbacks: OnDefaultToolbarConfigCallback is called");
    const {toolbarList,measurementList,viewList,navigationList,shadingList,manipulateList} = this.state;
    if (this.props?.OnDefaultToolbarConfigCallback) this.props.OnDefaultToolbarConfigCallback(toolbarList,measurementList,viewList,navigationList,shadingList,manipulateList);
    else console.warn("IafViewerDBM Callbacks: OnDefaultToolbarConfigCallback not found");
  }
  //Callback Function when notification is shown
  OnNotificationCallback(message){
    console.log("IafViewerDBM Callbacks: OnNotificationCallback called", message);
    if(this.props?.OnNotificationCallback) this.props.OnNotificationCallback(message);
    else console.warn("IafViewerDBM Callbacks: OnNotificationCallback not found");
  }
  
  OnViewerReadyCallback(modelType){
    console.log("IafViewerDBM Callbacks: OnViewerReadyCallback called", modelType);
    if(this.props?.OnViewerReadyCallback) this.props.OnViewerReadyCallback(modelType);
    else console.warn("IafViewerDBM Callbacks: OnViewerReadyCallback not found");
  }

  OnModelCompositionReadyCallback(modelType, firstLoad){
    console.log("IafViewerDBM Callbacks: OnModelCompositionReadyCallback called", modelType, firstLoad);
    if(this.props?.OnModelCompositionReadyCallback) this.props.OnModelCompositionReadyCallback(modelType, firstLoad);
    else console.warn("IafViewerDBM Callbacks: OnModelCompositionReadyCallback not found");
  }

  /** Forwards {@link PropertyStore.gis} `onIafMapReady` from the app parent. */
  OnGisIafMapReady(mapProxy) {
    console.log("IafViewerDBM Callbacks: OnGisIafMapReady called", mapProxy);
    if(this.props?.gis?.onIafMapReady) this.props.gis.onIafMapReady(mapProxy);
    else console.warn("IafViewerDBM Callbacks: OnGisIafMapReady not found");
  }

  OnGisFederatedModeChanged(federatedMode) {
    console.log("IafViewerDBM Callbacks: OnGisFederatedModeChanged called", federatedMode);
    if(this.props?.gis?.onFederatedModeChanged) this.props.gis.onFederatedModeChanged(federatedMode);
    else console.warn("IafViewerDBM Callbacks: OnGisFederatedModeChanged not found");
  }

  OnGisReferenceModelChanged(modelId) {
    console.log("IafViewerDBM Callbacks: OnGisReferenceModelChanged called", modelId);
    if(this.props?.gis?.onReferenceModelChanged) this.props.gis.onReferenceModelChanged(modelId);
    else console.warn("IafViewerDBM Callbacks: OnGisReferenceModelChanged not found");
  }

  OnGisElevationModeChanged(elevationMode) {
    console.log("IafViewerDBM Callbacks: OnGisElevationModeChanged called", elevationMode);
    if(this.props?.gis?.onElevationModeChanged) this.props.gis.onElevationModeChanged(elevationMode);
    else console.warn("IafViewerDBM Callbacks: OnGisElevationModeChanged not found");
  }

  OnGisModelSelect(modelId) {
    console.log("IafViewerDBM Callbacks: OnGisModelSelect called", modelId);
    if(this.props?.gis?.onModelSelect) this.props.gis.onModelSelect(modelId);
    else console.warn("IafViewerDBM Callbacks: OnGisModelSelect not found");
  }

  OnGisOutlineLoaded() {
    console.log("IafViewerDBM Callbacks: OnGisOutlineLoaded called");
    if (this.props?.gis?.onOutlineLoaded) this.props.gis.onOutlineLoaded();
    else console.warn("IafViewerDBM Callbacks: OnGisOutlineLoaded not found");
  }

  OnGisLongitudeChange(modelIds, value) {
    console.log("IafViewerDBM Callbacks: OnGisLongitudeChange called", modelIds, value);
    if (this.props?.gis?.onLongitudeChange) this.props.gis.onLongitudeChange(modelIds, value);
    else console.warn("IafViewerDBM Callbacks: OnGisLongitudeChange not found");
  }

  OnGisLatitudeChange(modelIds, value) {
    console.log("IafViewerDBM Callbacks: OnGisLatitudeChange called", modelIds, value);
    if (this.props?.gis?.onLatitudeChange) this.props.gis.onLatitudeChange(modelIds, value);
    else console.warn("IafViewerDBM Callbacks: OnGisLatitudeChange not found");
  }

  OnGisBearingChange(modelIds, value) {
    console.log("IafViewerDBM Callbacks: OnGisBearingChange called", modelIds, value);
    if (this.props?.gis?.onBearingChange) this.props.gis.onBearingChange(modelIds, value);
    else console.warn("IafViewerDBM Callbacks: OnGisBearingChange not found");
  }

  OnGisAltitudeChange(modelIds, value) {
    console.log("IafViewerDBM Callbacks: OnGisAltitudeChange called", modelIds, value);
    if (this.props?.gis?.onAltitudeChange) this.props.gis.onAltitudeChange(modelIds, value);
    else console.warn("IafViewerDBM Callbacks: OnGisAltitudeChange not found");
  }

  /** Forwards {@link PropertyStore.arcgis} `eventHandler` from the app parent. */
  OnArcgisEventHandler(event) {
    console.log("IafViewerDBM Callbacks: OnArcgisEventHandler called", event);
    if (this.props?.arcgis?.eventHandler) this.props.arcgis.eventHandler(event);
    else console.warn("IafViewerDBM Callbacks: OnArcgisEventHandler not found");
  }

  /** Forwards {@link PropertyStore.arcgis} `onIafMapReady` from the app parent. */
  OnArcgisIafMapReady(payload) {
    console.log("IafViewerDBM Callbacks: OnArcgisIafMapReady called", payload);
    if (this.props?.arcgis?.onIafMapReady) this.props.arcgis.onIafMapReady(payload);
    else console.warn("IafViewerDBM Callbacks: OnArcgisIafMapReady not found");
  }

  /** Forwards {@link PropertyStore.ue} `eventHandler` from the app parent. */
  OnUeEventHandler(event) {
    console.log("IafViewerDBM Callbacks: OnUeEventHandler called", event);
    if (this.props?.ue?.eventHandler) this.props.ue.eventHandler(event);
    else console.warn("IafViewerDBM Callbacks: OnUeEventHandler not found");
  }

  /** Forwards {@link PropertyStore.ue} `onUeReady` from the app parent. */
  OnUeReady(viewerInfo) {
    console.log("IafViewerDBM Callbacks: OnUeReady called", viewerInfo);
    if (this.props?.ue?.onUeReady) this.props.ue.onUeReady(viewerInfo);
    else console.warn("IafViewerDBM Callbacks: OnUeReady not found");
  }

  /** Forwards {@link PropertyStore.view3d} `onRenderingModeChange` from the app parent. */
  OnView3dRenderingModeChange(mode) {
    console.log("IafViewerDBM Callbacks: OnView3dRenderingModeChange called", mode);
    if (this.props?.view3d?.onRenderingModeChange) this.props.view3d.onRenderingModeChange(mode);
    else console.warn("IafViewerDBM Callbacks: OnView3dRenderingModeChange not found");
  }

  /** Forwards {@link PropertyStore.view3d} `onCameraUpdate.callback` from the app parent (`this.props.view3d`). */
  OnView3dCameraUpdateCallback(cameraJson) {
    console.log("IafViewerDBM Callbacks: OnView3dCameraUpdateCallback called", cameraJson);
    const cb = this.props?.view3d?.onCameraUpdate?.callback;
    if (cb) cb(cameraJson);
    else console.warn("IafViewerDBM Callbacks: OnView3dCameraUpdateCallback not found");
  }
  
  /**
   * @function loadModelInfo
   * Function creates model info
   * @param {} model 
   */
  async loadModelInfoSync(model, caller="") {
    IafUtils.devToolsIaf && console.log("IafViewerDBM.loadModelInfoSync is called", caller, '/model', model);
    // Prevent concurrent calls - return existing promise if already loading

    if (this._loadModelInfoPromise) {
      IafUtils.devToolsIaf && console.log("IafViewerDBM.loadModelInfoSync - concurrent call detected, returning existing promise", caller);
      return this._loadModelInfoPromise;
    }

    this.iafSpinnerManager.resumeMonitoring();

    // Create a promise wrapper to handle the actual loading
    this._loadModelInfoPromise = this.loadModelInfo(model, caller);
    
    // Clean up the promise reference when done
    this._loadModelInfoPromise
      .then(() => {
        this._loadModelInfoPromise = null;
      })
      .catch(() => {
        this._loadModelInfoPromise = null;
      });

    return this._loadModelInfoPromise;
  }

  /**
   * Merges PropertyStore + props `gis`, forwards GIS callbacks through IafViewerDBM (same pattern as
   * OnNotificationCallback), and wraps `onIafMapReady` so the app receives it only after any in-flight
   * `loadModelInfo` completes (`_loadModelInfoPromise` cleared or settled).
   */
  buildGisPropsForViewer() {
    const merged = mergeGisProperties(PropertyStore.gis, this.props.gis);
    const gis = {
      ...merged,
      onFederatedModeChanged: this.OnGisFederatedModeChanged,
      onReferenceModelChanged: this.OnGisReferenceModelChanged,
      onElevationModeChanged: this.OnGisElevationModeChanged,
      onModelSelect: this.OnGisModelSelect,
      onOutlineLoaded: this.OnGisOutlineLoaded,
      onLongitudeChange: this.OnGisLongitudeChange,
      onLatitudeChange: this.OnGisLatitudeChange,
      onBearingChange: this.OnGisBearingChange,
      onAltitudeChange: this.OnGisAltitudeChange,
    };
    if (typeof this.props.gis?.onIafMapReady !== 'function') {
      return gis;
    }
    return {
      ...gis,
      onIafMapReady: (mapProxy) => {
        if (this._loadModelInfoPromise != null) {
          return Promise.resolve(this._loadModelInfoPromise).then(
            () => this.OnGisIafMapReady(mapProxy),
            (err) => {
              console.warn('IafViewerDBM: loadModelInfo rejected before forwarding onIafMapReady', err);
              return this.OnGisIafMapReady(mapProxy);
            }
          );
        }
        return this.OnGisIafMapReady(mapProxy);
      },
    };
  }

  async loadModelInfo(model, caller = "") {
    const iafPerfLogger = new IafPerfLogger("IafViewerDBM.loadModelInfo" + caller);

    const endPerfLogger = () => {
      iafPerfLogger.end();
    }

    // IafUtils.devToolsIaf && console.clear();

    IafUtils.devToolsIaf && console.log ("IafViewerDBM.loadModelInfo" + caller
      , '/model', JSON.stringify(model)
    );

    const view3d = { ...PropertyStore.view3d, ...this.props?.view3d };
    const view2d = { ...PropertyStore.view2d, ...this.props?.view2d };
    const gis = mergeGisProperties(PropertyStore.gis, this.props?.gis);
  
    // Check for valid Input Model
    if (!model) return;

    // Check for valid Communicator Libraries
    !IafResourceUtils.isCommunicatorLoaded() && await IafResourceUtils.loadCommunicatorResources(this);

    if (!IafResourceUtils.isCommunicatorLoaded()) {
      console.error ("IafViewerDBM.loadModelInfo", "Couldn't load communicator dependencies");
      endPerfLogger();
      return;
    }

    // IafGraphicsSvc.getStatus
    try {
      
      // RRP PLAT-4607: 4.3 Review if loadModelInfo can further be made performant
      const st = performance.now();
      const status = await IafGraphicsSvc.getStatus();
      const et = performance.now();
      const tt = et - st;
      IafUtils.devToolsIaf && console.log("Graphics Service Status time taken:", tt, "milliseconds");
      IafUtils.devToolsIaf && console.log ('IafViewerDBM.loadModelInfo'
          , '/IafGraphicsSvc.getStatus()', status
      );  
    } catch (error) {
      NotificationStore.notifyGraphicsServerIsNotUp(this);
      console.error ('IafViewerDBM.loadModelInfo', this.graphicsServiceOrigin, 'is not up', error);
      endPerfLogger();
      return;
    }

    NotificationStore.notifyExtractingModelInfo(this, model);
    const graphicsHandler = new IafGraphicsResourceHandler(this, this.state.models);

    this._fileSet = []

    const primaryModel = await IafProjectUtils.getPrimaryModel(this.props, model, this.state.models);

    const loadExternalModelResources = async () => {
      IafUtils.devToolsIaf && console.log("IafViewerDBM.loadModelInfo Loading external model resources");
      const models = await graphicsHandler.initializeGraphicsResources({
        excludeModels: [primaryModel._id],
        enable3d: view3d?.enable,
        enable2d: view2d?.enable,
        enableGis: gis?.enable
      });

      models?.forEach((model) => {
        if (model.graphicsResource) {
        model.graphicsResource.isExternal = true;
        model.graphicsResource.primaryModel = primaryModel;
        }
        if (model.graphicsResource2d) {
        model.graphicsResource2d.isExternal = true;
        model.graphicsResource2d.primaryModel = primaryModel;
        }
      })
      IafUtils.devToolsIaf && console.log("IafViewerDBM.loadModelInfo External model resources loaded:", models);
      return models;
    }
  
    const loadPrimaryModelResources = async () => {
      IafUtils.devToolsIaf && console.log("IafViewerDBM.loadModelInfo Loading primary model resources");
      const model = await graphicsHandler.initializeGraphicsResources({
        append: true,
        includeModels: [primaryModel._id],
        fileSetInExternal,
        fileSetInExternal2d,
        enable3d: view3d?.enable,
        enable2d: view2d?.enable,
        enableGis: gis?.enable
      });
      console.log("IafViewerDBM.loadModelInfo Primary model resources loaded:", model);
      return model;
    }

    const loadOutlineFiles = async () => {
      IafUtils.devToolsIaf && console.log("IafViewerDBM.loadModelInfo Loading outline files");
      await graphicsHandler.setupOutlineFiles();
    IafUtils.devToolsIaf && console.log("IafViewerDBM.loadModelInfo Outline files loaded");
      return true;
    }

    const startTime = performance.now();// RRP PLAT-4607: 4.3 Review if loadModelInfo can further be made performant
    // await this.graphicsHandler.initializeGraphicsResources();
    let externalModelResources = null;
    const federationType = this.getDefaultFederationType();

    if((federationType === "Project" || federationType === "MultiModel")// ATK PLG-1643: UX - Review Single Channel as a Setting in the Settings Pane
      || IafUtils.researchIaf
    ){
      externalModelResources = await loadExternalModelResources();
    }

    const fileSetInExternal = graphicsHandler.getFileSets();
    const fileSetInExternal2d = graphicsHandler.getFileSets2d();
    IafUtils.devToolsIaf && console.log ('IafViewerDBM.loadModelInfo, linked filesets', JSON.parse(JSON.stringify(fileSetInExternal)));

    const primaryModelResources = await loadPrimaryModelResources();
    const fileSetInAll = graphicsHandler.getFileSets();
    console.log ('IafViewerDBM.loadModelInfo, all filesets', JSON.parse(JSON.stringify(fileSetInAll)));

    // RRP PLAT-4607: 4.3 Review if loadModelInfo can further be made performant
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    IafUtils.devToolsIaf && console.log("Total time taken:", totalTime, "milliseconds");

    await IafProjectUtils.logMultiModels(this.props, model, graphicsHandler, this.state.models);

    if (!primaryModel) {
      console.error("IafViewerDBM.loadModelInfo", "No Primary Model");
      endPerfLogger();
      return;
    }

    await loadOutlineFiles();

    let resources = null;
    let resources2d = null;

    if (view3d?.enable || gis?.enable) {
      resources = graphicsHandler.graphicsResourcesMap.get(primaryModel._id);
      if (externalModelResources) {
        resources.externalModelResources = externalModelResources;
      }

      if (view3d?.enable) { 
        // Check if fileSet is available for graphicsResources
        if (resources?.fileSet && _.size(resources?.fileSet._files) > 0) {
          this.setState({ idMapping: resources.idMapping, idMappingSet: resources.idMappingSet });
          this.setState({ units: resources.units })
        } else {
          // ATK PLG-1585: Track race condition - fileSet not attached to resources object yet
          console.warn('IafViewerDBM.loadModelInfo', '3D resources.fileSet check failed', {
            hasResources: !!resources,
            hasFileSet: !!resources?.fileSet,
            fileSetFilesSize: resources?.fileSet?._files?.length,
            primaryModelId: primaryModel._id,
            primaryModelResources: primaryModelResources,
            fileSetInAll: fileSetInAll
          });
        }
      }
    }


    if (view2d?.enable) {
      resources2d = graphicsHandler.graphicsResources2dMap.get(primaryModel._id);

      // await this.graphicsResources2d.build();// RRP PLAT-4607: 4.3 Review if loadModelInfo can further be made performant
      // Check if fileSet is available for graphicsResources2d
      if (resources2d?.fileSet && _.size(resources2d?.fileSet._files) > 0) {
        this.setState({ idMapping2d: resources2d.idMapping
                    , idMappingSet2d: resources2d.idMappingSet }
        );
      } else {
        // ATK PLG-1585: Track race condition - fileSet not attached to resources2d object yet
        console.warn('IafViewerDBM.loadModelInfo', '2D resources2d.fileSet check failed', {
          hasResources2d: !!resources2d,
          hasFileSet: !!resources2d?.fileSet,
          fileSetFilesSize: resources2d?.fileSet?._files?.length,
          primaryModelId: primaryModel._id,
          primaryModelResources: primaryModelResources,
          fileSetInAll2d: graphicsHandler.getFileSets2d()
        });
      }
    }


    let authToken = IafSession.getAuthToken()

    const hasValidFileSet3d = resources?.fileSet && _.size(resources?.fileSet._files) > 0;
    const hasValidFileSet2d = resources2d?.fileSet && _.size(resources2d?.fileSet._files) > 0;

    if (hasValidFileSet3d || hasValidFileSet2d || gis?.enable) {
      this._authToken = authToken
      this._model = model
      this._fileSet = resources?.fileSet
      this._fileSet2d = resources2d?.fileSet
      this._isLoading = false
      this.iafSpinnerManager?.endMonitoring();
      // Update state variables to trigger re-render with populated values
      // This ensures _createViewer() gets the correct fileSet and graphicsResources after build() completes
      console.log('IafViewerDBM.loadModelInfo', 'SETTING isModelLoaded=true', {
        caller: caller,
        hasValidFileSet3d: hasValidFileSet3d,
        hasValidFileSet2d: hasValidFileSet2d,
        fileSet3dId: resources?.fileSet?._id,
        fileSet2dId: resources2d?.fileSet?._id,
        fileSet3dFilesCount: resources?.fileSet?._files?.length,
        fileSet2dFilesCount: resources2d?.fileSet?._files?.length,
        currentIsModelLoaded: this.state.isModelLoaded,
        currentIs2dModelLoaded: this.state.is2dModelLoaded,
        stackTrace: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
      this.setState({ 
        isModelLoaded: true,
        is2dModelLoaded: true,
        fileSet: resources?.fileSet || null,
        fileSet2d: resources2d?.fileSet || null
      });
      console.log ('IafViewerDBM.loadModelInfo', 'complete', {
        isModelLoaded: true,
        is2dModelLoaded: true,
        fileSetSet: !!resources?.fileSet,
        fileSet2dSet: !!resources2d?.fileSet
      });
    } else {
      // ATK PLG-1585: Track race condition - no valid fileSet found, preventing isModelLoaded from being set
      // This is CRITICAL because if isModelLoaded is not set, the viewer will not render
      console.error('IafViewerDBM.loadModelInfo', 'CRITICAL: No valid fileSet found for 3D or 2D viewer. isModelLoaded will NOT be set.', {
        caller: caller,
        view3dEnabled: view3d?.enable,
        view2dEnabled: view2d?.enable,
        hasResources: !!resources,
        hasResources2d: !!resources2d,
        resourcesFileSet: resources?.fileSet,
        resources2dFileSet: resources2d?.fileSet,
        resourcesFileSetFilesSize: resources?.fileSet?._files?.length,
        resources2dFileSetFilesSize: resources2d?.fileSet?._files?.length,
        hasValidFileSet3d: hasValidFileSet3d,
        hasValidFileSet2d: hasValidFileSet2d,
        primaryModelId: primaryModel?._id,
        primaryModelResources: primaryModelResources,
        fileSetInAll: fileSetInAll,
        fileSetInAll2d: graphicsHandler.getFileSets2d(),
        graphicsResourcesMapSize: graphicsHandler.graphicsResourcesMap?.size,
        graphicsResources2dMapSize: graphicsHandler.graphicsResources2dMap?.size,
        graphicsResourcesMapKeys: Array.from(graphicsHandler.graphicsResourcesMap?.keys() || []),
        graphicsResources2dMapKeys: Array.from(graphicsHandler.graphicsResources2dMap?.keys() || [])
      });
    }

    IafUtils.devToolsIaf && console.log ('IafViewerDBM.loadModelInfo'
        // , '/layers', JSON.stringify(layers)
        , '/graphicsResources', resources
        , '/graphicsResources2d', resources2d
    );

    this.setState({
      authToken: IafSession.getAuthToken(),
      graphicsHandler: graphicsHandler,
      graphicsResources: resources,
      graphicsResources2d: resources2d
    });

    iafPerfLogger.end();
  }

  render() {    
    const { serverUri, selection, sliceElementIds, hiddenElementIds, settings,
      viewerResizeCanvas, saveSettings, btns, topics, colorGroups, spaceElementIds, units, cuttingPlaneValues } = this.props
    const { scriptLoadedCommunicator } = this.state;

    const view3d = { ...PropertyStore.view3d, ...this.props?.view3d };
    const view2d = { ...PropertyStore.view2d, ...this.props?.view2d };

    //DBM-1003: use this._model instead of this.props.model so render()
    //won't trigger when props.model is changed but state.fileSet is not updated yet
    let viewerElement;
    if ((
          (
            // PLG-1522 if we do not specify any models and just keep gis enabled
            // this.state.selectedModel && 
            IafResourceUtils.isCommunicatorLoaded()) 
          || this.props.arcgis?.enable && this.props.arcgis
          || this.props.arcgisOverview?.enable && this.props.arcgisOverview
          || this.props.ue?.enable && this.props.ue
          || this.props.photosphere?.enable && this.props.photosphere
          || (this.props.gis?.enable && this.props.gis)
          // PLG-1522 if we do not specify any models and just keep gis enabled
          // Even when 3D model is empty or disabled need to allow to see GIS.
          // || (!view3d?.enable
          //     && view2d?.enable
          //     && this.props.gis?.enable && this.props.gis)
        ) 
        && _.size(this.state.authToken) > 0 
        && this.state.permissionsInitialized
      ) {
      viewerElement = (
        <IafViewer
          // ===== Props (via this.props, with PropertyStore fallbacks) =====
          
          btns = {this.props.btns !== undefined ? this.props.btns : PropertyStore.btns}
          topics={this.props.topics !== undefined ? this.props.topics : PropertyStore.topics} 
          colorGroups={this.props.colorGroups !== undefined ? this.props.colorGroups : PropertyStore.colorGroups}

          // View Modes (arcgis / ue / view3d: forward app callbacks via IafViewerDBM methods, same pattern as gis).
          // Use arrows so widgets that destructure and call handlers as bare functions (e.g. UE onUeReady) still see DBM as `this`.
          arcgis={{
            ...PropertyStore.arcgis,
            ...this.props.arcgis,
            eventHandler: (e) => this.OnArcgisEventHandler(e),
            onIafMapReady: (p) => this.OnArcgisIafMapReady(p),
          } ?? {}}
          arcgisOverview={{ ...PropertyStore.arcgisOverview, ...this.props.arcgisOverview } ?? {}}
          ue={{
            ...PropertyStore.ue,
            ...this.props.ue,
            eventHandler: (e) => this.OnUeEventHandler(e),
            onUeReady: (info) => this.OnUeReady(info),
          } ?? {}}
          photosphere={{ ...PropertyStore.photosphere, ...this.props.photosphere } ?? {}}
          gis={this.buildGisPropsForViewer() ?? {}}
          view3d={{
            ...view3d,
            renderingMode:
              this.props.view3d?.enable && this.props.view3d?.renderingMode === EvmUtils.EVMDrawMode.XRay
                ? EvmUtils.EVMDrawMode.Glass
                : this.props.view3d?.renderingMode,
            onRenderingModeChange: (mode) => this.OnView3dRenderingModeChange(mode),
            onCameraUpdate:
              typeof view3d.onCameraUpdate === "object" && view3d.onCameraUpdate !== null
                ? {
                    ...view3d.onCameraUpdate,
                    callback: (cameraJson) => this.OnView3dCameraUpdateCallback(cameraJson),
                  }
                : view3d.onCameraUpdate,
          } ?? {}}
          view2d={{ ...PropertyStore.view2d, ...this.props.view2d } ?? {}}

          // UI Customization
          toolbarSize={this.props.toolbarSize ?? PropertyStore.toolbarSize}
          toolbarColor={this.props.toolbarColor ?? PropertyStore.toolbarColor}
          sidePanelColor={this.props.sidePanelColor ?? PropertyStore.sidePanelColor}
          showSidePanel={this.props.showSidePanel !== undefined ? this.props.showSidePanel : PropertyStore.showSidePanel}
          showToolTip={this.props.showToolTip !== undefined ? this.props.showToolTip : PropertyStore.showToolTip}
          onHoverIconColor={this.props.onHoverIconColor ?? PropertyStore.onHoverIconColor}
          onActiveIconColor={this.props.onActiveIconColor ?? PropertyStore.onActiveIconColor}
          title={this.props.title ?? PropertyStore.title}

          // Viewer Behavior
          enable2DViewer={this.props.enable2DViewer !== undefined ? this.props.enable2DViewer : PropertyStore.enable2DViewer}
          enableFocusMode={this.props.enableFocusMode !== undefined ? this.props.enableFocusMode : PropertyStore.enableFocusMode}
          enableOptimizedSelection={this.props.enableOptimizedSelection !== undefined ? this.props.enableOptimizedSelection : PropertyStore.enableOptimizedSelection}
          enablePersistence={this.props.enablePersistence ?? PropertyStore.enablePersistence}
          enablePreSignedUrls={this.state.enablePreSignedUrls}
          workflow={this.props.workflow ?? PropertyStore.workflow}
          pdf2DUrl={this.props.pdf2DUrl ?? PropertyStore.pdf2DUrl}
          modelComposition={this.props.modelComposition ?? PropertyStore.modelComposition}
          isShowNavCube={this.props.isShowNavCube !== undefined ? this.props.isShowNavCube : PropertyStore.isShowNavCube}
          isIpaDev={this.props.isIpaDev}

          // ===== State (via this.state) =====
          models={this.state.models}
          model={this.state.selectedModel}
          modelVersionId={this.state.selectedModel?._versionId}
          authToken={this.state.authToken}
          toolbarList={this.state.toolbarList}
          viewList={this.state.viewList}
          shadingList={this.state.shadingList}
          navigationList={this.state.navigationList}
          measurementList={this.state.measurementList}
          manipulateList={this.state.manipulateList}
          idMapping={this.state.idMapping}
          idMappingSet={this.state.idMappingSet}
          idMapping2d={this.state.idMapping2d}
          units={this.state.units}

          // ===== Locally Scoped (functions or computed) =====

          // Viewer Data
          fileSet={this.state.fileSet || (_.size(this._fileSet) > 0 ? this._fileSet : null)}
          fileSet2d={this.state.fileSet2d || (_.size(this._fileSet2d) > 0 ? this._fileSet2d : null)}
          selection={selection}
          sliceElementIds={sliceElementIds}
          hiddenElementIds={hiddenElementIds}
          spaceElementIds={spaceElementIds}
          cuttingPlaneValues={cuttingPlaneValues}

          // Viewer Control and Graphics
          settings={settings}
          saveSettings={saveSettings}
          viewerResizeCanvas={viewerResizeCanvas}
          wsUri={(this.props.view3d?.enable || this.props.view2d?.enable) ? this.graphicsServiceOrigin?.replace('http', 'ws') : null}
          graphicsResources={this.state.graphicsHandler?.graphicsResourcesMap.get(this.state.selectedModel?._id)}
          graphicsResources2d={this.state.graphicsHandler?.graphicsResources2dMap.get(this.state.selectedModel?._id)}
          graphicsHandler={this.state.graphicsHandler}

          // Callbacks
          updateToolbar={this.updateNewToolbar}
          OnIsolateElementChangeCallback={this.OnIsolateElementChangeCallback}
          OnSelectedElementChangeCallback={this.OnSelectedElementChangeCallback}
          OnHiddenElementChangeCallback={this.OnHiddenElementChangeCallback}
          OnResetCallback={this.OnResetCallback}
          OnNotificationCallback={this.OnNotificationCallback}
          OnViewerReadyCallback={this.OnViewerReadyCallback}
          OnModelCompositionReadyCallback={this.OnModelCompositionReadyCallback}
          openNotification={this.openNotification}
          closeNotification={this.closeNotification}
          showConfirmDialog={this.showConfirmDialog}

          //Federated Dynamics
          handleModelSelection={this.handleModelSelection}
          isSingleWsEnabled={this.getIsSingleWsEnabled()}// ATK PLG-1643: UX - Review Single Channel as a Setting in the Settings Pane
          defaultFederationType={this.getDefaultFederationType()}
          // Ref
          ref={this.iafviewerRef}

          // Optional Internal (commented out)
          // allEntities={this.props.allEntities !== undefined ? this.props.allEntities : PropertyStore.allEntities}
        />
      )
    }

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <IafNotificationRef ref={this.iafNotificationRef} />
        <IafConfirmDialogRef ref={this.confirmDialogRef} />
        <ModelContext.Provider
          value={{
            selectedModel: this.state.selectedModel,
            models: this.state.models,
            handleModelSelection: this.handleModelSelection,
          }}
      >
        {viewerElement}
         <IafSpinner 
          condition={!this.state.isModelLoaded}>
        </IafSpinner>     
      </ModelContext.Provider>
      </div>
    )
  }

}

export default IafViewerDBM;