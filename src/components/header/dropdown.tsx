"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogIn, LogOut, Settings, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Pfp from "@/components/pfp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { userQueries, useSession } from "@/lib/queries/user";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function HeaderDropdown() {
  const { data } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const setIsAuthDialogOpen = useAuthStore(
    (state) => state.setIsAuthDialogOpen,
  );

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: userQueries.session._def });
    queryClient.clear();
    router.refresh();
  };

  if (!data?.user) return;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Pfp
          className="min-w-10 max-w-10 min-h-10 max-h-10 rounded-sm"
          image={data?.user?.image}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 bg-secondary">
        <DropdownMenuLabel className="capitalize">おかえり</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(`/user/${data?.user?.name}`)}
          >
            <UserIcon />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/settings")}
          >
            <Settings />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {data?.user?.isAnonymous ? (
            // For anonymous users
            <DropdownMenuItem onClick={() => setIsAuthDialogOpen(true)}>
              <LogIn />
              <span>Sign Up / Log In</span>
            </DropdownMenuItem>
          ) : (
            // For regular users
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleLogout()}
            >
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
