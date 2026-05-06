// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 27-04-23    ATK        PLAT-2729   Created. All tooltips should come here.
// 04-07-23    ATK                    Updated Tooltips
// 13-07-23    HSK                    Added EditToolbar tooltip
// 10-08-23    HSK                    Modified message of Edit Toolbar
// 10-08-23    ATK                    GIS.
// 01-09-23    HSK                    Removed ShowAll tooltip and added Utilities tooltip
// 25-09-23    HSK                    Added Tooltips for slider of cutting planes and setting component
// 28-29-23    HSK                    Changed cutting planes and settings TooltipStore Values
// 07-11-23    ATK        PLAT-3427   Model Load Configurations
// 28-29-23    HSK        PLAT-3447   New Cutting Plane Methods | Focused Planes API & UI
// 19-01-24    HSK        PLAT-3446   Define and demonstrate reusable Measurement Json Object (3d and 2d)
// -------------------------------------------------------------------------------------

import { Photo } from "@mui/icons-material";

const TooltipStore = {
    ResetView: "Restore the default orientation and position of the 3D view, bringing it back to its initial state."
    , Projection: "Toggle between Perspective and Orthographic 3D model to change the visual perspective and depth perception in the 3D view."
    , View: "Quickly toggle between predefined default views of the 3D model for efficient navigation and analysis."
    , Shading: "Explore different visual styles for an enhanced viewing experience to customize the 3D model's appearance."
    , Navigation: "Control your view and movement with Orbit to rotate around the center, Pan to shift the view, Zoom to adjust the distance, and Walk to walk through."
    , Markup: "Use markup operator to draw line, circle, rectangle markups within the scene. Switch back to Selection mode to choose elements in the model."
    , Measurement: "Use Measurement mode to accurately measure distances, angles, and other dimensions within the scene. Switch back to Selection mode to choose elements in the model."
    , CuttingPlanes: "Enable the ability to cut the 3D model using multiple cutting planes. Define multiple planes to slice through the model, allowing for precise and intricate sectioning."
    , CuttingPlanesInactive: "The cutting planes are ready to activate once the 3D model is loaded in the environment. Once the model is loaded, you can utilize the cutting planes to slice the model."
    , Viewer2D: "Activate the 2D sheet view of the model to navigate through floor plans, elevations, and sections, for a detailed understanding of the model's dimensions and layout."
    , Viewer3D: "To Do"
    , Arcgis: "To Do"
    , ArcgisOverview: "To Do"
    , UnrealEngine: "To Do"
    , Photosphere: "To Do"
    , FocusMode: "Activate Focus Mode to automatically zoom in on the selected object to enhance your focus and allow for a closer examination of the specific element within the model"
    , Settings: "Access additional options to gain better control over the 3D scene and 2D sheets. Explore advanced features for a more tailored and optimized viewing experience."
    , SettingsInactive: "The advanced settings will become available once the 3D model is loaded in the environment. Access additional options to gain better control over the 3D scene and 2D sheets."
    , Utilities: "Utilities to enhance your workflow and analysis"
    , EditToolbar: "Customize the display of UI elements, tailoring the experience to your preferences and optimizing the accessibility of tools and features"
    , EditToolbarSaveAndClose : "Save the configuration changes and close."
    , EditToolbarClose : "Close without saving any changes to the configuration."
    , EditToolbarReset : "Reset configuration to the original setup."
    , shadingWhileWalkMode : "Shading modes cannot be altered while in walk mode of navigation"
    , ApplyAndSaveButton : "The applied settings are saved in the cache for upcoming sessions specific to this user."
    , QuickApply : "The applied settings will be temporary and specific to this browser session only. Changes made will revert once the session is closed."
    , SaveCurrentView : "The current view state will be designated as new default state."
    , SaveCurrentMarkup : "Store current Markups" // EDIT TEXT MESSAGE FOR FUTURE
    , DownloadCurrentMarkups : "Download current Markups"
    , ImportMarkups: "Import Markups"
    , DownloadCurrentMeasurements : "Download current Measurements"
    , ImportMeasurements: "Import Measurements"
    , ResetToDefaultView : "The default state for this model will reset back to the model's initial state."
    , GISViewerInfo: "Activate GIS Mode for an interactive map interface, allowing you to view, explore, the map representation of your model for enhanced geospatial analysis and visualization."
    , ModelCompositionInfo: "Activate Model Composition for intelligent management of segmented 3D models, allowing you to selectively download, toggle tags and disciplines on/off, organize elements with custom tags, and optimize performance for enhanced visualization and analysis of large-scale projects."
    , GISViewerInactive: "The GIS viewer will be ready once the 3D model is fully loaded in the environment. Once the model is loaded, you can explore geographic data layers seamlessly."
    , ModelCompositionrInactive: "The Model Composition will be ready once the 3D model is fully loaded in the environment. Once the model is loaded, you can explore geographic data layers seamlessly."
    , ResetToDefaultMarkup : "Reset Markups" // EDIT TEXT MESSAGE FOR FUTURE
    , TopSlider : 'Top Plane'
    , BottomSlider : 'Bottom Plane'
    , FrontSlider : 'Front Plane'
    , BackSlider : 'Back Plane'
    , LeftSlider : 'Left Plane'
    , RightSlider : 'Right Plane'
    , FramerateSlider : 'Framrate'
    , FontSize : 'Font Size'
    , MarkupThickness : 'Stroke Thickness'
    , MarkupVisibility : 'Markup Visibility'
    , MarkupOpacity : 'Fill Opacity'
    , ChangeColor : 'Click to change the color'
    , HiddenLineOpacitySlider : 'Hidden Line Opacity'
    , StreamCutoffScaleSlider : 'Stream Cutoff Scale'
    , RadiusSlider : 'Radius'
    , IntensityScaleSlider : 'Intensity Scale'
    , ThresholdSlider : 'Threshold'
    , BlurSamplesSlider : 'Blur Samples'
    , LoadConfig: "Model Composer"
    , GISViewer: "GIS Viewer"
    , FocusedPlaneSlider : 'Focused Planes'
    , SaveMeasurement : 'Save Measurement'
    , RemoveMeasurement : 'Clear saved Measurements'
    , AutoLoadDepthSlider : 'Set the distance for automatic loading of objects'
    , Empty: ''
    , AutomaticLoding: "Enable automatic loading of linked models"
    , DistanceInFeet: "Specify the distance in feet from the view point for loading of linked models"
    , NotOptimised : 'The project may not be fully optimised. No linked models were found. If applicable to the original source (e.g. Revit Project), you may want to try regenerating this project with optimisations enabled using latest plugins'
    , DisciplineSwitch : 'No elements found for the desired discipline'
    
    , StructuralDiscipline: "Structural elements were not found in the project"
    // , ArchitecturalDiscipline: "Architectural elements are enabled by default and cannot be turned off"
    , PrivilegedDiscipline: "This has been designated as a privileged discipline"
    , ArchitecturalDiscipline: "Architectural elements were not found in the project"
    , MechanicalDiscipline: "Mechanical elements were not found in the project"
    , ElectricalDiscipline: "Electrical elements were not found in the project"
    , PlumbingDiscipline: "Plumbing elements were not found in the project"
    , FireProtectionDiscipline: "Fire Protection elements were not found in the project"
    , InfrastructuralDiscipline: "Infrastructural elements were not found in the project"
    , NoLayerDiscipline: "No layer elements were not found in the project"
    ,GisRealignLongitude:"Click slider or label to edit or adjust the longitude."
    ,GisRealignLatitude:"Click slider or label to edit or adjust the latitude."
    , Animation: {
       Play: "Go Live"
       , Stop: "Stop Live"
    },
    defaultTag: "The first linked model is tagged as Default View by default when loading for the first time.",
    miscellaneousTag: "Untagged linked models will be grouped under Miscellaneous."
};

export default TooltipStore;