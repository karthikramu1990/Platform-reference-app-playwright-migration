import React, { useEffect, useState, useRef } from "react";
import { IafSwitch } from "../../component-low/iafSwitch/IafSwitch.jsx";

const MarkerToggle = ({ iafViewer }) => {
    const iafMapBoxGl = iafViewer?.iafMapBoxGl;
    const baseCenter = iafViewer?.iafTuner?.baseCenterObject?.coordinate;
    
    const [showMarkers, setShowMarkers] = useState(true);
    const showMarkersRef = useRef(showMarkers);
    const markersRef = useRef(null);

    const handleMarkerUpdate = () => {
        if (!iafMapBoxGl?.markers) return;

        if (markersRef.current) {
            iafMapBoxGl.markers.removeMarkers(markersRef.current);
            markersRef.current = null;
        }
        
        if (showMarkersRef.current) {
            markersRef.current = iafMapBoxGl.markers.updateMarkers(baseCenter, showMarkersRef.current);
        }
    };

    useEffect(() => {
        showMarkersRef.current = showMarkers;
        handleMarkerUpdate();
    }, [showMarkers]);

    useEffect(() => {
        if (!iafMapBoxGl?.map) return;

        const handleMoveEnd = () => {
            handleMarkerUpdate();
        };

        iafMapBoxGl.map.on("moveend", handleMoveEnd);
        return () => iafMapBoxGl.map.off("moveend", handleMoveEnd);
    }, [iafMapBoxGl?.map]);

    return (
        <div>
            <IafSwitch
                isChecked={showMarkers}
                onChange={() => setShowMarkers((prev) => !prev)}
                title="Show Markers"
            />
        </div>
    );
};

export default MarkerToggle;
