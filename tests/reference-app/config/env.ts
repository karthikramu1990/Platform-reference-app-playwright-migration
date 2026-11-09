import config from './environments.json';

type EnvKey = keyof typeof config.Environments;
export const activeEnv = (process.env.TEST_ENV as EnvKey) || (config.Env as EnvKey);
export const envConfig = config.Environments[activeEnv];

if (!envConfig) {
  throw new Error(`Unknown environment "${activeEnv}". Valid options: ${Object.keys(config.Environments).join(', ')}`);
}

// Secrets live in .env (gitignored), never in the JSON test data. An environment can use its
// own account via REFAPP_USERNAME_<ENV> / REFAPP_PASSWORD_<ENV>; otherwise the default is used.
function requiredEnv(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  throw new Error(`Missing required environment variable: ${names.join(' or ')} (set it in .env)`);
}

const envSuffix = activeEnv.toUpperCase();

export const credentials = {
  username: requiredEnv(`REFAPP_USERNAME_${envSuffix}`, 'REFAPP_USERNAME'),
  password: requiredEnv(`REFAPP_PASSWORD_${envSuffix}`, 'REFAPP_PASSWORD'),
};

export const mapboxSecretToken = (): string => requiredEnv('REFAPP_MAPBOX_SECRET');
