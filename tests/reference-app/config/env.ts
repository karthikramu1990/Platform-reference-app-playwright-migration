import fs from 'fs';
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

// In the new-user regression run (playwright.new-user.config.ts) the specs sign in as the user its
// setup stage created, read from NEWUSER_STATE_FILE when they ask for the credentials.
function newUser(): { email: string; password: string } | undefined {
  const file = process.env.NEWUSER_STATE_FILE;
  return file && fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : undefined;
}

export const credentials = {
  get username(): string {
    return newUser()?.email ?? requiredEnv(`REFAPP_USERNAME_${envSuffix}`, 'REFAPP_USERNAME');
  },
  get password(): string {
    return newUser()?.password ?? requiredEnv(`REFAPP_PASSWORD_${envSuffix}`, 'REFAPP_PASSWORD');
  },
};

export const mapboxSecretToken = (): string => requiredEnv('REFAPP_MAPBOX_SECRET');
