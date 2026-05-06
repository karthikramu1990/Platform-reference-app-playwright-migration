// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 06-01-23    ATK        PLAT-2709   New UX UI Foundation Project
//                                    Code Restructuring.
// 22-Oct-23   ATK        PLAT-2414   Performance - CSDL - On Demand
// 04-Nov-23   ATK        PLAT-3583   Model Composition 3D - Linked Files
// 10-Nov-23   ATK        PLAT-3584   Model Composition 3D - Layers
// 01-Dec-23   ATK        PLAT-3647   Notification Store
// 30-Dec-23   ATK        PLAT-3844   On demand loading of linked models should update bounding box for consumers such as cutting planes
// 02-Jan-23   ATK        PLAT-3855   On demand loading of linked models - Hidden Elements
// 02-Jan-23   ATK        PLAT-3856   On demand loading of linked models - BIM_Space Elements
// 16-01-24    ATK        PLAT-4033   Performant load options for Linked Models / 3D Views         
// 14-03-24    ATK                    Perf Testing | Added IafUtils.perfStatIaf()
// 04-05-24    ATK        PLAT-4549   Inconsistencies around what you see, Promise.all caused layer setup mess for multiple views
// -------------------------------------------------------------------------------------

import { logLayers } from "../common/Layers.js"
import IafUtils, { IafStorageUtils } from "../core/IafUtils.js";
import IafModelTree from "../common/modeltree";
import { pushSpinnerStatus, popSpinnerStatus, EnumSpinnerStatus } from "../ui/component-low/IafSpinner/IafSpinner.jsx"
import iafLogNodes from "../common/nodes";
import { NotificationStore } from "../store/notificationStore";
import { GraphicsDbGeomViews } from "../core/database.js";
import IafGraphicsResourceManager from "../core/IafGraphicsResourceManager.js";
import IafViewer from "../IafViewer.jsx";
import { IafApiClientMarkup } from "../core/database/IafDatabaseManager.js";
import { IafPerfLogger } from "../core/IafUtils.js"
import { processLinkedModelsByCamera } from "../core/camera.js";
import { IafMathUtils } from "../core/IafMathUtils.js";
import { IafDrawMode } from "../common/IafDrawMode.js";
import { logTime } from "./logTime.js";
import { GisFederatedMode } from "../common/enums/gis.js";
import { generateModelComposerBenchmark } from "../core/database/unittests/modelComposer.test.js";
import { attachViewerDevTools } from "./viewerDevTools.js"

export const iafModelCompositionReady = async (
  /** @type {IafViewer} */
  iafViewer,
  firstLoad = false
) => {
  IafUtils.devToolsIaf && console.log(`[${logTime()}]`, "IafViewer.callbacks.modelCompositionReady");
  // TODO: need to check why this code atul.
  // if (iafViewer.props.gis?.enable != iafViewer.state.gis?.enable) 
  {
    iafViewer.setState({gis: {
      ...iafViewer.state.gis,
      enable: iafViewer.state.gis?.enable
    }
  });

    // Update ReactGis component state instead of calling updatePrimaryModel directly
    // This allows componentDidUpdate to react to state changes and call updatePrimaryModel
    if (iafViewer.state.gis?.enable && iafViewer?.gisInstance) {
      const gisInstance = iafViewer.gisInstance;
      
      // Initialize models if empty
      if (!gisInstance.state.models || Object.keys(gisInstance.state.models).length === 0) {
        const initializedModels = gisInstance.initializeModelStates();
        gisInstance.setState({
          models: initializedModels
        });
      }
      
      // ATK PLG-1585: Update primaryModelId if needed
      // Prefer selectedModel (from props.model) as the source of truth, then fall back to other sources
      // selectedModel is passed from IafViewerDBM as the model prop, so props.model._id should match selectedModel._id
      const currentPrimaryModelId = iafViewer.state.gis?.primaryModelId 
                                    ?? iafViewer.props?.model?._id  // Prefer selectedModel from props (source of truth)
                                    ?? iafViewer.props.graphicsResources?.dbModel?._id
                                    ?? gisInstance.primaryModelId;
                                    
      // if (currentPrimaryModelId && currentPrimaryModelId !== gisInstance.primaryModelId) {
        gisInstance.primaryModelId = currentPrimaryModelId;
        iafViewer.setState({
          gis: {
            ...iafViewer.state.gis,
            primaryModelId: currentPrimaryModelId,
            federatedMode: firstLoad ? GisFederatedMode.Outline : iafViewer.state.gis?.federatedMode
          }
        });
        await gisInstance.updatePrimaryModel();
        if (firstLoad) await gisInstance.resetAll();
        // gisInstance.primaryModelId = currentPrimaryModelId;
        // // Trigger state update to cause componentDidUpdate to detect the change
        // gisInstance.setState(prevState => ({
        //   models: { ...prevState.models }
        // }));
      // }
      if (iafViewer.props.OnModelCompositionReadyCallback) {
        iafViewer.props.OnModelCompositionReadyCallback('3d', firstLoad);
      }    
    }
    iafViewer.setState({view3d: { ...iafViewer.state.view3d, isLoaded: true }}, () => {
      iafViewer.logLoadStatus('iafModelCompositionReady');
      iafViewer.props.graphicsResources?.updateBoundingBox('iafModelCompositionReady');
    });
  }
}

const iafCallbackModelStructureReady = async (
    /** @type {IafViewer} */
    iafViewer
  ) => {  
    IafUtils.devToolsIaf && console.log(`[${logTime()}]`, "IafViewer.callbacks.modelStructureReady");
    IafUtils.debugIaf && iafLogNodes(iafViewer._viewer.model);
    
    /* RRP:- PLG-1359 Ensure the model's front and up axes are normalized before any camera or translation logic.
       This prevents orientation flips when some models load with a negative Y front vector. */
    normalizeModelViewAxes(iafViewer._viewer);

    // ATK - Perf Testing | Added IafUtils.perfStatIafEnabled()
    IafUtils.perfStatIaf && iafViewer._viewer.view.setStatisticsDisplayVisibility(true);

    // iafViewer.props.graphicsResources.loadViews3d();
    iafViewer._viewer.view.setProjectionMode(
      Communicator.Projection.Perspective
    );   

    // ATK | PLAT-3844 | On demand loading of linked models should update bounding box for consumers such as cutting planes
    // iafViewer.modelBounding = await iafViewer._viewer.model.getModelBounding(
    //     false,
    //     false
    //     );
    // iafViewer.iafCuttingPlanesUtils.setModelBounding(iafViewer.modelBounding);
    // iafViewer.iafCuttingPlanesUtils.updateCuttingPlanes(
    //   iafViewer.modelBounding.min.z,
    //   iafViewer.modelBounding.min.z,
    //   iafViewer.modelBounding.min.x,
    //   iafViewer.modelBounding.min.x,
    //   iafViewer.modelBounding.min.y,
    //   iafViewer.modelBounding.min.y
    // );
    iafViewer._viewer.model.setBehaviorInitiallyHidden(false);

    if (iafViewer.zoomOperator != undefined) iafViewer.zoomOperator.initialise();

    //when settings are persisted in data source, we can load them
    if (iafViewer.props.settings) {
      iafViewer.loadSettings(iafViewer.props.settings, false, true); // Added new key to check we wanted to change the camera position or not on Saving
    }
      
    // Hidden Elements
    let hiddenIds = [];

    if (!iafViewer.props.graphicsResources.csdlEnabled) {// ATK | PLAT-3855 | On demand loading of linked models - Hidden Elements
      hiddenIds = await iafViewer.props.graphicsResources.getNodeIds(
        iafViewer.props.hiddenElementIds,
        iafViewer.props.idMapping[1]
      );
      if (_.size(hiddenIds) > 0) {
        await iafViewer.setNodesVisibility(iafViewer._viewer, hiddenIds, false);
      }
      iafViewer._viewer.hiddenIds = hiddenIds;
    }

    if (IafUtils.debugIaf && !iafViewer.modelTree) {
      iafViewer.modelTree = new IafModelTree(iafViewer);
    }

    //cutting Plane floor showing
    //iafViewer.iafCuttingPlanesUtils.addCuttingPlanes(6645, -9945, -22000, -5050, -82050, -2050)
    //array

    // // Space Elements
    if (!iafViewer.props.graphicsResources.csdlEnabled) {// ATK | PLAT-3855 | On demand loading of linked models - BIM Space Elements
      iafViewer.SpaceElementSet = await iafViewer.getNodesByGenericType(iafViewer._viewer, "BIM_Space");

      // ATK | PLAT-3855 | On demand loading of linked models - Space Elements
      // set -> array
      let SpaceElementArray = [];
      if (iafViewer.SpaceElementSet !== null) {
        SpaceElementArray = Array.from(iafViewer.SpaceElementSet);
      }
      // passing hole array of spaces insted of single space element
      await iafViewer._viewer.model.setInstanceModifier(
        Communicator.InstanceModifier.OverrideSceneVisibility,
        SpaceElementArray,
        true
      );
    }

    if(iafViewer.props.enableOptimizedSelection){
      await iafViewer.resetThemeandSelection(iafViewer._viewer);
    }
    IafUtils.debugIaf && iafViewer.modelTree.rebuild();
    
    // PLG-1315: Since payload size is large, we are loading the graphics cache from the database only if persistence is enabled.
    // if(iafViewer?.iafDatabaseManager?._enablePersistence){
    //   iafViewer.props.graphicsResources.loadGraphicsCacheFromDb();
    // } else {
      IafStorageUtils.loadGraphicsCache(iafViewer);
    // }
    
    if (iafViewer.props?.view3d?.enable ) {
      //Initialise the model composition. before is modelIsLoaded.
      // RRP PLG-1315 this is moved to modelStrcutureReady callback before isModelLoaded is set to true
      await iafViewer.initalizeModelComposer();
    }

    //RRP:- PLG-1725 handle corrupted initial model
    try{
      await iafViewer._viewer.graphicsResources.onModelStructureUpdate(iafViewer.props.graphicsResources.csdlMapByFilesetIndex.get(0).viewId);
    } catch (ex){
      console.warn(
        `[${logTime()}]`,
        "IafViewer.callbacks.modelStructureReady.failToLoadFederatedModel",
        ex
      );
    }
    
    // RRP:- PLG-1315 load if any category mapped to linked model.
    if(iafViewer.props.graphicsResources.isLayerlessModel()){
      iafViewer.setState({isModelLayered: false})
      await iafViewer.props.graphicsResources.handleFederatedModelFile();
      iafViewer.props.graphicsResources.toggleVisibilityOfAllCategories()
    } else {
      iafViewer.setState({isModelLayered: true})
    }
    // RRP | DBM-2299 | Navigator doesn't load for the cutting plane selections
    // This fix is to make sure modelBounding is set before the basic model structure is ready.
    // iafViewer.setModelIsLoaded(iafViewer._viewer, true) // ATK PLG-1604: Performance - Queue setNodesVisibility to avoid flicker

    // iafViewer.props.openNotification ("The model has been loaded (" + iafViewer.props.graphicsResources.views[0].title + ")");
    NotificationStore.notifyModelIsLoaded(iafViewer);

    const concurrentload = false;
    // Find and load the 3D Views (linked models) who are alwaysLoad
    if (iafViewer._viewer.graphicsResources.csdlEnabled) {

      // The very first linked model is loaded immediately
      let gfxResObjectCore = iafViewer._viewer.graphicsResources.csdlMapByFilesetIndex.get(0);
      gfxResObjectCore.loaded = true;

      const viewIds = iafViewer._viewer.graphicsResources.views.map((view, index) => index).slice(1); // Skip index 0
      const fileSetsMap = new Map();
      // Pre-fetch file sets for eligible views
      const perfLogger = new IafPerfLogger("iafCallbackModelStructureReady.readAll3dFilesets");
      await Promise.all(
        viewIds.map(async viewIndex => {
          const gfxResObject = iafViewer._viewer.graphicsResources.csdlMapByFilesetIndex.get(viewIndex);
          const loadEligibility = iafViewer._viewer.graphicsResources.isEligibleForInitialLoad(gfxResObject.viewId, IafGraphicsResourceManager.Quality.High);
          const shouldLoad = loadEligibility.eligible || loadEligibility.eligibleOnlyLoad;
          if (shouldLoad) {
            const fileSet = await iafViewer._viewer.graphicsResources.getFileSetForViewId(gfxResObject.viewId);
            fileSetsMap.set(gfxResObject.viewId, fileSet);
          }
        })
      );
      perfLogger.end()
      // Load resources using pre-fetched or dynamically created file sets
      const promises = [];
      for (let v=1; v< iafViewer._viewer.graphicsResources.views.length; v++) {
        // ATK: PLAT-4549: Inconsistencies around what you see, Promise.all caused layer setup mess for multiple views
        let gfxResObject = iafViewer._viewer.graphicsResources.csdlMapByFilesetIndex.get(v);
        const loadEligiblity = iafViewer._viewer.graphicsResources.isEligibleForInitialLoad(gfxResObject.viewId, IafGraphicsResourceManager.Quality.High);
        const shouldLoad = loadEligiblity.eligible || loadEligiblity.eligibleOnlyLoad;

        // Concurrent Approach
        if (concurrentload) {
          const fileSet = fileSetsMap.get(gfxResObject.viewId) || null;
          shouldLoad && promises.push(iafViewer._viewer.graphicsResources.loadGraphicsResourceByViewId(gfxResObject.viewId, fileSet));
        } else {
          // ATK: PLAT-4549: Inconsistencies around what you see, Promise.all caused layer setup mess for multiple views
          // Sequential Approach       
          const fileSet = fileSetsMap.get(gfxResObject.viewId) || null;
          shouldLoad && await iafViewer._viewer.graphicsResources.loadGraphicsResourceByViewId(gfxResObject.viewId, fileSet);
        }
      }

      // Wait for all graphics resources to be loaded concurrently.
      // Concurrent Approach
      concurrentload && await Promise.all(promises);// ATK: PLAT-4549: Inconsistencies around what you see, Promise.all caused layer setup mess for multiple views  
    }

    await iafViewer.iafDatabaseManager.onModelStructureReady();
    
    iafViewer.markupManager = iafViewer.buildMarkupManager();
    iafViewer.animationManager = iafViewer.buildAnimationManager();    

    if(iafViewer?.iafDatabaseManager?._enablePersistence){
      iafViewer.markupManager.load(iafViewer.iafDatabaseManager.initialData.markups);
    } else {
      IafStorageUtils.loadAnnotations(iafViewer);
    }

    // PLG-1603: Remove below block (if not required on initial load)
    // Rendering mode is applied by default (Shaded) but this overrides set by application props (renderingMode).
    if (iafViewer?._viewer) {
      const mode = iafViewer.props.view3d?.renderingMode
      const isGlass = mode === IafDrawMode.Glass;
      const scoped = iafViewer.getScopedElements();
      const hasScoped = Array.isArray(scoped) && scoped.length > 0;
      // RRP: PLG-1789 If sliceElementIds/spaceElementIds are initially set, applySliceElement will handle setting the draw mode.
      if (!hasScoped) {
          if (isGlass) {
            await iafViewer.setXrayModeSettings(iafViewer._viewer);
          }
          await iafViewer.commands.setDrawMode(
            isGlass,
            isGlass,
            isGlass ? Communicator.DrawMode.XRay : mode
          );
        }
    }

    iafViewer.setState({
      isModelStructureReady: true,
      hiddenNodeIds: hiddenIds
    }, async () => {
      /* RRP: Wait for all the linked models loaded before applying search or select in asset panel.
        forceUpdateViewerElements & isModelStructureReady will be false till all the linked resources loaded. */
      if (
        iafViewer.isElementThemingIdExists(iafViewer.props.colorGroups) ||
        iafViewer.props?.sliceElementIds?.length > 0 ||
        iafViewer.props?.selection?.length > 0 ||
        iafViewer.props?.spaceElementIds?.length > 0 ||
        iafViewer.props.hiddenElementIds
      ){
        iafViewer.forceUpdateViewerElements = true;
      }
      
      iafViewer.logLoadStatus('modelStructureReady');
      // Start keep-alive for spawn so Spawner does not kill for liveliness (e.g. when spawnDurationMode is KeepAliveApi)
      if (iafViewer.props.graphicsResources?.fileSet?._id && typeof iafViewer.props.graphicsResources.startKeepAlive === 'function') {
        iafViewer.props.graphicsResources.startKeepAlive();
      }
      await processLinkedModelsByCamera(iafViewer, iafViewer._viewer.view.getCamera());
      // HACK -
      // iafViewer.state.isModelStructureReady somehow is reset to false on createFileSet
      // Needs to be reviewed as a part of Websocket Ticket
      if (!iafViewer.props.graphicsResources.csdlEnabled // ATK PLG-1671: Regression - View3d - Non-optimized projects goes on loading forever - UI remains disabled
          || iafViewer._viewer.graphicsResources.views.length <= 1 // ATK PLG-1671: Regression - View3d - Non-optimized projects goes on loading forever - UI remains disabled
          || iafViewer.props.graphicsResources.isEveryGraphicsResourceLoaded() 
          || iafViewer.props.graphicsResources.isLayerlessModel()) {
        await iafModelCompositionReady(iafViewer, true);

        //RRP:- PLG-1710: Dev-only: expose viewer in browser console
        attachViewerDevTools(iafViewer, generateModelComposerBenchmark);
        iafViewer.props.graphicsResources.spinnerManager?.endMonitoring();
      }

  });
}

function normalizeModelViewAxes(viewer) {
    try {
        const axes = viewer.model.getViewAxes();
        if (axes.frontVector.y < 0) {
            IafUtils.devToolsIaf && console.log(
              `[${logTime()}]`,
              "IafViewer.callbacks.normalizeModelViewAxes",
              "Front vector is negative — correcting ViewAxes to +Y front, +Z up."
            );
            viewer.model.setViewAxes(
                new Communicator.Point3(0, 1, 0),
                new Communicator.Point3(0, 0, 1)
            );
        } else {
            IafUtils.devToolsIaf && console.log(
              `[${logTime()}]`,
              "IafViewer.callbacks.normalizeModelViewAxes",
              "ViewAxes are correct — no change needed."
            );
        }
    } catch (error) {
        console.error(
          `[${logTime()}]`,
          "IafViewer.callbacks.normalizeModelViewAxes",
          "Error normalizing model view axes:",
          error
        );
    }
}

export default iafCallbackModelStructureReady;