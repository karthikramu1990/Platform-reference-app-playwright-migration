// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 13-06-23    ATK        PLAT-2728   Created. Revamped IafViewer Coloring Mechanism
// 06-07-23    HSK                    Added other props 
// 14-07-23    HSK                    Added showNotification in PropertyStore
// 10-01-24    RRP        PLAT-3917   Introduce a new IafViewer property enableFocusMode
// 05-01-23    HSK        PLAT-3656   Introduce enable2DViewer in PropertyStore
// 18-01-24    RRP        PLAT-4001   Property Store | modelVersionId to load the specified model version | Latest version by default as it happens now
// 23-01-24    RRP        PLAT-4025   Update Reference App to consume all props and callbacks of IafViewerDBM
// 23-01-24    RRP        PLAT-4069   Update Reference App to consume all props and callbacks of IafViewerDBM
// -------------------------------------------------------------------------------------

import EvmUtils from "../common/evmUtils";
import { IafMathUtils } from "../core/IafMathUtils";

// ATK
// CallbackStore and PropertyStore is more of logical division for readbility
// Both eventually come as the IafViewerDBM props
//

const PropertyStore = {
    model: undefined
        /* 
        Description : Accepts model metadata to set the model.
        Range of value : Model metadata
        Default value : Not Applicable. This *must* be passed from the consuming application.
        Optional: No
        */
    , modelVersionId: undefined
        /*
        Description: Accepts the version of the model. If not provided, the latest version would be used.
        Range of values: String (Model version id)
        Default value: Not exactly applicable. This would be the lastest version by default.
        Optional: Yes
        */
    , serverUri: "https://api.invicara.com/"
        /*
        Description: Specifies the URI of the graphics service origin.
        Range of value: String
        Default value: 'https://api.invicara.com/'
        Optional: No
        */

    , showToolTip: true
        /* 
        Description : Value used to show/hide tooltip
        Range of value : true,false
        Default value : true
        Optional: Yes
        */

    , sidePanelColor: '#1D1D1D'
        /* 
        Description : Sets the color of the side panel. ex: setting panel 
        Range of value : Hex Code,RGB Value,Named Colors
        Default value : '#1D1D1D'
        Optional: Yes
        */

    , showSidePanel: false
        /*
        Description : When false, the side panel is hidden (display: none). When the user clicks one of the panel toolbar buttons
                      (Settings, Markups, Cutting Planes, GIS, Load Config, Dev Tools, or Walk), the panel is shown and overrides this.
        Range of value : Boolean
        Default value : false
        Optional: Yes
        */
    
    , selection: undefined
        /*
        Description : Array of selected element ids.
            Elements passed here will be highlighted/selected.
        Range of value : Array
        Default value : undefined as it changes acoording to different models
        Optional: Yes
        */
    
    , sliceElementIds: undefined
        /*
        Description : Array of isolated element ids.
            If this has values -> the model goes into glass mode (only these elements stay visible).
            If empty -> the model stays in shaded mode.        
        Range of value : Array
        Default value : undefined as it changes acoording to different models
        Optional: Yes
        */

    , hiddenElementIds: undefined
        /*
        Description : Array of hidden element ids.
        Range of value : Array
        Default value : undefined as it changes acoording to different models
        Optional: Yes
        */

    , spaceElementIds: undefined
        /*
        Description: Element IDs for the spaces in the model.
        Range of value: Array of element IDs
        Default value: Not Applicable
        Optional: Yes
        */

    , settings: undefined
        /*
        Description : Object containing settings if saved
        Range of value : Object
        Default value : undefined as it changes acoording to different models
        Optional: Yes
        */

    , colorGroups: undefined
        /*
        Description :  Array of color group objects containing color, opacity, and elementIds.
        Range of value : Array, color : hex or rgb code, opacity: 0 to  1, elementIds: Array
        Default value : undefined as it changes acoording to different models

        Each color group object has the following properties:
        - groupName: String
            - Description: The name of the color group.
            - Range of value: Any string value.
        
        - colors: Array of color objects
            - Description: An array of color objects representing different colors within the group.
            - Range of value: Array

        Each color object within the colors array has the following properties:
        - color: String
            - Description: The color value in hexadecimal or RGB format.
            - Range of value: Hex or RGB code.

        - opacity: Number
            - Description: The opacity value of the color, ranging from 0 to 1.
            - Range of value: 0 to 1.

        - elementIds: Array
            - Description: An array of element IDs associated with the color.
            - Range of value: Array of element IDs. 
        Optional: Yes
        */
        /*
         Description : Object containing toolbar button properties.
        Range of value : Object
        Default value : undefined
        Optional: Yes
        */

    , topics: undefined
        /*
        Description: Topics associated with the model.
        Range of value: Array of topics
        Default value: undefined
        Optional: Yes
        */

    , viewerResizeCanvas: undefined
        /*
        Description : A flag to tell the viewer it needs to resize the canvas when the size of container of the viewer is changed
        Range of value : true or false
        Default value : undefined as it changes acoording to different models
        Optional: Yes
        */

    , isIpaDev: false
        /*
        Description: Controls whether the application is in development mode.
        Range of value: Boolean (true or false)
        Default value: false
        Optional: Yes
        */

    , units: undefined
        /*
        Description: Sets the unit of measurement for the model.
        Range of value: String ("mm", "foot", "ft", "inch", "in", "meter", "m")
        Default value: undefined
        Optional: Yes
        */

    , cuttingPlaneValues: undefined
       /*
        Description: Specifies the minimum values for cutting planes along the x, y, and z axes.
        Range of value: Object with x, y, and z properties, each representing the minimum value for the respective axis.
        Default value: undefined
        Optional: Yes
        */

    , onHoverIconColor : 'invert(40%) sepia(86%) saturate(6224%) hue-rotate(311deg) brightness(83%) contrast(101%)'
        /* 
        Description : Sets the color of the toolbar icon on hovering panel. ex: reset button
        Range of value : Hex Code,RGB Value,Named Colors
        Default value : 'invert(40%) sepia(86%) saturate(6224%) hue-rotate(311deg) brightness(83%) contrast(101%)'
        Optional: Yes
        */

    , onActiveIconColor : 'invert(40%) sepia(86%) saturate(6224%) hue-rotate(311deg) brightness(83%) contrast(101%)'
        /* 
        Description : Sets the color of the toolbar icon when it is active. ex: Focus Mode
        Range of value : Hex Code,RGB Value,Named Colors
        Default value : 'invert(40%) sepia(86%) saturate(6224%) hue-rotate(311deg) brightness(83%) contrast(101%)'
        Optional: Yes
        */

    , toolbarColor: '#333333'
        /* 
        Description : Sets the color of the toolbar.
        Range of value : Hex Code,RGB Value,Named Colors
        Default value : '#333333'
        Optional: Yes
        */

    , isShowNavCube: true
        /*
        Description: Toggles the display of the navigation cube.
        Range of value: Boolean (true or false)
        Default value: true
        Optional: Yes
        */

    , showNotification: true
         /*
        Description: Toggles the display of the notification.
        Range of value: Boolean (true or false)
        Default value: true
        Optional: Yes
        */

    , enableFocusMode: true
        /*
        Description: Enables or disables the focus mode.
        Range of value: Boolean (true or false)
        Default value: true
        Optional: Yes
        */

    , enable2DViewer: true
        /*
        Description: Toggles the display of the 2D viewer.
        Range of value: Boolean (true or false)
        Default value: true
        Optional: Yes
        */
    , btns: {
        Orthographic: {
            /*
            Description: Toggles the display of the Orthographic button.
            Range of value: Boolean (true or false)
            Default value: false
            Optional: Yes
            */
            display: true
        },
        Analytics: {
            /*
            Description: Toggles the display of the Analytics button.
            Range of value: Boolean (true or false)
            Default value: false
            Optional: Yes
            */
            display: true
        },
        viewer2D: {
            /*
            Description: Toggles the display of the viewer2D button.
            Range of value: Boolean (true or false)
            Default value: false
            Optional: Yes
            */
            display: true
        },
        Reset: {
            /*
            Description: Toggles the display of the Reset button.
            Range of value: Boolean (true or false)
            Default value: true
            Optional: Yes
            */
            display: true
        },
        Projection: {
            /*
            Description: Toggles the display of the Projection button.
            Range of value: Boolean (true or false)
            Default value: false
            Optional: Yes
            */
            display: true
        },
        View: {
            /*
            Description: Toggles the display of the View button.
            Range of value: Boolean (true or false)
            Default value: true
            Optional: Yes
            */
            display: true
        },
        Shading: {
            /*
            Description: Toggles the display of the Shading button.
            Range of value: Boolean (true or false)
            Default value: false
            Optional: Yes
            */
            display: true
        },
        Navigation: {
            /*
            Description: Toggles the display of the Navigation button.
            Range of value: Boolean (true or false)
            Default value: false
            Optional: Yes
            */
            display: true
        },
        Measurement: {
            /*
            Description: Toggles the display of the Measurement button.
            Range of value: Boolean (true or false)
            Default value: false
            Optional: Yes
            */
            display: true
        },
        Utilities: {
            /*
            Description: Toggles the display of the Utilities button.
            Range of value: Boolean (true or false)
            Default value: false
            Optional: Yes
            */
            display: true
        },
        Settings: {
            /*
            Description: Toggles the display of the Settings button.
            Range of value: Boolean (true or false)
            Default value: false
            Optional: Yes
            */
            display: true
        }
    },
    enableOptimizedSelection: true,
    /*
        Description: `enableOptimizedSelection` represents a function that efficiently select nodeIds of 3D & 2D based on a selected asset element.
        It utilizes a performance-optimized algorithm to improve selection speed and unnecassary rerendering
        Default value: false
    */
    pdf2DUrl: null,
    /*
        Description: `pdf2DUrl` is a property used to store the URL of a PDF document related to 2D assets.
        This URL points to the location where the PDF can be accessed.
        Default value: ""
    */
    // allEntities:  [
    //     {
    //         _id: "",
    //         /*
    //         Description: Unique identifier for the element.
    //         Range of value: String
    //         */
    //         EntityName: "",
    //         /*
    //         Description: Name or identifier of the entity.
    //         Range of value: String
    //         */
    
    //         ElementCategory: "",
    //         /*
    //         Description: Category of the element.
    //         Range of value: String
    //         */
    
    //         ElementType: "",
    //         /*
    //         Description: Type of the element.
    //         Range of value: String
    //         */
    //         properties: {
    //         /*
    //         Description: Object containing various properties of the element.
    //         Each property has the following structure:
    //         */
    //             dName: "",
    //             /*
    //             Description: Display name of the property.
    //             Range of value: String
    //             */
    
    //             val: {},
    //             /*
    //             Description: Value of the property.
    //             Range of value: Any
    //             */
    
    //             type: ""
    //             /*
    //             Description: Type of the property value.
    //             Range of value: String
    //             */
    //         },
    //         modelViewerIds: []
    //         /*
    //         Description: Array of Element IDs.
    //         Range of value: Array of Strings
    //         */
    //     }
    // ],
    workflow: {
        list: [ 
            {
                uuid: 1, 
                timeInSeconds: 4.5,
                loop: true,
                script: []
            }
        ],
        active: undefined // Change this to the desired uuid
    }
    /*  
        Description: One or more animation workflows each containing an array of animations.
            list: Array of workflows
            active: Active workflow uuid
            script: Array of animations
            animation: Array of frames
            frame types: {
                        Scale: "Scale",
                        Rotation: "Rotation",
                        Translation: "Translation",
                        Opacity: "Opacity",
                        Visibility: "Visibility",
                        Color: "Color",
                        Markup: "Markup",
                        Sprite: "Sprite"
            }
            animation markup types: {
                Tooltip: "Tooltip",
                Cross: "Cross",
                Rectangle: "Rectangle",

                LineLeft: "LineLeft",
                LineRight: "LineRight",
                LineTop: "LineTop",
                LineBottom: "LineBottom",
                LineDiagonalAscend: "LineDiagonalAscend",
                LineDiagonalDescend: "LineDiagonalDescend"
            }
            animation sprite types: {
                Static: "Static",
                Gif: "Gif"
            }
        e.g. 
        script: [
                  {
                      elementIds: [302],
                      type: "Translation",
                      frames: [
                          {x: 0, y: 0, z: 0},
                          {x: 300, y: 0, z: 0}
                      ],
                  },
                  {
                      elementIds: [303],
                      type: "Markup",
                      frames: [
                          {
                              type: "Tooltip",
                              status: "Warning", 
                              text: "Unexpected rise in temperature", 
                              blink: true    
                          }
                      ]
                  },
                ]
    */,
    modelComposition: {
        defaultFederationType: "SingleModel"
        /*
        Description: Specifies the default federation type for the viewer.
        Range of value: "SingleModel", "Project", or "MultiModel"
        Default value: "SingleModel"
        Optional: Yes
        
        Values:
            - "SingleModel": Only one model is loaded, determined by the modelId and modelVersionId properties.
            - "Project": All models in the current workspace or namespace are loaded.
            - "MultiModel": All specified models in IafModel are loaded based on a custom model structure. This mode is currently not exposed.
        */
       , clusteredModels: []
        /*
        Description: Array of clusters. Considered only when defaultFederationType is MultiModel or Project. Two semantics:
        (1) Model filter: When non-empty, only model IDs that appear in any cluster are considered
            (restricts the model list instead of loading all project models from IafProjectUtils.getModels).
        (2) Outline clustering: Each cluster is a set of model IDs that share the same outline (one parent building).
            When loading GIS outline GLBs, one GLB is rendered per cluster.
        Each cluster may be:
        - An array of model ID strings (legacy): e.g. ["id1","id2"]
        - An object with modelIds (or ids) plus optional map/display properties:
          { modelIds?: string[], ids?: string[], center?: { lng: number, lat: number }, altitude?: number, id?: string, name?: string, title?: string, bearing?: number }
        Example (array form): [["id1","id2"],["id3"]]
        Example (object form): [{ modelIds: ["id1","id2"], center: { lng: 77.719044, lat: 13.199456 }, altitude: 0, id: "gp", name: "Garden Pavilion" }, { modelIds: ["id3"], id: "t2", name: "Terminal 2" }]
        Range of value: Array of (string[] or { modelIds|ids, center?, altitude?, id?, name?, title?, bearing? })
        Default value: []
        Optional: Yes
        */
        , initial: {
            Structural:   { load: false,  visible: false  },
            Architectural: { load: true, visible: true },
            Mechanical:   { load: false,  visible: false },
            Electrical:   { load: false, visible: false },
            Plumbing:     { load: false, visible: false },
            
            FireProtection: { load: false, visible: false },
            Infrastructural: { load: false, visible: false },
            default:      { load: false, visible: false }
        }
        /*
            Description: Specifies the initial disciplines to be loaded when the viewer is initialized.
            Range of value: Json Object containing boolean values
            Default value: initial.Architectural: true, initial.Structural: false, initial.Mechanical: false, initial.Electrical: false, initial.Plumbing: false, initial.FireProtection: false, initial.Infrastructural: false, initial.default: false
            Optional: Yes
        */
        , quality: 'low'
        /* 
        Description : Sets the Model Composition Quality used for Dynamic Loading eligibility.

        Quality Modes :
            low    -> Uses 5.0 behavior (Global scope eligibility)
            medium -> Uses 5.1 behavior (Local -> Then Global eligibility)
            high   -> View presence-based eligibility 
                    (Eligible if composed layer percent > 0.05 in the view)

        Range of value : 'low', 'medium', 'high'
        Default value : 'low'
        Optional : Yes
        */
    }
    /*
    Description: 
        initial
            This property allows you to set certain disciplines to always remain visible (never hidden) 
            when viewing the project. It ensures that key content is always loaded, maintaining the context of the project. 
            This prevents losing important references while navigating through the project.

            For example:
                In a large campus project with multiple buildings, the architectural components should always be visible, 
                providing the user with a clear understanding of what they are interacting with. 
                    This is default value - Always load and render Architectural elements on initial load.
                In an underground piping project, the plumbing elements should always be displayed to ensure the essential 
                infrastructure is clear. 
            Range of value: Json Object containing boolean values
            Default value: initial.Architectural: true, 
            Optional: Yes
    */    
   , enablePersistence: false
    /*
        Description:
            Enables saving the viewer state to a remote database server.
            This includes session data such as annotations, GIS overlays, user-defined graphics, and view settings.
            
            When disabled, the viewer will fall back to using local storage (in-browser) to temporarily preserve state.
            However, local storage is volatile and scoped to the browser session and user device.

        Properties:

            enablePersistence
                Enables or disables server-side persistence of viewer state.
                Type: Boolean
                Default value: true
                Optional: Yes
                - If false, state is stored locally in the browser and is not shared across devices or sessions.
                - If true, state is saved to a backend service configured by the application.

        Example Usage:
            enablePersistence: true
    */

    , view3d: {
        opacity: 1.0,
        enable: true,
        keepAlive: true,

        // Layout and Display Properties
        displayMode: EvmUtils.EVMDisplayMode.FULLSCREEN,
        showToolbar: false,
        showLauncher: true,
        alignment: EvmUtils.EVMWidgetAlignment.RIGHT_TOP,
        order: 1,
        margin: 0,
        renderingMode: EvmUtils.EVMDrawMode.Shaded, // Shaded is default
        onRenderingModeChange: (mode) => {},

        // Camera Properties
        camera: undefined,
        onCameraUpdate: {
            delayInMs: 300, // How frequently the callback should be called
            callback: undefined /* (cameraJson) => {} */
        }
    }
    /*
        Description: 
            Sets the properties of the 3D model viewer.

        Properties:
            opacity
                Controls the opacity of the 3D model.
                Range of value: A value of 1.0 means fully opaque, while 0.0 means fully transparent.
                Default value: 1.0
                Optional: Yes

            enable
                Enables or disables the 3D viewer.
                Type: Boolean
                Default value: true
                Optional: Yes
                - When set to false, the 3D viewer will not be rendered or interactive.

            keepAlive
                Enables or disables the 3D viewer subtree keep-alive load (spawn/session activity), separate from HTTP keepLive.
                Type: Boolean
                Default value: true
                Optional: Yes

            displayMode
                Defines how the 3D viewer is displayed within the application layout.
                Type: Enum (EvmUtils.EVMDisplayMode)
                Options:
                    - DEFAULT: Standard embedded mode in the layout.
                    - SPLIT: Viewer shares space side-by-side with another panel.
                    - FULLSCREEN: Viewer takes up the entire available viewport.
                    - FIXED: Viewer is placed in a fixed area of the screen.
                Default value: EvmUtils.EVMDisplayMode.FULLSCREEN
                Optional: Yes

            showToolbar
                Controls the visibility of the 3D viewer widget's own toolbar (e.g., zoom, pan, reset).
                Type: Boolean
                Default value: false
                Optional: Yes
                - Set to true to enable user interaction tools.

            showLauncher
                Controls the visibility of the launcher button in the main toolbar that opens the 3D viewer.
                Type: Boolean
                Default value: true
                Optional: Yes

            alignment
                Specifies the alignment of the viewer within its container or fixed space.
                Applies only to SPLIT and FIXED display modes.
                Type: Enum (EvmUtils.EVMWidgetAlignment)
                Options:
                    - LEFT_TOP: Viewer aligns to the top-left corner.
                    - LEFT_BOTTOM: Viewer aligns to the bottom-left corner.
                    - RIGHT_TOP: Viewer aligns to the top-right corner.
                    - RIGHT_BOTTOM: Viewer aligns to the bottom-right corner.
                Default value: EvmUtils.EVMWidgetAlignment.RIGHT_TOP
                Optional: Yes

        Example Usage:
            view3d={{
                opacity: 0.5,
                enable: true,
                displayMode: EvmUtils.EVMDisplayMode.SPLIT,
                showToolbar: true,
                alignment: EvmUtils.EVMWidgetAlignment.LEFT_BOTTOM
            }}
    */
        
   , view2d: {
        enable: true,
        keepAlive: true,
        fullscreen: false,

        // Layout and Display Properties
        displayMode: EvmUtils.EVMDisplayMode.DEFAULT,
        showToolbar: true,
        showLauncher: true,
        alignment: EvmUtils.EVMWidgetAlignment.LEFT_TOP
        , order: 2,
        margin: 10,
    }
    /*
        Description: 
            Sets the properties of the 2D viewer panel.

        Properties:
            enable
                Enables or disables the 2D viewer.
                Type: Boolean
                Default value: true
                Optional: Yes
                - When set to false, the 2D viewer will be hidden or inactive.

            keepAlive
                Enables or disables the 2D viewer subtree keep-alive load.
                Type: Boolean
                Default value: true
                Optional: Yes

            fullscreen
                Sets whether the 2D viewer occupies the full screen.
                Type: Boolean
                Default value: false
                Optional: Yes
                - When true, the 2D viewer expands to fill the entire viewport.
                - Overrides other layout settings when enabled.

            displayMode
                Defines how the 2D viewer is displayed within the application layout.
                Type: Enum (EvmUtils.EVMDisplayMode)
                Options:
                    - DEFAULT: Standard embedded view.
                    - SPLIT: Viewer appears beside another panel.
                    - FULLSCREEN: Viewer covers the full screen (same as setting `fullscreen: true`).
                    - FIXED: Viewer is anchored in a fixed position.
                Default value: EvmUtils.EVMDisplayMode.DEFAULT
                Optional: Yes

            showToolbar
                Controls whether the 2D viewer widget's own toolbar (e.g., zoom, pan) is visible.
                Type: Boolean
                Default value: true
                Optional: Yes
                - Useful for enabling basic user interactions.

            showLauncher
                Controls the visibility of the launcher button in the main toolbar that opens the 2D viewer.
                Type: Boolean
                Default value: true
                Optional: Yes

            alignment
                Determines the alignment of the viewer when using display modes like SPLIT or FIXED.
                Type: Enum (EvmUtils.EVMWidgetAlignment)
                Options:
                    - LEFT_TOP: Viewer aligns to the top-left corner.
                    - LEFT_BOTTOM: Viewer aligns to the bottom-left corner.
                    - RIGHT_TOP: Viewer aligns to the top-right corner.
                    - RIGHT_BOTTOM: Viewer aligns to the bottom-right corner.
                Default value: EvmUtils.EVMWidgetAlignment.LEFT_TOP
                Optional: Yes

        Example Usage:
            view2d={{
                enable: true,
                fullscreen: false,
                displayMode: EvmUtils.EVMDisplayMode.FIXED,
                showToolbar: false,
                alignment: EvmUtils.EVMWidgetAlignment.RIGHT_BOTTOM
            }}
    */

   , gis: {
        enable: false,
        token: undefined,
        opacity: 1.0,
        onIafMapReady: undefined,

        // GIS Mode Properties
        elevationMode: EvmUtils.EvmElevationMode.None,
        federatedMode: EvmUtils.EvmFederatedMode.None,
        primaryModelId: undefined,
        showMapMarkers: true,

        /** Distance-from-map-center scale for GLTF vs detailed-model switching (meters baseline × scale). Default 750 matches GIS Federated panel slider default. */
        dynamicRenderingDistance: 750,
        /** Map zoom offset for the same switching logic; blended with size-based interpolation. Default 14, same as `initial.zoom`. */
        dynamicRenderingZoom: 14,

        /** Default Mapbox camera session (zoom, bearing, pitch, center). `zoom` matches `dynamicRenderingZoom` default (see DEFAULT_GIS_SESSION_ZOOM). */
        initial: {
            zoom: 16,
            bearing: 0,
            pitch: 60,
            center: {
                lng: -6.250042050462614,
                lat: 53.33375746962285,
            },
        },

        // Callback Properties for Significant Property Updates
        /** `(federatedMode: number) => void` — federated mode changed (EvmUtils.EvmFederatedMode enum). */
        onFederatedModeChanged: undefined,
        /** `(modelId: string) => void` — reference model changed (Platform file ID). */
        onReferenceModelChanged: undefined,
        /** `(elevationMode: number) => void` — elevation mode changed (EvmUtils.EvmElevationMode enum). */
        onElevationModeChanged: undefined,
        /** `(modelId: string) => void` — model selected (Platform file ID). */
        onModelSelect: undefined,
        /** `(modelIds: string[]) => void` — outline loaded (Platform file ids). */
        onOutlineLoaded: undefined,
        /** `(modelIds: string[], value: number) => void` — longitude changed (degrees). Single model: `[id]`; shared row: all affected ids. */
        onLongitudeChange: undefined,
        /** `(modelIds: string[], value: number) => void` — latitude changed (degrees). */
        onLatitudeChange: undefined,
        /** `(modelIds: string[], value: number) => void` — per-model bearing changed (degrees). */
        onBearingChange: undefined,
        /** `(modelIds: string[], value: number) => void` — terrain height / vertical alignment (same units as GIS panel). */
        onAltitudeChange: undefined,

        // Layout and Display Properties
        displayMode: EvmUtils.EVMDisplayMode.FULLSCREEN,
        showToolbar: false,
        showLauncher: true,
        alignment: EvmUtils.EVMWidgetAlignment.RIGHT_TOP
        , order: 0,
        margin: 0
   }
    /*
    Description:
        This property enables GIS mode within the IafViewer.
        If enabled, the viewer will overlay 3D models onto a Mapbox-powered GIS map at their configured geo-locations.
        It supports interactive GIS operations like pan, zoom, tilt, and orbit.
        Existing non-GIS features in earlier versions of IafViewer will continue to work as expected.

    Properties:

        enable
            Enables or disables GIS mode.
            Range of value: boolean
            Default value: false
            Optional: Yes

        elevationMode
            Controls the elevation display mode for GIS.
            Type: Enum (EvmUtils.EvmElevationMode)
            Options:
                - None: No elevation adjustment
                - QuickSurface: Quick surface elevation
                - QuickUnderground: Quick underground elevation
                - Surface: Surface elevation
                - Blend: Blended elevation
                - Underground: Underground elevation
            Default value: EvmUtils.EvmElevationMode.None
            Optional: Yes

        federatedMode
            Controls the federated project mode for displaying multiple models.
            Type: Enum (EvmUtils.EvmFederatedMode)
            Options:
                - None (0): Single model mode
                - Outline (1): Outline federated mode - models rendered as GLTF layers
                - Hybrid (2): Hybrid federated mode
                - Dynamic (3): Dynamic federated mode
                - Markers (4): Markers-only mode - shows location markers without 3D models
            Default value: EvmUtils.EvmFederatedMode.None
            Optional: Yes

        primaryModelId
            The ID of the primary (reference) model in federated mode.
            This model serves as the reference point for alignment and positioning.
            Range of value: string (model ID)
            Default value: undefined (uses the first loaded model)
            Optional: Yes

        showMapMarkers
            Controls visibility of location markers on the GIS map.
            Location markers show the geographic positions of models.
            Range of value: boolean
            Default value: true
            Optional: Yes

        initial
            Default Mapbox GL session (zoom, bearing, pitch, center) before persisted GIS data loads.
            IafViewerDBM merges `gis` with PropertyStore using `mergeWithNestedSpreads` from `common/propertyUtils.js`
            (plain object branches on both sides, e.g. `initial`, are merged recursively so keys present on only one side are kept).
            so partial app `gis.initial` keeps store defaults for omitted fields.
            Range of value: { zoom?: number, bearing?: number, pitch?: number, center?: { lng, lat } }
            Default value: zoom/bearing/pitch/center as in PropertyStore.gis.initial
            Optional: Yes

        dynamicRenderingDistance
            Scales the interpolated distance threshold (meters from map center) used when deciding
            among detailed Communicator model, GLTF outline, and markers in federated GIS flows.
            The viewer multiplies its size-based baseline by (dynamicRenderingDistance / 750).
            Range of value: number (typically 500–5000)
            Default value: 750
            Optional: Yes

        dynamicRenderingZoom
            Offset applied to the interpolated map zoom threshold for the same switching logic
            (higher values require a more zoomed-in map before the high-zoom path applies).
            Range of value: number (typically 10–20, Mapbox zoom)
            Default value: 14
            Optional: Yes

        token
            The Mapbox access token to use for GIS map initialization.
            This token must be a valid temporary or permanent token generated by the hosting application 
            using its own Mapbox account and license.
            
            The viewer does not handle token generation or renewal internally. 
            Token expiry, scope, and lifecycle must be managed by the application.

            Range of value: string (Mapbox token)
            Default value: undefined
            Optional: Yes

        opacity
            Controls the opacity of the GIS map layer.
            Range of value: A value of 1.0 means fully opaque, while 0.0 means fully transparent.
            Default value: 1.0
            Optional: Yes

        onIafMapReady
            A callback function triggered when the GIS map (Mapbox instance) is fully initialized.
            It provides a monitored proxy to the underlying Mapbox GL JS instance, allowing the application
            to interact with the map directly and customize GIS behavior.

            Typical operations within this callback:
            - Add custom map layers
            - Modify map style
            - Add navigation controls (e.g., zoom, compass, directions)
            - Attach GIS-specific event handlers

            Range of value: Function
            Default value: undefined
            Optional: Yes

        onFederatedModeChanged
            Callback function triggered when the federated mode changes.
            This is called after the federated mode has been successfully updated.
            
            Range of value: Function(federatedMode: number)
            Parameters:
                - federatedMode: The new federated mode value (EvmUtils.EvmFederatedMode enum)
            Default value: undefined
            Optional: Yes
            
            Example:
                onFederatedModeChanged: (federatedMode) => {
                    console.log('Federated mode changed to:', federatedMode);
                    // Update external UI, sync state, etc.
                }

        onReferenceModelChanged
            Callback function triggered when the primary (reference) model changes.
            This is called after the reference model has been successfully updated.
            
            Range of value: Function(modelId: string)
            Parameters:
                - modelId: The new primary model ID (Platform file ID)
            Default value: undefined
            Optional: Yes
            
            Example:
                onReferenceModelChanged: (modelId) => {
                    console.log('Reference model changed to:', modelId);
                    // Update external UI, sync state, etc.
                }

        onElevationModeChanged
            Callback function triggered when the elevation mode changes.
            This is called after the elevation mode has been successfully updated.
            
            Range of value: Function(elevationMode: number)
            Parameters:
                - elevationMode: The new elevation mode value (EvmUtils.EvmElevationMode enum)
            Default value: undefined
            Optional: Yes
            
            Example:
                onElevationModeChanged: (elevationMode) => {
                    console.log('Elevation mode changed to:', elevationMode);
                    // Update external UI, sync state, etc.
                }

        onModelSelect
            Callback function triggered when a location marker for a model is selected (clicked).
            This is called immediately when a user clicks on a model's location marker on the GIS map.
            
            Range of value: Function(modelId: string)
            Parameters:
                - modelId: The Platform file ID of the selected model
            Default value: undefined
            Optional: Yes
            
            Example:
                onModelSelect: (modelId) => {
                    console.log('Model selected:', modelId);
                    // Update external UI, show model details, etc.
                }

        onLongitudeChange / onLatitudeChange / onBearingChange / onAltitudeChange
            Optional callbacks when model alignment values are committed (sliders, geocoder, horizontal drag end, reset, shared multi-model row).
            Signature: Function(modelIds: string[], value: number)
            Parameters:
                - modelIds: Platform file ids affected (one element for a single model; all ids that share the same value for a federated row).
                - value: New longitude, latitude, bearing (degrees), or terrain height (display/model units per GIS state).
            Default value: undefined
            Optional: Yes

        displayMode
            Determines how the GIS viewer is displayed within the application layout.
            Type: Enum (EvmUtils.EVMDisplayMode)
            Options:
                - DEFAULT: Standard embedded view.
                - SPLIT: Viewer shares space with other layout panels.
                - FULLSCREEN: Viewer expands to the full screen.
                - FIXED: Viewer is placed in a fixed region of the interface.
            Default value: EvmUtils.EVMDisplayMode.FULLSCREEN
            Optional: Yes

        showToolbar
            Controls visibility of the GIS viewer widget's own toolbar.
            Type: Boolean
            Default value: false
            Optional: Yes

        showLauncher
            Controls the visibility of the launcher button in the main toolbar that opens the GIS viewer.
            Type: Boolean
            Default value: true
            Optional: Yes

        alignment
            Sets the alignment of the GIS viewer panel.
            Relevant only in SPLIT or FIXED modes.
            Type: Enum (EvmUtils.EVMWidgetAlignment)
            Options:
                - LEFT_TOP
                - LEFT_BOTTOM
                - RIGHT_TOP
                - RIGHT_BOTTOM
            Default value: EvmUtils.EVMWidgetAlignment.RIGHT_TOP
            Optional: Yes

        Example Usage:

        gis={{
            enabled: true,
            token: mapboxToken, // application-managed token
            opacity: 0.8,
            dynamicRenderingDistance: 1000,
            dynamicRenderingZoom: 15,
            displayMode: EvmUtils.EVMDisplayMode.SPLIT,
            showToolbar: true,
            alignment: EvmUtils.EVMWidgetAlignment.LEFT_BOTTOM,            
            onIafMapReady: (iafmap) => {
                // Add navigation control
                iafmap.addControl(
                    new MapboxDirections({
                        accessToken: mapboxToken,
                        unit: "metric",
                        profile: "mapbox/driving",
                    }),
                    "top-left"
                );

                // Set map to satellite view
                iafmap.setStyle("mapbox://styles/mapbox/satellite-streets-v12");
            }
        }}
            

        Note:
            - GIS features rely on external GIS services like Mapbox.
            - Applications integrating GIS must:
                - Supply a valid Mapbox token (`token`)
                - Handle token lifecycle (generation, refresh, expiration)
                - Ensure compliance with Mapbox’s licensing, usage limits, and terms of service.
    */
    , arcgis: { // ArcGIS View
        enable: false,

        // Standard ArcGIS properties
        slicedElements: [],
        themeElements: [],
        layers: [],
        graphics: [],
        zoomElements: [],
        camera: {},
        config: {
            portalUrl: undefined, // ArcGIS portal URL (e.g., "https://gis.hlplanning.com/arcgis")
            apiKey: undefined, // API key for the ArcGIS portal
            model: undefined, // Web scene ID to load (e.g., "6745f5a0f1df4812a26925c19fdab6f8")
            sceneWKID: undefined, // Spatial reference WKID for the scene (e.g., 102100)
        },

        // Legacy Properties for compatibility
        command: [],

        // Callback Property for event handling
        eventHandler: (event) => {
            console.log('ArcGIS event:', event);
        },

        // Callback Property for custom handling the active instance of the ArcGIS map when ready
        onIafMapReady: (mapInstance) => {
            console.log('ArcGIS map ready:', mapInstance);
        },

        // Display and layout properties
        displayMode: EvmUtils.EVMDisplayMode.FULLSCREEN,
        showToolbar: true,
        showLauncher: true,
        alignment: EvmUtils.EVMWidgetAlignment.LEFT_TOP
        , order: 5,
        margin: 0,
    }
    /*
        Description:
            Configures the ArcGIS-based view within the IafViewer.
            Enables rendering of 3D content using ArcGIS SceneView technology,
            supporting geospatial context, model interaction, dynamic layers, feature slicing,
            event-driven behaviors, and map readiness callbacks.

        Properties:

            enable
                Enables or disables the ArcGIS viewer.
                Type: Boolean
                Default value: false
                Optional: Yes

            slicedElements
                List of model elements to slice or clip within the scene.
                Type: Array
                Default value: []
                Optional: Yes
                - Each element should have an id property and optionally extra.layerNames array
                - Used to create slice effects that cut through the 3D model

            themeElements
                Elements with visual themes or highlighting applied.
                Type: Array
                Default value: []
                Optional: Yes
                - Each element should have an id property and optional styling properties
                - Used to apply visual themes (colors, opacity, etc.) to specific elements

            layers
                ArcGIS layers to render in the viewer (e.g., basemaps, terrain, overlays).
                Type: Array
                Default value: []
                Optional: Yes
                - Array of layer configuration objects or layer instances
                - Layers are added to the scene in the order specified

            graphics
                Array of graphic overlays (e.g., points, lines, polygons).
                Type: Array
                Default value: []
                Optional: Yes
                - Array of Graphic objects or graphic configuration objects
                - Used to overlay custom graphics on the scene

            zoomElements
                List of element IDs or references to zoom into on initialization.
                Type: Array
                Default value: []
                Optional: Yes
                - Array of element identifiers to focus on when the viewer initializes
                - The viewer will automatically zoom to these elements

            camera
                Initial or current camera configuration (position, tilt, heading).
                Type: Object
                Default value: {}
                Optional: Yes
                - Object containing camera position and rotation properties
                - Structure: { position: { x, y, z }, rotation: { pitch, yaw, roll } }
                - Used to set initial camera position or update camera programmatically

            config
                Configuration object passed to the ArcGIS runtime.
                Type: Object
                Default value: {}
                Optional: Yes
                - Used to configure the ArcGIS SceneView, portal connection, and scene settings.
                - Required properties (at least one of model or webScene must be provided):
                    - portalUrl: string - The ArcGIS portal URL (e.g., "https://gis.hlplanning.com/arcgis")
                        - Must be a valid URL starting with "http://" or "https://"
                        - Cannot contain spaces or invalid characters
                        - If invalid, the scene will not be created
                        - Used to configure esriConfig.portalUrl for portal authentication
                        - Can be set to empty string or undefined to clear portal configuration
                    - apiKey: string - The API key for the ArcGIS portal
                        - Used to authenticate with the ArcGIS portal
                        - Can be set to empty string or undefined to clear API key
                    - model: string - The Web Scene ID to load (e.g., "6745f5a0f1df****a26925c19fdab6f8")
                        - Either model or webScene must be provided for the scene to be valid
                        - Used to load a specific Web Scene from the portal
                    - webScene: string - Alternative to model, specifies the Web Scene ID
                        - Either model or webScene must be provided for the scene to be valid
                        - Used to load a specific Web Scene from the portal
                    - sceneWKID: number - Spatial reference WKID for the scene (e.g., 102100)
                        - Used to set the spatial reference system for the scene
                        - Must be set during view creation, cannot be changed incrementally
                - Optional properties:
                    - logLevel: string - Logging level for ArcGIS (e.g., "warn", "error")
                    - authOmapi: string - URL for authentication OMAPI endpoint
                    - authServerUrl: string - URL for authentication server
                    - tileLayers: Array - Array of tile layer configurations to add to the scene
                    - customLayerBuilders: Array - Custom layer builder functions
                    - sceneView: Object - Additional SceneView configuration options
                    - initialCameraPosition: Object - Initial camera position configuration
                    - groundOpacity: number - Opacity of the ground (0.0 to 1.0)
                    - pointCloudLayers: Array - Point cloud layer configurations
                    - showBasemapGallery: boolean - Show basemap gallery widget
                        - When true, displays the basemap gallery widget allowing users to switch basemaps
                    - showSearchWidget: boolean - Show search widget
                        - When true, displays the search widget for geocoding and location search
                    - components: Array - Array of UI component IDs to show in the SceneView
                        - Array of strings representing ArcGIS UI component identifiers
                        - Used to configure which UI components are displayed in the SceneView
                        - Example: ["zoom", "compass"]
                        - If not provided, defaults to empty array (no UI components)
                    - specificityMode: number - Specificity level for layer filtering
                        - Used in conjunction with layerInfo to filter features based on specificity
                        - Features are filtered based on their layer's specificity value
                        - Used for hit testing and feature highlighting to prioritize certain layers
                        - Default value: 0
                        - Higher values indicate higher priority/specificity
                    - specificityFilter: string - Filter mode for specificity comparison
                        - Options: "EQUAL", "LOWER", "HIGHER"
                        - "EQUAL": Only include features with specificity exactly matching specificityMode
                        - "LOWER": Include features with specificity less than or equal to specificityMode
                        - "HIGHER": Include features with specificity greater than or equal to specificityMode
                        - Default value: "EQUAL"
                        - Used in conjunction with specificityMode and layerInfo to filter features during hit testing
                    - popUpEnabled: boolean - Enable ArcGIS built-in popups
                        - When false, disables the default ArcGIS popup functionality
                    - highlightOnClick: boolean - Enable ArcGIS built-in element highlighting
                        - When false, disables the default ArcGIS highlighting when elements are clicked
                    - highlightTheme: Object - Highlight theme configuration for element highlighting
                        - Structure:
                            {
                                color: Array<number>,      // RGBA color array [r, g, b, a] (e.g., [255, 255, 0, 1])
                                haloColor: string,         // Color for the halo effect (e.g., "white")
                                haloOpacity: number,       // Opacity of the halo (0.0 to 1.0, e.g., 0.9)
                                fillOpacity: number,       // Opacity of the fill (0.0 to 1.0, e.g., 0.2)
                                shadowColor: string,       // Color for the shadow (e.g., "black")
                                shadowOpacity: number      // Opacity of the shadow (0.0 to 1.0, e.g., 0.5)
                            }
                        - Used when highlightOnClick is true to customize the visual appearance of highlighted elements
                    - environment: Object - Environment settings (lighting, shadows, etc.)
                        - Structure: { lighting: { type: string }, ... }
                        - Example: { lighting: { type: "virtual" } }
                    - basemap: string - Basemap ID to use
                        - ArcGIS basemap identifier (e.g., "streets", "satellite", "hybrid")
                    - hiddenLayers: Array - Array of layer names to hide
                        - Array of strings representing layer names that should be hidden on initialization
                        - Example: ["BUILDINGS_LABEL_POINTS", "DISTRICTS_LABEL_POINTS"]
                    - initialCameraPosition: Object - Initial camera position configuration
                        - Camera position coordinates are dependent on the model's coordinate system
                        - It is up to the controlling app to convert between model coordinate systems
                        - Structure: { position: { x, y, z }, rotation: { pitch, yaw, roll } }
                    - layerInfo: Object - Layer information and configuration
                        - Object containing layer metadata and configuration details
                        - Used to configure layer properties, visibility, styling, and specificity
                        - Structure: { [layerTitle]: { idField, elementType, highlight, specificity, ... } }
                        - Each layer entry can contain:
                            - idField: string - Field name used as the element identifier
                            - idFieldType: string - Type of the id field (e.g., "Integer", "String")
                            - elementType: string - Type of element (e.g., "district", "building")
                            - highlight: Object - Highlight configuration
                                - triggerEvent: string - Event that triggers highlighting (e.g., "pointer-move", "selection_update")
                                - highlightableIds: Array - Array of IDs that can be highlighted (undefined means all)
                            - specificity: number - Specificity level for this layer (used with specificityMode)
                                - Higher values indicate higher priority
                                - Used to filter features during hit testing
                            - isIdValidForLayer: Function - Function to validate if an ID belongs to this layer
                            - outFields: Array - Fields to include in queries (e.g., ["*"])
                            - popupTemplate: Object - Popup template configuration for the layer
                            - relatedLayersField: Object - Mapping of related layer names to field names
                        - Example:
                            {
                                "Chicago POC Districts": {
                                    idField: "hl_districtname",
                                    elementType: "district",
                                    highlight: {
                                        triggerEvent: "pointer-move",
                                        highlightableIds: undefined
                                    },
                                    specificity: 100
                                },
                                "District Buildings": {
                                    idField: "osm_id",
                                    idFieldType: "Integer",
                                    elementType: "building",
                                    highlight: {
                                        triggerEvent: "pointer-move",
                                        highlightableIds: undefined
                                    },
                                    specificity: 200,
                                    outFields: ["*"],
                                    popupTemplate: {
                                        title: "{name}",
                                        content: [{ type: "fields", fieldInfos: [...] }]
                                    }
                                }
                            }
                    - initialTheming: Array - Initial theming configurations to apply
                        - Array of theming configuration objects to apply when the scene loads
                    - blockedInputEvents: Array - Array of input event names to block
                        - Array of strings representing input events to prevent (e.g., ["drag", "mouse-wheel"])
                    - shadows: boolean - Enable shadows
                        - When false, disables shadow rendering for better performance
                    - calloutLineColor: Array - Color for callout lines [r, g, b, a]
                        - RGBA color array for label callout lines
                - If config is invalid (missing required properties, invalid portalUrl format, etc.),
                  the scene will not be created and an error event will be dispatched
                - Example:
                    {
                        portalUrl: "https://gis.hlplanning.com/arcgis",
                        apiKey: "YOUR_ARCGIS_API_KEY_HERE",
                        model: "6745f5a0f1df4812a26925c19fdab6f8",
                        sceneWKID: 102100,
                        groundOpacity: 1,
                        shadows: false,
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
                        initialCameraPosition: {
                            position: { x: 0, y: 0, z: 0 },
                            rotation: { pitch: 0, yaw: 0, roll: 0 }
                        },
                        hiddenLayers: [
                            "BUILDINGS_LABEL_POINTS",
                            "DISTRICTS_LABEL_POINTS"
                        ],
                        layerInfo: {
                            "Chicago POC Districts": {
                                idField: "hl_districtname",
                                elementType: "district",
                                highlight: {
                                    triggerEvent: "pointer-move",
                                    highlightableIds: undefined
                                },
                                specificity: 100
                            }
                        },
                        components: ["zoom", "compass"],
                        specificityMode: 100,
                        specificityFilter: "EQUAL"
                    }

            command
                Legacy property for compatibility with command-driven configurations.
                Type: Array
                Default value: []
                Optional: Yes
                - Array of command objects
                - Commands are converted and processed by the ArcGIS viewer
                - Supported commands include: set_camera, zoom_to, zoom_in, theme_elements, slice_elements, etc.

            eventHandler
                Callback function to handle ArcGIS viewer events.
                Type: Function
                Signature: (event: EventObject) => void
                Default value: undefined
                Optional: Yes
                - Used to react to user actions or system events (e.g., element selected, camera changed, viewer ready).
                - Event object structure:
                    {
                        eventName: string,              // Event name (see EvmUtils.EVM_EVENTS for available events)
                        payload: {                      // Event-specific data
                            action?: string,            // Action type (e.g., "click", "doubleclick", "mousemove")
                            elements?: Array<{          // Array of elements involved in the event
                                id: string,             // Element identifier
                                elementType: string,    // Type of element
                                position: {             // 3D position
                                    x: number,
                                    y: number,
                                    z: number
                                },
                                extra?: object          // Additional element-specific data
                            }>,
                            modifiers?: {               // Keyboard modifiers
                                shift: boolean,
                                ctrl: boolean,
                                alt: boolean
                            },
                            screen?: {                  // Screen coordinates
                                x: number,
                                y: number,
                                all?: {                 // Additional screen coordinate data
                                    screenX: number,
                                    screenY: number,
                                    scaledScreenX: number,
                                    scaledScreenY: number,
                                    viewPortWidth: number,
                                    viewPortHeight: number
                                }
                            },
                            position?: {                 // Camera position (for CAMERA_UPDATE events)
                                x: number,
                                y: number,
                                z: number,
                                latitude?: number,
                                longitude?: number,
                                altitude?: number
                            },
                            rotation?: {                 // Camera rotation (for CAMERA_UPDATE events)
                                pitch: number,
                                yaw: number,
                                roll: number
                            },
                            ready?: boolean,             // For VIEWER_READY events
                            scene?: object,             // Scene instance (for VIEWER_READY events)
                            sceneView?: object,         // SceneView instance (for VIEWER_READY events)
                            code?: string,             // Error code (for VIEWER_ERROR events)
                            message?: string,           // Error message (for VIEWER_ERROR events)
                            command?: object,           // For COMMAND_RECEIVED events
                            [key: string]: any         // Additional event-specific properties
                        }
                    }
                - Available event names (EvmUtils.EVM_EVENTS):
                    - VIEWER_READY: Viewer is ready and initialized (payload.ready: true/false)
                    - CAMERA_UPDATE: Camera position or rotation changed
                    - SELECTION_UPDATE: Element selection changed (click, doubleclick)
                    - POINTER_MOVE: Mouse pointer moved (high-frequency event)
                    - POINTER_EXIT: Mouse pointer exited viewer
                    - POINTER_ENTER: Mouse pointer entered viewer
                    - VIEWER_BUSY: Viewer is busy processing
                    - VIEWER_ERROR: Viewer encountered an error
                    - COMMAND_RECEIVED: A command was received and processed
                    - LAYERS_UPDATE: Layer visibility or configuration changed
                    - GRAPHIC_ADDED: A graphic element was added
                    - GRAPHIC_DELETED: A graphic element was deleted
                    - GRAPHIC_UPDATED: A graphic element was updated
                - Example:
                    eventHandler: (event) => {
                        if (event.eventName === EvmUtils.EVM_EVENTS.SELECTION_UPDATE) {
                            console.log('Element selected:', event.payload.elements);
                        } else if (event.eventName === EvmUtils.EVM_EVENTS.VIEWER_READY) {
                            console.log('Viewer ready:', event.payload.ready);
                        }
                    }

            onIafMapReady
                Callback function called when the ArcGIS map instance is fully initialized.
                Provides access to the underlying ArcGIS SceneView and Scene instances.
                Type: Function
                Signature: (mapInstance: MapInstance) => void
                Default value: undefined
                Optional: Yes
                - Called when the ArcGIS SceneView is fully initialized and ready for interaction.
                - The callback is invoked:
                    - When the SceneView is ready (after scene and view are created)
                    - When projection module is loaded (if sceneWKID is specified)
                    - Only when both _isGISReady and _isProjectionReady are true
                - MapInstance object structure:
                    {
                        scene: __ArcGISScene__,              // The ArcGIS Scene instance
                        sceneView: __ArcGISSceneView__,      // The ArcGIS SceneView instance
                        camera: __ArcGISCamera__,            // [DEPRECATED] The current camera instance. Use sceneView.camera instead.
                        labelsLayer: __ArcGISFeatureLayer__, // [DEPRECATED] Internal implementation detail. Not recommended for app use.
                        labelPoints: Object,                  // [DEPRECATED] Internal implementation detail. Not recommended for app use.
                        focusSelector: string,                // CSS selector string for focusing the viewer (e.g., ".esri-view-surface")
                        arcgisModules: Object                 // ArcGIS modules object for reusing IafViewer's ArcGIS runtime (e.g., GraphicsLayer, SketchViewModel, SpatialReference, Graphic, Point, WebScene, SceneView, etc.)
                    }
                - Use this callback to:
                    - Access the SceneView directly for advanced ArcGIS API operations
                    - Reuse ArcGIS modules from IafViewer's runtime (via arcgisModules) to avoid version conflicts
                    - Manipulate layers, graphics, or scene properties
                    - Set up custom event listeners on the SceneView
                    - Perform operations that require the SceneView to be fully initialized
                - Example:
                    onIafMapReady: ({ scene, sceneView, arcgisModules, focusSelector }) => {
                        // Extract ArcGIS modules from arcgisModules (same runtime as IafViewer)
                        const { GraphicsLayer, Graphic, Point, SpatialReference } = arcgisModules;
                        
                        // Access SceneView directly
                        sceneView.setMapStyle("arcgis/light-gray");
                        
                        // Create graphics using IafViewer's ArcGIS modules (no version conflicts)
                        const graphicsLayer = new GraphicsLayer();
                        const point = new Point({ x: 0, y: 0, z: 0, spatialReference: SpatialReference.WebMercator });
                        const graphic = new Graphic({ geometry: point });
                        graphicsLayer.graphics.add(graphic);
                        scene.layers.add(graphicsLayer);
                        
                        // Set up custom event listener
                        sceneView.on("click", (event) => {
                            console.log("Custom click handler:", event);
                        });
                        
                        // Focus the viewer
                        document.querySelector(focusSelector)?.focus();
                        
                        // Access camera via sceneView (camera property is deprecated)
                        const camera = sceneView.camera;
                    }

            displayMode
                Determines how the ArcGIS viewer is displayed in the layout.
                Type: Enum (EvmUtils.EVMDisplayMode)
                Options:
                    - DEFAULT
                    - SPLIT
                    - FULLSCREEN
                    - FIXED
                Default value: EvmUtils.EVMDisplayMode.FULLSCREEN
                Optional: Yes

            showToolbar
                Controls visibility of the toolbar in the ArcGIS viewer.
                Type: Boolean
                Default value: true
                Optional: Yes

            alignment
                Sets the viewer's position when using SPLIT or FIXED display modes.
                Type: Enum (EvmUtils.EVMWidgetAlignment)
                Options:
                    - LEFT_TOP
                    - LEFT_BOTTOM
                    - RIGHT_TOP
                    - RIGHT_BOTTOM
                Default value: EvmUtils.EVMWidgetAlignment.LEFT_TOP
                Optional: Yes

            order
                Determines the display order when multiple viewers are shown.
                Type: Number
                Default value: 5
                Optional: Yes

            margin
                Margin spacing around the viewer widget.
                Type: Number
                Default value: 0
                Optional: Yes

        Example Usage:
            arcgis={{
                enable: true,
                slicedElements: [
                    {
                        id: 'zone-12',
                        extra: {
                            layerNames: ['building-layer-1', 'building-layer-2']
                        }
                    }
                ],
                themeElements: [
                    {
                        id: 'sensor-critical',
                        color: [255, 0, 0, 0.5]
                    }
                ],
                layers: ['base-terrain', 'heatmap-layer'],
                graphics: [customLine, customPoint],
                zoomElements: ['facility-23'],
                camera: {
                    position: { x: 0, y: 0, z: 100 },
                    rotation: { pitch: 0, yaw: 0, roll: 0 }
                },
                config: {
                    portalUrl: "https://gis.hlplanning.com/arcgis",
                    apiKey: "YOUR_ARCGIS_API_KEY_HERE",
                    model: "6745f5a0f1df4812a26925c19fdab6f8",
                    sceneWKID: 102100,
                    groundOpacity: 1,
                    shadows: false,
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
                    initialCameraPosition: {
                        position: { x: 0, y: 0, z: 0 },
                        rotation: { pitch: 0, yaw: 0, roll: 0 }
                    },
                    hiddenLayers: [
                        "BUILDINGS_LABEL_POINTS",
                        "DISTRICTS_LABEL_POINTS"
                    ],
                    layerInfo: {
                        "Chicago POC Districts": {
                            idField: "hl_districtname",
                            elementType: "district",
                            highlight: {
                                triggerEvent: "pointer-move",
                                highlightableIds: undefined
                            },
                            specificity: 100
                        }
                    },
                    components: ["zoom", "compass"],
                    specificityMode: 100,
                    specificityFilter: "EQUAL",
                    environment: {
                        lighting: {
                            type: "virtual"
                        }
                    }
                },
                command: [],
                displayMode: EvmUtils.EVMDisplayMode.SPLIT,
                showToolbar: true,
                alignment: EvmUtils.EVMWidgetAlignment.RIGHT_BOTTOM,
                order: 5,
                margin: 0,
                eventHandler: (event) => {
                    console.log('ArcGIS event:', event);
                },
                onIafMapReady: ({ scene, sceneView, camera, focusSelector }) => {
                    console.log('ArcGIS map ready:', { scene, sceneView, camera });
                    sceneView.setMapStyle("arcgis/light-gray");
                }
            }}
    */


    , arcgisOverview: { // ArcGis Overview or Context View
        enable: false,

        // Standard ArcGIS properties
        slicedElements: [],
        themeElements: [],
        layers: [],
        graphics: [],
        zoomElements: [],
        camera: {},
        config: {
            portalUrl: undefined, // ArcGIS portal URL (e.g., "https://gis.hlplanning.com/arcgis")
            apiKey: undefined, // api key for the ArcGIS portal
            model: undefined, // Web scene ID to load (e.g., "6745f5a0f1df****a26925c19fdab6f8")
            sceneWKID: undefined, // Spatial reference WKID for the scene (e.g., 102100)
            // Rest of the configuration settings follow below
        },

        // Legacy Properties for compatibility
        command: [],

        // Callback Property for event handling
        eventHandler: undefined,

        // Callback Property for custom handling the active instance of the ArcGIS map when ready
        onIafMapReady: undefined,

        // Display and layout properties
        displayMode: EvmUtils.EVMDisplayMode.DEFAULT,
        showToolbar: true,
        showLauncher: true,
        alignment: EvmUtils.EVMWidgetAlignment.LEFT_BOTTOM
        , order: 8,
        margin: 0, 
    }
    /*
        Description:
            Configures the ArcGIS Overview or Context View within the IafViewer.
            This mode is similar to the primary ArcGIS view but is designed as a top-down overview map,
            providing contextual navigation and control over the main ArcGIS mode.
            It can serve as a mini-map or secondary view for spatial orientation.

            When only one ArcGIS view mode is used in the IafViewer instance,
            either `arcgis` or `arcgisOverview` can fulfill the role, depending on use case preference.

        Properties:
            All properties and their documentation are identical to the `arcgis` property above.
            This includes:
            - enable, slicedElements, themeElements, layers, graphics, zoomElements, camera
            - config (with all its properties: portalUrl, apiKey, model, sceneWKID, and all optional config properties)
            - command, eventHandler, onIafMapReady
            - displayMode, showToolbar, alignment, order, margin
            The differences are their values:

            For detailed documentation of all properties, see the `arcgis` property documentation above.
    */

    , ue: { // Unreal Engine View
        enable: false,

        // Standard Unreal Engine properties
        config: {
            server: "",
            app: ""
        },
        zoomElements: [],

        // Properties for compatibility
        command: [],

        // Callback Property for event handling
        eventHandler: (event) => {
            console.log('Unreal Engine event:', event);
        },

        // Callback Property for viewer ready notification
        onUeReady: (viewerInfo) => {
            console.log('Unreal Engine viewer ready:', viewerInfo);
        },

        // Display and layout properties
        displayMode: EvmUtils.EVMDisplayMode.DEFAULT,
        showToolbar: true,
        showLauncher: true,
        alignment: EvmUtils.EVMWidgetAlignment.RIGHT_BOTTOM
        , order: 7,
        margin: 0,
    }
    /*
        Description:
            Configures the Unreal Engine-based view within the IafViewer.
            Enables rendering of 3D content using Unreal Engine technology,
            supporting model interaction, zoom targeting, and event-driven behaviors.

        Properties:

            enable
                Enables or disables the Unreal Engine viewer.
                Type: Boolean
                Default value: false
                Optional: Yes

            config
                Configuration object passed to the Unreal Engine runtime.
                Type: Object
                Default value: {}
                Optional: Yes
                - Used to configure the UE viewer iframe URL and connection settings.
                - Required properties:
                    - server: string - The base URL of the UE connector server (e.g., "https://connector.eagle3dstreaming.com")
                        - Must be a non-empty string
                        - Must start with "http://" or "https://"
                        - Must be a valid URL format
                        - Used as the origin for postMessage communication and iframe URL construction
                    - app: string - The application path or identifier (e.g., "/v6/eyJ...")
                        - Must be a non-empty string
                        - If it starts with "/", it's appended directly to server
                        - Otherwise, it's appended as "/v6/" + app
                - The iframe URL is constructed as: server + (app.startsWith("/") ? app : "/v6/" + app)
                - If config is invalid (missing server/app, invalid URL format, etc.), the iframe URL will be set to null
                - Additional properties may be present but are not validated or used for URL construction
                - Example:
                    {
                        server: "https://connector.eagle3dstreaming.com",
                        app: "/v6/eyJvd25lciI6ImludmljYXJhZGVtbyIsImFwcE5hbWUiOiJDaGljYWdvQXBwIiwiY29uZmlnTmFtZSI6InNlY3VyZVVSTCJ9"
                    }

            zoomElements
                List of element IDs or references to focus on when initializing the view.
                Type: Array
                Default value: []
                Optional: Yes

            command
                Legacy property for compatibility with command-driven configurations.
                Type: Array
                Default value: []
                Optional: Yes

            eventHandler
                Callback function to handle Unreal Engine viewer events.
                Type: Function
                Signature: (event: EventObject) => void
                Default value: undefined
                Optional: Yes
                - Used to react to user actions or system events (e.g., object selected, view changed).
                - Event object structure:
                    {
                        eventSourceGuid: string,        // Container ID or EVM ID of the event source
                        eventName: string,              // Event name (see EvmUtils.EVM_EVENTS for available events)
                        payload: {                      // Event-specific data
                            action?: string,            // Action type (e.g., "click", "doubleclick", "mousemove")
                            elements?: Array<{          // Array of elements involved in the event
                                id: string,             // Element identifier
                                elementType: string,    // Type of element
                                position: {             // 3D position
                                    x: number,
                                    y: number,
                                    z: number
                                },
                                extra?: object          // Additional element-specific data
                            }>,
                            modifiers?: {               // Keyboard modifiers
                                shift: boolean,
                                ctrl: boolean,
                                alt: boolean
                            },
                            screen?: {                  // Screen coordinates
                                x: number,
                                y: number,
                                all?: {                 // Additional screen coordinate data
                                    screenX: number,
                                    screenY: number,
                                    scaledScreenX: number,
                                    scaledScreenY: number,
                                    viewPortWidth: number,
                                    viewPortHeight: number
                                }
                            },
                            position?: {                 // Camera position (for CAMERA_UPDATE events)
                                x: number,
                                y: number,
                                z: number,
                                latitude?: number,
                                longitude?: number,
                                altitude?: number
                            },
                            rotation?: {                 // Camera rotation (for CAMERA_UPDATE events)
                                pitch: number,
                                yaw: number,
                                roll: number
                            },
                            ready?: boolean,             // For VIEWER_READY events
                            command?: object,            // For COMMAND_RECEIVED events
                            [key: string]: any           // Additional event-specific properties
                        }
                    }
                - Available event names (EvmUtils.EVM_EVENTS):
                    - CAMERA_UPDATE: Camera position or rotation changed
                    - SELECTION_UPDATE: Element selection changed (click, doubleclick)
                    - POINTER_MOVE: Mouse pointer moved
                    - POINTER_EXIT: Mouse pointer exited viewer
                    - POINTER_ENTER: Mouse pointer entered viewer
                    - VIEWER_READY: Viewer is ready and initialized
                    - VIEWER_BUSY: Viewer is busy processing
                    - VIEWER_ERROR: Viewer encountered an error
                    - COMMAND_RECEIVED: A command was received and processed
                    - LAYERS_UPDATE: Layer visibility or configuration changed
                    - GRAPHIC_ADDED: A graphic element was added
                    - GRAPHIC_DELETED: A graphic element was deleted
                    - GRAPHIC_UPDATED: A graphic element was updated

            onUeReady
                Callback function called when the UE viewer initialization status changes.
                Similar to onIafMapReady for ArcGIS, providing access to the underlying UE viewer.
                Type: Function
                Signature: (viewerInfo: ViewerReadyInfo) => void
                Default value: undefined
                Optional: Yes
                - Called in two scenarios:
                    1. Success: When the UE viewer sends a "ready" event, indicating it's fully initialized (viewerReady: true)
                    2. Failure: When the viewer cannot be initialized due to invalid or missing config (viewerReady: false)
                - The callback is invoked:
                    - On component mount if config is missing or invalid
                    - When config validation fails (invalid server/app values)
                    - When URL construction fails (invalid URL format)
                    - When the UE viewer sends a "ready" message (successful initialization)
                - ViewerReadyInfo object structure:
                    {
                        iframe: HTMLIFrameElement | null,  // The iframe element (null if viewerReady is false)
                        containerId: string,                // The container ID for the UE viewer widget
                        config: object | null,              // The configuration object (null if config was missing)
                        sendCommand: ((command: object | Array<object>) => void) | null,  // Method to send commands (null if viewerReady is false)
                        focusSelector: string,              // CSS selector string for focusing the viewer (e.g., "#containerId iframe")
                        viewerReady: boolean,              // Boolean flag: true when ready, false when initialization failed
                        error?: string                      // Error message (only present when viewerReady is false)
                    }
                - When viewerReady is true:
                    - iframe, config, and sendCommand are available
                    - Use this to perform actions once the viewer is ready (e.g., send initial commands, access iframe directly)
                - When viewerReady is false:
                    - iframe is null, sendCommand is null, config may be null or the invalid config object
                    - error property contains a description of what went wrong
                    - Use this to handle initialization failures and provide user feedback
                - Example (success case):
                    onUeReady: ({ iframe, sendCommand, focusSelector, viewerReady }) => {
                        if (viewerReady) {
                            // Send an initial command
                            sendCommand({ commandName: 'zoom_to', params: { elementId: '123' } });
                            // Focus the viewer
                            document.querySelector(focusSelector)?.focus();
                        }
                    }
                - Example (error handling):
                    onUeReady: ({ viewerReady, error, config }) => {
                        if (!viewerReady) {
                            console.error('UE Viewer failed to initialize:', error);
                            // Handle error: show user message, disable UI, etc.
                            if (!config) {
                                console.error('Config is missing');
                            } else {
                                console.error('Invalid config:', config);
                            }
                        }
                    }

            displayMode
                Determines how the Unreal Engine viewer is displayed in the layout.
                Type: Enum (EvmUtils.EVMDisplayMode)
                Options:
                    - DEFAULT
                    - SPLIT
                    - FULLSCREEN
                    - FIXED
                Default value: EvmUtils.EVMDisplayMode.DEFAULT
                Optional: Yes

            showToolbar
                Controls visibility of the toolbar in the UE viewer.
                Type: Boolean
                Default value: true
                Optional: Yes

            alignment
                Sets the viewer's position when using SPLIT or FIXED display modes.
                Type: Enum (EvmUtils.EVMWidgetAlignment)
                Options:
                    - LEFT_TOP
                    - LEFT_BOTTOM
                    - RIGHT_TOP
                    - RIGHT_BOTTOM
                Default value: EvmUtils.EVMWidgetAlignment.RIGHT_BOTTOM
                Optional: Yes

        Example Usage:
            ue={{
                enable: true,
                config: {
                    environment: 'industrial',
                    quality: 'ultra'
                },
                zoomElements: ['machine-42'],
                command: [{
                    commandName: 'zoom_to',
                    commandRef: uuid(),
                    params: {
                        elementId: '147013786_0',
                        uuid: uuid()
                    }
                }],
                displayMode: EvmUtils.EVMDisplayMode.FULLSCREEN,
                showToolbar: false,
                alignment: EvmUtils.EVMWidgetAlignment.LEFT_TOP,
                eventHandler: (event) => {
                    console.log('Unreal Engine event:', event);
                }
            }}
    */

    , photosphere: { // Photosphere or Panoramic View
        enable: false,

        // Standard Photosphere properties
        config: {},

        // Layout and display properties
        displayMode: EvmUtils.EVMDisplayMode.DEFAULT,
        showToolbar: true,
        showLauncher: true,
        alignment: EvmUtils.EVMWidgetAlignment.RIGHT_TOP
        , order: 6,
        margin: 0,        
    }
    /*
        Description:
            Configures the Photosphere (360° Panoramic) view within the IafViewer.
            When enabled, this mode renders panoramic imagery or virtual environments,
            allowing users to explore scenes using rotation and zoom interaction.

        Properties:

            enable
                Enables or disables the Photosphere view.
                Type: Boolean
                Default value: false
                Optional: Yes

            config
                Configuration object for the Photosphere renderer.
                Type: Object
                Default value: {}
                Optional: Yes
                - May include the image URL, viewer parameters, initial orientation, etc.

            displayMode
                Defines how the Photosphere viewer is embedded in the layout.
                Type: Enum (EvmUtils.EVMDisplayMode)
                Options:
                    - DEFAULT
                    - SPLIT
                    - FULLSCREEN
                    - FIXED
                Default value: EvmUtils.EVMDisplayMode.DEFAULT
                Optional: Yes

            showToolbar
                Determines whether the Photosphere viewer's toolbar is visible.
                Type: Boolean
                Default value: true
                Optional: Yes

            alignment
                Specifies the viewer’s position in the layout for SPLIT or FIXED modes.
                Type: Enum (EvmUtils.EVMWidgetAlignment)
                Options:
                    - LEFT_TOP
                    - LEFT_BOTTOM
                    - RIGHT_TOP
                    - RIGHT_BOTTOM
                Default value: EvmUtils.EVMWidgetAlignment.RIGHT_TOP
                Optional: Yes

        Example Usage:
            photosphere={{
                enable: true,
                config: {
                    imageUrl: 'https://example.com/panorama.jpg',
                    initialYaw: 180
                },
                displayMode: EvmUtils.EVMDisplayMode.FULLSCREEN,
                showToolbar: true,
                alignment: EvmUtils.EVMWidgetAlignment.LEFT_BOTTOM
            }}
    */

    , title: undefined
    /*
        Description:
            Sets an optional title or label for the IafViewer instance.
            This is especially useful when multiple instances of IafViewer are used within the same application,
            allowing each viewer’s logs and internal diagnostics to be tagged and distinguished by this title.

        Properties:

            title
                A unique string label for identifying the viewer instance in logs and debugging.
                Type: String
                Default value: undefined
                Optional: Yes
                - When set, all logs and debug output from this viewer instance will include the specified title.

        Example Usage:
            title: "Left Panel Viewer"
    */

    , toolbarSize: 'small'
        /* 
        Description : Sets the size of the toolbar
        Range of value : small,medium,large
        Default value : 'medium'
        Optional: Yes
        */
};

export default PropertyStore;