const requiredEnv = (name, fallback) => {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const E2E_BASE_URL = {
  qa1: 'https://apps.qa1.oci.in.twinit.io/reference/#/',
  qa2: 'https://qa2-app.in.invicara.com/reference/#/navigator',
  qa3: 'https://apps.qa3.oci.in.twinit.io/reference/#/',
  staging3: 'https://apps.staging3.oci.in.twinit.io/reference/#/',
  staging: 'https://staging.invicara.com/reference/#/',
  local: 'http://localhost:8086/referenceapp/#/navigator',
};

const e2eTarget = requiredEnv('IAFVIEWER_ENVIRONMENT', 'local');

if (!E2E_BASE_URL[e2eTarget]) {
  throw new Error(`Invalid IAFVIEWER_ENVIRONMENT: ${e2eTarget}`);
}

export const CONFIG = {
  target: e2eTarget,
  url: E2E_BASE_URL[e2eTarget],

  credentials: {
    email: requiredEnv('IAFVIEWER_INVICARA_USERNAME'),
    password: requiredEnv('IAFVIEWER_INVICARA_PASSWORD'),
  },
  mapboxToken: process.env.IAFVIEWER_MAPBOX_TOKEN ?? '',
  project: 'iputmodelsegmented',
  userGroup: 'iputmodelsegmented Proj Admin',
  switchModel: "EX11034-INV-Federated-4.6",

  federatedModelA: 'EX11034-INV-Federated-4.6',
  federatedModelB: 'EX11034-INV-Federated-4.4',

  skinnyBial: {
    credentials: {
      email: requiredEnv('IAFVIEWER_BIAL_USERNAME'),
      password: requiredEnv('IAFVIEWER_BIAL_PASSWORD'),
    },
    project: 'Skinny_BIAL_AllModels',
    userGroup: 'Skinny_BIAL_AllModels Proj Admin',
    switchModel: 'T2-ELEC-Federated',

    secondSwitchModel: 'T2-HVAC-Federated',

    modelA: 'L&T_CUP_FED_ASBUILT CORE_2024',
    modelB: 'T2-ELEC-Federated',

    badGeometryModel: 'L&T FED EGH ASBUILT_2024-5.1',
  },

  iputNonOptimised: {
    credentials: {
      email: requiredEnv('IAFVIEWER_IPUTNONOPT_USERNAME'),
      password: requiredEnv('IAFVIEWER_IPUTNONOPT_PASSWORD'),
    },
    project: 'iputnonoptimised',
    userGroup: 'iputnonoptimised Proj Admin',
  },

  iput51: {
    credentials: {
      email: requiredEnv('IAFVIEWER_IPUT51_USERNAME'),
      password: requiredEnv('IAFVIEWER_IPUT51_PASSWORD'),
    },
    project: 'iput 5.1',
    userGroup: 'iput 5.1 Proj Admin',
  },

  t2AllFederated: {
    credentials: {
      email: requiredEnv('IAFVIEWER_T2ALLFEDERATED_USERNAME'),
      password: requiredEnv('IAFVIEWER_T2ALLFEDERATED_PASSWORD'),
    },
    project: 'T2_All_Federated',
    userGroup: 'T2_All_Federated Proj Admin',
  },

  // PLG-1690 - GIS enable-on-fresh-project regression; this account's Setup Project flow
  // creates (and each run overwrites) its own throwaway project, then configures its own
  // Mapbox temp token via Manage Model before enabling GIS.
  automationRef: {
    credentials: {
      email: requiredEnv('IAFVIEWER_AUTOMATIONREF_USERNAME'),
      password: requiredEnv('IAFVIEWER_AUTOMATIONREF_PASSWORD'),
    },
    mapbox: {
      username: requiredEnv('IAFVIEWER_AUTOMATIONREF_MAPBOX_USERNAME'),
      scopes: '["tokens:write", "styles:read", "datasets:read", "map:read", "fonts:read"]',
      expiry: '3600',
      secretToken: requiredEnv('IAFVIEWER_AUTOMATIONREF_MAPBOX_SECRET'),
    },
  },

  autocad2D: {
    credentials: {
      email: requiredEnv('IAFVIEWER_AUTOCAD2D_USERNAME'),
      password: requiredEnv('IAFVIEWER_AUTOCAD2D_PASSWORD'),
    },
    project: 'autocad 2D animations',
    userGroup: 'autocad 2D animations Proj Admin',
    workflow: 'WF1',
  },

  timeout: {
    short: 15000,
    medium: 60000,
    long: 600000,
    projectSetup: 4200000
  }
};
