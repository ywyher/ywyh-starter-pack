export interface S3UploadedFile {
  key: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface UploadResult {
  message: string | null;
  error: string | null;
  name: string | null;
}

export interface MultipleUploadResult {
  results: UploadResult[];
  successCount: number;
  failureCount: number;
  successNames: string[];
}

export interface UploadOptions {
  acceptedTypes?: ("images" | "videos" | "documents" | "audio" | 'all')[];
  maxSize?: number;
  maxRetries?: number;
  concurrent?: boolean;
  maxConcurrency?: number;
}

export interface DeleteResult {
  message: string | null;
  error: string | null;
}