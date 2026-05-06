import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { loadCachedGisConfig, saveCachedGisConfig } from '../IafViewerExUtils.js';
import './GisPropertiesConfig.css';

class GisPropertiesConfig extends Component {
  constructor(props) {
    super(props);
    
    // Load cached GIS config (token) from localStorage if available
    const cachedConfig = loadCachedGisConfig();
    
    // Merge cached values with props config
    const baseConfig = props.gis || {};
    const initialGis = cachedConfig 
      ? { ...baseConfig, ...cachedConfig } // Merge cached token with existing config
      : baseConfig;
    
    this.state = {
      gis: {
        enable: initialGis.enable ?? true,
        token: initialGis.token ?? '',
        opacity: initialGis.opacity ?? 1.0,
        onIafMapReady: initialGis.onIafMapReady
        // Note: Layout properties (displayMode, elevationMode, showToolbar, alignment, order, margin) are NOT exposed
      }
    };
  }

  componentDidUpdate(prevProps) {
    // Only update state from props if props changed externally (not from our own onChange)
    if (prevProps.gis !== this.props.gis) {
      const prevGisStr = JSON.stringify(prevProps.gis);
      const currentGisStr = JSON.stringify(this.props.gis);
      const currentStateGisStr = JSON.stringify(this.state.gis);
      
      // Only reset if props actually changed externally
      if (prevGisStr !== currentGisStr && currentStateGisStr !== currentGisStr) {
        // Merge cached values with props config
        const cachedConfig = loadCachedGisConfig();
        const baseConfig = this.props.gis || {};
        const mergedGis = cachedConfig 
          ? { ...baseConfig, ...cachedConfig }
          : baseConfig;
        
        this.setState({
          gis: {
            enable: mergedGis.enable ?? true,
            token: mergedGis.token ?? '',
            opacity: mergedGis.opacity ?? 1.0,
            onIafMapReady: mergedGis.onIafMapReady
          }
        });
      }
    }
  }

  handleGisChange = (field, value) => {
    const updatedGis = {
      ...this.state.gis,
      [field]: value
    };
    
    this.setState({ gis: updatedGis });
    
    // Save to cache for token
    if (field === 'token') {
      saveCachedGisConfig({ token: value });
    }
    
    if (this.props.onGisChange) {
      this.props.onGisChange(updatedGis);
    }
  }

  render() {
    return (
      <div className="gis-properties-config">
        <div className="gis-properties-config-section">
          <h3>GIS Properties</h3>
          
          <div className="gis-properties-config-field">
            <label>
              Enable GIS
              <input
                type="checkbox"
                checked={this.state.gis.enable ?? true}
                onChange={(e) => this.handleGisChange('enable', e.target.checked)}
              />
            </label>
          </div>

          <div className="gis-properties-config-field">
            <label>
              Mapbox Token
              <textarea
                className="gis-properties-config-textarea"
                value={this.state.gis.token ?? ''}
                onChange={(e) => this.handleGisChange('token', e.target.value)}
                placeholder="Enter your Mapbox access token"
                rows={3}
              />
            </label>
          </div>

          <div className="gis-properties-config-field">
            <label>
              Opacity
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={this.state.gis.opacity ?? 1.0}
                onChange={(e) => this.handleGisChange('opacity', parseFloat(e.target.value))}
              />
            </label>
          </div>
        </div>

        {this.props.showAdvanced && (
          <div className="gis-properties-config-section">
            <h3>Callback Properties</h3>
            
            <div className="gis-properties-config-group">
              <label className="gis-properties-config-label">
                onIafMapReady
                {this.props.onIafMapReadyLog && (
                  <div className="gis-properties-config-demo-log">
                    <p className="gis-properties-config-demo-log-title">Callback Data:</p>
                    <textarea
                      value={JSON.stringify(this.props.onIafMapReadyLog, null, 2)}
                      readOnly
                      className="gis-properties-config-textarea gis-properties-config-demo-log-textarea"
                      rows="8"
                    />
                  </div>
                )}
              </label>
            </div>

            <div className="gis-properties-config-group">
              <label className="gis-properties-config-label">
                onFederatedModeChanged
                {this.props.onFederatedModeChangedLog && (
                  <div className="gis-properties-config-demo-log">
                    <p className="gis-properties-config-demo-log-title">Callback Data:</p>
                    <textarea
                      value={JSON.stringify(this.props.onFederatedModeChangedLog, null, 2)}
                      readOnly
                      className="gis-properties-config-textarea gis-properties-config-demo-log-textarea"
                      rows="8"
                    />
                  </div>
                )}
              </label>
            </div>

            <div className="gis-properties-config-group">
              <label className="gis-properties-config-label">
                onReferenceModelChanged
                {this.props.onReferenceModelChangedLog && (
                  <div className="gis-properties-config-demo-log">
                    <p className="gis-properties-config-demo-log-title">Callback Data:</p>
                    <textarea
                      value={JSON.stringify(this.props.onReferenceModelChangedLog, null, 2)}
                      readOnly
                      className="gis-properties-config-textarea gis-properties-config-demo-log-textarea"
                      rows="8"
                    />
                  </div>
                )}
              </label>
            </div>

            <div className="gis-properties-config-group">
              <label className="gis-properties-config-label">
                onElevationModeChanged
                {this.props.onElevationModeChangedLog && (
                  <div className="gis-properties-config-demo-log">
                    <p className="gis-properties-config-demo-log-title">Callback Data:</p>
                    <textarea
                      value={JSON.stringify(this.props.onElevationModeChangedLog, null, 2)}
                      readOnly
                      className="gis-properties-config-textarea gis-properties-config-demo-log-textarea"
                      rows="8"
                    />
                  </div>
                )}
              </label>
            </div>

            <div className="gis-properties-config-group">
              <label className="gis-properties-config-label">
                onModelSelect
                {this.props.onModelSelectLog && (
                  <div className="gis-properties-config-demo-log">
                    <p className="gis-properties-config-demo-log-title">Callback Data:</p>
                    <textarea
                      value={JSON.stringify(this.props.onModelSelectLog, null, 2)}
                      readOnly
                      className="gis-properties-config-textarea gis-properties-config-demo-log-textarea"
                      rows="8"
                    />
                  </div>
                )}
              </label>
            </div>
          </div>
        )}
      </div>
    );
  }
}

GisPropertiesConfig.propTypes = {
  gis: PropTypes.object,
  onGisChange: PropTypes.func,
  showAdvanced: PropTypes.bool,
  onIafMapReadyLog: PropTypes.object,
  onFederatedModeChangedLog: PropTypes.object,
  onReferenceModelChangedLog: PropTypes.object,
  onElevationModeChangedLog: PropTypes.object,
  onModelSelectLog: PropTypes.object
};

export default GisPropertiesConfig;

