// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 31-05-23    HSK        PLAT-2890   Revamped UX/UI Walk Mode UI
// 28-06-23    HSK        PLAT-2728   Coloring Mechanism - Derive from var(--app-accent-color)
// -------------------------------------------------------------------------------------

import React from "react";
import IafControlPanel from "../../component-low/iafControlPanel/IafControlPanel.jsx"
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
import styles from "./KeyControls.module.scss";

export function FirstKeyControl(props) {
  const handleClick = () => {
    props.onClick(1);
  };
  return (
    <IafControlPanel isOpen={props.isKeyControlOpen}>
      <div className={styles["key"]}>
        <div className={styles["keyfont"]}>Keyboard controls</div>
      </div>
      <div className={styles["inner-panel"]}>
        <div className={styles["inner-text"]}>
          <div className={styles["sub-heading"]}>How to walk: </div>
          <div className={styles["description"]}>
            Walk around using WASD or the arrow keys on your keyboard.
          </div>
          <div id="graphic" className={styles["graphic"]}>
            <div id="walk" className={styles["walk"]}>
              <div className={styles["keyContainer"]}></div>
              <div className={styles["a"]}>A</div>
              <div className={`${styles.keyContainer} ${styles.keyContainerD}`}></div>
              <div className={`${styles.a} ${styles.d}`}>D</div>
              <div className={`${styles.keyContainer} ${styles.keyContainerS}`}></div>
              <div className={`${styles.a} ${styles.s}`}>S</div>
              <div className={`${styles.keyContainer} ${styles.keyContainerW}`}></div>
              <div className={`${styles.a} ${styles.w}`}>W</div>
            </div>
            <div className={styles["or"]}>Or</div>
            <div id="walk2" className={styles["walk2"]}>
              <div className={styles["keyContainer"]}>
                <div className={styles["dropdown"]}>
                  <div className={styles["boundingBox"]}>
                    <div className={styles["arrow_left"]}></div>
                  </div>
                </div>
              </div>
              <div className={`${styles.keyContainer} ${styles.keyContainerS}`}>
                <div className={styles["dropdown"]}>
                  <div className={styles["boundingBox"]}>
                    <div className={`${styles.arrow_left} ${styles.arrow_down}`}></div>
                  </div>
                </div>
              </div>
              <div className={`${styles.keyContainer} ${styles.keyContainerD}`}>
                <div className={styles["dropdown"]}>
                  <div className={styles["boundingBox"]}>
                    <div className={`${styles.arrow_left} ${styles.arrow_right}`}></div>
                  </div>
                </div>
              </div>
              <div className={`${styles.keyContainer} ${styles.keyContainerW}`}>
                <div className={styles["dropdown"]}>
                  <div className={styles["boundingBox"]}>
                    <div className={`${styles.arrow_left} ${styles.arrow_up}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="bottomPanel" className={styles["bottomPanel"]}>
            <div id="ellipseContainer" className={styles["ellipseContainer"]}>
              <div className={styles["e"]}></div>
              <div className={`${styles.e} ${styles.e1}`}></div>
              <div className={`${styles.e} ${styles.e2}`}></div>
              <div className={`${styles.e} ${styles.e3}`}></div>
            </div>
            <IafButton
              title="Back"
              backgroundColor="#FFFFFF"
              textColor="#B8B8B8"
            ></IafButton>
            <IafButton
              title="Next"
              backgroundColor="var(--app-accent-color)"
              textColor="FFFFFF"
              onClick={handleClick}
            ></IafButton>
          </div>
        </div>
      </div>
    </IafControlPanel>
  );
}
