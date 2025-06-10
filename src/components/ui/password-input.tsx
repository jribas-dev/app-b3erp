"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
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

      // Pontuação baseada nos critérios
      if (checks.length) score += 1;
      if (checks.lowercase) score += 1;
      if (checks.uppercase) score += 1;
      if (checks.numbers) score += 1;
      if (checks.symbols) score += 1;

      // Determinar nível de força (1-5)
      const strengthLevels: PasswordStrength[] = [
        { level: 1, label: "Muito Fraca", color: "text-red-600", bgColor: "bg-red-500" },
        { level: 2, label: "Fraca", color: "text-red-500", bgColor: "bg-red-400" },
        { level: 3, label: "Média", color: "text-yellow-600", bgColor: "bg-yellow-500" },
        { level: 4, label: "Forte", color: "text-green-600", bgColor: "bg-green-500" },
        { level: 5, label: "Muito Forte", color: "text-green-700", bgColor: "bg-green-600" },
      ];

      // Lógica de força baseada em critérios específicos
      if (score <= 1) return strengthLevels[0]; // Muito Fraca
      if (score === 2) return strengthLevels[1]; // Fraca
      if (score === 3 && checks.lowercase && checks.numbers) return strengthLevels[2]; // Média (aceita)
      if (score === 3) return strengthLevels[1]; // Fraca (não tem letra + número)
      if (score === 4) return strengthLevels[3]; // Forte
      return strengthLevels[4]; // Muito Forte
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
          {/* Barra de força */}
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-2 flex-1 rounded-sm transition-colors duration-200 ${
                  level <= strength.level
                    ? strength.bgColor
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
          
          {/* Label da força */}
          <div className="flex justify-between items-center text-sm">
            <span className={`font-medium ${strength.color}`}>
              {strength.label}
            </span>
            <span className="text-gray-500 text-xs">
              {strength.level >= 3 ? "✓ Aceita" : "Não aceita"}
            </span>
          </div>

          {/* Dicas de melhoria */}
          {strength.level < 3 && (
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
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
            className={`pr-10 ${error ? "border-red-500" : ""} ${className || ""}`}
            onChange={handleInputChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
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