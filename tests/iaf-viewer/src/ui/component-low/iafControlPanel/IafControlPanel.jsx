// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 31-05-23    HSK        PLAT-2890   Created
//
// -------------------------------------------------------------------------------------

import React from 'react';
import styles from './IafControlPanel.module.scss'

const IafControlPanel = (props) => {
  return (
    <div>
        {props.isOpen &&( <div className={styles['control-panel']}>
      <div className={styles["control-panel-content"]}>
        {props.children}
      </div>
    </div>)}
    </div>
   
  );
};

export default IafControlPanel;