"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useState } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getShouldVerifyEmail } from "@/components/auth/actions";
import type { AuthIdentifier, AuthPort } from "@/components/auth/auth";
import { FormField } from "@/components/form/form-field";
import { PasswordInput } from "@/components/form/password-input";
import { TextInput } from "@/components/form/text-input";
import LoadingButton from "@/components/loading-button";
import { Form } from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { getUser } from "@/lib/db/queries";
import { useIsSmall } from "@/lib/hooks/use-media-query";
import { emailSchema, passwordSchema, usernameSchema } from "@/types/auth";

export const registerSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name should at least contain 1 character."),
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

type FormValues = z.infer<typeof registerSchema>;

type RegisterProps = {
  setPort: Dispatch<SetStateAction<AuthPort>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setOpen: (isAuthDialogOpen: boolean) => void;
  identifierValue: string;
  identifier: AuthIdentifier;
};

export default function Register({
  setPort,
  setPassword,
  setOpen,
  identifier,
  identifierValue,
}: RegisterProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const isSmall = useIsSmall();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: identifier === "email" ? identifierValue : "",
      password: "",
      username: identifier === "username" ? identifierValue : "",
      displayName: identifier === "username" ? identifierValue : "",
    },
  });

  // formData.email/username are undfined if they are the identifier so we use it as fallback only
  const onSubmit = async (formData: FormValues) => {
    setIsLoading(true);

    try {
      const userByName = await getUser({
        field: "name",
        value: formData.username,
      });
      if (userByName.user) throw new Error("Username is already used!");

      const result = await authClient.signUp.email({
        email: identifier === "email" ? identifierValue : formData.email,
        password: formData.password,
        name: identifier === "username" ? identifierValue : formData.username,
        displayName: formData.displayName,
      });

      if (result.error) throw new Error(result.error.message);

      const shouldVerifyEmail = await getShouldVerifyEmail();

      if (shouldVerifyEmail) {
        const { error } = await authClient.emailOtp.sendVerificationOtp({
          email: identifier === "email" ? identifierValue : formData.email,
          type: "email-verification",
        });

        if (error) throw new Error(error.message);

        setPassword(formData.password);
        setPort("verify");
      } else {
        const result = await authClient.signIn.email({
          email: identifier === "email" ? identifierValue : formData.email,
          password: formData.password,
        });

        if (result.error) throw new Error(result.error.message);

        queryClient.clear();
        router.refresh();
        toast.success("Account registered successfully");
        // identifyUser({
        // 	email: identifier === "email" ? identifierValue : formData.email,
        // 	username: identifier === "username" ? identifierValue : formData.username,
        // });
        setOpen(false);
        setPort("check");
      }
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to create user";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    const position = isSmall ? "top-center" : "bottom-right";
    const firstError = Object.values(errors)[0];

    if (firstError?.message) {
      toast.error(firstError.message, { position });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className="flex flex-col gap-4">
          <FormField
            form={form}
            label="Username"
            name="username"
            disabled={identifier === "username"}
          >
            <TextInput />
          </FormField>
          <FormField
            form={form}
            label="Display name"
            name="displayName"
            description="You can use special chracters and emojis."
          >
            <TextInput />
          </FormField>
          <FormField
            form={form}
            label="Email"
            name="email"
            disabled={identifier === "email"}
          >
            <TextInput />
          </FormField>
          <FormField form={form} label="Password" name="password">
            <PasswordInput />
          </FormField>
        </div>
        <LoadingButton isLoading={isLoading} className="w-full mt-4">
          Register
        </LoadingButton>
      </form>
    </Form>
  );
}
