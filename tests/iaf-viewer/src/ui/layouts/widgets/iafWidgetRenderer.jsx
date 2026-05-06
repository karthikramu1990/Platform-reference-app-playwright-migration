import React, { useEffect, useState } from 'react';
import { WidgetIds, WidgetMode, WidgetPosition } from '../../../common/enums/widgets.js';
import IafDraggable2DViewer from "./draggable2DViewer.jsx";
import Iaf3DViewer from "./iaf3DViewer.jsx";
import IafMapViewer from "./iafMapViewer.jsx";
import TerrainViewer from "../../../sandbox/terrain/terrain.component.jsx";
import IafDraggablePDFViewer from '../../../sandbox/pdfViewer/pdfviewer.component.jsx';
import styles from './iafWidgetRenderer.module.scss';
import useWidgetState from './hooks/useWidgetState';
import useTerrainViewer from './hooks/useTerrainViewer';
import useViewer2D from './hooks/useViewer2d';
import usePDFViewer from './hooks/usePdfViewer';
import IafArcGisViewer from '../../../core/arcgis/arcgis.component.jsx';
import useArcGISViewer from './hooks/useArcGisViewer.js';
import { PointerTrackingCP } from '../../../core/PointerTrackingCP.jsx';
import useUnrealEngineViewer from './hooks/useUnrealEngineViewer.js';
import IafUnrealEngineViewer from '../../../core/ue/ue.component.jsx';
import IafPhotosphereViewer from '../../../core/photosphere/photosphere.component.jsx';
import useArcGISOverviewViewer from './hooks/useArcGisOverviewViewer.js';
import usePhotoSphereViewer from './hooks/usePhotoSphereViewer.js';
import { AlignmentEnum } from '../../component-low/iafDraggable/IafDraggable.jsx';
import useMapViewer from './hooks/useMapViewer';
import useViewer3D from './hooks/useViewer3d.js';
import EvmUtils from '../../../common/evmUtils.js';
import _ from "lodash-es";

const WidgetRenderer = ({ iafViewer }) => {
  const initialWidgetData = [
    {
      evmId: EvmUtils.EVMMode.Mapbox,
      Component: IafMapViewer,
      properties: { mode: iafViewer.props.gis.displayMode, visible: true, showToolbar: iafViewer.props.gis.showToolbar, splitPosition: WidgetPosition.RIGHT, shouldRender: iafViewer.props.gis.enable, shouldEnableTransparency: true, opacity: iafViewer.props?.gis?.opacity 
        , alignment: iafViewer.props.gis.alignment, margin: iafViewer.props.gis.margin, order: iafViewer.props.gis.order
      }
    },
    {
      evmId: EvmUtils.EVMMode.View3d,
      Component: Iaf3DViewer,
      properties: { mode: iafViewer.props.view3d.displayMode, visible: true, showToolbar: iafViewer.props.view3d.showToolbar, splitPosition: WidgetPosition.RIGHT, shouldRender: _.size(iafViewer.props.fileSet) > 0 && iafViewer.props.view3d.enable, shouldEnableTransparency: false, opacity: iafViewer.props?.view3d?.opacity 
        , alignment: iafViewer.props.view3d.alignment, margin: iafViewer.props.view3d.margin, order: iafViewer.props.view3d.order
      }
    },
    {
      evmId: EvmUtils.EVMMode.View2d,
      Component: IafDraggable2DViewer,
      properties: { mode: iafViewer.props.view2d.displayMode, visible: iafViewer.state.visible, showToolbar: iafViewer.props.view2d.showToolbar, splitPosition: WidgetPosition.LEFT, shouldRender: _.size(iafViewer.props.fileSet2d) > 0 && iafViewer.props.enable2DViewer && iafViewer.props.view2d.enable && iafViewer.state.visible 
        , alignment: iafViewer.props.view2d.alignment, margin: iafViewer.props.view2d.margin, order: iafViewer.props.view2d.order
      }
    },
    {
      evmId: EvmUtils.EVMMode.TerrainViewer,
      Component: TerrainViewer,
      properties: { mode: WidgetMode.DEFAULT, visible: true, showToolbar: true, splitPosition: WidgetPosition.RIGHT, shouldRender: true
        , alignment: AlignmentEnum.LEFT_BOTTOM
        // ATK: At the moment 3d and 2d viewers are instantiated in iafviewer
        // They should ideally be instantitated via widgets components of IafWidgetRenderers.jsx
        // , dependencies: ['./lib/web_viewer.js']
        // , onDependenciesLoaded: () => initGlobals()
      }
    },
    {
      evmId: EvmUtils.EVMMode.PdfViewer,
      Component: IafDraggablePDFViewer,
      properties: { 
        url: iafViewer.props.pdf2DUrl, mode: WidgetMode.DEFAULT, visible: true, showToolbar: true, splitPosition: WidgetPosition.RIGHT, shouldRender: iafViewer.state.showPDF 
        , alignment: AlignmentEnum.LEFT_BOTTOM
      }
    },
    {
      evmId: EvmUtils.EVMMode.Arcgis,
      Component: IafArcGisViewer,
      properties: { 
        gis: {...iafViewer.props.arcgis}, 
        mode: iafViewer.props.arcgis.displayMode, visible: true, showToolbar: iafViewer.props.arcgis.showToolbar, splitPosition: WidgetPosition.LEFT, shouldRender: iafViewer.state.visibleArcgisOverview 
        , alignment: iafViewer.props.arcgis.alignment, margin: iafViewer.props.arcgis.margin, order: iafViewer.props.arcgis.order
      }
    },
    {
      evmId: EvmUtils.EVMMode.Photosphere,
      Component: IafPhotosphereViewer,
      properties: { 
        photosphere: {...iafViewer.props.photosphere}, 
        mode: iafViewer.props.photosphere.displayMode, visible: true, showToolbar: iafViewer.props.photosphere.showToolbar, splitPosition: WidgetPosition.LEFT, shouldRender: iafViewer.state.visiblePhotosphere 
        , alignment: iafViewer.props.photosphere.alignment, margin: iafViewer.props.photosphere.margin, order: iafViewer.props.photosphere.order
      }
    },
    {
      evmId: EvmUtils.EVMMode.Ue,
      Component: IafUnrealEngineViewer,
      properties: { 
        ue: {...iafViewer.props.ue}, 
        mode: iafViewer.state.ue?.displayMode ?? iafViewer.props.ue.displayMode, visible: true, showToolbar: iafViewer.state.ue?.showToolbar ?? iafViewer.props.ue.showToolbar, splitPosition: WidgetPosition.RIGHT, shouldRender: iafViewer.state.visibleUnrealEngine
        , alignment: iafViewer.state.ue?.alignment ?? iafViewer.props.ue.alignment, margin: iafViewer.state.ue?.margin ?? iafViewer.props.ue.margin, order: iafViewer.props.ue.order
      }
    },
    // Navigators
    {
      evmId: EvmUtils.EVMMode.ArcgisOverview,
      Component: IafArcGisViewer,
      properties: { 
        gis: {...iafViewer.props.arcgisOverview}, 
        mode: iafViewer.props.arcgisOverview.displayMode, visible: true, showToolbar: iafViewer.props.arcgisOverview.showToolbar, splitPosition: WidgetPosition.RIGHT, shouldRender: iafViewer.state.visibleArcgisOverview
        , width: 400,height: 210
        , alignment: iafViewer.props.arcgisOverview.alignment, margin: iafViewer.props.arcgisOverview.margin, order: iafViewer.props.arcgisOverview.order
      }
    }    
  ];
  
  // Assign the order dynamically using map
  const initialWidgets = initialWidgetData.map((widget, index) => ({
    ...widget,
    id: iafViewer?.evmElementIdManager.getEvmUuid(widget.evmId) ?? widget.evmId,
    properties: {
      ...widget.properties,
      iafViewer,
      // order: index,  // ATK: Order is now set in the propertyStore.js
      // margin: 0 // ATK: Margin is now set in the propertyStore.js
    }
  }));  

  const { widgetModes, updateWidgetProperties } = useWidgetState(initialWidgets);

  // Hooks for each widget
  useMapViewer(iafViewer, widgetModes, updateWidgetProperties);
  useTerrainViewer(iafViewer, widgetModes, updateWidgetProperties);
  useViewer2D(iafViewer, widgetModes, updateWidgetProperties);
  useViewer3D(iafViewer, widgetModes, updateWidgetProperties);
  usePDFViewer(iafViewer, widgetModes, updateWidgetProperties);
  useArcGISViewer(iafViewer, widgetModes, updateWidgetProperties);
  useUnrealEngineViewer(iafViewer, widgetModes, updateWidgetProperties);
  useArcGISOverviewViewer(iafViewer, widgetModes, updateWidgetProperties);
  usePhotoSphereViewer(iafViewer, widgetModes, updateWidgetProperties);

  const shouldEnablePointTracking = (widgetId) => {
    return [
      EvmUtils.EVMMode.Arcgis,
      EvmUtils.EVMMode.Ue,
      EvmUtils.EVMMode.ArcgisOverview,
      EvmUtils.EVMMode.Photosphere,
    ].includes(widgetId);
  };

  return (
    <div id={iafViewer.evmElementIdManager.getEvmElementUuidWidgetContainer()} className={styles["custom-container"]}>
      {widgetModes.map(widget => {

        // ATK PLG-1355: Dev Test - View2D - Re-enabling 2D Sheets from toolbar does not bring it back
        const [hasMounted, setHasMounted] = useState(widget.properties.shouldRender);
        // Track mounting once shouldRender becomes true
        useEffect(() => {
          if (widget.properties.shouldRender && !hasMounted) {
            setHasMounted(true);
          }
        }, [widget.properties.shouldRender, hasMounted]);
        // Skip completely if not ready to render yet
        if (!hasMounted) return null;
        // END ATK PLG-1355: Dev Test - View2D - Re-enabling 2D Sheets from toolbar does not bring it back
        
        return (
          <div key={widget.id} className={widget.properties.visible ? styles["widget_visible"] : styles["widget_hidden"]}
                style={{ display: widget.properties.shouldRender ? undefined : 'none' }}
          >
            <PointerTrackingCP shouldAddContext={shouldEnablePointTracking(widget.evmId)}>
            <widget.Component
              containerId={widget.id}
              evmId={widget.evmId}
              updateWidgetProperties={(properties) => updateWidgetProperties(widget.evmId, properties)}
              viewer={iafViewer}
              properties={widget.properties}
              updateViewerState={iafViewer.updateViewerState ? iafViewer.updateViewerState : undefined}
            />
            </PointerTrackingCP>
          </div>
        );
      })}
    </div>
  );
};

export default WidgetRenderer;
