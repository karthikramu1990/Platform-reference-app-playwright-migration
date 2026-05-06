/*
// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 16-05-23    HSK        PLAT-2813   Revamed IafViewer Components 
// 06-06-23    HSK                    Modified code to handle un-nested options
// 25-08-23    ATK                    props.disabled consumed by IafDropDown
// -------------------------------------------------------------------------------------
*/

import React from "react";
import styles from "./IafDropdown.module.scss";

export function IafDropdown(props) {
  const classNameMap = {
    ["custom-select"]: styles["custom-select"],
    ['dropdown-component']: styles["dropdown-component"]
  };
  
  return (
    <div className={`${props.disabled ? styles["disabled-component"] : ''}`}>
      {props.showTitle && <div className={styles["select-title"]}>{props.title}</div>}
      <select name={props.name || props.title} value={props.value} disabled={props.disabled} className={`${styles["select-component"]} ${styles.select} ${classNameMap[props.className] || ''}`} onChange={props.onChange}>
        {props.data.map((option) =>
          // Check if the option has a nested group
          option.options ? (
            <optgroup key={option.label} label={option.label}>
              {option.options.map((nestedOption) => (
                <option key={nestedOption.value} value={nestedOption.value}>
                  {nestedOption.label}
                </option>
              ))}
            </optgroup>
          ) : (
            // If not, render a single option
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}
