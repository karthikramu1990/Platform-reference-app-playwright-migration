export const GisElevationMode = {
  Surface: 1,
  Blend: 2,
  Underground: 3,
  QuickSurface: 4,
  QuickUnderground: 5,

  None: 100
};

export const GisElevationModeLabel = {
  Surface: "Surface View",
  Blend: "Mixed View",
  Underground: "Subsurface View",
  QuickSurface: "Quick Flat Surface View",
  QuickUnderground: "Quick Flat Subsurface View",

  None: "None"
}

export const getElevationModeLabel = (mode) => {
  let label = GisElevationModeLabel.None;
  switch (mode) {
    case GisElevationMode.Surface:
      label = GisElevationModeLabel.Surface;
      break;

    case GisElevationMode.Blend:
      label = GisElevationModeLabel.Blend;
      break;

    case GisElevationMode.Underground:
      label = GisElevationModeLabel.Underground;
      break;

    case GisElevationMode.QuickSurface:
      label = GisElevationModeLabel.QuickSurface;
      break;

    case GisElevationMode.QuickUnderground:
      label = GisElevationModeLabel.QuickUnderground;
      break;
  }
  return label;
}

export const GisFederatedMode = {
  None: 0,
  /** Federated outline mode: GLTF outline layers on the map (numeric value 1). */
  Outline: 1,
  Hybrid: 2,
  Dynamic: 3,
  Markers: 4,
};

export const GisFederatedModeLabel = {
  None: "None",
  Outline: "Outline",
  Hybrid: "Hybrid",
  Dynamic: "Dynamic",
  Markers: "Markers"
}

export const getFederatedModeLabel = (mode) => {
  let label = GisFederatedModeLabel.None;
  switch (mode) {
    case GisFederatedMode.None:
      label = GisFederatedModeLabel.None;
      break;

    case GisFederatedMode.Outline:
      label = GisFederatedModeLabel.Outline;
      break;

    case GisFederatedMode.Hybrid:
      label = GisFederatedModeLabel.Hybrid;
      break;

    case GisFederatedMode.Dynamic:
      label = GisFederatedModeLabel.Dynamic;
      break;

    case GisFederatedMode.Markers:
      label = GisFederatedModeLabel.Markers;
      break;
  }
  return label;
}