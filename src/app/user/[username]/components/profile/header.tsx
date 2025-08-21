import ProfilePfp from "@/app/user/[username]/components/profile/pfp";
import { User } from "@/lib/db/schema";

interface ProfileHeaderProps {
  profileUser: User;
  isOwner: boolean;
}

export default function ProfileHeader({ profileUser, isOwner }: ProfileHeaderProps) {
  return (
    <div className="flex flex-row items-end gap-10">
      <ProfilePfp
        userId={profileUser.id} 
        image={profileUser.image} 
        editable={isOwner} 
      />
      <div className="z-20 text-2xl font-bold text-foreground">
        {profileUser.name}
      </div>
    </div>
  );
}