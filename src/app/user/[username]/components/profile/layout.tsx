"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import ProfileActions from "@/app/user/[username]/components/profile/actions";
import ProfileBanner from "@/app/user/[username]/components/profile/banner";
import ProfileHeader from "@/app/user/[username]/components/profile/header";
import ProfileCardSkeleton from "@/app/user/[username]/components/profile/skeleton";
import { ProfileNotFound } from "@/lib/errors/profile";
import { profileQueries } from "@/lib/queries/profile";

export default function ProfileLayout() {
  const router = useRouter();
  const params = useParams();
  const username = decodeURIComponent(String(params.username).toLowerCase());
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isLoading } = useQuery({
    ...profileQueries.profile({ username }),
    enabled: !!username,
  });

  const canEdit = useMemo(() => {
    if (!data?.currentUser || !username) return false;
    return (
      data.currentUser?.name === username &&
      data.currentUser?.id === data.profileUser?.id
    );
  }, [username, data]);

  const profileUser = useMemo(() => {
    if (!data) return null;
    return data.profileUser;
  }, [data]);

  const isAnonymous = useMemo(() => {
    return data?.currentUser?.isAnonymous || false;
  }, [data]);

  const profilenotFound = useMemo(() => {
    if (!data?.error) return false;
    return data.error instanceof ProfileNotFound;
  }, [data]);

  useEffect(() => {
    if (profilenotFound) {
      const userExists = data?.currentUser;
      const destination = userExists ? "your account" : "home page";
      const route = userExists ? `/user/${data?.currentUser?.name}` : "/";

      toast.error("Profile not found!", {
        description: `Redirecting to ${destination} ...`,
        duration: 10000,
      });

      redirectTimeoutRef.current = setTimeout(() => {
        router.push(route);
      }, 3000);
    }

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    };
  }, [profilenotFound, data, router]);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading || !profileUser) return <ProfileCardSkeleton />;

  return (
    <div
      className="
      mb-[calc(var(--banner-height-small)-5.5rem)]
      md:mb-[calc(var(--banner-height)-5.5rem)]
    "
    >
      <div
        className="
        absolute inset-0 top-0 left-1/2 transform -translate-x-1/2
        w-full h-(--banner-height-small) md:h-(--banner-height)
      "
      >
        <ProfileBanner
          userId={profileUser.id}
          banner={profileUser.banner}
          editable={canEdit}
        />
        <div
          className="
          h-full w-full container mx-auto px-4
          flex flex-col md:gap-10 md:flex-row justify-end md:justify-between bg-transparent
          pb-3 md:pb-10 z-20 gap-4
        "
        >
          <ProfileHeader profileUser={profileUser} canEdit={canEdit} />
          <ProfileActions
            profileUser={profileUser}
            isAnonymous={isAnonymous}
            canEdit={canEdit}
          />
        </div>
      </div>
    </div>
  );
}
