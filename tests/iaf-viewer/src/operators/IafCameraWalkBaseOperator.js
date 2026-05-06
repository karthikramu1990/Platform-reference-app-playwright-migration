const MAX_TILT = 45;
const MIN_TILT = -45;

const MAX_ANGLE = 150;
const MIN_ANGLE = 30;

function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

/**
 * Returns the vector pointing down in the scene.
 */
function getDownAxis(model) {
    const upAxis = model.getViewAxes().upVector;
    console.assert(upAxis.isAxis());
    return Communicator.Point3.scale(upAxis, -1);
}

/**
 * @param bimMask Restricts the objects the selection ray can select to the BIM types present in the mask.
 * @param maxWorldDistance If non-null, this limits the distance the selection ray can travel to hit an object.
 * @returns A ray pick config object suitable for BIM collision tests.
 */
function buildCollisionRayConfig(
    bimMask,
    maxWorldDistance){
    const config = new Communicator.PickConfig(Communicator.SelectionMask.Face);

    //config.bimMask = bimMask;
    config.ignoreOverlays = true;

    if (maxWorldDistance !== null) {
        config.maxWorldDistance = maxWorldDistance;
    }

    return config;
}

/**
 * This returns the final position of a point object when gravity is applied.
 * If there are no floors to collide with, null is returned.
 *
 * It is the caller's responsibility to interpolate smooth motion if desired.
 *
 * @param view The `View` of the scene.
 * @param pointObject The point object to fall.
 * @param downVector The vector used to determine the direction of fall.
 * @param maxFallDistance If the fall distance would exceed this value, then gravity is not applied at all.
 */
async function applyGravity(
    view,
    pointObject,
    downVector,
    maxFallDistance){
    const ray = new Communicator.Ray(pointObject, downVector);
    const config = buildCollisionRayConfig(Communicator.BimMask.Floor, maxFallDistance);

    const item = await view.pickFromRay(ray, config);
    if (item.isFaceSelection()) {
        return item.getPosition();
    }

    return null;
}

/**
 * Returns the point of collision or null if there is none.
 */
async function testWallCollision(
    view,
    position,
    movementVector, // For general motion support, such as back and strafing motion in addition to forward motion.
    maxCollisionDistance){
    const ray = new Communicator.Ray(position, movementVector);
    const config = buildCollisionRayConfig(Communicator.BimMask.Wall, maxCollisionDistance);

    const item = await view.pickFromRay(ray, config);
    if (item.isFaceSelection()) {
        return item;
    }

    return null;
}

class DoorCache {
    _viewer;
    _nearbyDoors = new Set();

    constructor(
        viewer) {
        this._viewer = viewer;
    }

    _performSphereSelection(
        center,
        radius,
        bimMask){
        const selection = Communicator.Util.IncrementalSelection.create("View", this._viewer);

        const pickConfig = new Communicator.IncrementalPickConfig(Communicator.SelectionMask.Face);
        pickConfig.bimMask = bimMask;
        pickConfig.onlyStreamedInstances = true;
        pickConfig.ignoreUnrequestedInstances = true;

        return selection.performSelection({
            pickConfig: pickConfig,
            sphereCenter: center,
            sphereRadius: radius,
        });
    }

    async updateNearbyDoors(
        position,
        maxDoorDistance,
        nearbyDoorOpacity)
         {
        const selectedDoorItems = await this._performSphereSelection(
            position, maxDoorDistance, Communicator.BimMask.Door);

        const currentDoors = new Set();
        for (const item of selectedDoorItems) {
            const nodeId = item.getNodeId();
            currentDoors.add(nodeId);
        }

        const newDoors = Communicator.Util.setSubtraction(currentDoors, this._nearbyDoors);
        const lostDoors = Communicator.Util.setSubtraction(this._nearbyDoors, currentDoors);

        const newDoorsArray = Communicator.Util.setToArray(newDoors);
        const lostDoorsArray = Communicator.Util.setToArray(lostDoors);

        const model = this._viewer.model;

        model.setNodesOpacity(newDoorsArray, nearbyDoorOpacity);
        model.resetNodesOpacity(lostDoorsArray);

        this._nearbyDoors = currentDoors;
    }

    forgetNearbyDoors()
         {
        const doorIds = Communicator.Util.setToArray(this._nearbyDoors);
        this._nearbyDoors.clear();
        this._viewer.model.resetNodesOpacity(doorIds);
    }
}

/** @hidden */
export let CrossMarkup;
export function getCrossMarkup() {
    CrossMarkup = class CrossMarkup extends Communicator.Markup.MarkupItem {
    _viewer;
    _l1 = new Communicator.Markup.Shape.Line();
    _l2 = new Communicator.Markup.Shape.Line();
    _crossSize = 7;
    _crossThickness = 2;
    _position;

    constructor(viewer, position) {
        super();
        this._viewer = viewer;
        this._position = position;
        this._l1.set(new Communicator.Point2(position.x - this._crossSize, position.y), new Communicator.Point2(position.x + this._crossSize, position.y));
        this._l2.set(new Communicator.Point2(position.x, position.y - this._crossSize), new Communicator.Point2(position.x, position.y + this._crossSize));
        this._l1.setStrokeWidth(this._crossThickness);
        this._l2.setStrokeWidth(this._crossThickness);
    }

    draw() {
        if (this._l1 && this._l2) {
            this._viewer.markupManager.getRenderer().drawLine(this._l1);
            this._viewer.markupManager.getRenderer().drawLine(this._l2);
        }
    }
    }
}


/** @hidden */
export let IafCameraWalkBaseOperator;
export function getIafCameraWalkBaseOperator() {
    IafCameraWalkBaseOperator = class IafCameraWalkBaseOperator extends Communicator.Operator.OperatorBase {
    _elevationSpeed = 0;
    _rotationSpeed = 0;
    _viewAngle = 130;
    _zoomDistance = 0;
    _walkDistance = 0;

    _tilt = 0;
    _majorAxis = Communicator.Axis.X;
    _maxExtents = 0;

    _walkActive = false;
    _activeWalk = new Communicator.Util.CurrentAction(true);

    _bimModeEnabled = true;
    _collisionEnabled = true;
    _synchronizedToggleBimMode = new Communicator.Util.CurrentActionSync();
    _synchronizedToggleCollision = new Communicator.Util.CurrentActionSync();
    _doorCache;
    _downAxis;

    _initialInteractiveDrawLimitIncreaseStatus = true;
    
    _crossMarkupHandler = null;
    _markupPosition = null;
    _isMouseDown = null;

    // Pre model unit scaling.
    _logical= {
        floor: { ...Communicator.Operator.CameraKeyboardWalkOperator.Bim.Default.FloorConfig },
        wall: { ...Communicator.Operator.CameraKeyboardWalkOperator.Bim.Default.WallConfig },
        door: { ...Communicator.Operator.CameraKeyboardWalkOperator.Bim.Default.DoorConfig },
    };

    // Post model unit scaling.
    _effective= {
        floor: { ...Communicator.Operator.CameraKeyboardWalkOperator.Bim.Default.FloorConfig },
        wall: { ...Communicator.Operator.CameraKeyboardWalkOperator.Bim.Default.WallConfig },
        door: { ...Communicator.Operator.CameraKeyboardWalkOperator.Bim.Default.DoorConfig },
    };

    /** @hidden */
    constructor(viewer) {
        super(viewer);

        this._doorCache = new DoorCache(viewer);

        // Note: This gets updated as needed.
        this._downAxis = new Communicator.Point3(0, -1, 0);

        viewer.setCallbacks({
            subtreeLoaded: (_roots, source) => {
                if (source === Communicator.NodeSource.LoadModel) {
                    this._updateSceneFloor();
                }
            },
        });
    }

    _updateSceneFloor() {
        this._downAxis = getDownAxis(this._viewer.model);
    }

    isCollisionEnabled() {
        return this._collisionEnabled;
    }

    async _enableCollision() {
        this._collisionEnabled = true;
        this._effective.wall = this._scaleAgainstModelUnit(this._logical.wall);
    }

    _disableCollision() {
        this._collisionEnabled = false;
    }

     /**
     * Enables Collision
     */
    enableCollision() {
        return this._synchronizedToggleCollision.set(async () => {
            await this._enableCollision();
        });
    }

    /**
     * Disables Collision
     */
    disableCollision() {
        return this._synchronizedToggleCollision.set(() => {
            this._disableCollision();
        });
    }

    isBimModeEnabled() {
        return this._bimModeEnabled;
    }

    async _enableBimMode() {
        this._bimModeEnabled = true;

        this._effective.floor = this._scaleAgainstModelUnit(this._logical.floor);
        //this._effective.wall = this._scaleAgainstModelUnit(this._logical.wall);
        //this._effective.door = this._scaleAgainstModelUnit(this._logical.door);

        this._updateSceneFloor();
        await this._applyGravity();
        //await this._updateNearbyDoors();
    }

    _disableBimMode() {
        this._bimModeEnabled = false;
        this._doorCache.forgetNearbyDoors();
    }

    /**
     * Enables BIM mode
     */
    enableBimMode() {
        return this._synchronizedToggleBimMode.set(async () => {
            await this._enableBimMode();
        });
    }

    /**
     * Disables BIM mode
     */
    disableBimMode() {
        return this._synchronizedToggleBimMode.set(() => {
            this._disableBimMode();
        });
    }

    /**
     * Toggles BIM mode, deactivating it if it's activated and activating it if it's deactivated
     */
    toggleBimMode() {
        return this._synchronizedToggleBimMode.set(() => {
            if (this._bimModeEnabled) {
                return this._disableBimMode();
            }
            else {
                return this._enableBimMode();
            }
        });
    }

    /** @hidden */
    async onActivate() {
        this._viewer.view.setProjectionMode(Communicator.Projection.Perspective);

        // Disable periodic draw limit increase while walking since it causes framerate dips (COM-1622)
        const view = this._viewer.view;
        this._initialInteractiveDrawLimitIncreaseStatus = await view.getInteractiveDrawLimitIncreaseEnabled();
        view.setInteractiveDrawLimitIncreaseEnabled(false);

        this._calculateInitialPosition();
        if (this._maxExtents === 0) {
            await this.resetDefaultWalkSpeeds();
        }

        if (this._bimModeEnabled) {
            //await this._updateNearbyDoors();
        }

        // See if we should activate floorplan
        const shouldActivateFloorplan = this._viewer.floorplanManager.getConfiguration().autoActivate === Communicator.FloorplanAutoActivation.BimWalk;
        if(shouldActivateFloorplan) {
            // Only activate if this is a BIM capable model
            const storyNodes = this._viewer.model.getNodesByGenericType("IFCBUILDINGSTOREY");
            const hasIfc = storyNodes && (storyNodes.size > 0);
            if(hasIfc) {
                await this._viewer.floorplanManager.activate();
            }
        }
    }

    /** @hidden */
    async onDeactivate() {
        this._viewer.view.setInteractiveDrawLimitIncreaseEnabled(this._initialInteractiveDrawLimitIncreaseStatus);
        this._doorCache.forgetNearbyDoors();

        // See if we should deactivate floorplan
        const shouldDeactivateFloorplan = this._viewer.floorplanManager.getConfiguration().autoActivate === Communicator.FloorplanAutoActivation.BimWalk;
        if(shouldDeactivateFloorplan) {
            // Only activate if this is a BIM capable model
            const storyNodes = this._viewer.model.getNodesByGenericType("IFCBUILDINGSTOREY");
            const hasIfc = storyNodes && (storyNodes.size > 0);
            if(hasIfc) {
                await this._viewer.floorplanManager.deactivate();
            }
        }

        super.onDeactivate();
    }

    /**
     * Sets the walk, rotate, and mouse look speeds to the default values.
     */
    async resetDefaultWalkSpeeds() {
        this._rotationSpeed = 35;
        this._viewAngle = 130;

        const bounding = await this._viewer.model.getLooseBounding();
        const extents = bounding.extents();
        this._maxExtents = Math.max(extents.x, extents.y, extents.z);
        this._walkDistance = this._maxExtents / 22;
        this._elevationSpeed = this._maxExtents / 15;
        this._zoomDistance = this._maxExtents / 40;
    }

    /**
     * Gets the floor distance config used by BIM mode.
     * See also: [[enableBimMode]].
     */
    getBimFloorConfig() {
        return { ...this._logical.floor };
    }

    /**
     * Sets the floor distance config used by BIM mode.
     * See also: [[enableBimMode]].
     */
    setBimFloorConfig(floorConfig) {
        this._logical.floor = { ...floorConfig };
        this._effective.floor = this._scaleAgainstModelUnit(this._logical.floor);
    }

    /**
     * Gets the wall distance config used by BIM mode.
     * See also: [[enableBimMode]].
     */
    getBimWallConfig() {
        return { ...this._logical.wall };
    }

    /**
     * Sets the wall distance config used by BIM mode.
     * See also: [[enableBimMode]].
     */
    setBimWallConfig(wallConfig) {
        this._logical.wall = { ...wallConfig };
        this._effective.wall = this._scaleAgainstModelUnit(this._logical.wall);
    }

    /**
     * Gets the door distance config used by BIM mode.
     * See also: [[enableBimMode]].
     */
    getBimDoorConfig() {
        return { ...this._logical.door };
    }

    /**
     * Sets the door distance config used by BIM mode.
     */
    setBimDoorConfig(doorConfig) {
        this._logical.door = { ...doorConfig };
        this._effective.door = this._scaleAgainstModelUnit(this._logical.door);
    }

    _scaleAgainstModelUnit(obj) {
        const model = this._viewer.model;
        const scale = 1.0 / model.getNodeUnitMultiplier(model.getAbsoluteRootNode());

        const props = Object.keys(obj);
        for (const prop of props) {
            const value = obj[prop];
            if (typeof value === "number") {
                obj[prop] *= scale;
            }
        }
        return obj;
    }

    /** @hidden */
    onMouseDown(event) {
        super.onMouseDown(event);
        this._isMouseDown = true;
        this._markupPosition = event.getPosition();
    }

    /** @hidden */
    onMouseMove(event) {
        super.onMouseMove(event);
        if(this._isMouseDown && this._crossMarkupHandler === null)
        {
            const crossMarkup = new CrossMarkup(this._viewer, this._markupPosition);
            this._crossMarkupHandler = this._viewer.markupManager.registerMarkup(crossMarkup);
        }
    }

    /** @hidden */
    onMouseUp(event) {
        super.onMouseUp(event);
        this._isMouseDown = false;
        if(this._crossMarkupHandler !== null)
        {
            this._viewer.markupManager.unregisterMarkup(this._crossMarkupHandler);
            this._crossMarkupHandler = null;
        }
    }

    /** @hidden */
    async _applyGravity() {
        const view = this._viewer.view;
        const camera = view.getCamera();

        let startPos = camera.getPosition();
        let floorPos = await applyGravity(view, startPos, this._downAxis, this._effective.floor.maxFallDistance);
        if (floorPos === null) {
            // Nudge start pos upward in for stair walking and test again.
            startPos = Communicator.Point3.subtract(startPos, Communicator.Point3.scale(this._downAxis, this._effective.floor.avatarOffset));
            floorPos = await applyGravity(view, startPos, this._downAxis, this._effective.floor.maxFallDistance);
            if (floorPos === null) {
                return;
            }
        }

        const offsetFromFloor = new Communicator.Point3(0, 0, this._effective.floor.avatarOffset);
        const finalPos = Communicator.Point3.add(floorPos, offsetFromFloor);

        const fallDelta = Communicator.Point3.subtract(finalPos, startPos);
        const fallDistance = fallDelta.length();

        if (fallDistance > this._effective.floor.negligibleClimbHeight) {
            const degrees = Communicator.Util.computeAngleBetweenVector(fallDelta, this._downAxis);
            const isClimbing = degrees > 90.0;
            if (isClimbing) {
                if (fallDistance > this._effective.floor.maxClimbHeight) {
                    return;
                }
            }
        }

        this._applyWalkDelta(camera, fallDelta);
    }

    /** @hidden */
    _updateNearbyDoors() {
        const camera = this._viewer.view.getCamera();
        const position = camera.getPosition();
        const doorOpacity = 0.5;
        return this._doorCache.updateNearbyDoors(position, this._effective.door.transparencyRange, doorOpacity);
    }

    _updateCamera(camera) {
        this._resetPosition(camera);
        this._updateCameraTilt(camera);
        this._updateCameraViewAngle(camera);
        this._viewer.view.setCamera(camera);
    }

    /** @hidden */
    _applyWalkDelta(camera, walkDelta) {
        camera.dolly(Communicator.Point3.scale(walkDelta, -1.0));
        this._updateCamera(camera);
    }

    /** @hidden */
    async _applyWalkDeltaWithCollisionCheck(camera, walkDelta, upDir) {
        const position = camera.getPosition();

        const rotateLeft =  Communicator.Matrix.createFromOffAxisRotation(upDir, 90.0);
        const leftDir = rotateLeft.transform(walkDelta);

        const rotateRight =  Communicator.Matrix.createFromOffAxisRotation(upDir, -90.0);
        const rightDir = rotateRight.transform(walkDelta);

        const leftCollisionPromise = this._testWallCollision(
            position,
            leftDir,
            this._effective.wall.avatarOffset);

        const rightCollisionPromise = this._testWallCollision(
            position,
            rightDir,
            this._effective.wall.avatarOffset);

        const forwardCollisionPromise = this._testWallCollision(
            position,
            walkDelta,
            walkDelta.length() + this._effective.wall.avatarOffset);

        const [leftCollision, rightCollision] = await Promise.all([
            leftCollisionPromise, rightCollisionPromise
        ]);

        if (leftCollision !== null || rightCollision !== null) {
            const testBackSideCollision = (collision) => {
                if (collision !== null) {
                    const wallNormal = collision.getFaceEntity().getNormal();
                    const degrees = Communicator.Util.computeAngleBetweenVector(wallNormal, walkDelta);
                    return degrees > 90.0;
                }
                return false;
            };

            if (testBackSideCollision(leftCollision)) {
                return;
            }

            if (testBackSideCollision(rightCollision)) {
                return;
            }
        }

        const forwardCollision = await forwardCollisionPromise;

        if (forwardCollision !== null) {
            const originalWalkDistance = walkDelta.length();
            const walkDirection = Communicator.Point3.scale(walkDelta, 1.0 / originalWalkDistance);

            const collisionDistance = Communicator.Point3.subtract(forwardCollision.getPosition(), position).length();

            const maxWalkDistance = collisionDistance - this._effective.wall.avatarOffset;
            const newWalkDistance = Math.min(originalWalkDistance, maxWalkDistance);

            walkDelta = Communicator.Point3.scale(walkDirection, newWalkDistance);
        }

        this._applyWalkDelta(camera, walkDelta);
    }

    _testWallCollision(position, walkDirection, maxCollisionDistance){
        return testWallCollision(this._viewer.view, position, walkDirection, maxCollisionDistance);
    }

    _walkBackward(walkDistance, testCollision) {
        const view = this._viewer.view;
        const camera = view.getCamera();
        this._resetPosition(camera);

        const target = camera.getTarget();
        const position = camera.getPosition();
        const up = camera.getUp();

        const backward = Communicator.Point3.subtract(position, target).normalize();

        const walkDelta = backward.copy().scale(walkDistance);
        if (testCollision) {
            return this._applyWalkDeltaWithCollisionCheck(camera, walkDelta, up);
        }
        else {
            return this._applyWalkDelta(camera, walkDelta);
        }
    }

    _walkForward(walkDistance, testCollision) {
        return this._walkBackward(-walkDistance, testCollision);
    }

    _walkLeft(walkDistance, testCollision) {
        const view = this._viewer.view;
        const camera = view.getCamera();
        this._resetPosition(camera);

        const target = camera.getTarget();
        const position = camera.getPosition();
        const up = camera.getUp();

        const forward = Communicator.Point3.subtract(target, position).normalize();
        const left = Communicator.Point3.cross(up, forward).normalize();

        const walkDelta = left.copy().scale(walkDistance);
        if (testCollision) {
            return this._applyWalkDeltaWithCollisionCheck(camera, walkDelta, up);
        }
        else {
            return this._applyWalkDelta(camera, walkDelta);
        }
    }

    _walkRight(walkDistance, testCollision) {
        return this._walkLeft(-walkDistance, testCollision);
    }

    walkBackward(walkDistance) {
        return this._walkBackward(walkDistance, false);
    }

    walkForward(walkDistance) {
        return this._walkForward(walkDistance, false);
    }

    walkLeft(walkDistance) {
        return this._walkLeft(walkDistance, false);
    }

    walkRight(walkDistance) {
        return this._walkRight(walkDistance, false);
    }

    walkBackwardWithCollision(walkDistance) {
        return this._walkBackward(walkDistance, true);
    }

    walkForwardWithCollision(walkDistance) {
        return this._walkForward(walkDistance, true);
    }

    walkLeftWithCollision(walkDistance) {
        return this._walkLeft(walkDistance, true);
    }

    walkRightWithCollision(walkDistance) {
        return this._walkRight(walkDistance, true);
    }

    walkDown(walkDistance) {
        const view = this._viewer.view;
        const camera = view.getCamera();
        this._resetPosition(camera);

        const walkDelta = camera.getUp().normalize().scale(walkDistance);
        this._applyWalkDelta(camera, walkDelta);
    }

    walkUp(walkDistance) {
        this.walkDown(-walkDistance);
    }

    rotateRight(degrees) {
        const view = this._viewer.view;
        const camera = view.getCamera();
        this._resetPosition(camera);

        const target = camera.getTarget();
        const position = camera.getPosition();
        const eye = Communicator.Point3.subtract(position, target);
        const eyeLength = eye.length();

        const forward = Communicator.Point3.subtract(target, position).normalize();

        const radians = Communicator.Util.degreesToRadians(degrees);
        const tan = Math.tan(radians);
        const length = Communicator.Point3.subtract(camera.getTarget(), camera.getPosition()).length();
        const scale = length * tan;

        const delta = Communicator.Point3.cross(forward, camera.getUp()).scale(scale);

        let newTarget = target.copy().add(delta);
        const newEye = Communicator.Point3.subtract(newTarget, position).normalize().scale(eyeLength);
        newTarget = Communicator.Point3.add(position, newEye);
        camera.setTarget(newTarget);

        this._updateCamera(camera);
    }

    rotateLeft(degrees) {
        this.rotateRight(-degrees);
    }

    tiltDown(degrees) {
        this.setTilt(this._tilt + degrees);

        const view = this._viewer.view;
        const camera = view.getCamera();
        this._resetPosition(camera);
        this._updateCamera(camera);
    }

    tiltUp(degrees) {
        this.tiltDown(-degrees);
    }

    /** @hidden */
    _calculateInitialPosition() {
        const view = this._viewer.view;
        const camera = view.getCamera();

        this._calculateMajorAxis(camera);
        this.setTilt(this._calculateInitialTilt(camera));

        this._resetPosition(camera);
        this._updateCamera(camera);
    }

    _updateCameraViewAngle(camera) {
        const radians = Communicator.Util.degreesToRadians(this._viewAngle);
        const tan = Math.tan(radians / 2);
        const length = Communicator.Point3.subtract(camera.getTarget(), camera.getPosition()).length();
        const width = length * tan;
        camera.setWidth(width);
        camera.setHeight(width);
    }

    _updateCameraTilt(camera) {
        const position = camera.getPosition();
        const target = camera.getTarget();

        const up = camera.getUp().normalize();
        const forward = Communicator.Point3.subtract(target, position).normalize();
        const left = Communicator.Point3.cross(up, forward).normalize();

        // compute forward vector with tilt
        const targetDistance = Communicator.Point3.distance(target, position);
        const matrix =  Communicator.Matrix.createFromOffAxisRotation(left, this._tilt);
        matrix.transform(forward, forward);
        camera.setTarget(Communicator.Point3.add(position, forward.scale(targetDistance)));
    }

    _calculateInitialTilt(camera) {
        const target = camera.getTarget();
        const position = camera.getPosition();

        const delta = Communicator.Point3.subtract(target, position);
        const l1 = delta.length();

        if (this._majorAxis === Communicator.Axis.X)
            delta.x = 0;
        else if (this._majorAxis === Communicator.Axis.Y)
            delta.y = 0;
        else if (this._majorAxis === Communicator.Axis.Z)
            delta.z = 0;

        const l2 = delta.length();
        const deg = Math.acos(l2 / l1) * (180.0 / Math.PI);

        return deg;
    }

    /** @hidden */
    _resetPosition(camera) {
        this._calculateMajorAxis(camera);

        const position = camera.getPosition();
        const target = camera.getTarget();

        const d = Communicator.Point3.subtract(target, position);
        let length = d.length();

        // adjust length by walk distance for near plane clipping
        if (this.getWalkSpeed() > 0) {
            length = this.getWalkSpeed();
        }

        switch (this._majorAxis) {
            case Communicator.Axis.X:
                d.set(0, d.y, d.z);
                camera.setUp(new Communicator.Point3(1, 0, 0));
                break;

            case Communicator.Axis.Y:
                d.set(d.x, 0, d.z);
                camera.setUp(new Communicator.Point3(0, 1, 0));
                break;

            case Communicator.Axis.Z:
                d.set(d.x, d.y, 0);
                camera.setUp(new Communicator.Point3(0, 0, 1));
                break;
        }

        d.normalize().scale(length);
        camera.setTarget(Communicator.Point3.add(position, d));
    }

    /** @hidden */
    _calculateMajorAxis(camera) {
        const up = camera.getUp();

        const x = Math.abs(up.x);
        const y = Math.abs(up.y);
        const z = Math.abs(up.z);

        if (z >= x && z >= y)
            this._majorAxis = Communicator.Axis.Z;
        else if (y >= x && y >= z)
            this._majorAxis = Communicator.Axis.Y;
        else
            this._majorAxis = Communicator.Axis.X;
    }

    /**
     * Sets the speed to walk when using the mouse scroll wheel.
     * @param zoomSpeed distance for walking with the mouse scroll wheel.
     */
    setZoomSpeed(zoomSpeed) {
        this._zoomDistance = zoomSpeed;
    }

    /**
     * Gets the speed used when walking with the mouse scroll wheel.
     */
    getZoomSpeed() {
        return this._zoomDistance;
    }

    /**
     * Sets the tilt value. Values must be between -45 and 45 degrees.
     * @param tilt
     */
    setTilt(tilt) {
        this._tilt = clamp(tilt, MIN_TILT, MAX_TILT);
        const camera = this._viewer.view.getCamera();
        this._updateCamera(camera);
    }

    /**
     * Gets the tilt value.
     */
    getTilt() {
        return this._tilt;
    }

    /**
     * Sets the view angle. Values must be between 30 and 150 degrees.
     * @param viewAngle
     */
    setViewAngle(degrees) {
        const viewAngle = clamp(degrees, MIN_ANGLE, MAX_ANGLE);
        if (this._viewAngle !== viewAngle) {
            this._viewAngle = viewAngle;
            this._updateCamera(this._viewer.view.getCamera());
        }
    }

    /**
     * Gets the view angle.
     */
    getViewAngle() {
        return this._viewAngle;
    }

    /**
     * Sets the walkSpeed for walking forward, backwards, left, and right.
     * @param walkSpeed The camera will move by walkSpeed per second.
     */
    setWalkSpeed(walkSpeed) {
        this._walkDistance = walkSpeed;
    }

    /**
     * Gets the walkSpeed for walking forward, backwards, left, and right.
     */
    getWalkSpeed() {
        return this._walkDistance;
    }

    /**
     * Sets the elevation speed for moving the camera up and down.
     * @param elevationSpeed The camera will move by elevationSpeed per second.
     */
    setElevationSpeed(elevationSpeed) {
        this._elevationSpeed = elevationSpeed;
    }

    /**
     * Gets the elevation speed for moving the camera up and down.
     */
    getElevationSpeed() {
        return this._elevationSpeed;
    }

    /**
     * Sets the rotation speed for tilt and rotate.
     * @param rotationSpeed The camera will rotate by rotationSpeed degrees per second.
     */
    setRotationSpeed(rotationSpeed) {
        this._rotationSpeed = rotationSpeed;
    }

    /**
     * Gets the rotation speed for tilt and rotate.
     */
    getRotationSpeed() {
        return this._rotationSpeed;
    }

    /** @hidden */
    setWalkActive(active) {
        this._walkActive = active;
    }

    /**
     * Returns true if walking is currently active
     */
    getWalkActive() {
        return this._walkActive;
    }

     /**
     * Returns true if Collision is currently active
     */
    getCollisionEnabled() {
        return this._collisionEnabled;
    }

    /**
     * Returns true if BIM mode is currently active
     */
    getBimModeEnabled() {
        return this._bimModeEnabled;
    }

    /**
     * Get major axis
     */
    getMajorAxis(){
        return this._majorAxis;
    }

    /** @hidden */
    getActiveWalk() {
        return this._activeWalk;
    }
    }
}