// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 10-05-23    ATK        PLAT-2813   Created
// -------------------------------------------------------------------------------------

/* To Do
   - Harshal to verify if contextMenu works as expected
*/

import EvmUtils from "../common/evmUtils.js";
import { clearSubMenus } from "../ui/layouts/viewerSubmenu.jsx";
import { logTime } from "./logTime.js";
import IafUtils from "../core/IafUtils.js";

export const mousedown = (iafViewer) => {
    IafUtils.devToolsIaf && console.log(`[${logTime()}]`, "IafViewer.Callbacks.mousedown");
    iafViewer.contextMenu.style.display = "none";
    clearSubMenus();
}

export const contextmenu = (event, iafViewer) => {
    event.preventDefault();
   if (iafViewer.contextMenu.style.display === "none") {
     iafViewer.contextMenu.style.display = "block";
     iafViewer.contextMenu.style.zIndex = "20";
     let mainViewer = iafViewer.evmElementIdManager.getEvmElementById(EvmUtils.EVMMode.View3d);
     let positionSetLeft = false;
     let positionTop = false;
     if (
       mainViewer.clientWidth - iafViewer.contextMenu.offsetWidth <
       event.layerX
     ) {
       positionSetLeft = true;
       iafViewer.contextMenu.style.left =
         event.layerX - iafViewer.contextMenu.offsetWidth + "px";
     }
     if (
       mainViewer.clientHeight - iafViewer.contextMenu.offsetHeight <
       event.layerY
     ) {
       positionTop = true;
       iafViewer.contextMenu.style.top =
         event.layerY - iafViewer.contextMenu.offsetHeight + "px";
     }
     if (!positionSetLeft) {
       iafViewer.contextMenu.style.left = event.layerX + "px";
     }
     if (!positionTop) {
       iafViewer.contextMenu.style.top = event.layerY + "px";
     }
   } else {
     iafViewer.contextMenu.style.display = "none";
   }
 }