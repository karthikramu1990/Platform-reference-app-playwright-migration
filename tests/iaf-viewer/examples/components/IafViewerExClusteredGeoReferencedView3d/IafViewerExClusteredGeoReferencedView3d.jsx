import React from 'react';
import PropTypes from 'prop-types';
import IafViewerExGeoReferencedView3d from '../IafViewerExGeoReferencedView3d/IafViewerExGeoReferencedView3d';

/** One-line subtitle for IafViewerExamplesView fullscreen header (grid card uses long text in defaultExampleCategories). */
export const IafViewerExClusteredGeoReferencedView3dViewerSubtitle =
  'Geo-referenced 3D with clusteredModels for placement and outlines';

/**
 * Demo clusteredModels for a project: building groups, map centers, and outline clustering.
 * Irrelevant model ids are ignored for models not in the active project.
 */
const DEMO_CLUSTERED_MODELS = [
  {
    ids: ['69857ef69c176d4bc1e756f1'],
    title: 'Garden Pavilion',
    bearing: 180,
    center: { lng: 77.7186736529, lat: 13.1990670531 },
    altitude: 40,
  },
  {
    ids: [
      '6989e7b2c3aa852deb1c8527',
      '698acf7eaab0130f5abec895',
      '69928e8bd372a36f0ed0b549',
    ],
    bearing: 180,
    title: 'T2',
    center: { lng: 77.7160455491, lat: 13.1987226359 },
    altitude: 40,
  },
  {
    ids: ['6992843ad372a36f0ed0b2a2'],
    title: 'CUP',
    bearing: 180,
    center: { lng: 77.712639, lat: 13.196139 },
    altitude: 40,
  },
  {
    ids: ['69954014958e285828157aba'],
    title: 'East Gate House',
    bearing: 180,
    center: { lng: 77.7139044852, lat: 13.200347015 },
    altitude: 10,
  },
];

class IafViewerExClusteredGeoReferencedView3d extends IafViewerExGeoReferencedView3d {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      gis: {
        ...this.state.gis,
        initial: {
          ...this.state.gis.initial,
          zoom: 13,
          pitch: 60,
          bearing: 0
        },
        dynamicRenderingZoom: 13.5,
        dynamicRenderingDistance: 1400,
      },
      modelComposition: {
        ...this.state.modelComposition,
        clusteredModels: DEMO_CLUSTERED_MODELS,
      },
    };
  }

  getGeoRefViewerTitle() {
    return 'IafViewerExClusteredGeoReferencedView3d';
  }

  getGeoRefHeaderTitle() {
    return 'Clustered Geo-Referenced 3D Viewer';
  }

  getGeoRefHeaderSubtitle() {
    return 'Extends the geo-referenced 3D example with modelComposition.clusteredModels (per-cluster center, altitude, bearing; outline / GIS alignment).';
  }
}

IafViewerExClusteredGeoReferencedView3d.propTypes = {
  ...IafViewerExGeoReferencedView3d.propTypes,
};

export default IafViewerExClusteredGeoReferencedView3d;
