import IafUtils from "../core/IafUtils.js";
/**
 * ****************************************************************************
 *
 * INVICARA INC CONFIDENTIAL __________________
 *
 * Copyright (C) [2012] - [2020] INVICARA INC, INVICARA Pte Ltd, INVICARA INDIA
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
// 01-08-23    ATK        PLAT-3117   Selection and highlighting enhancements
//
// -------------------------------------------------------------------------------------


class ViewerIsolateZoomHelper {
  constructor(viewer, iafViewer) {
    this._camera = null;
    this._deselectOnIsolate = false;
    this._deselectOnZoom = false;
    this._isolateStatus = false;
    this._viewer = viewer;
    this._noteTextManager = viewer._getNoteTextManager();
    let parent = this;
    this._viewer.setCallbacks({
      modelSwitched: function () {
        parent._camera = null;
      }
    })
    this.iafViewer = iafViewer;
  }

  _setCamera(camera) {
    if (this._camera === null) {
      this._camera = camera;
    }
  }

  setDeselectOnIsolate(deselect) {
    this._deselectOnIsolate = deselect;
  };

  getIsolateStatus() {
    return this._isolateStatus;
  };

  async isolateNodes(nodeIds) {
    let view = this._viewer.view;
    this._setCamera(view.getCamera());
    let p = await view.isolateNodes(nodeIds);
    if (this._deselectOnIsolate) {
      // this._viewer.selectionManager.clear();
      this.iafViewer.clearSelection(this._viewer);
    }
    this._isolateStatus = true;
    return p;
  };

  async fitNodes(nodeIds) {
    let view = this._viewer.view;
    this._setCamera(view.getCamera());
    try {
      let p = await view.fitNodes(nodeIds);
      if (this._deselectOnZoom) {
        this._viewer.selectionManager.clear();
      }
      return p;
    }
    catch (err) {
      //ATK PLAT-3000: Assets not highlighting due to error while getting 
      //boundig box of specific nodes. Introduced try catch block
      IafUtils.devToolsIaf && console.log('IafViewer.ViewerIsolateZoomHelper.fitNodes error'
        , '/err', err
      )
    }
    return undefined;
  };

  showAll() {
    let model = this._viewer.model;
    if (model.isDrawing()) {
      let sheetId = this._viewer.getActiveSheetId();
      if (sheetId !== null) {
        return this.isolateNodes([sheetId]);
      }
      return Promise.resolve();
    }
    else {
      let ps = [];
      ps.push(model.resetNodesVisibility());
      //PLAT-1281 do not change camera when showAll is clicked
      /*if (this._camera !== null) {
        this._viewer.view.setCamera(this._camera, window.Communicator.DefaultTransitionDuration);
        this._camera = null;
      }*/
      this._isolateStatus = false;
      ps.push(this._updatePinVisibility());
      return window.Communicator.Util.waitForAll(ps);
    }
  };

  _updatePinVisibility() {
    this._noteTextManager.setIsolateActive(this._isolateStatus);
    return this._noteTextManager.updatePinVisibility();
  };



}

export default ViewerIsolateZoomHelper;


