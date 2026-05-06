import React from 'react';
import PropTypes from 'prop-types';
import { IafViewerDBM, IafEvmUtils } from '@dtplatform/iaf-viewer';
import IafViewerExMapboxStandalone from '../IafViewerExMapboxStandalone/IafViewerExMapboxStandalone';
import GisConfigPanel from '../toolkit/GisConfigPanel/GisConfigPanel';
import '../IafViewerExMapboxStandalone/IafViewerExMapboxStandalone.css';
import './IafViewerExGISProjectView.css';

/**
 * Mapbox GIS example focused on a multi-building project: same clusteredModels / federation
 * setup as the standalone Mapbox example, with federated Outline mode and GIS callbacks
 * wired for debugging. Derived from {@link IafViewerExMapboxStandalone}.
 */
class IafViewerExGISProjectView extends IafViewerExMapboxStandalone {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      toolbarSize: 'none',
      gis: {
        ...this.state.gis,      
        enable: true,
        initial: {
          zoom: 14,
          pitch: 0,
          bearing: 0
        },
        showToolbar: false,
        dynamicRenderingZoom: 13,
        dynamicRenderingDistance: 1300,
        federatedMode: IafEvmUtils.EvmFederatedMode.None,
        onIafMapReady: this.handleGisReady.bind(this),
        onFederatedModeChanged: (mode) => {
          console.log('[GIS Project View] gis.onFederatedModeChanged', mode);
        },
        onReferenceModelChanged: (modelId) => {
          console.log('[GIS Project View] gis.onReferenceModelChanged', modelId);
        },
        onElevationModeChanged: (elevationMode) => {
          console.log('[GIS Project View] gis.onElevationModeChanged', elevationMode);
        },
        onModelSelect: (modelId) => {
          console.log('[GIS Project View] gis.onModelSelect', modelId);
        },
        onOutlineLoaded: () => {
          console.log('[GIS Project View] gis.onOutlineLoaded');
          this.focusOnPrimaryBuilding();
        },
        onLongitudeChange: (modelIds, value) => {
          console.log('[GIS Project View] gis.onLongitudeChange', modelIds, value);
        },
        onLatitudeChange: (modelIds, value) => {
          console.log('[GIS Project View] gis.onLatitudeChange', modelIds, value);
        },
        onBearingChange: (modelIds, value) => {
          console.log('[GIS Project View] gis.onBearingChange', modelIds, value);
        },
        onAltitudeChange: (modelIds, value) => {
          console.log('[GIS Project View] gis.onAltitudeChange', modelIds, value);
        },
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
        // In the real app - the clusteredModels for a project would represent the set of buildings or models that are part of the project.
        // 
        // For iafviewer examples based on IafViewerExGeoReferencedView3d - clusteredModels would probably be shared between 
        // multiple projects for demonstration purposes. Having irrelvant models ids may won't harm the active project setup 
        // as iafviewer picks on the models that belong to the active project 
        clusteredModels: [
            {
                ids: ["69857ef69c176d4bc1e756f1"],
                title: "Garden Pavilion",
                bearing: 180,
                center: { lng: 77.7186736529, lat: 13.1990670531 },
                altitude: 0,
            },
            {
                ids: [
                    "6989e7b2c3aa852deb1c8527", // T2-ELEC-Federated
                    "698acf7eaab0130f5abec895", // T2-FAS-Federated
                    "69928e8bd372a36f0ed0b549", // T2-HVAC-Federated
                ],
                bearing: 180,
                title: "T2",
                center: { lng: 77.7160455491, lat: 13.1987226359 },
                altitude: 0,
            },
            {
                ids: ["6992843ad372a36f0ed0b2a2"],
                title: "CUP",
                bearing: 180,
                center: { lng: 77.712639, lat: 13.196139 },
                altitude: 0,
            },
            {
                ids: ["69954014958e285828157aba"],
                title: "East Gate House",
                bearing: 180,
                center: { lng: 77.7139044852, lat: 13.200347015 },
                altitude: 0,
            },
        ],                      
        quality: 'low'
      },      
    };
  }

  focusOnPrimaryBuilding = () => {
    const primaryBuilding = this.state.mapInstance?.getPrimaryBuilding?.();
    if (primaryBuilding) {
      console.log('[GIS Project View] focusOnPrimaryBuilding primaryBuilding', primaryBuilding);
      this.state.mapInstance?.setCenter([primaryBuilding.primaryModel.longitude, primaryBuilding.primaryModel.latitude]);
    } else {
      console.warn('[GIS Project View] primaryBuilding not available, using default center');
      this.state.mapInstance?.setCenter([77.7160455491, 13.1987226359]);
    }
  };

  /**
   * Map proxy {@link IafMapBoxGLProxy#resetAll} — same GIS reset path as the viewer toolbar Home when GIS is on.
   */
  handleGisHomeReset = async () => {
    const proxy = this.state.mapInstance;
    if (!proxy || typeof proxy.resetAll !== 'function') {
      console.warn('[GIS Project View] Map proxy is not ready or resetAll is unavailable');
      return;
    }
    try {
      await proxy.resetAll();
      console.log('[GIS Project View] resetAll completed (custom Home button)');
      this.addEventLog({
        type: 'resetAll',
        mapInstance: 'available',
        info: { source: 'IafViewerExGISProjectView Home button' }
      });
    } catch (err) {
      console.error('[GIS Project View] resetAll failed', err);
    }
  };

  handleGisReady(mapInstance) {
    console.log('[GIS Project View] GIS map ready (project / federation context)', mapInstance);

    // Same as IafViewerExMapboxStandalone: keep proxy on instance + state so GIS callbacks can use it
    this.setState({ mapInstance });

    this.addEventLog({
      type: 'onIafMapReady',
      mapInstance: mapInstance ? 'available' : 'null',
      info: {
        map: mapInstance?.map ? 'available' : 'null',
        containerId: mapInstance?.containerId,
        focusSelector: mapInstance?.focusSelector
      }
    });
    
    const restrictedMethods = mapInstance?.getRestrictedMethods?.();
    console.log('[GIS Project View] restrictedMethods', restrictedMethods);

    // Reset camera for a consistent demo view (map proxy: setPitch / setBearing / setZoom)
    if (mapInstance) {
      try {
        // mapInstance.setCenter([77.7160455491, 13.1987226359]);
        // mapInstance.setPitch(0);
        // mapInstance.setBearing(0);
        // mapInstance.setZoom(14.5);
      } catch (err) {
        console.warn('[GIS Project View] Failed to reset pitch/bearing/zoom on map ready', err);
      }
    } else {
      console.warn('[GIS Project View] mapInstance not available');
    }

    setTimeout(() => this.setState((prev) =>
      prev.gis.federatedMode === IafEvmUtils.EvmFederatedMode.Outline
        ? { mapInstance }
        : {
            mapInstance,
            gis: { ...prev.gis, federatedMode: IafEvmUtils.EvmFederatedMode.Outline }
          }
    ), 1000);
  }

  handleGisPropertiesChange = (updatedGis) => {
    const gisWithHandler = {
      ...updatedGis,
      onIafMapReady: updatedGis.onIafMapReady ?? this.state.gis.onIafMapReady,
      onFederatedModeChanged: updatedGis.onFederatedModeChanged ?? this.state.gis.onFederatedModeChanged,
      onReferenceModelChanged: updatedGis.onReferenceModelChanged ?? this.state.gis.onReferenceModelChanged,
      onElevationModeChanged: updatedGis.onElevationModeChanged ?? this.state.gis.onElevationModeChanged,
      onModelSelect: updatedGis.onModelSelect ?? this.state.gis.onModelSelect,
      federatedMode: updatedGis.federatedMode ?? this.state.gis.federatedMode
    };
    this.setState({ gis: gisWithHandler });
    if (this.props.onGisPropertiesChange) {
      this.props.onGisPropertiesChange(gisWithHandler);
    }
  };

  render() {
    const serverUri = this.getActiveServerUri();

    const viewerProps = {
      ...this.getViewerCommonProps(),
      toolbarSize: this.state.toolbarSize,
      gis: this.state.gis,
      view2d: this.state.view2d,
      view3d: this.state.view3d,
      ue: this.state.ue,
      arcgis: this.state.arcgis,
      modelComposition: this.state.modelComposition,
      title: 'IafViewerExGISProjectView',
      enablePersistence: true,
      ...(serverUri && { serverUri })
    };

    const showConfigPanel = this.getShowConfigPanel();
    const handleGisPropertiesChange = this.props.onGisPropertiesChange ?? this.handleGisPropertiesChange;
    const handleConfigToggle = this.props.onConfigToggle ?? this.handleConfigToggle;

    return (
      <div className="example-mapbox-viewer-container example-gis-project-view-root">
        {this.renderHeader({
          containerClassName: 'example-mapbox-viewer-header',
          contentClassName: 'example-mapbox-viewer-header-content',
          backButtonClassName: 'example-mapbox-viewer-back-button',
          toggleClassName: 'example-mapbox-viewer-toggle',
          toggleButtonClassName: 'example-mapbox-viewer-toggle-button',
          headerTextClassName: 'example-mapbox-viewer-header-text',
          subtitleClassName: 'example-mapbox-viewer-subtitle',
          title: 'GIS Project View',
          subtitle:
            'Mapbox GIS with project clustered models, federated Outline mode, and GIS-only layout (no 3D canvas).'
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
        <div className="example-mapbox-viewer-content example-gis-project-view-content">
          <button
            type="button"
            className="example-gis-project-home-reset"
            onClick={this.handleGisHomeReset}
            disabled={!this.state.mapInstance}
            title="Reset GIS view (same as toolbar Home when GIS is on)"
            aria-label="Reset GIS view"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </button>
          <IafViewerDBM {...viewerProps} />
        </div>
      </div>
    );
  }
}

IafViewerExGISProjectView.propTypes = {
  ...IafViewerExMapboxStandalone.propTypes
};

export default IafViewerExGISProjectView;
