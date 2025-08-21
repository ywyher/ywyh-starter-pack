'use server'

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env/server";
import { DeleteResult } from "@/types/file";
import { S3Provider } from "@/lib/providers/s3";
import { CatboxProvider } from "@/lib/providers/catbox";
import { S3Client } from "@aws-sdk/client-s3";
import { getStorageProvider } from "@/lib/actions/config";
import { StorageProvider } from "@/types/storage";

export async function getS3Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${env.S3_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID!,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
    },
  });
}

async function getDeleteProvider(): Promise<StorageProvider> {
  const storageProvider = await getStorageProvider()
  
  switch (storageProvider) {
    case 's3':
      return new S3Provider();
    case 'catbox':
      return new CatboxProvider();
    default:
      console.warn(`Unknown storage provider: ${storageProvider}, defaulting to S3`);
      return new S3Provider();
  }
}

// Single unified delete action
export async function deleteFiles({ 
  identifiers 
}: { 
  identifiers: string[]
}): Promise<DeleteResult> {
  // Authentication check
  const requestHeaders = await headers();
  const data = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!data || !data.user) {
    return {
      message: null,
      error: "Not authenticated",
    };
  }

  if (!identifiers.length) {
    return {
      message: null,
      error: "No files to delete",
    };
  }

  try {
    const provider = await getDeleteProvider();
    return await provider.deleteFiles(identifiers);
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Failed to delete files";
    
    return {
      message: null,
      error: errorMessage,
    };
  }
}