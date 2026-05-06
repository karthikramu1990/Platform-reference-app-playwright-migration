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

//Custom Select Operator
//Will keep the model as is if no nodeId is selected

// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 06-01-23    ATK        PLAT-2709   New UX UI Foundation Project
//                                    Code Restructuring.
// 01-08-23    ATK        PLAT-3117   Selection and highlighting enhancements
//
// -------------------------------------------------------------------------------------

import IafSet from '../common/iafSet';
import { ESelectMode, ECuttingPlane } from '../common/IafViewerEnums';
import { permissionManager, RESOURCE_TYPES } from '../core/database/permission/iafPermissionManager';
import IafUtils from "../core/IafUtils.js";

export let SelectOperator;
export function getSelectOperator() {
  SelectOperator = class SelectOperator extends Communicator.Operator.OperatorBase {
  _selectionButton = Communicator.Button.Left;
  // _noteTextManager: Communicator.Markup.Note.NoteTextManager;
  _forceEffectiveSceneVisibilityMask = Communicator.SelectionMask.None;
  _doubleClickFitWorld = false;
  selectMode = ESelectMode.Default;
  _onSelectionCompleteCb = undefined;
  _lastSelection = undefined;
  _selectionFilterHandler = {
    nodeIds: [],
    callback: ()=>{}
  };

  constructor(viewer, noteTextManager, iafViewer) {
    super(viewer);
    this._noteTextManager = noteTextManager;
    this.iafViewer = iafViewer;
    this.clearSelectionFilter();
  }

  clearSelectionFilter() {
    this._selectionFilterHandler = {
      nodeIds: [],
      callback: (nodeId) => {  
        if (this._selectionFilterHandler.nodeIds.includes(nodeId)) {
          IafUtils.devToolsIaf && console.log('SelectOperator._selectionFilterHandler.callback', 'ignoring filtered selection nodes');
          return null;
        }
        return nodeId;
      }
    };
    this._viewer.selectionManager.setSelectionFilter(null);
  }

  enableSelectionFilter() {
    this._viewer.selectionManager.setSelectionFilter(this._selectionFilterHandler.callback.bind(this));
  }

  addSelectionFilterNodeIds(nodeIds) {
    this._selectionFilterHandler.nodeIds = IafSet.Union(nodeIds, this._selectionFilterHandler.nodeIds);
  }

  setOnSelectionCompleteCb(callback /* : any */) {
    IafUtils.devToolsIaf && console.log('SelectOperator.setOnSelectionCompleteCb', callback);
    this._onSelectionCompleteCb = callback;
  }

  setSelectMode(mode /* : ESelectMode */) {
    IafUtils.devToolsIaf && console.log('SelectOperator.setSelectMode', mode);
    this.selectMode = mode;
    this._onSelectionCompleteCb = null;
  }

  getSelectMode() /* : ESelectMode */ {
    return this.selectMode;
  }

  /**
   * Gets the mask used for forcing effective scene visibility during selection.
   */
  getForceEffectiveSceneVisibilityMask() {
    return this._forceEffectiveSceneVisibilityMask;
  }

  /**
   * Sets the mask used for forcing effective scene visibility during selection.
   */
  setForceEffectiveSceneVisibilityMask(mask) {
    this._forceEffectiveSceneVisibilityMask = mask;
  }

  /**
   * Gets the button used for selection.
   * @returns Button
   */
  getSelectionButton() {
    return this._selectionButton;
  }

  /**
   * Sets the button used for selection
   * @param button
   */
  setSelectionButton(button) {
    this._selectionButton = button;
  }

  /** @hidden */
  onKeyUp(event) {
    if (event.getKeyCode() === Communicator.KeyCode.Escape) {
      // this._viewer.selectionManager.clear();
      this.iafViewer.clearSelectionAll();//Both 2d & 3d selections should be in sync
    }
  }

  async handleCuttingPlaneSelection(event /* : Communicator.Event.MouseInputEvent */, 
                                    selection /* : Communicator.Selection.SelectionItem */) {
    IafUtils.devToolsIaf && console.log('SelectOperator.handleCuttingPlaneSelection',
                  '/viewer', this._viewer,                        
                  '/event', event,
                  '/screenpoint', event.getPosition().x, event.getPosition().y,
                  'selection', selection,
                );

    let position = selection.getPosition(); // World space position
    let point3d = this._viewer.view.unprojectPoint(event.getPosition(), 0);

    IafUtils.devToolsIaf && console.log('SelectOperator.handleCuttingPlaneSelection',
                  '/worldpoint', selection.getPosition(),
                  '/unprojectedPoint', point3d);

    if (position) { // SelectionType.Part will not have a position and null will be returned.
      await this.iafViewer.iafCuttingPlanesUtils.updateCuttingPlaneByReferencePoint(this.selectMode, position);
    }

    // Switch back to the default selection mode
    // this._iafViewer.newToolbarElement.current.handleShowCuttingPlaneGeometryBoolean(true);
    IafUtils.devToolsIaf && console.log('SelectOperator.handleCuttingPlaneSelection', '/_onSelectionCompleteCb', this._onSelectionCompleteCb);
  }

  async _processFilteredSelectionClick(event, selection) {
    const findValidSelection = (selection) => {
      const nodeId = selection.getNodeId();
      if (!this._selectionFilterHandler.nodeIds.includes(nodeId)) {
        IafUtils.devToolsIaf && console.log("IafViewer.SelectOperator._processFilteredSelectionClick, selecting", nodeId);
        this._processSelectionClick(event, selection);
        return true;
      } else {
        IafUtils.devToolsIaf && console.log("IafViewer.SelectOperator._processFilteredSelectionClick, ignoring", nodeId);
      }
    }

    if (findValidSelection(selection)) return;

    const config = new Communicator.PickConfig(Communicator.SelectionMask.Face | Communicator.SelectionMask.Line);
    config.forceEffectiveSceneVisibilityMask = this._forceEffectiveSceneVisibilityMask;
    this._viewer.view.pickAllFromPoint(this._ptCurrent, config).then((arrNodeSelection) => {
      for (let s=0;s<arrNodeSelection.length; s++) {
        const selection = arrNodeSelection[arrNodeSelection.length-s-1];
        if (findValidSelection(selection)) break;
      }
    });
  }

  async handleSelection (event /* : Communicator.Event.MouseInputEvent */,
                         selection /*: Communicator.Selection.SelectionItem */) {
    IafUtils.devToolsIaf && console.log('SelectOperator.handleSelection', '/selectMode', this.selectMode, '/ESelectMode', ESelectMode);

    switch (this.selectMode) {
      case ESelectMode.Default:
        if (this?._selectionFilterHandler?.nodeIds?.length)  this._processFilteredSelectionClick(event, selection);
        else this._processSelectionClick(event, selection);
        break;

      case ESelectMode.CuttingPlaneTopReferencePoint:
      case ESelectMode.CuttingPlaneBottomReferencePoint:
      case ESelectMode.CuttingPlaneFrontReferencePoint:
      case ESelectMode.CuttingPlaneBackReferencePoint:
      case ESelectMode.CuttingPlaneLeftReferencePoint:
      case ESelectMode.CuttingPlaneRightReferencePoint:
        this.handleCuttingPlaneSelection(event, selection);
        break;

      default:
        console.error ("SelectOperator.handleSelection", "Unsupported selection mode", this.selectMode);
        // Switch back to the default selection mode
        this.setSelectMode(ESelectMode.Default);
        break;
    }
    if (this._onSelectionCompleteCb) {
      this._onSelectionCompleteCb();
    }
    IafUtils.devToolsIaf && console.log('SelectOperator.handleSelection', 'I am here switching back to default selection mode');
    this.setSelectMode(ESelectMode.Default);
  }

  /** @hidden */
  onMouseUp(event /* : Communicator.Event.MouseInputEvent */) {
    IafUtils.devToolsIaf && console.log('SelectOperator.onMouseUp'
                    , '/event', event
                    , '/isActive', this.isActive()
    );
    if (this.isActive()) 
    {
      const pointDistance = Communicator.Point2.subtract(this._ptFirst, this._ptCurrent).length();
      if ((pointDistance < 5) && (event.getButton() === this._selectionButton || this._primaryTouchId !== null)) {
        const view = this._viewer.view;

        const config = new Communicator.PickConfig(Communicator.SelectionMask.Face | Communicator.SelectionMask.Line);
        config.forceEffectiveSceneVisibilityMask = this._forceEffectiveSceneVisibilityMask;
        // config.respectVisibility = true;
          
        IafUtils.devToolsIaf && console.log('SelectOperator.onMouseUp about to view.pickFromPoint');
        const p = view.pickFromPoint(this._ptCurrent, config).then((selection) => {
          IafUtils.devToolsIaf && console.log('SelectOperator.onMouseUp' 
                      , '/selection', selection
                      , '/selectionType', selection.getSelectionType()
                      , '/faceEntity', selection.getFaceEntity()
          );
          /*if (selection.getNodeId() === null) {
            //console.log("No NodeId was selected");
            return;
          }*/
          const cuttingManager = this._viewer.cuttingManager;
          const cuttingSelected = cuttingManager.getCuttingSectionFromNodeId(selection.getNodeId()) !== null;

          IafUtils.devToolsIaf && console.log('SelectOperator.onMouseUp', '/cuttingSelected', cuttingSelected);
          const notePinSelected = this._noteTextManager.selectPin(selection);

          const resourcePermissions = this.iafViewer.state.resourcePermissions;
          let pickedMarkup = null;
          if(resourcePermissions?.[RESOURCE_TYPES.MARKUP].canWrite){
            pickedMarkup = this._viewer.markupManager.pickMarkupItem(this._ptCurrent);
            if (pickedMarkup instanceof Communicator.Markup.Redline.RedlineText) {
              pickedMarkup.onSelect();
            }
          }

          if (!notePinSelected && !cuttingSelected && pickedMarkup === null) {
            if (selection.isNodeSelection()) {
              IafUtils.devToolsIaf && console.log('SelectOperator.onMouseUp', 'selection.isNodeSelection');
              this.handleSelection(event, selection);
            } else if (!this._isDoubleClick) {
              // this._viewer.selectionManager.clear();
              /* Graphic clicking away from model. will sent empty selection to application side.
                 app will select or remove the existing selection. based on the glass mode status.
              */
              if(!this.iafViewer.props.enableOptimizedSelection){
                this.iafViewer.clearSelectionAll();//Both 2d & 3d selections should be in sync
              }else{
                this.iafViewer.props.OnSelectedElementChangeCallback([]);
              }
              if(this._viewer.glassMode){
                //this line returns promise, probably no await is okay as it's at the end of the process
                this._viewer.model.setNodesHighlighted(this._viewer.sliceNodeIds, true)
              }
            }
          }
          event.setHandled(
            selection.getSelectionType() !== Communicator.SelectionType.None
          );
        });
        // p as Internal.UnusedPromise; // XXX: Throwing away promise.
      }
    }

    super.onMouseUp(event);
  }

  /** @hidden */
  async onDoubleClick() {
    if (this._doubleClickFitWorld) {
      return this._viewer.view.fitWorld();
    }
  }

  /**
   * When enabled, a double click will fit the view to the model bounding box.
   * @param doubleClickFitWorld
   */
  setDoubleClickFitWorldEnabled(doubleClickFitWorld) {
    this._doubleClickFitWorld = doubleClickFitWorld;
  }

  // helper function to get the parent selection item if the part is already selected
  _getSelectionOrParentIfSelected(selection) {
    const model = this._viewer.model;
    const nodeId = selection.getNodeId();

    if (!model.isNodeLoaded(nodeId)) {
      return selection;
    }

    // If the selection item is PMI, don't check for a parent
    const nodeType = model.getNodeType(nodeId);
    if (nodeType === Communicator.NodeType.PmiBody) {
      return selection;
    }

    const selectionManager = this._viewer.selectionManager;
    let parent = null;

    if (selectionManager.getSelectParentIfSelected()) {
      parent = selectionManager.containsParent(selection);
    }

    if (parent !== null) {
      // if the parent is already selected, select the parent of the parent
      if(Selection.SelectionItem){ //Added guard because 2d viewer does not have SelectionItem 
      const out = Selection.SelectionItem.create(model.getNodeParent(parent.getNodeId()));
      return out.isNodeSelection() ? out : selection;
      }
      else{
        return selection
      }
    } //kf: commented out so parent is not selected
    /*else if (selectionManager.contains(selection)) {
    // if the item is already selected, select it's parent
    const out = Selection.SelectionItem.create(model.getNodeParent(nodeId));
    return out.isNodeSelection() ? out : selection;
  }*/ else {
      // if neither the selected part or it's parent is selected, select the part
      return selection;
    }
  }

  _processThrough(event) {

  }

  _processSelectionClick(event, selection) {
    // don't add overlay geometry into the selection set
    const overlayIndex = selection.overlayIndex();
    IafUtils.devToolsIaf && console.log('SelectOperator._processSelectionClick', 
                  '/selection', selection,
                  '/nodeId', selection.nodeId,
                  '/overlayIndex', overlayIndex
                );

    if (overlayIndex !== 0 && overlayIndex !== null) {
      return;
    }

    let r = this._viewer.selectionManager.getResults();
    IafUtils.devToolsIaf && console.log('SelectOperator._processSelectionClick', 
                  '/selectionManager.getResults()', r
                );

    const selectionManager = this._viewer.selectionManager;
    // PLG-1115: Temporary fix for enableOptimizedSelection  
    // The enableOptimizedSelection flag has a bug due to recent refactoring, causing it to not work as expected.  
    // As a workaround, if enableOptimizedSelection is true, always select the item directly.  
    // Otherwise, follow the original selection logic (toggle on Ctrl/Cmd, otherwise single selection).  
    if (this.iafViewer.props.enableOptimizedSelection) {
      const item = this._getSelectionOrParentIfSelected(selection);
      selectionManager.set(item);
    } else {
        if (event.controlDown() || event.commandDown()) {
            selectionManager.toggle(selection);
        } else {
            const item = this._getSelectionOrParentIfSelected(selection);
            selectionManager.set(item);
        }
    }
  }
  }
}