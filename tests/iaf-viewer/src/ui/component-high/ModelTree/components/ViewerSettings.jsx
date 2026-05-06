import React, { useState, useEffect } from 'react';

const ViewerSettings = ({ hwv }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    projectionMode: 0,
    framerate: 60,
    hiddenLineOpacity: 0.5,
    showBackfaces: false,
    showCappingGeometry: true,
    enableFaceLineSelection: true,
    selectSceneInvisible: false,
    orbitMode: false,
    // Effects settings
    ambientOcclusion: false,
    ambientOcclusionRadius: 1,
    antiAliasing: true,
    bloom: {
      enabled: false,
      intensity: 1,
      threshold: 0.5
    },
    silhouetteEnabled: false,
    reflectionEnabled: false,
    shadow: {
      enabled: false,
      interactive: false,
      blurSamples: 10
    }
  });

  useEffect(() => {
    if (hwv) {
      // Initialize settings from viewer
      // This would need to be implemented based on your viewer's API
    }
  }, [hwv]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Apply setting to viewer
    if (hwv) {
      // This would need to be implemented based on your viewer's API
    }
  };

  return (
    <div id="viewer-settings-dialog-container">
      <div id="viewer-settings-dialog" className="hoops-ui-window">
        {/* Header */}
        <div className="hoops-ui-window-header">
          <span 
            className={`tab ${activeTab === 'general' ? 'selected' : ''}`}
            onClick={() => handleTabChange('general')}
          >
            General
          </span>
          <span 
            className={`tab ${activeTab === 'walk' ? 'selected' : ''}`}
            onClick={() => handleTabChange('walk')}
          >
            Walk
          </span>
          <span 
            className={`tab ${activeTab === 'drawing' ? 'selected' : ''}`}
            onClick={() => handleTabChange('drawing')}
          >
            Drawing
          </span>
          <span 
            className={`tab ${activeTab === 'floorplan' ? 'selected' : ''}`}
            onClick={() => handleTabChange('floorplan')}
          >
            Floorplan
          </span>
        </div>

        {/* General Tab */}
        <div className={`hoops-ui-window-body ${activeTab === 'general' ? 'selected' : ''}`}>
          <div className="settings-group-header">General</div>
          <div className="settings-group settings-group-general">
            <div className="settings-block">
              <label>Projection Mode:</label>
              <select 
                value={settings.projectionMode}
                onChange={(e) => handleSettingChange('projectionMode', parseInt(e.target.value))}
                className="right-align"
              >
                <option value={0}>Orthographic</option>
                <option value={1}>Perspective</option>
              </select>
            </div>

            <div className="settings-block">
              <span className="framerate-text">Framerate (fps):</span>
              <input 
                type="number"
                min="0"
                value={settings.framerate}
                onChange={(e) => handleSettingChange('framerate', parseInt(e.target.value))}
                className="right-align"
              />
            </div>

            {/* Add more settings blocks as needed */}
          </div>

          {/* Effects Section */}
          <div className="settings-group-header">Effects</div>
          <div className="settings-group settings-group-general">
            <div className="settings-block">
              <span>Enable Ambient Occlusion:</span>
              <input 
                type="checkbox"
                checked={settings.ambientOcclusion}
                onChange={(e) => handleSettingChange('ambientOcclusion', e.target.checked)}
              />
              <input
                type="number"
                min="0"
                max="10"
                step=".01"
                value={settings.ambientOcclusionRadius}
                onChange={(e) => handleSettingChange('ambientOcclusionRadius', parseFloat(e.target.value))}
                className="right-align"
                disabled={!settings.ambientOcclusion}
              />
            </div>

            {/* Add more effects settings as needed */}
          </div>
        </div>

        {/* Footer */}
        <div className="hoops-ui-window-footer">
          <div className="version">
            Viewer Version: <span id="settings-viewer-version"></span>
            , Format Version: <span id="settings-format-version"></span>
          </div>
          <div className="hoops-ui-footer-buttons">
            <button id="viewer-settings-ok-button">Ok</button>
            <button id="viewer-settings-cancel-button">Cancel</button>
            <button id="viewer-settings-apply-button">Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerSettings; 