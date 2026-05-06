/**
 * ****************************************************************************
 *
 * INVICARA INC CONFIDENTIAL __________________
 *
 * Copyright (C) [2012] - [2020] INVICARA INC, INVICARA Pte Ltd, INVICARA INDIA
 * PVT LTD All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of
 * Invicara Inc and its suppliers, if any. The intellectual and technical
 * concepts contained herein are proprietary to Invicara Inc and its suppliers
 * and may be covered by U.S. and Foreign Patents, patents in process, and are
 * protected by trade secret or copyright law. Dissemination of this information
 * or reproduction of this material is strictly forbidden unless prior written
 * permission is obtained from Invicara Inc.
 */

// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 05-06-23    ATK        PLAT-2816   HC 2023 SP1 Update - serverVersion = 4
//                                    Dependencies updated in InvicaraAppFramework/packages/iaf-viewer/src/lib
// 28-Nov-23   ATK        PLAT-3585   Productise 2D Sheets CSDL. defaultViewIndex.
// -------------------------------------------------------------------------------------

import IafUtils from '../core/IafUtils';
import ServerConnection from './ServerConnection'
import { IafWebSocketTracker } from '../core/IafWebSocketTracker.js';
import { getCompositeFileName } from '../core/IsomorphicFileUtils.js';
import { IafGraphicsSvc } from '@dtplatform/platform-api';
// import IafUtils from './common/IafUtils';

class ViewerManager {

  filesLength = (fileSet) => {
    return fileSet._files.length;
  }

  // buildFileName = (model, fileSet, index) => {
  //   let fileName = fileSet && _.size(fileSet._files) > index ? fileSet._files[index]._fileName : model._name + '.scz';
  //   console.log ('ViewerManager.buildFileName'
  //     , '/fileName', fileName
  //   );
  //   return fileName;
  // }

  // loadGraphicsResourceByIndex = async (model, fileSet, index, delay) => {
  //   await IafUtils.sleep(10000);

  //   console.log ('ViewerManager.loadGraphicsResourceByIndex', index, 'of', fileSet._files.length - 1);
  //   let fileName = this.buildFileName(model, fileSet, index);
  //   let subNodeId = model.getAbsoluteRootNode();//model.createNode(model.getAbsoluteRootNode(), fileName);
  //   let subRootNodeId;
  //   try {
  //     subRootNodeId = await model.loadSubtreeFromModel(subNodeId, fileName);
  //     console.log ('ViewerManager.loadGraphicsResourceByIndex complete for', fileName
  //       , '/subNodeId', subNodeId
  //       , '/subRootNodeId', subRootNodeId
  //       , '/fileName', fileName
  //       , '/subRootNodeIdOffset', model.getNodeIdOffset(subRootNodeId)
  //     );  
  //   } catch (error) {
  //     console.log ('ViewerManager.loadGraphicsResourceByIndex failed for', fileName
  //       , '/fileName', fileName
  //       , '/subNodeId', subNodeId
  //       , error
  //     );  
  //   }

  //   return subRootNodeId;
  // }

  async createRemoteViewer(containerId, model, fileSet , authToken, wsUri, streamCutoffScale, defaultViewIndex, isSingleWsEnabled = false, usePresignedUrl = true, iafViewer = null) {
    let uri;

    // Check state flags from iafViewer if provided
    const enablePreSignedUrls = iafViewer?.state?.enablePreSignedUrls ?? true; // Default: true
    // Override usePresignedUrl if state flag is disabled
    const shouldUsePresignedUrl = usePresignedUrl && enablePreSignedUrls;

    IafUtils.devToolsIaf && console.log('ViewerManager.createRemoteViewer', 
      'usePresignedUrl:', usePresignedUrl,
      'enablePreSignedUrls (from state):', enablePreSignedUrls,
      'shouldUsePresignedUrl:', shouldUsePresignedUrl,
      'wsUri:', wsUri,
      'streamCutoffScale:', streamCutoffScale,
      'defaultViewIndex:', defaultViewIndex,
      'isSingleWsEnabled:', isSingleWsEnabled,
      'authToken:', authToken,
      'fileSet:', fileSet,
      'model:', model
    );
    
    // Try to use presigned URL if enabled and IafGraphicsSvc is available
    if (shouldUsePresignedUrl) {
      try {
        const ctx = {
          authToken: authToken,
          nsfilter: model._namespaces && model._namespaces.length > 0 ? model._namespaces[0] : undefined,
          serverVersion: '4',
          isSingleWsEnabled: isSingleWsEnabled
        };
        IafUtils.devToolsIaf && console.log('ViewerManager.createRemoteViewer', 'Getting presigned WebSocket URL for fileSetId:', fileSet._id);
        uri = await IafGraphicsSvc.getWebSocketUrl(fileSet._id, ctx);
        IafUtils.devToolsIaf && console.log('ViewerManager.createRemoteViewer', 'Using presigned WebSocket URL:', uri.substring(0, 100) + '...');
      } catch (error) {
        console.warn('ViewerManager.createRemoteViewer', 'Failed to get presigned WebSocket URL, falling back to token-based auth:', error);
        // Fall back to token-based URL construction
        uri = wsUri + '/graphicssvc?fileSetId=' + fileSet._id +
          '&nsfilter=' + model._namespaces[0] +
          '&token=' + authToken + '&serverVersion=4' + '&isSingleWsEnabled=' + isSingleWsEnabled;
      }
    } else {
      // Use token-based URL construction (backward compatibility)
      uri = wsUri + '/graphicssvc?fileSetId=' + fileSet._id +
        '&nsfilter=' + model._namespaces[0] +
        '&token=' + authToken + '&serverVersion=4' + '&isSingleWsEnabled=' + isSingleWsEnabled;
    }

    // let fileName = fileSet && _.size(fileSet._files) > 0 ? fileSet._files[0]._fileName : model._name + '.scz'
    let fileName = IafUtils.buildFileName(model, fileSet, defaultViewIndex ? defaultViewIndex : 0);
    const file = fileSet._files[0];

    // Derive graphicssvc scripts base so engine-wasm.js loads from communicator, not mapbox (PLAT-*)
    let enginePath = null;
    try {
      const url = new URL(uri);
      const proto = url.protocol === 'wss:' ? 'https:' : url.protocol === 'ws:' ? 'http:' : url.protocol;
      const pathMatch = url.pathname.match(/^(.*\/graphicssvc)/);
      const pathPart = pathMatch ? pathMatch[1] : '/graphicssvc';
      enginePath = `${proto}//${url.host}${pathPart}/scripts/communicator`;
    } catch (_e) {
      // fallback: assume wsUri is base (e.g. https://host)
      const base = (typeof wsUri === 'string' && wsUri.replace(/^ws:/, 'http:').replace(/^wss:/, 'https:')) || '';
      enginePath = base ? `${base.replace(/\/$/, '')}/graphicssvc/scripts/communicator` : null;
    }

    let viewerPromise = new Promise((resolve) => {
      let params = {
        containerId: containerId,
        streamMode: window.Communicator.StreamingMode.All,
        rendererType: window.Communicator.RendererType.Client,
        streamCutoffScale: streamCutoffScale,
        //memoryLimit: 512,
        //empty: true
        endpointUri: uri,
        boundingPreviewMode: Communicator.BoundingPreviewMode.None,
        // model: window.Communicator.EmptyModelName//model._name + '.scz'
        model: isSingleWsEnabled ? getCompositeFileName(fileName, file._fileVersionId) : fileName
      };
      if (enginePath) {
        params.enginePath = enginePath;
      }
      IafUtils.devToolsIaf && console.log('ViewerManager.createRemoteViewer', params);


      // PLG-1263: EVM 1.0 - Multiple instances of IafViewer - Hack to wait for div to be created
      IafUtils.waitForElement(containerId).then ((container) => {
        let _viewer = new window.Communicator.WebViewer(params);
        
        if (IafUtils.debugIaf) {
          // Store metadata for WebSocket tracking (will be picked up by global interceptor)
          _viewer._trackingMetadata = {
            containerId,
            fileSetId: fileSet._id,
            modelName: model._name,
            viewerType: '3D',
            endpointUri: uri
          };
        }
        
        _viewer.start();
        resolve(_viewer);
      })
    })
      
    return viewerPromise;
  }

  //deprecated and may not work
  createLocalViewer(containerId, modelName, fileItem, authToken, localService) {
    // By making this a promise, we can make sure the websocket with the HOOPS Server is
    // established before trying to change the viewer state or make further API calls
    let viewerPromise = new Promise((resolve) => {
      let server = new ServerConnection(localService);
      server.connect().then(function () {

        let _viewer = new window.Communicator.WebViewer({
          containerId: containerId,
          streamMode: window.Communicator.StreamingMode.Interactive,
          rendererType: window.Communicator.RendererType.Client,
          //memoryLimit: 512,
          //empty: true
          endpointUri: server._endpointuri,
          model: modelName
        });
        _viewer.start();
        resolve(_viewer);

      })


    });
    return viewerPromise;
  }

  //modelUri is probably appRoot/models/*.scs
  createSCSViewer(containerId, modelUri) {

    // By making this a promise, we can make sure the websocket with the HOOPS Server is
    // established before trying to change the viewer state or make further API calls
    let viewerPromise = new Promise((resolve) => {
      // For use with SCS workflow
      let _viewer = new window.Communicator.WebViewer({
        containerId: containerId,
        //endpointUri: endPointConfig.appRoot+"/models/5SPD_Federated_Model_R16.scs",
        //endpointUri: endPointConfig.appRoot+"/models/5SPD_NS_CS_ACMV_R16.scs"
        //endpointUri: endPointConfig.appRoot+"/ADSKHospitalMetricArchCentral.scs"
        //endpointUri: appRoot+"/models/NCH-Envelop.scs"
        endpointUri: modelUri

        //endpointUri: "ws://localhost:11000",
        //model: "5SPD_Federated_Model_R16"
      });
      _viewer.start();
      resolve(_viewer);

    })

    return viewerPromise;
  }
}

export default ViewerManager;