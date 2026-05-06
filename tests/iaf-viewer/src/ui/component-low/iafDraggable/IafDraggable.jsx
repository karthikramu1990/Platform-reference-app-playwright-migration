import React, { forwardRef, useEffect, useState, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import Draggable from "react-draggable";
import Toolbar from "../IafToolbar/IafToolbar.jsx";
import { getToolbarButtons } from "../IafToolbar/IafToolbarData.js";
import styles from "./IafDraggable.module.scss";
import { WidgetAction, WidgetMode, WidgetPosition } from "../../../common/enums/widgets.js";
import { IafResourceUtils } from "../../../core/IafResourceUtils.js";

export const AlignmentEnum = {
  LEFT_TOP: 'LeftTop',
  LEFT_BOTTOM: 'LeftBottom',
  RIGHT_TOP: 'RightTop',
  RIGHT_BOTTOM: 'RightBottom',
};
const FOOTER_HEIGHT = 20;
const TOOLBAR_HEIGHT = 60;
const TOOLBAR_WIDTH = 94;

const IafDraggable = forwardRef((props, ref) => {
  const {
    containerId,
    onResize,
    onChange,
    buttonVisibility = true,
    options = {},
    properties = {},
    dependencies = [], // New property for dependencies
    onDependenciesLoaded, // Callback for when dependencies are loaded
  } = props;

  const [toggleMinMax, setToggleMinMax] = useState(WidgetAction.MINIMIZE);
  const [containerPosition, setContainerPosition] = useState({ x: 0, y: 0 });
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [bounds, setBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
  const footerHeight = 35;

  const { 
    width: defaultWidth = 312, 
    height: defaultHeight = 283, 
    showToolbar, 
    order, 
    mode, 
    visible, 
    splitPosition, 
    shouldDisablePointerEvents,
    alignment = AlignmentEnum.LEFT_TOP, // Use enum value as default
    margin = 0, // New margin prop with default value
    shouldEnableTransparency = false,
    opacity = 1.0,
    iafViewer
  } = properties;

  let buttons = null;
  if (buttonVisibility) {
    buttons = getToolbarButtons(buttonVisibility, handleWidgetAction, mode, options);
  }
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;
  // Calculate the initial position based on the alignment and margin
  useEffect(() => {
    const calculateInitialPosition = () => {
      let initialX = margin; // Start with the margin
      let initialY = margin; // Start with the margin

      const parentElement = document.getElementById(iafViewer.evmElementIdManager.getEvmElementUuidWidgetContainer());
      if (parentElement) {
        const rect = parentElement.getBoundingClientRect();

        switch (alignment) {
          case AlignmentEnum.LEFT_TOP:
            initialX = margin; // Margin from the left
            initialY = margin; // Margin from the top
            break;
          case AlignmentEnum.LEFT_BOTTOM:
            initialX = margin; // Margin from the left
            initialY = rect.height - defaultHeight - margin - footerHeight; // Margin from the bottom
            break;
          case AlignmentEnum.RIGHT_TOP:
            initialX = rect.width - defaultWidth - margin; // Margin from the right
            initialY = margin; // Margin from the top
            break;
          case AlignmentEnum.RIGHT_BOTTOM:
            initialX = rect.width - defaultWidth - margin; // Margin from the right
            initialY = rect.height - defaultHeight - margin - footerHeight; // Margin from the bottom
            break;
          default:
            break;
        }
      }

      setContainerPosition({ x: initialX, y: initialY });
    };

    // Recalculate position on window resize or when mode switches to DEFAULT
    const handleResizeOrModeChange = () => {
      if (mode === WidgetMode.DEFAULT) {
        calculateInitialPosition();
      }
    };

    // Listen to window resize and mode changes
    window.addEventListener("resize", handleResizeOrModeChange);

    // When switching back to DEFAULT, recalculate alignment
    if (mode === WidgetMode.DEFAULT) {
      handleResizeOrModeChange();
    }

    return () => window.removeEventListener("resize", handleResizeOrModeChange);
  }, [alignment, defaultWidth, defaultHeight, margin, mode]); // Added `mode` dependency

  useEffect(() => {
    if (mode === WidgetMode.DEFAULT) {
      setToolbarPosition({ x: 0, y: 0 });
    }
    // ATK: When mode changes via props (not toolbar buttons), reset positions like handleWidgetAction does
    if (mode && mode !== WidgetMode.DEFAULT) {
      setContainerPosition({ x: 0, y: 0 });
      setToolbarPosition({ x: 0, y: 0 });
    }
    onResizeRef.current();
  }, [mode]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Load dependencies before the widget is instantiated
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        await Promise.all(dependencies.map(dep => IafResourceUtils.loadJs(dep)));
        if (onDependenciesLoaded) {
          onDependenciesLoaded(); // Call the callback after loading
        }
      } catch (error) {
        console.error(`Failed to load dependencies: ${error.message}`);
      }
    };

    if (dependencies.length > 0) {
      loadDependencies();
    }
  }, [dependencies, onDependenciesLoaded]); // Dependency array includes dependencies and callback

  const handleDrag = (e, ui) => {
    if (mode === WidgetMode.DEFAULT) {
      setContainerPosition({ x: ui.x, y: ui.y });
    } else {
      setToolbarPosition({ x: ui.x, y: ui.y });
    }
  };

  const handleDragEnd = () => {
    if (mode !== WidgetMode.DEFAULT) {
      setToolbarPosition({ x: toolbarPosition.x, y: toolbarPosition.y });
    }
  };

  function handleWidgetAction(action, updatedMode) {
    onChange(action, updatedMode);
    if (updatedMode) {
      if (updatedMode !== WidgetMode.DEFAULT) {
        setContainerPosition({ x: 0, y: 0 });
        setToolbarPosition({ x: 0, y: 0 });
      }
    }
    setToggleMinMax(prevState =>
      prevState === WidgetAction.MINIMIZE ? WidgetAction.MAXIMIZE : WidgetAction.MINIMIZE
    );
  };

  useImperativeHandle(ref, () => ({
    mode: mode,
    toggleMinMax,
    handleWidgetAction
  }));

  const calculateBounds = () => {
    const parentElement = document.getElementById(iafViewer.evmElementIdManager.getEvmElementUuidWebviewerContainer());
    if (!parentElement) return;

    const rect = parentElement.getBoundingClientRect();
    let actualWidth = rect.width;
    let actualHeight = rect.height;
    let containerWidth = defaultWidth + TOOLBAR_WIDTH;
    let containerHeight = defaultHeight;

    if (mode === WidgetMode.SPLIT || mode === WidgetMode.FULLSCREEN) {
      const child = document.getElementById(containerId);
      actualWidth = child?.offsetWidth ?? rect.width;
      actualHeight = (child?.offsetHeight - FOOTER_HEIGHT) ?? rect.height;
      containerHeight = TOOLBAR_HEIGHT;
      if (mode === WidgetMode.SPLIT) {
        containerWidth = defaultWidth;
      }
    }

    setBounds({
      left: 0,
      top: 0,
      right: actualWidth - containerWidth,
      bottom: actualHeight - containerHeight,
    });
  };

  useEffect(() => {
    calculateBounds();
    window.addEventListener("resize", calculateBounds);
    return () => window.removeEventListener("resize", calculateBounds);
  }, [defaultWidth, defaultHeight, order, mode]);

  return (
    <Draggable
      handle="#iconDragArea"
      position={containerPosition}
      onDrag={mode === WidgetMode.DEFAULT ? handleDrag : null}
      onStop={mode === WidgetMode.DEFAULT ? handleDragEnd : null}
      disabled={mode !== WidgetMode.DEFAULT}
      bounds={bounds}
    >
      <div
        className={`${styles["widget-container"]} ${styles[mode]}`}
        ref={ref}
        style={{
          display: visible ? "inline-block" : "none",
          pointerEvents: shouldDisablePointerEvents ? "none" : "auto",
          opacity: Math.min(1., Math.max(0.0, opacity)),
          backgroundColor: shouldEnableTransparency ? "transparent" : "initial", // Apply transparent background if enabled
          ...(mode === WidgetMode.DEFAULT && { width: `${defaultWidth}px`}),
          ...(mode === WidgetMode.DEFAULT && { height: `${defaultHeight}px`}),
          ...(mode === WidgetMode.SPLIT && { left: splitPosition === WidgetPosition.LEFT ? "0" : '50%' })
        }}
      >
        {showToolbar && buttons && (
          <Toolbar
            width={defaultWidth}
            buttons={buttons}
            position={toolbarPosition}
            onDrag={mode !== WidgetMode.DEFAULT ? handleDrag : null}
            onStop={mode !== WidgetMode.DEFAULT ? handleDragEnd : null}
            disabled={mode === WidgetMode.DEFAULT}
            bounds={bounds}
          />
        )}
        <div id={containerId} className={styles["canvas-container"]}>
          {props.children}
        </div>
      </div>
    </Draggable>
  );
});

IafDraggable.propTypes = {
  containerId: PropTypes.string.isRequired,
  onResize: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  buttonVisibility: PropTypes.bool,
  options: PropTypes.object,
  properties: PropTypes.shape({
    mode: PropTypes.string.isRequired,
    showToolbar: PropTypes.bool,
    visible: PropTypes.bool,
    splitPosition: PropTypes.string,
    order: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    alignment: PropTypes.oneOf(Object.values(AlignmentEnum)), // Use enum values for validation
    margin: PropTypes.number, // New margin prop
    shouldEnableTransparency: PropTypes.bool,
  }),
  dependencies: PropTypes.arrayOf(PropTypes.string), // Array of dependencies to load
  onDependenciesLoaded: PropTypes.func, // Callback for when dependencies are loaded
};

export default IafDraggable;
