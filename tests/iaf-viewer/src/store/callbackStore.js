// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 14-06-23    ATK        PLAT-2957   Created. Revamped IafViewer Callback Store
// 06-07-23    HSK                    Added callback functions
// 14-09-23    HSK                    Added OnSnackbarCloseCallback function
// 23-01-24    RRP        PLAT-4025   Update Reference App to consume all props and callbacks of IafViewerDBM
// 23-02-24    RRP        PLAT-4069   IafViewer Callback Property OnSelectedElementChangeCallback should return PackageId(ElementId)
// -------------------------------------------------------------------------------------

// ATK
// CallbackStore and PropertyStore is more of logical division for readbility
// Both eventually come as the IafViewerDBM props
//

const CallbackStore = {
    saveSettings: (settings) => {}
        /*
        Description: Callback function to save viewer settings.
        Range of value: Function receiving an object containing user settings
        Default value: undefined
        Optional: Yes
        */

    , OnIsolateElementChangeCallback: (isolateElementIDs) => {}
        /*
        Description: Callback function triggered when the isolated element changes.
        Range of value:  Function receiving an array of isolated element ids
        Default value: undefined
        Optional: Yes
        */

    , OnSelectedElementChangeCallback: (selectedElementIDs) => {}
        /*
        Description: Invoked when the selected element changes. Implement this function to respond to
        changes in the UI selection. The `elementIds` parameter contains the IDs of the
        newly selected elements.
        Param: {string[]} elementIds - An array of IDs representing the selected elements.
        Callback: OnSelectedElementChangeCallback
        */

    , OnHiddenElementChangeCallback: (hiddenElementIDs) => {}
        /*
        Description: Callback function triggered when the hidden element changes.
        Range of value:  Function receiving an array of hidden element ids
        Default value: undefined
        Optional: Yes
        */

    , OnResetCallback: () => {}
        /*
        Description: Callback function triggered when the reset action is performed.
        Range of value: Function
        Default value: undefined
        Optional: Yes
        */

    , OnNotificationCallback: (message) => {}
        /*
        Description: Callback function triggered when a notification is opened.
        Function receiving a message parameter for the notification content
        Default value: undefined
        Optional: Yes
        */

    , On2dToolbarConfigCallback: (toolbarList,measurementList,viewList,navigationList,shadingList,manipulateList) => {}
        /*
        Description: Callback function triggered when configuring the 2D toolbar.
        Range of value: Function receiving lists of toolbar, measurement, view, navigation, shading, and manipulation options
        Default value: undefined
        Optional: Yes
        */
    
    , On3dToolbarConfigCallback: (toolbarList,measurementList,viewList,navigationList,shadingList,manipulateList) => {}
        /*
        Description: Callback function triggered when configuring the 3D toolbar.
        Range of value: Function receiving lists of toolbar, measurement, view, navigation, shading, and manipulation options
        Default value: undefined
        Optional: Yes
        */
    
    ,  OnDefaultToolbarConfigCallback: (toolbarList,measurementList,viewList,navigationList,shadingList,manipulateList) => {}
        /*
        Description: Callback function triggered when configuring the default toolbar.
        Range of value: Function receiving lists of toolbar, measurement, view, navigation, shading, and manipulation options
        Default value: undefined
        Optional: Yes
        */
    ,  OnViewerReadyCallback: (modelTypeOrModelInfo) => {}
        /*
        Description: Callback function triggered when the model's structure is successfully loaded and ready, 
                     or when model selection changes from within the viewer (e.g., GIS UI).
                     This will be called separately for 3D and 2D viewers when structure is ready.
                     When model selection changes, it will be called with model information object.
        Range of value: Function with parameter:
                        - String: '2d' or '3d' (when model structure is ready)
                        - Object: { modelType: '3d'|'2d', modelId: string, modelVersionId: string } (when model selection changes)
        Default value: undefined  
        Optional: Yes
        */
    ,  OnModelCompositionReadyCallback: (modelType, firstLoad) => {}
        /*
        Description: Callback function triggered when all the desired linked models or views are loaded and ready.  
        Range of value: Function with a single `modelType` parameter ('2d' or '3d') and a boolean `firstLoad` parameter
        Callback: OnModelCompositionReadyCallback
        Param: {string} modelType - The type of model ('2d' or '3d')
        Param: {boolean} firstLoad - Whether this is the first load of the model
        Default value: undefined  
        Optional: Yes
        */       
}

export default CallbackStore;
