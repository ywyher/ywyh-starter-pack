import 'dotenv'
import Crypto from "crypto";
import { env } from "@/lib/env/client";

export function getFileUrl(name: string | null) {
  if (name == 'default') return "/images/pfp.png";
  if (name?.includes("http")) return name;
  
  if (process.env.STORAGE_PROVIDER === 's3') {
    return `${env.NEXT_PUBLIC_S3_DEV_URL}${name}`;
  } else {
    return `https://files.catbox.moe/${name}`;
  }
}

export const generateFileName = (bytes = 32) =>
  Crypto.randomBytes(bytes).toString("hex");

export function isValidURL(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function computeSHA256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export const validateImageFile = (file: File) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(true); // Skip validation for non-images
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(true);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    
    img.src = url;
  });
};

export const processInChunks = async <T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  chunkSize: number
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(processor));
    results.push(...chunkResults);
  }
  
  return results;
};

export const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          resolve(file); // Fallback to original file
        }
      }, file.type, quality);
    };
    
    img.onerror = () => resolve(file); // Fallback to original file
    img.src = URL.createObjectURL(file);
  });
};

export const validateFileType = (file: File, acceptedTypes: string[]): boolean => {
  if (acceptedTypes.length === 0) return true;
  return acceptedTypes.some(type => file.type.startsWith(type));
};

export const validateFileSize = (file: File, maxSize: number): boolean => {
  const maxSizeBytes = maxSize * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export function extractFilenameFromUrl(url: string, withoutExtension = false) {
    try {
        // Handle empty or invalid input
        if (!url || typeof url !== 'string') {
            return null;
        }

        // Extract filename using URL object for better reliability
        const filename = new URL(url).pathname.split('/').pop();
        
        // Handle case where there's no filename
        if (!filename) {
            return null;
        }

        // Return filename with or without extension
        if (withoutExtension) {
            const lastDotIndex = filename.lastIndexOf('.');
            return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
        }
        
        return filename;
    } catch {
        // Fallback method for malformed URLs
        try {
            const parts = url.split('/');
            const filename = parts[parts.length - 1];
            
            if (withoutExtension && filename) {
                const lastDotIndex = filename.lastIndexOf('.');
                return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
            }
            
            return filename || null;
        } catch {
            return null;
        }
    }
}