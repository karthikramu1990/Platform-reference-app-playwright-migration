// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 11-01-23    ATK        PLAT-2689   Dynamic Load by BIM Disciplines
//                                    Introduced IafModelTree
// -------------------------------------------------------------------------------------

import { logLayers } from "../common/Layers";
import IafUtils from "../core/IafUtils";
import IafSet from "./iafSet";
// import { disciplines, logNode } from "./nodes";
import { getSubstringIgnoringNumbersAndSpecialChars } from './stringUtils';

export default class IafModelTree {
    rawTree = false;
    subGroupMax = 50;
    nodesVisible = [];
    nodesLoaded = [];
    treeGroups = [ // Make sure No spaces in the strings
        , "GenericModels"
        , "StructuralColumns"
        , "StructuralFraming"
        , "StructuralFoundations"
        , "StructuralConnections"
        , "StructuralBeamSystems"
        , "StructuralTrusses"
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
        , "ModelGroups"
        , "Runs"
        , "Landings"
        , "PlumbingFixtures"
        , "ElectricalFixtures"
        , "SpecialtyEquipment"
        , "Site"
        , "Ramps"
        , "Casework"
        , "Parking"
        , "Pipes"
        , "WallSweeps"
        , "DataDevices"
        , "Supports"
        , "MechanicalEquipment"
        , "AirTerminals"
        , "Ducts"
        , "DuctFittings"
        , "DuctAccessories"
        , "FlexDucts"
        , "Spaces"
        , "PipeFittings"
        , "PipeAccessories"
        , "Sprinklers"
        , "ElectricalEquipment"
        , "LightingDevices"
        , "CommunicationDevices"
        , "TopRails"
        , "CableTrays"
        , "CableTrayFittings"
        , "FireAlarmDevices"
        , "SecurityDevices"
        , "Conduits"
        , "ConduitFittings"
        , "Centerline"
        , "CenterLine"
        , "FlexPipes"
        , "TelephoneDevices"
        , "Lines"
        , "Handrails"
    ];
    modelTreeMap = new Map();
    treeGroupMap = new Map();
    levelMap = new Map();

    constructor(iafViewer) {
        this.iafViewer = iafViewer;
    }

    setViewer(viewer) {
        if (!viewer) return;
        this.viewer = viewer;
        this.model = this.viewer.model;
    }

    clear = () => {
        this.modelTreeMap = new Map();
        this.treeGroupMap = new Map();
    }

    rebuild2d = () => {
        this.setViewer(this.iafViewer._viewer2d);
        let nodesModelTree2d = this.buildTreeNodesFromGraphicsRootNode(this.viewer2d);
        this.iafViewer.setState({
            nodesModelTree2d
            // , is2DModelLoaded: false
            // , spinnerStatus: pushSpinnerStatus(iafViewer, EnumSpinnerStatus.STREAM_2D)
        });      
    }

    rebuild = () => {
        this.clear();
        this.setViewer(this.iafViewer._viewer);
        let nodesModelTree = IafUtils.debugIaf ? this.buildTreeNodesFromGraphicsRootNode(this.viewer) : [];
        let nodesDisciplines = IafUtils.debugIaf ? this.buildTreeNodesFromDisciplines(this.viewer) : [];
        IafUtils.debugIaf && logLayers(this.model);
        this.iafViewer.setState({
            nodesModelTree,
            nodesDisciplines
            // spinnerStatus: popSpinnerStatus(iafViewer, EnumSpinnerStatus.PROCESS_3D_STRUCTURE)
        });          
    }

    getTreeGroupNodeForBimType = (treeNode, levelNodeId) => {
        const activeNodeId = treeNode.value;
        const name = this.viewer.model.getNodeName(activeNodeId);
        const prettyName = getSubstringIgnoringNumbersAndSpecialChars(name);

        const newSubGroup = (prettyName, length, levelNodeId) => {
            return {
                value: prettyName + (length+1) + levelNodeId,
                label: prettyName, 
                children: []
            }
        }

        let treeGroupMap = this.treeGroupMap;
        levelNodeId && (treeGroupMap = this.levelMap.get(levelNodeId));

        if (this.treeGroups.includes(prettyName)) {
            let group, subGroup;
            if (!treeGroupMap.has(prettyName)) {
                group = {
                    value: prettyName + levelNodeId,
                    label: prettyName,
                    children: []
                };
                // console.log ('IafModelTree.getTreeGroupNodeForBimType', treeGroupNode);
                treeGroupMap.set(prettyName, group);
            }
            group = treeGroupMap.get(prettyName);

            if (group.children.length === 0) {
                subGroup = newSubGroup(prettyName, length, levelNodeId);
            } else {
                subGroup = group.children[group.children.length-1];
                if (subGroup.children.length >= this.subGroupMax) {
                    subGroup = newSubGroup(prettyName, group.children.length, levelNodeId);
                }
            }

            return {
                group,
                subGroup
            }
    }
        return undefined;
    }

    buildTreeNodesFromGraphicsNodeArray = (nodeIdArray, recursive, levelNodeId) => {
        let treeNodes = [];
        nodeIdArray.forEach((nodeId) => {
          if (this.modelTreeMap.has(nodeId)) {
            IafUtils.devToolsIaf && console.log('IafModelTree.buildTreeNodesFromGraphicsNodeArray'
                , 'nodeId already exists somewhere in the tree'
                , '/nodeId', nodeId
                , '/name', this.viewer.model.getNodeName(nodeId)
            );
          } else {
            const treeNode = this.buildTreeNodeFromGraphicsNode(nodeId, recursive, levelNodeId);
            const pair = this.getTreeGroupNodeForBimType(treeNode, levelNodeId);
            if (pair) {
              if (!pair.group.children.length) {
                  treeNodes.push(pair.group);
              }
              if (!pair.subGroup.children.length) {
                pair.group.children.push(pair.subGroup);
              }
              pair.subGroup.children.push(treeNode);
            } else {
              treeNodes.push(treeNode);
            }
          }
        });
        return treeNodes;
    }
    
    buildTreeNodeFromGraphicsNode = (nodeId, recursive, levelNodeId) => {
        const name = this.viewer.model.getNodeName(nodeId);
        const children = this.viewer.model.getNodeChildren(nodeId);

        const genericType = this.viewer.model.getNodeGenericType(nodeId);
        if ( !levelNodeId && genericType === "BIM_Level") 
        {
            IafUtils.devToolsIaf && console.log('ModelTree.buildTreeNodeFromGraphicsNode'
                , '/name', name
                , '/genericType', genericType
            );
            if (!this.levelMap.has(nodeId)) {
                this.levelMap.set(nodeId, new Map());
            }
            levelNodeId = nodeId;
        }
        
        const treeNode = {
          value: nodeId,
          label: name + "-" + nodeId,
          children: recursive && children && children.length && children.length ? this.buildTreeNodesFromGraphicsNodeArray(children, recursive, levelNodeId) : undefined
        }

        this.modelTreeMap.set(nodeId, treeNode);
        return treeNode;
    }

    buildTreeNodesFromGraphicsRootNode = (viewer) => {
        this.clear();
        this.setViewer(viewer);
        let treeNodes = this.buildTreeNodeFromGraphicsNode(this.viewer.model.getAbsoluteRootNode(), true, undefined);
        IafUtils.devToolsIaf && console.log('IafModelTree.buildTreeNodesFromGraphicsRootNode'
            , '/treeNodes', treeNodes
        )
        return [treeNodes];
    }

    // buildTreeNodesFromGraphicsRootNode = (viewer) => {
    //     this.clear();
    //     this.setViewer(viewer);
    //     let treeNodes = this.buildTreeNodeFromGraphicsNode(this.viewer.model.getAbsoluteRootNode(), true);
    //     console.log ('IafModelTree.buildTreeNodesFromGraphicsRootNode'
    //         , '/treeNodes', treeNodes
    //     )
    //     return [treeNodes];
    // }

    findObjectByPropertyValue = (obj, prop, value) => {
        if (obj[prop] === value) {
          return obj;
        }
        for (const key in obj) {
          if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
            const result = this.findObjectByPropertyValue(obj[key], prop, value);
            if (result) {
              return result;
            }
          }
        }
        return null;
    }

    buildTreeNodesFromDisciplines = () => {
        this.clear();
        let layersFromModel = this.viewer.model.getLayers();
        // layersFromModel = new Map([layersFromModel.entries().next().value]);
        let treeNodes = [];
        let excludeLayers = [
            'No layer'
            // , 'Architectural'
            // , 'Mechanical'
            // , 'Electrical'
            // , 'Plumbing'
        ]

        layersFromModel.forEach ((name, id) => {
            IafUtils.devToolsIaf && console.log('buildTreeNodesFromDisciplines.layersFromModel'
                , '/name', name
                , '/id', id
            )
            if (!excludeLayers.includes(name)) {
                let nodes = this.viewer.model.getNodesFromLayer(id);
                // console.log ('IafModelTree.buildTreeNodesFromDisciplines'
                //     , '/layerid', id
                //     , '/lyaername', name
                //     , '/nodes', nodes
                // );
    
                // let nodesAsNumbers = stringArray.map(Number);
                const treeNode = {
                    value: "LAYER" + id,
                    label: name,
                    // children: undefined
                    children: nodes && nodes.length ? this.buildTreeNodesFromGraphicsNodeArray(nodes, false, undefined) : undefined
                };

                // console.log ('IafModelTree.buildTreeNodesFromDisciplines'
                //     , '/lyaername', name
                //     , '/treeNode', treeNode
                // );

                try {
                    treeNodes.push(treeNode);
                } catch (error) {
                    IafUtils.devToolsIaf && console.log('IafModelTree.buildTreeNodesFromDisciplines'
                        , '/layerid', id
                        , '/lyaername', name
                        , error
                    );
                }
            }
        });
    
        IafUtils.devToolsIaf && console.log('IafModelTree.buildTreeNodesFromDisciplines'
            , '/treeNodes', treeNodes
        )
    
        return treeNodes;
    }

    logNode(nodeId) {
        const model = this.viewer.model;
        const name = model.getNodeName(nodeId);
        const type = model.getNodeType(nodeId);
        const genericId = model.getNodeGenericId(nodeId);
        const genericType = model.getNodeGenericType(nodeId);
        const children = model.getNodeChildren(nodeId);
        const parent = model.getNodeParent(nodeId);
    
        IafUtils.devToolsIaf && console.log('Nodes.logNode'
            , '/id', nodeId
            , '/name', name
            // , '/type', type
            // , '/genericId', genericId
            // , '/genericType', genericType
            , '/children', children
            , '/parent', parent
        );        
    }

    loadOnDemand = async (viewer, nodes) => { // nodes - Number array
        if (nodes.length === 0) return;

        this.setViewer(viewer);

        // setTimeout(async () => {
            IafUtils.devToolsIaf && console.log('IafModelTree.loadOnDemand', '/nodes', nodes);
            IafUtils.devToolsIaf && console.log('IafModelTree.loadOnDemand', '/nodesLoaded', this.nodesLoaded);
    
            let hideNodes = IafSet.Difference (this.nodesVisible, nodes);
            this.nodesVisible = nodes;
            IafUtils.devToolsIaf && console.log('IafModelTree.loadOnDemand', '/hideNodes', hideNodes);
            // await this.viewer.model.setNodesVisibility(hideNodes, false);
            hideNodes.length && await this.iafViewer.setNodesVisibility(this.viewer, hideNodes, false);
    
            let nodesToLoad = IafSet.Difference (nodes, this.nodesLoaded);
            IafUtils.devToolsIaf && console.log('IafModelTree.loadOnDemand', '/nodesToLoad', nodesToLoad);
            nodesToLoad.length && await this.viewer.model.requestNodes(nodesToLoad);
            this.nodesLoaded = IafSet.Union(this.nodesLoaded, nodesToLoad);
            
            IafUtils.devToolsIaf && console.log('IafModelTree.loadOnDemand complete', nodesToLoad);
            nodes.length && this.iafViewer.setNodesVisibility(this.viewer, nodes, true);
            nodes.length && this.viewer.view.fitNodes(nodes);
            // nodes.length && this.viewer.view.isolateNodews(nodes);
            IafUtils.devToolsIaf && console.log('IafModelTree.loadOnDemand fitNodes', nodes);
    
            if (nodes.length === 1) {
                this.logNode(nodes[0]);
            }
        // }, 0);
    }
} 