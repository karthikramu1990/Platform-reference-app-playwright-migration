// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 31-05-23    HSK        PLAT-2890   Revamped UX/UI Learning Centre
// 05-06-23    HSK                    Added panelClose call
// 13-06-23    HSK        PLAT-2728   Revamped IafViewer Coloring Mechanism
// 01-04-24    HSK        PLAT-4428   Implemented when one child is preset in panel and if we hit close button it will close and not minimize.
// -------------------------------------------------------------------------------------

import React from "react";
import styles from "./LearningCenter.module.scss";
import { IafHeading } from "../../component-low/iafHeading/IafHeading.jsx";
import { IafSubHeader } from "../../component-low/iafSubHeader/IafSubHeader.jsx";
export function LearningCenter(props) {
  
  //This function is used to close the panel. It calls the onClose function with the parameter 'learningPanel'.
  function panelClose(){
    props.onClose('learningPanel');
  }
  return (
    <div>
      <IafHeading title="Learning Center" showContent={props.showContent} showContentMethod={props.showContentMethod} onClose={panelClose} color={props.color} panelCount={props.panelCount}>
        <div>
          <IafSubHeader title="Navigation Walk Mode">
            <div className={styles["learning-center-title"]}>
              KeyBoard Controls
              <div className={styles["arrow-right"]} onClick={props.onKeyClick}>
                &gt;
              </div>
            </div>
            <div className={styles["learning-center-title"]}>
              Mouse Controls
              <div className={styles["arrow-right"]} onClick={props.onMouseClick}>
                &gt;
              </div>
            </div>
          </IafSubHeader>
        </div>
      </IafHeading>
    </div>
  );
}
