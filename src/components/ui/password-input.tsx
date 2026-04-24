"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  showStrengthMeter?: boolean;
  error?: boolean;
}

type PasswordStrength = {
  level: number;
  label: string;
  color: string;
  bgColor: string;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrengthMeter = false, error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");

    const calculatePasswordStrength = (password: string): PasswordStrength => {
      if (!password) {
        return { level: 0, label: "", color: "", bgColor: "" };
      }

      let score = 0;
      const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /[0-9]/.test(password),
        symbols: /[^A-Za-z0-9]/.test(password),
      };

      if (checks.length) score += 1;
      if (checks.lowercase) score += 1;
      if (checks.uppercase) score += 1;
      if (checks.numbers) score += 1;
      if (checks.symbols) score += 1;

      const strengthLevels: PasswordStrength[] = [
        { level: 1, label: "Muito fraca", color: "text-destructive", bgColor: "bg-destructive" },
        { level: 2, label: "Fraca", color: "text-destructive", bgColor: "bg-destructive/70" },
        { level: 3, label: "Média", color: "text-warning", bgColor: "bg-warning" },
        { level: 4, label: "Forte", color: "text-success", bgColor: "bg-success" },
        { level: 5, label: "Muito forte", color: "text-success", bgColor: "bg-success" },
      ];

      if (score <= 1) return strengthLevels[0];
      if (score === 2) return strengthLevels[1];
      if (score === 3 && checks.lowercase && checks.numbers) return strengthLevels[2];
      if (score === 3) return strengthLevels[1];
      if (score === 4) return strengthLevels[3];
      return strengthLevels[4];
    };

    const strength = calculatePasswordStrength(password);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPassword(value);
      props.onChange?.(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const renderStrengthMeter = () => {
      if (!showStrengthMeter || !password) return null;

      return (
        <div className="mt-2 space-y-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={cn(
                  "h-2 flex-1 rounded-sm transition-colors duration-200",
                  level <= strength.level ? strength.bgColor : "bg-muted"
                )}
              />
            ))}
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className={cn("font-medium", strength.color)}>
              {strength.label}
            </span>
            <span className="text-muted-foreground text-xs">
              {strength.level >= 3 ? "✓ Aceita" : "Não aceita"}
            </span>
          </div>

          {strength.level < 3 && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Para melhorar sua senha:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                {password.length < 8 && <li>Use pelo menos 8 caracteres</li>}
                {!/[a-zA-Z]/.test(password) && <li>Inclua pelo menos uma letra</li>}
                {!/[0-9]/.test(password) && <li>Inclua pelo menos um número</li>}
                {!/[A-Z]/.test(password) && <li>Use letras maiúsculas</li>}
                {!/[^A-Za-z0-9]/.test(password) && <li>Adicione símbolos especiais</li>}
              </ul>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-1">
        <div className="relative">
          <Input
            {...props}
            ref={ref}
            type={showPassword ? "text" : "password"}
            aria-invalid={error || undefined}
            className={cn("pr-10", className)}
            onChange={handleInputChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff width={16} height={16} />
            ) : (
              <Eye width={16} height={16} />
            )}
          </Button>
        </div>

        {renderStrengthMeter()}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
