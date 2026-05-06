import React,{useState} from 'react';

const Toolbar = ({ hwv }) => {
  const { showToolbar, setShowToolbar } = useState(false);
  const handleHomeClick = async () => {
    const modelBounding = await hwv.view._model.getModelBounding();
    const boundingBox = new Communicator.Box;
    boundingBox.min = modelBounding?.min.copy();
    boundingBox.max = modelBounding?.max.copy();
    boundingBox.min.x /= 2;
    boundingBox.max.x /= 2;
    await hwv.view.setViewOrientation(window.Communicator.ViewOrientation.Front, null, boundingBox, true);
  };

  return (
    <div id="toolBar">
     {showToolbar && <div className="toolbar-tools">
        <div
          id="home-button"
          title="Reset Camera"
          data-operatorclass="toolbar-home1"
          className="hoops-tool"
          onClick={handleHomeClick}
        >
          <div className="tool-icon"></div>
        </div>
        <div
          id="home-button"
          title="Reset Camera"
          data-operatorclass="toolbar-home"
          className="hoops-tool"
        >
          <div className="tool-icon"></div>
        </div>
        <div id="tool_separator_1" className="tool-separator"></div>
        
        <div
          id="view-button"
          title="Camera Menu"
          data-operatorclass="toolbar-camera"
          data-submenu="view-submenu"
          className="hoops-tool toolbar-menu"
        >
          <div className="tool-icon"></div>
        </div>
        
        <div
          id="edgeface-button"
          title="Wireframe on Shaded"
          data-operatorclass="toolbar-wireframeshaded"
          data-submenu="edgeface-submenu"
          className="hoops-tool toolbar-menu"
        >
          <div className="tool-icon"></div>
        </div>
        
        <div id="tool_separator_2" className="tool-separator"></div>
        
        <div
          id="redline-button"
          title="Redline Note"
          data-operatorclass="toolbar-redline-note"
          data-submenu="redline-submenu"
          className="hoops-tool toolbar-radio"
        >
          <div className="smarrow"></div>
          <div className="tool-icon"></div>
        </div>
        
        <div
          id="click-button"
          title="Select"
          data-operatorclass="toolbar-select"
          data-submenu="click-submenu"
          className="hoops-tool toolbar-radio active-tool"
        >
          <div className="smarrow"></div>
          <div className="tool-icon"></div>
        </div>
        
        <div
          id="camera-button"
          title="Orbit Camera"
          data-operatorclass="toolbar-orbit"
          data-submenu="camera-submenu"
          className="hoops-tool toolbar-menu"
        >
          <div className="tool-icon"></div>
        </div>
        
        <div id="tool_separator_3" className="tool-separator"></div>
        
        <div
          id="explode-button"
          title="Explode Menu"
          data-operatorclass="toolbar-explode"
          data-submenu="explode-slider"
          className="hoops-tool toolbar-menu-toggle"
        >
          <div className="tool-icon"></div>
        </div>
        
        <div
          id="cuttingplane-button"
          title="Cutting Plane Menu"
          data-operatorclass="toolbar-cuttingplane"
          data-submenu="cuttingplane-submenu"
          className="hoops-tool toolbar-menu-toggle"
        >
          <div className="tool-icon"></div>
        </div>
        
        <div id="tool_separator_4" className="tool-separator"></div>
        
        <div
          id="snapshot-button"
          title="Snapshot"
          data-operatorclass="toolbar-snapshot"
          className="hoops-tool"
        >
          <div className="tool-icon"></div>
        </div>
        
        <div
          id="settings-button"
          title="Settings"
          data-operatorclass="toolbar-settings"
          className="hoops-tool"
        >
          <div className="tool-icon"></div>
        </div>
      </div>}
      
      {/* Submenus */}
       <div id="submenus">
        {/* Redline submenu */}
        <div id="redline-submenu" data-button="redline-button" className="toolbar-submenu submenus">
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    id="redline-circle-button"
                    title="Redline Circle"
                    data-operatorclass="toolbar-redline-circle"
                    className="submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="redline-rectangle-button"
                    title="Redline Rectangle"
                    data-operatorclass="toolbar-redline-rectangle"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="redline-note"
                    title="Redline Note"
                    data-operatorclass="toolbar-redline-note"
                    className="submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="redline-freehand"
                    title="Redline Freehand"
                    data-operatorclass="toolbar-redline-freehand"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Camera submenu */}
        <div id="camera-submenu" data-button="camera-button" className="toolbar-submenu submenus">
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    id="operator-camera-walk"
                    title="Walk"
                    data-operatorclass="toolbar-walk"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="operator-camera-turntable"
                    title="Turntable"
                    data-operatorclass="toolbar-turntable"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="operator-camera-orbit"
                    title="Orbit Camera"
                    data-operatorclass="toolbar-orbit"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Edge face submenu */}
        <div id="edgeface-submenu" data-button="edgeface-button" className="toolbar-submenu submenus">
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    id="viewport-wireframe-on-shaded"
                    title="Shaded With Lines"
                    data-operatorclass="toolbar-wireframeshaded"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="viewport-shaded"
                    title="Shaded"
                    data-operatorclass="toolbar-shaded"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    title="Hidden Line"
                    data-operatorclass="toolbar-hidden-line"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="viewport-wireframe"
                    title="Wireframe"
                    data-operatorclass="toolbar-wireframe"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="viewport-xray"
                    title="XRay"
                    data-operatorclass="toolbar-xray"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* View submenu */}
        <div id="view-submenu" className="toolbar-submenu submenus">
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    id="view-face"
                    title="Orient Camera To Selected Face"
                    data-operatorclass="toolbar-face"
                    className="submenu-icon disabled"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="view-iso"
                    title="Iso View"
                    data-operatorclass="toolbar-iso"
                    className="submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="view-ortho"
                    title="Orthographic Projection"
                    data-operatorclass="toolbar-ortho"
                    className="submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="view-persp"
                    title="Perspective Projection"
                    data-operatorclass="toolbar-persp"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="view-left"
                    title="Left View"
                    data-operatorclass="toolbar-left"
                    className="submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="view-right"
                    title="Right View"
                    data-operatorclass="toolbar-right"
                    className="submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="view-bottom"
                    title="Bottom View"
                    data-operatorclass="toolbar-bottom"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="view-front"
                    title="Front View"
                    data-operatorclass="toolbar-front"
                    className="submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="view-back"
                    title="Back View"
                    data-operatorclass="toolbar-back"
                    className="submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="view-top"
                    title="Top View"
                    data-operatorclass="toolbar-top"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Click submenu */}
        <div id="click-submenu" data-button="click-button" className="toolbar-submenu submenus">
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    id="note-button"
                    title="Create Note-Pin"
                    data-operatorclass="toolbar-note"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="measure-angle-between-faces"
                    title="Measure Angle Between Faces"
                    data-operatorclass="toolbar-measure-angle"
                    className="submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="measure-distance-between-faces"
                    title="Measure Distance Between Faces"
                    data-operatorclass="toolbar-measure-distance"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="measure-edges"
                    title="Measure Edges"
                    data-operatorclass="toolbar-measure-edge"
                    className="submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="measure-point-to-point"
                    title="Measure Point to Point"
                    data-operatorclass="toolbar-measure-point"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="select-parts"
                    title="Select Parts"
                    data-operatorclass="toolbar-select"
                    className="submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="area-select"
                    title="Area Select"
                    data-operatorclass="toolbar-area-select"
                    className="submenu-icon"
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Explode slider */}
        <div id="explode-slider" className="toolbar-submenu slider-menu submenus">
          <div id="explosion-slider" style={{ height: '90px' }} className="toolbar-slider"></div>
        </div>

        {/* Cutting plane submenu */}
        <div id="cuttingplane-submenu" className="toolbar-submenu cutting-plane submenus no-modal">
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    id="cuttingplane-face"
                    title="Create Cutting Plane On Selected Face"
                    data-plane="face"
                    data-operatorclass="toolbar-cuttingplane-face"
                    className="toolbar-cp-plane submenu-icon disabled"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="cuttingplane-x"
                    title="Cutting Plane X"
                    data-plane="x"
                    data-operatorclass="toolbar-cuttingplane-x"
                    className="toolbar-cp-plane submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="cuttingplane-section"
                    title="Cutting Plane Visibility Toggle"
                    data-plane="section"
                    data-operatorclass="toolbar-cuttingplane-section"
                    className="toolbar-cp-plane submenu-icon disabled"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="cuttingplane-y"
                    title="Cutting Plane Y"
                    data-plane="y"
                    data-operatorclass="toolbar-cuttingplane-y"
                    className="toolbar-cp-plane submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="cuttingplane-toggle"
                    title="Cutting Plane Section Toggle"
                    data-plane="toggle"
                    data-operatorclass="toolbar-cuttingplane-toggle"
                    className="toolbar-cp-plane submenu-icon disabled"
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id="cuttingplane-z"
                    title="Cutting Plane Z"
                    data-plane="z"
                    data-operatorclass="toolbar-cuttingplane-z"
                    className="toolbar-cp-plane submenu-icon"
                  ></div>
                </td>
                <td>
                  <div
                    id="cuttingplane-reset"
                    title="Cutting Plane Reset"
                    data-plane="reset"
                    data-operatorclass="toolbar-cuttingplane-reset"
                    className="toolbar-cp-plane submenu-icon disabled"
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Toolbar; 