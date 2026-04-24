import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-current border-b-transparent motion-reduce:animate-none",
  {
    variants: {
      size: {
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-12 w-12 border-4",
      },
      tone: {
        primary: "text-primary",
        muted: "text-muted-foreground",
        current: "text-current",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "primary",
    },
  }
);

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  size,
  tone,
  label = "Carregando",
  ...props
}) => {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(spinnerVariants({ size, tone }), className)}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
};
