import type { User } from "@bettermelon/database";
import { useOrientation } from "@uidotdev/usehooks";
import UploadOverlay from "@/app/user/[username]/components/profile/upload-overlay";
import Cropper from "@/components/cropper";
import DialogWrapper from "@/components/dialog-wrapper";
import Pfp from "@/components/pfp";
import useProfileFiles from "@/lib/hooks/use-profile-files";
import { cn } from "@/lib/utils";

type UserPfpProps = {
  userId: User["id"];
  image: User["image"];
  editable?: boolean;
};

export default function ProfilePfp({
  userId,
  image,
  editable = false,
}: UserPfpProps) {
  const {
    fileInputRef,
    previewUrl,
    isUploading,
    open,
    handleFileChange,
    handleImage,
    handleDialogClose,
    triggerFileInput,
  } = useProfileFiles({
    userId,
    currentFile: image,
    field: "image",
    successMessage: "Lookin good :)",
  });

  const orientation = useOrientation();

  return (
    <>
      {/* biome-ignore lint/a11y/useSemanticElements: no */}
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "relative w-full h-full group",
          "w-44 md:w-50 h-44 md:h-50 z-20",
          editable && "cursor-pointer",
          isUploading && "cursor-wait",
        )}
        onClick={editable ? triggerFileInput : undefined}
        onKeyDown={editable ? triggerFileInput : undefined}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <Pfp
          image={image}
          className={cn(
            "object-cover rounded-sm border-2 border-primary/20",
            "w-full h-full transition-opacity duration-200",
            isUploading && "opacity-75",
          )}
        />

        <UploadOverlay isUploading={isUploading} editable={editable} />
      </div>

      <DialogWrapper
        trigger={null}
        open={open}
        setOpen={handleDialogClose}
        title="Crop Your Image"
        description="Adjust your profile picture by cropping it to the perfect size"
        headerClassName="sm:p-2 flex-col justify-between md:justify-start items-start"
        className="max-h-screen sm:h-screen md:h-fit"
        handleOnly
      >
        {previewUrl && (
          <Cropper
            image={previewUrl}
            onCrop={handleImage}
            onCancel={handleDialogClose}
            className={cn(
              "pt-4 md:pt-0",
              orientation.type === "landscape-primary" && "px-10 md:px-0",
            )}
          />
        )}
      </DialogWrapper>
    </>
  );
}
