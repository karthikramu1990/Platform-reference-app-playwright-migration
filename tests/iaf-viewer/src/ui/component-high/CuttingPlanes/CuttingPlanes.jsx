// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 24-05-23    HSK        PLAT-2730   Revamed IafViewer Panels - Cutting Planes
// 05-06-23    HSK                    Added panelClose call
// 13-06-23    HSK        PLAT-2728   Revamped IafViewer Coloring Mechanism
// 20-06-23    HSK                    Added Tooltip to Pick from Point Button
// 05-07-23    HSK                    Used Slider label to show value
// 25-09-23    HSK                    Used tooltipText property for sliders
// 20-11-23    HSK                    Added shift focus functionality,
//                                    Made focused planes independent function,
//                                    kept a default value for focused planes, 
//                                    returned function of focused mode if element is not selected
// 22-11-23    HSK                    Modified update function to expand whole model for all elements
// 23-11-23    HSK       PLAT-2347    Disabled other plane modes when one cutting plane mode is active
// 30-11-23    HSK       PLAT-2347    Notify error if elements are not selected
// 01-Dec-23   ATK       PLAT-3647    Notification Store
// 04-12-23    HSK       PLAT-3635    Cutting Plane Methods | Enable Checkboxes should not be disabled
// 05-12-23    ATK       PLAT-3632    Restructuring. Added @params show - to show/hide plane geometry
// 11-12-23    ATK       PLAT-3632    Restructuring. Retain Focus Plan Size. Focus Plane Slider Performance.
// 02-01-24    ATK                    Added event.persist() as Events are reused for async functions
// 01-04-24    HSK        PLAT-4428   Implemented when one child is preset in panel and if we hit close button it will close and not minimize.
// -------------------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import styles from './CuttingPlanes.module.scss';
import { ECuttingPlane,ESelectMode } from "../../../common/IafViewerEnums";
import { ToolbarIcons } from "../../toolbar.js";
import { IafHeading } from "../../component-low/iafHeading/IafHeading.jsx";
import { IafSubHeader } from "../../component-low/iafSubHeader/IafSubHeader.jsx";
import { IafSlider } from "../../component-low/iafSlider/IafSlider.jsx";
import { IafSwitch } from "../../component-low/iafSwitch/IafSwitch.jsx";
import IafTooltip from "../../component-low/Iaftooltip/IafTooltip.jsx";
import TooltipStore from "../../../store/tooltipStore.js";
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
import { NotificationStore } from "../../../store/notificationStore";
import { useIsFirstRender } from "../../../common/hooks/useIsFirstRender.jsx";
import { useLogChangedProperties } from "../../../common/hooks/useLogChangedProperties.jsx";
import IafUtils from "../../../core/IafUtils.js";

const TopPlaneSelect = {
  id: 'topPlaneSelect',
  planeId: ECuttingPlane.Top,
  icon: ToolbarIcons.iconSelect,
  tooltip: 'Pick a reference point from the model for Top Plane',
  title: 'Select Top Plane',
};
const BottomPlaneSelect = {
  id: 'bottomPlaneSelect',
  planeId: ECuttingPlane.Bottom,
  icon: ToolbarIcons.iconSelect,
  tooltip: 'Pick a reference point from the model for Bottom Plane',
  title: 'Select Bottom Plane',
};

const FrontPlaneSelect = {
  id: 'frontPlaneSelect',
  planeId: ECuttingPlane.Front,
  icon: ToolbarIcons.iconSelect,
  tooltip: 'Pick a reference point from the model for Front Plane',
  title: 'Select Front Plane',
};

const BackPlaneSelect = {
  id: 'backPlaneSelect',
  planeId: ECuttingPlane.Back,
  icon: ToolbarIcons.iconSelect,
  tooltip: 'Pick a reference point from the model for Back Plane',
  title: 'Select Back Plane',
};

const LeftPlaneSelect = {
  id: 'leftPlaneSelect',
  planeId: ECuttingPlane.Left,
  icon: ToolbarIcons.iconSelect,
  tooltip: 'Pick a reference point from the model for Left Plane',
  title: 'Select Left Plane',
};

const RightPlaneSelect = {
  id: 'rightPlaneSelect',
  planeId: ECuttingPlane.Right,
  icon: ToolbarIcons.iconSelect,
  tooltip: 'Pick a reference point from the model for Right Plane',
  title: 'Select Right Plane',
};
export function CuttingPlanes(props) {

  const [focusedPlane,setFocusedPlane] = useState(false);
  const [focusedPlaneSlider,setFocusedPlaneSlider] = useState(30);
  const [nodeBoundingValue,setNodeBoundingValue] = useState(0);
  const [focusPlanesSliderTimeoutHandler, setFocusPlanesSliderTimeoutHandler] = useState(null);
  useEffect(() => {
    if (!props.viewer) {
      setFocusedPlane(false);
      setNodeBoundingValue(0);
    }
  }, [props.viewer]);
  useEffect(() => {
    if(focusedPlane) {
      setFocusedPlane(false);
      setTimeout(()=>{
        NotificationStore.notifyGisFocusedPlanesReset(props.iafViewer);
      },0)
    }
  }, [props.enableMapBox]);

  // Use the hook to log if it is first render or subsequent render
  useIsFirstRender('IafViewer - CuttingPlanes', props);

  // PLG-1515: changedProps contains only primitives to avoid performance or crash on model switching. (no class instances or volatile objects)
  const changedProps = {
    title: props.title,
    enableMapBox: props.enableMapBox,
    panelCount: props.panelCount,
    displayToggle: props.displayToggle,
    enableCuttingPlanes: props.enableCuttingPlanes,
    topSliderValue: props.topSliderValue,
    bottomSliderValue: props.bottomSliderValue,
    frontSliderValue: props.frontSliderValue,
    backSliderValue: props.backSliderValue,
    leftSliderValue: props.leftSliderValue,
    rightSliderValue: props.rightSliderValue,
    showPlaneGeometry: props.showPlaneGeometry,
    modelBounding: props.modelBounding,
    selectOperatorId: props.selectOperatorId,
    showContent: props.showContent,
    color: props.color,
    prevSelection: props.prevSelection,
    selection: props.selection,
    idMapping: props.idMapping
  };
  // Use the hook to log prop changes
  useLogChangedProperties('IafViewer - CuttingPlanes - Props', changedProps);    

  // useEffect(()=>{
  //   // don't show planes on load let user enable it
  //   props.handleChangeCuttingPlane(false)
  // },[])

  function pickCuttingPlanePoint(planeId /* : ECuttingPlane */) {
    let enablePickPointFromModel = true;
    let selectMode = ESelectMode.Default;
    switch (planeId) {
      case ECuttingPlane.Top:
        selectMode = ESelectMode.CuttingPlaneTopReferencePoint;
        IafUtils.devToolsIaf && console.log('CuttingPlaneDiv.pickCuttingPlanePoint', 'ECuttingPlane.Top');
        break;

      case ECuttingPlane.Bottom:
        selectMode = ESelectMode.CuttingPlaneBottomReferencePoint;
        IafUtils.devToolsIaf && console.log('CuttingPlaneDiv.pickCuttingPlanePoint', 'ECuttingPlane.Bottom');
        break;

      case ECuttingPlane.Front:
        selectMode = ESelectMode.CuttingPlaneFrontReferencePoint;
        IafUtils.devToolsIaf && console.log('CuttingPlaneDiv.pickCuttingPlanePoint', 'ECuttingPlane.Front');
        break;

      case ECuttingPlane.Back:
        selectMode = ESelectMode.CuttingPlaneBackReferencePoint;
        IafUtils.devToolsIaf && console.log('CuttingPlaneDiv.pickCuttingPlanePoint', 'ECuttingPlane.Back');
        break;

      case ECuttingPlane.Left:
        selectMode = ESelectMode.CuttingPlaneLeftReferencePoint;
        IafUtils.devToolsIaf && console.log('CuttingPlaneDiv.pickCuttingPlanePoint', 'ECuttingPlane.Left');
        break;

      case ECuttingPlane.Right:
        selectMode = ESelectMode.CuttingPlaneRightReferencePoint;
        IafUtils.devToolsIaf && console.log('CuttingPlaneDiv.pickCuttingPlanePoint', 'ECuttingPlane.Right');
        break;

      default:
        enablePickPointFromModel = false;
        console.error('CuttingPlaneDiv.pickCuttingPlanePoint', 'unsupportd ECuttingPlane');
        break;
    }

    if (enablePickPointFromModel) {
      let showPlaneGeometry = props.showPlaneGeometry;
      showPlaneGeometry && props.handleShowCuttingPlaneGeometryBoolean(false);

      IafUtils.devToolsIaf && console.log(
        'CuttingPlaneDiv.pickCuttingPlanePoint',
        '/viewer',
        props.viewer,
        '/selectOperatorId',
        props.selectOperatorId
      );

      let selectOperator = props.viewer.operatorManager.getOperator(props.selectOperatorId);
      selectOperator.setSelectMode(selectMode);
      selectOperator.setOnSelectionCompleteCb(() => {
        IafUtils.devToolsIaf && console.log('CuttingPlaneDiv.pickCuttingPlanePoint', 'cutting plane selection complete');
        showPlaneGeometry && props.handleShowCuttingPlaneGeometryBoolean(true);
      });

      IafUtils.devToolsIaf && console.log('CuttingPlaneDiv.pickCuttingPlanePoint', '/selectOperator', selectOperator);
    }
  }
  
  // This function is used to close the panel. It calls the onClose function with the parameter 'cuttingPanel'.
  function panelClose(){
    props.onClose('cuttingPanel');
  }
  
  async function getSelectedNodeIds() {  
    let arr = [];
    if (props.prevSelection.length > 0) {
      arr.push(props.prevSelection);
    } else {
      if (props.selection.length > 0) {
        // let id3D = props.getNodeIds(
        let id3D = await props.iafViewer.props.graphicsResources.getNodeIds(
          props.iafViewer.filteredSelection(props.selection),
          props.idMapping[1]
        );
        arr.push(id3D);
      }
    }
    if(arr.length === 0) {
      NotificationStore.notifyNoElementSelectionFoundForFocusedCuttingPlanes(props.iafViewer);
      return null;
    }
    return arr;
  }
  
  /* This function is used to enable focused planes
    @params event - to find switch is on/off
    @params changeFocusFlag - extra Flag used to change just focus of node and ignore other functionality
    returns - null
  */
  function enableFocusedPlanes(event , changeFocusFlag = false){
    let arr = [];
    event.persist(); // ATK: Events are reused for async functions, persisting this event so that it can be used in this event handler
    (async () => { 
      if(event.target.checked || changeFocusFlag) {
        if (props.enableCuttingPlanes){
          event.target.checked = false;
          props.handleEnableCuttingPlanes(event);
        } else {
          arr = await getSelectedNodeIds();   
          if (arr === null) return;         
        }
        const nodeBounding = await props.iafCuttingPlanesUtils.focusedPlanesByNodeIds(true, false, focusedPlaneSlider, arr, 0.25, props.modelBounding);
        setNodeBoundingValue(nodeBounding);
        // setFocusedPlaneSlider(30);
      }
      else{
        props.handleShowAll();
        await props.iafCuttingPlanesUtils.focusedPlanesByNodeIds(false);
        // setFocusedPlaneSlider(0);
      }
    })();
  }

  

  /* This function is used to change slider value and update focused planes values
    @params newValue - slider value
    returns - null
  */
  function handlefocusedPlaneSlider(event,newValue){
    focusPlanesSliderTimeoutHandler && clearTimeout(focusPlanesSliderTimeoutHandler);
    let timeoutHandler = setTimeout(() => {
      props.iafCuttingPlanesUtils.updateCuttingPlanesByNodeBounding(newValue,props.modelBounding);
      setFocusedPlaneSlider(newValue);  
    }, 1);
    setFocusPlanesSliderTimeoutHandler(timeoutHandler);
  }

  async function handleStandardPlanes(event){
    if(event.target.checked){
      event.persist();
      // Always reset focus plane when standard planes toggled
      setFocusedPlane(false);
      await props.iafCuttingPlanesUtils.focusedPlanesByNodeIds(false);
      setTimeout(()=>{
        event.target.checked = true;
        props.handleEnableCuttingPlanes(event);
      },300)
    }
    else{
      props.handleEnableCuttingPlanes(event)
    }
  }
  
  async function handleFocusedPlanes(event){
    setFocusedPlane(event.target.checked);
    if (props.enableCuttingPlanes || !event.target.checked){
      props.handleEnableCuttingPlanes({target: {checked: false}});
    }
    if(event.target.checked){
      const arr = await getSelectedNodeIds();
      if (arr === null) return;         
      const nodeBounding = await props.iafCuttingPlanesUtils.focusedPlanesByNodeIds(true, false, focusedPlaneSlider, arr, 0.25, props.modelBounding);
      setNodeBoundingValue(nodeBounding);
    }
  }

  return (
    <div>
      <IafHeading title={props.title} showContent={props.showContent} showContentMethod={props.showContentMethod} onClose={panelClose} color={props.color} panelCount={props.panelCount}>
        <div>
          <IafSubHeader title='Standard Planes'>
            <IafSwitch
                isChecked={props.enableCuttingPlanes}
                onChange={handleStandardPlanes}
                title="Standard Planes"
              />
      
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IafSlider
                  tooltipText = {TooltipStore.TopSlider}
                  disabled={!props.enableCuttingPlanes}
                  title="Top plane:"
                  min={props.modelBounding ? props.modelBounding.min.z : 0}
                  max={props.modelBounding ? props.modelBounding.max.z : 100}
                  value={props.topSliderValue}
                  onChange={props.handleChangeSliderTopPlane}
                  handleShowCuttingPlaneGeometryBoolean={props.handleShowCuttingPlaneGeometryBoolean}
                  label={props.modelBounding ? parseFloat(((props.topSliderValue - props.modelBounding.min.z) / (props.modelBounding.max.z - props.modelBounding.min.z) * 100).toFixed(2)) : 0}
                  step={0.10}></IafSlider>
                <div
                  className={!props.enableCuttingPlanes ? `${styles.pickFromPointButton} ${styles.disabledComponent}` : styles.pickFromPointButton}
                  id={TopPlaneSelect.id}
                  onClick={() => pickCuttingPlanePoint(TopPlaneSelect.planeId)}>
                  <IafTooltip
                  src={TopPlaneSelect.icon.img}
                  iconClass={styles.filterPickFromPointIcon}
                  title={TopPlaneSelect.tooltip}
                  placement={"bottom"}
                  toolTipClass={styles.customizedTooltip}
                  ></IafTooltip>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <IafSlider
            disabled={!props.enableCuttingPlanes}
                    min={props.modelBounding ? props.modelBounding.min.z : 0}
                    max={props.modelBounding ? props.modelBounding.max.z : 100}
                    align="left"
                    value={props.bottomSliderValue}
                    label={props.modelBounding ? parseFloat(((props.bottomSliderValue - props.modelBounding.min.z) / (props.modelBounding.max.z - props.modelBounding.min.z) * 100).toFixed(2)) : 0}
                    onChange={props.handleChangeSliderBottomPlane}
                    step={0.10}
                    handleShowCuttingPlaneGeometryBoolean={props.handleShowCuttingPlaneGeometryBoolean}
                    title="Bottom plane:"
                    tooltipText = {TooltipStore.BottomSlider}
                  />
                <div
                  className={!props.enableCuttingPlanes ? `${styles.pickFromPointButton} ${styles.disabledComponent}` : styles.pickFromPointButton}
                  id={BottomPlaneSelect.id}
                  onClick={() => pickCuttingPlanePoint(BottomPlaneSelect.planeId)}>
                  <IafTooltip
                  src={BottomPlaneSelect.icon.img}
                  iconClass={styles.filterPickFromPointIcon}
                  title={BottomPlaneSelect.tooltip}
                  toolTipClass={styles.customizedTooltip}
                />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IafSlider
                disabled={!props.enableCuttingPlanes}
                  title="Front plane:"
                  min={props.modelBounding ? props.modelBounding.min.y : 0}
                  max={props.modelBounding ? props.modelBounding.max.y : 100}
                  align="left"
                  value={props.frontSliderValue}
                  label={props.modelBounding ? parseFloat(((props.frontSliderValue - props.modelBounding.min.y) / (props.modelBounding.max.y - props.modelBounding.min.y) * 100).toFixed(2)) : 0}
                  onChange={props.handleChangeSliderFrontPlane}
                  handleShowCuttingPlaneGeometryBoolean={props.handleShowCuttingPlaneGeometryBoolean}
                  tooltipText = {TooltipStore.FrontSlider}
                  step={0.10}></IafSlider>
                <div
                  className={!props.enableCuttingPlanes ? `${styles.pickFromPointButton} ${styles.disabledComponent}` : styles.pickFromPointButton}
                  id={FrontPlaneSelect.id}
                  onClick={() => pickCuttingPlanePoint(FrontPlaneSelect.planeId)}>
                  <IafTooltip
                  src={FrontPlaneSelect.icon.img}
                  iconClass={styles.filterPickFromPointIcon}
                  title={FrontPlaneSelect.tooltip}
                  toolTipClass={styles.customizedTooltip}
                  ></IafTooltip>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IafSlider
                disabled={!props.enableCuttingPlanes}
                  title="Back plane:"
                  min={props.modelBounding ? props.modelBounding.min.y : 0}
                  max={props.modelBounding ? props.modelBounding.max.y : 100}
                  value={props.backSliderValue}
                  label={props.modelBounding ? parseFloat(((props.backSliderValue - props.modelBounding.min.y) / (props.modelBounding.max.y - props.modelBounding.min.y) * 100).toFixed(2)) : 0 }
                  onChange={props.handleChangeSliderBackPlane}
                  handleShowCuttingPlaneGeometryBoolean={props.handleShowCuttingPlaneGeometryBoolean}
                  tooltipText = {TooltipStore.BackSlider}
                  step={0.10}></IafSlider>
                <div
                  className={!props.enableCuttingPlanes ? `${styles.pickFromPointButton} ${styles.disabledComponent}` : styles.pickFromPointButton}
                  id={BackPlaneSelect.id}
                  onClick={() => pickCuttingPlanePoint(BackPlaneSelect.planeId)}>
                  <IafTooltip
                  src={BackPlaneSelect.icon.img}
                  iconClass={styles.filterPickFromPointIcon}
                  title={BackPlaneSelect.tooltip}
                  toolTipClass={styles.customizedTooltip}
                  ></IafTooltip>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IafSlider
                disabled={!props.enableCuttingPlanes}
                  title="Left plane:"
                  min={props.modelBounding ? props.modelBounding.min.x : 0}
                  max={props.modelBounding ? props.modelBounding.max.x : 100}
                  value={props.leftSliderValue}
                  label={props.modelBounding ? parseFloat(((props.leftSliderValue - props.modelBounding.min.x) / (props.modelBounding.max.x - props.modelBounding.min.x) * 100).toFixed(2)) : 0 }
                  onChange={props.handleChangeSliderLeftPlane}
                  handleShowCuttingPlaneGeometryBoolean={props.handleShowCuttingPlaneGeometryBoolean}
                  tooltipText = {TooltipStore.LeftSlider}
                  step={0.10}></IafSlider>
                <div
                  className={!props.enableCuttingPlanes ? `${styles.pickFromPointButton} ${styles.disabledComponent}` : styles.pickFromPointButton}
                  id={LeftPlaneSelect.id}
                  onClick={() => pickCuttingPlanePoint(LeftPlaneSelect.planeId)}>
                  <IafTooltip
                  src={LeftPlaneSelect.icon.img}
                  iconClass={styles.filterPickFromPointIcon}
                  title={LeftPlaneSelect.tooltip}
                  toolTipClass={styles.customizedTooltip}
                  ></IafTooltip>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IafSlider
                disabled={!props.enableCuttingPlanes}
                  title="Right plane:"
                  min={props.modelBounding ? props.modelBounding.min.x : 0}
                  max={props.modelBounding ? props.modelBounding.max.x : 100}
                  align="left"
                  value={props.rightSliderValue}
                  label={props.modelBounding ? parseFloat(((props.rightSliderValue - props.modelBounding.min.x) / (props.modelBounding.max.x - props.modelBounding.min.x) * 100).toFixed(2)) : 0}
                  onChange={props.handleChangeSliderRightPlane}
                  handleShowCuttingPlaneGeometryBoolean={props.handleShowCuttingPlaneGeometryBoolean}
                  tooltipText = {TooltipStore.RightSlider}
                  step={0.10}></IafSlider>
                <div
                  className={!props.enableCuttingPlanes ? `${styles.pickFromPointButton} ${styles.disabledComponent}` : styles.pickFromPointButton}
                  id={RightPlaneSelect.id}
                  onClick={() => pickCuttingPlanePoint(RightPlaneSelect.planeId)}>
                  <IafTooltip
                  src={RightPlaneSelect.icon.img}
                  iconClass={styles.filterPickFromPointIcon}
                  title={RightPlaneSelect.tooltip}
                  toolTipClass={styles.customizedTooltip}
                  ></IafTooltip>
                </div>
              </div>
              {IafUtils.devToolsIaf && console.log("props.enableCuttingPlanes", props.enableCuttingPlanes)}
              <IafSwitch
                disabled={!props.enableCuttingPlanes}
                title="Show planes"
                isChecked={props.showPlaneGeometry}
                onChange={props.handleShowCuttingPlaneGeometry}
              />
          
          </IafSubHeader>
        </div>
        <div>
          <IafSubHeader title='Focused Planes'>
          <IafSwitch
            isChecked={focusedPlane}
            onChange={(e)=>handleFocusedPlanes(e)}
            title="Focused Planes"
          />
          <IafSlider
            tooltipText = {TooltipStore.FocusedPlaneSlider}
            disabled={!focusedPlane}
            title="Size"
            min={0}
            max={100}
            value={focusedPlaneSlider}
            onChange={handlefocusedPlaneSlider}
            label={focusedPlaneSlider}
            step={1}></IafSlider>

            <IafButton disabled={!focusedPlane} width='110px' title="Change Focus" onClick={(e)=> enableFocusedPlanes(e,true)}>
            </IafButton>
          </IafSubHeader>
        </div>
      </IafHeading>
    </div>
  );
}
