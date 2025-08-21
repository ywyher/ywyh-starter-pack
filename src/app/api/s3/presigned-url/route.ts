import { env } from "@/lib/env/server";
import { auth } from "@/lib/auth";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { generateFileName } from "@/lib/utils/file";

interface UploadedFile {
  key: string;    // Unique identifier
  url: string;    // Public URL of the uploaded file
  name: string;   // Original filename
  size: number;   // File size in bytes
  type: string;   // MIME type
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.S3_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID!,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  const data = await auth.api.getSession({
    headers: req.headers,
  });

  if (!data || !data.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  
  const { type, size, checksum } = await req.json();

  const fileName = generateFileName();

  const putObjectCommand = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME!,
    Key: fileName,
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: data.user.id,
    },
  });

  try {
    const preSignedUrl = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 3600,
    });
    console.log(`##################################`)
    console.log(preSignedUrl)
    return NextResponse.json({ key: fileName, url: preSignedUrl, name: fileName, type, size });
  } catch {
    return NextResponse.json(
      { message: "Failed to generate pre-signed URL" },
      { status: 500 },
    );
  }
}