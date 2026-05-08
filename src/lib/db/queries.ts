"use server";

import { eq } from "drizzle-orm";
import db from "@/lib/db";
import { user } from "@/lib/db/schema";

export async function getUser({
  field,
  value,
}: {
  field: "id" | "name" | "email";
  value: string;
}) {
  try {
    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user[field], value));

    return {
      user: userData,
      message: "user",
      error: null,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to get user";
    return {
      error: msg,
      message: null,
      user: null,
    };
  }
}
