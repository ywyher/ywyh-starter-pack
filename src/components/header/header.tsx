"use client";

import Auth from "@/components/auth/auth";
import HeaderDropdown from "@/components/header/dropdown";
import HeaderLinks from "@/components/header/links";
import Logo from "@/components/header/logo";
import HeaderMenu from "@/components/header/menu";
import ThemeToggle from "@/components/theme-toggle";
import { useIsMedium } from "@/lib/hooks/use-media-query";
import { useSession } from "@/lib/queries/user";
import { cn } from "@/lib/utils";

export default function Header() {
  const { data } = useSession();
  const isMedium = useIsMedium();

  return (
    <>
      <div className="h-(--header-height)" />
      <header
        className={
          "translate-y-0 top-0 fixed z-50 w-full border-b transition-transform duration-300 ease-in-out"
        }
      >
        <div
          className={cn(
            "absolute inset-0 transition-all duration-300 ease-in-out",
            "bg-primary-foreground/40 backdrop-blur-xs",
          )}
        />

        <div
          className={cn(
            "relative h-16 max-h-16",
            "flex flex-row items-center justify-between py-3",
            "container mx-auto px-4 md:p-0",
          )}
        >
          <div className="flex flex-row gap-3 items-center">
            <Logo />
            {!isMedium && <HeaderLinks user={data?.user} />}
          </div>
          <div className="flex flex-row gap-2 items-center justify-end">
            <ThemeToggle className="w-10 h-10 rounded-sm" />
            <div className="flex flex-col gap-2">
              {data?.user ? (
                <>
                  {/* Needed for anon alerts */}
                  {data?.user?.isAnonymous && (
                    <Auth user={data?.user} trigger={false} />
                  )}
                  {isMedium ? <HeaderMenu /> : <HeaderDropdown />}
                </>
              ) : (
                // biome-ignore lint/complexity/noUselessFragments: biome be tweaking out bro
                <>
                  {isMedium ? (
                    <>
                      <HeaderMenu />
                      <Auth trigger={false} />
                    </>
                  ) : (
                    <Auth />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
