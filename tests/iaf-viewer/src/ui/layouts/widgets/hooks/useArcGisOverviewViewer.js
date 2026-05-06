import { useEffect } from 'react';
import { IafObjectUtils } from '../../../../core/IafUtils';
import { isEqual } from 'lodash-es';
import EvmUtils from '../../../../common/evmUtils';

const useArcGISOverviewViewer = (iafViewer, widgetModes, updateWidgetProperties) => {
  const widgetMode = EvmUtils.EVMMode.ArcgisOverview;

  useEffect(() => {
    const widget = widgetModes.find(widget => widget.evmId === widgetMode);
    if (!widget) return;

    const shouldRender = iafViewer.state.visibleArcgisOverview &&
                         iafViewer.props[widgetMode]?.enable &&
                         IafObjectUtils.isNotEmpty(iafViewer.props[widgetMode]);

    // Layout update block
    {
      const layoutChangeCondition = shouldRender !== widget.properties.shouldRender ||
                                    widget.properties.showToolbar !== iafViewer.props[widgetMode].showToolbar ||
                                    (!iafViewer.props[widgetMode].showToolbar && widget.properties.mode !== iafViewer.props[widgetMode].displayMode);

      const layoutChanges = {
        shouldRender
        , showToolbar: iafViewer.props[widgetMode].showToolbar
        , mode: iafViewer.props[widgetMode].showToolbar && widget.properties.showToolbar ? widget.properties.mode : iafViewer.props[widgetMode].displayMode
      };

      if (layoutChangeCondition) {
        updateWidgetProperties(widgetMode, layoutChanges);
      }
    }

    // GIS property update block
    {
      const propChangeCondition =
        shouldRender &&
        !isEqual(iafViewer.props[widgetMode], widget.properties.gis);

      if (propChangeCondition) {
        updateWidgetProperties(widgetMode, {
          gis: { ...iafViewer.props[widgetMode] }
        });
      }
    }
  }, [iafViewer, widgetModes, updateWidgetProperties]);
};

export default useArcGISOverviewViewer;
