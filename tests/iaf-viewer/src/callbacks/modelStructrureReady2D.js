// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 22-Oct-23   ATK        PLAT-2414   Performance - CSDL - On Demand
// 28-Nov-23   ATK        PLAT-3585   Productise 2D Sheets CSDL. 
// 28-Nov-23   ATK        PLAT-3585   Error handling. 
// 01-Dec-23   ATK        PLAT-3647   Notification Store
// 04-Dec-23   ATK        PLAT-3646   Called IafGraphicsResourceManager.getIdMappingByIndex
// 26-Dec-23   ATK        PLAT-3832   GraphicsSvc to support dynamic streaming of linked files in a FileSet
// 14-MAR-24   ATK        PLAT-4283   Add missing Progress Spinners | Consume IafSpinner
// -------------------------------------------------------------------------------------

import _ from "lodash-es";
import iafLogNodes from '../common/nodes.js';
import { buildNodesRecursive } from '../common/nodes.js';
import {iafLoad, iafLoadAll} from '../common/Layers.js'
import IafModelTree from '../common/modeltree.js';
import { pushSpinnerStatus, popSpinnerStatus, EnumSpinnerStatus } from "../ui/component-low/IafSpinner/IafSpinner.jsx"
import IafUtils from '../core/IafUtils.js';
import { WidgetAction, WidgetMode }  from '../common/enums/widgets.js'
import { NotificationStore } from '../store/notificationStore.js';
import { IafMathUtils } from '../core/IafMathUtils.js';
import IafViewer from '../IafViewer.jsx';
import { IafStorageUtils } from "../core/IafUtils.js"
import { getCompositeFileName } from '../core/IsomorphicFileUtils.js';
import { logTime } from "./logTime.js";

// 28-Nov-23   ATK        PLAT-3585   Productise 2D Sheets CSDL. 
const getSheets = (iafViewer, info) => {
  let sheetIds = iafViewer._viewer2d.sheetManager.getSheetIds();
  let sheetNames = _.map(sheetIds, (id) => {
    return iafViewer._viewer2d.model.getNodeName(id);
  });

  IafUtils.devToolsIaf && console.log(
    `[${logTime()}]`,
    "IafViewer.callbacks.2d.getSheets",
    info ? info : "",
    "/sheetIds",
    JSON.stringify(sheetIds),
    "/sheetNames",
    JSON.stringify(sheetNames)
  );

  return { sheetIds, sheetNames };
}

// 28-Nov-23   ATK        PLAT-3585   Productise 2D Sheets CSDL. 
export const loadSheet = async (
  /** @type {IafViewer} */
  iafViewer, 
  index) => {
  let subtreeConfig = new Communicator.LoadSubtreeConfig();
  const { fileSet2d } = iafViewer.props;

  iafViewer.setState({
    isModelStructureReady2d: false,
    view2d: { ...iafViewer.state.view2d, isLoaded: false },
  }, () => {
    iafViewer.logLoadStatus('loadSheet');
  });

  let gfxResObject = iafViewer.props.graphicsResources2d.csdlMapByFilesetIndex.get(index);

  // iafViewer.setModelIsLoaded(iafViewer._viewer2d, false);// ATK PLAT-4283: Add missing Progress Spinners | Consume IafSpinner
  iafViewer.setState({
    view2d: { ...iafViewer.state.view2d, isLoaded: false },
  }, () => {
    iafViewer.logLoadStatus('loadSheet');
  });

  NotificationStore.notifyDrawingSheetIsBeingLoaded(iafViewer, index);

  if (!gfxResObject.loaded) {
    // PLAT-3832 | GraphicsSvc to support dynamic streaming of linked files in a FileSet
    // Create a fileset for that one file representing the view to be loaded
    let fileSet = await iafViewer.props.graphicsResources2d.createFileSet({ _files: [iafViewer.props.graphicsResources2d.fileSetIn[gfxResObject.index]] });

    iafViewer.props.graphicsResources2d.fileSet._files[gfxResObject.index] = fileSet._files[0];
    gfxResObject.fileName = fileSet._files[0]._fileName;

    gfxResObject.idMapping = await iafViewer.props.graphicsResources2d.getIdMappingByIndex(index);
    iafViewer.props.graphicsResources2d.csdlEnabled && iafViewer.props.graphicsResources2d.buildCsdlMap(gfxResObject);
    iafViewer.props.graphicsResources2d.csdlMapByCsdlOffset.set(gfxResObject.graphicsNodeId, gfxResObject);
    gfxResObject.loaded = true;
  }

  // iafViewer.props.openNotification ("The drawing sheet is being loaded (" + gfxResObject.graphicsNodeName + ")");
  await iafViewer._viewer2d.model.clear();
  const file = fileSet2d._files[index]
  const fileName = iafViewer.props.isSingleWsEnabled ? getCompositeFileName(file._fileName, file._fileVersionId) : file._fileName
  iafViewer._viewer2d.model
  .loadSubtreeFromModel(
    iafViewer._viewer2d.model.getAbsoluteRootNode(),
    fileName,
    subtreeConfig
  )
  .then(async (subtreeNodeIds2d) => {
    //IafUtils.devToolsIaf && console.log(nodeIds)
    //if(iafViewer.zoomOperator2d != undefined)
    //  iafViewer.zoomOperator2d.initialise();

    let { sheetIds, sheetNames } = getSheets(iafViewer, 'after loadSubtreeFromModel');

    IafUtils.devToolsIaf && console.log(
      `[${logTime()}]`,
      "IafViewer.callbacks.2d.loadSheet",
      "/subtreeNodeIds2d",
      JSON.stringify(subtreeNodeIds2d)
    );

    iafViewer.setState({
      sheetIdx: index,
      // sheetIds: sheetIds,
      // sheetNames: sheetNames,
      isModelStructureReady2d: true,
      view2d: { ...iafViewer.state.view2d, isLoaded: true },
    }, async function() {
      iafViewer.logLoadStatus('loadSheet');
      await iafViewer.selectAndSlice2DSheet()
    });
    iafViewer.modelTree.rebuild2d();
    // iafViewer.setModelIsLoaded(iafViewer._viewer2d, true)
    iafViewer.setState({
      view2d: { ...iafViewer.state.view2d, isLoaded: true },
    }, () => {
      iafViewer.logLoadStatus('loadSheet');
    });

    // PLAT-3832 | GraphicsSvc to support dynamic streaming of linked files in a FileSet
    // if (!gfxResObject.loaded) {
    //   gfxResObject.idMapping = await iafViewer.props.graphicsResources2d.getIdMappingByIndex(index);
    //   iafViewer.props.graphicsResources2d.csdlEnabled && iafViewer.props.graphicsResources2d.buildCsdlMap(gfxResObject);
    //   iafViewer.props.graphicsResources2d.csdlMapByCsdlOffset.set(gfxResObject.graphicsNodeId, gfxResObject);
    //   gfxResObject.loaded = true;        
    // }

    NotificationStore.notifyDrawingSheetIsLoaded(iafViewer, index);

    // If user is switching too much between the sheets, might be worth moving the following line
    // at the end after the sheet is fully loaded
    {
      iafViewer.setState({
        enableSheetSwitch: true,
        view2d: { ...iafViewer.state.view2d, isLoaded: true }
      }, () => {
        iafViewer.logLoadStatus('loadSheet');
      });
    }
    // iafViewer.props.openNotification ("The drawing sheet has been loaded (" + gfxResObject.graphicsNodeName + ")");
  });    
}

const iafCallbackModelStructureReady2D = async (
  /** @type {IafViewer} */
  iafViewer, 
) => {
    IafUtils.devToolsIaf && console.log(`[${logTime()}]`, "IafViewer.callbacks.2d.modelStructureReady");

    const postprocess = async () => {
      await iafViewer.iafDatabaseManager.onModelStructureReady();

      // iafViewer.measurementManager2d.applySavedMeasurement();
      iafViewer.markupManager2d = iafViewer.buildMarkupManager2d();
      // iafViewer.markupManager2d && iafViewer.markupManager2d.load();
      iafViewer.animationManager2d = iafViewer.buildAnimationManager2d();   
       
      if(iafViewer?.iafDatabaseManager?._enablePersistence){
        iafViewer.markupManager2d.load(iafViewer.iafDatabaseManager.initialData.markups);
      } else {
        IafStorageUtils.loadAnnotations(iafViewer);
      }
    }

    let camera = iafViewer._viewer2d.view.getCamera();

    iafViewer._viewer2d.iafCameraWidthInitial = camera.getWidth();
    iafViewer._viewer2d.iafCameraHeightInitial = camera.getHeight();

    iafViewer._viewer2d.model.setBehaviorInitiallyHidden(false);
    if (!iafViewer.modelTree) {
        iafViewer.modelTree = new IafModelTree(iafViewer);
    }
    if (!_.size(iafViewer.props.fileSet) > 0) iafViewer.state.viewer2DWidget.current.handleWidgetAction(WidgetAction.MAXIMIZE, WidgetMode.FULLSCREEN);

    // let { sheetIds, sheetNames } = getSheets(iafViewer, 'before loadSubtreeFromModel');
    if (iafViewer.props.graphicsResources2d.csdlEnabled) {
      let { sheetIds, sheetNames } = iafViewer.props.graphicsResources2d.getSheets();

      iafViewer.setState({
        sheetIdx: 0,
        sheetIds: sheetIds,
        sheetNames: sheetNames,
        isModelStructureReady2d: true,
        view2d: { ...iafViewer.state.view2d, isLoaded: true },
      },async function(){
        iafViewer.logLoadStatus('modelStructureReady2D');
        // Start keep-alive for 2D (isAlive set inside startKeepAlive)
        if (iafViewer.props.graphicsResources2d?.fileSet?._id && typeof iafViewer.props.graphicsResources2d.startKeepAlive === 'function') {
          iafViewer.props.graphicsResources2d.startKeepAlive();
        }
        if(iafViewer.props.enableOptimizedSelection){
          await iafViewer.resetThemeandSelection(iafViewer._viewer2d);
          await iafViewer.selectAndSlice2DSheet()
          iafViewer.forceUpdate2DViewerElements = true
        }
        IafUtils.debugIaf && iafViewer.modelTree.rebuild2d();
        // iafViewer.setModelIsLoaded(iafViewer._viewer2d, true); // ATK PLAT-4283: Add missing Progress Spinners | Consume IafSpinner
        iafViewer.setState({
          view2d: { ...iafViewer.state.view2d, isLoaded: true },
        }, () => {
          iafViewer.logLoadStatus('modelStructureReady2D');
        });
        // for (let i=0;i<2; i++) {
        //   await IafUtils.sleep(5000 * i);
        //   loadSheet(iafViewer, i);
        // }  
        // iafViewer.props.openNotification ("The drawings sheet (" 
        //   + iafViewer.props.graphicsResources2d.views[0].title 
        //   + ") has been loaded");

        NotificationStore.notifyDrawingSheetIsLoaded(iafViewer, 0)
        postprocess();
        this.props.graphicsResources2d.initKeepAlive();
      });
      } else {
      // iafViewer.props.openNotification ("The drawings sheets are being loaded");

      let subtreeConfig = new Communicator.LoadSubtreeConfig();
      const { fileSet2d } = iafViewer.props;
      const file = fileSet2d._files[0]
      const fileName = iafViewer.props.isSingleWsEnabled ? getCompositeFileName(file._fileName, file._fileVersionId) : file._fileName
      iafViewer._viewer2d.model
      .loadSubtreeFromModel(
        iafViewer._viewer2d.model.getAbsoluteRootNode(),
        fileName,
        subtreeConfig
      )
      .then(async (nodeIds) => {
        //IafUtils.devToolsIaf && console.log(nodeIds)
        //if(iafViewer.zoomOperator2d != undefined)
        //  iafViewer.zoomOperator2d.initialise();
  
        let sheetIds = iafViewer._viewer2d.sheetManager.getSheetIds();
        let sheetNames = _.map(sheetIds, (id) => {
          return iafViewer._viewer2d.model.getNodeName(id);
        });
        IafUtils.devToolsIaf && console.log(
          `[${logTime()}]`,
          "IafViewer.callbacks.2d.modelStructureReady",
          "/sheetIds",
          sheetIds
        );
        iafViewer.setState({
          sheetIdx: 0,
          sheetIds: sheetIds,
          sheetNames: sheetNames,
          isModelStructureReady2d: true,
          view2d: { ...iafViewer.state.view2d, isLoaded: true },
        }, async function(){
          iafViewer.logLoadStatus('modelStructureReady2D');
          // Start keep-alive for 2D (isAlive set inside startKeepAlive)
          if (iafViewer.props.graphicsResources2d?.fileSet?._id && typeof iafViewer.props.graphicsResources2d.startKeepAlive === 'function') {
            iafViewer.props.graphicsResources2d.startKeepAlive();
          }
          if(iafViewer.props.enableOptimizedSelection){
            await iafViewer.resetThemeandSelection(iafViewer._viewer2d);
            await iafViewer.selectAndSlice2DSheet()
            iafViewer.forceUpdate2DViewerElements = true
          }
          IafUtils.debugIaf && iafViewer.modelTree.rebuild2d();
          // iafViewer.setModelIsLoaded(iafViewer._viewer2d, true); // ATK PLAT-4283: Add missing Progress Spinners | Consume IafSpinner
          iafViewer.setState({
            view2d: { ...iafViewer.state.view2d, isLoaded: true },
          }, () => {
            iafViewer.logLoadStatus('modelStructureReady2D');
          });

          // iafViewer.props.openNotification ("The drawings sheets " 
          //   + "(" + sheetIds.length + ") "       
          //   + "have been loaded" 
          // );
          NotificationStore.notifyDrawingSheetsAreLoaded(iafViewer);
          postprocess();
        });
        iafViewer.props.graphicsResources2d.initKeepAlive();
      });
    }
    // PLG-1064 Multiple times (2 times) 2d markup are loading after refresh.
    // await iafViewer.iafDatabaseManager.onModelStructureReady();
    // iafViewer.markupManager2d = iafViewer.buildMarkupManager2d();
    // iafViewer.markupManager2d.load(iafViewer.iafDatabaseManager.initialData.markups);
}

const iafCallbackModelStructureReady2DTrash = async (iafViewer) => {
  IafUtils.devToolsIaf && console.log(
    `[${logTime()}]`,
    "IafViewer.callbacks.2d.modelStructureReadyTrash"
  );
  const { fileSet2d } = iafViewer.props;
  iafViewer._viewer2d.model.setBehaviorInitiallyHidden(false);
  let subtreeConfig = new Communicator.LoadSubtreeConfig();
  if (!iafViewer.modelTree) {
      iafViewer.modelTree = new IafModelTree(iafViewer);
  }
  if (!iafViewer.props.fileSet) iafViewer.handleMax2d();
  iafViewer._viewer2d.model
    .loadSubtreeFromModel(
      iafViewer._viewer2d.model.getAbsoluteRootNode(),
      fileSet2d._files[0]._fileName,
      subtreeConfig
    )
    .then(async (nodeIds) => {
      //IafUtils.devToolsIaf && console.log(nodeIds)
      //if(iafViewer.zoomOperator2d != undefined)
      //  iafViewer.zoomOperator2d.initialise();

      let sheetIds = iafViewer._viewer2d.sheetManager.getSheetIds();
      let sheetNames = _.map(sheetIds, (id) => {
        return iafViewer._viewer2d.model.getNodeName(id);
      });
      IafUtils.devToolsIaf && console.log(
        `[${logTime()}]`,
        "IafViewer.callbacks.2d.modelStructureReadyTrash",
        "/sheetIds",
        sheetIds
      );
      iafViewer.setState({
        sheetIdx: 0,
        sheetIds: sheetIds,
        sheetNames: sheetNames,
        isModelStructureReady2d: true,
        view2d: { ...iafViewer.state.view2d, isLoaded: true },
      });
      iafViewer.modelTree.rebuild2d();
      // iafViewer.setModelIsLoaded(iafViewer._viewer2d, true)
      iafViewer.setState({
        view2d: { ...iafViewer.state.view2d, isLoaded: true },
      }, () => {
        iafViewer.logLoadStatus('modelStructureReady2DTrash');
      });
    });  
}

export default iafCallbackModelStructureReady2D;