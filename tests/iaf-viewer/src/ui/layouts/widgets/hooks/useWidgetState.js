import { useReducer } from 'react';
import { WidgetIds } from '../../../../common/enums/widgets';

const widgetReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PROPERTIES':
      return state.map(widget => {
        const newProperties = { ...widget.properties, ...action.properties };
        return widget.evmId === action.id
          ? { ...widget, properties: newProperties }
          : widget;
      });
    default:
      return state;
  }
};

const useWidgetState = (initialWidgets) => {
  const [widgetModes, dispatch] = useReducer(widgetReducer, initialWidgets);

  const updateWidgetProperties = (id, properties) => {
    dispatch({ type: 'UPDATE_PROPERTIES', id, properties });
  };

  return { widgetModes, updateWidgetProperties };
};

export default useWidgetState;
