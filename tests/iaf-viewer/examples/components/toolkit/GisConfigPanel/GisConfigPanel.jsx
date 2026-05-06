import React from 'react';
import PropTypes from 'prop-types';
import GisPropertiesConfig from '../GisPropertiesConfig/GisPropertiesConfig';
import './GisConfigPanel.css';

const GisConfigPanel = ({ gis, onGisChange, showAdvanced, onClose, className, eventLogs, enableEventLog, onEnableEventLogChange, mapInstance, onIafMapReadyLog, onFederatedModeChangedLog, onReferenceModelChangedLog, onElevationModeChangedLog, onModelSelectLog }) => {
  return (
    <div className={`gis-config-panel ${className || ''}`}>
      <div className="gis-config-panel-header">
        <h2>GIS Properties Configuration</h2>
        {onClose && (
          <button
            className="gis-config-panel-close"
            onClick={onClose}
            aria-label="Close configuration panel"
          >
            ×
          </button>
        )}
      </div>
      <div className="gis-config-panel-content">
        <GisPropertiesConfig
          gis={gis}
          onGisChange={onGisChange}
          showAdvanced={showAdvanced}
          onIafMapReadyLog={onIafMapReadyLog}
          onFederatedModeChangedLog={onFederatedModeChangedLog}
          onReferenceModelChangedLog={onReferenceModelChangedLog}
          onElevationModeChangedLog={onElevationModeChangedLog}
          onModelSelectLog={onModelSelectLog}
        />
      </div>
    </div>
  );
};

GisConfigPanel.propTypes = {
  gis: PropTypes.shape({
    enable: PropTypes.bool,
    token: PropTypes.string,
    opacity: PropTypes.number,
    onIafMapReady: PropTypes.func
  }),
  onGisChange: PropTypes.func,
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
  mapInstance: PropTypes.object,
  onIafMapReadyLog: PropTypes.object,
  onFederatedModeChangedLog: PropTypes.object,
  onReferenceModelChangedLog: PropTypes.object,
  onElevationModeChangedLog: PropTypes.object,
  onModelSelectLog: PropTypes.object
};

GisConfigPanel.defaultProps = {
  showAdvanced: false,
};

export default GisConfigPanel;

