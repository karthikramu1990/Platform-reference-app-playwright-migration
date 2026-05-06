// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 06-05-23    ATK        PLAT-2709   New UX UI Foundation Project
//                                    Code Restructuring.
// 10-05-23    ATK        PLAT-2813   Added clearSubMenus, being called from mouseEvent
// 01-09-23   HSK                     Modified submenu onClick code for passing callback function
// 13-05-24    HSK        PLAT-4579   Left view should not be default view in view tool bar.
// -------------------------------------------------------------------------------------

/* --------- To do -----------

- Tooltip should hide if submenus are active as it overrides the submenu options
- Consider moving viewSubMenu files to components directory

------------------------------*/


import React from "react";
import styles from './viewerSubMenu.module.scss'
import CheckIcon from "@mui/icons-material/Check";
export const clearSubMenus = () => {
    let subMenuList =  document.getElementsByClassName("viewer-toolbar-submenu");
    for(let index=0;index< subMenuList.length;index++)
    if(subMenuList[index].style.display !== 'none')
      subMenuList[index].style.display = 'none'
}

const ViewerSubMenu = ({
    submenuFlag,
    showSubmenu,
    mainIcon,
    subMenus,
    posTop,
    toolbarSize,
    isIpaDev,
    children
  }) => {
    // console.log(window.innerHeight, posTop, "window.innerHeight")
    const height = window.innerHeight - parseInt(posTop, 10) - 115
    return (
      <div
        className={styles["viewer-toolbar-submenu"]}
        style={{
          display: submenuFlag ? "flex" : "none",
          top: posTop,
          ...(height && { height: `calc(100% - ${posTop} - 35px)` }),
          right: toolbarSize === "large" ? 94
                : toolbarSize === "medium"? 64 
                : toolbarSize === "small"? 48 
                : 0,
        }}
      >
        {/* <div className='viewer-toolbar-btn' onClick={showSubmenu}>
          <div className='toolbar-icon'><img src={mainIcon.icon.img} className={styles["filter-gray"/></div>
          <div className={styles["toolbar-txt">{mainIcon.title}</div>
        </div> */}
        {subMenus.map((submenu, idx) => {
          if(!submenu.displayDisabled){
          if (submenu.disabled) {
            return (
              <div
                className={styles["viewer-submenu-icon"]}
                key={idx} /*onClick={submenu.onClick}*/
              >
                <img
                  src={submenu.icon.img}
                  className={styles["submenu-img"]}
                />
                {/* <span className={styles["tooltip-txt">{submenu.icon.tooltip}</span> */}
              </div>
            );
          } else if (mainIcon.defaultCheck && submenu.icon.id === mainIcon.icon.id)
            return (
              <div
                className={styles["viewer-submenu-icon"]}
                key={idx}
                onClick={() => {
                  if (typeof submenu.callback === 'function') {
                    submenu.onClick(submenu.callback);
                  } else {
                    submenu.onClick();
                  }
                }}
              >
                <div className={styles["check-icon-wrapper"]}><CheckIcon style={{ color: "white",fontSize:"0.9rem" }} className={styles["check-icon"]}/></div>
                <img src={submenu.icon.img} className={styles["submenu-img"]} />
                <span className={styles["tooltip-txt"]}>{submenu.icon.content}</span>
              </div>
            );
          else
            return (
              <div
                className={styles["viewer-submenu-icon"]}
                key={idx}
                onClick={() => {
                  if (typeof submenu.callback === 'function') {
                    submenu.onClick(submenu.callback);
                  } else {
                    submenu.onClick();
                  }
                }}
              >
                <div className={styles["check-icon-wrapper"]}></div>
                <img src={submenu.icon.img} className={styles["submenu-img"]} />
                <span className={styles["tooltip-txt"]}>{submenu.icon.content}</span>
              </div>
            );
          }
        })}
       {children && children}
      </div>
    );
};

export default ViewerSubMenu;