import React from 'react';
import PropTypes from 'prop-types';
import { IafViewerDBM, IafEvmUtils } from '@dtplatform/iaf-viewer';
import { UE_CONFIG } from './config';
import UeConfigPanel from '../toolkit/UeConfigPanel/UeConfigPanel';
import IafViewerExample from '../IafViewerExample/IafViewerExample';
import './IafViewerExUeStandaloneViewer.css';
import { getSampleUeCommand, getSampleUeZoomElements, loadCachedUeConfig } from '../toolkit/IafViewerExUtils';

class IafViewerExUeStandaloneViewer extends IafViewerExample {
  constructor(props) {
    super(props);
    
    // Load cached UE config (server and app) from localStorage
    const cachedConfig = loadCachedUeConfig();
    
    // Merge cached values with default config
    const initialConfig = cachedConfig 
      ? { ...UE_CONFIG, ...cachedConfig } // Merge cached server/app with existing config
      : UE_CONFIG;
    
    this.state = {
      ...this.state,
      ue: {
        enable: true,
        config: initialConfig,
              zoomElements: getSampleUeZoomElements(),
              command: getSampleUeCommand(),
        eventHandler: this.handleUeEvent.bind(this),
        onUeReady: this.handleUeReady.bind(this),
        displayMode: IafEvmUtils.EVMDisplayMode.FULLSCREEN,
        showToolbar: true,
        alignment: IafEvmUtils.EVMWidgetAlignment.RIGHT_BOTTOM,
        order: 7,
        margin: 0
      },
      view3d: {
        enable: false
      },
      view2d: {
        enable: false
      },
      gis: {
        enable: false
      },
      showConfigPanel: props.showConfigPanel ?? false,
      eventLogs: [], // Array to store events for display in config panel
      enableEventLog: false, // Event logging disabled by default as it slows down the app
      sendCommand: null // Will be set when viewer is ready
    };
  }

  handleUeEvent(ev) {
    const eventName = ev?.eventName?.toLowerCase();
    
    // Add event to log
    this.addEventLog({
      type: 'eventHandler',
      eventName: ev?.eventName,
      payload: ev?.payload,
      fullEvent: ev
    });
    
    switch (eventName) {
      case IafEvmUtils.EVM_EVENTS.SELECTION_UPDATE:
        console.log('[UE Standalone Viewer] Element selected:', ev.payload);
        break;
        
      case IafEvmUtils.EVM_EVENTS.CAMERA_UPDATE:
        console.log('[UE Standalone Viewer] Camera updated:', ev.payload);
        break;
        
      case IafEvmUtils.EVM_EVENTS.COMMAND_RECEIVED:
        console.log('[UE Standalone Viewer] Command received:', ev.payload);
        break;
        
      default:
        console.log('[UE Standalone Viewer] UE Event:', ev);
    }
  }

  handleUeReady({ iframe, containerId, config, sendCommand, focusSelector, viewerReady, error }) {
    // Add ready event to log
    this.addEventLog({
      type: 'onUeReady',
      viewerReady,
      error,
      info: {
        iframe: iframe ? 'available' : 'null',
        containerId,
        config,
        sendCommand: typeof sendCommand === 'function' ? 'available' : 'null',
        focusSelector
      }
    });

    console.log('[UE Standalone Viewer] UE Viewer is ready!', {
      iframe,
      containerId,
      config,
      sendCommand: typeof sendCommand === 'function' ? 'available' : 'not available',
      focusSelector,
      viewerReady
    });

    // Store references for potential use
    this.ueViewerRef = {
      iframe,
      containerId,
      config,
      sendCommand,
      focusSelector
    };
    
    // Update state to trigger re-render so sendCommand prop is available in UeConfigPanel
    this.setState({ sendCommand });

    // Example: Send an initial command when viewer is ready
    // This demonstrates how to use the sendCommand method
    if (sendCommand && typeof sendCommand === 'function') {
      console.log('[UE Standalone Viewer] UE Viewer ready - sendCommand method is available');
      // You can send initial commands here if needed
      // Example: sendCommand({ commandName: 'zoom_to', params: { elementId: '123' } });
    }

    // Example: Focus the viewer programmatically
    if (focusSelector) {
      const focusElement = document.querySelector(focusSelector);
      if (focusElement) {
        console.log('[UE Standalone Viewer] UE Viewer ready - focus selector available:', focusSelector);
        // Uncomment to auto-focus when ready:
        // focusElement.focus();
      }
    }
  }


  handleUePropertiesChange = (updatedUe) => {
    const ueWithHandler = {
      ...updatedUe,
      eventHandler: updatedUe.eventHandler ?? this.state.ue.eventHandler,
      onUeReady: updatedUe.onUeReady ?? this.state.ue.onUeReady
    };
    this.setState({ ue: ueWithHandler });
    if (this.props.onUePropertiesChange) {
      this.props.onUePropertiesChange(ueWithHandler);
    }
  }

  render() {
    const model = this.getModel();
    
    const viewerProps = {
      ...this.getViewerCommonProps(),
      ue: this.state.ue,
      view3d: this.state.view3d,
      view2d: this.state.view2d,
      gis: this.state.gis,
      enablePersistence: true,
    };

    const showConfigPanel = this.getShowConfigPanel();
    const handleUePropertiesChange = this.props.onUePropertiesChange ?? this.handleUePropertiesChange;
    const handleConfigToggle = this.props.onConfigToggle ?? this.handleConfigToggle;

    return (
      <div className="example-ue-viewer-container">
        {this.renderHeader({
          containerClassName: 'example-ue-viewer-header',
          contentClassName: 'example-ue-viewer-header-content',
          backButtonClassName: 'example-ue-viewer-back-button',
          toggleClassName: 'example-ue-viewer-toggle',
          toggleButtonClassName: 'example-ue-viewer-toggle-button',
          headerTextClassName: 'example-ue-viewer-header-text',
          subtitleClassName: 'example-ue-viewer-subtitle',
          title: 'Standalone UE Viewer',
          subtitle: 'Minimal implementation with only UE rendering. No ArcGIS, ArcGIS Overview, or Photosphere.'
        })}
        {/* Config panel overlay - always visible when showConfigPanel is true */}
        {showConfigPanel && (
          <div className="example-ue-viewer-config-overlay" data-testid="ue-config-panel-container">
            <UeConfigPanel
              ue={this.state.ue}
              onChange={handleUePropertiesChange}
              showAdvanced={true}
              onClose={handleConfigToggle}
              eventLogs={this.state.enableEventLog ? this.state.eventLogs : []}
              enableEventLog={this.state.enableEventLog}
              onEnableEventLogChange={(enabled) => this.setState({ enableEventLog: enabled })}
              sendCommand={this.state.sendCommand}
            />
          </div>
        )}
        <div className="example-ue-viewer-content">
          {model ? (
            <IafViewerDBM {...viewerProps} />
          ) : (
            this.renderNoModelFallback('example-ue-viewer-no-model')
          )}
        </div>
      </div>
    );
  }
}

IafViewerExUeStandaloneViewer.propTypes = {
  ...IafViewerExample.propTypes,
  onUePropertiesChange: PropTypes.func
};

export default IafViewerExUeStandaloneViewer;

