'use client'

import ProfileHeader from "@/app/user/[username]/components/profile/header";
import ProfileBanner from "@/app/user/[username]/components/profile/banner";
import ProfileActions from "@/app/user/[username]/components/profile/actions";
import ProfileCardSkeleton from "@/app/user/[username]/components/profile/skeleton";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ProfileNotFound } from "@/lib/errors/profile";
import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { profileQueries } from "@/lib/queries/profile";

export default function ProfileLayout() {
  const router = useRouter()
  const params = useParams()
  const username = String(params.username)

  const { data, isLoading } = useQuery({
    ...profileQueries.profile({ username }),
    enabled: !!username
  })

  const isOwner = useMemo(() => {
    if(!data?.currentUser || !username) return false;
    return (data.currentUser?.name == username)
      && (data.currentUser?.id == data.profileUser?.id)
  }, [username, data])

  const profileUser = useMemo(() => {
    if(!data) return null;
    return data.profileUser
  }, [data])

  const isAnonymous = useMemo(() => {
    return data?.currentUser?.isAnonymous || false
  }, [data])

  const profilenotFound = useMemo(() => {
    if(!data?.error) return false;
    return data.error instanceof ProfileNotFound ? true : false
  }, [data])

  useEffect(() => {
    console.log(`data`, data)
  }, [data])

  useEffect(() => {
    if(profilenotFound) {
      const userExists = data?.currentUser
      const destination = userExists ? "your account" : "home page"
      const route = userExists ? `/user/${data?.currentUser?.name}` : '/'

      toast.error('Profile not found!', {
        description: `Redirecting to ${destination} ...`,
        duration: 10000
      })

      setTimeout(() => {
        router.push(route)
      }, 3000);
    }
  }, [profilenotFound, data, router])

  if(isLoading || !profileUser) return <ProfileCardSkeleton />

  return (
    <>
      <div className="
        mb-[calc(var(--banner-height-small)-5.5rem)]
        md:mb-[calc(var(--banner-height)-5.5rem)]
      ">
        <div className="
          absolute inset-0 top-0 left-1/2 transform -translate-x-1/2
          w-full h-[var(--banner-height-small)] md:h-[var(--banner-height)]
        ">
          <ProfileBanner 
            userId={profileUser.id} 
            banner={profileUser.banner} 
            editable={isOwner} 
          />
          <div className="
            h-full w-full container mx-auto
            flex justify-between items-end gap-10 bg-transparent
            pb-10 z-20
          ">
            <ProfileHeader profileUser={profileUser} isOwner={isOwner} />
            {(!isAnonymous && isOwner) && <ProfileActions isOwner={isOwner} />}
          </div>
        </div>
      </div>
    </>
  );
}