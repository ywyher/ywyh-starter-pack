import { Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeaderLinks() {
  return (
    <div className="hidden md:flex flex-row gap-2">
      <Link href={"/settings"}>
        <Button variant="ghost" className="flex flex-row gap-2 text-md">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </Link>
    </div>
  );
}
