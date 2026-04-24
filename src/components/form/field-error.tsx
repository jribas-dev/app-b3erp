import * as React from "react";

import { cn } from "@/lib/utils";

interface FieldErrorProps extends React.HTMLAttributes<HTMLSpanElement> {
  id?: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({
  className,
  children,
  id,
  ...props
}) => {
  if (!children) return null;

  return (
    <span
      id={id}
      role="alert"
      className={cn("text-sm text-destructive leading-snug", className)}
      {...props}
    >
      {children}
    </span>
  );
};
