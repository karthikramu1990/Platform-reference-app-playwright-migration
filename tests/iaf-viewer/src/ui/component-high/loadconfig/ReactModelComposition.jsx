/**
 * Renders model composition per resource: one ReactLoadConfig for the primary
 * graphicsResources and one per external model resource. Consumed by NewToolbar.
 */

import React from "react";
import ReactLoadConfig from "./loadconfig.jsx";

export default class ReactModelComposition extends React.Component {
  render() {
    const {
      iafViewer,
      panelCount,
      ToolbarIcons,
      enableLoadConfig,
      handleEnableLoadConfig,
      camera,
      globalShowContent,
      globalShowContentMethod,
      primaryShowContent,
      primaryShowContentMethod,
      showContentExternal,
      showContentMethodExternal,
      cameraPan,
      onClose,
      color,
      canAccess,
      canDeleteAccess,
    } = this.props;

    if (!iafViewer?.state?.isShowLoadConfig) return null;

    const gr = iafViewer.props.graphicsResources;
    const externalResources = gr?.externalModelResources || [];

    return (
      <>
        <ReactLoadConfig
          key="modelCompositionSettings"
          id="modelCompositionSettings"
          title="Model Composition"
          iafViewer={iafViewer}
          showContent={globalShowContent}
          showContentMethod={globalShowContentMethod}
          enableConfig={true}
          camera={camera}
          onClose={onClose}
          color={color}
          canAccess={canAccess}
          canDeleteAccess={canDeleteAccess}
        />
        {gr && (
          <>
            <ReactLoadConfig
              key={gr.dbModel._id}
              id={gr.dbModel._id}
              title={gr.dbModel._name}
              graphicsResources={gr}
              graphicsResources2d={iafViewer.props.graphicsResources2d}
              panelCount={panelCount}
              ToolbarIcons={ToolbarIcons}
              enableLoadConfig={enableLoadConfig}
              handleEnableLoadConfig={handleEnableLoadConfig}
              iafViewer={iafViewer}
              camera={camera}
              showContent={primaryShowContent}
              showContentMethod={primaryShowContentMethod}
              enableDesigner={true}
              cameraPan={cameraPan}
              onClose={onClose}
              color={color}
              canAccess={canAccess}
              canDeleteAccess={canDeleteAccess}
            />
            {externalResources.map((externalModelResource) => {
              const id = externalModelResource.graphicsResource.dbModel._id;
              const showContent = showContentExternal?.[id] ?? showContentExternal?.get?.(id);
              return (
                <ReactLoadConfig
                  key={id}
                  id={id}
                  title={externalModelResource.graphicsResource.dbModel._name}
                  graphicsResources={externalModelResource.graphicsResource}
                  graphicsResources2d={externalModelResource.graphicsResource2d}
                  panelCount={panelCount}
                  ToolbarIcons={ToolbarIcons}
                  enableLoadConfig={enableLoadConfig}
                  handleEnableLoadConfig={handleEnableLoadConfig}
                  iafViewer={iafViewer}
                  camera={camera}
                  enableDesigner={true}
                  showContent={showContent}
                  showContentMethod={(_, flag) => showContentMethodExternal?.(id, flag)}
                  cameraPan={cameraPan}
                  onClose={onClose}
                  color={color}
                  canAccess={canAccess}
                  canDeleteAccess={canDeleteAccess}
                />
              );
            })}
          </>
        )}
      </>
    );
  }
}
