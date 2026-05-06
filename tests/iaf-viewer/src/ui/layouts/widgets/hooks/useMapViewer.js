import { useEffect } from 'react';
import { WidgetIds } from '../../../../common/enums/widgets';
import EvmUtils from '../../../../common/evmUtils';

const useMapViewer = (iafViewer, widgetModes, updateWidgetProperties) => {
    const widgetMode = EvmUtils.EVMMode.Mapbox;

    // const isMapboxInteraction = () => {
    //     return iafViewer.newToolbarElement.current && iafViewer.newToolbarElement.current.state && iafViewer.newToolbarElement.current.state.enableMapBox;
    // }
    
    useEffect(() => {
        const widget = widgetModes.find(widget => widget.evmId === widgetMode);
        if (!widget) return;

        // Read from state[widgetMode].enable (synced from props) to ensure we get the latest value
        const shouldRender = iafViewer.state[widgetMode].enable ?? iafViewer.props[widgetMode].enable ?? false;

        // Use shared state for displayMode (synced from both props and toolbar buttons)
        const currentDisplayMode = iafViewer.state[widgetMode]?.displayMode ?? iafViewer.props[widgetMode]?.displayMode;

        // Use shared state for showToolbar (synced from props, potentially toolbar buttons)
        const currentShowToolbar = iafViewer.state[widgetMode]?.showToolbar ?? iafViewer.props[widgetMode]?.showToolbar ?? true;

        // Use shared state for alignment (synced from props)
        const currentAlignment = iafViewer.state[widgetMode]?.alignment ?? iafViewer.props[widgetMode]?.alignment ?? EvmUtils.EVMWidgetAlignment.LEFT_TOP;

        // Use shared state for margin (synced from props)
        const currentMargin = iafViewer.state[widgetMode]?.margin ?? iafViewer.props[widgetMode]?.margin ?? 0;

        // Update the widget layout properties if the mode or visibility or similar has changed
        {
            const layoutChangeCondition = shouldRender !== widget.properties.visible
                                            || widget.properties.showToolbar !== currentShowToolbar
                                            || widget.properties.mode !== currentDisplayMode
                                            || widget.properties.alignment !== currentAlignment
                                            || widget.properties.margin !== currentMargin;

            const layoutChanges = { 
                visible: shouldRender
                , shouldRender 
                , showToolbar: currentShowToolbar // Use shared state
                , mode: currentDisplayMode // Always use displayMode from shared state
                , alignment: currentAlignment // Use shared state for alignment
                , margin: currentMargin // Use shared state for margin
            };
            
            // Update the shouldRender property based on the new conditions
            if (layoutChangeCondition) {
                updateWidgetProperties(widgetMode, layoutChanges);
            }      
        }

        // updateWidgetProperties(EvmUtils.EVMMode.View3d, { 
        //     shouldDisablePointerEvents: isMapboxInteraction(),
        //     shouldEnableTransparency: isMapboxInteraction()
        // });
    }, [widgetModes, iafViewer.props[widgetMode], iafViewer.state[widgetMode]]);
};

export default useMapViewer;