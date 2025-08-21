'use server'

import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { user, User } from "@/lib/db/schema";
import { env } from "@/lib/env/server";

export async function ensureAuthenticated() {
    try {
        const headersList = await headers();
        const currentUser = await auth.api.getSession({ headers: headersList });
        
        let userId: string | null;
        let isAnon: boolean = false;
        
        if ((!currentUser || !currentUser.user.id) && env.ALLOW_ANONYMOUS_USERS) {
            const anon = await auth.api.signInAnonymous();
            
            if (!anon?.user?.id) {
                return {
                  userId: null,
                  message: null,
                  isAnon: false,
                  error: "Not authenticated nor were we able to authenticate you as an anonymous user. Please register."
                };
            }
            
            userId = anon.user.id;
            isAnon = true
        } else {
          userId = currentUser?.user.id ?? null;
        }
    
        return {
          userId: userId,
          error: null,
          message: null,
          isAnon
        }
    } catch(error) {
        return {
          userId: null,
          error: error instanceof Error ? error.message : 'Failed to ensure user authentication',
          message: null,
          isAnon: false
        }
    }
}

export async function updateUser({ data, userId }: { data: Partial<User>, userId: User['id'] }) { 
    const [updatedUser] = await db.update(user).set({
        ...data,
        updatedAt: new Date()
    }).where(eq(user.id, userId)).returning({ id: user.id })

    if(!updatedUser.id) {
        return {
          message: null,
          error: "Failed to update user data..."
        }
    }

    return {
      message: "User data updated...",
      error: null
    }
}

export async function deleteUser({ userId }: { userId: User['id'] }) {
    const result = await db.delete(user).where(eq(user.id, userId))


    if(!result) return {
        error: "Couldn't delete account, try again later",
        message: null,
    }

    return {
        message: "Account deleted successfully",
        error: null
    }
}