// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 14-06-23    ATK        PLAT-2957   Created. GIS.
// 11-08-23    ATK                    Ground Elevation
// -------------------------------------------------------------------------------------

import { ECuttingPlane } from '../common/IafViewerEnums.js';
import IafViewer from '../IafViewer.jsx';
import EvmUtils from './evmUtils.js';
import IafUtils from "../core/IafUtils.js";

export default class IafEnableUtils {
    static enableModelDisplay = (iafViewer, enable) => {
        const mainViewer = iafViewer.evmElementIdManager.getEvmElementById(EvmUtils.EVMMode.View3d);
        if (mainViewer) {
            IafUtils.devToolsIaf && console.log('MapboxReact.enableModelDisplay'
            , '/enable', enable
            , '/state', this.state
            );
            mainViewer.style.opacity = enable ? "1" : "0";
        }
    }

    static resetGroundElevation = async ( 
        /** @type {IafViewer} */
        iafViewer
    ) => {
        await iafViewer.iafCuttingPlanesUtils.enableCuttingPlanes(false);
        // PLG-1000: GIS 1.0 - Foundation for Underground Projects and Elements
        await iafViewer.iafMapBoxGl.undefineUndergroundNodes();    
    }

    static toggleGroundElevation = async (enable, 
        /** @type {IafViewer} */
        iafViewer,
        terrainHeight = 1) => {
        // RRP PLAT-5441, PLAT-5443: After the cutting section is updated and geometry is hidden, it ensures that the cutting plane is fully set up and ready before being activated.
        // await iafViewer.iafCuttingPlanesUtils.enableCuttingPlanes(enable);
        if (enable) {
            let modelBounding = iafViewer.getModelBoundingBox();
            if (modelBounding) {
                //   await iafViewer.iafCuttingPlanesUtils.updateCuttingPlanes(
                //     modelBounding.min.z, 1,
                //     modelBounding.min.x, modelBounding.min.x,
                //     modelBounding.min.y, modelBounding.min.y
                //   );
                await iafViewer.iafCuttingPlanesUtils.updateCuttingSection(ECuttingPlane.Bottom, Communicator.Axis.Z, new Communicator.Point3(0, 0, -1), terrainHeight, new Communicator.Point3(0, 0, 1), true)
                iafViewer.iafCuttingPlanesUtils.showCuttingPlaneGeometry(false);
                // setTimeout(() => iafViewer.iafCuttingPlanesUtils.showCuttingPlaneGeometry(false), 0);
            }
        } else {
        }

        // RRP PLAT-5441, PLAT-5443: After the cutting section is updated and geometry is hidden, it ensures that the cutting plane is fully set up and ready before being activated.
        await iafViewer.iafCuttingPlanesUtils.enableCuttingPlanes(enable);

        // // PLG-1000: GIS 1.0 - Foundation for Underground Projects and Elements
        // if (enable) await iafViewer.iafMapBoxGl.defineUndergroundNodes(0.0);    
        // else await iafViewer.iafMapBoxGl.defineUndergroundNodes(0.2);    
    }
}
