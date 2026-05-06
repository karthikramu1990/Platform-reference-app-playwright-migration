// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 08-12-23    HSK        PLAT-3793   IafViewer DevTools - Camera Callback Panel under IafUtils.debugIaf
// 19-01-24    HSK        PLAT-3446   Define and demonstrate reusable Measurement Json Object (3d and 2d)
// 22-01-24    ATK        PLAT-4074   Dev Tools | 3D Views (Linked Models) by Camera
// 22-01-24    ATK        PLAT-4074   Dev Tools | Aggregated Model Bounding Boxes
// 22-01-24    ATK        PLAT-4074   Dev Tools | Model Units
// 28-01-24    ATK        PLAT-4074   Dev Tools | Highlight Active Views
//                                    Dev Tools | Aggregated Model Bounding Boxes
// 31-01-24    HSK        PLAT-4097   Add generic(low level) components IafInputNumber and IafInputPoint3D and IafPoint3D
// 29-Mar-24   RRP        PLAT-3844   On demand loading of linked models should update bounding box
// 01-04-24    HSK        PLAT-4428   Implemented when one child is preset in panel and if we hit close button it will close and not minimize.
// 20-Jun-24   ATK        PLAT-3422   Moved Unit Tests to Dev Tools
// -------------------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { IafHeading } from "../../component-low/iafHeading/IafHeading.jsx";
import { IafSubHeader } from "../../component-low/iafSubHeader/IafSubHeader.jsx";
import { IafSwitch } from "../../component-low/iafSwitch/IafSwitch.jsx";
import { IafSlider } from "../../component-low/iafSlider/IafSlider.jsx";
import styles from "./DevToolsPanel.module.scss";
import IafList from "../../component-low/iafList/IafList.jsx";
// import { disabledLinkedModelItems, linkedModelEventHandler, linkedModelItems, linkedModelItemsFromGraphicsResources, linkedModelRenameEventHandler } from "../../../common/LinkedModels.js";
import { IafListUtils } from "../../component-low/iafList/IafListUtils.js";
import IafUtils, { IafMapUtils, IafPerfLogger, IafStorageUtils } from "../../../core/IafUtils.js";
import TooltipStore from "../../../store/tooltipStore.js";
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
// import { getModelUnits } from "../../../callbacks/modelStructureReady.js";
import { IafMathUtils } from "../../../core/IafMathUtils.js";
import { getCameraFOV, processLinkedModelsByCamera, renderCameraVector } from "../../../core/camera.js";
import { IafPoint3d } from "../../component-low/iafPoint3d/IafPoint3d.jsx";
import { IafInputNumber } from "../../component-low/iafInputNumber/IafInputNumber.jsx";
import { IafDropdown } from "../../component-low/iafDropdown/IafDropdown.jsx";
import { IafInputPoint3d } from "../../component-low/iafInputPoint3d/IafInputPoint3d.jsx";
import { clearBoundingBox, createBoundingBox } from "../../../core/markups/IafBoundingBoxMarkup.js";
import { NotificationStore } from "../../../store/notificationStore.js";
import IafImportJson from "../../component-low/iafImportJson/IafImportJson.jsx";
import { GisButtons } from "./GisButton.jsx";
import { dbUnitTestsMarkupsMultipleUpdates, dbUnitTestsMarkupsSequential, dbUnitTestsMarkupsSequential2 } from "../../../core/database/unittests/annotations.js";
import GraphicsResourcesCache from "./GraphicsCache.jsx";
import { dbUnitTestsModelComposerSequential } from "../../../core/database/unittests/modelComposition.js";
import { useModelContext } from '../../../IafContextApi.js';
import { dbUnitTestsGisSequential } from "../../../core/database/unittests/gis.js";
import { dbUnitTestsOperationalCacheSequential } from "../../../core/database/unittests/operationalCache.js";
import { IafGeomUtils } from "../../../core/IafGeomUtils.js";
import { IafInputNum } from "../../component-low/IafInputNum/IafInputNum.jsx";
import IafTaggedListDemo from "../../component-low/iafTaggedList/unittest/IafTaggedListDemo.jsx";
import PermissionManager from "../../../core/database/permission/iafPermissionManager.test.jsx";
import { dbUnitTestsPermissionsSequential, dbUnitTestsPlgUserGroupsAndPermissions, dbUnitTestsPlgUserGroupsDeletion, dbUnitTestsUserGroups } from "../../../core/database/unittests/permissions.js";
import { fileUnitTests_Blobs, fileUnitTests_FilesAndFolders, fileUnitTests_MultiLevelFolders, fileUnitTests_Jsons } from "../../../core/database/unittests/filesAndFolders.js";
import { executeAllTestCases } from "../../../core/database/unittests/discipline.js";
import { IafCommandUtils } from "../../../core/IafCommandUtils.js";
import GltfTools from "./GltfTools.jsx";
import { IafResourceUtils } from "../../../core/IafResourceUtils.js";
import { generateModelComposerBenchmark } from "../../../core/database/unittests/modelComposer.test.js";
import { executeModelComposerComparsion } from "../../../core/database/unittests/modelComposer.compare.js";
import { modelComposerEligiblityTest } from "../../../core/database/unittests/modelComposerDynamicLoad.test.js";

// ATK: Launch http://localhost:8083/digitaltwin/#/navigator?&devToolsIaf=true
export function DevToolsPanel(props) {
  const { models, selectedModel, handleModelSelection } = useModelContext();
  const [selectedModelId, setSelectedModelId] = React.useState(selectedModel?._id || "");
  const [selectedVersionId, setSelectedVersionId] = React.useState(selectedModel?._versionId || "");
  const [camera, setCamera] = useState(props.camera);
  const [newCamera,setNewCamera] = useState(props.camera);
  const [isChecked, setCheck] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isZoomOptimized, setZoomOptimized] = useState(props.viewer.isZoomOptimized);
  const [isLayoutMaximized, setLayoutMaximized] = useState(true);
  const [isEnableDBStorageEnabled, setIsEnableDBStorageEnabled] = useState(false);
  const [isCameraVectorEnabled, setIsCameraVectorEnabled] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isHighlightActiveViews, setHighlightActiveViews] = useState(props.viewer.isHighlightActiveViews);
  // const [isDevGisInfoEnabled, setDevGisViewInfoEnabled] = useState(false);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [performanceMemoryUsage, setPerformanceMemoryUsage] = useState(0);
  
  // Grid Helper States
  const [isEnableRectangularGrid, setIsEnableRectangularGrid] = useState(false);
  const [isEnableAxesAsLines, setIsEnableAxesAsLines] = useState(false);
  const [isEnableAxesAs3dPoles, setIsEnableAxesAs3dPoles] = useState(false);
  const [isEnableViewVectorFrustum, setIsEnableViewVectorFrustum] = useState(false);
  const [gridHelperSizeInMeters, setgridHelperSizeInMeters] = useState(100);
  const [gridHelperStepSizeInMeters, setgridHelperStepSizeInMeters] = useState(10);
  const [isEnableCustomCube, setIsEnableCustomCube] = useState(false);
  const [selectedViewIndex, setSelectedViewIndex] = useState('aggregated'); // 'aggregated' or view index

  const modelBoundingBox = props.getModelBoundingBox();
  
  // Get views from graphicsResources
  const views = props.viewer?.props?.graphicsResources?.views || [];
  
  // Get bounding box for selected view or aggregated
  const getBoundingBoxForDisplay = () => {
    if (selectedViewIndex === 'aggregated') {
      return modelBoundingBox;
    }
    const viewIndex = parseInt(selectedViewIndex);
    if (views[viewIndex]?.modelBounding) {
      return views[viewIndex].modelBounding;
    }
    return null;
  };
  
  const displayBoundingBox = getBoundingBoxForDisplay();
  
  // Prepare dropdown options
  const viewOptions = [
    { value: 'aggregated', label: 'Aggregated (All Views)' },
    ...views.map((view, index) => ({
      value: index.toString(),
      label: view.title || view._name || `View ${index + 1}`
    }))
  ];

  // List items with properties

  // Test Items to IafList Component
  let listTitle = IafListUtils.getTestTitle();
  let items = IafListUtils.getTestItems(IafListUtils.optionTestClickHandler, IafListUtils.testRenameHandler);
  let disabledItems = IafListUtils.getDisabledTestItems(); // IDs of items to be disabled

  let performanceLogInterval = null;

  // Test Items for Linked Models
  // let listTitle = "Linked Models"
  // let items = linkedModelItems(viewer);
  // let disabledItems = disabledLinkedModelItems();

  // Test Items for Linked Models
  // let listTitle = "Linked Models"
  // let items = viewer.state.linkedModelItems;// linkedModelItemsFromGraphicsResources(viewer.graphicsResources);
  // let disabledItems = disabledLinkedModelItems();

  // function optionOnClick () {
  //   IafListUtils.optionTestClickHandler(this);
  //   // linkedModelEventHandler(this);
  // }

  const clear = async () => {
    props.viewer.devToolsRectangularGridNodeId && await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsRectangularGridNodeId);
    props.viewer.devToolsRectangularGridNodeId = null;

    props.viewer.devToolsAxesAsLinesNodeId && await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsAxesAsLinesNodeId);
    props.viewer.devToolsAxesAsLinesNodeId = null;

    props.viewer.devToolsAxesAs3dPolesNodeIds && await IafGeomUtils.deleteGeoms(props.viewer, props.viewer.devToolsAxesAs3dPolesNodeIds);
    props.viewer.devToolsAxesAs3dPolesNodeIds = null;

    props.viewer.devToolsViewVectorFrustumNodeId && await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsViewVectorFrustumNodeId);
    props.viewer.devToolsViewVectorFrustumNodeId = null;

    props.viewer.devToolsLinkedModelBoxForFrustumIntersectionNodeId && await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsLinkedModelBoxForFrustumIntersectionNodeId);
    props.viewer.devToolsLinkedModelBoxForFrustumIntersectionNodeId = null;

    clearInterval(performanceLogInterval);
  }

   useEffect(() => {
     console.log("DevToolsPanel Mounted");

     if(performance.memory) {
      performanceLogInterval = setInterval(() => setPerformanceMemoryUsage(performance.memory.usedJSHeapSize / 1024 / 1024), 5000);
     }
      if (selectedModel?._versionId) {
            setSelectedVersionId(selectedModel._versionId);
      }
     return () => {
       clear();
       console.log("DevToolsPanel Unmounted");
     };
   }, []); // Empty dependency array ensures it runs only on mount & unmount
    

  //callback function demo for selected item
  const handleSelectionChange = (selected) => {
    setSelectedItems(selected);
    console.log(selected);
  };
  
  // Effect to monitor model loading and enable persistence status
  useEffect(() => {
    const { view2d, view3d } = props.viewer.props;
    const is2DModelLoaded = props.viewer.state.view2d.isLoaded;
    const isModelLoaded = props.viewer.state.view3d.isLoaded;
    // Determine if models are loaded
    const isLoaded =
      view2d?.enable && view3d?.enable
        ? is2DModelLoaded && isModelLoaded
        : (view2d?.enable ? is2DModelLoaded : true) &&
          (view3d?.enable ? isModelLoaded : true);
    setIsModelLoaded(isLoaded);
    
    if (isLoaded) {
      setIsEnableDBStorageEnabled(props.viewer?.iafDatabaseManager?._enablePersistence);
    }
  }, [props.viewer.state.view3d.isLoaded, props.viewer.state.view2d.isLoaded]);
  
  useEffect(() => {
    if (selectedModel) {
      setSelectedModelId(selectedModel._id);
      setSelectedVersionId(selectedModel._versionId);
    }
  }, [selectedModel]);
  
  useEffect(() => {
    const container = document.getElementById(props.viewer.evmElementIdManager.getEvmElementUuidIafContainer());
    if(container && !isLayoutMaximized){
      container.style.top = `10%`;
      container.style.left = `10%`;
      container.style.width = `80%`;  // Update width
      container.style.height = `80%`; // Update height
    }else if(container){
      container.style.top = `0%`;
      container.style.left = `0%`;
      container.style.width = `${width}%`;  // Update width
      container.style.height = `${height}%`; // Update height
    }
  }, [width, height, isLayoutMaximized]); // Depend on width and height

  // Handle width change
  const handleWidthChange = (event) => {
    setWidth(event.target.value);
  };

  // Handle height change
  const handleHeightChange = (event, newValue) => {
    setHeight(event.target.value);
  };
  
  const handleLayoutChange = (event) => {
    const { checked } = event.target;
    setLayoutMaximized(checked);
  }
  
  const handleBoundingBoxWireFrame = (event) => {
    const { checked } = event.target;
    const iafViewer = props.viewer;
  
    if (iafViewer._boundingBoxMarkup) {
      if (checked) {
        // iafViewer.clearBoundingBox();
        // iafViewer.createBoundingBox();
        clearBoundingBox(iafViewer);
        createBoundingBox(iafViewer);
      } else {
        // iafViewer.clearBoundingBox();
        clearBoundingBox(iafViewer);
      }
    }
    props.viewer.setState({showBoundingBoxWireframe: checked});
  };
  
  const handleEnableRectangularGrid = async (event) => {
    const { checked } = event.target;

    if (checked) {
      props.viewer.devToolsRectangularGridNodeId = await IafGeomUtils.createRectangularGrid(props.viewer, gridHelperSizeInMeters * 1000, {stepSizeInMm: gridHelperStepSizeInMeters * 1000});
    } else {
      await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsRectangularGridNodeId);
      props.viewer.devToolsRectangularGridNodeId = null;
    }

    setIsEnableRectangularGrid(checked);
  }

  const handleEnableAxesAsLines = async (event) => {
    const { checked } = event.target;

    if (checked) {
      props.viewer.devToolsAxesAsLinesNodeId = await IafGeomUtils.create3dAxesAsLines(props.viewer, gridHelperSizeInMeters * 1000);
    } else {
      await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsAxesAsLinesNodeId);
      props.viewer.devToolsAxesAsLinesNodeId = null;
    }

    setIsEnableAxesAsLines(checked);
  }  

  const handleEnableAxesAs3dPoles = async (event) => {
    const { checked } = event.target;

    if (checked) {
      props.viewer.devToolsAxesAs3dPolesNodeIds = await IafGeomUtils.create3dAxesAs3dPoles(props.viewer, gridHelperSizeInMeters * 1000);
    } else {
      await IafGeomUtils.deleteGeoms(props.viewer, props.viewer.devToolsAxesAs3dPolesNodeIds);
      props.viewer.devToolsAxesAs3dPolesNodeIds = null;
    }

    setIsEnableAxesAs3dPoles(checked);
  }    
  
  const handleEnablegridHelperStepSizeInMeters = async (event, newValue, name) => {
    console.log ('handleEnablegridHelperSizeInMeters', newValue);

    if (isEnableRectangularGrid) {
      props.viewer.devToolsRectangularGridNodeId && await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsRectangularGridNodeId);
      props.viewer.devToolsRectangularGridNodeId = null;
      props.viewer.devToolsRectangularGridNodeId = await IafGeomUtils.createRectangularGrid(props.viewer, gridHelperSizeInMeters * 1000, {stepSizeInMm: newValue * 1000});  
    }

    setgridHelperStepSizeInMeters(newValue);
  }

  const handleEnablegridHelperSizeInMeters = async (event, newValue, name) => {
    console.log ('handleEnablegridHelperSizeInMeters', newValue);
    setgridHelperSizeInMeters(newValue);

    if (isEnableRectangularGrid) {
      props.viewer.devToolsRectangularGridNodeId && await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsRectangularGridNodeId);
      props.viewer.devToolsRectangularGridNodeId = null;
      props.viewer.devToolsRectangularGridNodeId = await IafGeomUtils.createRectangularGrid(props.viewer, newValue * 1000, {stepSizeInMm: gridHelperStepSizeInMeters * 1000});  
    }

    if (isEnableAxesAsLines) {
      props.viewer.devToolsAxesAsLinesNodeId && await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsAxesAsLinesNodeId);
      props.viewer.devToolsAxesAsLinesNodeId = null;
      props.viewer.devToolsAxesAsLinesNodeId = await IafGeomUtils.create3dAxesAsLines(props.viewer, newValue * 1000);  
    }

    if (isEnableAxesAs3dPoles) {
      props.viewer.devToolsAxesAs3dPolesNodeIds && await IafGeomUtils.deleteGeoms(props.viewer, props.viewer.devToolsAxesAs3dPolesNodeIds);
      props.viewer.devToolsAxesAs3dPolesNodeIds = null;
      props.viewer.devToolsAxesAs3dPolesNodeIds = await IafGeomUtils.create3dAxesAs3dPoles(props.viewer, newValue * 1000);  
    }

    if (isEnableViewVectorFrustum) {
      props.viewer.devToolsViewVectorFrustumNodeId && await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsViewVectorFrustumNodeId);
      props.viewer.devToolsViewVectorFrustumNodeId = null;
      props.viewer.devToolsViewVectorFrustumNodeId = await IafGeomUtils.create3dViewVectorFrustum(props.viewer, newValue * 1000);

      props.viewer.devToolsLinkedModelBoxForFrustumIntersectionNodeId && await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsLinkedModelBoxForFrustumIntersectionNodeId);
      props.viewer.devToolsLinkedModelBoxForFrustumIntersectionNodeId = null;
      props.viewer.devToolsLinkedModelBoxForFrustumIntersectionNodeId = await IafGeomUtils.createLinkedModelBoxForFrustumIntersection(props.viewer, props.viewer.modelBounding, newValue * 1000);
    }
  }

  const handleEnableViewVectorFrustum = async (event) => {
    const { checked } = event.target;

    if (checked) {
      props.viewer.devToolsViewVectorFrustumNodeId = await IafGeomUtils.create3dViewVectorFrustum(props.viewer, gridHelperSizeInMeters * 1000);
      props.viewer.devToolsLinkedModelBoxForFrustumIntersectionNodeId = await IafGeomUtils.createLinkedModelBoxForFrustumIntersection(props.viewer, props.viewer.modelBounding, gridHelperSizeInMeters * 1000);
    } else {
      await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsViewVectorFrustumNodeId);
      await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsLinkedModelBoxForFrustumIntersectionNodeId);
      props.viewer.devToolsViewVectorFrustumNodeId = null;
      props.viewer.devToolsLinkedModelBoxForFrustumIntersectionNodeId = null;
    }

    setIsEnableViewVectorFrustum(checked);
  }    

  const handleEnableCustomCube = async (event) => {
    const { checked } = event.target;

    if (checked) {
      props.viewer.devToolsCustomCubeNodeId = await IafGeomUtils.createCube(props.viewer, 20000);
    } else {
      await IafGeomUtils.deleteGeom(props.viewer, props.viewer.devToolsCustomCubeNodeId);
      props.viewer.devToolsCustomCubeNodeId = null;
    }

    setIsEnableCustomCube(checked);
  }  
  
  const handleEnableDBStorage = (event) => {
    const { checked } = event.target;
    if (!props.viewer.props.enablePersistence) {
      NotificationStore.notifyPersistenceIsDisabled(props.viewer);
      return;
    }
    // If _enablePersistence is already ON, allow toggling both ON and OFF
    if (props.viewer.props.enablePersistence) {
      props.viewer.iafDatabaseManager._enablePersistence = checked;
      setIsEnableDBStorageEnabled(checked);
    }
  }

  const handleCameraVector = (event) => {
    const { checked } = event.target;
    // If _enablePersistence is already ON, allow toggling both ON and OFF
    renderCameraVector(props.viewer, checked);
    setIsCameraVectorEnabled(checked);
  }  

  const handleZoomChange = (event) => {
    const { checked } = event.target;
    props.viewer.isZoomOptimized = checked
    /*  Reset to camera pan mode as default before reinitialize operators */
    props.viewer.newToolbarElement.current.cameraPan()
    /* Switch between IafCameraZoomOperator(original) and IafZoomOperator(modified) based on the value of isZoomOptimized, 
      toggling between the two operators when it is true or false.
      After setting isZoomOptimized, reset the camera and related operators, (such as navigation, panning, and walk mode) to their initial states.
    */
    props.viewer.initializeOperators()
    //Adjusting the near limit, and then storing the initial distance between the camera and its target object.
    props.viewer.zoomOperator.initialise()
    setZoomOptimized(checked);
  };

  const handleHighlightActiveViews = (event) => {
    const { checked } = event.target;
    props.viewer.isHighlightActiveViews = checked
    setHighlightActiveViews(checked);
    processLinkedModelsByCamera(props.viewer, props.viewer._viewer.view.getCamera());
  }

  // const handleDevGisViewInfoEnabled = (event) => {
  //   const { checked } = event.target;
  //   props.viewer.setState({isDevGisInfoEnabled: checked});
  //   setDevGisViewInfoEnabled(checked);
  // }

  const handleSandboxChange = (event) =>{
    const { checked } = event.target;
    props.viewer.handleShowSandbox(checked);
  }
  
  const handleShowPDF = (event) =>{
    const { checked } = event.target;
    props.viewer.handleShowPDF(checked);
  }
  
  const handleShowModelViewer = (event) => {
    const { checked } = event.target;
    IafStorageUtils.setSceneGraph(checked);
    props.viewer.handleShowModelViewer(checked);
  }
  
  const handleEnforcePermission = (event) => {
    const { checked } = event.target;
    props.viewer.setState({ enforcePermission: checked}, ()=>{
      props.viewer.updateResourcePermissions()
    });
  }
  
  useEffect(() => {
      if (props.camera && props.iafViewer?.state?.isModelStructureReady) {
        props.camera._fov = getCameraFOV(props.viewer);
        setCamera(props.camera);
        setNewCamera(props.camera);
      }
  }, [props.camera]);

  function panelClose(){
    props.onClose('devToolsPanel');
  }

  function saveMeasurement () {
    IafStorageUtils.saveMeasurements(props.viewer);
    NotificationStore.notifyAnnotationsSavedToLocalStorage(props.viewer);
  }

  function loadMeasurement () {
    IafStorageUtils.loadMeasurements(props.viewer);
    NotificationStore.notifyAnnotationsLoadedFromLocalStorage(props.viewer);
  }

  function runUnitTestsMarkups2d () {
    props.viewer.markupManager2d && props.viewer.markupManager2d.unittest();
  }

  function removeMeasurement(){
    IafStorageUtils.clearMeasurements(props.viewer);
    IafStorageUtils.clearMeasurementsLocalStorage(props.viewer);
    NotificationStore.notifyAnnotationsClearedFromLocalStorage(props.viewer);
  }

  function handleTargetInputChange(e,pointName){
    e.persist(); // Persist the synthetic event
    setNewCamera((prevCamera) => ({
      ...prevCamera,
      _target: {
        ...prevCamera._target,
        [pointName]: parseFloat(e.target.value),
      },
    }));
  }
  function handlePositionInputChange(e,pointName){
    e.persist(); // Persist the synthetic event
    setNewCamera((prevCamera) => ({
      ...prevCamera,
      _position: {
        ...prevCamera._position,
        [pointName]: parseFloat(e.target.value),
      },
    }));
  }
  function handleUpInputChange(e,pointName){
    e.persist(); // Persist the synthetic event
    setNewCamera((prevCamera) => ({
      ...prevCamera,
      _up: {
        ...prevCamera._up,
        [pointName]: parseFloat(e.target.value),
      },
    }));
  }    
  
  function handleCameraWidthChange(e) {
    e.persist(); // Persist the synthetic event
    
    const _width = parseFloat(e.target.value) || props.camera._width;
    setNewCamera((prevCamera) => ({
      ...prevCamera,
      _width
    }));
  }
  function handleFovInputChange(e) {
    e.persist(); // Persist the synthetic event
    
    const _fov = parseFloat(e.target.value) || getCameraFOV(props.viewer);
    setNewCamera((prevCamera) => ({
      ...prevCamera,
      _fov
    }));
  }

  function handleCameraHeightChange(e) {
    e.persist(); // Persist the synthetic event
    
    const _height = parseFloat(e.target.value) || props.camera._height;
    setNewCamera((prevCamera) => ({
      ...prevCamera,
      _height
    }));
  }  

  function handleCameraNearLimitChange(e) {
    e.persist(); // Persist the synthetic event
    
    const _nearLimit = parseFloat(e.target.value) || props.camera._nearLimit;
    setNewCamera((prevCamera) => ({
      ...prevCamera,
      _nearLimit
    }));
  }  
  
  function applyEffects(){
    // Clear input values using DOM and JavaScript
    // document.getElementById("xInput").value = "";
    // document.getElementById("yInput").value = "";
    // document.getElementById("zInput").value = "";
    // document.getElementById("xInputTarget").value = "";
    // document.getElementById("yInputTarget").value = "";
    // document.getElementById("zInputTarget").value = "";
    // console.log(camera);
    let currentCamera = props.camera;
    currentCamera.setPosition(newCamera._position);
    currentCamera.setTarget(newCamera._target);
    currentCamera.setWidth(newCamera._width);
    currentCamera.setHeight(newCamera._height);
    currentCamera.setNearLimit(newCamera._nearLimit);
    currentCamera.setUp(newCamera._up);
    props.viewer._viewer.view.setCamera(currentCamera);
    const newCurrentCamera = props.viewer._viewer.view.getCamera();
    setCamera(newCurrentCamera);
  }

  function handleSaveCurrentMarkup(e) {
    IafStorageUtils.saveMarkups(props.viewer);
    NotificationStore.notifyAnnotationsSavedToLocalStorage(props.viewer);
  }

  function handleExportCurrentMarkups() {
    IafStorageUtils.exportMarkups(props.viewer);
    NotificationStore.notifyAnnotationsExportMarkups(props.viewer);
  }

  function handleExportCurrentMeasurement() {
    IafStorageUtils.exportMeasurements(props.viewer);
    NotificationStore.notifyAnnotationsExportMeasurements(props.viewer);
  }

  function handleExportCurrentAnnotations() {
    IafStorageUtils.exportAnnotations(props.viewer);
    NotificationStore.notifyAnnotationsExportAnnotations(props.viewer);
  }


  function handleLoadMarkupsFromCache(e) {
    IafStorageUtils.loadMarkups(props.viewer);
    NotificationStore.notifyAnnotationsLoadedFromLocalStorage(props.viewer);
  }

  function handleClearMarkups(){
    IafStorageUtils.clearMarkups(props.viewer);
    IafStorageUtils.clearMarkupsLocalStorage(props.viewer);
    NotificationStore.notifyAnnotationsClearedFromLocalStorage(props.viewer);
  }

  function handleSaveCurrentAnnotations(e) {
    IafStorageUtils.saveAnnotations(props.viewer);
    NotificationStore.notifyAnnotationsSavedToLocalStorage(props.viewer);
  }

  function handleLoadCurrentAnnotations(e) {
    IafStorageUtils.loadAnnotations(props.viewer);
    NotificationStore.notifyAnnotationsLoadedFromLocalStorage(props.viewer);
  }

  function handleResetToDefaultAnnotations(){
    IafStorageUtils.clearAnnotations(props.viewer);
    IafStorageUtils.clearAnnotationsLocalStorage(props.viewer);
    NotificationStore.notifyAnnotationsClearedFromLocalStorage(props.viewer);
  }

  function handleImportMarkupJson(data, error) {
    if (data) {
      console.log("Successfully imported JSON:", data);
      IafStorageUtils.importMarkups(props.viewer, data);
      NotificationStore.notifyAnnotationsImportMarkups(props.viewer);
    } else {
      console.error("Failed to import JSON:", error);
    }
  };

  function handleImportMeasurementJson(data, error) {
    if (data) {
      console.log("Successfully imported JSON:", data);
      IafStorageUtils.importMeasurements(props.viewer, data);
      NotificationStore.notifyAnnotationsImportMeasurements(props.viewer);
    } else {
      console.error("Failed to import JSON:", error);
    }
  };

  function handleImportAnnotationJson(data, error) {
    if (data) {
      console.log("Successfully imported JSON:", data);
      IafStorageUtils.importAnnotations(props.viewer, data);
      NotificationStore.notifyAnnotationsImportAnnotations(props.viewer);
    } else {
      console.error("Failed to import JSON:", error);
    }
  };
  
  function handleLoadModel() {
    const model = models.find((m) => m._id === selectedModelId);
    if (model) {
      handleModelSelection({ ...model, _versionId: selectedVersionId });
    }
  }
  
  let testList = 1 ? (
    <div>
      <IafSubHeader title = {listTitle} minimized={true}>
        <IafList
        items={items}
        disabledItems={disabledItems}
        onSelectionChange={handleSelectionChange}
        enableSearch = {true} // flag to turn off search functionlity
        ></IafList>
      </IafSubHeader>
    </div>    
  ) : <div></div>;

  let performanceInfo = (
    <IafSubHeader title="Performance" minimized={true}>
      <IafInputNum
          label = "Memory Usage"
          value = {performanceMemoryUsage}
      />                        
    </IafSubHeader>
  )

  let modelBoundingInfo = (
    (
    <IafSubHeader title="Model" minimized={true}>
    <div className={styles.devtoolsStats}>
      <ul className={styles.mainUl}>
        <li className={styles.sectionLi}>
          <strong>Model Units</strong>
          <ul className={styles.statsUl}>
            <li> Aggregated : mm</li>
            <li> Source(2D) : {isModelLoaded && IafMathUtils.getModelUnits(props.viewer._viewer2d)}</li>
            <li> Source(3D) : {isModelLoaded && IafMathUtils.getModelUnits(props.viewer._viewer)}</li>
          </ul>
        </li>
        {views.length > 0 && (
          <li className={styles.sectionLi} style={{ marginTop: '10px', marginBottom: '10px' }}>
            <IafDropdown
              title="View Selection"
              showTitle={true}
              data={viewOptions}
              value={selectedViewIndex}
              onChange={(e) => setSelectedViewIndex(e.target.value)}
              className="custom-select"
            />
          </li>
        )}
       {displayBoundingBox && <IafPoint3d
          title = {selectedViewIndex === 'aggregated' ? "Aggregated Max Bounding" : "Max Bounding"}
          point3d = {displayBoundingBox?.max}
        />}
        {displayBoundingBox && <IafPoint3d
          title = {selectedViewIndex === 'aggregated' ? "Aggregated Min Bounding" : "Min Bounding"}
          point3d = {displayBoundingBox?.min}
        />}
        <div style={{ marginBottom: '10px', order: 4 }}>
          <IafSwitch
            title={<strong style={{ color: '#61dafb' }}>Persistence</strong>}
            isChecked={isEnableDBStorageEnabled}
            name="isEnableDBStorageEnabled"
            onChange={handleEnableDBStorage}
            showValue={false}
            disabled={!isModelLoaded} // Disable switch if model is not loaded
          />
        </div>
        <div style={{ marginBottom: '10px'}}>
          <IafDropdown
                  title="Switch Models"
                  showTitle={true}
                  value={selectedModelId}
                  disabled={!isModelLoaded}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  data={models.map((model) => ({
                    value: model._id, // Use unique _id as the value
                    label: model._name || `Model ${model._id}`, // Use name or a fallback
                  }))}
          ></IafDropdown>
        </div>
        <div style={{ marginBottom: '10px'}}>
          <IafDropdown
            title="Switch Versions"
            showTitle={true}
            value={selectedVersionId}
            disabled={!isModelLoaded}
            onChange={(e) => setSelectedVersionId(e.target.value)}
            data={
              models.filter((model) => model._id === selectedModelId)
                .map((model) => ({
                  value: model._versionId,
                  label: model._versionId,
            }))}
          />
       </div>
       <div style={{ marginBottom: '10px'}}>
         <IafButton
            title="Load Model"
            tooltipTitle={
              "Click to load model " +
              selectedModelId +
              " with version " +
              selectedVersionId
            }
            disabled={!isModelLoaded}
            onClick={handleLoadModel}
            width="100%"
            height="18px"
          ></IafButton>
       </div>
      </ul>
      </div>
         <div style={{marginBottom:'10px',order:4}}>
            <IafSwitch
                  title={"Scene Graph"}
                  isChecked={props.viewer.state.showModelViewer}
                  name="showModelViewer"
                  onChange={handleShowModelViewer}
                  showValue={false}
             />
        </div>      
      </IafSubHeader>
    )
  )

  let customGeometry = (
    (
      <IafSubHeader title="Custom Geometry" minimized={true}>
        <div style={{marginBottom:'10px',order:3 }}>
          <IafSwitch
                title="Bounding Box Wireframe"
                isChecked={props.viewer.state.showBoundingBoxWireframe}
                name="showBoundingBoxWireframe"
                onChange={handleBoundingBoxWireFrame}
                showValue={false}
            />
        </div>
        <div style={{ marginBottom: '10px', order: 4 }}>
          <IafSwitch
            title="Cube"
            isChecked={isEnableCustomCube}
            name="isEnableCustomCube"
            onChange={handleEnableCustomCube}
            showValue={false}
            disabled={!isModelLoaded} // Disable switch if model is not loaded
          />
        </div>          
      </IafSubHeader>
    )   
  )  

  let gridHelper = (
    (
      <IafSubHeader title="Grid Helper" minimized={true}>
        <IafSwitch
          title="Rectangular Grid"
          isChecked={isEnableRectangularGrid}
          name="isEnableRectangularGrid"
          onChange={handleEnableRectangularGrid}
          showValue={false}
          disabled={!isModelLoaded} // Disable switch if model is not loaded
        />
        <IafSwitch
          title="Axes as Lines"
          isChecked={isEnableAxesAsLines}
          name="isEnableAxesAsLines"
          onChange={handleEnableAxesAsLines}
          showValue={false}
          disabled={!isModelLoaded} // Disable switch if model is not loaded
        />       
        <IafSwitch
          title="Axes as 3D Poles"
          isChecked={isEnableAxesAs3dPoles}
          name="isEnableAxesAs3dPoles"
          onChange={handleEnableAxesAs3dPoles}
          showValue={false}
          disabled={!isModelLoaded} // Disable switch if model is not loaded
        />                
        <IafSlider
          title="Size In Meters"
          min={10}
          max={10000}
          value={gridHelperSizeInMeters } 
          onChange={handleEnablegridHelperSizeInMeters} 
          label={-gridHelperSizeInMeters } 
          showValue={true}
          tooltipText = {TooltipStore.Empty}
          disabled = {!isModelLoaded}
          step={1}
        ></IafSlider>
        <IafSlider
          title="Step Size In Meters"
          min={1}
          max={10}
          value={gridHelperStepSizeInMeters } 
          onChange={handleEnablegridHelperStepSizeInMeters} 
          label={-gridHelperStepSizeInMeters } 
          showValue={true}
          tooltipText = {TooltipStore.Empty}
          disabled = {!isModelLoaded}
          step={1}
        ></IafSlider>
        <IafSwitch
          title="View Vector Frustum"
          isChecked={isEnableViewVectorFrustum}
          name="isEnableViewVectorFrustum"
          onChange={handleEnableViewVectorFrustum}
          showValue={false}
          disabled={!isModelLoaded} // Disable switch if model is not loaded
        />                        
      </IafSubHeader>
    )   
  )    

  let createGlobalLayersElement = (layer) => {
    return (
      <tbody> 
      {
        <li> { layer[0] + " : " + layer[1]} </li>
      }
      </tbody>  
    )
  }

  // 3D Views (Linked Models) by Camera
  let createActiveViewElement = (view, i) => {

      return view.loaded && view.visible ? (
                              <tbody key={i}>
                              {
                                  <li> { view.title } </li>
                              } 
                              </tbody>
                          )
    : (        
      <IafButton
        title={view.title}
        tooltipTitle={"Click to load this view containing " + JSON.stringify(view.layers) + ", " + JSON.stringify(view.layersInPercent)} 
        onClick={() => {
          view.loaded = true;
          view.visible = true;
          props.viewer.props.graphicsResources.loadGraphicsResourceByViewId(view.id)
        }}
        width='100%'
        height="18px"
      ></IafButton>
    )
  }

  // 3D Views (Linked Models) by Camera
  let createInactiveViewElement = (view, i) => {
    return (!view.loaded || !view.visible) ? (
                            <tbody key={i}>
                            {
                                <li> { view.title } </li>
                            } 
                            </tbody>
                        )
  : (        
      <IafButton
        title={view.title}
        tooltipTitle={"Click here to unload this view containing " + JSON.stringify(view.layers) + ", " + JSON.stringify(view.layersInPercent)} 
        onClick={() => {
          // view.loaded = false; // No plans to unload but just hide
          view.visible = false;
          props.viewer.props.graphicsResources.unloadGraphicsResourceByViewId(view.id)
        }}
        width='100%'
        height="18px"
      ></IafButton>
    )
  }  

  let viewInfo = (
    <IafSubHeader title="3D Views (Linked Models) by Camera" minimized={true}>
      <IafSwitch
          title={"Highlight Active Views"}
          isChecked={isHighlightActiveViews}
          name="isHighlightActiveViews"
          onChange={handleHighlightActiveViews}
          showValue={true}
          // customTitleStyles={{fontSize: '14px', fontWeight: 'bold'}}
      />

      <div className={styles.devtoolsStats}>
        <ul className={styles.mainUl}>
          { camera && camera.viewVector && camera.viewVector.start && (
            <IafPoint3d
              title = "View Vector Start"
              point3d = {camera.viewVector.start}
            />
          )}
          { camera && camera.viewVector && camera.viewVector.end && (
            <IafPoint3d
              title = "View Vector End"
              point3d = {camera.viewVector.end}
            />
          )}
          <li className={styles.sectionLi}>
            <strong>Active Views : </strong> 
            <ul className={styles.statsUl}>
              {
                camera && camera.toBeActiveViews && camera.toBeActiveViews.map((view, i) => {
                  return createActiveViewElement(view);
                })
              } 
            </ul>
          </li>
          <li className={styles.sectionLi}>
            <strong>Inactive Views : </strong> 
            <ul className={styles.statsUl}>
              {
                camera && camera.toBeInactiveViews && camera.toBeInactiveViews.map((view, i) => {
                  return createInactiveViewElement(view, i);
                })
              } 
            </ul>
          </li>
          <li className={styles.sectionLi}>
            <strong>Aggregated Layers : </strong> 
            <ul className={styles.statsUl}>
              {
                camera && camera.globalLayers &&  
                    Object.entries(camera.globalLayers).map((layer, i) => {
                      return createGlobalLayersElement(layer, i);
                    })
                  }
            </ul>
          </li>
        </ul>
      </div>
    </IafSubHeader>
  )

  // let gisTools = (
  //   <IafSubHeader title="GIS" minimized={true}>
  //     <IafSwitch
  //         title={"GIS View Info"}
  //         isChecked={isDevGisInfoEnabled}
  //         name="isDevGisInfoEnabled"
  //         onChange={handleDevGisViewInfoEnabled}
  //         showValue={true}
  //         // customTitleStyles={{fontSize: '14px', fontWeight: 'bold'}}
  //     />
  //   </IafSubHeader>
  // )

  let measurementTools = (
    <div>
      <IafSubHeader title="Measurments" minimized={true}>
        <IafButton
          title="Save Measurements To Cache" 
          tooltipTitle={TooltipStore.MeasurementSaveToCache} 
          onClick={() => saveMeasurement()}
          width='100%' 
          height="18px"
          ></IafButton>
        <IafButton
          title="Load Measurements From Cache" 
          tooltipTitle={TooltipStore.MeasurementLoadFromCache} 
          onClick={() => loadMeasurement()}
          width='100%' 
          height="18px"
          ></IafButton>
        <IafButton
          title="Clear Mmeasurements From Cache" 
          tooltipTitle={TooltipStore.MeasurementClearFromCache} 
          onClick={() => removeMeasurement()}
          width='100%' 
          height="18px"
          ></IafButton>
          <IafButton
            title="Export Measurements (Download)"
            tooltipTitle={TooltipStore.MeasurementExportOrDownload}
            onClick={handleExportCurrentMeasurement}
            width='100%' 
            height="18px"
          ></IafButton>          
          <IafImportJson 
            title="Import Measurements"
            tooltipTitle={TooltipStore.MeasurementImport}
            width='100%' 
            height="18px"
            onImport={handleImportMeasurementJson}
          ></IafImportJson>        
      </IafSubHeader>    
    </div>
  )

  let animationTools = (
    <IafSubHeader title="Animations" minimized={true}>
    <div style={{display:'flex' , flexDirection: 'column', gap:'10px'}}>
        <IafButton
          title="Play Active 2D Animation" 
          tooltipTitle={TooltipStore.Empty} 
          onClick={() => {props.viewer.animationManager2d && props.viewer.animationManager2d.playAnimation()}}
          width='100%' 
          height="18px"
          ></IafButton>
        <IafButton
          title="Stop Acdtive 2D Animation" 
          tooltipTitle={TooltipStore.Empty} 
          onClick={() => {props.viewer.animationManager2d && props.viewer.animationManager2d.stopAnimation()}}
          width='100%' 
          height="18px"
          ></IafButton>
        </div>
    </IafSubHeader>    
  )  

  let unitTests = (
    <IafSubHeader title="Unit Tests" minimized={true}>
      <IafButton
        title="Markups on 2D Viewer"
        tooltipTitle={TooltipStore.Empty}
        onClick={async () => {
          console.groupCollapsed ("Unit Tests - Markups on 2D Viewer");
          props.viewer.markupManager2d && await props.viewer.markupManager2d.unittest()
        }}
        width='100%' 
        height="18px"
      ></IafButton>
      <IafButton
        title="Markups on 3D Viewer"
        tooltipTitle={TooltipStore.Empty}
        onClick={async () => {
          console.groupCollapsed ("Unit Tests - Markups on 3D Viewer");
          props.viewer.markupManager && await props.viewer.markupManager.unittest()
          console.groupEnd();
        }}
        width='100%' 
        height="18px"
      ></IafButton>  
      <IafButton
        title="Animations on 2D Viewer"
        tooltipTitle={TooltipStore.Empty}
        onClick={async () => {
          console.groupCollapsed ("Unit Tests - Animations on 2D Viewer");
          props.viewer.animationManager2d && await props.viewer.animationManager2d.unittest()
          console.groupEnd();
        }}
        width='100%' 
        height="18px"
      ></IafButton>          
      <IafButton
        title="Workflows on 2D Viewer"
        tooltipTitle={TooltipStore.Empty}
        onClick={async () => {
          console.groupCollapsed ("Unit Tests - Workflows on 2D Viewer");
          props.viewer.animationManager2d && await props.viewer.animationManager2d.unittestWorkflows();
          console.groupEnd ();
        }}
        width='100%' 
        height="18px"
      ></IafButton>    
      {<IafButton
        title="Math Utils"
        tooltipTitle={TooltipStore.Empty}
        onClick={async () => {
          console.groupCollapsed ("Unit Tests - IafMathUtils")
          await IafMathUtils.unitTests()
          console.groupEnd();;
        }
        }
        width='100%' 
        height="18px"
      ></IafButton>}    
      {<IafButton
        title="Command Utils"
        tooltipTitle={TooltipStore.Empty}
        onClick={async () => {
          console.groupCollapsed ("Unit Tests - IafCommandUtils");
          await IafCommandUtils.unitTests();
          console.groupEnd();
        }}
        width='100%' 
        height="18px"
      ></IafButton>}
      {<IafButton
        title="Database Sequential Operations"
        tooltipTitle={TooltipStore.Empty}
        onClick={async () => {
          console.groupCollapsed ("Unit Tests - Database Sequential Operations");
          await dbUnitTestsOperationalCacheSequential(props.viewer);
          await dbUnitTestsGisSequential(props.viewer);
          await dbUnitTestsModelComposerSequential(props.viewer);
          await dbUnitTestsMarkupsSequential(props.viewer);
          await dbUnitTestsMarkupsSequential2(props.viewer);
          await dbUnitTestsPermissionsSequential(props.viewer);
          console.groupEnd();
        }}
        width='100%' 
        height="18px"
      ></IafButton>}         
      {<IafButton
        title="Database Queued Operations"
        tooltipTitle={TooltipStore.Empty}
        onClick={async () => {
          console.groupCollapsed ("Unit Tests - Database Queued Operations")
          await dbUnitTestsMarkupsMultipleUpdates(props.viewer)
          setTimeout(()=>console.groupEnd(), 5000);
        }
        }
        width='100%' 
        height="18px"
      ></IafButton>}     
      {<IafButton
        title="Users, User Groups and Permissions"
        tooltipTitle={TooltipStore.Empty}
        onClick={async () => {
          console.groupCollapsed ("Unit Tests - Users, User Groups and Permissions");
          await dbUnitTestsUserGroups(props.viewer);
          await dbUnitTestsPlgUserGroupsDeletion(props.viewer);
          await dbUnitTestsPlgUserGroupsAndPermissions(props.viewer);
          console.groupEnd();
        }}
        width='100%' 
        height="18px"
      ></IafButton>}      
      {<IafButton
        title="File and Folder Operations"
        tooltipTitle={TooltipStore.Empty}
        onClick={async () => {
          console.groupCollapsed ("Unit Tests - File and Folder Operations");
          await fileUnitTests_FilesAndFolders(props.viewer);
          await fileUnitTests_MultiLevelFolders(props.viewer);
          await fileUnitTests_Blobs(props.viewer);
          await fileUnitTests_Jsons(props.viewer);
          console.groupEnd();
        }}
        width='100%' 
        height="18px"
      ></IafButton>}          
      {/* <IafButton
        title="Review Model"
        tooltipTitle={TooltipStore.Empty}
        onClick={() => {
          // props.viewer?.graphicsResources?.getUndergroundNodes(0);
          props.viewer?.props?.graphicsResources?.getUndergroundNodes(0)
        }}
        width='100%' 
        height="18px"
      ></IafButton>     */}
      <IafButton
        title="Performance Logs"
        tooltipTitle={TooltipStore.Empty}
        onClick={() => {
          console.log ('IafPerfLogger.logs', IafPerfLogger.logs);
          // let jsonData = JSON.stringify(IafPerfLogger.logs, null, 2);
          let logs = [...IafPerfLogger.logs];
          IafPerfLogger.globalLoggers.size && logs.push(`${IafPerfLogger.globalLoggers.size} operations might be still running`);
          IafUtils.exportArray(logs, IafPerfLogger.getCurrentFileName());
        }}
        width='100%' 
        height="18px"
      ></IafButton>   
      <IafButton
        title="Bounding Boxes Logs"
        tooltipTitle={TooltipStore.Empty}
        onClick={() => {
          console.groupCollapsed ("Unit Tests - Bounding Boxes Logs");
          props.viewer.props.graphicsResources && props.viewer.props.graphicsResources.logBoundingBoxes();
          console.groupEnd();
        }}
        width='100%' 
        height="18px"
      ></IafButton> 
      <IafButton
        title="Model Tree Logs"
        tooltipTitle={TooltipStore.Empty}
        onClick={() => {
          console.groupCollapsed ("Unit Tests - Model Tree Logs");
          props.viewer?.modelTree?.rebuild();
          console.groupEnd();
        }}
        width='100%' 
        height="18px"
      ></IafButton>         
      <IafButton
        title="GIS Coordinate Conversions"
        tooltipTitle={TooltipStore.Empty}
        onClick={() => {
          console.groupCollapsed ("Unit Tests - GIS Coordinate Conversions");

          function roundTo(value, decimalPlaces = 6) {
            const factor = Math.pow(10, decimalPlaces);
            return Math.round(value * factor) / factor;
          }
          
          // Test for BIAL T2 – Central Utility Plant
          function testBIALT2() {
            // Expected Decimal Degrees for T2
            const decimalLatT2 = IafMapUtils.dmsToDecimal(13, 11, 46, "N");
            const decimalLngT2 = IafMapUtils.dmsToDecimal(77, 42, 51, "E");

            const expectedDecimalLatT2 = 13.196111;
            const expectedDecimalLngT2 = 77.714167;

            if (roundTo(decimalLatT2) === roundTo(expectedDecimalLatT2) && roundTo(decimalLngT2) === roundTo(expectedDecimalLngT2)) {
              console.log("✅ BIAL T2 Decimal conversion test passed");
            } else {
              console.error("❌ BIAL T2 Decimal conversion test failed");
              console.error(`    Lat: Expected "${expectedDecimalLatT2}", but got "${decimalLatT2}"`);
              console.error(`    Lng: Expected "${expectedDecimalLngT2}", but got "${decimalLngT2}"`);
            }

            // Convert back to DMS
            const { latDMS, lngDMS } = IafMapUtils.decimalToDMS(decimalLatT2, decimalLngT2);

            const expectedLatDMS = "13° 11' 46.00\" N";
            const expectedLngDMS = "77° 42' 51.00\" E";

            if (latDMS === expectedLatDMS && lngDMS === expectedLngDMS) {
              console.log("✅ BIAL T2 DMS conversion test passed");
            } else {
              console.error("❌ BIAL T2 DMS conversion test failed");
              console.error(`    Lat: Expected "${expectedLatDMS}", but got "${latDMS}"`);
              console.error(`    Lng: Expected "${expectedLngDMS}", but got "${lngDMS}"`);
            }
          }

          // Test for BIAL T1 – Utility HVAC Chiller Plant
          function testBIALT1() {
            // Expected Decimal Degrees for T1
            const decimalLatT1 = IafMapUtils.dmsToDecimal(13, 11, 58, "N");
            const decimalLngT1 = IafMapUtils.dmsToDecimal(77, 42, 24, "E");

            const expectedDecimalLatT1 = 13.199444;
            const expectedDecimalLngT1 = 77.706667;

            if (roundTo(decimalLatT1) === roundTo(expectedDecimalLatT1) && roundTo(decimalLngT1) === roundTo(expectedDecimalLngT1)) {
              console.log("✅ BIAL T1 Decimal conversion test passed");
            } else {
              console.error("❌ BIAL T1 Decimal conversion test failed");
              console.error(`    Lat: Expected "${expectedDecimalLatT1}", but got "${decimalLatT1}"`);
              console.error(`    Lng: Expected "${expectedDecimalLngT1}", but got "${decimalLngT1}"`);
            }

            // Convert back to DMS
            const { latDMS, lngDMS } = IafMapUtils.decimalToDMS(decimalLatT1, decimalLngT1);

            const expectedLatDMS = "13° 11' 58.00\" N";
            const expectedLngDMS = "77° 42' 24.00\" E";

            if (latDMS === expectedLatDMS && lngDMS === expectedLngDMS) {
              console.log("✅ BIAL T1 DMS conversion test passed");
            } else {
              console.error("❌ BIAL T1 DMS conversion test failed");
              console.error(`    Lat: Expected "${expectedLatDMS}", but got "${latDMS}"`);
              console.error(`    Lng: Expected "${expectedLngDMS}", but got "${lngDMS}"`);
            }
          }

          // Run the tests
          testBIALT2();
          testBIALT1();

          console.groupEnd();
        }}
        width='100%' 
        height="18px"
      ></IafButton>     
      <IafButton
        title="Model Composer"
        tooltipTitle={TooltipStore.Empty}
        onClick={() => {
          props.viewer.props.graphicsResources._printLayerGraphicsNodeCounts()
        }}
        width='100%' 
        height="18px"
      ></IafButton>
      <IafButton
        title="Unit Tests - Security"
        tooltipTitle="Test IafResourceUtils.loadJs with and without authentication tokens"
        onClick={async () => {
          await IafResourceUtils.dbUnitTestsLoadScripts(IafResourceUtils.getGraphicsServiceOrigin());
        }}
        width='100%' 
        height="18px"
      ></IafButton>
      <IafButton
        title="Model Composer - Disciplines"
        tooltipTitle={TooltipStore.Empty}
        onClick={() => {
          modelComposerEligiblityTest()
        }}
         width='100%' 
        height="18px"
      ></IafButton>
      <IafButton
        title="Model Composer - Generate Benchmarks"
        tooltipTitle={TooltipStore.Empty}
        onClick={() => {
          generateModelComposerBenchmark(props.viewer)
        }}
         width='100%' 
        height="18px"
      ></IafButton>
      <IafImportJson
          title="Model Composer - Compare Benchmarks"
          tooltipTitle="Import Benchmark JSON"
          width="100%"
          height="18px"
          onImport={async (jsonData, err)=>{
              if (err) {
                console.error("Benchmark import failed:", err);
                return;
              }
              try {
                await executeModelComposerComparsion(props.viewer, {
                  previousBenchmark: jsonData
                });
              } catch (e) {
                console.error("Benchmark comparison failed:", e);
              }
            }
          }
      />
    </IafSubHeader>            
  )  
  
  let permission = (
    <IafSubHeader title="Permissions" minimized={true}>
        <div style={{marginBottom:'10px'}}>
            <IafSwitch
                  title={"Enforce Permission"}
                  isChecked={props.viewer.state.enforcePermission}
                  name="enforcePermission"
                  onChange={handleEnforcePermission}
                  showValue={false}
             />
        </div>
       {props.viewer.state.enforcePermission && <PermissionManager iafViewer={props.viewer}/>}
    </IafSubHeader>
  )

  let layout = (
    <IafSubHeader title="Unit Tests - Layout" minimized={true}>   
      <IafSlider
        id="widthSlider" // Assign ID to reference in update function
        disabled={!props.enableCuttingPlanes}
        min={0}
        max={100}
        align="left"
        value={100} // Default width; can be changed
        label={100} // Display default value
        onChange={handleWidthChange} // Call update on change
        step={1}
        title="Width"
        tooltipText="Adjust width"
      />
      <IafSlider
        id="heightSlider" // Assign ID to reference in update function
        disabled={!props.enableCuttingPlanes}
        min={0}
        max={100}
        align="left"
        value={100} // Default height; can be changed
        label={100} // Display default value
        onChange={handleHeightChange} // Call update on change
        step={1}
        title="Height"
        tooltipText="Adjust height"
      />
      <IafSwitch
          title={isLayoutMaximized ? "Maximize Layout" : "Minimize Layout"}
          isChecked={isLayoutMaximized}
          name="layoutToggle"
          onChange={handleLayoutChange}
          showValue={true}
      />
    </IafSubHeader>     
  )
  let modelComposition = (
      <IafSubHeader title="Unit Tests - ModelComposition" minimized={true}>   
        <IafTaggedListDemo/>
      </IafSubHeader>     
  )

  let cameraInfo = (
    <IafSubHeader title="Camera" minimized={true}>
        <div className={styles.devtoolsStats}>
          {camera && (
          <ul className={styles.mainUl}>
            {/* <IafPoint3d
              title = "Position"
              point3d = {camera._position}
            />
            <IafPoint3d
              title = "Target"
              point3d = {camera._target}
            /> */}
            {/* <IafPoint3d
              title = "Up"
              point3d = {camera._up}
            /> */}
            {/* <IafInputNumber
              label = "Width"
              value = {camera._width}
            /> */}
            <IafInputNum
              label = "Width"
              value = {newCamera._width}
              onChange = {handleCameraWidthChange}
            />
            {/* <IafInputNumber
              label="Height"
              value={camera._height}
            /> */}
            <IafInputNum
              label = "Height"
              value = {newCamera._height}
              onChange = {handleCameraHeightChange}
            />
            <IafInputNumber
              label="Projection"
              value={camera._projection}
            />
            {/* <IafInputNumber
              label="Near Limit"
              value={camera._nearLimit}
            /> */}
            <IafInputNum
              label = "FoV"
              value = {newCamera._fov}
              onChange = {handleFovInputChange}
            />
            <IafInputNum
              label = "Near Limit"
              value = {newCamera._nearLimit}
              onChange = {handleCameraNearLimitChange}
            />
            <IafInputNumber
              label="Camera Flags"
              value={camera._cameraFlags}
            />
          </ul>
            )}
        </div>
        <div style={{marginBottom:'10px',order:1}}>
          {camera && (
            <IafInputPoint3d
              title = "Position"
              value = {newCamera._position}
              onChange = {handlePositionInputChange}
            />
          )}
        </div>
        <div style={{marginBottom:'10px',order:2}}>
          {camera && (
            <IafInputPoint3d
              title = "Target"
              value = {newCamera._target}
              onChange = {handleTargetInputChange}
            />
          )}
        </div>
        <div style={{marginBottom:'10px',order:2}}>
          {camera && (
            <IafInputPoint3d
              title = "Up"
              value = {newCamera._up}
              onChange = {handleUpInputChange}
            />
          )}
        </div>
        <IafSwitch
                title={"Show Vector"}
                isChecked={isCameraVectorEnabled}
                name="isCameraVectorEnabled"
                onChange={handleCameraVector}
                showValue={true}
                // customTitleStyles={{fontSize: '14px', fontWeight: 'bold'}}
            />
        <div style={{marginBottom:'10px',order:3}}>
          <IafSwitch
                title={"Revamped zoom :"}
                isChecked={isZoomOptimized}
                name="isZoomOptimized"
                onChange={handleZoomChange}
                showValue={true}
                // customTitleStyles={{fontSize: '14px', fontWeight: 'bold'}}
            />
        </div>
        <div style={{marginBottom:'10px',order:3}}>
            <IafSwitch
                  title={"Show Sandbox"}
                  isChecked={props.viewer.state.showSandbox}
                  name="showSandbox"
                  onChange={handleSandboxChange}
                  showValue={true}
                  // customTitleStyles={{fontSize: '14px', fontWeight: 'bold'}}
             />
        </div>
        <div style={{marginBottom:'10px',order:4}}>
            <IafSwitch
                  title={"Show 2D PDF"}
                  isChecked={props.viewer.state.showPDF}
                  name="showPDF"
                  onChange={handleShowPDF}
                  showValue={true}
                  // customTitleStyles={{fontSize: '14px', fontWeight: 'bold'}}
             />
        </div>
        {camera && (<button style={{order:3,margin:'auto'}} onClick={applyEffects}>Apply</button>)}
    </IafSubHeader>
  )

  let markupBtns = (
    <div>
      <IafSubHeader title = "Markups" minimized={true}>
          <IafButton
            title="Save Markups To Cache"
            tooltipTitle={TooltipStore.MarkupSaveToCache}
            onClick={handleSaveCurrentMarkup}
            width='100%' 
            height="18px"
          ></IafButton>
          <IafButton
            title="Load Markups From Cache"
            tooltipTitle={TooltipStore.MarkupLoadFromCache}
            onClick={handleLoadMarkupsFromCache}
            width='100%' 
            height="18px"
          ></IafButton>
          <IafButton
            title="Clear Markups from Cache"
            tooltipTitle={TooltipStore.MarkupClearCache}
            onClick={handleClearMarkups}
            width='100%' 
            height="18px"
          ></IafButton>
          <IafButton
            title="Export Markups (Download)"
            tooltipTitle={TooltipStore.MarkupExportOrDownload}
            onClick={handleExportCurrentMarkups}
            width='100%' 
            height="18px"
          ></IafButton>          
          <IafImportJson 
            title="Import Markups"
            tooltipTitle={TooltipStore.MarkupImport}
            width='100%' 
            height="18px"
            onImport={handleImportMarkupJson}
          ></IafImportJson>
      </IafSubHeader>
    </div>
  )

  let annotationBtns = (
    <div>
      <IafSubHeader title = "Annotations" minimized={true}>
          <IafButton
            title="Save Annotations To Cache"
            tooltipTitle={TooltipStore.AnnotationsSaveToCache}
            onClick={handleSaveCurrentAnnotations}
            width='100%' 
            height="18px"
          ></IafButton>
          <IafButton
            title="Load Annotations From Cache"
            tooltipTitle={TooltipStore.AnnotationsLoadFromCache}
            onClick={handleLoadCurrentAnnotations}
            width='100%' 
            height="18px"
          ></IafButton>
          <IafButton
            title="Clear Annotations From Cache"
            tooltipTitle={TooltipStore.AnnotationsClearFromCache}
            onClick={handleResetToDefaultAnnotations}
            width='100%' 
            height="18px"
          ></IafButton>
          <IafButton
            title="Export Annotations (Download)"
            tooltipTitle={TooltipStore.AnnotationsExportOrDownload}
            onClick={handleExportCurrentAnnotations}
            width='100%' 
            height="18px"
          ></IafButton>          
          <IafImportJson 
            title="Import Annotations"
            tooltipTitle={TooltipStore.AnnotationsImport}
            width='100%' 
            height="18px"
            onImport={handleImportAnnotationJson}
          ></IafImportJson>           
      </IafSubHeader>
    </div>
  )
 
  return (
    <div>
      <IafHeading
        title={props.title}
        showContent={props.showContent}
        showContentMethod={props.showContentMethod}
        onClose={panelClose}
        panelCount={props.panelCount}
      >
        <div>
        {<GltfTools iafViewer={props.viewer}/>}
        {modelBoundingInfo}
        {performanceInfo}
        {customGeometry}
        {gridHelper}
        {viewInfo}
        {cameraInfo}
        {permission}
        {/* {gisTools} */}
        {/* {measurementTools} */}
        {/* {testList} */}
        {/* {markupBtns} */}
        {!isEnableDBStorageEnabled && annotationBtns}
        {animationTools}
        {unitTests}
        {layout}
        {modelComposition}
        {<GisButtons iafViewer={props.viewer}/>}
        <GraphicsResourcesCache iafViewer={props.viewer}/>
        </div>
      </IafHeading>
    </div>
  );
}
