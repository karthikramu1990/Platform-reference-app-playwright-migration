import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IafSession } from '@dtplatform/platform-api';

/**
 * Base class for all IafViewer example components
 * Provides common functionality like header height management, config panel toggling, server URI resolution,
 * event logging, model resolution, and common UI rendering helpers
 */
class IafViewerExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewerSettings: this._loadViewerSettingsFromStorage()
    };
  }

  _loadViewerSettingsFromStorage() {
    if (typeof localStorage !== 'undefined' && localStorage.iafviewer_settings) {
      try {
        return JSON.parse(localStorage.iafviewer_settings);
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  }

  componentDidMount() {
    this.updateHeaderHeight();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hideHeader !== this.props.hideHeader) {
      setTimeout(() => {
        this.updateHeaderHeight();
      }, 0);
    }
  }

  updateHeaderHeight = () => {
    const headerElement = this.headerRef;
    if (headerElement) {
      const headerHeight = headerElement.offsetHeight;
      const container = headerElement.parentElement;
      if (container) {
        container.style.setProperty('--header-height', `${headerHeight}px`);
      }
    }
  }

  handleConfigToggle = () => {
    const currentState = this.props.onConfigToggle
      ? (this.props.showConfigPanel ?? false)
      : this.state.showConfigPanel;
    const newState = !currentState;
    
    if (!this.props.onConfigToggle) {
      this.setState({ showConfigPanel: newState });
    }
    
    if (this.props.onConfigToggle) {
      this.props.onConfigToggle(newState);
    }
  }

  getActiveServerUri = () => {
    return this.props.serverUri || 
           (IafSession?.getConfig?.()?.graphicsServiceOrigin) ||
           null;
  }

  /**
   * Add an event to the event log (if event logging is enabled)
   * @param {Object} event - Event object to log
   */
  addEventLog = (event) => {
    if (!this.state.enableEventLog) {
      return;
    }
    this.setState(prevState => ({
      eventLogs: [...prevState.eventLogs, {
        ...event,
        timestamp: Date.now()
      }]
    }));
  }

  /**
   * Get the resolved showConfigPanel value (handles both controlled and uncontrolled components)
   * @returns {boolean} Whether the config panel should be shown
   */
  getShowConfigPanel = () => {
    return this.props.onConfigToggle
      ? (this.props.showConfigPanel ?? false)
      : this.state.showConfigPanel;
  }

  /**
   * Resolve the model from props (selectedItems or direct model prop)
   * @returns {Object|null} The resolved model object or null
   */
  getModel = () => {
    return this.props.selectedItems?.selectedModel || this.props.model || null;
  }

  /**
   * Common viewer props (settings + saveSettings) for IafViewerDBM.
   * Spread into viewerProps so Cache Settings in the Settings panel can persist (e.g. isSingleChannelMode).
   * @returns {{ settings: Object|undefined, saveSettings: Function }}
   */
  getViewerCommonProps = () => ({
    settings: this.state.viewerSettings,
    saveSettings: this.saveSettingsCallback
  })

  /**
   * Callback to save viewer settings to localStorage and update state.
   * Pass to IafViewerDBM as saveSettings prop so Cache Settings button persists settings.
   */
  saveSettingsCallback = (settings) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.iafviewer_settings = JSON.stringify(settings);
    }
    this.setState({ viewerSettings: settings });
  }

  /**
   * Render the "No model" fallback message
   * @param {string} className - CSS class name for the container
   * @returns {JSX.Element} The "No model" fallback JSX
   */
  renderNoModelFallback = (className = 'example-viewer-no-model') => {
    return (
      <div className={className}>
        <p>No model selected. Please select a model from the Navigator to view this example.</p>
      </div>
    );
  }

  /**
   * Render the common header structure (Back button, View mode toggle, Title/Subtitle)
   * @param {Object} options - Header configuration options
   * @param {string} options.containerClassName - CSS class for the header container
   * @param {string} options.contentClassName - CSS class for the header content
   * @param {string} options.backButtonClassName - CSS class for the back button
   * @param {string} options.toggleClassName - CSS class for the view mode toggle container
   * @param {string} options.toggleButtonClassName - CSS class for the toggle buttons
   * @param {string} options.headerTextClassName - CSS class for the header text container
   * @param {string} options.subtitleClassName - CSS class for the subtitle (optional, defaults to headerTextClassName + '-subtitle')
   * @param {string} options.title - Header title
   * @param {string} options.subtitle - Header subtitle
   * @returns {JSX.Element} The header JSX
   */
  renderHeader = ({
    containerClassName,
    contentClassName,
    backButtonClassName,
    toggleClassName,
    toggleButtonClassName,
    headerTextClassName,
    subtitleClassName,
    title,
    subtitle
  }) => {
    if (this.props.hideHeader) {
      return null;
    }

    const finalSubtitleClassName = subtitleClassName || `${headerTextClassName}-subtitle`;

    return (
      <div className={containerClassName} ref={(el) => { this.headerRef = el; }}>
        <div className={contentClassName}>
          <button 
            className={backButtonClassName}
            onClick={() => {
              if (this.props.onBackToList) {
                this.props.onBackToList();
              } else if (this.props.history) {
                this.props.history.push('/navigator?examplesView=true');
              } else {
                window.location.hash = '/navigator?examplesView=true';
              }
            }}
          >
            ← Back to Examples
          </button>
          {this.props.onViewModeToggle && (
            <div className={toggleClassName}>
              <button 
                className={`${toggleButtonClassName} ${this.props.viewMode === 'demo' ? 'active' : ''}`}
                onClick={() => this.props.onViewModeToggle('demo')}
              >
                Demo
              </button>
              <button 
                className={`${toggleButtonClassName} ${this.props.viewMode === 'code' ? 'active' : ''}`}
                onClick={() => this.props.onViewModeToggle('code')}
              >
                Code
              </button>
            </div>
          )}
          <div className={headerTextClassName}>
            <h1>{title}</h1>
            {subtitle && <p className={finalSubtitleClassName}>{subtitle}</p>}
          </div>
        </div>
      </div>
    );
  }
}

IafViewerExample.propTypes = {
  hideHeader: PropTypes.bool,
  showConfigPanel: PropTypes.bool,
  onConfigToggle: PropTypes.func,
  serverUri: PropTypes.string,
  selectedItems: PropTypes.object,
  model: PropTypes.object,
  history: PropTypes.object,
  onBackToList: PropTypes.func,
  viewMode: PropTypes.string,
  onViewModeToggle: PropTypes.func
};

export default IafViewerExample;

