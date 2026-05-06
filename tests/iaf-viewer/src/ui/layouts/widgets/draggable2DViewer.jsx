import React, { useRef, useEffect } from 'react';
import IafDraggable from "../../component-low/iafDraggable/IafDraggable.jsx"
import { WidgetAction, WidgetMode } from '../../../common/enums/widgets.js';
import { iafCallbackWindowResize, iafCallbackWindowResize2d } from '../../../callbacks/window.js';

export default function IafDraggable2DViewer(props) {
  const { containerId, updateWidgetProperties,  viewer: iafViewer, updateViewerState } = props;
  const viewer2DWidget = useRef(null);

  const buttonVisibility = {
    // Visibility settings for the toolbar buttons.
    showCloseButton: true,
    showMinimizeButton: true,
    showMaximizeButton: true,
    showZoomInButton: true,
    showZoomOutButton: true,
    showDropDownButton: true,
  };
  useEffect(()=>{
    iafViewer.setState({viewer2DWidget : viewer2DWidget})
  }, [])
  
  const handleOnChange = (action, mode) => {
    if (action === WidgetAction.MINIMIZE || action === WidgetAction.MAXIMIZE) {

      // ATK PLAT-5131: Live mode does not refresh on resize
      // if (iafViewer._viewer2d !== undefined) iafViewer._viewer2d.resizeCanvas();
      // if (iafViewer._viewer !== undefined) iafViewer._viewer.resizeCanvas();
    } else if (action === WidgetAction.ZOOM_IN) {
      iafViewer.handleZoomIn();
    } else if (action === WidgetAction.ZOOM_OUT) {
      iafViewer.handleZoomOut();
    } else if (action === WidgetAction.CLOSE) {
      // Unhighlight the icon
      // iafViewer.newToolbarElement.current.setState({ isViewer2DVisible: false });
      // Hide the visible
      iafViewer.setState({ visible: false });
      mode = WidgetMode.DEFAULT
    }
    if(props.properties.mode !== mode) {
      updateWidgetProperties({ mode: mode });
      updateViewerState && updateViewerState('view2d.displayMode', mode);

      // ATK PLAT-5131: Live mode does not refresh on resize
      iafCallbackWindowResize(iafViewer);
      iafCallbackWindowResize2d(iafViewer);
    }
  };
  
  //Any specific implementation related to 2dViewer goes here.
   return (
    <IafDraggable 
        ref={viewer2DWidget}
        containerId={containerId} 
        onResize={()=>{
          if (iafViewer.state.isModelStructureReady2d) {
              if (iafViewer._viewer2d) iafViewer._viewer2d.resizeCanvas();
          }
          if (iafViewer.state.isModelStructureReady) {
              if (iafViewer._viewer) iafViewer._viewer.resizeCanvas();
              iafViewer.iafMapBoxGl && iafViewer.iafMapBoxGl.map.resize()  
          }
        }}
        onChange={handleOnChange}
        buttonVisibility={buttonVisibility}
        options={{
          dropDown:{
            visible: iafViewer.state.visible,
            sheetNames: iafViewer.state.sheetNames,
            sheetIdx: iafViewer.state.sheetIdx,
            enableSheetSwitch: iafViewer.state.enableSheetSwitch,
            onSheetChange: (event) => iafViewer.handleSheetSelection.bind(iafViewer, event.target.value)()
          }
          }
        }
        properties={props.properties}
       >
    </IafDraggable>
  );
}
