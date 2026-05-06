import { IafCameraWalkBaseOperator } from "./IafCameraWalkBaseOperator.js"

export let IafCameraWalkOperator;
export function getIafCameraWalkOperator() {
    IafCameraWalkOperator = class IafCameraWalkOperator extends IafCameraWalkBaseOperator {
    _timerId = null;
    _walkButton = Communicator.Button.None;
    _previousTimestamp = 0;
    _activeTouchCount = 0;
    _maxDistance = 200;

    /** @hidden */
    constructor(viewer) {
        super(viewer);
    }

    /** @hidden */
    async onActivate(){
        await super.onActivate();
        this._viewer.trigger("walkOperatorActivated");
    }

    /** @hidden */
    onKeyDown(event){
        const keyCode = event.getKeyCode();
        const walkSpeed = this.getWalkSpeed();
        if (keyCode === Communicator.KeyCode.PgUp) {
            this.setWalkSpeed(walkSpeed * 1.2);
        }
        if (keyCode === Communicator.KeyCode.PgDown) {
            this.setWalkSpeed(walkSpeed * 0.8);
        }
        if (keyCode === Communicator.KeyCode.v) {
            this.toggleBimMode();
        }
    }

    /** @hidden */
    async onDeactivate(){
        const p = this._resetCameraTarget();
        this.stopWalking();
        await super.onDeactivate();
        this._viewer.trigger("walkOperatorDeactivated");
        return p;
    }

    /** @hidden */
    onMouseDown(event){
        super.onMouseDown(event);

        const view = this._viewer.view;

        if (!(view.getProjectionMode() === Communicator.Projection.Perspective)) {
            view.setProjectionMode(Communicator.Projection.Perspective);
            this._calculateInitialPosition();
        }

        if (this.isActive()) {
            this.stopWalking();
            this.setWalkActive(true);
            this._walkButton = event.getButton();
        }
    }

    /** @hidden */
    onMouseMove(event){
        super.onMouseMove(event);

        if (this.getWalkActive() && this._timerId === null && this.isActive()) {
            this._previousTimestamp = Date.now();
            this._onTick();
        }
    }

    /** @hidden */
    onMouseUp(event){
        if (this.isActive()) {
            this.stopWalking();
        }

        super.onMouseUp(event);
    }

    /** @hidden */
    onTouchStart(event){
        super.onTouchStart(event);

        ++this._activeTouchCount;

        if (this._activeTouchCount === 1) {
            this._walkButton = Communicator.Button.Left;
        } else if (this._activeTouchCount === 2) {
            this._walkButton = Communicator.Button.Right;
        } else if (this._activeTouchCount === 3) {
            this._walkButton = Communicator.Button.None;
        }
    }

    /** @hidden */
    onTouchMove(event){
        if (this._activeTouchCount === 3 && this._primaryTouchId === event.getId()) {
            this._ptCurrent.assign(event.getPosition());

            const delta = Communicator.Point2.subtract(this._ptCurrent, this._ptPrevious);
            this._adjustTilt((delta.y / 100) * 1.5);
        } else if (this._activeTouchCount < 3) {
            super.onTouchMove(event);
        }
    }

    /** @hidden */
    onTouchEnd(event){
        super.onTouchEnd(event);

        if (this._activeTouchCount > 0) {
            --this._activeTouchCount;
        }
    }

    /** @hidden */
    onMousewheel(event){
        if (event.getWheelDelta() > 0)
            this._adjustTilt(3.0);
        else
            this._adjustTilt(-3.0);
    }

    /** @hidden */
    stopWalking(){
        if (this._timerId !== null) {
            cancelAnimationFrame(this._timerId);
            this._timerId = null;
        }
        this.setWalkActive(false);
    }

    /** @hidden */
    async _testWalk(walkSpeed, walkDuration, button){
        const mouseDownEvent = new Event.MouseInputEvent(0, 0, button, Buttons.None, KeyModifiers.None, MouseInputType.Down);
        const mouseMoveEvent = new Event.MouseInputEvent(0, walkSpeed, button, Buttons.None, KeyModifiers.None, MouseInputType.Move);
        const mouseUpEvent = new Event.MouseInputEvent(0, walkSpeed, button, Buttons.None, KeyModifiers.None, MouseInputType.Up);

        this.onMouseDown(mouseDownEvent);
        this.onMouseMove(mouseMoveEvent);

        await Util.sleep(walkDuration);
        this.onMouseUp(mouseUpEvent);
    }

    /** @hidden */
    _onTick(){
        const timestamp = Date.now();
        const timeDelta = (timestamp - this._previousTimestamp) / 1000;
        this._previousTimestamp = timestamp;

        const view = this._viewer.view;

        const posDelta = Communicator.Point2.subtract(this._ptCurrent, this._ptFirst);
        const operatorScale = new Communicator.Point2(Math.abs(posDelta.x) / this._maxDistance, Math.abs(posDelta.y) / this._maxDistance);

        const rotDegrees = this.getRotationSpeed() * timeDelta * operatorScale.x;
        const walkDistance = this.getWalkSpeed() * timeDelta * operatorScale.y;
        const elevationDistanceX = this.getElevationSpeed() * timeDelta * operatorScale.x;
        const elevationDistanceY = this.getElevationSpeed() * timeDelta * operatorScale.y;

        if (this._walkButton === Communicator.Button.Left) {
            if (posDelta.x !== 0) {
                if (posDelta.x > 0)
                    this.rotateRight(rotDegrees);
                else if (posDelta.x < 0)
                    this.rotateLeft(rotDegrees);
            }

            if (posDelta.y !== 0) {
                const camera = view.getCamera();
                this._resetPosition(camera);

                const target = camera.getTarget();
                const position = camera.getPosition();
                const forward = Communicator.Point3.subtract(target, position).normalize();
                const up = camera.getUp();

                let walkDelta = Communicator.Point3.scale(forward, walkDistance);
                if(posDelta.y > 0) {
                    walkDelta = walkDelta.negate();
                }

                this.setWalkActive(true);
                const bimMode = this.getBimModeEnabled();
                const collision = this.getCollisionEnabled();
                this.getActiveWalk().set(async () => {
                    
                    if(collision)
                    {
                        await this._applyWalkDeltaWithCollisionCheck(camera, walkDelta, up);
                    }
                    else
                    { 
                        await this._applyWalkDelta(camera, walkDelta);
                    }

                    if (bimMode) {
                        await this._applyGravity();
                    }
                    
                });
            }
        }
        else if (this._walkButton === Communicator.Button.Right || this._walkButton === Communicator.Button.Middle) {
            if (Math.abs(posDelta.y) > 0) {
                if (posDelta.y > 0) {
                    this.walkUp(elevationDistanceY);
                }
                else {
                    this.walkDown(elevationDistanceY);
                }
            }

            if (Math.abs(posDelta.x) > 0) {
                if(posDelta.x > 0) {
                    this.walkRight(elevationDistanceX);
                }
                else {
                    this.walkLeft(elevationDistanceX);
                }
            }
        }

        this._timerId = requestAnimationFrame(() => {
            this._onTick();
        });
    }

    _adjustTilt(amount){
        const view = this._viewer.view;
        this.setTilt(this.getTilt() + amount);

        const camera = view.getCamera();
        this._resetPosition(camera);

        const target = camera.getTarget();
        const position = camera.getPosition();

        const targetDistance = Communicator.Point3.distance(target, position);
        const up = camera.getUp().normalize();
        const forward = Communicator.Point3.subtract(target, position).normalize();
        const left = Communicator.Point3.cross(up, forward).normalize();

        const tiltMatrix = Communicator.Matrix.createFromOffAxisRotation(left, this.getTilt());
        tiltMatrix.transform(forward, forward);
        forward.normalize().scale(targetDistance);

        camera.setTarget(Communicator.Point3.add(position, forward));
        view.setCamera(camera);
    }

    async _resetCameraTarget(){
        const view = this._viewer.view;
        const viewSize = view.getCanvasSize();

        const center = new Communicator.Point2(Math.round(viewSize.x / 2), Math.round(viewSize.y / 2));
        const config = new Communicator.PickConfig();

        const selection = await view.pickFromPoint(center, config);
        if (selection.isEntitySelection()) {
            const camera = view.getCamera();
            camera.setTarget(selection.getPosition());
            view.updateCamera(camera);
        }
    }
    }
}