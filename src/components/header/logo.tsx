import { env } from "@/lib/env/client";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
        className="font-bold text-xl cursor-pointer w-fit h-fit px-2 rounded-md bg-transparent"
        href="/"
    >
      <p className="text-foreground">{env.NEXT_PUBLIC_APP_NAME}</p>
    </Link>
  )
}