// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 29-01-24    HSK        PLAT-4097   Add generic(low level) components IafInputNumber and IafInputPoint3D                         
// ------------------------------------------------------------------------------------- 

import React,{useEffect, useState} from "react";
import styles from './IafInputNumber.module.scss'

export function IafInputNumber (props) {

    return (
        <li className={styles["section-li"]}>
            <strong>{props.label} : </strong> <span>{props.value}</span>
        </li >
    );
}