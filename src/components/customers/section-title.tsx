"use client";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">
      {children}
    </p>
  );
}
