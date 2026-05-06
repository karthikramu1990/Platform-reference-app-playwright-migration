import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IafSession } from '@dtplatform/platform-api';
import './IafViewerExamplesView.css';
import IafViewerExUeStandaloneViewer from '../components/IafViewerExUeStandaloneViewer/IafViewerExUeStandaloneViewer';
import IafViewerExArcgisStandaloneViewer from '../components/IafViewerExArcgisStandaloneViewer/IafViewerExArcgisStandaloneViewer';
import IafViewerExMapboxStandalone from '../components/IafViewerExMapboxStandalone/IafViewerExMapboxStandalone';
import IafViewerExGeoReferencedView3d from '../components/IafViewerExGeoReferencedView3d/IafViewerExGeoReferencedView3d';
import { getDefaultExampleCategories } from './defaultExampleCategories';

class IafViewerExamplesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedExample: null,
      codeContent: null,
      codeLoading: false,
      showConfigPanel: false,
      showCodePanel: false, // Code panel overlay state
      expandedFiles: {}, // Track which files are expanded (collapsed by default)
      copiedFile: null // Track which file was just copied (for visual feedback)
    };
  }

  handleExampleClick = (example) => {
    // Don't handle clicks on disabled examples
    if (example.disabled) {
      return;
    }
    
    // If example has navigateTo, navigate to that URL instead of showing detail view
    if (example.navigateTo) {
      if (this.props.history) {
        this.props.history.push(example.navigateTo);
      } else {
        // Fallback to window.location for hash-based routing
        window.location.hash = example.navigateTo;
      }
      return;
    }
    this.setState({ selectedExample: example, expandedFiles: {}, showCodePanel: false });
  }

  handleBackToList = () => {
    this.setState({ 
      selectedExample: null, 
      codeContent: null, 
      showConfigPanel: false,
      showCodePanel: false,
      expandedFiles: {}
    });
  }

  handleConfigToggle = () => {
    this.setState(prevState => ({ showConfigPanel: !prevState.showConfigPanel }));
  }

  handleCodeToggle = () => {
    const { showCodePanel, codeContent, selectedExample } = this.state;
    const newShowCodePanel = !showCodePanel;
    
    // Load code if opening panel and code not loaded yet
    if (newShowCodePanel && !codeContent && selectedExample) {
      this.loadExampleCode();
    }
    
    this.setState({ showCodePanel: newShowCodePanel });
  }

  loadExampleCode = () => {
    const { selectedExample } = this.state;
    if (!selectedExample) {
      return;
    }

    this.setState({ codeLoading: true });
    
    // Use requestAnimationFrame to allow UI to update before processing
    requestAnimationFrame(() => {
      let codeContent = {};
      
      if (selectedExample.codeContent) {
        codeContent = selectedExample.codeContent;
      } else if (selectedExample.codeFiles) {
        selectedExample.codeFiles.forEach(file => {
          if (file.content) {
            codeContent[file.name] = file.content;
          }
        });
      }

      // Initialize all files as collapsed (expandedFiles: {})
      this.setState({ codeContent, codeLoading: false, expandedFiles: {} });
    });
  }

  renderCodePanel = () => {
    const { codeContent, codeLoading, selectedExample, expandedFiles, showCodePanel, copiedFile } = this.state;

    if (!showCodePanel) {
      return null;
    }

    return (
      <div className="examples-code-panel-overlay">
        <div className="examples-code-panel">
          <div className="examples-code-panel-header">
            <h2>Code View</h2>
            <button
              className="examples-code-panel-close"
              onClick={this.handleCodeToggle}
              aria-label="Close code panel"
            >
              ×
            </button>
          </div>
          <div className="examples-code-panel-content">
            {codeLoading ? (
              <div className="examples-code-loading">Loading code...</div>
            ) : codeContent && Object.keys(codeContent).length > 0 ? (
              Object.entries(codeContent).map(([fileName, content]) => {
                const isExpanded = expandedFiles[fileName] === true;
                const isCopied = copiedFile === fileName;
                return (
                  <div key={fileName} className="examples-code-file">
                    <div 
                      className="examples-code-file-header"
                      onClick={() => this.handleFileToggle(fileName)}
                    >
                      <span className="examples-code-file-toggle">
                        {isExpanded ? '▼' : '▶'}
                      </span>
                      <span className="examples-code-file-name">{fileName}</span>
                      {isExpanded && (
                        <button
                          className={`examples-code-copy-button ${isCopied ? 'copied' : ''}`}
                          onClick={(e) => this.handleCopyCode(fileName, content, e)}
                          aria-label={`Copy ${fileName} to clipboard`}
                          title={isCopied ? 'Copied!' : 'Copy to clipboard'}
                        >
                          {isCopied ? '✓ Copied' : '📋 Copy'}
                        </button>
                      )}
                    </div>
                    {isExpanded && (
                      <pre className="examples-code-block"><code>{content}</code></pre>
                    )}
                  </div>
                );
              })
            ) : selectedExample?.codeFiles ? (
              <div className="examples-code-placeholder">Click "Code" to load source files</div>
            ) : (
              <div className="examples-code-placeholder">Code files not available for this example</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  handleFileToggle = (fileName) => {
    this.setState(prevState => ({
      expandedFiles: {
        ...prevState.expandedFiles,
        [fileName]: !prevState.expandedFiles[fileName]
      }
    }));
  }

  handleCopyCode = async (fileName, content, event) => {
    event.stopPropagation(); // Prevent file toggle when clicking copy button
    
    try {
      await navigator.clipboard.writeText(content);
      this.setState({ copiedFile: fileName });
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        this.setState({ copiedFile: null });
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        this.setState({ copiedFile: fileName });
        setTimeout(() => {
          this.setState({ copiedFile: null });
        }, 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy code:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  }

  componentDidMount() {
    this.updateHeaderHeight();
  }

  componentDidUpdate() {
    this.updateHeaderHeight();
  }

  updateHeaderHeight = () => {
    if (this.headerRef?.parentElement) {
      this.headerRef.parentElement.style.setProperty(
        '--header-height',
        `${this.headerRef.offsetHeight}px`
      );
    }
  }

  isViewerExample = (example) => {
    return example?.id && (
      example.id.includes('ue-standalone') ||
      example.id.includes('arcgis-standalone') ||
      example.id.includes('mapbox-standalone') ||
      example.id.includes('gis-project-view') ||
      example.id.includes('georef-view3d') ||
      example.id.includes('viewer') ||
      example.isViewerExample
    );
  }


  render() {
    const { selectedExample, showConfigPanel, showCodePanel } = this.state;
    const { 
      exampleCategories: propExampleCategories, 
      title = "IafViewer Examples", 
      subtitle = "Explore different integration patterns and configurations for IafViewerDBM" 
    } = this.props;
    const exampleCategories = propExampleCategories || getDefaultExampleCategories();

    if (selectedExample) {
      const isViewerExample = this.isViewerExample(selectedExample);
      const isUeStandalone = selectedExample.id === 'ue-standalone';
      const isArcgisStandalone = selectedExample.id === 'arcgis-standalone';
      const isMapboxStandalone = selectedExample.id === 'mapbox-standalone';
      const isGisProjectView = selectedExample.id === 'gis-project-view';
      const isGeoReferencedView3d = selectedExample.id === 'georef-view3d';
      const isClusteredGeoReferencedView3d = selectedExample.id === 'georef-clustered-view3d';
      
      return (
        <div 
          className={`examples-container ${isViewerExample ? 'examples-container-fullscreen' : ''}`}
        >
          {isViewerExample && (
            <div className="examples-view-header" ref={(el) => { this.headerRef = el; }}>
              <div className="examples-view-header-content">
                <button className="examples-back-button" onClick={this.handleBackToList}>
                  ← Back to Examples
                </button>
                <div className="examples-view-toggle">
                  <button 
                    className={`examples-toggle-button ${showCodePanel ? 'active' : ''}`}
                    onClick={this.handleCodeToggle}
                    aria-label={showCodePanel ? 'Hide code panel' : 'Show code panel'}
                  >
                    {showCodePanel ? '✕' : '📄'} {showCodePanel ? 'Hide Code' : 'Code'}
                  </button>
                  {(isUeStandalone || isArcgisStandalone || isMapboxStandalone || isGisProjectView || isGeoReferencedView3d || isClusteredGeoReferencedView3d) && (
                    <button
                      className={`examples-toggle-button ${showConfigPanel ? 'active' : ''}`}
                      onClick={this.handleConfigToggle}
                      aria-label={showConfigPanel ? 'Hide configuration panel' : 'Show configuration panel'}
                    >
                      {showConfigPanel ? '✕' : '⚙️'} {showConfigPanel ? 'Hide Config' : 'Configure'}
                    </button>
                  )}
                </div>
                <div className="examples-view-header-text">
                  <h1>{selectedExample.title}</h1>
                  {(selectedExample.viewerSubtitle || selectedExample.description) && (
                    <p className="examples-view-subtitle">
                      {selectedExample.viewerSubtitle || selectedExample.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {!isViewerExample && (
            <div className="examples-header">
              <button className="examples-back-button" onClick={this.handleBackToList}>
                ← Back to Examples
              </button>
              <h1>{selectedExample.title}</h1>
            </div>
          )}
          
          <div className={`examples-content ${isViewerExample ? 'examples-content-fullscreen' : ''}`}>
            {/* Always show demo view */}
            {React.cloneElement(selectedExample.component, { 
              ...this.props, 
              onBackToList: this.handleBackToList,
              hideHeader: true,
              showConfigPanel: (isUeStandalone || isArcgisStandalone || isMapboxStandalone || isGisProjectView || isGeoReferencedView3d || isClusteredGeoReferencedView3d) ? showConfigPanel : undefined,
              onConfigToggle: (isUeStandalone || isArcgisStandalone || isMapboxStandalone || isGisProjectView || isGeoReferencedView3d || isClusteredGeoReferencedView3d) ? this.handleConfigToggle : undefined,
              serverUri: this.props.serverUri || (IafSession?.getConfig?.()?.graphicsServiceOrigin) || undefined
            })}
            
            {/* Code panel overlay */}
            {isViewerExample && this.renderCodePanel()}
          </div>
        </div>
      );
    }

    return (
      <div className="examples-container">
        <div className="examples-header">
          <h1>{title}</h1>
          <p className="examples-subtitle">
            {subtitle}
          </p>
        </div>
        
        <div className="examples-content">
          {exampleCategories && exampleCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="examples-category">
              <h2 className="examples-category-title">{category.title}</h2>
              <p className="examples-category-description">{category.description}</p>
              <div className="examples-grid">
                {category.examples.map((example) => (
                  <div
                    key={example.id}
                    className={`examples-card ${example.disabled ? 'examples-card-disabled' : ''}`}
                    onClick={() => this.handleExampleClick(example)}
                  >
                    <div className="examples-card-header">
                      <h3 className="examples-card-title">{example.title}</h3>
                      <span className="examples-card-category">{example.category}</span>
                    </div>
                    <p className="examples-card-description">{example.description}</p>
                    {example.disabled && (
                      <p className="examples-card-disabled-label">Not yet implemented</p>
                    )}
                    <div className="examples-card-tags">
                      {example.tags && example.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="examples-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

IafViewerExamplesView.propTypes = {
  exampleCategories: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    examples: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      viewerSubtitle: PropTypes.string,
      category: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      component: PropTypes.element,
      codeContent: PropTypes.object,
      codeFiles: PropTypes.array,
      navigateTo: PropTypes.string,
      isViewerExample: PropTypes.bool,
      disabled: PropTypes.bool
    })).isRequired
  })),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  history: PropTypes.object
};

export default IafViewerExamplesView;

