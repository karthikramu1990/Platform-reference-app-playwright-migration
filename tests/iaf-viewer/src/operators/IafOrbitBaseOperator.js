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

export let IafOrbitBaseOperator;
export function getIafOrbitBaseOperator() {
  IafOrbitBaseOperator = class IafOrbitBaseOperator extends Communicator.Operator.OperatorBase {

  _cameraRotateFunction = IafOrbitBaseOperator.CameraRotateFunction;
  _cameraRotationMomentumEnabled = false;

  _isDown = false; //Indicates whether the left button is down
  _mouseDragged = false; //Indicates whether the user moved the mouse while holding the left button

  _averagedMousePoints = new TimedPoints();
  _averageTimeIntervalMilliseconds = 150;

  _previousMouseMovePoint = Communicator.Point2.zero();
  _mouseMovePoint = Communicator.Point2.zero(); // Where the user is pressing during a drag
  _mouseMoveOffset = Communicator.Point2.zero();

  _previousMouseMoveTime = null;
  _mouseMoveTime = null;
  _mouseMoveElapsedTimeSeconds = 0;

  _rotationDegreesPerSecond = [0.0, 0.0]; // Number of degrees per second to rotate the camera, when animation is active. Might be negative

  _animationLastTickTime = 0; // The last time _onTick() was called
  _animationElapsedTimeSeconds = 0; // The amount of time taken during the last tick

  _animationIntervalResult = null; // The result of calling Javascript's setInterval()
  _preferredAnimationIntervalMilliseconds = 16; // The number of milliseconds per interval

  _momentum = 0; // The rotation's momentum during an animation. Starts at 1 and goes to 0
  _momentumLossPerSecond = 0; // The momentum loss rate

  _degreesPerPixel = .5; // Converts input pixels to degrees
  _maxRotationMagnitudeScale = 8; // Increase this to allow the user to increase the maximum fling speed

  _initialSelectionPosition = null;

  _primaryButton = Communicator.Button.Left;

  /** @hidden */
  constructor(viewer, rotateFunction) {
    super(viewer);
    this._cameraRotateFunction = rotateFunction;
  }

  getCameraRotationMomentumEnabled() {
    return this._cameraRotationMomentumEnabled;
  }

  setCameraRotationMomentumEnabled(val) {
    if (val !== this._cameraRotationMomentumEnabled) {
      this._cameraRotationMomentumEnabled = val;

      if (!val)
        this.stopAnimation();
    }
  }

  isCurrentlyAnimating() {
    return this._cameraRotationMomentumEnabled && this.getMomentum() > 0;
  }
  /** @hidden */
  onDeactivate() {
    const p = super.onDeactivate();
    return p;
  }

  /** @hidden */
  onViewOrientationChange() {
    this.stopAnimation();
  }

  supportsAnimation() {
    return true;
  }

  /** @hidden */
  onMouseDown(event) {
    super.onMouseDown(event);

    if (this.isActive()) {
      this._initialSelectionPosition = event.getPosition();

      this._isDown = true;
      this.stopAnimation();
      this._mouseDragged = false;

      // Hold onto time and point
      this._previousMouseMoveTime = Date.now();
      this._mouseMoveTime = this._previousMouseMoveTime;
      this._mouseMovePoint.assign(this._initialSelectionPosition);
      this._previousMouseMovePoint.assign(this._mouseMovePoint);

      // Clear out average
      this._averagedMousePoints.clear();
      this._averagedMousePoints.add(this._mouseMovePoint, this._mouseMoveTime);

    }
  }

  /** @hidden */
  onMouseMove(event) {
    super.onMouseMove(event);

    if (this.isActive()) {
      if (!this._isDown)
        return;

      this._mouseDragged = true;


      // Hold onto previous points
      this._previousMouseMovePoint.assign(this._mouseMovePoint);

      // Hold onto current points and calculate offsets
      this._mouseMovePoint.assign(event.getPosition());
      this._mouseMoveOffset = Communicator.Point2.subtract(this._mouseMovePoint, this._previousMouseMovePoint);

      // Update times
      this._previousMouseMoveTime = this._mouseMoveTime;
      this._mouseMoveTime = Date.now();
      this._mouseMoveElapsedTimeSeconds = this._previousMouseMoveTime === null
        ? 0
        : (this._mouseMoveTime - this._previousMouseMoveTime) / 1000
      ;

      // Average
      this._averagedMousePoints.add(this._mouseMovePoint, this._mouseMoveTime);

      // Rotate
      const offsetForRotation = this._getMouseMoveOffsetForRotation();
      this._rotateCamera(offsetForRotation);
    }
  }

  /** @hidden */
  onMouseUp(event) {
    if (this.isActive()) {
      this._isDown = false;

      if (this._mouseDragged && this.getCameraRotationMomentumEnabled()) {
        this._mouseMoveOffset = this._averagedMousePoints.getAverageOffsetWithinMilliseconds(this._averageTimeIntervalMilliseconds);

        // Calculate angular velocity, and limit it
        const offsetForRotation = this._getMouseMoveOffsetForRotation();
        if (offsetForRotation[0] !== 0 || offsetForRotation[1] !== 0) {
          for (let i = 0; i < 2; i++) {
            const maxRotationDegreesPerSecond = Math.abs(offsetForRotation[i]) * this._maxRotationMagnitudeScale;

            this._rotationDegreesPerSecond[i] = offsetForRotation[i] / this._mouseMoveElapsedTimeSeconds;
            if (this._rotationDegreesPerSecond[i] < -maxRotationDegreesPerSecond)
              this._rotationDegreesPerSecond[i] = -maxRotationDegreesPerSecond;
            else if (this._rotationDegreesPerSecond[i] > maxRotationDegreesPerSecond)
              this._rotationDegreesPerSecond[i] = maxRotationDegreesPerSecond;
          }

          this._momentum = 1.0;

          this._startAnimation();
        }
        else {
          this._momentum = 0.0;
        }
      }
    }

    super.onMouseUp(event);
  }


  _rotateCamera(offsetForRotation) {
    //Rotates the camera by delegating to the member 'cameraRotateFunction'
    this._cameraRotateFunction(offsetForRotation);
  }

  stopAnimation() {
    if (this._animationIntervalResult !== null) {
      clearInterval(this._animationIntervalResult);
      this._animationIntervalResult = null;
    }
  }

  getMomentum() {
    return this._momentum;
  }

  /**
   * Sets proportion of momentum lost per second if camera rotation momentum is enabled. At 0
   * no momentum is lost and the camera will orbit indefinitely. Above 1 the camera will stop
   * orbiting within a second of release. Only values greater than or equal to 0 are accepted.
   * @param amountLost Proportion of momentum lost per second
   */
  setMomentumLossPerSecond(amountLost) {
    if(amountLost >= 0) {
      this._momentumLossPerSecond = amountLost;
    }
  }

  getMomentumLossPerSecond() {
    return this._momentumLossPerSecond;
  }

  isAnimating() {
    return this._animationIntervalResult !== null;
  }

  _startAnimation() {
    if (this._animationIntervalResult !== null)
      return; // The animation is already running

    this._animationLastTickTime = Date.now();

    this._animationIntervalResult = window.setInterval(() => {
      this._onTick();
    }, this._preferredAnimationIntervalMilliseconds);
  }

  _getMouseMoveOffsetForRotation() {
    return [
      -this._mouseMoveOffset.x * this._degreesPerPixel,
      this._mouseMoveOffset.y * this._degreesPerPixel,
    ];
  }

  _onTick() {
    // Calculate updated time interval
    const now = Date.now();
    this._animationElapsedTimeSeconds = (now - this._animationLastTickTime) / 1000;
    this._animationLastTickTime = now;

    // Calculate time-based rotation offset
    const offsetForRotation = [this._animationElapsedTimeSeconds * this._rotationDegreesPerSecond[0], this._animationElapsedTimeSeconds * this._rotationDegreesPerSecond[1]];
    this._rotateCamera(offsetForRotation);

    // Apply momentum loss to the angular velocity if necessary
    if (this._momentumLossPerSecond > 0) {
      this._momentum = Math.max(0, this._momentum - this._animationElapsedTimeSeconds * this._momentumLossPerSecond);
      if (this._momentum > 0) {
        for (let i = 0; i < this._rotationDegreesPerSecond.length; i++)
          this._rotationDegreesPerSecond[i] *= this._momentum;
      } else {
        for (let i = 0; i < this._rotationDegreesPerSecond.length; i++)
          this._rotationDegreesPerSecond[i] = 0;

        this._rotateCamera(this._rotationDegreesPerSecond);
        this.stopAnimation(); // Stop timer
      }
    }
  }
  }
}

  /** @hidden */
class TimedPoints {
  _points = [];
  _times = [];
  _count = 0;

  /**
   * Caches a stream of points generated in time by storing them in a wrapped array, from oldest to newest. When the wrap occurs, the oldest, earliest entries are overwritten
   * @param {number} maxPoints the maximum point stream size
   */
  constructor(maxPoints = 10) {
    this._points = new Array(maxPoints);
    this._times = new Array(maxPoints);
  }

  /**
   * Clears the array of points
   */
  clear() {
    this._count = 0;
  }

  /**
   * Adds a point to the array of points, possibly overwriting the oldest one
   */
  add(point, now = Date.now()) {
    const index = this._count % this._points.length;

    if (this._points[index] === undefined)
      this._points[index] = point.copy();
    else
      this._points[index].assign(point);

    this._times[index] = now;

    this._count++;
  }

  /**
   * Gets the average offset from the first point specified between (now - offset) and now
   */
  getAverageOffsetWithinMilliseconds(millisec, now = Date.now()) {
    let startIndex = -1;
    const end = Communicator.Point2.zero();

    const pointCount = Math.min(this._points.length, this._count);

    if (pointCount > 0) {
      let averagedCount = 0;

      // Step backwards starting from the wrapped last item, collecting all points within the specified time interval
      for (let pointIndex = 0; pointIndex < pointCount; pointIndex++) {
        const index = (this._count - 1 - pointIndex) % this._points.length;

        // If we ran into a time that was outside the specified interval, break out since no more times will be within the interval
        const timeOffset = now - this._times[index];
        if (timeOffset > millisec)
          break;

        // Update start index
        startIndex = index;

        // Add to end
        end.add(this._points[index]);
        averagedCount++;
      }

      if (averagedCount > 1) {
        // There are at least two averaged points. Remove the start point
        end.subtract(this._points[startIndex]);
        averagedCount--;

        // Average
        end.scale(1.0 / averagedCount);
      } else {
        // Only one averaged point, which means there was only one point within the specified time interval (so no offset)
        startIndex = -1;
        end.set(0, 0);
      }
    }

    if (startIndex >= 0)
      return Communicator.Point2.subtract(end, this._points[startIndex]);
    else
      return end;
  }

    /**
     * Sets the primary mouse button. When this button is pressed, we will orbit around the selected point on the model.
     * If there is no selected point, the orbit fallback mode will be used for orbit.
     * @param button
     */
    setPrimaryButton(button) {
      this._primaryButton = button;
    }

    /**
     * @returns the primary orbit button
     */
    getPrimaryButton() {
      return this._primaryButton;
    }

  }