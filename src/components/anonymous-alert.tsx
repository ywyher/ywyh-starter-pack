"use client";

import { ShieldAlert, TriangleAlert, X } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/queries/user";
import { useAlertStore } from "@/lib/stores/alert-store";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function AnonymousAlert() {
  const { data } = useSession();
  const setIsAuthDialogOpen = useAuthStore(
    (state) => state.setIsAuthDialogOpen,
  );
  const anonymousAlert = useAlertStore((state) => state.anonymousAlert);
  const setAnonymousAlert = useAlertStore((state) => state.setAnonymousAlert);

  if (!data?.user?.isAnonymous || anonymousAlert) return null;

  return (
    <Alert
      variant="destructive"
      className="
        fixed top-(--header-height) z-50 w-full
        border-0 rounded-none border-b
        flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0
				bg-background/80 backdrop-blur-lg
      "
    >
      <AlertTitle className="flex flex-row gap-2 items-center">
        <TriangleAlert />
        <div className="flex flex-col gap-1">
          <p className="text-md font-mono">
            You are authenticated as an anonymous user. Sign in now to save your
            progress and keep your data from being lost.
          </p>
          <p className="text-xs font-mono">
            Your current data will be transferred to your new registered
            account.
          </p>
        </div>
      </AlertTitle>
      <div className="flex flex-row gap-2 w-full md:w-fit">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAuthDialogOpen(true)}
          className="
						flex flex-row gap-2 items-center
						font-bold flex-1
						bg-background/50
					"
        >
          <ShieldAlert />
          Register
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setAnonymousAlert(true)}
          className="
						flex flex-row gap-2 items-center
						font-bold flex-1
						bg-destructive/50
					"
        >
          <X />
          Dismiss
        </Button>
      </div>
    </Alert>
  );
}
