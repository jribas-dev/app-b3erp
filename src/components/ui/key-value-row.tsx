import * as React from "react";

import { cn } from "@/lib/utils";

interface KeyValueRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  mono?: boolean;
}

// Linha de chave/valor compacta — substitui o padrão repetido em listagens
// (CFOP 5102, IDs, status, etc.). Layout horizontal padrão; em telas estreitas
// label e value mantêm alinhamento via space-between.
export const KeyValueRow: React.FC<KeyValueRowProps> = ({
  label,
  value,
  mono = false,
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex items-center justify-between gap-3 text-xs",
      className,
    )}
    {...props}
  >
    <span className="text-muted-foreground">{label}</span>
    <span
      className={cn(
        "text-foreground font-medium",
        mono ? "font-mono" : null,
      )}
    >
      {value}
    </span>
  </div>
);
