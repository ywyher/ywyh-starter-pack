import "dotenv/config";
import { type Config, defineConfig } from "drizzle-kit";
import { env } from "@/lib/env/server";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  // This is important for handling custom types like enums
  verbose: true,
  strict: true,
}) satisfies Config;
