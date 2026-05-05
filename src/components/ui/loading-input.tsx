import * as React from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingInputProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

// Skeleton de input em estado de carregamento — substitui o padrão repetido:
//   <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40">
//     <Spinner size="sm" tone="muted" />
//     <span className="text-sm text-muted-foreground">Carregando…</span>
//   </div>
export const LoadingInput: React.FC<LoadingInputProps> = ({
  label = "Carregando…",
  className,
  ...props
}) => (
  <div
    role="status"
    aria-live="polite"
    className={cn(
      "flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40",
      className,
    )}
    {...props}
  >
    <Spinner size="sm" tone="muted" />
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
);
