import fs from 'fs';
import { NewUser } from '../pages/SignUpPage';
import { envConfig } from '../config/env';

// The new-user regression run (playwright.new-user.config.ts) passes the user created by the setup
// stage to the regression and teardown stages through this file. NEWUSER_STATE_FILE is set only
// by that config, so a normal regression run never reads it.
export function saveNewUser(user: NewUser): void {
  const file = process.env.NEWUSER_STATE_FILE;
  if (!file) throw new Error('NEWUSER_STATE_FILE is not set; run with playwright.new-user.config.ts');
  fs.writeFileSync(file, JSON.stringify(user, null, 2));
}

export function loadNewUser(): NewUser {
  const file = process.env.NEWUSER_STATE_FILE;
  if (!file || !fs.existsSync(file)) throw new Error('No new user from the setup stage (NEWUSER_STATE_FILE missing)');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// The new user's project has the same name as the environment's regression project, so the specs
// load it unchanged (envConfig.ProjectList / envConfig.UserGroup).
export const newUserProject = {
  name: envConfig.ProjectList,
  shortName: envConfig.ProjectList.toLowerCase().replace(/[^a-z0-9]/g, ''),
  description: 'Project created by the new-user regression run',
};

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name} (set it in .env)`);
  return value;
}

export const consoleWorkspace = {
  organization: 'Digital Twin Platform',
  application: 'PlatformReferenceApp',
  workspace: 'BIAL T2 All Federated',
};

// User group that gives the new user admin access (Create Project) in the Reference App:
// "Application Owner", picked by name so it works in every environment. "Application Developer" does not allow
// creating projects.
export const ADMIN_GROUP = 'Application Owner';
