"use client"

import LoadingButton from "@/components/loading-button"
import { z } from "zod"
import { FieldErrors, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { useState } from "react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { useIsSmall } from "@/lib/hooks/use-media-query"
import { usernameSchema } from "@/types/auth"
import { FormField } from "@/components/form/form-field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { TextInput } from "@/components/form/text-input"
import { useQueryClient } from "@tanstack/react-query"
import { userQueries } from "@/lib/queries/user"
import { cn } from "@/lib/utils"

const updateUsernameSchema = z.object({
  username: usernameSchema,
})

type UpdateUsernameProps = {
  onSuccess?: (username: string) => void
  className?: string
}

export function UpdateUsername({ className, onSuccess }: UpdateUsernameProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const isSmall = useIsSmall()

  const form = useForm<z.infer<typeof updateUsernameSchema>>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof updateUsernameSchema>) => {
    setIsLoading(true)

    const { error } =  await authClient.updateUser({
      name: data.username
    });

    if(error) {
      toast.error(error.message)
      setIsLoading(false)
      return;
    }
    
    setIsLoading(false)

    queryClient.invalidateQueries({ queryKey: userQueries.session._def })
    toast.success("Username updated successfully")
    form.reset({ username: "" })
    if(onSuccess) onSuccess(data.username)
  }

  const onError = (errors: FieldErrors<z.infer<typeof updateUsernameSchema>>) => {
      const position = isSmall ? "top-center" : "bottom-right"
      const firstError = Object.values(errors)[0];

      if (firstError?.message) {
        toast.error(firstError.message, { position });
      }
  }

  return (
    <Card className={cn(
      "bg-transparent",
      className
    )}>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Username
        </CardTitle>
        <CardDescription>Update your username</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col gap-6">
            <FormField
                form={form}
                label="New Username"
                name="username"
            >
                <TextInput  placeholder="Enter your new username" />
            </FormField>
            <LoadingButton isLoading={isLoading} variant="outline" className="w-full">
              Update Username
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}