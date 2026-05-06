// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 17-04-23    HSK        PLAT-2738   Created. Empty.
// 31-05-23    HSK        PLAT-2890   Updated styles influenced by Revamped UX/UI Walk Mode
// 30-08-23    HSK                    Added height as extra props to IafButton
// 20-11-23    HSK        PLAT-2347   Used disabled prop,opacity style to disable button
// -------------------------------------------------------------------------------------
import React from "react";
import style from "./IafButton.module.scss";
import IafTooltip from "../Iaftooltip/IafTooltip.jsx";
export function IafButton(props) {
  const { backgroundColor, textColor, width, height, disabled, variant } = props;

  // Base styles (original default)
  let styles = {
    background: backgroundColor,
    border: `1px solid ${backgroundColor}`,
    width:width?width:'100px',
    height:height?height:'',
    color: textColor
  };

  // Variant overrides (only when explicitly provided)
  if (variant === "primary") {
    styles = {
      ...styles,
      background: "var(--app-accent-color)",
      border: "1px solid var(--app-accent-color)",
      color: "#ffffff"
    };
  } else if (variant === "secondary") {
    styles = {
      ...styles,
      background: "#ffffff",
      border: "1px solid #b8b8b8",
      color: "var(--head-bkg-color)"
    };
  }

  const classNameMap = {
    ["button-component"]: style["button-component"],
    ["button-text"]: style["button-text"],
  };
  const dynamicClass = classNameMap[props.className] || '';
    // Variant class from SCSS module
  const variantClass = variant ? style[variant] : "";

  return (
    <>
    {props.tooltipTitle ?(
    <IafTooltip title={props.tooltipTitle} placement={props.tooltipPlacement} toolTipClass={props.tooltipClass}>
      <button disabled={disabled} className={`${style["button-component"]} ${dynamicClass} ${variantClass}`}   style={styles} onClick={props.onClick}>
          <p className={style["button-text"]} style={{color: styles.color, opacity: disabled ? 0.5 : 1 }}>{props.title}</p>
      </button>
    </IafTooltip>):(
      <button disabled={disabled} className={`${style["button-component"]} ${dynamicClass} ${variantClass}`}   style={styles} onClick={props.onClick}>
        <p className={style["button-text"]} style={{color: styles.color, opacity: disabled ? 0.5 : 1}}>{props.title}</p>
      </button>
    )}
    </>
  );
}
