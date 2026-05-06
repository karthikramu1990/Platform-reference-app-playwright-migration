import { getElevationModeLabel, GisElevationMode, getFederatedModeLabel, GisFederatedMode } from "../../../common/enums/gis";
import { Layers } from "../../../core/gis/layers";
import { Styles } from "../../../core/gis/styles";
import IafUtils from "../../../core/IafUtils";

export const getMapStyles = () => {
  return [
      {
        label: "Styles",
        options: [
          { label: Styles.data.Streets.label, value: Styles.data.Streets.index }
          , { label: Styles.data.SatelliteStreets.label, value: Styles.data.SatelliteStreets.index }
          , { label: Styles.data.Light.label, value: Styles.data.Light.index }
          , { label: Styles.data.Dark.label, value: Styles.data.Dark.index }
          , { label: Styles.data.Outdoors.label, value: Styles.data.Outdoors.index }
        ],
      }
  ];
}

export const getMapLayers = () => {
  const baseOptions = [
    { label: Layers.data.None.label, value: Layers.data.None.index }
    , { label: Layers.data.Buildings.label, value: Layers.data.Buildings.index }
    , { label: Layers.data.Terrains.label, value: Layers.data.Terrains.index }
  ];
  
  // Add Clusters option only if researchIaf is enabled
  if (IafUtils.researchIaf) {
    baseOptions.push({ label: Layers.data.Clusters.label, value: Layers.data.Clusters.index });
  }
  
  return [
      {
        label: "Layers",
        options: baseOptions
      }
  ];  
}

export const getMapElevationModes = () => {
  return [
    {
      label: "Display Mode",
      options: [
        { label: getElevationModeLabel(GisElevationMode.None), value: GisElevationMode.None},
        { label: getElevationModeLabel(GisElevationMode.QuickSurface), value: GisElevationMode.QuickSurface}
        , {label: getElevationModeLabel(GisElevationMode.QuickUnderground), value: GisElevationMode.QuickUnderground}
        , { label: getElevationModeLabel(GisElevationMode.Surface), value: GisElevationMode.Surface}
        , {label: getElevationModeLabel(GisElevationMode.Blend), value: GisElevationMode.Blend}
        , {label: getElevationModeLabel(GisElevationMode.Underground), value: GisElevationMode.Underground}
      ]  
    }
  ];  
}

export const getFederatedModes = () => {
  return [
    { label: getFederatedModeLabel(GisFederatedMode.None), value: GisFederatedMode.None },
    { label: getFederatedModeLabel(GisFederatedMode.Outline), value: GisFederatedMode.Outline },
    // { label: getFederatedModeLabel(GisFederatedMode.Hybrid), value: GisFederatedMode.Hybrid },
    { label: getFederatedModeLabel(GisFederatedMode.Dynamic), value: GisFederatedMode.Dynamic },
    { label: getFederatedModeLabel(GisFederatedMode.Markers), value: GisFederatedMode.Markers }
  ];
}

  // projects = {
  //   iput: {
  //     center: {
  //       lng: 35.11265293064221,
  //       lat: 28.110576208910658,
  //     },
  //     zoom: 18,
  //     pitch: 0,
  //     bearing: -2
  //   }
  //   , bei: {
  //       center: {
  //         lng: 35.1121003955313,
  //         lat: 28.1109180691141,
  //       },
  //       zoom: 18,
  //       pitch: 0,
  //       bearing: 0
  //   }
  //   , vmwareVista2: {
  //     center: {
  //       lng: 77.59416638888888,
  //       lat: 12.9019444,
  //     },
  //     zoom: 18,
  //     pitch: 0,
  //     bearing: 0
  //   }
  //   // // Test City
  //   // longitude: -77.01978745319784,
  //   // latitude: 38.88971609900137,

  //   // Test Terrain
  //   // longitude: -114.26608,
  //   // latitude: 32.7213,
  // }