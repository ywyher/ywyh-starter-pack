import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileUrl(image: string | null) {
  if(image == 'pfp.png') {
    return "/images/pfp.png"
  }
  return image || "";
}
