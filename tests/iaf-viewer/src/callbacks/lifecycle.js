/**
 * Helpers for HOOPS WebViewer {@link https://docs.techsoft3d.com/hoops/visualize-web/api_ref/viewing/interfaces/CallbackMap.html CallbackMap}
 * lifecycle callbacks (sheets, model load, info, assembly tree).
 *
 * Signatures match HOOPS: sheetActivated(nodeId), sheetDeactivated(), missingModel(modelPath),
 * modelLoadBegin(), modelLoadFailure(modelName, reason, error), info(infoType, message),
 * assemblyTreeReady().
 */

import { NotificationStore } from "../store/notificationStore";
import { logTime } from "./logTime.js";
import IafUtils from "../core/IafUtils.js";

/** @typedef {'2d' | '3d'} IafViewerView */

/**
 * CallbackMap.sheetActivated — a drawing sheet was activated.
 * @param {object} iafViewer
 * @param {IafViewerView} view
 * @param {number} nodeId
 */
export async function iafSheetActivated(iafViewer, view, nodeId) {
  const tag =
    view === "2d"
      ? "IafViewer.callbacks.2d.sheetActivated"
      : "IafViewer.callbacks.sheetActivated";
  IafUtils.devToolsIaf && console.log(`[${logTime()}]`, tag, "/view", view, "/nodeId", nodeId);
}

/**
 * CallbackMap.sheetDeactivated — drawing sheets were deactivated.
 * @param {object} iafViewer
 * @param {IafViewerView} view
 */
export async function iafSheetDeactivated(iafViewer, view) {
  const tag =
    view === "2d"
      ? "IafViewer.callbacks.2d.sheetDeactivated"
      : "IafViewer.callbacks.sheetDeactivated";
  IafUtils.devToolsIaf && console.log(`[${logTime()}]`, tag, "/view", view);
}

/**
 * CallbackMap.missingModel — a referenced model file was not found during load.
 * @param {object} iafViewer
 * @param {IafViewerView} view
 * @param {string} modelPath
 */
export async function iafMissingModel(iafViewer, view, modelPath) {
  const tag =
    view === "2d"
      ? "IafViewer.callbacks.2d.missingModel"
      : "IafViewer.callbacks.missingModel";
  console.warn(`[${logTime()}]`, tag, "/view", view, "/modelPath", modelPath);
}

/**
 * CallbackMap.modelLoadBegin — load/switch has started (e.g. Model.switchToModel).
 * @param {object} iafViewer
 * @param {IafViewerView} view
 */
export async function iafModelLoadBegin(iafViewer, view) {
  const tag =
    view === "2d"
      ? "IafViewer.callbacks.2d.modelLoadBegin"
      : "IafViewer.callbacks.modelLoadBegin";
  IafUtils.devToolsIaf && console.log(`[${logTime()}]`, tag, "/view", view);
}

/**
 * CallbackMap.modelLoadFailure — model could not be loaded.
 * @param {object} iafViewer
 * @param {IafViewerView} view
 * @param {string} modelName
 * @param {string} reason
 * @param {*} error
 */
export async function iafModelLoadFailure(
  iafViewer,
  view,
  modelName,
  reason,
  error
) {
  const is3d = view === "3d";
  NotificationStore.notifyModelIsMissing(iafViewer, modelName, is3d);
  const tag =
    view === "2d"
      ? "IafViewer.callbacks.2d.modelLoadFailure"
      : "IafViewer.callbacks.modelLoadFailure";
  console.error(
    `[${logTime()}]`,
    tag,
    "/view",
    view,
    "/modelName",
    modelName,
    "/reason",
    reason,
    "/error",
    error
  );
}

/**
 * CallbackMap.info — viewer-generated diagnostic (InfoType + message).
 * @param {object} iafViewer
 * @param {IafViewerView} view
 * @param {*} infoType Communicator.InfoType (Error | Info | Warning)
 * @param {string} message
 */
export async function iafHoopsInfo(iafViewer, view, infoType, message) {
  const tag =
    view === "2d" ? "IafViewer.callbacks.2d.info" : "IafViewer.callbacks.info";
  const level =
    typeof window !== "undefined" &&
    window.Communicator &&
    window.Communicator.InfoType
      ? {
          [window.Communicator.InfoType.Error]: "error",
          [window.Communicator.InfoType.Warning]: "warn",
          [window.Communicator.InfoType.Info]: "log",
        }[infoType] || "log"
      : "log";
  const payload = [
    `[${logTime()}]`,
    tag,
    "/view",
    view,
    "/infoType",
    infoType,
    "/message",
    message,
  ];
  if (level === "error") console.error(...payload);
  else if (level === "warn") console.warn(...payload);
  else IafUtils.devToolsIaf && console.log(...payload);
}

/**
 * CallbackMap.assemblyTreeReady — Model class methods may be called (before modelStructureReady).
 * @param {object} iafViewer
 * @param {IafViewerView} view
 */
export async function iafAssemblyTreeReady(iafViewer, view) {
  const tag =
    view === "2d"
      ? "IafViewer.callbacks.2d.assemblyTreeReady"
      : "IafViewer.callbacks.assemblyTreeReady";
  IafUtils.devToolsIaf && console.log(`[${logTime()}]`, tag, "/view", view);
}
