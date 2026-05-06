// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 06-01-23    ATK        PLAT-2709   New UX UI Foundation Project
//                                    Code Restructuring.
// 05-01-23    HSK        PLAT-3656   Introduce enable2DViewer in PropertyStore
// 12-01-23    HSK        PLAT-3521   3D Element Selection with Inactive 2D Sheet
// -------------------------------------------------------------------------------------

import React from 'react';
import Draggable from "react-draggable";
import iconSplitScreen from "../img/icon-splitSCreen.svg";
import iconDragArea from "../img/icon-dragArea.svg";
import iconZoomIn from "../img/icon-zoomIn.svg";
import iconZoomOut from "../img/icon-zoomOut.svg";
import iconExpand from "../img/icon-expand.svg";
import styles from '../sheetViewElement.module.scss'
import { IafDropdown } from '../../component-low/iafDropdown/IafDropdown.jsx';
import IafTooltip from '../../component-low/Iaftooltip/IafTooltip.jsx';
import EvmUtils, { EVMMode } from '../../../common/evmUtils.js';
import _ from "lodash-es";
import IafUtils from "../../../core/IafUtils.js";

const Viewer2DIcons = {
  iconSplitScreen: {
    img: iconSplitScreen,
    tooltip: "Half Screen",
    id: "iconSplitScreen",
  },
  iconDragArea: { img: iconDragArea, tooltip: "Drag Area", id: "iconDragArea" },
  iconZoomOut: { img: iconZoomOut, tooltip: "Zoom Out", id: "iconZoomOut" },
  iconZoomIn: { img: iconZoomIn, tooltip: "Zoom In", id: "iconZoomIn" },
  iconExpand: { img: iconExpand, tooltip: "Full Screen", id: "iconExpand" },
};
  
export default function iafSheetViewElement(iafViewer) {
    const { sheetIdx, sheetIds, sheetNames } = iafViewer.state;
    const sheetOptionItems = sheetNames.map((item) => ({ label: item, value: item }))
    IafUtils.devToolsIaf && console.log('iafSheetViewElement', '/optionItems', sheetOptionItems)

    return _.size(iafViewer.props.fileSet2d) > 0 && iafViewer.props.view2d.enable && (
        <Draggable
          handle="strong"
          disabled={
            iafViewer.state.isMinUiButtonActive || iafViewer.state.isMaxUiButtonActive
          }
        >
          <div
            id={iafViewer.evmElementIdManager.getEvmElementById(EvmUtils.EVMMode.View2d)}
            className={styles["viewer-2d-main"]}
            style={{
              display: iafViewer.state.visible ? "inline-block" : "none",
            }}
          >
            <Draggable
              handle="strong"
              disabled={
                !(
                  iafViewer.state.isMinUiButtonActive ||
                  iafViewer.state.isMaxUiButtonActive
                )
              }
              onStop={iafViewer.onControlledDragStop}
            >
              <div className={styles["viewer2D-Controls"]} id="viewerController">
                <IafDropdown
                  disabled={!iafViewer.state.enableSheetSwitch}
                  title="Sheet Names"
                  className='custom-select'
                  onChange={(event) => iafViewer.handleSheetSelection.bind(iafViewer, event.target.value)()}
                  data={sheetOptionItems}
                  value = {sheetNames[sheetIdx]}
                />
                <div style={{display:'flex',justifyContent:"flex-end"}}>
                <div
                  id={iafViewer.evmElementIdManager.getEvmElementUuidViewer2DFullScreenButton()}
                  className={styles["Viewer_button"]}
                  onClick={() => {
                    iafViewer.handleMax2d();
                  }}
                >
                  <div className={styles["Viewer2d-toolbar-icon"]}>
                    <IafTooltip
                      src={Viewer2DIcons.iconExpand.img}
                      iconClass={iafViewer.state.isMaxUiButtonActive
                        ? "filter-pink"
                        : ''}
                      title={Viewer2DIcons.iconExpand.tooltip}
                      placement= {"bottom"}
                      toolTipClass="viewer2DTooltip"
                    ></IafTooltip>
                  </div>
                </div>
                <div
                  id={iafViewer.evmElementIdManager.getEvmElementUuidViewer2DHalfScreenButton()}
                  className={styles["Viewer_button"]}
                  onClick={(e) => {
                    iafViewer.handleMin2d();
                  }}
                >
                  <div className={styles["Viewer2d-toolbar-icon"]}>
                    <IafTooltip
                      src={Viewer2DIcons.iconSplitScreen.img}
                      iconClass={iafViewer.state.isMinUiButtonActive
                        ? "filter-pink"
                        : ''}
                      title={Viewer2DIcons.iconSplitScreen.tooltip}
                      placement= {"bottom"}
                      toolTipClass="viewer2DTooltip"
                    ></IafTooltip>
                  </div>
                </div>
                <div
                  className={styles["Viewer_button"]}
                  onClick={(e) => {
                    iafViewer.handleZoomIn();
                  }}
                >
                  <div className={styles["Viewer2d-toolbar-icon"]}>
                    <IafTooltip
                      src={Viewer2DIcons.iconZoomIn.img}
                      iconClass={''}
                      title={Viewer2DIcons.iconZoomIn.tooltip}
                      placement= {"bottom"}
                      toolTipClass="viewer2DTooltip"
                    ></IafTooltip>
                  </div>
                </div>
                <div
                  className={styles["Viewer_button"]}
                  onClick={(e) => {
                    iafViewer.handleZoomOut();
                  }}
                >
                  <div className={styles["Viewer2d-toolbar-icon"]}>
                    <IafTooltip
                      src={Viewer2DIcons.iconZoomOut.img}
                      iconClass={''}
                      title={Viewer2DIcons.iconZoomOut.tooltip}
                      placement= {"bottom"}
                      toolTipClass="viewer2DTooltip"
                    ></IafTooltip>
                  </div>
                </div>
                <strong>
                  <div className={styles["Viewer_button"]} id={iafViewer.evmElementIdManager.getEvmElementUuidViewer2DDragArea()}>
                    <div className={styles["Viewer2d-toolbar-icon"]}>
                      <IafTooltip
                      src={Viewer2DIcons.iconDragArea.img}
                      iconClass={''}
                      title={Viewer2DIcons.iconDragArea.tooltip}
                      placement= {"bottom"}
                      toolTipClass="viewer2DTooltip"
                    ></IafTooltip>
                    </div>
                  </div>
                </strong>
                </div>
              </div>
            </Draggable>

            <div id={iafViewer.evmElementIdManager.getEvmUuid(EvmUtils.EVMMode.View2d)} className={styles.viewer2D}>
              {/* <div className={styles["title"]}>{_.size(iafViewer.state.sheetNames) > 0 ?
            iafViewer.state.sheetNames[iafViewer.state.sheetIdx] : ''}</div> */}
            </div>
          </div>
        </Draggable>
    )        
}