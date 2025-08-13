import db from "@/lib/db";
import * as schema from '@/lib/db/schema/index'
import { env } from "@/lib/env/server";
import { emailOTP } from "better-auth/plugins/email-otp";
import { betterAuth } from "better-auth";
import { APIError } from 'better-auth/api'
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

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
        const res = await fetch(
          `${env.APP_URL}/api/auth/forget-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              url: url,
            }),
          },
        );

        if(!res.ok) throw new Error(res.statusText)

        return;
      } catch (error) {
        throw new APIError("BAD_GATEWAY", {
          message: "Failed to send reset password email"
        });
      }
    },
  },
  plugins: [
    emailOTP({ 
      async sendVerificationOTP({ email, otp, type }) { 
        if (type === "email-verification") {
          try {
            const res = await fetch(
              `${env.APP_URL}/api/auth/otp`,
              {  
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
              },
            );

            if(!res.ok) throw new Error(res.statusText)

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
    nextCookies()
  ]
})