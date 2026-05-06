// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 13-09-23    HSK                    Created SelectOperator2d to be used for 2d viewer
// -------------------------------------------------------------------------------------                                Code Restructuring.

import { SelectOperator } from "./SelectOperator.js";

//Extended Select Operator used for 3dViewer to reuse
export let SelectOperator2d;
export function getSelectOperator2d() {
    SelectOperator2d = class SelectOperator2d extends SelectOperator {
    constructor(viewer, noteTextManager, iafViewer) {
        super(viewer,noteTextManager,iafViewer);
    }
    }
}
