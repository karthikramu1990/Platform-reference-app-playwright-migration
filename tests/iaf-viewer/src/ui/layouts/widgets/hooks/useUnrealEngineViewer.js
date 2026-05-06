import { useEffect } from 'react';
import { WidgetIds } from '../../../../common/enums/widgets';
import { IafObjectUtils } from '../../../../core/IafUtils';
import { isEqual } from 'lodash-es';
import EvmUtils from '../../../../common/evmUtils';

const useUnrealEngineViewer = (iafViewer, widgetModes, updateWidgetProperties) => {
  const widgetMode = EvmUtils.EVMMode.Ue;

  useEffect(() => {
    const widget = widgetModes.find(widget => widget.evmId === EvmUtils.EVMMode.Ue);
    if (!widget) return;

    // Use shared state for enable (synced from props)
    const currentUeEnable = iafViewer.state.ue?.enable ?? iafViewer.props[widgetMode]?.enable ?? false;
    
    const shouldRender = iafViewer.state.visibleUnrealEngine &&
                          currentUeEnable &&
                          IafObjectUtils.isNotEmpty(iafViewer.props[widgetMode]);

    // Use shared state for displayMode (synced from both props and toolbar buttons)
    const currentDisplayMode = iafViewer.state.ue?.displayMode ?? iafViewer.props[widgetMode]?.displayMode;

    // Use shared state for showToolbar (synced from props, potentially toolbar buttons)
    const currentShowToolbar = iafViewer.state.ue?.showToolbar ?? iafViewer.props[widgetMode]?.showToolbar ?? true;

    // Use shared state for alignment (synced from props)
    const currentAlignment = iafViewer.state.ue?.alignment ?? iafViewer.props[widgetMode]?.alignment ?? EvmUtils.EVMWidgetAlignment.RIGHT_BOTTOM;

    // Use shared state for margin (synced from props)
    const currentMargin = iafViewer.state.ue?.margin ?? iafViewer.props[widgetMode]?.margin ?? 0;

    // Update widget layout properties if mode or visibility changed (shared state → widget sync)
    {
        const layoutChangeCondition = shouldRender !== widget.properties.shouldRender
                                        || widget.properties.showToolbar !== currentShowToolbar
                                        || widget.properties.mode !== currentDisplayMode
                                        || widget.properties.alignment !== currentAlignment
                                        || widget.properties.margin !== currentMargin; // Check margin changes
            
        const layoutChanges = { 
            shouldRender 
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

    // Perform a deep comparison for the UE object
    if (shouldRender && !isEqual(iafViewer.props[widgetMode], widget.properties.ue)) {
      updateWidgetProperties(EvmUtils.EVMMode.Ue, { ue: { ...iafViewer.props[widgetMode] } });
    }
  }, [
    iafViewer.state.visibleUnrealEngine,
    iafViewer.state.ue?.displayMode, // Use shared state
    iafViewer.state.ue?.enable, // Use shared state
    iafViewer.state.ue?.showToolbar, // Use shared state
    iafViewer.state.ue?.alignment, // Use shared state
    iafViewer.state.ue?.margin, // Use shared state
    iafViewer.props[widgetMode], // Needed for deep comparison of full ue object (config, zoomElements, etc.)
    widgetModes,
    updateWidgetProperties
  ]);
};

export default useUnrealEngineViewer;
