// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 02-11-23    ATK        PLAT-3427   Created.   
// 16-01-24    ATK        PLAT-4033   Performant load options for Linked Models / 3D Views         
// 28-02-24    ATK        PLAT-4335   Review the Model Boundings
// -------------------------------------------------------------------------------------

import { IafListUtils } from "../ui/component-low/iafList/IafListUtils";
import IafUtils, { IafProjectUtils, IafStorageUtils } from "../core/IafUtils";
import { IafGraphicsResourceHandler } from "../core/IafGraphicsResourceManager";

const EOptionKey = {
    EOptionLoad: 'optionLoad',
    EOptionAlwaysLoad: 'optionAlwaysLoad',
    EOptionUnload: 'optionUnload',
    EOptionShow: 'optionShow',
    EOptionHide: 'optionHide',
    EOptionRename: 'optionRename',
    EOptionHideOthers: 'optionHideOthers',
    EOptionShowAll: 'optionShowAll',
    EOptionHideAll: 'optionHideAll',
    EOptionLoadAllPrevious: 'optionLoadAllPrevious',
    EOptionLoadAllNext: 'optionLoadAllNext',
    EOptionConvertModelBoundingToModelUnits: 'optionConvertModelBoundingToModelUnits',
    EOptionConfigLoadFederated: 'optionConfigLoadFederated',
    EOptionUnknown: 'optionUnknown'
};

  //demo fuction for ellipses menu
export const linkedModelEventHandler = async (optionKey, data) => {
    
    if (!data || !data.id || !data.graphicsResourceManager) return;

    switch (optionKey) {
        case EOptionKey.EOptionLoad:
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionLoad, data);
            data.graphicsResourceManager.loadGraphicsResourceByViewId(data.id);
            break;

        case EOptionKey.EOptionAlwaysLoad:
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionAlwaysLoad, data);
            data.graphicsResourceManager.alwaysLoadGraphicsResourceByViewId(data.id);
            break;

        case EOptionKey.EOptionLoadAllPrevious:
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionLoadAllPrevious, data);
            data.graphicsResourceManager.loadPreviousGraphicsResourceByViewId(data.id);
            break;

        case EOptionKey.EOptionLoadAllNext: 
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionLoadAllNext, data);
            data.graphicsResourceManager.loadNextGraphicsResourceByViewId(data.id);
            break;

        case EOptionKey.EOptionUnload:
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionUnload, data);
            data.graphicsResourceManager.unloadGraphicsResourceByViewId(data.id);
            break;

        case EOptionKey.EOptionShow:
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionShow, data);
            data.graphicsResourceManager.toggleVisibilityByViewId(data.id, true);
            break;

        case EOptionKey.EOptionShowAll: {
            const isFederated = IafProjectUtils.isFederatedProject();
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionShowAll, data);
            const forceUpdateDisciplines = !data.graphicsResourceManager.isOptimizedModel()
            data.graphicsResourceManager.toggleVisibilityShowAll({forceUpdateDisciplines});
            // data.graphicsResourceManager.toggleVisibilityShowAll({forceUpdateDisciplines: !(IafUtils.researchIaf && isFederated) });
            break;
        }

        case EOptionKey.EOptionHideAll: {
            const isFederated = IafProjectUtils.isFederatedProject();
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionHideAll, data);
            const forceUpdateDisciplines = !data.graphicsResourceManager.isOptimizedModel()
            data.graphicsResourceManager.toggleVisibilityHideAll({forceUpdateDisciplines});
            // data.graphicsResourceManager.toggleVisibilityHideAll({forceUpdateDisciplines: !(IafUtils.researchIaf && isFederated)});
            break;
        }

        case EOptionKey.EOptionHide:
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionHide, data);
            data.graphicsResourceManager.toggleVisibilityByViewId(data.id, false);
            break;

        case EOptionKey.EOptionHideOthers: 
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionRename, data);
            data.graphicsResourceManager.toggleVisibilityHideOthersByViewId(data.id, false);
            break;

        case EOptionKey.EOptionRename:
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionRename, data);
            data.graphicsResourceManager.updateGraphicsResourceNameByViewId(data.id, data.title);
            data.graphicsResourceManager.updateGraphicsResourceDescriptionByViewId(data.id, data.description.content);
            break;
            
        case EOptionKey.EOptionConfigLoadFederated:
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionConfigLoadFederated, data);
            if (!data.graphicsResourceManager.isEverythingLoaded()) {
                const forceUpdateDisciplines = !data.graphicsResourceManager.isOptimizedModel()
                data.graphicsResourceManager.loadGraphicsResourcesAll({forceUpdateDisciplines});
                // data.graphicsResourceManager.loadGraphicsResourcesAll({forceUpdateDisciplines: true});
                // data.graphicsResourceManager2d.loadGraphicsResourcesAll();    
            } else {
                data.graphicsResourceManager.loadGraphicsResourcesOnDemand();
            }
            break;

        // Hack
        case EOptionKey.EOptionConvertModelBoundingToModelUnits: 
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionConvertModelBoundingToModelUnits, data);
            data.graphicsResourceManager.convertModelBoundingToModelUnitsByViewId(data.id);
            break;
    
        default:
            IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelEventHandler', EOptionKey.EOptionUnknown, data);
            break;
    }
}

// export const linkedModelRenameEventHandler = (data) => {
//     if (!data || !data.id || !data.graphicsResourceManager) return;

//     data.graphicsResourceManager.updateGraphicsResourceNameByViewId(data.id, data.title);
//     data.graphicsResourceManager.updateGraphicsResourceDescriptionByViewId(data.id, data.description.content);

//     console.log('LinkedModels.linkedModelRenameEventHandler', data)
// }

const addDefaultLinkedModelOptionsFederated = (item, graphicsResourceManager) => {
    const loadedViews = graphicsResourceManager.getLoadedViews();

    IafListUtils.addOption(item, EOptionKey.EOptionRename, true, linkedModelEventHandler);
    IafListUtils.updateOption(item, EOptionKey.EOptionRename, 'title', 'Rename');

    IafListUtils.addOption(item, EOptionKey.EOptionConfigLoadFederated, true, linkedModelEventHandler);
    IafListUtils.updateOption(item, EOptionKey.EOptionConfigLoadFederated, 'title', !graphicsResourceManager.isEverythingLoaded() ? 'Switch to Load Everything' : 'Switch to Optimized Load');
    // IafListUtils.updateOption(item, EOptionKey.EOptionConfigLoadFederated, 'enabled', graphicsResourceManager.isMultiViewModel());    

    IafListUtils.addOption(item, EOptionKey.EOptionShowAll, true, linkedModelEventHandler);
    IafListUtils.updateOption(item, EOptionKey.EOptionShowAll, 'title', 'Show All');    

    IafListUtils.addOption(item, EOptionKey.EOptionHideAll, true, linkedModelEventHandler);
    IafListUtils.updateOption(item, EOptionKey.EOptionHideAll, 'title', 'Hide All');    
}

const addDefaultLinkedModelOptions = (item, gfxResObject) => {
    IafListUtils.addOption(item, EOptionKey.EOptionLoad, true, linkedModelEventHandler);
    IafListUtils.updateOption(item, EOptionKey.EOptionLoad, 'title', 'Load');
    IafListUtils.updateOption(item, EOptionKey.EOptionLoad, 'enabled', !gfxResObject.loaded);

    if (IafUtils.devToolsIaf) {
        IafListUtils.addOption(item, EOptionKey.EOptionAlwaysLoad, true, linkedModelEventHandler);
        IafListUtils.updateOption(item, EOptionKey.EOptionAlwaysLoad, 'title', gfxResObject.alwaysLoad ? 'Load On Demand' : 'Always Load');
        // IafListUtils.updateOption(item, EOptionKey.EOptionAlwaysLoad, 'enabled', true); 
    
        IafListUtils.addOption(item, EOptionKey.EOptionUnload, false, linkedModelEventHandler);
        IafListUtils.updateOption(item, EOptionKey.EOptionUnload, 'title', 'Unload');
        IafListUtils.updateOption(item, EOptionKey.EOptionUnload, 'enabled', gfxResObject.loaded);
    
        IafListUtils.addOption(item, EOptionKey.EOptionLoadAllPrevious, true, linkedModelEventHandler);
        IafListUtils.updateOption(item, EOptionKey.EOptionLoadAllPrevious, 'title', 'Load All Previous');
    
        IafListUtils.addOption(item, EOptionKey.EOptionLoadAllNext, true, linkedModelEventHandler);
        IafListUtils.updateOption(item, EOptionKey.EOptionLoadAllNext, 'title', 'Load All Next');
    
        IafListUtils.addOption(item, EOptionKey.EOptionHideOthers, true, linkedModelEventHandler);
        IafListUtils.updateOption(item, EOptionKey.EOptionHideOthers, 'title', 'Hide Others');
    
        // IafListUtils.addOption(item, EOptionKey.EOptionShowAll, true, linkedModelEventHandler);
        // IafListUtils.updateOption(item, EOptionKey.EOptionShowAll, 'title', 'Show All');
    
        // Hack
        IafListUtils.addOption(item, EOptionKey.EOptionConvertModelBoundingToModelUnits, true, linkedModelEventHandler);
        IafListUtils.updateOption(item, EOptionKey.EOptionConvertModelBoundingToModelUnits, 'title', 'Enable Model Units Conversion');        
    }

    IafListUtils.addOption(item, EOptionKey.EOptionShow, false, linkedModelEventHandler);
    IafListUtils.updateOption(item, EOptionKey.EOptionShow, 'title', 'Show');
    IafListUtils.updateOption(item, EOptionKey.EOptionShow, 'enabled', gfxResObject.loaded && !gfxResObject.visible);

    IafListUtils.addOption(item, EOptionKey.EOptionHide, false, linkedModelEventHandler);
    IafListUtils.updateOption(item, EOptionKey.EOptionHide, 'title', 'Hide');
    IafListUtils.updateOption(item, EOptionKey.EOptionHide, 'enabled', gfxResObject.loaded && gfxResObject.visible);

    IafListUtils.addOption(item, EOptionKey.EOptionRename, true, linkedModelEventHandler);
    IafListUtils.updateOption(item, EOptionKey.EOptionRename, 'title', 'Rename');

}

export const linkedModelItemsFromGraphicsResources = (graphicsResourceManager, graphicsResourceManager2d, options = {}) => {
    const { isExternalGraphicsResource = false, ...rest } = options;
    let views = graphicsResourceManager.views;
    let files = graphicsResourceManager.fileSet._files;
    let parent = graphicsResourceManager.linkedModelItemsPlaceholder;
    IafUtils.devToolsIaf && console.log('LinkedModels.linkedModelItemsFromGraphicsResources'
        , '/views', views
        , '/files', files
    );

    if (views.length !== files.length) {
        console.error ('The chopped source for the project is erroroneous');
        return;
    }

    let items = [];

    const addLinkedModelItem = (items, view, file) => {
        let item = IafListUtils.createItem(items, view._id);
        let gfxResObject = graphicsResourceManager.csdlMapByViewId.get(view._id);
        if (item) {
            items.push(item);
            const title = gfxResObject.graphicsNodeName ? gfxResObject.graphicsNodeName : view.title;
            const description = gfxResObject.graphicsNodeDescription ? gfxResObject.graphicsNodeDescription : gfxResObject.graphicsNodeName ? gfxResObject.graphicsNodeName : 'Description'
            const categories = gfxResObject.categories ? gfxResObject.categories : null
            
            IafListUtils.updateItemProperty(items, item.id, 'path', gfxResObject.fileName);
            IafListUtils.updateItemProperty(items, item.id, 'title', title);
            IafListUtils.updateItemProperty(items, item.id, 'description', {
                content: description,
                enabled: true
            });    
            IafListUtils.updateItemProperty(items, item.id, 'onClick', linkedModelEventHandler);
            IafListUtils.updateItemProperty(items, item.id, 'graphicsResourceManager', graphicsResourceManager);
            IafListUtils.updateItemProperty(items, item.id, 'graphicsResourceManager2d', graphicsResourceManager2d);
            // Only add categories if available in cachedData
            if (categories?.length > 0) {
                IafListUtils.updateItemProperty(items, item.id, 'categories', categories);
            }
            if (parent) {
                IafListUtils.updateItemProperty(items, item.id, 'parent', parent);
                gfxResObject.parent = parent;
            } else if (gfxResObject.parent) {
                IafListUtils.updateItemProperty(items, item.id, 'parent', gfxResObject.parent);
            }
            return item;
        }
    }

    if (!isExternalGraphicsResource)
    {
        let item = addLinkedModelItem(items, views[0], files[0]);
        let gfxResObject = graphicsResourceManager.csdlMapByViewId.get(views[0]._id);
        item && addDefaultLinkedModelOptionsFederated(item, graphicsResourceManager);    
    }

    let begin = isExternalGraphicsResource ? 0 : 1;
    for (let v=begin;v<views.length; v++) {
        let item = addLinkedModelItem(items, views[v], files[v]);
        let gfxResObject = graphicsResourceManager.csdlMapByViewId.get(views[v]._id);
        item && addDefaultLinkedModelOptions(item, gfxResObject);            
    }

    return items;
}

export const linkedMultiModelItems = (graphicsResourceManager, graphicsResourceManager2d) => {
    let items = linkedModelItemsFromGraphicsResources(graphicsResourceManager, graphicsResourceManager2d);
    let itemsExternal = [];
    
    if (graphicsResourceManager.externalModelResources && Array.isArray(graphicsResourceManager.externalModelResources)) {
        graphicsResourceManager.externalModelResources.forEach((externalModel) => {
            itemsExternal = linkedModelItemsFromGraphicsResources(externalModel.graphicsResource, externalModel.graphicsResource2d, {isExternalGraphicsResource: true});
            items = [...items, ...itemsExternal];
        });
    }

    return items;
}

export const linkedModelItems = (iafViewer) => {
    let items = [];
    
    {
        let item = IafListUtils.createItem(items, 1);
        if (item) {
            items.push(item);
    
            IafListUtils.updateItemProperty(items, item.id, 'title', 'Federated');
            IafListUtils.updateItemProperty(items, item.id, 'description', {
                content: 'Federated Description',
                enabled: true
            });    
            IafListUtils.updateItemProperty(items, item.id, 'onClick', linkedModelEventHandler);
            addDefaultLinkedModelOptionsFederated(item);    
        }
    }

    {
        let item = IafListUtils.createItem(items, 2);
        if (item) {
            items.push(item);
    
            IafListUtils.updateItemProperty(items, item.id, 'title', 'Strcutural');
            IafListUtils.updateItemProperty(items, item.id, 'description', {
                content: 'Strcutural Description',
                enabled: true
            });
            IafListUtils.updateItemProperty(items, item.id, 'onClick', linkedModelEventHandler);
            addDefaultLinkedModelOptions(item);
        }
    }

    IafUtils.devToolsIaf && console.log('LinkedModelItems', items);
    
    return items;
}

export const disabledLinkedModelItems = () => {
    let disabledItems = [];
    return disabledItems;
}
