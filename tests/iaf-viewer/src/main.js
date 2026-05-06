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
// 29-06-23    ATK        PLAT-3000   Added IafUtils.debugIafEnabled()
// 30-06-23    ATK                    Added IafUtils.researchIafEnabled
// 13-12-23    ATK                    Added IafUtils.logVersion
// 18-01-24    ATK                    Added IafUtils.devToolsIafEnabled
// 14-03-24    ATK                    Perf Testing | Added IafUtils.perfStatIafEnabled()
// -------------------------------------------------------------------------------------

import IafViewer from "./IafViewer.jsx"
import IafViewerDBM from './IafViewerDBM.jsx'
import EvmUtils, { useEvmArcgisPropsAndEvents } from "./common/evmUtils.js";
// import IafViewerSCS from './IafViewerSCS.jsx'
import IafUtils, { IafPerfLogger } from "./core/IafUtils.js";
// import { IafMathUtils } from "./core/IafMathUtils.js";

const IafEvmUtils = EvmUtils;

IafUtils.logVersion();
IafUtils.logProject();
IafUtils.debugIafEnabled();
IafUtils.researchIafEnabled();
IafUtils.devToolsIafEnabled();
IafUtils.perfStatIafEnabled();
IafUtils.localGraphicsSvcEnabled();
IafPerfLogger.init();
// IafUtils.devToolsIaf && IafMathUtils.test();

export {
  IafViewer,
  IafViewerDBM,
  IafEvmUtils,
  useEvmArcgisPropsAndEvents
}
