import React, {useEffect, useState} from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled TextField component
const StyledTextField = styled(TextField)(({ width, height, color, backgroundColor }) => ({
  '& .MuiInputBase-input': {
    color: color || 'white',
    padding: '4px 8px',
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: '#666',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#FF5722',
  },
  '& .MuiInput-underline:hover:before': {
    borderBottomColor: '#888',
  },
  backgroundColor: backgroundColor || 'transparent',
  width: width || 'auto', 
  height: height || 'auto'
}));

export const IafTextField = ({
  type,
  name,
  placeHolder,
  value,
  onChange,
  onKeyDown,
  onBlur,
  onKeyUp,
  width,
  height,
  backgroundColor,
  color,
  autoFocus,
  min, 
  max,
  step  
}) => {
  const [inputValue, setInputValue] = useState(value);
  
  useEffect(() => {
    setInputValue(value); // Reset input value when name or value changes
  }, [name, value]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    if (type === "number") {
      const numValue = Number(newValue);
      if (newValue === "" || (!isNaN(numValue) && (min == null || numValue >= min) && (max == null || numValue <= max))) {
        setInputValue(newValue);
        onChange && onChange(event);
      }
    } else {
      setInputValue(newValue);
      onChange && onChange(event);
    }
  };

  const handleInputBlur = (event) => {
    if (type === "number") {
      const newValue = parseFloat(inputValue);
      if (newValue < min) {
        setInputValue(min);
        onChange({ target: { value: min } });
      } else if (newValue > max) {
        setInputValue(max);
        onChange({ target: { value: max } });
      } else {
        setInputValue(inputValue);
      }
    }
    onBlur && onBlur(event);
  };

  return (
    <StyledTextField
      name={name}
      type={type}
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onBlur={handleInputBlur}
      width={width}
      height={height}
      backgroundColor={backgroundColor}
      color={color}
      placeholder={placeHolder}
      inputProps={{
        min, 
        max ,
        step
      }}
      autoFocus={autoFocus}
    />
  );
};
