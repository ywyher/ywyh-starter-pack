import ky from 'ky';
import { env } from '@/lib/env/server';
import { sleep } from '@/lib/utils';
import { deleteFiles } from '@/lib/actions/file';
import { StorageProvider } from '@/types/storage';
import { FILE_TYPES, FILE_UPLOAD_DEFAULT_OPTIONS } from "@/lib/constants/file";
import { DeleteResult, UploadOptions, UploadResult } from "@/types/file";
import { compressImage, extractFilenameFromUrl, validateFileSize, validateFileType, validateImageFile } from "@/lib/utils/file";

export type CatboxUploadResponse = {
  success: boolean;
  url: string;
  error: string | null;
}

export class CatboxProvider implements StorageProvider {
  async uploadFile(file: File, options: UploadOptions): Promise<UploadResult> {
    const config = { ...FILE_UPLOAD_DEFAULT_OPTIONS, ...options };
    const { acceptedTypes, maxSize, maxRetries } = config;

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

    let currentFile = file;
    let lastError = '';

    // Retry logic with different approaches
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // On retry, try compressing the image
        if (attempt > 0 && file.type.startsWith('image/')) {
          currentFile = await compressImage(file, 0.9 - (attempt * 0.1));
        }

        const formData = new FormData();
        formData.append('file', currentFile);

        const result = await ky.post<CatboxUploadResponse>(`/api/catbox`, {
          body: formData,
          timeout: 30000,
        }).json();

        if (!result.success) {
          lastError = result.error || 'Upload failed on server';
          if (attempt === maxRetries) {
            return { message: null, error: lastError, name: null };
          }
          continue;
        }

        if (!result.url || result.url.trim() === '') {
          await deleteFiles({ identifiers: [result.url] });
          lastError = 'Server returned empty URL - file may be corrupted';
          if (attempt === maxRetries) {
            return { message: null, error: lastError, name: null };
          }
          continue;
        }

        // Validate URL format
        try {
          new URL(result.url);
        } catch {
          await deleteFiles({ identifiers: [result.url] });
          lastError = 'Server returned invalid URL format';
          if (attempt === maxRetries) {
            return { message: null, error: lastError, name: null };
          }
          continue;
        }

        return {
          message: 'File uploaded!',
          error: null,
          name: extractFilenameFromUrl(result.url)
        };

      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Upload failed';
        
        if (attempt === maxRetries) {
          break;
        }
        
        await sleep(Math.pow(2, attempt) * 1000);
      }
    }

    return {
      message: null,
      error: lastError || 'Upload failed after multiple attempts',
      name: null
    };
  }

  async deleteFiles(urls: string[]): Promise<DeleteResult> {
    try {
      const fileNames = urls.map(url => {
        const fileName = extractFilenameFromUrl(url);
        if (!fileName) {
          throw new Error(`Invalid URL format: ${url}`);
        }
        return fileName;
      });

      if (!fileNames.length) {
        throw new Error("No valid file names found in URLs");
      }

      const catboxFormData = new FormData();
      catboxFormData.append('reqtype', 'deletefiles');
      catboxFormData.append('userhash', env.CATBOX_USER_HASH || '');
      catboxFormData.append('files', fileNames.join(' '));

      await ky.post(env.CATBOX_API!, {
        body: catboxFormData,
      });

      return {
        message: `${fileNames.length} file(s) deleted successfully!`,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to delete files from Catbox";
      
      return {
        message: null,
        error: errorMessage
      };
    }
  }
}