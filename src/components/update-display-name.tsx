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
import type { User } from "@/lib/db/schema";
import { useIsSmall } from "@/lib/hooks/use-media-query";
import { profileQueries } from "@/lib/queries/profile";
import { userQueries } from "@/lib/queries/user";
import { cn } from "@/lib/utils";

const updateDisplayNameSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name should at least contain 1 character."),
});

type UpdateDisplayNameProps = {
  userId: User["id"];
  onSuccess?: (displayName: string) => void;
  className?: string;
  title?: string;
};

export function UpdateDisplayName({
  className,
  onSuccess,
  userId,
  title,
}: UpdateDisplayNameProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const isSmall = useIsSmall();

  const form = useForm<z.infer<typeof updateDisplayNameSchema>>({
    resolver: zodResolver(updateDisplayNameSchema),
    defaultValues: {
      displayName: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof updateDisplayNameSchema>) => {
    setIsLoading(true);

    const { error } = await updateUser({
      data: {
        displayName: data.displayName,
      },
      userId,
    });

    if (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    queryClient.invalidateQueries({ queryKey: userQueries.session._def });
    queryClient.invalidateQueries({ queryKey: profileQueries.profile._def });
    toast.success("Display Name updated successfully");
    form.reset({ displayName: "" });
    if (onSuccess) onSuccess(data.displayName);
  };

  const onError = (
    errors: FieldErrors<z.infer<typeof updateDisplayNameSchema>>,
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
          {title ? title : "Update DisplayName"}
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-secondary p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="flex flex-col gap-3"
          >
            <FormField
              form={form}
              label="New Display Name"
              description="You can use special chracters and emojis."
              name="displayName"
            >
              <TextInput placeholder="Enter your new Display Name" />
            </FormField>
            <LoadingButton
              isLoading={isLoading}
              variant="outline"
              className="w-full"
            >
              Update Display Name
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
