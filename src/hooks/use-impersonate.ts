import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type { User } from "@/lib/db/schema";
import { profileQueries } from "@/lib/queries/profile";
import { userQueries } from "@/lib/queries/user";

export default function useImpersonate() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const impersonate = async ({ userId }: { userId: User["id"] }) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.admin.impersonateUser({ userId });
      if (error) throw new Error(error.message);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userQueries.session._def }),
        queryClient.invalidateQueries({
          queryKey: profileQueries.profile._def,
        }),
      ]);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to impersonate user";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const stopImpersonating = async () => {
    setIsLoading(true);
    try {
      const { error } = await authClient.admin.stopImpersonating();
      if (error) throw new Error(error.message);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userQueries.session._def }),
        queryClient.invalidateQueries({
          queryKey: profileQueries.profile._def,
        }),
      ]);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to impersonate user";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    impersonate,
    stopImpersonating,
    isLoading,
  };
}
