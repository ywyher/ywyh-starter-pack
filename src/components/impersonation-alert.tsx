"use client";

import { Drama, Pause } from "lucide-react";
import LoadingButton from "@/components/loading-button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import useImpersonate from "@/hooks/use-impersonate";
import { useSession } from "@/lib/queries/user";

export default function ImpersonationAlert() {
  const { data } = useSession();
  const { stopImpersonating, isLoading } = useImpersonate();

  if (!data?.session?.impersonatedBy) return;

  return (
    <Alert
      variant="destructive"
      className="
        fixed top-(--header-height) z-50 w-full
        border-0 rounded-none border-b
        flex flex-row justify-between items-center
      "
    >
      <AlertTitle className="flex flex-row gap-2 items-center">
        <Drama />
        <p className="text-lg font-mono">
          You are currently impersonating {data?.user?.name}
        </p>
      </AlertTitle>
      <LoadingButton
        onClick={() => stopImpersonating()}
        size="sm"
        variant="destructive"
        className="text-md"
        isLoading={isLoading}
      >
        <Pause size={16} />
        Stop Impersonating
      </LoadingButton>
    </Alert>
  );
}
