import React from 'react';
import PropTypes from 'prop-types';
import { IafViewerDBM, IafEvmUtils } from '@dtplatform/iaf-viewer';
import { ARCGIS_CONFIG, INITIAL_POSITION_CAMERA } from './config';
import ArcGisConfigPanel from '../toolkit/ArcGisConfigPanel/ArcGisConfigPanel';
import IafViewerExample from '../IafViewerExample/IafViewerExample';
import { getSampleDistrictGraphics, getSampleZoomElements, getSampleZoomCommand, getSampleSlicedElements, getSampleThemeElements, getSampleLayers, loadCachedArcgisConfig, createOnIafMapReadyLog, getSampleArcGisModules } from '../toolkit/IafViewerExUtils';
import './IafViewerExArcgisStandaloneViewer.css';

class IafViewerExArcgisStandaloneViewer extends IafViewerExample {
  constructor(props) {
    super(props);
    
    // Load cached ArcGIS config (portalUrl, apiKey, model) from localStorage
    const cachedConfig = loadCachedArcgisConfig();
    
    // Merge cached values with default config
    const initialConfig = cachedConfig 
      ? { ...ARCGIS_CONFIG, ...cachedConfig } // Merge cached values with existing config
      : ARCGIS_CONFIG;
    
    this.state = {
      ...this.state,
      arcgis: {
        enable: true,
        config: initialConfig,
        // ArcGIS-specific properties - initialize with sample data
        slicedElements: getSampleSlicedElements(),
        themeElements: getSampleThemeElements(),
        graphics: getSampleDistrictGraphics(),
        zoomElements: getSampleZoomElements(),
        layers: getSampleLayers(),
        camera: INITIAL_POSITION_CAMERA,
        command: getSampleZoomCommand(),
        // Display properties
        displayMode: IafEvmUtils.EVMDisplayMode.FULLSCREEN,
        showToolbar: true,
        alignment: IafEvmUtils.EVMWidgetAlignment.LEFT_TOP,
        order: 7,
        margin: 0,
        // Callbacks
        eventHandler: this.handleArcgisEvent.bind(this),
        onIafMapReady: this.handleArcgisReady.bind(this)
      },
      view3d: {
        enable: false
      },
      view2d: {
        enable: false
      },
      ue: {
        enable: false
      },
      gis: {
        enable: false
      },
      showConfigPanel: props.showConfigPanel ?? false,
      eventLogs: [],
      enableEventLog: true, // Event logging enabled by default for demo
      mapInstance: null, // Will be set when viewer is ready
      onIafMapReadyLog: null // Special log for onIafMapReady callback data
    };
  }

  handleArcgisEvent(ev) {
    const eventName = ev?.eventName?.toLowerCase();
    
    // Add event to log
    this.addEventLog({
      type: 'eventHandler',
      eventName: ev?.eventName,
      payload: ev?.payload,
      fullEvent: ev
    });
    
    console.log('[ArcGIS Standalone Viewer] ArcGIS Event:', ev);
    
    switch (eventName) {
      case IafEvmUtils.EVM_EVENTS.VIEWER_READY:
        console.log('[ArcGIS Standalone Viewer] ArcGIS Viewer ready:', ev.payload);
        // Scene is ready - you can now perform operations like adding graphics, setting camera, etc.
        if (ev.payload?.ready) {
          console.log('[ArcGIS Standalone Viewer] Scene and SceneView are ready');
        }
        break;
        
      case IafEvmUtils.EVM_EVENTS.SELECTION_UPDATE:
        console.log('[ArcGIS Standalone Viewer] Element selected:', ev.payload);
        // Example: Handle district or building selection
        const elements = ev?.payload?.elements || [];
        elements.forEach(element => {
          console.log(`  - ${element.elementType}: ${element.id}`);
        });
        break;
        
      case IafEvmUtils.EVM_EVENTS.CAMERA_UPDATE:
        console.log('[ArcGIS Standalone Viewer] Camera updated:', ev.payload);
        break;
        
      case IafEvmUtils.EVM_EVENTS.POINTER_MOVE:
        // High-frequency event - typically not logged to avoid console spam
        break;
        
      case IafEvmUtils.EVM_EVENTS.POINTER_ENTER:
        console.log('[ArcGIS Standalone Viewer] Pointer enter:', ev.payload);
        break;
        
      case IafEvmUtils.EVM_EVENTS.POINTER_EXIT:
        console.log('[ArcGIS Standalone Viewer] Pointer exit:', ev.payload);
        break;
        
      case IafEvmUtils.EVM_EVENTS.LAYERS_UPDATE:
        console.log('[ArcGIS Standalone Viewer] Layers updated:', ev.payload);
        // Update layers property when layers change
        if (ev.payload?.visible) {
          this.setState(prevState => ({
            arcgis: {
              ...prevState.arcgis,
              layers: ev.payload.visible || []
            }
          }));
        }
        break;
        
      default:
        console.log('[ArcGIS Standalone Viewer] ArcGIS Event:', ev);
    }
  }

  handleArcgisReady(mapInstance) {
    // Extract available modules from arcgisModules
    const arcgisModules = mapInstance?.arcgisModules;
    const availableModules = arcgisModules ? Object.keys(arcgisModules).sort() : [];
    
    // Store onIafMapReady log data separately (not in event log)
    const onIafMapReadyLog = createOnIafMapReadyLog(mapInstance);

    console.log('[ArcGIS Standalone Viewer] ArcGIS Map is ready!', {
      mapInstance: mapInstance ? 'available' : 'not available',
      sceneView: mapInstance?.sceneView,
      scene: mapInstance?.scene,
      arcgisModules: arcgisModules ? 'available' : 'not available',
      availableModulesCount: availableModules.length,
      availableModules: availableModules,
      sampleModules: getSampleArcGisModules(arcgisModules)
    });

    // Store reference for potential use
    this.arcgisMapRef = mapInstance;
    
    // Update state to trigger re-render so mapInstance prop is available in ArcGisConfigPanel
    // Store onIafMapReady log separately (not in event log)
    this.setState({ mapInstance, onIafMapReadyLog });
    
    // Example: Access map instance methods
    if (mapInstance?.sceneView) {
      console.log('[ArcGIS Standalone Viewer] SceneView available - you can now use ArcGIS API methods');
      // Example: mapInstance.sceneView.setMapStyle("arcgis/light-gray");
    }

    // Sample graphics data inspired by applyDistrictsSymbologyAction()
    // This creates sample district label graphics similar to the PlatformReferenceApp implementation
    const sampleGraphics = getSampleDistrictGraphics();
    // This creates sample zoom elements following the pattern of zoomToOnly()
    const sampleZoomElements = getSampleZoomElements();
    // This creates sample zoom command following the exact pattern of zoomToOnly() (wrapped command object)
    const sampleZoomCommand = getSampleZoomCommand();

    console.log('[ArcGIS Standalone Viewer] Setting graphics:', {
      count: sampleGraphics.length,
      graphics: sampleGraphics,
      firstGraphic: sampleGraphics[0],
      hasUuid: sampleGraphics[0]?.uuid !== undefined
    });

    console.log('[ArcGIS Standalone Viewer] Setting zoomElements:', {
      count: sampleZoomElements.length,
      zoomElements: sampleZoomElements,
      firstZoomElement: sampleZoomElements[0]
    });

    console.log('[ArcGIS Standalone Viewer] Setting command:', {
      count: sampleZoomCommand.length,
      command: sampleZoomCommand,
      firstCommand: sampleZoomCommand[0]
    });

    // setTimeout(() => handleSampleGraphics(), 100);
    // setTimeout(() => handleInitialCamera(), 200);
    // setTimeout(() => handleSampleZoomElements(), 3000);
    // setTimeout(() => handleSampleZoomCommand(), 5000);
    // setTimeout(() => handleSampleSlicedElements(), 10000);
    // setTimeout(() => handleSampleThemeElements(), 15000);
  }


  handleArcgisPropertiesChange = (updatedArcgis) => {
    const arcgisWithHandler = {
      ...updatedArcgis,
      eventHandler: updatedArcgis.eventHandler ?? this.state.arcgis.eventHandler,
      onIafMapReady: updatedArcgis.onIafMapReady ?? this.state.arcgis.onIafMapReady
    };
    this.setState({ arcgis: arcgisWithHandler });
    if (this.props.onArcgisPropertiesChange) {
      this.props.onArcgisPropertiesChange(arcgisWithHandler);
    }
  }

  render() {
    const model = this.getModel();
    
    const viewerProps = {
      ...this.getViewerCommonProps(),
      arcgis: this.state.arcgis,
      view3d: this.state.view3d,
      view2d: this.state.view2d,
      ue: this.state.ue,
      gis: this.state.gis,
      enablePersistence: true,
    };

    const showConfigPanel = this.getShowConfigPanel();

    return (
      <div className="example-arcgis-viewer-container">
        {this.renderHeader({
          containerClassName: 'example-arcgis-viewer-header',
          contentClassName: 'example-arcgis-viewer-header-content',
          backButtonClassName: 'example-arcgis-viewer-back-button',
          toggleClassName: 'example-arcgis-viewer-toggle',
          toggleButtonClassName: 'example-arcgis-viewer-toggle-button',
          headerTextClassName: 'example-arcgis-viewer-header-text',
          subtitleClassName: 'example-arcgis-viewer-subtitle',
          title: 'Standalone ArcGIS Viewer',
          subtitle: 'Minimal implementation with only ArcGIS rendering. No UE, ArcGIS Overview, or Photosphere.'
        })}
        {/* Config panel overlay */}
        {showConfigPanel && (
          <div className="example-arcgis-viewer-config-overlay" data-testid="arcgis-config-panel-container">
            <ArcGisConfigPanel
              arcgis={this.state.arcgis}
              onChange={this.handleArcgisPropertiesChange}
              showAdvanced={true}
              onClose={this.handleConfigToggle}
              eventLogs={this.state.enableEventLog ? this.state.eventLogs : []}
              onIafMapReadyLog={this.state.onIafMapReadyLog}
              enableEventLog={this.state.enableEventLog}
              onEnableEventLogChange={(enabled) => this.setState({ enableEventLog: enabled })}
              mapInstance={this.state.mapInstance}
            />
          </div>
        )}
        <div className="example-arcgis-viewer-content">
          {model ? (
            <IafViewerDBM {...viewerProps} />
          ) : (
            this.renderNoModelFallback('example-arcgis-viewer-no-model')
          )}
        </div>
      </div>
    );
  }
}

IafViewerExArcgisStandaloneViewer.propTypes = {
  ...IafViewerExample.propTypes,
  onArcgisPropertiesChange: PropTypes.func
};

export default IafViewerExArcgisStandaloneViewer;

