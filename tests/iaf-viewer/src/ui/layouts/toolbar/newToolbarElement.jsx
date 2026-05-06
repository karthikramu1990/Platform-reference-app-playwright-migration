// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 06-01-23    ATK        PLAT-2709   New UX UI Foundation Project
//                                    Code Restructuring.
// 26-04-23    HSK        PLAT-2727   Introduced toolbarSize
// 16-05-23    HSK        PLAT-2730   Revamped IafViewer Panels                                   
// 16-05-23    HSK        PLAT-2813   Revamed IafViewer Components                                     
// 24-05-23    HSK        PLAT-2730   Revamed IafViewer Panels - Settings
// 31-05-23    HSK                    Clean up unused references
// 13-06-23    HSK        PLAT-2728   Revamped IafViewer Coloring Mechanism
// 01-09-23    HSK                    Passed manipulateList prop to newToolbar
// 10-01-24    RRP        PLAT-3917   Introduce a new IafViewer property enableFocusMode
// 05-01-23    HSK        PLAT-3656   Introduce enable2DViewer in PropertyStore
// 14-MAR-24   ATK        PLAT-4283   Add missing Progress Spinners | Consume IafSpinner
// -------------------------------------------------------------------------------------

import _ from "lodash-es";
import IafSpinner from "../../component-low/IafSpinner/IafSpinner.jsx";
import NewToolbar from "./NewToolbar.jsx";
import React from 'react';

export default function iafNewToolbarElement(props) {
  const { iafViewer } = props
    let newToolbarElement;
    const { isShowSettings } = iafViewer.state;

if (!iafViewer.state.hwvInstantiated 
        && !iafViewer.props.arcgis?.enable
        && !iafViewer.props.gis?.enable
        && !iafViewer.props.view2d?.enable
        && !iafViewer.props.view3d?.enable
        && !iafViewer.props.ue?.enable
        && !iafViewer.props.photosphere?.enable
    ) {
        newToolbarElement = <div></div>;
    } else {
        //let toolIcon = {background: 'url(images/toolbarsprite.png?v=2016U1) no-repeat top left'}
  
        // Now that the viewer is instantiated, we can render any other components that depend on it (like UI for the viewer or part info)
        newToolbarElement = (
          <div style={{ borderRadius: "1em", display: iafViewer.state.toolbarSize === 'none' ? 'none' : 'flex' }} >
            <NewToolbar
              ref={iafViewer.newToolbarElement}
              iafViewer={iafViewer}
              graphicsHandler={props.graphicsHandler}
              graphicsResources={props.graphicsResources}
              graphicsResources2d={props.graphicsResources2d}
              models={props.models}
              viewer={iafViewer._viewer}
              viewer2D={iafViewer._viewer2d}
              showSettingsModal={iafViewer.showSettingsModal}
              handleChangeSliderTopPlane={iafViewer.handleChangeSliderTopPlane}
              handleChangeSliderBottomPlane={iafViewer.handleChangeSliderBottomPlane}
              handleChangeSliderFrontPlane={iafViewer.handleChangeSliderFrontPlane}
              handleChangeSliderBackPlane={iafViewer.handleChangeSliderBackPlane}
              handleChangeSliderLeftPlane={iafViewer.handleChangeSliderLeftPlane}
              handleChangeSliderRightPlane={iafViewer.handleChangeSliderRightPlane}
              resetAll={iafViewer.resetAll}
              drawMode={iafViewer._drawMode}
              isFocusMode={iafViewer.enableFocusMode}//PLAT-3917 | Introduce a new IafViewer property enableFocusMode
              idMapping={iafViewer.props.idMapping}
              sliceElementIds={iafViewer.props?.sliceElementIds}
              selectOperatorId={iafViewer.selectOperatorId}
              orbitOperatorId={iafViewer.orbitOperatorId}
              zoomOperatorId={iafViewer.zoomOperatorId}
              walkOperatorId={iafViewer.walkOperatorId}
              navOperatorId={iafViewer.navOperatorId}
              btns={iafViewer.props.btns}
              toolbarList={iafViewer.props.toolbarList}
              viewList={iafViewer.props.viewList}
              shadingList={iafViewer.props.shadingList}
              navigationList={iafViewer.props.navigationList}
              measurementList={iafViewer.props.measurementList}
              manipulateList={iafViewer.props.manipulateList}
              updateToolbar={iafViewer.props.updateToolbar}
              commands={iafViewer.commands}              
              closeSettingsModal={iafViewer.closeSettingsModal}  
              handleFocusMode={iafViewer.handleFocusMode}
              toggleFocusModeOnWalkModeChange={
                iafViewer.toggleFocusModeOnWalkModeChange
              }
              cuttingPlaneValues={iafViewer.props.cuttingPlaneValues}
              isSetCuttingPlaneActive={iafViewer.state.isSetCuttingPlaneActive}
              getplaneValues={iafViewer.getplaneValues}
              getModelBoundingBox={iafViewer.getModelBoundingBox}
              iafCuttingPlanesUtils={iafViewer.iafCuttingPlanesUtils}
              iafSpaceUtils={iafViewer.iafSpaceUtils}
              testUi={true}
              isIpaDev={iafViewer.props.isIpaDev}
              toggleVisibilityViewer2d={iafViewer.toggleVisibilityViewer2d}
              toggleVisibilityViewer3d={iafViewer.toggleVisibilityViewer3d}
              toggleVisibilityArcgis={iafViewer.toggleVisibilityArcgis}
              toggleVisibilityArcgisOverview={iafViewer.toggleVisibilityArcgisOverview}
              toggleVisibilityUnrealEngine={iafViewer.toggleVisibilityUnrealEngine}
              toggleVisibilityPhotosphere={iafViewer.toggleVisibilityPhotosphere}
              handleShowAll={iafViewer.handleShowAll}
              isShowSettings={isShowSettings}
              handleUnitConversion={iafViewer.handleUnitConversion}
              forceShowModal={iafViewer.state.forceShowModal}
              handleForceShowModal={iafViewer.handleForceShowModal}
              toolbarSize={iafViewer.state.toolbarSize}
              showToolTip={iafViewer.props.showToolTip}
              sidePanelColor={iafViewer.props.sidePanelColor}
              onHoverIconColor={iafViewer.props.onHoverIconColor}
              onActiveIconColor={iafViewer.props.onActiveIconColor}
              toolbarColor ={iafViewer.props.toolbarColor}
              isModelLoading={(iafViewer.props.view3d.enable && _.size(iafViewer.props.fileSet) > 0 && !iafViewer.state.view3d.isLoaded) ||
                (iafViewer.props.view2d.enable &&  _.size(iafViewer.props.fileSet2d) > 0 && !iafViewer.state.view2d.isLoaded)}
              handleToolbarSize = {iafViewer.handleToolbarSize}
              enable2DViewer = {iafViewer.props.enable2DViewer && iafViewer.props.view2d.enable}
              enableMapBox={iafViewer.state.gis.enable} // ATK PLG-1502: GIS 2.0 - Review the GIS Properties - enable and showToolbar
              gis={iafViewer.state.gis}
              handleModelSelection={iafViewer.props.handleModelSelection}
            />
            
            <IafSpinner 
              condition={
                  (
                    (iafViewer.props.view3d.enable && _.size(iafViewer.props.fileSet) > 0
                      && !iafViewer.state.isModelStructureReady) 
                      || (!iafViewer.state.gis.isLoaded) || (!iafViewer.state.view3d.isLoaded)
                      || (!iafViewer.state.isLinkedModelLoaded)
                      || (_.size(iafViewer.props.fileSet2d) > 0 && iafViewer.props.enable2DViewer && iafViewer.props.view2d.enable
                          && !iafViewer.state.isModelStructureReady2d)
                      || !iafViewer.canApplyViewerVisibility()
                  )
                }>
            </IafSpinner>
          </div>
        );
    }

    return newToolbarElement;
}