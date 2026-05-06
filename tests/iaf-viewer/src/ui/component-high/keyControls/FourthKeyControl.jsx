// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 31-05-23    HSK        PLAT-2890   Revamped UX/UI Walk Mode UI
// 28-06-23    HSK        PLAT-2728   Coloring Mechanism - Derive from var(--app-accent-color)
// -------------------------------------------------------------------------------------

import React from "react";
import IafControlPanel from "../../component-low/iafControlPanel/IafControlPanel.jsx"
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
import styles from "./KeyControls.module.scss";

export function FourthKeyControl(props) {
  const handleCloseClick = () => {
    props.onClick(4);
  };
  const handleBackClick = () => {
    props.onClick(2);
  };
  return (
    <IafControlPanel isOpen={true}>
      <div className={styles.key}>
        <div className={styles.keyfont}>Keyboard controls</div>
      </div>
      <div className={styles["inner-panel"]}>
        <div className={styles["inner-text"]}>
          <div className={styles["sub-heading"]}>How to adjust the speed:</div>
          <div className={styles.description}>
            Use the <b>PLUS</b> and <b>MINUS</b> keys on your keyboard to adjust
            the base movement speed.
          </div>
          <div id="graphic" className={styles["graphic"]}>
            {/* <div className={styles.line1}></div> */}
            <div id="frameQE" className={styles["frameQE"]}>
              <div className={`${styles.keyContainer} ${styles.keyContainerQ}`}>
                <div className={`${styles.a} ${styles.q}`}>-</div>
              </div>

              <div className={`${styles.keyContainer} ${styles.keyContainerE}`}>
                <div className={`${styles.a} ${styles.q}`}>+</div>
              </div>
            </div>
          </div>

          <div id="bottomPanel" className={styles["bottomPanel"]}>
            <div id="ellipseContainer" className={styles["ellipseContainer"]}>
              <div
                className={`${styles.e}`}
                style={{ order: 3 }}
              ></div>
              <div className={`${styles.e} ${styles.e1}`}></div>
              <div className={`${styles.e} ${styles.e2}`}></div>
              <div
                className={`${styles.e} ${styles.e3}`}
                style={{ order: 0 }}
              ></div>
            </div>
            <IafButton title="Back"   backgroundColor="#FFFFFF" textColor="var(--app-accent-color)"  onClick={handleBackClick}></IafButton>
            <IafButton title="Close" backgroundColor="var(--app-accent-color)" textColor="FFFFFF" onClick={handleCloseClick}></IafButton>
          </div>
        </div>
      </div>
    </IafControlPanel>
  );
}
