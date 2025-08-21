import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
    NEXT_PUBLIC_BETTER_AUTH_BASE_URL: z.string().min(1),
    NEXT_PUBLIC_S3_DEV_URL: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_BETTER_AUTH_BASE_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL,
    NEXT_PUBLIC_S3_DEV_URL: process.env.NEXT_PUBLIC_S3_DEV_URL,
  },
});