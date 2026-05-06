import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IafEvmUtils } from '@dtplatform/iaf-viewer';
import { getSampleUeProps, normalizeToJSON, getSampleUeCommandString, getSampleUeZoomElementsString, getSampleUeConfigString, formatEventLogs, loadCachedUeConfig, saveCachedUeConfig } from '../IafViewerExUtils.js';
import './UePropertiesConfig.css';

const DISPLAY_MODE_OPTIONS = [
  { value: IafEvmUtils.EVMDisplayMode.DEFAULT, label: 'Default' },
  { value: IafEvmUtils.EVMDisplayMode.SPLIT, label: 'Split' },
  { value: IafEvmUtils.EVMDisplayMode.FULLSCREEN, label: 'Fullscreen' },
  { value: IafEvmUtils.EVMDisplayMode.FIXED, label: 'Fixed' }
];

const ALIGNMENT_OPTIONS = [
  { value: IafEvmUtils.EVMWidgetAlignment.LEFT_TOP, label: 'Left Top' },
  { value: IafEvmUtils.EVMWidgetAlignment.LEFT_BOTTOM, label: 'Left Bottom' },
  { value: IafEvmUtils.EVMWidgetAlignment.RIGHT_TOP, label: 'Right Top' },
  { value: IafEvmUtils.EVMWidgetAlignment.RIGHT_BOTTOM, label: 'Right Bottom' }
];

class UePropertiesConfig extends Component {
  constructor(props) {
    super(props);
    const sampleUe = getSampleUeProps(props.ue);
    
    // Load cached server and app from localStorage if available
    const cachedConfig = loadCachedUeConfig();
    
    // Merge cached values with props config or sample config
    const baseConfig = props.ue?.config || sampleUe.config || {};
    const initialConfig = cachedConfig 
      ? { ...baseConfig, ...cachedConfig } // Merge cached server/app with existing config
      : baseConfig;
    
    this.state = {
      ue: {
        ...sampleUe,
        config: initialConfig
      },
      // Track raw input values for JSON fields to allow free typing
      // Use samples if props don't provide values
      // For raw values, show uuid() calls in the sample strings
      rawZoomElements: props.ue?.zoomElements 
        ? JSON.stringify(props.ue.zoomElements, null, 2)
        : getSampleUeZoomElementsString(),
      rawCommand: props.ue?.command 
        ? JSON.stringify(props.ue.command, null, 2)
        : getSampleUeCommandString(),
      rawConfig: JSON.stringify(initialConfig, null, 2)
    };
  }


  componentDidUpdate(prevProps) {
    // Only update state from props if props changed externally (not from our own onChange)
    // Check if the actual values changed, not just reference equality
    if (prevProps.ue !== this.props.ue) {
      const prevUeStr = JSON.stringify(prevProps.ue);
      const currentUeStr = JSON.stringify(this.props.ue);
      
      // Only reset if props actually changed externally (different values)
      // Also check if our current state matches the new props to avoid unnecessary resets
      const currentStateStr = JSON.stringify(this.state.ue);
      if (prevUeStr !== currentUeStr && currentStateStr !== currentUeStr) {
        const sampleUe = getSampleUeProps(this.props.ue);
        
        // Merge cached values with props config
        const cachedConfig = loadCachedUeConfig();
        const baseConfig = this.props.ue?.config || sampleUe.config || {};
        const mergedConfig = cachedConfig 
          ? { ...baseConfig, ...cachedConfig } // Merge cached server/app with existing config
          : baseConfig;
        
        this.setState({
          ue: {
            ...sampleUe,
            config: mergedConfig
          },
          rawZoomElements: this.props.ue?.zoomElements 
            ? JSON.stringify(this.props.ue.zoomElements, null, 2)
            : getSampleUeZoomElementsString(),
          rawCommand: this.props.ue?.command 
            ? JSON.stringify(this.props.ue.command, null, 2)
            : getSampleUeCommandString(),
          rawConfig: JSON.stringify(mergedConfig, null, 2)
        });
      }
    }
  }

  handleChange = (field, value) => {
    const updatedUe = {
      ...this.state.ue,
      [field]: value
    };
    
    this.setState({ ue: updatedUe });
    
    if (this.props.onChange) {
      this.props.onChange(updatedUe);
    }
  }

  handleArrayChange = (field, value) => {
    const rawField = `raw${field.charAt(0).toUpperCase() + field.slice(1)}`;
    
    // Try to parse and update both raw and parsed values together
    try {
      let jsonValue = value.trim();
      
      if (jsonValue) {
        // Try to normalize JavaScript-like syntax to JSON
        const normalized = normalizeToJSON(jsonValue);
        
        // Try parsing the normalized value - keep as-is (object or array)
        const parsed = JSON.parse(normalized);
        
        // Valid JSON - update both raw value and parsed value in one setState
        // Send value as-is (object or array)
        const updatedUe = {
          ...this.state.ue,
          [field]: parsed
        };
        this.setState({ 
          [rawField]: value, // Keep original input for display
          ue: updatedUe
        }, () => {
          // Call onChange after state is updated with the new value
          if (this.props.onChange) {
            this.props.onChange(updatedUe);
          }
        });
      } else {
        // Empty value - set to empty array (default for these fields)
        const updatedUe = {
          ...this.state.ue,
          [field]: []
        };
        this.setState({ 
          [rawField]: value,
          ue: updatedUe
        }, () => {
          if (this.props.onChange) {
            this.props.onChange(updatedUe);
          }
        });
      }
    } catch (e) {
      // Invalid JSON while typing - just update raw value to allow free typing
      this.setState({ [rawField]: value });
    }
  }

  handleConfigChange = (value) => {
    this.setState({ rawConfig: value });
    
    // Try to parse and update both raw and parsed values together
    try {
      let jsonValue = value.trim();
      
      if (jsonValue) {
        // Try to normalize JavaScript-like syntax to JSON
        const normalized = normalizeToJSON(jsonValue);
        
        // Try parsing the normalized value
        const parsed = JSON.parse(normalized);
        
        // Cache server and app values in localStorage if they exist
        if (parsed && typeof parsed === 'object') {
          saveCachedUeConfig(parsed);
        }
        
        // Valid JSON - update both raw value and parsed value in one setState
        const updatedUe = {
          ...this.state.ue,
          config: parsed
        };
        this.setState({ 
          rawConfig: value, // Keep original input for display
          ue: updatedUe
        }, () => {
          // Call onChange after state is updated with the new value
          if (this.props.onChange) {
            this.props.onChange(updatedUe);
          }
        });
      } else {
        // Empty value - set to empty object (default for config field)
        const updatedUe = {
          ...this.state.ue,
          config: {}
        };
        this.setState({ 
          rawConfig: value,
          ue: updatedUe
        }, () => {
          if (this.props.onChange) {
            this.props.onChange(updatedUe);
          }
        });
      }
    } catch (e) {
      // Invalid JSON while typing - just update raw value to allow free typing
      // Don't update ue state until valid JSON is entered
    }
  }

  handleSendCommandDemo = () => {
    const { sendCommand } = this.props;
    if (sendCommand && typeof sendCommand === 'function') {
      // Demo: Send a zoom command using sendCommand callback
      const demoCommand = {
        commandName: 'zoom_to',
        commandRef: `demo-${Date.now()}`,
        params: {
          elementId: '210671540_0'
        }
      };
      console.log('[UePropertiesConfig] Demo: Sending command via sendCommand callback:', demoCommand);
      sendCommand(demoCommand);
    } else {
      console.warn('[UePropertiesConfig] sendCommand not available - viewer may not be ready yet');
    }
  }

  render() {
    const { ue } = this.state;
    const { className, showAdvanced, sendCommand } = this.props;

    return (
      <div className={`ue-properties-config ${className || ''}`}>
        <div className="ue-properties-config-section">
          {!this.props.hideTitle && (
            <h3 className="ue-properties-config-title">UE Properties Configuration</h3>
          )}
          
          <div className="ue-properties-config-group">
            <label className="ue-properties-config-label">
              <input
                type="checkbox"
                checked={ue.enable}
                onChange={(e) => this.handleChange('enable', e.target.checked)}
                className="ue-properties-config-checkbox"
              />
              <span>Enable UE Viewer</span>
            </label>
          </div>

          <div className="ue-properties-config-group">
            <label className="ue-properties-config-label">
              Display Mode
              <select
                value={ue.displayMode}
                onChange={(e) => this.handleChange('displayMode', e.target.value)}
                className="ue-properties-config-select"
              >
                {DISPLAY_MODE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="ue-properties-config-group">
            <label className="ue-properties-config-label">
              <input
                type="checkbox"
                checked={ue.showToolbar}
                onChange={(e) => this.handleChange('showToolbar', e.target.checked)}
                className="ue-properties-config-checkbox"
              />
              <span>Show Toolbar</span>
            </label>
          </div>

          <div className="ue-properties-config-group">
            <label className="ue-properties-config-label">
              Alignment
              <select
                value={ue.alignment}
                onChange={(e) => this.handleChange('alignment', e.target.value)}
                className="ue-properties-config-select"
              >
                {ALIGNMENT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="ue-properties-config-row">
            <div className="ue-properties-config-group">
              <label className="ue-properties-config-label">
                Order
                <input
                  type="number"
                  value={ue.order}
                  onChange={(e) => this.handleChange('order', parseInt(e.target.value, 10) || 0)}
                  className="ue-properties-config-input"
                  min="0"
                />
              </label>
            </div>

            <div className="ue-properties-config-group">
              <label className="ue-properties-config-label">
                Margin
                <input
                  type="number"
                  value={ue.margin}
                  onChange={(e) => this.handleChange('margin', parseInt(e.target.value, 10) || 0)}
                  className="ue-properties-config-input"
                  min="0"
                />
              </label>
            </div>
          </div>

          {showAdvanced && (
            <>
              <div className="ue-properties-config-group">
                <label className="ue-properties-config-label">
                  Config (JSON Object)
                  <textarea
                    value={this.state.rawConfig}
                    onChange={(e) => this.handleConfigChange(e.target.value)}
                    className="ue-properties-config-textarea"
                    rows="4"
                  />
                </label>
              </div>

              <div className="ue-properties-config-group">
                <label className="ue-properties-config-label">
                  Zoom Elements (JSON Object or Array)
                  <textarea
                    value={this.state.rawZoomElements}
                    onChange={(e) => this.handleArrayChange('zoomElements', e.target.value)}
                    className="ue-properties-config-textarea"
                    rows="3"
                  />
                </label>
              </div>

              <div className="ue-properties-config-row">
                <div className="ue-properties-config-group">
                  <label className="ue-properties-config-label">
                    Command (JSON Object or Array)
                    <textarea
                      value={this.state.rawCommand}
                      onChange={(e) => this.handleArrayChange('command', e.target.value)}
                      className="ue-properties-config-textarea"
                      rows="3"
                    />
                  </label>
                </div>

                <div className="ue-properties-config-group">
                  <label className="ue-properties-config-label">
                    sendCommand Demo
                    <div className="ue-properties-config-demo-box">
                      <p className="ue-properties-config-demo-description">
                        Demonstrates usage of sendCommand callback received from onUeReady
                      </p>
                      <button
                        type="button"
                        onClick={this.handleSendCommandDemo}
                        className="ue-properties-config-demo-button"
                        disabled={!sendCommand}
                        title={sendCommand ? "Send zoom command via sendCommand callback" : "sendCommand not available - viewer may not be ready"}
                      >
                        Send Zoom Command
                      </button>
                      {!sendCommand && (
                        <span className="ue-properties-config-demo-hint">
                          (Waiting for viewer to be ready...)
                        </span>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="ue-properties-config-group">
                <label className="ue-properties-config-label">
                  Event Handler
                  <span className="ue-properties-config-info">
                    {ue.eventHandler ? 'Function provided' : 'No handler'}
                  </span>
                </label>
              </div>
            </>
          )}

          {/* Event Log Display */}
          <div className="ue-properties-config-group ue-properties-config-event-log">
            <label className="ue-properties-config-label">
              <label className="ue-properties-config-title-checkbox">
                <input
                  type="checkbox"
                  checked={this.props.enableEventLog || false}
                  onChange={(e) => {
                    if (this.props.onEnableEventLogChange) {
                      this.props.onEnableEventLogChange(e.target.checked);
                    }
                  }}
                />
                <span>Event Log</span>
              </label>
              <span className="ue-properties-config-info">
                Events received from UE viewer callbacks (disabled by default to improve performance)
              </span>
              <textarea
                value={(() => {
                  try {
                    if (!this.props.eventLogs) return '';
                    // Limit the number of events to prevent performance issues
                    const maxEvents = 100;
                    const eventLogs = Array.isArray(this.props.eventLogs) 
                      ? this.props.eventLogs.slice(-maxEvents) // Take only the most recent events
                      : this.props.eventLogs;
                    return formatEventLogs(eventLogs) || '';
                  } catch (e) {
                    console.error('[UePropertiesConfig] Error formatting event logs:', e);
                    return `[Error formatting event logs: ${e.message}]`;
                  }
                })()}
                readOnly
                className="ue-properties-config-textarea ue-properties-config-event-log-textarea"
                rows="8"
                placeholder="Events will appear here as they are received..."
              />
            </label>
          </div>
        </div>
      </div>
    );
  }

}

UePropertiesConfig.propTypes = {
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
  className: PropTypes.string,
  showAdvanced: PropTypes.bool,
  hideTitle: PropTypes.bool,
  eventLogs: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.object
  ]),
  enableEventLog: PropTypes.bool,
  onEnableEventLogChange: PropTypes.func,
  sendCommand: PropTypes.func,
};

UePropertiesConfig.defaultProps = {
  showAdvanced: false,
};

export default UePropertiesConfig;

