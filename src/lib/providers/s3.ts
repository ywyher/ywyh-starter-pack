import ky from "ky";
import { env as client } from "@/lib/env/client";
import { env as server } from "@/lib/env/server";
import { getS3Client } from "@/lib/actions/file";
import { StorageProvider } from "@/types/storage";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { FILE_TYPES, FILE_UPLOAD_DEFAULT_OPTIONS } from "@/lib/constants/file";
import { DeleteResult, S3UploadedFile, UploadOptions, UploadResult } from "@/types/file";
import { computeSHA256, validateFileSize, validateFileType, validateImageFile } from "@/lib/utils/file";

export class S3Provider implements StorageProvider {
  private async getPreSignedUrl(type: string, size: number, checksum: string): Promise<S3UploadedFile> {
    const response = await fetch(
      `${client.NEXT_PUBLIC_APP_URL}/api/s3/presigned-url`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, size, checksum }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error occurred" }));
      const errorMessage = errorData.message || `Request failed with status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async uploadFile(file: File, options: UploadOptions): Promise<UploadResult> {
    const config = { ...FILE_UPLOAD_DEFAULT_OPTIONS, ...options };
    const { acceptedTypes, maxSize } = config;

    // Resolve accepted file types
    const resolvedAcceptedTypes = acceptedTypes
      .flatMap(typeKey => FILE_TYPES[typeKey.toUpperCase() as keyof typeof FILE_TYPES]);

    // Validations
    if (!validateFileType(file, resolvedAcceptedTypes)) {
      return { message: null, error: 'Invalid file type', name: null };
    }

    if (!validateFileSize(file, maxSize)) {
      return { message: null, error: `File too large, max file size is ${maxSize}mb`, name: null };
    }

    const isValidImage = await validateImageFile(file);
    if (!isValidImage) {
      return { message: null, error: 'Image file is corrupted or invalid', name: null };
    }
    
    try {
      const checksum = await computeSHA256(file);
      const { url, name } = await this.getPreSignedUrl(file.type, file.size, checksum);
      
      await ky.put(url, { body: file, timeout: 30000 });

      return {
        name: name,
        error: null,
        message: null,
      };
    } catch (error) {
      return {
        name: null,
        message: null,
        error: error instanceof Error ? error.message : "Failed to upload file"
      };
    }
  }

  async deleteFiles(fileNames: string[]): Promise<DeleteResult> {
    try {
      const s3 = await getS3Client();
      
      // Delete multiple files in parallel
      const deletePromises = fileNames.map(fileName => {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: server.S3_BUCKET_NAME!,
          Key: fileName,
        });
        return s3.send(deleteCommand);
      });

      await Promise.all(deletePromises);

      return {
        message: `${fileNames.length} file(s) deleted successfully!`,
        error: null,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to delete files from S3";
      
      return { 
        message: null, 
        error: errorMessage 
      };
    }
  }
}