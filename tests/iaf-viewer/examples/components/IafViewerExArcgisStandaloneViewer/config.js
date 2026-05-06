// ArcGIS Configuration for Standalone ArcGIS Viewer Example

// Initial camera position (Chicago example - can be customized)
export const INITIAL_POSITION_CAMERA = {
  position: { x: -87.667, y: 41.863, z: 3262.319 },
  rotation: { pitch: 50.063, yaw: 61.458 }
};

// Layer names matching PlatformReferenceApp
export const GIS_LAYER_NAMES = {
  BUILDINGS: "District Buildings - ChicagoBuildingsInDistricts",
  DISTRICTS: "Chicago POC Districts",
  BUILDINGS_LABEL_POINTS: "Chicago Building Label Points with Districts - Chicago Building Label Points with Districts",
  DISTRICTS_LABEL_POINTS: "Chicago Districts Label Points - Chicago Districts Centers 3d label height",
  EXCHANGE_BUILDING: "Exchange Building - Exchange Building",
  BULDINGS_POINTS: "ChicagoBuildingPoints_Districts",
};

// District names matching PlatformReferenceApp
export const GIS_DISTRICT_NAMES = {
  DOWNTOWN: "Downtown Business District",
  MILE: "Magnificient Mile",
  PARK: "Millenium Park",
  SLOOP: "South Loop",
  STREETV: "Streeterville",
  THEATRE: "Theatre District",
  WLOOP: "West Loop"
};

// Building names matching PlatformReferenceApp
export const GIS_BUILDING_NAMES = {
  TT: 'Chicago Title & Trust Building',
  Randolph: 'Randolph Tower',
  Dublin: 'Dublin Building',
  Cadillac: 'Cadillac Palace Theatre',
  Kemper: 'Kemper Building'
};

// Specificity values for layer prioritization
const SPECIFICITIES = {
  [GIS_LAYER_NAMES.DISTRICTS]: 100,
  [GIS_LAYER_NAMES.BUILDINGS]: 200,
};

// Helper functions to validate IDs
const isADistrictId = (id) => {
  return Object.values(GIS_DISTRICT_NAMES).includes(id);
};

const isABuildingId = (id) => {
  return Object.values(GIS_BUILDING_NAMES).includes(id);
};

// Layer information configuration
// This tells the GIS system how to identify and work with each layer
export const GIS_LAYERS = {
  [GIS_LAYER_NAMES.DISTRICTS]: {
    idField: "hl_districtname",
    isIdValidForLayer: isADistrictId,
    elementType: "district",
    highlight: {
      triggerEvent: 'pointer-move',
      highlightableIds: undefined // undefined == all ids
    },
    specificity: SPECIFICITIES[GIS_LAYER_NAMES.DISTRICTS]
  },
  [GIS_LAYER_NAMES.BUILDINGS]: {
    idField: "osm_id",
    idFieldType: "Integer",
    isIdValidForLayer: isABuildingId,
    elementType: "building",
    highlight: {
      triggerEvent: 'pointer-move',
      highlightableIds: undefined // undefined == all ids
    },
    specificity: SPECIFICITIES[GIS_LAYER_NAMES.BUILDINGS],
    relatedLayersField: {
      [GIS_LAYER_NAMES.DISTRICTS]: 'hl_district'
    },
    outFields: ["*"],
    popupTemplate: {
      title: `{name}`,
      content: [{
        type: "fields",
        fieldInfos: [{
          fieldName: 'hl_district',
          label: "District"
        }, {
          fieldName: 'hl_bldght',
          label: "Building Height",
          format: {
            places: 2,
            digitSeparator: true
          }
        }]
      }]
    }
  }
};

// ArcGIS Configuration - uses sample secret values from IafViewerExUtils
export const ARCGIS_CONFIG = {
  // Required ArcGIS configuration properties (from getSampleArcGisConfig)
  portalUrl: "YOUR_ARCGIS_PORTAL_URL_HERE", // e.g. https://gis.hlplanning.com/arcgis
  apiKey: "YOUR_ARCGIS_API_KEY_HERE",
  model: "YOUR_ARCGIS_MODEL_ID_HERE", // e.g. 6745f5a0f1df4812a26925c19fdab6f8
  
  // Optional configuration
  sceneWKID: 102100,
  shadows: false,
  groundOpacity: 1,
  popUpEnabled: false,
  highlightOnClick: false,
  highlightTheme: {
    color: [255, 255, 0, 1],
    haloColor: "white",
    haloOpacity: 0.9,
    fillOpacity: 0.2,
    shadowColor: "black",
    shadowOpacity: 0.5
  },
  // Camera position coordinates (dependent on the model's coordinate system)
  initialCameraPosition: INITIAL_POSITION_CAMERA,
  // Optional: Add components like zoom, compass
  components: ["zoom", "compass"],
  showBasemapGallery: true,
  // Hidden layers - layers that should be hidden by default
  hiddenLayers: [
    GIS_LAYER_NAMES.BUILDINGS_LABEL_POINTS,
    GIS_LAYER_NAMES.DISTRICTS_LABEL_POINTS
  ],
  // Layer information - tells the GIS system how to identify and work with each layer
  layerInfo: GIS_LAYERS
};

