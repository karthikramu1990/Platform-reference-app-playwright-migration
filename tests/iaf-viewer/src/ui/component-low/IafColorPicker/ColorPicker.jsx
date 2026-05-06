/**
 * ****************************************************************************
 *
 * INVICARA INC CONFIDENTIAL __________________
 *
 * Copyright (C) [2012] - [2020] INVICARA INC, INVICARA Pte Ltd, INVICARA INDIA
 * PVT LTD All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of
 * Invicara Inc and its suppliers, if any. The intellectual and technical
 * concepts contained herein are proprietary to Invicara Inc and its suppliers
 * and may be covered by U.S. and Foreign Patents, patents in process, and are
 * protected by trade secret or copyright law. Dissemination of this information
 * or reproduction of this material is strictly forbidden unless prior written
 * permission is obtained from Invicara Inc.
 */

// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 16-05-23    HSK        PLAT-2813   Revamed IafViewer Component
// 16-05-23    ATK        PLAT-281    Restructuring
// 06-06-23    HSK                    Used compact-container css selector                                     
// -------------------------------------------------------------------------------------

import React from 'react';
import {CompactPicker} from "react-color";
import styles from './ColorPicker.module.scss';
import IafTooltip from '../Iaftooltip/IafTooltip.jsx';
import TooltipStore from '../../../store/tooltipStore.js';

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      //default a (opacity) to 1 if not predefined
      currentColor: Object.assign({a: 1}, props.currentColor)
    };
  }

  togglePicker = () => {
    const {open} = this.state
    this.setState({open: !open})
  }

  closePicker = () => {
    this.setState({open: false})
  }

  changeColor = (color) => {
    const {name} = this.props
    this.setState({currentColor: color.rgb, open: false})
    this.props.handleColorChange(name, color.rgb)
  }

  componentDidUpdate(prevProps) {
    let prevColor = prevProps.currentColor;
    let currColor = this.props.currentColor;
    if (prevColor.r !== currColor.r || prevColor.g !== currColor.g || prevColor.b !== currColor.b) {
      this.changeColor({rgb: Object.assign({a: 1}, this.props.currentColor)})
      // You can set state or trigger any side effects here
    }
  }

  render() {
    const {currentColor, open} = this.state
    const {title} = this.props
    let custom = {
      color: {
        width: "92px",
        height: "16px",
        background: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a})`,
        border: "1px solid white"
      },
      swatch: {
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      }
    }

    return (
      <div className={styles.colorPicker}>
        {open && (
          <div className={styles.compactContainer}>
            <div style={custom.cover} onClick={this.closePicker} />
            <CompactPicker color={currentColor} onChange={this.changeColor} />
          </div>
        )}

        <div className={`${styles.blockColorPicker} ${styles.text}`}>
          {title}
            <div className={styles.innerBlock}>
              <div
                className={styles.colorBox}
                style={custom.swatch}
                onClick={this.togglePicker}
              >
                <IafTooltip title={TooltipStore.ChangeColor}>
                  <div style={custom.color} />
                </IafTooltip>
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default ColorPicker;