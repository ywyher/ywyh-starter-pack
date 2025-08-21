import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    APP_URL: z.url(),
    ENV: z.enum(['DEVELOPMENT', 'PRODUCTION']),
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    ALLOW_ANONYMOUS_USERS: z.enum(["true", "false"]).transform(v => v === "true"),
    STORAGE_PROVIDER: z.enum(["s3", "catbox"]),
    
    S3_TOKEN_VALUE: z.string().min(1).optional().superRefine((val, ctx) => {
      if (process.env.STORAGE_PROVIDER === "s3" && !val) {
        ctx.addIssue({
          code: "custom",
          message: "S3_TOKEN_VALUE is required when STORAGE_PROVIDER is 's3'",
        });
      }
    }),
    S3_ACCOUNT_ID: z.string().min(1).optional().superRefine((val, ctx) => {
      if (process.env.STORAGE_PROVIDER === "s3" && !val) {
        ctx.addIssue({
          code: "custom",
          message: "S3_ACCOUNT_ID is required when STORAGE_PROVIDER is 's3'",
        });
      }
    }),
    S3_ACCESS_KEY_ID: z.string().min(1).optional().superRefine((val, ctx) => {
      if (process.env.STORAGE_PROVIDER === "s3" && !val) {
        ctx.addIssue({
          code: "custom",
          message: "S3_ACCESS_KEY_ID is required when STORAGE_PROVIDER is 's3'",
        });
      }
    }),
    S3_SECRET_ACCESS_KEY: z.string().min(1).optional().superRefine((val, ctx) => {
      if (process.env.STORAGE_PROVIDER === "s3" && !val) {
        ctx.addIssue({
          code: "custom",
          message: "S3_SECRET_ACCESS_KEY is required when STORAGE_PROVIDER is 's3'",
        });
      }
    }),
    S3_BUCKET_NAME: z.string().min(1).optional().superRefine((val, ctx) => {
      if (process.env.STORAGE_PROVIDER === "s3" && !val) {
        ctx.addIssue({
          code: "custom",
          message: "S3_BUCKET_NAME is required when STORAGE_PROVIDER is 's3'",
        });
      }
    }),
    
    CATBOX_API: z.url().optional().superRefine((val, ctx) => {
      if (process.env.STORAGE_PROVIDER === "catbox" && !val) {
        ctx.addIssue({
          code: "custom",
          message: "CATBOX_API is required when STORAGE_PROVIDER is 'catbox'",
        });
      }
    }),
    CATBOX_USER_HASH: z.string().min(1).optional().superRefine((val, ctx) => {
      if (process.env.STORAGE_PROVIDER === "catbox" && !val) {
        ctx.addIssue({
          code: "custom",
          message: "CATBOX_USER_HASH is required when STORAGE_PROVIDER is 'catbox'",
        });
      }
    }),
    
    RESEND_FROM_EMAIL: z.email().optional(),
    RESEND_API_KEY: z.string().optional(),
  },
  experimental__runtimeEnv: process.env,
});