import { useQueryClient } from "@tanstack/react-query";
import {
  BanIcon,
  Eye,
  Mail,
  MoreHorizontal,
  ShieldCheckIcon,
  User2,
  UserPen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import BanUser from "@/app/admin/users/components/ban";
import DeleteUser from "@/app/admin/users/components/delete";
import SetPassword from "@/app/admin/users/components/set-password";
import SetUserRole from "@/app/admin/users/components/set-role";
import DialogWrapper from "@/components/dialog-wrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateDisplayName } from "@/components/update-display-name";
import { UpdateEmail } from "@/components/update-email";
import { UpdateUsername } from "@/components/update-username";
import type { User } from "@/lib/db/schema";
import { adminQueries } from "@/lib/queries/admin";
import { useSession } from "@/lib/queries/user";

export default function UsersTableActions({
  user,
}: {
  user: Omit<User, "updatedAt" | "image" | "banner">;
}) {
  const { data } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [openDialogs, setOpenDialogs] = useState({
    banUser: false,
    setPassword: false,
    setEmail: false,
    setDisplayName: false,
    setUsername: false,
    setRole: false,
    deleteUser: false,
  });

  const currentUser = useMemo(() => {
    return data?.user ?? undefined;
  }, [data]);

  const closeDialog = (dialogType: keyof typeof openDialogs) => {
    setOpenDialogs((prev) => ({ ...prev, [dialogType]: false }));
  };

  const openDialog = (dialogType: keyof typeof openDialogs) => {
    setOpenDialogs((prev) => ({ ...prev, [dialogType]: true }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Button
          variant="ghost"
          className="cursor-pointer w-full flex justify-start"
          onClick={() => router.push(`/user/${user.name}`)}
        >
          <User2 /> Profile
        </Button>
        {(currentUser?.role === "admin" ||
          (currentUser?.role === "moderator" && user.role === "user")) && (
          <>
            <DropdownMenuSeparator />
            <div className="flex flex-col gap-1">
              <DialogWrapper
                className="pt-1"
                open={openDialogs.setEmail}
                onOpenChange={(open) =>
                  setOpenDialogs((prev) => ({ ...prev, setEmail: open }))
                }
                trigger={
                  <Button
                    variant="ghost"
                    className="p-1 px-2 w-full flex justify-start"
                    onClick={() => openDialog("setEmail")}
                  >
                    <Mail />
                    Set email
                  </Button>
                }
              >
                <UpdateEmail
                  className="p-0 border-0 bg-transparent"
                  userId={user.id}
                  title={`Update ${user.name} email`}
                  onSuccess={() => {
                    closeDialog("setEmail");
                    queryClient.invalidateQueries({
                      queryKey: adminQueries.users._def,
                    });
                  }}
                />
              </DialogWrapper>
              <DialogWrapper
                className="pt-1"
                open={openDialogs.setDisplayName}
                onOpenChange={(open) =>
                  setOpenDialogs((prev) => ({ ...prev, setDisplayName: open }))
                }
                trigger={
                  <Button
                    variant="ghost"
                    className="p-1 px-2 w-full flex justify-start"
                    onClick={() => openDialog("setDisplayName")}
                  >
                    <Eye />
                    Set Display Name
                  </Button>
                }
              >
                <UpdateDisplayName
                  className="p-0 border-0 bg-transparent"
                  userId={user.id}
                  title={`Update ${user.displayName} Display name`}
                  onSuccess={() => {
                    closeDialog("setDisplayName");
                    queryClient.invalidateQueries({
                      queryKey: adminQueries.users._def,
                    });
                  }}
                />
              </DialogWrapper>
              <DialogWrapper
                className="pt-1"
                open={openDialogs.setUsername}
                onOpenChange={(open) =>
                  setOpenDialogs((prev) => ({ ...prev, setUsername: open }))
                }
                trigger={
                  <Button
                    variant="ghost"
                    className="p-1 px-2 w-full flex justify-start"
                    onClick={() => openDialog("setUsername")}
                  >
                    <User2 />
                    Set username
                  </Button>
                }
              >
                <UpdateUsername
                  className="p-0 border-0 bg-transparent"
                  userId={user.id}
                  title={`Update ${user.name} Username`}
                  onSuccess={() => {
                    closeDialog("setUsername");
                    queryClient.invalidateQueries({
                      queryKey: adminQueries.users._def,
                    });
                  }}
                />
              </DialogWrapper>
              <DialogWrapper
                className="pt-1"
                open={openDialogs.setRole}
                onOpenChange={(open) =>
                  setOpenDialogs((prev) => ({ ...prev, setRole: open }))
                }
                trigger={
                  <Button
                    variant="ghost"
                    className="p-1 px-2 w-full flex justify-start"
                    onClick={() => openDialog("setRole")}
                  >
                    <UserPen />
                    Set Role
                  </Button>
                }
              >
                <SetUserRole
                  className="p-0 border-0 bg-transparent"
                  userId={user.id}
                  title={`Update ${user.name} Role`}
                  onSuccess={() => closeDialog("setRole")}
                />
              </DialogWrapper>
              <DialogWrapper
                className="pt-1"
                open={openDialogs.setPassword}
                onOpenChange={(open) =>
                  setOpenDialogs((prev) => ({ ...prev, setPassword: open }))
                }
                trigger={
                  <Button
                    variant="ghost"
                    className="p-1 px-2 w-full flex justify-start"
                    onClick={() => openDialog("setPassword")}
                  >
                    <ShieldCheckIcon />
                    Set password
                  </Button>
                }
              >
                <SetPassword
                  className="p-0 border-0 bg-transparent"
                  userId={user.id}
                  title={`Set ${user.name} Password`}
                  onSuccess={() => closeDialog("setPassword")}
                />
              </DialogWrapper>
              <DialogWrapper
                className="pt-1"
                open={openDialogs.banUser}
                onOpenChange={(open) =>
                  setOpenDialogs((prev) => ({ ...prev, banUser: open }))
                }
                trigger={
                  <Button
                    variant="ghost"
                    className="p-1 px-2 w-full flex justify-start"
                    onClick={() => openDialog("banUser")}
                  >
                    <BanIcon />
                    Ban User
                  </Button>
                }
              >
                <BanUser
                  className="p-0 border-0 bg-transparent"
                  userId={user.id}
                  banReason={user.banReason}
                  banExpiresIn={user.banExpires}
                  isBanned={user.banned}
                  title={`${user.banned ? "Unban" : "Ban"} ${user.name}`}
                  onSuccess={() => closeDialog("banUser")}
                />
              </DialogWrapper>
              <DeleteUser
                userId={user.id}
                onSuccess={() => closeDialog("deleteUser")}
              />
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
