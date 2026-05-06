import { useEffect } from 'react';
import { WidgetIds } from '../../../../common/enums/widgets';
import { isEqual } from 'lodash-es';
import { IafObjectUtils } from '../../../../core/IafUtils';
import EvmUtils from '../../../../common/evmUtils';

const usePhotoSphereViewer = (iafViewer, widgetModes, updateWidgetProperties) => {
  const widgetMode = EvmUtils.EVMMode.Photosphere;

  useEffect(() => {
    const widget = widgetModes.find(widget => widget.evmId === widgetMode);
    if (!widget) return;

    const shouldRender = iafViewer.state.visiblePhotosphere &&
                          iafViewer.props[widgetMode]?.enable &&
                          iafViewer.props[widgetMode] && IafObjectUtils.isNotEmpty(iafViewer.props[widgetMode]);

    // Update the widget layout properties if the mode or visibility or similar has changed
    {
        const layoutChangeCondition = shouldRender !== widget.properties.shouldRender
                                        || widget.properties.showToolbar !== iafViewer.props[widgetMode].showToolbar
                                        || !iafViewer.props[widgetMode].showToolbar && widget.properties.mode !== iafViewer.props[widgetMode].displayMode            
        const layoutChanges = { 
            shouldRender 
            , showToolbar: iafViewer.props[widgetMode].showToolbar
            , mode: iafViewer.props[widgetMode].showToolbar && widget.properties.showToolbar ? widget.properties.mode : iafViewer.props[widgetMode].displayMode
        };
        
        // Update the shouldRender property based on the new conditions
        if (layoutChangeCondition) {
            updateWidgetProperties(widgetMode, layoutChanges);
        }      
    }

    // Perform a deep comparison for the photosphere object
    if (shouldRender && !isEqual(iafViewer.props[widgetMode], widget.properties.photosphere)) {
      updateWidgetProperties(widgetMode, { photosphere: { ...iafViewer.props[widgetMode] } });
    }
  }, [iafViewer, widgetModes, updateWidgetProperties]);
};

export default usePhotoSphereViewer;
