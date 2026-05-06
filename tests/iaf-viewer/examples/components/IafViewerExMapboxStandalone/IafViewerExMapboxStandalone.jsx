import React from 'react';
import PropTypes from 'prop-types';
import { IafViewerDBM } from '@dtplatform/iaf-viewer';
import { GIS_CONFIG } from './config';
import GisConfigPanel from '../toolkit/GisConfigPanel/GisConfigPanel';
import { loadCachedGisConfig } from '../toolkit/IafViewerExUtils';
import IafViewerExample from '../IafViewerExample/IafViewerExample';
import './IafViewerExMapboxStandalone.css';

class IafViewerExMapboxStandalone extends IafViewerExample {
  constructor(props) {
    super(props);
    
    // Load cached GIS config (token) from localStorage
    const cachedConfig = loadCachedGisConfig();
    
    // Merge cached values with default config
    const initialGisConfig = cachedConfig 
      ? { ...GIS_CONFIG, ...cachedConfig }
      : GIS_CONFIG;
    
    this.state = {
      ...this.state,
      gis: {
        enable: true,
        showToolbar: true,
        token: initialGisConfig.token,
        opacity: 1.0,
        dynamicRenderingZoom: 11,
        dynamicRenderingDistance: 1100,
        onIafMapReady: this.handleGisReady.bind(this),
        initial: {
          zoom: 15,
          pitch: 60,
          bearing: 0
        }
      },
      view3d: {
        opacity: 1.0,
        enable: false
      },
      view2d: {
        enable: false
      },
      ue: {
        enable: false
      },
      arcgis: {
        enable: false
      },
      showConfigPanel: props.showConfigPanel ?? false,
      eventLogs: [],
      enableEventLog: false,
      mapInstance: null
    };
  }

  handleGisReady(mapInstance) {
    this.addEventLog({
      type: 'onIafMapReady',
      mapInstance: mapInstance ? 'available' : 'null',
      info: {
        map: mapInstance?.map ? 'available' : 'null',
        containerId: mapInstance?.containerId,
        focusSelector: mapInstance?.focusSelector
      }
    });

    console.log('[Mapbox Standalone Viewer] GIS Map is ready!', mapInstance);

    this.mapInstance = mapInstance;
    this.setState({ mapInstance });

    if (mapInstance?.focusSelector) {
      const focusElement = document.querySelector(mapInstance.focusSelector);
      if (focusElement) {
        console.log('[Mapbox Standalone Viewer] GIS Map ready - focus selector available:', mapInstance.focusSelector);
      }
    }
  }


  handleGisPropertiesChange = (updatedGis) => {
    const gisWithHandler = {
      ...updatedGis,
      onIafMapReady: updatedGis.onIafMapReady ?? this.state.gis.onIafMapReady
    };
    this.setState({ gis: gisWithHandler });
    if (this.props.onGisPropertiesChange) {
      this.props.onGisPropertiesChange(gisWithHandler);
    }
  }

  render() {
    const serverUri = this.getActiveServerUri();

    const viewerProps = {
      ...this.getViewerCommonProps(),
      gis: this.state.gis,
      view2d: this.state.view2d,
      view3d: this.state.view3d,
      ue: this.state.ue,
      arcgis: this.state.arcgis,
      modelComposition: this.state.modelComposition,
      title: 'IafViewerExMapboxStandalone',
      enablePersistence: true,
      ...(serverUri && { serverUri })
    };

    const showConfigPanel = this.getShowConfigPanel();
    const handleGisPropertiesChange = this.props.onGisPropertiesChange ?? this.handleGisPropertiesChange;
    const handleConfigToggle = this.props.onConfigToggle ?? this.handleConfigToggle;

    return (
      <div className="example-mapbox-viewer-container">
        {this.renderHeader({
          containerClassName: 'example-mapbox-viewer-header',
          contentClassName: 'example-mapbox-viewer-header-content',
          backButtonClassName: 'example-mapbox-viewer-back-button',
          toggleClassName: 'example-mapbox-viewer-toggle',
          toggleButtonClassName: 'example-mapbox-viewer-toggle-button',
          headerTextClassName: 'example-mapbox-viewer-header-text',
          subtitleClassName: 'example-mapbox-viewer-subtitle',
          title: 'Mapbox Standalone Viewer',
          subtitle: 'Displays a Mapbox GIS map. Only GIS viewer is enabled.'
        })}
        {showConfigPanel && (
          <div className="example-mapbox-viewer-config-overlay" data-testid="gis-config-panel-container">
            <GisConfigPanel
              gis={this.state.gis}
              onGisChange={handleGisPropertiesChange}
              showAdvanced={true}
              onClose={handleConfigToggle}
              eventLogs={this.state.enableEventLog ? this.state.eventLogs : []}
              enableEventLog={this.state.enableEventLog}
              onEnableEventLogChange={(enabled) => this.setState({ enableEventLog: enabled })}
              mapInstance={this.state.mapInstance}
            />
          </div>
        )}
        <div className="example-mapbox-viewer-content">
          <IafViewerDBM {...viewerProps} />
        </div>
      </div>
    );
  }
}

IafViewerExMapboxStandalone.propTypes = {
  ...IafViewerExample.propTypes,
  onGisPropertiesChange: PropTypes.func
};

export default IafViewerExMapboxStandalone;

