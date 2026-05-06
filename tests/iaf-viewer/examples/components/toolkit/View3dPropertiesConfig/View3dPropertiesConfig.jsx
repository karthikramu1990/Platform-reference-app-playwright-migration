import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './View3dPropertiesConfig.css';

class View3dPropertiesConfig extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      view3d: {
        opacity: props.view3d?.opacity ?? 1.0,
        enable: props.view3d?.enable ?? true
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.view3d !== this.props.view3d) {
      const prevView3dStr = JSON.stringify(prevProps.view3d);
      const currentView3dStr = JSON.stringify(this.props.view3d);
      const currentStateView3dStr = JSON.stringify(this.state.view3d);
      
      if (prevView3dStr !== currentView3dStr && currentStateView3dStr !== currentView3dStr) {
        this.setState({
          view3d: {
            opacity: this.props.view3d?.opacity ?? 1.0,
            enable: this.props.view3d?.enable ?? true
          }
        });
      }
    }
  }

  handleView3dChange = (field, value) => {
    const updatedView3d = {
      ...this.state.view3d,
      [field]: value
    };
    
    this.setState({ view3d: updatedView3d });
    
    if (this.props.onView3dChange) {
      this.props.onView3dChange(updatedView3d);
    }
  }

  render() {
    return (
      <div className="view3d-properties-config">
        <div className="view3d-properties-config-section">
          <h3>View3D Properties</h3>
          
          <div className="view3d-properties-config-field">
            <label>
              Enable View3D
              <input
                type="checkbox"
                checked={this.state.view3d.enable ?? true}
                onChange={(e) => this.handleView3dChange('enable', e.target.checked)}
              />
            </label>
          </div>

          <div className="view3d-properties-config-field">
            <label>
              Opacity
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={this.state.view3d.opacity ?? 1.0}
                onChange={(e) => this.handleView3dChange('opacity', parseFloat(e.target.value))}
              />
            </label>
          </div>
        </div>
      </div>
    );
  }
}

View3dPropertiesConfig.propTypes = {
  view3d: PropTypes.object,
  onView3dChange: PropTypes.func
};

export default View3dPropertiesConfig;

