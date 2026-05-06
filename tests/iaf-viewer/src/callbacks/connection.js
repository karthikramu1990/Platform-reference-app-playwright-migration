// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 29-01-24    ATK        PLAT-2957   Graphics Server Connection State Notifications
// (extended)  —            —          HOOPS viewer model/load/view + cutting-section logs
// -------------------------------------------------------------------------------------

import { NotificationStore } from "../store/notificationStore"
import { logTime } from "./logTime.js";
import IafUtils from "../core/IafUtils.js";

export const setClientTimeout = async (viewer, view, timeout, warningTimeout) => {
    IafUtils.devToolsIaf && console.log(`[${logTime()}]`, 'IafViewer.callbacks.setClientTimeout', '/view', view, '/timeout', timeout, '/warningTimeout', warningTimeout);
    viewer.setClientTimeout(timeout, warningTimeout);
}

export const iafAttemptToRecreateViewer = async (iafViewer, view, confirmDialog=true) => {    
    return;
    if (
        view === '3d' &&
        iafViewer &&
        typeof iafViewer.recreate3DViewerAfterWebsocketClose === 'function' &&
        iafViewer.websocketConnectionClosed
    ) {
        if (confirmDialog) {
            const opts = {
                title: "No Activity",
                message: "It seems there’s been no activity for some time. Would you like to continue reloading?",
                confirmText: "Refresh Viewer",
                cancelText: "Cancel",
            };
            const proceed =
                typeof iafViewer.props?.showConfirmDialog === "function"
                    ? await iafViewer.props.showConfirmDialog(opts)
                    : window.confirm(opts.message);
            if (!proceed) {
                IafUtils.devToolsIaf && console.log(`[${logTime()}]`, 'IafViewer.Connection.iafAttemptToRecreateViewer', 'User cancelled viewer recreation.');
                return;
            }
        }
    
        await iafViewer.recreate3DViewerAfterWebsocketClose();
    }
}
export const iafWebsocketConnectionClosed = async (graphicsResources) => {
    IafUtils.devToolsIaf && console.log(`[${logTime()}]`, 'IafViewer.callbacks.iafWebsocketConnectionClosed', '/aspect', graphicsResources.queryViewType.aspect);
    graphicsResources.websocketConnectionClosed = true;
}

export const internalCallbackKeepAlive = async (iafViewer, aspect) => {
    IafUtils.devToolsIaf && console.log(`[${logTime()}]`, 'IafViewer.callbacks.internalCallbackKeepAlive', '/aspect', aspect);
    if (aspect === 'View3d') {
        iafViewer.props.graphicsResources?.keepAlive();
    } else if (aspect === 'View2d') {
        iafViewer.props.graphicsResources2d?.keepAlive();
    }
}

export const iafWebGlContextLost = async (iafViewer, view) => {
    IafUtils.devToolsIaf && console.log(`[${logTime()}]`, 'IafViewer.callbacks.iafWebGlContextLost', '/view', view);  
    iafViewer.webGlContextLost = true;                      
    NotificationStore.notifyWebGlContextLost(iafViewer);
}

export const iafWebsocketTimeout = async (iafViewer, view) => {
    IafUtils.devToolsIaf && console.log(`[${logTime()}]`, 'IafViewer.callbacks.websocketTimeout', '/view', view);
    // NotificationStore.notifyWebsocketTimeout(iafViewer);
}

export const iafWebsocketTimeoutWarning = async (iafViewer, view) => {
    IafUtils.devToolsIaf && console.log(`[${logTime()}]`, 'IafViewer.callbacks.iafWebsocketTimeoutWarning', '/view', view);
    // NotificationStore.notifyWebsocketTimeoutWarning(iafViewer);
}

export const iafSubtreeLoaded = async (iafViewer, view, modelRootIds, source) => {
    IafUtils.devToolsIaf && console.log(`[${logTime()}]`, 'IafViewer.callbacks.subtreeLoaded'
        , '/view', view
        , '/modelRootIds', modelRootIds
        , '/source', source
    );
}

export const iafSubtreeDeleted = async (iafViewer, view, modelRootIds) => {
    IafUtils.devToolsIaf && console.log(`[${logTime()}]`, 'IafViewer.callbacks.subtreeDeleted'
        , '/view', view
        , '/modelRootIds', modelRootIds
    );
}

export const iafStreamingActivated = async (iafViewer, view) => {
    IafUtils.devToolsIaf && console.log(`[${logTime()}]`, 'IafViewer.callbacks.streamingActivated', '/view', view);
}

export const iafStreamingDeactivated = async (iafViewer, view) => {
    IafUtils.devToolsIaf && console.log(`[${logTime()}]`, 'IafViewer.callbacks.streamingDeactivated', '/view', view);
}

/** @param {'2d' | '3d'} viewerView */
function modelLogTag(viewerView, suffix) {
  return viewerView === "2d"
    ? `IafViewer.callbacks.2d.${suffix}`
    : `IafViewer.callbacks.${suffix}`;
}

/** CallbackMap.modelStructureHeaderParsed */
export const iafModelStructureHeaderParsed = async (
  iafViewer,
  viewerView,
  fileName,
  fileType
) => {
  IafUtils.devToolsIaf && console.log(
    `[${logTime()}]`,
    modelLogTag(viewerView, "modelStructureHeaderParsed"),
    "/fileName",
    fileName,
    "/fileType",
    fileType
  );
};

/** CallbackMap.modelLoaded (2D also sets view2d.isLoaded) */
export const iafModelLoaded = async (iafViewer, viewerView, modelRootIds, source) => {
    IafUtils.devToolsIaf && console.log(
        `[${logTime()}]`,
        modelLogTag(viewerView, "modelLoaded"),
        "/view",
        viewerView,
        "/modelRootIds",
        modelRootIds,
        "/source",
        source
      );
    
    const graphicsResources = viewerView === "2d" ? iafViewer.props.graphicsResources2d : iafViewer.props.graphicsResources;
    const keepAliveData = graphicsResources.keepAliveData;
    if (keepAliveData.nodeId && modelRootIds.length > 0 && modelRootIds.includes(keepAliveData.nodeId)) {
        try {
          await graphicsResources.viewer?.model?.deleteNode(keepAliveData.nodeId);
          if (graphicsResources.queryViewType.aspect === "View2d") {
            keepAliveData.camera && await graphicsResources.viewer?.view?.setCamera(Communicator.Camera.fromJson(keepAliveData.camera));
          }
          IafUtils.devToolsIaf && console.log(`[${logTime()}]`, modelLogTag(viewerView, "modelLoaded"), 'Keep-alive temporary node deleted', graphicsResources.queryViewType.aspect, '/keepAliveData?.nodeId:', keepAliveData.nodeId);
        } catch (error) {
          console.warn(`[${logTime()}]`, modelLogTag(viewerView, "modelLoaded"), 'Failed to delete keep-alive temporary node', graphicsResources.queryViewType.aspect, '/keepAliveData?.nodeId:', keepAliveData.nodeId, error);
        }
        return;
    }
    viewerView === "2d"  && iafViewer.setState((prev) => ({
      view2d: { ...prev.view2d, isLoaded: true },
    }));
};

export const iafModelStructureLoadBegin = async (iafViewer, viewerView) => {
  IafUtils.devToolsIaf && console.log(`[${logTime()}]`, modelLogTag(viewerView, "modelStructureLoadBegin"), "/view", viewerView);
};

export const iafModelStructureLoadEnd = async (iafViewer, viewerView) => {
  IafUtils.devToolsIaf && console.log(`[${logTime()}]`, modelLogTag(viewerView, "modelStructureLoadEnd"), "/view", viewerView);
};

export const iafModelStructureParseBegin = async (iafViewer, viewerView) => {
  IafUtils.devToolsIaf && console.log(`[${logTime()}]`, modelLogTag(viewerView, "modelStructureParseBegin"), "/view", viewerView);
};

export const iafModelSwitchStart = async (iafViewer, viewerView, clearOnly) => {
  IafUtils.devToolsIaf && console.log(
    `[${logTime()}]`,
    modelLogTag(viewerView, "modelSwitchStart"),
    "/view",
    viewerView,
    "/clearOnly",
    clearOnly
  );
};

export const iafModelSwitched = async (
  iafViewer,
  viewerView,
  clearOnly,
  modelRootIds
) => {
  IafUtils.devToolsIaf && console.log(
    `[${logTime()}]`,
    modelLogTag(viewerView, "modelSwitched"),
    "/view",
    viewerView,
    "/clearOnly",
    clearOnly,
    "/modelRootIds",
    modelRootIds
  );
};

/** CallbackMap.viewLoaded — HOOPS passes a MarkupView instance */
export const iafMarkupViewLoaded = async (iafViewer, viewerView, markupView) => {
  IafUtils.devToolsIaf && console.log(
    `[${logTime()}]`,
    modelLogTag(viewerView, "viewLoaded"),
    "/view",
    viewerView,
    "/markupView",
    markupView
  );
};

/** 3D only — CallbackMap.addCuttingSection */
export const iafAddCuttingSection = async (iafViewer, cuttingSection) => {
  IafUtils.devToolsIaf && console.log(
    `[${logTime()}]`,
    "IafViewer.Callbacks.addCuttingSection",
    "/cuttingSection",
    cuttingSection
  );
};

/** 3D only — CallbackMap.removeCuttingSection */
export const iafRemoveCuttingSection = async (iafViewer) => {
  IafUtils.devToolsIaf && console.log(`[${logTime()}]`, "IafViewer.Callbacks.removeCuttingSection");
};

/** 3D only — CallbackMap.cuttingPlaneDragStart */
export const iafCuttingPlaneDragStart = async (
  iafViewer,
  cuttingSection,
  planeIndex
) => {
  IafUtils.devToolsIaf && console.log(
    `[${logTime()}]`,
    "IafViewer.Callbacks.cuttingPlaneDragStart",
    "/cuttingSection",
    cuttingSection,
    "/planeIndex",
    planeIndex
  );
};