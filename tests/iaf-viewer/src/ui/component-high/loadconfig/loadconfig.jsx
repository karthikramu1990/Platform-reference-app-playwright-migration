// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 07-11-23    ATK        PLAT-3427   Created
// 04-Nov-23   ATK        PLAT-3583   Model Composition 3D - Linked Files
// 10-Nov-23   ATK        PLAT-3584   Model Composition 3D - Layers
// 24-01-24    ATK        PLAT-4033   View vector function of Auto Load Depth
// 01-Feb-24   ATK        PLAT-4125   Compose By Disciplines
//                                    Only show the available disciplines for a project
// 01-Mar-24   ATK        PLAT-3435   Toggling Layer Composition Switches do not update visibility of loaded layer elements
// 01-04-24    HSK        PLAT-4428   Implemented when one child is preset in panel and if we hit close button it will close and not minimize.
// -------------------------------------------------------------------------------------

import React, { useEffect } from "react";

//UX-UI imports
import { IafHeading } from "../../component-low/iafHeading/IafHeading.jsx";
import { IafSubHeader } from "../../component-low/iafSubHeader/IafSubHeader.jsx";
import { IafSlider } from "../../component-low/iafSlider/IafSlider.jsx";

import styles from "./loadconfig.module.scss";
import { disabledLinkedModelItems, linkedModelItemsFromGraphicsResources } from "../../../common/LinkedModels.js";
import IafList from "../../component-low/iafList/IafList.jsx";
import { displayDisciplineTooltip, shouldDisableLayerSwitch, layersItemsFromGraphicsResources, toggleVisibilityByLayerType, isPrivilegedLayerType, toggleVisibilityByCategory, displayCategoriesTooltip, getLayerState, isLayerComposed } from "../../../common/Layers.js";
import TooltipStore from "../../../store/tooltipStore.js";
import { IafSwitch } from "../../component-low/iafSwitch/IafSwitch.jsx";
import { processLinkedModelsByCamera } from "../../../core/camera.js";
import { IafMathUtils } from "../../../core/IafMathUtils.js";
import IafUtils, { IafProjectUtils, IafStorageUtils } from "../../../core/IafUtils.js";
import { GraphicsDbGeomViews, GraphicsDbLoadConfig } from "../../../core/database.js";
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
import IafViewer from "../../../IafViewer.jsx";
import { IafGeomUtils } from "../../../core/IafGeomUtils.js";
import { NotificationStore } from "../../../store/notificationStore.js";
import { IafApiClientModelComposition } from "../../../core/database/IafDatabaseManager.js";
import { IafGraphicsResourceHandler } from "../../../core/IafGraphicsResourceManager.js";
import { IafUiEvent, iafUiEventBus } from "../../iafUiEvents.js";
import IafTaggedList from "../../component-low/iafTaggedList/IafTaggedList.jsx";
import { permissionManager, RESOURCE_TYPES } from "../../../core/database/permission/iafPermissionManager.js";
import { EModelComposerQuality } from "../../../common/IafViewerEnums.js";

export default class ReactLoadConfig extends React.Component {

  /** @type {IafViewer} */
  viewer = undefined;

  constructor(props) {
    super(props);
    this.viewer = props.iafViewer;
    IafUtils.devToolsIaf && console.log('ReactLoadConfig.constructor', '/this', this);

    this.state = {
      linkedModelItems: []
      , disabledLinkedModelItems: []
      , designerViewTitle: "Designer View"
      , composeHelpers: "Helpers"
      , selectedLinkedModels: []

      , layerItems: []
      , disabledLayerItems: []
      , layersTitle: "Layers"
      , selectedLayers: []

      , autoComposeTitle: "Auto Compose"
      , manualComposeTitle: "Manual Compose"
      , composeOnDemand: "Compose On Demand"
      , composeDisciplines: "Disciplines"
      , composeCategories: "Tags"
      , autoLoadDepth: Math.round(IafMathUtils.mm2feet(this.viewer.props.graphicsResources.autoLoadDepthInMm))
      , camera: undefined
      , isEnableComposerHelper:  false
    }

    this.autoLoadDepthMax = IafMathUtils.mm2feet(this.viewer.props.graphicsResources.getGroundCoverageInMm()) * 50;
  }

  async componentDidMount() {
    if (this.props.enableDesigner) {
      this.props.graphicsResources.layerItemsPlaceholder = this;
      this.props.graphicsResources.linkedModelItemsPlaceholder = this;
      this.loadData()
    }

    // const isFederated = IafProjectUtils.isFederatedProject();
    // isFederated && NotificationStore.notifyFederatedProjectNotSupported(this.viewer);
  }

  modelComposerQuality = (value) => {
    if (typeof value === "number") {
      return Object.values(EModelComposerQuality)[value] 
        ?? EModelComposerQuality.Low;
    }
    return Object.values(EModelComposerQuality).indexOf(value);
  };

  handleQualityChange = async (event, value) => {
    const quality = this.modelComposerQuality(value)
    const { modelComposition, skipPersistedDisciplineSelection } = this.viewer.state;

    const updatedModelComposition = {
      ...modelComposition,
      _properties: {
        ...modelComposition._properties,
        quality
      }
    };
    await this.viewer.saveModelCompositionProperties(updatedModelComposition, skipPersistedDisciplineSelection);
    processLinkedModelsByCamera(this.viewer, this.viewer._viewer.view.getCamera());
  };
  
  async loadData() {
    try {
        let modelComposition = this.viewer.state.modelComposition;
        const projectData = modelComposition?._properties?.linkedModelItems || {};
        this.viewer.props.graphicsResources.initialLoadModelComposer(projectData);
        let linkedModelItems = linkedModelItemsFromGraphicsResources(this.props.graphicsResources, this.props.graphicsResources2d);
        let layerItems = layersItemsFromGraphicsResources(this.props.graphicsResources);
        if(linkedModelItems.length === 1){
          linkedModelItems[0].tooltipText = TooltipStore.NotOptimised;
          // Disable all the options if linkedModelItems has only one item.
          // Object.keys(linkedModelItems[0].element).forEach((key)=>{
          //   const obj = linkedModelItems[0].element[key]
          //   if(typeof obj === 'object' && obj !== null){
          //     obj.enabled = false
          //   }
          // })
        }
        this.setState({
          linkedModelItems,
          layerItems,
          autoLoadDepth: modelComposition?._properties?.autoLoadDepth ?? this.state.autoLoadDepth,
          // isLayerComposed: modelComposition?._properties?.layers ?? this.state.isLayerComposed
        },()=>{
          IafUtils.devToolsIaf && console.log('Linked Model Items and Layer Items updated from ReactLoadConfig.componentDidMount'
            , this.state.linkedModelItems
            , this.state.layerItems
          );
        });

        NotificationStore.notifyModelComposerDataLoadSuccess(this.viewer);
    } catch (error) {
        console.error("Error while loading model data:", error);
        NotificationStore.notifyModelComposerDataLoadFail(this.viewer);
    }
  }

  //callback function demo for selected item
  handleLinkedModelsSelectionChange(selectedLinkedModels) {
    this.setState({selectedLinkedModels});
    IafUtils.devToolsIaf && console.log(selectedLinkedModels);
  };
  
  getCategories= () => {
    const categories =  (this.viewer.state.modelComposition._properties.categories || [])
    .filter(category => this.viewer.props.graphicsResources.searchViewIdsByCategory(category.id).length > 0 && !category.isDeleted)
    return categories;
  }
  
  findCategoryChange = (updatedItem) => {
    const originalItems = this.state.linkedModelItems;
    if (!updatedItem) return null;
    const original = originalItems.find(item => item.id === updatedItem.id);
    if (!original) return null;

    const oldSet = new Set(original.categories || []);
    const newSet = new Set(updatedItem.categories || []);
    
    const allCategories = this.viewer?.state?.modelComposition?._properties?.categories || [];
    const systemCategory = allCategories.find(cat => cat.group === 'system');
     if (newSet.size === 1 && systemCategory && newSet.has(systemCategory.id)) {
      if (systemCategory.isSelected) {
        return { name: systemCategory.id };
      } else {
        for (const id of oldSet) {
          if (id !== systemCategory.id) {
            return { name: id};
          }
        }
      }
    }
    for (const category of newSet) {
      if (!oldSet.has(category)) {
        return { name: category };
      }
    }
    for (const category of oldSet) {
      if (!newSet.has(category)) {
        return { name: category };
      }
    }
    return null;
  }
  
  async handleLinkedModelItemEdit(updatedItem) {
    if (this.viewer.state.isModelComposerProgress) return;
    this.viewer.setState({ isModelComposerProgress: true });

    const category = this.findCategoryChange(updatedItem);
    await new Promise((resolve) => {
      this.setState((prevState) => ({
        linkedModelItems: prevState.linkedModelItems.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        ),
      }), resolve);
    });
    try {
      this.props.graphicsResources.updateGraphicsResourceCategoryByViewId(
        updatedItem.id,
        updatedItem.categories
      );

      const { modelComposition } = this.viewer.state;
      const existingLinkedItems = modelComposition._properties?.linkedModelItems || {};

      const updatedModelComposition = {
        ...modelComposition,
        _properties: {
          ...modelComposition._properties,
          linkedModelItems: {
            ...existingLinkedItems,
            [updatedItem.id]: {
              ...existingLinkedItems[updatedItem.id],
              title: updatedItem.title,
              description: updatedItem.description?.content || '',
              categories: updatedItem.categories || [],
            },
          },
        },
      };

      await this.viewer.saveModelCompositionProperties(updatedModelComposition);

      if (!this.viewer.state.isModelLayered && category) {
        const isCategoryEnabled = this.viewer.props.graphicsResources.searchViewIdsByCategory(category.name, true).length > 0;
        if (isCategoryEnabled) {
          NotificationStore.notifyMissingTagsOnToggle(this.viewer);
          await toggleVisibilityByCategory(this.viewer, category.name, isCategoryEnabled);
          iafUiEventBus.emit(IafUiEvent.IafEventDisciplineEnable, {
            key: category.name,
            enable: isCategoryEnabled,
          });
        }
      }
    } finally {
      this.viewer.setState({ isModelComposerProgress: false });
    }
  }
  
  // Handle updates to categories and trigger compose layer update.
  handleCategoriesUpdated = async (updatedCategories, updatedCategory) => {
   const categories =  updatedCategories || [];
    if (updatedCategory) {
        const isCategorySelected = categories.some(
          category => category.id === updatedCategory.id && category.isSelected && !category.isDeleted
        );
        const fakeEvent = { target: { checked: isCategorySelected } };
        await this.handleComposeLayer(fakeEvent, updatedCategory.id, true, categories);
    }
  };
  
  handleNotification = (notifyAction) =>{
    if(notifyAction === "onOpenTag"){
      NotificationStore.notifyOnTagToggleAction(this.viewer)
    }
    if (notifyAction === 'onOpenContextMenu') {
      NotificationStore.handleDesignerUIToggleNotification(this.viewer)
    }
  }
  
  handleLayersSelectionChange(selectedLayers) {
    this.setState({selectedLayers});
    IafUtils.devToolsIaf && console.log(selectedLayers);
  };

  handleSliderAutoLoadDepthChange(event, newValue, targetName) {
    IafUtils.devToolsIaf && console.log("handleSliderAutoLoadDepthChange", event, newValue, targetName);
    this.setState({ autoLoadDepth: newValue }, async ()=>{
      if (!this.viewer.iafDatabaseManager._enablePersistence
        || !permissionManager.hasWriteAccess("modelComposition")
      ) {
        IafStorageUtils.saveToLocalStorage(IafUtils.getModelCompositionKey(), { autoLoadDepth: newValue });
      } else {
        this.createOrUpdateModelCompositionData({
          ...this.viewer.state.modelComposition,
          _properties: {
              ...this.viewer.state.modelComposition._properties,
              autoLoadDepth: newValue
          },
        });
      }
      this.viewer.props.graphicsResources.setAutoLoadDepth(newValue);

      await IafGeomUtils.deleteGeoms(this.viewer, this.linkedModelNodeIds);
      await IafGeomUtils.deleteGeom(this.viewer, this.viewFrustumNodeId);

      if (this.state.isEnableComposerHelper) {
        this.linkedModelNodeIds = await this.viewer.props.graphicsResources.createLinkedModelBoxForFrustumIntersection(IafMathUtils.feet2mm(this.state.autoLoadDepth));
        this.viewFrustumNodeId = await IafGeomUtils.create3dViewVectorFrustum(this.viewer, IafMathUtils.feet2mm(newValue));  
      }
    });
  }

  _deleteGui = async () => {
    this.linkedModelNodeIds && await IafGeomUtils.deleteGeoms(this.viewer, this.linkedModelNodeIds);
    this.viewFrustumNodeId && await IafGeomUtils.deleteGeom(this.viewer, this.viewFrustumNodeId);
    this.linkedModelNodeId = null;
    this.viewFrustumNodeId = null;
  }

  _updateGui = async () => {
    await this._deleteGui();
    this.linkedModelNodeIds = await this.viewer.props.graphicsResources.createLinkedModelBoxForFrustumIntersection(IafMathUtils.feet2mm(this.state.autoLoadDepth));
    this.viewFrustumNodeId = await IafGeomUtils.create3dViewVectorFrustum(this.viewer, IafMathUtils.feet2mm(this.state.autoLoadDepth));  
  }

  componentWillUnmount() {
    IafUtils.devToolsIaf && console.log("ReactLoadConfig Component Unmounted");
    this._deleteGui();
  }

  handleGuiHelper = async (event) => {
    const { checked } = event.target;

    if (checked) {
      this._updateGui();
      // this.guiHelperInterval = setInterval(() => updateGui(), 5000);
    } else {
      this._deleteGui();
      // clearInterval(this.guiHelperInterval);
    }

    this.setState({isEnableComposerHelper: checked});
    // setTimeout(()=>this.setState({isEnableComposerHelper: false}), 2000);
  }

  handleComposeLayer = async (event, key, isCategory = false, categories = null) => {
    if (this.viewer.state.isModelComposerProgress) return;
    this.viewer.setState({ isModelComposerProgress: true });

    try {
      const { checked } = event.target;
      const { modelComposition, skipPersistedDisciplineSelection } = this.viewer.state;

      const layers = modelComposition._properties?.layers || {};
      const allCategories = (categories || modelComposition._properties?.categories || [])
      const currentStatus =  (modelComposition._properties?.categories || []).find(x=>x.id === key);
      const layerState = getLayerState(layers[key]);

      const updatedModelComposition = {
        ...modelComposition,
        _properties: {
          ...modelComposition._properties,
          layers: isCategory
            ? layers
            : {
                ...layers,
                [key]: { 
                  ...layerState, 
                  load: checked,
                  visible: checked 
                }
              },
          categories: isCategory
            ? allCategories.map(category =>
                category.id === key
                  ? { ...category, isSelected: checked }
                  : category
              )
            : allCategories
        }
      };

      if (this.viewer.state?.view3d?.enable === true) {
        await new Promise(resolve =>
          this.viewer.setState(
            prevState => ({
              view3d: {
                ...prevState.view3d,
                isLoaded: false
              }
            }),
            resolve
          )
        );
      }
      NotificationStore.notifyOnModelCompositionAction(this.viewer)


    // Save the updated model composition (local/persistent)
      await this.viewer.saveModelCompositionProperties(updatedModelComposition, skipPersistedDisciplineSelection);

      if (isCategory && currentStatus?.isSelected !== checked) {
        const systemTag = this.viewer.getDefaultTags().find(x => x.id === key && x.group === 'system');
        if (systemTag && checked) {
          NotificationStore.notifyMiscellaneousLoadWarning(this.viewer);
        } else {
          NotificationStore.notifyMissingTagsOnToggle(this.viewer);
        }
        await toggleVisibilityByCategory(this.viewer, key, checked);
        if (!checked) this.viewer.props.graphicsResources.clearCategoryNodeIdsCache(key);

        iafUiEventBus.emit(IafUiEvent.IafEventDisciplineEnable, {
          key,
          enable: checked
        });
      } else {
        processLinkedModelsByCamera(this.viewer, this.viewer._viewer.view.getCamera());
        await toggleVisibilityByLayerType(this.viewer, key, checked);
        iafUiEventBus.emit(IafUiEvent.IafEventDisciplineEnable, {
          key,
          enable: checked
        });
      }
    } finally {
     if (this.viewer.state?.view3d?.enable === true) {
        await new Promise(resolve =>
          this.viewer.setState(
            prevState => ({
              view3d: {
                ...prevState.view3d,
                isLoaded: true
              }
            }),
            resolve
          )
        );
      }
      this.viewer.setState({ isModelComposerProgress: false });
    }
  };
  
  async createOrUpdateModelCompositionData(data) {
    try {
      const action = this.viewer.state.modelComposition?._id ? "update" : "create";
      data = {
        ...data,
        _type: IafApiClientModelComposition.type,
      }
      const modelComposition = await this.viewer.iafDatabaseManager[action]({
          apiClient: IafApiClientModelComposition,
          ...(this.viewer.state.modelComposition?._id && {id: this.viewer.state.modelComposition?._id}),
          data: action === "create" ? [data]: data
      });
      this.viewer.setState({ modelComposition: Array.isArray(modelComposition) ? modelComposition[0] : modelComposition})

      NotificationStore.notifyLinkedModelItemUpdate(this.viewer);
    } catch (error) {
        console.warn(`Error while ${this.viewer.state.modelComposition?._id ? 'updating' : 'creating'} model composer data:`, error);
        NotificationStore.notifyLinkedModelEditError(this.viewer);
    }
  }

  handleEnableAutoComposed = (event) => {
    const { checked } = event.target;

    let modelComposition = this.viewer.state.modelComposition;
    modelComposition._transient.composeType = checked ? GraphicsDbLoadConfig.ConfigType.AutoCompose : GraphicsDbLoadConfig.ConfigType.ManualCompose;
    // this.setState({isLayerComposed: {...modelComposition._properties.layers}}, 
    this.viewer.setState({ modelComposition: { ...modelComposition } }, () => {
      processLinkedModelsByCamera(this.viewer, this.viewer._viewer.view.getCamera());
    });
    checked && NotificationStore.handleAutoComposeToggleNotification(this.viewer);
  }

  // This function is used to close the panel. It calls the onClose function with the parameter 'cuttingPanel'.
  panelClose(){
    IafUtils.devToolsIaf && console.log('Gis.panelClose'
      , '/props', this.props
    );

    this.props.onClose('loadConfig');
  }

  render() {
    const {resourcePermissions} = this.viewer.state;
    const quality = this.viewer.state?.modelComposition?._properties?.quality ?? EModelComposerQuality.Low;
    const currenIndex = this.modelComposerQuality(quality);
    const qualityLabel = Object.keys(EModelComposerQuality)[currenIndex];

    let renderActiveViewsForCompose = (title) => {
      if (!this.props.camera || !this.props.camera.toBeActiveViews.length) return (null);
      
      return (
        <div>
        <div className={styles["long-title-blink"]} 
              title="">
            {title}
        </div>
          <ul>
            {
              this.props.camera.toBeActiveViews.map((view, i) => {
                return (
                      view.loaded && view.visible ? (
                        <div key={i} className={styles["long-title"]} 
                              title="">
                            {view.title}
                        </div>
                      )
                    : (        
                    <IafButton
                    key={i}
                    title={view.title}
                    tooltipTitle={"Click to load " + view.title + " now"}
                    onClick={() => {
                      view.loaded = true;
                      view.visible = true;
                      this.viewer.props.graphicsResources.loadGraphicsResourceByViewId(view.id)
                    }}
                    width='100%'
                    height="18px"
                    ></IafButton>                  
                  )
              )})
            }
          </ul>
        </div>      
      )
    }

    let renderInactiveViewsForCompose = (title) => {
      if (!this.props.camera.toBeInactiveViews.length) return (null);
      
      return (
        <div>
        <div className={styles["long-title-blink"]} 
              title="">
            {title}
        </div>
          <ul>
            {
              this.props.camera.toBeInactiveViews.map((view, i) => {
                return (
                      !view.loaded || !view.visible ? (
                        <div key={i} className={styles["long-title"]} 
                              title="">
                            {view.title}
                        </div>
                    )
                    : (        
                    <IafButton
                    key={i}
                    title={view.title}
                    tooltipTitle={"Click to unload " + view.title + " now"}
                    onClick={() => {
                      // view.loaded = false; // We are not going to unload but hide it for performance reasons
                      view.visible = false;
                      this.viewer.props.graphicsResources.unloadGraphicsResourceByViewId(view.id)
                    }}
                    width='100%'
                    height="18px"
                    ></IafButton>                  
                  )
              )})
            }
          </ul>
        </div>      
      )
    }

    return (
      <div>
        <IafHeading 
            id={this.props.id}
            title={this.props.title} 
            showContent={this.props.showContent} 
            showContentMethod={this.props.showContentMethod} 
            onClose={this.panelClose.bind(this)} 
            color={this.props.color}
            panelCount={this.props.panelCount}
            canAccess={(this.viewer?.getScopedElements() ?? []).length === 0}
        >
        <div>
          {
            this.props.enableConfig && 
            <IafSubHeader title = {this.state.composeOnDemand} minimized={!this.props.showContent} 
                // canAccess={
                //    resourcePermissions?.[RESOURCE_TYPES.MODEL_COMPOSER]?.canWrite
                //   // this.props.canAccess
                // }
            >
            <IafSwitch
                    title={"Auto Compose"}
                    disabled={this.state.linkedModelItems.length === 1}
                    isChecked={this.viewer.state.modelComposition._transient.composeType === GraphicsDbLoadConfig.ConfigType.AutoCompose}
                    name="enableAutoComposeTitle"
                    onChange={this.handleEnableAutoComposed.bind(this)}
                    showValue={true}
                    tooltipText = {this.state.linkedModelItems.length === 1 ? TooltipStore.NotOptimised  : TooltipStore.AutomaticLoding}
            />            
            <IafSlider
                title="View Range In Feet"
                min={1}
                max={this.autoLoadDepthMax}
                id="autoLoadDepth"
                disabled={this.state.linkedModelItems.length === 1 || 
                  this.viewer.state.modelComposition._transient.composeType !== GraphicsDbLoadConfig.ConfigType.AutoCompose}
                value={this.state.autoLoadDepth}
                label={this.state.autoLoadDepth}
                name="autoLoadDepth"
                onChange={this.handleSliderAutoLoadDepthChange.bind(this)}
                step={1}
                showValue={true}
                tooltipText = {this.state.linkedModelItems.length === 1 ? TooltipStore.NotOptimised  : TooltipStore.DistanceInFeet}
            ></IafSlider>
            </IafSubHeader>     
          }    
          {
            //PLG-1784 Discipline UI to be disabled if Auto Compose is off
            this.props.enableConfig && this.viewer.state.isModelLayered && 
            <IafSubHeader title = {this.state.composeDisciplines} minimized={!this.props.showContent} 
            canAccess={this.viewer.state.modelComposition._transient.composeType === GraphicsDbLoadConfig.ConfigType.AutoCompose}>
              {
                // Dynamically render Discipline Controls
                Object.keys(GraphicsDbGeomViews.LayerType).map((key, index) => 
                  // Hide if NoLayer discipline is not present.
                  GraphicsDbGeomViews.LayerType[key] !== GraphicsDbGeomViews.LayerType.NoLayer &&
                    <IafSwitch
                      key={index}
                      title={GraphicsDbGeomViews.LayerTitle[key]}
                      disabled={shouldDisableLayerSwitch(this.viewer, key)}
                      isChecked={isLayerComposed(this.viewer, key)?.visible}
                      // isChecked={this.viewer.state.modelComposition?._properties?.layers.hasOwnProperty(key) && this.viewer.state.modelComposition?._properties?.layers[key]}
                      // isChecked={this.state.isLayerComposed.hasOwnProperty(key) && this.state.isLayerComposed[key]}
                        name={key}
                      onChange={(event) => this.handleComposeLayer(event, key)}
                      showValue={true}
                      tooltipText={displayDisciplineTooltip(this.viewer, key)}
                      color={isPrivilegedLayerType(GraphicsDbGeomViews.LayerType[key], this.viewer)?.visible ? "red" : undefined}
                    />
                )
              }
              <IafSlider
                title="Display Accuracy"
                min={this.modelComposerQuality(EModelComposerQuality.Low)}
                max={this.modelComposerQuality(EModelComposerQuality.High)}
                step={this.modelComposerQuality(EModelComposerQuality.Medium)}
                value={this.modelComposerQuality(quality)}
                label={qualityLabel}
                labelDecimalPlaces={0}
                tooltipText={qualityLabel}
                onChange={this.handleQualityChange}
                disabled={!this.viewer?.props?.graphicsResources?.isOptimizedModel()}
              />
            </IafSubHeader>
          }
          {
             this.props.enableConfig && !this.viewer.state.isModelLayered && this.getCategories()?.length && 
            <IafSubHeader title = {this.state.composeCategories} minimized={!this.props.showContent} canAccess={this.props.canAccess && 
            this.viewer.state.modelComposition._transient.composeType === GraphicsDbLoadConfig.ConfigType.AutoCompose}>
            {this.getCategories()
              .reduce((acc, cat) => cat?.id === 'default' ? [cat, ...acc] : [...acc, cat], [])
              .map((category, idx) => (
                <IafSwitch
                  key={`custom-${idx}`}
                  title={category.name}
                  isChecked={category.isSelected}
                  name={category.id}
                  tooltipText={displayCategoriesTooltip(this.viewer, category.id)}
                  onChange={(event) => this.handleComposeLayer(event, category.id, true)}
                  showValue={true}
                />
              ))}
            </IafSubHeader>
          }
          {
            this.props.enableDesigner &&
            <IafSubHeader 
              // title = {this.state.designerViewTitle} 
              minimized={true}
              canAccess={
                resourcePermissions?.[RESOURCE_TYPES.MODEL_COMPOSER]?.canWrite 
              }
            >
            {<IafTaggedList
                isModelComposerProgress={this.viewer.state.isModelComposerProgress}
                onOperationNotification={() => NotificationStore.notifyOperationInProgress(this.viewer)}
                initialItems={this.state.linkedModelItems}
                initialCategories={this.viewer.state.modelComposition._properties?.categories || []}
                // hideTagsForIds={[this.state.linkedModelItems?.[0]?.id].filter(Boolean)}
                onItemUpdate={this.handleLinkedModelItemEdit.bind(this)}
                onCategoriesUpdated={this.handleCategoriesUpdated.bind(this)}
                onNotification={this.handleNotification}
                disabledItems={this.state.disabledLayerItems}
                showCategoryIcon={!this.viewer.state.isModelLayered}
                searchLabel = "Search physical models"
                enableSearch = {true}
                canAccess={
                  // this.props.canAccess
                  resourcePermissions?.[RESOURCE_TYPES.MODEL_COMPOSER]?.canWrite
                }
                canDeleteAccess={this.props.canDeleteAccess}
                disableContextMenu={this.viewer.state.modelComposition._transient.composeType === GraphicsDbLoadConfig.ConfigType.AutoCompose}
            />}
            {/* <IafList
            items={this.state.linkedModelItems}
            onItemEdit={this.handleLinkedModelItemEdit.bind(this)}
            // disabledItems={this.state.linkedModelItems.length === 1 ? this.state.linkedModelItems.map(x=>x.id) : this.state.disabledLinkedModelItems }
            disabledItems={this.state.disabledLinkedModelItems }
            onSelectionChange={this.handleLinkedModelsSelectionChange.bind(this)}
            enableSearch = {true} // flag to turn off search functionlity
            searchLabel = "Search physical models"
            maxRows={8}
            ></IafList> */}
          {/* </IafSubHeader>
          <IafSubHeader title = {this.state.layersTitle} minimized={true}> */}
            {/* <IafList
            items={this.state.layerItems}
            disabledItems={this.state.disabledLayerItems}
            onSelectionChange={this.handleLayersSelectionChange.bind(this)}
            enableSearch = {true} // flag to turn off search functionlity
            searchLabel = "Search logical layers"
            maxRows={5}
            ></IafList> */}
            </IafSubHeader>
          }
          {
            this.props.enableConfig &&
            <IafSubHeader title = {this.state.composeHelpers} minimized={true}>
              <IafSwitch
                  title="GUI Helper"
                  isChecked={this.state.isEnableComposerHelper}
                  name="isEnableComposerHelper"
                  onChange={this.handleGuiHelper.bind(this)}
                  showValue={false}
                  disabled={!this.viewer.state.isModelStructureReady || this.state.linkedModelItems.length === 1} // Disable switch if model is not loaded
              />
              {
                this.viewer.state.modelComposition._transient.composeType === GraphicsDbLoadConfig.ConfigType.AutoCompose && this.props.camera && this.props.camera.toBeActiveViews 
                  // && this.props.camera.toBeActiveViews.length 
                  && renderActiveViewsForCompose("Following 3d views have been found active for the provided distance in feet, loading in a moment...")
              }
              {
                this.viewer.state.modelComposition._transient.composeType === GraphicsDbLoadConfig.ConfigType.AutoCompose && this.props.camera && this.props.camera.toBeInactiveViews 
                  // && this.props.camera.toBeInactiveViews.length 
                  && renderInactiveViewsForCompose("The following 3D views have been found inactive for the provided distance in feet. Unloading in a moment...")
              }
              {
                this.viewer.state.modelComposition._transient.composeType !== GraphicsDbLoadConfig.ConfigType.AutoCompose && this.props.camera && this.props.camera.toBeActiveViews 
                  // && this.props.camera.toBeActiveViews.length 
                  && renderActiveViewsForCompose("The following 3D views have been found active for the provided distance in feet. You may want to load them.")
              }
              {
                this.viewer.state.modelComposition._transient.composeType !== GraphicsDbLoadConfig.ConfigType.AutoCompose && this.props.camera && this.props.camera.toBeInactiveViews 
                  // && this.props.camera.toBeInactiveViews.length 
                  && renderInactiveViewsForCompose("The following 3D views have been found inactive for the provided distance in feet. You may want to unload them.")
              }
            </IafSubHeader>          
          }
        </div>
        </IafHeading>
      </div>
    );
  }
}
