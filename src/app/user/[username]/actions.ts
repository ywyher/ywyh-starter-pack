'use server'

import db from "@/lib/db"
import { eq } from "drizzle-orm"
import { User, user } from "@/lib/db/schema"

export async function getProfileUser({ username }: { username: User['name'] }) {
  const [data] = await db.select().from(user)
    .where(eq(user.name, username))

  return data
}