import 'dotenv/config';
import { env } from '@/lib/env/server';
import { Config, defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
  // This is important for handling custom types like enums
  verbose: true,
  strict: true,
}) satisfies Config;