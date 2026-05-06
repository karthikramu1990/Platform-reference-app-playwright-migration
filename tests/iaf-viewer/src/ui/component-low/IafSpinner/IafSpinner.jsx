
// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 22-Oct-23   ATK        PLAT-2414   IafSpnner - to be extended if used
// -------------------------------------------------------------------------------------

import React from "react";
import styles from "./IafSpinner.module.scss"
import IafUtils from "../../../core/IafUtils.js";

export const EnumSpinnerStatus = {
  DOWNLOAD_2D_INFO: "Downloading 2D Model Information"
  , DOWNLOAD_3D_INFO: "Downloading 3D Model Information"

  , STREAM_2D: "Streaming the 2D model sheets"
  , STREAM_3D: "Streaming the model contents"

  , SETUP_2D_SHEETS: "Setting up the 2D Model sheets"

  , PROCESS_3D_STRUCTURE: "Processing 3D Model Structure"
}
export function pushSpinnerStatus(iafViewer, status) {
  if (!iafViewer.spinnerStatusArray.includes(status)) {
    iafViewer.spinnerStatusArray.push(status);
  }
  IafUtils.devToolsIaf && console.log('iafViewer.pushSpinnerStatus /spinnerStatusArray', iafViewer.spinnerStatusArray);
  return iafViewer.spinnerStatusArray.join(", ") + "...";
}

export function popSpinnerStatus(iafViewer, status) {
  iafViewer.spinnerStatusArray = iafViewer.spinnerStatusArray.filter(element => element !== status);
  IafUtils.devToolsIaf && console.log('iafViewer.popSpinnerStatus /spinnerStatusArray', iafViewer.spinnerStatusArray);
  return iafViewer.spinnerStatusArray.join(", ") + "...";
}

function IafSpinner({ status, condition }) {
  let spinner = (<div></div>);
  condition && (
    spinner = 
    <div id="modelSpinner" className={styles["modelSpinner"]}>
      {/* <div className={styles["lds-status"]}>{ status }</div> */}
      <div className={styles["lds-ring"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
  return spinner;
}
export default IafSpinner;
