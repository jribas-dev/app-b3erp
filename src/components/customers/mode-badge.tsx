"use client";

import { Plus, UserCheck } from "lucide-react";

import type { CustomerMode } from "@/hooks/customerForm/customer-mode";

interface ModeBadgeProps {
  mode: CustomerMode;
  name?: string;
}

export function ModeBadge({ mode, name }: ModeBadgeProps) {
  if (mode === "idle") return null;
  if (mode === "new") {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
        <Plus size={11} />
        Novo cadastro
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
      <UserCheck size={11} />
      {name ? `Editando: ${name}` : "Editando"}
    </span>
  );
}
