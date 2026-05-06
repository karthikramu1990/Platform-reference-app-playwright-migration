/*
// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 16-05-23    HSK        PLAT-2813   Revamed IafViewer Components                                     
// 24-05-23    HSK        PLAT-2730   Revamed IafViewer Panels - Cutting Planes
// 05-06-23    HSK                    Added mechanism for close button
// 09-06-23    HSK                    Used tooltip for close button
// 28-06-23    HSK                    Revamped Panel Show/Hide functionality
// 01-04-24    HSK        PLAT-4428   Implemented when one child is preset in panel and if we hit close button it will close and not minimize.
// -------------------------------------------------------------------------------------
*/

import React, { useState, useEffect, isValidElement, cloneElement } from "react";
import styles from "./IafHeading.module.scss";
import CloseIcon from "../../img/icon-close.svg";
import IafTooltip from "../Iaftooltip/IafTooltip.jsx";

export function IafHeading(props) {
  const toggleListItem = () => {
    props.showContentMethod(props.id);
  };

  const closePanel = () => {
    if (props.showContent && props.panelCount > 1) {
      props.showContentMethod(props.id);
    } else {
      props.onClose();
    }
  };

  const recursivelyDisableChildren = (children) => {
    return React.Children.map(children, (child) => {
      if (!isValidElement(child)) return child;

      const propsToPass = { ...child.props };

      if ('disabled' in child.props || typeof child.type === 'string') {
        propsToPass.disabled = true;
      }

      if (child.props.children) {
        propsToPass.children = recursivelyDisableChildren(child.props.children);
      }

      return cloneElement(child, propsToPass);
    });
  };

  const content = props.canAccess === false
    ? recursivelyDisableChildren(props.children)
    : props.children;

  return (
    <div className={styles["list-item"]} style={{ '--bg-color': props.color }}>
      <div className={styles["list-item-header-box"]} onClick={toggleListItem}>
        <div className={styles["list-item-title"]}>{props.title}</div>
        <div className={styles["list-item-close"]} onClick={closePanel}>
          <IafTooltip
            src={CloseIcon}
            title={props.panelCount === 1 ? 'Close' : props.showContent ? 'Minimize' : 'Close'}
            placement="bottom"
            onActiveIconColor="#ffffff"
            toolTipClass='closeTooltip'
          />
        </div>
      </div>
      {props.showContent && <>{content}</>}
    </div>
  );
}

IafHeading.defaultProps = {
  canAccess: true,
};