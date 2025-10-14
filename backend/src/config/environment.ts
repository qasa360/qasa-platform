import fs from 'node:fs';
import path from 'node:path';
import { config as loadEnv } from 'dotenv';

const activeEnv = process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development';
const candidateFiles = [
  `.env.${activeEnv}.local`,
  `.env.${activeEnv}`,
  '.env.local',
  '.env'
];

for (const fileName of candidateFiles) {
  const fullPath = path.resolve(process.cwd(), fileName);
  if (fs.existsSync(fullPath)) {
    loadEnv({ path: fullPath });
  }
}

export const environment = {
  name: activeEnv,
  isProduction: activeEnv === 'production',
  isDevelopment: activeEnv === 'development',
  isTest: activeEnv === 'test'
} as const;
