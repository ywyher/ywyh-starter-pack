"use server";

import { env } from "@/lib/env/server";
import type { StorageProviderType } from "@/types/storage";

export async function getStorageProvider(): Promise<"s3" | "catbox"> {
  return env.STORAGE_PROVIDER as StorageProviderType;
}
