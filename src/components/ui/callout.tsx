import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

const calloutVariants = cva(
  "relative w-full rounded-(--radius) border p-4 text-sm",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-foreground",
        info: "border-accent/30 bg-accent/10 text-foreground",
        success:
          "border-success/30 bg-success/10 text-foreground",
        warning:
          "border-warning/30 bg-warning/10 text-foreground",
        destructive:
          "border-destructive/30 bg-destructive/10 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconColorByVariant: Record<
  NonNullable<VariantProps<typeof calloutVariants>["variant"]>,
  string
> = {
  default: "text-muted-foreground",
  info: "text-accent",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

const defaultIconByVariant: Record<
  NonNullable<VariantProps<typeof calloutVariants>["variant"]>,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  destructive: AlertCircle,
};

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | false;
}

export const Callout: React.FC<CalloutProps> = ({
  className,
  variant,
  icon,
  children,
  role,
  ...props
}) => {
  const resolvedVariant = variant ?? "default";
  const Icon =
    icon === false
      ? null
      : icon ?? defaultIconByVariant[resolvedVariant];
  const resolvedRole =
    role ?? (resolvedVariant === "destructive" ? "alert" : "status");

  return (
    <div
      role={resolvedRole}
      className={cn(calloutVariants({ variant: resolvedVariant }), className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        {Icon ? (
          <Icon
            aria-hidden="true"
            width={20}
            height={20}
            className={cn("mt-0.5 shrink-0", iconColorByVariant[resolvedVariant])}
          />
        ) : null}
        <div className="flex-1 min-w-0 space-y-1">{children}</div>
      </div>
    </div>
  );
};

export const CalloutTitle: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ...props }) => (
  <p
    className={cn("font-semibold leading-tight text-foreground", className)}
    {...props}
  />
);

export const CalloutDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ...props }) => (
  <p
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
);

export const CalloutActions: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => (
  <div
    className={cn("mt-3 flex flex-wrap items-center gap-2", className)}
    {...props}
  />
);
