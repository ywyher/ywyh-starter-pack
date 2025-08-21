'use client'

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCallback } from "react"
import { useParams, usePathname } from "next/navigation"

export default function ProfileTabsLinks() {
  const pathname = usePathname()
  const params = useParams()
  const username = String(params.username)

  const links = [
    { label: "Overview", href: `/user/${username}` },
  ]

  const isLinkActive = useCallback((href: string) => {
    if (href === `/user/${username}` && pathname === `/user/${username}`) {
      return true
    }
    return pathname === href
  }, [pathname, username])

  return (
    <>
      {links.map((l, idx) => {
        const isActive = isLinkActive(l.href)
        return (
          <Link
            key={idx}
            href={l.href}
            className={"transition-all"}
          >
            <Button
              variant='ghost'
              className={cn(
                "text-lg font-mono",
                "py-2.5 h-full",
                "hover:bg-transparent",
                isActive 
                ? "text-primary"
                : "text-muted-foreground"
              )}
            >
              {l.label}
            </Button>
          </Link>
        )
      })}
    </>
  )
}