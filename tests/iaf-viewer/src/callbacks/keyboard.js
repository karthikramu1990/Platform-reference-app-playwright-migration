// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 10-04-24    ATK        PLAT-3422   Created
// 11-06-24    HSK        PLAT-4839   Circle - CRUD Apis and Unit Tests - 3D and 2D Only projects
// -------------------------------------------------------------------------------------

const iafCallbackKeyDownEscape = async (event, viewer, idMapping, iafViewer, markupManager) => {
  let currentOp = viewer.operatorManager._operatorStack[1];

  switch (currentOp) {
    case Communicator.OperatorId.MeasurePointPointDistance:
    case Communicator.OperatorId.MeasureEdgeLength:
    case Communicator.OperatorId.MeasureFaceFaceDistance:
    case Communicator.OperatorId.MeasureFaceFaceAngle:
      viewer && viewer.measureManager.removeLastMeasurement();
      break;
      
    case iafViewer.selectOperatorId:
      await iafViewer.applySelection(
        iafViewer.getSelection(),
        [],
        viewer,
        idMapping
      );
      // viewer.selectionManager.clear();
      iafViewer.clearSelection(viewer);
      await iafViewer.unselectParts(viewer, iafViewer.prevSelection);
      // await viewer.model.unsetNodesFaceColor(iafViewer.prevSelection);
      // await viewer.model.unsetNodesLineColor(iafViewer.prevSelection);
      break;

    case markupManager.drawCircleOperatorId:
    case markupManager.drawLineOperatorId:
    case markupManager.drawPolylineOperatorId:
    case markupManager.drawFreehandOperatorId:
    case markupManager.drawPolygonOperatorId:
    case markupManager.drawFreehandOperatorId:
    case markupManager.drawRectangleOperatorId:
    case markupManager.drawImageBoxOperatorId:
    case markupManager.drawLeaderNoteOperatorId:
    case markupManager.drawTextOperatorId:
      if (viewer) {
        markupManager.cancel(currentOp);
      }
      break;
    default:
      break;
  }  
}

const iafCallbackKeyDownDelete = async (event, viewer, idMapping, iafViewer, markupManager) => {
  let currentOp = viewer.operatorManager._operatorStack[1];
  
  switch (currentOp) {
    case markupManager.drawLineOperatorId:
    case markupManager.drawPolylineOperatorId:
    case markupManager.drawFreehandOperatorId:
    case markupManager.drawPolygonOperatorId:
    case markupManager.drawRectangleOperatorId:
    case markupManager.drawCircleOperatorId:
      markupManager.delete(currentOp);
      break;
    case markupManager.drawImageBoxOperatorId:
    case markupManager.drawLeaderNoteOperatorId:
    case markupManager.drawTextOperatorId:
      markupManager.delete(currentOp);
    default:
      break;
  }
}

const iafCallbackKeyDownEnter = async (event, viewer, idMapping, iafViewer, markupManager) => {
  let currentOp = viewer.operatorManager._operatorStack[1];
  
  switch (currentOp) {
    case markupManager.drawPolylineOperatorId:
    case markupManager.drawFreehandOperatorId:
    case markupManager.drawPolygonOperatorId:
    case markupManager.drawImageBoxOperatorId:
    case markupManager.drawLeaderNoteOperatorId:
    case markupManager.drawTextOperatorId:
      markupManager.complete(currentOp);
      break;
      
    default:
      break;
  }
}

export const iafCallbackKeyDown = async (event, viewer, idMapping, iafViewer, markupManager) => {
  //Added null check of markupManager as on keypress event causing null reference error.
  if (!event || !viewer || !iafViewer || !markupManager) return;

  let currentOp = viewer.operatorManager._operatorStack[1];

  switch (event.keyCode) {
    case Communicator.KeyCode.Escape:
      iafCallbackKeyDownEscape(event, viewer, idMapping, iafViewer, markupManager);
      break;

    case Communicator.KeyCode.Delete:
    case Communicator.KeyCode.Backspace: // HSK: PLAT-3422: Handle Deletion of Markups
      iafCallbackKeyDownDelete(event, viewer, idMapping, iafViewer, markupManager);
      break;

    case 13: // Communicator.KeyCode.Enter:
      iafCallbackKeyDownEnter(event, viewer, idMapping, iafViewer, markupManager);
      break;

    default:
      break;
  }
}    
