import { toast } from "sonner";
import { S3Provider } from "@/lib/providers/s3";
import { CatboxProvider } from "@/lib/providers/catbox";
import { StorageProvider } from "@/types/storage";
import { processInChunks } from "@/lib/utils/file";
import { getStorageProvider } from "@/lib/actions/config";
import { useCallback, useState } from "react";
import { FILE_UPLOAD_DEFAULT_OPTIONS } from "@/lib/constants/file";
import { MultipleUploadResult, UploadOptions, UploadResult } from "@/types/file";

const showToastError = (message: string, showToast: boolean): void => {
  if (showToast) toast.error(message);
};

export function useFileUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    currentFileName?: string;
  } | null>(null);

  const getProvider = useCallback(async (): Promise<StorageProvider> => {
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
  }, []);

  const uploadSingleFile = useCallback(async ({
    file,
    options,
    showToast = false
  }: {
    file: File,
    options: UploadOptions,
    showToast?: boolean
  }): Promise<UploadResult> => {
    const provider = await getProvider();
    
    try {
      const result = await provider.uploadFile(file, options);
      
      if (result.error && showToast) {
        showToastError(result.error, showToast);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
      showToastError(errorMessage, showToast);
      return {
        name: null,
        message: null,
        error: errorMessage
      };
    }
  }, [getProvider]);

  const handleUpload = useCallback(async ({ 
    file,
    options = {},
    showToast = false
  }: {
    file: File,
    options?: UploadOptions
    showToast?: boolean
  }): Promise<UploadResult> => {
    setIsLoading(true);
    try {
      const uploadPromise = uploadSingleFile({ file, options, showToast: false });
      
      if (showToast) {
        toast.promise(uploadPromise, {
          loading: 'Uploading...',
        });
      }
      
      const result = await uploadPromise;
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [uploadSingleFile]);

  const handleMultipleUpload = useCallback(async ({
    files,
    options = {}
  }: {
    files: File[],
    options?: UploadOptions
  }): Promise<MultipleUploadResult> => {
    const config = { ...FILE_UPLOAD_DEFAULT_OPTIONS, ...options };
    const { concurrent, maxConcurrency, ...uploadOptions } = config;

    if (files.length === 0) {
      return {
        results: [],
        successCount: 0,
        failureCount: 0,
        successNames: []
      };
    }

    setIsLoading(true);
    setUploadProgress({ current: 0, total: files.length });

    const uploadPromise = (async (): Promise<MultipleUploadResult> => {
      try {
        let results: UploadResult[];

        if (concurrent) {
          results = await processInChunks(
            files,
            async (file: File) => {
              setUploadProgress(prev => prev ? {
                ...prev,
                currentFileName: file.name
              } : null);
              
              const result = await uploadSingleFile({file, options: uploadOptions, showToast: false});
              
              setUploadProgress(prev => prev ? {
                ...prev,
                current: prev.current + 1
              } : null);
              
              return { ...result };
            },
            maxConcurrency
          );
        } else {
          results = [];
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setUploadProgress({
              current: i,
              total: files.length,
              currentFileName: file.name
            });

            const result = await uploadSingleFile({file, options: uploadOptions, showToast: false});
            results.push({ ...result });

            setUploadProgress({
              current: i + 1,
              total: files.length,
              currentFileName: file.name
            });
          }
        }

        const successCount = results.filter(r => r.name).length;
        const failureCount = results.filter(r => r.error).length;
        const successNames = results.filter(r => r.name).map(r => r.name!);

        return {
          results,
          successCount,
          failureCount,
          successNames
        };

      } finally {
        setIsLoading(false);
        setUploadProgress(null);
      }
    })();

    toast.promise(uploadPromise, {
      loading: `Uploading ${files.length} files...`,
      success: (data) => {
        if (data.successCount > 0 && data.failureCount === 0) {
          return `All ${data.successCount} files uploaded successfully!`;
        } else if (data.successCount > 0 && data.failureCount > 0) {
          return `${data.successCount} files uploaded, ${data.failureCount} failed`;
        } else if (data.failureCount > 0 && data.successCount == 0) {
          return 'Failed to upload any of the files';
        } else {
          return 'Upload completed';
        }
      },
      error: 'Upload failed'
    });

    return uploadPromise;
  }, [uploadSingleFile]);

  return {
    handleUpload,
    handleMultipleUpload,
    isLoading,
    uploadProgress,
  };
}