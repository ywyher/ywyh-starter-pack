'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { profileQueries } from "@/lib/queries/profile"
import { ShieldAlert, TriangleAlert } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AnonAlert({ className = "" }: { className?: string }) {
  const params = useParams()
  const username = String(params.username)

  const setIsAuthDialogOpen = useAuthStore((state) => state.setIsAuthDialogOpen)

  const { data, isLoading } = useQuery({
    ...profileQueries.profile({ username }),
    enabled: !!username
  })

  const isOwner = useMemo(() => {
    if(!data?.currentUser || !username) return false;
    return (data.currentUser?.name == username)
      && (data.currentUser?.id == data.profileUser?.id)
  }, [username, data])

  const showShowAlert = useMemo(() => {
    return (isOwner && data?.currentUser?.isAnonymous) || false
  }, [data, isOwner])

  if(!showShowAlert || isLoading) return;

  return (
    <Alert variant="destructive" className={cn(
      'w-full bg-secondary/30 flex items-start justify-between',
      className
    )}>
      <div className="flex items-start space-x-2">
        <TriangleAlert className="h-4 w-4 mt-0.5" />
        <div>
          <AlertTitle className="font-bold">You&apos;re browsing as a guest</AlertTitle>
          <AlertDescription>
            Sign in now to save your progress and keep your data from being lost. Your current data will be transferred to your new registered account.
          </AlertDescription>
        </div>
      </div>
      
      <Button
        variant="outline" 
        size="sm"
        onClick={() => setIsAuthDialogOpen(true)}
        className="
          flex flex-row gap-2 items-center
          font-bold
        "
      >
        <ShieldAlert />
        Sign In
      </Button>
    </Alert>
  )
}