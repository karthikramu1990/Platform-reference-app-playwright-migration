import React, { useState } from "react";
import { IafSubHeader } from "../../component-low/iafSubHeader/IafSubHeader.jsx";
import { IafStorageUtils } from "../../../core/IafUtils.js";
import TooltipStore from "../../../store/tooltipStore.js";
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
import { NotificationStore } from "../../../store/notificationStore.js";
import IafImportJson from "../../component-low/iafImportJson/IafImportJson.jsx";

export const GraphicsResourcesCache = ({ iafViewer }) => {

    // Clear GIS Data from Cache
    const handleClearGraphicsCache = (e) => {
        IafStorageUtils.clearGraphicsCacheLocalStorage(iafViewer); // Clear Graphics Cache from localStorage
        NotificationStore.notifyGraphicsResourcesCacheClearedFromLocalStorage(iafViewer); // Notify that Graphics Cache is cleared
    };

    // // Export GIS Data
    // const handleExportCurrentGraphicsCache = (e) => {
    //     IafStorageUtils.exportGraphicsCache(iafViewer); // Export Graphics Cache
    //     NotificationStore.notifyGraphicsCacheExported(iafViewer); // Notify that Graphics Cache is exported
    // };

    // // Import GIS Data
    // const handleImportGisJson = (data, error) => {
    //     if (data) {
    //         IafStorageUtils.importGraphicsCache(iafViewer, data); // Import Graphics Cache from JSON
    //         NotificationStore.notifyGraphicsCacheImported(iafViewer); // Notify that Graphics Cache is imported
    //     } else {
    //         NotificationStore.notifyGraphicsCacheImportFailed(iafViewer, error); // Notify import failure
    //     }
    // };

    return (
        <div>
            <IafSubHeader title="Graphcis Resources Cache" minimized={true}>
                <IafButton
                    title="Clear Cache"
                    tooltipTitle={TooltipStore.Empty}
                    onClick={handleClearGraphicsCache}
                    width='100%'
                    height="18px"
                ></IafButton>
                {/* <IafButton
                    title="Export Graphics Cache"
                    tooltipTitle={TooltipStore.Empty}
                    onClick={handleExportCurrentGraphicsCache}
                    width='100%'
                    height="18px"
                ></IafButton>
                <IafImportJson
                    title="Import Graphics Cache"
                    tooltipTitle={TooltipStore.Empty}
                    width='100%'
                    height="18px"
                    onImport={handleImportGisJson}
                ></IafImportJson> */}
            </IafSubHeader>
        </div>
    );
};

export default GraphicsResourcesCache;
