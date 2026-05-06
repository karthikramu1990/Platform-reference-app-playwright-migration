import {v4 as uuid} from "uuid";
import { WidgetIds, WidgetMode } from "./enums/widgets";
import IafSet from "./iafSet";
import { useCallback, useRef, useState, useEffect } from 'react';
import { GisElevationMode, GisFederatedMode } from "./enums/gis";
import IafUtils from "../core/IafUtils.js";

export default class EvmUtils {

    static generateUUID() {
        var uuid = '', i, random;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    }

    static ARCGIS_PARENT_PATH="https://js.arcgis.com/4.31/";
    static ARCGIS_DEFAULT_MODULES_TO_LOAD = {
        "esri/kernel": "esriNS",
        "esri/config": "esriConfig",
        "esri/core/reactiveUtils": "reactiveUtils",
        "esri/geometry/support/webMercatorUtils": "webMercatorUtils",
        "esri/Camera": "Camera",
        "esri/geometry/Point": "Point",
        "esri/geometry/Polyline": "Polyline",
        "esri/geometry/Mesh": "Mesh",
        "esri/geometry/SpatialReference": "SpatialReference",
        "esri/geometry/geometryEngine": "geometryEngine",
        "esri/geometry/projection": "projection",
        "esri/layers/FeatureLayer": "FeatureLayer",
        "esri/layers/TileLayer": "TileLayer",
        "esri/layers/SceneLayer": "SceneLayer",
        "esri/layers/GroupLayer": "GroupLayer",
        "esri/layers/GraphicsLayer": "GraphicsLayer",
        "esri/layers/VectorTileLayer": "VectorTileLayer",
        "esri/layers/PointCloudLayer": "PointCloudLayer",
        "esri/layers/BuildingSceneLayer": "BuildingSceneLayer",
        "esri/WebScene": "WebScene",
        "esri/symbols/CIMSymbol": "CIMSymbol",
        "esri/symbols/PictureMarkerSymbol": "PictureMarkerSymbol",
        "esri/symbols/TextSymbol": "TextSymbol",
        "esri/renderers/PointCloudUniqueValueRenderer": "PointCloudUniqueValueRenderer",
        "esri/Graphic": "Graphic",
        "esri/layers/support/LabelClass": "LabelClass",
        "esri/layers/support/FeatureFilter": "FeatureFilter",
        "esri/rest/support/Query": "Query",
        "esri/identity/IdentityManager": "IdentityManager",
        "esri/widgets/BasemapGallery": "BasemapGallery",
        "esri/widgets/Expand": "Expand",
        "esri/widgets/Search": "Search",
        "esri/widgets/Sketch/SketchViewModel": "SketchViewModel",
        "esri/smartMapping/renderers/color": "colorRendererCreator",
        "esri/smartMapping/renderers/type": "typeRendererCreator",
        "esri/views/SceneView": "SceneView"
    };

    static ARCGIS_SIMPLE_LAYER_TYPES = [
        "TileLayer",
        "SceneLayer",
        "FeatureLayer",
        "GraphicsLayer",
        "VectorTileLayer",
        "PointCloudLayer",
        "BuildingSceneLayer"
    ];    

    // --------------------------------------------------------------------------------------------------------
    // To be deprecated / rebranded soon
    // --------------------------------------------------------------------------------------------------------

    // To be deprecated
    static MMV_COMMANDS = Object.freeze({
        SET_CAMERA: "set_camera", 
        ZOOM_TO: "zoom_to", 
        ZOOM_IN: "zoom_in",
        THEME_ELEMENTS: "theme_elements", 
        SLICE_ELEMENTS: "slice_elements",
        SHOW_LAYERS: "show_layers",
        ADD_GRAPHICS: "add_graphics", 
        REMOVE_GRAPHICS: "remove_graphics", 
        CUSTOM: "custom"
    })

    // To be deprecated
    static MMV_EVENTS = Object.freeze({ 
        CAMERA_UPDATE: "camera_update", 
        SELECTION_UPDATE: "selection_update",
        POINTER_MOVE: "pointer_move",
        POINTER_EXIT: "pointer_exit",
        POINTER_ENTER: "pointer_enter",
        VIEWER_READY: "viewer_ready",
        VIEWER_BUSY: "viewer_busy",
        VIEWER_ERROR: "viewer_error",
        COMMAND_RECEIVED: "command_received",
        LAYERS_UPDATE: "layers_update",
        GRAPHIC_ADDED: "graphic_added",
        GRAPHIC_DELETED: "graphic_deleted",
        GRAPHIC_UPDATED: "graphic_updated",        
    })

    // To be deprecated
    static MMV_ERRORS = Object.freeze({ 
        MISSING_CONFIG: "missing_config", 
        LOGIN: "login",
        AUTHENTIFICATION: "authentification",
        LOADING: "loading",
        INTERNAL: "internal",
    })

    static EmptyCBFun = () => {}

    static EVM_COMMANDS = EvmUtils.MMV_COMMANDS;
    static EVM_EVENTS = EvmUtils.MMV_EVENTS;
    static EVM_ERRORS = EvmUtils.MMV_ERRORS;

    static EVMDisplayMode = WidgetMode;
    static EVMDrawMode = {
      Wireframe: 0,
      Shaded: 1,
      WireframeOnShaded: 2,
      HiddenLine: 3,
      XRay: 4,
      Gooch: 5,
      Toon: 6,
      Glass: 11
    };

    static EvmElevationMode = GisElevationMode;
    /** Same as {@link GisFederatedMode} — use `Outline` for GLTF outline federated mode (not `Soft`). */
    static EvmFederatedMode = GisFederatedMode;

    static EVMMode = WidgetIds;

    static EVMWidgetAlignment = {
        LEFT_TOP: 'LeftTop',
        LEFT_BOTTOM: 'LeftBottom',
        RIGHT_TOP: 'RightTop',
        RIGHT_BOTTOM: 'RightBottom',
    };
    
    // Command Builder
    static EvmCommandBuilder = {
        add_graphics: (cmd) => {
            if (!cmd) return {};
            const graphics = Array.isArray(cmd) ? cmd : [cmd];
            return {
                commandName: EvmUtils.MMV_COMMANDS.ADD_GRAPHICS,
                params: { graphics }
            };
        },
        remove_graphics: (cmd) => {
            if (!cmd) return {};
            const graphics = Array.isArray(cmd) ? cmd : [cmd];
            return {
                commandName: EvmUtils.MMV_COMMANDS.REMOVE_GRAPHICS,
                params: {
                    graphics,
                    ids: graphics.map(item => item.id)
                }
            };
        },
        add_layers: (cmd) => {
            if (!cmd) return {};
            const layers = Array.isArray(cmd) ? cmd : [cmd];
            return {
                commandName: EvmUtils.MMV_COMMANDS.SHOW_LAYERS,
                params: { toShow: layers}
            };
        },
        remove_layers: (cmd) => {
            if (!cmd) return {};
            const layers = Array.isArray(cmd) ? cmd : [cmd];
            return {
                commandName: EvmUtils.MMV_COMMANDS.SHOW_LAYERS,
                params: { toHide: layers}
            };
        },
        add_zoomElements: (cmd) => {
            if (!cmd) return [];

            const elements = Array.isArray(cmd) ? cmd : [cmd];

            return elements.map(element => ({
                commandName: EvmUtils.MMV_COMMANDS.ZOOM_TO,
                params: element
            }));
        },    
        add_camera: (cmd) => {
            if (!cmd) return {};
            const camera = cmd; // Array.isArray(cmd) ? cmd : [cmd];
            return {
                commandName: EvmUtils.MMV_COMMANDS.SET_CAMERA,
                params: camera
            };
        },            
        add_slicedElements: (cmd) => {
            if (!cmd) return [];

            const elements = Array.isArray(cmd) ? cmd : [cmd];

            return elements.map(element => ({
                commandName: EvmUtils.MMV_COMMANDS.SLICE_ELEMENTS,
                params: element
            }));
        },
        remove_slicedElements: (cmd) => {
            if (!cmd) return [];

            const elements = Array.isArray(cmd) ? cmd : [cmd];

            return elements.map(element => ({
                commandName: EvmUtils.MMV_COMMANDS.SLICE_ELEMENTS,
                params: element
            }));
        },
        add_themeElements: (cmd) => {
            if (!cmd) return [];

            const elements = Array.isArray(cmd) ? cmd : [cmd];

            return elements.map(element => ({
                commandName: EvmUtils.MMV_COMMANDS.THEME_ELEMENTS,
                params: element
            }));
        },
        remove_themeElements: (cmd) => {
            if (!cmd) return [];

            const elements = Array.isArray(cmd) ? cmd : [cmd];

            return elements.map(element => ({
                commandName: EvmUtils.MMV_COMMANDS.THEME_ELEMENTS,
                params: element
            }));
        }        
    };

    static EvmBuilderMap = {
        [EvmUtils.MMV_COMMANDS.ADD_GRAPHICS]: {
            add: EvmUtils.EvmCommandBuilder.add_graphics,
            remove: EvmUtils.EvmCommandBuilder.remove_graphics
        },
        [EvmUtils.MMV_COMMANDS.SHOW_LAYERS]: {
            add: EvmUtils.EvmCommandBuilder.add_layers,
            remove: EvmUtils.EvmCommandBuilder.remove_layers
        },
        [EvmUtils.MMV_COMMANDS.ZOOM_TO]: {
            add: EvmUtils.EvmCommandBuilder.add_zoomElements,
            remove: EvmUtils.EmptyCBFun
        },
        [EvmUtils.MMV_COMMANDS.SLICE_ELEMENTS]: {
            add: EvmUtils.EvmCommandBuilder.add_slicedElements,
            remove: EvmUtils.EvmCommandBuilder.remove_slicedElements
        },
        [EvmUtils.MMV_COMMANDS.THEME_ELEMENTS]: {
            add: EvmUtils.EvmCommandBuilder.add_themeElements,
            remove: EvmUtils.EvmCommandBuilder.remove_themeElements
        }            
    };

    static apiGetActiveEvmCount = (iafViewer) => {
        const enablers = [
            iafViewer.props.arcgis?.enable,
            iafViewer.props.arcgisOverview?.enable,
            iafViewer.props.ue?.enable,
            iafViewer.props.photosphere?.enable,
            iafViewer.props.gis?.enable,
            iafViewer.props.view3d?.enable,
            iafViewer.props.view2d?.enable
        ];

        // Count the number of active enablers (those that are true)
        const activeCount = enablers.filter(enable => enable === true).length;

        return activeCount;
    }

    static apiAddUuidToObjectArray(arr = []) {
        const isSingularElement = (item) =>
                                    (typeof item !== 'object' || item === null) && !Array.isArray(item);    
        return arr.map(item => {
            if (item && typeof item === 'object' && !item.uuid) {
            return { ...item, uuid: uuid() };
            } /* else if (isSingularElement(item)) {
                return { item, uuid: uuid() };
            } */
            return item;
        });
    }

    static apiAddUuidToObject(obj = {}) {
        if (typeof obj !== 'object' || obj === null) return obj;

        if (!obj.uuid) {
            return { ...obj, uuid: uuid() };
        }

        return obj;
    }

    static apiUnwrapMmvCommadToEvmProperty = (command, enable = true) => {
        let unwrappedCommand = command;

        if (!enable) return command;
        
        if (command?.commandName === 'custom') 
        {
            switch (command?.params?.commandName) 
            {
                case 'slice_elements':
                case 'filtermodel':
                    unwrappedCommand = EvmUtils.apiAddUuidToObject(command?.params?.params);
                    break;
                case 'show_layers':
                    unwrappedCommand = EvmUtils.apiAddUuidToObjectArray(command?.params?.params?.toShow);
                    break;

                default:
                    break;
            }
        } else {
            switch (command?.commandName) 
            {
                case EvmUtils.MMV_COMMANDS.THEME_ELEMENTS:
                    unwrappedCommand = EvmUtils.apiAddUuidToObject(command?.params);
                    break;
                case EvmUtils.MMV_COMMANDS.ZOOM_TO:
                    unwrappedCommand = EvmUtils.apiAddUuidToObject(command?.params);
                    break;              
                case EvmUtils.MMV_COMMANDS.SET_CAMERA:
                    unwrappedCommand = EvmUtils.apiAddUuidToObject(command?.params);
                    break;
                case EvmUtils.MMV_COMMANDS.ADD_GRAPHICS:
                    unwrappedCommand = EvmUtils.apiAddUuidToObjectArray(command?.params?.graphics)
                    break;                                    
                default:
                    break;                
            }
        }

        IafUtils.devToolsIaf && console.log('IafViewer.EvmUtils.unwrapMmvCommad', command, unwrappedCommand);

        return unwrappedCommand;
    }

    static apiCompareEvmProps = (
        prevProps,
        nextProps,
        type,
        {
            onAddCb = () => {},
            onRemoveCb = () => {},
            onChangeCb = () => {},
            logTitle = '',
            enableLogs = true,
            enableOptimized = true
        } = {}
    ) => {
        const normalizeToArray = val => {
            if (Array.isArray(val)) return val;
            if (val && typeof val === 'object' && Object.keys(val).length === 0) return [];
            return val ? [val] : [];
        };

        // Generate a [uuid, item] pair from any item
        const toIdItemPair = item => {
            if (item && typeof item === 'object' && 'uuid' in item) {
                return [item.uuid, item];
            } else if (typeof item === 'string' || typeof item === 'number') {
                return [item, item]; // treat primitive as both key and value
            }
            return [undefined, item]; // fallback
        };

        const safePrev = normalizeToArray(prevProps);
        const safeNext = normalizeToArray(nextProps);

        const prevMap = new Map(safePrev.map(toIdItemPair).filter(([id]) => id !== undefined));
        const nextMap = new Map(safeNext.map(toIdItemPair).filter(([id]) => id !== undefined));

        const prevIds = [...prevMap.keys()];
        const nextIds = [...nextMap.keys()];

        const addedIds = IafSet.Difference(nextIds, prevIds);
        const removedIds = IafSet.Difference(prevIds, nextIds);
        const changedIds = IafSet.Intersection(prevIds, nextIds);

        const addedItems = [];
        const removedItems = [];
        const changedItems = [];

        // Process removals first, then additions, then changes
        // This ensures old state is cleared before new state is applied
        for (const id of removedIds) {
            const item = prevMap.get(id);
            enableLogs && IafUtils.devToolsIaf && console.log(logTitle, '❌ Removed:', id);
            enableOptimized ? removedItems.push(item) : onRemoveCb(type, item);
        }

        for (const id of addedIds) {
            const item = nextMap.get(id);
            enableLogs && IafUtils.devToolsIaf && console.log(logTitle, '📌 Added:', id);
            enableOptimized ? addedItems.push(item) : onAddCb(type, item);
        }

        for (const id of changedIds) {
            const prev = prevMap.get(id);
            const next = nextMap.get(id);
            if (JSON.stringify(prev) !== JSON.stringify(next)) {
                enableLogs && IafUtils.devToolsIaf && console.log(logTitle, '🔄 Changed:', id);
                enableOptimized
                    ? changedItems.push({ id, prev, next })
                    : onChangeCb(type, id, prev, next);
            }
        }

        if (enableOptimized) {
            // Process removals first, then additions, then changes
            // This ensures old state is cleared before new state is applied
            if (removedItems.length) onRemoveCb(type, removedItems);
            if (addedItems.length) onAddCb(type, addedItems);
            if (changedItems.length) onChangeCb(type, changedItems);
        }
    };
}

export const useEvmArcgisPropsAndEvents = (gisConfig, options = {}) => {
  const {
    eventHandler = () => {},
    appId = '',
    title = 'IafViewer Evm Arcgis Props And Events Hook' // Optional consumer label for logging
  } = options;

  const logPrefix = `[useEvmArcgisPropsAndEvents][${title}]`;

  // 🔁 This ref always holds the latest handler
  const eventHandlerRef = useRef(eventHandler)

  const getInitialProps = () => {
    const serverUri = (typeof endPointConfig !== 'undefined' && endPointConfig.graphicsServiceOrigin) || '';
    const initial = {
      view2d: { enable: false },
      view3d: { enable: false },
      gis: { enable: false },
      arcgis: {
        enable: true,
        mode: 'arcgis', // To be deprecated
        appId,
        config: gisConfig,
        layers: [],
        themeElements: [],
        slicedElements: [],
        graphics: [],
        camera: {},
        eventHandler: (...args) => eventHandlerRef.current(...args),
        onIafMapReady: (obj) => {
          IafUtils.devToolsIaf && console.log(`${logPrefix} IafMap is ready`, obj);
          setIafMap(obj);
        },
        displayMode: EvmUtils.EVMDisplayMode.FULLSCREEN,
        showToolbar: false,
      },
      toolbarSize: 'none',
      serverUri
    };

    IafUtils.devToolsIaf && console.log(`${logPrefix} Initialized props:`, initial);
    return initial;
  };

  const [iafProps, setIafProps] = useState(getInitialProps);
  const [iafMap, setIafMap] = useState(null);

  useEffect(() => {
    eventHandlerRef.current = eventHandler
  }, [eventHandler])
  
  useEffect(() => {
    IafUtils.devToolsIaf && console.log(`${logPrefix} Updated iafProps`, iafProps);
  }, [iafProps]);

  const updateArcgisProps = useCallback((updates) => {
    IafUtils.devToolsIaf && console.log(`${logPrefix} updateArcgisProps`, updates);
    setIafProps(prev => {
      const updated = {
        ...prev,
        arcgis: {
          ...prev.arcgis,
          ...updates,
        },
      };
      IafUtils.devToolsIaf && console.log(`${logPrefix} New iafProps after update`, updated);
      return updated;
    });
  }, []);

  const getEffectiveLayers = (toShow, toHide) => {
    return IafSet.Difference(IafSet.Union(iafProps?.arcgis?.layers, toShow), toHide)    
  }

  // To be deprecated
  const getEffectiveLayersFromMmvCommand = (command) => {
    const toShow = command?.params?.params?.toShow ?? [];
    const toHide = command?.params?.params?.toHide ?? [];
    return IafSet.Difference(IafSet.Union(iafProps?.arcgis?.layers ?? [], toShow), toHide)    
  }


  return { 
    iafProps, 
    updateArcgisProps, 
    getEffectiveLayers,
    getEffectiveLayersFromMmvCommand,
    iafMap  
  };
};

export class EvmElementIdManager {
  constructor() {
    this._uuid = EvmUtils.generateUUID(); // Unique ID per instance
    IafUtils.devToolsIaf && console.log('EvmElementIdManager initialized', this._uuid);
  }

  // ----------------------------------------------------------------------------------------------------
  // Get a DOM elements by unique id
  // ----------------------------------------------------------------------------------------------------

  // Returns the base UUID
  getUuid = () => {
    return this._uuid;
  };

  // EVM-specific ID and DOM access
  getEvmUuid = (evmMode) => {
    return `${evmMode}_${this._uuid}`;
  };

  getEvmElementById = (evmMode) => {
    const evmUuid = this.getEvmUuid(evmMode);
    return evmUuid ? document.getElementById(evmUuid) : null;
  };  

  // General-purpose ID builder
  _getEvmElementUuid = (elementType, dimType = undefined) => {
    return dimType
      ? `${elementType}-${dimType}-${this._uuid}`
      : `${elementType}-${this._uuid}`;
  };

  getEvmElementUuidMeasureCanvas = (dimType) => {
    return this._getEvmElementUuid("measurecanvas", dimType);
  };

  getEvmElementUuidIafContainer = () => {
    return this._getEvmElementUuid("iaf-container");
  };

  getEvmElementUuidWebviewerContainer = () => {
    return this._getEvmElementUuid("webviewer-container");
  };

  getEvmElementUuidWidgetContainer = () => {
    return this._getEvmElementUuid("widget-container");
  };

  getEvmElementUuidGeoCoder = () => {
    return this._getEvmElementUuid("geocoder");
  };

  getEvmElementUuidViewer2DIcon = () => {
    return this._getEvmElementUuid("Viewer2DIcon");
  };

  getEvmElementUuidViewer3DIcon = () => {
    return this._getEvmElementUuid("Viewer3DIcon");
  };
  
  getEvmElementUuidArcgisIcon = () => {
    return this._getEvmElementUuid("ArcgisIcon");
  };

  getEvmElementUuidArcgisOverviewIcon = () => {
    return this._getEvmElementUuid("ArcgisOverviewIcon");
  };

  getEvmElementUuidUnrealEngineIcon = () => {
    return this._getEvmElementUuid("UnrealEngineIcon");
  };

  getEvmElementUuidPhotosphereIcon = () => {
    return this._getEvmElementUuid("PhotosphereIcon");
  };

  getEvmElementUuidViewer2DDragArea = () => {
    return `${this._getEvmElementUuid("Viewer2DIcon")}-drag-area`;
  };

  getEvmElementUuidViewer2DFullScreenButton = () => {
    return `${this._getEvmElementUuid("Viewer2DIcon")}-full-screen-button`;
  };

  getEvmElementUuidViewer2DHalfScreenButton = () => {
    return `${this._getEvmElementUuid("Viewer2DIcon")}-half-screen-button`;
  };

  getEvmElementUuidDistance = () => {
    return this._getEvmElementUuid("distance-container");
  };

  getEvmElementUuidToolbarSize = (size) => {
    return this._getEvmElementUuid(`toolbar-size-${size}`);
  };

  getEvmElementUuidShadingSubmenu = () => {
    return this._getEvmElementUuid("shading-submenu");
  };

  getEvmElementUuidViewSubmenu = () => {
    return this._getEvmElementUuid("view-submenu");
  };

  getEvmElementUuidNavigationSubmenu = () => {
    return this._getEvmElementUuid("navigation-submenu");
  };

  getEvmElementUuidAnnotationsSubmenu = () => {
    return this._getEvmElementUuid("annotations-submenu");
  };

  // ----------------------------------------------------------------------------------------------------
  // Get a DOM elements by global/static id (not UUID based)
  // ----------------------------------------------------------------------------------------------------
  getEvmElementGlobalIdArcgisBaseGallery = () => {
    return document.getElementById('arcgis-base-gallery');
  }
}
