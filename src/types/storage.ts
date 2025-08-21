import { DeleteResult, UploadOptions, UploadResult } from "@/types/file";

export interface StorageProvider {
  uploadFile: (file: File, options: UploadOptions) => Promise<UploadResult>;
  deleteFiles(identifiers: string[]): Promise<DeleteResult>;
}

export type StorageProviderType = 's3' | 'catbox';