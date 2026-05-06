import React, { useState, useEffect } from "react";
import { IafSubHeader } from "../../component-low/iafSubHeader/IafSubHeader.jsx";
import { IafInputNum } from "../../component-low/IafInputNum/IafInputNum.jsx";
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
import IafUtils from "../../../core/IafUtils.js";
import { IafSwitch } from "../../component-low/iafSwitch/IafSwitch.jsx";
import { IafPoint3d } from "../../component-low/iafPoint3d/IafPoint3d.jsx";
import styles from './DevToolsPanel.module.scss';


export const GltfTools = ({ iafViewer }) => {
    useEffect(() => {
    }, []);

    const [orientation, setOrientation] = useState(null);
    const [modelId, setModelId] = useState(null);

    useEffect(() => {
        if (iafViewer?.iafGltfManager) {
            const gltfManager = iafViewer?.iafGltfManager;
            const gltfModelMap = gltfManager?.gltfModelMap;
            const primaryModelId = iafViewer.props.graphicsResources?.dbModel?._id;
            setOrientation(gltfModelMap?.get(primaryModelId)?.orientation);
            setModelId(primaryModelId);
        }
    }, [iafViewer?.iafGltfManager]);

    useEffect(() => {
        console.log('IafGltfManager: GltfTools orientation updated:', orientation);
        orientation && iafViewer?.iafGltfManager?.redraw(modelId, orientation);
    }, [orientation]);

    return (
        <div>
            <IafSubHeader title="GLTF Tools" minimized={true}>
                <IafInputNum
                    label = "Longitude (degrees)"
                    min={-180}
                    max={180}
                    value = {orientation?.lng || 0}
                    onChange = {(e) => {
                        orientation.lng = e.target.value || 0;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafInputNum
                    label = "Latitude (degrees) "
                    min={-90}
                    max={90}
                    value = {orientation?.lat || 0}
                    onChange = {(e) => {
                        orientation.lat = e.target.value || 0;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafInputNum
                    label = "Rotation X (degrees) "
                    min={-180}
                    max={180}
                    value = {orientation?.modelRotateDegrees[0] || 0}
                    onChange = {(e) => {
                        orientation.modelRotateDegrees[0] = e.target.value || 0;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafInputNum
                    label = "Rotation Y (degrees) "
                    min={-180}
                    max={180}
                    value = {orientation?.modelRotateDegrees[1] || 0}
                    onChange = {(e) => {
                        orientation.modelRotateDegrees[1] = e.target.value || 0;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafInputNum
                    label = "Rotation Z (degrees) "
                    min={-180}
                    max={180}
                    value = {orientation?.modelRotateDegrees[2] || 0}
                    onChange = {(e) => {
                        const diff = e.target.value - orientation.modelRotateDegrees[2];
                        orientation.modelRotateDegrees[2] = e.target.value || 0;
                        orientation.bearing -= diff;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafInputNum
                    label = "Vertical Offset (meters)"
                    min={-1000}
                    max={1000}
                    value = {orientation?.verticalOffsetMeters || 0}
                    onChange = {(e) => {
                        orientation.verticalOffsetMeters = e.target.value || 0;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafInputNum
                    label = "Terrain Height (meters)"
                    min={-1000}
                    max={1000}
                    step={0.001}
                    value = {orientation?.terrainHeightInMeters || 1}
                    onChange = {(e) => {
                        orientation.terrainHeightInMeters = e.target.value || 1;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafInputNum
                    label = "Scale Bimpk"
                    min={0.0}
                    max={1.5}
                    value = {orientation?.scaleBimpk ?? 1.0}
                    onChange = {(e) => {
                        orientation.scaleBimpk = e.target.value ?? 1.0;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafInputNum
                    label = "modelAsMercatorCoordinate.x"
                    value = {orientation?.modelAsMercatorCoordinate.x || 0}
                    onChange = {(e) => {
                        orientation.modelAsMercatorCoordinate.x = e.target.value || 0;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafInputNum
                    label = "modelAsMercatorCoordinate.y"
                    value = {orientation?.modelAsMercatorCoordinate.y || 0}
                    onChange = {(e) => {
                        orientation.modelAsMercatorCoordinate.y = e.target.value || 0;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafInputNum
                    label = "modelAsMercatorCoordinate.z"
                    value = {orientation?.modelAsMercatorCoordinate.z || 0}
                    onChange = {(e) => {
                        orientation.modelAsMercatorCoordinate.z = e.target.value || 0;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafInputNum
                    label = "Offset In Meters (X)"
                    value = {orientation?.offsetInMeters.x || 0}
                    onChange = {(e) => {
                        orientation.offsetInMeters.x = e.target.value || 0;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafInputNum
                    label = "Offset In Meters (Y)"
                    value = {orientation?.offsetInMeters.y || 0}
                    onChange = {(e) => {
                        orientation.offsetInMeters.y = e.target.value || 0;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafInputNum
                    label = "scale"
                    value = {orientation?.scale || 0}
                    onChange = {(e) => {
                        orientation.scale = e.target.value || 0;
                        setOrientation((orientation) => ({ ...orientation }));
                    }}
                />
                <IafButton
                    title="Export Orientation JSON"
                    onClick={() => {
                        // const json = JSON.stringify(orientation, null, 2);
                        IafUtils.exportJSON(orientation, "gltfOrientation.json");
                        console.log("Exported JSON:", orientation);
                    }}
                />
                <IafSwitch
                    title="Dynamic Switching"
                    isChecked={iafViewer.state.gisGltfModelDynamicSwitching}
                    onChange={() => {
                        iafViewer.setState({ gisGltfModelDynamicSwitching: !iafViewer.state.gisGltfModelDynamicSwitching });
                    }}
                />
                {orientation?.modelBoundingMetersGltf && (
                    <div className={styles.devtoolsStats}>
                        <ul className={styles.mainUl}>
                            <IafPoint3d
                                title="GLTF Max Bounding (millimeters)"
                                point3d={{
                                    x: orientation?.modelBoundingMetersGltf?.max.x * 1000,
                                    y: orientation?.modelBoundingMetersGltf?.max.y * 1000,
                                    z: orientation?.modelBoundingMetersGltf?.max.z * 1000
                                }}
                            />
                            <IafPoint3d
                                title="GLTF Min Bounding (millimeters)"
                                point3d={{
                                    x: orientation?.modelBoundingMetersGltf?.min.x * 1000,
                                    y: orientation?.modelBoundingMetersGltf?.min.y * 1000,
                                    z: orientation?.modelBoundingMetersGltf?.min.z * 1000
                                }}
                            />
                        </ul>
                    </div>
                )}
            </IafSubHeader>
        </div>
    );
};

export default GltfTools;
