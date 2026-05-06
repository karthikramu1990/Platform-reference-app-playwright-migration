import React from 'react';
import PropTypes from 'prop-types';
import { IafViewerDBM, IafEvmUtils } from '@dtplatform/iaf-viewer';
import IafViewerExMapboxStandalone from '../IafViewerExMapboxStandalone/IafViewerExMapboxStandalone';
import GisConfigPanel from '../toolkit/GisConfigPanel/GisConfigPanel';
import View3dConfigPanel from '../toolkit/View3dConfigPanel/View3dConfigPanel';
import './IafViewerExGeoReferencedView3d.css';

/** One-line subtitle for IafViewerExamplesView fullscreen header (grid card uses long text in defaultExampleCategories). */
export const IafViewerExGeoReferencedView3dViewerSubtitle =
  'Mapbox GIS + 3D with geo-referencing; all project models, no clusteredModels filter.';

class IafViewerExGeoReferencedView3d extends IafViewerExMapboxStandalone {
  constructor(props) {
    super(props);
    
    // Add view3d to state (inherits all other state from parent)
    this.state = {
      ...this.state,
      view3d: {
        opacity: 1.0,
        enable: false
      },
      view2d: {
        enable: false
      },
      gis: {
        ...this.state.gis,
        showToolbar: false,
        dynamicRenderingZoom: 12,
        dynamicRenderingDistance: 1200,
        onIafMapReady: this.handleGisReady.bind(this),
        onFederatedModeChanged: this.handleFederatedModeChanged.bind(this),
        onReferenceModelChanged: this.handleReferenceModelChanged.bind(this),
        onElevationModeChanged: this.handleElevationModeChanged.bind(this),
        onOutlineLoaded: this.handleOutlineLoaded.bind(this),
        onModelSelect: this.handleModelSelect.bind(this),
        initial: {
          center: { lng: 77.7186736529, lat: 13.1990670531 }
        }
      },
      modelComposition: {
        defaultFederationType: "Project",
        initial: {
            Architectural: true,
            Structural: false,
            Mechanical: false,
            Electrical: false,
            Plumbing: false,
            FireProtection: false,
            Infrastructural: false,
            default: false
        },
        quality: 'low'
      },
      // Callback logs for display in config panel
      onIafMapReadyLog: null,
      onFederatedModeChangedLog: null,
      onReferenceModelChangedLog: null,
      onElevationModeChangedLog: null,
      onModelSelectLog: null,
      OnModelCompositionReadyCallback: this.handleModelCompositionReady.bind(this),
    };
  }

  _switchToOutlineMode() {
    setTimeout(() => {
      this.setState({
        gis: {
          ...this.state.gis,
          federatedMode: IafEvmUtils.EvmFederatedMode.Outline
        }
      });        
    }, 2000)
  }

  handleModelCompositionReady(modelType, firstLoad) {
    console.log('[Geo-Referenced 3D Viewer] Model composition ready:', modelType);
    if (modelType === '3d' && firstLoad) this._switchToOutlineMode();
  }

  handleOutlineLoaded() {
    console.log('[Geo-Referenced 3D Viewer] Outline loaded!');
    setTimeout(() => this.setState({
      view3d: {
        opacity: 1.0,
        enable: true
      }, 
      view2d: {
        enable: false
      }
    }), 1000);
  }

  handleGisReady(mapInstance) {
    console.log('[Geo-Referenced 3D Viewer] GIS Map is ready!', mapInstance);
    
    // Store callback data for display in config panel
    const onIafMapReadyLog = {
      mapInstance: mapInstance ? 'available' : 'null',
      map: mapInstance?.map ? 'available' : 'null',
      loaded: mapInstance?.loaded ? mapInstance.loaded() : false,
      timestamp: new Date().toISOString()
    };
    
    this._switchToOutlineMode();

    console.log('[Geo-Referenced 3D Viewer] GIS Map ready state!', this.state.gis);

    this.setupClickHandlers(mapInstance);
  }

  /**
   * Callback invoked when federated mode changes
   * @param {number} federatedMode - The new federated mode value (IafEvmUtils.EvmFederatedMode enum)
   */
  handleFederatedModeChanged(federatedMode) {
    // Get mode label using enum values
    let modeLabel = 'Unknown';
    if (federatedMode === IafEvmUtils.EvmFederatedMode.None) {
      modeLabel = 'None';
    } else if (federatedMode === IafEvmUtils.EvmFederatedMode.Outline) {
      modeLabel = 'Outline';
    } else if (federatedMode === IafEvmUtils.EvmFederatedMode.Hybrid) {
      modeLabel = 'Hybrid';
    } else if (federatedMode === IafEvmUtils.EvmFederatedMode.Dynamic) {
      modeLabel = 'Dynamic';
    } else if (federatedMode === IafEvmUtils.EvmFederatedMode.Markers) {
      modeLabel = 'Markers';
    }
    
    const logData = {
      federatedMode,
      modeLabel,
      enumValue: {
        None: IafEvmUtils.EvmFederatedMode.None,
        Outline: IafEvmUtils.EvmFederatedMode.Outline,
        Hybrid: IafEvmUtils.EvmFederatedMode.Hybrid,
        Dynamic: IafEvmUtils.EvmFederatedMode.Dynamic,
        Markers: IafEvmUtils.EvmFederatedMode.Markers
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('[Geo-Referenced 3D Viewer] Federated mode changed:', logData);
    
    // Store callback data for display in config panel
    this.setState({ onFederatedModeChangedLog: logData });
    
    // Example: Update external UI state, sync with external systems, etc.
    // this.updateExternalFederatedModeState(federatedMode);
  }

  /**
   * Callback invoked when the primary (reference) model changes
   * @param {string} modelId - The new primary model ID (Platform file ID)
   */
  handleReferenceModelChanged(modelId) {
    const logData = {
      modelId,
      previousModelId: this.state.gis?.primaryModelId,
      timestamp: new Date().toISOString()
    };
    
    console.log('[Geo-Referenced 3D Viewer] Reference model changed:', logData);
    
    // Store callback data for display in config panel
    this.setState({ onReferenceModelChangedLog: logData });
    
    // Example: Update external UI state, sync with external systems, etc.
    // this.updateExternalPrimaryModelState(modelId);
    // this.loadModelMetadata(modelId);
  }

  /**
   * Callback invoked when elevation mode changes
   * @param {number} elevationMode - The new elevation mode value (IafEvmUtils.EvmElevationMode enum)
   */
  handleElevationModeChanged(elevationMode) {
    // Get mode label using enum values
    let modeLabel = 'Unknown';
    if (elevationMode === IafEvmUtils.EvmElevationMode.None) {
      modeLabel = 'None';
    } else if (elevationMode === IafEvmUtils.EvmElevationMode.QuickSurface) {
      modeLabel = 'QuickSurface';
    } else if (elevationMode === IafEvmUtils.EvmElevationMode.QuickUnderground) {
      modeLabel = 'QuickUnderground';
    } else if (elevationMode === IafEvmUtils.EvmElevationMode.Surface) {
      modeLabel = 'Surface';
    } else if (elevationMode === IafEvmUtils.EvmElevationMode.Blend) {
      modeLabel = 'Blend';
    } else if (elevationMode === IafEvmUtils.EvmElevationMode.Underground) {
      modeLabel = 'Underground';
    }
    
    const logData = {
      elevationMode,
      modeLabel,
      enumValue: {
        None: IafEvmUtils.EvmElevationMode.None,
        QuickSurface: IafEvmUtils.EvmElevationMode.QuickSurface,
        QuickUnderground: IafEvmUtils.EvmElevationMode.QuickUnderground,
        Surface: IafEvmUtils.EvmElevationMode.Surface,
        Blend: IafEvmUtils.EvmElevationMode.Blend,
        Underground: IafEvmUtils.EvmElevationMode.Underground
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('[Geo-Referenced 3D Viewer] Elevation mode changed:', logData);
    
    // Store callback data for display in config panel
    this.setState({ onElevationModeChangedLog: logData });
    
    // Example: Update external UI state, sync with external systems, etc.
    // this.updateExternalElevationModeState(elevationMode);
  }

  /**
   * Callback invoked when a location marker for a model is selected (clicked)
   * @param {string} modelId - The Platform file ID of the selected model
   */
  handleModelSelect(modelId) {
    const logData = {
      modelId,
      timestamp: new Date().toISOString()
    };
    
    console.log('[Geo-Referenced 3D Viewer] Model selected:', logData);
    
    // Store callback data for display in config panel
    this.setState({ onModelSelectLog: logData });
    
    // Example: Update external UI state, show model details, etc.
    // this.showModelDetails(modelId);
    // this.updateExternalSelectionState(modelId);
  }

  setupClickHandlers = (iafmap) => {
    iafmap?.on('click', (e) => {
      const allFeatures = iafmap.queryRenderedFeatures(e.point);
      
      console.log('[Geo-Referenced 3D Viewer] Clicked features:', allFeatures.map(f => ({
        layerId: f.layer.id,
        layerType: f.layer.type,
        properties: f.properties
      })));

      // Handle location marker clicks
      const locationMarkerFeatures = allFeatures.filter(f => 
        f.layer.id === 'location-marker-image' || 
        f.layer.id === 'location-marker-title'
      );

      if (locationMarkerFeatures.length > 0) {
        const feature = locationMarkerFeatures[0];
        const modelId = feature.properties?.id;
        
        if (modelId === 'center-marker') return;

        this.handleModelClick(modelId, feature.layer.id, e);
      }
    });
  }

  /**
   * Handle location marker click - implement your custom logic here
   * 
   * @param {string} modelId - The Platform file ID / model ID from marker properties
   * @param {string} layerId - The Mapbox layer ID ('location-marker-image' or 'location-marker-title')
   * @param {Object} event - Mapbox click event with point, lngLat, etc.
   */
  handleModelClick(modelId, layerId, event) {
    // Example implementations:
    
    // 1. Link to Platform items
    // const platformItem = this.getPlatformItemByFileId(modelId);
    // if (platformItem) {
    //   this.showItemDetails(platformItem);
    // }

    // 2. Show custom Mapbox popup
    // if (window.mapboxgl && window.mapboxgl.Popup) {
    //   new window.mapboxgl.Popup()
    //     .setLngLat(event.lngLat)
    //     .setHTML(`<b>Model ID:</b> ${modelId}<br><b>Layer ID:</b> ${layerId}`)
    //     .addTo(iafmap);
    // }

    // 3. Update external UI state
    // this.props.onModelClick?.(modelId, event);

    // 4. Dispatch custom event for external listeners
    // window.dispatchEvent(new CustomEvent('model-clicked', {
    //   detail: { modelId, layerId, event }
    // }));

    // 5. Call parent component callback if provided
    // if (this.props.onModelClick) {
    //   this.props.onModelClick(modelId, layerId, event);
    // }

    console.log('[Geo-Referenced 3D Viewer] Handling model click - implement your logic here:', {
      modelId,
      layerId,
      coordinates: event.lngLat,
      screenPoint: event.point
    });
  }

  handleView3dPropertiesChange = (updatedView3d) => {
    this.setState({ view3d: updatedView3d });
    if (this.props.onView3dPropertiesChange) {
      this.props.onView3dPropertiesChange(updatedView3d);
    }
  }

  /** Subclasses (e.g. clustered variant) may override. */
  getGeoRefViewerTitle() {
    return 'IafViewerExGeoReferencedView3d';
  }

  /** Subclasses may override. */
  getGeoRefHeaderTitle() {
    return 'Geo-Referenced 3D Viewer';
  }

  /** Subclasses may override. */
  getGeoRefHeaderSubtitle() {
    return 'Displays 3D models on a Mapbox GIS map with geo-referencing. Both GIS and 3D viewer are enabled. Demonstrates model click handling for federated mode.';
  }

  render() {
    const model = this.getModel();
    const serverUri = this.getActiveServerUri();

    const viewerProps = {
      ...this.getViewerCommonProps(),
      gis: this.state.gis,
      view3d: this.state.view3d,
      view2d: this.state.view2d,
      ue: this.state.ue,
      arcgis: this.state.arcgis,
      modelComposition: this.state.modelComposition,
      enablePersistence: true,
      OnModelCompositionReadyCallback: this.state.OnModelCompositionReadyCallback,
      title: this.getGeoRefViewerTitle(),
      ...(serverUri && { serverUri }),
      ...(model && { model })
    };

    const showConfigPanel = this.getShowConfigPanel();
    const handleGisPropertiesChange = this.props.onGisPropertiesChange ?? this.handleGisPropertiesChange;
    const handleView3dPropertiesChange = this.props.onView3dPropertiesChange ?? this.handleView3dPropertiesChange;
    const handleConfigToggle = this.props.onConfigToggle ?? this.handleConfigToggle;

    return (
      <div className="example-georef-viewer-container">
        {this.renderHeader({
          containerClassName: 'example-georef-viewer-header',
          contentClassName: 'example-georef-viewer-header-content',
          backButtonClassName: 'example-georef-viewer-back-button',
          toggleClassName: 'example-georef-viewer-toggle',
          toggleButtonClassName: 'example-georef-viewer-toggle-button',
          headerTextClassName: 'example-georef-viewer-header-text',
          subtitleClassName: 'example-georef-viewer-subtitle',
          title: this.getGeoRefHeaderTitle(),
          subtitle: this.getGeoRefHeaderSubtitle()
        })}
        {showConfigPanel && (
          <div className="example-georef-viewer-config-overlay" data-testid="config-panel-container">
            <div className="example-georef-viewer-config-panels">
              <GisConfigPanel
                gis={this.state.gis}
                onGisChange={handleGisPropertiesChange}
                showAdvanced={true}
                onClose={handleConfigToggle}
                eventLogs={this.state.enableEventLog ? this.state.eventLogs : []}
                enableEventLog={this.state.enableEventLog}
                onEnableEventLogChange={(enabled) => this.setState({ enableEventLog: enabled })}
                mapInstance={this.state.mapInstance}
                onIafMapReadyLog={this.state.onIafMapReadyLog}
                onFederatedModeChangedLog={this.state.onFederatedModeChangedLog}
                onReferenceModelChangedLog={this.state.onReferenceModelChangedLog}
                onElevationModeChangedLog={this.state.onElevationModeChangedLog}
                onModelSelectLog={this.state.onModelSelectLog}
              />
              <View3dConfigPanel
                view3d={this.state.view3d}
                onView3dChange={handleView3dPropertiesChange}
                showAdvanced={true}
                onClose={handleConfigToggle}
              />
            </div>
          </div>
        )}
        <div className="example-georef-viewer-content">
          {model ? (
            <IafViewerDBM {...viewerProps} />
          ) : (
            this.renderNoModelFallback('example-georef-viewer-no-model')
          )}
        </div>
      </div>
    );
  }
}

IafViewerExGeoReferencedView3d.propTypes = {
  ...IafViewerExMapboxStandalone.propTypes,
  onView3dPropertiesChange: PropTypes.func
};

export default IafViewerExGeoReferencedView3d;
