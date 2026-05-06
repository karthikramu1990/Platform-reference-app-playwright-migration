import { useEffect } from 'react';
import { IafObjectUtils } from '../../../../core/IafUtils';
import { WidgetIds } from '../../../../common/enums/widgets';
import { isEqual } from 'lodash-es';
import EvmUtils from '../../../../common/evmUtils';

const useArcGISViewer = (iafViewer, widgetModes, updateWidgetProperties) => {
  const widgetMode = EvmUtils.EVMMode.Arcgis;

  useEffect(() => {
    const widget = widgetModes.find(widget => widget.evmId === widgetMode);
    if (!widget) return;

    // Use shared state for enable (synced from props)
    const currentArcgisEnable = iafViewer.state.arcgis?.enable ?? iafViewer.props[widgetMode]?.enable ?? false;
    
    const shouldRender = iafViewer.state.visibleArcgis &&
                          currentArcgisEnable &&
                          IafObjectUtils.isNotEmpty(iafViewer.props[widgetMode]);

    // Use shared state for displayMode (synced from both props and toolbar buttons)
    const currentDisplayMode = iafViewer.state.arcgis?.displayMode ?? iafViewer.props[widgetMode]?.displayMode;

    // Use shared state for showToolbar (synced from props, potentially toolbar buttons)
    const currentShowToolbar = iafViewer.state.arcgis?.showToolbar ?? iafViewer.props[widgetMode]?.showToolbar ?? true;

    // Use shared state for alignment (synced from props)
    const currentAlignment = iafViewer.state.arcgis?.alignment ?? iafViewer.props[widgetMode]?.alignment ?? EvmUtils.EVMWidgetAlignment.LEFT_TOP;

    // Use shared state for margin (synced from props)
    const currentMargin = iafViewer.state.arcgis?.margin ?? iafViewer.props[widgetMode]?.margin ?? 0;

    // Update widget layout properties if mode or visibility changed (shared state → widget sync)
    {
        const layoutChangeCondition = shouldRender !== widget.properties.shouldRender
                                        || widget.properties.showToolbar !== currentShowToolbar
                                        || widget.properties.mode !== currentDisplayMode
                                        || widget.properties.alignment !== currentAlignment
                                        || widget.properties.margin !== currentMargin;
            
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

    // Perform a deep comparison for the ArcGIS object
    if (shouldRender && !isEqual(iafViewer.props[widgetMode], widget.properties.gis)) {
      updateWidgetProperties(EvmUtils.EVMMode.Arcgis, { gis: { ...iafViewer.props[widgetMode] } });
    }
  }, [
    iafViewer.state.visibleArcgis,
    iafViewer.state.arcgis?.displayMode, // Use shared state
    iafViewer.state.arcgis?.enable, // Use shared state
    iafViewer.state.arcgis?.showToolbar, // Use shared state
    iafViewer.state.arcgis?.alignment, // Use shared state
    iafViewer.state.arcgis?.margin, // Use shared state
    iafViewer.props[widgetMode], // Needed for deep comparison of full arcgis object (config, zoomElements, etc.)
    widgetModes,
    updateWidgetProperties
  ]);
};

export default useArcGISViewer;
