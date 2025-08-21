import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/lib/utils/file";

export default function Pfp({
  image = "pfp.png",
  className,
  onClick
}: {
  image?: string;
  className?: string;
  onClick?: () => void
}) {
  return (
    <Avatar 
      className={cn(
        "border-none",
        "w-12 h-12",
        "object-cover",
        className,
      )}
      onClick={onClick}
    >
      <AvatarImage className="object-cover" src={getFileUrl(image)} alt="Profile picture" />
      <AvatarFallback>pfp</AvatarFallback>
    </Avatar>
  );
}