// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 06-01-23    ATK        PLAT-2709   New UX UI Foundation Project
//                                    Code Restructuring.
// -------------------------------------------------------------------------------------

import React from 'react';
import styles from './ContextMenuElement.module.css';

export default function iafContextMenuElement(iafViewer) {
    return (
        <div
          id="contextMenu"
          className={styles["context-menu"]}
          style={{ display: "none" }}
          >
          <ul className={styles["menu"]}>
            <li>
              <div onClick={iafViewer.handleIsolate}> Isolate </div>
            </li>
            <li>
              <div onClick={iafViewer.handleZoom}> Zoom </div>
            </li>
            <li>
              <div onClick={iafViewer.handleHide}> Hide </div>
            </li>
            <li>
              <div onClick={iafViewer.handleShowAll}> Show All </div>
            </li>
            <li>
              <div onClick={iafViewer.handleGetMarkup}>get markup </div>
            </li>
            <li>
              <div onClick={iafViewer.bcfTest}> Generate BCF File </div>
            </li>
          </ul>
        </div>
      )    
}