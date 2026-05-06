import { IafCameraWalkBaseOperator } from "./IafCameraWalkBaseOperator.js"

/**
 * Normalizes a set of directions such that it does not contain
 * opposing directions. If opposing directions do exist, then they
 * cancel each other and are removed from the set.
 */
function normalizeDirections(directions) {
    removeOpposing(directions, Communicator.WalkDirection.Forward, Communicator.WalkDirection.Backward);
    removeOpposing(directions, Communicator.WalkDirection.Left, Communicator.WalkDirection.Right);
    removeOpposing(directions, Communicator.WalkDirection.Up, Communicator.WalkDirection.Down);
    removeOpposing(directions, Communicator.WalkDirection.RotateLeft, Communicator.WalkDirection.RotateRight);
    removeOpposing(directions, Communicator.WalkDirection.TiltUp, Communicator.WalkDirection.TiltDown);
}

/**
 * If the input set contains both `x` and `y`, then both `x` and `y` are removed from the set.
 * Otherwise this function does nothing.
 *
 * @param set The set to inspect and alter.
 * @param x The value that cancels with `y`.
 * @param y The value that cancels with `x`.
 */
function removeOpposing(set, x, y) {
    if (set.has(x) && set.has(y)) {
        set.delete(x);
        set.delete(y);
    }
}

export let IafCameraKeyboardWalkOperator;
export function getIafCameraKeyboardWalkOperator() {
    IafCameraKeyboardWalkOperator = class IafCameraKeyboardWalkOperator extends IafCameraWalkBaseOperator {
    _keyWalkMapping = new Map();

    _keyUpMap = new Map();
    _keyDownMap = new Map();

    _mouseLookSpeed = 0;
    _mouseLookEnabled = true;
    _previousWalkTime = 0;

    _tickTimerId = null;

    _iafZoomOperator = null;

    /** @hidden */
    constructor(viewer, iafZoomOperator) {
        super(viewer);

        this._iafZoomOperator = iafZoomOperator;

        viewer.setCallbacks({
            camera: (camera) => {
                if (camera.getProjection() !== Communicator.Projection.Perspective) {
                    this._keyDownMap.clear();
                }
            },
        });

        this.addKeyMapping(Communicator.KeyCode.a, Communicator.WalkDirection.Left);
        this.addKeyMapping(Communicator.KeyCode.d, Communicator.WalkDirection.Right);
        this.addKeyMapping(Communicator.KeyCode.w, Communicator.WalkDirection.Forward);
        this.addKeyMapping(Communicator.KeyCode.s, Communicator.WalkDirection.Backward);
        this.addKeyMapping(Communicator.KeyCode.q, Communicator.WalkDirection.RotateLeft);
        this.addKeyMapping(Communicator.KeyCode.e, Communicator.WalkDirection.RotateRight);
        this.addKeyMapping(Communicator.KeyCode.r, Communicator.WalkDirection.TiltUp);
        this.addKeyMapping(Communicator.KeyCode.f, Communicator.WalkDirection.TiltDown);
        this.addKeyMapping(Communicator.KeyCode.x, Communicator.WalkDirection.Up);
        this.addKeyMapping(Communicator.KeyCode.c, Communicator.WalkDirection.Down);

        this.addKeyMapping(Communicator.KeyCode.LeftArrow, Communicator.WalkDirection.Left);
        this.addKeyMapping(Communicator.KeyCode.RightArrow, Communicator.WalkDirection.Right);
        this.addKeyMapping(Communicator.KeyCode.UpArrow, Communicator.WalkDirection.Forward);
        this.addKeyMapping(Communicator.KeyCode.DownArrow, Communicator.WalkDirection.Backward);
    }

    /** @hidden */
    async onActivate() {
        super.onActivate();
        this._viewer.focusInput(true);
    }

    /**
     * Adds a key mapping for a walk direction.
     * @param key
     * @param walkDirection
     */
    addKeyMapping(key, walkDirection) {
        this._keyWalkMapping.set(key, walkDirection);
    }

    /**
     * Gets the walk direction key mapping.
     */
    getKeyMapping() {
        return Communicator.Util.copyMap(this._keyWalkMapping);
    }

    /**
     * Clears all key mappings.
     */
    clearKeyMappings() {
        this._keyWalkMapping.clear();
    }

    /** @hidden */
    onMouseDown(event) {
        super.onMouseDown(event);
        this._viewer.focusInput(true);
    }

    /** @hidden */
    onMouseMove(event) {
        this._viewer.focusInput(true);
        super.onMouseMove(event);

        if (this._dragging && this._mouseLookEnabled) {
            this._viewer.view.setProjectionMode(Communicator.Projection.Perspective);

            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;

            event.setHandled(true);
            const delta = Communicator.Point2.subtract(this._ptPrevious, this._ptCurrent);
            this.rotateLeft(delta.x / screenWidth * this._mouseLookSpeed);
            this.tiltUp(delta.y / screenHeight * this._mouseLookSpeed);
        }
    }

    /** @hidden */
    onMouseUp(event) {
        if (this._dragCount > 5) {
            event.setHandled(true);
        }
        super.onMouseUp(event);
    }

    /** @hidden */
    onMousewheel(event) {
        
        this._viewer.view.setProjectionMode(Communicator.Projection.Perspective);

        // call zoom operator as this zoom operator handles the zoom correctly.
        if(this._iafZoomOperator !== null)
            this._iafZoomOperator.onMousewheel(event);

        /*
        const view = this._viewer.view;
        const camera = view.getCamera();
        const position = event.getPosition();
        const wheelDelta = event.getWheelDelta();

        const p = view.pickFromPoint(position, new Communicator.PickConfig(Communicator.SelectionMask.Face)).then((selectionItem) => {
            const selectionPosition = selectionItem.getPosition();
            if (selectionItem !== null && selectionPosition !== null) {
                const walkDirection = Communicator.Point3.subtract(camera.getPosition(), selectionPosition).normalize();
                const walkDelta = walkDirection.scale(this.getZoomSpeed() * wheelDelta);
                this._applyWalkDelta(camera, walkDelta);
            } else {
                this.walkBackward(wheelDelta * this.getWalkSpeed());
            }
        });*/

        //p as Internal.UnusedPromise; // XXX: Throwing away promise.
    }

    /** @hidden */
    onKeyDown(event) {
        this._viewer.view.setProjectionMode(Communicator.Projection.Perspective);

        const keyCode = event.getKeyCode();

        if (keyCode === Communicator.KeyCode.v) {
            this.toggleBimMode();// as Internal.UnusedPromise;
        }

        if (!this._keyCodeActive(keyCode)) {
            this._keyDownMap.set(keyCode, event.getDate().getTime());
            this._onKeyChange(keyCode);
        }
    }

    /** @hidden */
    onKeyUp(event) {
        const keyCode = event.getKeyCode();

        this._keyUpMap.set(keyCode, event.getDate().getTime());
        this._onKeyChange(keyCode);
    }

    _keyCodeActive(keyCode) {
        const downTime = this._keyDownMap.get(keyCode);
        if (downTime !== undefined) {
            const upTime = this._keyUpMap.get(keyCode);
            if (upTime === undefined || downTime > upTime) {
                return true;
            }
        }
        return false;
    }

    _onKeyChange(keyCode) {
        if (this._keyCodeActive(keyCode)) {
            if (this._keyWalkMapping.has(keyCode)) {
                if (!this.getWalkActive()) {
                    this._previousWalkTime = Date.now();
                }
                this._onTick();
            }
        }
    }

    /**
     * Sets the speed for mouse look.
     * @param mouseLookSpeed
     */
    setMouseLookSpeed(mouseLookSpeed) {
        this._mouseLookSpeed = mouseLookSpeed;
    }

    /**
     * Gets the mouse look speed.
     */
    getMouseLookSpeed() {
        return this._mouseLookSpeed;
    }

    /**
     * Sets whether the mouse look is enabled. If enabled, mouse move events will not continue down the operator stack.
     * @param mouseLookEnabled
     */
    setMouseLookEnabled(mouseLookEnabled) {
        this._mouseLookEnabled = mouseLookEnabled;
    }

    /**
     * Gets whether the mouse look is enabled. If enabled, mouse move events will not continue down the operator stack.
     */
    getMouseLookEnabled() {
        return this._mouseLookEnabled;
    }

    async resetDefaultWalkSpeeds(){
        return super.resetDefaultWalkSpeeds().then(() => {
            this._mouseLookSpeed = 300;
        });
    }

    _execWalkDirection(direction, timeDelta, collisionEnabled){
        const horizontalWalkDistance = this.getWalkSpeed() * timeDelta;
        switch (direction) {

            case Communicator.WalkDirection.Forward:
                return collisionEnabled ? this.walkForwardWithCollision(horizontalWalkDistance) : this.walkForward(horizontalWalkDistance);
            case Communicator.WalkDirection.Backward:
                return collisionEnabled ? this.walkBackwardWithCollision(horizontalWalkDistance) : this.walkBackward(horizontalWalkDistance);
            case Communicator.WalkDirection.Left:
                return collisionEnabled ? this.walkLeftWithCollision(horizontalWalkDistance) : this.walkLeft(horizontalWalkDistance);
            case Communicator.WalkDirection.Right:
                return collisionEnabled ? this.walkRightWithCollision(horizontalWalkDistance) : this.walkRight(horizontalWalkDistance);

            case Communicator.WalkDirection.Up:
                return this.walkUp(this.getElevationSpeed() * timeDelta);
            case Communicator.WalkDirection.Down:
                return this.walkDown(this.getElevationSpeed() * timeDelta);

            case Communicator.WalkDirection.RotateLeft:
                return this.rotateLeft(this.getRotationSpeed() * timeDelta);
            case Communicator.WalkDirection.RotateRight:
                return this.rotateRight(this.getRotationSpeed() * timeDelta);

            case Communicator.WalkDirection.TiltUp:
                return this.tiltUp(this.getRotationSpeed() * timeDelta);
            case Communicator.WalkDirection.TiltDown:
                return this.tiltDown(this.getRotationSpeed() * timeDelta);

            default:
                Communicator.Util.TypeAssertNever(direction);
        }
    }

    _queueWalkDirections(timeDelta) {
        const directionSet = new Set();

        this._keyWalkMapping.forEach((direction, keyCode) => {
            if (this._keyCodeActive(keyCode)) {
                directionSet.add(direction);
            }
        });

        normalizeDirections(directionSet);
        const directionList = Communicator.Util.setToArray(directionSet);
        directionList.sort(); // Sorting for execution consistency.

        if (directionList.length > 0) {
            this.setWalkActive(true);
            const bimModeEnabled = this.getBimModeEnabled();
            const collision = this.getCollisionEnabled();
            this.getActiveWalk().set(async () => {
                const aggregatedWalk = new Communicator.Util.ActionQueue(1, true);

                if (timeDelta > 0) {
                    for (const direction of directionList) {
                        aggregatedWalk.push(() => {
                            return this._execWalkDirection(direction, timeDelta, collision);
                        });
                    }
                }

                if (bimModeEnabled) {
                    if (!directionSet.has(Communicator.WalkDirection.Up) && !directionSet.has(Communicator.WalkDirection.Down)) {
                        aggregatedWalk.push(async () => {
                            await this._applyGravity();
                        });
                    }
                    
                    // Disable door update
                    // aggregatedWalk.push(async () => {
                    //     await this._updateNearbyDoors();
                    // });
                }

                if (aggregatedWalk.isIdle()) {
                    return;
                }
                else {
                    return aggregatedWalk.waitForIdle();
                }
            });
        }
    }

    /** @hidden */
    _onTick() {
        const updateTime = Date.now();
        const timeDelta = (updateTime - this._previousWalkTime) / 2500;
        this._previousWalkTime = updateTime;

        const walkActive = !this.getActiveWalk().isIdle();
        this.setWalkActive(walkActive);

        this._queueWalkDirections(timeDelta);

        if (this._tickTimerId !== null) {
            cancelAnimationFrame(this._tickTimerId);
            this._tickTimerId = null;
        }

        if (this.getWalkActive()) {
            this._tickTimerId = requestAnimationFrame(() => {
                this._onTick();
            });
        }
    }
    }
}
