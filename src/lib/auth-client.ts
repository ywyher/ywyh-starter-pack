import { createAuthClient } from "better-auth/react"
import { emailOTPClient, genericOAuthClient, inferAdditionalFields } from "better-auth/client/plugins"
import { env } from "@/lib/env/client"
import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_BETTER_BASE_URL!,
    plugins: [
        genericOAuthClient(),
        emailOTPClient(),
        inferAdditionalFields<typeof auth>()
    ]
})

export const { signIn, signUp, useSession, getSession } = createAuthClient()

