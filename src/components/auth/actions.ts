"use server"

import db from "@/lib/db";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env/server";
import { User, user } from "@/lib/db/schema";
import { checkSchema } from "@/components/auth/check";
import { AuthIdentifier } from "@/components/auth/auth";

export async function checkEmail({ data, identifier }: { data: z.infer<typeof checkSchema>, identifier: AuthIdentifier }) {
    const [result] = await db.select().from(user)
        .where(eq(identifier == 'email' ? user.email : user.name, data.identifier))

    if(!result) {
        return {
            verified: false,
            exists: false,
            error: "Couldn't tell"
        }
    }

    return {
        verified: result.emailVerified,
        exists: result ? true : false,
        error: null
    }
}

export async function getEmailByUsername(username: User['name']) {
    const [result] = await db.select().from(user)
        .where(eq(user.name, username))

    if(!result) return;

    return result.email
}

export async function getIsAccountVerified(email: string) {
    const [data] = await db.select().from(user)
        .where(eq(user.email, email))

    return data.emailVerified
}

export async function getShouldVerifyEmail() {
    return env.RESEND_API_KEY && env.RESEND_FROM_EMAIL
}