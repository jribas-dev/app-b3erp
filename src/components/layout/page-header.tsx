"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export type PageHeaderProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
};

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  backTo = "/home",
  backLabel = "Voltar",
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(backTo)}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </Button>
      </div>
      <header className="relative w-full overflow-hidden rounded-xl border border-border bg-linear-to-br from-card via-card to-accent/20 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/15 ring-1 ring-accent/25">
            <Icon size={22} className="text-accent" />
          </div>
          <div className="flex min-w-0 flex-col">
            <h1 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
