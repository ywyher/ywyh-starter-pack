import type { User } from "@bettermelon/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { FormField } from "@/components/form/form-field";
import { PasswordInput } from "@/components/form/password-input";
import LoadingButton from "@/components/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/types/auth";

const setPasswordSchmea = z.object({
  password: passwordSchema,
});

type SetPasswordPorps = {
  userId: User["id"];
  className?: string;
  title?: string;
  onSuccess?: () => void;
};

export default function SetPassword({
  userId,
  className,
  title,
  onSuccess,
}: SetPasswordPorps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(setPasswordSchmea),
  });

  const onSubmit = async (data: z.infer<typeof setPasswordSchmea>) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.admin.setUserPassword({
        newPassword: data.password,
        userId,
      });

      if (error) throw new Error(error.message);

      toast.success("Password set.");
      if (onSuccess) onSuccess();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to set password";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2 capitalize">
          <ShieldCheckIcon className="h-5 w-5 text-primary" />
          {title ? title : "Set Password"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField form={form} label="Password" name="password">
              <PasswordInput />
            </FormField>
            <LoadingButton isLoading={isLoading} className="w-full mt-4">
              Set password
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
