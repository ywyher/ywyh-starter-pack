"use client";

import { Settings, ShieldUser } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

type HeaderLinksProps = {
  user: User | undefined;
  className?: string;
  onClick?: () => void;
};

export default function HeaderLinks({
  user,
  className,
  onClick,
}: HeaderLinksProps) {
  const links = useMemo(() => {
    return [
      {
        href: "/settings",
        icon: <Settings className="h-4 w-4" />,
        label: "Settings",
        show: true,
      },
      {
        href: "/admin/users",
        icon: <ShieldUser className="h-4 w-4 text-red-400" />,
        label: "Admin",
        show: user?.role === "admin" || user?.role === "moderator",
      },
    ];
  }, [user]);

  return (
    <div className={cn("flex flex-row gap-2", className)}>
      {links
        .filter((link) => link.show)
        .map((link) => {
          return (
            <Link key={link.href} href={link.href} className="w-full">
              <Button
                onClick={onClick}
                variant="ghost"
                className="
									flex flex-row gap-2 text-md w-full justify-start
									hover:bg-primary/10
								"
              >
                {link.icon}
                {link.label}
              </Button>
            </Link>
          );
        })}
    </div>
  );
}
