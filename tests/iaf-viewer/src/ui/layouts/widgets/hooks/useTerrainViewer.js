import { useEffect } from 'react';
import { WidgetIds } from '../../../../common/enums/widgets';
import EvmUtils from '../../../../common/evmUtils';

const useTerrainViewer = (iafViewer, widgetModes, updateWidgetProperties) => {
  useEffect(() => {
    const terrainCondition = iafViewer.state.showSandbox;

    const terrainWidget = widgetModes.find(widget => widget.evmId === EvmUtils.EVMMode.TerrainViewer);
    if (terrainCondition !== terrainWidget?.properties.shouldRender) {
      updateWidgetProperties(EvmUtils.EVMMode.TerrainViewer, { shouldRender: terrainCondition, visible: terrainCondition });
    }
  }, [iafViewer.state.showSandbox, widgetModes, updateWidgetProperties]);
};

export default useTerrainViewer;
