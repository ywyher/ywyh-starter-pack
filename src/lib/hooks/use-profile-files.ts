import { User } from "@/lib/db/schema";
import { toast } from "sonner";
import { updateUser } from "@/lib/db/mutations";
import { userQueries } from "@/lib/queries/user";
import { deleteFiles } from "@/lib/actions/file";
import { useFileUpload } from "@/lib/hooks/use-file-upload";
import { useQueryClient } from "@tanstack/react-query";
import { profileQueries } from "@/lib/queries/profile";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseProfileFilesProps {
  userId: User['id'];
  field: 'image' | 'banner';
  currentFile?: string
  successMessage?: string;
}

export default function useProfileFiles({ userId, currentFile, field, successMessage }: UseProfileFilesProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  
  const queryClient = useQueryClient();
  const { handleUpload } = useFileUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
    setOpen(true);
  };

  const handleImage = async (file: File | null) => {
    if (!file) return;
    
    setIsUploading(true);
    setOpen(false);

    try {
      const { error: uploadError, name } = await handleUpload({
        file: file,
        options: {
          acceptedTypes: ['images'],
          maxSize: 5
        }
      });

      if (uploadError || !name) throw new Error(uploadError || "Name missing")

      const { error: userError } = await updateUser({ 
        data: {
          [field]: name
        },
        userId
      });
      
      if (userError) throw new Error(userError);
      
      if(currentFile) {
        deleteFiles({ identifiers: [currentFile] })
      }
      
      toast.success(successMessage || `${field} updated successfully!`);
      queryClient.invalidateQueries({ queryKey: profileQueries.profile._def });
      queryClient.invalidateQueries({ queryKey: userQueries.session._def });
      
      cleanup();
    } catch (err) {
      const msg = err instanceof Error ? err.message : `Failed to upload ${field}`;
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    cleanup();
  };

  const cleanup = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = useCallback(() => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }, [isUploading]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    fileInputRef,
    previewUrl,
    selectedFile,
    isUploading,
    open,
    handleFileChange,
    handleImage,
    handleDialogClose,
    triggerFileInput
  };
}