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
  // Standing rule: always log in with the Proj Admin user group, i.e.
  // userGroup is always "<project> Proj Admin".
  project: 'iputmodelsegmented',
  userGroup: 'iputmodelsegmented Proj Admin',
  switchModel: "EX11034-INV-Federated-4.6",

  // PLG-1471 - BIAL T2 large-project performance/console-error regression.
  // Separate account + project from the default credentials/project above.
  skinnyBial: {
    credentials: {
      email: requiredEnv('IAFVIEWER_BIAL_USERNAME'),
      password: requiredEnv('IAFVIEWER_BIAL_PASSWORD'),
    },
    project: 'Skinny_BIAL_AllModels',
    userGroup: 'Skinny_BIAL_AllModels Proj Admin',
    switchModel: 'T2-ELEC-Federated',
  },

  // PLG-1417 - "Review 2D Animations" support ticket. The Workflow (2D
  // Animation) screen is only visible to Proj Admin user groups.
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
    long: 600000
  }
};
