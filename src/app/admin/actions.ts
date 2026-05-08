"use server";

import db from "@/lib/db";
import { user } from "@/lib/db/schema";

export async function getUsers() {
  return await db
    .select({
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      isAnonymous: user.isAnonymous,
      emailVerified: user.emailVerified,
      banned: user.banned,
      banReason: user.banReason,
      banExpires: user.banExpires,
      createdAt: user.createdAt,
    })
    .from(user);
}
