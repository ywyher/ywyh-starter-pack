"use server";

import { eq } from "drizzle-orm";
import db from "@/lib/db";
import { type User, user } from "@/lib/db/schema";

export async function getProfileUser({ username }: { username: User["name"] }) {
  const [data] = await db.select().from(user).where(eq(user.name, username));

  return data;
}
