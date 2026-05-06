// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 31-05-23    HSK        PLAT-2890   Revamped UX/UI Walk Mode
// 28-06-23    HSK        PLAT-2728   Coloring Mechanism - Derive from var(--app-accent-color)
// -------------------------------------------------------------------------------------

import React from "react";
import IafControlPanel from "../../component-low/iafControlPanel/IafControlPanel.jsx"
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
import styles from "./MouseControls.module.scss";

export function FirstMouseControl(props) {
  const handleClick = () => {
    props.onClick(1);
  };
  return (
    <IafControlPanel isOpen={props.isMouseControlOpen}>
      <div className={styles["mouse"]}>
        <div className={styles["mousefont"]}>Mouse controls</div>
      </div>
      <div className={styles["inner-panel"]}>
        <div className={styles["inner-text"]}>
          <div className={styles["sub-heading"]}>How to teleport: </div>
          <div className={styles["description"]}>
            Teleport to a location by double clicking the{" "}
            <b>left mouse button.</b>
          </div>
          <div id="graphic" className={styles["graphic"]}>
            <div id="mouse-box" className={styles["mouse-box"]}>
              <div className={styles["mouse-circle1"]}></div>
              <div className={styles["mouse-circle2"]}></div>
            </div>
          </div>

          <div id="bottomPanel" className={styles["bottomPanel"]}>
            <div id="ellipseContainer" className={styles["ellipseContainer"]}>
              <div className={styles["e"]}></div>
              <div className={`${styles.e} ${styles.e1}`}></div>
              <div className={`${styles.e} ${styles.e2}`}></div>
              <div className={`${styles.e} ${styles.e3}`}></div>
            </div>
            <IafButton title="Back" backgroundColor="#FFFFFF" textColor="#B8B8B8"></IafButton>
            <IafButton title="Next" backgroundColor="var(--app-accent-color)" textColor="FFFFFF" onClick={handleClick}></IafButton>
          </div>
        </div>
      </div>
    </IafControlPanel>
  );
}
