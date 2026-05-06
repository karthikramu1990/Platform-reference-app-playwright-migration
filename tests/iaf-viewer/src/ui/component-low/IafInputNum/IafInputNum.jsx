import React from "react";
import styles from './IafInputNum.module.scss'

export function IafInputNum(props) {
  const min = props.min !== undefined ? props.min : -10000;
  const max = props.max !== undefined ? props.max : 10000;
  const [inputValue, setInputValue] = React.useState(
    props.value !== undefined ? String(props.value) : ""
  );

  // Update local state when props.value changes
  React.useEffect(() => {
    setInputValue(props.value !== undefined ? String(props.value) : "");
  }, [props.value]);

  // Allow only numbers and minus sign
  const handleChange = (e) => {
    const val = e.target.value;
    // Regex: optional minus, digits, optional decimal point and digits (or empty string)
    if (/^-?\d*\.?\d*$/.test(val)) {
      setInputValue(val);
    }
    // Regex: optional minus, then digits (or empty string)
    if (/^-?\d*$/.test(val)) {
      setInputValue(val);
    }
  };

  // Handler for Enter key (call onChange with current value)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && typeof props.onChange === "function") {
      let num = Number(inputValue);
      if (inputValue === "" || isNaN(num)) return;
      // Clamp to min/max
      num = Math.max(min, Math.min(max, num));
      props.onChange({
        ...e,
        target: { ...e.target, value: num }
      });
      setInputValue(String(num)); // update input to clamped value
    }
  };

  return (
    <div className={styles["section-li"]}>
      <p style={{ color: "#dcdcdc" }}>{props.label}</p>
      <input
        id={props.inputId}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        inputMode="numeric"
        pattern="^-?\d*$"
        min={min}
        max={max}
      />
    </div>
  );
}
