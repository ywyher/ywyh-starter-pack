import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env/server";
import { generateFileName } from "@/lib/utils/file";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.S3_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    // biome-ignore lint/style/noNonNullAssertion: temporary
    accessKeyId: env.S3_ACCESS_KEY_ID!,
    // biome-ignore lint/style/noNonNullAssertion: temporary
    secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  const data = await auth.api.getSession({
    headers: req.headers,
  });

  if (!data?.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { type, size, checksum } = await req.json();

  const fileName = generateFileName();

  if (!env.S3_BUCKET_NAME) throw new Error("Bucked name missing");

  const putObjectCommand = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
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
    return NextResponse.json({
      key: fileName,
      url: preSignedUrl,
      name: fileName,
      type,
      size,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to generate pre-signed URL" },
      { status: 500 },
    );
  }
}
