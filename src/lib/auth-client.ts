import {
  anonymousClient,
  emailOTPClient,
  genericOAuthClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";
import { env } from "@/lib/env/client";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL,
  plugins: [
    genericOAuthClient(),
    emailOTPClient(),
    anonymousClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});

export const { signIn, signUp, useSession, getSession } = createAuthClient();
