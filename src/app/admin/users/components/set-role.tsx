import type { User } from "@bettermelon/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { UserPen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { FormField } from "@/components/form/form-field";
import { SelectInput } from "@/components/form/select-input";
import LoadingButton from "@/components/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { roles } from "@/lib/constants/auth";
import { adminQueries } from "@/lib/queries/admin";

const setRoleSchema = z.object({
  role: z.enum(roles),
});

type SetUserRoleProps = {
  userId: User["id"];
  className?: string;
  title?: string;
  onSuccess?: () => void;
};

export default function SetUserRole({
  userId,
  className,
  title,
  onSuccess,
}: SetUserRoleProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(setRoleSchema),
  });

  const onSubmit = async (data: z.infer<typeof setRoleSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.admin.setRole({
        userId,
        role: data.role,
      });

      if (error) throw new Error(error.message);

      queryClient.invalidateQueries({ queryKey: adminQueries.users._def });
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
          <UserPen className="h-5 w-5 text-primary" />
          {title ? title : "Set Role"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField form={form} label="Role" name="role">
              <SelectInput
                options={roles.map((r) => {
                  return {
                    value: r,
                    label: r,
                  };
                })}
              />
            </FormField>
            <LoadingButton isLoading={isLoading} className="w-full mt-4">
              Set role
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
