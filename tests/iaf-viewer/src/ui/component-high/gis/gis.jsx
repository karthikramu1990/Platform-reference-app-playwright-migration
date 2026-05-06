// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 10-07-23    ATK        PLAT-3065   Created
// 11-08-23    ATK                    Ground Elevation
// 12-03-24    ATK                    Drag Fixes - Matching up the two different contexts with some adjustment
// 05-04-24    ATK        PLAT-4432   Code Restructuring, Drag Fixes,  handleDrag, updateAlignment, fetchAlignment
// -------------------------------------------------------------------------------------

import React from "react";

//UX-UI imports
import { IafHeading } from "../../component-low/iafHeading/IafHeading.jsx";
import { IafSubHeader } from "../../component-low/iafSubHeader/IafSubHeader.jsx";
import { IafSlider } from "../../component-low/iafSlider/IafSlider.jsx";
import { IafSwitch } from "../../component-low/iafSwitch/IafSwitch.jsx";
import { IafDropdown } from "../../component-low/iafDropdown/IafDropdown.jsx";
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
// import IafTooltip from "../../component-low/Iaftooltip/IafTooltip.jsx";

import './gis.scss';

// Utils, Common imports
import { getMilliMetersPerPixelFromModel, getModelViewObject, iafAdjustCamera } from '../../../core/camera.js'

import IafEnableUtils from '../../../common/enableUtils.js';

import { IafTuner } from "../../../core/gis/tuner.js"
import { Styles } from "../../../core/gis/styles.js";
import { Layers } from "../../../core/gis/layers.js";
import IafMapBoxGl, { gisExportKey, MapTransitionEvents, zOffsetForUndergroundIllusion } from "../../../core/gis/iafMapBoxGl.js";
import { defaultGisData, MAGIC_NUMBER_DEFAULT_TERRAIN_HEIGHT } from "../../../core/gis/defaultGisData.js";
import TooltipStore from "../../../store/tooltipStore.js";
import IafUtils, { IafProjectUtils, IafObjectUtils, IafPerfLogger, IafStorageUtils, IafFileUtils, IafQueueUtils } from "../../../core/IafUtils.js";
import { NotificationStore } from "../../../store/notificationStore.js";
import { IafResourceUtils } from "../../../core/IafResourceUtils.js";
import { IafGeoCoder } from "../../component-low/iafGeoCoder/IafGeoCoder.jsx";
import IafViewer from "../../../IafViewer.jsx";
import { getElevationModeLabel, GisElevationMode, GisElevationModeLabel, GisFederatedMode } from "../../../common/enums/gis.js";
import { IafProj } from '@dtplatform/platform-api';
import { IafMathUtils } from "../../../core/IafMathUtils.js";
import getMapboxToken from "../../../core/gis/accessTokens.js";
import { ECuttingPlane } from "../../../common/IafViewerEnums.js";
import { IafApiClientGis } from "../../../core/database/IafDatabaseManager.js"
import { getMapElevationModes, getMapLayers, getMapStyles, getFederatedModes } from "./helpers.jsx";
import { PRIMARY_MODEL_INDEX } from "../../../core/database/unittests/gis.js";
import GisMarker from "./gis.marker.jsx";
import IafMapBoxGLProxy from "../../../core/gis/iafMapBoxGlProxy.js";
import { GisDistance } from "../../../core/gis/distance.js";
import { IafGltfManager } from "../../../core/gis/iafGltfManager.js";
import { IafGraphicsResourceHandler } from "../../../core/IafGraphicsResourceManager.js";
import PropertyStore from "../../../store/propertyStore.js";
import { IafModelComposition } from "../../../core/IafModelComposition.js";
import { IafUiEvent, iafUiEventBus } from "../../iafUiEvents.js";
import { getInterpolatedZoomLevel } from "../../../core/gis/utils.js";
import { MAX_PITCH } from "../../../core/gis/enums.js";
import { permissionManager, RESOURCE_TYPES } from "../../../core/database/permission/iafPermissionManager.js";
import IafSpinnerManager from "../../../core/IafSpinnerManager.js";
import { IafCommandUtils } from "../../../core/IafCommandUtils.js";
import { IafModelPositionHandler } from "../../../core/IafModelPositionHandler.js";
import EvmUtils from "../../../common/evmUtils.js";

const PRECISION = 1.;
const EPSILON = 0.00001;

// export function ReactGis(props) {
export default class ReactGis extends React.Component {

  options = undefined;

  minZoom = 2;
  maxZoom = 21;
  zoomStep=0.01;

  minBearing = -179;
  maxBearing = 180;

  minPitch = 0;
  maxPitch = MAX_PITCH;

  lnglatstep = 0.000001;

  handleZoomWheelDelta = 0;
  handleZoomTimeout = undefined;

  minTerrainHeight = -1000;
  maxTerrainHeight = 1000;
  terrainHeightStep = 1;

  elevationModes = getMapElevationModes();
  federatedModes = getFederatedModes();
  project = IafProj.getCurrent();

  mapStyles = getMapStyles();
  mapLayers = getMapLayers();

  
  // ------------------------------------------------------------------------------------------------------------------------
  // Constructor & Life Cycle Hooks
  // ------------------------------------------------------------------------------------------------------------------------

  constructor(props) {
    super(props);

    /** @type {IafViewer} */
    this.iafViewer = props.iafViewer;
    this.iafViewer.gisInstance = this;

    window.timeoutspeed = 0;

    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | ReactGis.constructor', '/this', this);
    this.state = {
      key: IafUtils.generateUUID(),
      // Common States
      zoom: props.gis?.initial?.zoom ?? defaultGisData._properties.session.zoom,
      pitch: props.gis?.initial?.pitch ?? defaultGisData._properties.session.pitch,
      uiBearing: props.gis?.initial?.bearing ?? defaultGisData._properties.session.bearing,

      bGroundElevation: true,
      prevMapStyle: Styles.Default,
      prevMapLayer: Layers.Default,
      // elevationMode: this.iafViewer?.iafMapBoxGl?.modelHandler?.getVerticalShift() < 0.0001 ? GisElevationMode.QuickSurface : GisElevationMode.None,
      // elevationMode: props?.gis?.elevationMode ?? GisElevationMode.None,
      // federatedMode: props?.gis?.federatedMode ?? GisFederatedMode.None,

      token: undefined,
      isGlobeView: false,
      isNavigation: false,

      // Model Specific States
      models: this.initializeModelStates(),
      bModelRealignModeHorizontal: false,
      bModelRealignModeVertical: false,
      expandedModelPanelId: null, // Track which model panel is expanded
      showModelTitles: true, // Toggle between showing titles (true) or names (false)

      enable: false,
      isElevationModeUpdated: true,
      isFederatedModeUpdated: true,
      isReferenceModelUpdated: true,
      // longitude: 0,
      // latitude: 0,
      // bearing: 0,
      // terrainHeight: 0,

      // To be deprecated
      // pitch: 0
    };
    this.debugLogRealignmentState("constructor");
    this.primaryModelId = this.props.gis.primaryModelId ?? this.iafViewer.props.graphicsResources?.dbModel?._id;
    // this.prevPrimaryModelId = this.primaryModelId; // Track previous primaryModelId for change detection
    
    // Initialize queue utility for coordinating async operations
    this.operationQueue = new IafQueueUtils(true);
    /** Snapshot of model lng/lat when horizontal realign starts; drag + saveGisData overwrites gisData, so reset must not rely on initializeModelStates() alone. */
    this._realignLngLatBaselineByModelId = Object.create(null);
  }

  setIafViewerState(state, callback) {
    const gis = {
        ...this.iafViewer.state.gis,
        ...state
    };
    this.iafViewer.setState({gis}, callback);
  }

  getIafViewerState() {
    return this.iafViewer.state?.gis;
  }

  /**
   * Invokes optional gis alignment callbacks from the app; safe if unset or if the handler throws.
   * @param {'onLongitudeChange'|'onLatitudeChange'|'onBearingChange'|'onAltitudeChange'} propName
   * @param {string[]} modelIds
   * @param {number} value
   */
  invokeGisAlignmentCallback(propName, modelIds, value) {
    const fn = this.props.gis?.[propName];
    if (typeof fn !== "function" || !Array.isArray(modelIds) || modelIds.length === 0) return;
    try {
      fn(modelIds, value);
    } catch (e) {
      console.warn(`IafViewer.EVMMode.Mapbox | ReactGis.${propName}`, e);
    }
  }

  /**
   * When focusing a non-primary building (marker click / fly-to), reset dynamic LOD distance and zoom
   * from {@link PropertyStore.gis}. When focusing the primary, restore {@link IafViewer} gis props.
   */
  applyDynamicRenderingForFocusedModel(modelId) {
    if (!modelId) return;
    const isPrimary =
      modelId ===
      (this.primaryModelId ??
        this.getIafViewerState()?.primaryModelId ??
        this.props.gis?.primaryModelId ??
        this.iafViewer.props.graphicsResources?.dbModel?._id);
    const distProp = this.iafViewer.props.gis?.dynamicRenderingDistance;
    const zoomProp = this.iafViewer.props.gis?.dynamicRenderingZoom;
    const storeGis = PropertyStore.gis;
    const storeDist = storeGis?.dynamicRenderingDistance;
    const storeZoom = storeGis?.dynamicRenderingZoom;
    let dynamicRenderingDistance;
    let dynamicRenderingZoom;
    if (isPrimary) {
      dynamicRenderingDistance =
        typeof distProp === "number" && Number.isFinite(distProp)
          ? distProp
          : typeof storeDist === "number" && Number.isFinite(storeDist)
            ? storeDist
            : 750;
      dynamicRenderingZoom =
        typeof zoomProp === "number" && Number.isFinite(zoomProp)
          ? zoomProp
          : typeof storeZoom === "number" && Number.isFinite(storeZoom)
            ? storeZoom
            : 14;
    } else {
      dynamicRenderingDistance = 1;
        // typeof storeDist === "number" && Number.isFinite(storeDist)
        //   ? storeDist
        //   : 750;
      dynamicRenderingZoom =
        typeof storeZoom === "number" && Number.isFinite(storeZoom)
          ? storeZoom
          : 14;
    }

    this.setIafViewerState(
      { dynamicRenderingDistance, dynamicRenderingZoom },
      () => {
        const z = this.iafViewer.iafMapBoxGl?.map?.getZoom?.();
        if (typeof z === "number") {
          this.iafViewer.iafTuner?.updateModelDisplay(z);
        }
      }
    );
  }

  async componentDidMount() {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | ReactGis.componentDidMount'
      , '/this.props.gis', this.props.gis
      , '/this.primaryModelId', this.primaryModelId
    );
    const result = await this.getGisData();
    const gisData = result._properties;

    // Merge from persisted/cluster-enriched buildings even when this.state.models was still {} (graphicsResources
    // not ready on first paint). Do not require a pre-existing initializeModelStates() entry per building id.
    const models = this.syncModelStatesFromBuildings(this.state.models, gisData?.buildings);

    this.setState({
      models,

      zoom: gisData ? gisData.session.zoom : 0,
      pitch: gisData ? gisData.session.pitch : 0,
      uiBearing: gisData ? gisData.session.bearing : 0,
      prevMapStyle: gisData ? Styles.data[gisData.session.style]?.index : Styles.Default,
      prevMapLayer: gisData ? Layers.data[gisData.session.layer]?.index : Layers.Default,

      // Model Specific Variables
      // longitude: gisData?.buildings?.[PRIMARY_MODEL_INDEX]?.alignment?.longitude ?? 0,
      // latitude: gisData?.buildings?.[PRIMARY_MODEL_INDEX]?.alignment?.latitude ?? 0,
      // bearing: gisData?.buildings?.[PRIMARY_MODEL_INDEX]?.alignment?.bearing ?? 0,
      // terrainHeight: gisData?.buildings?.[PRIMARY_MODEL_INDEX]?.alignment?.terrainHeight ?? 0,
    }, async () => {
      IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | ReactGis.componentDidMount', '/state.models', this.state.models);
      const primaryModelCenterFromModelCompositionProperties = IafModelComposition.getGeoCenterByModelIdFromCluster(this.iafViewer, this.primaryModelId);
      const primaryModelCenterFromDefaultGisData = defaultGisData._properties.buildings[0].alignment.center;
      this.options = {
        container: this.iafViewer.evmElementIdManager.getEvmUuid(EvmUtils.EVMMode.Mapbox), // container ID
        projection: 'globe',
        style: Styles.data[gisData ? gisData.session.style : 'Streets'].path, // style URL
        pitch: this.state.pitch,
        maxPitch: this.maxPitch,
        zoom: this.state.zoom, // starting zoom

        // Model Specific Variables (fallback to 0 / default when primary model is undefined)
        bearing: this.state.models[this.primaryModelId]?.bearing ?? 0,
        center: {
          lng: this.state.models[this.primaryModelId]?.longitude ?? primaryModelCenterFromModelCompositionProperties?.lng ?? primaryModelCenterFromDefaultGisData.lng,
          lat: this.state.models[this.primaryModelId]?.latitude ?? primaryModelCenterFromModelCompositionProperties?.lat ?? primaryModelCenterFromDefaultGisData.lat
        }, // starting position [lng, lat]

        // Why do we need below ? Must be by mistake
        // minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        // minTerrainHeight: this.minTerrainHeight,
        // maxTerrainHeight: this.maxTerrainHeight,
      };

      try {
        let token = await getMapboxToken(this.iafViewer);
        this.setState({ token }, () => {
          if (this.props.enableMapBox) {
            // this.iafViewer.iafMapBoxGl && this.updatePrimaryModel();
            !this.iafViewer.iafMapBoxGl && this.handleEnableMapBox({
              target: {
                checked: this.props.enableMapBox
              }
            })
          }
        });
      } catch (error) {
        console.error('IafViewer.EVMMode.Mapbox | IafGis', error);
        NotificationStore.notifyGisNoLicense(this.iafViewer);
      } finally {
        this.state.token?.type === 'trial' && NotificationStore.notifyGisTrialLicense(this.iafViewer);
      }
    });

    const resetElevationModeWithNotification = () => {
      // const prevElevationMode = this.getIafViewerState()?.elevationMode;
      this.setIafViewerState({elevationMode: GisElevationMode.None});
      // this.setElevationMode(GisElevationMode.None, prevElevationMode)
      // .then(() => {
      //   NotificationStore.notifyGisElevationModeIsReset(this.iafViewer);
      //   // setTimeout(()=>{
      //   //   this.setIafViewerState({elevationMode: prevElevationMode});
      //   //   this.setElevationMode(prevElevationMode, GisElevationMode.None);
      //   // }, 2000);
      // });
    }

    // Reflect to change in the disciplines
    iafUiEventBus.on(IafUiEvent.IafEventDisciplineEnable, () => {
      if (!this.iafViewer.iafMapBoxGl) return;
      resetElevationModeWithNotification();
    })
  }

  refreshMarkers() {
    this.iafViewer.iafMapBoxGl?.setOnMarkerUpdate(
        this.handleOnMarkerUpdate.bind(this),
        this.state.models,
        this.showConfirmDialog.bind(this)
    );
    this.iafViewer.iafTuner?.updateModelDisplay(this.options.zoom);
  }
  
  showConfirmDialog = async (options) => {
    const fn = this.props.iafViewer?.props?.showConfirmDialog;
    if (typeof fn === "function") {
      return await fn(options);
    }
    return window.confirm(options?.message || "Are you sure?");
  };
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.state.token) return;

    // Detect when _viewer becomes available (e.g., when view3d.enable changes from false to true)
    // This ensures the component updates after updatePrimaryModel is called from iafModelCompositionReady
    // Check if viewer was not available before but is now available
    const prevViewerAvailable = prevProps.iafViewer?._viewer !== undefined;
    const currentViewerAvailable = this.props.iafViewer?._viewer !== undefined;
    if (!prevViewerAvailable && currentViewerAvailable && this.props.enableMapBox && this.iafViewer.iafMapBoxGl) {
      // Initialize models if empty before forcing update
      if (!this.state.models || Object.keys(this.state.models).length === 0) {
        this.setState({
          models: this.initializeModelStates()
        });
      } else {
        // Force component update to reflect that viewer is now available
        // This will trigger re-render after updatePrimaryModel completes
        this.setState(prevState => ({
          models: { ...prevState.models }
        }));
      }
    }
    
    // Check if models are empty and initialize them if needed (only if resources are available)
    if ((!this.state.models 
      || Object.keys(this.state.models).length === 0) 
      && this.props.graphicsResources?.length > 0) {
      this.setState({
        models: this.initializeModelStates()
      });
    }

    if (this.props.graphicsResources !== prevProps.graphicsResources
      || this.props.graphicsResources2d !== prevProps.graphicsResources2d
      || this.props.graphicsHandler !== prevProps.graphicsHandler
    ) {
      this.setState({
        models: this.initializeModelStates()
      });
    }

    if (this.state.enable !== prevState.enable) {
      IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.componentDidUpdate', '/this.state.enable', this.state.enable, '/prevState.enable', prevState.enable);
    }

    if (this.props.enableMapBox !== prevProps.enableMapBox) {
      IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.componentDidUpdate', '/this.props.enableMapBox', this.props.enableMapBox, '/prevProps.enableMapBox', prevProps.enableMapBox);
      // Use handleEnableMapBox to ensure preprocessing happens (updateRealignmentState, updateMapOptions, etc.)
      this.handleEnableMapBox({
        target: {
          checked: this.props.enableMapBox
        }
      });
    }
    
    if (this.state.enable !== prevState.enable && this.state.enable) {
        // Queue enableMapBox if setElevationMode is in progress, otherwise execute immediately
        this.operationQueue.queueOperation(
          () => this.enableMapBox(),
          ['setElevationMode'], // Wait for setElevationMode flag to be unset
          'enableMapBox'
        );
        // this.refreshFederatedDisplay();
    }

    if (this.props.gis.elevationMode !== prevProps.gis.elevationMode) {
      const prevElevationMode = prevProps.gis.elevationMode;
      const elevationMode = this.props.gis?.elevationMode ?? GisElevationMode.None;
      this.setState({isElevationModeUpdated: false});
      this.setElevationMode(elevationMode, prevElevationMode).then(() => {
        // Invoke callback if provided after async operation completes
        if (typeof this.iafViewer.props.gis?.onElevationModeChanged === 'function') {
          this.iafViewer.props.gis.onElevationModeChanged(elevationMode);
        }
        this.setState({isElevationModeUpdated: true});
      }).catch((error) => {
        console.error('IafViewer.EVMMode.Mapbox | IafGis.setElevationMode error:', error);
      });
    }

    if (this.props.gis.federatedMode !== prevProps.gis.federatedMode) {
      const federatedMode = this.props.gis.federatedMode ?? GisFederatedMode.None;
      const prevFederatedMode = prevProps.gis.federatedMode;
      const shouldAddGltf = this.shouldLoadGltfForMode(federatedMode) && (prevFederatedMode === GisFederatedMode.None || prevFederatedMode === GisFederatedMode.Markers);
      const shouldRemoveGltf = !this.shouldLoadGltfForMode(federatedMode) && this.shouldLoadGltfForMode(prevFederatedMode);
      this.setState({isFederatedModeUpdated: false});
      this.setState({models: this.initializeModelStates()}, async () => {
        this.refreshMarkers();
        if (shouldAddGltf) {
          IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.componentDidUpdate'
            , '/this.iafViewer?.iafGltfManager?.gltfModelMap?.size', this.iafViewer?.iafGltfManager?.gltfModelMap?.size
            , '/this.getModelCount()', this.getModelCount()
          );

          const hasModels = this.props.models?.length > 0;

          const gltfApply = async () => {
            if (this.iafViewer?.iafGltfManager?.gltfModelMap?.size === this.getModelCount()) {
              // this.iafViewer.iafGltfManager?.refreshGltfModels();
              this.iafViewer.iafGltfManager.enableGltfModels(true);
            } else {
              await this.addGltfModels();
            }
          }

          if (hasModels && !this.getModelCount()) {
            let tryCount = 0;
            const maxTries = 3;
            const tryGltfApply = async () => {
              if (this.getModelCount()) {
                await gltfApply();
              } else if (tryCount < maxTries) {
                tryCount++;
                setTimeout(tryGltfApply, 2000);
              } else {
                // Still zero after max tries, fallback to calling gltfApply anyway
                await gltfApply();
              }
            };
            await tryGltfApply();
          } else {
            await gltfApply();
          }

        } else if (shouldRemoveGltf) {
          if (federatedMode === GisFederatedMode.None) {
            this.iafViewer.iafGltfManager.deleteGltfModels();
          } else {
            this.iafViewer.iafGltfManager.enableGltfModels(false);
          }
        }
        
        if (federatedMode === GisFederatedMode.None) {
          NotificationStore.notifyGisElevationModeIsReset(this.iafViewer);
        }
        
        // Invoke callback if provided after async operations complete
        if (typeof this.iafViewer.props.gis?.onFederatedModeChanged === 'function') {
          this.iafViewer.props.gis.onFederatedModeChanged(federatedMode);
        }
        this.setState({isFederatedModeUpdated: true});
      });
    }
    if (this.state.enable !== prevState.enable && !this.state.enable) {
      // Queue disableMapBox if setElevationMode is in progress, otherwise execute immediately
      this.operationQueue.queueOperation(
        () => this.disableMapBox(),
        ['setElevationMode'], // Wait for setElevationMode flag to be unset
        'disableMapBox'
      );
      // this.refreshFederatedDisplay();
    }

    if (this.props.gis.primaryModelId !== prevProps.gis.primaryModelId
      && this.primaryModelId !== this.props.gis.primaryModelId
    ) {
      this.primaryModelId = this.props.gis.primaryModelId;
      // this.prevPrimaryModelId = this.primaryModelId; // Update tracking variable
      // ATK PLG-1585: Only call handleModelSelection if the model is different from current selectedModel
      // This prevents circular calls when primaryModelId is synced from selectedModel changes in IafViewerDBM
      const modelToSelect = this.state.models?.[this.primaryModelId]?.dbModel;
      const currentSelectedModelId = this.iafViewer?.props?.model?._id;
      this.setState({isReferenceModelUpdated: false});
      if (this.primaryModelId && this.props.handleModelSelection && modelToSelect && modelToSelect._id !== currentSelectedModelId) {
        this.props.handleModelSelection(modelToSelect);
      } 
    }

    // Detect when models are initialized or primaryModelId changes from iafModelCompositionReady
    // This happens when view3d becomes available after GIS was enabled
    // const modelsWereInitialized = (!prevState.models || Object.keys(prevState.models).length === 0) && 
    //                               this.state.models && Object.keys(this.state.models).length > 0;
    // const primaryModelIdChanged = this.primaryModelId && this.primaryModelId !== this.prevPrimaryModelId;
    
    // // Call updatePrimaryModel when models are initialized or primaryModelId changes and viewer is available
    // if ((modelsWereInitialized || primaryModelIdChanged) && 
    //     this.props.enableMapBox && 
    //     this.iafViewer.iafMapBoxGl && 
    //     this.iafViewer._viewer) {
    //   // Update prevPrimaryModelId to track the change
    //   this.prevPrimaryModelId = this.primaryModelId;
    //   // Use the current primaryModelId
    //   this.updatePrimaryModel();
    // }

  // Detect model property changes and update gltf models accordingly
  if (this.state.models !== prevState.models) {
    // For each modelId in current models
    Object.keys(this.state.models || {}).forEach(modelId => {
      const prevModel = prevState.models?.[modelId];
      const currModel = this.state.models?.[modelId];

      // If the model was just added or any property has changed
      if (!prevModel || JSON.stringify(prevModel) !== JSON.stringify(currModel)) {
        // Update iafGltfManager's gis models if available
        if (this.iafViewer?.iafGltfManager) {
          // Set models if setGisModels exists
          if (typeof this.iafViewer.iafGltfManager.setGisModels === "function") {
            this.iafViewer.iafGltfManager.setGisModels(this.state.models);
          }
          // Retrieve gltf for this model, update orientation and redraw
          const gltf = this.iafViewer.iafGltfManager.gltfModelMap?.get(modelId);
          if (gltf && gltf.orientation) {
            // Update orientation properties from currModel, similar to redraw method
            // Only update properties that have changed and are defined in currModel
            let orientationUpdated = false;
            
            if (currModel.bearing !== undefined && gltf.orientation.bearing !== currModel.bearing) {
              gltf.orientation.bearing = currModel.bearing;
              orientationUpdated = true;
            }
            if (currModel.latitude !== undefined && gltf.orientation.lat !== currModel.latitude) {
              gltf.orientation.lat = currModel.latitude;
              orientationUpdated = true;
            }
            if (currModel.longitude !== undefined && gltf.orientation.lng !== currModel.longitude) {
              gltf.orientation.lng = currModel.longitude;
              orientationUpdated = true;
            }
            if (currModel.terrainHeight !== undefined
                && currModel.terrainHeight !== MAGIC_NUMBER_DEFAULT_TERRAIN_HEIGHT
            ) {
              // Convert terrainHeight from feet to meters (as done in iafGltfManager)
              const terrainHeightInMeters = IafMathUtils.feet2meters(currModel.terrainHeight) ?? currModel.terrainHeight;
              if (gltf.orientation.terrainHeightInMeters !== terrainHeightInMeters) {
                gltf.orientation.terrainHeightInMeters = terrainHeightInMeters;
                orientationUpdated = true;
              }
            }
            
            // Redraw with the updated orientation if any changes were made
            if (orientationUpdated && typeof this.iafViewer.iafGltfManager.redraw === "function") {
              this.iafViewer.iafGltfManager.redraw(modelId, gltf.orientation);
            }
          }
        }
      }
    });
  }
  }

  componentWillUnmount() {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | ReactGis.componentWillUnmount', this.props.title);
    if (this._onDisciplineEnable) {
      iafUiEventBus.off(IafUiEvent.IafEventDisciplineEnable, this._onDisciplineEnable);
      this._onDisciplineEnable = undefined;
    }
    this.spinnerManager?.endMonitoring();
    this.spinnerManager = null;
    if (this.handlerCameraChange != null) {
      clearTimeout(this.handlerCameraChange);
      this.handlerCameraChange = undefined;
    }
    if (this.handleZoomTimeout != null) {
      clearTimeout(this.handleZoomTimeout);
      this.handleZoomTimeout = undefined;
    }
    if (this._horizontalAlignmentInterval) {
      clearInterval(this._horizontalAlignmentInterval);
      this._horizontalAlignmentInterval = undefined;
    }
    if (this._verticalAlignmentInterval) {
      clearInterval(this._verticalAlignmentInterval);
      this._verticalAlignmentInterval = undefined;
    }
    if (this.iafViewer) {
      this.iafViewer.gisInstance = null;
    }
  }  

  // ------------------------------------------------------------------------------------------------------------------------
  // END OF Constructor & Life Cycle Hooks
  // ------------------------------------------------------------------------------------------------------------------------


  // ------------------------------------------------------------------------------------------------------------------------
  // UI Handlers / Callbacks for Common Properties
  // ------------------------------------------------------------------------------------------------------------------------

  async handleStyle(event) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | handleStyle', event.target.value);
    this.iafViewer.iafMapBoxGl?.styles?.setStyle(event.target.value, () => {
      this.refreshMarkers();
    });
    this.setState({
      prevMapStyle: event.target.value
      , prevMapLayer: Layers.data.None.index
    });
  }

  async handleLayer(event) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | handleLayer', event.target.value);
    this.iafViewer.iafMapBoxGl.layers.setLayer(event.target.value);
    this.iafViewer.iafTuner?.updateModelDisplay(this.options.zoom);
    this.setState({
      prevMapLayer: event.target.value
    });
  }

  async handleElevationMode(event) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | handleElevationMode', +event.target.value);
    // this.iafViewer.iafMapBoxGl.layers.setLayer(event.target.value);
    const elevationMode = +event.target.value;
    const prevElevationMode = this.getIafViewerState()?.elevationMode;
    this.setIafViewerState({
      elevationMode
    }, async () => {
      // this.setElevationMode(elevationMode, prevElevationMode);
    });
  }

  getModelCount() {
    return Object.keys(this.state.models).length;
  }

  getActiveModelCount() {
    return Object.values(this.state.models).filter(model => model.bShowModel).length;
  }

  async setFederatedMode(federatedMode, prevFederatedMode) {
    // const elevationMode = federatedMode === GisFederatedMode.None ? this.getIafViewerState()?.elevationMode : GisElevationMode.QuickSurface;
    // const prevElevationMode = this.getIafViewerState()?.elevationMode;
    // const shouldAddGltf = this.shouldLoadGltfForMode(federatedMode) && prevFederatedMode === GisFederatedMode.None;
    // const shouldRemoveGltf = !this.shouldLoadGltfForMode(federatedMode) && this.shouldLoadGltfForMode(prevFederatedMode);

    this.setIafViewerState({
      federatedMode
    }, async () => {
      // this.refreshFederatedDisplay();
      // if (elevationMode !== prevElevationMode) {
      //   this.setElevationMode(elevationMode, prevElevationMode);
      // }
      // this.setState({models: this.initializeModelStates()}, async () => {
      //   if (shouldAddGltf) {
      //     if (this.iafViewer?.iafGltfManager?.gltfModelMap?.size === this.getModelCount()) {
      //       this.iafViewer.iafGltfManager?.refreshGltfModels();
      //     } else {
      //       await this.addGltfModels();
      //     }
      //   } else if (shouldRemoveGltf) {
      //     this.iafViewer.iafGltfManager.deleteGltfModels();
      //   }
      // });
      this.iafViewer.iafTuner?.updateModelDisplay(this.options.zoom);
    });
  }

  async handleFederatedModeChange(event) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | handleFederatedModeChange', event.target.value);
    const federatedMode = +event.target.value;
    const prevFederatedMode = this.getIafViewerState()?.federatedMode;

    this.setFederatedMode(federatedMode, prevFederatedMode);

    // const elevationMode = federatedMode === GisFederatedMode.None ? this.getIafViewerState()?.elevationMode : GisElevationMode.QuickSurface;
    // const prevElevationMode = this.getIafViewerState()?.elevationMode;
    // const shouldAddGltf = this.shouldLoadGltfForMode(federatedMode) && prevFederatedMode === GisFederatedMode.None;
    // const shouldRemoveGltf = !this.shouldLoadGltfForMode(federatedMode) && this.shouldLoadGltfForMode(prevFederatedMode);

    // this.setIafViewerState({
    //   federatedMode,
    //   elevationMode
    // }, async () => {
    //   this.refreshFederatedDisplay();
    //   if (elevationMode !== prevElevationMode) {
    //     this.setElevationMode(elevationMode, prevElevationMode);
    //   }
    //   this.setState({models: this.initializeModelStates()}, async () => {
    //     if (shouldAddGltf) {
    //       if (this.iafViewer?.iafGltfManager?.gltfModelMap?.size === this.getModelCount()) {
    //         this.iafViewer.iafGltfManager?.refreshGltfModels();
    //       } else {
    //         await this.addGltfModels();
    //       }
    //     } else if (shouldRemoveGltf) {
    //       this.iafViewer.iafGltfManager.deleteGltfModels();
    //     }
    //   });
    // });
  }

  handleGisRenderingDistanceChange = (event, newValue) => {
    this.iafViewer.setState({
      gis: {
        ...this.iafViewer.state.gis,
        dynamicRenderingDistance: newValue,
      },
    }, () => {
      const z = this.iafViewer.iafMapBoxGl?.map?.getZoom?.();
      if (typeof z === "number") {
        this.iafViewer.iafTuner?.updateModelDisplay(z);
      }
    });
  };

  handleGisRenderingZoomChange = (event, newValue) => {
    this.iafViewer.setState({
      gis: {
        ...this.iafViewer.state.gis,
        dynamicRenderingZoom: newValue,
      },
    }, () => {
      const z = this.iafViewer.iafMapBoxGl?.map?.getZoom?.();
      if (typeof z === "number") {
        this.iafViewer.iafTuner?.updateModelDisplay(z);
      }
    });
  };

  async handlePrimaryModelChange(event) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | handlePrimaryModelChange', event.target.value);
    const primaryModelId = event.target.value;
    // const prevPrimaryModelId = this.state.primaryModelId;
    // this.setIafViewerState({
    //   primaryModelId
    // }, async () => {
    //   this.setPrimaryModel(primaryModelId, prevPrimaryModelId);
    // });
    this.setPrimaryModel(primaryModelId);
  }

  handleOnMarkerUpdate = async (title, type, modelId) => {
    if(type === "click") {
        // Expand the clicked model's panel and collapse others
        this.setState({
          expandedModelPanelId: modelId
        });

        if (!this.iafViewer?.iafTuner?.isModelVisible(this.options.zoom)) {
            await this.toggleViewMode(true, false, modelId);
        }

        // Invoke onModelSelect callback if provided
        if (typeof this.iafViewer.props.gis?.onModelSelect === 'function') {
          this.iafViewer.props.gis.onModelSelect(modelId);
        }

        this.applyDynamicRenderingForFocusedModel(modelId); 
        
        return;
    }
    if(type === "setPrimary") {
        // Handle double-click to set primary model
        if (modelId && this.state.models[modelId]) {
            IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | Gis.handleOnMarkerUpdate: Setting primary model via double-click', {
                modelId: modelId,
                modelTitle: title,
                currentPrimaryModelId: this.primaryModelId
            });
            // Update primary model
            await this.setPrimaryModel(modelId);
            // Refresh markers to reflect the new primary model
            if (this.iafViewer?.iafMapBoxGl?.markers) {
                this.iafViewer.iafMapBoxGl.markers.setPrimaryModelId(modelId);
                this.iafViewer.iafMapBoxGl.markers.refreshSourceData();
            }
            // Refresh marker display
            this.refreshMarkers();
        }
        return;
    }
    this.setState(prevState => ({
      models: {
          ...prevState.models,
          [modelId]: {
              ...prevState.models[modelId],
              title: title
          }
      }
    }), ()=>{
      this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(modelId, this.state.models[modelId].title, [ this.state.models[modelId].longitude, this.state.models[modelId].latitude ]);
    })
    this.saveGisData();
  }

  async toggleViewMode(animation, isGlobeView, targetModelId = null) {
    const map = this.iafViewer.iafMapBoxGl.map;

    if (isGlobeView) {

      IafEnableUtils.enableModelDisplay(this.iafViewer, false);
      map.flyTo({
        center: [0, 0], // Center of the globe
        zoom: 1,        // Low zoom for globe view
        pitch: 0,
        bearing: 0,
        speed: 1.2,
        curve: 1.42,
        essential: animation
      });
       // Create a specific handler for this animation
       const onFlyToEnd = () => {
        // Clean up the event listener
        map.off('moveend', onFlyToEnd);
        this.options.zoom = 1;
        this.iafViewer.iafMapBoxGl.setZoom(this.options.zoom);
        this.handleZoom();
      };
      map.on('moveend', onFlyToEnd);
    } else {
      const gisData = {
        ...this.state.gisData,
        _properties: {
            ...this.state.gisData?._properties,
            session: {...defaultGisData._properties.session, ...this.props.gis?.initial} //Reset to default.
        }
      }
      
      // Determine the center location: use clicked model's location if provided, otherwise use reference model's location
      let centerLng, centerLat;
      if (targetModelId && this.state.models[targetModelId]) {
        // Fly to the clicked model's location
        centerLng = this.state.models[targetModelId].longitude;
        centerLat = this.state.models[targetModelId].latitude;
      } else {
        // Default to reference model's location
        centerLng = this.options.center.lng;
        centerLat = this.options.center.lat;
      }
      
      map.flyTo({
        center: [centerLng, centerLat], // Use clicked model's location or default to reference model
        zoom: gisData._properties.session.zoom,
        pitch: gisData._properties.session.pitch,
        bearing: gisData._properties.session.bearing,
        speed: 1.2,
        essential: animation
      });
       // Create a specific handler for this animation
      const onFlyToEnd = async() => {
       // Clean up the event listener
       map.off('moveend', onFlyToEnd);
       
       await this.updateMapOptions(gisData)
       
       // Set options.center to target model after updateMapOptions
       // (updateMapOptions resets it to primary model)
       if (targetModelId && this.state.models[targetModelId]) {
         this.options.center = {
           lng: this.state.models[targetModelId].longitude,
           lat: this.state.models[targetModelId].latitude
         };
       }
       
       this.iafViewer.iafTuner.tuneGis(this.options);
       await this.iafViewer.iafTuner.tuneOrientation();
       
       // Explicitly set map center to target model at the end
       // (ensures map stays centered on clicked model)
       if (targetModelId && this.state.models[targetModelId]) {
         this.iafViewer.iafMapBoxGl.setCenter([
           this.state.models[targetModelId].longitude,
           this.state.models[targetModelId].latitude
         ]);
       }
       
       this.iafViewer.iafMapBoxGl.setZoom(this.options.zoom)
       this.handleZoom();

       const focusId =
         targetModelId && this.state.models[targetModelId]
           ? targetModelId
           : this.primaryModelId ??
             this.getIafViewerState()?.primaryModelId ??
             this.props.gis?.primaryModelId ??
             this.iafViewer.props.graphicsResources?.dbModel?._id;
       this.applyDynamicRenderingForFocusedModel(focusId);
      // await this.iafViewer.iafTuner.tuneOrientation();
      //  this.handleZoom()
     };
     map.on('moveend', onFlyToEnd);
    }
    this.setState({ isGlobeView });
  }

  async handleToggleViewMode(animation = true) {
    const map = this.iafViewer.iafMapBoxGl.map;
    this.toggleViewMode(true, !this.state.isGlobeView);
    // Update the state to reflect the new view mode
  }

  async handleShowMapMarkers(event) {
      this.setIafViewerState({showMapMarkers: event.target.checked},()=>{
        this.iafViewer?.iafTuner?.updateModelDisplay(this.state.zoom);
      });
  }

  async handleToggleNavigation(animation = true) {
    const isNavigation = !this.state.isNavigation;
    this.iafViewer.iafMapBoxGl.toggleDirections(isNavigation);
    // Update the state to reflect the new view mode
    this.setState({ isNavigation });
  }

  // This function is used to close the panel. It calls the onClose function with the parameter 'cuttingPanel'.
  panelClose(){
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | Gis.panelClose'
      , '/props', this.props
    );

    this.props.onClose('gisViewer');
  }

  handleZoom() {
    const zoomData = this.iafViewer.iafMapBoxGl.zoomData;
    this.handleZoomWheelDelta += zoomData.wheelDelta;
    !window.timeoutspeed && (window.timeoutspeed = 0);
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.handleZoom'
                      , '/zoomData', zoomData
                      , '/handleZoomWheelDelta', this.handleZoomWheelDelta
                )

    // this.handleZoomTimeout && clearTimeout(this.handleZoomTimeout);

    // this.handleZoomTimeout = setTimeout( () =>
    {
      const zoomData = {
        wheelDelta: this.handleZoomWheelDelta || 0.0001
      }
      this.handleZoomWheelDelta = 0;
      this.options = this.iafViewer.iafMapBoxGl.getMapObject();
      this.iafViewer.iafTuner.tuneZoom(this.options, zoomData);
      this.iafViewer.iafMapBoxGl.clearDragData();
      // this.handleDrag(); // ATK: Adding this would probably be a hack
      !this.state.bModelRealignModeHorizontal && this.iafViewer.iafTuner.applyTunedCamera();
    }
    //, window.timeoutspeed);

    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.handleZoom'
      , '/options', this.options
    );
    this.setState({zoom: this.options.zoom});
    // this.iafViewer.iafTuner.pixel2mmGis = getMilliMetersPerPixelFromMap(this.iafViewer.iafMapBoxGl.map);
    // this.iafViewer.iafTuner.tuneDistance();
  }
  
  getRealigningModelId() {
    const { models } = this.state;
    if (!models) return null;
    for (const [modelId, modelState] of Object.entries(models)) {
      if (modelState && modelState.bModelRealignModeHorizontal) {
        return modelId;
      }
    }
    return null;
  }

  //ATK PLG-1808: Review Reset / Escape / Persistence on GIS Alignments
  rememberRealignmentLngLatBaseline(modelId) {
    const m = this.state.models?.[modelId];
    if (!m) return;
    const { longitude: lng, latitude: lat } = m;
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
    this._realignLngLatBaselineByModelId[modelId] = { longitude: lng, latitude: lat };
  }

  //ATK PLG-1808: Review Reset / Escape / Persistence on GIS Alignments
  clearRealignmentLngLatBaseline(modelId) {
    if (modelId && this._realignLngLatBaselineByModelId) {
      delete this._realignLngLatBaselineByModelId[modelId];
    }
  }

  // ATK Drag Fixes - Matching up the two different contexts with some adjustment
  handleDrag() {
    if (this.state.bModelRealignModeHorizontal && this.getRealigningModelId() === this.primaryModelId) {
      return this.iafViewer.iafTuner.handleDragForRealignment();
    }

    // this.iafViewer.iafTuner.tuneDrag(this.state.bModelRealignModeHorizontal); return;
    this.iafViewer.iafTuner.tuneDrag(); //ATK | PLAT-4432 | Code Restructuring, Drag Fixes,  handleDrag, updateAlignment, fetchAlignment
    // this.options = this.iafViewer.iafMapBoxGl.getMapObject();
  }

  handleDragEnd() {
    this.iafViewer._viewer && this.handleDrag();
    if (this.state.bModelRealignModeHorizontal
        // && this.getRealigningModelId() === this.primaryModelId
      ) {
      const center = this.iafViewer.iafMapBoxGl.map.getCenter();
      const modelId = this.getRealigningModelId();
      const modelIds = IafModelComposition.getClusterModelIdsForModelId(this.iafViewer, modelId);
      modelIds.forEach(id => {
        this.handleChangeLongitudeByModel(null, center.lng, id);
        this.handleChangeLatitudeByModel(null, center.lat, id);
      });
    }
  }

  async handleUnitsUpdate(gisData = null) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.handleUnitsUpdate');
    await this.iafViewer.iafTuner.tuneOrientation();
    //setting pitch
    // this.setState({ pitch: this.state.pitch, bearing: this.state.uiBearing }, () => {
      this.iafViewer.iafMapBoxGl.setPitch(this.state.pitch);
      this.iafViewer.iafMapBoxGl.setBearing(this.state.uiBearing);
      this.iafViewer.iafMapBoxGl.setZoom(this.state.zoom);
      this.handleZoom();

      // No need to update GLTF model as it is auto aligned with gis (Mapbox)

      // this.iafViewer.setState({isGisLoaded: true});
    // });
    this.primaryModelId && this.updateStateByModel(this.state.models[this.primaryModelId]?.id);
  }

  handleCameraChange() {
    // this.debugLogRealignmentState("handleCameraChange");
    this.handlerCameraChange != null && clearTimeout(this.handlerCameraChange);
    this.handlerCameraChange = undefined;
    this.options = this.iafViewer.iafMapBoxGl.getMapObject();
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | handleCameraChange', this.options)
    this.iafViewer.iafTuner.tuneOptions({options: this.options, decomposedMatrix: this.iafViewer.iafMapBoxGl.decomposedMatrix});
    !this.state.bModelRealignModeHorizontal && this.iafViewer.iafTuner.applyTunedCamera();
    this.handlerCameraChange = setTimeout(() => {
      const modelId = this.state.models[this.primaryModelId]?.id;
      if (modelId) {
        this.updateStateByModel(modelId).catch((err) => {
          IafUtils.debugIaf && console.warn('IafViewer.EVMMode.Mapbox | handleCameraChange updateStateByModel', err?.message || err);
        });
      }
      this.iafViewer.iafTuner.tuneOptions({options: this.options, decomposedMatrix: this.iafViewer.iafMapBoxGl.decomposedMatrix});
    }, 10);
  }

  handleChangeZoom(event, newValue, name) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | handleChangeZoom', newValue, newValue, name);
    this.setState({ zoom: newValue }, () => {

      // ATK PLG-1137: GIS 1.0 - Design an interface for mapbox to be accessed from Application
      // this.iafViewer.iafMapBoxGl.setZoom(this.state.zoom);
      // this.iafViewer.iafTuner.tuneZoomFromMap();
      // this.iafViewer.iafTuner.applyTunedCamera();
      this.iafViewer.iafMapBoxGl.getProxy().setZoom(this.state.zoom);
      // END ATK PLG-1137: GIS 1.0 - Design an interface for mapbox to be accessed from Application
      // this.saveGisData();
    });
  }

  handleChangePitch(event, newValue, name) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | handleChangePitch', newValue);
    this.setState({ pitch: newValue }, () => {

      // ATK PLG-1137: GIS 1.0 - Design an interface for mapbox to be accessed from Application
      // this.iafViewer.iafMapBoxGl.setPitch(newValue);
      this.iafViewer.iafMapBoxGl.getProxy().setPitch(this.state.pitch);
      // END ATK PLG-1137: GIS 1.0 - Design an interface for mapbox to be accessed from Application

      // this.saveGisData();
    });
  }

  handleChangeBearing(event, newValue, name) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | handleChangeBearing', newValue);
    this.setState({ uiBearing: newValue }, () => {

      // ATK PLG-1137: GIS 1.0 - Design an interface for mapbox to be accessed from Application
      // this.iafViewer.iafMapBoxGl.setBearing(newValue);
      this.iafViewer.iafMapBoxGl.getProxy().setBearing(this.state.uiBearing);
      // END ATK PLG-1137: GIS 1.0 - Design an interface for mapbox to be accessed from Application

      // this.saveGisData();
    });
  }

  async handleChangeBearingByModel(event, newValue, modelId) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | handleChangeLongitude', newValue);

    if (!this.state.models[modelId]) return; // Ensure model exists in state

    const parsedNewValue = +newValue;
    if (parsedNewValue === this.state.models[modelId].bearing) return;

    this.setState(prevState => ({
        models: {
            ...prevState.models,
            [modelId]: {
                ...prevState.models[modelId],
                bearing: parsedNewValue
            }
        },
    }), async () => {
        // this.iafViewer.iafMapBoxGl.setBearing(this.state.models[modelId].bearing, modelId);
        this.iafViewer.iafGltfManager?.setBearing(modelId, this.state.models[modelId].bearing);
        this.invokeGisAlignmentCallback("onBearingChange", [modelId], this.state.models[modelId].bearing);
        // this.saveGisData();
    });
  }

  handleToggleGroundElevation(event, newValue, name) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.handleToggleGroundElevation'
      , '/this', this
      , '/event', event
      , '/newValue', newValue
    );
    this.setState({bGroundElevation : !this.state.bGroundElevation}, async () => {
      await IafEnableUtils.toggleGroundElevation(this.state.bGroundElevation, this.iafViewer, this.getModelStateByIndex(0).terrainHeight);
    });
  }

  async handleToggleShowModel(event, modelId) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.handleToggleShowModel', '/this', this, '/event', event);
    this.setState({models: {
      ...this.state.models,
      [modelId]: {
        ...this.state.models[modelId],
        bShowModel: !this.state.models[modelId].bShowModel
      }
    }}, () => {
      this.iafViewer.iafGltfManager?.setGltfModelVisibility(modelId, this.state.models[modelId].bShowModel);
      this.saveGisData();
    });
  }

  async handleToggleModelRealignHorizontal(event, modelId) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.handleToggleModelRealignHorizontal', '/this', this, '/event', event);
    // const prevElevationMode = this.getIafViewerState()?.elevationMode;
    this.setIafViewerState({
      elevationMode: GisElevationMode.None,
      federatedMode: GisFederatedMode.Outline
    }, async () => {
      // await this.setElevationMode(GisElevationMode.None, prevElevationMode);
      // await this.refreshFederatedDisplay();
      //RRP:- PLG-1168 Load the geocoder plugin before the component renders.
      if (modelId) await this.handleToggleRealignByModelHorizontalLow(modelId);
      else await this.handleToggleRealignHorizontalLow()
    });
  }

  async handleToggleModelRealignVertical(event, modelId) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.handleToggleModelRealignVertical', '/this', this, '/event', event);

    if (modelId) await this.handleToggleRealignByModelVerticalLow(modelId);
    else await this.handleToggleRealignVerticalLow();

    if (this.getIafViewerState()?.elevationMode !== GisElevationMode.QuickSurface) {
      // const prevElevationMode = this.getIafViewerState()?.elevationMode;
      this.setIafViewerState({elevationMode: GisElevationMode.QuickSurface});
      // await this.setElevationMode(GisElevationMode.QuickSurface, prevElevationMode);
    }
    
    const enable = modelId ? this.state.models?.[modelId]?.bModelRealignModeVertical : this.state.bModelRealignModeVertical
    if (!enable) {
      const primaryModel = this.state.models[this.primaryModelId];
      if (primaryModel) this.iafViewer.iafTuner.setPrimaryModel(primaryModel);
      this.saveGisData();
    }
  }

  async updatePrimaryModel(modelId = null) {
    if (!this.iafViewer?.iafMapBoxGl || (this.iafViewer?.props.view3d?.enable && !this.iafViewer._viewer)) return;
    if (!this.iafViewer.state.isModelStructureReady) return;

    this.primaryModelId = modelId ?? this.primaryModelId ?? this.props.gis?.primaryModelId ?? this.iafViewer.props.graphicsResources?.dbModel?._id;

    // Initialize models if empty - this may happen when GIS is enabled before view3d is available
    if (!this.state.models || Object.keys(this.state.models).length === 0
        // If loadModelInfo did not extract all the models, this.state.model would contain only the old primary model.
        || !IafObjectUtils.hasOwnProperty(this.state.models, this.primaryModelId

        // ATK PLG-1682: GIS 2.0 - Realignment of other buildings get overwritten on switching models and/or on realignment
        || !this.iafViewer.props.isSingleWsEnabled // ATK TO DO - This should be replaced by a check for Federated Mode
        )) {
      // ATK PLG-1682: GIS 2.0 - Realignment of other buildings get overwritten on switching models and/or on realignment
      await this.getGisData();
      const initializedModels = this.initializeModelStates();
      // Update state with initialized models
      await new Promise(resolve => {
        this.setState({ models: initializedModels }, () => {
          resolve();
        });
      });
    }
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.updatePrimaryModel', '/this', this, '/models', this.state.models);

    this.primaryModelId && this.fetchAlignmentByModel(this.state.models[this.primaryModelId]?.id);
    // await this.iafViewer.iafMapBoxGl.initialize();
    
    
    await this.iafViewer.iafMapBoxGl.enableDistanceLine(true);
    if (this.iafViewer.props.view3d?.enable &&
      (!this.iafViewer.iafMapBoxGl.modelHandler ||
        this.primaryModelId !== this.iafViewer.iafMapBoxGl.modelHandler.primaryModelId)
    ) {
      this.iafViewer.iafMapBoxGl.modelHandler = new IafModelPositionHandler(this.iafViewer, this.primaryModelId);
      await this.iafViewer.iafMapBoxGl.recalculateBoundingBox(true);
      // Adjust camera - this may have been skipped when GIS was enabled before view3d was available
      await iafAdjustCamera(this.iafViewer);
    }
    if (this.iafViewer._viewer) {
      this.iafViewer.iafMapBoxGl.blendWithIafViewer();
    }

    // ATK PLG-1534: EVM Mode - Gis, No View3d - should allow mapbox interactions
    // this.iafViewer.iafMapBoxGl.initialize();
    this.iafViewer._viewer && this.iafViewer.iafMapBoxGl.disableInteraction(); 
    !this.iafViewer._viewer && this.iafViewer.iafMapBoxGl.enableInteraction();               

    // await GisDistance.setupUnits(this.map, this.iafViewer);
    // if (this.onUnitsUpdateCb) {
    //     this.onUnitsUpdateCb();
    // }

    // Use state.models after ensuring it's initialized above
    const currentModels = this.state.models;
    const primaryModelState = this.primaryModelId ? currentModels[this.primaryModelId] : null;
    if (primaryModelState && primaryModelState.terrainHeight === MAGIC_NUMBER_DEFAULT_TERRAIN_HEIGHT) {
      primaryModelState.terrainHeight = this.iafViewer?.iafMapBoxGl?.modelHandler?.getTerrainHeightInModelUnits();
      this.setState({
        models: currentModels
      });
    }

    // PLG-1477: Federated Projects - Review realignments after model switching
    // Callbacks - these may have been skipped when GIS was enabled before view3d was available
    if (this.iafViewer._viewer) {
      await this.iafViewer.iafMapBoxGl.setOnMarkerUpdate(this.handleOnMarkerUpdate.bind(this), this.state.models, this.showConfirmDialog.bind(this));
      this.iafViewer.iafMapBoxGl.setOnCameraChange(this.handleCameraChange.bind(this));
      this.iafViewer.iafMapBoxGl.setOnDragCb(this.handleDrag.bind(this));
      this.iafViewer.iafMapBoxGl.setOnZoomCb(this.handleZoom.bind(this));
      this.iafViewer.iafMapBoxGl.setOnDragEndCb(this.handleDragEnd.bind(this));
      this.iafViewer.iafMapBoxGl.setOnUnitsUpdate(this.handleUnitsUpdate.bind(this));
      
      // Setup canvas event listeners if not already added
      // This may have been skipped when GIS was enabled before view3d was available
      if (this.iafViewer.iafMapBoxGl.map && !this.iafViewer.iafMapBoxGl.canvasEventListenersAdded) {
        await this.iafViewer.iafMapBoxGl.setupCanvasEvents();
      }
    } else {
      this.iafViewer.iafMapBoxGl.setOnDragEndCb(this.handleDragEnd.bind(this));
    }
    
    // Ensure tuner is properly set up and tuned - this may have been partially done before
    if (!this.iafViewer.iafTuner) {
      this.iafViewer.iafTuner = new IafTuner(this.props);
    }
    const primaryModel = this.state.models[this.primaryModelId];
    if (primaryModel) this.iafViewer.iafTuner.setPrimaryModel(primaryModel);
    // GisDistance.setTuneDistanceReady(false);    
    this.iafViewer.iafTuner.tuneGis(this.options);
    this.iafViewer.iafTuner.tuneNavigation();
    await this.iafViewer.iafTuner.tuneOrientation();

    // Update marker locations and titles for all models - this may have been skipped before
    Object.values(this.state.models).forEach(model => {
      this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(
          model.id,
          model.title,
          [model.longitude, model.latitude]
      );
    });

    // Create GLTF Manager if not already created - this may have been skipped when GIS was enabled before view3d was available
    if (!this.iafViewer.iafGltfManager && this.primaryModelId && this.iafViewer.state.isGltfViewEnabled) {
      this.iafViewer.iafGltfManager = new IafGltfManager(this.iafViewer);
    }

    // Ensure GLTF models are added if needed - this may have been skipped if view3d wasn't available
    if (this.iafViewer.iafGltfManager && this.shouldLoadGltfForMode(this.getIafViewerState()?.federatedMode)) {
      // Only add if not already added
      if (
        // this.iafViewer.iafGltfManager.gltfModelMap?.size !== this.getModelCount()
        this.iafViewer.iafGltfManager.gltfNoModelMap?.size === 0
      ) {
        await this.addGltfModels();
      }
    }

    // ATK PLG-1779: Clustered Buildings - This blocks property updates driven by the GIS state update.
    // const federatedMode = this.iafViewer?.iafGltfManager?.gltfModelMap?.size ? GisFederatedMode.Outline : GisFederatedMode.None;
    // await this.setFederatedMode(GisFederatedMode.None, this.getIafViewerState()?.federatedMode);

    // this.setIafViewerState({elevationMode: GisElevationMode.QuickSurface});
    
    // Invoke callback if provided after all async operations complete
    if (typeof this.iafViewer?.props?.gis?.onReferenceModelChanged === 'function') {
      this.iafViewer.props.gis.onReferenceModelChanged(this.primaryModelId);
    }
    this.setState({isReferenceModelUpdated: true}, () => {
      // ATK PLG-1779: Clustered Buildings - updateModelDisplay to refresh the display in case view3d was being loaded in Outline Mode
      this.iafViewer.iafTuner?.updateModelDisplay(this.options.zoom);
    });
  }

  async enableMapBox(gisData = null) {

    if (!this.state.token || (this.primaryModelId && this.iafViewer?.props.view3d?.enable && !this.iafViewer?.modelBounding)) return;

    if (this.iafViewer.iafMapBoxGl) return;

    const iafPerfLogger = new IafPerfLogger("IafGis.enableMapBox");

    // this.setState({enable: true});

    //ATK Hack in 5.0 branch.
    // await this.iafViewer.iafCuttingPlanesUtils.enableCuttingPlanes(true);
    //END ATK Hack
    this.iafViewer.setState({gis: { ...this.iafViewer.state.gis, isLoaded: false }});

    // PLAT-5447: IafUtils method to load external dependencies
    await IafResourceUtils.loadMapboxResources(this.iafViewer);

    const abortForNoValidLicense = () => {
      NotificationStore.notifyGisNoLicense(this.iafViewer);
      this.iafViewer.setState({gis: { ...this.iafViewer.state.gis, isLoaded: true }});
      return;
    }

    const isValidToken = await IafMapBoxGl.checkForValidLicense(this.iafViewer, this.state.token?.key);
    if (!isValidToken) return abortForNoValidLicense();

    // this.fetchAlignment();
    this.primaryModelId && this.fetchAlignmentByModel(this.state.models[this.primaryModelId]?.id);
    if (!this.iafViewer.iafMapBoxGl) {
      // Projection
      iafAdjustCamera(this.iafViewer);

      // Legacy Ui States
      this.iafViewer.newToolbarElement.current && this.iafViewer.newToolbarElement.current.setState({isFocusMode: false})
      this.iafViewer.handleFocusMode(false);

      // Mapbox Instance Manager
      this.iafViewer.iafMapBoxGl = new IafMapBoxGl(this.iafViewer, this.options, this.state.token?.key);

      // GLTF Manager
      if (this.primaryModelId && this.iafViewer.state.isGltfViewEnabled) {
        this.iafViewer.iafGltfManager = new IafGltfManager(this.iafViewer);
      }

      // License Tests
      if (this.iafViewer.iafMapBoxGl.noValidLicense) return abortForNoValidLicense();

      // Initialize BIMPK & GIS integration
      await this.iafViewer.iafMapBoxGl.initialize();

      // Initialize Initial Terrain Heights
      let models = this.state.models;
      const primaryModelState = this.primaryModelId ? models[this.primaryModelId] : null;
      if (primaryModelState && primaryModelState.terrainHeight === MAGIC_NUMBER_DEFAULT_TERRAIN_HEIGHT) {
        primaryModelState.terrainHeight = this.iafViewer?.iafMapBoxGl?.modelHandler?.getTerrainHeightInModelUnits();
        this.setState({models}, () => {
          this.saveGisData();
        });
      }

      // Callbacks
      this.iafViewer._viewer && await this.iafViewer.iafMapBoxGl.setOnMarkerUpdate(this.handleOnMarkerUpdate.bind(this), this.state.models, this.showConfirmDialog.bind(this));
      this.iafViewer._viewer && this.iafViewer.iafMapBoxGl.setOnCameraChange(this.handleCameraChange.bind(this));
      this.iafViewer._viewer && this.iafViewer.iafMapBoxGl.setOnDragCb(this.handleDrag.bind(this));
      this.iafViewer._viewer && this.iafViewer.iafMapBoxGl.setOnZoomCb(this.handleZoom.bind(this));
      this.iafViewer.iafMapBoxGl.setOnDragEndCb(this.handleDragEnd.bind(this));
      this.iafViewer._viewer && this.iafViewer.iafMapBoxGl.setOnUnitsUpdate(this.handleUnitsUpdate.bind(this));
    }

    if (!this.iafViewer.iafTuner) {
      this.iafViewer.iafTuner = new IafTuner(this.props);
      const primaryModel = this.state.models[this.primaryModelId];
      if (primaryModel) this.iafViewer.iafTuner.setPrimaryModel(primaryModel);
      this.iafViewer.iafTuner.tuneGis(this.options);
      this.iafViewer.iafTuner.tuneNavigation();
      await this.iafViewer.iafTuner.tuneOrientation();
    } else {
      // When enabling GIS via UI, ensure tuner is updated with latest options and orientation is tuned
      this.iafViewer.iafTuner.tuneGis(this.options);
      this.iafViewer.iafTuner.tuneNavigation();
      await this.iafViewer.iafTuner.tuneOrientation();
    }
    // setTimeout(async() => {
    //   // PLG-1197 - GIS 1.0 - Model disappears while enabling GIS when Focused Planes are active.
    //   // When the MapBox (GIS) is enabled, disable focused planes to prevent model disappearance.
    //   await this.iafViewer?.iafCuttingPlanesUtils?.showCuttingPlaneGeometry(false)
    //   this.iafViewer?.iafCuttingPlanesUtils?.enableCuttingPlanes(false)
    // }, 0);

    // Take ground / elevation into consideration
    // await IafEnableUtils.toggleGroundElevation(this.state.bGroundElevation, this.iafViewer);
    // this.setIafViewerState({elevationMode: this.iafViewer?.iafMapBoxGl?.modelHandler?.getVerticalShift() < 0.0001 ? GisElevationMode.QuickSurface : GisElevationMode.None},
    // () => {
    //   this.setElevationMode(this.getIafViewerState()?.elevationMode);
    // });

    // this.setElevationMode(this.getIafViewerState()?.elevationMode);

    // set the title for all the buildings.
    Object.values(this.state.models).forEach(model => {
      this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(
          model.id,
          model.title,
          [model.longitude, model.latitude]
      );
    })

    const onIafMapReady = async () => {
      await this.iafViewer?.iafCuttingPlanesUtils?.showCuttingPlaneGeometry(false)
      this.iafViewer?.iafCuttingPlanesUtils?.enableCuttingPlanes(false)
 
      this.spinnerManager = new IafSpinnerManager(this.iafViewer, ["gis", "isLoaded"], [
        "IafGraphicsResourceManager.recomputeUndergroundNodesByViewId", 
        "IafMapBoxGl.defineUndergroundNodes",
        "IafGis.resetAll",
        "IafGis.setElevationMode",
        "IafGraphicsResourceManager.clearUndergroundNodeIdsCache",
        "IafGltfManager._add3dModel",
        "IafGltfManager._add3dModelByPath"
      ], {
        label: "IafSpinnerManager(IafGis)",
        notificationMessage: "The viewer is busy processing graphics for GIS",
        frequency: 5000
      });

      // this.primaryModelId && this.setIafViewerState({elevationMode: GisElevationMode.QuickSurface});

      if (this.iafViewer.iafGltfManager && this.shouldLoadGltfForMode(this.getIafViewerState()?.federatedMode)) {
        await this.addGltfModels();
      }

      // Invoke `onIafMapReady` via IafViewerDBM-wrapped prop (defers until loadModelInfo completes if in flight)
      if (typeof this.iafViewer.props.gis?.onIafMapReady === "function") {
        await this.updatePrimaryModel();
        await this.resetAll();
        await Promise.resolve(
          this.iafViewer.props.gis.onIafMapReady(this.iafViewer.iafMapBoxGl.getProxy())
        );
      }

      // ATK PLG-1604: Performance – Load Status
      this.iafViewer.logLoadStatus('gis.isLoaded');

      return;
    }

    this.iafViewer.setState({
      gis: { ...this.iafViewer.state.gis, isLoaded: true }, // this.state.isFederatedModeUpdated && this.state.isElevationModeUpdated && this.state.isReferenceModelUpdated,
      isGisEnabled: true 
    }, () => {
      setTimeout(onIafMapReady, 100);
    });

    iafPerfLogger.end();
  }

  async disableMapBox() {
    if (!this.state.token) return;

    if(this.state.isGlobeView){
      await this.handleToggleViewMode(false)
    }

    this.spinnerManager?.endMonitoring();

    // this.setState({enable: false});

    this.iafViewer.setState({gis: { ...this.iafViewer.state.gis, isLoaded: false }});
    // const prevElevationMode = this.getIafViewerState()?.elevationMode;
    // this.setIafViewerState({elevationMode: GisElevationMode.None});
    // await this.setElevationMode(GisElevationMode.None, prevElevationMode);

    if (this.state.bModelRealignModeHorizontal) {
      await this.handleToggleRealignHorizontalLow()
    }

    if (this.iafViewer.iafMapBoxGl) {
      // await IafEnableUtils.resetGroundElevation(this.iafViewer);
      GisDistance.cleanupMeasurements(this.iafViewer);
      // Commented as this is unnecessary to recalculate the mapbox state
      // this.options = this.iafViewer.iafMapBoxGl.getMapObject();
      // this.iafMapBoxGlCenter = this.iafViewer.iafMapBoxGl.centerOrg;
      await this.iafViewer.iafMapBoxGl.destructor();

      if (this.iafViewer.iafGltfManager) {
        this.iafViewer.iafGltfManager.deleteGltfModels();
        this.iafViewer.iafTuner.updateModelDisplay(this.options.zoom);
        this.iafViewer.iafGltfManager = null;
      }
      this.iafViewer.iafMapBoxGl = null;
      this.iafViewer.iafTuner = null;
    }

    this.iafViewer.resetAll();

    this.iafViewer.setState({
      gis: { ...this.iafViewer.state.gis, isLoaded: true },
      bModelRealignModeHorizontal: false,
      bModelRealignModeVertical: false,
    },()=>{
        if (typeof this.iafViewer.props.gis?.onIafMapReady === "function") {
          this.iafViewer.props.gis?.onIafMapReady(null)
      }
      this.debugLogRealignmentState("disableMapBox");
    });

    this.iafViewer.setState({isGisEnabled: false}, () => {
      this.iafViewer.logLoadStatus('gis.isDisabled');
    });
  }

  debugLogRealignmentState(logger = "") {
    if (logger === "") {
      logger = "Unexpected logger";
    }
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.debugLogRealignmentState', logger,
      this.state.key, this.state.bModelRealignModeHorizontal
    );
  }

  async updateRealignmentState(modelId = null) {
    const resources = modelId ? [{ dbModel: { _id: modelId } }] : this.getAllResources();

    if (resources.length === 0) return;

    for (const resource of resources) {
      if (this.state.models?.[resource.dbModel._id]?.bModelRealignModeHorizontal) {
        await new Promise(resolve => {
          this.setState(prevState => ({
            models: {
              ...prevState.models,
              [resource.dbModel._id]: {
                ...prevState.models[resource.dbModel._id],
                bModelRealignModeHorizontal: false
              }
            },
            bModelRealignModeHorizontal: false
          }), () => {
            this.debugLogRealignmentState("updateRealignmentState");
            resolve();
          });
        });
      }
    }
  }
  
  toggleGis = (event) =>{
    // RRP:- PLG-1515
    // When switching models, the viewer updates `graphicsResources.dbModel._id`.
    // The GIS toggle logic must reinitialize model-specific state when the
    // primaryModelId changes.
    this.primaryModelId = this.iafViewer.props.graphicsResources?.dbModel?._id || this.props?.model?._id;
    let stateUpdate = null;
    const { checked } = event.target;
    if (!this.state.models[this.primaryModelId]){
      const models = this.initializeModelStates();
      stateUpdate = new Promise((res) => {
        this.setState(prevState => ({
          models: {
            ...prevState.models,
            ...models
          }
        }),res)
      })
    }
    Promise.resolve(stateUpdate).then(() => {
      this.props.handleEnableMapBox({ target: { checked } });
    });
  }

  async handleEnableMapBox(event) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.handleEnableMapBox', '/this', this, '/event', event);
    if (!this.state.token || (this.primaryModelId && this.iafViewer?.props.view3d?.enable && !this.iafViewer?.modelBounding)) return;

    if(!event.target.checked){
      this.primaryModelId && IafEnableUtils.enableModelDisplay(this.iafViewer, true);
    }

    await this.updateRealignmentState();
    await this.updateMapOptions();

    this.setIafViewerState({
      // enable: event.target.checked,
      elevationMode: GisElevationMode.None
    }, () => {
      this.setState({enable: event.target.checked});
    });

    // , async () => {
    // if (event.target.checked) {
    //   this.enableMapBox();
    // } else {
    //   if(this.state.isGlobeView){
    //     await this.handleToggleViewMode(false)
    //   }
    //   this.disableMapBox();
    // }}
    // );
  }

  async handleLoadGltfFileForPlaceholder(modelId) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.handleLoadGltfFileForPlaceholder - Loading GLB file for placeholder model:', modelId);
    
    if (!this.iafViewer?.iafGltfManager) {
      console.error('IafViewer.EVMMode.Mapbox | IafGis.handleLoadGltfFileForPlaceholder - GLTF Manager not available');
      return;
    }

    // Check if model is actually a placeholder
    const gltfModelEntry = this.iafViewer.iafGltfManager.gltfModelMap?.get(modelId);
    if (!gltfModelEntry?.placeholder) {
      console.warn('IafViewer.EVMMode.Mapbox | IafGis.handleLoadGltfFileForPlaceholder - Model is not a placeholder:', modelId);
      return;
    }

    try {
      // Open file picker dialog
      const { fileUrl, originalFileName } = await IafFileUtils.getUserFileAsUrl(['.glb', '.gltf']);
      
      IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.handleLoadGltfFileForPlaceholder - File selected:', {
        fileUrl,
        originalFileName,
        modelId
      });

      // Delete the placeholder model first
      this.iafViewer.iafGltfManager.deleteGltfModel(modelId);

      // Add the model with the selected file
      await this.iafViewer.iafGltfManager.addGltfModel(modelId, {
        modelPath: fileUrl,
        originalFileName: originalFileName
      });

      // Update model display after loading
      if (this.iafViewer.iafTuner) {
        this.iafViewer.iafTuner.isGltfVisible = true;
        this.iafViewer.iafTuner.updateModelDisplay(this.options.zoom);
      }

      IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.handleLoadGltfFileForPlaceholder - Successfully loaded GLB file for model:', modelId);
      NotificationStore.notifyCustom(this.iafViewer, `Successfully loaded GLB file: ${originalFileName}`, "success", 3000);
    } catch (error) {
      // Handle user cancellation gracefully
      if (error.message && (error.message.includes('cancelled') || error.message.includes('No file selected'))) {
        IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.handleLoadGltfFileForPlaceholder - File selection cancelled by user');
        return;
      }
      console.error('IafViewer.EVMMode.Mapbox | IafGis.handleLoadGltfFileForPlaceholder - Error loading GLB file:', error);
      NotificationStore.notifyCustom(this.iafViewer, `Failed to load GLB file: ${error.message}`, "error", 5000);
    }
  }

  async handleResetRealignment(modelId, options = {}) {
    const { horizontalReset = true, verticalReset = true } = options;
    if (!horizontalReset && !verticalReset) {
      return;
    }
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | Resetting aligment model:', modelId, options);
    return new Promise(async (resolve, reject) => {
      try {
        const fromSaved = this.initializeModelStates()[modelId]; // Persisted GIS (may match post-drag if saveGisData ran)
        if (!fromSaved) {
          reject(new Error('Model not found'));
          return;
        }
        const baseline = this._realignLngLatBaselineByModelId?.[modelId];//ATK PLG-1808: Review Reset / Escape / Persistence on GIS Alignments
        const initialModelState = baseline
          ? { ...fromSaved, longitude: baseline.longitude, latitude: baseline.latitude }
          : fromSaved;

        if (verticalReset &&
          (this.getIafViewerState()?.elevationMode === GisElevationMode.QuickSurface ||
            this.getIafViewerState()?.elevationMode === GisElevationMode.QuickUnderground)) {
          modelId === this.primaryModelId && await this.iafViewer.iafMapBoxGl.undefineTerrainQuick(IafMathUtils.displayUnits2mm(this.iafViewer, this.state.models[modelId].terrainHeight));
        }

        let initialTerrainHeight;
        if (verticalReset) {
          initialTerrainHeight = modelId === this.primaryModelId ? this.iafViewer?.iafMapBoxGl?.modelHandler?.getTerrainHeightInModelUnits() ?? initialModelState.terrainHeight : initialModelState.terrainHeight;
        }

        this.setState((prevState) => {
          const cur = prevState.models[modelId];
          let nextModel;
          if (horizontalReset && verticalReset) {
            nextModel = { ...initialModelState, terrainHeight: initialTerrainHeight };
          } else {
            nextModel = { ...cur };
            if (horizontalReset) {
              nextModel.longitude = initialModelState.longitude;
              nextModel.latitude = initialModelState.latitude;
            }
            if (verticalReset) {
              nextModel.terrainHeight = initialTerrainHeight;
            }
          }
          return {
            models: {
              ...prevState.models,
              [modelId]: nextModel,
            },
            ...(horizontalReset ? { bModelRealignModeHorizontal: initialModelState.bModelRealignModeHorizontal } : {}),
          };
        }, async () => {

          if (horizontalReset) {
            modelId === this.primaryModelId && this.iafViewer.iafMapBoxGl?.setLongitude(initialModelState.longitude, modelId);
            modelId === this.primaryModelId && this.iafViewer.iafMapBoxGl?.setLatitude(initialModelState.latitude, modelId);
            modelId === this.primaryModelId && this.iafViewer.iafMapBoxGl?.setBearing(initialModelState.bearing, modelId);
            this.iafViewer.iafGltfManager?.setCenter(modelId, initialModelState.longitude, initialModelState.latitude);
            this.iafViewer.iafGltfManager?.setBearing(modelId, initialModelState.bearing);
            modelId === this.primaryModelId && this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(modelId, initialModelState.title, [ initialModelState.longitude, initialModelState.latitude ]);
          }

          if (verticalReset &&
            (this.getIafViewerState()?.elevationMode === GisElevationMode.QuickSurface ||
              this.getIafViewerState()?.elevationMode === GisElevationMode.QuickUnderground)) {
            modelId === this.primaryModelId && this.iafViewer.iafMapBoxGl.defineTerrainQuick(
              IafMathUtils.displayUnits2mm(this.iafViewer, initialTerrainHeight)
            );
          }
          if (modelId) {
            if (horizontalReset) {
              if (this.primaryModelId !== modelId) {
                await this.realignSoftModelByIdHorizontal(initialModelState.bModelRealignModeHorizontal, modelId);
              } else {
                await this.realignModelByIdHorizontal(initialModelState.bModelRealignModeHorizontal, modelId);
              }
            }
            if (verticalReset) {
              await this.realignModelByIdVertical(false, modelId);
            }
          } else {
            await this.handleToggleRealignHorizontalLow();
          }

          if (verticalReset && GisElevationMode.QuickSurface !== this.getIafViewerState()?.elevationMode) {
            modelId === this.primaryModelId && (() => {
              this.setIafViewerState({ elevationMode: GisElevationMode.QuickSurface });
            })();
          }

          const primaryModel = this.state.models[this.primaryModelId];
          if (primaryModel) this.iafViewer.iafTuner.setPrimaryModel(primaryModel);
          const notifyIds = [modelId];
          if (horizontalReset) {
            this.invokeGisAlignmentCallback("onLongitudeChange", notifyIds, initialModelState.longitude);
            this.invokeGisAlignmentCallback("onLatitudeChange", notifyIds, initialModelState.latitude);
            this.invokeGisAlignmentCallback("onBearingChange", notifyIds, initialModelState.bearing);
          }
          if (verticalReset) {
            this.invokeGisAlignmentCallback("onAltitudeChange", notifyIds, initialTerrainHeight);
          }
          this.saveGisData();
          if (horizontalReset) {
            this.clearRealignmentLngLatBaseline(modelId);//ATK PLG-1808: Review Reset / Escape / Persistence on GIS Alignments
          }
          this.debugLogRealignmentState("handleResetRealignment");
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // ------------------------------------------------------------------------------------------------------------------------
  // END OF UI Handlers / Callbacks for Common Properties
  // ------------------------------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------------------------------
  // UI Handlers / Callbacks for Model Properties - e.g. Federated
  // ------------------------------------------------------------------------------------------------------------------------

  // async handleTerrainHeight(event, newValue, name) {
  //   console.log ('handleTerrainHeight', newValue, newValue, name);
  //   const quickMethod = true;
  //   if (this.getIafViewerState()?.elevationMode === GisElevationMode.QuickSurface || this.getIafViewerState()?.elevationMode === GisElevationMode.QuickUnderground)
  //     await this.iafViewer.iafMapBoxGl.undefineTerrainQuick(IafMathUtils.displayUnits2mm(this.iafViewer, this.state.terrainHeight));
  //   this.setState({ terrainHeight: +newValue }, async () => {
  //     if (this.getIafViewerState()?.elevationMode === GisElevationMode.QuickSurface || this.getIafViewerState()?.elevationMode === GisElevationMode.QuickUnderground)
  //       this.iafViewer.iafMapBoxGl.defineTerrainQuick(IafMathUtils.displayUnits2mm(this.iafViewer, this.state.terrainHeight));
  //     // this.setElevationMode(this.getIafViewerState()?.elevationMode, this.getIafViewerState()?.elevationMode);
  //     // const mm = IafMathUtils.displayUnits2mm(this.iafViewer, this.state.terrainHeight);
  //     // !quickMethod && await this.iafViewer.props.graphicsResources.offsetGraphicsResourceElevation(-mm);
  //     // quickMethod && IafEnableUtils.toggleGroundElevation(true, this.iafViewer, mm); // this.state.terrainHeight * 1000);
  //     this.saveGisData();
  //   });
  // }

  async handleTerrainHeightByModel(event, newValue, modelId) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | handleTerrainHeightByModel', newValue, newValue);

    if (!this.state.models[modelId]) return; // Ensure model exists in state

    const currentHeight = this.state.models[modelId].terrainHeight;
    const parsedNewValue = +newValue;

    // Return early if no change
    if (parsedNewValue === currentHeight) return;

    // const quickMethod = true;
    await this.iafViewer.props.graphicsResources.clearUndergroundNodeIdsCache();

    if (this.getIafViewerState()?.elevationMode === GisElevationMode.QuickSurface ||
        this.getIafViewerState()?.elevationMode === GisElevationMode.QuickUnderground) {
          // ATK PLG-1333: GIS 1.1 - Model gets cut on updating terrain heights
          await this.setElevationMode(GisElevationMode.None, this.getIafViewerState()?.elevationMode);
          // await this.iafViewer.iafMapBoxGl.undefineTerrainQuick(IafMathUtils.displayUnits2mm(this.iafViewer, this.state.models[modelId].terrainHeight));
          // END ATK PLG-1333: GIS 1.1 - Model gets cut on updating terrain heights
    }

    this.setState(prevState => ({
      models: {
        ...prevState.models,
        [modelId]: {
          ...prevState.models[modelId],
          terrainHeight: +newValue
        }
      }
    }), async () => {
      // ATK PLG-1333: GIS 1.1 - Model gets cut on updating terrain heights
      this.setElevationMode(GisElevationMode.QuickSurface, GisElevationMode.None);

      // ATK PLG-1333: GIS 1.1 - Model gets cut on updating terrain heights
      // if (this.getIafViewerState()?.elevationMode === GisElevationMode.QuickSurface || this.getIafViewerState()?.elevationMode === GisElevationMode.QuickUnderground) {
      //   this.iafViewer.iafMapBoxGl.defineTerrainQuick(IafMathUtils.displayUnits2mm(this.iafViewer, this.state.models[modelId].terrainHeight));

        // this.setElevationMode(this.getIafViewerState()?.elevationMode, this.getIafViewerState()?.elevationMode);
        // const mm = IafMathUtils.displayUnits2mm(this.iafViewer, this.state.models[modelId].terrainHeight);
        // !quickMethod && await this.iafViewer.props.graphicsResources.offsetGraphicsResourceElevation(-mm);
        // quickMethod && IafEnableUtils.toggleGroundElevation(true, this.iafViewer, mm); // this.state.models[modelId].terrainHeight * 1000);
      // }
      this.invokeGisAlignmentCallback("onAltitudeChange", [modelId], this.state.models[modelId].terrainHeight);
      this.saveGisData();
    });
  }

  async handleChangeLongitudeByModel(event, newValue, modelId) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | handleChangeLongitude', newValue);

    if (!this.state.models[modelId]) return; // Ensure model exists in state

    const parsedNewValue = +newValue;
    if (parsedNewValue === this.state.models[modelId].longitude) return;

    this.setState(prevState => ({
        models: {
            ...prevState.models,
            [modelId]: {
                ...prevState.models[modelId],
                longitude: parsedNewValue
            }
        }
    }), async () => {
        this.iafViewer.iafMapBoxGl?.setLongitude(this.state.models[modelId].longitude, modelId);
        this.iafViewer?.iafGltfManager?.setCenter(modelId, this.state.models[modelId].longitude, this.state.models[modelId].latitude);
        this.invokeGisAlignmentCallback("onLongitudeChange", [modelId], this.state.models[modelId].longitude);
        this.saveGisData();
    });
  }

  // handleChangeLongitude(event, newValue, name) {
  //   console.log ('handleChangeLongitude', newValue);
  //   this.timeoutChangeLongitude && clearTimeout(this.timeoutChangeLongitude);
  //   const value = -newValue;
  //   this.timeoutChangeLongitude = setTimeout(() => {
  //     this.setState({ longitude: value }, () => this.iafViewer.iafMapBoxGl.setLongitude(this.state.longitude));
  //     clearTimeout(this.timeoutChangeLongitude);
  //   }, window.timeoutspeed);
  // }

  async handleChangeLatitudeByModel(event, newValue, modelId) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | handleChangeLatitude', newValue);

    if (!this.state.models[modelId]) return; // Ensure model exists in state

    const latitude = this.state.models[modelId].latitude;
    const parsedNewValue = +newValue;

    // Return early if no change
    if (parsedNewValue === latitude) return;

    this.setState(prevState => ({
        models: {
            ...prevState.models,
            [modelId]: {
                ...prevState.models[modelId],
                latitude: parsedNewValue
            }
        }
    }), async () => {
        this.iafViewer.iafMapBoxGl.setLatitude(this.state.models[modelId].latitude, modelId);
        this.iafViewer?.iafGltfManager?.setCenter(modelId, this.state.models[modelId].longitude, this.state.models[modelId].latitude);
        this.invokeGisAlignmentCallback("onLatitudeChange", [modelId], this.state.models[modelId].latitude);
        this.saveGisData();
    });
  }

  // --- Cluster (one building, multiple internal model ids): shared alignment, Show Model on representative only ---

  async handleChangeBearingByCluster(event, newValue, modelIds, representativeId) {
    const v = +newValue;
    this.setState(
      (prev) => {
        const models = { ...prev.models };
        for (const id of modelIds) {
          if (models[id]) models[id] = { ...models[id], bearing: v };
        }
        return { models };
      },
      async () => {
        this.iafViewer.iafGltfManager?.setBearing(representativeId, v);
        for (const id of modelIds) {
          const m = this.state.models[id];
          if (m) {
            this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(id, m.title, [m.longitude, m.latitude]);
          }
        }
        this.invokeGisAlignmentCallback("onBearingChange", modelIds, v);
        this.saveGisData();
      }
    );
  }

  async handleChangeLongitudeByCluster(event, newValue, modelIds, representativeId) {
    const v = +newValue;
    this.setState(
      (prev) => {
        const models = { ...prev.models };
        for (const id of modelIds) {
          if (models[id]) models[id] = { ...models[id], longitude: v };
        }
        return { models };
      },
      async () => {
        for (const id of modelIds) {
          this.iafViewer.iafMapBoxGl?.setLongitude(this.state.models[id].longitude, id);
        }
        const lat = this.state.models[representativeId]?.latitude ?? 0;
        this.iafViewer?.iafGltfManager?.setCenter(representativeId, v, lat);
        for (const id of modelIds) {
          const m = this.state.models[id];
          if (m) {
            this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(id, m.title, [m.longitude, m.latitude]);
          }
        }
        this.invokeGisAlignmentCallback("onLongitudeChange", modelIds, v);
        this.saveGisData();
      }
    );
  }

  async handleChangeLatitudeByCluster(event, newValue, modelIds, representativeId) {
    const v = +newValue;
    this.setState(
      (prev) => {
        const models = { ...prev.models };
        for (const id of modelIds) {
          if (models[id]) models[id] = { ...models[id], latitude: v };
        }
        return { models };
      },
      async () => {
        for (const id of modelIds) {
          this.iafViewer.iafMapBoxGl.setLatitude(this.state.models[id].latitude, id);
        }
        const lng = this.state.models[representativeId]?.longitude ?? 0;
        this.iafViewer?.iafGltfManager?.setCenter(representativeId, lng, v);
        for (const id of modelIds) {
          const m = this.state.models[id];
          if (m) {
            this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(id, m.title, [m.longitude, m.latitude]);
          }
        }
        this.invokeGisAlignmentCallback("onLatitudeChange", modelIds, v);
        this.saveGisData();
      }
    );
  }

  async handleTerrainHeightByCluster(event, newValue, modelIds, representativeId) {
    const parsedNewValue = +newValue;
    const ref = this.state.models[representativeId];
    if (!ref || parsedNewValue === ref.terrainHeight) return;

    await this.iafViewer.props.graphicsResources.clearUndergroundNodeIdsCache();

    if (
      this.getIafViewerState()?.elevationMode === GisElevationMode.QuickSurface ||
      this.getIafViewerState()?.elevationMode === GisElevationMode.QuickUnderground
    ) {
      await this.setElevationMode(GisElevationMode.None, this.getIafViewerState()?.elevationMode);
    }

    this.setState(
      (prev) => {
        const models = { ...prev.models };
        for (const id of modelIds) {
          if (models[id]) models[id] = { ...models[id], terrainHeight: parsedNewValue };
        }
        return { models };
      },
      async () => {
        await this.setElevationMode(GisElevationMode.QuickSurface, GisElevationMode.None);
        this.invokeGisAlignmentCallback("onAltitudeChange", modelIds, parsedNewValue);
        this.saveGisData();
      }
    );
  }

  async handleToggleModelRealignHorizontalCluster(event, modelIds, representativeId) {
    await this.handleToggleModelRealignHorizontal(event, representativeId);
    const mode = this.state.models[representativeId]?.bModelRealignModeHorizontal;
    this.setState((prev) => {
      const models = { ...prev.models };
      for (const id of modelIds) {
        if (models[id]) models[id] = { ...models[id], bModelRealignModeHorizontal: mode };
      }
      return { models };
    });
  }

  async handleToggleModelRealignVerticalCluster(event, modelIds, representativeId) {
    await this.handleToggleModelRealignVertical(event, representativeId);
    const mode = this.state.models[representativeId]?.bModelRealignModeVertical;
    this.setState((prev) => {
      const models = { ...prev.models };
      for (const id of modelIds) {
        if (models[id]) models[id] = { ...models[id], bModelRealignModeVertical: mode };
      }
      return { models };
    });
  }

  setFederatedModelLocationCluster = async (lng, lat, modelIds, representativeId) => {
    this.setState(
      (prev) => {
        const models = { ...prev.models };
        for (const id of modelIds) {
          if (models[id]) models[id] = { ...models[id], longitude: lng, latitude: lat };
        }
        return { models };
      },
      async () => {
        for (const id of modelIds) {
          this.iafViewer.iafMapBoxGl?.setLongitude(lng, id);
          this.iafViewer.iafMapBoxGl?.setLatitude(lat, id);
          const m = this.state.models[id];
          if (m) {
            this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(id, m.title, [lng, lat]);
          }
        }
        this.iafViewer?.iafGltfManager?.setCenter(representativeId, lng, lat);
        this.invokeGisAlignmentCallback("onLongitudeChange", modelIds, lng);
        this.invokeGisAlignmentCallback("onLatitudeChange", modelIds, lat);
        await this.saveGisData();
      }
    );
  };

  async handleResetRealignmentCluster(modelIds, representativeId) {
    await this.handleResetRealignment(representativeId);
    const ref = this.state.models[representativeId];
    if (!ref) return;
    this.setState(
      (prev) => {
        const models = { ...prev.models };
        for (const id of modelIds) {
          if (!models[id] || id === representativeId) continue;
          models[id] = {
            ...models[id],
            bearing: ref.bearing,
            longitude: ref.longitude,
            latitude: ref.latitude,
            terrainHeight: ref.terrainHeight,
            bModelRealignModeHorizontal: ref.bModelRealignModeHorizontal,
            bModelRealignModeVertical: ref.bModelRealignModeVertical
          };
        }
        return { models };
      },
      () => {
        for (const id of modelIds) {
          if (id === representativeId) continue;
          const m = this.state.models[id];
          if (!m) continue;
          this.iafViewer.iafMapBoxGl?.setLongitude(m.longitude, id);
          this.iafViewer.iafMapBoxGl?.setLatitude(m.latitude, id);
          if (this.iafViewer.iafGltfManager?.gltfModelMap?.has(id)) {
            this.iafViewer.iafGltfManager.setCenter(id, m.longitude, m.latitude);
            this.iafViewer.iafGltfManager.setBearing(id, m.bearing);
          }
          this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(id, m.title, [m.longitude, m.latitude]);
        }
        const otherIds = modelIds.filter((id) => id !== representativeId);
        if (otherIds.length > 0) {
          this.invokeGisAlignmentCallback("onLongitudeChange", otherIds, ref.longitude);
          this.invokeGisAlignmentCallback("onLatitudeChange", otherIds, ref.latitude);
          this.invokeGisAlignmentCallback("onBearingChange", otherIds, ref.bearing);
          this.invokeGisAlignmentCallback("onAltitudeChange", otherIds, ref.terrainHeight);
        }
        this.saveGisData();
      }
    );
  }

  /**
   * Applies the same lng/lat shift to all models except excludeModelId.
   * Used when user moves one building via geocoder and confirms "apply to all".
   */
  applyLocationShiftToAllModels = (deltaLng, deltaLat, excludeModelId) => {
    const modelIds = Object.keys(this.state.models || {});
    const otherModelIds = modelIds.filter(id => id !== excludeModelId);
    if (otherModelIds.length === 0) return;

    const updates = {};
    otherModelIds.forEach(modelId => {
      const m = this.state.models[modelId];
      if (!m) return;
      updates[modelId] = {
        ...m,
        longitude: m.longitude + deltaLng,
        latitude: m.latitude + deltaLat
      };
    });

    this.setState(prevState => ({
      models: {
        ...prevState.models,
        ...updates
      }
    }), () => {
      otherModelIds.forEach(modelId => {
        const model = this.state.models[modelId];
        if (!model) return;
        this.iafViewer?.iafGltfManager?.setCenter(modelId, model.longitude, model.latitude);
        this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(modelId, model.title, [model.longitude, model.latitude]);
        const one = [modelId];
        this.invokeGisAlignmentCallback("onLongitudeChange", one, model.longitude);
        this.invokeGisAlignmentCallback("onLatitudeChange", one, model.latitude);
      });
      this.saveGisData();
    });
  }

  /**
   * Moves all models to the same geo location so they overlap.
   * Used when user chooses "All to this location" after placing one building via geocoder.
   */
  moveAllModelsToLocation = (lng, lat) => {
    const modelIds = Object.keys(this.state.models || {});
    if (modelIds.length === 0) return;

    const updates = {};
    modelIds.forEach(id => {
      const m = this.state.models[id];
      if (!m) return;
      updates[id] = { ...m, longitude: lng, latitude: lat };
    });

    this.setState(prevState => ({
      models: {
        ...prevState.models,
        ...updates
      }
    }), () => {
      const affected = Object.keys(updates);
      modelIds.forEach(modelId => {
        const model = this.state.models[modelId];
        if (!model) return;
        this.iafViewer?.iafGltfManager?.setCenter(modelId, model.longitude, model.latitude);
        this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(modelId, model.title, [model.longitude, model.latitude]);
      });
      if (affected.length > 0) {
        this.invokeGisAlignmentCallback("onLongitudeChange", affected, lng);
        this.invokeGisAlignmentCallback("onLatitudeChange", affected, lat);
      }
      this.saveGisData();
    });
  }

  /**
   * Updates the selected model to the new location, then (when there are multiple models)
   * shows a consent dialog and applies the user's choice to all resources/models.
   * Exits Horizontal Realignment mode after a choice is made.
   * @param {number} lng - New longitude
   * @param {number} lat - New latitude
   * @param {string} modelId - ID of the model being moved
   */
  setFederatedModelLocation = async (lng, lat, modelId) => {
    const currentModel = this.state.models[modelId];
    if (!currentModel) return;

    const currentLng = currentModel.longitude;
    const currentLat = currentModel.latitude;
    const deltaLng = lng - currentLng;
    const deltaLat = lat - currentLat;

    this.handleChangeLongitudeByModel(null, lng, modelId);
    this.handleChangeLatitudeByModel(null, lat, modelId);
    this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(modelId, currentModel.title, [lng, lat]);

    const modelCount = Object.keys(this.state.models || {}).length;
    if (modelCount > 1) {
      const buildingName = currentModel.title || 'this building';
      const choice = await this.showConfirmDialog({
        title: 'Apply location shift',
        message: `The building (${buildingName}) has been moved to the new location. Would you like to auto adjust the rest of the models, reset the rest to this location so they overlap, ignore the others and leave them at their current locations, or cancel to undo the move for this building?`,
        actions: [
          { id: 'all', label: 'Auto Adjust Others', variant: 'primary' },
          { id: 'stack', label: 'Reset Others' },
          { id: 'one', label: 'Ignore Others' },
          { id: 'none', label: 'Cancel' }
        ]
      });
      if (choice === 'all') {
        this.applyLocationShiftToAllModels(deltaLng, deltaLat, modelId);
      } else if (choice === 'stack') {
        this.moveAllModelsToLocation(lng, lat);
      } else if (choice === 'none' || choice === false) {
        this.setState(prevState => ({
          models: {
            ...prevState.models,
            [modelId]: {
              ...prevState.models[modelId],
              longitude: currentLng,
              latitude: currentLat
            }
          }
        }), () => {
          this.iafViewer?.iafMapBoxGl?.setLongitude(currentLng, modelId);
          this.iafViewer?.iafMapBoxGl?.setLatitude(currentLat, modelId);
          this.iafViewer?.iafGltfManager?.setCenter(modelId, currentLng, currentLat);
          this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(modelId, currentModel.title, [currentLng, currentLat]);
          this.saveGisData();
        });
      }

      if (this.state.models[modelId]?.bModelRealignModeHorizontal) {
        await this.handleToggleModelRealignHorizontal(null, modelId);
      }
    }
  }

  // handleChangeLatitude(event, newValue, name) {
  //   console.log ('handleChangeLatitude', newValue);
  //   this.timeoutChangeLatiitude && clearTimeout(this.timeoutChangeLatitude);
  //   const value = -newValue;
  //   this.timeoutChangeLatitude = setTimeout(() => {
  //     this.setState({ latitude: value }, () => this.iafViewer.iafMapBoxGl.setLatitude(this.state.latitude));
  //     clearTimeout(this.timeoutChangeLatitude);
  //   }, window.timeoutspeed);
  // }

  async toggleReAlignMode3d(enable) {
    this.iafViewer.iafMapBoxGl.toggleRealignment3d(enable);
  }

  async toggleReAlignMode(enable) {
    this.iafViewer.iafMapBoxGl.toggleRealignment(enable, this.state.models[this.primaryModelId]?.bearing ?? 0);
    if(!enable) {
      // Update the latest center position after realignment is done.
      this.options.center = this.iafViewer.iafMapBoxGl.map.getCenter()
    }
    this.iafViewer.iafTuner.tuneGis(this.options);
    await this.iafViewer.iafTuner.tuneOrientation();

    if (!enable) {
      this.options.bearing = this.state.uiBearing;
      this.options.pitch = this.state.pitch;

      // Switch BIMPK Model to 3d Mode
      this.iafViewer.iafMapBoxGl.setBearing(this.state.uiBearing);
      this.iafViewer.iafMapBoxGl.setPitch(this.state.pitch);
      this.iafViewer.iafMapBoxGl.updateCenterOriginal();

      // No need to update GLTF model as it is auto aligned with gis (Mapbox)
    }
    await this.updateStateByModel(this.state.models[this.primaryModelId]?.id);

    if (!enable) {
      const primaryModel = this.state.models[this.primaryModelId];
      if (primaryModel) this.iafViewer.iafTuner.setPrimaryModel(primaryModel);
      this.saveGisData();
    }
    // !enable && this.updateAlignment(); // This is necessary as we are updating not bearing & center on enable.
  }

  async realignModelByIdVertical(enable, modelId) {
    if (!modelId || !this.state.models[modelId]) {
        throw new Error("Invalid modelId or model state not found");
    }

    const modelState = this.state.models[modelId];

    this.iafViewer.iafMapBoxGl.toggleRealignment3d(enable);
  }

  async realignSoftModelByIdHorizontal(enable, modelId) {
    if (!modelId || !this.state.models[modelId]) {
        throw new Error("Invalid modelId or model state not found");
    }

    const modelState = this.state.models[modelId];

    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | ReactGis.realignSoftModelByIdHorizontal'
        , '/modelId', modelId
        , '/enable', enable
        , '/modelState', {...modelState}
      );

    this.iafViewer.iafMapBoxGl.setCenter([modelState.longitude, modelState.latitude]);
    this.iafViewer.iafMapBoxGl.toggleRealignment(enable, modelState.bearing);

    // if (!enable) {
    //     // Update the latest center position after realignment is done.
    //     this.options.center = this.iafViewer.iafMapBoxGl.map.getCenter();
    //     const {lng, lat} = this.options.center
    //     this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(modelId, this.state.models[modelId].title, [lng, lat]);
    // }

    // this.iafViewer.iafTuner.tuneGis(this.options);
    // await this.iafViewer.iafTuner.tuneOrientation();

    // if (enable) {
    //   this.handleChangeLongitudeByModel(null, this.options.center.lng, modelId);
    //   this.handleChangeLatitudeByModel(null, this.options.center.lat, modelId);  
    // }

    if (!enable) {
      this.options.bearing = this.state.uiBearing;
      this.options.pitch = this.state.pitch;

      // Switch BIMPK Model to 3d Mode
      // this.iafViewer.iafMapBoxGl.setBearing(this.state.uiBearing);
      // this.iafViewer.iafMapBoxGl.setPitch(this.state.pitch);
      // this.options.center = this.iafViewer.iafMapBoxGl.map.getCenter()
      // this.iafViewer.iafMapBoxGl.updateCenterOriginal();

      // No need to update GLTF model as it is auto aligned with gis (Mapbox)

      if (modelId !== this.primaryModelId) {
        const initialModelState = this.initializeModelStates()[this.primaryModelId]; // Fetch initial state

        this.handleChangeLongitudeByModel(null, initialModelState.longitude, this.primaryModelId);
        this.handleChangeLatitudeByModel(null, initialModelState.latitude, this.primaryModelId);
        this.handleChangeBearingByModel(null, initialModelState.bearing, this.primaryModelId);

        // this.handleChangeLongitudeByModel(null, this.state.models[modelId].longitude, modelId);
        // this.handleChangeLatitudeByModel(null, this.state.models[modelId].latitude, modelId);  


        // this.setState(prevState => ({
        //   models: {
        //     ...prevState.models,
        //     [modelId]: {
        //       ...initialModelState
        //     }
        //   },
        //   bModelRealignModeHorizontal: initialModelState.bModelRealignModeHorizontal
        // }),
        // async () => {
        //   this.iafViewer.iafMapBoxGl?.setLongitude(initialModelState.longitude);
        //   this.iafViewer.iafMapBoxGl?.setLatitude(initialModelState.latitude);
        //   this.iafViewer.iafMapBoxGl?.setBearing(initialModelState.bearing);
        // }); 

        this.iafViewer.iafMapBoxGl.setCenter([this.state.models[this.primaryModelId]?.longitude ?? 0, this.state.models[this.primaryModelId]?.latitude ?? 0]);

        // await this.updateMapOptions();
        // this.iafViewer.iafTuner.tuneGis(this.options);
        await this.iafViewer.iafTuner.tuneOrientation();
      }
      
      this.saveGisData();
    }
  }

  async realignModelByIdHorizontal(enable, modelId) {
    if (!modelId || !this.state.models[modelId]) {
        throw new Error("Invalid modelId or model state not found");
    }

    const modelState = this.state.models[modelId];

    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | ReactGis.realignModelByIdHorizontal'
        , '/modelId', modelId
        , '/enable', enable
        , '/modelState', {...modelState}
      );

    this.iafViewer.iafMapBoxGl.toggleRealignment(enable, modelState.bearing);

    if (!enable) {
        // Update the latest center position after realignment is done.
        this.options.center = this.iafViewer.iafMapBoxGl.map.getCenter();
        const {lng, lat} = this.options.center
        this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(modelId, this.state.models[modelId].title, [lng, lat]);
    }

    this.iafViewer.iafTuner.tuneGis(this.options);
    await this.iafViewer.iafTuner.tuneOrientation();

    if (!enable) {
        this.options.bearing = this.state.uiBearing;
        this.options.pitch = this.state.pitch;

        // Switch BIMPK Model to 3d Mode
        this.iafViewer.iafMapBoxGl.setBearing(this.state.uiBearing);
        this.iafViewer.iafMapBoxGl.setPitch(this.state.pitch);
        this.options.center = this.iafViewer.iafMapBoxGl.map.getCenter()
        this.iafViewer.iafMapBoxGl.updateCenterOriginal();

        // No need to update GLTF model as it is auto aligned with gis (Mapbox)
    }

    await this.updateStateByModel(modelId);

    if (!enable) {
      const primaryModel = this.state.models[this.primaryModelId];
      if (primaryModel) this.iafViewer.iafTuner.setPrimaryModel(primaryModel);
      this.saveGisData();
    }

    // !enable && this.updateAlignment(); // This is necessary as we are updating not bearing & center on enable.
  }

  async handleToggleRealignHorizontalLow(){
    await new Promise((resolve, reject) => {
      this.setState(
        { bModelRealignModeHorizontal: !this.state.bModelRealignModeHorizontal },
        async () => {
          try {
            await this.toggleReAlignMode(this.state.bModelRealignModeHorizontal);
            if (this.state.bModelRealignModeHorizontal) {
              this.rememberRealignmentLngLatBaseline(this.primaryModelId);//ATK PLG-1808: Review Reset / Escape / Persistence on GIS Alignments
              NotificationStore.notifyGisHorizontalAlignmentUnlocked(this.iafViewer);
              if (this._horizontalAlignmentInterval) {
                clearInterval(this._horizontalAlignmentInterval);
              }
              this._horizontalAlignmentInterval = setInterval(() => {
                NotificationStore.notifyGisHorizontalAlignmentUnlocked(this.iafViewer);
              }, 10000);
              const handleRealignKeydown = async (event) => {
                window.removeEventListener("keydown", handleRealignKeydown);
                if (this._horizontalAlignmentInterval) {
                  clearInterval(this._horizontalAlignmentInterval);
                }
                this.setState(prevState => ({
                  bModelRealignModeHorizontal: false
                }), () => {
                  this.clearRealignmentLngLatBaseline(this.primaryModelId);//ATK PLG-1808: Review Reset / Escape / Persistence on GIS Alignments
                  this.toggleReAlignMode(false);
                  this.debugLogRealignmentState("handleToggleRealignHorizontalLow");
                });
              };
              window.addEventListener("keydown", handleRealignKeydown);
            }
            this.debugLogRealignmentState("handleToggleRealignHorizontalLow");
            resolve(); // Resolve the promise once the operation is complete
          } catch (error) {
            reject(error); // Reject the promise if an error occurs
          }
        }
      );
    });
  }

  async handleToggleRealignVerticalLow(){
    await new Promise((resolve, reject) => {
      this.setState(
        { bModelRealignModeVertical: !this.state.bModelRealignModeVertical },
        async () => {
          try {
            await this.toggleReAlignMode3d(this.state.bModelRealignModeVertical);
            if (this.state.bModelRealignModeVertical) {
              NotificationStore.notifyGisVerticalAlignmentUnlocked(this.iafViewer);
              if (this._verticalAlignmentInterval) {
                clearInterval(this._verticalAlignmentInterval);
              }
              this._verticalAlignmentInterval = setInterval(() => {
                NotificationStore.notifyGisVerticalAlignmentUnlocked(this.iafViewer);
              }, 10000);
              const handleRealignKeydown = async (event) => {
                window.removeEventListener("keydown", handleRealignKeydown);
                if (this._verticalAlignmentInterval) {
                  clearInterval(this._verticalAlignmentInterval);
                }
                this.setState(prevState => ({
                  bModelRealignModeVertical: false
                }), () => {
                  this.toggleReAlignMode3d(false);
                });
              };
              window.addEventListener("keydown", handleRealignKeydown);
            }
            resolve(); // Resolve the promise once the operation is complete
          } catch (error) {
            reject(error); // Reject the promise if an error occurs
          }
        }
      );
    });
  }

  async handleToggleRealignByModelHorizontalLow(modelId) {
    if (!modelId || !this.state.models[modelId]) {
        throw new Error("Invalid modelId or model state not found");
    }

    await new Promise((resolve, reject) => {

        this.setState(
            {
                models: {
                    ...this.state.models,
                    [modelId]: {
                        ...this.state.models[modelId],
                        bModelRealignModeHorizontal: !this.state.models[modelId]?.bModelRealignModeHorizontal
                    }
                },
                bModelRealignModeHorizontal: !this.state.bModelRealignModeHorizontal
            },
            async () => {
                try {
                    const toggleOffOtherModels = () => {
                      // Turn off visibility for all other models except the current model
                      Object.keys(this.state.models).forEach((otherModelId) => {
                        if (otherModelId !== modelId) {
                          this.iafViewer.iafGltfManager.setGltfModelVisibility(otherModelId, false);
                        }
                      });
                    }

                    const toggleOnOtherModels = () => {
                      // Turn on visibility for all other models except the current model
                      Object.keys(this.state.models).forEach((otherModelId) => {
                        if (otherModelId !== modelId) {
                          this.iafViewer.iafGltfManager.setGltfModelVisibility(otherModelId, this.state.models[otherModelId].bShowModel);
                        }
                      });
                    }

                    const clearHorizontalAlignmentInterval = () => {
                      if (this._horizontalAlignmentInterval) {
                        clearInterval(this._horizontalAlignmentInterval);
                        this._horizontalAlignmentInterval = undefined;
                      }
                    }

                    const notifyGisHorizontalAlignmentUnlocked = () => {
                      // Set up a repeating notification every 10 seconds, until Escape is pressed
                      NotificationStore.notifyGisHorizontalAlignmentUnlocked(this.iafViewer);
                      clearHorizontalAlignmentInterval();
                      this._horizontalAlignmentInterval = setInterval(() => {
                        NotificationStore.notifyGisHorizontalAlignmentUnlocked(this.iafViewer);
                      }, 10000);
                    }

                    const rememberUiState = () => {
                      // Remember the current zoom, bearing, and pitch from this.state
                      this._realignStateBackup = {
                        zoom: this.state.zoom,
                        bearing: this.state.uiBearing,
                        pitch: this.state.pitch
                      };
                      IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | ReactGis.handleToggleRealignByModelHorizontalLow', 'rememberUiState', this._realignStateBackup);
                    }

                    const restoreUiState = () => {
                      // Restore the current zoom, bearing, and pitch from this._realignStateBackup
                      clearHorizontalAlignmentInterval();
                      this.setState({
                        zoom: this._realignStateBackup.zoom,
                        uiBearing: this._realignStateBackup.bearing,
                        pitch: this._realignStateBackup.pitch
                      }, () => {
                        this.iafViewer.iafMapBoxGl.getProxy().setZoom(this.state.zoom);
                        this.iafViewer.iafMapBoxGl.getProxy().setBearing(this.state.uiBearing);
                        this.iafViewer.iafMapBoxGl.getProxy().setPitch(this.state.pitch);
                      });
                    }

                    const handleRealignUsingKeyboard = () => {
                      // Handle realign using keyboard
                      const handleRealignKeydown = async (event) => {
                        if (//event.key === "Enter" || 
                            event.key === "Escape") {
                          window.removeEventListener("keydown", handleRealignKeydown);
                          this.setState({
                                models: {
                                    ...this.state.models,
                                    [modelId]: {
                                        ...this.state.models[modelId],
                                        bModelRealignModeHorizontal: false
                                    }
                                },
                                bModelRealignModeHorizontal: false
                          }, async () => {
                            // event.key === "Enter" && await this.realignSoftModelByIdHorizontal(false, modelId);
                            // event.key === "Escape" && 
                            await this.handleResetRealignment(modelId, { horizontalReset: true, verticalReset: false });
                            toggleOnOtherModels();
                            restoreUiState();  
                            this.debugLogRealignmentState("handleToggleRealignByModelHorizontalLow");
                          });
                        }
                      };
                      window.addEventListener("keydown", handleRealignKeydown);
                    }                    

                    if (this.state.models[modelId]?.bModelRealignModeHorizontal) {
                      rememberUiState();
                      this.rememberRealignmentLngLatBaseline(modelId);//ATK PLG-1808: Review Reset / Escape / Persistence on GIS Alignments
                      toggleOffOtherModels();
                      notifyGisHorizontalAlignmentUnlocked();
                      handleRealignUsingKeyboard();
                    }
                    // Toggle realign mode by model
                    if (modelId !== this.primaryModelId) {
                      await this.realignSoftModelByIdHorizontal(this.state.models[modelId]?.bModelRealignModeHorizontal, modelId);
                    } else {
                      await this.realignModelByIdHorizontal(this.state.models[modelId]?.bModelRealignModeHorizontal, modelId);
                    }

                    if (!this.state.models[modelId]?.bModelRealignModeHorizontal) {
                      this.clearRealignmentLngLatBaseline(modelId);//ATK PLG-1808: Review Reset / Escape / Persistence on GIS Alignments
                      toggleOnOtherModels();
                      restoreUiState();
                    }

                    this.debugLogRealignmentState("handleToggleModelRealignHorizontal");
                    resolve(); // Resolve the promise once the operation is complete
                } catch (error) {
                    reject(error); // Reject the promise if an error occurs
                }
            }
        );
    });
  }

  async handleToggleRealignByModelVerticalLow(modelId) {
    if (!modelId || !this.state.models[modelId]) {
        throw new Error("Invalid modelId or model state not found");
    }

    await new Promise((resolve, reject) => {
        this.setState(
            {
                models: {
                    ...this.state.models,
                    [modelId]: {
                        ...this.state.models[modelId],
                        bModelRealignModeVertical: !this.state.models[modelId]?.bModelRealignModeVertical
                    }
                },
                bModelRealignModeVertical: !this.state.bModelRealignModeVertical
            },
            async () => {
                try {
                    await this.realignModelByIdVertical(this.state.models[modelId]?.bModelRealignModeVertical, modelId);
                    if (this.state.models[modelId]?.bModelRealignModeVertical) {
                      // Set up a repeating notification every 10 seconds, until Escape is pressed
                      if (this._verticalAlignmentInterval) {
                        clearInterval(this._verticalAlignmentInterval);
                      }
                      this._verticalAlignmentInterval = setInterval(() => {
                        NotificationStore.notifyGisVerticalAlignmentUnlocked(this.iafViewer);
                      }, 10000);
                      const handleRealignKeydown = async (event) => {
                        if (event.key === "Enter" || event.key === "Escape") {
                          window.removeEventListener("keydown", handleRealignKeydown);
                          if (this._verticalAlignmentInterval) {
                            clearInterval(this._verticalAlignmentInterval);
                          }
                          this.setState(prevState => ({
                            models: {
                              ...prevState.models,
                              [modelId]: {
                                ...prevState.models[modelId],
                                bModelRealignModeVertical: false
                              }
                            }
                          }), () => {
                            event.key === "Enter" && this.realignModelByIdVertical(false, modelId);
                            event.key === "Escape" && this.handleResetRealignment(modelId, { horizontalReset: false, verticalReset: true });
                          });
                        }
                      };
                      window.addEventListener("keydown", handleRealignKeydown);
                    }
                    this.debugLogRealignmentState("handleToggleModelRealignVertical");
                    resolve(); // Resolve the promise once the operation is complete
                } catch (error) {
                    reject(error); // Reject the promise if an error occurs
                }
            }
        );
    });
  }

  // ------------------------------------------------------------------------------------------------------------------------
  // End of UI Handlers / Callbacks for Model Properties - e.g. Federated
  // ------------------------------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------------------------------
  // Setters & Getters
  // ------------------------------------------------------------------------------------------------------------------------

  setElevationMode = async (elevationMode, prevElevationMode) => {
    if (elevationMode === prevElevationMode) {
      IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.setElevationMode', 'elevationMode is the same as prevElevationMode');
      return;
    }

    if (!this.iafViewer.iafMapBoxGl) {
      console.warn('IafViewer.EVMMode.Mapbox | IafGis.setElevationMode', 'IafMapBoxGl is not initialized');
      return;
    }

    if (!this.primaryModelId) {
      console.warn('IafViewer.EVMMode.Mapbox | IafGis.setElevationMode', 'No primary model ID set');
      return;
    }

    // Set flag to indicate setElevationMode is in progress
    // Operations waiting on this flag will be queued until it's unset
    this.operationQueue.setFlag('setElevationMode');

    const perfLogger = new IafPerfLogger("IafGis.setElevationMode");
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.setElevationMode', getElevationModeLabel(elevationMode));
    const st = performance.now();

    const terrainHeightInMm = IafMathUtils.displayUnits2mm(this.iafViewer, this.getModelStateByIndex(0).terrainHeight);

    const undefineUndergroundNodesQuick = async () => {
      if (prevElevationMode && prevElevationMode === GisElevationMode.QuickUnderground)
        await this.iafViewer.iafMapBoxGl.undefineUndergroundNodesQuick();
    }

    const undefineUndergroundNodes = async () => {
      if (prevElevationMode && prevElevationMode === GisElevationMode.Underground)
        await this.iafViewer.iafMapBoxGl.undefineUndergroundNodes();
    }

    const init = async () => {

      // Clear
      await defineAllComposedViews();
      await resetUndergroundNodes();
      await undefineUndergroundNodesQuick();
      await undefineUndergroundNodes();
      await this.iafViewer.clearSelectionFilter(this.iafViewer._viewer);
      await this.iafViewer.iafCuttingPlanesUtils.enableCuttingPlanes(false);

      // Lock latest set of view ids
      this.iafViewer.iafMapBoxGl.lockViewIds();
    }

    const defineTerrainQuick = async () => {
      if (!prevElevationMode || prevElevationMode === GisElevationMode.None)
        await this.iafViewer.iafMapBoxGl.defineTerrainQuick(IafMathUtils.displayUnits2mm(this.iafViewer, this.getModelStateByIndex(0).terrainHeight));
    }

    const undefineTerrainQuick = async () => {
      if (prevElevationMode && prevElevationMode !== GisElevationMode.None) {
        await this.iafViewer.iafMapBoxGl.undefineTerrainQuick(IafMathUtils.displayUnits2mm(this.iafViewer, this.getModelStateByIndex(0).terrainHeight));
      }
    }

    const defineAllComposedViews = async () => {
      if (prevElevationMode
          && (
              prevElevationMode === GisElevationMode.Underground
              // || prevElevationMode === GisElevationMode.Blend
            )
        ) {
        await this.iafViewer.iafMapBoxGl.defineAllComposedViews();
      }
    }

    const undefineAllComposedViews = async () => {
      await this.iafViewer.iafMapBoxGl.undefineAllComposedViews();
    }

    const hideUndergroundNodes = async () => {
      await this.iafViewer.iafMapBoxGl.defineUndergroundNodes(0.0, this.state.models[this.primaryModelId]?.terrainHeight ?? 0);
    }

    const showUndergroundNodes = async () => {
      await this.iafViewer.iafMapBoxGl.defineUndergroundNodes(0.4, this.state.models[this.primaryModelId]?.terrainHeight ?? 0);
    }

    const resetUndergroundNodes = async () => {
      if (prevElevationMode &&
          (
            prevElevationMode === GisElevationMode.Blend
            || prevElevationMode === GisElevationMode.Surface
            || prevElevationMode === GisElevationMode.Underground
          )
        )
        await this.iafViewer.iafMapBoxGl.undefineUndergroundNodes();
    }

    const resetBottomPlane = async (z) => {
      await this.iafViewer.iafCuttingPlanesUtils.updateCuttingSection(
        ECuttingPlane.Bottom,
        Communicator.Axis.Z,
        new Communicator.Point3(0, 0, -1),
        z, //this.iafViewer.completeBoundingBoxMm.min.z,
        new Communicator.Point3(0, 0, this.iafViewer.completeBoundingBoxMm.min.z));
    }

    const resetTopPlane = async (z) => {
      // Reset the top
      let terrainHeightReversed = this.iafViewer.iafCuttingPlanesUtils.reversePlane(
              z, //this.iafViewer.completeBoundingBoxMm.min.z + terrainHeightInMm,
              Communicator.Axis.Z,
              this.iafViewer.completeBoundingBoxMm);
      await this.iafViewer.iafCuttingPlanesUtils.updateCuttingSection(
              ECuttingPlane.Top,
              Communicator.Axis.Z,
              new Communicator.Point3(0, 0, 1),
              -terrainHeightReversed,
              new Communicator.Point3(0, 0, terrainHeightReversed));
    }

    const enableCuttingPlanes = async () => {
      // Execute
      await this.iafViewer.iafCuttingPlanesUtils.showCuttingPlaneGeometry(false);
      await this.iafViewer.iafCuttingPlanesUtils.enableCuttingPlanes(true);
    }

    const showAnnotations = async (show) => {
      this.iafViewer.markupManager?.showAll(show);
      this.iafViewer.setState({showAnnotations : show})
    }

    // const undefineUndergroundNodes  = async () => {
    //   if (prevElevationMode
    //     && prevElevationMode !== GisElevationMode.QuickSurface
    //     && prevElevationMode !== GisElevationMode.QuickUnderground
    //     && prevElevationMode !== GisElevationMode.None
    //   )
    //   await this.iafViewer.iafMapBoxGl.undefineUndergroundNodes();

    // }

    switch (elevationMode) {

        case GisElevationMode.Blend:
          await init();
          await defineTerrainQuick();
          await showUndergroundNodes();
          await showAnnotations(false);
          break;

        case GisElevationMode.Underground:
          await init();
          await defineTerrainQuick();
          await undefineAllComposedViews();
          await showUndergroundNodes();
          await showAnnotations(false);
          break;

        case GisElevationMode.Surface:
          await init();
          await defineTerrainQuick();
          await hideUndergroundNodes();
          await showAnnotations(false);
          break;

        case GisElevationMode.QuickSurface:
          await init();
          await defineTerrainQuick();
          await resetBottomPlane(this.iafViewer.completeBoundingBoxMm.min.z);
          await resetTopPlane(this.iafViewer.completeBoundingBoxMm.min.z + terrainHeightInMm);
          await enableCuttingPlanes();
          await showAnnotations(false);
          break;

        case GisElevationMode.QuickUnderground:
          await init();
          await defineTerrainQuick();
          await resetBottomPlane(this.iafViewer.completeBoundingBoxMm.min.z - terrainHeightInMm);
          await resetTopPlane(this.iafViewer.completeBoundingBoxMm.max.z);
          await enableCuttingPlanes();
          await this.iafViewer.iafMapBoxGl.defineUndergroundNodesQuick(0.4);
          await showAnnotations(false);
          break;

        default:
        case GisElevationMode.None:
          await init();
          await undefineTerrainQuick();
          await showAnnotations(true);
          break;
    }
    perfLogger.end();
    
    // Unset flag to indicate setElevationMode is complete
    // This will trigger processing of any queued operations waiting on this flag
    this.operationQueue.unsetFlag('setElevationMode');
    
    // Invoke callback if provided
    if (typeof this.iafViewer.props.gis?.onElevationModeChanged === 'function') {
      this.iafViewer.props.gis.onElevationModeChanged(elevationMode);
    }
  }

  refreshFederatedDisplay = async () => {  
    this.iafViewer.iafTuner.updateModelDisplay(this.options.zoom);
    this.iafViewer.iafTuner.tuneOptions(this.options);
    this.iafViewer.iafTuner.applyTunedCamera();
  }

  setPrimaryModel = async (primaryModelId) => {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.setPrimaryModel'
      , '/primaryModelId', primaryModelId
    );
    // const prevElevationMode = this.getIafViewerState()?.elevationMode;
    // this.setElevationMode(GisElevationMode.None, prevElevationMode);
    // this.refreshFederatedDisplay();
    const distProp = this.iafViewer.props.gis?.dynamicRenderingDistance;
    const zoomProp = this.iafViewer.props.gis?.dynamicRenderingZoom;
    const storeGis = PropertyStore.gis;
    const storeDist = storeGis?.dynamicRenderingDistance;
    const storeZoom = storeGis?.dynamicRenderingZoom;
    const dynamicRenderingDistance =
      typeof distProp === "number" && Number.isFinite(distProp)
        ? distProp
        : typeof storeDist === "number" && Number.isFinite(storeDist)
          ? storeDist
          : 750;
    const dynamicRenderingZoom =
      typeof zoomProp === "number" && Number.isFinite(zoomProp)
        ? zoomProp
        : typeof storeZoom === "number" && Number.isFinite(storeZoom)
          ? storeZoom
          : 14;
    this.setIafViewerState({
      elevationMode: GisElevationMode.None,
      federatedMode: GisFederatedMode.Outline,
      primaryModelId,
      dynamicRenderingDistance,
      dynamicRenderingZoom,
    }, 
    async () => {
      this.primaryModelId = primaryModelId;
      const z = this.iafViewer.iafMapBoxGl?.map?.getZoom?.();
      if (typeof z === "number") {
        this.iafViewer.iafTuner?.updateModelDisplay(z);
      }
      // this.setElevationMode(GisElevationMode.None, prevElevationMode);
      // if (this.props.handleModelSelection) this.props.handleModelSelection(this.state.models[primaryModelId].dbModel);
    });
  }

  hasPlatformModels() {
    return this.primaryModelId ? true : false;
  }

  async getGisData() {
    try {
        let data = {};
        if(!this.iafViewer.iafDatabaseManager._enablePersistence
          || !permissionManager.hasReadAccess("gis")
        ) {
          data = IafStorageUtils.buildDataFromLocalStorage({ getExportKey: () => gisExportKey });
          data = (data && Object.keys(data).length > 0) ? data : null;
        } else {
          try{
             const gisArrayFromDb = await this.iafViewer.iafDatabaseManager.queueRead({
              apiClient: IafApiClientGis,
              readByType: true,
              immediateProcess: true,
            });
             data = gisArrayFromDb[PRIMARY_MODEL_INDEX] || null
          }catch(e){
            data = null
          }
        }
        //RRP:- Fixed the regression issue PLG-1187.
        const source = data ?? defaultGisData;
        const initialData = {
          ...source,
          _properties: {
            ...source._properties,
            session: {
              ...defaultGisData._properties.session,
              zoom: this.props.gis?.initial?.zoom ?? (this.hasPlatformModels() ? getInterpolatedZoomLevel(this.iafViewer.completeBoundingBoxLengthMm?.average / 1000) : 18),
              pitch: this.props.gis?.initial?.pitch ?? defaultGisData._properties.session.pitch,
              bearing: this.props.gis?.initial?.bearing ?? defaultGisData._properties.session.bearing,
            }
          }
        };

        // Prefer clusteredModels; missing center / altitude / bearing use defaultGisData._properties.buildings[0].alignment
        const modelComposition = this.iafViewer?.props?.modelComposition ?? PropertyStore.modelComposition;
        const federationType = this.iafViewer?.props?.defaultFederationType ?? modelComposition?.defaultFederationType ?? PropertyStore.modelComposition?.defaultFederationType ?? "SingleModel";
        const { clusterIdLists, rawClusters } = IafModelComposition.getClusteredModelsContext(modelComposition, federationType);
        const clusterMetaByModelId = {};
        if (Array.isArray(rawClusters) && Array.isArray(clusterIdLists)) {
          rawClusters.forEach((raw, i) => {
            const ids = clusterIdLists[i];
            if (!ids?.length || typeof raw !== "object" || raw === null || Array.isArray(raw)) return;
            const center = raw.center != null && typeof raw.center === "object" && !Array.isArray(raw.center)
              && Number.isFinite(raw.center.lng) && Number.isFinite(raw.center.lat)
              ? { lng: raw.center.lng, lat: raw.center.lat }
              : {
                  lng: defaultGisData._properties.buildings[0].alignment.center.lng,
                  lat: defaultGisData._properties.buildings[0].alignment.center.lat,
                };
            const terrainHeight = raw.altitude !== undefined
              ? raw.altitude
              : defaultGisData._properties.buildings[0].alignment.terrainHeight;
            const bearing = raw.bearing !== undefined
              ? raw.bearing
              : defaultGisData._properties.buildings[0].alignment.bearing;
            const title = raw.title ?? raw.name;
            const meta = { center, terrainHeight, bearing, title };
            ids.forEach((id) => { clusterMetaByModelId[id] = meta; });
          });
        }

        const existingBuildingIds = initialData._properties.buildings?.map(b => b.id) || [];
        const allResourceIds = this.getAllResources().map(resource => resource.dbModel._id);
        const clusterModelIds = Object.keys(clusterMetaByModelId);
        const missingIdsSet = new Set(
          allResourceIds.filter((id) => !existingBuildingIds.includes(id))
        );
        clusterModelIds.forEach((id) => {
          if (!existingBuildingIds.includes(id)) missingIdsSet.add(id);
        });
        const missingIds = [...missingIdsSet];

        // Append missing buildings with default values; prefer clusteredModels meta when available
        if (!initialData._properties.buildings) initialData._properties.buildings = [];
        const defaultAlignment = { ...defaultGisData._properties.buildings[0].alignment };
        missingIds.forEach(id => {
            const clusterMeta = clusterMetaByModelId[id];
            const alignment = {
              ...defaultAlignment,
              ...(clusterMeta && { center: clusterMeta.center, terrainHeight: clusterMeta.terrainHeight, bearing: clusterMeta.bearing }),
            };
            initialData._properties.buildings.push({
            id,
            alignment,
            title: clusterMeta?.title ?? this.state.models?.[id]?.name ?? this.project._name,
            bShowModel: this.state.models?.[id]?.bShowModel ?? true
            });
        });

        // Apply clusteredModels overrides to existing buildings (prefer incoming cluster meta over persisted/DB)
        initialData._properties.buildings.forEach((building) => {
          const clusterMeta = clusterMetaByModelId[building.id];
          if (!clusterMeta) return;
          if (clusterMeta.center) {
            building.alignment = building.alignment || { ...defaultAlignment };
            building.alignment.center = clusterMeta.center;
          }
          if (clusterMeta.terrainHeight !== undefined) {
            building.alignment = building.alignment || { ...defaultAlignment };
            building.alignment.terrainHeight = clusterMeta.terrainHeight;
          }
          if (clusterMeta.bearing !== undefined) {
            building.alignment = building.alignment || { ...defaultAlignment };
            building.alignment.bearing = clusterMeta.bearing;
          }
          if (clusterMeta.title != null) building.title = clusterMeta.title;
        });

        this.setState({gisData: initialData}, () => {
          // ATK PLG-1682: GIS 2.0 - Realignment of other buildings get overwritten on switching models and/or on realignment
          if (missingIds.length > 0) {
            this.saveGisData();
          }
        });
        
        const models = this.syncModelStatesFromBuildings(
          this.state.models,
          initialData._properties.buildings
        );

        this.setState({ models }, () => {
          // Refresh marker source data after models are updated with titles
          if (this.iafViewer?.iafMapBoxGl?.markers) {
            this.iafViewer.iafMapBoxGl.markers.setModelsData(this.state.models);
          }
        });
        
        NotificationStore.notifyGisLoadSuccess(this.iafViewer);
        IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.getGisData', 'gisData', initialData);
        return initialData;
    } catch (error) {
        console.error(`IafViewer.EVMMode.Mapbox | Error while loading gis data:`, error);
        NotificationStore.notifyGisLoadError(this.iafViewer);
    }
  }

  saveGisData = async () => {
    if (!this.iafViewer?.iafMapBoxGl) {
      console.warn('IafViewer.EVMMode.Mapbox | IafGis.saveGisData: iafMapBoxGl is not available');
      return;
    }

    // Guard: if gisData doesn't exist, we can't construct valid payload
    if (!this.state.gisData) {
      console.warn('IafViewer.EVMMode.Mapbox | IafGis.saveGisData: gisData is not available');
      return;
    }

    try {
      let result = this.iafViewer.iafMapBoxGl.get();
      const { buildings: newBuildings, ...otherProperties } = result?._properties || {};
      
      // ATK PLG-1682: GIS 2.0 - Realignment of other buildings get overwritten on switching models and/or on realignment
      // Merge buildings: preserve existing buildings and update/add new ones
      // This prevents overwriting buildings for models not in current state (single-model mode)
      const existingBuildings = this.state.gisData?._properties?.buildings || [];
      const mergedBuildings = [...existingBuildings];
      
      if (newBuildings && Array.isArray(newBuildings)) {
        newBuildings.forEach(newBuilding => {
          const existingIndex = mergedBuildings.findIndex(b => b.id === newBuilding.id);
          if (existingIndex >= 0) {
            // Update existing building
            mergedBuildings[existingIndex] = newBuilding;
          } else {
            // Add new building
            mergedBuildings.push(newBuilding);
          }
        });
      }
      
      const data = {
        ...this.state.gisData,
        _type: IafApiClientGis.type,
        _properties: {
          ...this.state.gisData._properties,
          ...otherProperties,
          buildings: mergedBuildings // ATK PLG-1682: GIS 2.0 - Realignment of other buildings get overwritten on switching models and/or on realignment
        }
      }
      // PLG-1187 not required to save the session data.
      // this.setState({ zoom: session.zoom,
      //   pitch: session.pitch,
      //   uiBearing: session.bearing,
      // });

      if(!this.iafViewer.iafDatabaseManager._enablePersistence
        || !permissionManager.hasWriteAccess("gis")
      ){
        IafStorageUtils.clearGisDataLocalStorage(this.iafViewer); // Clear GIS data from localStorage
        IafStorageUtils.saveGisData(this.iafViewer);
        this.setState({ gisData: data})
      } else {
        const action = this.state.gisData?._id ? "update" : "create";
        const gisDataResponse = await this.iafViewer.iafDatabaseManager[action]({
            apiClient: IafApiClientGis,
            ...(action === "update" && {id: data?._id}),
            data: action === "create" ? [data]: data
        });
        this.setState({ gisData: Array.isArray(gisDataResponse) ? gisDataResponse[0] : gisDataResponse})
      }
      NotificationStore.notifyGisUpdateSuccess(this.iafViewer);
    } catch (error) {
        console.warn(`IafViewer.EVMMode.Mapbox | Error while ${this.state.gisData?._id ? 'updating' : 'creating'} gis data:`, error);
        NotificationStore.notifyGisUpdateError(this.iafViewer);
    }
  }

  async updateMapOptionsFederated(data = null) {
    const mapData = data?._properties || this.state.gisData?._properties;
    const session = mapData?.session;
    const buildings = mapData?.buildings || [];

    // Create a copy of current models
    const updatedModels = { ...this.state.models };

    // Update each model's state
    buildings.forEach(building => {
        const modelId = building.id;
        if (updatedModels[modelId]) {
            updatedModels[modelId] = {
                ...updatedModels[modelId],
                longitude: building.alignment.center.lng,
                latitude: building.alignment.center.lat,
                bearing: building.alignment.bearing,
                terrainHeight: building.alignment.terrainHeight,
                title: building.title || this.project?._name,
                bShowModel: building.bShowModel ?? true
            };
        }

    });

    await new Promise((resolve) => {
        this.setState({
            models: updatedModels,
            zoom: session?.zoom ?? this.state.zoom,
            pitch: session?.pitch ?? this.state.pitch,
            uiBearing: session?.bearing ?? this.state.uiBearing
        }, () => {
            // Update options based on the primary model (fallback to first available model)
            // const primaryModel = buildings[PRIMARY_MODEL_INDEX] || buildings.find(building => updatedModels[building.id]);
            // if (primaryModel)
            {
                const centerFromModelCompositionProperties = IafModelComposition.getGeoCenterByModelIdFromCluster(this.iafViewer, this.primaryModelId);
                const centerFromGisInitialProperties = this.props.gis?.initial?.center;
                const centerFromDefaultGisData = defaultGisData._properties.buildings[0].alignment.center;
                this.options = {
                    ...this.options,
                    center: {
                        // lng: primaryModel.alignment.center.lng,
                        // lat: primaryModel.alignment.center.lat
                        lng: this.state.models[this.primaryModelId]?.longitude ?? centerFromModelCompositionProperties?.lng ?? centerFromGisInitialProperties?.lng ?? centerFromDefaultGisData.lng,
                        lat: this.state.models[this.primaryModelId]?.latitude ?? centerFromModelCompositionProperties?.lat ?? centerFromGisInitialProperties?.lat ?? centerFromDefaultGisData.lat
                    },
                    // bearing: primaryModel.alignment.bearing,
                    bearing: this.state.models[this.primaryModelId]?.bearing ?? 0,
                    bShowModel: this.state.models[this.primaryModelId]?.bShowModel ?? true,
                    zoom: this.state.zoom,
                    pitch: this.state.pitch,
                };
            }
            resolve();
        });
    });

    // set the title for all the buildings.
    Object.values(this.state.models).forEach(model => {
      this.iafViewer?.iafMapBoxGl?.markers?.updateMarkerLocationAndTitle(
        model.id,
          model.title,
          [model.longitude, model.latitude]
      );
    });
    
    // Refresh source data to ensure all markers show correct titles
    if (this.iafViewer?.iafMapBoxGl?.markers) {
      this.iafViewer.iafMapBoxGl.markers.setModelsData(this.state.models);
    }
  }

  async updateMapOptions(data = null) {
    await this.updateMapOptionsFederated(data); return;

    // const mapData = data?._properties || this.state.gisData?._properties;
    // const model = mapData?.models?.[PRIMARY_MODEL_INDEX] ?? mapData?.buildings?.[PRIMARY_MODEL_INDEX];
    // const session = mapData.session;

    // await new Promise((resolve) => {
    //     this.setState({
    //         longitude: model.alignment.center.lng,
    //         latitude: model.alignment.center.lat,
    //         zoom: session.zoom,
    //         pitch: session.pitch,
    //         uiBearing: session.bearing,
    //         // pitch: model.alignment.pitch, // Pitch is not model specific
    //         bearing: model.alignment.bearing,
    //         title: ""
    //     }, () => {
    //         // Update options with the new state values
    //         this.options = {
    //             ...this.options,
    //             center: { lng: model.alignment.center.lng, lat: model.alignment.center.lat },
    //             pitch: this.state.pitch,
    //             bearing: model.alignment.bearing,
    //             zoom: session.zoom,
    //             title: model.title ||  this.project._name
    //         };
    //         resolve();
    //     });
    // });
    // if(this.iafViewer && this.iafViewer.iafMapBoxGl && this.iafViewer.iafMapBoxGl.markers){
    //   this.iafViewer.iafMapBoxGl.markers.updateMarkerLocationAndTitle(this.options.title)
    // }
  }

  async resetAll(data = null) {
    const iafPerfLogger = new IafPerfLogger("IafGis.resetAll");
    // await this.iafViewer.iafMapBoxGl.recalculateBoundingBox();
    await this.updateMapOptions(data)
    
    if(this.iafViewer.iafMapBoxGl) {
      this.iafViewer.iafMapBoxGl.options = {...this.options};

      //3d model reset to align map.
      this.iafViewer.iafTuner.tuneGis(this.options);

      //set to empty as it triggers callback and changing pitch & bearing.
      this.iafViewer.iafMapBoxGl.setOnCameraChange(()=>{})

      // Reset BIMPK Model
      this.iafViewer.iafMapBoxGl.setCenter([this.options.center.lng, this.options.center.lat]);
      this.iafViewer.iafMapBoxGl.setBearing(this.options.bearing)
      this.iafViewer.iafMapBoxGl.setPitch(this.options.pitch)

      // No need to update GLTF model as it is auto aligned with gis (Mapbox)

      //set to camera callback.
      this.iafViewer.iafMapBoxGl.setOnCameraChange(this.handleCameraChange.bind(this))
      await this.iafViewer.iafTuner.tuneOrientation();
      this.iafViewer.iafMapBoxGl.setZoom(this.options.zoom)
      this.handleZoom();
      // this.setState({ pitch: this.state.pitch, bearing: this.state.uiBearing }, () => {
        this.iafViewer.iafMapBoxGl.setPitch(this.state.pitch);
        this.iafViewer.iafMapBoxGl.setBearing(this.state.uiBearing);

        // No need to update GLTF model as it is auto aligned with gis (Mapbox)
      // })
      this.iafViewer.iafMapBoxGl.updateCenterOriginal();

      this.iafViewer.iafTuner?.updateModelDisplay(this.options.zoom);      
    }
    iafPerfLogger.end();
  }

  updateAlignment = () => {
    this.setState({
      center: this.options.center,
      uiBearing: this.options.bearing
    })
  }

  fetchAlignmentByModel = (modelId) => {
    if (modelId === undefined || modelId === null || !this.state.models[modelId]) return; // Ensure model exists in state

    this.options.center = {
        lng: this.state.models[modelId].longitude,
        lat: this.state.models[modelId].latitude
    };
    this.options.bearing = this.state.models[modelId].bearing;
};

  // fetchAlignment = () => {
  //   this.options.center = {
  //    lng:  this.state.longitude,
  //    lat: this.state.latitude
  //   };
  //   this.options.bearing = this.state.uiBearing;
  // }

  async updateState() {
    return new Promise((resolve, reject) => {
      if (!this.iafViewer?.iafMapBoxGl) {
          reject(new Error("iafMapBoxGl is not available"));
          return;
      }

      try {
          this.options = this.iafViewer.iafMapBoxGl.getMapObject();
          let state = {
              longitude: this.options.center.lng,
              latitude: this.options.center.lat,
              zoom: this.options.zoom,
              ...(!this.state.bModelRealignModeHorizontal
                  ? { pitch: this.options.pitch, uiBearing: this.options.bearing }
                  : {})
          };

          IafUtils.debugIaf && IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.updateState', '/state', state);

          this.setState(state, () => {
              resolve(state); // Resolve the promise with the new state
          });
      } catch (error) {
          reject(error); // Reject the promise if any error occurs
      }
    });
  }

  async updateStateByModel(modelId) {
    return new Promise((resolve, reject) => {
        if (!this.iafViewer.iafMapBoxGl) {
            reject(new Error("iafMapBoxGl is not available"));
            return;
        }

        try {
            if (!modelId || !this.state.models[modelId]) {
              console.warn ('IafViewer.EVMMode.Mapbox | IafGis.updateStateByModel', 'Invalid modelId or model state not found', '/modelId', modelId, '/this.state.models', this.state.models);
              reject(new Error('Invalid modelId or model state not found'));
              return;
            }

            this.options = this.iafViewer.iafMapBoxGl?.getMapObject();
            if (!this.options) {
              console.warn ('IafViewer.EVMMode.Mapbox | IafGis.updateStateByModel', 'Map object is not available');
              reject(new Error('Map object is not available'));
              return;
            }

            let state = {
                zoom: this.options.zoom,
                ...( !this.state.models[modelId]?.bModelRealignModeHorizontal ? { pitch: this.options.pitch, uiBearing: this.options.bearing } : {} ),
                models: {
                    ...this.state.models,
                    [modelId]: {
                        ...this.state.models[modelId],
                        // longitude: this.options.center.lng,
                        // latitude: this.options.center.lat,
                        // bearing: this.options.bearing
                    }
                }
            };

            IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.updateState', '/state', state);

            this.setState(state, () => {
                resolve(state); // Resolve the promise with the new state
            });
        } catch (error) {
            reject(error); // Reject the promise if any error occurs
        }
    });
  }

  getAllResources() {
    if (!this.iafViewer.props.graphicsResources) return [];

    return this.state && this.getIafViewerState()?.federatedMode && this.getIafViewerState()?.federatedMode !== GisFederatedMode.None ? [
      this.iafViewer.props.graphicsResources,
      ...(this.iafViewer.props.graphicsResources?.externalModelResources?.map(resource => resource.graphicsResource) || [])
    ] : [
      this.iafViewer.props.graphicsResources
    ];
  }

  findResourceByModelId(modelId) {
    return this.getAllResources().find((r) => r?.dbModel?._id === modelId);
  }

  /**
   * Merge GIS building alignments into per-model map state. Used when graphicsResources is not ready yet so
   * modelComposition.clusteredModels centers still populate state before initializeModelStates() has keys.
   * Skips default template building id "0".
   */
  syncModelStatesFromBuildings(baseModels, buildings) {
    const models = { ...baseModels };
    (buildings || []).forEach((building) => {
      if (!building?.id || building.id === "0" || !building.alignment?.center) return;
      const resource = this.findResourceByModelId(building.id);
      const prev = models[building.id];
      models[building.id] = {
        ...prev,
        dbModel: prev?.dbModel ?? resource?.dbModel,
        id: building.id,
        versionId: prev?.versionId ?? resource?.dbModel?._versionId,
        name: prev?.name ?? resource?.dbModel?._name ?? building.title ?? this.project?._name,
        index: prev?.index ?? 0,
        bModelRealignModeHorizontal: prev?.bModelRealignModeHorizontal ?? false,
        bModelRealignModeVertical: prev?.bModelRealignModeVertical ?? false,
        longitude: building.alignment.center.lng,
        latitude: building.alignment.center.lat,
        bearing: building.alignment.bearing,
        terrainHeight: building.alignment.terrainHeight,
        title: building.title || this.project?._name,
        bShowModel: building.bShowModel ?? true,
      };
    });
    return models;
  }

  /**
   * One UI row per cluster (same grouping as addGltfModels). Non-cluster federated: one group per resource.
   * @returns {{ cluster: string[], representativeId: string, displayTitle: string }[]}
   */
  getGisClusterGroupsForUi() {
    const resources = this.getAllResources();
    if (!resources?.length) return [];

    const modelComposition = this.iafViewer?.props?.modelComposition ?? PropertyStore.modelComposition;
    const federationType =
      this.iafViewer?.props?.defaultFederationType ??
      modelComposition?.defaultFederationType ??
      PropertyStore.modelComposition?.defaultFederationType ??
      "SingleModel";
    const { useClusters, flatModelIds, clusterIdLists, rawClusters } = IafModelComposition.getClusteredModelsContext(
      modelComposition,
      federationType
    );

    const groups = [];
    if (useClusters && clusterIdLists?.length) {
      clusterIdLists.forEach((ids, i) => {
        const raw = rawClusters[i];
        const clusterName =
          typeof raw === "object" && raw !== null && !Array.isArray(raw) ? raw.title ?? raw.name : null;
        const representativeId = ids[0];
        const st = this.state.models?.[representativeId];
        groups.push({
          cluster: [...ids],
          representativeId,
          displayTitle:
            clusterName ||
            st?.title ||
            st?.name ||
            this.findResourceByModelId(representativeId)?.dbModel?._name ||
            representativeId
        });
      });
      Object.keys(this.state.models || {}).forEach((modelId) => {
        if (!flatModelIds.has(modelId)) {
          const st = this.state.models[modelId];
          groups.push({
            cluster: [modelId],
            representativeId: modelId,
            displayTitle: st?.title || st?.name || this.findResourceByModelId(modelId)?.dbModel?._name || modelId
          });
        }
      });
    } else {
      resources.forEach((resource) => {
        const id = resource.dbModel._id;
        const st = this.state.models?.[id];
        groups.push({
          cluster: [id],
          representativeId: id,
          displayTitle: st?.title || st?.name || resource.dbModel._name || id
        });
      });
    }
    return groups;
  }

  /**
   * Labels for Reference Model dropdown: multi-model clusters show `clusterTitle (model name)`;
   * unclustered or single-member groups use the same label as before (title vs name from showModelTitles).
   */
  getReferenceModelDropdownData() {
    const groups = this.getGisClusterGroupsForUi();
    const metaById = new Map();
    for (const g of groups) {
      const multi = g.cluster.length > 1;
      for (const id of g.cluster) {
        metaById.set(id, { multi, clusterTitle: g.displayTitle });
      }
    }
    return Object.values(this.state.models || {}).map((model) => {
      const meta = metaById.get(model.id) || { multi: false, clusterTitle: null };
      if (meta.multi && meta.clusterTitle) {
        return {
          value: model.id,
          label: `${meta.clusterTitle} (${model.name || 'Untitled'})`
        };
      }
      return {
        value: model.id,
        label: this.state.showModelTitles
          ? (model.title || model.name || 'Untitled')
          : (model.name || 'Untitled')
      };
    });
  }

  /** Federated mode options; Dynamic requires 3D viewer (GLTF / model handler). */
  getFederatedModeDropdownData() {
    const modes = this.federatedModes ?? [];
    if (this.iafViewer?.props?.view3d?.enable) return modes;
    return modes.filter((m) => m.value !== GisFederatedMode.Dynamic);
  }

   initializeModelStates() {
    const allModels = {};
    const defaultBuilding = defaultGisData._properties.buildings[0];
    this.getAllResources()?.forEach((resource, index) => {
      const modelId = resource.dbModel._id;
      const savedData = this.state?.gisData?._properties?.buildings?.find(building => building.id === modelId);
      const data = savedData || defaultBuilding;

       allModels[resource.dbModel._id] = {
        dbModel: resource.dbModel,
        id: resource.dbModel._id,
        versionId: resource.dbModel._versionId,
        name: resource.dbModel._name,
        index,  // Store index to keep track of primary/external resources
        bModelRealignModeHorizontal: false,
        bModelRealignModeVertical: false,
        bShowModel: data.bShowModel ?? true,
        longitude: data.alignment.center.lng,
        latitude: data.alignment.center.lat,
        bearing: data.alignment.bearing,
        bShowModel: data.bShowModel ?? true,
        terrainHeight: data.alignment.terrainHeight,
        title: data.title || resource.dbModel._name
      };
    });
    return allModels;
  }

  getModelState(modelId) {
    return this.state.models[modelId] || undefined;
  }

  getModelStateByIndex(index) {
    return Object.values(this.state.models).find(model => model.index === index) || undefined;
  }

  shouldLoadGltfForMode(mode) {
    return mode === GisFederatedMode.Outline || mode === GisFederatedMode.Dynamic;
  }

  async addGltfModels() {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.addGltfModels', '/this', this, '/this.iafViewer?.iafGltfManager', this.iafViewer?.iafGltfManager);
    if (!this.iafViewer?.iafGltfManager) return;
    if (this.getIafViewerState()?.federatedMode === GisFederatedMode.None) return;

    this.iafViewer.iafGltfManager.numActiveGltf = 0;
    this.iafViewer.iafTuner.updateModelDisplay(this.options.zoom);

    this.iafViewer.iafGltfManager.deleteGltfModels();

    try {
      // const howManyGltf = IafUtils.researchIaf ? await IafCommandUtils.getUserChoice("How many gltf models ? ", ["None", "1", "2", "All"]) : "All";

      const MAX_GLTF_MODELS = Infinity; // howManyGltf === "None" ? 0 : (howManyGltf === "All" ? Infinity : parseInt(howManyGltf, 10));
      this.iafViewer.iafGltfManager.enableGltfModels(true);
      this.iafViewer.iafGltfManager.setGisModels(this.state.models);

      const modelComposition = this.iafViewer?.props?.modelComposition ?? PropertyStore.modelComposition;
      const federationType = this.iafViewer?.props?.defaultFederationType ?? modelComposition?.defaultFederationType ?? PropertyStore.modelComposition?.defaultFederationType ?? "SingleModel";
      const { useClusters, flatModelIds, clusterIdLists, rawClusters } = IafModelComposition.getClusteredModelsContext(modelComposition, federationType);

      let glbEntities = [];
      if (useClusters) {
        clusterIdLists.forEach((ids, i) => {
          const raw = rawClusters[i];
          let meta = {};
          if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
            meta = {
              ...(raw.center != null && typeof raw.center === "object" && !Array.isArray(raw.center)
                && Number.isFinite(raw.center.lng) && Number.isFinite(raw.center.lat)
                && { center: { lng: raw.center.lng, lat: raw.center.lat } }),
              ...(raw.altitude !== undefined && { altitude: raw.altitude }),
              id: raw.id,
              name: raw.title ?? raw.name
            };
          }
          glbEntities.push({ cluster: ids, representativeId: ids[0], ...meta });
        });
        Object.keys(this.state.models || {}).forEach((modelId) => {
          if (!flatModelIds.has(modelId)) {
            glbEntities.push({ cluster: [modelId], representativeId: modelId });
          }
        });
      } else {
        Object.values(this.state.models || {}).forEach(model => {
          glbEntities.push({ cluster: [model.id], representativeId: model.id });
        });
      }

      for (const { representativeId } of glbEntities) {
        if (this.iafViewer.iafGltfManager.numActiveGltf >= MAX_GLTF_MODELS) break;
        const model = this.state.models?.[representativeId];
        if (!model) continue;
        IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.enableMapBox - Adding GLTF model:',
          model.title, model.id,
          model.longitude, model.latitude);

        let fileOptions = {};
        if (this.iafViewer.props.graphicsHandler) {
          const outlineFileUrl = this.iafViewer.props.graphicsHandler.getOutlineFileUrlByModelId(representativeId);
          if (outlineFileUrl) {
            const modelPath = IafUtils.isHttpUrl(outlineFileUrl)
              ? await IafUtils.getBlobUrlFromHttpUrl(outlineFileUrl)
              : outlineFileUrl;
            
            fileOptions = {
              modelPath: modelPath,
              originalFileName: outlineFileUrl.split('/').pop() || 'outline.glb'
            };
            IafUtils.devToolsIaf && console.log(`IafViewer.EVMMode.Mapbox | IafGis.addGltfModels - Using outline file URL for model ${representativeId}: ${outlineFileUrl}${IafUtils.isHttpUrl(outlineFileUrl) ? ` (converted to blob URL: ${modelPath})` : ''}`);
          } else {
            fileOptions = { placeholder: true };
            console.warn(`IafViewer.EVMMode.Mapbox | IafGis.addGltfModels - No outline file URL found for model ${representativeId}, creating placeholder GLTF model`);
          }
        } else {
          fileOptions = { placeholder: true };
          console.warn('IafViewer.EVMMode.Mapbox | IafGis.addGltfModels - graphicsHandler not available, creating placeholder GLTF model');
        }

        await this.iafViewer.iafGltfManager.addGltfModel(representativeId, fileOptions);
        this.iafViewer.iafGltfManager.numActiveGltf++;
        this.iafViewer.iafTuner.isGltfVisible = true;
        this.iafViewer.iafTuner.updateModelDisplay(this.options.zoom);
      }
      this.iafViewer.iafTuner.updateModelDisplay(this.options.zoom);        
      if (typeof this.iafViewer?.props?.gis?.onOutlineLoaded === 'function') {
        this.iafViewer.props.gis.onOutlineLoaded();
      }
    } catch (error) {
      console.error('IafViewer.EVMMode.Mapbox | IafGis.addGltfModels', error);
      this.setIafViewerState({showMapMarkers: true});
      // this.setIafViewerState({federatedMode: GisFederatedMode.None}, () => {
      //   // this.refreshFederatedDisplay();
      // });
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------
  // END OF Setters & Getters
  // ------------------------------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------------------------------
  // React Render functions
  // ------------------------------------------------------------------------------------------------------------------------

  /**
   * @param {object} resource - graphics resource for permissions (representative model when clustered)
   * @param {null|{ modelIds?: string[], clusterIds?: string[], representativeId: string, displayTitle: string }} clusterMeta - one panel per cluster; shared alignment for modelIds; Show Model on representativeId only. clusterIds is accepted as a legacy alias for modelIds.
   */
  renderModelSettings(resource, clusterMeta = null) {
    const { resourcePermissions } = this.iafViewer.state;
    const modelIds = clusterMeta?.modelIds ?? clusterMeta?.clusterIds ?? [resource.dbModel._id];
    const repId = clusterMeta?.representativeId ?? resource.dbModel._id;
    const isClusterUi = modelIds.length > 1;
    const isExpanded = this.state.expandedModelPanelId === repId;
    const displayText =
      clusterMeta?.displayTitle
      ?? (this.state.showModelTitles
        ? (this.state.models?.[repId]?.title || this.state.models?.[repId]?.name || resource.dbModel._name)
        : (this.state.models?.[repId]?.name || resource.dbModel._name));

    // console.log('IafViewer.EVMMode.Mapbox | IafGis.renderModelSettings',
    //   '/repId', repId,
    //   '/isClusterUi', isClusterUi,
    //   '/displayText', displayText
    // );

    const mrep = (k) => this.state.models?.[repId]?.[k];

    return (
      <IafSubHeader
        key={repId}
        title={displayText}
        minimized={!isExpanded}
        onToggle={(minimized) => {
          this.setState({
            expandedModelPanelId: minimized ? null : repId
          });
        }}
        canAccess={resourcePermissions?.[RESOURCE_TYPES.GIS]?.canWrite}
      >
        <IafSwitch
          disabled={
            !this.props.enableMapBox
            || !this.iafViewer.state.gis.isLoaded 
            || !this.iafViewer.state.view3d.isLoaded 
            || !this.iafViewer.state.view2d.isLoaded
            || mrep('bModelRealignModeHorizontal')
            || mrep('bModelRealignModeVertical')
            || !this.state.isElevationModeUpdated
            || !this.state.isFederatedModeUpdated
            || !this.state.isReferenceModelUpdated
          }
          title="Show Model"
          isChecked={this.state.models?.[repId]?.bShowModel ?? true}
          onChange={(event) => this.handleToggleShowModel(event, repId)}
        />
        <IafSwitch
          disabled={
            !this.state.models?.[repId]?.bShowModel
            || mrep('bModelRealignModeVertical')
            || !this.props.enableMapBox
            || !this.iafViewer.state.gis.isLoaded 
            || !this.iafViewer.state.view3d.isLoaded 
            || !this.iafViewer.state.view2d.isLoaded
            || !this.iafViewer.state.gis.enable
            || !this.state.isElevationModeUpdated
            || !this.state.isFederatedModeUpdated
            || !this.state.isReferenceModelUpdated
          }
          title="Horizontal Alignment (2D)"
          isChecked={mrep('bModelRealignModeHorizontal') || false}
          onChange={(event) =>
            isClusterUi
              ? this.handleToggleModelRealignHorizontalCluster(event, modelIds, repId)
              : this.handleToggleModelRealignHorizontal(event, repId)
          }
        />
        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '10px' }}>
          <IafSlider
            disabled={!this.props.enableMapBox || !this.state.models[repId]?.bModelRealignModeHorizontal || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded}
            title="Bearing"
            min={this.minBearing}
            max={this.maxBearing}
            value={this.state.models[repId]?.bearing || 0}
            onChange={(event, newValue) =>
              isClusterUi
                ? this.handleChangeBearingByCluster(event, newValue, modelIds, repId)
                : this.handleChangeBearingByModel(event, newValue, repId)
            }
            label={this.state.models[repId]?.bearing || 0}
            showValue={true}
            tooltipText={TooltipStore.GisRealignBearing}
            step={1}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '10px' }}>
          <IafSlider
            disabled={!this.props.enableMapBox || !this.state.models[repId]?.bModelRealignModeHorizontal || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded}
            title="Longitude"
            min={-180}
            max={180}
            labelDecimalPlaces={10}
            value={this.state.models[repId]?.longitude || 0}
            onChange={(event, newValue) =>
              isClusterUi
                ? this.handleChangeLongitudeByCluster(event, newValue, modelIds, repId)
                : this.handleChangeLongitudeByModel(event, newValue, repId)
            }
            step={this.lnglatstep}
            label={this.state.models[repId]?.longitude || 0}
            showValue={true}
            tooltipText={TooltipStore.GisRealignLongitude}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '10px' }}>
          <IafSlider
            disabled={!this.props.enableMapBox || !this.state.models[repId]?.bModelRealignModeHorizontal || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded}
            title="Latitude"
            min={-90}
            max={90}
            labelDecimalPlaces={10}
            value={this.state.models[repId]?.latitude || 0}
            onChange={(event, newValue) =>
              isClusterUi
                ? this.handleChangeLatitudeByCluster(event, newValue, modelIds, repId)
                : this.handleChangeLatitudeByModel(event, newValue, repId)
            }
            step={this.lnglatstep}
            label={this.state.models[repId]?.latitude || 0}
            showValue={true}
            tooltipText={TooltipStore.GisRealignLatitude}
          />
        </div>
        {this.state.models[repId]?.bModelRealignModeHorizontal && (
          <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '10px' }}>
            <IafGeoCoder
              map={this.props?.iafViewer?.iafMapBoxGl?.map}
              zoom={this.state.zoom}
              iafViewer={this.props?.iafViewer}
              onLocationSelect={async (location) => {
                if (!location.geometry || !location.geometry.coordinates) {
                  IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.IafGeoCoder.onLocationSelect', location);
                  return;
                }
                const [lng, lat] = location.geometry.coordinates;
                if (isClusterUi) {
                  await this.setFederatedModelLocationCluster(lng, lat, modelIds, repId);
                } else {
                  await this.setFederatedModelLocation(lng, lat, repId);
                }
                IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | IafGis.IafGeoCoder.onLocationSelect', location);
              }}
            />
          </div>
        )}
        <IafSwitch
          disabled={
            !this.state.models?.[repId]?.bShowModel
            || mrep('bModelRealignModeHorizontal')
            || !this.primaryModelId
            || !this.props.enableMapBox
            || !this.iafViewer.state.gis.isLoaded 
            || !this.iafViewer.state.view3d.isLoaded 
            || !this.iafViewer.state.view2d.isLoaded
            || !this.iafViewer.state.gis.enable
            || !this.state.isElevationModeUpdated
            || !this.state.isFederatedModeUpdated
            || !this.state.isReferenceModelUpdated
          }
          title="Vertical Alignment (3D)"
          isChecked={mrep('bModelRealignModeVertical') || false}
          onChange={(event) =>
            isClusterUi
              ? this.handleToggleModelRealignVerticalCluster(event, modelIds, repId)
              : this.handleToggleModelRealignVertical(event, repId)
          }
        />
        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '10px' }}>
          <IafSlider
            disabled={!this.iafViewer.props.view3d.enable 
              || !this.iafViewer.state.gis.enable 
              || !this.props.enableMapBox 
              || !this.primaryModelId 
              || !this.state.models[repId]?.bModelRealignModeVertical 
              || !this.iafViewer.state.gis.isLoaded 
              || !this.iafViewer.state.view3d.isLoaded 
              || !this.iafViewer.state.view2d.isLoaded
            }
            title={`Terrain Height (${IafMathUtils.getDisplayUnits(this.iafViewer)})`}
            min={this.minTerrainHeight}
            max={this.maxTerrainHeight}
            value={this.state.models[repId]?.terrainHeight || 0}
            onChange={(event, newValue) =>
              isClusterUi
                ? this.handleTerrainHeightByCluster(event, newValue, modelIds, repId)
                : this.handleTerrainHeightByModel(event, newValue, repId)
            }
            step={this.terrainHeightStep}
            label={this.state.models[repId]?.terrainHeight || 0}
          />
        </div>
        {this.iafViewer?.iafGltfManager?.gltfModelMap?.get(repId)?.placeholder && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', paddingBottom: '10px' }}>
            <IafButton
              disabled={
                !this.props.enableMapBox
                || !this.iafViewer.state.gis.isLoaded
                || !this.iafViewer.state.view3d.isLoaded
                || !this.iafViewer.state.view2d.isLoaded
                || !this.iafViewer.iafGltfManager
              }
              title="Load Outline Model"
              width="100%"
              onClick={() => this.handleLoadGltfFileForPlaceholder(repId)}
            />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <IafButton
            disabled={!this.props.enableMapBox || (!this.state.models[repId]?.bModelRealignModeHorizontal && !this.state.models[repId]?.bModelRealignModeVertical) || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded}
            title="Reset"
            width="100%"
            onClick={() => {
              const row = this.state.models[repId];
              const horizontalReset = !!(row?.bModelRealignModeHorizontal || (repId === this.primaryModelId && this.state.bModelRealignModeHorizontal));
              const verticalReset = !!(row?.bModelRealignModeVertical || (repId === this.primaryModelId && this.state.bModelRealignModeVertical));
              return isClusterUi
                ? this.handleResetRealignmentCluster(modelIds, repId)
                : this.handleResetRealignment(repId, { horizontalReset, verticalReset });
            }}
          />
        </div>
      </IafSubHeader>
    );
  }

  renderFederatedModelSettings() {
    const groups = this.getGisClusterGroupsForUi();
    return (
      <div>
        {groups.map((g) => {
          const resource = this.findResourceByModelId(g.representativeId);
          if (!resource) {
            return <React.Fragment key={g.representativeId} />;
          }
          return (
            <React.Fragment key={g.representativeId}>
              {this.renderModelSettings(resource, {
                modelIds: g.cluster,
                representativeId: g.representativeId,
                displayTitle: g.displayTitle
              })}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  render() {
    const {resourcePermissions} = this.iafViewer.state;

    const federatedControlsDisabled =
      !this.props.enableMapBox ||
      this.state.bModelRealignModeHorizontal ||
      !this.iafViewer.state.gis.isLoaded ||
      !this.iafViewer.state.view3d.isLoaded ||
      !this.iafViewer.state.view2d.isLoaded ||
      !this.state.isElevationModeUpdated ||
      !this.state.isFederatedModeUpdated ||
      !this.state.isReferenceModelUpdated;

    const referenceModelDropdownDisabled =
      federatedControlsDisabled || !this.iafViewer?.props?.view3d?.enable;

    const resolvedPrimaryModelIdForDynamicRenderingSliders =
      this.primaryModelId ??
      this.getIafViewerState()?.primaryModelId ??
      this.props.gis?.primaryModelId ??
      this.iafViewer.props.graphicsResources?.dbModel?._id;
    const gisFocusedModelId = this.state.expandedModelPanelId;
    const isNonPrimaryModelFocusedInGisUi =
      gisFocusedModelId != null &&
      gisFocusedModelId !== resolvedPrimaryModelIdForDynamicRenderingSliders;

    const dynamicRenderingTuningDisabled =
      federatedControlsDisabled ||
      (this.getIafViewerState()?.federatedMode ?? GisFederatedMode.None) !==
        GisFederatedMode.Dynamic ||
      isNonPrimaryModelFocusedInGisUi;

    // return (<div></div>);
    // ATK: PLG-1502: GIS 2.0 - Review the GIS Properties - enable and showToolbar
    // To be uncommented when the GIS 2.0 is fully implmeneted as properties
    // if (!this.iafViewer.state.gis?.showToolbar) {
    //   return null;
    // }
    // END ATK: PLG-1502: GIS 2.0 - Review the GIS Properties - enable and showToolbar

    return (
      <div>
        <IafHeading
            title={this.props.title}
            showContent={this.props.showContent}
            showContentMethod={this.props.showContentMethod}
            onClose={this.panelClose.bind(this)}
            color={this.props.color}
            canAccess={
                resourcePermissions?.[RESOURCE_TYPES.GIS]?.canRead
            }
        >
          <div>

          { this.props.iafViewer.props.gis?.showLauncher && <IafSubHeader>
              <IafSwitch
                    title="Enable GIS"
                    disabled={
                      !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded
                      || !this.state.token
                      // Disable if any model is in unlock mode (2D or 3D)
                      || Object.values(this.state.models || {}).some(model => model.bModelRealignModeHorizontal || model.bModelRealignModeVertical)
                    }
                    isChecked={this.props.enableMapBox}
                    onChange={this.toggleGis}
              />
            </IafSubHeader> }
            <IafSubHeader title="Interact" minimized={true}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IafSlider  
                  disabled={
                    !this.props.enableMapBox || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded
                    || this.state.bModelRealignModeHorizontal 
                    || !this.state.isElevationModeUpdated
                    || !this.state.isFederatedModeUpdated
                    || !this.state.isReferenceModelUpdated
                  }
                  title="Zoom"
                  min={this.minZoom}
                  max={this.maxZoom}
                  value={this.state.zoom }
                  onChange={this.handleChangeZoom.bind(this)}
                  step={this.zoomStep}
                ></IafSlider>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IafSlider
                  disabled={
                    !this.props.enableMapBox || this.state.bModelRealignModeHorizontal || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded
                    || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded
                    || !this.state.isElevationModeUpdated
                    || !this.state.isFederatedModeUpdated
                    || !this.state.isReferenceModelUpdated
                  }
                  title="Pitch"
                  min={this.minPitch}
                  max={this.maxPitch}
                  value={this.state.pitch }
                  onChange={this.handleChangePitch.bind(this)}
                  step={1}
                ></IafSlider>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IafSlider
                  disabled={
                    !this.props.enableMapBox || this.state.bModelRealignModeHorizontal || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded
                    || !this.state.isElevationModeUpdated
                    || !this.state.isFederatedModeUpdated
                    || !this.state.isReferenceModelUpdated
                  }
                  title="Bearing"
                  min={this.minBearing}
                  max={this.maxBearing}
                  value={this.state.uiBearing }
                  onChange={this.handleChangeBearing.bind(this)}
                  step={1}
                ></IafSlider>
              </div>
            </IafSubHeader>

            <IafSubHeader title="Appearance" minimized={true}
                // canAccess={
                //    resourcePermissions?.[RESOURCE_TYPES.GIS]?.canWrite
                // }
            >
              <IafDropdown
                showTitle={true}
                title="Style"
                disabled={
                  !this.props.enableMapBox || this.state.bModelRealignModeHorizontal || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded
                  || !this.state.isElevationModeUpdated
                  || !this.state.isFederatedModeUpdated
                  || !this.state.isReferenceModelUpdated
                }
                value={this.state.prevMapStyle}
                onChange={this.handleStyle.bind(this)}
                data={this.mapStyles}
                canAccess={
                  resourcePermissions?.[RESOURCE_TYPES.GIS]?.canWrite
                }
              ></IafDropdown>
              {
                this.iafViewer.state.isGltfViewEnabled && (
                  <IafDropdown
                    showTitle={true}
                    title="Layer"
                    disabled={
                      !this.props.enableMapBox || this.state.bModelRealignModeHorizontal || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded
                      || !this.state.isElevationModeUpdated
                      || !this.state.isFederatedModeUpdated
                      || !this.state.isReferenceModelUpdated
                    }
                    value={this.state.prevMapLayer}
                    onChange={this.handleLayer.bind(this)}
                    data={this.mapLayers}
                  ></IafDropdown>
                )
              }
              <IafDropdown
                showTitle={true}
                title={"Elevation Mode"}
                disabled={
                  !this.primaryModelId || !this.props.enableMapBox || this.state.bModelRealignModeHorizontal || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded
                  || !this.state.isElevationModeUpdated
                  || !this.state.isFederatedModeUpdated
                  || !this.state.isReferenceModelUpdated
                }
                value={this.getIafViewerState()?.elevationMode ?? GisElevationMode.None}
                onChange={this.handleElevationMode.bind(this)}
                data={this.elevationModes}
              ></IafDropdown>

              <IafSwitch
                  disabled={
                    !this.props.enableMapBox || this.state.bModelRealignModeHorizontal
                    || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded
                    || !this.state.isElevationModeUpdated
                    || !this.state.isFederatedModeUpdated
                    || !this.state.isReferenceModelUpdated
                  }
                  title={"Model Titles"}
                  isChecked={this.state.showModelTitles ?? true}
                  onChange={(event) => {
                    this.setState({ showModelTitles: event.target.checked }, () => {
                      // Refresh markers to update titles/names display
                      if (this.iafViewer?.iafMapBoxGl?.markers) {
                        this.iafViewer.iafMapBoxGl.markers.refreshSourceData();
                      }
                    });
                  }}
              />
              <IafSwitch
                  disabled={
                    !this.props.enableMapBox || this.state.bModelRealignModeHorizontal
                    || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded
                    || !this.state.isElevationModeUpdated
                    || !this.state.isFederatedModeUpdated
                    || !this.state.isReferenceModelUpdated
                  }
                  title={"Globe View"}
                  isChecked={this.state.isGlobeView}
                  onChange={this.handleToggleViewMode.bind(this)}
              />
              <IafSwitch
                  disabled={
                    !this.props.enableMapBox || this.state.bModelRealignModeHorizontal
                    || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded
                    || !this.state.isElevationModeUpdated
                    || !this.state.isFederatedModeUpdated
                    || !this.state.isReferenceModelUpdated
                  }
                  title={"Show Markers"}
                  isChecked={this.iafViewer?.state.gis?.showMapMarkers}
                  onChange={this.handleShowMapMarkers.bind(this)}
              />

              {/* <IafSwitch
                  disabled={!this.props.enableMapBox || this.state.bModelRealignModeHorizontal}
                  title={"Navigation"}
                  isChecked={this.state.isNavigation}
                  onChange={this.handleToggleNavigation.bind(this)}
              /> */}

            </IafSubHeader>

            {(
              <IafSubHeader title="Federated" minimized={true}>
                {
                  (
                    <IafDropdown
                      showTitle={true}
                      title={"Federated Mode"}
                      disabled={federatedControlsDisabled}
                      value={this.getIafViewerState()?.federatedMode ?? GisFederatedMode.None}
                      onChange={this.handleFederatedModeChange ? this.handleFederatedModeChange.bind(this) : undefined}
                      data={this.getFederatedModeDropdownData()}
                    ></IafDropdown>
                  )
                }
                {
                  (
                    <IafDropdown
                      showTitle={true}
                      title={"Reference Model"}
                      disabled={referenceModelDropdownDisabled}
                      value={this.primaryModelId ?? ""}
                      onChange={this.handlePrimaryModelChange ? this.handlePrimaryModelChange.bind(this) : undefined}
                      data={this.getReferenceModelDropdownData()}
                    ></IafDropdown>
                  )
                }
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <IafSlider
                    disabled={dynamicRenderingTuningDisabled}
                    title="Rendering Distance In Meters"
                    min={500}
                    max={5000}
                    step={50}
                    id="dynamicRenderingDistance"
                    value={this.iafViewer.state.gis?.dynamicRenderingDistance ?? 750}
                    label={this.iafViewer.state.gis?.dynamicRenderingDistance ?? 750}
                    name="dynamicRenderingDistance"
                    onChange={this.handleGisRenderingDistanceChange}
                    showValue={true}
                    tooltipText={TooltipStore.Empty}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <IafSlider
                    disabled={dynamicRenderingTuningDisabled}
                    title="Rendering Zoom Level"
                    min={10}
                    max={20}
                    step={0.1}
                    id="dynamicRenderingZoom"
                    value={this.iafViewer.state.gis?.dynamicRenderingZoom ?? 14}
                    label={this.iafViewer.state.gis?.dynamicRenderingZoom ?? 14}
                    name="dynamicRenderingZoom"
                    onChange={this.handleGisRenderingZoomChange}
                    showValue={true}
                    tooltipText={TooltipStore.Empty}
                  />
                </div>
              </IafSubHeader>
            )}
            {/* <IafSubHeader title="Elevation" minimized={true}>
              <IafDropdown
                showTitle={true}
                title={"Mode"}
                disabled={!this.props.enableMapBox || this.state.bModelRealignModeHorizontal || !this.iafViewer.state.gis.isLoaded || !this.iafViewer.state.view3d.isLoaded || !this.iafViewer.state.view2d.isLoaded}
                value={this.getIafViewerState()?.elevationMode}
                onChange={this.handleElevationMode.bind(this)}
                data={this.elevationModes}
              ></IafDropdown>
            </IafSubHeader> */}

            {/* {this.renderModelSettings(this.iafViewer.props.graphicsResources)}  */}
            {this.renderFederatedModelSettings()}

          </div>
        </IafHeading>
      </div>
    );
  }
  // ------------------------------------------------------------------------------------------------------------------------
  // END OF React Render functions
  // ------------------------------------------------------------------------------------------------------------------------

/**
 * Test bounding boxes - simple method to see where models appear on screen
 */
testBoundingBoxes(modelId = null) {
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | ReactGis.testBoundingBoxes', 'Testing bounding boxes for:', modelId);
    
    if (!this.iafViewer.iafTuner) {
        console.warn('IafViewer.EVMMode.Mapbox | ReactGis.testBoundingBoxes IafTuner not available');
        return;
    }

    // Use the provided modelId or get the first available model
    const targetModelId = modelId || Object.keys(this.state.models || {})[0];
    
    if (!targetModelId) {
        console.warn('IafViewer.EVMMode.Mapbox | No model available for bounding box test');
        return;
    }

    // Get individual bounding boxes
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | \n🔍 ReactGis.testBoundingBoxes Getting individual bounding boxes...');
    const gltfBounds = this.iafViewer.iafTuner.getGltfScreenBoundingBox(targetModelId);
    const commBounds = this.iafViewer.iafTuner.getCommunicatorScreenBoundingBox();
    
    // Compare them
    IafUtils.devToolsIaf && console.log('IafViewer.EVMMode.Mapbox | \n📊 ReactGis.testBoundingBoxes Comparing bounding boxes...');
    const comparison = this.iafViewer.iafTuner.compareBoundingBoxes(targetModelId);
    
    return {
        gltf: gltfBounds,
        communicator: commBounds,
        comparison: comparison
    };
}
}
