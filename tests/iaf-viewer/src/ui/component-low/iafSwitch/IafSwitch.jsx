/*
// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 16-05-23    HSK        PLAT-2813   Revamed IafViewer Components
// 24-05-23    HSK        PLAT-2730   Revamed IafViewer Panels - Cutting Planes
// 09-06-23    HSK                    Removed defaultChecked property of Switch
// -------------------------------------------------------------------------------------
*/

import React from "react";
import Switch from "@mui/material/Switch";
import IafTooltip from '../../component-low/Iaftooltip/IafTooltip.jsx'
import styles from "./IafSwitch.module.scss";

export function IafSwitch(props) {
  const { color, isChecked, disabled, name, title,customComponentStyles, customTitleStyles, tooltipText, toolTipClass, tooltipPlacement, onChange } = props

  return (
    <IafTooltip
      title={tooltipText}
      placement={tooltipPlacement || "bottom"}
      open={!!tooltipText}
      toolTipClass={toolTipClass}
    >
      <div className={styles["switch-component"]} style={customComponentStyles || {}} >
        <div className={disabled ? `${styles["switch-title"]} ${styles["switch-disabled"]} `: `${styles[ "switch-title"]}`} style={customTitleStyles || {}}>{title}</div>
        <div className={disabled ? `${styles["disabled-component"]}` : ""}>
          <Switch
            disabled={disabled}
            checked={isChecked}
            name={name}
            onChange={onChange}
            style={{ color: color || "inherit" }} // Apply color prop
          ></Switch>
        </div>
      </div>
    </IafTooltip>
  );
}
