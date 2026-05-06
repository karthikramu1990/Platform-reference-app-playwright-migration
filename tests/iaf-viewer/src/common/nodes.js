// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 11-01-23    ATK        PLAT-2689   Dynamic Load by BIM Disciplines
// -------------------------------------------------------------------------------------

import { IafMathUtils } from '../core/IafMathUtils';
import { getSubstringIgnoringNumbersAndSpecialChars } from './stringUtils';
import IafUtils from "../core/IafUtils.js";
export let mapBimDisciplines = new Map();
export let mapBimDisciplinesExcluded = new Map();

export const disciplines = [
    "Parking"
    , "GenericModels"
    , "StructuralColumns"
    , "StructuralFraming"
    , "StructuralBeamSystems"
    , "SlabEdges"
    , "Floors"
    , "Ceilings"
    , "Walls"
    , "Roofs"
    , "Windows"
    , "Doors"
    , "Stairs"
    , "Railings"
    , "Rooms"
    , "Furniture"
    , "Reveals"
    , "CurtainWallGrids"
    , "CurtainRoofGrids"
    , "CurtainPanels"
    , "CurtainWallMullions"
    , "LightingFixtures"
    , "Planting"
    , "Entourage"
    , "Pads"
    , "Topography"
    , "Runs"
    , "Landings"
    , "PlumbingFixtures"
    , "ElectricalFixtures"
    , "SpecialityEquipment"
];

export const disciplinesExcluded = [
    "Models"
    , "Model"
    , "<ProjectName>"
    , "body"
    , "ModelGroups"
    , "Product"
];

const insertIntoMap = (mapBimDisciplines, prettyName, nodeId) => {
    if (!mapBimDisciplines.has(prettyName)) {
        mapBimDisciplines.set(prettyName, []);
    }
    let nodes = mapBimDisciplines.get(prettyName);
    nodes.push(nodeId);
    mapBimDisciplines.set(prettyName, nodes);
}

const buildbimDisciplines = (name, nodeId) => {
    const prettyName = getSubstringIgnoringNumbersAndSpecialChars(name);
    IafUtils.devToolsIaf && console.log('Nodes.buildbimDisciplines'
        , '/name', name
        , '/nodeId', nodeId
        , '/prettyName', prettyName
    )
    if (disciplines.includes(prettyName)) {
        insertIntoMap(mapBimDisciplines, prettyName, nodeId)
    } else {
        insertIntoMap(mapBimDisciplinesExcluded, prettyName, nodeId)
    }
}

export const logNode = async (model, nodeId, caller) => {
    try {
        const name = model.getNodeName(nodeId);
        const type = model.getNodeType(nodeId);
        const genericId = model.getNodeGenericId(nodeId);
        const genericType = model.getNodeGenericType(nodeId);
        const children = model.getNodeChildren(nodeId);
        const parent = model.getNodeParent(nodeId);
        // const center = await IafMathUtils.getNodeCenter(model, nodeId);
        // const lineColorEffective = (!children || !children.length) ? await model.getNodeEffectiveLineColor(nodeId, 0) : null;
        // const faceColorEffective = (!children || !children.length) ? await model.getNodeEffectiveFaceColor(nodeId, 0) : null;
        // const lineColor = (!children || !children.length) ? await model.getNodeLineColor(nodeId, 0) : null;
        // const faceColor = (!children || !children.length) ? await model.getNodeFaceColor(nodeId, 0) : null;
        // let nodeMatrix = model.getNodeMatrix(nodeId);
        // let nodeNetMatrix = model.getNodeNetMatrix(nodeId);
        // name && buildbimDisciplines(name, nodeId);
    
        IafUtils.devToolsIaf && console.log(caller, '/Nodes.logNode'
            , '/id', nodeId
            , '/name', name
            , '/type', type
            , '/genericId', genericId
            , '/genericType', genericType
            , '/children', JSON.stringify(children)
            , '/parent', parent
            // , '/center', center
            // , '/lineColor', lineColor
            // , '/faceColor', faceColor
            // , '/lineColorEffective', lineColorEffective
            // , '/faceColorEffective', faceColorEffective
            // , '/nodeMatrix', JSON.stringify(nodeMatrix.m)
            // , '/nodeNetMatrix', JSON.stringify(nodeNetMatrix.m)
        );
    } catch (error) {
        IafUtils.devToolsIaf && console.log(caller, '/Nodes.logNode', error);
    }

}


export const buildNodesRecursive = (model, nodeId, nodeIds) => {
    const children = model.getNodeChildren(nodeId, true);
    children && children.length && children.forEach((childNodeId) => buildNodesRecursive(model, childNodeId, nodeIds));
    children && !children.length && nodeIds.push(nodeId);
    // children && children.length && logNodeRecursive(model, children[0]);
}


const logNodeRecursive = (model, nodeId, depth, depthMax) => {
    logNode(model, nodeId);
    const children = model.getNodeChildren(nodeId); //, false);
    depth < depthMax && children && children.length && children.forEach((childNodeId) => logNodeRecursive(model, childNodeId, depth+1, depthMax));
    // children && children.length && logNodeRecursive(model, children[0]);
}

const iafLogNodes = (model) => {
    const nodeId = model.getAbsoluteRootNode();

    logNodeRecursive(model, nodeId, 0, 5);

    // console.log ('Nodes.iafLogNodes'
    //     , '/mapBimDisciplines', mapBimDisciplines
    //     , '/mapBimDisciplinesExcluded', mapBimDisciplinesExcluded
    // )
}

const iafLogChildren = (model, nodes) => {
    nodeIds && (
        nodeIds.forEach((nodeId) => {
            const children = model.getNodeChildren(nodeId);
            !children.length &&
                IafUtils.devToolsIaf && console.log('Nodes.iafLogChildren'
                    , '/nodeId', nodeId
                    , 'no children'
                );
        })
    );
}

export default iafLogNodes;