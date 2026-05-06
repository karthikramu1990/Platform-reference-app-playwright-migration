import React, { useState, useEffect } from "react";
import { IafSubHeader } from "../../component-low/iafSubHeader/IafSubHeader.jsx";
import { IafStorageUtils } from "../../../core/IafUtils.js";
import TooltipStore from "../../../store/tooltipStore.js";
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
import { NotificationStore } from "../../../store/notificationStore.js";
import IafImportJson from "../../component-low/iafImportJson/IafImportJson.jsx";
import { GisDistance } from "../../../core/gis/distance.js";
import { IafSwitch } from "../../component-low/iafSwitch/IafSwitch.jsx";
import { IafTextField } from "../../component-low/iafTextField/IafTextField.jsx";
import getMapboxToken, { TokenType } from "../../../core/gis/accessTokens.js";
import { IafInputNum } from "../../component-low/IafInputNum/IafInputNum.jsx";
import { IafMathUtils } from "../../../core/IafMathUtils.js";
import { DEFAULT_GIS_ZOOM_SPEED, DEFAULT_GIS_DISTANCE_SCALE_FACTOR } from "../../../core/gis/utils.js";


export const GisButtons = ({ iafViewer }) => {

    const [isDevGisInfoEnabled, setDevGisViewInfoEnabled] = useState(false);
    const [mapboxKey, setMapboxKey] = useState("");
    const [adustCameraFactorForPitch, setAdustCameraFactorForPitch] = useState(10000);
    const [distanceAccuracy, setDistanceAccuracy] = useState(iafViewer?.iafTuner?.distanceScale);

    useEffect(() => {
        const fetchMapboxKey = async () => {
            try {
                const token = await getMapboxToken(iafViewer);
                token.type === TokenType.INTERNAL_LOCAL && setMapboxKey(token?.key || "");
            } catch (error) {
                console.error(error);
            }
        };
        fetchMapboxKey();
    }, []);

    const handleMapboxKeyChange = (event) => {
        setMapboxKey(event.target.value);
    };
    
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            event.target.blur();
        }
    };

    const handleMapboxKeySubmit = () => {
        const trimmedKey = mapboxKey.trim();
        
        if (trimmedKey) {
            IafStorageUtils.setMapboxKey(trimmedKey);
            NotificationStore.notifyMapboxKeySavedToLocalStorage(iafViewer);
        } else {
            // If the user clears the input, remove the key from localStorage
            IafStorageUtils.removeMapboxKey();
            NotificationStore.notifyMapboxKeyRemoved(iafViewer);
        }
    };
    
    // Save GIS Data to Cache
    const handleSaveCurrentGisData = (e) => {
        IafStorageUtils.clearGisDataLocalStorage(iafViewer); // Clear GIS data from localStorage
        IafStorageUtils.saveGisData(iafViewer); // Save GIS data to storage
        NotificationStore.notifyGisDataSavedToLocalStorage(iafViewer); // Notify that GIS data is saved
    };

    const handleAdjustCameraForPitch = (e) => {
        const camera = IafMathUtils.adjustCameraForPitch(iafViewer._viewer?.view.getCamera(), iafViewer.iafMapBoxGl?.options?.pitch, adustCameraFactorForPitch);
        camera && iafViewer._viewer?.view.setCamera(camera);
    };

    const handleDevGisViewInfoEnabled = (event) => {
        const { checked } = event.target;
        iafViewer.setState({isDevGisInfoEnabled: checked});
        setDevGisViewInfoEnabled(checked);
    }    
    
    // const handleVerticalAlignmentFixEnabled = (event) => {
    //     const { checked } = event.target;
    //     iafViewer.setState({isVerticalAlignmentFixEnabled: checked});
    //     iafViewer?.iafMapBoxGl?.recalculateBoundingBox(checked);
    // }    

    const handleGltfViewEnabled = (event) => {
        const { checked } = event.target;
        iafViewer.setState({isGltfViewEnabled: checked});
    }    

    function handleFovInputChange(e) {
        const _fov = parseFloat(e.target.value) || props.viewer.iafMapBoxGl.getCameraFOV();
        // setNewCamera((prevCamera) => ({
        // ...prevCamera,
        // _fov
        // }));
    }

    function handleAdustCameraFactorForPitchInputChange(e) {
        setAdustCameraFactorForPitch(parseFloat(e.target.value) || 10000);
    }

    function handleGisZoomSpeedChange(e) {
        const n = parseFloat(e.target.value);
        if (!isFinite(n) || n <= 0) return;
        iafViewer.setState({ gisZoomSpeed: n });
    }

    function handleGisDistanceScaleFactorChange(e) {
        const n = parseFloat(e.target.value);
        if (!isFinite(n) || n <= 0) return;
        iafViewer.setState({ gisDistanceScaleFactor: n });
        iafViewer?.iafTuner?.updateDistanceScale?.("gisDistanceScaleFactor dev tools");
    }

    // Load GIS Data from Cache
    const handleLoadGisDataFromCache = (e) => {
        IafStorageUtils.loadGisData(iafViewer); // Load GIS data from cache
        NotificationStore.notifyGisDataLoadedFromLocalStorage(iafViewer); // Notify that GIS data is loaded
    };

    // Clear GIS Data from Cache
    const handleClearGisData = (e) => {
        IafStorageUtils.clearGisDataLocalStorage(iafViewer); // Clear GIS data from localStorage
        IafStorageUtils.clearGisData(iafViewer); // Clear GIS data from storage
        NotificationStore.notifyGisDataClearedFromLocalStorage(iafViewer); // Notify that GIS data is cleared
    };

    // Export GIS Data
    const handleExportCurrentGisData = (e) => {
        IafStorageUtils.exportGisData(iafViewer); // Export GIS data
        NotificationStore.notifyGisDataExported(iafViewer); // Notify that GIS data is exported
    };

    // Import GIS Data
    const handleImportGisJson = (data, error) => {
        if (data) {
            IafStorageUtils.importGisData(iafViewer, data); // Import GIS data from JSON
            NotificationStore.notifyGisDataImported(iafViewer); // Notify that GIS data is imported
        } else {
            NotificationStore.notifyGisDataImportFailed(iafViewer, error); // Notify import failure
        }
    };
    
    const handleDevGisMeasEnabled = (event) => {
        const { checked } = event.target;
        iafViewer.setState({ isDevGisMeasEnabled: checked });

        if (checked) {
            GisDistance.setupMeasurements(iafViewer);
        } else {
            GisDistance.cleanupMeasurements(iafViewer);
        }
    }    

    return (
        <div>
            <IafSubHeader title="GIS" minimized={true}>
                {/* {iafViewer?.newToolbarElement?.current?.state?.enableMapBox && <GisTrial iafViewer={iafViewer} />} */}
                <IafTextField
                    type="text"
                    value={mapboxKey}
                    onChange={handleMapboxKeyChange}
                    onBlur={handleMapboxKeySubmit}
                    onKeyDown={handleKeyDown}
                    placeHolder="Enter Mapbox License Key"
                    autoFocus
                    backgroundColor="white"
                    color="primary"
                />
                <IafInputNum
                    label="GIS zoom speed (N for 1/N)"
                    value={iafViewer?.state?.gisZoomSpeed ?? DEFAULT_GIS_ZOOM_SPEED}
                    min={0.1}
                    max={100.0}
                    onChange={handleGisZoomSpeedChange}
                />
                <IafInputNum
                    label="Distance scale factor (clamp center)"
                    value={iafViewer?.state?.gisDistanceScaleFactor ?? DEFAULT_GIS_DISTANCE_SCALE_FACTOR}
                    min={0.5}
                    max={2.0}
                    onChange={handleGisDistanceScaleFactorChange}
                />
                {/* <IafSwitch
                    title={"Vertical Alignment Fix"}
                    isChecked={iafViewer?.state?.isVerticalAlignmentFixEnabled}
                    name="isVerticalAlignmentFixEnabled"
                    onChange={handleVerticalAlignmentFixEnabled}
                    showValue={true}
                /> */}
                <IafSwitch
                    title={"GLTF View"}
                    isChecked={iafViewer?.state?.isGltfViewEnabled}
                    name="isGltfViewEnabled"
                    onChange={handleGltfViewEnabled}
                    showValue={true}
                />                
                <IafSwitch
                    title={"GIS View Info"}
                    isChecked={isDevGisInfoEnabled}
                    name="isDevGisInfoEnabled"
                    onChange={handleDevGisViewInfoEnabled}
                    showValue={true}
                />
                <IafInputNum
                    label = "Distance Accuracy"
                    value = {iafViewer?.iafTuner?.distanceScale} // {distanceAccuracy}
                />                
                <IafInputNum
                    label = "Normalized Distance Accuracy"
                    value = {iafViewer?.iafTuner?.distanceScaleNormalized} // {distanceAccuracy}
                />                
                <IafInputNum
                    label = "FoV"
                    value = {iafViewer?.iafMapBoxGl?.getCameraFOV()}
                    onChange = {handleFovInputChange}
                />                
                <IafInputNum
                    label = "Adjust Camera Factor"
                    value = {adustCameraFactorForPitch}
                    onChange = {handleAdustCameraFactorForPitchInputChange}
                />                
                <IafButton
                    title="Adjust Camera for Pitch"
                    tooltipTitle={TooltipStore.Empty}
                    onClick={handleAdjustCameraForPitch}
                    width='100%'
                    height="18px"
                ></IafButton>                
                <IafButton
                    title="Save GIS Data To Cache"
                    tooltipTitle={TooltipStore.GisSaveToCache}
                    onClick={handleSaveCurrentGisData}
                    width='100%'
                    height="18px"
                ></IafButton>
                <IafButton
                    title="Load GIS Data From Cache"
                    tooltipTitle={TooltipStore.GisLoadFromCache}
                    onClick={handleLoadGisDataFromCache}
                    width='100%'
                    height="18px"
                ></IafButton>
                <IafButton
                    title="Clear GIS Data from Cache"
                    tooltipTitle={TooltipStore.GisClearCache}
                    onClick={handleClearGisData}
                    width='100%'
                    height="18px"
                ></IafButton>
                <IafButton
                    title="Export GIS Data (Download)"
                    tooltipTitle={TooltipStore.GisExportOrDownload}
                    onClick={handleExportCurrentGisData}
                    width='100%'
                    height="18px"
                ></IafButton>
                <IafImportJson
                    title="Import GIS Data"
                    tooltipTitle={TooltipStore.GisImport}
                    width='100%'
                    height="18px"
                    onImport={handleImportGisJson}
                ></IafImportJson>
                <IafSwitch
                    title={"Measurements"}
                    isChecked={iafViewer?.state?.isDevGisMeasEnabled}
                    name="isDevGisMeasEnabled"
                    onChange={handleDevGisMeasEnabled}
                    showValue={true}
                    // customTitleStyles={{fontSize: '14px', fontWeight: 'bold'}}
                />
            </IafSubHeader>
        </div>
    );
};

export default GisButtons;
