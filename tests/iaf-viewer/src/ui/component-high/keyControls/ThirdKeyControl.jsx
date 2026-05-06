// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 31-05-23    HSK        PLAT-2890   Revamped UX/UI Walk Mode UI
// 28-06-23    HSK        PLAT-2728   Coloring Mechanism - Derive from var(--app-accent-color)
// -------------------------------------------------------------------------------------

import React from "react";
import IafControlPanel from "../../component-low/iafControlPanel/IafControlPanel.jsx"
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
import styles from "./KeyControls.module.scss";

export function ThirdKeyControl(props) {
  const handleNextClick = () => {
    props.onClick(3);
  };
  const handleBackClick = () => {
    props.onClick(1);
  };
  return (
    <IafControlPanel isOpen={true}>
      <div className={styles["key"]}>
        <div className={styles["keyfont"]}>Keyboard controls</div>
      </div>
      <div className={styles["inner-panel"]}>
        <div className={styles["inner-text"]}>
          <div className={styles["sub-heading"]}>How to go up and down: </div>
          <div className={styles["description"]}>
            Travel vertically up or down by holding the Q or E key. When
            released you will land on the nearest floor.
          </div>
          <div id="graphic" className={styles["graphic"]}>
            {/* <div className={styles["line1"></div> */}
            <div id="frameQE">
              <div className={styles["keyContainer keyContainerQ"]}>
                <div className={`${styles.a} ${styles.q}`}>Q</div>
              </div>

              <div className={styles["keyContainer keyContainerE"]}>
                <div className={`${styles.a} ${styles.q}`}>E</div>
              </div>
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
            <IafButton title="Back" backgroundColor="#FFFFFF" textColor="var(--app-accent-color)"  onClick={handleBackClick}></IafButton>
            <IafButton title="Next" backgroundColor="var(--app-accent-color)" textColor="FFFFFF" onClick={handleNextClick}></IafButton>
          </div>
        </div>
      </div>
    </IafControlPanel>
  );
}
