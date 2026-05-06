// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 31-05-23    HSK        PLAT-2890   Revamped UX/UI Walk Mode
// 28-06-23    HSK        PLAT-2728   Coloring Mechanism - Derive from var(--app-accent-color)
// -------------------------------------------------------------------------------------

import React from "react";
import IafControlPanel from "../../component-low/iafControlPanel/IafControlPanel.jsx"
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
import styles from "./MouseControls.module.scss";

export function ThirdMouseControl(props) {
  const handleNextClick = () => {
    props.onClick(3);
  };
  const handleBackClick = () => {
    props.onClick(1);
  };
  return (
    <IafControlPanel isOpen="true">
      <div className={styles["mouse"]}>
        <div className={styles["mousefont"]}>Mouse controls</div>
      </div>
      <div className={styles["inner-panel"]}>
        <div className={styles["inner-text"]}>
          <div className={styles["sub-heading"]}> How to move: </div>
          <div className={styles["description"]}>
            Move around by clicking and holding the <b>right mouse button.</b>
          </div>
          <div id="graphic" className={styles["graphic"]}>
          <div id="look" className={styles["look"]}>
              <div className={styles["look-Intersect"]}>
                <div className={styles["look-rectangle1 left-click"]} ></div>
                <div className={styles["look-rectangle2"]}></div>
              </div>
              <div className={styles["look-rectangle3"]}></div>
            </div>
          </div>

          <div id="bottomPanel" className={styles["bottomPanel"]}>
            <div id="ellipseContainer" className={styles["ellipseContainer"]}>
              <div
                className={styles["e"]}
                style={{
                  order: 2,
                }}
              ></div>
              <div className={`${styles.e} ${styles.e1}`}></div>
              <div
                className={`${styles.e} ${styles.e2}`}
                style={{
                  order: 0,
                }}
              ></div>
              <div className={`${styles.e} ${styles.e3}`}></div>
            </div>
            <IafButton title="Back" backgroundColor="#FFFFFF" textColor="var(--app-accent-color)" onClick={handleBackClick}></IafButton>
            <IafButton title="Next" backgroundColor="var(--app-accent-color)" textColor="FFFFFF" onClick={handleNextClick}></IafButton>
          </div>
        </div>
      </div>
    </IafControlPanel>
  );
}
