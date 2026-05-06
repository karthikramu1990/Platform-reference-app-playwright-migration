import { useEffect } from 'react';
import { WidgetIds } from '../../../../common/enums/widgets';
import EvmUtils from '../../../../common/evmUtils';
import _ from "lodash-es";

const useViewer3D = (iafViewer, widgetModes, updateWidgetProperties) => {
  const widgetMode = EvmUtils.EVMMode.View3d;


  useEffect(() => {
    const widget = widgetModes.find(widget => widget.evmId === EvmUtils.EVMMode.View3d);
    if (!widget) return;

    const shouldRender = _.size(iafViewer.props.fileSet) > 0
                        && iafViewer.props[widgetMode].enable
                        && iafViewer.state.visible3d;

    // Use shared state for displayMode (synced from both props and toolbar buttons)
    const currentDisplayMode = iafViewer.state[widgetMode]?.displayMode ?? iafViewer.props[widgetMode]?.displayMode;

    // Use shared state for showToolbar (synced from props, potentially toolbar buttons)
    const currentShowToolbar = iafViewer.state[widgetMode]?.showToolbar ?? iafViewer.props[widgetMode]?.showToolbar ?? true;

    // Use shared state for alignment (synced from props)
    const currentAlignment = iafViewer.state[widgetMode]?.alignment ?? iafViewer.props[widgetMode]?.alignment ?? EvmUtils.EVMWidgetAlignment.LEFT_TOP;

    // Use shared state for margin (synced from props)
    const currentMargin = iafViewer.state[widgetMode]?.margin ?? iafViewer.props[widgetMode]?.margin ?? 0;

    const isMapboxInteraction = iafViewer?.newToolbarElement?.current?.state?.enableMapBox && iafViewer.state[EvmUtils.EVMMode.Mapbox].enable;

    // Update the widget layout properties if the mode or visibility or similar has changed
    {
        const layoutChangeCondition = shouldRender !== widget.properties.visible
                                      || isMapboxInteraction !== widget?.properties.shouldDisablePointerEvents
                                      || isMapboxInteraction !== widget?.properties.shouldEnableTransparency
                                      || widget.properties.showToolbar !== currentShowToolbar
                                      || widget.properties.mode !== currentDisplayMode
                                      || widget.properties.alignment !== currentAlignment
                                      || widget.properties.margin !== currentMargin;
        const layoutChanges = { 
            visible: shouldRender 
            , shouldRender 
            , shouldDisablePointerEvents: isMapboxInteraction
            , shouldEnableTransparency: isMapboxInteraction
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
  }, [iafViewer.props.fileSet, iafViewer.props[widgetMode].enable, iafViewer.state[EvmUtils.EVMMode.Mapbox].enable, widgetModes, updateWidgetProperties]);
};

export default useViewer3D;
