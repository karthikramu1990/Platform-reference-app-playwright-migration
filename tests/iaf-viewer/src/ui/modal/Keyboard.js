import React from 'react'
import styles from './Keyboard.module.scss'
import Item from './Item'
import Key1 from '../static/key1.png';
import Key2 from '../static/key2.png';
import Key3 from '../static/key3.png';
import Key4 from '../static/key4.png';

class Keyboard extends React.Component{
    constructor(){
        super();
        this.state={
            keyboard:[
                {
                    title:"WALK",
                    url: <img src = {Key1} style = {{width: '94%'}} />,
                    desc:"Walk around using WASD or the Arrow key on the Keyboard"
                },
                {
                    title:"RUN",
                    url: <img src = {Key2} style = {{width: '94%'}} />,
                    desc:"Hold the Shift key and along with WASD or the arrow keys to run"
                },
                {
                    title:"GO UP AND DOWN",
                    url: <img src = {Key3} style = {{width: '94%'}} />,
                    desc:"Travell vertically UP and DOWN by holding Q or E key."
                },
                {
                    title:"ADJUST SPEED",
                    url: <img src = {Key4} style = {{width: '94%'}} />,
                    desc:"Use PLUS and MINUS keys on your keyboard to adjust the base movement"
                },
                
            ]
        };
    }
    render(){
        return (
            <div className={styles["keyboard"]}>
                {this.state.keyboard.map(item=>{
                    return (
                    <>
                        <Item item={item}/>
                    </>);
                })}
                
            </div>
        );
    }
}

export default Keyboard;