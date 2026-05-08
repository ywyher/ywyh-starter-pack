"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { User2 } from "lucide-react";
import { useState } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/form/form-field";
import { TextInput } from "@/components/form/text-input";
import LoadingButton from "@/components/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { updateUser } from "@/lib/db/mutations";
import { getUser } from "@/lib/db/queries";
import type { User } from "@/lib/db/schema";
import { useIsSmall } from "@/lib/hooks/use-media-query";
import { userQueries } from "@/lib/queries/user";
import { cn } from "@/lib/utils";
import { usernameSchema } from "@/types/auth";

const updateUsernameSchema = z.object({
  username: usernameSchema,
});

type UpdateUsernameProps = {
  userId: User["id"];
  onSuccess?: (username: string) => void;
  className?: string;
  title?: string;
};

export function UpdateUsername({
  className,
  onSuccess,
  userId,
  title,
}: UpdateUsernameProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const isSmall = useIsSmall();

  const form = useForm<z.infer<typeof updateUsernameSchema>>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof updateUsernameSchema>) => {
    setIsLoading(true);

    try {
      const userByName = await getUser({
        field: "name",
        value: data.username,
      });
      if (userByName.user) throw new Error("Username is already used!");

      const { error } = await updateUser({
        data: {
          name: data.username,
        },
        userId,
      });

      if (error) throw new Error(error);

      queryClient.invalidateQueries({ queryKey: userQueries.session._def });
      toast.success("Username updated successfully");
      form.reset({ username: "" });
      if (onSuccess) onSuccess(data.username);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update username.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (
    errors: FieldErrors<z.infer<typeof updateUsernameSchema>>,
  ) => {
    const position = isSmall ? "top-center" : "bottom-right";
    const firstError = Object.values(errors)[0];

    if (firstError?.message) {
      toast.error(firstError.message, { position });
    }
  };

  return (
    <Card className={cn(className, "bg-transparent")}>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2">
          <User2 className="h-5 w-5 text-primary" />
          {title ? title : "Update Username"}
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-secondary p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="flex flex-col gap-3"
          >
            <FormField form={form} label="New Username" name="username">
              <TextInput placeholder="Enter your new username" />
            </FormField>
            <LoadingButton
              isLoading={isLoading}
              variant="outline"
              className="w-full"
            >
              Update Username
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
