
// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 17-04-23    HSK        PLAT-2727   Cutomizable tooltip component
//                                    Used in newtoolbar design
// 26-04-23    HSK        PLAT-2727   Using makeStyles instead of withStyles
// 09-06-23    HSK        PLAT-2800   Added functionality to close tooltip if submenu is open
// 09-06-23    HSK                    Used icon color prop to make button color dynamic
// 09-06-23    HSK                    Used conditional rendering to change style of tooltip      
// 20-06-23    HSK                    Cleaned code, Added sliderTooltip Class
// 20-06-23    HSK                    Modified tooltip to be used with all components
// 26-09-23    HSK                    Added height, background color for tooltip and arrow classes 
// 19-03-24    HSK        UI-123      Group instruments have a "group indicator" on the icon, and upon clicking, they should display a dropdown with other instruments that belong to the same group.
// -------------------------------------------------------------------------------------

/* IafTooltip properties
  src: button image src path
  iconClass: css for icons
  title: title for tooltip
  placement : position of tooltip
 */
  import React, { useState, useEffect } from "react";
  import Tooltip,{ tooltipClasses } from "@mui/material/Tooltip";
  import { styled } from "@mui/system";
  import styles from "./IafTooltip.module.scss";
  
  /* height and background color
  are added to resolve a CSS issue in production that
  could not be reproduced locally. */
  const TooltipClassEnum = {
    CUSTOMIZED: 'customizedTooltip',
    CLOSE: 'closeTooltip',
    SLIDER: 'sliderTooltip',
    VIEWER_2D: 'viewer2DTooltip'
  };
  
  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme, toolTipClass, size }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      ...(toolTipClass === TooltipClassEnum.CUSTOMIZED && {
        width: "100px",
        backgroundColor: "var(--head-bkg-color)",
        color: "#fff",
        textAlign: "center",
        fontSize: 12,
        padding: "0.262em",
        borderRadius: "0.262em",
        position: "absolute",
        top: "-10px",
        right: "-43px !important",
        zIndex: 7,
        height : "auto !important",
      }),
      ...(toolTipClass === TooltipClassEnum.CLOSE && {
        height : "auto !important",
        backgroundColor: "var(--head-bkg-color)",
      }),
      ...(toolTipClass === TooltipClassEnum.SLIDER && {
        width: "100px",
        backgroundColor: "var(--head-bkg-color)",
        color: "#fff",
        textAlign: "center",
        fontSize: 12,
        padding: "0.262em",
        borderRadius: "0.262em",
        zIndex: 7,
        height : "auto !important",
      }),
      ...(toolTipClass === TooltipClassEnum.VIEWER_2D && {
        backgroundColor: "var(--head-bkg-color)",
        fontSize: 12,
        maxWidth: '80px',
        height : "auto !important",
      }),
      ...(!Object.values(TooltipClassEnum).includes(toolTipClass) && {
        fontSize: 11,
        backgroundColor: "var(--head-bkg-color)",
        textAlign: "left",
        borderRight: "0px",
        ...(size && { right: size }),
        // maxHeight:"150px",
        height : "auto !important",
        maxWidth:'250px',
      }),
    },
    [`& .${tooltipClasses.arrow}`]: {
      backgroundColor: "transparent !important",
      color: "var(--head-bkg-color)"
    },
  }));
  
  function IafTooltip({ src, iconClass, title, placement, toolbarSize, open = true, iconColor, toolTipClass = null, children, alwaysOpen, isGroupedIcon = false }) {
    const size = toolbarSize === 'large' ? '30px' 
                  : toolbarSize === 'medium' ? '14px' 
                  : toolbarSize === 'small' ? '9px' 
                  : '0px';
    const [tooltipOpen, setTooltipOpen] = useState(false);
  
    useEffect(() => {
      if (!open) {
        setTooltipOpen(false);
      }
    }, [open]);
  
    return (
      <CustomTooltip
        title={title}
        open={typeof alwaysOpen !== 'undefined' ? alwaysOpen : tooltipOpen}
        disableHoverListener={!open}
        onClose={() => setTooltipOpen(false)}
        onOpen={() => setTooltipOpen(true)}
        toolTipClass={toolTipClass}
        size={size}
        placement={placement}
        arrow
      >{src ? (
          <div className={isGroupedIcon ? `${styles['toolbar-icon']} ${styles['grouped-icon']}` : styles['toolbar-icon']}>
            <img src={src} className={iconClass} style={{ '--icon-color': iconColor }} title="" />
          </div>
        ) : children}
      </CustomTooltip>
    );
  }
  export default IafTooltip;
  