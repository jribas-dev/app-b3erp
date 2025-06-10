"use client";

import { forwardRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = "", onChange, error, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
      setDisplayValue(value);
    }, [value]);

    const formatPhone = (phone: string): string => {
      // Remove todos os caracteres não numéricos
      const numbers = phone.replace(/\D/g, "");
      
      // Limita a 11 dígitos
      const limitedNumbers = numbers.slice(0, 11);
      
      // Aplica a máscara baseada no número de dígitos
      if (limitedNumbers.length <= 10) {
        // Formato: (99) 9999-9999
        return limitedNumbers
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{4})(\d)/, "$1-$2");
      } else {
        // Formato: (99) 99999-9999
        return limitedNumbers
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{5})(\d)/, "$1-$2");
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const formattedValue = formatPhone(inputValue);
      
      setDisplayValue(formattedValue);
      onChange?.(formattedValue);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        placeholder="(99) 99999-9999"
        maxLength={15}
        className={error ? "border-red-500" : props.className}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };