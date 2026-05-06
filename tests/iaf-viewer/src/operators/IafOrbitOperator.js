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
// 01-08-23    HSK        PLAT-2746   Commented the primary button checks to activate OrbitMarkup with 
//                                    left mouse clicks (Orbit mode), right mouse clicks (Pan mode), 
//                                    and middle mouse clicks (Zoom mode).
// -------------------------------------------------------------------------------------

import { IafOrbitBaseOperator } from './IafOrbitBaseOperator.js'

export let OrbitMarkup;
export function getOrbitMarkup() {
  OrbitMarkup = class OrbitMarkup extends Communicator.Markup.MarkupItem {
  _viewer = null
  _circle = new Communicator.Markup.Shape.Circle();
  _position = null;

  constructor(viewer, position, radius) {
    super();
    this._viewer = viewer;
    this._position = position;
    this._circle.setRadius(radius);
  }

  draw() {
    if (this._circle) {
      const center = this._viewer.view.projectPoint(this._position);
      this._circle.setCenter(Communicator.Point2.fromPoint3(center));
      this._viewer.markupManager.getRenderer().drawCircle(this._circle);
    }
  }
  }
}

export let IafOrbitOperator;
export function getIafOrbitOperator() {
  IafOrbitOperator = class IafOrbitOperator extends IafOrbitBaseOperator {
  _orbitTarget = Communicator.Point3.zero();
  _orbitFallbackMode = Communicator.OrbitFallbackMode.ModelCenter;

  _modelCenter = null;

  _circleMarkupHandler = null;
  _circleRadius = 3;

  _updateCameraCenterAction = new Communicator.Util.CurrentAction(false);
  _updateCameraCenterTimer = new Communicator.Util.Timer();

  _pickPosition = null;
  _bimOrbitEnabled = false;

  /** @hidden */
  constructor(viewer) {
    super(viewer, (turnTilt) => {
      this._turnTilt = turnTilt;
      //don't orbit on drawings
      if (!this._viewer.sheetManager.isDrawingSheetActive()) {
        if (this._pickPosition !== null) {
          if (this._circleMarkupHandler === null) {
            const circleMarkup = new OrbitMarkup(this._viewer, this._pickPosition, this._circleRadius);
            this._circleMarkupHandler = this._viewer.markupManager.registerMarkup(circleMarkup);
          }

          this._orbitByTurnTiltWithTarget(turnTilt, this._pickPosition);

        } else {
          // otherwise default to the fallback mode
          const camera = this._viewer.view.getCamera();
          switch (this._orbitFallbackMode) {
            default:
            case Communicator.OrbitFallbackMode.CameraTarget:
              this._orbitByTurnTiltWithTarget(turnTilt, camera.getTarget());
              break;
            case Communicator.OrbitFallbackMode.ModelCenter:
              if (this._modelCenter)
                this._orbitByTurnTiltWithTarget(turnTilt, this._modelCenter);
              break;
            case Communicator.OrbitFallbackMode.OrbitTarget:
              this._orbitByTurnTiltWithTarget(turnTilt, this._orbitTarget);
              break;
          }
        }
      }
    });

    this._viewer.setCallbacks({
      sceneReady: () => {
        this._updateModelCenter();
      },
      modelSwitched: () => {
        this._updateModelCenter();
      },

      visibilityChanged: () => {
        this._updateModelCenter();
      },
      _updateTransform: (isFullyOutOfHierarchy) => {
        if (!isFullyOutOfHierarchy) {
          this._updateModelCenter();
        }
      },
      _geometryCreated: () => {
        this._updateModelCenter();
      },
      hwfParseComplete: () => {
        this._updateModelCenter();
      }

    });
  }

  _updateModelCenter(maxRetries = 50) {
    this._updateCameraCenterTimer.clear();

    this._updateCameraCenterAction.set(async () => {
      const modelBounding = await this._viewer.model.getModelBounding(true, false);

      if (modelBounding.isDegenerate() && maxRetries > 0) {
        this._updateCameraCenterTimer.set(500, () => {
          this._updateModelCenter(maxRetries - 1);
        });
        return;
      }

      this._modelCenter = modelBounding.center();
    });
  }

  /** @hidden */
  async onMouseDown(event) {
    super.onMouseDown(event);

    if (this.isActive()) {
      // if (event.getButton() === this._primaryButton) {
        //customized to orbit around selected nodes
        let nodeIds = this._viewer.selectedNodeIds
        if(_.size(nodeIds) === 0){
          //orbit around sliceNodeIds if any
          nodeIds = this._viewer.sliceNodeIds
          //no selected/slice nodes with assets, check direct selects from the viewer
          if(_.size(nodeIds) === 0) {
            let nodes = this._viewer.selectionManager.getResults()
            if (_.size(nodes) > 0) {
              nodeIds = _.map(nodes, '_nodeId')
            }
          }
        }

        if(_.size(nodeIds) > 0) {
          let boundingBox = await this._viewer.model.getNodesBounding(nodeIds)
          if(boundingBox) {
            this._pickPosition = boundingBox.center()
          }
          event.setHandled(true)
        }else{
          const selection = await this._viewer.view.pickFromPoint(event.getPosition(),
            new Communicator.PickConfig(Communicator.SelectionMask.Face));
          if (selection !== null && selection.overlayIndex() === 0) {
            this._pickPosition = selection.getPosition()
            event.setHandled(true)
          } else {
            this._pickPosition = null
          }
        }
      // }
    }
  }

  /** @hidden */
  onMouseUp(event) {
    super.onMouseUp(event);

    // if (event.getButton() === this._primaryButton) {
      this._pickPosition = null;
    // }
    this._removeMarkup();

  }

  /** @hidden */
  onTouchStart(event) {
    if (this._primaryTouchId === null) {
        this._primaryTouchId = event.getId();

        const position = event.getPosition();
        const emulatedMouseEvent = new Communicator.Event.MouseInputEvent(position.x, position.y, this._primaryButton, event.getButtons(), Communicator.KeyModifiers.None, Communicator.MouseInputType.Down);

        this.onMouseDown(emulatedMouseEvent);
    }
    event.setHandled(this.setHandled());
  }

  /** @hidden */
  onTouchMove(event){
    if (this._primaryTouchId === event.getId()) {
        const position = event.getPosition();
        const emulatedMouseEvent = new Communicator.Event.MouseInputEvent(position.x, position.y, this._primaryButton, event.getButtons(), Communicator.KeyModifiers.None, Communicator.MouseInputType.Move);
        this.onMouseMove(emulatedMouseEvent);
    }
    event.setHandled(this.setHandled());
  }

  /** @hidden */
  onTouchEnd(event){
    if (this._primaryTouchId === event.getId()) {
        const position = event.getPosition();
        const emulatedMouseEvent = new Communicator.Event.MouseInputEvent(position.x, position.y, this._primaryButton, event.getButtons(), Communicator.KeyModifiers.None, Communicator.MouseInputType.Up);
        this.onMouseUp(emulatedMouseEvent);

        this._primaryTouchId = null;
    }
    event.setHandled(this.setHandled());
  }

  /**
   * BIM orbit is intended to make orbiting building models easier.
   * It slows the rotation speed, clamps vertical rotation to 180 degrees, and restricts horizontal rotation to rotate around the vertical axis.
   * @param bimOrbitEnabled
   */
  setBimOrbitEnabled(bimOrbitEnabled)
  {
    this._bimOrbitEnabled = bimOrbitEnabled;
  }

  /**
   * Returns true if BIM orbit is enabled.
   */
  getBimOrbitEnabled()
  {
    return this._bimOrbitEnabled;
  }

  /** @hidden */
  _removeMarkup() {
    if (this._circleMarkupHandler !== null) {
      this._viewer.markupManager.unregisterMarkup(this._circleMarkupHandler);
      this._circleMarkupHandler = null;
    }
  }

  _getClampedRotationMatrix(axis, degrees, up, viewAxesUp)
  {
    const matrixTilt = Communicator.Matrix.createFromOffAxisRotation(axis, degrees);

    const newUp = Communicator.Point3.zero();
    matrixTilt.transform(up, newUp);

    const degreesUp = Communicator.Util.radiansToDegrees(Math.asin(Communicator.Point3.dot(viewAxesUp, newUp)));

    if (degreesUp <= 0) {
      return new Communicator.Matrix();
    } else {
      return matrixTilt;
    }

  }

  _orbitByTurnTiltWithTarget(turnTilt, delta) {
    const view = this._viewer.view;
    const camera = view.getCamera();

    let position = camera.getPosition().subtract(delta);
    let target = camera.getTarget().subtract(delta);
    let up = camera.getUp().normalize();

    const forward = Communicator.Point3.subtract(target, position).normalize();
    const left = Communicator.Point3.cross(up, forward).normalize();

    const turn = turnTilt[0];
    const tilt = turnTilt[1];

    //pitch
    let matrixTilt = new Communicator.Matrix();
    //yaw
    let matrixTurn = new Communicator.Matrix();

    if (this._bimOrbitEnabled) {
      const viewAxes = this._viewer.model.getViewAxes();
      const viewAxesUp = viewAxes.upVector.copy();

      // Rotate around camera left axis using y translation
      matrixTilt = this._getClampedRotationMatrix(left, tilt, up, viewAxesUp);
      // Rotate around the view axes up axis using x translation
      matrixTurn = Communicator.Matrix.createFromOffAxisRotation(viewAxesUp, turn / 4);

      const newPosition = matrixTurn.transform(matrixTilt.transform(position));
      const newTarget = matrixTurn.transform(matrixTilt.transform(target));
      const newUp = matrixTurn.transform(matrixTilt.transform(Communicator.Point3.add(position, up)));

      newUp.subtract(newPosition);

      position = newPosition;
      target = newTarget;
      up = newUp;
    } else {
      // Tilt around left axis using y translation
      matrixTilt = Communicator.Matrix.createFromOffAxisRotation(left, tilt);

      // Turn around up axis using x translation
      matrixTurn = Communicator.Matrix.createFromOffAxisRotation(up, turn);

      // Concatenate tilt/turn
      const matrixTiltTurn = Communicator.Matrix.multiply(matrixTurn, matrixTilt);

      const newPosition = matrixTiltTurn.transform(position);
      const newTarget = matrixTiltTurn.transform(target);
      const newUp = matrixTiltTurn.transform(Communicator.Point3.add(position, up));

      newUp.subtract(newPosition);

      position = newPosition;
      target = newTarget;
      up = newUp;
    }


    position.add(delta);
    target.add(delta);

    camera.setPosition(position);
    camera.setTarget(target);
    camera.setUp(up);

    view.setCamera(camera);
  }

  /**
   * Sets the fallback mode. This is used to specify whether to orbit around a set target, the model center, or camera target
   * when there is no selection on the model, or useSelectionPointForRotation is false.
   * @param fallbackMode ModelCenter, CameraTarget, OrbitTarget
   */
  setOrbitFallbackMode(fallbackMode) {
    this._orbitFallbackMode = fallbackMode;
  }

  /**
   * Gets the orbit fallback mode.
   * @returns orbit fallback mode
   */
  getOrbitFallbackMode() {
    return this._orbitFallbackMode;
  }

  /**
   * Sets the orbit target for the orbit fallback mode OrbitTarget.
   * @param orbitTarget
   */
  setOrbitTarget(orbitTarget) {
    this._orbitTarget = orbitTarget;
  }

  /**
   * Gets the orbit target point.
   * @returns orbit target
   */
  getOrbitTarget() {
    return this._orbitTarget;
  }

  }
}