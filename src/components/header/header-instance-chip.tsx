"use client";

import { DatabaseZap } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession.hook";

export function HeaderInstanceChip() {
  const pathname = usePathname();
  const { session, isLoading } = useSession();

  if (pathname?.startsWith("/home")) return null;
  if (isLoading || !session?.instanceName) return null;

  return (
    <div className="flex items-center gap-2 bg-secondary/40 text-secondary-foreground px-2 py-1 rounded-(--radius) border border-border min-w-0">
      <DatabaseZap
        aria-hidden="true"
        width={16}
        height={16}
        className="text-primary shrink-0"
      />
      <p className="text-foreground text-xs font-semibold leading-tight">
        {session.instanceName}
      </p>
    </div>
  );
}
