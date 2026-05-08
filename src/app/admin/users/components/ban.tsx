import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { BanIcon, UserCheck } from "lucide-react";
import { useState } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { DateInput } from "@/components/form/date-input";
import { FormField } from "@/components/form/form-field";
import { TextareaInput } from "@/components/form/textarea-input";
import LoadingButton from "@/components/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import type { User } from "@/lib/db/schema";
import { useIsSmall } from "@/lib/hooks/use-media-query";
import { adminQueries } from "@/lib/queries/admin";

const banUserSchema = z.object({
  banReason: z.string().min(1),
  banExpiresIn: z.date(),
});

type BanUserProps = {
  userId: User["id"];
  banReason: User["banReason"];
  banExpiresIn: User["banExpires"];
  isBanned: User["banned"];
  className?: string;
  title?: string;
  onSuccess?: () => void;
};

export default function BanUser({
  userId,
  banReason,
  banExpiresIn,
  isBanned,
  className,
  onSuccess,
  title,
}: BanUserProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const isSmall = useIsSmall();
  const form = useForm({
    // @ts-expect-error
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      banReason: banReason || "",
      banExpiresIn: banExpiresIn ?? undefined,
    },
  });

  const onBan = async (data: z.infer<typeof banUserSchema>) => {
    setIsLoading(true);
    try {
      // Convert ISO date string to seconds from now
      const banExpiresInSeconds = Math.floor(
        (new Date(data.banExpiresIn).getTime() - Date.now()) / 1000,
      );

      const { error } = await authClient.admin.banUser({
        userId,
        banReason: data.banReason,
        banExpiresIn: banExpiresInSeconds,
      });

      if (error) throw new Error(error.message);

      queryClient.invalidateQueries({ queryKey: adminQueries.users._def });
      toast.success("User banned.");
      if (onSuccess) onSuccess();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to ban user";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const onUnBan = async () => {
    setIsLoading(true);
    try {
      const { error } = await authClient.admin.unbanUser({
        userId,
      });

      if (error) throw new Error(error.message);

      queryClient.invalidateQueries({ queryKey: adminQueries.users._def });
      toast.success("User Unbanned.");
      if (onSuccess) onSuccess();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to ban user";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof banUserSchema>>) => {
    const position = isSmall ? "top-center" : "bottom-right";
    const firstError = Object.values(errors)[0];

    if (firstError?.message) {
      toast.error(firstError.message, { position });
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row justify-between items-center p-0">
        <CardTitle className="flex items-center gap-2 capitalize">
          <BanIcon className="h-5 w-5 text-primary" />
          {title ? title : "Ban User"}
        </CardTitle>
        {isBanned && (
          <LoadingButton
            className="flex flex-row gap-1"
            variant="destructive"
            onClick={() => onUnBan()}
            isLoading={isLoading}
          >
            <UserCheck />
            Unban
          </LoadingButton>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onBan, onError)}
            className="flex flex-col gap-3"
          >
            <FormField form={form} label="Ban Reason" name="banReason">
              <TextareaInput />
            </FormField>
            <FormField form={form} label="Ban Expires In" name="banExpiresIn">
              <DateInput />
            </FormField>
            <LoadingButton isLoading={isLoading} className="w-full mt-4">
              Ban User
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
