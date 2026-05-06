// /**
//  * ****************************************************************************
//  *
//  * INVICARA INC CONFIDENTIAL __________________
//  *
//  * Copyright (C) [2012] - [2010] INVICARA INC, INVICARA Pte Ltd, INVICARA INDIA
//  * PVT LTD All Rights Reserved.
//  *
//  * NOTICE: All information contained herein is, and remains the property of
//  * Invicara Inc and its suppliers, if any. The intellectual and technical
//  * concepts contained herein are proprietary to Invicara Inc and its suppliers
//  * and may be covered by U.S. and Foreign Patents, patents in process, and are
//  * protected by trade secret or copyright law. Dissemination of this information
//  * or reproduction of this material is strictly forbidden unless prior written
//  * permission is obtained from Invicara Inc.
//  */

// // -------------------------------------------------------------------------------------
// // Date        Author     Referene    Comments
// // 06-01-23    ATK        PLAT-2709   New UX UI Foundation Project
// //                                    Code Restructuring.
// // 16-05-23    ATK        PLAT-2813   Restructuring
// // 01-08-23    ATK        PLAT-3117   Selection and highlighting enhancements
// //
// // -------------------------------------------------------------------------------------

// import React from 'react'
// import ViewerManager from "./common/ViewerManager"
// import {IfefSpinner} from '@dtplatform/react-ifef'
// import NewToolbar from './ui/layouts/NewToolbar.jsx'
// import ViewerIsolateZoomHelper from "./common/ViewerIsolateZoomHelper.js";
// //import ViewerPropertyWindow from "./ViewerPropertyWindow.jsx";
// import EvmUtils from "./common/evmUtils.js";

// class IafViewerSCS extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       hwvInstantiated: false,
//       isModelLoading: false,
//       hasModelLoaded: false,
//       selectedNode: {name: '', properties: []},
//     };
//     this.modelBounding = null;
//     this._viewer = undefined;
//     this._hwvManager = new ViewerManager();
//     this._isolateZoomHelper = undefined;
//     this._onPartSelection = this._onPartSelection.bind(this)
//     this.loadModel = this.loadModel.bind(this)
//     this._createViewer = this._createViewer.bind(this)
//     this.updateCuttingPlanes = this.updateCuttingPlanes.bind(this)
//     this.updateCuttingSection = this.updateCuttingSection.bind(this)
//     this.enableCuttingPlanes = this.enableCuttingPlanes.bind(this)
//     this.showCuttingPlaneGeometry = this.showCuttingPlaneGeometry.bind(this);
//     this.getModelBoundingBox = this.getModelBoundingBox.bind(this);

//     this.commands = {
//       resetAll: async () => {
//         //this will unselect all selected and highlighted
//         await this.enableCuttingPlanes(false)
//         this._viewer.selectPart(null)
//         //await this.setGlassMode(false)
//         await this._isolateZoomHelper.showAll();
//         //resetCamera is similar to fitWorld
//         await this._viewer.view.resetCamera()
//         //keep track if a reset viewer happened, if it does, set sliceNodeIds to []
//         this._viewer.view.setProjectionMode(Communicator.Projection.Orthographic)
//       }
//     }
//   }

//   async loadModel(modelUri, viewer) {
//     const modelNum = viewer.model.getNodeChildren(viewer.model.getAbsoluteRootNode()).length;
//     const nodeName = "Model-" + (modelNum + 1);
//     const modelNodeId = viewer.model.createNode(null, nodeName);
//     //this._modelList.push(modelName); // Instantiated in next code snippet
//     return viewer.model.loadSubtreeFromScsFile(modelNodeId, modelUri);
//   }

//   async componentDidUpdate(prevProps, prevState, snapshot){
//     const {modelUri} = this.props
//     if(modelUri != prevProps.modelUri){
//       this._createViewer()
//     }
//   }

//   async updateCuttingSection(index, axis, normal, d, translation){
//     let cuttingSec = this._viewer.cuttingManager.getCuttingSection(index)
//     let plane = cuttingSec.getPlane(0)
//     if(plane === null){
//       plane = new Communicator.Plane()
//       plane.normal.set(normal.x, normal.y, normal.z)
//       plane.d = d
//       cuttingSec.addPlane(plane, this._viewer.cuttingManager.createReferenceGeometryFromAxis(axis, this.modelBounding));
//     }
//     else{
//       let planePosition = new Communicator.Matrix().loadIdentity().setTranslationComponent(translation.x,translation.y,translation.z);
//       plane.d = d;
//       cuttingSec.updatePlane(0,plane,planePosition, true, true)
//     }
//   }

//   async enableCuttingPlanes(enable){
//     for(let i = 0; i < 6 ; i++){
//       let cuttingSec = this._viewer.cuttingManager.getCuttingSection(i);
//       enable? cuttingSec.activate() : cuttingSec.deactivate();
//     }
    
//   }  

//   async showCuttingPlaneGeometry(show){
//     for(let i = 0; i < 2; i++){
//       let cuttingSec = this._viewer.cuttingManager.getCuttingSection(i);
//       let plane = cuttingSec.getPlane(0);
//       cuttingSec.setPlane(0, plane, show? this._viewer.cuttingManager.createReferenceGeometryFromAxis(Communicator.Axis.Z, this.modelBounding) : null);
//     }
//     for(let i = 2; i < 4; i++){
//       let cuttingSec = this._viewer.cuttingManager.getCuttingSection(i);
//       let plane = cuttingSec.getPlane(0);
//       cuttingSec.setPlane(0, plane, show? this._viewer.cuttingManager.createReferenceGeometryFromAxis(Communicator.Axis.Y, this.modelBounding) : null);
//     }
//     for(let i = 4; i < 6; i++){
//       let cuttingSec = this._viewer.cuttingManager.getCuttingSection(i);
//       let plane = cuttingSec.getPlane(0);
//       cuttingSec.setPlane(0, plane, show? this._viewer.cuttingManager.createReferenceGeometryFromAxis(Communicator.Axis.X, this.modelBounding) : null);
//     }
//   }

//   getModelBoundingBox(){
//     return this.modelBounding;
//   }

//   async updateCuttingPlanes(ceilingPlane, floorPlane, leftPlane, rghtPlane, backPlane, frontPlane){
//     this.updateCuttingSection(0, Communicator.Axis.Z, new Communicator.Point3(0, 0, 1), -ceilingPlane, new Communicator.Point3(0, 0, ceilingPlane))
//     this.updateCuttingSection(1, Communicator.Axis.Z, new Communicator.Point3(0, 0, -1), floorPlane, new Communicator.Point3(0, 0, floorPlane))
//     this.updateCuttingSection(2, Communicator.Axis.Y, new Communicator.Point3(0, 1, 0), -leftPlane, new Communicator.Point3(0, leftPlane, 0))
//     this.updateCuttingSection(3, Communicator.Axis.Y, new Communicator.Point3(0, -1, 0), rghtPlane, new Communicator.Point3(0, rghtPlane, 0))
//     this.updateCuttingSection(4, Communicator.Axis.X, new Communicator.Point3(1, 0, 0), -backPlane, new Communicator.Point3(backPlane, 0, 0))
//     this.updateCuttingSection(5, Communicator.Axis.X, new Communicator.Point3(-1, 0, 0), frontPlane, new Communicator.Point3(frontPlane, 0, 0))
//   }

//   componentDidMount(){
//     const {modelUri} = this.props
//     if(modelUri && modelUri.length > 0){
//       this._createViewer()
//     }
//   }
//   _createViewer() {
//     const {modelUri} = this.props;

//     this._hwvManager.createSCSViewer(EvmUtils.EVMMode.View3d, modelUri)
//       .then( (viewer) => {
//         this._viewer = viewer;
//         this._isolateZoomHelper = new ViewerIsolateZoomHelper(viewer, this)
//         // Once the viewer is instantiated, we can set the state to true to have the React update the DOM
//         this.setState({
//           hwvInstantiated: true,
//           isModelLoading: true
//         });

//         // Storing the callback in its own function to avoid registering a bound callback
//         // (more difficult to unregister that in HC)
//         let parent = this;
//         this._viewer.setCallbacks({
//           modelStructureReady: async () => {
//             this.modelBounding = await this._viewer.model.getModelBounding(false, false);
//             this.updateCuttingPlanes(
//                 this.modelBounding.max.z,
//                 this.modelBounding.min.z,
//                 this.modelBounding.max.y,
//                 this.modelBounding.min.y,
//                 this.modelBounding.max.x,
//                 this.modelBounding.min.x
//             );
//             this.setState({isModelLoading: false})
//           },
//           selectionArray: (events) => {
//             let event = events.pop();
//             if (event) {
//               this._onPartSelection(event);
//             }
//           },
//           sceneReady: () => {
//             console.log("Web Viewer has been initialized.");
//             /*let camPos, target, upVec;
//             camPos = new window.Communicator.Point3(0, 200, 400);
//             target = new window.Communicator.Point3(0, 1, 0);
//             upVec = new window.Communicator.Point3(0.2, 1, 0.5);
//             const defaultCam = window.Communicator.Camera.create(
//               camPos, target, upVec, 1, 720, 720, 0.01);
//             this._viewer.view.setCamera(defaultCam);*/

//             // Background color for viewers
//             this._viewer.view.setBackgroundColor(new window.Communicator.Color(252, 252, 252),
//               new window.Communicator.Color(230, 230, 230))

//           },
//           timeout: () => {
//             alert('This page will time out due to inactivity.')
//           }
//         });
//         window.addEventListener("resize", this._viewer.resizeCanvas);

//       });
//   }

//   _onPartSelection(event){
//     let _this = this;
//     let model = this._viewer.model;
//     let id = event.getSelection().getNodeId();
//     if (id === null || !model.isNodeLoaded(id)) {
//       return Promise.resolve();
//     }
//     let nodeName = model.getNodeName(id);
//     model.getNodeProperties(id).then(function (props) {
//       _this.setState({selectedNode: {name: nodeName, properties: props}})
//     })

//   }

//   render() {

//     let viewerElement;
//     // We must render a div for the viewer to be placed in. This component must mount before instantiating the viewer.
//     // Once the component has mounted and the viewer is instantiated, we can render other components that rely on it.
//     if (!this.state.hwvInstantiated) {
//       viewerElement = <div></div>;
//     }

//     else {
//       // Now that the viewer is instantiated, we can render any other components that depend on it (like UI for the viewer or part info)
//       viewerElement = (
//         <div style={{borderRadius: '1em', padding: '20px'}}>
//           <NewToolbar viewer={this._viewer}
//                       getModelBoundingBox={this.getModelBoundingBox}
//                       updateCuttingPlanes={this.updateCuttingPlanes}
//                       enableCuttingPlanes={this.enableCuttingPlanes}
//                       showCuttingPlaneGeometry={this.showCuttingPlaneGeometry}
//                       commands={this.commands}
//                       testUi={true}/>
//           {/*<ViewerPropertyWindow selectedNode={this.state.selectedNode}/>*/}
//           <div id='modelSpinner' style={{
//              position: "absolute",
//              bottom: "30px",
//              right: "30px"
//           }}>{this.state.isModelLoading && <IfefSpinner icon="android" />}</div>
//         </div>
//       )

//     }

//     return (
//       <div>
//         <div id="webviewer-container">
//           <div id=EvmUtils.EVMMode.View3d/>
//           {viewerElement}
//         </div>
//       </div>

//     );
//   }
// }

// export default IafViewerSCS;

