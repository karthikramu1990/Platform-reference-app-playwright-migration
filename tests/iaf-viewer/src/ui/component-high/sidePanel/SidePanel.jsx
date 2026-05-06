/*
// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 16-05-23    HSK        PLAT-2730   Revamped IafViewer Panels     
// 24-05-23    HSK        PLAT-2730   Revamed IafViewer Panels - Cutting Planes                              
// -------------------------------------------------------------------------------------
*/

import React from 'react';
import styles from './SidePanel.module.scss'

const SidePanel = (props) => {
  const visible = props.visible !== false;
  return (
    <div
      className={`${styles.sidePanel} ${props.isOpen ? `${styles[props.toolbarSize]}` : styles.closed}`}
      style={visible ? undefined : { display: 'none' }}
    >
      <div className={styles.sidePanelContent}>
        {props.children}
      </div>
   </div>
  );
};

export default SidePanel;
