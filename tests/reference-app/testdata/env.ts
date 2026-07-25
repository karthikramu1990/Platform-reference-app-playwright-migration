import config from './config.json';

type EnvKey = keyof typeof config.Environments;
export const activeEnv = (process.env.TEST_ENV as EnvKey) || (config.Env as EnvKey);
export const envConfig = config.Environments[activeEnv];

if (!envConfig) {
  throw new Error(`Unknown environment "${activeEnv}". Valid options: ${Object.keys(config.Environments).join(', ')}`);
}
