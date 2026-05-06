
// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 16-05-23    HSK        PLAT-2813   Revamed IafViewer Components                                     
// 24-05-23    HSK        PLAT-2730   Revamed IafViewer Panels - Cutting Planes
// 20-06-23    HSK                    Added IafTooltip on slider thumb
// 21-06-23    HSK                    Modified implrmrntation so that tooltip can move along with slider thumb
// 04-07-23    ATK                    Performance: Disable IafTooltip for Sliders. To be considered for 4.2
// 05-07-23    ATK                    Introduced new props as label to show label values
// 10-07-23    HSK                    Made ValueLabelComponent independent to resolve re-rendering issue
// 10-07-23    HSK                    Added mechanism of mouseenter and mouseleave
// 14-08-24    ATK                    Updated debouncedOnChange in order to not wait for mouse up to finish rendering
// -------------------------------------------------------------------------------------

import React, { useState
  ,useEffect
  // ,useCallback 
} from "react";
import Slider from "@mui/material/Slider";
// import debounce from 'lodash-es/debounce';
import styles from "./IafSlider.module.scss";
import IafTooltip from "../Iaftooltip/IafTooltip.jsx";
import { IafTextField } from "../../component-low/iafTextField/IafTextField.jsx";
import IafUtils from "../../../core/IafUtils.js";

const ValueLabelComponent = (props) => {
  const { children, open, tooltipFlag,isMouseOnSlider,tooltipText, toolTipClass} = props;
  return (
    <IafTooltip
      title={tooltipText} // Add your custom text here
      placement={toolTipClass} // Set the tooltip placement (e.g., top, bottom, left, right)
      toolTipClass="sliderTooltip" // Use the desired tooltip class (e.g., customizedTooltip, closeTooltip, sliderTooltip)
      alwaysOpen={open && tooltipFlag && isMouseOnSlider}
    >
      {children}
    </IafTooltip>
  );
};


// const useDebouncedCallback = (callback, delay) => {
//     return useCallback(debounce(callback, delay), [callback, delay]);
// };

export function IafSlider(props) {
  const { allowEditing = true, showLabel = true, labelDecimalPlaces=2, label } = props;
  const [sliderValue, setSliderValue] = useState(() => {
    const initialValue = parseFloat(props.value);
    return !isNaN(initialValue) ? parseFloat(initialValue.toFixed(labelDecimalPlaces)) : props.min;
  });
  const [tooltipFlag,setToolTipFlag] = useState(true);
  const [isMouseOnSlider,setIsMouseOnSlider] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(
    sliderValue !== undefined ? sliderValue : props.min
  );
  const [lastValidValue, setLastValidValue] = useState(
    sliderValue !== undefined ? sliderValue : props.min
  );
  useEffect(() => {
     validateAndSetValue(props.value);
  }, [props.value]);

  // Adjust the delay as needed
  const debouncedOnChange = (event, newValue, name) => {
    if (props.onChange) {
        IafUtils.devToolsIaf && console.log('IafSlider.debouncedOnChange', 'skipping');
        timeoutId && clearTimeout(timeoutId);
        const _timeoutId = setTimeout(() => {
          IafUtils.devToolsIaf && console.log('IafSlider.debouncedOnChange', 'executing');
          props.onChange(event, newValue, name);
          clearTimeout(timeoutId);
          setTimeoutId(null);
        }, 50);
        setTimeoutId(_timeoutId);
    }
  };
  const handleSliderChange = (event,newValue) => {
    setToolTipFlag(false)
    validateAndSetValue(newValue);
    debouncedOnChange(event, newValue, props.name);    
  };

  // This called after onmouseup event fired.
  const handleTooltipState = (event, newValue)=>{
    setToolTipFlag(true);
  }

  const handleMouseEnter = () => {
    setIsMouseOnSlider(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOnSlider(false);
  };

  // Handle label click to toggle the input box
  const handleLabelClick = () => {
    if(!allowEditing) return
    setIsEditing(true);
    setInputValue(sliderValue);
  };

  // Handle input change and submit on Enter
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  
  const validateAndSetValue = (value) => {
    if (value === "") {
      setInputValue(""); // Allow clearing, but do not change the last valid value
      return;
    }
    let numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      numValue = parseFloat(numValue.toFixed(labelDecimalPlaces)); // Ensure decimal places
      numValue = Math.max(props.min, Math.min(props.max, numValue)); // Apply min/max
      setInputValue(numValue); // Update input value.
      setLastValidValue(numValue); // Store last valid input value.
      setSliderValue(numValue); // Update slider state.
    } else {
      setInputValue(lastValidValue !== undefined ? lastValidValue : props.min); // Restore last valid value or fallback to min
    }
  };

  const handleInputConfirm = (event) => {
     // Handle inputbox Enter or Blur event both.
    if (event.type === "keydown" && event.key !== "Enter") return;
    const newValue = parseFloat(inputValue);
    if (!isNaN(newValue)) {
      validateAndSetValue(newValue);
      debouncedOnChange(event, newValue, props.name);
    }
    setIsEditing(false);
  };

  const sliderElement = () => {
   return <div>
        <div className={props.disabled ? `${styles["slider-title-box"]} ${styles["slider-disabled"]}` : styles["slider-title-box"]}>
          <div className={styles["slider-title"]}>{props.title}</div>
          {!isEditing && showLabel && (
            <div className={props.disabled ? `${styles["range-value-box"]} ${styles["disabled-component"]}` : styles["range-value-box"]}
                 onClick={handleLabelClick}>
              <div className={styles["range-value"]}>{label !== undefined ? label : sliderValue}</div>
            </div>
          )}
        </div>
        <div  className={props.disabled ? `${styles["slider-bar-box"]} ${styles["disabled-component"]}` : styles["slider-bar-box"]} onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
          {allowEditing && isEditing ? <IafTextField
              type="number"
              width={"100%"}
              height={"35px"}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputConfirm}
              onBlur={handleInputConfirm}
              step={props.step || 0.01}
              autoFocus
            /> :
            <Slider
            disabled={props.disabled}
            value={sliderValue}
            min={props.min}
            max={props.max}
            name={props.name}
            valueLabelDisplay="auto"
            slots={{
              valueLabel:(sliderProps) => (
                <ValueLabelComponent tooltipFlag={tooltipFlag} tooltipText={props.tooltipText} toolTipClass={props.toolTipClass} isMouseOnSlider={isMouseOnSlider} {...sliderProps} />
              )}}
            onChange={handleSliderChange}
            step={props.step || 0.01}
            onChangeCommitted={handleTooltipState}
          />}
        </div>
      </div>
  }

  return (
    <div className={styles["slider-component"]}>
    <div className={styles["slider-component-box"]}>
      {props.disabled ? <IafTooltip
          title={props.tooltipText}
          placement={props.tooltipPlacement || "bottom"}
          open={!!props.tooltipText}
          toolTipClass={props.toolTipClass} >
          {sliderElement()}
        </IafTooltip> : 
          sliderElement()}
      </div>
    </div>
  );
}
