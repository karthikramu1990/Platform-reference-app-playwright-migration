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
// 17-04-23    HSK        PLAT-2727   Created Tooltip component added to toolbar
//                                    Created small size toolbar as per new design 
//                                    https://www.figma.com/file/tR5qSp2YHtqLmzMLDwintQ/Viewer?node-id=323-675&t=cYTNzcPJLFUT4Aga-0  
// 26-04-23    HSK        PLAT-2727   Created configurable toolbar 
//                                    Toolbar size can be changed according to props received from app side  
// 27-04-23    ATK        PLAT-2729   Introduced TooltipStore
// 04-05-23    HSK        PLAT-2800   Added subemenus for toolbar buttons
// 05-05-23    HSK        PLAT-2800   Resolved submenu onHover and OnCLick conflict issue
// 09-06-23    HSK        PLAT-2800   Added functionality to close tooltip if submenu is open   
// 16-05-23    HSK        PLAT-2730   Revamped IafViewer Panels                                   
// 16-05-23    HSK        PLAT-2813   Revamed IafViewer Components                                     
// 16-05-23    ATK        PLAT-2813   Restructuring, Todos
// 26-05-23    HSK        PLAT-2891   Revamped IafViewer Icons - Toolbar, Submenu
// 26-05-23    HSK                    Added key Property in Command Div's option component
// 30-05-23    ATK                    Regression in Bottom Cutting Plane Slider
// 31-05-23    HSK        PLAT-2891   Added closeSubMenu function call on each submenu button click 
// 01-06-23    ATK        PLAT-2890   To dos in Walk Mode 
// 01-06-23    ATK                    To dos around Panels & Color Picker
// 05-06-23    HSK                    Added function that handles closing of NewToolbar panels
// 07-06-23    ATK                    To dos around Console Errors for Settings Panel
// 07-06-23    ATK                    To dos around UX Review - Consider getting rid of Apply Button
// 09-06-23    HSK                    Added style to pass css property value
// 13-06-23    ATK        PLAT-2728   Restructured TO DOs
// 14-06-23    ATK                    To do - Large Toolbar TEXT Font Type/Size/Uppercase to be corrected
// 21-06-23    ATK        PLAT-2728   To do - The navcube goes under the large toolbar
//                                    Confusion around toolbar-btn styling around text-transform (uppercase) 
// 22-06-23    ATK                    To do - Save and Apply buttons go under the footer. Need some extra scroll
// 27-06-23    ATK                    To do - Cutting Planes Sliders need visible range to be displayed from 0.0 to 100.0
// 28-06-23    ATK       PLAT-2959    To dos - Side Panels, IafTooltip-IafSlider renedring performance
// 28-06-23    HSK                    Revamped Panel Show/Hide functionality
// 30-06-23    ATK                    To dos - Console Asserts in CP & Context Menu Coloring Themes
// 03-06-23    HSK                    Made sub-menu top position dynamic with respect to it's toolbar button
// 13-07-23    HSK                    Created edit toolbar functionality
// 13-07-23    HSK                    Created and used a single flag system to control display of toolbar buttons, wherever possible
// 22-08-23    HSK        PLAT-3153   added check for walk mode..if walk mode is active we disabled shading modes
// 10-05-23    ATK        PLAT-2510   GIS Research
// 01-09-23    HSK                    Removed show all tool and added manipulate tool (contains sub menu) and functionality related to it
// 06-09-23    HSK                    Used Snackbar of iafNotification for feedback on Reset View
// 14-09-23    HSK                    Used severity argument for demonstaration
// 05-10-23    HSK                    Enabled 2d measurment and select functionality through submenu
// 27-09-23    HSK                    Replaced the 'toolbarSize' prop with the 'toolbarSize' state from 'iafviewer
// 10-10-23    HSk                    Commenetd turning off focus mode code in cameraWalkMode function
// 27-09-23    HSK                    Replaced the 'toolbarSize' prop with the 'toolbarSize' state from 'iafviewer
// 25-10-23    HSK                    gave id for customise viewer btn
// 07-11-23    ATK                    Load Configurations
// 20-11-23    HSK        PLAT-2347   Reset camera on activating cutting planes, 
//                                    set whole model as model bounding for cutting planes
//                                    stopped slider value from getting updated when standard planes are not active
// 05-12-23    HSK        PLAT-3657   NewToolbar will throw an error due to uninitialized "planeVlaues" variable.
// 11-12-23    HSK        PLAT-3450   The new toolbar tooltips should be enabled only for Large Sized Toolbar
//                                    Rendered toolbar title as tooltip for medium and small toolbarSize
// 08-12-23    HSK        PLAT-3793   IafViewer DevTools - Camera Callback Panel under IafUtils.debugIaf
// 10-01-24    RRP        PLAT-3917   Introduce a new IafViewer property enableFocusMode
// 05-01-24    HSK        PLAT-3656   Introduce enable2DViewer in PropertyStore
// 02-02-24    HSK        PLAT-3829   Measurement functions (e..g clickMeasurePoint) don't take into account ONLY 2D Project
// 08-02-24    RRP        PLAT-3258   Intuitive default orientation on enabling the walk mode
// 18-03-24    HSK        UI-126      At the top of the toolbar, there is an arrow that appears only when modal windows (settings) are open. In other cases, the arrow is hidden.
// 19-03-24    HSK        UI-123      Group instruments have a "group indicator" on the icon, and upon clicking, they should display a dropdown with other instruments that belong to the same group.
// 06-02-24    HSK        PLAT-3422   Create operator for Markup Item instantiating IafMarkup
// 01-04-24    HSK        PLAT-4428   Implemented when one child is preset in panel and if we hit close button it will close and not minimize.
// 01-04-24    HSK        PLAT-4429   Corrected ambiguous behavoiur of 2D Viewer button after resetting toolbar from edit controls.
// 16-04-24    ATK        PLAT-4403   Markup Manager Interactive Modes
// 13-05-24    HSK        PLAT-4579   Left view should not be default view in view tool bar.
// 11-06-24    HSK        PLAT-4839   Circle - CRUD Apis and Unit Tests - 3D and 2D Only projects
// -------------------------------------------------------------------------------------

//Top level buttons: Reset, Projection, View, Shading, Navigation, Measurement, Settings

/* ----------------------- 
To do - Functional

- Low priority
  - Add option to control zoom speed. Sometimes it's too fast.
  - Introduce Fit Model toggle for Cutting Planes (Low Priority) ?
  - Violation warnings on Settings button

- High Priority
  - The coloring theme of context menu has some flaws, e.g. ref app
  - Console Asserts while turning off the cutting planes from the side panel
  - Debug any rendering performance issue to IafTooltip in IafSlider
    IafTooltip should not rerender. Take out the tooltip if it adds to rendering performance.
  - Review Icons with Luca (Shading Icons)
  - Refer to PropertyStore for default values in IafViewerDBM.jsx wherever applicable
  - Cutting Planes Sliders need visible range to be displayed from 0.0 to 100.0

To verify
  - There is a gap between Settings and Cutting Plane panels
  - Enabling a side panel (e.g. Cutting Planes) should 
    either "collapse other panels (e.g. Settings) if already expanded"
    or "move the selected panel to the top"
  - Large Toolbar TEXT Font Type/Size/Uppercase to be corrected
  - Measurement Units Change dont reflect in the functionality
  - Large toolbar overlaps navbox / small toolbar leaves space i.e. 
    The factor 100px (for large) , 48px (for small) and whatever (for medium) 
    should be driven inside iafViewer using the toolbarSize prop value that we are getting
    The navcube goes under the large toolbar
    Confusion around toolbar-btn styling around uppercase, currently commented out text-transform
  - Save and Apply buttons go under the footer. Need some extra scroll.
  - Tooltip for Cutting Planes
    - Resolve Tooltips mismatch of Pick by Point with IafTooltip
    - Add Tooltips for sliders
  - Console Errors
    - Clicking on Apply or Save from Settings
    Cannot read properties of undefined on Apply
  - Console Errors
    - Click on Settings in the New Toolbar
  - Handle gracefully the cutting plane error when the model structure is not yet ready
  - Correction in icons neded on toolbar for some 
    as there is inconsistency with arrows at the botom right corner
  - Walk mode
  - Walk mode with keyboard does not work
  - Switch buttons for mouse walk / keyboard work don't seem to work as expected
  - For any panel (settings or cutting planes), clicking on cross(X) should first minimize it. 
    If already minimized, Clicking on it again should close it. Clicking anywhere else in the subheader should behave as it does now i.e. is should expand / collapse
  - Color Picker goes behind the toolbar and some mess around the UI in general
  - Clean up the unused old ui code e.g. SettingsModal
  - Add prop to IafViewer to enable/disable tooltips
  - Add prop to IafViewer to set the color theme
  - Tooltip for the Cross button for Side panels (Settings, Cuttings Planes, etc.) would be handy

To Do - UX Review
- Visibility of the side panel at the bottom is not intutive
- Medium Priority
  - Consider getting rid of Apply Button
    Any changes in the UI should not wait for Apply button to be hit.
    Introduce Auto-save option ?
- Review how to get rid of Learning Center
- Review how to jump to Learning Center / Navigation Walk Mode from Settings / Walk Mode
- Confirm the size of all icons are the same ? They don't look equal. 
  Some (shading) look smaller. Some look bigger.
- Mouse Over the toolbar icons needs review
- Show All Icon mismatch, its whilte while others looks gray, white looks brigher and better?
- Buttons should be highlighted with theme color when active e.g. Focus Mode
  > PR/534 did a partial fix for this. 
    However, the toggle should happen as soon as the button is clicked.
    Currently it appears to render only after losing the focus.
------------------------------*/

import React from "react";
import styles from './NewToolbar.module.scss'
import { IafDrawMode } from "../../../common/IafDrawMode.js";
import CustomModal from "../../modal/CustomModal.js";
import packageJson from "../../../../package.json";

import { IfefTouchPanel } from "@dtplatform/react-ifef";
import Draggable from "react-draggable"; // The default
import { IafSwitch } from "../../component-low/iafSwitch/IafSwitch.jsx";
const { IfefDraggablePanel } = IfefTouchPanel; //Default changed from 0.25 to ZoomDelta

import IafOperatorUtils from '../../../operators/IafOperatorUtils.js'
import { ToolbarIcons } from '../../toolbar.js'
import { ECuttingPlane, ESelectMode } from '../../../common/IafViewerEnums.js';
import IafTooltip from '../../component-low/Iaftooltip/IafTooltip.jsx'
import TooltipStore from "../../../store/tooltipStore.js";
import ViewerSubMenu from './viewerSubmenu.jsx'
import SidePanel from '../../component-high/sidePanel/SidePanel.jsx';
import { SettingPanel } from '../../component-high/settingPanel/SettingPanel.jsx'
import { CuttingPlanes } from "../../component-high/CuttingPlanes/CuttingPlanes.jsx";
import { LearningCenter } from "../../component-high/learningCenter/LearningCenter.jsx";
import { FirstKeyControl } from "../../component-high/keyControls/FirstKeyControl.jsx";
import { FourthKeyControl } from "../../component-high/keyControls/FourthKeyControl.jsx";
import { SecondKeyControl } from "../../component-high/keyControls/SecondKeyControl.jsx";
import { ThirdKeyControl } from "../../component-high/keyControls/ThirdKeyControl.jsx";
import { FirstMouseControl } from "../../component-high/mouseControls/FirstMouseControl.jsx";
import { SecondMouseControl } from "../../component-high/mouseControls/SecondMouseControl.jsx";
import { ThirdMouseControl } from "../../component-high/mouseControls/ThirdMouseControl.jsx";
import { FourthMouseControl } from "../../component-high/mouseControls/FourthMouseControl.jsx";
import { EditControls } from "../../component-high/editControl/EditControls.jsx";
import ReactModelComposition from "../../component-high/loadconfig/ReactModelComposition.jsx";
import { DevToolsPanel } from "../../component-high/devToolsPanel/DevToolsPanel.jsx";
import IafUtils, { IafProjectUtils } from "../../../core/IafUtils.js"
import { WidgetAction, WidgetMode }  from "../../../common/enums/widgets.js"
import { IafStorageUtils }  from "../../../core/IafUtils.js"

import { NotificationStore } from "../../../store/notificationStore.js";
import { resetCameraToInitial, resetCameraToStandardView } from "../../../core/cameraUtils.js";
import { IafMarkupManager } from "../../../core/IafMarkupManager.js";
import Divider from '@mui/material/Divider';
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos.js";
import MarkupPanel from "../../component-high/MarkupPanel/MarkupPanel.jsx";
import { setIafCameraProjection } from "../../../core/camera.js";
import ReactGis from "../../component-high/gis/gis.jsx";
import { GisElevationMode } from "../../../common/enums/gis.js";
import { linkedModelItemsFromGraphicsResources } from "../../../common/LinkedModels.js";
import { layersItemsFromGraphicsResources } from "../../../common/Layers.js";
import { IafGraphicsResourceHandler } from "../../../core/IafGraphicsResourceManager.js";
import { GisDistance } from "../../../core/gis/distance.js";
import PropertyStore from "../../../store/propertyStore.js";
import { permissionManager, RESOURCE_TYPES } from "../../../core/database/permission/iafPermissionManager.js";

let ZoomDelta = 0.04;

const DefaultSubMenuFlags = {
  view: false,
  shading: false,
  nav: false,
  annotations: false,
  manipulate: false
};


function CommandsDiv(props) {
  let optionItems = props.commandValues.map((name, index) => (
    <option key={index}>{name}</option> // Added key property to remove react warning
  ));
  optionItems.unshift(
    <option key="default" value="none" disabled hidden>
      Select an Option
    </option>
  );

  return (
    <Draggable handle="strong">
      <div
        className={styles["cutting-plane-div"]}
        style={{
          width: 100 + "px",
          left: 400 + "px",
          display: props.visible ? "block" : "none",
        }}
      >
        <strong>
          <div className={styles["cuttingPlane-header"]}>
            <div className={styles["cuttingPlane-header-text"]}>Command List</div>
            <div className={styles["cuttingPlane_button"]} id="DragArea">
              <div className={styles["cuttingPlane-icon"]}>
                <img
                  src={ToolbarIcons.iconDragArea.img}
                  className={styles["filter-white"]}
                />
                <span className={styles["tooltip-txt"]}>
                  {ToolbarIcons.iconDragArea.tooltip}
                </span>
              </div>
            </div>
          </div>
          {/* <div className={styles["cutting-plane-div-header" >
           <div className={styles["toolbar-panel-text" >Cutting planes</div>
          </div> */}
        </strong>
        <div>
          <select
            className={styles["commandDropDown"]}
            onChange={props.selectedCommand}
          >
            <option key="none" value="none" disabled hidden>
              Select an Option
            </option>
            {optionItems}
          </select>
          <button
            style={{
              marginLeft: "8px",
              marginTop: "19px",
              marginRight: "8px",
              marginBottom: "8px",
              width: "50px",
              height: "25px",
            }}
            /* id="element-theming-button" */ onClick={props.runCommand}
          >
            Run
          </button>
        </div>
      </div>
    </Draggable>
  );
}

class NewToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.reactGisRef = React.createRef();
    this.state = {
       posTop:null,
      activeKeyControl: 0,
      activeMouseControl: 0,
      isKeyControlOpen: false,
      isMouseControlOpen: false,
      isEditControlOpen: false,
      isSidePanelOpen : false,
      userHasOpenedSidePanel: false,
      getCuttingPlanesResult: undefined,
      getCameraResult: undefined,
      getViewResult: undefined,
      commandValues: [],
      currentCommand: "",
      submenuFlags: DefaultSubMenuFlags,
      activeDrags: 0,
      //default is Perspective projection
      isPerspective: true,
      displayToggleCuttingPlanes: false,
      displayToggleMapBox: false,
      displayToggleLoadConfig: false,
      displayToggle: false,
      visible: false,
      topSliderValue: null,
      bottomSliderValue: null,
      leftSliderValue: null,
      rightSliderValue: null,
      frontSliderValue: null,
      backSliderValue: null,
      enableCuttingPlanes: false,
      enableMapBox: false,
      isReady: false,
      enableLoadConfig: false,
      showPlaneGeometry: true,
      isShowSubMenuClicked : false,
      shadingMainIcon: { icon: ToolbarIcons.iconFullNoLines, title: "Shading" },
      viewMainIcon: { icon: ToolbarIcons.iconLeft, title: "View", defaultCheck: false },
      navMainIcon: { icon: ToolbarIcons.iconNavPan, title: "Navigation" },
      measurementMainIcon: {
        icon: ToolbarIcons.iconSelect,
        title: "Annotations",
      },
      manipulateMainIcon:{
        icon: ToolbarIcons.iconShowAll,
        title: "Utilities"
      },
      drawMode: props.drawMode,
      isWalkMode:false,
      isFocusMode: props.isFocusMode,//PLAT-3917 | Introduce a new IafViewer property enableFocusMode
      isOrthographicDisabled:
        props.btns &&
        props.btns.Orthographic &&
        props.btns.Orthographic.display === false
          ? true
          : false,
      isMapBoxDisabled:
        props.btns &&
        props.btns.gis &&
        props.btns.gis.display === false 
        ? true : false,
      isLoadConfigDisabled:
        props.btns &&
        props.btns.loadConfig &&
        props.btns.loadConfig.display === false
          ? true
          : false,
      isAnalyticsDisabled:
        props.btns &&
        props.btns.Analytics &&
        props.btns.Analytics.display === false
          ? true
          : false,
      is2DviewerDisabled:
        props.btns &&
        props.btns.viewer2D &&
        props.btns.viewer2D.display === false
          ? true
          : false,
      is3DviewerDisabled:
        props.btns &&
        props.btns.viewer3D &&
        props.btns.viewer3D.display === false
          ? true
          : false,
      isArcgisDisabled:
        props.btns &&
        props.btns.arcgis &&
        props.btns.arcgis.display === false
          ? true
          : false,
      isArcgisOverviewDisabled:
        props.btns &&
        props.btns.arcgisOverview &&
        props.btns.arcgisOverview.display === false
          ? true
          : false,
      isUnrealEngineDisabled:
        props.btns &&
        props.btns.ue &&
        props.btns.ue.display === false
          ? true
          : false,
      isPhotosphereDisabled:
        props.btns &&
        props.btns.photosphere &&
        props.btns.photosphere.display === false
          ? true
          : false,
      isAnimationPlayDisabled:
        props.btns &&
        props.btns.AnimationPlay &&
        props.btns.AnimationPlay.display === false
          ? true
          : false,       
      isAnimationStopDisabled:
        props.btns &&
        props.btns.AnimationStop &&
        props.btns.AnimationStop.display === false
          ? true
          : false,                  
      isResetDisabled:
        props.btns && props.btns.Reset && props.btns.Reset.display === false
          ? true
          : false,
      isProjectionDisabled:
        props.btns &&
        props.btns.Projection &&
        props.btns.Projection.display == false
          ? true
          : false,
      isViewDisabled:
        props.btns && props.btns.View && props.btns.View.display === false
          ? true
          : false,
      isShadingDisabled:
        props.btns && props.btns.Shading && props.btns.Shading.display === false
          ? true
          : false,
      isNaviDisabled:
        props.btns &&
        props.btns.Navigation &&
        props.btns.Navigation.display === false
          ? true
          : false,
      isMeasurementDisabled:
        props.btns &&
        props.btns.Measurement &&
        props.btns.Measurement.display === false
          ? true
          : false,
      isUtilitiesDisabled:
        props.btns &&
          props.btns.Utilities &&
          props.btns.Utilities.display === false
            ? true
            : false,
      isSettingsDisabled:
        props.btns &&
        props.btns.Settings &&
        props.btns.Settings.display === false
          ? true
          : false,
      // isViewer2DVisible: props?.iafViewer?.view3d?.enable ?? false,
      // isViewer3DVisible: props?.iafViewer?.view2d?.enable ?? false,
      // isArcgisVisible: props?.iafViewer?.arcgis?.enable ?? false,
      showMeasurementConversionDialog: false,
      showwalkmode: false,
      tempVar: true,
      latestSidePanelComponent: null,
      panelCount: 0,
      showSettingContent : false,
      showCuttingContent : false,
      showGisViewerContent : false,
      showLearningContent : false,
      showLoadConfigContent : true,
      showLoadConfigContentPrimary: false,
      showLoadConfigContentExternal: new Map(),
      showLearningContent : false,
      showCameraContent: true,
      showAllMarkup: false,
      enabledAllMarkup: false,
      repeatLastMode: false,
      deleteAllMarkup: false,
      selectedMarkupType: ""
    };
    this.iconStyles = {
      color: 'white'
    };
    this.toggleFocusMode = this.toggleFocusMode.bind(this);
    this.prevModelBounding = null;
    this.prevCuttingPlane = null;
    this.prevPropsCuttingPlaneValue = null;
    this.resetStatesForEditControls = this.resetStatesForEditControls.bind(this);

    this.handlePanelCount = this.handlePanelCount.bind(this);
    
    this.handleDeleteMarups = this.handleDeleteMarups.bind(this);
    this.handleMarkupManagerState = this.handleMarkupManagerState.bind(this);
    this.handleEnableCuttingPlanes = this.handleEnableCuttingPlanes.bind(this);
    this.handleEnableMapBox = this.handleEnableMapBox.bind(this);
    this.handleEnableLoadConfig = this.handleEnableLoadConfig.bind(this);
    this.handleShowCuttingPlaneGeometry = this.handleShowCuttingPlaneGeometry.bind(this);
    this.handleChangeCuttingPlane = this.handleChangeCuttingPlane.bind(this);
    this.handleShowCuttingPlaneGeometryBoolean = this.handleShowCuttingPlaneGeometryBoolean.bind(this);
    this.handleChangeSliderTopPlane =
      this.handleChangeSliderTopPlane.bind(this);
    this.handleSubmenu = this.handleSubmenu.bind(this);
    // this.dragPanel = this.dragPanel.bind(this);
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
    this.resetAll = this.resetAll.bind(this);
    this.showCommandsModal = this.showCommandsModal.bind(this);
    /* this.selectedCommand = this.selectedCommand(this); */
    /* this.runCommand = this.runCommand(this); */
    this.showSubmenu = this.showSubmenu.bind(this);
    this.closeSubmenu = this.closeSubmenu.bind(this);
    this.viewLeft = this.viewLeft.bind(this);
    this.viewRight = this.viewRight.bind(this);
    this.viewBottom = this.viewBottom.bind(this);
    this.viewTop = this.viewTop.bind(this);
    this.viewFront = this.viewFront.bind(this);
    this.viewBack = this.viewBack.bind(this);
    this.resetResizeHandler = this.resetResizeHandler.bind(this);
    this.drawLineMarkupHandler = this.drawLineMarkupHandler.bind(this);
    this.drawCircleMarkupHandler = this.drawCircleMarkupHandler.bind(this);
    this.drawRectangleMarkupHandler = this.drawRectangleMarkupHandler.bind(this);
    this.drawPolylineMarkupHandler = this.drawPolylineMarkupHandler.bind(this);
    this.drawFreehandMarkupHandler = this.drawFreehandMarkupHandler.bind(this);
    this.drawPolygonMarkupHandler = this.drawPolygonMarkupHandler.bind(this);
    this.drawTextBoxHandler = this.drawTextBoxHandler.bind(this);
    this.drawImageBoxHandler = this.drawImageBoxHandler.bind(this);
    this.drawExportHandler = this.drawExportHandler.bind(this);
    this.drawImportHandler = this.drawImportHandler.bind(this);
    this.draw3DTextBoxHandler = this.draw3DTextBoxHandler.bind(this);
    this.drawFunction = this.drawFunction.bind(this);
    this.edgefaceXray = this.edgefaceXray.bind(this);
    this.edgefaceShaded = this.edgefaceShaded.bind(this);
    this.edgefaceHiddenLine = this.edgefaceHiddenLine.bind(this);
    this.edgefaceWireframe = this.edgefaceWireframe.bind(this);
    this.edgefaceWireframeShaded = this.edgefaceWireframeShaded.bind(this);
    this.changeProjectionMode = this.changeProjectionMode.bind(this);
    this.clickMeasurePoint = this.clickMeasurePoint.bind(this);
    this.clickMeasureEdge = this.clickMeasureEdge.bind(this);
    //measure distance between faces
    this.clickMeasureDistance = this.clickMeasureDistance.bind(this);
    this.clickMeasureAngle = this.clickMeasureAngle.bind(this);
    this.toggle2dViewer = this.toggle2dViewer.bind(this);
    this.cameraOrbit = this.cameraOrbit.bind(this);
    this.cameraTurnTable = this.cameraTurnTable.bind(this);
    this.cameraWalkMode = this.cameraWalkMode.bind(this);
    this.cameraPan = this.cameraPan.bind(this);
    this.cameraZoom = this.cameraZoom.bind(this);
    this.resetCameraPan = this.resetCameraPan.bind(this);
    this.updateCuttingPlanes = this.updateCuttingPlanes.bind(this);

    this.activeShadingIcon = this.activeShadingIcon.bind(this);
    this.activeNavIcon = this.activeNavIcon.bind(this);
    this.activeMeasurementIcon = this.activeMeasurementIcon.bind(this);
    this.handleUtilities = this.handleUtilities.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this);
    this.handleShowKeyControlPanel = this.handleShowKeyControlPanel.bind(this);
    this.handleShowMouseControlPanel =
    this.handleShowMouseControlPanel.bind(this);
    this.handleToggleKeyControl = this.handleToggleKeyControl.bind(this);
    this.handleToggleMouseControl = this.handleToggleMouseControl.bind(this);
    this.closePanels = this.closePanels.bind(this);
    this.handleToggleEditControl = this.handleToggleEditControl.bind(this);
    this.updateStates = this.updateStates.bind(this);
    this.getDivPosition = this.getDivPosition.bind(this);
    this.toggleSettingContent = this.toggleSettingContent.bind(this);
    this.toggleCuttingContent = this.toggleCuttingContent.bind(this);
    this.toggleGisViewerContent = this.toggleGisViewerContent.bind(this);
    this.toggleLoadConfigContent = this.toggleLoadConfigContent.bind(this);
    this.toggleLoadConfigContentPrimary = this.toggleLoadConfigContentPrimary.bind(this);
    this.toggleLoadConfigContentExternal = this.toggleLoadConfigContentExternal.bind(this);
    this.toggleLearningContent = this.toggleLearningContent.bind(this);
    this.toggleCameraContent = this.toggleCameraContent.bind(this);
  }
  toggleSettingContent(flag){
    this.setState({showSettingContent : typeof flag !== 'undefined' ? flag : !this.state.showSettingContent}, () => this.handlePanelCount());
  }
  toggleMarkupsContent(flag){
    this.props.iafViewer.toggleMarkupSubmenu(flag, () => this.handlePanelCount());
  }
  toggleCuttingContent(flag){
    this.setState({showCuttingContent : typeof flag !== 'undefined' ? flag : !this.state.showCuttingContent}, () => this.handlePanelCount());
  }
  toggleLearningContent(flag){
    this.setState({ showLearningContent: typeof flag !== 'undefined' ? flag : !this.state.showLearningContent }, () => this.handlePanelCount());
  }
  toggleGisViewerContent(flag){
    this.setState({showGisViewerContent : typeof flag !== 'undefined' ? flag : !this.state.showGisViewerContent});
  }
  toggleLoadConfigContent(id, flag){
    this.setState({showLoadConfigContent : typeof flag !== 'undefined' ? flag : !this.state.showLoadConfigContent}, () => this.handlePanelCount());
  }
  toggleLoadConfigContentPrimary(id, flag) {
    this.setState({showLoadConfigContentPrimary : typeof flag !== 'undefined' ? flag : !this.state.showLoadConfigContentPrimary}, () => this.handlePanelCount());
  }  
  toggleLoadConfigContentExternal(id, flag) {
    if (!id || !this.state.showLoadConfigContentExternal.has(id)) return;
    
    const showLoadConfigContentExternal = this.state.showLoadConfigContentExternal;
    showLoadConfigContentExternal[id] = typeof flag !== 'undefined' ? flag : !this.state.showLoadConfigContentExternal[id];
    this.setState({showLoadConfigContentExternal});
  }
  toggleCameraContent(flag){
    this.setState({ showCameraContent: typeof flag !== 'undefined' ? flag : !this.state.showCameraContent }, () => this.handlePanelCount());
  }

  //Close panels based on the provided panelName.
  closePanels = async(panelName) => {
    IafUtils.devToolsIaf && console.log("closePanels panelName",panelName)
    const { closeSettingsModal } = this.props;
    const { showwalkmode } = this.state;
  
    switch (panelName) {
      case 'settingPanel':
        if (closeSettingsModal) {
          closeSettingsModal();
        }
        break;
      case 'markupsPanel':
        if (this.props.iafViewer.closeMarkupModal) {
          this.props.iafViewer.closeMarkupModal();
        }
        break;
      case 'cuttingPanel':
        this.props.iafViewer.toggleCuttingPlanesDiv()
        this.setState({displayToggleCuttingPlanes:false})
        break;
      case 'gisViewer':
        if(this.props.iafViewer.gisInstance){
          const gis = this.props.iafViewer.gisInstance
          if (gis.state.bModelRealignModeHorizontal) {
            await gis.handleToggleRealignHorizontalLow(); 
          }
        }
        this.props.iafViewer.toggleGisViewerDiv()
        this.setState({displayToggleMapBox:false})
        break;
      case 'loadConfig':
        this.props.iafViewer.toggleLoadConfigDiv()
        this.setState({displayToggleLoadConfig:false})
        break;
      case 'learningPanel':
        if(showwalkmode){
          this.setState({showwalkmode:false})
        }
        break;
      case 'devToolsPanel':
        this.props.iafViewer.handleDevToolsPanel(false);
        break;
      default:
        IafUtils.devToolsIaf && console.log("Provide Panel Name");
    }
    this.handlePanelCount();
  };

  // function to check how many panels are active.
  handlePanelCount = () => {
    this.setState({ panelCount: (this.props.iafViewer.state.isShowSettings + this.props.iafViewer.state.isShowCuttingPlanes + this.state.showwalkmode + this.props.iafViewer.state.isShowLoadConfig + this.props.iafViewer.state.enableDevTools + this.props.iafViewer.state.isShowMarkups)})
  }
  handleShowKeyControlPanel = (value) => {
    this.setState({ activeKeyControl: value });
  };

  handleShowMouseControlPanel = (value) => {
    this.setState({ activeMouseControl: value });
  };

  handleToggleKeyControl () {
    this.setState({ isKeyControlOpen: !this.state.isKeyControlOpen });
    if(this.state.isKeyControlOpen&&this.state.activeKeyControl===4){
      this.setState({ activeKeyControl: 0 ,isKeyControlOpen:true});
    }
  };

  handleToggleMouseControl()  {
    this.setState({ isMouseControlOpen:!this.state.isMouseControlOpen });
    if(this.state.isMouseControlOpen&&this.state.activeMouseControl===4){
      this.setState({ activeMouseControl: 0,isMouseControlOpen:true });
    }
  };
  handleToggleEditControl (value) {
    if(value!=null){
      this.setState({ isEditControlOpen: value}); 
      value=null;
    }
    else{
      this.setState({ isEditControlOpen: !this.state.isEditControlOpen }); 
    }
  };

  handleClick() {
    this.setState({ showwalkmode: false });
  }
  handleChangeCheckBox() {
    this.setState({ tempVar: false });
  }

  static getDerivedStateFromProps(props, state) {
    let returnObj = null;
    if (props.drawMode != state.drawMode) {
      returnObj = {
        drawMode: props.drawMode,
      };
    }
    // Return null if the state hasn't changed
    return returnObj;
  }

  // dragPanel(){
  //   this.dragElement(document.getElementById("cutting-plane-div"));
  // }

  async handleEnableCuttingPlanes(event, resetPosition=false) {
    IafUtils.devToolsIaf && console.log('NewToolbar.handleEnableCuttingPlanes', '/event', event);
    this.setState({ enableCuttingPlanes: event.target.checked })
    if (this.props.testUi) {
      if (event.target.checked) {
        if(resetPosition){
          // var camera = this.props.viewer.view.getCamera();
          // var target = this.props.viewer.view._initialCamera.getTarget();
          // var position = this.props.viewer.view._initialCamera.getPosition();
          // var height = this.props.viewer.view._initialCamera.getHeight();
          // var width = this.props.viewer.view._initialCamera.getWidth();
          // var up = this.props.viewer.view._initialCamera.getUp();
          // camera.setTarget(target);
          // camera.setPosition(position);
          // camera.setHeight(height);
          // camera.setWidth(width);
          // camera.setUp(up);
          // this.props.viewer.view.setCamera(camera);
          resetCameraToInitial(this.props.viewer);
        }
        let modelBounding = this.props.iafViewer.getModelBoundingBox();
        this.props.iafCuttingPlanesUtils.setModelBounding(modelBounding);
        this.props.iafCuttingPlanesUtils.showCuttingPlaneGeometry(true)
        this.setState({
          showPlaneGeometry: true
        })
      }
      else {
       await this.props.iafCuttingPlanesUtils.showCuttingPlaneGeometry(false)
      }
      await this.updateCuttingPlanes()
      this.props.iafCuttingPlanesUtils.enableCuttingPlanes(event.target.checked)
    }
  }

  handleEnableMapBox(event) {
    IafUtils.devToolsIaf && console.log('NewToolbar.handleEnableMapBox', '/event', event);
    this.props?.iafCuttingPlanesUtils?.enableMapBox(event.target.checked)
    this.props?.iafViewer?.setViewerState("gis", "enable", event.target.checked);
    // TODO: this is not required need to revist to remove.
    this.setState({ enableMapBox: event.target.checked })
  }

  handleEnableLoadConfig(event) {
    IafUtils.devToolsIaf && console.log('NewToolbar.handleEnableLoadConfig', '/event', event);
    this.setState({ enableLoadConfig: event.target.checked })
    if (this.props.testUi) {
      if (event.target.checked) {
        // this.props.iafCuttingPlanesUtils.showCuttingPlaneGeometry(true)
        // this.setState({
        //   showPlaneGeometry: true
        // })
      }
      // else {
      //   this.props.iafCuttingPlanesUtils.showCuttingPlaneGeometry(false)
      // }
      // this.updateCuttingPlanes()
      // this.props.iafCuttingPlanesUtils.enableCuttingPlanes(event.target.checked)
    }
  }

  handleShowCuttingPlaneGeometry(event) {
    IafUtils.devToolsIaf && console.log('NewToolbar.handleShowCuttingPlaneGeometry', this.props);
    this.setState({ showPlaneGeometry: event.target.checked })
    if (this.props.testUi) {
      IafUtils.devToolsIaf && console.log('NewToolbar.handleShowCuttingPlaneGeometry'
                    , 'executing props.iafCuttingPlanesUtils.showCuttingPlaneGeometry');
      this.props.iafCuttingPlanesUtils.showCuttingPlaneGeometry(event.target.checked)
    }
  }

  handleShowCuttingPlaneGeometryBoolean(show /*: boolean */) {
    IafUtils.devToolsIaf && console.log('NewToolbar.handleShowCuttingPlaneGeometryBoolean', this.props);
    this.setState({ showPlaneGeometry: show })
    if (this.props.testUi) {
      this.props.iafCuttingPlanesUtils.showCuttingPlaneGeometry(show)
    }
  }

  async updateCuttingPlanes() {
    IafUtils.devToolsIaf && console.log('NewToolbar.updateCuttingPlanes',
        '/this.state.topSliderValue', this.state.topSliderValue);
    if (this.props.testUi && this.props.iafCuttingPlanesUtils) {
      await this.props.iafCuttingPlanesUtils.updateCuttingPlanes(
      	this.state.topSliderValue,
        this.state.bottomSliderValue,
        this.state.leftSliderValue,
        this.state.rightSliderValue,
        this.state.frontSliderValue,
        this.state.backSliderValue)
    }
  }

  async handleChangeCuttingPlane(value) {
    //open cutting plane menu
    // this.showGisViewerModal();
    this.setState({ enableCuttingPlanes: value })
    if (this.props.testUi) {
      if (value) {
        await this.props.iafCuttingPlanesUtils.showCuttingPlaneGeometry(true)
        this.setState({
          showPlaneGeometry: true
        })
      }
      else {
        await this.props.iafCuttingPlanesUtils.showCuttingPlaneGeometry(false)
      }
      await this.updateCuttingPlanes()
      this.props.iafCuttingPlanesUtils.enableCuttingPlanes(value)
    }
  }

  changeCuttingPlaneSliderValue(index, value) {
    if (!this.props.testUi || !this.state.enableCuttingPlanes) return;
    IafUtils.devToolsIaf && console.log('NewToolbar.changeCuttingPlaneSliderValue', '/index', index, '/value', value);
    switch (index) {
      case ECuttingPlane.Top:
        this.setState ( {topSliderValue: value} );
        break;

      case ECuttingPlane.Bottom:
        this.setState ( {bottomSliderValue: value} );
        break;
  
      case ECuttingPlane.Front:
        this.setState ( {frontSliderValue: value} );
        break;

      case ECuttingPlane.Back:
        this.setState ( {backSliderValue: value} );
        break;
  
      case ECuttingPlane.Left:
        this.setState ( {leftSliderValue: value} );
        break;

      case ECuttingPlane.Right:
        this.setState ( {rightSliderValue: value} );
        break;

      default:
        console.error ("NewToolbar.changeCuttingPlaneSliderValue", "Unsupported Plane by this function");
        break;
    }
  }

  handleChangeSliderTopPlane(event,newValue,name) {
    IafUtils.devToolsIaf && console.log('handleChangeSliderTopPlane', newValue);
    this.setState({ topSliderValue: newValue }, () => this.updateCuttingPlanes());
  }

  handleChangeSliderBottomPlane(event,newValue,name) {
    IafUtils.devToolsIaf && console.log('handleChangeSliderBottomPlane', newValue);
    this.setState({ bottomSliderValue: newValue }, () => this.updateCuttingPlanes());
  }

  handleChangeSliderFrontPlane(event,newValue,name) {
    IafUtils.devToolsIaf && console.log('handleChangeSliderFrontPlane', newValue);
    this.setState({ frontSliderValue: newValue }, () => this.updateCuttingPlanes());
  }

  handleChangeSliderBackPlane(event,newValue,name) {
    IafUtils.devToolsIaf && console.log('handleChangeSliderBackPlane', newValue);
    this.setState({ backSliderValue: newValue }, () => this.updateCuttingPlanes());
  }

  handleChangeSliderLeftPlane(event,newValue,name) {
    IafUtils.devToolsIaf && console.log('NewToolbar.handleChangeSliderLeftPlane', newValue);
    this.setState({ leftSliderValue: newValue }, () => this.updateCuttingPlanes());
  }

  handleChangeSliderRightPlane(event,newValue,name) {
    IafUtils.devToolsIaf && console.log('NewToolbar.handleChangeSliderRightPlane', newValue);
    this.setState({ rightSliderValue: newValue }, () => this.updateCuttingPlanes());
  }

  async resetAll(e) {
    if(/* this.props.iafViewer.state.isShowGisViewer && */ this.state.enableMapBox){
       this.reactGisRef.current && await this.reactGisRef.current.resetAll()
      return;
    }
    // e.stopPropagation()
    const { commands } = this.props;
    if (this.props.testUi) {
      this.setState({
        displayToggleCuttingPlanes: false,
        displayToggleMapBox: false,
        displayToggleLoadConfig: false,
        showPlaneGeometry: true,
        viewMainIcon: { icon: ToolbarIcons.iconLeft, title: "View", defaultCheck: false },
      });
      let modelBounding = this.props.getModelBoundingBox();
      if (modelBounding && this.props.iscutt) {
        if (!this.props.cuttingPlaneValues) {
          this.state.topSliderValue = modelBounding?.min.z;
          this.state.bottomSliderValue = modelBounding?.min.z;
          this.state.leftSliderValue = modelBounding?.min.x;
          this.state.rightSliderValue = modelBounding?.min.x;
          this.state.frontSliderValue = modelBounding?.min.y;
          this.state.backSliderValue = modelBounding?.min.y;
        } else {
          this.state.topSliderValue = this.props.cuttingPlaneValues.min.z
            ? this.props.cuttingPlaneValues.min.z
            : modelBounding.min.z;
          this.state.bottomSliderValue = this.props.cuttingPlaneValues.min.z
            ? this.props.cuttingPlaneValues.min.z
            : modelBounding.min.z;
          this.state.leftSliderValue = this.props.cuttingPlaneValues.min.x
            ? this.props.cuttingPlaneValues.min.x
            : modelBounding.min.x;
          this.state.rightSliderValue = this.props.cuttingPlaneValues.min.x
            ? this.props.cuttingPlaneValues.min.x
            : modelBounding.min.x;
          this.state.backSliderValue = this.props.cuttingPlaneValues.min.y
            ? this.props.cuttingPlaneValues.min.y
            : modelBounding.min.y;
          this.state.frontSliderValue = this.props.cuttingPlaneValues.min.y
            ? this.props.cuttingPlaneValues.min.y
            : modelBounding.min.y;
        }
        await this.updateCuttingPlanes();
        await this.props.iafCuttingPlanesUtils.showCuttingPlaneGeometry(false);
      }
    }
    this.props.resetAll();
    const isCameraSettingsNotSaved = _.isEmpty(this.props.iafViewer.state.initialCameraPosition);
    if(isCameraSettingsNotSaved){
      this.state.isWalkMode && NotificationStore.notifyResetToWalkMode(this.props.iafViewer);
      this.state.isWalkMode && this.cameraWalkMode(true);
    }
    // this.props.iafViewer.props.openNotification("Reset Sucessful !",3000);
    // this.edgefaceShaded()
  }
  handleUtilities(callback,icon) {
    //update mainIcon
    // let mainIcon = this.state.manipulateMainIcon;
    // mainIcon.icon = icon;
    // this.setState({ manipulateMainIcon: mainIcon });
    this.closeSubmenu();
    callback();
  }
  showSubmenu(flagJson,divId) {
    let newFlag = Object.assign({}, DefaultSubMenuFlags, flagJson);
    this.setState({ submenuFlags: newFlag });
    this.getDivPosition(divId);
  }
  toggleFocusMode() {
    this.setState({ isFocusMode: !this.state.isFocusMode }, () => {
      this.props.handleFocusMode(this.state.isFocusMode);
    });
  }
  closeSubmenu(flagJson) {
    let newFlag = Object.assign({}, DefaultSubMenuFlags, flagJson);
    this.setState({ submenuFlags: newFlag });
  }
  changeProjectionMode() {
    if (this.state.isPerspective) {
      // this.props.viewer.view.setProjectionMode(
      //   Communicator.Projection.Orthographic
      // );
      setIafCameraProjection(this.props.viewer, Communicator.Projection.Orthographic);
      this.setState({ isPerspective: false });
    } else {
      // this.props.viewer.view.setProjectionMode(
      //   Communicator.Projection.Perspective
      // );
      setIafCameraProjection(this.props.viewer, Communicator.Projection.Perspective);
      this.setState({ isPerspective: true });
    }
    // this.props.iafViewer.props.openNotification("Changed Projection !",3000);
  }

  viewLeft() {
    this.props.viewer.view.setViewOrientation(Communicator.ViewOrientation.Left
      // , 0, this.props.iafViewer.iafCuttingPlanesUtils.modelBounding, true //ATK PLG-1049: Civil 3D Project disorients/disappears on reenabling GIS in the same session
    );
    this.activeViewIcon(ToolbarIcons.iconLeft)
    this.closeSubmenu();
  }

  viewRight() {
    this.props.viewer.view.setViewOrientation(Communicator.ViewOrientation.Right
      // , 0, this.props.iafViewer.iafCuttingPlanesUtils.modelBounding, true //ATK PLG-1049: Civil 3D Project disorients/disappears on reenabling GIS in the same session
    );
    this.activeViewIcon(ToolbarIcons.iconRight)
    this.closeSubmenu();
  }

  viewBottom() {
    this.props.viewer.view.setViewOrientation(Communicator.ViewOrientation.Bottom
      // , 0, this.props.iafViewer.iafCuttingPlanesUtils.modelBounding, true //ATK PLG-1049: Civil 3D Project disorients/disappears on reenabling GIS in the same session
    );
    this.activeViewIcon(ToolbarIcons.iconBottom)
    this.closeSubmenu();
  }

  viewTop() {
    this.props.viewer.view.setViewOrientation(Communicator.ViewOrientation.Top
      // , 0, this.props.iafViewer.iafCuttingPlanesUtils.modelBounding, true //ATK PLG-1049: Civil 3D Project disorients/disappears on reenabling GIS in the same session
    );
    this.activeViewIcon(ToolbarIcons.iconTop)
    this.closeSubmenu();
  }

  viewFront() {
    this.props.viewer.view.setViewOrientation(Communicator.ViewOrientation.Front
      // , 0, this.props.iafViewer.iafCuttingPlanesUtils.modelBounding, true //ATK PLG-1049: Civil 3D Project disorients/disappears on reenabling GIS in the same session
    );
    this.activeViewIcon(ToolbarIcons.iconFront)
    this.closeSubmenu();
  }

  viewBack() {
    this.props.viewer.view.setViewOrientation(Communicator.ViewOrientation.Back
      // , 0, this.props.iafViewer.iafCuttingPlanesUtils.modelBounding, true //ATK PLG-1049: Civil 3D Project disorients/disappears on reenabling GIS in the same session
    );
    this.activeViewIcon(ToolbarIcons.iconBack)
    this.closeSubmenu();
  }

  // function will delete the resizeHandler, when we switch from one operator to other operator (including select)
  resetResizeHandler () {
    this.props.iafViewer.markupManager && this.props.iafViewer.markupManager.drawTextOperator.escapeTextMode();
    this.props.iafViewer.markupManager2d && this.props.iafViewer.markupManager2d.drawTextOperator.escapeTextMode();
    
    this.props.iafViewer.markupManager && this.props.iafViewer.markupManager.drawImageBoxOperator.escapeTextMode();
    this.props.iafViewer.markupManager2d && this.props.iafViewer.markupManager2d.drawImageBoxOperator.escapeTextMode();
    
    this.props.iafViewer.markupManager && this.props.iafViewer.markupManager.endEdit();
    this.props.iafViewer.markupManager2d && this.props.iafViewer.markupManager2d.endEdit();
  }
  
  updateRepeatLastModeIcon(icon) {
    this.props.iafViewer.markupManager && this.props.iafViewer.markupManager.repeatLastMode && this.activeMeasurementIcon(icon);
    this.props.iafViewer.markupManager2d && this.props.iafViewer.markupManager2d.repeatLastMode && this.activeMeasurementIcon(icon);
  }

  async updateCommand(command) {
    // Removing textboxes which are edit mode.
    this.props.iafViewer.markupManager && this.props.iafViewer.markupManager.drawTextOperator.removeDraftTextbox();
    this.props.iafViewer.markupManager2d && this.props.iafViewer.markupManager2d.drawTextOperator.removeDraftTextbox();
    this.setState({ selectedMarkupType: command });
    
    // Toggle off everytime selecing same/different markup. 
    if(this.state.repeatLastMode){
      NotificationStore.notifyRepeatModeAutoToggleOff(this.props.iafViewer);
      await IafUtils.sleep(2000);
      this.handleEnableRepeatMode(command, false);
    }else{
      this.activeMeasurementIcon(ToolbarIcons.iconSelect)
    }
    this.props.iafViewer.markupManager && this.props.iafViewer.markupManager.setMode(IafMarkupManager.InteractionMode.Create, command);
    this.props.iafViewer.markupManager2d && this.props.iafViewer.markupManager2d.setMode(IafMarkupManager.InteractionMode.Create, command); 
  }

  // function to set operator to draw line
  drawLineMarkupHandler () {
    this.resetResizeHandler();
    this.updateCommand(IafMarkupManager.MarkupType.LINE);
    this.updateRepeatLastModeIcon(ToolbarIcons.iconLine);
    this.closeSubmenu();
  }

  drawCircleMarkupHandler () {
    this.resetResizeHandler();
    this.updateCommand(IafMarkupManager.MarkupType.CIRCLE);
    this.updateRepeatLastModeIcon(ToolbarIcons.iconCircle);
    this.closeSubmenu();
  }

  drawRectangleMarkupHandler () {
    this.resetResizeHandler();
    this.updateCommand(IafMarkupManager.MarkupType.RECTANGLE);
    this.updateRepeatLastModeIcon(ToolbarIcons.iconRectangle);
    this.closeSubmenu();
  }

  drawPolylineMarkupHandler () {
    this.resetResizeHandler();
    this.updateCommand(IafMarkupManager.MarkupType.POLYLINE);
    this.updateRepeatLastModeIcon(ToolbarIcons.iconPolyline);
    this.closeSubmenu();
  }

  drawFreehandMarkupHandler () {
    this.resetResizeHandler();
    this.updateCommand(IafMarkupManager.MarkupType.FREEHAND);
    this.updateRepeatLastModeIcon(ToolbarIcons.iconFreehand);
    this.closeSubmenu();
  }

  // HSK PLAT-4978: UX | Add UI markup command for Polygon which should internally called IafMarkupPolyline with autoComplete enabled
  drawPolygonMarkupHandler () {
    this.resetResizeHandler();
    this.updateCommand(IafMarkupManager.MarkupType.POLYGON);
    this.updateRepeatLastModeIcon(ToolbarIcons.iconPolygon);
    this.closeSubmenu();
  }

  drawTextBoxHandler(){
    this.resetResizeHandler();
    this.updateCommand(IafMarkupManager.MarkupType.LEADERNOTE);
    this.updateRepeatLastModeIcon(ToolbarIcons.iconTextbox);
    this.closeSubmenu();
  }

  draw3DTextBoxHandler(){
    this.resetResizeHandler();
    this.updateCommand(IafMarkupManager.MarkupType.TEXT);
    this.updateRepeatLastModeIcon(ToolbarIcons.icon3DTextbox);
    this.closeSubmenu();
  }
  
  drawImageBoxHandler(){
    // this.props.iafViewer.markupManager && this.props.iafViewer.markupManager.drawImageBoxOperator.removeDraftTextbox();
    this.resetResizeHandler();
    this.updateCommand(IafMarkupManager.MarkupType.SPRITE);
    this.updateRepeatLastModeIcon(ToolbarIcons.iconSprite);
    this.props.iafViewer.markupManager && this.props.iafViewer.markupManager.setImageboxType(true);
    // this.props.iafViewer.markupManager2d && this.props.iafViewer.markupManager2d.setImageboxType(true);
    this.closeSubmenu();
  }

  drawExportHandler() {
    IafStorageUtils.exportAnnotations(this.props.iafViewer);
    NotificationStore.notifyAnnotationsExportAnnotations(this.props.iafViewer);
  }

  drawImportHandler() {
    IafStorageUtils.importAnnotationsDynamic(this.props.iafViewer);
  }

  drawFunction() {
    this.activeMeasurementIcon(ToolbarIcons.iconSelect);
    this.closeSubmenu();
  }

  activeShadingIcon(icon) {
    let mainIcon = this.state.shadingMainIcon;
    //update mainIcon
    mainIcon.icon = icon;
    this.setState({ shadingMainIcon: mainIcon });
  }
  activeViewIcon(icon) {
    let mainIcon = this.state.viewMainIcon;
    //update mainIcon
    mainIcon.icon = icon;
    this.setState({ viewMainIcon: { ...mainIcon, defaultCheck: true } });
  }

  edgefaceXray() {
    this.props.viewer.view.setDrawMode(Communicator.DrawMode.XRay);
    this.activeShadingIcon(ToolbarIcons.iconGlass);
  }

  // PLG-1603: Draw mode is already handled via iafViewer -> syncRenderingMode,
  // so no additional viewer-side call is required here. just update the UX (icon)
  async edgefaceShaded() {
    // await this.props.commands.setDrawMode(
    //   false,
    //   false,
    //   Communicator.DrawMode.Shaded
    // );
    // PLG-1603 callback on selecting any of the mode to notify application will set renderingMode back which trigger application back.
    this.props.iafViewer?.props?.view3d?.onRenderingModeChange?.(Communicator.DrawMode.Shaded);
    // await this.props.viewer.view.setDrawMode(Communicator.DrawMode.Shaded);
    this.activeShadingIcon(ToolbarIcons.iconFullNoLines);
    this.closeSubmenu();

    IafStorageUtils.saveGraphicsCache(this.props.iafViewer);
  }

  async edgefaceHiddenLine() {
    // await this.props.commands.setDrawMode(
    //   false,
    //   false,
    //   Communicator.DrawMode.HiddenLine
    // );
    this.props.iafViewer?.props?.view3d?.onRenderingModeChange?.(Communicator.DrawMode.HiddenLine);
    const hiddenLineSettings = this.props.viewer.view.getHiddenLineSettings();
    hiddenLineSettings.setBackgroundColor(null)
    // await this.props.viewer.view.setDrawMode(Communicator.DrawMode.HiddenLine);
    this.activeShadingIcon(ToolbarIcons.iconHiddlenLines);
    this.closeSubmenu();

    IafStorageUtils.saveGraphicsCache(this.props.iafViewer);
  }

  async edgefaceWireframe() {
    // await this.props.commands.setDrawMode(
    //   false,
    //   false,
    //   Communicator.DrawMode.Wireframe
    // );
    this.props.iafViewer?.props?.view3d?.onRenderingModeChange?.(Communicator.DrawMode.Wireframe);
    // await this.props.viewer.view.setDrawMode(Communicator.DrawMode.Wireframe);
    this.activeShadingIcon(ToolbarIcons.iconWireFrame);

    IafStorageUtils.saveGraphicsCache(this.props.iafViewer);    
  }

  async edgefaceWireframeShaded() {
    // await this.props.commands.setDrawMode(
    //   false,
    //   false,
    //   Communicator.DrawMode.WireframeOnShaded
    // );
    this.props.iafViewer?.props?.view3d?.onRenderingModeChange?.(Communicator.DrawMode.WireframeOnShaded);
    // await this.props.viewer.view.setDrawMode(
    //   Communicator.DrawMode.WireframeOnShaded
    // );
    this.activeShadingIcon(ToolbarIcons.iconFullWithLines);
    this.closeSubmenu();

    IafStorageUtils.saveGraphicsCache(this.props.iafViewer);
  }

  activeMeasurementIcon(icon) {
    //update mainIcon
    this.setState(prevState => ({
      measurementMainIcon: {
        ...prevState.measurementMainIcon,
        icon: icon
      }
    }));
  }

  clickMeasurePoint() {
    if (!this.props.iafViewer._viewer2d && !this.props.viewer) return; //Measurement functions (e..g clickMeasurePoint) don't take into account ONLY 2D Project
    this.props.viewer && this.props.viewer.operatorManager.set(
      Communicator.OperatorId.MeasurePointPointDistance,
      IafOperatorUtils.IafOperatorPosition.Operation
    );
    this.props.iafViewer._viewer2d && this.props.iafViewer.enable2dMeasurment(); // Measurement functions (e..g clickMeasurePoint) don't take into account ONLY 2D Project
    this.activeMeasurementIcon(ToolbarIcons.iconPoints);
    this.setState({ showMeasurementConversionDialog: true });
    this.closeSubmenu();
  }

  clickMeasureEdge() {
    this.props.viewer.operatorManager.set(
      Communicator.OperatorId.MeasureEdgeLength,
      IafOperatorUtils.IafOperatorPosition.Operation
    );
    this.activeMeasurementIcon(ToolbarIcons.iconEdges);
  }

  clickMeasureDistance() {
    this.props.viewer.operatorManager.set(
      Communicator.OperatorId.MeasureFaceFaceDistance,
      IafOperatorUtils.IafOperatorPosition.Operation
    );
    this.activeMeasurementIcon(ToolbarIcons.iconFaces);
  }

  clickMeasureAngle() {
    this.props.viewer.operatorManager.set(
      Communicator.OperatorId.MeasureFaceFaceAngle,
      IafOperatorUtils.IafOperatorPosition.Operation
    );
    this.activeMeasurementIcon(ToolbarIcons.iconAngle);
  }

  activeNavIcon(icon) {
    let mainIcon = this.state.navMainIcon;
    /*if(mainIcon == ToolbarIcons.iconNavPan && icon != ToolbarIcons.iconNavPan){
      this.resetCameraPan()
    }*/
    //update mainIcon
    mainIcon.icon = icon;
    this.setState({ navMainIcon: mainIcon });
  }

  cameraOrbit() {
    const { viewer } = this.props;
    viewer.operatorManager.set(this.props.navOperatorId, 0);
    /*if(viewer.operatorManager.indexOf(this.props.zoomOperatorId) < 0) {
      let zoomOp = viewer.operatorManager.getOperator(this.props.zoomOperatorId)
      zoomOp.setMouseWheelZoomDelta(ZoomDelta)
      viewer.operatorManager.push(this.props.zoomOperatorId)
    }*/
    IafOperatorUtils.setCameraNavigation (this.props, 
      IafOperatorUtils.IafNavType.NavOrbit);
    this.activeNavIcon(ToolbarIcons.iconNavCamera);
    this.closeSubmenu();
    this.setState({isWalkMode:false})
  }

  cameraTurnTable() {
    const { viewer } = this.props;
    // if (viewer.operatorManager.indexOf(this.props.zoomOperatorId) > 0) {
    //   viewer.operatorManager.remove(this.props.zoomOperatorId)
    // }
    // viewer.operatorManager.set(Communicator.OperatorId.Turntable, IafOperatorUtils.IafOperatorPosition.Navigation);

    IafOperatorUtils.setCameraNavigation (this.props, 
      IafOperatorUtils.IafNavType.NavTurnTable);
    this.activeNavIcon(ToolbarIcons.iconNavRotate);
    this.closeSubmenu();
    this.setState({isWalkMode:false})
  }

  async cameraWalkMode(isInitialLoad) {
    const { viewer } = this.props;
    // if (viewer.operatorManager.indexOf(this.props.zoomOperatorId) > 0) {
    //   viewer.operatorManager.remove(this.props.zoomOperatorId)
    // }

    // if (this.props.walkOperatorId !== undefined) {
    //   let mouseOper = viewer.operatorManager.getOperator(this.props.walkOperatorId)
    //   viewer.operatorManager.set(this.props.walkOperatorId, IafOperatorUtils.IafOperatorPosition.Navigation);
    // }
 
    // if walk mode is selected and shading mode is not shading with no lines switch to shading with no lines
    if(this.state.drawMode !== IafDrawMode.Shaded)
    this.edgefaceShaded()
    IafOperatorUtils.setCameraNavigation (this.props, 
      IafOperatorUtils.IafNavType.NavWalk);
    // this.setState({ isFocusMode: false }, () => {
    //   this.props.toggleFocusModeOnWalkModeChange();  //This code is commented to keep focus mode on even while walking in walk mode
    // }); 
    this.setState({ showwalkmode: true, userHasOpenedSidePanel: true });
    this.toggleLearningContent(true);
    this.toggleGisViewerContent(false);
    this.toggleLoadConfigContent(undefined, false);
    this.toggleCuttingContent(false);
    this.toggleSettingContent(false);
    this.toggleMarkupsContent(false)
    //this.setState({tempVar:true})
    this.activeNavIcon(ToolbarIcons.iconNavFirstP);
    this.closeSubmenu();

    this.setState({isWalkMode:true})

    // 08-02-24 RRP PLAT-3258 Intuitive default orientation on enabling the walk mode
    resetCameraToStandardView(this.props.iafViewer, window.Communicator.ViewOrientation.Back, isInitialLoad)
  }

  //reset Pan Operator from left button to Control+left button
  resetCameraPan() {
    return this.cameraPan();
    const { viewer } = this.props;
    let panOp = viewer.operatorManager.getOperator(Communicator.OperatorId.Pan);
    panOp.setMapping(Communicator.Button.Middle);
    if (viewer.operatorManager.indexOf(Communicator.OperatorId.Pan) < 0) {
      viewer.operatorManager.push(Communicator.OperatorId.Pan);
    }
  }

  toggle2dViewer() {
    this.props.toggleVisibilityViewer2d();
    if (this.props.iafViewer.state.visible)
      document.getElementById(this.props.iafViewer.evmElementIdManager.getEvmElementUuidViewer2DIcon()).style.color = "#ff0000";
    else {
      document.getElementById(this.props.iafViewer.evmElementIdManager.getEvmElementUuidViewer2DIcon()).style.fill = "#666666";
    }

    // this.setState({ isViewer2DVisible: !this.state.isViewer2DVisible });
  }

  toggle3dViewer() {
    this.props.toggleVisibilityViewer3d();
    if (this.props.iafViewer.state.visible3d)
      document.getElementById(this.props.iafViewer.evmElementIdManager.getEvmElementUuidViewer3DIcon()).style.color = "#ff0000";
    else {
      document.getElementById(this.props.iafViewer.evmElementIdManager.getEvmElementUuidViewer3DIcon()).style.fill = "#666666";
    }

    // this.setState({ isViewer3DVisible: !this.state.isViewer3DVisible });
  }

  toggleArcgis() {
    this.props.toggleVisibilityArcgis();
    if (this.props.iafViewer.state.visibleArcgis)
      document.getElementById(this.props.iafViewer.evmElementIdManager.getEvmElementUuidArcgisIcon()).style.color = "#ff0000";
    else {
      document.getElementById(this.props.iafViewer.evmElementIdManager.getEvmElementUuidArcgisIcon()).style.fill = "#666666";
    }
    // this.setState({ isArcgisVisible: !this.state.isArcgisVisible });
  }

  toggleArcgisOverview() {
    this.props.toggleVisibilityArcgisOverview();
    if (this.props.iafViewer.state.visibleArcgisOverview)
      document.getElementById(this.props.iafViewer.evmElementIdManager.getEvmElementUuidArcgisOverviewIcon()).style.color = "#ff0000";
    else {
      document.getElementById(this.props.iafViewer.evmElementIdManager.getEvmElementUuidArcgisOverviewIcon()).style.fill = "#666666";
    }
    // this.setState({ isArcgisOverviewVisible: !this.state.isArcgisOverviewVisible });
  } 

  toggleUnrealEngine() {
    this.props.toggleVisibilityUnrealEngine();
    if (this.props.iafViewer.state.visibleUnrealEngine)
      document.getElementById(this.props.iafViewer.evmElementIdManager.getEvmElementUuidUnrealEngineIcon()).style.color = "#ff0000";
    else {
      document.getElementById(this.props.iafViewer.evmElementIdManager.getEvmElementUuidUnrealEngineIcon()).style.fill = "#666666";
    }
    // this.setState({ isUnrealEngineVisible: !this.state.isUnrealEngineVisible });
  }

  togglePhotosphere() {
    this.props.toggleVisibilityPhotosphere();
    if (this.props.iafViewer.state.visiblePhotosphere)
      document.getElementById(this.props.iafViewer.evmElementIdManager.getEvmElementUuidPhotosphereIcon()).style.color = "#ff0000";
    else {
      document.getElementById(this.props.iafViewer.evmElementIdManager.getEvmElementUuidPhotosphereIcon()).style.fill = "#666666";
    }
    // this.setState({ isPhotosphereVisible: !this.state.isPhotosphereVisible });
  }
 
  toggleAnimationPlay() {
    if (this.props.iafViewer) {
      let result = true;

      this.state.isFocusMode && this.toggleFocusMode();
      
      if (!this.props.iafViewer.state.isAnimationPlaying) {
        result = this.props.iafViewer.animationManager2d.playAnimation(null, {notify: true});
      } else {
        this.props.iafViewer.animationManager2d.stopAnimation(null, {notify: true});
      }
            
      result && this.props.iafViewer.setState({ isAnimationPlaying: !this.props.iafViewer.state.isAnimationPlaying });  
    }
  }

  resetStatesForEditControls() {
    this.props.toggleVisibilityViewer2d();
    this.props.toggleVisibilityViewer3d();
    this.props.toggleVisibilityArcgis();
    this.props.toggleVisibilityArcgisOverview();
    this.props.toggleVisibilityUnrealEngine();
    this.props.toggleVisibilityPhotosphere();
    // this.setState({ 
    //   isViewer2DVisible: this.props.iafViewer?.props?.view2d?.enable ?? false, 
    //   isViewer3DVisible: this.props.iafViewer?.props?.view3d?.enable ?? false,
    //   isArcgisVisible: this.props.iafViewer?.props?.arcgis?.enable ?? false, 
    // });
  }

  cameraPan() {
    // const { viewer } = this.props
    //keep zoom in Pan mode
    /*viewer.operatorManager.set(Communicator.OperatorId.Pan, IafOperatorUtils.IafOperatorPosition.Navigation)
    if(viewer.operatorManager.indexOf(this.props.zoomOperatorId) > 0) {
      viewer.operatorManager.remove(this.props.zoomOperatorId)
    }*/
    IafOperatorUtils.setCameraNavigation (this.props, 
      IafOperatorUtils.IafNavType.NavPan);
    this.activeNavIcon(ToolbarIcons.iconNavPan)
    this.closeSubmenu();
    this.setState({isWalkMode:false})
  }

  cameraZoom() {
    // const { viewer } = this.props
    // if (viewer.operatorManager.indexOf(this.props.zoomOperatorId) > 0) {
    //   viewer.operatorManager.remove(this.props.zoomOperatorId)
    // }
    // let zoomOp = viewer.operatorManager.getOperator(this.props.zoomOperatorId)

    const { zoomOp } = IafOperatorUtils.setCameraNavigation (this.props, 
      IafOperatorUtils.IafNavType.NavZoom);
    //Default changed from 0.25 to 0.05
    zoomOp.setMouseWheelZoomDelta(ZoomDelta)
    this.activeNavIcon(ToolbarIcons.iconNavZoom)
    this.closeSubmenu();
    this.setState({isWalkMode:false})
  }

  getDivPosition(divId) {
    /** RRP: AA-1469 Why this is not better.
       * The rect.top property provides the element's position relative to the viewport, not its parent container.
       * This means the calculated position (rect.top - rect.height - 20) doesn't align the mega menu properly 
       * within the parent container, especially if the parent container has any offsets or isn't at the top 
       * of the viewport.
   **/
  
   // const element = document.getElementById(divId.id);
   // const rect = element.getBoundingClientRect();
   // const posTop=rect.top-rect.height-20+'px';
   // this.setState({posTop:posTop})
   
    /** RRP: AA-1469 Why this is better.
    * Calculate the vertical distance from the parent container's top.
    * - `childRect.top` gives the absolute position of the child relative to the viewport.
    * - `parentRect.top` gives the absolute position of the parent relative to the viewport.
    * - Subtracting the two gives the relative position of the child within the parent container.
    * This ensures that the calculated position is accurate even if the parent or entire page has been scrolled.
    */
   const element = document.getElementById(divId.id);
   const parentRect = element.parentElement.getBoundingClientRect();
   const childRect = element.getBoundingClientRect();
   // Calculate the distance from the parent's top
   const distanceFromParentTop = childRect.top - parentRect.top;
   const posTop= distanceFromParentTop+'px';
   this.setState({posTop:posTop})
 }

  componentDidMount() {
    this.updateStates();
    this.handlePanelCount();

    const showLoadConfigContentExternal = this.state.showLoadConfigContentExternal;
    this.props.iafViewer?.props?.graphicsHandler?.models.forEach((model) => {
      if (model._id) {
        showLoadConfigContentExternal.set(model._id, false);
      }
    });
    const enableMapBox = this.props.iafViewer.getViewerState("gis", "enable")
    if(enableMapBox){
      this.showGisViewerModal()
    }
    this.setState({showLoadConfigContentExternal, enableMapBox: enableMapBox});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.drawMode != prevState.drawMode) {
      // PLG-1603: Draw mode is already handled via iafViewer -> syncRenderingMode,
      // so no additional viewer-side call is required here. just update the UX (icon)
      switch (this.state.drawMode) {
        case IafDrawMode.Shaded:
          // this.edgefaceShaded();
          this.activeShadingIcon(ToolbarIcons.iconFullNoLines);
          break;
        case IafDrawMode.Glass:
          //already setGlassMode in IafViewer, just update the shading icon
          this.activeShadingIcon(ToolbarIcons.iconGlass);
          break;
        case IafDrawMode.WireframeOnShaded:
          // this.edgefaceWireframeShaded();
          this.activeShadingIcon(ToolbarIcons.iconFullWithLines);
          break;
        case IafDrawMode.HiddenLine:
          // this.edgefaceHiddenLine();
          this.activeShadingIcon(ToolbarIcons.iconHiddlenLines);
          break;
        default:
          // this.edgefaceShaded();
          this.activeShadingIcon(ToolbarIcons.iconFullNoLines);
          break;
      }
    }
    if (
      this.props.btns !== prevProps.btns ||
      this.props.toolbarList !== prevProps.toolbarList
    ) {
      this.updateStates();
    }

    const ready = this.props?.iafViewer?.state?.isModelStructureReady;
    if (ready && !this.state.isReady) {
      this.setState({ isReady: true });
    }

    if (this.props.enableMapBox !== prevProps.enableMapBox) {
      // Toggle on only when enableMapBox true with is default.
      // if(this.props.enableMapBox){
      //   this.showGisViewerModal()
      // }
    // TODO: This local state is duplicate we can reuse iafViewer setViewerState for consistence.
      this.setState({ enableMapBox: this.props.enableMapBox });
    }

    // Disable Cutting Planes when Elevation Mode is QuickSurface or QuickUnderground
    const currentElevationMode = this.props.iafViewer?.state?.gis?.elevationMode;
    const prevElevationMode = prevProps.iafViewer?.state?.gis?.elevationMode;
    
    if (currentElevationMode !== prevElevationMode) {
      if (currentElevationMode === GisElevationMode.QuickSurface || currentElevationMode === GisElevationMode.QuickUnderground) {
        // Elevation Mode is QuickSurface or QuickUnderground - disable cutting planes and turn off show planes
        if (this.state.enableCuttingPlanes || this.state.showPlaneGeometry) {
          this.setState({ 
            enableCuttingPlanes: false,
            showPlaneGeometry: false
          }, async () => {
            if (this.props.testUi && this.props.iafCuttingPlanesUtils) {
              await this.props.iafCuttingPlanesUtils.showCuttingPlaneGeometry(false);
              await this.updateCuttingPlanes();
              this.props.iafCuttingPlanesUtils.enableCuttingPlanes(false);
            }
          });
        }
      }
    }

    // View3d disposed: `viewer` prop clears when `iafViewer._viewer` is torn down — sync standard cutting plane toggles
    if (prevProps.viewer && !this.props.viewer) {
      if (this.state.enableCuttingPlanes || this.state.showPlaneGeometry) {
        this.setState({
          enableCuttingPlanes: false,
          showPlaneGeometry: false,
        });
      }
    }

    // Sync showAllMarkup with showAnnotations state
    const currentShowAnnotations = this.props.iafViewer?.state?.showAnnotations;
    const prevShowAnnotations = prevProps.iafViewer?.state?.showAnnotations;
    
    if (currentShowAnnotations !== prevShowAnnotations && currentShowAnnotations !== undefined) {
      // Update local showAllMarkup state to match showAnnotations
      if (this.state.showAllMarkup !== currentShowAnnotations) {
        this.setState({ showAllMarkup: currentShowAnnotations });
      }
    }
  }
  updateStates() {
    if (this.props.btns &&
      this.props.btns.Orthographic &&
      this.props.btns.Orthographic.display === false) {
      this.setState({ isOrthographicDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.Orthographic === undefined ||
      this.props.btns.Orthographic.display === undefined) {
      this.setState({
        isOrthographicDisabled: this.props.toolbarList[1].displayDisabled,
      });
    } else {
      this.setState({ isOrthographicDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.Analytics &&
      this.props.btns.Analytics.display === false) {
      this.setState({ isAnalyticsDisabled: true });
    } else {
      this.setState({ isAnalyticsDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.viewer2D &&
      this.props.btns.viewer2D.display === false) {
      this.setState({ is2DviewerDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.viewer2D === undefined ||
      this.props.btns.viewer2D.display === undefined) {
      this.setState({
        is2DviewerDisabled: false,
      });
    } else {
      this.setState({ is2DviewerDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.viewer3D &&
      this.props.btns.viewer3D.display === false) {
      this.setState({ is3DviewerDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.viewer3D === undefined ||
      this.props.btns.viewer3D.display === undefined) {
      this.setState({
        is3DviewerDisabled: false,
      });
    } else {
      this.setState({ is3DviewerDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.arcgis &&
      this.props.btns.arcgis.display === false) {
      this.setState({ isArcgisDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.arcgis === undefined ||
      this.props.btns.arcgis.display === undefined) {
      this.setState({
        isArcgisDisabled: false,
      });
    } else {
      this.setState({ isArcgisDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.arcgisOverview &&
      this.props.btns.arcgisOverview.display === false) {
      this.setState({ isArcgisOverviewDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.arcgisOverview === undefined ||
      this.props.btns.arcgisOverview.display === undefined) {
      this.setState({
        isArcgisOverviewDisabled: false,
      });
    } else {
      this.setState({ isArcgisOverviewDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.unrealEngine &&
      this.props.btns.unrealEngine.display === false) {
      this.setState({ isUnrealEngineDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.unrealEngine === undefined ||
      this.props.btns.unrealEngine.display === undefined) {
      this.setState({
        isUnrealEngineDisabled: false,
      });
    } else {
      this.setState({ isUnrealEngineDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.photosphere &&
      this.props.btns.photosphere.display === false) {
      this.setState({ isPhotosphereDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.photosphere === undefined ||
      this.props.btns.photosphere.display === undefined) {
      this.setState({
        isPhotosphereDisabled: false,
      });
    } else {
      this.setState({ isPhotosphereDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.AnimationPlay &&
      this.props.btns.AnimationPlay.display === false) {
      this.setState({ isAnimationPlayDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.AnimationPlay === undefined ||
      this.props.btns.AnimationPlay.display === undefined) {
      this.setState({
        isAnimationPlayDisabled: false,
      });
    } else {
      this.setState({ isAnimationPlayDisabled: false });
    }    

    if (this.props.btns &&
      this.props.btns.AnimationStop &&
      this.props.btns.AnimationStop.display === false) {
      this.setState({ isAnimationStopDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.AnimationStop === undefined ||
      this.props.btns.AnimationStop.display === undefined) {
      this.setState({
        isAnimationStopDisabled: false,
      });
    } else {
      this.setState({ isAnimationStopDisabled: false });
    }        

    if (this.props.btns &&
      this.props.btns.Reset &&
      this.props.btns.Reset.display === false) {
      this.setState({ isResetDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.Reset === undefined ||
      this.props.btns.Reset.display === undefined) {
      this.setState({ isResetDisabled: this.props.toolbarList[0].displayDisabled });
    } else {
      this.setState({ isResetDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.Projection &&
      this.props.btns.Projection.display === false) {
      this.setState({ isProjectionDisabled: true });
    } else {
      this.setState({ isProjectionDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.View &&
      this.props.btns.View.display === false) {
      this.setState({ isViewDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.View === undefined ||
      this.props.btns.View.display === undefined) {
      this.setState({
        isViewDisabled: !this.props.viewList.filter(
          (item) => item.displayDisabled === false
        ).length > 0,
      });
    } else {
      this.setState({ isViewDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.Shading &&
      this.props.btns.Shading.display === false) {
      this.setState({ isShadingDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.Shading === undefined ||
      this.props.btns.Shading.display === undefined) {
      this.setState({
        isShadingDisabled: !this.props.shadingList.filter(
          (item) => item.displayDisabled === false
        ).length > 0,
      });
    } else {
      this.setState({ isShadingDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.Navigation &&
      this.props.btns.Navigation.display === false) {
      this.setState({ isNaviDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.Navigation === undefined ||
      this.props.btns.Navigation.display === undefined) {
      this.setState({
        isNaviDisabled: !this.props.navigationList.filter(
          (item) => item.displayDisabled === false
        ).length > 0,
      });
    } else {
      this.setState({ isNaviDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.Measurement &&
      this.props.btns.Measurement.display === false) {
      this.setState({ isMeasurementDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.Measurement === undefined ||
      this.props.btns.Measurement.display === undefined) {
      this.setState({
        isMeasurementDisabled: !this.props.measurementList.filter(
          (item) => item.displayDisabled === false
        ).length > 0,
      });
    } else {
      this.setState({ isMeasurementDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.Utilities &&
      this.props.btns.Utilities.display === false) {
      this.setState({ isUtilitiesDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.Utilities === undefined ||
      this.props.btns.Utilities.display === undefined) {
      this.setState({
        isUtilitiesDisabled: !this.props.manipulateList.filter(
          (item) => item.displayDisabled === false
        ).length > 0,
      });
    } else {
      this.setState({ isUtilitiesDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.CuttingPlane &&
      this.props.btns.CuttingPlane.display === false) {
      this.setState({ isCuttingPlaneDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.CuttingPlane === undefined ||
      this.props.btns.CuttingPlane.display === undefined) {
      this.setState({
        isCuttingPlaneDisabled: this.props.toolbarList[2].displayDisabled,
      });
    } else {
      this.setState({ isCuttingPlaneDisabled: false });
    }

    if (this.props.btns &&
      this.props.btns.Settings &&
      this.props.btns.Settings.display === false) {
      this.setState({ isSettingsDisabled: true });
    } else if (this.props.btns === undefined ||
      this.props.btns.Settings === undefined ||
      this.props.btns.Settings.display === undefined) {
      this.setState({
        isSettingsDisabled: this.props.toolbarList[2].displayDisabled,
      });
    } else {
      this.setState({ isSettingsDisabled: false });
    }
  }
  showSettingsModal() {
    // const prevState=this.state.displayToggle;
    // this.setState({displayToggle:!prevState});
  }
  showCommandsModal() {
    const prevState = this.state.visible;
    this.setState({ visible: !prevState });
    let commandArray = Object.keys(this.props.commands);
    const index = commandArray.indexOf("setDrawMode");
    if (index > -1) {
      commandArray.splice(index, 1);
    }
    this.setState({ commandValues: commandArray });
  }
  selectedCommand(event) {
    this.setState({ currentCommand: event.target.value });
    /* IafUtils.devToolsIaf && console.log(this.state.currentCommand); */
  }

  async runCommand() {
    let result;
    switch (this.state.currentCommand) {
      case "getSelectedEntities":
        result = await this.props.commands.getSelectedEntities();
        IafUtils.devToolsIaf && console.log(result);
        break;
      case "getSettings":
        result = await this.props.commands.getSettings();
        IafUtils.devToolsIaf && console.log(result);
        break;
      case "getIsolatedElements":
        result = this.props.commands.getIsolatedElements();
        IafUtils.devToolsIaf && console.log(result);
        break;
      case "getHiddenElemets":
        result = this.props.commands.getHiddenElemets();
        IafUtils.devToolsIaf && console.log(result);
        break;
      case "zoomToElements":
        result = this.props.commands.zoomToElements();
        IafUtils.devToolsIaf && console.log(result);
        break;
      case "getCuttingPlanes":
        let getCuttingPlanesResult = this.props.commands.getCuttingPlanes();
        this.setState({ getCuttingPlanesResult: getCuttingPlanesResult });
        IafUtils.devToolsIaf && console.log(getCuttingPlanesResult);
        break;
      case "setCuttingPlanes":
        
        let planeObj = {
          max: {
            x: 110779.2734375,
            y: 41673.015625,
            z: 32766,
          },
          min: {
            x: -25425.904296875,
            y: -7504.4423828125,
            z: -4343.39990234375,
          },
        };
        let setCuttingPlanesResult = this.state.getCuttingPlanesResult
          ? this.props.commands.setCuttingPlanes(
              this.state.getCuttingPlanesResult
            )
          : this.props.commands.setCuttingPlanes(planeObj);
        break;
      case "getCamera":
        let getCameraResult = this.props.commands.getCamera();
        this.setState({ getCameraResult: getCameraResult });
        IafUtils.devToolsIaf && console.log(getCameraResult);
        break;
      case "setCamera":
        let jsoncamera = {
          position: {
            x: -16719.92255399094,
            y: -42312.32259174621,
            z: 73607.90858470125,
          },
          target: {
            x: 42676.686030710305,
            y: 17084.28599295503,
            z: 14211.299999999997,
          },
          up: {
            x: 0.4082482904638631,
            y: 0.40824829046386313,
            z: 0.8164965809277261,
          },
          width: 149490.40282477168,
          height: 149490.40282477165,
          projection: 1,
          nearLimit: 0.001,
          className: "Communicator.Camera",
        };

        let setCameraResult = this.state.getCameraResult
          ? this.props.commands.setCamera(this.state.getCameraResult)
          : this.props.commands.setCamera(jsoncamera);
        break;
      case "getView":
        let getViewResult = this.props.commands.getView();
        this.setState({ getViewResult: getViewResult });
        IafUtils.devToolsIaf && console.log(getViewResult);
        break;
      case "setView":
        let letobjData = {
          camera: {
            position: {
              x: -16719.92255399094,
              y: -42312.32259174621,
              z: 73607.90858470125,
            },
            target: {
              x: 42676.686030710305,
              y: 17084.28599295503,
              z: 14211.299999999997,
            },
            up: {
              x: 0.4082482904638631,
              y: 0.40824829046386313,
              z: 0.8164965809277261,
            },
            width: 149490.40282477168,
            height: 149490.40282477165,
            projection: 1,
            nearLimit: 0.001,
            className: "Communicator.Camera",
          },
          cuttingPlnaes: {
            max: {
              x: 110779.2734375,
              y: 41673.015625,
              z: 32766,
            },
            min: {
              x: -25425.904296875,
              y: -7504.4423828125,
              z: -4343.39990234375,
            },
          },
          drawMode: 1,
          selection: [6127],
        };
        let setViewResult = this.state.getViewResult
          ? this.props.commands.setView(this.state.getViewResult)
          : this.props.commands.setView(letobjData);
        break;
    }
  }

  async showGisViewerModal() {
    // const prevState = this.state.displayToggleMapBox;
    // this.setState({ displayToggleMapBox: !prevState });
    // !prevState && this.setState({ displayToggleCuttingPlanes: false });
    // // this.dragElement(document.getElementById("cutting-plane-div"));
    await new Promise((resolve, reject) => {
      this.setState({
        displayToggleMapBox: !this.state.displayToggleMapBox
      }, async () => {
        try {
          if(this.props.iafViewer.gisInstance && !this.state.displayToggleMapBox){
            const gis = this.props.iafViewer.gisInstance
            if (gis.state.bModelRealignModeHorizontal) {
              await gis.handleToggleRealignHorizontalLow(); 
            }
          }
          resolve(); // Resolve the promise once the operation is complete
        } catch (error) {
          reject(error); // Reject the promise if an error occurs
        }
      });
    });
    
    if(this.props.iafViewer.state.isShowGisViewer){
      await this.props.iafViewer.toggleGisViewerDiv();
      this.toggleGisViewerContent(false);
    }
    else{
      await this.props.iafViewer.toggleGisViewerDiv();
      this.toggleGisViewerContent(true);
    }
  }

  async showLoadConfigModal() {
    // const prevState = this.state.displayToggleLoadConfig;
    // this.setState({ displayToggleLoadConfig: !prevState });
    // !prevState && this.setState({ displayToggleCuttingPlanes: false });
    // // this.dragElement(document.getElementById("cutting-plane-div"));
    this.setState({ displayToggleLoadConfig: !this.state.displayToggleLoadConfig});
    if(this.props.iafViewer.state.isShowLoadConfig){
      await this.props.iafViewer.toggleLoadConfigDiv();
      this.toggleLoadConfigContent(false);
    }
    else{
      this.setState({ userHasOpenedSidePanel: true });
      await this.props.iafViewer.toggleLoadConfigDiv();
      // this.toggleLoadConfigContent(undefined, true);
      this.toggleCuttingContent(false);
      this.toggleSettingContent(false);
      this.toggleMarkupsContent(false);
      this.toggleLearningContent(false);
    }

  }
  async showCuttingPlaneModal() {
    this.setState({ displayToggleCuttingPlanes: !this.state.displayToggleCuttingPlanes});
    if(this.props.iafViewer.state.isShowCuttingPlanes){
      await this.props.iafViewer.toggleCuttingPlanesDiv();
      this.toggleCuttingContent(false);
    }
    else{
      this.setState({ userHasOpenedSidePanel: true });
      await this.props.iafViewer.toggleCuttingPlanesDiv();
      this.toggleCuttingContent(true);
      this.toggleGisViewerContent(false);
      this.toggleLoadConfigContent(undefined, false);
      this.toggleSettingContent(false);
      this.toggleMarkupsContent(false);
      this.toggleLearningContent(false);
    }
  }
  handleSubmenu() {
    const prevState = this.state.displayToggle;
    this.setState({ displayToggle: !prevState });
  }
  countBtnsInFront() {
    let cnt = 0;
    for (let i = 0, j = arguments.length; i < j; i++) {
      if (!arguments[i]) cnt++;
    }
    return cnt;
  }
  
  async handleDeleteMarups(){
      const viewer = this.props.iafViewer;
      if(viewer?.iafDatabaseManager?._enablePersistence){
        await Promise.all([
          viewer.markupManager?.drawTextOperator.deleteMarkupDB(),
          viewer.markupManager2d?.drawTextOperator.deleteMarkupDB()
        ]);
        await Promise.all([
           viewer.markupManager?.reset(),
           viewer.markupManager2d?.reset()
        ]);
        // PLG-1117 Bug:- Deleting Check Distance (Measurement) Annotations 
        // Since it is not stored in DB it was not considered in the delete all operation.
        IafStorageUtils.clearAnnotations(viewer);
        GisDistance.deleteMeasurementLine(viewer)
      } else {
        await IafStorageUtils.clearAnnotations(viewer);
        GisDistance.deleteMeasurementLine(viewer)
        IafStorageUtils.saveAnnotations(viewer);
        NotificationStore.notifyAnnotationsClearedFromLocalStorage(viewer);
      }
  }
  
  handleEnableRepeatMode(markupType, repeatLastMode) {
    const { iafViewer } = this.props;
    const managers = [iafViewer.markupManager, iafViewer.markupManager2d];
  
    for (let manager of managers) {
      if (!manager) continue;  // Skip if the manager is null or undefined for 2d only 
  
      const operator = manager.getOperatorByMarkupType(markupType);
      if (!operator || !operator.object) {
        NotificationStore.notifyToSelectMarkup(iafViewer);
        return;
      }
      !repeatLastMode && NotificationStore.notifyRepeatModeTurnedOff(this.props.iafViewer, markupType);
      manager.enableRepeatMode(repeatLastMode, operator, this.activeMeasurementIcon);
    }
  
    if (repeatLastMode) {
      managers.forEach(manager => {
        if (manager) {
          manager.setMode(IafMarkupManager.InteractionMode.Create, markupType);
        }
      });
    }
  
    this.setState({ repeatLastMode });
  }
  
  async handleMarkupManagerState(event) {
    event.stopPropagation();
    /** @type { IafMarkupManager} */
    const markupManager = this.props.iafViewer.markupManager;
    /** @type { IafMarkupManager} */
    const markupManager2d = this.props.iafViewer.markupManager2d;
    
    if(!markupManager && !markupManager2d) {
      return;
    }
    
    switch (event.target.name) {
        case "showAllMarkup":
          markupManager && markupManager.showAll(event.target.checked);
          markupManager2d && markupManager2d.showAll(event.target.checked);
          // Sync showAnnotations state with showAllMarkup
          this.props.iafViewer.setState({ showAnnotations: event.target.checked });
            this.setState(() => ({
              visibility: event.target.checked,
              [event.target.name]: event.target.checked,
            }));
            break;
        case "enabledAllMarkup":
            markupManager && markupManager.enabledAll(event.target.checked);
            markupManager2d && markupManager2d.enabledAll(event.target.checked);
            this.setState(() => ({
              isSelectable: event.target.checked,
              [event.target.name]: event.target.checked,
            }));
            break;
        case "deleteAllMarkup":
            await this.handleDeleteMarups()
            this.setState({ [event.target.name]: true }, () =>
              setTimeout(() => this.setState({ [event.target.name]: false }), 300)
            );
            // this.setState(() => ({
            //   [event.target.name]: event.target.checked,
            // }));
            break;
        // PLAT-5035 Annotation icon should update to active annotation only if Repeat Last mode is ON | IafMarkupManager.enableRepeatMode(enable)
        case "repeatLastMode":
           this.handleEnableRepeatMode(this.state.selectedMarkupType, event.target.checked)
            break;
        default:
            break;
    }
  }
  
  createMarkupSwitches = () => {
    const {repeatLastMode, showAllMarkup, enabledAllMarkup, deleteAllMarkup} = this.state
    const customTitleStyle = {
      width: "98px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "13px",
      lineHeight: "18px",
      color: "#FFFFFF",
    }
    return [
        <IafSwitch
            key="repeatLast"
            title={"Repeat Last"}
            tooltipTitle={TooltipStore.Empty}
            isChecked={repeatLastMode}
            onChange={this.handleMarkupManagerState}
            width='100%' 
            name="repeatLastMode"
            customTitleStyles={customTitleStyle}
            customComponentStyles={{width: "100%"}}
        />,
        <IafSwitch
            key="showAll"
            title={"Show All"}
            tooltipTitle={TooltipStore.Empty}
            isChecked={showAllMarkup}
            onChange={this.handleMarkupManagerState}
            width='100%' 
            name="showAllMarkup"
            customComponentStyles={{width: "100%"}}
            customTitleStyles={customTitleStyle}
        />,
        <IafSwitch
            key="enabledAll"
            title={"Enabled All"}
            tooltipTitle={TooltipStore.Empty}
            isChecked={enabledAllMarkup}
            onChange={this.handleMarkupManagerState}
            width='100%' 
            name="enabledAllMarkup"
            customComponentStyles={{width: "100%"}}
            customTitleStyles={customTitleStyle}
        />,
        <IafSwitch
            key="deleteAll"
            title={"Delete All"}
            tooltipTitle={TooltipStore.Empty}
            isChecked={deleteAllMarkup}
            onChange={this.handleMarkupManagerState}
            width='100%' 
            name="deleteAllMarkup"
            customComponentStyles={{width: "100%"}}
            customTitleStyles={customTitleStyle}
        />
        // <div className={styles["markup-menu-item"]} key={"deleteAll"}onClick={(event)=>{
        //   event.preventDefault();
        //   this.handleDeleteMarups()
        //   }}>
        //   <div className={styles["markup_icon_wrapper"]}></div>
        //   <img src={ToolbarIcons.iconHide.img} className={styles["markup_icon_img"]} />
        //   <span className={styles["markup_text"]}>Delete All</span>
        // </div>
    ];
  };

  render() {
    // console.log ('NewToolbar.render'
    //   , '/props', this.props
    // );
    // let onHoverIconColor = 'invert(40%) sepia(86%) saturate(6224%) hue-rotate(311deg) brightness(83%) contrast(101%)'
    const {
      submenuFlags,
      shadingMainIcon,
      navMainIcon,
      measurementMainIcon,
      manipulateMainIcon,
      isPerspective,
      isCuttingPlaneDisabled,
      isMapBoxDisabled,
      isLoadConfigDisabled,
      isAnalyticsDisabled,
      viewMainIcon,
      isResetDisabled,
      isProjectionDisabled,
      isViewDisabled,
      isShadingDisabled,
      isNaviDisabled,
      isOrthographicDisabled,
      is2DviewerDisabled,
      is3DviewerDisabled,
      isArcgisDisabled,
      isArcgisOverviewDisabled,
      isUnrealEngineDisabled,
      isPhotosphereDisabled,
      isAnimationPlayDisabled,
      isAnimationStopDisabled,
      isMeasurementDisabled,
      isUtilitiesDisabled,
      isSettingsDisabled,
      latestSidePanelComponent
    } = this.state;
    const {toolbarSize, resourcePermissions} = this.props.iafViewer.state
    const { commands } = this.props;
    let btnheight = 56;
    let modelBounding = null;
    if (this.props.testUi) { 
      modelBounding = this.props.getModelBoundingBox();
    }
    let numOfBtnsOnTop = 1;
    if (isResetDisabled) {
      numOfBtnsOnTop -= 1;
    }
    if (isProjectionDisabled) {
      numOfBtnsOnTop -= 1;
    }
    let viewPosTop = 50 * numOfBtnsOnTop;
    const isCuttingPlanesVisible = this.props.testUi;

    // Don't update cutting planes if elevation mode is QuickSurface or QuickUnderground
    // setElevationMode manages the cutting planes in those cases
    const isCuttingPlanesControlledByElevationMode = this.props.iafViewer?.state?.gis?.elevationMode === GisElevationMode.QuickSurface 
                                      || this.props.iafViewer?.state?.gis?.elevationMode === GisElevationMode.QuickUnderground;
    
    if (
      modelBounding &&
      modelBounding !== this.prevModelBounding &&
      isCuttingPlanesVisible &&
      !_.size(this.props.cuttingPlaneValues) &&
      !isCuttingPlanesControlledByElevationMode  // Skip if elevation mode is managing cutting planes
    ) {
      this.state.topSliderValue = modelBounding?.min.z;
      this.state.bottomSliderValue = modelBounding?.min.z;
      this.state.leftSliderValue = modelBounding?.min.x;
      this.state.rightSliderValue = modelBounding?.min.x;
      this.state.frontSliderValue = modelBounding?.min.y;
      this.state.backSliderValue = modelBounding?.min.y;
      this.updateCuttingPlanes();
      this.prevModelBounding = modelBounding;
      this.props.iafCuttingPlanesUtils && this.props.iafCuttingPlanesUtils.enableCuttingPlanes(this.state.enableCuttingPlanes);
    } 
    if(_.size(this.props.cuttingPlaneValues) 
        && !this.props.isSetCuttingPlaneActive 
        && this.prevPropsCuttingPlaneValue!==this.props.cuttingPlaneValues){
      this.state.topSliderValue = this.props.cuttingPlaneValues.min.z?this.props.cuttingPlaneValues.min.z:modelBounding.min.z;
      this.state.bottomSliderValue =  this.props.cuttingPlaneValues.min.z?this.props.cuttingPlaneValues.min.z:modelBounding.min.z;
      this.state.leftSliderValue =  this.props.cuttingPlaneValues.min.x?this.props.cuttingPlaneValues.min.x:modelBounding.min.x;
      this.state.righttSliderValue = this.props.cuttingPlaneValues.min.x?this.props.cuttingPlaneValues.min.x:modelBounding.min.x;
      this.state.frontSliderValue =  this.props.cuttingPlaneValues.min.y?this.props.cuttingPlaneValues.min.y:modelBounding.min.y;
      this.state.backSliderValue =  this.props.cuttingPlaneValues.min.y?this.props.cuttingPlaneValues.min.y:modelBounding.min.y;
      this.prevPropsCuttingPlaneValue=this.props.cuttingPlaneValues
      this.updateCuttingPlanes();
    }
    let planeValues= this.props.getplaneValues()
    if(this.props.isSetCuttingPlaneActive 
        && isCuttingPlanesVisible 
        && this.prevCuttingPlane!==planeValues){
      this.state.topSliderValue = planeValues.min.z;
      this.state.bottomSliderValue = planeValues.min.z;
      this.state.leftSliderValue = planeValues.min.x;
      this.state.rightSliderValue = planeValues.min.x;
      this.state.backSliderValue = planeValues.min.y;
      this.state.frontSliderValue = planeValues.min.y;
      this.prevCuttingPlane=planeValues;
      this.handleChangeCuttingPlane(true);
      this.props.handleChangeSliderTopPlane( planeValues.min.z )
      this.props.handleChangeSliderBottomPlane(planeValues.min.z )
      this.props.handleChangeSliderLeftPlane(planeValues.min.x )
      this.props.handleChangeSliderRightPlane(planeValues.min.x )
      this.props.handleChangeSliderFrontPlane( planeValues.min.y)
      this.props.handleChangeSliderBackPlane(planeValues.min.y )
      this.updateCuttingPlanes();

    }
    if (
      _.size(this.props.cuttingPlaneValues) &&
      !this.props.isSetCuttingPlaneActive &&
      this.prevPropsCuttingPlaneValue !== this.props.cuttingPlaneValues
    ) {
      this.state.topSliderValue = this.props.cuttingPlaneValues.min.z
        ? this.props.cuttingPlaneValues.min.z
        : modelBounding.min.z;
      this.state.bottomSliderValue = this.props.cuttingPlaneValues.min.z
        ? this.props.cuttingPlaneValues.min.z
        : modelBounding.min.z;
      this.state.leftSliderValue = this.props.cuttingPlaneValues.min.x
        ? this.props.cuttingPlaneValues.min.x
        : modelBounding.min.x;
      this.state.rightSliderValue = this.props.cuttingPlaneValues.min.x
        ? this.props.cuttingPlaneValues.min.x
        : modelBounding.min.x;
      this.state.frontSliderValue = this.props.cuttingPlaneValues.min.y
        ? this.props.cuttingPlaneValues.min.y
        : modelBounding.min.y;
      this.state.backSliderValue = this.props.cuttingPlaneValues.min.y
        ? this.props.cuttingPlaneValues.min.y
        : modelBounding.min.y;
      this.prevPropsCuttingPlaneValue = this.props.cuttingPlaneValues;
      this.updateCuttingPlanes();
    }
    // let planeVlaues = this.props.getplaneValues();
    // if (
    //   this.props.isSetCuttingPlaneActive &&
    //   isCuttingPlanesVisible &&
    //   this.prevCuttingPlane !== planeVlaues
    // ) {
    //   this.state.topSliderValue = planeVlaues.min.z;
    //   this.state.bottomSliderValue = planeVlaues.min.z;
    //   this.state.leftSliderValue = planeVlaues.min.x;
    //   this.state.rightSliderValue = planeVlaues.min.x;
    //   this.state.backSliderValue = planeVlaues.min.y;
    //   this.state.frontSliderValue = planeVlaues.min.y;
    //   this.prevCuttingPlane = planeVlaues;
    //   this.handleChangeCuttingPlane(true);
    //   this.props.handleChangeSliderTopPlane(planeVlaues.min.z);
    //   this.props.handleChangeSliderBottomPlane(planeVlaues.min.z);
    //   this.props.handleChangeSliderLeftPlane(planeVlaues.min.x);
    //   this.props.handleChangeSliderRightPlane(planeVlaues.min.x);
    //   this.props.handleChangeSliderFrontPlane(planeVlaues.min.y);
    //   this.props.handleChangeSliderBackPlane(planeVlaues.min.y);
    //   this.updateCuttingPlanes();
    // }
    const { classes } = this.props;

    const view2d = { ...PropertyStore.view2d, ...this.props.iafViewer?.props?.view2d };
    const view3d = { ...PropertyStore.view3d, ...this.props.iafViewer?.props?.view3d };
    const arcgis = { ...PropertyStore.arcgis, ...this.props.iafViewer?.props?.arcgis };
    const arcgisOverview = { ...PropertyStore.arcgisOverview, ...this.props.iafViewer?.props?.arcgisOverview };
    const ue = { ...PropertyStore.ue, ...this.props.iafViewer?.props?.ue };
    const photosphere = { ...PropertyStore.photosphere, ...this.props.iafViewer?.props?.photosphere };

    // ATK PLG-1720: Support Ticket - Gangai Mangesh - GIS - By default GIS Viewer settings panel is enabled
    const showSidePanel = this.props.iafViewer?.props?.showSidePanel !== undefined
      ? this.props.iafViewer.props.showSidePanel
      : PropertyStore.showSidePanel;
    const isOpen = this.props.iafViewer.state.isShowSettings
      || this.props.iafViewer.state.isShowMarkups
      || this.props.iafViewer.state.isShowCuttingPlanes
      || this.state.showwalkmode
      || this.props.iafViewer.state.isShowGisViewer
      || this.props.iafViewer.state.isShowLoadConfig
      || this.props.iafViewer.state.enableDevTools;
    const effectiveShowSidePanel = showSidePanel || this.state.userHasOpenedSidePanel;
    const sidePanelVisible = effectiveShowSidePanel && isOpen;
    // END ATK PLG-1720: Support Ticket - Gangai Mangesh - GIS - By default GIS Viewer settings panel is enabled
    // console.log("maximize", this.props.iafViewer.state.viewer2DWidget && this.props.iafViewer.state.viewer2DWidget.current && this.props.iafViewer.state.viewer2DWidget.current.mode === WidgetMode.FULLSCREEN)
    return (
      <div>
        <SidePanel
          visible={sidePanelVisible}
          isOpen={isOpen}
          toolbarSize={this.props.iafViewer.state.toolbarSize}
        >
        {this.props.iafViewer.state.isShowMarkups && 
        <MarkupPanel
        title={this.props.iafViewer.state.markupHandler.markupItem._type}
        markupManager={this.props.iafViewer.state.markupHandler.manager}
        markupUuid={this.props.iafViewer.state.markupHandler.uuid}
        markupItem={this.props.iafViewer.state.markupHandler.markupItem}
        panelCount = {this.state.panelCount}
        showContent = {this.props.iafViewer.state.showMarkupsContent}
        showContentMethod = {() => this.toggleMarkupsContent()}
        onClose={() => this.closePanels('markupsPanel')}
        color={this.props.sidePanelColor}
        setMarkupManagerState={(markupManagerState)=>{
          this.setState((prevState) => {
            const { showAllMarkup, enabledAllMarkup, repeatLastMode } = markupManagerState;
            return {
                showAllMarkup: showAllMarkup !== undefined ? showAllMarkup : prevState.showAllMarkup,
                enabledAllMarkup: enabledAllMarkup !== undefined ? enabledAllMarkup : prevState.enabledAllMarkup,
                repeatLastMode: repeatLastMode !== undefined ? repeatLastMode : prevState.repeatLastMode
            };
        });
        }}
        />
        }
        {this.props.iafViewer.state.enableDevTools &&
        <DevToolsPanel
        title = {`Dev Tools (${packageJson.version})`}
        panelCount = {this.state.panelCount}
        showContent = {this.state.showCameraContent}
        showContentMethod = {this.toggleCameraContent}
        onClose={this.closePanels}
        camera = {this.props.iafViewer.state.devToolsCamera}
        viewer={this.props.iafViewer}
        getModelBoundingBox={this.props.iafViewer.getModelBoundingBox}
        />}

       {this.props.iafViewer.state.isShowSettings && <SettingPanel
        title="Settings"
        panelCount = {this.state.panelCount}
        viewer={this.props.iafViewer}
        showContent = {this.state.showSettingContent}
        showContentMethod = {this.toggleSettingContent}
        onClose={this.closePanels}
        color={this.props.sidePanelColor}
       />}
       {this.props.iafViewer.state.isShowCuttingPlanes &&<CuttingPlanes
       title="Cutting Planes"
       enableMapBox={this.state.enableMapBox}
       panelCount = {this.state.panelCount}
       displayToggle={this.state.displayToggleCuttingPlanes}
       enableCuttingPlanes={this.state.enableCuttingPlanes && (this.props.iafViewer?.state?.gis?.elevationMode !== GisElevationMode.QuickSurface && this.props.iafViewer?.state?.gis?.elevationMode !== GisElevationMode.QuickUnderground)}
       handleEnableCuttingPlanes={this.handleEnableCuttingPlanes}
       topSliderValue={this.state.topSliderValue}
       handleChangeSliderTopPlane={this.handleChangeSliderTopPlane}
       bottomSliderValue={this.state.bottomSliderValue}
       handleChangeSliderBottomPlane={this.handleChangeSliderBottomPlane}
       frontSliderValue={this.state.frontSliderValue}
       handleChangeSliderFrontPlane={this.handleChangeSliderFrontPlane}
       backSliderValue={this.state.backSliderValue}
       handleChangeSliderBackPlane={this.handleChangeSliderBackPlane}
       leftSliderValue={this.state.leftSliderValue}
       handleChangeSliderLeftPlane={this.handleChangeSliderLeftPlane}
       rightSliderValue={this.state.rightSliderValue}
       handleChangeSliderRightPlane={this.handleChangeSliderRightPlane}
       showPlaneGeometry={this.state.showPlaneGeometry}
       handleShowCuttingPlaneGeometry={this.handleShowCuttingPlaneGeometry}
       iafViewer={this.props.iafViewer}
       ToolbarIcons={ToolbarIcons}
        handleShowCuttingPlaneGeometryBoolean={
       this.handleShowCuttingPlaneGeometryBoolean
     }
    modelBounding={modelBounding}
    viewer={this.props.viewer}
    selectOperatorId={this.props.selectOperatorId}
    showContent = {this.state.showCuttingContent}
    showContentMethod = {this.toggleCuttingContent}
    handleChangeCuttingPlane = {this.handleChangeCuttingPlane}
    onClose={this.closePanels}
    color={this.props.sidePanelColor}
    iafCuttingPlanesUtils={this.props.iafCuttingPlanesUtils}
    handleIsolate={this.props.iafViewer.handleIsolate}
    handleShowAll={this.props.handleShowAll}
    prevSelection={this.props.iafViewer.prevSelection}
    selection = {this.props.iafViewer.props.selection}
    idMapping = {this.props.iafViewer.props.idMapping}
    getNodeIds = {this.props.iafViewer.getNodeIds}
    handleOperator ={this.props.iafViewer.handleOperator}
    setCurrentSection ={this.props.iafViewer.setCurrentSection}
  />}
    {this.props.iafViewer.state.isShowLoadConfig && this.props.iafViewer.state.isModelStructureReady && (
      <ReactModelComposition
        iafViewer={this.props.iafViewer}
        panelCount={this.state.panelCount}
        ToolbarIcons={ToolbarIcons}
        enableLoadConfig={this.state.enableLoadConfig}
        handleEnableLoadConfig={this.handleEnableLoadConfig}
        camera={this.props.iafViewer.state.devToolsCamera}
        globalShowContent={this.state.showLoadConfigContent}
        globalShowContentMethod={this.toggleLoadConfigContent}
        primaryShowContent={this.state.showLoadConfigContentPrimary}
        primaryShowContentMethod={this.toggleLoadConfigContentPrimary}
        showContentExternal={this.state.showLoadConfigContentExternal}
        showContentMethodExternal={this.toggleLoadConfigContentExternal}
        cameraPan={this.cameraPan.bind(this)}
        onClose={this.closePanels}
        color={this.props.sidePanelColor}
        canAccess={resourcePermissions?.[RESOURCE_TYPES.MODEL_COMPOSER]?.canRead}
        canDeleteAccess={resourcePermissions?.[RESOURCE_TYPES.MODEL_COMPOSER]?.canDelete}
      />
    )}
    {(this.props.iafViewer.state.isShowGisViewer || this.props.iafViewer.state.gis.enable) && this.state.isReady &&
      this.props?.iafViewer 
      // && (this.props?.iafViewer?.props?.gis?.showToolbar || this.props.iafViewer.state.gis.enable) 
      && <ReactGis
      ref={this.reactGisRef}
      title="GIS Viewer"
      ToolbarIcons={ToolbarIcons}
      // displayToggle={this.state.displayToggleMapBox}
      enableMapBox={this.state.enableMapBox}
      gis={this.props.gis}
      handleEnableMapBox={this.handleEnableMapBox}
      iafViewer={this.props.iafViewer} 
      graphicsHandler={this.props.graphicsHandler}
      graphicsResources={this.props.graphicsResources}
      graphicsResources2d={this.props.graphicsResources2d}
      models={this.props.models}
      showContent = {this.state.showGisViewerContent}
      showContentMethod = {this.toggleGisViewerContent}
      cameraPan={this.cameraPan.bind(this)}
      onClose={this.closePanels}
      color={this.props.sidePanelColor}
      canAccess={resourcePermissions?.[RESOURCE_TYPES.GIS]?.canRead}
      handleModelSelection={this.props.handleModelSelection}
  />}
    {this.state.showwalkmode === true && <LearningCenter
      panelCount = {this.state.panelCount}
      onKeyClick={this.handleToggleKeyControl}
      onMouseClick={this.handleToggleMouseControl}
      showContent={this.state.showLearningContent}
      showContentMethod = {this.toggleLearningContent}
      onClose={this.closePanels}
      color={this.props.sidePanelColor}
      />
    }
        </SidePanel>
        <CommandsDiv
          visible={this.state.visible}
          commandValues={this.state.commandValues}
          currentCommand={this.state.currentCommand}
          selectedCommand={this.selectedCommand.bind(this)}
          runCommand={this.runCommand.bind(this)}
        ></CommandsDiv>
       {this.state.activeKeyControl === 0 && (
          <FirstKeyControl
          isKeyControlOpen={this.state.isKeyControlOpen}
            onClick={this.handleShowKeyControlPanel}
          ></FirstKeyControl>
        )}
        {this.state.activeKeyControl === 1 && (
          <SecondKeyControl onClick={this.handleShowKeyControlPanel}></SecondKeyControl>
        )}
        {this.state.activeKeyControl === 2 && (
          <ThirdKeyControl onClick={this.handleShowKeyControlPanel}></ThirdKeyControl>
        )}
        {this.state.activeKeyControl === 3 && (
          <FourthKeyControl onClick={this.handleShowKeyControlPanel}></FourthKeyControl>
        )}

        {this.state.activeMouseControl === 0 && (
          <FirstMouseControl
          isMouseControlOpen={this.state.isMouseControlOpen}
            onClick={this.handleShowMouseControlPanel}
          ></FirstMouseControl>
        )}
        {this.state.activeMouseControl === 1 && (
          <SecondMouseControl
            onClick={this.handleShowMouseControlPanel}
          ></SecondMouseControl>
        )}
        {this.state.activeMouseControl === 2 && (
          <ThirdMouseControl
            onClick={this.handleShowMouseControlPanel}
          ></ThirdMouseControl>
        )}
        {this.state.activeMouseControl === 3 && (
          <FourthMouseControl
            onClick={this.handleShowMouseControlPanel}
          ></FourthMouseControl>
        )}

        <EditControls
          isEditControlOpen={this.state.isEditControlOpen}
          toolbarList={this.props.toolbarList}
          viewList={this.props.viewList}
          shadingList={this.props.shadingList}
          navigationList={this.props.navigationList}
          measurementList={this.props.measurementList}
          manipulateList = {this.props.manipulateList}
          editClick={this.handleToggleEditControl}
          saveClick={this.props.updateToolbar}
          handleMax2d={this.props.iafViewer.state.viewer2DWidget && this.props.iafViewer.state.viewer2DWidget.current && this.props.iafViewer.state.viewer2DWidget.current.handleWidgetAction}
          isMaxUiButtonActive={this.props.iafViewer.state.viewer2DWidget && this.props.iafViewer.state.viewer2DWidget.current && this.props.iafViewer.state.viewer2DWidget.current.mode === WidgetMode.FULLSCREEN}
          handleToolbarSize={this.props.handleToolbarSize}
          toolbarSize={this.props.iafViewer.state.toolbarSize}
          resetStatesForEditControls={this.resetStatesForEditControls}
          iafViewer={this.props.iafViewer}
        ></EditControls>

        <div id={this.props.iafViewer.evmElementIdManager.getEvmElementUuidToolbarSize(this.props.iafViewer.state.toolbarSize || "none")}
              className={this.props.iafViewer.state.toolbarSize === "large" ? styles.large 
                          :  this.props.iafViewer.state.toolbarSize === "medium" ? styles.medium 
                          :  this.props.iafViewer.state.toolbarSize === "small" ? styles.small 
                          : styles.none}
             style={{right: this.props.isIpaDev ? '80px' : '0px',
             '--toolbar-color': this.props.toolbarColor}}>
          {/* <div style={{ marginTop: 10 + "px" }}></div> */}

          <div
            className={(this.props.iafViewer.state.isShowSettings 
              || this.props.iafViewer.state.isShowCuttingPlanes 
              || this.props.iafViewer.state.isShowMarkups 
              || this.state.showwalkmode === true
              || this.props.iafViewer.state.isShowLoadConfig
              || this.props.iafViewer.state.enableDevTools) ? "viewer-toolbar-btn" : "arrow-btn-hidden"}
            onClick={async () => await this.handleCloseSidePanel()}
          >
           {this.props.iafViewer.state.isShowSettings 
            || this.props.iafViewer.state.isShowCuttingPlanes 
            || this.props.iafViewer.state.isShowMarkups 
            || this.state.showwalkmode === true
            || this.props.iafViewer.state.isShowLoadConfig
            || this.props.iafViewer.state.enableDevTools
          ?<ArrowForwardIos style={this.iconStyles}/>:<div></div>}
          </div>
          {!isResetDisabled && (<div
            className={styles["viewer-toolbar-btn"]}
            onClick={this.resetAll}
            style={isResetDisabled ? { display: "none" } : {}}
          >
            <IafTooltip
              src={ToolbarIcons.iconHome.img}
              iconClass={"icon-color-filter"}
              title={toolbarSize === 'large' ? TooltipStore.ResetView : ToolbarIcons.iconHome.content}
              // Added check for tooltip text length if it exceeds 58 length it will change its position
              // Added this to avoid overlap between reset view tooltip and invicara main layout header div
              placement= {TooltipStore.ResetView.length>58? "left-start":"left"}
              toolbarSize={this.props.iafViewer.state.toolbarSize}
              open={this.props.showToolTip}
              iconColor={this.props.onActiveIconColor}
            ></IafTooltip>
            {this.props.iafViewer.state.toolbarSize === "large" ? (
              <div className={styles["toolbar-txt"]}>{ToolbarIcons.iconHome.content}</div>
            ) : null}
            <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
          </div>)}

          {this.props.iafViewer.state.visible3d && !is3DviewerDisabled && !isOrthographicDisabled && this.props.viewer && (
            <div
              className={`${styles["viewer-toolbar-btn"]} ${this.state.enableMapBox ? styles["disabled-component"] : ""}`}
              onClick={(e) => {
                this.changeProjectionMode();
              }}
              onMouseOver={(e)=>{
                this.closeSubmenu()
              }}
            >
              <IafTooltip
                src={
                  isPerspective
                    ? ToolbarIcons.iconOrthographic.img
                    : ToolbarIcons.iconPerspective.img
                }
                iconClass={"icon-color-filter"}
                title={toolbarSize === 'large' ? TooltipStore.Projection : ToolbarIcons.iconOrthographic.content}
                placement="left" 
                toolbarSize={this.props.iafViewer.state.toolbarSize} 
                open={this.props.showToolTip}
                iconColor={this.props.onActiveIconColor}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{ToolbarIcons.iconOrthographic.content}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}
          {this.props.iafViewer.state.visible3d && !is3DviewerDisabled && !isViewDisabled && this.props.viewer && (
            <div
              id={this.props.iafViewer.evmElementIdManager.getEvmElementUuidViewSubmenu()}
              className={`${styles["viewer-toolbar-btn"]} ${this.state.enableMapBox ? styles["disabled-component"] : ""} ${submenuFlags.view ? styles["apply-box-shadow"] : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                this.showSubmenu({ view: !submenuFlags.view }, {
                  id: this.props.iafViewer.evmElementIdManager.getEvmElementUuidViewSubmenu()
                });
              }}
              onMouseOver={(e) => {
                if (submenuFlags.view !== false) {
                  this.closeSubmenu({ view: true });
                } else {
                  this.closeSubmenu();
                }
              }}
            >
              <IafTooltip
                src={viewMainIcon.icon.img}
                iconClass={
                  submenuFlags.view
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={toolbarSize === 'large' ? TooltipStore.View : "View"}
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize} 
              // added below condition to decide whether to open or close tooltip. Same condition will be applied to all 
              // tools which has submenus
                open={this.props.showToolTip && (submenuFlags.view?false:true)}
                iconColor={this.props.onActiveIconColor}
                isGroupedIcon={true}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>View</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}

          {this.props.iafViewer.state.visible3d && !is3DviewerDisabled && !isShadingDisabled && this.props.viewer && (
            <div id={this.props.iafViewer.evmElementIdManager.getEvmElementUuidShadingSubmenu()}
              className={`${styles["viewer-toolbar-btn"]} ${submenuFlags.shading ? styles["apply-box-shadow"] : ''} ${this.state.isWalkMode ? styles.disabled : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!this.state.isWalkMode)
                  this.showSubmenu(
                    { shading: !submenuFlags.shading },
                    { id: this.props.iafViewer.evmElementIdManager.getEvmElementUuidShadingSubmenu() }
                  );
              }}
              onMouseOver={(e) => {
                if (submenuFlags.shading !== false) {
                  this.closeSubmenu({ shading: true });
                } else {
                  this.closeSubmenu();
                }
              }}
            >

              <IafTooltip
                src={shadingMainIcon.icon.img}
                iconClass={
                  submenuFlags.shading
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={this.state.isWalkMode ? TooltipStore.shadingWhileWalkMode : toolbarSize === 'large'? TooltipStore.Shading : shadingMainIcon.title}
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize}
                open={this.props.showToolTip && (submenuFlags.shading?false:true)}
                iconColor={this.props.onActiveIconColor}
                isGroupedIcon={true}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{shadingMainIcon.title}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}

          {this.props.iafViewer.state.visible3d && !is3DviewerDisabled && !isNaviDisabled && this.props.viewer && (
            <div id={this.props.iafViewer.evmElementIdManager.getEvmElementUuidNavigationSubmenu()}
              className={`${styles["viewer-toolbar-btn"]} ${submenuFlags.nav ? styles["apply-box-shadow"] : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                this.showSubmenu(
                  { nav: !submenuFlags.nav },
                  { id: this.props.iafViewer.evmElementIdManager.getEvmElementUuidNavigationSubmenu() }
                );
              }}
              onMouseOver={(e) => {
                if (submenuFlags.nav !== false) {
                  this.closeSubmenu({ nav: true });
                } else {
                  this.closeSubmenu();
                }
              }}
            >
              <IafTooltip
                src={navMainIcon.icon.img}
                iconClass={
                  submenuFlags.nav
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={toolbarSize === 'large' ? TooltipStore.Navigation : navMainIcon.title}
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize}
                open={this.props.showToolTip && (submenuFlags.nav?false:true)}
                iconColor={this.props.onActiveIconColor}
                isGroupedIcon={true}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{navMainIcon.title}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}
          {(this.props.iafViewer.state.visible3d || this.props.iafViewer.state.visible) && !isMeasurementDisabled && (this.props.viewer || this.props.viewer2D) && (
            <div id={this.props.iafViewer.evmElementIdManager.getEvmElementUuidAnnotationsSubmenu()}
              className={`${styles["viewer-toolbar-btn"]} ${submenuFlags.annotations ? styles["apply-box-shadow"] : ''} ${(!resourcePermissions?.[RESOURCE_TYPES.MARKUP]?.canWrite || this.props.isModelLoading || !this.props.iafViewer.state.showAnnotations) ? styles.disabled : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!resourcePermissions?.[RESOURCE_TYPES.MARKUP]?.canWrite || this.props.isModelLoading || !this.props.iafViewer.state.showAnnotations) return;
                this.showSubmenu(
                  { annotations: !submenuFlags.annotations },
                  { id: this.props.iafViewer.evmElementIdManager.getEvmElementUuidAnnotationsSubmenu() }
                );
                if (this.props.iafViewer.state.isShowGisViewer && this.state.enableMapBox) {
                  // PLG-1187: When an annotation is clicked and "Show Marker Only" is enabled, disable it 
                  // to allow the 3D model to be displayed and annotations to be added.
                  if (this.props.iafViewer.state.gis?.showMapMarkers) {
                    this.props.iafViewer.setViewerState("gis", "showMapMarkers", false, () => {
                      this.reactGisRef?.current?.resetAll();
                      const defaultZoom = this.props.viewer?.iafMapBoxGl?.gisData?._properties?.session?.zoom;
                      this.props.viewer?.iafTuner?.updateModelDisplay(defaultZoom);
                    });
                  }
                }
              }}
              onMouseOver={(e) => {
                if (submenuFlags.annotations !== false) {
                  this.closeSubmenu({ annotations: true });
                } else {
                  this.closeSubmenu();
                }
              }}
            >
              <IafTooltip
                src={measurementMainIcon.icon.img}
                iconClass={
                  submenuFlags.annotations
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={toolbarSize === 'large' ? TooltipStore.Measurement : measurementMainIcon.title}
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize}
                open={this.props.showToolTip && (submenuFlags.annotations?false:true)}
                iconColor={this.props.onActiveIconColor}
                isGroupedIcon={true}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{measurementMainIcon.title}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}

          {!isUtilitiesDisabled && this.props.iafViewer.state.isUtilitiesActive && this.props.viewer && (
            <div
              id="manipulate-submenu"
              className={`${styles["viewer-toolbar-btn"]} ${submenuFlags.manipulate ? styles["apply-box-shadow"] : ''} ${this.props.isModelLoading ? styles.disabled : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                this.showSubmenu({ manipulate: !submenuFlags.manipulate },{id:"manipulate-submenu"});
              }}
              onMouseOver={(e)=>{
                if(submenuFlags.manipulate !== false)
                this.closeSubmenu({manipulate:true})
                else {
                  this.closeSubmenu()
                }
              }}
            >
              <IafTooltip
                src={manipulateMainIcon.icon.img}
                iconClass={submenuFlags.manipulate
                  ? "icon-selection-color"
                  : "icon-color-filter"}
                title={toolbarSize === 'large' ? TooltipStore.Utilities : manipulateMainIcon.title}
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize} 
                open={this.props.showToolTip && (submenuFlags.manipulate?false:true)}
                iconColor={this.props.onActiveIconColor}
                isGroupedIcon={true}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{manipulateMainIcon.title}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}

          {this.props.iafViewer.state.visible3d && !is3DviewerDisabled && !isCuttingPlaneDisabled && this.props.viewer && (
            <div
              className={`${styles["viewer-toolbar-btn"]} ${this.state.displayToggleCuttingPlanes ? styles["apply-box-shadow"] : ''} ${this.props.isModelLoading || (this.props.iafViewer?.state?.gis?.elevationMode === GisElevationMode.QuickSurface || this.props.iafViewer?.state?.gis?.elevationMode === GisElevationMode.QuickUnderground) ? styles.disabled : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (this.props.testUi && (!this.props.isModelLoading) && (this.props.iafViewer?.state?.gis?.elevationMode !== GisElevationMode.QuickSurface && this.props.iafViewer?.state?.gis?.elevationMode !== GisElevationMode.QuickUnderground)) {
                  this.showCuttingPlaneModal();
                }
              }}
              onMouseOver={(e)=>{
                  this.closeSubmenu()
              }}
            >
              <IafTooltip
                src={ToolbarIcons.iconCuttingPlane.img}
                iconClass={
                  this.state.displayToggleCuttingPlanes
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={this.props.isModelLoading?TooltipStore.CuttingPlanesInactive : 
                  toolbarSize === 'large' ? TooltipStore.CuttingPlanes : ToolbarIcons.iconCuttingPlane.content}
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize} 
                open={this.props.showToolTip}
                iconColor={this.props.onActiveIconColor}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{ToolbarIcons.iconCuttingPlane.content}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}
          {!isMapBoxDisabled 
            // && this.props?.viewer 
            && this.props?.iafViewer?.props?.gis?.showLauncher && (
            <div
            className={`
                ${styles["viewer-toolbar-btn"]} 
                ${this.state.displayToggleMapBox ? styles["apply-box-shadow"] : ''} 
                ${(/*!resourcePermissions?.[RESOURCE_TYPES.GIS]?.canRead || */ 
                    this.props.isModelLoading) ? styles.disabled : ''}`
              }
              onClick={(e) => {
                e.stopPropagation();
                // if (!resourcePermissions?.[RESOURCE_TYPES.GIS]?.canRead || this.props.isModelLoading) return;
                if (this.props.testUi) {
                  // ATK PLG-1720: Support Ticket - Gangai Mangesh - GIS - By default GIS Viewer settings panel is enabled
                  const mapboxAlreadyEnabled = this.props.iafViewer?.state?.gis?.enable === true;
                  this.setState({ userHasOpenedSidePanel: true });
                  if (!this.state.userHasOpenedSidePanel && mapboxAlreadyEnabled) return;
                  // END ATK PLG-1720: Support Ticket - Gangai Mangesh - GIS - By default GIS Viewer settings panel is enabled
                  this.showGisViewerModal();
                }
              }}
              onMouseOver={(e)=>{
                  this.closeSubmenu()
              }}
            >
              <IafTooltip
                src={ToolbarIcons.iconGis.img}
                iconClass={
                  this.state.displayToggleMapBox
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={this.props.isModelLoading? TooltipStore.GISViewerInactive : 
                  toolbarSize === 'large' ? TooltipStore.GISViewerInfo : TooltipStore.GISViewer}
                placement="left"
                toolbarSize={this.props.toolbarSize} 
                open={this.props.showToolTip}
                iconColor={this.props.onActiveIconColor}
              ></IafTooltip>
              {this.props.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>GIS Viewer</div>
                ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}  

          {this.props.iafViewer.state.visible3d && !is3DviewerDisabled && !isLoadConfigDisabled && this.props.viewer && (
            <div
              className={
                `${styles["viewer-toolbar-btn"]} 
                  ${this.state.displayToggleLoadConfig ? 
                    styles["apply-box-shadow"] : ''} 
                  ${(/*!resourcePermissions?.[RESOURCE_TYPES.MODEL_COMPOSER]?.canRead || */ 
                    this.props.isModelLoading) ? styles.disabled : ''}`
              }
              onClick={(e) => {
                e.stopPropagation();
                // if (!resourcePermissions?.[RESOURCE_TYPES.MODEL_COMPOSER]?.canRead || this.props.isModelLoading) return;
                if (this.props.testUi) {
                  this.showLoadConfigModal();
                }
              }}
              onMouseOver={(e)=>{
                  this.closeSubmenu()
              }}
            >
              <IafTooltip
                src={ToolbarIcons.iconModelComposer.img}
                iconClass={
                  this.state.displayToggleLoadConfig
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={this.props.isModelLoading? TooltipStore.ModelCompositionrInactive : 
                  toolbarSize === 'large' ? TooltipStore.ModelCompositionInfo : TooltipStore.LoadConfig}
                placement="left"
                toolbarSize={this.props.toolbarSize} 
                open={this.props.showToolTip}
                iconColor={this.props.onActiveIconColor}
              ></IafTooltip>
              {this.props.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>Composer</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}  
          { this.props.iafViewer.state.activeAnimationUuid 
            && (/*this.props.viewer || */this.props.viewer2D) 
            && (
            <div
              className={styles["viewer-toolbar-btn"]}
              id="AnimationPlyaingIcon"
              onClick={(e) => {
                e.stopPropagation();
                this.toggleAnimationPlay();
              }}
              onMouseOver={(e)=>{
                this.closeSubmenu()
              }}
            >
              <IafTooltip
                src={this.props.iafViewer.state.isAnimationPlaying ? ToolbarIcons.iconAnimationStop.img : ToolbarIcons.iconAnimationPlay.img}
                iconClass={"icon-color-filter"}
                title={ toolbarSize === 'large' ? 
                        (!this.props.iafViewer.state.isAnimationPlaying ? TooltipStore.Animation.Play : TooltipStore.Animation.Stop)
                        : (!this.props.iafViewer.state.isAnimationPlaying ? ToolbarIcons.iconAnimationPlay.content : ToolbarIcons.iconAnimationStop.content)
                      }
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize}
                open={this.props.showToolTip} 
                iconColor={this.props.onActiveIconColor}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{ToolbarIcons.AnimationIsPlaying.content}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}                  
          {/* {!isAnalyticsDisabled &&
            <div className='viewer-toolbar-btn'
              onClick={(e) => {
               
              }}>
              <div className='toolbar-icon'><img src={ToolbarIcons.iconAnalytics.img} className={styles["filter-grey-forDisableIcon"]} /></div>
              <div className={styles["toolbar-txt"]}>Analytics</div>
            </div>
          } */}
          {!is2DviewerDisabled && this.props.viewer && this.props.enable2DViewer && view2d.enable && view2d.showLauncher && (
            <div
              className={`${styles["viewer-toolbar-btn"]} ${this.props.iafViewer.state.visible ? styles["apply-box-shadow"] : ''}`}
              id={this.props.iafViewer.evmElementIdManager.getEvmElementUuidViewer2DIcon()}
              onClick={(e) => {
                e.stopPropagation();
                this.toggle2dViewer();
              }}
              onMouseOver={(e)=>{
                this.closeSubmenu()
              }}
            >
              <IafTooltip
                src={ToolbarIcons.icon2Dviewer.img}
                iconClass={
                  this.props.iafViewer.state.visible
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={toolbarSize === 'large' ? TooltipStore.Viewer2D : ToolbarIcons.icon2Dviewer.content}
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize}
                open={this.props.showToolTip} 
                iconColor={this.props.onActiveIconColor}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{ToolbarIcons.icon2Dviewer.content}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}

          {!is3DviewerDisabled && view3d.enable && view3d.showLauncher && 
          (
            <div
              className={`${styles["viewer-toolbar-btn"]} ${this.props.iafViewer.state.visible3d ? styles["apply-box-shadow"] : ''}`}
              id={this.props.iafViewer.evmElementIdManager.getEvmElementUuidViewer3DIcon()}
              onClick={(e) => {
                e.stopPropagation();
                this.toggle3dViewer();
              }}
              onMouseOver={(e)=>{
                this.closeSubmenu()
              }}
            >
              <IafTooltip
                src={ToolbarIcons.icon3Dviewer.img}
                iconClass={
                  this.props.iafViewer.state.visible3d
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={toolbarSize === 'large' ? TooltipStore.Viewer3D : ToolbarIcons.icon3Dviewer.content}
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize}
                open={this.props.showToolTip} 
                iconColor={this.props.onActiveIconColor}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{ToolbarIcons.icon3Dviewer.content}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}

          {!isArcgisDisabled && arcgis.enable && arcgis.showLauncher &&
          (
            <div
              className={`${styles["viewer-toolbar-btn"]} ${this.props.iafViewer.state.visibleArcgis ? styles["apply-box-shadow"] : ''}`}
              id={this.props.iafViewer.evmElementIdManager.getEvmElementUuidArcgisIcon()}
              onClick={(e) => {
                e.stopPropagation();
                this.toggleArcgis();
              }}
              onMouseOver={(e)=>{
                this.closeSubmenu()
              }}
            >
              <IafTooltip
                src={ToolbarIcons.iconArcgis.img}
                iconClass={
                  this.props.iafViewer.state.visibleArcgis
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={toolbarSize === 'large' ? TooltipStore.Arcgis : ToolbarIcons.iconArcgis.content}
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize}
                open={this.props.showToolTip} 
                iconColor={this.props.onActiveIconColor}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{ToolbarIcons.iconArcgis.content}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}          

          {!isArcgisOverviewDisabled && arcgisOverview.enable && arcgisOverview.showLauncher &&
          (
            <div
              className={`${styles["viewer-toolbar-btn"]} ${this.props.iafViewer.state.visibleArcgisOverview ? styles["apply-box-shadow"] : ''}`}
              id={this.props.iafViewer.evmElementIdManager.getEvmElementUuidArcgisOverviewIcon()}
              onClick={(e) => {
                e.stopPropagation();
                this.toggleArcgisOverview();
              }}
              onMouseOver={(e)=>{
                this.closeSubmenu()
              }}
            >
              <IafTooltip
                src={ToolbarIcons.iconArcgisOverview.img}
                iconClass={
                  this.props.iafViewer.state.visibleArcgisOverview
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={toolbarSize === 'large' ? TooltipStore.ArcgisOverview : ToolbarIcons.iconArcgisOverview.content}
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize}
                open={this.props.showToolTip} 
                iconColor={this.props.onActiveIconColor}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{ToolbarIcons.iconArcgisOverview.content}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}

          {!isUnrealEngineDisabled && ue.enable && ue.showLauncher &&
          (
            <div
              className={`${styles["viewer-toolbar-btn"]} ${this.props.iafViewer.state.visibleUnrealEngine ? styles["apply-box-shadow"] : ''}`}
              id={this.props.iafViewer.evmElementIdManager.getEvmElementUuidUnrealEngineIcon()}
              onClick={(e) => {
                e.stopPropagation();
                this.toggleUnrealEngine();
              }}
              onMouseOver={(e)=>{
                this.closeSubmenu()
              }}
            >
              <IafTooltip
                src={ToolbarIcons.iconUnrealEngine.img}
                iconClass={
                  this.props.iafViewer.state.visibleUnrealEngine
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={toolbarSize === 'large' ? TooltipStore.UnrealEngine : ToolbarIcons.iconUnrealEngine.content}
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize}
                open={this.props.showToolTip} 
                iconColor={this.props.onActiveIconColor}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{ToolbarIcons.iconUnrealEngine.content}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}          

          {!isPhotosphereDisabled && photosphere.enable && photosphere.showLauncher &&
          (
            <div
              className={`${styles["viewer-toolbar-btn"]} ${this.props.iafViewer.state.visiblePhotosphere ? styles["apply-box-shadow"] : ''}`}
              id={this.props.iafViewer.evmElementIdManager.getEvmElementUuidPhotosphereIcon()}
              onClick={(e) => {
                e.stopPropagation();
                this.togglePhotosphere();
              }}
              onMouseOver={(e)=>{
                this.closeSubmenu()
              }}
            >
              <IafTooltip
                src={ToolbarIcons.iconPhotosphere.img}
                iconClass={
                  this.props.iafViewer.state.visiblePhotosphere
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={toolbarSize === 'large' ? TooltipStore.Photosphere : ToolbarIcons.iconPhotosphere.content}
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize}
                open={this.props.showToolTip} 
                iconColor={this.props.onActiveIconColor}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{ToolbarIcons.iconPhotosphere.content}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}                    

          {(this.props.iafViewer.state.visible3d || this.props.iafViewer.state.visible) 
            && !this.props.toolbarList[4].displayDisabled 
            && !this.props.iafViewer.state.isAnimationPlaying
            &&(<div
              className={`${styles["viewer-toolbar-btn"]} ${this.state.isFocusMode ? styles["apply-box-shadow"] : ''} ${this.state.enableMapBox ? styles["disabled-component"] : ""}`}
            onClick={(e) => {
              this.toggleFocusMode();
            }}
            onMouseOver={(e)=>{
                this.closeSubmenu()
              }}
          >
            <IafTooltip
              src={ToolbarIcons.iconFocusMode.img}
              iconClass={
                this.state.isFocusMode
                  ? "icon-selection-color"
                  : "icon-color-filter"
              }
              title={toolbarSize === 'large' ? TooltipStore.FocusMode :ToolbarIcons.iconFocusMode.content}
              placement="left"
              toolbarSize={this.props.iafViewer.state.toolbarSize} 
              open={this.props.showToolTip}
              iconColor={this.props.onActiveIconColor}
            ></IafTooltip>
            {this.props.iafViewer.state.toolbarSize === "large" ? (
              <div className={styles["toolbar-txt"]}>{ToolbarIcons.iconFocusMode.content}</div>
            ) : null}
            <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
          </div>)}

          {this.props.isIpaDev && (
            <div
              className={`${styles["viewer-toolbar-btn"]} ${this.state.visible ? styles["apply-box-shadow"] : ''}`}
              onClick={this.showCommandsModal}
              /* style={isResetDisabled ? { display: "none" } : {}} */
            >
              <div className={styles["toolbar-icon"]}>
                <img
                  src={ToolbarIcons.iconSettings.img}
                  className={this.state.visible ? "filter-pink" : "filter-gray"}
                />
              </div>
              {/* <div className={styles["toolbar-txt"]}>Test Commands</div> */}
            </div>
          )}

          {!isSettingsDisabled && (this.props.viewer) && (
            <div
              className={`${styles["viewer-toolbar-btn"]} ${this.props.isShowSettings ? styles["apply-box-shadow"] : ''} ${this.props.isModelLoading ? styles.disabled : ''}`}
              onClick={async(e) => {
                if(!this.props.isModelLoading){
                await this.handleSettingButtonClicked();
                }
              }}
            >
              <IafTooltip
                src={ToolbarIcons.iconSettings.img}
                iconClass={
                  this.props.isShowSettings
                    ? "icon-selection-color"
                    : "icon-color-filter"
                }
                title={this.props.isModelLoading? TooltipStore.SettingsInactive : 
                  toolbarSize === 'large' ? TooltipStore.Settings : ToolbarIcons.iconSettings.content}
                placement="left"
                toolbarSize={this.props.iafViewer.state.toolbarSize} 
                open={this.props.showToolTip}
                iconColor={this.props.onActiveIconColor}
              ></IafTooltip>
              {this.props.iafViewer.state.toolbarSize === "large" ? (
                <div className={styles["toolbar-txt"]}>{ToolbarIcons.iconSettings.content}</div>
              ) : null}
              <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
            </div>
          )}
          
          <div
            className={`${styles["viewer-toolbar-btn"]} ${styles.customiseViewerBtn}`}
            id="customiseViewerBtn"
            onClick={this.handleToggleEditControl}
          >
            <IafTooltip
              src={ToolbarIcons.iconEditToolbar.img}
              iconClass={"icon-color-filter"}
              title={toolbarSize === 'large' ? TooltipStore.EditToolbar : ToolbarIcons.iconEditToolbar.content}
              // Added check for tooltip text length if it exceeds 58 length it will change its position
              // Added this to avoid overlap between reset view tooltip and invicara main layout header div
              placement= {TooltipStore.EditToolbar.length>58? "left-start":"left"}
              toolbarSize={this.props.iafViewer.state.toolbarSize}
              open={this.props.showToolTip}
              iconColor={this.props.onActiveIconColor}
            ></IafTooltip>
            {this.props.iafViewer.state.toolbarSize === "large" ? (
              <div className={styles["toolbar-txt"]}>{ToolbarIcons.iconEditToolbar.content}</div>
            ) : null}
            <style>
                {`
                  :root {
                    --filter-value: ${this.props.onHoverIconColor};
                  }
                `}
              </style>
          </div>          
        </div>

        {/* view submenu */}
        <ViewerSubMenu
          submenuFlag={submenuFlags.view}
          isIpaDev={this.props.isIpaDev}
          showSubmenu={() => this.showSubmenu({ view: !submenuFlags.view })}
          posTop={this.state.posTop}
          mainIcon={viewMainIcon}
          toolbarSize={this.props.iafViewer.state.toolbarSize}
          subMenus={[
            { icon: ToolbarIcons.iconTop, onClick: this.viewTop,displayDisabled:this.props.viewList[0].displayDisabled },
            { icon: ToolbarIcons.iconBottom, onClick: this.viewBottom,displayDisabled:this.props.viewList[1].displayDisabled },
            { icon: ToolbarIcons.iconLeft, onClick: this.viewLeft,displayDisabled:this.props.viewList[2].displayDisabled },
            { icon: ToolbarIcons.iconRight, onClick: this.viewRight,displayDisabled:this.props.viewList[3].displayDisabled },
            { icon: ToolbarIcons.iconFront, onClick: this.viewFront,displayDisabled:this.props.viewList[4].displayDisabled },
            { icon: ToolbarIcons.iconBack, onClick: this.viewBack,displayDisabled:this.props.viewList[5].displayDisabled },
          ]}
        />
        {/* shading submenu */}
        <ViewerSubMenu
          submenuFlag={submenuFlags.shading}
          isIpaDev={this.props.isIpaDev}
          toolbarSize={this.props.iafViewer.state.toolbarSize}
          showSubmenu={() =>
            this.showSubmenu({ shading: !submenuFlags.shading })
          }
          posTop={this.state.posTop}
          mainIcon={shadingMainIcon}
          subMenus={[
            {
              icon: ToolbarIcons.iconFullWithLines,
              onClick: this.edgefaceWireframeShaded,
              displayDisabled:this.props.shadingList[0].displayDisabled
            },
            {
              icon: ToolbarIcons.iconFullNoLines,
              onClick: this.edgefaceShaded,
              displayDisabled:this.props.shadingList[1].displayDisabled
            },
            {
              icon: ToolbarIcons.iconHiddlenLines,
              onClick: this.edgefaceHiddenLine,
              displayDisabled:this.props.shadingList[2].displayDisabled
            },
            //{icon: ToolbarIcons.iconWireFrame, onClick:this.edgefaceWireframe},
            {
              icon: ToolbarIcons.iconGlass,
              onClick: () => {
                // Although we want the viewer to be driven by the application (one diemnsional) props as much as possible,
                // there would be a few cases where viewer ui may have some temporarily overriding actions as long as it is not overriden by the application
                // Following is such case, where application says there is no element in glass mode, but the user has initiated the glass mode from the toolbar overriding the application slice ids prop
                this.props.iafViewer?.props?.view3d?.onRenderingModeChange?.(IafDrawMode.Glass);
                // commands.setDrawMode(true, true);
                this.activeShadingIcon(ToolbarIcons.iconGlass);
                this.closeSubmenu();
              },
              displayDisabled:this.props.shadingList[3].displayDisabled
            },
          ]}
        />

        {/* nav submenu */}
        <ViewerSubMenu
          submenuFlag={submenuFlags.nav}
          isIpaDev={this.props.isIpaDev}
          toolbarSize={this.props.iafViewer.state.toolbarSize}
          showSubmenu={() => this.showSubmenu({ nav: !submenuFlags.nav })}
          posTop={this.state.posTop}
          mainIcon={navMainIcon}
          subMenus={[
            /*{icon: ToolbarIcons.iconNavPan, onClick:this.cameraPan},*/
            { icon: ToolbarIcons.iconNavZoom, onClick: this.cameraZoom,displayDisabled:this.props.navigationList[0].displayDisabled || this.state.enableMapBox },
            { icon: ToolbarIcons.iconNavPan, onClick:this.cameraPan,displayDisabled:this.props.navigationList[1].displayDisabled || this.state.enableMapBox},
            { icon: ToolbarIcons.iconNavRotate, onClick: this.cameraTurnTable,displayDisabled:this.props.navigationList[2].displayDisabled || this.state.enableMapBox },
            { icon: ToolbarIcons.iconNavCamera, onClick: this.cameraOrbit,displayDisabled:this.props.navigationList[3].displayDisabled || this.state.enableMapBox },
            { icon: ToolbarIcons.iconNavFirstP, onClick: this.cameraWalkMode,displayDisabled:this.props.navigationList[4].displayDisabled || this.state.enableMapBox },
          ]}
        />

        {/* annotations submenu */}
        <ViewerSubMenu
          submenuFlag={submenuFlags.annotations}
          isIpaDev={this.props.isIpaDev}
          toolbarSize={this.props.iafViewer.state.toolbarSize}
          showSubmenu={() =>
            this.showSubmenu({ annotations: !submenuFlags.annotations })
          }
          posTop={this.state.posTop}
          mainIcon={measurementMainIcon}
          subMenus={[
            // {icon: ToolbarIcons.iconFaces, onClick: this.clickMeasureDistance, disabled: true},
            // { icon: ToolbarIcons.iconLine, onClick: this.drawLineMarkupHandler, displayDisabled: this.props.measurementList[0].displayDisabled },
            // { icon: ToolbarIcons.iconCircle, onClick: this.drawCircleMarkupHandler, displayDisabled: this.props.measurementList[0].displayDisabled },
            // { icon: ToolbarIcons.iconRectangle, onClick: this.drawRectangleMarkupHandler, displayDisabled: this.props.measurementList[1].displayDisabled },
            // { icon: ToolbarIcons.iconPolyline, onClick: this.drawPolylineMarkupHandler, displayDisabled: this.props.measurementList[0].displayDisabled },
            // { icon: ToolbarIcons.iconTextbox, onClick: this.drawTextBoxHandler, displayDisabled:this.props.measurementList[1].displayDisabled },
            // { icon: ToolbarIcons.icon3DTextbox, onClick: this.draw3DTextBoxHandler, displayDisabled:this.props.measurementList[1].displayDisabled },
            { icon: ToolbarIcons.iconPoints, onClick: this.clickMeasurePoint,displayDisabled:this.props.measurementList[0].displayDisabled },
            //  {icon: ToolbarIcons.iconEdges, onClick: this.clickMeasureEdge, disabled: true},
            // {icon: ToolbarIcons.iconAngle, onClick: this.clickMeasureAngle, disabled: true},
            // HSK PLAT-4861: UX - Move markup options to under Measurements (Annotations)
            { icon: ToolbarIcons.iconLine, onClick: this.drawLineMarkupHandler, displayDisabled: this.props.measurementList[0].displayDisabled },
            { icon: ToolbarIcons.iconCircle, onClick: this.drawCircleMarkupHandler, displayDisabled: this.props.measurementList[0].displayDisabled },
            { icon: ToolbarIcons.iconRectangle, onClick: this.drawRectangleMarkupHandler, displayDisabled: this.props.measurementList[1].displayDisabled },
            { icon: ToolbarIcons.iconPolyline, onClick: this.drawPolylineMarkupHandler, displayDisabled: this.props.measurementList[0].displayDisabled },
            { icon: ToolbarIcons.iconPolygon, onClick: this.drawPolygonMarkupHandler, displayDisabled:this.props.measurementList[1].displayDisabled },
            { icon: ToolbarIcons.iconTextbox, onClick: this.drawTextBoxHandler, displayDisabled:this.props.measurementList[1].displayDisabled },
            { icon: ToolbarIcons.icon3DTextbox, onClick: this.draw3DTextBoxHandler, displayDisabled:this.props.measurementList[1].displayDisabled },
            { icon: ToolbarIcons.iconFreehand, onClick: this.drawFreehandMarkupHandler, displayDisabled: this.props.measurementList[0].displayDisabled },
            // { icon: ToolbarIcons.iconOval, onClick: this.drawFunction, displayDisabled: this.props.measurementList[0].displayDisabled },
            // { icon: ToolbarIcons.iconArrow, onClick: this.drawFunction, displayDisabled: this.props.measurementList[1].displayDisabled },
            // { icon: ToolbarIcons.iconHighlighter, onClick: this.drawFunction, displayDisabled: this.props.measurementList[0].displayDisabled },
            // { icon: ToolbarIcons.iconImage, onClick: this.drawFunction, displayDisabled:this.props.measurementList[1].displayDisabled },
            { icon: ToolbarIcons.iconSprite, onClick: this.drawImageBoxHandler, displayDisabled:this.props.measurementList[1].displayDisabled },
            { icon: ToolbarIcons.iconExport, onClick: this.drawExportHandler, displayDisabled:this.props.measurementList[1].displayDisabled },
            { icon: ToolbarIcons.iconImport, onClick: this.drawImportHandler, displayDisabled:this.props.measurementList[1].displayDisabled },
            // { icon: ToolbarIcons.iconComment, onClick: this.drawFunction, displayDisabled:this.props.measurementList[1].displayDisabled },
          ]}
        >
        <>
          <Divider orientation="horizontal" />
            <div className={styles["markup-container"]}>
                {this.createMarkupSwitches().map((markUpItem, idx) => (
                    <div key={idx} className={styles["markup-custom-item"]}>
                        {markUpItem}
                    </div>
                ))}
            </div>
          </>
        </ViewerSubMenu>

        <ViewerSubMenu
          submenuFlag={submenuFlags.manipulate}
          isIpaDev={this.props.isIpaDev}
          toolbarSize={this.props.iafViewer.state.toolbarSize}
          showSubmenu={() =>
            this.showSubmenu({ manipulate: !submenuFlags.manipulate })
          }
          posTop={this.state.posTop}
          mainIcon={manipulateMainIcon}
          subMenus={[
            {icon: ToolbarIcons.iconIsolate, onClick: this.handleUtilities, callback: this.props.iafViewer.handleIsolate,displayDisabled:this.props.manipulateList[0].displayDisabled},
            {icon: ToolbarIcons.iconHide, onClick: this.handleUtilities, callback: this.props.iafViewer.handleHide, displayDisabled: this.props.manipulateList[1].displayDisabled},
            {icon: ToolbarIcons.iconShowAll, onClick: this.handleUtilities, callback: this.props.handleShowAll, displayDisabled: this.props.manipulateList[2].displayDisabled},
            // {icon: ToolbarIcons.iconZoom, onClick: this.handleUtilities, callback: this.props.iafViewer.handleZoom, displayDisabled: this.props.manipulateList[3].displayDisabled},
          ]}
        />
      </div>
    );
  }

  async handleSettingButtonClicked(e) {
    if(this.props.iafViewer.state.isShowSettings){
      this.props.closeSettingsModal()
      this.toggleSettingContent(false);
    }
    else{
    this.setState({ userHasOpenedSidePanel: true });
    await this.props.showSettingsModal();
    this.toggleSettingContent(true);
    this.toggleMarkupsContent(false);
    this.toggleGisViewerContent(false);
    this.toggleLoadConfigContent(undefined, false);
    this.toggleCuttingContent(false);
    this.toggleLearningContent(false);
    }
  }

  async handleCloseSidePanel() {
    if (this.props.iafViewer.state.isShowSettings) {
      this.props.closeSettingsModal(false)
      this.toggleSettingContent();
    }
    if (this.props.iafViewer.state.isShowMarkups) {
      this.props.iafViewer.closeMarkupModal();
      this.toggleMarkupsContent(false);
    }
    if (this.props.iafViewer.state.isShowCuttingPlanes) {
      this.setState({ displayToggleCuttingPlanes: false});
      await this.props.iafViewer.toggleCuttingPlanesDiv();
      this.toggleCuttingContent(false);
    }
    if (this.state.showwalkmode) {
      this.setState({ showwalkmode: false});
      this.toggleLearningContent();
    }
    if(this.props.iafViewer.state.isShowLoadConfig){
      this.setState({displayToggleLoadConfig:false})
      await this.props.iafViewer.toggleLoadConfigDiv();
      this.toggleLoadConfigContent();
    }
    if (this.props.iafViewer.state.enableDevTools) {
      await this.props.iafViewer.handleDevToolsPanel(false)
    }
    this.handlePanelCount();
  }

}

export default NewToolbar;
