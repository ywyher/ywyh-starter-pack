'use client'

import { Button } from "@/components/ui/button";
import DialogWrapper from "@/components/dialog-wrapper";
import { UpdatePassword } from "@/components/update-password";
import { UpdateUsername } from "@/components/update-username";
import { ShieldCheckIcon, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProfileActionsProps {
  isOwner: boolean;
}

export default function ProfileActions({ isOwner }: ProfileActionsProps) {
  const [usernameOpen, setUsernameOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const router = useRouter()
  if (!isOwner) return null;

  return (
    <div className="
      flex flex-col gap-3
      z-20
    ">
      <DialogWrapper
        open={usernameOpen}
        setOpen={setUsernameOpen}
        trigger={<Button className="z-20 text-md font-mono" variant="outline"><User /> Update Username</Button>}
        >
        <UpdateUsername
          className="border-0 p-0" 
          onSuccess={(username) => {
            setUsernameOpen(false)
            router.replace(`/user/${username}`)
          }}
        />
      </DialogWrapper>
      <DialogWrapper
        open={passwordOpen}
        setOpen={setPasswordOpen}
        trigger={<Button className="z-20 text-md font-mono" variant="outline"><ShieldCheckIcon /> Update Password</Button>}
      >
        <UpdatePassword 
          className="border-0 p-0"
          onSuccess={() => {
            setPasswordOpen(false)
          }}
        />
      </DialogWrapper>
    </div>
  );
}