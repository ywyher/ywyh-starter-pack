import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin, anonymous, emailOTP } from "better-auth/plugins";
import { defaultAc } from "better-auth/plugins/admin/access";
import db from "@/lib/db";
import * as schema from "@/lib/db/schema/index";
import { env } from "@/lib/env/server";
import { admin as adminRole, moderator, user } from "@/lib/permission";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    sendResetPassword: async ({ url, user }) => {
      try {
        const res = await fetch(`${env.APP_URL}/api/auth/forget-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            url: url,
          }),
        });

        if (!res.ok) throw new Error(res.statusText);

        return;
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : "Failed to send reset password email";
        throw new APIError("BAD_GATEWAY", {
          message: msg,
        });
      }
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["user", "moderator", "admin"],
        required: false,
      },
      banner: {
        type: "string",
        required: false,
      },
      displayName: {
        type: "string",
        required: true,
      },
      isAnonymous: {
        type: "boolean",
        required: false,
      },
      banned: {
        type: "boolean",
        required: false,
      },
      banReason: {
        type: "string",
        required: false,
      },
      banExpires: {
        type: "date",
        required: false,
      },
    },
  },
  plugins: [
    admin({
      defaultAc,
      adminRoles: ["admin", "moderator"],
      roles: {
        admin: adminRole,
        user,
        moderator,
      },
    }),
    anonymous({
      generateName: () => {
        const randomSuffix = Math.random().toString(36).substring(2, 8); // generates random alphanumeric string
        return `anon-${randomSuffix}`;
      },
      disableDeleteAnonymousUser: false,
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          try {
            const res = await fetch(`${env.APP_URL}/api/auth/otp`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, otp }),
            });

            if (!res.ok) throw new Error(res.statusText);

            return;
          } catch (error) {
            console.error("Failed to send OTP:", error);
            throw error;
          }
        }
        return;
      },
      otpLength: 6,
    }),
    nextCookies(),
  ],
});
