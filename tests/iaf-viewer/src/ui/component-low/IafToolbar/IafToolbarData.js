import iconDragArea from "../../img/icon-dragArea.svg";
import iconClose from "../../img/icon-close.svg";
import iconExpand from "../../img/icon-expand.svg";
import iconZoomIn from "../../img/icon-zoom-in.svg";
import iconZoomOut from "../../img/icon-zoom-out.svg";
import iconSplitScreen from "../../img/icon-splitSCreen.svg";

export const ToolbarIcons = {
  iconDragArea: {
    img: iconDragArea,
    tooltip: "Drag Area",
    id: "iconDragArea",
  },
  iconClose: {
    img: iconClose,
    tooltip: "Close Window",
    id: "iconClose",
  },
  iconExpand: {
    img: iconExpand,
    tooltip: "Full Screen",
    id: "iconExpand",
  },
  iconSplitScreen: {
    img: iconSplitScreen,
    tooltip: "Half Screen",
    id: "iconSplitScreen",
  },
  iconZoomOut: {
    img: iconZoomOut,
    tooltip: "Zoom Out",
    id: "iconZoomOut",
  },
  iconZoomIn: {
    img: iconZoomIn,
    tooltip: "Zoom In",
    id: "iconZoomIn",
  },
};

export const getToolbarButtons = (buttonVisibility, onHandleClick, mode, options) => {
  return [
    {
      type: "dropdown",
      ...buttonVisibility.showDropDownButton ? { props:{ ...options.dropDown,
        title: "Sheet Names",
        className: "custom-select"
      }} : {},
      visible: buttonVisibility.showDropDownButton || false,
      onClick: (e) => {
        e.preventDefault();
      },
      icon: ToolbarIcons.iconDragArea,
    },
    {
      visible: buttonVisibility.showMaximizeButton || false,
      onClick: () => onHandleClick("maximize", mode === "fullscreen" ? "default" : "fullscreen"),
      icon: ToolbarIcons.iconExpand,
      isActive: mode === "fullscreen",
    },
    {
      visible: buttonVisibility.showMinimizeButton || false,
      onClick: () => onHandleClick("minimize", mode === "split" ? "default" : "split"),
      icon: ToolbarIcons.iconSplitScreen,
      isActive: mode === "split",
    },
    {
      visible: buttonVisibility.showCloseButton || false,
      onClick: () => onHandleClick("close", mode),
      icon: ToolbarIcons.iconClose,
    },
    {
      visible: buttonVisibility.showZoomInButton || false,
      onClick: () => onHandleClick("zoomin", mode),
      icon: ToolbarIcons.iconZoomIn,
    },
    {
      visible: buttonVisibility.showZoomOutButton || false,
      onClick: () => onHandleClick("zoomout", mode),
      icon: ToolbarIcons.iconZoomOut,
    },
    {
      visible: true,
      onClick: (e) => {
        e.preventDefault();
      },
      icon: ToolbarIcons.iconDragArea,
    }
  ];
};
