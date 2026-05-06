/* -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 28-06-23    HSK        PLAT-2728   Coloring Mechanism - Derive from var(--app-accent-color)
// -------------------------------------------------------------------------------------
*/

import React from 'react';
import "./Modal.css";
import Mouse from './Mouse';
import Keyboard from './Keyboard';
class CustomModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            actionToggle:false,
            tempToggle:false
        };
        this.handleClick=this.handleClick.bind(this);
        this.handleCheckBox=this.handleCheckBox.bind(this);
    }
    handleClick(val){
        this.setState({actionToggle:val});
    }
    handleCheckBox(e){
        this.setState({tempToggle : e.target.checked});
    }
    render(){
        // console.log(this.props);
        return (
            <div className="modal1">
                <div className='modal__first'>
                    <div className='modal__firstLeft'>
                        <h3>First Person Mode Tutorial</h3>
                    </div>
                    <div className='modal__firstRight'>
                        <a onClick={()=>{
                            this.props.handleClick();
                            this.props.handleForceShowModal(false);
                            if(this.state.tempToggle == true){
                                this.props.handleChangeCheckBox();
                            }
                        }}><img src="https://i.ibb.co/7QZwc6B/close-FILL0-wght400-GRAD0-opsz48.png" alt="close-FILL0-wght400-GRAD0-opsz48" border="0" style={{width: "56%"}}/></a>
                    </div>
                </div>
                <div className='modal__second'>
                    <div className='modal__secondLeft' onClick={()=>{
                        this.handleClick(false)
                        document.getElementsByClassName("modal__secondLeft")[0].style.backgroundColor="var(--app-accent-color)";
                        document.getElementsByClassName("modal__secondRight")[0].style.backgroundColor="#EBEBEB";
                        document.getElementsByClassName("modal__secondLeft")[0].style.color="white";
                        document.getElementsByClassName("modal__secondRight")[0].style.color="black";
                    }}>Mouse Control</div>
                    <div className='modal__secondRight' onClick={()=>{
                        this.handleClick(true)
                        document.getElementsByClassName("modal__secondRight")[0].style.backgroundColor="var(--app-accent-color)";
                        document.getElementsByClassName("modal__secondLeft")[0].style.backgroundColor="#EBEBEB";
                        document.getElementsByClassName("modal__secondLeft")[0].style.color="black";
                        document.getElementsByClassName("modal__secondRight")[0].style.color="white";
                        }}>Keyboard Control</div>
                    
                </div>
                <div className='modal__third'>
                    {this.state.actionToggle?
                        <Keyboard />
                    :
                        <Mouse />
                    }
                </div>
                <div className='modal__last'>
                    <div className='modal__lastLeft'>
                        <input checked={this.state.tempToggle}
                        onChange={this.handleCheckBox}
                        type="checkbox" />
                        <label style ={{ padding: 10 + 'px'}}>Don't remind me again</label>
                    </div>
                    <div className='modal__lastRight'>
                        <button 
                       onClick={()=>{
                        this.props.handleClick();
                        if(this.state.tempToggle == true){
                            this.props.handleChangeCheckBox();
                        }
                        this.props.handleForceShowModal(false);
                    }}
                        className='btn' style ={{ color: 'white'}}>Close</button>
                    </div>
                    
                </div>
                {this.state.tempToggle && 
                <div>
                    <p style = {{margin:"10px",padding:"10px",fontWeight:"bold"}}>To open walk mode again go to settings and click on show walk mode button</p>
                    </div>
                    }
            </div>
        );
    }
}

export default CustomModal;