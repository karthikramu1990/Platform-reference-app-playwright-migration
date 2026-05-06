export let IafCameraWalkModeOperator;
export function getIafCameraWalkModeOperator() {
    IafCameraWalkModeOperator = class IafCameraWalkModeOperator extends Communicator.Operator.OperatorBase {
    _keyboardWalkOperator;
    _walkOperator;
    _activeOperator;

    _walkMode;
    _active;

    /** @hidden */
    constructor(_viewer, walkOperator, keyboardWalkOperator) {
        super(_viewer);
        this._keyboardWalkOperator = keyboardWalkOperator;
        this._walkOperator = walkOperator;
        this._activeOperator = walkOperator;
        this._walkMode = Communicator.WalkMode.Mouse;
        this._active = false;
    }

    /**
     * Sets the walk mode to Mouse or Keyboard.
     * @param walkMode
     */
    async setWalkMode(walkMode){
        if (this._walkMode !== walkMode) {
            this._walkMode = walkMode;

            if (walkMode === Communicator.WalkMode.Keyboard) {
                this._activeOperator = this._keyboardWalkOperator;
                if (this._active) {
                    await this._walkOperator.onDeactivate();
                    await this._keyboardWalkOperator.onActivate();
                }
            } else {
                this._activeOperator = this._walkOperator;
                if (this._active) {
                    await this._keyboardWalkOperator.onDeactivate();
                    await this._walkOperator.onActivate();
                }
            }
        }
    }

    /**
     * Gets the walk mode.
     * @returns Keyboard or Mouse
     */
    getWalkMode(){
        if (this._walkMode === Communicator.WalkMode.Keyboard) {
            return Communicator.WalkMode.Keyboard;
        } else {
            return Communicator.WalkMode.Mouse;
        }
    }

    /** @hidden */
    onMouseDown(event){
        this._activeOperator.onMouseDown(event);
    }

    /** @hidden */
    onMouseMove(event){
        this._activeOperator.onMouseMove(event);
    }

    /** @hidden */
    onMouseUp(event){
        this._activeOperator.onMouseUp(event);
    }

    /** @hidden */
    onMousewheel(event){
        this._activeOperator.onMousewheel(event);
    }

    /** @hidden */
    onTouchStart(event){
        this._activeOperator.onTouchStart(event);
    }

    /** @hidden */
    onTouchMove(event){
        this._activeOperator.onTouchMove(event);
    }

    /** @hidden */
    onTouchEnd(event){
        this._activeOperator.onTouchEnd(event);
    }

    /** @hidden */
    onKeyDown(event){
        this._activeOperator.onKeyDown(event);
    }

    /** @hidden */
    onKeyUp(event){
        if (this._walkMode === Communicator.WalkMode.Keyboard) {
            this._activeOperator.onKeyUp(event);
        }
    }

    /** @hidden */
    onDeactivate(){
        return this._activeOperator.onDeactivate();
    }

    /** @hidden */
    onActivate(){
        this._active = true;
        return this._activeOperator.onActivate();
    }

    /** @hidden */
    onViewOrientationChange(){
        this._active = false;
    }

    /** @hidden */
    stopInteraction(){
        return this._activeOperator.stopInteraction();
    }

    /**
     * Sets BIM mode enables/disabled on both mouse and keyboard walk
     */
    async setBimModeEnabled(enabled){
        const ps = [];
        if(enabled) {
            ps.push(this._keyboardWalkOperator.enableBimMode());
            ps.push(this._walkOperator.enableBimMode());
        }
        else {
            ps.push(this._keyboardWalkOperator.disableBimMode());
            ps.push(this._walkOperator.disableBimMode());
        }
        return Promise.all(ps).then(() => {
            return;
        });
    }

    /**
     * Returns true if BIM mode is enabled.
     */
    getBimModeEnabled()
    {
        return this._activeOperator.getBimModeEnabled()
    }

    /**
     * Sets Collision enables/disabled on both mouse and keyboard walk
     */
    async setCollisionEnabled(enabled){
        const ps = [];
        if(enabled) {
            ps.push(this._keyboardWalkOperator.enableCollision());
            ps.push(this._walkOperator.enableCollision());
        }
        else {
            ps.push(this._keyboardWalkOperator.disableCollision());
            ps.push(this._walkOperator.disableCollision());
        }
        return Promise.all(ps).then(() => {
            return;
        });
    }

    /**
     * Returns true if Collision is enabled.
     */
    getCollisionEnabled()
    {
        return this._activeOperator.getCollisionEnabled()
    }

    /**
     * Resets speeds to defaults on both mouse and keyboard walk
     */
    async resetDefaultWalkSpeeds(){
        return Promise.all([
            this._walkOperator.resetDefaultWalkSpeeds(),
            this._keyboardWalkOperator.resetDefaultWalkSpeeds()
        ]).then(() => {
            return;
        });
    }

    /**
     * Sets BIM floor config on both mouse and keyboard walk
     */
    setBimFloorConfig(floorConfig){
        this._walkOperator.setBimFloorConfig(floorConfig);
        this._keyboardWalkOperator.setBimFloorConfig(floorConfig);
    }

    /**
     * Sets BIM wall config on both mouse and keyboard walk
     */
    setBimWallConfig(wallConfig){
        this._walkOperator.setBimWallConfig(wallConfig);
        this._keyboardWalkOperator.setBimWallConfig(wallConfig);
    }

    /**
     * Sets BIM door config on both mouse and keyboard walk
     */
    setBimDoorConfig(doorConfig){
        this._walkOperator.setBimDoorConfig(doorConfig);
        this._keyboardWalkOperator.setBimDoorConfig(doorConfig);
    }

    /**
     * Sets zoom speed on both mouse and keyboard walk
     */
    setZoomSpeed(speed){
        this._walkOperator.setZoomSpeed(speed);
        this._keyboardWalkOperator.setZoomSpeed(speed);
    }

    /**
     * Sets walk speed for both mouse and keyboard walk
     */
    setWalkSpeed(speed){
        this._walkOperator.setWalkSpeed(speed);
        this._keyboardWalkOperator.setWalkSpeed(speed);
    }

    /**
     * Sets elevation speed for both mouse and keyboard walk
     */
    setElevationSpeed(speed){
        this._walkOperator.setElevationSpeed(speed);
        this._keyboardWalkOperator.setElevationSpeed(speed);
    }

    /**
     * Sets rotation speed for both mouse and keyboard walk
     */
    setRotationSpeed(speed){
        this._walkOperator.setRotationSpeed(speed);
        this._keyboardWalkOperator.setRotationSpeed(speed);
    }

    /**
     * Sets view angle (FOV) for both mouse and keyboard walk operators
     */
    setViewAngle(angle){
        this._walkOperator.setViewAngle(angle);
        this._keyboardWalkOperator.setViewAngle(angle);
    }
    }
}