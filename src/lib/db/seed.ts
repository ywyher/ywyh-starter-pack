import { generateId } from "better-auth";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import db from "@/lib/db";
import { account, user } from "@/lib/db/schema";

async function seed() {
  const userId = generateId();
  const accountId = generateId();
  const email = "admin@bettermelon.ru";
  const username = "admin";

  console.info(
    `[${new Date().toISOString()}] 🌱 Starting seed process... PID: ${process.pid}`,
  );

  try {
    const [exists] = await db
      .select()
      .from(user)
      .where(eq(user.name, username));

    if (exists?.id) {
      console.warn(
        `[${new Date().toISOString()}] ⚠️ User "${username}" already exists (id: ${exists.id}). Skipping seeding.`,
      );
      process.exit(0);
    }

    console.info(
      `[${new Date().toISOString()}] 👤 Creating user "${username}" (${email})...`,
    );
    await db.insert(user).values({
      id: userId,
      email,
      emailVerified: true,
      name: username,
      isAnonymous: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.info(`[${new Date().toISOString()}] 🔑 Hashing password...`);
    const hash = await hashPassword("admin");

    console.info(
      `[${new Date().toISOString()}] 🗂️ Creating account for user "${username}"...`,
    );
    await db.insert(account).values({
      id: accountId,
      accountId: userId,
      providerId: "credential",
      userId,
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.info(
      `[${new Date().toISOString()}] ✅ Seeding complete. User "${username}" created with id: ${userId}`,
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[${new Date().toISOString()}] ❌ Seeding failed: ${msg}`);
    process.exit(1);
  }
}

seed();
