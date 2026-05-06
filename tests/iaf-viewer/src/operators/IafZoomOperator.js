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
// 29-06-23    ATK        PLAT-3000   Assets not highlighting due to error while getting
//                                    boundig box of specific nodes
// 29-06-23    ATK        PLAT-3000   Added IafUtils.debugIafEnabled()
// -------------------------------------------------------------------------------------

/* -------------------------------------------------------------------------------------
// To Do - ATK
// -------------------------------------------------------------------------------------

High Priority
- Review this file in general


// ------------------------------------------------------------------------------------- */

import IafUtils from "../core/IafUtils";
import IafSpaceUtils from "../core/SpaceUtils";

export let IafZoomOperator;
export function getIafZoomOperator() {
    IafZoomOperator = class IafZoomOperator extends Communicator.Operator.OperatorBase {
  _mouseMoveZoomDelta = 3;
  _mouseWheelZoomDelta = 0.25;
  _pinchZoomModifier = 2.5;
  _prevZoomMultiplier = 0.3;
  _zoomToMousePosition = true;
  _dollyZoomEnabled = false;
  _adjustCameraTarget = false;
  _preserveViewAngle = true;

  _mouseMoveZoomFactor =  1; // TODO: Create and use [[const enum ZoomFactor { Inverted = -1, Normal = 1; }]]
  _mouseWheelZoomFactor = -1; // TODO: see above

  _secondaryTouchId = null;
  _lastTouch1 = new Communicator.Point2.zero();
  _lastTouch2 = new Communicator.Point2.zero();
  _prevLen = 0.0;
  _camPostargetDistance = null;
  _progressiveZoomDeltaForMouseScroll = 0.1;  //This variable is used to inc/dec the progressive zoom speed on mouse scroll

  /** @hidden */
  constructor(viewer, iafViewer) {
    super(viewer);
    this.iafViewer = iafViewer;
    this.clearMapping();
    this.setMapping(Communicator.Button.Right);
    this.setMouseWheelZoomDelta(0.04);
  }

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

  /**
   * When true, scrolling up will zoom towards the model.
   * @param inverted
   */
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

  /**
   * When true, moving the mouse up will zoom towards the model.
   * @param inverted
   */
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

  /**
   * Sets the delta to zoom when moving the mouse
   * @param delta
   */
  setMouseMoveZoomDelta(delta) {
      this._mouseMoveZoomDelta = delta;
  }

  /**
   * Gets the mouse move zoom delta
   * @returns number
   */
  getMouseMoveZoomDelta() {
      return this._mouseMoveZoomDelta;
  }

  /**
   * Sets the delta to zoom when scrolling
   * @param delta
   */
  setMouseWheelZoomDelta(delta) {
      this._mouseWheelZoomDelta = delta;
  }

  /**
   * Gets the scrollwheel zoom delta
   * @returns number
   */
  getMouseWheelZoomDelta() {
      return this._mouseWheelZoomDelta;
  }

  /**
   * When set, the zoom will be towards the mouse position. When not set, the zoom will be from the center of the screen.
   * @param zoom
   */
  setZoomToMousePosition(zoom) {
      this._zoomToMousePosition = zoom;
  }

  /**
   * @returns boolean When true, the zoom will be towards the mouse position. When false, the zoom will be towards the center of the screen.
   */
  getZoomToMousePosition() {
      return this._zoomToMousePosition;
  }

  /**
   * When dolly zoom is enabled, the camera position will move towards the camera target when zooming.
   * @moveCameraPositon
   */
  setDollyZoomEnabled(dollyZoomEnabled)
  {
      this._dollyZoomEnabled = dollyZoomEnabled;
  }

  /**
   * Returns true if dolly zoom is enabled.
   */
  getDollyZoomEnabled()
  {
      return this._dollyZoomEnabled;
  }

  /**
   * When enabled, the camera target will be updated to the selection position while zooming.
   * This can provide a better zoom behavior in perspective projection mode,
   * but comes at the cost of performing a selection on the model during each mouse scroll,
   * which may not be ideal for performance on large models.
   *
   * This setting is disabled by default.
   */
  setMouseWheelAdjustCameraTarget(value) {
      this._adjustCameraTarget = value;
  }

  /**
   * Returns whether the camera target will be updated to the selection
   * position while zooming. See [[setMouseWheelAdjustCameraTarget]].
   */
  getMouseWheelAdjustCameraTarget() {
      return this._adjustCameraTarget;
  }

  /**
   * Sets whether to maintain a constant view angle while zooming. If
   * enabled, when zooming causes the camera's field of view to shrink or
   * grow, the camera's position will also be moved toward or away from
   * the target, respectively.
   *
   * This may prevent confusing camera behavior when perspective
   * projection is used or might be used. When using only orthographic
   * projection, it is better to disable this.
   *
   * This setting is enabled by default.
   */
  setPreserveViewAngle(value) {
      this._preserveViewAngle = value;
  }

  /**
   * Gets whether to maintain a constant view angle while zooming. See
   * [[setPreserveViewAngle]].
   */
  getPreserveViewAngle() {
      return this._preserveViewAngle;
  }

  /** @hidden */
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

    //ATK PLAT-3000: Assets not highlighting due to error while getting boundig box of specific nodes
    if (IafUtils.debugIaf) {
        let nodeIds;
        IafUtils.devToolsIaf && console.log('IafZoomHelper.adjustMouseWheelDelta'
            , '/entities', JSON.stringify(entities)
        );
        entities && entities.length && (nodeIds = entities.map((element) => element.getNodeId()));
        IafUtils.devToolsIaf && console.log('IafZoomHelper.adjustMouseWheelDelta'
            , '/nodeIds', JSON.stringify(nodeIds)
        );
        nodeIds && nodeIds.length && 
            IafSpaceUtils.logNodes('IafZoomHelper.adjustMouseWheelDelta'
                , this._viewer.model
                , nodeIds
                , this.iafViewer.props.idMapping
            );
    }

    if(entities && entities.length){
        try {
            let box= await this._viewer.model.getNodesBounding([entities[0].getNodeId()])
            let objectposition = box.center();
            selectionDistance = Communicator.Point3.subtract(objectposition, cameraPos).length();
            IafUtils.debugIaf 
                && IafUtils.devToolsIaf && console.log('IafZoomHelper.adjustMouseWheelDelta'
                        , '/box', JSON.stringify(box)
                        , '/selectionDistance', JSON.stringify(selectionDistance)
                );
        } catch (err) {
            //ATK PLAT-3000: Assets not highlighting due to error while getting 
            //boundig box of specific nodes. Introduced try catch block
            const nodeId = entities[0].getNodeId();
            let pkgId;
            nodeId 
                && (pkgId = this.iafViewer.props.idMapping[0][nodeId.toString()]);
            nodeId
                && IafSpaceUtils.logNode('IafZoomHelper.adjustMouseWheelDelta error'
                    , this._viewer.model
                    , nodeId
                    , this.iafViewer.props.idMapping
                );
            IafUtils.devToolsIaf && console.log('IafZoomHelper.adjustMouseWheelDelta error'
                , '/pkgId', pkgId
                , '/err', err
            );
            //END ATK PLAT-3000
        }
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

  /** @hidden */
  async onMousewheel(event) {
      this.recalculateTarget();
      await this.adjustMouseWheelDelta(event);

      const delta = this._mouseWheelZoomDelta * this._mouseWheelZoomFactor * event.getWheelDelta();
      if (this._dollyZoomEnabled) {
          await this._dollyZoom(-delta, undefined, event.getPosition());
      } else {
          await this._doZoom(delta, undefined, event.getPosition());
      }
  }

  /** @hidden */
  onTouchStart(event) {
      const view = this._viewer.view;

      if (this._primaryTouchId === null) {
          this._primaryTouchId = event.getId();
          this._lastTouch1.assign(event.getPosition());
      }
      else if (this._secondaryTouchId === null) {
          this._secondaryTouchId = event.getId();
          this._lastTouch2.assign(event.getPosition());
      }

      //set up variables for starting the touch zoom process
      if (this._primaryTouchId !== null && this._secondaryTouchId !== null) {
          this._prevLen = Communicator.Point2.subtract(view.pointToWindowPosition(this._lastTouch2), view.pointToWindowPosition(this._lastTouch1)).length();
          this._dragging = true;
      }
  }

  /** @hidden */
  async onTouchMove(event) {
      const view = this._viewer.view;
      const id = event.getId();
      const position = event.getPosition();

      if (id === this._primaryTouchId)
      this._lastTouch1.assign(position);
      else if (id === this._secondaryTouchId)
      this._lastTouch2.assign(position);

      if (this._dragging && id === this._secondaryTouchId) {
          
          const l1 = Communicator.Point2.subtract(view.pointToWindowPosition(this._lastTouch2), view.pointToWindowPosition(this._lastTouch1)).length();
          const p1 = Communicator.Point2.add(this._lastTouch2, this._lastTouch1).scale(0.50);

          const zoomFactor = (this._prevLen - l1) * this._pinchZoomModifier;
          await this._doZoom(zoomFactor);
          
          this._prevLen = l1;
      }
  }

  /** @hidden */
  onTouchEnd(event) {
      const id = event.getId();

      if (this._primaryTouchId === id)
      this._primaryTouchId = null;
      else if (this._secondaryTouchId === id)
      this._secondaryTouchId = null;

      this._dragging = false;
  }

  /** @hidden */
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

  async _dollyZoom(
      delta,
      camera = this._viewer.view.getCamera(),
      mousePosition,
      dollyTarget = false)
      
  {
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

          // Adjust camera target based on selection position
          if (selectionPosition !== null) {
              const a = Communicator.Point3.subtract(cameraTarget, cameraPosition);
              const b = Communicator.Point3.subtract(selectionPosition, cameraPosition);
              const newTarget = Communicator.Point3.add(cameraPosition, a.scale(Communicator.Point3.dot(a, b) / Communicator.Point3.dot(a, a)));
              camera.setTarget(newTarget);
          }

          let eyeVector = Communicator.Point3.subtract(camera.getTarget(), cameraPosition);

          // Dolly target forward if the position is too close
          if (delta > 0 && eyeVector.length() < minTargetDistance) {
              camera.setTarget(Communicator.Point3.add(cameraTarget, eyeVector.copy().normalize().scale(minTargetDistance*2)));
          }

          eyeVector = Communicator.Point3.subtract(camera.getTarget(), cameraPosition);
          camera.setPosition(Communicator.Point3.add(cameraPosition, eyeVector.copy().scale((delta > 0 ? 1 : -1) * .05)));

      } else {
          const eyeVector = Communicator.Point3.subtract(cameraTarget, cameraPosition).scale(delta / 10);
          camera.setPosition(Communicator.Point3.add(cameraPosition, eyeVector));

          if (dollyTarget) {
              camera.setTarget(Communicator.Point3.add(cameraTarget, eyeVector));
          }
      }


      camera = this._updateCameraViewAngle(camera);

      this._viewer.pauseRendering(() =>{
          if (mousePosition) {
              const intersectionPoint = camera.getCameraPlaneIntersectionPoint(mousePosition, this._viewer.view);

              view.setCamera(camera);

              const intersectionPoint2 = camera.getCameraPlaneIntersectionPoint(mousePosition, this._viewer.view);
              if (intersectionPoint !== null && intersectionPoint2 !== null) {
                  camera.dolly(Communicator.Point3.subtract(intersectionPoint2, intersectionPoint));
              }
          }

          view.setCamera(camera);
      });
  }

  async _doZoom(
      delta,
      camera = this._viewer.view.getCamera(),
      mousePosition)
      
  {
      const view = this._viewer.view;
      const zoom = 1.0 / (1.0 - delta);

      if (mousePosition && this._zoomToMousePosition) {

          if (this._adjustCameraTarget) {
              const selection = await this._viewer.view.pickFromPoint(mousePosition, new Communicator.PickConfig());
              if (selection !== undefined && selection.isEntitySelection()) {
                  const reverseEyeVector = camera.getPosition().subtract(camera.getTarget());

                  const a = Communicator.Point3.subtract(camera.getTarget(), camera.getPosition());
                  const b = Communicator.Point3.subtract(selection.getPosition(), camera.getPosition());
                  const newTarget = camera.getPosition().add(a.scale(Communicator.Point3.dot(a, b) / Communicator.Point3.dot(a, a)));

                  camera.setTarget(newTarget);
                  camera.setPosition(Communicator.Point3.add(newTarget, reverseEyeVector));
              }
          }

          this._viewer.pauseRendering(() => {
              const intersectionPoint = camera.getCameraPlaneIntersectionPoint(mousePosition, this._viewer.view);
              this._zoomHelper(zoom, camera);

              // pan
              const intersectionPoint2 = camera.getCameraPlaneIntersectionPoint(mousePosition, this._viewer.view);
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
          camera.setPosition(Communicator.Point3.subtract(target, newDelta));
      }

      view.setCamera(camera);
  }
    }
}