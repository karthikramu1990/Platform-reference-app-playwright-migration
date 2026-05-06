/*
// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 16-05-23    HSK        PLAT-2813   Revamed IafViewer Components                                     
// 24-05-23    HSK        PLAT-2730   Revamed IafViewer Panels - Cutting Planes
// 25-09-23    HSK                    Used value from props for minimized state
// -------------------------------------------------------------------------------------
*/

import React, { useState, isValidElement, cloneElement, useEffect } from "react";
import styles from './IafSubHeader.module.scss';

export function IafSubHeader(props) {
  // Support controlled mode: if onToggle is provided, use controlled state
  const isControlled = props.onToggle !== undefined;
  const [internalMinimized, setInternalMinimized] = useState(props.minimized ?? true);
  
  // Sync internal state with props when not controlled
  useEffect(() => {
    if (!isControlled && props.minimized !== undefined) {
      setInternalMinimized(props.minimized);
    }
  }, [props.minimized, isControlled]);
  
  const minimized = isControlled ? (props.minimized ?? true) : internalMinimized;

  const toggleListItemContent = () => {
    if (isControlled) {
      // Controlled mode: call parent's callback
      props.onToggle(!minimized);
    } else {
      // Uncontrolled mode: update internal state
      setInternalMinimized(!minimized);
    }
  };

  const recursivelyDisableChildren = (children) => {
    return React.Children.map(children, (child) => {
      if (!isValidElement(child)) return child;

      const propsToPass = {
        ...child.props,
        disabled: true
      };

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
    <>
      {props.title && (
        <div className={styles["list-item-sub-header-box"]} onClick={toggleListItemContent}>
          <div className={styles["list-item-sub-title-box"]}>
            <div className={styles["list-item-sub-title"]}>{props.title}</div>
          </div>
        </div>
      )}
      {(!minimized || !props.title) && (
        <div
          className={styles["list-item-content"]}
          style={!props.title ? { marginTop: "15px" } : null}
        >
          <div className={styles["list-item-content-box"]}>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

IafSubHeader.defaultProps = {
  canAccess: true,
};