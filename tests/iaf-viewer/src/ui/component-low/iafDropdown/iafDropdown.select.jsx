
/*
// -------------------------------------------------------------------------------------
// Date           Author     Referene    Comments
// 20-Aug-2025    RRP        PLAT-1069   Revamed iafDropdown to use react-select
// -------------------------------------------------------------------------------------
*/

import React from "react";
import Select from "react-select";
import styles from "./iafDropdown.select.module.scss";

export function IafDropdownSelect(props) {
    // Filter out placeholder options
    const options = props.data.filter(item => item.value !== '').map(item => ({
        value: item.value,
        label: item.label
    }));

    // Find the selected option
    const selectedOption = options.find(option => option.value === props.value);

    const handleChange = (selectedOption) => {
        if (props.onChange) {
            const event = { target: { value: selectedOption ? selectedOption.value : '' } };
            props.onChange(event);
        }
    };

    return (
        <div className={props.disabled ? styles["iaf-dropdown-disabled"] : ""}>
            {props.showTitle && <div className={styles["iaf-dropdown-title"]}>{props.title}</div>}
            <div className={props.className || ""}>
                <Select
                    value={selectedOption}
                    onChange={handleChange}
                    options={options}
                    placeholder="Choose an option"
                    isDisabled={props.disabled}
                    isSearchable={false}
                    menuPlacement="auto"
                    classNamePrefix="iaf-select"
                />
            </div>
        </div>
    );
}
