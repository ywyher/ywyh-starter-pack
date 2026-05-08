"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogIn, LogOut, MenuIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import HeaderLinks from "@/components/header/links";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { userQueries, useSession } from "@/lib/queries/user";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function HeaderMenu() {
  const { data } = useSession();
  const [open, setOpen] = useState(false);
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-5 px-4 pb-4 w-[80%] bg-secondary overflow-y-scroll">
        <SheetHeader className="h-1">
          <SheetTitle>おかえり</SheetTitle>
        </SheetHeader>
        <Separator />
        <div className="flex flex-col gap-2">
          <HeaderLinks
            onClick={() => setOpen(false)}
            className="flex-col items-start gap-3"
            user={data?.user}
          />
        </div>
        <div className="flex items-end h-full">
          {!data?.user || data?.user?.isAnonymous ? (
            // For anonymous users
            <Button
              onClick={() => {
                setIsAuthDialogOpen(true);
                setOpen(false);
              }}
              className="w-full"
            >
              <LogIn />
              <span>Sign Up / Log In</span>
            </Button>
          ) : (
            // For regular users
            <Button onClick={() => handleLogout()} className="w-full">
              <LogOut />
              <span>Log out</span>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
