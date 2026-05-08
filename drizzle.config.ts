import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import type { Config } from 'drizzle-kit';

const isProdEnv = process.env.NODE_ENV === 'production';
dotenv.config({ path: isProdEnv ? '.env.production' : '.env.development' });

export default defineConfig({
  out: './drizzle',
  schema: '../database/src/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: '__drizzle_migrations',
    schema: 'public',
  },
  verbose: true,
  strict: true
}) satisfies Config;