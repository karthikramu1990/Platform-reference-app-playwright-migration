import { IafEvmUtils } from '@dtplatform/iaf-viewer';

/**
 * Generate a UUID v4 string
 * @returns {string} UUID string
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};


/**
 * Get sample UE command object (with actual UUIDs for parsed values)
 * @returns {Object} Sample UE command object
 */
export const getSampleUeCommand = () => ({
  commandName: 'zoom_to',
  commandRef: generateUUID(),
  params: {
    elementId: '210671540_0'
  }
});

/**
 * Get sample UE zoomElements array (with actual UUIDs for parsed values)
 * @returns {Array} Sample UE zoomElements array
 */
export const getSampleUeZoomElements = () => [{
  elementId: '147013786_0',
  uuid: generateUUID()
}];

/**
 * Get sample UE command string for raw input (shows uuid() calls)
 * @returns {string} Sample UE command JSON string
 */
export const getSampleUeCommandString = () => `
[{
  "commandName": "zoom_to", // The name of the command to execute
  "commandRef": uuid(), // A unique identifier for the command
  "params": {
    "elementId": "210671540_0", // The id of the element to zoom to
    "uuid": uuid() // A unique identifier for the element
  }
}]`;

/**
 * Get sample UE zoomElements string for raw input (shows uuid() calls)
 * @returns {string} Sample UE zoomElements JSON string
 */
export const getSampleUeZoomElementsString = () => `[{
  "elementId": "147013786_0",
  "uuid": uuid()
}]`;

/**
 * Get sample UE config object
 * @returns {Object} Sample UE config object
 */
export const getSampleUeConfig = () => ({
  server: "YOUR_SERVER_URL_HERE",
  app: "YOUR_APP_URL_HERE"
});

/**
 * Get sample ArcGIS config object
 * @returns {Object} Sample ArcGIS config object
 */
export const getSampleArcGisConfig = () => ({
  portalUrl: "https://gis.hlplanning.com/arcgis", // GIS server URL
  apiKey: "YOUR_ARCGIS_API_KEY_HERE", // API key for the GIS server - Replace with your actual API key
  model: "6745f5a0f1df4812a26925c19fdab6f8", // Web scene ID
});

/**
 * Get sample ArcGIS config string for raw input
 * @returns {string} Sample ArcGIS config JSON string
 */
export const getSampleArcGisConfigString = () => `{
  "portalUrl": "https://gis.hlplanning.com/arcgis",
  "apiKey": "YOUR_ARCGIS_API_KEY_HERE",
  "model": "6745f5a0f1df4812a26925c19fdab6f8",
  "sceneWKID": 102100,
  "shadows": false,
  "groundOpacity": 1,
  "popUpEnabled": false,
  "highlightOnClick": false,
  "components": ["zoom", "compass"],
  "showBasemapGallery": true
}`;

/**
 * Get sample ArcGIS properties with fallback values
 * @param {Object} arcgis - ArcGIS properties object
 * @returns {Object} Sample ArcGIS properties
 */
export const getSampleArcGisProps = (arcgis) => ({
  enable: arcgis?.enable ?? false,
  mode: arcgis?.mode ?? "arcgis",
  appId: arcgis?.appId,
  config: arcgis?.config ?? getSampleArcGisConfig(),
  slicedElements: arcgis?.slicedElements ?? [],
  themeElements: arcgis?.themeElements ?? [],
  graphics: arcgis?.graphics ?? [],
  zoomElements: arcgis?.zoomElements ?? [],
  camera: arcgis?.camera,
  command: arcgis?.command ?? [],
  eventHandler: arcgis?.eventHandler,
  onIafMapReady: arcgis?.onIafMapReady,
  displayMode: arcgis?.displayMode ?? IafEvmUtils.EVMDisplayMode.FULLSCREEN,
  showToolbar: arcgis?.showToolbar ?? true,
  alignment: arcgis?.alignment ?? IafEvmUtils.EVMWidgetAlignment.LEFT_TOP,
  order: arcgis?.order ?? 7,
  margin: arcgis?.margin ?? 0,
});

/**
 * Get sample UE config string for raw input
 * @returns {string} Sample UE config JSON string
 */
export const getSampleUeConfigString = () => `{
  "server": "https://connector.eagle3dstreaming.com",
  "app": "/v6/eyJvd25lciI6ImludmljYXJhZGVtbyIsImFwcE5hbWUiOiJDaGljYWdvQXBwIiwiY29uZmlnTmFtZSI6InNlY3VyZVVSTCJ9"
}`;

/**
 * Get sample UE properties with fallback values
 * @param {Object} ue - UE properties object
 * @returns {Object} Sample UE properties
 */
export const getSampleUeProps = (ue) => ({
  enable: ue?.enable ?? false,
  config: ue?.config ?? getSampleUeConfig(),
  zoomElements: ue?.zoomElements ?? getSampleUeZoomElements(),
  command: ue?.command ?? getSampleUeCommand(),
  eventHandler: ue?.eventHandler,
  displayMode: ue?.displayMode ?? IafEvmUtils.EVMDisplayMode.DEFAULT,
  showToolbar: ue?.showToolbar ?? true,
  alignment: ue?.alignment ?? IafEvmUtils.EVMWidgetAlignment.RIGHT_BOTTOM,
  order: ue?.order ?? 7,
  margin: ue?.margin ?? 0,
});

/**
 * Normalize JavaScript-like syntax to valid JSON
 * Handles common patterns like:
 * - Single quotes to double quotes
 * - Unquoted keys
 * - Function calls like uuid() - replaces with actual generated UUID
 * 
 * @param {string} value - Input string to normalize
 * @returns {string} Normalized JSON string
 */
export const normalizeToJSON = (value) => {
  if (!value || !value.trim()) return value;
  
  try {
    // First try direct JSON parse
    JSON.parse(value);
    return value; // Already valid JSON
  } catch (e) {
    // Try to fix common JavaScript syntax issues
    let normalized = value;
    
    // Replace single quotes with double quotes (but be careful with strings)
    // This is a simple approach - for complex cases, user should use proper JSON
    normalized = normalized.replace(/'/g, '"');
    
    // Try to fix unquoted keys (basic pattern matching)
    // Match: key: (where key doesn't start with quote)
    normalized = normalized.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
    
    // Replace function calls like uuid() with actual generated UUID
    normalized = normalized.replace(/\buuid\(\)/g, () => `"${generateUUID()}"`);
    
    return normalized;
  }
};

/**
 * Normalize a parsed value to always be an array
 * If the value is a single object, wrap it in an array
 * If it's already an array, return it as-is
 * If it's null/undefined/empty, return empty array
 * 
 * @param {*} value - Parsed value (object, array, or other)
 * @returns {Array} Always returns an array
 */
export const normalizeToArray = (value) => {
  if (value === null || value === undefined) {
    return [];
  }
  
  if (Array.isArray(value)) {
    return value;
  }
  
  // If it's a single object, wrap it in an array
  if (typeof value === 'object') {
    return [value];
  }
  
  // For other types (string, number, etc.), wrap in array
  return [value];
};

/**
 * Safely serialize an object, removing circular references and non-serializable values
 * @param {*} obj - Object to serialize
 * @param {Set} seen - Set to track visited objects (for circular reference detection)
 * @param {number} depth - Current depth level (to prevent infinite recursion)
 * @param {number} maxDepth - Maximum depth to serialize (default: 5)
 * @returns {*} Serializable version of the object
 */
export const safeSerialize = (obj, seen = new Set(), depth = 0, maxDepth = 5) => {
  // Prevent infinite recursion with depth limit
  if (depth > maxDepth) {
    return '[Max Depth Reached]';
  }
  
  // Handle null and undefined
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Handle primitives
  if (typeof obj !== 'object') {
    return obj;
  }
  
  // Handle circular references
  if (seen.has(obj)) {
    return '[Circular Reference]';
  }
  seen.add(obj);
  
  try {
    // Handle arrays
    if (Array.isArray(obj)) {
      // Limit array size to prevent processing huge arrays
      const maxArrayLength = 100;
      const limitedArray = obj.length > maxArrayLength ? obj.slice(0, maxArrayLength) : obj;
      const result = limitedArray.map(item => safeSerialize(item, seen, depth + 1, maxDepth));
      if (obj.length > maxArrayLength) {
        result.push(`[${obj.length - maxArrayLength} more items...]`);
      }
      seen.delete(obj);
      return result;
    }
    
    // Handle Date objects
    if (obj instanceof Date) {
      seen.delete(obj);
      return obj.toISOString();
    }
    
    // Handle DOM elements and other non-serializable objects
    if (obj instanceof HTMLElement || obj instanceof Node) {
      seen.delete(obj);
      return `[${obj.constructor.name}] ${obj.tagName || obj.nodeName || 'Element'}`;
    }
    
    // Handle functions
    if (typeof obj === 'function') {
      seen.delete(obj);
      return `[Function: ${obj.name || 'anonymous'}]`;
    }
    
    // Handle objects - limit number of properties to prevent processing huge objects
    const result = {};
    const maxProperties = 50;
    let propertyCount = 0;
    
    for (const key in obj) {
      if (propertyCount >= maxProperties) {
        result['...'] = `[${Object.keys(obj).length - maxProperties} more properties...]`;
        break;
      }
      
      if (obj.hasOwnProperty(key)) {
        try {
          result[key] = safeSerialize(obj[key], seen, depth + 1, maxDepth);
          propertyCount++;
        } catch (e) {
          result[key] = `[Error serializing: ${e.message}]`;
          propertyCount++;
        }
      }
    }
    
    seen.delete(obj);
    return result;
  } catch (e) {
    seen.delete(obj);
    return `[Error serializing object: ${e.message}]`;
  }
};

/**
 * Get sample district graphics data inspired by applyDistrictsSymbologyAction()
 * This creates sample district label graphics similar to the PlatformReferenceApp implementation
 * Returns all 7 districts matching SYMBOLOGY.DISTRICTS from the PlatformReferenceApp config
 * Can be used by ArcGIS viewer examples to demonstrate graphics functionality
 * @returns {Array} Array of graphic objects with district labels
 */
export const getSampleDistrictGraphics = () => {
  // Helper function to create a graphic object for a district
  const createDistrictGraphic = (districtName, color, point) => {
    const graphicId = `label_point-${districtName}`;
    return {
      type: "symbol",
      id: graphicId,
      uuid: generateUUID(), // Generate proper UUID for apiCompareEvmProps to track changes
      symbolType: 'custom',
      symbolSource: {
        type: "CIMPointSymbol",
        symbolLayers: [
          {
            type: "CIMVectorMarker",
            enable: true,
            anchorPointUnits: "Relative",
            dominantSizeAxis3D: "Y",
            size: 24,
            billboardMode3D: "FaceNearPlane",
            frame: {
              xmin: 0,
              ymin: 0,
              xmax: 21,
              ymax: 21
            },
            markerGraphics: [
              {
                type: "CIMMarkerGraphic",
                geometry: {
                  rings: [
                    [
                      [15, 11],
                      [14, 11],
                      [14, 6],
                      [15, 6],
                      [15, 11]
                    ],
                    [
                      [12, 11],
                      [9, 11],
                      [9, 6],
                      [10, 6],
                      [10, 7],
                      [11, 7],
                      [11, 6],
                      [12, 6],
                      [12, 11]
                    ],
                    [
                      [7, 11],
                      [6, 11],
                      [6, 6],
                      [7, 6],
                      [7, 11]
                    ]
                  ]
                },
                symbol: {
                  type: "CIMPolygonSymbol",
                  symbolLayers: [
                    {
                      type: "CIMSolidFill",
                      enable: true,
                      color: color
                    }
                  ]
                }
              }
            ],
            scaleSymbolsProportionally: true,
            respectFrame: true,
            offsetY: 22,
            offsetX: 0
          },
          {
            type: "CIMVectorMarker",
            enable: true,
            anchorPoint: {
              x: 0,
              y: -0.5
            },
            anchorPointUnits: "Relative",
            dominantSizeAxis3D: "Y",
            size: 30,
            billboardMode3D: "FaceNearPlane",
            frame: {
              xmin: 0,
              ymin: 0,
              xmax: 21,
              ymax: 21
            },
            markerGraphics: [
              {
                type: "CIMMarkerGraphic",
                geometry: {
                  rings: [[
                    [17.17, 14.33],
                    [16.97, 12.96],
                    [16.38, 11.37],
                    [12.16, 3.98],
                    [11.2, 1.94],
                    [10.5, 0],
                    [9.8, 1.96],
                    [8.84, 4.02],
                    [4.61, 11.41],
                    [4.02, 12.98],
                    [3.83, 14.33],
                    [3.96, 15.63],
                    [4.34, 16.88],
                    [4.95, 18.03],
                    [5.78, 19.04],
                    [6.8, 19.88],
                    [7.95, 20.49],
                    [9.2, 20.87],
                    [10.5, 21],
                    [11.8, 20.87],
                    [13.05, 20.5],
                    [14.2, 19.88],
                    [15.22, 19.05],
                    [16.05, 18.03],
                    [16.66, 16.88],
                    [17.04, 15.63],
                    [17.17, 14.33]
                  ]]
                },
                symbol: {
                  type: "CIMPolygonSymbol",
                  symbolLayers: [
                    {
                      type: "CIMSolidStroke",
                      enable: true,
                      capStyle: "Round",
                      joinStyle: "Round",
                      lineStyle3D: "Strip",
                      miterLimit: 10,
                      width: 1,
                      color: [255, 255, 255, 255]
                    },
                    {
                      type: "CIMSolidFill",
                      enable: true,
                      color: color
                    }
                  ]
                }
              }
            ],
            scaleSymbolsProportionally: true,
            respectFrame: true
          }
        ]
      },
      text: districtName,
      point: point
    };
  };

  return [
    // Downtown Business District - color: [230, 196, 181, 255]
    createDistrictGraphic(
      "Downtown Business District",
      [230, 196, 181, 255],
      { x: -9755028.0996, y: 5142849.480899997, z: 375 }
    ),
    // Magnificient Mile - color: [177, 216, 212, 255]
    createDistrictGraphic(
      "Magnificient Mile",
      [177, 216, 212, 255],
      { x: -9754329.3879, y: 5144322.482299998, z: 350 }
    ),
    // Millenium Park - color: [230, 230, 0, 255]
    createDistrictGraphic(
      "Millenium Park",
      [230, 230, 0, 255],
      { x: -9753895.5236, y: 5142468.902400002, z: 225 }
    ),
    // South Loop - color: [128, 177, 211, 255]
    createDistrictGraphic(
      "South Loop",
      [128, 177, 211, 255],
      { x: -9754882.0659, y: 5141763.063100003, z: 225 }
    ),
    // Streeterville - color: [253, 180, 98, 255]
    createDistrictGraphic(
      "Streeterville",
      [253, 180, 98, 255],
      { x: -9753635.288, y: 5144416.958999999, z: 225 }
    ),
    // Theatre District - color: [166, 125, 154, 255]
    createDistrictGraphic(
      "Theatre District",
      [166, 125, 154, 255],
      { x: -9755129.178, y: 5143693.300399996, z: 330 }
    ),
    // West Loop - color: [214, 214, 214, 255]
    createDistrictGraphic(
      "West Loop",
      [214, 214, 214, 255],
      { x: -9756321.1532, y: 5143829.9965, z: 300 }
    )
  ];
};

/**
 * Get sample sliced elements data inspired by filterDistrictAction()
 * This creates sample sliced elements for a district following the exact pattern of filterDistrictAction()
 * Returns an array of sliced element objects matching the params structure from filterDistrictAction()
 * filterDistrictAction() creates two entries - one for DISTRICTS layer and one for BUILDINGS layer
 * Each element includes uuid for tracking changes (required by apiCompareEvmProps)
 * Can be used by ArcGIS viewer examples to demonstrate slicing functionality
 * @returns {Array} Array containing sliced element objects with clear, ids, extra (layerNames, field), and uuid
 */
export const getSampleSlicedElements = () => {
  // Sample district name - using "Theatre District" as a sample (matching the working example)
  // This follows the pattern of filterDistrictAction() which takes a districtName parameter
  const districtName = "Theatre District";
  
  // Following the exact pattern of filterDistrictAction() from PlatformReferenceApp:
  // Each sliced element object matches the params.params structure from filterDistrictAction's commands
  // filterDistrictAction() creates two commands - one for DISTRICTS layer and one for BUILDINGS layer
  // We include both to match the complete pattern
  // Each element needs a uuid for apiCompareEvmProps to track changes
  return [
    {
      clear: false, // Same as filterDistrictAction's first command params.params.clear
      ids: [districtName], // Same as filterDistrictAction's first command params.params.ids
      extra: {
        layerNames: ["Chicago POC Districts"], // Same as GIS_LAYER_NAMES.DISTRICTS from PlatformReferenceApp
        field: "hl_districtname" // Same as GIS_LAYERS[GIS_LAYER_NAMES.DISTRICTS].idField from PlatformReferenceApp
      },
      uuid: generateUUID() // Generate proper UUID for apiCompareEvmProps to track changes
    },
    {
      clear: false, // Same as filterDistrictAction's second command params.params.clear
      ids: [districtName], // Same as filterDistrictAction's second command params.params.ids
      extra: {
        layerNames: ["District Buildings - ChicagoBuildingsInDistricts"], // Same as GIS_LAYER_NAMES.BUILDINGS from PlatformReferenceApp
        field: "hl_district" // Same as GIS_LAYERS[GIS_LAYER_NAMES.BUILDINGS].relatedLayersField[GIS_LAYER_NAMES.DISTRICTS] from PlatformReferenceApp
      },
      uuid: generateUUID() // Generate proper UUID for apiCompareEvmProps to track changes
    }
  ];
};

/**
 * Get sample theme elements data inspired by sketchBuildingsAction()
 * This creates sample theme elements for buildings following the same pattern as sketchBuildingsAction()
 * Returns theme element objects that color buildings of interest and style other buildings with sketch renderer
 * Can be used by ArcGIS viewer examples to demonstrate theme functionality
 * @returns {Array} Array containing theme element objects with groups, other, extra (field, fieldType, layerNames), and uuid
 */
export const getSampleThemeElements = () => {
  // Sample district name - using "Theatre District" as a sample (matching the working example)
  // This follows the pattern of sketchBuildingsAction() which takes a districtName parameter
  const districtName = "Theatre District";
  
  // Building IDs for Theatre District (matching BUILDING_OF_INTEREST from PlatformReferenceApp)
  // These are osm_id values from the buildings in Theatre District
  const buildingIds = [144846547, 147013786, 99999, 210671540, 64389514];
  
  // District color for Theatre District (matching DISTRICT_COLORS from PlatformReferenceApp)
  const districtColor = [166, 125, 154, 255];
  
  // Following the exact pattern of sketchBuildingsAction():
  // 1. groups: array with buildings of interest in district color
  // 2. other: styling for uninteresting buildings (transparent with sketch edges)
  // 3. extra: field, fieldType, and layerNames to tell GIS system which layer and field to use
  return [{
    groups: [
      {
        color: districtColor,
        ids: buildingIds
      }
    ],
    other: {
      color: [235, 235, 235],
      opacity: 0.1,
      edges: {
        width: 1,
        color: '#cccccc',
        opacity: 0.1,
        extra: {
          extensionLength: 2,
          type: 'sketch'
        }
      }
    },
    extra: {
      field: "osm_id", // Same as GIS_LAYERS[GIS_LAYER_NAMES.BUILDINGS].idField from PlatformReferenceApp
      fieldType: "Integer", // Same as GIS_LAYERS[GIS_LAYER_NAMES.BUILDINGS].idFieldType from PlatformReferenceApp
      layerNames: ["District Buildings - ChicagoBuildingsInDistricts"] // Same as GIS_LAYER_NAMES.BUILDINGS from PlatformReferenceApp
    },
    uuid: generateUUID() // Generate proper UUID for apiCompareEvmProps to track changes
  }];
};

/**
 * Get sample zoom elements data inspired by zoomToOnly()
 * This creates a sample zoom element for a district following the same pattern as zoomToOnly()
 * Returns a single zoom element matching the structure used in zoomToOnly()
 * Can be used by ArcGIS viewer examples to demonstrate zoom functionality
 * @returns {Array} Array containing a single zoom element object with district elementId and extra field/layerNames
 */
export const getSampleZoomElements = () => {
  // Sample district name - following the pattern of zoomToOnly() which takes a districtName parameter
  // Using "Theatre District" as a sample, matching one of the districts from getSampleDistrictGraphics()
  const districtName = "Theatre District";
  
  // Following the exact pattern of zoomToOnly():
  // - elementId: districtName (same as zoomToOnly's params.elementId)
  // - extra: field and layerNames (same as zoomToOnly's params.extra)
  // The field "hl_districtname" matches GIS_LAYERS[GIS_LAYER_NAMES.DISTRICTS].idField from PlatformReferenceApp
  // The layerName "Chicago POC Districts" matches GIS_LAYER_NAMES.DISTRICTS from PlatformReferenceApp
  return [{
    elementId: districtName,
    uuid: generateUUID(), // Generate proper UUID for apiCompareEvmProps to track changes
    extra: {
      field: "hl_districtname", // Same as GIS_LAYERS[GIS_LAYER_NAMES.DISTRICTS].idField
      layerNames: ["Chicago POC Districts"] // Same as [GIS_LAYER_NAMES.DISTRICTS]
    }
  }];
};

/**
 * Get sample zoom command data inspired by zoomToOnly()
 * This creates a wrapped command object following the exact pattern of zoomToOnly()
 * Returns a command object wrapped using IafEvmUtils.apiUnwrapMmvCommadToEvmProperty
 * Uses a different district than getSampleZoomElements() to demonstrate variety
 * Can be used by ArcGIS viewer examples to demonstrate command functionality
 * @returns {Array} Array containing a single wrapped command object for zooming to a district
 */
/**
 * Get sample layers array (array of layer names that should be visible)
 * Inspired by theatreDistricLayers from PlanningTwinLayout.jsx
 * @returns {Array<string>} Sample layers array
 */
export const getSampleLayers = () => {
  // Sample layer names - these should match actual layer names in the scene
  // This is a simple array of layer names that should be visible
  return [
    'Chicago POC Districts',
    'District Buildings - ChicagoBuildingsInDistricts',      
    "Exchange Building - Exchange Building",      
    'ChicagoBuildingPoints_Districts',
  ];
};

export const getSampleZoomCommand = () => {
  // Sample district name - using "Downtown Business District" (different from getSampleZoomElements which uses "Theatre District")
  // This follows the pattern of zoomToOnly() which takes a districtName parameter
  const districtName = "Downtown Business District";
  
  // Following the exact pattern of zoomToOnly() from PlatformReferenceApp:
  // Uses IafEvmUtils.apiUnwrapMmvCommadToEvmProperty to wrap the command
  // Uses IafEvmUtils.EVM_COMMANDS.ZOOM_TO as the command name (using EVM_COMMANDS instead of MMV_COMMANDS)
  // Uses generateUUID() for commandRef (same as uuid() in PlatformReferenceApp)
  // The field "hl_districtname" matches GIS_LAYERS[GIS_LAYER_NAMES.DISTRICTS].idField from PlatformReferenceApp
  // The layerName "Chicago POC Districts" matches GIS_LAYER_NAMES.DISTRICTS from PlatformReferenceApp
  const command = {
    commandName: IafEvmUtils.EVM_COMMANDS.ZOOM_TO,
    commandRef: generateUUID(),
    params: {
      elementId: districtName,
      extra: {
        field: "hl_districtname", // Same as GIS_LAYERS[GIS_LAYER_NAMES.DISTRICTS].idField
        layerNames: ["Chicago POC Districts"] // Same as [GIS_LAYER_NAMES.DISTRICTS]
      }
    }
  };
  
  // Return as array since command prop expects an array
  return [command];
};

/**
 * Format event logs for display in a textarea
 * Most recent events appear at the top
 * @param {Array|string|object} eventLogs - Event logs to format
 * @returns {string} Formatted event log string
 */
export const formatEventLogs = (eventLogs) => {
  if (!eventLogs) {
    return '';
  }
  
  // If eventLogs is an array, format each event (reverse order so newest appears first)
  if (Array.isArray(eventLogs)) {
    if (eventLogs.length === 0) {
      return '';
    }
    
    // Limit the number of events to prevent performance issues
    const maxEvents = 100;
    const eventsToProcess = eventLogs.length > maxEvents 
      ? eventLogs.slice(-maxEvents) // Take only the most recent events
      : eventLogs;
    
    // Reverse the array to show most recent events at the top
    const reversedLogs = [...eventsToProcess].reverse();
    
    try {
      const formattedEvents = [];
      for (let index = 0; index < reversedLogs.length; index++) {
        const event = reversedLogs[index];
        try {
          const timestamp = event.timestamp ? new Date(event.timestamp).toISOString() : '';
          let eventStr;
          
          if (typeof event === 'string') {
            eventStr = event;
          } else {
            try {
              // Use safe serialization to avoid circular references
              // Create a new Set for each event to prevent cross-event circular reference issues
              const safeEvent = safeSerialize(event, new Set(), 0, 5);
              eventStr = JSON.stringify(safeEvent, null, 2);
            } catch (e) {
              eventStr = `[Error formatting event: ${e.message}]`;
            }
          }
          
          formattedEvents.push(`[${timestamp}] ${eventStr}`);
        } catch (e) {
          formattedEvents.push(`[Error processing event ${index}: ${e.message}]`);
        }
      }
      return formattedEvents.join('\n\n');
    } catch (e) {
      return `[Error formatting event logs array: ${e.message}]`;
    }
  }
  
  // If it's a string, return as-is
  if (typeof eventLogs === 'string') {
    return eventLogs;
  }
  
  // Otherwise, try to safely stringify
  try {
    const safeEventLogs = safeSerialize(eventLogs);
    return JSON.stringify(safeEventLogs, null, 2);
  } catch (e) {
    return `[Error formatting event logs: ${e.message}]`;
  }
};

// ============================================================================
// LocalStorage Cache Utilities for Examples
// ============================================================================

const UE_CONFIG_STORAGE_KEY = 'iaf-viewer-examples-ue-config';
const ARCGIS_CONFIG_STORAGE_KEY = 'iaf-viewer-examples-arcgis-config';

/**
 * Load cached UE config (server and app) from localStorage
 * @returns {Object|null} Cached config object with server and app, or null if not found
 */
export const loadCachedUeConfig = () => {
  try {
    const cached = localStorage.getItem(UE_CONFIG_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('[IafViewerExUtils] Failed to load cached UE config from localStorage:', e);
  }
  return null;
};

/**
 * Save UE config (server and app) to localStorage
 * @param {Object} config - Config object containing server and app properties
 */
export const saveCachedUeConfig = (config) => {
  try {
    if (config && typeof config === 'object') {
      // Only cache server and app properties
      const configToCache = {
        server: config.server,
        app: config.app
      };
      
      // Only save if both server and app exist
      if (configToCache.server && configToCache.app) {
        localStorage.setItem(UE_CONFIG_STORAGE_KEY, JSON.stringify(configToCache));
      }
    }
  } catch (e) {
    console.warn('[IafViewerExUtils] Failed to save UE config to localStorage:', e);
  }
};

/**
 * Load cached ArcGIS config (portalUrl, apiKey, model) from localStorage
 * @returns {Object|null} Cached config object with portalUrl, apiKey, and model, or null if not found
 */
export const loadCachedArcgisConfig = () => {
  try {
    const cached = localStorage.getItem(ARCGIS_CONFIG_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('[IafViewerExUtils] Failed to load cached ArcGIS config from localStorage:', e);
  }
  return null;
};

/**
 * Save ArcGIS config (portalUrl, apiKey, model) to localStorage
 * @param {Object} config - Config object containing portalUrl, apiKey, and model properties
 */
export const saveCachedArcgisConfig = (config) => {
  try {
    if (config && typeof config === 'object') {
      // Only cache portalUrl, apiKey, and model properties
      const configToCache = {
        portalUrl: config.portalUrl,
        apiKey: config.apiKey,
        model: config.model
      };
      
      // Only save if portalUrl and apiKey exist (model is optional)
      if (configToCache.portalUrl && configToCache.apiKey) {
        localStorage.setItem(ARCGIS_CONFIG_STORAGE_KEY, JSON.stringify(configToCache));
      }
    }
  } catch (e) {
    console.warn('[IafViewerExUtils] Failed to save ArcGIS config to localStorage:', e);
  }
};

/**
 * Get sample modules availability object from arcgisModules
 * @param {Object|null} arcgisModules - ArcGIS modules object from IafViewer
 * @returns {Object|string} Object with module availability status or 'arcgisModules not available'
 */
export const getSampleArcGisModules = (arcgisModules) => {
  if (!arcgisModules) {
    return 'arcgisModules not available';
  }
  
  return {
    GraphicsLayer: arcgisModules.GraphicsLayer ? 'available' : 'not available',
    SketchViewModel: arcgisModules.SketchViewModel ? 'available' : 'not available',
    SpatialReference: arcgisModules.SpatialReference ? 'available' : 'not available',
    Graphic: arcgisModules.Graphic ? 'available' : 'not available',
    SceneView: arcgisModules.SceneView ? 'available' : 'not available',
    Point: arcgisModules.Point ? 'available' : 'not available',
    WebScene: arcgisModules.WebScene ? 'available' : 'not available'
  };
};

/**
 * Create onIafMapReady log object from mapInstance
 * @param {Object|null} mapInstance - Map instance object from onIafMapReady callback
 * @returns {Object} Log object with all callback data
 */
export const createOnIafMapReadyLog = (mapInstance) => {
  const arcgisModules = mapInstance?.arcgisModules;
  const availableModules = arcgisModules ? Object.keys(arcgisModules).sort() : [];
  
  return {
    timestamp: new Date().toISOString(),
    mapInstance: mapInstance ? 'available' : 'null',
    sceneView: mapInstance?.sceneView ? 'available' : 'null',
    scene: mapInstance?.scene ? 'available' : 'null',
    camera: mapInstance?.camera ? 'available' : 'null',
    labelsLayer: mapInstance?.labelsLayer ? 'available' : 'null',
    labelPoints: mapInstance?.labelPoints ? 'available' : 'null',
    focusSelector: mapInstance?.focusSelector,
    arcgisModules: arcgisModules ? 'available' : 'null',
    availableModulesCount: availableModules.length,
    availableModules: availableModules,
    sampleModules: getSampleArcGisModules(arcgisModules)
  };
};

// Storage key for GIS (Mapbox) config
const GIS_CONFIG_STORAGE_KEY = 'iaf-viewer-examples-gis-config';

/**
 * Load cached GIS config (token) from localStorage
 * @returns {Object|null} Cached config object with token, or null if not found
 */
export const loadCachedGisConfig = () => {
  try {
    const cached = localStorage.getItem(GIS_CONFIG_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('[IafViewerExUtils] Failed to load cached GIS config from localStorage:', e);
  }
  return null;
};

/**
 * Save GIS config (token) to localStorage
 * @param {Object} config - Config object containing token property
 */
export const saveCachedGisConfig = (config) => {
  try {
    if (config && typeof config === 'object') {
      // Only cache token property
      const configToCache = {
        token: config.token
      };
      
      // Save if token exists (allow empty string to clear)
      if (configToCache.token !== undefined && configToCache.token !== null) {
        console.log('[IafViewerExUtils] Saving GIS config to localStorage:', GIS_CONFIG_STORAGE_KEY, configToCache);
        localStorage.setItem(GIS_CONFIG_STORAGE_KEY, JSON.stringify(configToCache));
      }
    }
  } catch (e) {
    console.warn('[IafViewerExUtils] Failed to save GIS config to localStorage:', e);
  }
};

