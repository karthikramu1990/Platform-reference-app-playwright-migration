import React from 'react';
import { Typography } from '@mui/material';
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
import { IafTextField } from "../../component-low/iafTextField/IafTextField.jsx";

class GisTrial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drag: { x: 0, y: 0, z: 0 },
            trial: null,
            pan: {
                dx: 0, //dx: Horizontal pan; Example: dx = -100 (left), dx = 100 (right)
                dy: 1  //dy: Vertical pan; Example: dy = -100 (up), dy = 100 (down)
            }
        };
    }

    handleChange = (e) => {
        this.setState({
            drag: { ...this.state.drag, [e.target.name]: parseFloat(e.target.value) || 0 }
        });
    };

    handlePanChange = (e) => {
        this.setState({
            pan: { ...this.state.pan, [e.target.name]: parseFloat(e.target.value) || 0 }
        });
    };

    calculateDelta = async () => {
        // Dynamically calculate model bounding box after drag?
        // const modelBounding = await this.props.iafViewer._viewer.model.getModelBounding(
        //     true,
        //     false
        //     );
        // let modelCenterWorld = IafMathUtils.boxCenter(modelBounding);
        // let modelCenterScreen = this.props.iafViewer._viewer.view.projectPoint(modelCenterWorld, this.props.iafViewer._viewer.view.getCamera());

        let _originalCenter = this.props.iafViewer.iafMapBoxGl.getPointFromCoordinate(this.props.iafViewer?.iafTuner?.baseCenterObject.coordinate);
        let _currentCenter = this.props.iafViewer.iafMapBoxGl.getPointFromCoordinate(this.props.iafViewer?.iafMapBoxGl?.map.getCenter());
        const originalLocation = this.props.iafViewer.iafMapBoxGl.map.unproject([_originalCenter.x, _originalCenter.y]);
        const currentLocation = this.props.iafViewer.iafMapBoxGl.map.unproject([_currentCenter.x, _currentCenter.y]);

        let result = new Communicator.Point3();
        this.props.iafViewer.iafTuner?.buildDragDelta({ start: _originalCenter, current: _currentCenter }, result);
        // const op =  this.props.iafViewer.iafMapBoxGl.getMapObject();
        // this.props.iafViewer.iafTuner?.tuneOptions({options: op, decomposedMatrix: this.props.iafViewer.iafMapBoxGl.decomposedMatrix});
        // this.props.iafViewer.iafTuner?.applyTunedCamera();
        new mapboxgl.Marker().setLngLat([currentLocation.lng, currentLocation.lat]).addTo(this.props.iafViewer.iafMapBoxGl.map);
        new mapboxgl.Marker().setLngLat([originalLocation.lng, originalLocation.lat]).addTo(this.props.iafViewer.iafMapBoxGl.map);
        const d = this.findDistanceFromCenter(originalLocation);
        result.x = d + result.x;

        this.setState({ drag: {...result} },()=>{
            console.log("sd", this.state.drag);
        });
    };

    findDistanceFromCenter = (latLng) => {
        const map = this.props.iafViewer.iafMapBoxGl.map;
        const markerLngLat = [latLng.lng, latLng.lat];
        const markerScreenPos = map.project(markerLngLat);
        const cameraLngLat = map.getCenter();
        const cameraScreenPos = map.project([cameraLngLat.lng, cameraLngLat.lat]);
        const pixelDistance = Math.sqrt(
            Math.pow(markerScreenPos.x - cameraScreenPos.x, 2) +
            Math.pow(markerScreenPos.y - cameraScreenPos.y, 2)
        );
        const pitch = map.getPitch() * (Math.PI / 180);
        let metersPerPixel = (40075016.686 * Math.cos(cameraLngLat.lat * Math.PI / 180)) / Math.pow(2, map.getZoom() + 8);
        // metersPerPixel *= Math.cos(pitch);
        const distanceInMM = pixelDistance * metersPerPixel * 1000;
        // const mmPerPixel = GisDistance.getMilliMetersPerPixelFromMap(map);
        // const distanceInMM = pixelDistance * mmPerPixel;
        return distanceInMM;
    }

    adjust(mmDelta) {
        
    }

    moveToLocation = () => {
        const { x, y, z } = this.state.drag;
        const delta = new Communicator.Point3((x) || 0, (y) || 0, (z) || 0);
        this.props.iafViewer.iafTuner?.dragMatrix.setTranslationComponent(delta.x, delta.y, delta.z);
        const options = this.props.iafViewer.iafMapBoxGl.getMapObject();
        this.props.iafViewer.iafTuner?.tuneOptions({ options: options, decomposedMatrix: this.props.iafViewer.iafMapBoxGl.decomposedMatrix });
        this.props.iafViewer.iafTuner?.applyTunedCamera();
    };

    panMap = () => {
        const { dx, dy } = this.state.pan;
        const center = this.props.iafViewer.iafMapBoxGl.map.getCenter();
        const centerPoint = this.props.iafViewer.iafMapBoxGl.map.project(center);
        const newCenterPoint = {
            x: centerPoint.x + dx,
            y: centerPoint.y + dy
        };
        const newCenter = this.props.iafViewer.iafMapBoxGl.map.unproject(newCenterPoint);
        this.props.iafViewer.iafMapBoxGl.map.fire('dragstart', { event: 'dragstart' });
        this.props.iafViewer.iafMapBoxGl.map.setCenter(newCenter);
        this.props.iafViewer.iafMapBoxGl.map.fire('drag', { event: 'drag' });
        setTimeout(() => {
            this.props.iafViewer.iafMapBoxGl.map.fire('dragend', { event: 'dragend' });
        }, 50);
    };

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    
                    backgroundColor: "#2c2c2c",
                    borderRadius: "8px",
                    width: "215px",
                    margin: "auto",
                    padding: "5px",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                    {/* Pan Controls (Left & Right) */}
                    <div style={{ display: "flex", justifyContent: "space-between",  width: "100%" }}>
                        <label style={{ color: "white", flex: 1 }}>dx:</label>
                        <IafTextField type="number" name="dx" value={this.state.pan.dx} onChange={this.handlePanChange} style={{ flex: 2 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between",  width: "100%" }}>
                        <label style={{ color: "white", flex: 1 }}>dy:</label>
                        <IafTextField type="number" name="dy" value={this.state.pan.dy} onChange={this.handlePanChange} style={{ flex: 2 }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                        <IafButton title="Pan" width="50%" height="30px" onClick={this.panMap} />
                    </div>

                    {/* Move 3D Controls (Left & Right) */}
                    <div style={{ display: "flex", justifyContent: "space-between",  width: "100%" }}>
                        <label style={{ color: "white", flex: 1 }}>X:</label>
                        <IafTextField type="number" name="x" value={this.state.drag.x} onChange={this.handleChange} style={{ flex: 2 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between",  width: "100%" }}>
                        <label style={{ color: "white", flex: 1 }}>Y:</label>
                        <IafTextField type="number" name="y" value={this.state.drag.y} onChange={this.handleChange} style={{ flex: 2 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between",  width: "100%" }}>
                        <label style={{ color: "white", flex: 1 }}>Z:</label>
                        <IafTextField type="number" name="z" value={this.state.drag.z} onChange={this.handleChange} style={{ flex: 2 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap:"5px", width: "100%" }}>
                        <IafButton title="Calculate Delta" width="50%" height="30px" onClick={this.calculateDelta} />
                        <IafButton title="Move 3D" width="50%" height="30px" onClick={this.moveToLocation} />
                    </div>
                </div>
                <IafButton
                    title="Remove Markers"
                    width="50%"
                    height="30px"
                    onClick={() => {
                        document.querySelectorAll(".mapboxgl-marker").forEach((marker) => marker.remove());
                    }}
                />
            </div>
        );
    }
}

export default GisTrial;
