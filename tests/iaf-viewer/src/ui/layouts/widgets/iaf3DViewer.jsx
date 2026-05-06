import React, { useRef, useEffect } from 'react';
import IafDraggable from "../../component-low/iafDraggable/IafDraggable.jsx"
import { WidgetAction, WidgetMode } from '../../../common/enums/widgets.js'
import { iafCallbackWindowResize, iafCallbackWindowResize2d } from '../../../callbacks/window.js';

const MainViewer = (props) => {
    const { containerId, updateWidgetProperties, viewer: iafViewer } = props;
    const viewerRef = useRef(null);
    const buttonVisibility = {
        // Visibility settings for the toolbar buttons.
        showCloseButton: true,
        showMinimizeButton: true,
        showMaximizeButton: true,
        showZoomInButton: true,
        showZoomOutButton: true,
        showDropDownButton: false,
      };
    const handleOnChange = (action, mode) => {
        let visible = props.properties.visible;
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
            iafViewer.setState({ visible3d: false });
            // Hide the visible
            // iafViewer.setState({ visible: false });
            mode = WidgetMode.DEFAULT
            // visible = false;
        }

        if (props.properties.mode !== mode) {
            updateWidgetProperties({ mode });
            updateViewerState && updateViewerState('view3d.displayMode', mode);
            
            // ATK PLAT-5131: Live mode does not refresh on resize
            iafCallbackWindowResize(iafViewer);
            iafCallbackWindowResize2d(iafViewer);
        }
    };
    return (
        <IafDraggable
            ref={viewerRef}
            containerId={containerId}
            buttonVisibility={buttonVisibility}
            onChange={handleOnChange}
            onResize={() => {
                if (iafViewer.state.isModelStructureReady2d) {
                    if (iafViewer._viewer2d) iafViewer._viewer2d.resizeCanvas();
                }
                if (iafViewer.state.isModelStructureReady) {
                    if (iafViewer._viewer) iafViewer._viewer.resizeCanvas();
                    iafViewer.iafMapBoxGl && iafViewer.iafMapBoxGl.map.resize()  
                }
            }}
            properties={props.properties}
        >
        </IafDraggable>
    );
};

export default MainViewer;
