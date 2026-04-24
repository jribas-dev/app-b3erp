import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

interface PasswordToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  visible: boolean;
  onToggle: () => void;
}

export const PasswordToggleButton: React.FC<PasswordToggleButtonProps> = ({
  visible,
  onToggle,
  className,
  ...props
}) => {
  const Icon = visible ? EyeOff : Eye;
  const label = visible ? "Ocultar senha" : "Mostrar senha";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={visible}
      className={cn(
        "inline-flex items-center justify-center rounded-(--radius) p-1",
        "text-muted-foreground transition-colors duration-200 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        className
      )}
      {...props}
    >
      <Icon aria-hidden="true" width={18} height={18} />
    </button>
  );
};
