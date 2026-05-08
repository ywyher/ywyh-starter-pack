"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, type SetStateAction, useState } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { checkEmail } from "@/components/auth/actions";
import type { AuthIdentifier, AuthPort } from "@/components/auth/auth";
import LoadingButton from "@/components/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useIsSmall } from "@/lib/hooks/use-media-query";
import { emailRegex, identifierSchema, usernameRegex } from "@/types/auth";

export const checkSchema = z.object({
  identifier: identifierSchema
    .transform((val) => val.toLowerCase())
    .refine((val) => !val.includes(" "), {
      message: "Username cannot contain spaces",
    }),
});

type FormValues = z.infer<typeof checkSchema>;
type CheckProps = {
  setPort: Dispatch<SetStateAction<AuthPort>>;
  setIdentifierValue: Dispatch<SetStateAction<string>>;
  setIdentifier: Dispatch<SetStateAction<AuthIdentifier | null>>;
};

export default function Check({
  setPort,
  setIdentifierValue,
  setIdentifier,
}: CheckProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isSmall = useIsSmall();

  const form = useForm<FormValues>({
    resolver: zodResolver(checkSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    let identifier: AuthIdentifier | null = null;
    if (data.identifier.match(usernameRegex)) {
      identifier = "username";
    } else if (data.identifier.match(emailRegex)) {
      identifier = "email";
    } else {
      identifier = null;
    }

    if (!identifier) {
      toast.error("Use email or username");
      setIsLoading(false);
      return;
    }

    const { exists, verified } = await checkEmail({ data, identifier });

    if (exists && verified) {
      setPort("login");
    } else if (!exists) {
      setPort("register");
    } else if (exists && !verified) {
      setPort("login");
    }

    setIdentifier(identifier);
    setIdentifierValue(data.identifier);
    setIsLoading(false);
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    const position = isSmall ? "top-center" : "bottom-right";
    if (errors.identifier) {
      toast.error(errors.identifier.message, { position });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <LoadingButton isLoading={isLoading} className="w-full mt-4">
          Authenticate
        </LoadingButton>
      </form>
    </Form>
  );
}
