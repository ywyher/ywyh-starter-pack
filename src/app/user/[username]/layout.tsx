import AnonAlert from "@/app/user/[username]/components/anon-alert";
import ProfileTabs from "@/app/user/[username]/components/tabs/tabs";
import ProfileLayout from "@/app/user/[username]/components/profile/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile page",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <ProfileLayout />
        <ProfileTabs />
      </div>
      <div className="flex flex-col gap-5 pb-10">
        <AnonAlert />
        {children}
      </div>
    </div>
  );
}