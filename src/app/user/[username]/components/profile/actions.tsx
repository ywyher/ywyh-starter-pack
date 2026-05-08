"use client";

import { Drama, Eye, ShieldCheckIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DialogWrapper from "@/components/dialog-wrapper";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { UpdateDisplayName } from "@/components/update-display-name";
import { UpdatePassword } from "@/components/update-password";
import { UpdateUsername } from "@/components/update-username";
import useImpersonate from "@/hooks/use-impersonate";
import type { User } from "@/lib/db/schema";
import { useSession } from "@/lib/queries/user";

interface ProfileActionsProps {
  canEdit: boolean;
  isAnonymous: boolean;
  profileUser: User;
}

export default function ProfileActions({
  canEdit,
  isAnonymous,
  profileUser,
}: ProfileActionsProps) {
  const [displayNameOpen, setDisplayNameOpen] = useState(false);
  const [usernameOpen, setUsernameOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const router = useRouter();
  const { data } = useSession();
  const { impersonate, stopImpersonating, isLoading } = useImpersonate();

  return (
    <div
      className="
      flex flex-row md:flex-col gap-3 z-20 md:justify-end flex-wrap
    "
    >
      {canEdit && !isAnonymous && (
        <>
          <DialogWrapper
            open={displayNameOpen}
            setOpen={setDisplayNameOpen}
            trigger={
              <Button className="z-20 text-md font-mono" variant="outline">
                <Eye /> Update Display Name
              </Button>
            }
          >
            <UpdateDisplayName
              userId={profileUser.id}
              className="border-0 p-0"
              onSuccess={() => {
                setDisplayNameOpen(false);
              }}
            />
          </DialogWrapper>
          <DialogWrapper
            open={usernameOpen}
            setOpen={setUsernameOpen}
            trigger={
              <Button className="z-20 text-md font-mono" variant="outline">
                <UserIcon /> Update Username
              </Button>
            }
          >
            <UpdateUsername
              userId={profileUser.id}
              className="border-0 p-0"
              onSuccess={(username) => {
                setUsernameOpen(false);
                router.replace(`/user/${username}`);
              }}
            />
          </DialogWrapper>
          <DialogWrapper
            open={passwordOpen}
            setOpen={setPasswordOpen}
            trigger={
              <Button className="z-20 text-md font-mono" variant="outline">
                <ShieldCheckIcon /> Update Password
              </Button>
            }
          >
            <UpdatePassword
              className="border-0 p-0"
              onSuccess={() => {
                setPasswordOpen(false);
              }}
            />
          </DialogWrapper>
        </>
      )}
      {!!data?.session?.impersonatedBy && (
        <LoadingButton
          onClick={() => stopImpersonating()}
          className="z-20 text-md font-mono"
          variant="outline"
          isLoading={isLoading}
        >
          <Drama /> Stop Impersonating {profileUser.name}
        </LoadingButton>
      )}
      {data?.user?.id !== profileUser?.id &&
        (data?.user?.role === "admin" ||
          (data?.user?.role === "moderator" &&
            profileUser.role === "user")) && (
          <LoadingButton
            onClick={() => impersonate({ userId: profileUser.id })}
            className="z-20 text-md font-mono"
            variant="outline"
            isLoading={isLoading}
          >
            <Drama /> Impersonate {profileUser.name}
          </LoadingButton>
        )}
    </div>
  );
}
