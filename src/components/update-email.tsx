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
import { emailSchema } from "@/types/auth";

const updateEmailSchema = z.object({
  email: emailSchema,
});

type UpdateEmailProps = {
  userId: User["id"];
  onSuccess?: (email: string) => void;
  className?: string;
  title?: string;
};

export function UpdateEmail({
  className,
  onSuccess,
  userId,
  title,
}: UpdateEmailProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const isSmall = useIsSmall();

  const form = useForm<z.infer<typeof updateEmailSchema>>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof updateEmailSchema>) => {
    setIsLoading(true);

    try {
      const userByName = await getUser({
        field: "email",
        value: data.email,
      });
      if (userByName.user) throw new Error("Email is already used!");

      const { error } = await updateUser({
        data: {
          email: data.email,
        },
        userId,
      });

      if (error) throw new Error(error);

      queryClient.invalidateQueries({ queryKey: userQueries.session._def });
      toast.success("Email updated successfully");
      form.reset({ email: "" });
      if (onSuccess) onSuccess(data.email);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update email.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof updateEmailSchema>>) => {
    const position = isSmall ? "top-center" : "bottom-right";
    const firstError = Object.values(errors)[0];

    if (firstError?.message) {
      toast.error(firstError.message, { position });
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2">
          <User2 className="h-5 w-5 text-primary" />
          {title ? title : "Update Email"}
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-secondary p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="flex flex-col gap-3"
          >
            <FormField form={form} label="New Email" name="email">
              <TextInput placeholder="Enter your new email" />
            </FormField>
            <LoadingButton
              isLoading={isLoading}
              variant="default"
              className="w-full"
            >
              Update Email
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
