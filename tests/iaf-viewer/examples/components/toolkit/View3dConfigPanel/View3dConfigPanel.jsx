import React from 'react';
import PropTypes from 'prop-types';
import View3dPropertiesConfig from '../View3dPropertiesConfig/View3dPropertiesConfig';
import './View3dConfigPanel.css';

const View3dConfigPanel = ({ view3d, onView3dChange, showAdvanced, onClose, className }) => {
  return (
    <div className={`view3d-config-panel ${className || ''}`}>
      <div className="view3d-config-panel-header">
        <h2>View3D Properties Configuration</h2>
        {onClose && (
          <button
            className="view3d-config-panel-close"
            onClick={onClose}
            aria-label="Close configuration panel"
          >
            ×
          </button>
        )}
      </div>
      <div className="view3d-config-panel-content">
        <View3dPropertiesConfig
          view3d={view3d}
          onView3dChange={onView3dChange}
        />
      </div>
    </div>
  );
};

View3dConfigPanel.propTypes = {
  view3d: PropTypes.shape({
    opacity: PropTypes.number,
    enable: PropTypes.bool
  }),
  onView3dChange: PropTypes.func,
  showAdvanced: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string
};

View3dConfigPanel.defaultProps = {
  showAdvanced: false,
};

export default View3dConfigPanel;

