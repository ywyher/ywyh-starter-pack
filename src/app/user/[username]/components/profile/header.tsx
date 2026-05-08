import type { User } from "@bettermelon/database";
import ProfilePfp from "@/app/user/[username]/components/profile/pfp";

interface ProfileHeaderProps {
  profileUser: User;
  canEdit: boolean;
}

export default function ProfileHeader({
  profileUser,
  canEdit,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-row items-end gap-10">
      <ProfilePfp
        userId={profileUser.id}
        image={profileUser.image}
        editable={canEdit}
      />
      <div className="flex flex-col gap-2">
        <div className="z-20 text-2xl font-bold text-foreground">
          {profileUser.displayName ?? profileUser.name}
        </div>
        <div className="z-20 text-xl text-muted-foreground">
          @{profileUser.name}
        </div>
      </div>
    </div>
  );
}
