"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";
import { useState } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/form/form-field";
import { TextInput } from "@/components/form/text-input";
import LoadingButton from "@/components/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { useIsSmall } from "@/lib/hooks/use-media-query";
import { userQueries } from "@/lib/queries/user";
import { cn } from "@/lib/utils";
import { usernameSchema } from "@/types/auth";

const updateUsernameSchema = z.object({
  username: usernameSchema,
});

type UpdateUsernameProps = {
  onSuccess?: (username: string) => void;
  className?: string;
};

export function UpdateUsername({ className, onSuccess }: UpdateUsernameProps) {
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

    const { error } = await authClient.updateUser({
      name: data.username,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    queryClient.invalidateQueries({ queryKey: userQueries.session._def });
    toast.success("Username updated successfully");
    form.reset({ username: "" });
    if (onSuccess) onSuccess(data.username);
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
    <Card className={cn("bg-transparent", className)}>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Username
        </CardTitle>
        <CardDescription>Update your username</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="flex flex-col gap-6"
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
