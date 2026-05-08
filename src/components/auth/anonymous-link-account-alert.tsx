"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import LoadingButton from "@/components/loading-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { deleteUser } from "@/lib/db/mutations";
import type { User } from "@/lib/db/schema";
import { userQueries } from "@/lib/queries/user";

export default function AnonymousLinkAccountAlert({
  userId,
}: {
  userId: User["id"];
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleAccountDeletion = async () => {
    setIsLoading(true);
    const { error, message } = await deleteUser({ userId });

    if (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: userQueries.session._def });
    queryClient.clear();
    toast.success(message);
    setIsLoading(false);
  };

  return (
    <Alert className="flex flex-col gap-3 items-center bg-secondary w-full">
      <div className="flex flex-row gap-1 items-center">
        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
        <div className="flex flex-col">
          <AlertTitle className="flex flex-wrap">
            Anonymous activities will be linked on registering a new account.
          </AlertTitle>
          <AlertDescription>
            Delete now to prevent data migration
          </AlertDescription>
        </div>
      </div>
      <LoadingButton
        variant="destructive"
        isLoading={isLoading}
        onClick={handleAccountDeletion}
        className="w-full h-fit"
      >
        Delete
      </LoadingButton>
    </Alert>
  );
}
