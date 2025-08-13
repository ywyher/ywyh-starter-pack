import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    APP_URL: z.url(),
    ENV: z.enum(['DEVELOPMENT', 'PRODUCTION']),
    DATABASE_URL: z.url(),

    BETTER_AUTH_SECRET: z.string().min(1),

    RESEND_FROM_EMAIL: z.email().optional(),
    RESEND_API_KEY: z.string().optional(),
  },
  experimental__runtimeEnv: process.env,
});