import * as React from "react";

import { cn } from "@/lib/utils";

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "6xl";

const widthClass: Record<MaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "6xl": "max-w-6xl",
};

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: MaxWidth;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  className,
  maxWidth = "6xl",
  children,
  ...props
}) => (
  <div
    className={cn(
      "container mx-auto w-full px-3 py-4 md:px-4",
      widthClass[maxWidth],
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
