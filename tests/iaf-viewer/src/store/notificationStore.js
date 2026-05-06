// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 01-12-23    ATK        PLAT-2957   Created.
// 16-01-24    ATK                    Added Notifications for APIs
// 29-01-24    ATK        PLAT-2957   Graphics Server Connection State Notifications
// -------------------------------------------------------------------------------------

import { IafMarkupManager } from "../core/IafMarkupManager";

export class NotificationStore {

    static enableNotifications = true;

    // ------------ Notifications for Server Connections
    static notifyWebsocketConnectionClosed = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification ("The streaming of the model is disconnected, you may want to refresh", 10000, "error");
    }

    static notifyWebGlContextLost = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification ("The system might be out of resources, you may want to refresh", 10000, "error");
    }

    static notifyWebsocketTimeout = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification ("The streaming of the model has timed out, you may want to refresh", 10000, "error");
    }

    static notifyWebsocketTimeoutWarning = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification ("The streaming of the model is about to timeout, you may want to refresh", 10000, "warning");
    }

    // ------------ Notifications for Viewer Dependencies
    static notifyViewerDependenciesNotLoaded = (iafViewerDbm) => {
        NotificationStore.enableNotifications && iafViewerDbm 
            && iafViewerDbm.openNotification ("There was an error while loading viewer dependencies", 10000, "error");
    }

    // ------------ Notifications for IafViewerDBM
    static notifyExtractingModelInfo = (iafViewerDbm, model) => {
        NotificationStore.enableNotifications && iafViewerDbm 
            && iafViewerDbm.openNotification ("Extracting 3D and 2D Views information (" + model._name + ")", 10000);        
    }

    // ------------ Notifications for Drawing Sheets
    static notifyDrawingSheetIsBeingLoaded = (iafViewer, index) => {
        const gfxResObject = iafViewer.props.graphicsResources2d.csdlMapByFilesetIndex.get(index);
        NotificationStore.enableNotifications && iafViewer && iafViewer.props.openNotification ("The drawing sheet is being loaded (" + gfxResObject.graphicsNodeName + ")");
    }

    static notifyDrawingSheetIsLoaded = (iafViewer, index) => {
        const gfxResObject = iafViewer.props.graphicsResources2d.csdlMapByFilesetIndex.get(index);
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification ("The drawing sheet has been loaded (" + gfxResObject.graphicsNodeName + ")");
    }
    
    static notifyDrawingSheetsAreBeingLoaded = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification ("The project may not be optimized. Attempting to load all the drawings sheets " 
            + "(" + iafViewer.props.graphicsResources2d.views.length + ") "       
        );
    }
    
    static notifyDrawingSheetsAreLoaded = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification ("The drawings sheets " 
            + "(" + iafViewer.props.graphicsResources2d.views.length + ") "       
            + "have been loaded" 
        );
    }

    static notifyNo2dAssociationFound = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification('No 2D association was found in the active 2D Sheet for the selected 3D element. You may want to try to a different 2D Sheet', 3000, 'warning');
    }

    static notify2dAssociationFoundInAnInactiveSheet = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification('2D association was found for the selected 3D element is an inactive sheet, loading in a moment, you may want to try selecting 3D element again once loaded...', 3000, 'warning');
    }

    static notifyMultiple2dAssociationsFoundInInactiveSheets = (iafViewer, sheets) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification('Multiple 2D associations were found for the selected 3D element is the inactive sheets, ' 
                + JSON.stringify(sheets)
                + 'loading the first one in a moment, you may want to ry selecting 3D element again once loaded'
                , 3000, 'warning');
    }

    // ------------ Notifications for 3D Models and Linked Models
    static notifyZoomElementsTooSpread = (iafViewer) => {
        const message =
            "The isolated elements may be currently too small to be visible. Try zooming in for better visibility.";
        NotificationStore.enableNotifications && iafViewer
            && iafViewer.props.openNotification(message, 10000, "warning");
    };
    
    static notifyModelIsBeingLoaded = (iafViewer, index) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification ("The model is being loaded (" + iafViewer.props.graphicsResources.views[index].title + ")");
    }
    
    static notifyNo3dAssociationFound = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification('No 3D association was found for the selected element', 3000, 'warning');
    }

    static notifyNoBimAssociationFound = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification('No BIM association was found for the selected element', 3000, 'warning');
    }
    
    static notifyLinkedModelIsUnloaded = (iafViewer, gfxResObject) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("The linked model has been unloaded (" + gfxResObject.graphicsNodeName + ")");    
    }

    static notifyModelIsLoaded = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification ("The model has been loaded (" + iafViewer.props.graphicsResources.views[0].title + ")");
    }

    static notifyModelIsMissing = (iafViewer, modelName, is3d) => {
        NotificationStore.enableNotifications && iafViewer && is3d
            && iafViewer.props.openNotification (`The 3D linked model is found missing (${modelName}).`, 3000, 'error');
        NotificationStore.enableNotifications && iafViewer && !is3d
            && iafViewer.props.openNotification (`The 2D sheets are found missing, ${modelName}.`, 3000, 'error');
    }

    static notifyModelIsAlreadyLoaded = (iafViewer, gfxResObject) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("The linked model has been already loaded (" + gfxResObject.graphicsNodeName + ")", 3000, 'warning');        
    }

    static notifyLinkedModelIsBeingLoaded = (iafViewer, gfxResObject, view) => {
        let message = `The linked model is being loaded ( ${gfxResObject.graphicsNodeName} )`;
        if (!view.layers) message += ", Part of composition data is found missing";// ATK PLG-899: Model should continue to load if Layers information is not found

        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message);
    }

    static notifyLinkedModelIsLoaded = (iafViewer, gfxResObject, view) => {
        let message = `The linked model has been loaded ( ${gfxResObject.graphicsNodeName} )`;
        if (!view.layers) message += ", Part of composition data is found missing";// ATK PLG-899: Model should continue to load if Layers information is not found
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message);
    }

    static notifyMappingIsLoaded = (iafViewer, gfxResObject) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("The mapping datasets have been loaded (" + gfxResObject.graphicsNodeName + ")");
    }

    static notifyGisNoLicense = (iafViewer, message = "No license found to use GIS services") => {
        if (!NotificationStore.enableNotifications || !iafViewer?.props?.openNotification) {
            console.warn("Notifications are disabled or iafViewer is missing.");
            return;
        }
        iafViewer.props.openNotification(message, 5000, 'error');
    };

    static notifyGisTrialLicense = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Trial license is found to use the GIS services", 5000, 'warning');
    }

    static notifyElementsWithUncategorisedDisciplines = (iafViewer, gfxResObject) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("The linked model may have uncategorized elements, an update to the model is recommended though optional (" + gfxResObject.graphicsNodeName + ")", 3000, "warning");
    }

    static notifyErrorFetchingTheModelFiles = (iafViewer, fileSetIn) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("There was error fetching the model files from the graphics servers (" + JSON.stringify(fileSetIn) + ")", 5000, "error");
    }
    
    static notifyElementsLoadedWithCuttingPlaneUpdate = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Cutting planes have been updated for the recomposed model elements", 5000, "info");
    }

    static notifyVisibilityIsControlledByDesignerView = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("The visibility of some of the loaded elements is overriden by the Model Layers Composition Settings", 5000, "warning");
    }

    // ATK PLG-1604: Performance - Queue setNodesVisibility to avoid flicker
    static notifyNodesVisibilityChange = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("The visibility of disciplines is being updated", 2000, "info");
    }

    static notifySelectionVisibilityIsControlledByDesignerView = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("The visibility of some of the selected elements is overriden by the Model Layers Composition Settings", 5000, "warning");
    }

    // ------------ Notifications for Cutting Planes
    static notifyNoElementSelectionFoundForFocusedCuttingPlanes = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification ("You may want to select an element to enable focused planes", 5000, "warning");
    }
    
    static notifyGisFocusedPlanesReset = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification ("Focused Planes have been reset to off. You may want to review your Cutting Planes Settings", 3000, "info");
    }

    // ------------ Notifications for APIs
    static notifyGraphicsServerIsNotUp = (iafViewerDbm) => {
        NotificationStore.enableNotifications && iafViewerDbm
            && iafViewerDbm.openNotification (`Error connecting to the graphics servers at ${iafViewerDbm.graphicsServiceOrigin}`, 5000, "error");
    }

    static notifyModelGraphicsViewsNotFound = (iafViewerDbm, is3d) => {
        NotificationStore.enableNotifications && iafViewerDbm && is3d
            && iafViewerDbm.openNotification ("Model Graphics 3D Views were not found!", 5000, "warning");
        NotificationStore.enableNotifications && iafViewerDbm && !is3d
            && iafViewerDbm.openNotification ("Model Graphics 2D Views were not found!", 5000, "warning");
    }

    static notifyModelGraphicsResourcesNotFound = (iafViewerDbm, is3d) => {
        NotificationStore.enableNotifications && iafViewerDbm && is3d
            && iafViewerDbm.openNotification ("Model Graphics 3D Resources were not found!", 5000, "warning");
        NotificationStore.enableNotifications && iafViewerDbm && !is3d
            && iafViewerDbm.openNotification ("Model Graphics 2D Resources were not found!", 5000, "warning");
    }

    static notifyExtractingViewerPermissions = (iafViewerDbm) => {
        NotificationStore.enableNotifications && iafViewerDbm
            && iafViewerDbm.openNotification (`Extracting Active User and User Permissions for the Viewer`, 10000);
    }
    

    static notifyGraphicsResourcesCacheClearedFromLocalStorage = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Graphics Resources have been cleared from local storage", 3000, "info");
    }

    // ------------ Notifications for Interactions
    static notifyResetToWalkMode = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Walk mode navigation is active, the view is reset for walking", 5000, "info");
    }
    // ------------ Notifications for Annotations
    static notifyMarkupPickTheFirstPoint = (iafViewer, markupType, markupManager) => {
        let message = "Pick the first point on " + markupType + ", escape to cancel";
        if (markupType === IafMarkupManager.MarkupType.CIRCLE) {
            message = "Pick a center point for the " + markupType + ", escape to cancel";  
        } else if (markupType === IafMarkupManager.MarkupType.FREEHAND) {
            message = "Pick a point, hold down the left mouse button and drag your mouse to draw the sketch" + ", escape to cancel";  
        }
        markupManager && markupManager.repeatLastMode && (message += ", repeat mode is active");
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 3000, "info");
    }

    static notifyMarkupPickTheSecondPoint = (iafViewer, markupType) => {
        let message = "Pick the second point on " + markupType + ", escape to cancel";
        if (markupType === IafMarkupManager.MarkupType.CIRCLE) {
            message = "Pick a point for the " + markupType + ", escape to cancel";  
        }
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 3000, "info");
    }

    static notifyMarkupPickTheNextPoint = (iafViewer, markupType, ready2Complete = false) => {
        let message = "Pick the next point on " + markupType + ", escape to cancel";
        ready2Complete && (message += ", enter or right click to complete");
        if (markupType === IafMarkupManager.MarkupType.FREEHAND) {
            message = "Continue dragging your mouse to draw the sketch" + ", escape to cancel, release the left button to complete";  
        }
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 5000, "info");
    }

    static notifyMarkupPickBoundaryCirclesToEdit = (iafViewer, markupType) => {
        let message = "Left-click and drag the points on " + markupType + " to edit" + ", release the left button to complete, escape to cancel";
        if (markupType === IafMarkupManager.MarkupType.CIRCLE) {
            message = "Reposition using the center point, resize using the point on the CIRCLE";
        }

        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 5000, "info");
    }

    static notifyMarkupPickTheTextPoint = (iafViewer, markupType, markupManager) => {
        let message = "Pick a point to place the text, escape to cancel";
        if (markupType === IafMarkupManager.MarkupType.LEADERNOTE) {
            message = "Pick a point to place the note, escape to cancel";
        }
        markupManager && markupManager.repeatLastMode && (message += ", repeat mode is active");
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 5000, "info");
    }

    static notifyMarkupEditTheTextMarkupPoints = (iafViewer, markupType, markupManager) => {
        let message = "Drag to reposition the note, click to edit the note";
        if(markupType === IafMarkupManager.MarkupType.TEXT){
            message = "Drag to reposition the text, escape to cancel, click to edit the text."
        }
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 10000, "info");
    }

    static notifyMarkupEditTheTextMarkupText = (iafViewer, markupType) => {
        let message = "Type to edit the text, escape to cancel, shift+enter for new line, enter or click outside to complete";
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 10000, "info");
    }

    static notifyMarkupPickTheSpritePoint = (iafViewer, markupType, markupManager) => {
        let message = "Pick a point to place the sprite, escape to cancel";
        markupManager && markupManager.repeatLastMode && (message += ", repeat mode is active");
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 5000, "info");
    }
    
    static notifyMarkupEditTheSpriteMarkupPoints = (iafViewer, markupType) => {
        let message = "Drag to reposition the sprite, escape to cancel, click to edit the url";
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 6000, "info");
    }

    static notifyMarkupEditTheSpriteMarkupText = (iafViewer, markupType) => {
        let message = "Type to edit the url, escape to cancel, click outside to complete";
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 6000, "info");
    }
    
    static notifyImageUrlValidation = (iafViewer, markupType, isValid) => {
        if (isValid) return;
        let message = isValid 
            ? "The sprite has been successfully updated" 
            : "Invalid image url. You may want to try with a valid url ending with .jpeg, .jpg, .gif, .png, .svg, .webp, or .bmp";        
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 6000, isValid ? "info" : "error");
    }
    
    static notifyRepeatModeTurnedOff = (iafViewer) => {
        // if (NotificationStore.enableNotifications && iafViewer) {
        //     const message = "Repeat mode has been turned off. You can now proceed with single actions";
        //     iafViewer.props.openNotification(message, 6000, "info");
        // }
    }
    
    static notifyRepeatModeAutoToggleOff = (iafViewer) => {
        // if (NotificationStore.enableNotifications && iafViewer) {
        //     const message = "Repeat mode auto-disabled on command change. Re-enable if needed";
        //     iafViewer.props.openNotification(message, 6000, "info");
        // }
    }

    static notifyAnnotationsSavedToLocalStorage = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Annotations have been saved to local storage", 3000, "info");
    }
    static notifyAnnotationsExportMarkups = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Markups have been downloaded to the disk", 3000, "info");
    }
    static notifyAnnotationsImportMarkups = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Markups have been imported", 3000, "info");
    }    
    static notifyAnnotationsExportMeasurements = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Measurements have been downloaded to the disk", 3000, "info");
    }
    static notifyAnnotationsImportMeasurements = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Measurements have been imported", 3000, "info");
    }    
    static notifyAnnotationsExportAnnotations = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Annotations have been downloaded to the disk", 3000, "info");
    }
    static notifyAnnotationsImportAnnotations = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Annotations have been imported", 3000, "info");
    }    
    static notifyAnnotationsLoadedFromLocalStorage = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Annotations have been loaded from local storage", 3000, "info");
    }
    static notifyPersistenceIsDisabled = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(
                "Persistence is currently disabled", 
                3000, 
                "info"
            );
    }
    static notifyAnnotationsClearedFromLocalStorage = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Annotations have been cleared from local storage", 3000, "info");
    }
    
    static notifyToSelectMarkup = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Please select one markup type", 3000, "info");
    }    

    // ------------ Notifications for Animations
    static notifyAnimationIsStarted = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("The workflow visualisation is now live", 3000, "info");
    }
    static notifyAnimationIsStopped = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("The workflow visualisation is now turned off", 3000, "warning");
    }
    static notifyAnimationFramesNotFound = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("No live data were found for the active workflow", 3000, "warning");
    }
    static notifyAnimationWorkflowBeingUpdated = (iafViewer) => {
        // NotificationStore.enableNotifications && iafViewer 
        //     && iafViewer.props.openNotification("Please wait while the workflow is being updated", 3000, "info");
    }
    static notifyAnimationWorkflowUpdated = (iafViewer) => {
        // NotificationStore.enableNotifications && iafViewer 
        //     && iafViewer.props.openNotification("The workflow visualisation has been updated", 3000, "warning");
    }


    // ------------ Notifications for Gis
    static notifyMapboxIsBeingInitialized = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("The GIS is being initialized, please wait.", 3000, "info");
    }

    static notifyIdentifyingUndergroundElements = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Computing underground elements. \
                        This may take some time before it gets cached for \
                        faster access in future sessions.", 
                3000, "info");
    }
    // Clear
    static clear = (iafViewer) => {
        iafViewer.props.closeNotification();
    }
    
     // ------------------------------- GIS Data Notifications ---------------------------------------------------

    static notifyGisHorizontalAlignmentUnlocked = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("The horizontal alignment is now active, press ENTER to confirm or press ESC to exit", 3000, "info");
    }

    static notifyGisVerticalAlignmentUnlocked = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("The vertical alignment is now active, press ENTER to confirm or press ESC to exit", 3000, "info");
    }

    static notifyGisDataLoadedFromLocalStorage = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("GIS data has been loaded from local storage", 3000, "info");
    };

    static notifyGisDataSavedToLocalStorage = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("GIS data has been saved to local storage", 3000, "success");
    };
    
    static notifyMapboxKeySavedToLocalStorage = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) {
            iafViewer.props.openNotification(
                "Mapbox license key has been saved to local storage",
                3000,
                "success"
            );
        }
    };
    
    static notifyMapboxKeyRemoved = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) {
            iafViewer.props.openNotification(
                "Mapbox license key has been removed from local storage",
                3000,
                "warning"
            );
        }
    };

    static notifyGisDataExported = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("GIS data has been exported successfully", 3000, "success");
    };

    static notifyGisDataImported = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("GIS data has been imported successfully", 3000, "success");
    };

    static notifyGisDataImportFailed = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("Failed to import GIS data", 3000, "error");
    };

    static notifyGisDataCleared = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("GIS data has been cleared", 3000, "warning");
    };

    static notifyGisDataClearedFromLocalStorage = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("GIS data has been cleared from local storage", 3000, "warning");
    };

    static notifyGisElevationModeIsReset = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer
            && iafViewer.props.openNotification("GIS Elevation mode has been reset to None. You may want to review Elevation Settings.", 3000, "info");
    };

    static notifyLinkedModelItemUpdate = (iafViewer) => {
        // if (NotificationStore.enableNotifications && iafViewer) {
        //     iafViewer.props.openNotification("Model Composition configuration has been saved", 3000, "success");
        // } else 
        {
            console.log(`Model Composition configuration has been saved`);
        }
    }

    static notifyLinkedModelEditError = (iafViewer, errorMessage) => {
        if (NotificationStore.enableNotifications && iafViewer) {
            iafViewer.props.openNotification(`An error occured while saving Model Composition configuration`, 5000, "error");
        }
    }

    static notifyModelComposerDataLoadSuccess = (iafViewer) => {
        // if (NotificationStore.enableNotifications && iafViewer) {
        //     iafViewer.props.openNotification(`Model Composition configuration has been fetched`, 5000, "success");
        // } else 
        {
            console.log(`Model Composition configuration has been fetched`);
        }
    }

    static notifyModelComposerDataLoadFail = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) {
            iafViewer.props.openNotification(`An error occured while fetching the model composition configuration`, 5000, "error");
        } else {
            console.log(`An error occured while fetching the model composition configuration`);
        }
    }
    static notifyGisUpdateSuccess = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer)
            iafViewer.props.openNotification("GIS configuration has been updated", 3000, "success");
        else
            console.log(`GIS configuration has been updated`);
    };
    
    static notifyGisUpdateError = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) 
            iafViewer.props.openNotification("An error occured while saving GIS configuration", 5000, "error");
        else
            console.log ('An error occured while saving GIS configuration');
    };
    
    static notifyGisLoadSuccess = (iafViewer) => {
        // NotificationStore.enableNotifications && iafViewer 
        //     && iafViewer.props.openNotification("GIS data has been loaded successfully", 3000, "warning");
        console.log(`GIS configuration has been fetched`);
    };
    
    static notifyGisLoadError = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) 
            iafViewer.props.openNotification("An error occured while fetching the GIS configuration", 5000, "error");
        else
            console.log ('An error occured while fetching the GIS configuration');
    };
    
    static notifyGisTerrainUpdateSuccess = (iafViewer) => {
        // if (NotificationStore.enableNotifications && iafViewer)
        //     iafViewer.props.openNotification("Terrain height saved successfully.", 3000, "success");
        // else
        console.log(`Terrain height saved successfully.`);
    };
    
    static notifyGisTerrainUpdateError = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) 
            iafViewer.props.openNotification("An error occured while saving terrain height", 5000, "error");

        console.log ('An error occured while saving terrain height');
    };

    static notifyGisVerticalMisAlignment = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) 
            iafViewer.props.openNotification("The model has been found with a vertical misalignment in geographic positioning. \
                                Adjusting vertical alignment for accurate placement", 5000, "warning");

        console.log ("The model has been found with a vertical misalignment in geographic positioning. \
                            Adjusting vertical alignment for accurate placement");
    }
    
    static notifyGisHitEnterToUpdateBuildingTitle = (iafViewer) => {
        let message = "Type to edit, Click outside to cancel, Hit Enter to update";
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 5000, "info");
    }

    static notifyGisClickToJumpToBuilding = (iafViewer) => {
        let message = "You're hovering over a building marker. Click to zoom in";
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 5000, "info");
    }

    static notifyGisDoubleClickToSetAsReferenceModel = (iafViewer) => {
        let message = "You're hovering over a building marker. Click to zoom in. Double click to set as reference model";
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 5000, "info");
    }
    
    static notifyGisClickToModifyBuildingTitle = (iafViewer) => {
        let message = "You're hovering over the title. Click to modify";
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 5000, "info");
    }

    static notifyGisViewingStaticModels = (iafViewer) => {
        let message = "You’ve switched to the outline view of all buildings on the map";
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 5000, "info");        
    }

    static notifyGisViewingOriginalModels = (iafViewer) => {
        let message = "You’ve switched to the detailed view of the reference building on the map";
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification(message, 5000, "info");        
    }

    // static notifyFederatedProjectNotSupported = (iafViewer) => {
    //     let message = "The project contains multiple models or builidings (a federated setup). While offical support for federated projects is coming soon, the current Viewer version will attempt to work with the primary model only.";
    //     NotificationStore.enableNotifications && iafViewer
    //         && iafViewer.props.openNotification(message, 5000, "warning");
    // }

    static notifyArcgisNoValidConfiguration = (iafViewer) => {
        NotificationStore.enableNotifications && iafViewer 
            && iafViewer.props.openNotification("No valid ArcGIS configuration found. Please check your settings.", 5000, "error");
    }
    
    static notifyMissingTagsOnToggle = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) {
            iafViewer.props.openNotification(
                "Some of the assets or elements in the project may not have associated tags. Please consider adding tags to untagged linked models.",
                5000,
                "warning"
            );
        }
    };
    
    static notifyMiscellaneousLoadWarning = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) {
            iafViewer.props.openNotification(
            `This will load all linked models, which may impact performance.`,
            10000,
            "warning"
            );
        }
    };

    static handleDesignerUIToggleNotification = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) {
            iafViewer.props.openNotification(
                "To perform any action, please toggle off the Auto Compose switch.",
                5000,
                "info"
            );
        }
    };

    static handleAutoComposeToggleNotification = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) {
            iafViewer.props.openNotification(
                "You can now toggle discipline will automatically load the corresponding linked files.",
                5000,
                "info"
            );
        }
    };
    
    static notifyOnTagToggleAction = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) {
            iafViewer.props.openNotification(
                "Type to search or create a tag. Press Enter to add, click to select, or Esc to cancel",
                5000,
                "info"
            );
        }
    };

    static notifyOnModelCompositionAction = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) {
            iafViewer.props.openNotification(
                "Please wait while the model composition settings are being applied",
                5000,
                "info"
            );
        }
    };
    
    static notifyOperationInProgress = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) {
            iafViewer.props.openNotification(
                "Operation in progress. Please wait for the current operation to complete before doing anything.",
                3000,
                "info"
            );
        }
    };
    
    static notifyDeletePermissionDenied = (iafViewer) => {
        if (NotificationStore.enableNotifications && iafViewer) {
            const message = "You don't have permission to delete. Please contact your administrator.";
            iafViewer.props.openNotification(message, 5000, "error");
        }
    };

    static notifyCustom = (stateManager, message, severity = "info", duration = 3000) => {
        if (NotificationStore.enableNotifications && stateManager) {
            // Check if stateManager has openNotification method directly or via props
            if (typeof stateManager?.props?.openNotification === 'function') stateManager.props.openNotification(message, duration, severity);
            else if (typeof stateManager?.openNotification === 'function') stateManager.openNotification(message, duration, severity);
        }
    }
    
     // ------------ Notifications for Database Operations
    static notifyDatabaseOperationFailed = (iafViewer, operation, statusCode) => {
        if (statusCode >= 400 && statusCode < 500) {
            NotificationStore.enableNotifications && iafViewer 
                && NotificationStore.notifyCustom(iafViewer, 
                    `Database operation failed (${statusCode}): ${operation} operation could not be completed. Please check your request.`,
                    "error", 5000);
        } else if (statusCode >= 500) {
            NotificationStore.enableNotifications && iafViewer 
                && NotificationStore.notifyCustom(iafViewer, 
                    `Database server error (${statusCode}): ${operation} operation failed due to server issues. Please try again later.`,
                    "error", 5000);
        } else {
            NotificationStore.enableNotifications && iafViewer 
                && NotificationStore.notifyCustom(iafViewer, 
                    `Database operation failed: ${operation} operation encountered an error.`,
                    "error", 5000);
        }
    }
}