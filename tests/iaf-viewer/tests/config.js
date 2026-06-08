const requiredEnv = (name, fallback) => {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const E2E_BASE_URL = {
  qa1: 'https://qa1-app.in.invicara.com/reference/#/navigator',
  qa2: 'https://qa2-app.in.invicara.com/reference/#/navigator',
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
  mapboxToken: requiredEnv('IAFVIEWER_MAPBOX_TOKEN'),
  project: 'iputmodelsegmented',
  switchModel: "EX11034-INV-Federated-4.6",
  timeout: {
    short: 15000,
    medium: 60000,
    long: 600000
  }
};
