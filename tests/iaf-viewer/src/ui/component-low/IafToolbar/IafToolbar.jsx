import React, { useRef } from "react";
import PropTypes from "prop-types";
import Draggable from "react-draggable";
import { IafDropdown } from "../../component-low/iafDropdown/IafDropdown.jsx"
import IafTooltip from "../Iaftooltip/IafTooltip.jsx";
import styles from './IafToolbar.module.scss';

const Toolbar = ({ buttons, position, onDrag, onStop, disabled, width, bounds }) => {
  const toolbarRef = useRef(null);

  return (
    <Draggable
      nodeRef={toolbarRef}
      // handle="#iconDragArea"
      position={position}
      onDrag={onDrag}
      onStop={onStop}
      disabled={disabled}
      bounds={bounds}
    >
      <div id="toolbar" ref={toolbarRef} className={`${styles["toolbar-controls"]} ${styles["toolbar"]}`}
          style={{
            width: width
          }}>
        <div>
          {buttons.filter(button => button.type === "dropdown" && button.visible).map((button, index) => (
            <IafDropdown
              key={index}
              disabled={!button.props.enableSheetSwitch}
              title={button.props.title}
              className={button.props.className}
              onChange={button.props.onSheetChange}
              data={button.props.sheetNames.map((item) => ({ label: item, value: item }))}
              value={button.props.sheetNames[button.props.sheetIdx]}
            />
          ))}
        </div>
        <div className={styles["toolbar-buttons"]}>
          {buttons.map((button, index) => {
            return button.visible && button.type !== "dropdown" ? (
              <div
                key={index}
                className={`${styles['toolbar-button']} ${button.isActive ? styles['active'] : ''}`}
                onClick={button.onClick}
                id={button.icon.id}
              >
                <IafTooltip
                  src={button.icon.img}
                  iconClass={button.isActive ? styles["filter-pink"] : ""}
                  title={button.icon.tooltip}
                  placement={button.placement || "bottom"}
                  tooltipclass="CustomTooltip"
                />
              </div>
            ) : null
          })}
        </div>
      </div>
    </Draggable>
  );
};

Toolbar.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      visible: PropTypes.bool.isRequired,
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.shape({
        img: PropTypes.string.isRequired,
        tooltip: PropTypes.string.isRequired,
      }).isRequired,
      isActive: PropTypes.bool,
    })
  ).isRequired,
  position: PropTypes.object.isRequired,
  onDrag: PropTypes.func,
  onStop: PropTypes.func,
  disabled: PropTypes.bool,
};

Toolbar.defaultProps = {
  onDrag: null,
  onStop: null,
  disabled: false,
};

export default Toolbar;
