// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 16-05-23    HSK        PLAT-2730   Revamped IafViewer Panels                                   
// 16-05-23    ATK        PLAT-281    Restructuring
// 24-05-23    HSK        PLAT-2730   Revamed IafViewer Panels - Cutting Planes
// 31-05-23    HSK                    Updated IafSwitch isChecked value by adding updateSettingstate
// 05-06-23    HSK                    Added panelClose call   
// 06-06-23    HSK                    Added functionality to handle toggle between mouse and keyboard walk
// 13-06-23    HSK        PLAT-2728   Revamped IafViewer Coloring Mechanism
// 26-06-23    HSK                    Replaced viewer.view with viewer._viewer.view for camera information retrieval.
// 27-06-23    HSK                    Implemented face select and line select as different functionalities
// 30-08-23    HSK        PLAT-3233   Resolved save camera issue, Added tooptip for buttons and updated css for save current view and reset to default view buttons
// 25-09-23    HSK                    Used tooltipText property for sliders
// 14-09-23    HSK                    Added label for slider and changed values to local state
// 10-10-23    ATK                    Reshuffle the Settings Panel Options
// 16-10-23    HSK                    Used IafList for demo
// 02-11-23    ATK        PLAT-3427   Linked Models UX Testing out  
// 11-12-23    ATK                    Build Failure on Linux                             
// 18-01-24    HSK        PLAT-3521   Added Switch to control 2d/3d synchronisation 
// 29-01-24    HSK        PLAT-4097   Add generic(low level) components IafInputNumber and IafInputPoint3D                         
// 12-03-24    HSK        PLAT-4347   In Settings Panel / Save Current (View) added a generic (common) entry to local storage for all projects, which is project id specific.                         
// 01-04-24    HSK        PLAT-4428   Implemented when one child is preset in panel and if we hit close button it will close and not minimize.
// 26-07-24    HSK        PLAT-5028   Settings Panel options should auto apply without having to hit Apply.
// -------------------------------------------------------------------------------------

import React, { useRef, useEffect, useState } from "react";
import styles from "./SettingPanel.module.scss";

import { IafHeading } from "../../component-low/iafHeading/IafHeading.jsx";
import { IafSwitch } from "../../component-low/iafSwitch/IafSwitch.jsx";
import { IafDropdown } from "../../component-low/iafDropdown/IafDropdown.jsx";
import { IafSubHeader } from "../../component-low/iafSubHeader/IafSubHeader.jsx";
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
import { IafSlider } from "../../component-low/iafSlider/IafSlider.jsx";
import ColorPicker from "../../component-low/IafColorPicker/ColorPicker.jsx";
import TooltipStore from "../../../store/tooltipStore.js";
import IafUtils, { IafStorageUtils } from "../../../core/IafUtils.js";
import IafViewer from "../../../IafViewer.jsx";
import { IafDatabaseManager } from "../../../core/database/IafDatabaseManager.js";
import { IafGeomUtils } from "../../../core/IafGeomUtils.js";
import { IafMathUtils } from "../../../core/IafMathUtils.js";
import { IafUiEvent, iafUiEventBus } from "../../iafUiEvents.js";
import PropertyStore from "../../../store/propertyStore.js";

export function SettingPanel({ title, viewer,showContent, onClose, color,showContentMethod, panelCount }) {
  // Initialize defaultFederationType from viewer.state.settings (which comes from props.settings)
  // Same pattern as isSingleChannelMode - it initializes from viewer.state.settings
  // Ensure isSingleChannelMode is always a boolean to prevent uncontrolled/controlled switch warning
  const [updateSettingstate, setState] = useState({
    ...viewer.state.settings,
    isSingleChannelMode: viewer.state.settings?.isSingleChannelMode ?? 
      (typeof localStorage !== 'undefined' && localStorage.iafviewer_settings 
        ? JSON.parse(localStorage.iafviewer_settings)?.isSingleChannelMode ?? false
        : false),
    defaultFederationType: viewer.state.settings?.defaultFederationType ?? 
      (typeof localStorage !== 'undefined' && localStorage.iafviewer_settings 
        ? JSON.parse(localStorage.iafviewer_settings)?.defaultFederationType 
        : (viewer.props?.modelComposition?.defaultFederationType ?? 
           PropertyStore.modelComposition.defaultFederationType ?? 
           "SingleModel"))
  });
  const [walkMouse,setWalkMouse] = useState(false);
  const [walkKeyboard,setWalkKeyboard] = useState(false);
  const isInitialRender = useRef(true);

  // Common States
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const groundCoverageInMm = viewer.props.graphicsResources?.getGroundCoverageInMm?.() ?? 0;
  const groundCoverageInMeters = IafMathUtils.mm2m(groundCoverageInMm);

  // Grid Helper States
  const [isEnableRectangularGrid, setIsEnableRectangularGrid] = useState(false);
  const [isEnableAxesAsLines, setIsEnableAxesAsLines] = useState(false);
  const [isEnableAxesAs3dPoles, setIsEnableAxesAs3dPoles] = useState(false);
  const [isEnableViewVectorFrustum, setIsEnableViewVectorFrustum] = useState(false);
  const [gridHelperSizeInMeters, setgridHelperSizeInMeters] = useState(groundCoverageInMeters * 3);
  const [gridHelperStepSizeInMeters, setgridHelperStepSizeInMeters] = useState(10);
  const [isEnableCustomCube, setIsEnableCustomCube] = useState(false);  

  /** @type {IafViewer} */
  const iafViewer = viewer;
  /** @type {IafDatabaseManager} */
  const iafDatabaseManager = iafViewer.iafDatabaseManager;

  function debounce(func, delay) {
    let debounceTimer
    return function () {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => func(), delay)
    }
  }

  const clear = async () => {
    viewer.userToolsRectangularGridNodeId && await IafGeomUtils.deleteGeom(viewer, viewer.userToolsRectangularGridNodeId);
    viewer.userToolsRectangularGridNodeId = null;

    viewer.userToolsAxesAsLinesNodeId && await IafGeomUtils.deleteGeom(viewer, viewer.userToolsAxesAsLinesNodeId);
    viewer.userToolsAxesAsLinesNodeId = null;

    viewer.userToolsAxesAs3dPolesNodeIds && await IafGeomUtils.deleteGeoms(viewer, viewer.userToolsAxesAs3dPolesNodeIds);
    viewer.userToolsAxesAs3dPolesNodeIds = null;

    viewer.userToolsViewVectorFrustumNodeId && await IafGeomUtils.deleteGeom(viewer, viewer.userToolsViewVectorFrustumNodeId);
    viewer.userToolsViewVectorFrustumNodeId = null;

    viewer.userToolsLinkedModelBoxForFrustumIntersectionNodeId && await IafGeomUtils.deleteGeom(viewer, viewer.userToolsLinkedModelBoxForFrustumIntersectionNodeId);
    viewer.userToolsLinkedModelBoxForFrustumIntersectionNodeId = null;
  }

  useEffect(() => {
    IafUtils.devToolsIaf && console.log("SettingPanel Mounted");

    return () => {
      clear();
      IafUtils.devToolsIaf && console.log("SettingPanel Unmounted");
    };
  }, []); // Empty dependency array ensures it runs only on mount & unmount
  
  useEffect(()=>{
    if(updateSettingstate.walkMode === 0){
      setWalkMouse(true);
      setWalkKeyboard(false);
    }
    if(updateSettingstate.walkMode === 1){
      setWalkMouse(false);
      setWalkKeyboard(true);
    }
    
    if (isInitialRender.current) {
      isInitialRender.current = false; // Set to false after the first render
      return; // Exit early to prevent calling debounce on the first render
    }
    debounce(viewer.loadSettings(updateSettingstate,false), 200)
  },[updateSettingstate])
  
  //This function is used to close the panel. It calls the onClose function with the parameter 'settingPanel'
  function panelClose(){
    onClose('settingPanel');
  }
  function handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    let checkboxFields = [
      "isTriad",
      "isNavCube",
      "isHighlightLineSelection",
      "isBackface",
      "isBloom",
      "isAmbientOcclusion",
      "isSilhouette",
      "isReflection",
      "isShadow",
      "isShadowInteractive",
      "isSaveCamera",
      "isGlassXray",
      "isBimWalk",
      "isCollisionDetection",
      "isSynchronisationActive",
      "isUtilitiesActive",
      "isGisDistanceScale",
      "isModelCacheEnabled",
      "isVerticalGeoAlignmentEnabled",
      "isSingleChannelMode"
    ];
    var value = checkboxFields.includes(name) ? target.checked : target.value;

    setState({
      ...updateSettingstate,
      [name]: value,
      hasChanges: true,
    });

    const postprocess = () => {
      if (name === "isModelCacheEnabled") {
        viewer.props.graphicsResources?.updateBoundingBox("SettingPanel.EnableModelCache");
      }
    }

    setTimeout(()=> postprocess(), 10);

    IafUtils.devToolsIaf && console.log("updateState", updateSettingstate);
  }

  // Effect to monitor model loading and enable persistence status
  useEffect(() => {
    if (viewer?.state?.view3d?.isLoaded) {
      setIsModelLoaded(true); // Mark model as loaded
    } else {
      setIsModelLoaded(false); // Disable during model loading
    }
  }, [viewer.state.view3d.isLoaded]);

  // Grid Helper Handler
  const handleEnableRectangularGrid = async (event) => {
    const { checked } = event.target;

    if (checked) {
      viewer.userToolsRectangularGridNodeId = await IafGeomUtils.createRectangularGrid(viewer, gridHelperSizeInMeters * 1000, {stepSizeInMm: gridHelperStepSizeInMeters * 1000});
    } else {
      await IafGeomUtils.deleteGeom(viewer, viewer.userToolsRectangularGridNodeId);
      viewer.userToolsRectangularGridNodeId = null;
    }

    setIsEnableRectangularGrid(checked);
  }

  // Grid Helper Handler
  const handleEnableAxesAsLines = async (event) => {
    const { checked } = event.target;

    if (checked) {
      viewer.userToolsAxesAsLinesNodeId = await IafGeomUtils.create3dAxesAsLines(viewer, gridHelperSizeInMeters * 1000);
    } else {
      await IafGeomUtils.deleteGeom(viewer, viewer.userToolsAxesAsLinesNodeId);
      viewer.userToolsAxesAsLinesNodeId = null;
    }

    setIsEnableAxesAsLines(checked);
  }  

  // Grid Helper Handler
  const handleEnableAxesAs3dPoles = async (event) => {
    const { checked } = event.target;

    if (checked) {
      viewer.userToolsAxesAs3dPolesNodeIds = await IafGeomUtils.create3dAxesAs3dPoles(viewer, gridHelperSizeInMeters * 1000);
    } else {
      await IafGeomUtils.deleteGeoms(viewer, viewer.userToolsAxesAs3dPolesNodeIds);
      viewer.userToolsAxesAs3dPolesNodeIds = null;
    }

    setIsEnableAxesAs3dPoles(checked);
  }    
  
  // Grid Helper Handler
  const handleEnablegridHelperStepSizeInMeters = async (event, newValue, name) => {
    IafUtils.devToolsIaf && console.log('handleEnablegridHelperSizeInMeters', newValue);

    if (isEnableRectangularGrid) {
      viewer.userToolsRectangularGridNodeId && await IafGeomUtils.deleteGeom(viewer, viewer.userToolsRectangularGridNodeId);
      viewer.userToolsRectangularGridNodeId = null;
      viewer.userToolsRectangularGridNodeId = await IafGeomUtils.createRectangularGrid(viewer, gridHelperSizeInMeters * 1000, {stepSizeInMm: newValue * 1000});  
    }

    setgridHelperStepSizeInMeters(newValue);
  }

  // Grid Helper Handler
  const handleEnablegridHelperSizeInMeters = async (event, newValue, name) => {
    IafUtils.devToolsIaf && console.log('handleEnablegridHelperSizeInMeters', newValue);
    setgridHelperSizeInMeters(newValue);

    if (isEnableRectangularGrid) {
      viewer.userToolsRectangularGridNodeId && await IafGeomUtils.deleteGeom(viewer, viewer.userToolsRectangularGridNodeId);
      viewer.userToolsRectangularGridNodeId = null;
      viewer.userToolsRectangularGridNodeId = await IafGeomUtils.createRectangularGrid(viewer, newValue * 1000, {stepSizeInMm: gridHelperStepSizeInMeters * 1000});  
    }

    if (isEnableAxesAsLines) {
      viewer.userToolsAxesAsLinesNodeId && await IafGeomUtils.deleteGeom(viewer, viewer.userToolsAxesAsLinesNodeId);
      viewer.userToolsAxesAsLinesNodeId = null;
      viewer.userToolsAxesAsLinesNodeId = await IafGeomUtils.create3dAxesAsLines(viewer, newValue * 1000);  
    }

    if (isEnableAxesAs3dPoles) {
      viewer.userToolsAxesAs3dPolesNodeIds && await IafGeomUtils.deleteGeoms(viewer, viewer.userToolsAxesAs3dPolesNodeIds);
      viewer.userToolsAxesAs3dPolesNodeIds = null;
      viewer.userToolsAxesAs3dPolesNodeIds = await IafGeomUtils.create3dAxesAs3dPoles(viewer, newValue * 1000);  
    }

    if (isEnableViewVectorFrustum) {
      viewer.userToolsViewVectorFrustumNodeId && await IafGeomUtils.deleteGeom(viewer, viewer.userToolsViewVectorFrustumNodeId);
      viewer.userToolsViewVectorFrustumNodeId = null;
      viewer.userToolsViewVectorFrustumNodeId = await IafGeomUtils.create3dViewVectorFrustum(viewer, newValue * 1000);

      viewer.userToolsLinkedModelBoxForFrustumIntersectionNodeId && await IafGeomUtils.deleteGeom(viewer, viewer.userToolsLinkedModelBoxForFrustumIntersectionNodeId);
      viewer.userToolsLinkedModelBoxForFrustumIntersectionNodeId = null;
      viewer.userToolsLinkedModelBoxForFrustumIntersectionNodeId = await IafGeomUtils.createLinkedModelBoxForFrustumIntersection(viewer, viewer.modelBounding, newValue * 1000);
    }
  }

  // Grid Helper UI
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
          min={groundCoverageInMeters}
          max={groundCoverageInMeters * 10}
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
          max={100}
          value={gridHelperStepSizeInMeters } 
          onChange={handleEnablegridHelperStepSizeInMeters} 
          label={-gridHelperStepSizeInMeters } 
          showValue={true}
          tooltipText = {TooltipStore.Empty}
          disabled = {!isModelLoaded}
          step={1}
        ></IafSlider>
      </IafSubHeader>
    )   
  )      

 // Handle the walk event, updating the state and variables based on the checkbox selection
 function handleWalk(event) {
  const { checked, name } = event.target;

  let walkMode = 0;
  let walkMouse = false;
  let walkKeyboard = false;

  if (name === 'walkMouse' && checked) {
    walkMode = 0;
    walkMouse = true;
    walkKeyboard = false;
  } else if (name === 'walkKeyboard' && checked) {
    walkMode = 1;
    walkMouse = false;
    walkKeyboard = true;
  } else if (name === 'walkMouse' && !checked) {
    walkMode = 1;
    walkMouse = false;
    walkKeyboard = true;
  } else if (name === 'walkKeyboard' && !checked) {
    walkMode = 0;
    walkMouse = true;
    walkKeyboard = false;
  }
  
  setWalkMouse(walkMouse);
  setWalkKeyboard(walkKeyboard);

  setState({
    ...updateSettingstate,
    walkMode,
    hasChanges: true,
  });
}

  function handleSliderInputChange(event, newValue, targetName) {
    setState({
      ...updateSettingstate,
      [targetName]: newValue,
      hasChanges: true,
    });
    IafUtils.devToolsIaf && console.log("updateState", updateSettingstate);
  }
  function handleGlassOpacityChange(event, newValue, targetName){
    if(viewer.props?.spaceElementIds?.length > 0 || viewer.props?.sliceElementIds?.length > 0){
      viewer?._viewer?.view?.setXRayOpacity(newValue, Communicator.ElementType.Faces);
    }
    handleSliderInputChange(event, newValue, targetName)
  }

  const handleColorChange = (name, color) => {
    setState({
      ...updateSettingstate,
      [name]: color,
      hasChanges: true,
    });
  };
  function updateSettings(saveSettingsFlag) {
    viewer.loadSettings(updateSettingstate, saveSettingsFlag)
      .catch((err) => {
        console.error('SettingPanel: Failed to cache settings', err);
      });
    setState({
      ...updateSettingstate,
      hasChanges: false,
    });
  }

  function handleCameraPositionSaveClick(e) {
    let currentcamera = viewer._viewer.view.getCamera();
    let jsoncamera = currentcamera.toJson();
    let settings
    if (localStorage.getItem("iafviewer_settings")) {
      setState({
        ...updateSettingstate,
        initialCameraPosition: { ...JSON.parse(localStorage.getItem("iafviewer_settings")).initialCameraPosition, [viewer.props.modelVersionId]: jsoncamera},
      });
      settings = {
        initialCameraPosition: { ...JSON.parse(localStorage.getItem("iafviewer_settings")).initialCameraPosition, [viewer.props.modelVersionId]: jsoncamera}
      }
    } else {
      setState({
        ...updateSettingstate,
        initialCameraPosition: {[viewer.props.modelVersionId]: jsoncamera},
      });
      settings = {
        initialCameraPosition: {[viewer.props.modelVersionId]: jsoncamera}
      }
    }

    // Save Annotations
    // IafStorageUtils.saveAnnotations(viewer);

    // Complete any database requests
    iafDatabaseManager.processQueues();
    
    // Save GIS
    IafStorageUtils.clearGisDataLocalStorage(viewer);
    IafStorageUtils.saveGisData(viewer);
  }

  function handleResetToDefaultView() {
    // ATK General Fix - Following is not the right place to clear Annotations and GIS
    //   // Clear Annotations
    //   IafStorageUtils.clearAnnotations(viewer);
    //   IafStorageUtils.clearAnnotationsLocalStorage(viewer);
      
    //  // Clear GIS
    //  IafStorageUtils.clearGisDataLocalStorage(viewer);
    //  IafStorageUtils.clearGisData(viewer);
   
    // ATK PLG-1600: Support Ticket - Marty - GIS - Custom home View does not work
    if (iafViewer.state.gis.enable) {
      iafViewer.gisInstance?.resetAll();
      return;
    }

    var camera = viewer._viewer.view.getCamera();
    var target = viewer._viewer.view._initialCamera.getTarget();
    var position = viewer._viewer.view._initialCamera.getPosition();
    var height = viewer._viewer.view._initialCamera.getHeight();
    var width = viewer._viewer.view._initialCamera.getWidth();
    var up = viewer._viewer.view._initialCamera.getUp();
    camera.setTarget(target);
    camera.setPosition(position);
    camera.setHeight(height);
    camera.setWidth(width);
    camera.setUp(up);
    viewer._viewer.view.setCamera(camera);

  }

  async function handleSelectedUnit(event) {
    let multiplier = 12.0 * 25.4;
    switch (event.target.value) {
      case "millimeter(mm)":
      case "mm":
        multiplier = 1;
        break;

      case "centimeter(cm)":
      case "cm":
        multiplier = 10;
        break;

      case "meter(m)":
      case "m":
        multiplier = 1000;
        break;

      case "yard(yd)":
      case "yard":
        multiplier = 3.0 * 12.0 * 25.4;
        break;

      case "foot(ft)":
      case "ft":
        multiplier = 12.0 * 25.4;
        break;

      case "inch(in)":
      case "in":
        multiplier = 25.4;
        break;

      default:
        multiplier = 12.0 * 25.4;
    }

    setState({
      ...updateSettingstate,
      prevSelectdUnits: event.target.value,
      multiplier: multiplier,
      hasChanges: true,
    });
  }
  const {
    hasChanges,
    isTriad,
    isNavCube,
    isHighlightLineSelection,
    hiddenLineOpacity,
    isBackface,
    projectionMode,
    isGlassXray,
    frameRate,
    isAmbientOcclusion,
    ambientOcclusionRadius,
    isSilhouette,
    isReflection,
    isBloom,
    bloomIntensityScale,
    bloomThreshold,
    isShadow,
    isShadowInteractive,
    shadowBlurSamples,
    isSaveCamera,
    walkMode,
    isBimWalk,
    isCollisionDetection,
    streamCutoffScale,
    initialCameraPosition,
  } = viewer.state.settings;

  const {
    topBgColor,
    bottomBgColor,
    bdSelectColor,
    faceSelectColor,
    lineSelectColor,
    measureColor,
  } = viewer.state.settings;

  const measurementUnits = [
    {
      label: "Metric Units",
      options: [
        { label: "millimeter(mm)", value: "millimeter(mm)" },
        { label: "centimeter(cm)", value: "centimeter(cm)" },
        { label: "meter(m)", value: "meter(m)" },

      ],
    },
    {
      label: "Imperial Units",
      options: [
        { label: "inch(in)", value: "inch(in)" },
        { label: "foot(ft)", value: "foot(ft)" },
        { label: "yard(yd)", value: "yard(yd)" },

      ],
    },
  ];       

  return (
    <div>
      <IafHeading title={title} showContent={showContent} showContentMethod={showContentMethod} onClose={panelClose} color={color} panelCount={panelCount}>
        <div>
          <IafSubHeader title="General">
            <IafDropdown
              showTitle={true}
              title="Display Units"
              value={updateSettingstate.prevSelectdUnits}
              label={updateSettingstate.prevSelectdUnits}
              onChange={handleSelectedUnit}
              data={measurementUnits}
            ></IafDropdown>
            <IafSwitch
                title="Sync Inactive 2D Sheets"
                isChecked={updateSettingstate.isSynchronisationActive}
                name="isSynchronisationActive"
                onChange={handleInputChange}
            ></IafSwitch>
             <IafSwitch
                title="Utilities"
                isChecked={updateSettingstate.isUtilitiesActive}
                name="isUtilitiesActive"
                onChange={handleInputChange}
            ></IafSwitch>
          </IafSubHeader>
          <IafSubHeader title="Performance">
            <IafSlider
              title="Framrate(fps)"
              min={0}
              max={100}
              id="frameRateInput"
              value={updateSettingstate.frameRate}
              label={updateSettingstate.frameRate}
              name="frameRate"
              onChange={handleSliderInputChange}
              step={1}
              showValue={true}
              tooltipText = {TooltipStore.FramerateSlider}
            ></IafSlider>            
            <IafSlider
              title="Stream Cutoff Scale"
              min={0}
              max={2}
              step={0.1}
              id="streamCutoffScale"
              value={updateSettingstate.streamCutoffScale}
              label={updateSettingstate.streamCutoffScale}
              name="streamCutoffScale"
              onChange={handleSliderInputChange}
              showValue={true}
              tooltipText = {TooltipStore.StreamCutoffScaleSlider}
            ></IafSlider>
            <IafSlider
              title="Glass Opacity"
              min={0}
              max={1}
              step={0.001}
              id="glassOpacity"
              name="glassOpacity"
              value={updateSettingstate.glassOpacity}
              label={updateSettingstate.glassOpacity}
              onChange={handleGlassOpacityChange}
              showValue={true}
              tooltipText={TooltipStore.Empty}
            ></IafSlider>
            <IafSwitch
                title="GIS Distance Scale"
                isChecked={updateSettingstate.isGisDistanceScale}
                name="isGisDistanceScale"
                onChange={handleInputChange}
            ></IafSwitch>
            <IafSwitch
                title="Enable Model Cache"
                isChecked={updateSettingstate.isModelCacheEnabled}
                name="isModelCacheEnabled"
                onChange={handleInputChange}
                disabled={viewer.state.isGisEnabled}
            ></IafSwitch>            
            <IafSwitch
                title={"Vertical Geo Alignment"} // PLG-1196: Review Vertically Aligned Models, VM Ware Vista
                isChecked={updateSettingstate.isVerticalGeoAlignmentEnabled}
                name="isVerticalGeoAlignmentEnabled"
                onChange={handleInputChange}
                disabled={viewer.state.isGisEnabled}
            />
            <IafSwitch // ATK PLG-1643: UX - Review Single Channel as a Setting in the Settings Pane
                title="Single Streaming Channel" 
                isChecked={updateSettingstate.isSingleChannelMode}
                name="isSingleChannelMode"
                onChange={handleInputChange}
            ></IafSwitch>
            <IafDropdown
              showTitle={true}
              title="Default Federation Type"
              value={updateSettingstate.defaultFederationType}
              label={updateSettingstate.defaultFederationType}
              onChange={handleInputChange}
              name="defaultFederationType"
              data={[
                {
                  label: "Federation Types",
                  options: [
                    { label: "Single Model", value: "SingleModel" },
                    { label: "Project", value: "Project" },
                    { label: "Multi Model", value: "MultiModel" }
                  ]
                }
              ]}
            ></IafDropdown>
          </IafSubHeader>          
        </div>
        <div>
          <IafSubHeader title="Ambient Occlusion" minimized = {true}>
            <IafSwitch
                title="Enable Ambient Occlusion"
                isChecked={updateSettingstate.isAmbientOcclusion}
                name="isAmbientOcclusion"
                onChange={handleInputChange}
            ></IafSwitch>
            <IafSlider
              title="Radius"
              id="ambientOcclusionRadius"
              min={0}
              step={0.01}
              value={updateSettingstate.ambientOcclusionRadius}
              label={updateSettingstate.ambientOcclusionRadius}
              name="ambientOcclusionRadius"
              onChange={handleSliderInputChange}
              showValue={true}
              tooltipText = {TooltipStore.RadiusSlider}
            ></IafSlider>
          </IafSubHeader>
          <IafSubHeader title="Bloom" minimized = {true}>
            <IafSwitch
              title="Enable Bloom"
              isChecked={updateSettingstate.isBloom}
              name="isBloom"
              onChange={handleInputChange}
              showValue={true}
            ></IafSwitch>
            <IafSlider
              title="Intensity Scale"
              id="bloomIntensityScale"
              min={0}
              step={0.1}
              value={updateSettingstate.bloomIntensityScale}
              label={updateSettingstate.bloomIntensityScale}
              name="bloomIntensityScale"
              onChange={handleSliderInputChange}
              showValue={true}
              tooltipText = {TooltipStore.IntensityScaleSlider}
            ></IafSlider>
            <IafSlider
              title="Threshold"
              id="bloomThreshold"
              min={0}
              max={1}
              step={0.05}
              value={updateSettingstate.bloomThreshold}
              label={updateSettingstate.bloomThreshold}
              name="bloomThreshold"
              onChange={handleSliderInputChange}
              showValue={true}
              tooltipText = {TooltipStore.ThresholdSlider}
            ></IafSlider>
          </IafSubHeader>
          <IafSubHeader title="Shadows" minimized = {true}>
            <IafSwitch
              title="Enable Shadows"
              isChecked={updateSettingstate.isShadow}
              name="isShadow"
              onChange={handleInputChange}
            ></IafSwitch>
            <IafSwitch
              title="Interactive"
              isChecked={updateSettingstate.isShadowInteractive}
              name="isShadowInteractive"
              onChange={handleInputChange}
            ></IafSwitch>
          </IafSubHeader>
          <IafSubHeader title="Effects" minimized = {true}>
            <IafSlider
              title="Hidden Line Opecity"
              id="hiddenLineOpacityInput"
              min={0}
              max={1}
              step={0.1}
              value={updateSettingstate.hiddenLineOpacity}
              label={updateSettingstate.hiddenLineOpacity}
              name="hiddenLineOpacity"
              onChange={handleSliderInputChange}
              showValue={true}
              tooltipText = {TooltipStore.HiddenLineOpacitySlider}
            ></IafSlider>
            <IafSwitch
              title="Silhouette Edges"
              isChecked={updateSettingstate.isSilhouette}
              name="isSilhouette"
              onChange={handleInputChange}
            ></IafSwitch>
            <IafSwitch
              title="Reflection Planes"
              isChecked={updateSettingstate.isReflection}
              name="isReflection"
              onChange={handleInputChange}
            ></IafSwitch>            
            <IafSlider
              title="Blur Samples"
              id="shadowBlurSamples"
              min={0}
              max={10}
              step={1}
              value={updateSettingstate.shadowBlurSamples}
              label={updateSettingstate.shadowBlurSamples}
              name="shadowBlurSamples"
              onChange={handleSliderInputChange}
              showValue={true}
              tooltipText = {TooltipStore.BlurSamplesSlider}
            ></IafSlider>
          </IafSubHeader>
        </div>
        <div>
          <IafSubHeader title="Axis" minimized = {true}>
            <IafSwitch
              title="Show Axis Triad"
              isChecked={updateSettingstate.isTriad}
              name="isTriad"
              onChange={handleInputChange}
            ></IafSwitch>
            <IafSwitch
              title="Show Nav Cube"
              isChecked={updateSettingstate.isNavCube}
              name="isNavCube"
              onChange={handleInputChange}
            ></IafSwitch>
          </IafSubHeader>
          {gridHelper}
        </div>

        <div>
          <IafSubHeader title="Walk" minimized = {true}>
            <IafSwitch
              title="Walk Mouse"
              name="walkMouse"
              isChecked={walkMouse}
              onChange={handleWalk}
            ></IafSwitch>
            <IafSwitch
              title="Bim Walk"
              isChecked={updateSettingstate.isBimWalk}
              name="isBimWalk"
              onChange={handleInputChange}
            ></IafSwitch>
            <IafSwitch
              title="Walk Keyboard"
              name="walkKeyboard"
              isChecked={walkKeyboard}
              onChange={handleWalk}
            ></IafSwitch>
            <IafSwitch
              title="Collision Detection"
              isChecked={updateSettingstate.isCollisionDetection}
              name="isCollisionDetection"
              onChange={handleInputChange}
            ></IafSwitch>
          </IafSubHeader>
        </div>


        <div>
          <IafSubHeader title="Background Color" minimized = {true}>
            <div id="wrapper" className={styles.wrapper}>
              <ColorPicker
                name="topBgColor"
                title="Top"
                currentColor={topBgColor}
                handleColorChange={handleColorChange}
              />
              <ColorPicker
                name="bottomBgColor"
                title="Bottom"
                currentColor={bottomBgColor}
                handleColorChange={handleColorChange}
              />
            </div>
            </IafSubHeader>

            <IafSubHeader title="Selection Color" minimized = {true}>
            <div id="wrapper">
              <ColorPicker
                name="bdSelectColor"
                title="Body"
                currentColor={bdSelectColor}
                handleColorChange={handleColorChange}
              />
              <ColorPicker
                name="lineSelectColor"
                title="Lines"
                currentColor={lineSelectColor}
                handleColorChange={handleColorChange}
              />
              <ColorPicker
                name="faceSelectColor"
                title="Faces"
                currentColor={faceSelectColor}
                handleColorChange={handleColorChange}
              />
              <ColorPicker
                name="measureColor"
                title="Measurement Color"
                currentColor={measureColor}
                handleColorChange={handleColorChange}
              />
            </div>
          </IafSubHeader>
        </div>

        <div>
          <IafSubHeader title = "View" minimized = {true}>
              <IafButton
                title="Save Current"
                tooltipTitle={TooltipStore.SaveCurrentView}
                onClick={handleCameraPositionSaveClick}
                width='100%' 
                height="18px"
              ></IafButton>
              <IafButton
                title="Reset To Default"
                tooltipTitle={TooltipStore.ResetToDefaultView}
                onClick={handleResetToDefaultView}
                width='100%' 
                height="18px"
              ></IafButton>
          </IafSubHeader>
        </div>
        <div>
          <IafSubHeader>
            <IafButton title="Cache Settings" width='100%' tooltipTitle={TooltipStore.ApplyAndSaveButton} onClick={()=>updateSettings(true)} ></IafButton>
            
          </IafSubHeader>
        </div>
      </IafHeading>
    </div>
  );
}
