import * as React from "react";

import { cn } from "@/lib/utils";

interface FormSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  className,
  children,
  ...props
}) => (
  <section className={cn("flex flex-col gap-3", className)} {...props}>
    {title || description ? (
      <header className="flex flex-col gap-0.5">
        {title ? (
          <h3 className="text-sm font-semibold leading-tight text-foreground">
            {title}
          </h3>
        ) : null}
        {description ? (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        ) : null}
      </header>
    ) : null}
    <div className="flex flex-col gap-3">{children}</div>
  </section>
);
