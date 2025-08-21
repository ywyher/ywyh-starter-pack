import { UploadOptions } from "@/types/file";

export const FILE_TYPES = {
  IMAGES: ['image/'],
  VIDEOS: ['video/'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  AUDIO: ['audio/'],
  ALL: [],
} as const;

export const FILE_UPLOAD_DEFAULT_OPTIONS: Required<UploadOptions> = {
  acceptedTypes: ['images'],
  maxSize: 5,
  maxRetries: 3,
  concurrent: true,
  maxConcurrency: 3,
};