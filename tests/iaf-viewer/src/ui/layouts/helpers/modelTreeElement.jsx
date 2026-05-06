// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 22-Oct-23   ATK        PLAT-2414   Performance - CSDL - On Demand
//                                    IafModelTreeElement in debug mode
// -------------------------------------------------------------------------------------

import React from 'react';
import Draggable from "react-draggable";
import CheckboxTree from 'react-checkbox-tree';
import './modelTreeElement.css'
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { pushSpinnerStatus, popSpinnerStatus , EnumSpinnerStatus} from "../../component-low/IafSpinner/IafSpinner.jsx"
import IafUtils from "../../../core/IafUtils.js";

export default class IafModelTreeElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      expanded: [],
      nodes: undefined
    };
  }

  logCheckedNodes(iafViewer, treeNodeIds) {
    IafUtils.devToolsIaf && console.log('IafModelTreeElement.logCheckedNodes');
    treeNodeIds.forEach((treeNodeId) => {
      IafUtils.devToolsIaf && console.log('IafModelTreeElement.logCheckedNodes'
        , '/treeNodeId', treeNodeId
        , '/treeNode', iafViewer.modelTree.modelTreeMap.get(+treeNodeId)
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
            id={this.props.styles}
            style={{
              display: this.props.visible ? "inline-block" : "none",
            }}
          >
            <h2>{this.props.label}</h2>
            <CheckboxTree
                iconsClass="fa5"
                nodes={this.props.nodesModelTree}
                checked={this.state.checked}
                expanded={this.state.expanded}
                onCheck={async (checked) => {
                  this.setState({ checked });
                  IafUtils.devToolsIaf && console.log('/checked(modeltree)', checked)
                  return;
                  iafViewer.setState({ view3d: { ...iafViewer.state.view3d, isLoaded: false },
                    spinnerStatus: pushSpinnerStatus(iafViewer, EnumSpinnerStatus.STREAM_3D)
                  }, () => {
                    setTimeout (async () => {
                      await iafViewer.modelTree.loadOnDemand(this.props.viewer, checked.map(Number));
                      iafViewer.forceUpdateViewerElements = true;
                      iafViewer.setState({
                        spinnerStatus: popSpinnerStatus(iafViewer, EnumSpinnerStatus.STREAM_3D)
                      });
                      iafViewer.setState({
                        view3d: { ...iafViewer.state.view3d, isLoaded: true }
                      });    
                    }, 0)
                  });
                // this.logCheckedNodes(iafViewer, checked);
                }}
                onExpand={expanded => this.setState({ expanded })}
            />
          </div>
        </Draggable>
      );
  }
}