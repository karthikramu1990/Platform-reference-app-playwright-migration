// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 29-01-24    HSK        PLAT-4097   Add generic(low level) components IafInputNumber and IafInputPoint3D                         
// ------------------------------------------------------------------------------------- 

import React,{useEffect, useState} from "react";
import styles from './IafInputPoint3d.module.scss'

export function IafInputPoint3d (props) {

    // const [point3d,setPoint3d] = useState(props.point3d);

    return (
        <>
          <strong style={{color : "#dcdcdc"}}>{props.title} : </strong>
          <div className={styles["camera-inputs"]}>
            <div className={styles["position-box"]}>
                <p style={{color: "#dcdcdc"}}>x :</p> 
                <input
                    id="x"
                    type="text"
                    value={props.value?.x}
                    onChange={(e) =>{
                        e.persist(); // Persist the synthetic event
                        props.onChange(e,'x')
                    }}
                />
            </div>
            <div className={styles["position-box"]}>
                <p style={{color: "#dcdcdc"}}>y :</p> 
                <input
                    id="y"
                    type="text"
                    value={props.value?.y}
                    onChange={(e) =>{
                        e.persist(); // Persist the synthetic event
                        props.onChange(e,'y')
                    }}
                />
            </div>
            <div className={styles["position-box"]}>
                <p style={{color: "#dcdcdc"}}>z :</p> 
                <input
                    id="z"
                    type="text"
                    value={props.value?.z}
                    onChange={(e) =>{
                        e.persist(); // Persist the synthetic event
                        props.onChange(e,'z')
                    }}
                />
            </div>
          </div>  
          </>
    );
}