import React from 'react'
import styles from './Item.module.scss';
class Item extends React.Component{
    constructor(){
        super();
    }
    render(){
        // console.log(this.props.item);
        return (
            <div className={styles["item1"]}>
                <div className={styles['item__first']}>
                    <h3>{this.props.item.title}</h3>
                </div>
                <div className={styles['item__second']}>
                    {this.props.item.url}
                </div>
                <div className={styles['item__third']}>
                    <p>{this.props.item.desc}</p>
                </div>
                
            </div>
        );
    }
}

export default Item;