import 'dotenv/config';
import * as schema from "./schema";
import { env } from '@/lib/env/server';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(env.DATABASE_URL!, {
  schema,
  logger: true
});

export default db;