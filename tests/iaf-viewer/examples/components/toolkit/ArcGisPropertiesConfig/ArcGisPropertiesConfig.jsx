import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IafEvmUtils } from '@dtplatform/iaf-viewer';
import { getSampleArcGisProps, normalizeToJSON, getSampleArcGisConfigString, getSampleSlicedElements, getSampleZoomElements, getSampleZoomCommand, getSampleThemeElements, getSampleDistrictGraphics, getSampleLayers, formatEventLogs, loadCachedArcgisConfig, saveCachedArcgisConfig, getSampleArcGisModules } from '../IafViewerExUtils.js';
import { INITIAL_POSITION_CAMERA } from '../../IafViewerExArcgisStandaloneViewer/config';
import './ArcGisPropertiesConfig.css';

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

class ArcGisPropertiesConfig extends Component {
  constructor(props) {
    super(props);
    const sampleArcgis = getSampleArcGisProps(props.arcgis);
    
    // Load cached ArcGIS config (portalUrl, apiKey, model) from localStorage
    const cachedConfig = loadCachedArcgisConfig();
    
    // Merge cached values with props config or sample config
    const baseConfig = props.arcgis?.config || sampleArcgis.config || {};
    const initialConfig = cachedConfig 
      ? { ...baseConfig, ...cachedConfig } // Merge cached values with existing config
      : baseConfig;
    
    // Initialize with sample data if props don't have values
    const sampleGraphics = props.arcgis?.graphics && props.arcgis.graphics.length > 0
      ? props.arcgis.graphics
      : getSampleDistrictGraphics();
    const sampleThemeElements = props.arcgis?.themeElements && props.arcgis.themeElements.length > 0
      ? props.arcgis.themeElements
      : getSampleThemeElements();
    const sampleZoomElements = props.arcgis?.zoomElements && props.arcgis.zoomElements.length > 0
      ? props.arcgis.zoomElements
      : getSampleZoomElements();
    const sampleCommand = props.arcgis?.command && props.arcgis.command.length > 0
      ? props.arcgis.command
      : getSampleZoomCommand();
    const sampleSlicedElements = props.arcgis?.slicedElements && props.arcgis.slicedElements.length > 0
      ? props.arcgis.slicedElements
      : getSampleSlicedElements();
    const sampleLayers = props.arcgis?.layers && props.arcgis.layers.length > 0
      ? props.arcgis.layers
      : getSampleLayers();
    const sampleCamera = props.arcgis?.camera && Object.keys(props.arcgis.camera).length > 0
      ? props.arcgis.camera
      : INITIAL_POSITION_CAMERA;
    
    // Update sampleArcgis with sample data if props don't have values
    const updatedArcgis = {
      ...sampleArcgis,
      config: initialConfig,
      graphics: sampleGraphics,
      themeElements: sampleThemeElements,
      zoomElements: sampleZoomElements,
      command: sampleCommand,
      slicedElements: sampleSlicedElements,
      layers: sampleLayers,
      camera: sampleCamera
    };
    
    // Event type filters - all enabled by default
    const eventTypes = [
      'VIEWER_READY',
      'CAMERA_UPDATE',
      'SELECTION_UPDATE',
      'POINTER_MOVE',
      'POINTER_EXIT',
      'POINTER_ENTER',
      'VIEWER_BUSY',
      'VIEWER_ERROR',
      'COMMAND_RECEIVED',
      'LAYERS_UPDATE',
      'GRAPHIC_ADDED',
      'GRAPHIC_DELETED',
      'GRAPHIC_UPDATED'
    ];
    const eventTypeFilters = {};
    eventTypes.forEach(type => {
      eventTypeFilters[type] = true; // All enabled by default
    });

    this.state = {
      arcgis: updatedArcgis,
      // Track raw input values for JSON fields to allow free typing
      rawSlicedElements: JSON.stringify(sampleSlicedElements, null, 2),
      rawThemeElements: JSON.stringify(sampleThemeElements, null, 2),
      rawGraphics: JSON.stringify(sampleGraphics, null, 2),
      rawZoomElements: JSON.stringify(sampleZoomElements, null, 2),
      rawLayers: JSON.stringify(sampleLayers, null, 2),
      rawCamera: JSON.stringify(sampleCamera, null, 2),
      rawCommand: JSON.stringify(sampleCommand, null, 2),
      rawConfig: JSON.stringify(initialConfig, null, 2),
      eventTypeFilters,
      showEventFilters: false // Toggle for showing/hiding event filters
    };
  }

  handleEventLogToggle = (checked) => {
    // Toggle all event types in sync with the main Event Log toggle
    this.setState(prevState => {
      const updated = {};
      Object.keys(prevState.eventTypeFilters || {}).forEach(k => {
        updated[k] = checked;
      });
      return { eventTypeFilters: updated };
    });
    if (this.props.onEnableEventLogChange) {
      this.props.onEnableEventLogChange(checked);
    }
  }

  handleToggleAllEventTypes = (checked) => {
    this.setState(prevState => {
      const updated = {};
      Object.keys(prevState.eventTypeFilters || {}).forEach(k => {
        updated[k] = checked;
      });
      return { eventTypeFilters: updated };
    });
  }

  componentDidUpdate(prevProps) {
    // Only update state from props if props changed externally (not from our own onChange)
    // Check if the actual values changed, not just reference equality
    if (prevProps.arcgis !== this.props.arcgis) {
      const prevArcgisStr = JSON.stringify(prevProps.arcgis);
      const currentArcgisStr = JSON.stringify(this.props.arcgis);
      
      // Only reset if props actually changed externally (different values)
      // Also check if our current state matches the new props to avoid unnecessary resets
      const currentStateStr = JSON.stringify(this.state.arcgis);
      if (prevArcgisStr !== currentArcgisStr && currentStateStr !== currentArcgisStr) {
        const sampleArcgis = getSampleArcGisProps(this.props.arcgis);
        
        // Initialize with sample data if props don't have values
        const sampleGraphics = this.props.arcgis?.graphics && this.props.arcgis.graphics.length > 0
          ? this.props.arcgis.graphics
          : getSampleDistrictGraphics();
        const sampleThemeElements = this.props.arcgis?.themeElements && this.props.arcgis.themeElements.length > 0
          ? this.props.arcgis.themeElements
          : getSampleThemeElements();
        const sampleZoomElements = this.props.arcgis?.zoomElements && this.props.arcgis.zoomElements.length > 0
          ? this.props.arcgis.zoomElements
          : getSampleZoomElements();
        const sampleCommand = this.props.arcgis?.command && this.props.arcgis.command.length > 0
          ? this.props.arcgis.command
          : getSampleZoomCommand();
        const sampleSlicedElements = this.props.arcgis?.slicedElements && this.props.arcgis.slicedElements.length > 0
          ? this.props.arcgis.slicedElements
          : getSampleSlicedElements();
        const sampleLayers = this.props.arcgis?.layers && this.props.arcgis.layers.length > 0
          ? this.props.arcgis.layers
          : getSampleLayers();
        const sampleCamera = this.props.arcgis?.camera && Object.keys(this.props.arcgis.camera).length > 0
          ? this.props.arcgis.camera
          : INITIAL_POSITION_CAMERA;
        
        // Merge cached values with props config
        const cachedConfig = loadCachedArcgisConfig();
        const baseConfig = this.props.arcgis?.config || sampleArcgis.config || {};
        const mergedConfig = cachedConfig 
          ? { ...baseConfig, ...cachedConfig } // Merge cached values with existing config
          : baseConfig;
        
        // Update sampleArcgis with sample data if props don't have values
        const updatedArcgis = {
          ...sampleArcgis,
          config: mergedConfig,
          graphics: sampleGraphics,
          themeElements: sampleThemeElements,
          zoomElements: sampleZoomElements,
          command: sampleCommand,
          slicedElements: sampleSlicedElements,
          layers: sampleLayers,
          camera: sampleCamera
        };
        
        this.setState({
          arcgis: updatedArcgis,
          rawSlicedElements: JSON.stringify(sampleSlicedElements, null, 2),
          rawThemeElements: JSON.stringify(sampleThemeElements, null, 2),
          rawGraphics: JSON.stringify(sampleGraphics, null, 2),
          rawZoomElements: JSON.stringify(sampleZoomElements, null, 2),
          rawLayers: JSON.stringify(sampleLayers, null, 2),
          rawCamera: JSON.stringify(sampleCamera, null, 2),
          rawCommand: JSON.stringify(sampleCommand, null, 2),
          rawConfig: JSON.stringify(mergedConfig, null, 2)
        });
      }
    }
  }

  handleChange = (field, value) => {
    const updatedArcgis = {
      ...this.state.arcgis,
      [field]: value
    };
    
    this.setState({ arcgis: updatedArcgis });
    
    if (this.props.onChange) {
      this.props.onChange(updatedArcgis);
    }
  }

  handleArrayChange = (field, value) => {
    const rawField = `raw${field.charAt(0).toUpperCase() + field.slice(1)}`;
    
    try {
      let jsonValue = value.trim();
      
      if (jsonValue) {
        const normalized = normalizeToJSON(jsonValue);
        const parsed = JSON.parse(normalized);
        
        const updatedArcgis = {
          ...this.state.arcgis,
          [field]: parsed
        };
        this.setState({ 
          [rawField]: value,
          arcgis: updatedArcgis
        }, () => {
          if (this.props.onChange) {
            this.props.onChange(updatedArcgis);
          }
        });
      } else {
        const updatedArcgis = {
          ...this.state.arcgis,
          [field]: []
        };
        this.setState({ 
          [rawField]: value,
          arcgis: updatedArcgis
        }, () => {
          if (this.props.onChange) {
            this.props.onChange(updatedArcgis);
          }
        });
      }
    } catch (e) {
      this.setState({ [rawField]: value });
    }
  }

  handleObjectChange = (field, value) => {
    const rawField = `raw${field.charAt(0).toUpperCase() + field.slice(1)}`;
    
    try {
      let jsonValue = value.trim();
      
      if (jsonValue) {
        const normalized = normalizeToJSON(jsonValue);
        const parsed = JSON.parse(normalized);
        
        const updatedArcgis = {
          ...this.state.arcgis,
          [field]: parsed
        };
        this.setState({ 
          [rawField]: value,
          arcgis: updatedArcgis
        }, () => {
          if (this.props.onChange) {
            this.props.onChange(updatedArcgis);
          }
        });
      } else {
        const updatedArcgis = {
          ...this.state.arcgis,
          [field]: {}
        };
        this.setState({ 
          [rawField]: value,
          arcgis: updatedArcgis
        }, () => {
          if (this.props.onChange) {
            this.props.onChange(updatedArcgis);
          }
        });
      }
    } catch (e) {
      this.setState({ [rawField]: value });
    }
  }

  handleOnIafMapReadyDemo = () => {
    const { mapInstance } = this.props;
    
    // Log all data received from onIafMapReady callback
    const arcgisModules = mapInstance?.arcgisModules;
    const availableModules = arcgisModules ? Object.keys(arcgisModules).sort() : [];
    
    console.log('[ArcGisPropertiesConfig] onIafMapReady callback data:', {
      scene: mapInstance?.scene ? 'available' : 'not available',
      sceneView: mapInstance?.sceneView ? 'available' : 'not available',
      camera: mapInstance?.camera ? 'available' : 'not available',
      labelsLayer: mapInstance?.labelsLayer ? 'available' : 'not available',
      labelPoints: mapInstance?.labelPoints ? 'available' : 'not available',
      focusSelector: mapInstance?.focusSelector,
      arcgisModules: arcgisModules ? 'available' : 'not available',
      availableModules: availableModules,
      sampleModules: getSampleArcGisModules(arcgisModules)
    });
    
    if (mapInstance?.sceneView) {
      // Demo: Use SceneView directly to access camera and demonstrate API usage
      try {
        const sceneView = mapInstance.sceneView;
        const camera = sceneView.camera;
        
        if (camera) {
          // Clone current camera and modify it
          const newCamera = camera.clone();
          // Move camera slightly up (increase altitude by 100 units)
          newCamera.position.z = (camera.position.z || 0) + 100;
          
          // Use goTo() to animate camera movement
          sceneView.goTo(newCamera, { duration: 1000 });
          console.log('[ArcGisPropertiesConfig] Demo: Moved camera via SceneView.goTo() API', {
            from: { z: camera.position.z },
            to: { z: newCamera.position.z }
          });
        } else {
          console.warn('[ArcGisPropertiesConfig] Demo: Camera not available');
        }
      } catch (error) {
        console.error('[ArcGisPropertiesConfig] Demo: Error accessing SceneView API:', error);
      }
    } else {
      console.warn('[ArcGisPropertiesConfig] SceneView not available - viewer may not be ready yet');
    }
  }

  handleAddGraphicDemo = () => {
    const { mapInstance } = this.props;
    
    if (!mapInstance?.arcgisModules || !mapInstance?.scene || !mapInstance?.sceneView) {
      console.warn('[ArcGisPropertiesConfig] Demo: Required modules or scene not available');
      return;
    }

    try {
      // Extract ArcGIS modules from arcgisModules (same runtime as IafViewer)
      const { 
        GraphicsLayer, 
        Graphic, 
        Point, 
        SpatialReference,
        TextSymbol,
        CIMSymbol
      } = mapInstance.arcgisModules;

      if (!GraphicsLayer || !Graphic || !Point || !SpatialReference) {
        console.warn('[ArcGisPropertiesConfig] Demo: Required ArcGIS modules not available', {
          GraphicsLayer: !!GraphicsLayer,
          Graphic: !!Graphic,
          Point: !!Point,
          SpatialReference: !!SpatialReference
        });
        return;
      }

      // Get camera position to place the graphic
      const camera = mapInstance.sceneView.camera;
      const cameraPosition = camera.position;
      
      // Create a point at the camera position (or slightly offset)
      const point = new Point({
        x: cameraPosition.x,
        y: cameraPosition.y,
        z: (cameraPosition.z || 0) - 50, // 50 units below camera
        spatialReference: cameraPosition.spatialReference || SpatialReference.WebMercator
      });

      // Create a simple 3D point symbol
      // Using the symbol structure that works with ArcGIS JS API 4.x
      const symbol = {
        type: "point-3d",
        symbolLayers: [{
          type: "icon",
          resource: {
            primitive: "circle"
          },
          material: {
            color: [255, 0, 0, 1] // Red color
          },
          size: 20,
          outline: {
            color: [255, 255, 255, 1], // White outline
            width: 2
          }
        }]
      };

      // Create a graphic with the point and symbol
      const graphic = new Graphic({
        geometry: point,
        symbol: symbol,
        attributes: {
          name: "Demo Graphic",
          created: new Date().toISOString()
        }
      });

      // Check if a demo graphics layer already exists, if not create one
      let demoGraphicsLayer = mapInstance.scene.layers.find(layer => 
        layer.title === "Demo Graphics Layer"
      );

      if (!demoGraphicsLayer) {
        // Create a new GraphicsLayer
        demoGraphicsLayer = new GraphicsLayer({
          title: "Demo Graphics Layer",
          listMode: "show"
        });
        
        // Add the layer to the scene
        mapInstance.scene.layers.add(demoGraphicsLayer);
        console.log('[ArcGisPropertiesConfig] Demo: Created and added GraphicsLayer to scene');
      }

      // Add the graphic to the layer
      demoGraphicsLayer.graphics.add(graphic);
      
      console.log('[ArcGisPropertiesConfig] Demo: Added graphic using ArcGIS modules', {
        modulesUsed: ['GraphicsLayer', 'Graphic', 'Point', 'SpatialReference'],
        graphicPosition: {
          x: point.x,
          y: point.y,
          z: point.z
        },
        layerTitle: demoGraphicsLayer.title,
        totalGraphics: demoGraphicsLayer.graphics.length
      });

      // Optionally zoom to the graphic
      mapInstance.sceneView.goTo({
        target: point,
        zoom: mapInstance.sceneView.zoom - 2
      }, { duration: 1000 });

    } catch (error) {
      console.error('[ArcGisPropertiesConfig] Demo: Error creating graphic with ArcGIS modules:', error);
    }
  }

  handleConfigChange = (value) => {
    this.setState({ rawConfig: value });
    
    try {
      let jsonValue = value.trim();
      
      if (jsonValue) {
        const normalized = normalizeToJSON(jsonValue);
        const parsed = JSON.parse(normalized);
        
        // Cache portalUrl, apiKey, and model values in localStorage if they exist
        if (parsed && typeof parsed === 'object') {
          saveCachedArcgisConfig(parsed);
        }
        
        const updatedArcgis = {
          ...this.state.arcgis,
          config: parsed
        };
        this.setState({ 
          rawConfig: value,
          arcgis: updatedArcgis
        }, () => {
          if (this.props.onChange) {
            this.props.onChange(updatedArcgis);
          }
        });
      } else {
        const updatedArcgis = {
          ...this.state.arcgis,
          config: {}
        };
        this.setState({ 
          rawConfig: value,
          arcgis: updatedArcgis
        }, () => {
          if (this.props.onChange) {
            this.props.onChange(updatedArcgis);
          }
        });
      }
    } catch (e) {
      // Invalid JSON while typing - just update raw value
    }
  }

  render() {
    const { arcgis } = this.state;
    const { className, showAdvanced } = this.props;

    return (
      <div className={`arcgis-properties-config ${className || ''}`}>
        <div className="arcgis-properties-config-section">
          {!this.props.hideTitle && (
            <h3 className="arcgis-properties-config-title">ArcGIS Properties Configuration</h3>
          )}
          
          <div className="arcgis-properties-config-group">
            <label className="arcgis-properties-config-label">
              <input
                type="checkbox"
                checked={arcgis.enable}
                onChange={(e) => this.handleChange('enable', e.target.checked)}
                className="arcgis-properties-config-checkbox"
              />
              <span>Enable ArcGIS Viewer</span>
            </label>
          </div>

          <div className="arcgis-properties-config-group">
            <label className="arcgis-properties-config-label">
              Display Mode
              <select
                value={arcgis.displayMode}
                onChange={(e) => this.handleChange('displayMode', e.target.value)}
                className="arcgis-properties-config-select"
              >
                {DISPLAY_MODE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="arcgis-properties-config-group">
            <label className="arcgis-properties-config-label">
              <input
                type="checkbox"
                checked={arcgis.showToolbar}
                onChange={(e) => this.handleChange('showToolbar', e.target.checked)}
                className="arcgis-properties-config-checkbox"
              />
              <span>Show Toolbar</span>
            </label>
          </div>

          <div className="arcgis-properties-config-group">
            <label className="arcgis-properties-config-label">
              Alignment
              <select
                value={arcgis.alignment}
                onChange={(e) => this.handleChange('alignment', e.target.value)}
                className="arcgis-properties-config-select"
              >
                {ALIGNMENT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="arcgis-properties-config-row">
            <div className="arcgis-properties-config-group">
              <label className="arcgis-properties-config-label">
                Order
                <input
                  type="number"
                  value={arcgis.order}
                  onChange={(e) => this.handleChange('order', parseInt(e.target.value, 10) || 0)}
                  className="arcgis-properties-config-input"
                  min="0"
                />
              </label>
            </div>

            <div className="arcgis-properties-config-group">
              <label className="arcgis-properties-config-label">
                Margin
                <input
                  type="number"
                  value={arcgis.margin}
                  onChange={(e) => this.handleChange('margin', parseInt(e.target.value, 10) || 0)}
                  className="arcgis-properties-config-input"
                  min="0"
                />
              </label>
            </div>
          </div>          

          {showAdvanced && (
            <>
              <div className="arcgis-properties-config-group">
                <label className="arcgis-properties-config-label">
                  Config (JSON Object)
                  <textarea
                    value={this.state.rawConfig}
                    onChange={(e) => this.handleConfigChange(e.target.value)}
                    className="arcgis-properties-config-textarea"
                    rows="6"
                  />
                </label>
              </div>

              <div className="arcgis-properties-config-group">
                <label className="arcgis-properties-config-label">
                  Sliced Elements (JSON Array)
                  <textarea
                    value={this.state.rawSlicedElements}
                    onChange={(e) => this.handleArrayChange('slicedElements', e.target.value)}
                    className="arcgis-properties-config-textarea"
                    rows="3"
                  />
                </label>
              </div>

              <div className="arcgis-properties-config-group">
                <label className="arcgis-properties-config-label">
                  Theme Elements (JSON Array)
                  <textarea
                    value={this.state.rawThemeElements}
                    onChange={(e) => this.handleArrayChange('themeElements', e.target.value)}
                    className="arcgis-properties-config-textarea"
                    rows="3"
                  />
                </label>
              </div>

              <div className="arcgis-properties-config-group">
                <label className="arcgis-properties-config-label">
                  Graphics (JSON Array)
                  <textarea
                    value={this.state.rawGraphics}
                    onChange={(e) => this.handleArrayChange('graphics', e.target.value)}
                    className="arcgis-properties-config-textarea"
                    rows="3"
                  />
                </label>
              </div>

              <div className="arcgis-properties-config-group">
                <label className="arcgis-properties-config-label">
                  Zoom Elements (JSON Array)
                  <textarea
                    value={this.state.rawZoomElements}
                    onChange={(e) => this.handleArrayChange('zoomElements', e.target.value)}
                    className="arcgis-properties-config-textarea"
                    rows="3"
                  />
                </label>
              </div>

              <div className="arcgis-properties-config-group">
                <label className="arcgis-properties-config-label">
                  Layers (JSON Array)
                  <span className="arcgis-properties-config-info">
                    Array of layer names that should be visible. Updated automatically via LAYERS_UPDATE event.
                  </span>
                  <textarea
                    value={this.state.rawLayers}
                    onChange={(e) => this.handleArrayChange('layers', e.target.value)}
                    className="arcgis-properties-config-textarea"
                    rows="3"
                  />
                </label>
              </div>

              <div className="arcgis-properties-config-group">
                <label className="arcgis-properties-config-label">
                  Camera (JSON Object)
                  <textarea
                    value={this.state.rawCamera}
                    onChange={(e) => this.handleObjectChange('camera', e.target.value)}
                    className="arcgis-properties-config-textarea"
                    rows="3"
                  />
                </label>
              </div>

              <div className="arcgis-properties-config-group">
                <label className="arcgis-properties-config-label">
                  Command (JSON Array)
                  <textarea
                    value={this.state.rawCommand}
                    onChange={(e) => this.handleArrayChange('command', e.target.value)}
                    className="arcgis-properties-config-textarea"
                    rows="3"
                  />
                </label>
              </div>

              <div className="arcgis-properties-config-group">
                <label className="arcgis-properties-config-label">
                  Event Handler
                  <span className="arcgis-properties-config-info">
                    {arcgis.eventHandler ? 'Function provided' : 'No handler'}
                  </span>
                </label>
              </div>

              <div className="arcgis-properties-config-group">
                <label className="arcgis-properties-config-label">
                  onIafMapReady
                  {this.props.onIafMapReadyLog && (
                    <div className="arcgis-properties-config-demo-log">
                      <p className="arcgis-properties-config-demo-log-title">Callback Data:</p>
                      <textarea
                        value={JSON.stringify(this.props.onIafMapReadyLog, null, 2)}
                        readOnly
                        className="arcgis-properties-config-textarea arcgis-properties-config-demo-log-textarea"
                        rows="12"
                      />
                    </div>
                  )}
                  <div className="arcgis-properties-config-demo-box">
                    <p className="arcgis-properties-config-demo-description">
                      Move Camera Demo: Demonstrates usage of scene and sceneView received from onIafMapReady callback.
                    </p>
                    <button
                      type="button"
                      onClick={this.handleOnIafMapReadyDemo}
                      className="arcgis-properties-config-demo-button"
                      disabled={!this.props.mapInstance?.sceneView}
                      title={this.props.mapInstance?.sceneView ? "Move camera via SceneView.goTo() API" : "SceneView not available - viewer may not be ready"}
                    >
                      Move Camera
                    </button>
                    {!this.props.mapInstance?.sceneView && (
                      <span className="arcgis-properties-config-demo-hint">
                        (Waiting for viewer to be ready...)
                      </span>
                    )}
                  </div>
                  <div className="arcgis-properties-config-demo-box">
                    <p className="arcgis-properties-config-demo-description">
                      Add Graphic Demo: Demonstrates usage of GraphicsLayer, Graphic, Point, and SpatialReference modules from arcgisModules. Creates a graphics layer and adds a point graphic to the scene.
                    </p>
                    <button
                      type="button"
                      onClick={this.handleAddGraphicDemo}
                      className="arcgis-properties-config-demo-button"
                      disabled={!this.props.mapInstance?.arcgisModules || !this.props.mapInstance?.scene || !this.props.mapInstance?.sceneView}
                      title={this.props.mapInstance?.arcgisModules ? "Add a graphic using ArcGIS modules from arcgisModules" : "ArcGIS modules not available - viewer may not be ready"}
                    >
                      Add Graphic
                    </button>
                    {(!this.props.mapInstance?.arcgisModules || !this.props.mapInstance?.scene || !this.props.mapInstance?.sceneView) && (
                      <span className="arcgis-properties-config-demo-hint">
                        (Waiting for viewer to be ready...)
                      </span>
                    )}
                  </div>
                </label>
              </div>
            </>
          )}

          {/* Event Log Display */}
          <div className="arcgis-properties-config-group arcgis-properties-config-event-log">
            <label className="arcgis-properties-config-label">
              <label className="arcgis-properties-config-title-checkbox">
                <input
                  type="checkbox"
                  checked={this.props.enableEventLog || false}
                  onChange={(e) => this.handleEventLogToggle(e.target.checked)}
                />
                <span>Event Log</span>
              </label>
              <span className="arcgis-properties-config-info">
                Events received from ArcGIS viewer callbacks (disabled by default to improve performance)
              </span>
              <div className={`arcgis-properties-config-event-log-container ${this.state.showEventFilters ? 'filters-visible' : ''}`}>
                <div className="arcgis-properties-config-event-log-textarea-wrapper">
                  <button
                    type="button"
                    onClick={() => this.setState(prevState => ({ showEventFilters: !prevState.showEventFilters }))}
                    className="arcgis-properties-config-event-filters-toggle"
                    title={this.state.showEventFilters ? "Hide event filters" : "Show event filters"}
                  >
                    {this.state.showEventFilters ? '▼' : '▶'} Filters
                  </button>
                  <textarea
                    value={(() => {
                      try {
                        if (!this.props.eventLogs) return '';
                        // Filter events based on selected event types
                        const eventTypeFilters = this.state.eventTypeFilters;
                        let filteredLogs = Array.isArray(this.props.eventLogs) 
                          ? this.props.eventLogs 
                          : [this.props.eventLogs];
                        
                        // Filter events by type
                        filteredLogs = filteredLogs.filter(event => {
                          if (typeof event === 'string') return true; // Keep string events
                          
                          // Try to extract event name from various possible fields
                          const eventName = (event?.eventName || event?.type || '').toUpperCase();
                          if (!eventName) return true; // Keep events without type
                          
                          // Normalize event name (handle both "VIEWER_READY" and "viewer_ready" formats)
                          // Remove any non-alphanumeric characters except underscores
                          const normalizedEventName = eventName.replace(/[^A-Z0-9_]/g, '');
                          
                          // Map event names to filter keys (handle case-insensitive matching)
                          const eventTypeMap = {
                            'VIEWER_READY': 'VIEWER_READY',
                            'CAMERA_UPDATE': 'CAMERA_UPDATE',
                            'SELECTION_UPDATE': 'SELECTION_UPDATE',
                            'POINTER_MOVE': 'POINTER_MOVE',
                            'POINTER_EXIT': 'POINTER_EXIT',
                            'POINTER_ENTER': 'POINTER_ENTER',
                            'VIEWER_BUSY': 'VIEWER_BUSY',
                            'VIEWER_ERROR': 'VIEWER_ERROR',
                            'COMMAND_RECEIVED': 'COMMAND_RECEIVED',
                            'LAYERS_UPDATE': 'LAYERS_UPDATE',
                            'GRAPHIC_ADDED': 'GRAPHIC_ADDED',
                            'GRAPHIC_DELETED': 'GRAPHIC_DELETED',
                            'GRAPHIC_UPDATED': 'GRAPHIC_UPDATED'
                          };
                          
                          // Try to find matching filter key
                          const filterKey = eventTypeMap[normalizedEventName];
                          
                          // If we found a matching filter key, check if it's enabled
                          if (filterKey && eventTypeFilters.hasOwnProperty(filterKey)) {
                            return eventTypeFilters[filterKey] !== false;
                          }
                          
                          // For unknown event types or events without a matching filter, show them by default
                          return true;
                        });
                        
                        // Limit the number of events to prevent performance issues
                        const maxEvents = 100;
                        const eventLogs = filteredLogs.length > maxEvents 
                          ? filteredLogs.slice(-maxEvents) // Take only the most recent events
                          : filteredLogs;
                        return formatEventLogs(eventLogs) || '';
                      } catch (e) {
                        console.error('[ArcGisPropertiesConfig] Error formatting event logs:', e);
                        return `[Error formatting event logs: ${e.message}]`;
                      }
                    })()}
                    readOnly
                    className="arcgis-properties-config-textarea arcgis-properties-config-event-log-textarea"
                    rows="8"
                    placeholder="Events will appear here as they are received..."
                  />
                </div>
                {this.state.showEventFilters && (
                  <div className="arcgis-properties-config-event-filters">
                    <div className="arcgis-properties-config-event-filters-title">Event Types:</div>
                    <label className="arcgis-properties-config-event-filter-checkbox">
                      <input
                        type="checkbox"
                        checked={Object.values(this.state.eventTypeFilters || {}).every(v => v)}
                        onChange={(e) => this.handleToggleAllEventTypes(e.target.checked)}
                      />
                      <span>All</span>
                    </label>
                    {Object.keys(this.state.eventTypeFilters).map(eventType => (
                      <label key={eventType} className="arcgis-properties-config-event-filter-checkbox">
                        <input
                          type="checkbox"
                          checked={this.state.eventTypeFilters[eventType] !== false}
                          onChange={(e) => {
                            this.setState(prevState => ({
                              eventTypeFilters: {
                                ...prevState.eventTypeFilters,
                                [eventType]: e.target.checked
                              }
                            }));
                          }}
                        />
                        <span>{eventType.replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </label>
          </div>
          
        </div>
      </div>
    );
  }
}

ArcGisPropertiesConfig.propTypes = {
  arcgis: PropTypes.shape({
    enable: PropTypes.bool,
    mode: PropTypes.string,
    appId: PropTypes.string,
    config: PropTypes.object,
    slicedElements: PropTypes.array,
    themeElements: PropTypes.array,
    graphics: PropTypes.array,
    zoomElements: PropTypes.array,
    layers: PropTypes.array,
    camera: PropTypes.object,
    command: PropTypes.array,
    eventHandler: PropTypes.func,
    onIafMapReady: PropTypes.func,
    mapInstance: PropTypes.shape({
      scene: PropTypes.object,
      sceneView: PropTypes.object,
      camera: PropTypes.object,
      labelsLayer: PropTypes.object,
      labelPoints: PropTypes.object,
      focusSelector: PropTypes.string,
      arcgisModules: PropTypes.object,
      ready: PropTypes.bool,
      error: PropTypes.string
    }),
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
  onIafMapReadyLog: PropTypes.object,
};

ArcGisPropertiesConfig.defaultProps = {
  showAdvanced: false,
};

export default ArcGisPropertiesConfig;

