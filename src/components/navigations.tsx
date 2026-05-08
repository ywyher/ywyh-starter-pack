"use client";

import AnonymousAlert from "@/components/anonymous-alert";
import Header from "@/components/header/header";
import ImpersonationAlert from "@/components/impersonation-alert";
import { Separator } from "@/components/ui/separator";

export default function Navigations({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Header />
      <ImpersonationAlert />
      <AnonymousAlert />
      <Separator className="hidden md:block z-40" />
      <div className={`mt-5 flex flex-col gap-12 md:gap-10`}>{children}</div>
    </div>
  );
}
