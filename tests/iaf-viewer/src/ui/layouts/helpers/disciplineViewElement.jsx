// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 22-Oct-23   ATK        PLAT-2414   Performance - CSDL - On Demand
// -------------------------------------------------------------------------------------

import React from 'react';
import Draggable from "react-draggable";
import styles from './disciplineViewElement.module.scss'
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { IafGraphicsSvc } from '@dtplatform/platform-api'
import { iafLoad, iafLoadLayers } from '../bim/layers';
import { pushSpinnerStatus, popSpinnerStatus, EnumSpinnerStatus } from "../../component-low/IafSpinner/IafSpinner.jsx"
import IafUtils from "../../../core/IafUtils.js";

export default class IafDisciplineViewElement extends React.Component {
  treeMap = new Map();
  constructor(props) {
    super();
    this.iafViewer = props.iafViewer;
    this.state = {
      checked: [],
      expanded: [],
      nodes: []
    };
    this.getNodes();
  }

  buildNodeFromLayer(layer) {
    const node = {
      value: +layer.id,
      label: layer.name,
      children: layer.children ? this.buildNodesFromLayers(layer.children) : undefined
    }
    this.treeMap.set(layer.id, node);
    return node;
  }

  buildNodesFromLayers(layers) {
    let nodes = [];
    layers.forEach((layer) => {
      const node = this.buildNodeFromLayer(layer);
      nodes.push(node);
    });
    return nodes;
  }

  // getSampleNodes() {
  //   let nodes = [{
  //     value: 'mars',
  //     label: 'Mars',
  //     children: [
  //         { value: 'phobos', label: 'Phobos' },
  //         { value: 'deimos', label: 'Deimos' },
  //     ],
  //   }];

  //   return nodes;
  // }

  async getNodes() {
    const layersJson = await IafGraphicsSvc.getLayersList();
    const layers = layersJson.layers;

    let nodes = this.buildNodesFromLayers(layers);

    IafUtils.devToolsIaf && console.log('IafDisciplineViewElement.getNodes'
      , '/nodes', nodes
      , '/treeMap', this.treeMap
      , '/layers', layers
    );

    this.setState({ nodes }, () => IafUtils.devToolsIaf && console.log('/state.nodes', this.state.nodes));
  }

  logCheckedNodes(treeNodeIds) {
    IafUtils.devToolsIaf && console.log('IafDisciplineViewElement.logCheckedNodes', '/treeNodeIds', treeNodeIds);
    treeNodeIds.forEach((treeNodeId) => {
      IafUtils.devToolsIaf && console.log('IafDisciplineViewElement.logCheckedNodes'
        , '/treeNodeId', treeNodeId
        , '/treeNode', this.iafViewer.modelTree.modelTreeMap.get(+treeNodeId)
      );
    });
  }

  render() {
      const iafViewer = this.props.iafViewer;
      return (
        <Draggable
          handle="strong"
          disabled={
            iafViewer.state.isMinUiButtonActive || iafViewer.state.isMaxUiButtonActive
          }
        >
          <div
            id="discipline-main"
            className={styles.disciplineMain}
            style={{
              display: iafViewer.state.visibleDisciplines ? "inline-block" : "none",
            }}
          >
            <h2>Disciplines</h2>
            <CheckboxTree
                iconsClass="fa5"
                nodes={iafViewer.state.nodesDisciplines}
                // nodes={this.state.nodes}
                checked={this.state.checked}
                expanded={this.state.expanded}
                onCheck={async (checked) => {
                  this.setState({ checked });
                  // this.logCheckedNodes(checked);
                  // iafLoad(iafViewer._viewer.model, checked);
                  iafViewer.setState({ 
                      view3d: { ...iafViewer.state.view3d, isLoaded: false },
                      // spinnerStatus: pushSpinnerStatus(iafViewer, EnumSpinnerStatus.STREAM_3D)
                    },
                    async () => {
                    await iafViewer.modelTree.loadOnDemand(checked.map(Number));
                    iafViewer.setState({ 
                      // spinnerStatus: popSpinnerStatus(iafViewer, EnumSpinnerStatus.STREAM_3D)
                    });
                    iafViewer.setState({
                      view3d: { ...iafViewer.state.view3d, isLoaded: iafViewer.spinnerStatusArray.length === 0 }
                    });  
                  }
                );
                  // iafLoadLayers(iafViewer._viewer.model, checked);
                }}
                onExpand={expanded => this.setState({ expanded })}
            />
          </div>
        </Draggable>
      );
  }
}

// export function iafDisciplineViewElementOld(iafViewer) {
//     const { sheetIdx, sheetIds, sheetNames } = iafViewer.state;
//     let optionItems = sheetNames.map((name) => (
//       <option key={name}>{name}</option>
//     ));
//     console.log ('iafDisciplineViewElement', '/optionItems', optionItems)

//     return iafViewer.props.fileSet2d && (
//         <Draggable
//           handle="strong"
//           disabled={
//             iafViewer.state.isMinUiButtonActive || iafViewer.state.isMaxUiButtonActive
//           }
//         >
//           <div
//             id="discipline-main" className={styles.disciplineMain}
//             style={{
//               display: iafViewer.state.visibleDisciplines ? "inline-block" : "none",
//             }}
//           >
//             <Draggable
//               handle="strong"
//               disabled={
//                 !(
//                   iafViewer.state.isMinUiButtonActive ||
//                   iafViewer.state.isMaxUiButtonActive
//                 )
//               }
//               onStop={iafViewer.onControlledDragStop}
//             >
//               <div className={styles.viewer2DControls} id="viewerController">
//                 <select
//                   className={styles.dropDownList}
//                   onChange={iafViewer.handleSheetSelection.bind(iafViewer)}
//                 >
//                   {optionItems}
//                 </select>

//               </div>
//             </Draggable>
//           </div>
//         </Draggable>
//     )        
// }