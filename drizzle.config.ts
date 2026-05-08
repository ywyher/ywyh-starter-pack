import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";

const isProdEnv = process.env.NODE_ENV === "production";
dotenv.config({ path: isProdEnv ? ".env.production" : ".env.development" });

export default defineConfig({
  out: "./drizzle",
  schema: "../database/src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: temporary
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "__drizzle_migrations",
    schema: "public",
  },
  verbose: true,
  strict: true,
}) satisfies Config;
