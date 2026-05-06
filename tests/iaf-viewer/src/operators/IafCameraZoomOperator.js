/**
 * ****************************************************************************
 *
 * INVICARA INC CONFIDENTIAL __________________
 *
 * Copyright (C) [2012] - [2021] INVICARA INC, INVICARA Pte Ltd, INVICARA INDIA
 * PVT LTD All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of
 * Invicara Inc and its suppliers, if any. The intellectual and technical
 * concepts contained herein are proprietary to Invicara Inc and its suppliers
 * and may be covered by U.S. and Foreign Patents, patents in process, and are
 * protected by trade secret or copyright law. Dissemination of this information
 * or reproduction of this material is strictly forbidden unless prior written
 * permission is obtained from Invicara Inc.
 */


// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
/* 19-01-24    raja.r     PLAT-3129   This is taken from the most recent version of the Techsoft3D GitHub repository, 
                                      specifically related to the 'CameraZoomOperator'. 
                                      Adjustments have been made to rectify a bug identified as DBM-974 in the Hoops Viewer. 
                                      (The bug involves an anomalous behavior in the model, noticeable when continuously zooming in beyond a particular threshold.) */


// -------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------- */

export let IafCameraZoomOperator;
export function getIafCameraZoomOperator() {
    IafCameraZoomOperator = class IafCameraZoomOperator extends Communicator.Operator.OperatorBase {
    constructor(viewer) {
        super(viewer);
        this._mouseMoveZoomDelta = 3;
        this._mouseWheelZoomDelta = 0.25;
        this._pinchZoomModifier = 2.5;
        this._zoomToMousePosition = true;
        this._dollyZoomEnabled = false;
        this._adjustCameraTarget = false;
        this._preserveViewAngle = true;
        this._mouseMoveZoomFactor = 1;
        this._mouseWheelZoomFactor = -1;
        this._secondaryTouchId = null;
        this._lastTouch1 = Communicator.Point2.zero();
        this._lastTouch2 = Communicator.Point2.zero();
        this._prevLen = 0.0;

        //Custom variables.
        this._prevZoomMultiplier = 0.3; // PLAT-4073: Added this variable. The model was missing on load + zoom (without focus).
        this._camPostargetDistance = null;
        this._progressiveZoomDeltaForMouseScroll = 0.1;  //This variable is used to inc/dec the progressive zoom speed on mouse scroll
    }

    /**
     * Initializes the camera for extended zoom functionality.
     * Sets the initial camera target and adjusts parameters for extended zoom capabilities,
     * enabling the system to perform zoom operations beyond the standard range.
     */
    initialise()
    {
      //Change intital target to perform extended zoom
      var cam = this._viewer.view.getCamera();
      var camPos = cam.getPosition();
      var camTarget = cam.getTarget();
      var lookAtvec = Communicator.Point3.subtract(camTarget, camPos);
      cam.setNearLimit(0.001);
      this._viewer.view.setCamera(cam);
      this._camPostargetDistance = lookAtvec.length();
    }

    setMouseWheelZoomInverted(inverted) {
        if (inverted) {
            this._mouseWheelZoomFactor = -1;
        } else {
            this._mouseWheelZoomFactor = 1;
        }
    }

    getMouseWheelZoomInverted() {
        return this._mouseWheelZoomFactor === -1;
    }

    setMouseMoveZoomInverted(inverted) {
        if (inverted) {
            this._mouseMoveZoomFactor = -1;
        } else {
            this._mouseMoveZoomFactor = 1;
        }
    }

    getMouseMoveZoomInverted() {
        return this._mouseMoveZoomFactor === -1;
    }

    setMouseMoveZoomDelta(delta) {
        this._mouseMoveZoomDelta = delta;
    }

    getMouseMoveZoomDelta() {
        return this._mouseMoveZoomDelta;
    }

    setMouseWheelZoomDelta(delta) {
        this._mouseWheelZoomDelta = delta;
    }

    getMouseWheelZoomDelta() {
        return this._mouseWheelZoomDelta;
    }

    setZoomToMousePosition(zoom) {
        this._zoomToMousePosition = zoom;
    }

    getZoomToMousePosition() {
        return this._zoomToMousePosition;
    }

    setDollyZoomEnabled(dollyZoomEnabled) {
        this._dollyZoomEnabled = dollyZoomEnabled;
    }

    getDollyZoomEnabled() {
        return this._dollyZoomEnabled;
    }

    setMouseWheelAdjustCameraTarget(value) {
        this._adjustCameraTarget = value;
    }

    getMouseWheelAdjustCameraTarget() {
        return this._adjustCameraTarget;
    }

    setPreserveViewAngle(value) {
        this._preserveViewAngle = value;
    }

    getPreserveViewAngle() {
        return this._preserveViewAngle;
    }

    async onMouseMove(event) {
        super.onMouseMove(event);

        if (this.isDragging() && this.isActive()) {
            const view = this._viewer.view;
            const currentWindowPosition = view.pointToWindowPosition(this._ptCurrent);
            const prevWindowPosition = view.pointToWindowPosition(this._ptPrevious);
            const deltaY = currentWindowPosition.y - prevWindowPosition.y;
            const deltaX = currentWindowPosition.x - prevWindowPosition.x;
            const delta = this._mouseMoveZoomDelta * this._mouseMoveZoomFactor * (deltaY - deltaX);

            if (this._dollyZoomEnabled) {
                await this._dollyZoom(delta, undefined, undefined, true);
            } else {
                await this._doZoom(delta);
            }
        }
    }

    /**
     * Recalculates the camera target position for progressive or infinite zoom.
     * Adjusts the camera parameters to achieve a deep zoom effect while maintaining
     * a consistent distance between the camera and target in perspective projection mode.
    */
    recalculateTarget(){
        //Progressive zoom/infinite zoom 
        if (this._camPostargetDistance != null) {
            //Change the target position with respect to position movement to acheive deep zoom.
            if (Communicator.Projection.Perspective === this._viewer.view.getProjectionMode()) {
                var cam = this._viewer.view.getCamera();
                var camPos = cam.getPosition();
                var camTarget = cam.getTarget();
                var lookAtvec = Communicator.Point3.subtract(camTarget, camPos);
                var len = lookAtvec.length();
                //Compare both look at vector by limiting their precision after decimal point 
                if (this._camPostargetDistance.toFixed(4) != len.toFixed(4)) {
                    lookAtvec.normalize();
                    var ratio = this._camPostargetDistance / len;
    
                    cam.setHeight(cam.getHeight() * ratio);
                    cam.setWidth(cam.getWidth() * ratio);
    
                    var newTarget = Communicator.Point3.add(camPos, lookAtvec.scale(this._camPostargetDistance));
                    cam.setTarget(newTarget);
                    cam.setNearLimit(0.001);
                    this._viewer.view.setCamera(cam);
                }
            }
        }
    }

    /**
     * Adjusts the mouse wheel delta to control zoom speed based on the distance 
     * between the camera position and the target. a progressive zoom approach and
     * considers the distance to selected entities or picked objects.
    */
    async adjustMouseWheelDelta(event){
        var self = this;
        var selectionDistance=null;
        var pickDistance=null;
        var distance =null;
        //Manage zoom speed based on distance berween target and position.
        var penetrationFactor = 0.001;
        var pickConfig = new Communicator.PickConfig(Communicator.SelectionMask.All);
        let entities = this._viewer.selectionManager.getResults()
        var cameraPos = self._viewer.view.getCamera().getPosition();

        if(entities && entities.length){
            let box= await this._viewer.model.getNodesBounding([entities[0].getNodeId()])
            let objectposition = box.center();
            selectionDistance = Communicator.Point3.subtract(objectposition, cameraPos).length();
        }

        let selectedItem = await this._viewer.getView().pickFromPoint(event.getPosition(), pickConfig);
        let objectposition =selectedItem ? selectedItem.getPosition():null;
        if(objectposition!==null)
        pickDistance =Communicator.Point3.subtract(objectposition, cameraPos).length();

        if(selectionDistance!==null && pickDistance!==null)
            distance = Math.min(selectionDistance,pickDistance);
        else 
            distance = selectionDistance?selectionDistance:pickDistance;
        var zoomFactor = 1;
        if ( distance && self._camPostargetDistance != null) {
            if (distance > self._camPostargetDistance)
                distance = self._camPostargetDistance;

            zoomFactor = (distance / self._camPostargetDistance) * self._progressiveZoomDeltaForMouseScroll;
            self._prevZoomMultiplier = distance / self._camPostargetDistance;
        } else
            zoomFactor = self._prevZoomMultiplier * self._progressiveZoomDeltaForMouseScroll;

        self.setMouseWheelZoomDelta(zoomFactor + penetrationFactor);
    }

    async onMousewheel(event) {
        //** Custom method: Recalculate the camera target position for DBM-974 bug fix */
        this.recalculateTarget()
        //** Custom method: Adjust mouse wheel delta to control zoom speed based on camera-target distance */
        await this.adjustMouseWheelDelta(event)

        const delta = this._mouseWheelZoomDelta * this._mouseWheelZoomFactor * event.getWheelDelta();
        if (this._dollyZoomEnabled) {
            await this._dollyZoom(-delta, undefined, event.getPosition());
        } else {
            await this._doZoom(delta, undefined, event.getPosition());
        }
    }

    onTouchStart(event) {
        const view = this._viewer.view;

        if (this._primaryTouchId === null) {
            this._primaryTouchId = event.getId();
            this._lastTouch1.assign(view.pointToWindowPosition(event.getPosition()));
        } else if (this._secondaryTouchId === null) {
            this._secondaryTouchId = event.getId();
            this._lastTouch2.assign(view.pointToWindowPosition(event.getPosition()));
        }

        if (this._primaryTouchId !== null && this._secondaryTouchId !== null) {
            this._prevLen = Communicator.Point2.subtract(this._lastTouch2, this._lastTouch1).length();
            this._dragging = true;
        }
    }

    onTouchMove(event) {
        const view = this._viewer.view;
        const id = event.getId();
        const position = event.getPosition();

        if (id === this._primaryTouchId)
            this._lastTouch1.assign(view.pointToWindowPosition(position));
        else if (id === this._secondaryTouchId)
            this._lastTouch2.assign(view.pointToWindowPosition(position));

        if (this._dragging && (id === this._primaryTouchId || id === this._secondaryTouchId)) {
            const l1 = Communicator.Point2.subtract(this._lastTouch2, this._lastTouch1).length();
            const zoomFactor = (this._prevLen - l1) * this._pinchZoomModifier;

            const zoom = 1.0 / (1.0 - zoomFactor);
            this._zoomHelper(zoom, this._viewer.view.getCamera());

            this._prevLen = l1;
        }
        return Promise.resolve();
    }

    onTouchEnd(event) {
        const id = event.getId();

        if (this._primaryTouchId === id) this._primaryTouchId = null;
        else if (this._secondaryTouchId === id) this._secondaryTouchId = null;

        this._dragging = false;
    }

    onDeactivate() {
        this._primaryTouchId = null;
        this._secondaryTouchId = null;
    }

    _updateCameraViewAngle(camera) {
        const radians = Communicator.Util.degreesToRadians(90);
        const tan = Math.tan(radians / 2);
        const length = Communicator.Point3.subtract(camera.getTarget(), camera.getPosition()).length();
        const width = length * tan;
        camera.setWidth(width);
        camera.setHeight(width);
        return camera;
    }

    async _dollyZoom(delta, camera = this._viewer.view.getCamera(), mousePosition, dollyTarget = false) {
        const view = this._viewer.view;
        camera.setProjection(Communicator.Projection.Perspective);

        const cameraPosition = camera.getPosition();
        const cameraTarget = camera.getTarget();

        if (mousePosition) {
            const modelBounding = await this._viewer.model.getModelBounding(false, false, false);
            const extentsLength = modelBounding.extents().length();
            const minTargetDistance = extentsLength / 100;

            const selection = await this._viewer.view.pickFromPoint(mousePosition, new Communicator.PickConfig());
            const selectionPosition = selection.getPosition();

            if (selectionPosition !== null) {
                const a = Communicator.Point3.subtract(cameraTarget, cameraPosition);
                const b = Communicator.Point3.subtract(selectionPosition, cameraPosition);
                const newTarget = Communicator.Point3.add(
                    cameraPosition,
                    a.scale(Communicator.Point3.dot(a, b) / Communicator.Point3.dot(a, a))
                );
                camera.setTarget(newTarget);
            }

            let eyeVector = Communicator.Point3.subtract(camera.getTarget(), cameraPosition);

            if (delta > 0 && eyeVector.length() < minTargetDistance) {
                camera.setTarget(
                    Communicator.Point3.add(
                        cameraTarget,
                        eyeVector
                            .copy()
                            .normalize()
                            .scale(minTargetDistance * 2)
                    )
                );
            }

            eyeVector = Communicator.Point3.subtract(camera.getTarget(), cameraPosition);
            camera.setPosition(Communicator.Point3.add(cameraPosition, eyeVector.copy().scale(delta / 10)));
        } else {
            const eyeVector = Communicator.Point3.subtract(cameraTarget, cameraPosition).scale(delta / 10);
            camera.setPosition(Communicator.Point3.add(cameraPosition, eyeVector));

            if (dollyTarget) {
                camera.setTarget(Communicator.Point3.add(cameraTarget, eyeVector));
            }
        }

        camera = this._updateCameraViewAngle(camera);

        this._viewer.pauseRendering(() => {
            if (mousePosition) {
                const intersectionPoint = camera.getCameraPlaneIntersectionPoint(
                    mousePosition,
                    this._viewer.view
                );

                view.setCamera(camera);

                const intersectionPoint2 = camera.getCameraPlaneIntersectionPoint(
                    mousePosition,
                    this._viewer.view
                );
                if (intersectionPoint !== null && intersectionPoint2 !== null) {
                    camera.dolly(Communicator.Point3.subtract(intersectionPoint2, intersectionPoint));
                }
            }

            view.setCamera(camera);
        });
    }

    async _doZoom(delta, camera = this._viewer.view.getCamera(), mousePosition) {
        const view = this._viewer.view;
        const zoom = Math.max(1.0 / (1.0 - delta), 0.001);

        if (mousePosition && this._zoomToMousePosition) {
            if (this._adjustCameraTarget) {
                const selection = await this._viewer.view.pickFromPoint(
                    mousePosition,
                    new Communicator.PickConfig()
                );
                if (selection !== undefined && selection.isEntitySelection()) {
                    const reverseEyeVector = camera.getPosition().subtract(camera.getTarget());

                    const a = Communicator.Point3.subtract(camera.getTarget(), camera.getPosition());
                    const b = Communicator.Point3.subtract(selection.getPosition(), camera.getPosition());
                    const newTarget = camera
                        .getPosition()
                        .add(a.scale(Communicator.Point3.dot(a, b) / Communicator.Point3.dot(a, a)));

                    camera.setTarget(newTarget);
                    camera.setPosition(Communicator.Point3.add(newTarget, reverseEyeVector));
                }
            }

            this._viewer.pauseRendering(() => {
                const intersectionPoint = camera.getCameraPlaneIntersectionPoint(
                    mousePosition,
                    this._viewer.view
                );
                this._zoomHelper(zoom, camera);

                const intersectionPoint2 = camera.getCameraPlaneIntersectionPoint(
                    mousePosition,
                    this._viewer.view
                );
                if (intersectionPoint !== null && intersectionPoint2 !== null) {
                    camera.dolly(Communicator.Point3.subtract(intersectionPoint2, intersectionPoint));
                }
                view.setCamera(camera);
            });
        } else {
            this._zoomHelper(zoom, camera);
        }
    }

    _zoomHelper(zoom, camera) {
        const view = this._viewer.view;

        camera.setWidth(camera.getWidth() * zoom);
        camera.setHeight(camera.getHeight() * zoom);

        if (this._preserveViewAngle && !this._viewer.sheetManager.isDrawingSheetActive()) {
            const position = camera.getPosition();
            const target = camera.getTarget();

            const newDelta = Communicator.Point3.subtract(target, position).scale(zoom);
            const newPosition = Communicator.Point3.subtract(target, newDelta);
            camera.setPosition(newPosition);
        }

        view.setCamera(camera);
    }
    }
};