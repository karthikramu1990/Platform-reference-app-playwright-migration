import React, { useEffect, useState } from 'react';
import { IafResourceUtils } from '../../../core/IafResourceUtils.js';

export const HoopsViewer = ({viewer, visible = false, iafViewer = null}) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const init = async () => {
      try {
        await IafResourceUtils.loadModelTreeResources(iafViewer)
        var uiConfig = {
          containerId: "content",
          screenConfiguration: window.Communicator.ScreenConfiguration.Desktop,
          showModelBrowser: true,
          showToolbar: false,
        };
        new window.Communicator.Ui.Desktop.DesktopUi(viewer, uiConfig);
        setIsReady(true);
      } catch (error) {
        console.error('Error loading model tree resources. SceneGraph UI will not be initialized:', error);
      }
    }
    init();
  }, []);
  
  const containerStyle = {
    pointerEvents: isReady && visible ? 'auto' : 'none',
    visibility: isReady && visible ? 'visible' : 'hidden',
  };

  return (
    <div id="content" style={containerStyle}>
    </div>
  );
};