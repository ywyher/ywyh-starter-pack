import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/lib/env/server";
import * as schema from "./schema";

const db = drizzle(env.DATABASE_URL, {
  schema,
  logger: true,
});

export default db;
