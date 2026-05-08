import type { User } from "@bettermelon/database";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import LoadingButton from "@/components/loading-button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { adminQueries } from "@/lib/queries/admin";

export default function DeleteUser({
  userId,
  onSuccess,
}: {
  userId: User["id"];
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const onDelete = async () => {
    setIsLoading(true);

    try {
      const { error } = await authClient.admin.removeUser({ userId });

      if (error) throw new Error(error?.message);

      toast.success(`User deleted.`);
      queryClient.invalidateQueries({ queryKey: adminQueries.users._def });
      if (onSuccess) onSuccess();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to delete user";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="px-2 py-1 w-full">
          <Trash2 /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton isLoading={isLoading} onClick={() => onDelete()}>
            Continue
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
