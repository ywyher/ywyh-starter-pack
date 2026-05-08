import { useOrientation } from "@uidotdev/usehooks";
import UploadOverlay from "@/app/user/[username]/components/profile/upload-overlay";
import Cropper from "@/components/cropper";
import DialogWrapper from "@/components/dialog-wrapper";
import type { User } from "@/lib/db/schema";
import useProfileFiles from "@/lib/hooks/use-profile-files";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/lib/utils/file";

type UserBannerProps = {
  userId: User["id"];
  banner: User["banner"];
  editable?: boolean;
  className?: string;
};

export default function ProfileBanner({
  userId,
  banner,
  editable = false,
  className,
}: UserBannerProps) {
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
    currentFile: banner ?? undefined,
    field: "banner",
    successMessage: "Banner updated successfully!",
  });

  const orientation = useOrientation();

  return (
    <>
      {/* biome-ignore lint/a11y/useSemanticElements: no */}
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "group z-10 absolute top-0 left-0",
          "w-full h-[var(--banner-height-small)] md:h-[var(--banner-height)]",
          editable && "cursor-pointer",
          isUploading && "cursor-wait",
          className,
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
        <div
          style={{
            backgroundImage: banner ? `url("${getFileUrl(banner)}")` : "",
            backgroundPosition: "50% 35%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "#242538",
          }}
        />

        <UploadOverlay isUploading={isUploading} editable={editable} />
        <div
          className="
            absolute inset-0 
            bg-linear-to-b
            from-background/20 
            via-background/40 
            to-background
          "
        />
      </div>

      <DialogWrapper
        trigger={null}
        open={open}
        setOpen={handleDialogClose}
        title="Crop Your Banner"
        description="Adjust your banner by cropping it to the perfect size"
        headerClassName="sm:p-2 flex-row md:flex-col justify-between md:justify-start items-center md:items-start"
        className="max-h-screen sm:h-screen md:h-fit"
        handleOnly
      >
        {previewUrl && (
          <Cropper
            image={previewUrl}
            onCrop={handleImage}
            onCancel={handleDialogClose}
            cropType="banner"
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
