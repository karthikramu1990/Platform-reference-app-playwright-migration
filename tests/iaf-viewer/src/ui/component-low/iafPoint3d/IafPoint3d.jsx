// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 29-01-24    HSK        PLAT-4097   Add generic(low level) components IafInputNumber and IafInputPoint3D and IafPoint3D                        
//

import React,{useState} from "react";
import styles from './IafPoint3d.module.scss'

export function IafPoint3d (props) {

    return (
        <li className={styles["section-li"]}>
            <strong>{props.title} : </strong>
            <ul className={styles["stats-ul"]}>
            <li> X : {props.point3d.x}</li>
            <li> Y : {props.point3d.y}</li>
            <li> Z : {props.point3d.z}</li>
            </ul>
        </li>
    );
}