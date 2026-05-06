// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 10-Nov-23   ATK        PLAT-3584   Created. Model Composition 3D - Layers
// 31-Jan-24   ATK        PLAT-4125   GraphicsDbLoadConfig.ConfigType ComposeByNavigation, ComposeByAssets
//                                    Do not GraphicsDbGeomViews.LayerType.NoLayer items in the Designer View
// 01-Mar-24   ATK        PLAT-3435   Toggling Layer Composition Switches do not update visibility of loaded layer elements
// -------------------------------------------------------------------------------------

import { IafListUtils } from "../ui/component-low/iafList/IafListUtils.js";
import { GraphicsDbGeomViews } from "../core/database.js";
import TooltipStore from "../store/tooltipStore.js";

const EOptionKey = {
    EOptionLoad: "optionLoad",
    EOptionUnload: "optionUnload",
    EOptionShow: "optionShow",
    EOptionHide: "optionHide",
    EOptionRename: "optionRename",

    EOptionUnknown: "optionUnknown"
};

  //demo fuction for ellipses menu
export const layersEventHandler = (optionKey, data) => {
    
    if (!data || !data.id || !data.graphicsResourceManager) return;

    switch (optionKey) {
        // case EOptionKey.EOptionLoad:
        //     console.log('Layers.layersEventHandler', EOptionKey.EOptionLoad, data);
        //     data.graphicsResourceManager.loadGraphicsResourceByViewId(data.id);
        //     break;

        // case EOptionKey.EOptionUnload:
        //     console.log('Layers.layersEventHandler', EOptionKey.EOptionUnload, data);
        //     data.graphicsResourceManager.unloadGraphicsResourceByViewId(data.id);
        //     break;

        case EOptionKey.EOptionShow:
            IafUtils.devToolsIaf && console.log('Layers.layersEventHandler', EOptionKey.EOptionShow, data);
            data.graphicsResourceManager.toggleVisibilityByLayerName(data.id, true);
            break;

        case EOptionKey.EOptionHide:
            IafUtils.devToolsIaf && console.log('Layers.layersEventHandler', EOptionKey.EOptionHide, data);
            data.graphicsResourceManager.toggleVisibilityByLayerName(data.id, false);
            break;

        case EOptionKey.EOptionRename:
            IafUtils.devToolsIaf && console.log('Layers.layersEventHandler', EOptionKey.EOptionRename, data);
            data.graphicsResourceManager.updateLayerObjectTitle(data.id, data.title);
            data.graphicsResourceManager.updateLayerObjectDescription(data.id, data.description.content);
            break;

        default:
            IafUtils.devToolsIaf && console.log('Layers.layersEventHandler', EOptionKey.EOptionUnknown, data);
            break;
    }
}

// const addDefaultLayerOptionsFederated = (item) => {
//     IafListUtils.addOption(item, 'optionRename', true, layersEventHandler);
//     IafListUtils.updateOption(item, 'optionRename', 'title', 'Rename');
// }

const addDefaultLayerOptions = (item, layerObject) => {
    // IafListUtils.addOption(item, 'optionLoad', true, layersEventHandler);
    // IafListUtils.updateOption(item, 'optionLoad', 'title', 'Load');
    // IafListUtils.updateOption(item, 'optionLoad', 'enabled', !gfxResObject.loaded);
    // IafListUtils.addOption(item, 'optionUnload', false, layersEventHandler);
    // IafListUtils.updateOption(item, 'optionUnload', 'title', 'Unload');
    // IafListUtils.updateOption(item, 'optionUnload', 'enabled', gfxResObject.loaded);
    IafListUtils.addOption(item, 'optionShow', false, layersEventHandler);
    IafListUtils.updateOption(item, 'optionShow', 'title', 'Show');
    IafListUtils.updateOption(item, 'optionShow', 'enabled', layerObject.graphicsNodeIds.length && !layerObject.visible);
    IafListUtils.addOption(item, 'optionHide', false, layersEventHandler);
    IafListUtils.updateOption(item, 'optionHide', 'title', 'Hide');
    IafListUtils.updateOption(item, 'optionHide', 'enabled', layerObject.graphicsNodeIds.length && layerObject.visible);
    // IafListUtils.addOption(item, 'optionRename', true, layersEventHandler);
    // IafListUtils.updateOption(item, 'optionRename', 'title', 'Rename');        
}

export const layersItemsFromGraphicsResources = (graphicsResourceManager) => {
    let viewer = graphicsResourceManager.viewer;
    let parent = graphicsResourceManager.layerItemsPlaceholder;

    IafUtils.devToolsIaf && console.log('Layers.layersItemsFromGraphicsResources'
        , '/viewer', viewer
    );

    let items = [];

    const addLayerItem = (items, layerObject) => {
        let item = IafListUtils.createItem(items, layerObject.layerId);
        // let gfxResObject = graphicsResourceManager.csdlMapByViewId.get(view._id);

        if (item) {
            items.push(item);
            
            // IafListUtils.updateItemProperty(items, item.id, 'name', layerObject.layerName);
            // IafListUtils.updateItemProperty(items, item.id, 'title', gfxResObject.graphicsNodeName ? gfxResObject.graphicsNodeName : view.title);
            // IafListUtils.updateItemProperty(items, item.id, 'description', {
            //     content: gfxResObject.graphicsNodeDescription ? gfxResObject.graphicsNodeDescription : gfxResObject.graphicsNodeName ? gfxResObject.graphicsNodeName : 'Description',
            //     enabled: true
            // });
            IafListUtils.updateItemProperty(items, item.id, 'title', layerObject.layerName);
            // IafListUtils.updateItemProperty(items, item.id, 'description', {
            //     content: layerObject.layerName + "(" + layerObject.graphicsNodeIds.length + ")" + (layerObject.visible ? "" : "(Invisible)")
            //     , enabled: true
            // });    
            IafListUtils.updateItemProperty(items, item.id, 'description', {
                content: layerObject.layerDescription
                , enabled: true
            });    
            IafListUtils.updateItemProperty(items, item.id, 'onClick', layersEventHandler);
            IafListUtils.updateItemProperty(items, item.id, 'graphicsResourceManager', graphicsResourceManager);
            if (parent) {
                IafListUtils.updateItemProperty(items, item.id, 'parent', parent);
                layerObject.parent = parent;
            } else if (layerObject.parent) {
                IafListUtils.updateItemProperty(items, item.id, 'parent', layerObject.parent);
            }
            return item;
        }
    }

    // let layersFromModel = viewer.model.getLayers();
      
    // console.log ('IafGraphicsResourceManager.onModelStructureUpdate'
    //   , '/layersFromModel', layersFromModel
    // );

    // layersFromModel.forEach ((name, id) => {
    //     let nodes = viewer.model.getNodesFromLayer(id);
    //     console.log ('onModelStructureUpdate.layersFromModel'
    //         , '/name', name
    //         , '/id', id
    //         , '/nodes', nodes
    //     );
    //     let item = addLayerItem(items, id, name, nodes);
    //     let gfxResObject = undefined;//graphicsResourceManager.csdlMapByViewId.get(views[v]._id);
    //     item && addDefaultLayerOptions(item, gfxResObject);            
    // });

    // graphicsResourceManager.layerMapByIndex is AS IT COMES from within the model i.e. each layer in each view is
    // going to have its own ID. Hence is not aggregated information.
    // for (let l=0; l<graphicsResourceManager.layerMapByIndex.size; l++) {
    //     let layerObject = graphicsResourceManager.layerMapByIndex.get(l);
    //     let item = addLayerItem(items, layerObject);
    //     item && addDefaultLayerOptions(item, layerObject);
    // }

    // graphicsResourceManager.layerMapByName is processed and aggregated layer information
    // for the model with multiple views
    for (let layerType in GraphicsDbGeomViews.LayerType) {
        // if (GraphicsDbGeomViews.LayerType[layerType] === GraphicsDbGeomViews.LayerType.NoLayer) continue;
        if (graphicsResourceManager.layerMapByName.has (GraphicsDbGeomViews.LayerType[layerType])) {
            let layerObject = graphicsResourceManager.layerMapByName.get(GraphicsDbGeomViews.LayerType[layerType]);
            let item = addLayerItem(items, layerObject);
            item && addDefaultLayerOptions(item, layerObject);    
        } else {
            // Expected Layers Name is not found in the active project
            IafUtils.devToolsIaf && console.log('Layers - No', GraphicsDbGeomViews.LayerType[layerType], 'were found in the model');
        }
    }

    // for (let v=1;v<views.length; v++) {
    //     let item = addLayerItem(items, views[v], files[v]);
    //     let gfxResObject = graphicsResourceManager.csdlMapByViewId.get(views[v]._id);
    //     item && addDefaultLayerOptions(item, gfxResObject);            
    // }

    return items;
}

export const disabledLayerItems = () => {
    let disabledItems = [];
    return disabledItems;
}

export const layerPercent = (layerType, globalLayers, viewlayers) => {
    let percent = 0;
    if (viewlayers[layerType] >= 0 && globalLayers[layerType] > 0) {
        percent = (viewlayers[layerType] / globalLayers[layerType]) * 100.0;
    }
    return percent;
}

export const layerPercentInView = (layerType, viewlayers) => {
    let fileTotal = 0;
    for (const layer in viewlayers) {
        fileTotal += viewlayers[layer] || 0;
    }
    const layerCount = viewlayers[layerType] || 0;
    if (fileTotal <= 0 || layerCount <= 0) {
        return 0;
    }
    return (layerCount / fileTotal) * 100.0;
};

export const getPrimaryDiscipline = (layers, skipArr) => {
    !skipArr && (skipArr = []);
    let primary = undefined;
    let nPrimaryElements = 0;
    for (let layer in layers) {
        if (!skipArr.includes(layer) && layers.hasOwnProperty(layer) && layers[layer] >= nPrimaryElements) {
            primary = layer;
            nPrimaryElements = layers[layer];
        }
    }
    return {
        primary
        , nPrimaryElements
    };
}

//RRP:- PLG-1766 deprecated.
export const isLayerComposed_old = (iafViewer, layerType) => {
    return iafViewer.state.modelComposition?._properties?.layers 
            && iafViewer.state.modelComposition?._properties?.layers?.hasOwnProperty(layerType)
            && iafViewer.state.modelComposition?._properties?.layers[layerType];
}

//RRP:- PLG-1766 deprecated.
export const isPrivilegedLayerType_old = (layerType, props) => {
    if (props && props.modelComposition instanceof Object && props.modelComposition.initial instanceof Object) {
        if (props.modelComposition.initial.hasOwnProperty(layerType)) return props.modelComposition.initial[layerType];
        else if (props.modelComposition.initial.hasOwnProperty('default')) return props.modelComposition.initial['default'];
    } else {
        return (
            layerType === GraphicsDbGeomViews.LayerType.Architectural
            // || layerType === GraphicsDbGeomViews.LayerType.Structural
        );    
    }
    return false;
}

const isLayerObject = (v) =>{
    return ["load", "visible"].every(k => v?.[k] !== undefined);
}

export const getLayerState = (layerValue) => {
    if (layerValue == null) {
        return { load: false, visible: false };
    }

    if (isLayerObject(layerValue)) {
        // Ensure 'visible' is false if layer 'load' is false.
        const load = Boolean(layerValue?.load);
        const visible = load && Boolean(layerValue?.visible);
        return { load, visible }; // Latest object
    }

    const b = Boolean(layerValue);
    return { load: b, visible: b }; // Support for old formate
};

export const isPrivilegedLayerType = (layerType, props) => {
    const initial = props?.modelComposition?.initial;
    const defaultVisible = layerType === GraphicsDbGeomViews.LayerType.Architectural;

    if (!initial || typeof initial !== "object") {
        return { load: defaultVisible, visible: defaultVisible };
    }

    const initialValue = initial?.[layerType] ?? initial?.default;

    if (initialValue == null) {
        return { load: defaultVisible, visible: defaultVisible };
    }

    return getLayerState(initialValue);
};

export const isLayerComposed = (iafViewer, layerType) => {
    const layerValue = iafViewer.state.modelComposition?._properties?.layers?.[layerType];
    return getLayerState(layerValue);
};

export const shouldDisableLayerSwitch = (viewer,key) => {
    const layerType = GraphicsDbGeomViews.LayerType[key];
    const isLayerInMap = viewer.props.graphicsResources.layerMapByName.has(layerType);
    return !isLayerInMap;
    // return 
    //     isPrivilegedLayerType(layerType, viewer.props) || 
    //     !isLayerInMap;
}

export const displayDisciplineTooltip = (viewer,key) => {
    const layerType = GraphicsDbGeomViews.LayerType[key];
    const isLayerInMap = viewer.props.graphicsResources.layerMapByName.has(layerType);
    return isPrivilegedLayerType(layerType, viewer.props)?.visible  
            ? TooltipStore[`PrivilegedDiscipline`]
            : !isLayerInMap 
            ? TooltipStore[`${key}Discipline`]
            : "";
}

export const displayCategoriesTooltip = (viewer, key) => {
    return TooltipStore[`${key}Tag`]
}

export const getNodesToHideRespectingScoped = async (viewer, layerNodes) => {
    const elements = viewer.getScopedElements();

    if (!viewer || !viewer._viewer || !viewer._viewer.graphicsResources) return [];

    const scoped = await viewer._viewer.graphicsResources?.getActiveNodeIds(elements);

    // No scoped -> hide everything
    if (!scoped.length) return layerNodes;

    if (!layerNodes?.length) return [];

    const scopedSet = new Set(scoped);

    // Never hide scoped nodes
    return layerNodes.filter(nodeId => !scopedSet.has(nodeId));
};

// ATK PLAT-3435 Toggling Layer Composition Switches do not update visibility of loaded layer elements
export const syncLayerElementsVisibilityByViewId = (iafViewer, viewId, isVisible = false, forceOverride = false) => {
    // Visibility of layer's nodes is affected the model composition layer switches
    let gfxResObject = iafViewer.props.graphicsResources.csdlMapByViewId.get(viewId);

    if (!gfxResObject || !gfxResObject.layers || iafViewer.props.graphicsResources.isLayerlessModel()) return;
    IafUtils.devToolsIaf && console.log(`syncLayerElementsVisibilityByViewId:--------------------------`);

    const alreadyDownloaded = forceOverride ? "AlreadyLoadedLinkedModel" : "NewlyLoadedLinkedModel"

    IafUtils.devToolsIaf && console.log(`syncLayerElementsVisibilityByViewId:${alreadyDownloaded}View ${gfxResObject?.fileName} → Discipline Visibility Update`);

    let totalShown = 0;
    let totalHidden = 0;
    let total = 0
    for (let layerType in GraphicsDbGeomViews.LayerType) {
        const layerNodes = gfxResObject.layers[layerType];
        const count = layerNodes?.length ?? 0;
        const isComposed = isLayerComposed(iafViewer, layerType)?.visible;
        IafUtils.devToolsIaf && console.log(`syncLayerElementsVisibilityByViewId:Layer: ${layerType} | Composed: ${isComposed} | Items: ${count}`);
        total += count;
        if (isComposed && forceOverride) {
            if (layerNodes && layerNodes.length) {
                if (isVisible) {
                    totalShown += count;
                    iafViewer.setNodesVisibility(iafViewer.props.graphicsResources.viewer, layerNodes, true, true);
                } else {
                    getNodesToHideRespectingScoped(iafViewer, layerNodes).then((nodesToHide) => {
                        totalHidden += nodesToHide.length;
                        if (nodesToHide.length) {
                            iafViewer.setNodesVisibility(iafViewer.props.graphicsResources.viewer, nodesToHide, false, true);
                        }
                    })
                }
            }
        }  else {
            if (!isComposed || forceOverride) {
                if (layerNodes && layerNodes.length) {
                    getNodesToHideRespectingScoped(iafViewer, layerNodes).then((nodesToHide) => {
                        totalHidden += nodesToHide.length;
                        if (nodesToHide.length) {
                            iafViewer.setNodesVisibility(iafViewer.props.graphicsResources.viewer, nodesToHide, false, true);
                        }
                    });
                }
            } else {
                totalShown += count;
            }
        }
    }
    IafUtils.devToolsIaf && console.log(`syncLayerElementsVisibilityByViewId:total  : ${total}`);
    IafUtils.devToolsIaf && console.log(`syncLayerElementsVisibilityByViewId:Shown  : ${totalShown}`);
    IafUtils.devToolsIaf && console.log(`syncLayerElementsVisibilityByViewId:Hidden : ${totalHidden}`);
    IafUtils.devToolsIaf && console.log(`syncLayerElementsVisibilityByViewId:--------------------------`);
}

// ATK PLAT-3435 Toggling Layer Composition Switches do not update visibility of loaded layer elements
export const toggleVisibilityByLayerType = async (iafViewer, layerType, visible) => {
    await iafViewer.props.graphicsResources.toggleVisibilityByLayerName(layerType, visible);
}

export const toggleVisibilityByCategory = async (iafViewer, layerType, visible) => {
    await iafViewer.props.graphicsResources.toggleVisibilityByCategory(layerType, visible);
}

import { mapBimDisciplines } from '../common/nodes.js'
import { disciplines } from '../common/nodes.js'
import IafUtils, { IafObjectUtils } from "../core/IafUtils.js";

export const LayerID = {
    LAYER_ID_STRUCTURAL_LOAD_BEARING: 2
    , LAYER_ID_STRUCTURAL_CONCRETE: 4
    , LAYER_ID_STRUCTURAL_STEEL: 8
    , LAYER_ID_STRUCTURAL_WOOD: 16
    , LAYER_ID_STRUCTURAL: 2 | 4 | 8 | 16

    , LAYER_ID_ARCHITECTURAL_INTERIOR: 32
    , LAYER_ID_ARCHITECTURAL_EXTERIOR: 64
    , LAYER_ID_ARCHITECTURAL_LANDSCAPE: 128
    , LAYER_ID_ARCHITECTURAL: 32 | 64 | 128

    , LAYER_ID_MECHANICAL: 256
    , LAYER_ID_ELECTRICAL: 512
    , LAYER_ID_PLUMBING: 1024

    , LAYER_ID_FIRE_PROTECTION: 2048
    , LAYER_ID_LIGHTING: 4096

    // ----- Add above this line ------

    , LAYER_ID_ALL: 0xFFFFFF
};

export const buildDisciplinesFromLayers = (model) => {
    const layersFromModel = model.getLayers();
    let treeNodes = [];
    layersFromModel.forEach ((value, key) => {
        const treeNode = {
            value: key,
            label: value,
            children: []
        };
        treeNodes.push(treeNode);
    });

    IafUtils.devToolsIaf && console.log('IafModelTree.buildTreeNodesFromGraphicsRootNode'
        , '/treeNodes', treeNodes
    )

    return treeNodes;
}

export const logLayers = async(model) => {
    const layersFromModel = model.getLayers();
    layersFromModel.forEach ((value, key) => {
        let nodes = model.getNodesFromLayer(key);
        IafUtils.devToolsIaf && console.log('Bim.Layers.logLayers'
            , '/layerId', key
            , '/layerName', value
            , '/nodes', nodes
        );
    });
}

export const iafLoadLayers = async (model, layerIds) => {
    layerIds.forEach ((layerId) => {
        let nodes = model.getNodesFromLayer(+layerId);
        IafUtils.devToolsIaf && console.log('Bim.Layers.iafLoadLayers request'
            , '/layerId', layerId
            , '/nodes', nodes
        )
        model.requestNodes(nodes);
    });
}

export const iafLoad = async (model, nodes) => {
    nodes = nodes.map(Number);
    IafUtils.devToolsIaf && console.log('Bim.Layers.iafLoad'
        , '/model', model
        , '/nodes', nodes
    );
    try {
        model.requestNodes(nodes);
        // console.log ('Bim.Layers.iafLoad', 'is complete');
    } catch (error) {
        IafUtils.devToolsIaf && console.log('Error in Bim.Layers.iafLoad', error);
    }
}

export const iafLoadAll = async (model) => {
    IafUtils.devToolsIaf && console.log('Bim.Layers.iafLoadAll');
    const rootNode = model.getAbsoluteRootNode();
    const children = model.getNodeChildren(rootNode);//, true);
    // children && children.length && iafLoad(model, [children[0]]);
    children && children.length && iafLoad(model, children);
}

export const loadByBimTypes = (model, disciplinesArr) => {
    !disciplinesArr && (disciplinesArr = [...disciplines]);
    disciplinesArr && setTimeout(async () => {
      let discipline = disciplinesArr.shift();
      if (discipline) {
        IafUtils.devToolsIaf && console.log('iafCallbackModelStructureReady.loadDisciplines', 'Loading', discipline)
        const nodes = mapBimDisciplines.get(discipline);
        await iafLoad(model, nodes);
        loadByBimTypes(model, disciplinesArr);  
      }
    }, 0);  
}