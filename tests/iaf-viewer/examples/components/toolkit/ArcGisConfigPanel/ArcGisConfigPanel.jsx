import React from 'react';
import PropTypes from 'prop-types';
import ArcGisPropertiesConfig from '../ArcGisPropertiesConfig/ArcGisPropertiesConfig';
import './ArcGisConfigPanel.css';

const ArcGisConfigPanel = ({ arcgis, onChange, showAdvanced, onClose, className, eventLogs, enableEventLog, onEnableEventLogChange, mapInstance, onIafMapReadyLog }) => {
  return (
    <div className={`arcgis-config-panel ${className || ''}`}>
      <div className="arcgis-config-panel-header">
        <h2>ArcGIS Properties Configuration</h2>
        {onClose && (
          <button
            className="arcgis-config-panel-close"
            onClick={onClose}
            aria-label="Close configuration panel"
          >
            ×
          </button>
        )}
      </div>
      <div className="arcgis-config-panel-content">
        <ArcGisPropertiesConfig
          arcgis={arcgis}
          onChange={onChange}
          showAdvanced={showAdvanced}
          hideTitle={true}
          eventLogs={eventLogs}
          enableEventLog={enableEventLog}
          onEnableEventLogChange={onEnableEventLogChange}
          mapInstance={mapInstance}
          onIafMapReadyLog={onIafMapReadyLog}
        />
      </div>
    </div>
  );
};

ArcGisConfigPanel.propTypes = {
  arcgis: PropTypes.shape({
    enable: PropTypes.bool,
    config: PropTypes.object,
    slicedElements: PropTypes.array,
    themeElements: PropTypes.array,
    graphics: PropTypes.array,
    zoomElements: PropTypes.array,
    camera: PropTypes.object,
    command: PropTypes.array,
    eventHandler: PropTypes.func,
    onIafMapReady: PropTypes.func,
    displayMode: PropTypes.string,
    showToolbar: PropTypes.bool,
    alignment: PropTypes.string,
    order: PropTypes.number,
    margin: PropTypes.number,
  }),
  onChange: PropTypes.func,
  showAdvanced: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
  eventLogs: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.object
  ]),
  enableEventLog: PropTypes.bool,
  onEnableEventLogChange: PropTypes.func,
  mapInstance: PropTypes.shape({
    scene: PropTypes.object,
    sceneView: PropTypes.object,
    camera: PropTypes.object,
    labelsLayer: PropTypes.object,
    labelPoints: PropTypes.object,
    focusSelector: PropTypes.string,
    ready: PropTypes.bool,
    error: PropTypes.string
  }),
  onIafMapReadyLog: PropTypes.object,
};

ArcGisConfigPanel.defaultProps = {
  showAdvanced: false,
};

export default ArcGisConfigPanel;

