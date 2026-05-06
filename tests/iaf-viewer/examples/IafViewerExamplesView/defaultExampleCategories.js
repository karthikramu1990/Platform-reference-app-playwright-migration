import React from 'react';
import { IafViewerExUeStandaloneViewer, IafViewerExArcgisStandaloneViewer, IafViewerExMapboxStandalone, IafViewerExGeoReferencedView3d, IafViewerExClusteredGeoReferencedView3d, IafViewerExGISProjectView } from '../index';
import { CODE_CONTENT as IafViewerExUeStandaloneViewerCodeContent } from '../components/IafViewerExUeStandaloneViewer/codeContent';
import { CODE_CONTENT as IafViewerExArcgisStandaloneViewerCodeContent } from '../components/IafViewerExArcgisStandaloneViewer/codeContent';
import { CODE_CONTENT as IafViewerExMapboxStandaloneCodeContent } from '../components/IafViewerExMapboxStandalone/codeContent';
import { CODE_CONTENT as IafViewerExGeoReferencedView3dCodeContent } from '../components/IafViewerExGeoReferencedView3d/codeContent';
import { CODE_CONTENT as IafViewerExClusteredGeoReferencedView3dCodeContent } from '../components/IafViewerExClusteredGeoReferencedView3d/codeContent';
import { IafViewerExGeoReferencedView3dViewerSubtitle } from '../components/IafViewerExGeoReferencedView3d/IafViewerExGeoReferencedView3d';
import { IafViewerExClusteredGeoReferencedView3dViewerSubtitle } from '../components/IafViewerExClusteredGeoReferencedView3d/IafViewerExClusteredGeoReferencedView3d';
import { CODE_CONTENT as IafViewerExGISProjectViewCodeContent } from '../components/IafViewerExGISProjectView/codeContent';

/**
 * Default example categories for IafViewerExamplesView
 * This can be overridden by passing exampleCategories prop
 */
export const getDefaultExampleCategories = () => [
  {
    title: "Default View",
    description: "Default view of the model",
    examples: [
      {
        id: "default-navigator",
        title: "Default Navigator",
        description: "Navigate to the default navigator view",
        category: "Navigator",
        tags: ["navigator", "default"],
        navigateTo: "/navigator?examplesView=false"
      }
    ]
  },
  {
    title: "Gis(Mapbox) Examples",
    description: "Geospatial visualization with Mapbox GIS",
    examples: [
      {
        id: "mapbox-standalone",
        title: "Mapbox Standalone",
        description: "Displays a Mapbox GIS map. Only GIS viewer is enabled.",
        category: "Gis(Mapbox)",
        tags: ["mapbox"],
        component: <IafViewerExMapboxStandalone showConfigPanel={true} />,
        isViewerExample: true,
        codeContent: IafViewerExMapboxStandaloneCodeContent
      },
      {
        id: "gis-project-view",
        title: "GIS Project View",
        description:
          "Mapbox GIS with project clustered models and federated Outline mode. Extends the Mapbox standalone example.",
        category: "Gis(Mapbox)",
        tags: ["mapbox", "project", "federation"],
        component: <IafViewerExGISProjectView showConfigPanel={true} />,
        isViewerExample: true,
        codeContent: IafViewerExGISProjectViewCodeContent
      },
      {
        id: "georef-view3d",
        title: "Geo (Mapbox) Referenced View 3D",
        description:
          "Displays 3D models on a Mapbox GIS map with geo-referencing. Both GIS and 3D viewer are enabled. Uses every model in the current project (no clusteredModels filter).",
        viewerSubtitle: IafViewerExGeoReferencedView3dViewerSubtitle,
        category: "Gis(Mapbox)",
        tags: ["view3d", "mapbox"],
        component: <IafViewerExGeoReferencedView3d showConfigPanel={true} />,
        isViewerExample: true,
        codeContent: IafViewerExGeoReferencedView3dCodeContent
      },
      {
        id: "georef-clustered-view3d",
        title: "Clustered Geo (Mapbox) Referenced View 3D",
        description:
          "Like Geo-Referenced View 3D, but modelComposition.clusteredModels defines which models participate: only IDs listed in clusters are used, with per-cluster center, altitude, and bearing for GIS alignment and outline clustering. Dynamic federation LOD uses global gis.dynamicRenderingDistance and gis.dynamicRenderingZoom only.",
        viewerSubtitle: IafViewerExClusteredGeoReferencedView3dViewerSubtitle,
        category: "Gis(Mapbox)",
        tags: ["view3d", "mapbox", "clusteredModels", "federation"],
        component: <IafViewerExClusteredGeoReferencedView3d showConfigPanel={true} />,
        isViewerExample: true,
        codeContent: IafViewerExClusteredGeoReferencedView3dCodeContent
      }
    ]
  },
  {
    title: "Unreal Engine Examples",
    description: "High-fidelity 3D rendering with UE",
    examples: [
      {
        id: "ue-standalone",
        title: "Standalone UE Viewer",
        description: "Minimal implementation with only UE rendering",
        category: "UE",
        tags: ["ue", "standalone"],
        component: <IafViewerExUeStandaloneViewer showConfigPanel={true} />,
        isViewerExample: true,
        codeContent: IafViewerExUeStandaloneViewerCodeContent
      },
      {
        id: "ue-with-arcgis",
        title: "UE with ArcGIS",
        description: "UE viewer with ArcGIS map integration",
        category: "UE",
        tags: ["ue", "arcgis"],
        disabled: true
      },
      {
        id: "ue-with-overview",
        title: "UE with ArcGIS Overview",
        description: "UE viewer with ArcGIS overview map",
        category: "UE",
        tags: ["ue", "arcgis-overview"],
        disabled: true
      },
      {
        id: "ue-with-photosphere",
        title: "UE with Photosphere",
        description: "UE viewer with photosphere for interior views",
        category: "UE",
        tags: ["ue", "photosphere"],
        disabled: true
      },
      {
        id: "ue-full-integration",
        title: "UE Full Integration",
        description: "Complete integration with UE, ArcGIS, Overview, and Photosphere",
        category: "UE",
        tags: ["ue", "arcgis", "arcgis-overview", "photosphere"],
        disabled: true
      }
    ]
  },
  {
    title: "ArcGIS Examples",
    description: "Geospatial visualization with ArcGIS",
    examples: [
      {
        id: "arcgis-standalone",
        title: "Standalone ArcGIS",
        description: "Minimal implementation with only ArcGIS rendering",
        category: "ArcGIS",
        tags: ["arcgis", "standalone"],
        component: <IafViewerExArcgisStandaloneViewer showConfigPanel={true} />,
        isViewerExample: true,
        codeContent: IafViewerExArcgisStandaloneViewerCodeContent
      },
      {
        id: "arcgis-with-overview",
        title: "ArcGIS with Overview",
        description: "ArcGIS viewer with overview map for context",
        category: "ArcGIS",
        tags: ["arcgis", "arcgis-overview"],
        disabled: true
      },
      {
        id: "arcgis-with-ue",
        title: "ArcGIS with UE",
        description: "ArcGIS viewer with Unreal Engine integration",
        category: "ArcGIS",
        tags: ["arcgis", "ue"],
        disabled: true
      },
      {
        id: "arcgis-with-overview-and-ue",
        title: "ArcGIS with Overview and UE",
        description: "Complete ArcGIS integration with overview and UE",
        category: "ArcGIS",
        tags: ["arcgis", "arcgis-overview", "ue"],
        disabled: true
      },
      {
        id: "arcgis-with-photosphere",
        title: "ArcGIS with Photosphere",
        description: "ArcGIS viewer with photosphere for interior views",
        category: "ArcGIS",
        tags: ["arcgis", "photosphere"],
        disabled: true
      },
      {
        id: "arcgis-full-integration",
        title: "ArcGIS Full Integration",
        description: "Complete integration with all components",
        category: "ArcGIS",
        tags: ["arcgis", "arcgis-overview", "ue", "photosphere"],
        disabled: true
      }
    ]
  },
  {
    title: "Photosphere Examples",
    description: "360° panoramic viewing",
    examples: [
      {
        id: "photosphere-standalone",
        title: "Standalone Photosphere",
        description: "Minimal implementation with only photosphere rendering",
        category: "Photosphere",
        tags: ["photosphere", "standalone"],
        disabled: true
      }
    ]
  },
  {
    title: "Other Examples",
    description: "Additional viewer examples",
    examples: [
      {
        id: "model-comparison",
        title: "Model Comparison",
        description: "Compare two models side-by-side",
        category: "View3D",
        tags: ["view3d", "comparison"],
        disabled: true
      }
    ]
  }
];

