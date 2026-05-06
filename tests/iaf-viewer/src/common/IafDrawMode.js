/**
 * ****************************************************************************
 *
 * INVICARA INC CONFIDENTIAL __________________
 *
 * Copyright (C) [2012] - [2021] INVICARA INC, INVICARA Pte Ltd, INVICARA INDIA
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

//Communicator.DrawMode
//0: "Wireframe"
// 1: "Shaded"
// 2: "WireframeOnShaded"
// 3: "HiddenLine"
// 4: "XRay"
//HiddenLine: 3
// Shaded: 1
// Wireframe: 0
// WireframeOnShaded: 2
// XRay: 4

export let IafDrawMode;
export function getIafDrawMode() {
    IafDrawMode = {
        ...Communicator.DrawMode, 
        11: 'Glass', Glass: 11
    }    
}
