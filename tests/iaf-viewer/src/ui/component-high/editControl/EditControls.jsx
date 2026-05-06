// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 01-09-23   HSK                     Added new Tool list 'Utilities' and functionality related to it
// 27-09-23   HSK                     Added dropdown to modify toolbarSize
// 01-04-24   HSK        PLAT-4429   Corrected ambiguous behavoiur of 2D Viewer button after resetting toolbar from edit controls.
// -------------------------------------------------------------------------------------

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IafDropdown } from "../../component-low/iafDropdown/IafDropdown.jsx";
import { IafButton } from "../../component-low/iafButton/IafButton.jsx";
import IafTooltip from "../../component-low/Iaftooltip/IafTooltip.jsx";
import TooltipStore from "../../../store/tooltipStore.js";
import styles from "./EditControls.module.scss";
import { WidgetAction, WidgetMode } from "../../../common/enums/widgets.js"
import EvmUtils from "../../../common/evmUtils.js";
import { IafDropdownSelect } from "../../component-low/iafDropdown/iafDropdown.select.jsx";
import IafUtils from "../../../core/IafUtils.js";

export function EditControls(props) {
  const [toolColumns, setToolColumns] = useState({
    toolColumn1: {
      id: "toolColumn1",
      title: "Default tools",
      items: props.toolbarList.filter((item) => item.displayDisabled === true),
      allowDrop: false,
    },
    toolColumn2: {
      id: "toolColumn2",
      title: "Default tools",
      items: props.toolbarList.filter((item) => item.displayDisabled === false),
      allowDrop: false,
    },

    toolColumn3: {
      id: "toolColumn3",
      title: "View",
      items: props.viewList.filter((item) => item.displayDisabled === true),
      allowDrop: false,
    },
    toolColumn4: {
      id: "toolColumn4",
      title: "View",
      items: props.viewList.filter((item) => item.displayDisabled === false),
      allowDrop: false,
    },

    toolColumn5: {
      id: "toolColumn5",
      title: "Shading",
      items: props.shadingList.filter((item) => item.displayDisabled === true),
      allowDrop: false,
    },
    toolColumn6: {
      id: "toolColumn6",
      title: "Shading",
      items: props.shadingList.filter((item) => item.displayDisabled === false),
      allowDrop: false,
    },

    toolColumn7: {
      id: "toolColumn7",
      title: "Navigation",
      items: props.navigationList.filter((item) => item.displayDisabled === true),
      allowDrop: false,
    },
    toolColumn8: {
      id: "toolColumn8",
      title: "Navigation",
      items: props.navigationList.filter((item) => item.displayDisabled === false),
      allowDrop: false,
    },

    toolColumn9: {
      id: "toolColumn9",
      title: "Annotations",
      items: props.measurementList.filter((item) => item.displayDisabled === true),
      allowDrop: false,
    },
    toolColumn10: {
      id: "toolColumn10",
      title: "Annotations",
      items: props.measurementList.filter((item) => item.displayDisabled === false),
      allowDrop: false,
    },
    toolColumn11: {
      id: "toolColumn11",
      title: "Utilities",
      items: props.manipulateList.filter((item) => item.displayDisabled === true),
      allowDrop: false,
    },
    toolColumn12: {
      id: "toolColumn12",
      title: "Utilities",
      items: props.manipulateList.filter((item) => item.displayDisabled === false),
      allowDrop: false,
    },
  });
  const [selectedValue, setSelectedValue] = useState('default');

  const viewer2DMain = document.getElementById(props.iafViewer?.evmElementIdManager.getEvmUuid(EvmUtils.EVMMode.View2d));
  const viewer2DFullScreen = document.getElementById(props.iafViewer?.evmElementIdManager.getEvmElementUuidViewer2DFullScreenButton());
  const viewer2DHalfScreen = document.getElementById(props.iafViewer?.evmElementIdManager.getEvmElementUuidViewer2DHalfScreenButton());
  const viewer2DDropdown = document.querySelector(`#${props.iafViewer?.evmElementIdManager.getEvmUuid(EvmUtils.EVMMode.View2d)} .DropDownList`);
  
  const dropdownData = [
    { value: 'default', label: 'Default' },
    // { value: '2d', label: '2D' },
    // { value: '3d', label: '3D' },
  ];

  const toolbarSize = [
    {value : 'small', label : 'Small'},
    {value : 'medium', label : 'Medium'},
    {value : 'large', label : 'Large'},
    {value : 'none', label : 'None'}
  ]

  const handleDragStart = (result) => {
    const { source, destination } = result;
    const sourceColumn = toolColumns[source.droppableId];

    Object.keys(toolColumns).map((key) => {
      const toolColumn = toolColumns[key];
      if (
        sourceColumn.title == toolColumn.title &&
        sourceColumn.id !== toolColumn.id
      ) {
        setToolColumns((prevtoolColumns) => ({
          ...prevtoolColumns,
          [toolColumn.id]: {
            ...toolColumn,
            allowDrop: true,
          },
          [sourceColumn.id]: {
            ...sourceColumn,
            allowDrop: true,
          },
        }));
      }
    });
  };

  const handleDragEnd = (result) => {
    Object.keys(toolColumns).map((key) => {
      toolColumns[key].allowDrop = false;
    });

    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      (source.index !== destination.index || source.index === destination.index)
    ) {
      return;
    }

    const sourceColumn = toolColumns[source.droppableId];
    const item = sourceColumn.items[source.index];
    const updatedSourceItems = [...sourceColumn.items];
    updatedSourceItems.splice(source.index, 1);

    const destinationColumn = toolColumns[destination.droppableId];
    const updatedDestinationItems = [...destinationColumn.items];
    updatedDestinationItems.splice(destination.index, 0, item);

    if (
      (source.droppableId === "toolColumn1" &&
        destination.droppableId === "toolColumn2") ||
      (source.droppableId === "toolColumn3" &&
        destination.droppableId === "toolColumn4") ||
      (source.droppableId === "toolColumn5" &&
        destination.droppableId === "toolColumn6") ||
      (source.droppableId === "toolColumn7" &&
        destination.droppableId === "toolColumn8") ||
      (source.droppableId === "toolColumn9" &&
        destination.droppableId === "toolColumn10") ||
      (source.droppableId === "toolColumn11" &&
        destination.droppableId === "toolColumn12")
    ) {
      setToolColumns((prevtoolColumns) => ({
        ...prevtoolColumns,
        [source.droppableId]: {
          ...sourceColumn,
          items: updatedSourceItems.map((item) => ({
            ...item,
            displayDisabled: true,
          })),
        },
        [destination.droppableId]: {
          ...destinationColumn,
          items: updatedDestinationItems.map((item) => ({
            ...item,
            displayDisabled: false,
          })),
        },
      }));
    } else if (
      (source.droppableId === "toolColumn2" &&
        destination.droppableId === "toolColumn1") ||
      (source.droppableId === "toolColumn4" &&
        destination.droppableId === "toolColumn3") ||
      (source.droppableId === "toolColumn6" &&
        destination.droppableId === "toolColumn5") ||
      (source.droppableId === "toolColumn8" &&
        destination.droppableId === "toolColumn7") ||
      (source.droppableId === "toolColumn10" &&
        destination.droppableId === "toolColumn9") ||
      (source.droppableId === "toolColumn12" &&
        destination.droppableId === "toolColumn11")
    ) {
      setToolColumns((prevtoolColumns) => ({
        ...prevtoolColumns,
        [source.droppableId]: {
          ...sourceColumn,
          items: updatedSourceItems.map((item) => ({
            ...item,
            displayDisabled: false,
          })),
        },
        [destination.droppableId]: {
          ...destinationColumn,
          items: updatedDestinationItems.map((item) => ({
            ...item,
            displayDisabled: true,
          })),
        },
      }));
    }
  };

  const handleSaveClick = () => {
    setToolColumns((prevtoolColumns) => ({
      ...prevtoolColumns,
      [toolColumns.toolColumn1.id]: {
        ...toolColumns.toolColumn1,
        items: toolColumns.toolColumn1.items.map((item) => ({
          ...item,
          displayDisabled: true,
        })),
      },
      [toolColumns.toolColumn2.id]: {
        ...toolColumns.toolColumn2,
        items: toolColumns.toolColumn2.items.map((item) => ({
          ...item,
          displayDisabled: false,
        })),
      },
    }));
    props.saveClick(toolColumns,"default");
    props.editClick(false);
  };
  const handleCloseClick = () => {
    props.editClick(false);
    setToolColumns((prevtoolColumns) => ({
      ...prevtoolColumns,
      [toolColumns.toolColumn1.id]: {
        ...toolColumns.toolColumn1,
        items: props.toolbarList.filter((item) => item.displayDisabled === true),
      },
      [toolColumns.toolColumn2.id]: {
        ...toolColumns.toolColumn2,
        items: props.toolbarList.filter((item) => item.displayDisabled === false),
      },
      [toolColumns.toolColumn3.id]: {
        ...toolColumns.toolColumn3,
        items: props.viewList.filter((item) => item.displayDisabled === true),
      },
      [toolColumns.toolColumn4.id]: {
        ...toolColumns.toolColumn4,
        items: props.viewList.filter((item) => item.displayDisabled === false),
      },
      [toolColumns.toolColumn5.id]: {
        ...toolColumns.toolColumn5,
        items: props.shadingList.filter((item) => item.displayDisabled === true),
      },
      [toolColumns.toolColumn6.id]: {
        ...toolColumns.toolColumn6,
        items: props.shadingList.filter((item) => item.displayDisabled === false),
      },
      [toolColumns.toolColumn7.id]: {
        ...toolColumns.toolColumn7,
        items: props.navigationList.filter((item) => item.displayDisabled === true),
      },
      [toolColumns.toolColumn8.id]: {
        ...toolColumns.toolColumn8,
        items: props.navigationList.filter((item) => item.displayDisabled === false),
      },
      [toolColumns.toolColumn9.id]: {
        ...toolColumns.toolColumn9,
        items: props.measurementList.filter((item) => item.displayDisabled === true),
      },
      [toolColumns.toolColumn10.id]: {
        ...toolColumns.toolColumn10,
        items: props.measurementList.filter((item) => item.displayDisabled === false),
      },
      [toolColumns.toolColumn11.id]: {
        ...toolColumns.toolColumn11,
        items: props.manipulateList.filter((item) => item.displayDisabled === true),
      },
      [toolColumns.toolColumn12.id]: {
        ...toolColumns.toolColumn12,
        items: props.manipulateList.filter((item) => item.displayDisabled === false),
      },
    }));
  };
  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    const value = event.target.value;
    if(!value) return;
    if (value === 'default') {
      defaultSelection();
      
    }
  
    if (value === '3d') {
      const updatedToolColumns = {
        toolColumn1: {
          id: 'toolColumn1',
          title: 'Default tools',
          items: props.toolbarList
            .filter((item) => item.content === '2Dviewer')
            .map((item) => ({
              ...item,
              displayDisabled: true,
            })),
          allowDrop: false,
        },
        
        toolColumn2: {
          id: 'toolColumn2',
          title: 'Default tools',
          items: props.toolbarList
            .filter((item) => item.content !== '2Dviewer')
            .map((item) => ({
              ...item,
              displayDisabled: false,
            })),
          allowDrop: false,
        },
        toolColumn3:{
          id: 'toolColumn3',
          title: 'View',
          items: [],
          allowDrop: false,
        },
        toolColumn4: {
          id: 'toolColumn4',
          title: 'View',
          items: props.viewList.map((item) => ({
            ...item,
            displayDisabled: false,
          })),
          allowDrop: false,
        },
        toolColumn5: {
          id: 'toolColumn5',
          title: 'Shading',
          items: [],
          allowDrop: false,
        },
        toolColumn6: {
          id: 'toolColumn6',
          title: 'Shading',
          items: props.shadingList.map((item) => ({
            ...item,
            displayDisabled: false,
          })),
          allowDrop: false,
        },
        toolColumn7: {
          id: 'toolColumn7',
          title: 'Navigation',
          items: [],
          allowDrop: false,
        },
        toolColumn8: {
          id: 'toolColumn8',
          title: 'Navigation',
          items: props.navigationList.map((item) => ({
            ...item,
            displayDisabled: false,
          })),
          allowDrop: false,
        },
        toolColumn9: {
          id: 'toolColumn9',
          title: 'Measurement',
          items: [],
          allowDrop: false,
        },
        toolColumn10: {
          id: 'toolColumn10',
          title: 'Measurement',
          items: props.measurementList.map((item) => ({
            ...item,
            displayDisabled: false,
          })),
          allowDrop: false,
        },
        toolColumn11: {
          id: 'toolColumn11',
          title: 'Utilities',
          items: [],
          allowDrop: false,
        },
        toolColumn12: {
          id: 'toolColumn12',
          title: 'Utilities',
          items: props.manipulateList.map((item) => ({
            ...item,
            displayDisabled: false,
          })),
          allowDrop: false,
        },
      };
    
      props.saveClick(updatedToolColumns,"3d");
      setToolColumns(updatedToolColumns);
      if(props.isMaxUiButtonActive){
        props.handleMax2d(WidgetAction.MINIMIZE, WidgetMode.DEFAULT);
      }
      
      // Check if the element was found
      if (viewer2DMain) {
        // Set the display property to "none"
        viewer2DMain.style.display = "none";
        viewer2DMain.style.borderBottomRightRadius = '0px';
        viewer2DMain.style.borderBottomLeftRadius = '0px';
      }
    }
  
    if (value === '2d') {
      const updatedToolColumns = {
        toolColumn1: {
          id: 'toolColumn1',
          title: 'Default tools',
          items: props.toolbarList.filter((item) =>
            !['Show All', 'Focus Mode', '2Dviewer', 'Reset View', 'Settings'].includes(item.content)
          ).map((item) => ({
            ...item,
            displayDisabled: true,
          })),
          allowDrop: false,
        },
        toolColumn2: {
          id: 'toolColumn2',
          title: 'Default tools',
          items: props.toolbarList.filter((item) =>
            ['Show All', 'Focus Mode', '2Dviewer', 'Reset View', 'Settings'].includes(item.content)
          ).map((item) => ({
            ...item,
            displayDisabled: false,
          })),
          allowDrop: false,
        },
        toolColumn3:{
          id: 'toolColumn3',
          title: 'View',
          items: props.viewList.map((item) => ({
            ...item,
            displayDisabled: true,
          })),
          allowDrop: false,
        },
        toolColumn4: {
          id: 'toolColumn4',
          title: 'View',
          items: [],
          allowDrop: false,
        },
        toolColumn5: {
          id: 'toolColumn5',
          title: 'Shading',
          items: props.shadingList.map((item) => ({
            ...item,
            displayDisabled: true,
          })),
          allowDrop: false,
        },
        toolColumn6: {
          id: 'toolColumn6',
          title: 'Shading',
          items: [],
          allowDrop: false,
        },
        toolColumn7: {
          id: 'toolColumn7',
          title: 'Navigation',
          items: props.navigationList.map((item) => ({
            ...item,
            displayDisabled: true,
          })),
          allowDrop: false,
        },
        toolColumn8: {
          id: 'toolColumn8',
          title: 'Navigation',
          items: [],
          allowDrop: false,
        },
        toolColumn9: {
          id: 'toolColumn9',
          title: 'Measurement',
          items: props.measurementList.map((item) => ({
            ...item,
            displayDisabled: true,
          })),
          allowDrop: false,
        },
        toolColumn10: {
          id: 'toolColumn10',
          title: 'Measurement',
          items: [],
          allowDrop: false,
        },
        toolColumn11: {
          id: 'toolColumn11',
          title: 'Utilities',
          items: props.manipulateList.map((item) => ({
            ...item,
            displayDisabled: true,
          })),
          allowDrop: false,
        },
        toolColumn12: {
          id: 'toolColumn12',
          title: 'Utilities',
          items: [],
          allowDrop: false,
        },
      };
    
      props.saveClick(updatedToolColumns,"2d");
      setToolColumns(updatedToolColumns);
      
      if (viewer2DMain && viewer2DMain.style.display === "none") {
        viewer2DMain.style.display = "inline-block";
        viewer2DMain.style.borderBottomRightRadius = '10px';
        viewer2DMain.style.borderBottomLeftRadius = '10px';
      }
      if (viewer2DFullScreen && viewer2DHalfScreen) {
        viewer2DFullScreen.style.display = "none";
        viewer2DHalfScreen.style.display = "none";
      }
      if(viewer2DDropdown){
        viewer2DDropdown.style.width = "170px";
      }
      if(!props.isMaxUiButtonActive){
        props.handleMax2d(WidgetAction.MAXIMIZE, WidgetMode.FULLSCREEN);
      }
    }
  };

  const handleToolbarSizeChange = (event) => {
    props.handleToolbarSize(event.target.value)
    IafUtils.devToolsIaf && console.log(event.target.value);
  }
  
  // const applySelection = () => {
  //   return;
  // };
  const resetSelection = () => {
    defaultSelection();
    setSelectedValue('default');
  }
  function defaultSelection() {
    const updatedToolColumns = {
      toolColumn1: {
        id: 'toolColumn1',
        title: 'Default tools',
        items: [],
        allowDrop: false,
      },

      toolColumn2: {
        id: 'toolColumn2',
        title: 'Default tools',
        items: props.toolbarList.map((item) => ({
          ...item,
          displayDisabled: false,
        })),
        allowDrop: false,
      },
      toolColumn3: {
        id: 'toolColumn3',
        title: 'View',
        items: [],
        allowDrop: false,
      },
      toolColumn4: {
        id: 'toolColumn4',
        title: 'View',
        items: props.viewList.map((item) => ({
          ...item,
          displayDisabled: false,
        })),
        allowDrop: false,
      },
      toolColumn5: {
        id: 'toolColumn5',
        title: 'Shading',
        items: [],
        allowDrop: false,
      },
      toolColumn6: {
        id: 'toolColumn6',
        title: 'Shading',
        items: props.shadingList.map((item) => ({
          ...item,
          displayDisabled: false,
        })),
        allowDrop: false,
      },
      toolColumn7: {
        id: 'toolColumn7',
        title: 'Navigation',
        items: [],
        allowDrop: false,
      },
      toolColumn8: {
        id: 'toolColumn8',
        title: 'Navigation',
        items: props.navigationList.map((item) => ({
          ...item,
          displayDisabled: false,
        })),
        allowDrop: false,
      },
      toolColumn9: {
        id: 'toolColumn9',
        title: 'Measurement',
        items: [],
        allowDrop: false,
      },
      toolColumn10: {
        id: 'toolColumn10',
        title: 'Measurement',
        items: props.measurementList.map((item) => ({
          ...item,
          displayDisabled: false,
        })),
        allowDrop: false,
      },
      toolColumn11: {
        id: 'toolColumn11',
        title: 'Utilities',
        items: [],
        allowDrop: false,
      },
      toolColumn12: {
        id: 'toolColumn12',
        title: 'Utilities',
        items: props.manipulateList.map((item) => ({
          ...item,
          displayDisabled: false,
        })),
        allowDrop: false,
      },
    };

    props.saveClick(updatedToolColumns,'default');
    setToolColumns(updatedToolColumns);
    if (viewer2DMain && viewer2DMain.style.display === "none") {
      viewer2DMain.style.display = "inline-block";
      viewer2DMain.style.borderBottomRightRadius = '0px';
      viewer2DMain.style.borderBottomLeftRadius = '0px';
      props.resetStatesForEditControls();
    }
    if (viewer2DFullScreen && viewer2DHalfScreen && viewer2DFullScreen.style.display === "none" && viewer2DHalfScreen.style.display === "none") {
      viewer2DFullScreen.style.display = "block";
      viewer2DHalfScreen.style.display = "block";
    }
    if(viewer2DDropdown){
      viewer2DDropdown.style.width = "100px";
    }
    if(props.isMaxUiButtonActive){
      props.handleMax2d(WidgetAction.MINIMIZE, WidgetMode.DEFAULT);
    }
  }

  return (
    <div>
      {props.isEditControlOpen && (
        <div className={styles.container}>
          <div className={styles.headerBox}>
            <div className={styles.header}>
              <div className={styles.headerText}>Edit Toolbar</div>
              <div className={styles.headerCloseButton} onClick={handleCloseClick}>
                <span className={styles.closeIcon}>×</span>
              </div>
            </div>
          </div>
          {/* <div className="description-box">
            <div className="description-box-text">
              Drag and drop tools or their groupings in the Current toolbar.
              Move excess, unused, or low priority tools into the Tools list.
            </div>
          </div> */}
          <div className={styles.selectionBox}>
            <div className={styles.selectionColumn}>
              <IafDropdownSelect
                title="Toolbar presets"
                showTitle={true}
                className = {"dropdown-component"}
                value={selectedValue}
                onChange={handleSelectChange}
                data={dropdownData}
              ></IafDropdownSelect>
            </div>
            <div className={styles.selectionColumn}>
              <IafDropdownSelect
                title="Toolbar size"
                showTitle={true}
                className = {"dropdown-component"}
                value={props.toolbarSize}
                onChange={handleToolbarSizeChange}
                data={toolbarSize}
              ></IafDropdownSelect>
            </div>
          </div>
          <div className={styles.contentBox}>
            <DragDropContext
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className={styles.toolListBox}>
                <div className={styles.contentColumnHeader}>
                  <div className={styles.contentColumnHeaderText}>Tool lists</div>
                </div>

                <div className={styles.tableFrame}>
                  <div>
                    <Droppable droppableId={toolColumns.toolColumn1.id}>
                      {(provided, snapshot) => (
                        <div
                          className={styles.colContainer}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            cursor:
                              snapshot.isDraggingOver &&
                              toolColumns.toolColumn1.allowDrop == false
                                ? "not-allowed"
                                : "",
                          }}
                        >
                          <div className={styles.defaultLableContainer}>
                            <div className={styles.defaultLable}>
                              {toolColumns.toolColumn1.title}
                            </div>
                          </div>
                          {toolColumns.toolColumn1.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                              isDragDisabled={item.isDragDisabled}
                            >
                              {(provided) => (
                                <div
                                  className={styles.toolFrame}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    cursor:item.isDragDisabled ? "not-allowed" : "",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {item.img && (
                                    <img
                                      className={styles.icon}
                                      src={item.img}
                                      alt={" "}
                                    />
                                  )}
                                  <div className={styles.toolLable}>
                                    {item.content}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  {toolColumns.toolColumn3 &&
                  <div>
                    <Droppable
                      droppableId={toolColumns.toolColumn3.id}
                      className=""
                    >
                      {(provided, snapshot) => (
                        <div
                          className={styles.colContainer}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            cursor:
                              snapshot.isDraggingOver &&
                              toolColumns.toolColumn3.allowDrop == false
                                ? "not-allowed"
                                : "",
                          }}
                        >
                          <div className={styles.defaultLableContainer}>
                            <div className={styles.defaultLable}>
                              {toolColumns.toolColumn3.title}
                            </div>
                          </div>
                          {toolColumns.toolColumn3.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                              isDragDisabled={item.isDragDisabled}
                            >
                              {(provided) => (
                                <div
                                  className={styles.toolFrame}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    cursor:item.isDragDisabled ? "not-allowed" : "",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                   {item.img && (
                                    <img
                                      className={styles.icon}
                                      src={item.img}
                                      alt={" "}
                                    />
                                  )}
                                  <div className={styles.toolLable}>
                                    {item.content}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  }
                  {toolColumns.toolColumn5 &&                 
                  <div>
                    <Droppable
                      droppableId={toolColumns.toolColumn5.id}
                      className=""
                    >
                      {(provided, snapshot) => (
                        <div
                          className={styles.colContainer}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            cursor:
                              snapshot.isDraggingOver &&
                              toolColumns.toolColumn5.allowDrop == false
                                ? "not-allowed"
                                : "",
                          }}
                        >
                          <div className={styles.defaultLableContainer}>
                            <div className={styles.defaultLable}>
                              {toolColumns.toolColumn5.title}
                            </div>
                          </div>
                          {toolColumns.toolColumn5.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                              isDragDisabled={item.isDragDisabled}
                            >
                              {(provided) => (
                                <div
                                  className={styles.toolFrame}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    cursor:item.isDragDisabled ? "not-allowed" : "",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                   {item.img && (
                                    <img
                                      className={styles.icon}
                                      src={item.img}
                                      alt={" "}
                                    />
                                  )}
                                  <div className={styles.toolLable}>
                                    {item.content}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  }
                  {toolColumns.toolColumn7 &&
                  <div>
                    <Droppable droppableId={toolColumns.toolColumn7.id}>
                      {(provided, snapshot) => (
                        <div
                          className={styles.colContainer}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            cursor:
                              snapshot.isDraggingOver &&
                              toolColumns.toolColumn7.allowDrop == false
                                ? "not-allowed"
                                : "",
                          }}
                        >
                          <div className={styles.defaultLableContainer}>
                            <div className={styles.defaultLable}>
                              {toolColumns.toolColumn7.title}
                            </div>
                          </div>
                          {toolColumns.toolColumn7.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                              isDragDisabled={item.isDragDisabled}
                            >
                              {(provided) => (
                                <div
                                  className={styles.toolFrame}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    cursor:item.isDragDisabled ? "not-allowed" : "",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                   {item.img && (
                                    <img
                                      className={styles.icon}
                                      src={item.img}
                                      alt={" "}
                                    />
                                  )}

                                  <div className={styles.toolLable}>
                                    {item.content}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  }
                  {toolColumns.toolColumn9 &&
                  <div>
                    <Droppable droppableId={toolColumns.toolColumn9.id}>
                      {(provided, snapshot) => (
                        <div
                          className={styles.colContainer}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            cursor:
                              snapshot.isDraggingOver &&
                              toolColumns.toolColumn9.allowDrop == false
                                ? "not-allowed"
                                : "",
                          }}
                        >
                          <div className={styles.defaultLableContainer}>
                            <div className={styles.defaultLable}>
                              {toolColumns.toolColumn9.title}
                            </div>
                          </div>
                          {toolColumns.toolColumn9.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                              isDragDisabled={item.isDragDisabled}
                            >
                              {(provided) => (
                                <div
                                  className={styles.toolFrame}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    cursor:item.isDragDisabled ? "not-allowed" : "",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                   {item.img && (
                                    <img
                                      className={styles.icon}
                                      src={item.img}
                                      alt={" "}
                                    />
                                  )}
                                  <div className={styles.toolLable}>
                                    {item.content}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  }
                  {toolColumns.toolColumn11 &&
                  <div>
                    <Droppable droppableId={toolColumns.toolColumn11.id}>
                      {(provided, snapshot) => (
                        <div
                          className={styles.colContainer}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            cursor:
                              snapshot.isDraggingOver &&
                              toolColumns.toolColumn11.allowDrop == false
                                ? "not-allowed"
                                : "",
                          }}
                        >
                          <div className={styles.defaultLableContainer}>
                            <div className={styles.defaultLable}>
                              {toolColumns.toolColumn11.title}
                            </div>
                          </div>
                          {toolColumns.toolColumn11.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                              isDragDisabled={item.isDragDisabled}
                            >
                              {(provided) => (
                                <div
                                  className={styles.toolFrame}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    cursor:item.isDragDisabled ? "not-allowed" : "",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                   {item.img && (
                                    <img
                                      className={styles.icon}
                                      src={item.img}
                                      alt={" "}
                                    />
                                  )}
                                  <div className={styles.toolLable}>
                                    {item.content}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  }
                </div>
              </div>
              <div className={styles.currentToolbarBox}>
                <div className={styles.contentColumnHeader}>
                  <div className={styles.contentColumnHeaderText}>
                    Current toolbar
                  </div>
                </div>

                <div className={styles.tableFrame}>
                  <div>
                    <Droppable
                      droppableId={toolColumns.toolColumn2.id}
                      className=""
                    >
                      {(provided, snapshot) => (
                        <div
                          className={styles.colContainer}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            cursor:
                              snapshot.isDraggingOver &&
                              toolColumns.toolColumn2.allowDrop == false
                                ? "not-allowed"
                                : "",
                          }}
                        >
                          <div className={styles.defaultLableContainer}>
                            <div className={styles.defaultLable}>
                              {toolColumns.toolColumn2.title}
                            </div>
                          </div>
                          {toolColumns.toolColumn2.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className={styles.toolFrame}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                   {item.img && (
                                    <img
                                      className={styles.icon}
                                      src={item.img}
                                      alt={" "}
                                    />
                                  )}
                                  <div className={styles.toolLable}>
                                    {item.content}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  {toolColumns.toolColumn4 &&
                  <div>
                    <Droppable
                      droppableId={toolColumns.toolColumn4.id}
                      className=""
                    >
                      {(provided, snapshot) => (
                        <div
                          className={styles.colContainer}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            cursor:
                              snapshot.isDraggingOver &&
                              toolColumns.toolColumn4.allowDrop == false
                                ? "not-allowed"
                                : "",
                          }}
                        >
                          <div className={styles.defaultLableContainer}>
                            <div className={styles.defaultLable}>
                              {toolColumns.toolColumn4.title}
                            </div>
                          </div>
                          {toolColumns.toolColumn4.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className={styles.toolFrame}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                   {item.img && (
                                    <img
                                      className={styles.icon}
                                      src={item.img}
                                      alt={" "}
                                    />
                                  )}
                                  <div className={styles.toolLable}>
                                    {item.content}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  }
                  {toolColumns.toolColumn6 &&
                  <div>
                    <Droppable
                      droppableId={toolColumns.toolColumn6.id}
                      className=""
                    >
                      {(provided, snapshot) => (
                        <div
                          className={styles.colContainer}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            cursor:
                              snapshot.isDraggingOver &&
                              toolColumns.toolColumn6.allowDrop == false
                                ? "not-allowed"
                                : "",
                          }}
                        >
                          <div className={styles.defaultLableContainer}>
                            <div className={styles.defaultLable}>
                              {toolColumns.toolColumn6.title}
                            </div>
                          </div>
                          {toolColumns.toolColumn6.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className={styles.toolFrame}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                   {item.img && (
                                    <img
                                      className={styles.icon}
                                      src={item.img}
                                      alt={" "}
                                    />
                                  )}
                                  <div className={styles.toolLable}>
                                    {item.content}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  }
                  {toolColumns.toolColumn8 && 
                  <div>
                    <Droppable droppableId={toolColumns.toolColumn8.id}>
                      {(provided, snapshot) => (
                        <div
                          className={styles.colContainer}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            cursor:
                              snapshot.isDraggingOver &&
                              toolColumns.toolColumn8.allowDrop == false
                                ? "not-allowed"
                                : "",
                          }}
                        >
                          <div className={styles.defaultLableContainer}>
                            <div className={styles.defaultLable}>
                              {toolColumns.toolColumn8.title}
                            </div>
                          </div>
                          {toolColumns.toolColumn8.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className={styles.toolFrame}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                   {item.img && (
                                    <img
                                      className={styles.icon}
                                      src={item.img}
                                      alt={" "}
                                    />
                                  )}
                                  <div className={styles.toolLable}>
                                    {item.content}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  }
                  {toolColumns.toolColumn10 &&
                  <div>
                    <Droppable droppableId={toolColumns.toolColumn10.id}>
                      {(provided, snapshot) => (
                        <div
                          className={styles.colContainer}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            cursor:
                              snapshot.isDraggingOver &&
                              toolColumns.toolColumn10.allowDrop == false
                                ? "not-allowed"
                                : "",
                          }}
                        >
                          <div className={styles.defaultLableContainer}>
                            <div className={styles.defaultLable}>
                              {toolColumns.toolColumn10.title}
                            </div>
                          </div>
                          {toolColumns.toolColumn10.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className={styles.toolFrame}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                   {item.img && (
                                    <img
                                      className={styles.icon}
                                      src={item.img}
                                      alt={" "}
                                    />
                                  )}
                                  <div className={styles.toolLable}>
                                    {item.content}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  }
                  {toolColumns.toolColumn12 &&
                  <div>
                    <Droppable droppableId={toolColumns.toolColumn12.id}>
                      {(provided, snapshot) => (
                        <div
                          className={styles.colContainer}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            cursor:
                              snapshot.isDraggingOver &&
                              toolColumns.toolColumn12.allowDrop == false
                                ? "not-allowed"
                                : "",
                          }}
                        >
                          <div className={styles.defaultLableContainer}>
                            <div className={styles.defaultLable}>
                              {toolColumns.toolColumn12.title}
                            </div>
                          </div>
                          {toolColumns.toolColumn12.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className={styles.toolFrame}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                   {item.img && (
                                    <img
                                      className={styles.icon}
                                      src={item.img}
                                      alt={" "}
                                    />
                                  )}
                                  <div className={styles.toolLable}>
                                    {item.content}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  }
                </div>
              </div>
            </DragDropContext>
          </div>
          <div className={styles.footerBox}>
            <div className={styles.resetSettings} onClick={resetSelection}>Reset Settings</div>
            <div className={styles.buttonBox}>
            <IafButton title="Close" variant="secondary" tooltipTitle={TooltipStore.EditToolbarClose} tooltipPlacement='top' 
               tooltipClass="buttonTooltip"  onClick={handleCloseClick}></IafButton>
            <IafButton title="Save & Close" variant="primary"  width="120px" tooltipTitle={TooltipStore.EditToolbarSaveAndClose} tooltipPlacement='top' 
               tooltipClass="buttonTooltip" onClick={handleSaveClick}></IafButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}