import { useEffect } from 'react';
import { isEqual } from 'lodash-es';

const useGenericViewer = ({
  iafViewer,
  widgetModes,
  widgetId,
  widgetMode,
  propertyKey = null,
  updateWidgetProperties,
  getShouldRender = () => true,
}) => {
  useEffect(() => {
    const widget = widgetModes.find(widget => widget.evmId === widgetId);
    if (!widget) return;

    const props = iafViewer.props[widgetMode] ?? {};
    const shouldRender = getShouldRender();

    const renderChanged =
      shouldRender !== widget.properties.shouldRender ||
      widget.properties.showToolbar !== props.showToolbar ||
      widget.properties.mode !== props.displayMode;

    const dataChanged =
      shouldRender &&
      propertyKey &&
      !isEqual(props, widget.properties[propertyKey]);

    // If either the render settings or the deep data has changed
    if (renderChanged || dataChanged) {
      const updatedProps = {
        shouldRender,
        showToolbar: props.showToolbar,
        mode: props.displayMode,
      };

      if (propertyKey && shouldRender) {
        updatedProps[propertyKey] = { ...props };
      }

      updateWidgetProperties(widgetId, updatedProps);
    }
  }, [iafViewer, widgetModes, updateWidgetProperties]);
};

export default useGenericViewer;