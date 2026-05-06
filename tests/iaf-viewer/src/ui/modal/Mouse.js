import React from 'react'
import Item from './Item'
import styles from './Mouse.module.scss'
import Mouse1 from '../static/mouse1.png'
import Mouse2 from '../static/mouse2.png'
import Mouse3 from '../static/mouse3.png'
import Mouse4 from '../static/mouse4.png'

class Mouse extends React.Component{
    constructor(){
        super();
        this.state={
            mouse:[
                {
                    title:"TELEPORT",
                    url: <img src = {Mouse1} />,
                    desc:"Teleport to a Location by double clicking the LEFT MOUSE BUTTON"
                },
                {
                    title:"LOOK AROUND",
                    url: <img src = {Mouse2} />,
                    desc:"Look around by clicking and holding the LEFT MOUSE BUTTON"
                },
                {
                    title:"MOVE",
                    url: <img src = {Mouse3} />,
                    desc:"Move around by clicking  holding the RIGHT MOUSE BUTTON"
                },
                {
                    title:"TILT",
                    url: <img src = {Mouse4} />,
                    desc:"TILT the Camera using the SCROLL WHEEL"
                },
                
            ]
        };
    }
    render(){
        return (
            <div className={styles["mouse"]}>
                {this.state.mouse.map(item=>{
                    return (
                    <>
                        <Item item={item}/>
                    </>);
                })}
            </div>
        );
    }
}

export default Mouse;