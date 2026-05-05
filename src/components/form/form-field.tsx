import * as React from "react";

import { FieldError } from "@/components/form/field-error";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Agrupa o padrão Label + Input + FieldError + helper text repetido nos
// formulários. Não renderiza o Input — recebe-o como children para flexibilidade
// com Input/Textarea/Select customizados/PhoneInput/etc.

interface FormFieldProps {
  id?: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}) => {
  const errorId = id ? `${id}-error` : undefined;
  const hintId = id && hint ? `${id}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <Label htmlFor={id} className="text-sm">
          {label}
          {required ? (
            <span aria-hidden className="ml-0.5 text-destructive">
              *
            </span>
          ) : null}
        </Label>
      ) : null}
      {children}
      {hint && !error ? (
        <span id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </span>
      ) : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
};
