import React from 'react';
import PropTypes from 'prop-types';
import UePropertiesConfig from '../UePropertiesConfig/UePropertiesConfig';
import './UeConfigPanel.css';

const UeConfigPanel = ({ ue, onChange, showAdvanced, onClose, className, eventLogs, enableEventLog, onEnableEventLogChange, sendCommand }) => {
  return (
    <div className={`ue-config-panel ${className || ''}`}>
      <div className="ue-config-panel-header">
        <h2>UE Properties Configuration</h2>
        {onClose && (
          <button
            className="ue-config-panel-close"
            onClick={onClose}
            aria-label="Close configuration panel"
          >
            ×
          </button>
        )}
      </div>
      <div className="ue-config-panel-content">
        <UePropertiesConfig
          ue={ue}
          onChange={onChange}
          showAdvanced={showAdvanced}
          hideTitle={true}
          eventLogs={eventLogs}
          enableEventLog={enableEventLog}
          onEnableEventLogChange={onEnableEventLogChange}
          sendCommand={sendCommand}
        />
      </div>
    </div>
  );
};

UeConfigPanel.propTypes = {
  ue: PropTypes.shape({
    enable: PropTypes.bool,
    config: PropTypes.object,
    zoomElements: PropTypes.array,
    command: PropTypes.array,
    eventHandler: PropTypes.func,
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
  sendCommand: PropTypes.func,
};

UeConfigPanel.defaultProps = {
  showAdvanced: false,
};

export default UeConfigPanel;

