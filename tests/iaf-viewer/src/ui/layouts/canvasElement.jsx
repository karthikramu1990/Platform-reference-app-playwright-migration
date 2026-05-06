// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 06-01-23    ATK        PLAT-2709   New UX UI Foundation Project
//                                    Code Restructuring.
// 01-09-23    HSK                    Commented contextMenu realted code
// 01-09-23    HSK                    Used IafNotification component for feedback
// 14-09-23    HSK                    Passed severity state as props to IafNotification
// 22-Oct-23   ATK        PLAT-2414   Performance - CSDL - On Demand
//                                    IafModelTreeElement for 3d, disciplines, 2d
// 22-11-23    HSK                    Removed IafNotification Component
// -------------------------------------------------------------------------------------

import React from 'react';
import IafNewToolbarElement from './toolbar/newToolbarElement.jsx';
import IafModelTreeElement from './helpers/modelTreeElement.jsx';
import IafWidgetRenderer from "./widgets/iafWidgetRenderer.jsx"
import styles from "./canvasElement.module.scss"

export default function iafCanvasElement(props) {
  const { iafViewer } = props;
  // We must render a div for the viewer to be placed in. This component must mount before instantiating the viewer.
  // Once the component has mounted and the viewer is instantiated, we can render other components that rely on it.
  return <>
  {/* Main container */}
  {
    (iafViewer.state.isDevGisInfoEnabled) ?
    (
      (
        <div>
          <div className={styles["sidebar-modelviewer"]}>
            { iafViewer.state.modelViewInfo }
          </div>
          <div className={styles["sidebar-tuner"]}>
            { iafViewer.state.tunerInfo }
          </div>
          <div className={styles["sidebar-gisviewer"]}>
            { iafViewer.state.gisViewInfo }
          </div>
        </div>
      )
      //  : 
      // (
      //   <div>
      //     <div className="sidebar-modelviewer">
      //       { iafViewer.state.modelViewInfo }
      //     </div>
      //   </div>
      // )
    ) 
    : null
  }    
  <div id={iafViewer.evmElementIdManager.getEvmElementUuidWebviewerContainer()} className={styles["webviewer-container"]}>
    <div className={styles["left-content"]}>
      <IafWidgetRenderer iafViewer={iafViewer} />
      <IafModelTreeElement
        styles="model-tree-main-dis"
        label="Model Disciplines"
        iafViewer={iafViewer}
        viewer={iafViewer._viewer}
        nodesModelTree={iafViewer.state.nodesDisciplines}
        visible={iafViewer.state.visibleDisciplines}
      />
      <IafModelTreeElement
        iafViewer={iafViewer}
        viewer={iafViewer._viewer}
        label="Model Tree 3D"
        styles="model-tree-main"
        nodesModelTree={iafViewer.state.nodesModelTree}
        visible={iafViewer.state.visibleModelTree}
      />
      <IafModelTreeElement
        iafViewer={iafViewer}
        viewer={iafViewer._viewer2d}
        label="Model Tree 2D"
        styles="model-tree-main-2d"
        nodesModelTree={iafViewer.state.nodesModelTree2d}
        visible={iafViewer.state.visibleModelTree}
      />
    </div>
    {/* Right side toolbar */}
    <div className={styles["right-toolbar"]}>
      <IafNewToolbarElement 
        iafViewer={iafViewer} 
        graphicsHandler={props.graphicsHandler} 
        graphicsResources={props.graphicsResources} 
        graphicsResources2d={props.graphicsResources2d} 
        models={props.models}
      />
    </div>
  </div>
  </>;
}