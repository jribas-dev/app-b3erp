"use client";

import { useState, useCallback } from "react";
import {
  lostPasswordAction,
  checkLostPasswordAction,
  updateLostPasswordAction,
} from "@/lib/lost-password.service";
import { LostPasswordFormData } from "@/lib/validations/lost-password.form";
import { ResetPasswordFormData } from "@/lib/validations/reset-password.form";

interface UseLostPasswordReturn {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  resetPassword: (
    data: LostPasswordFormData
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  clearMessages: () => void;
}

interface UseResetPasswordReturn {
  isValidating: boolean;
  isUpdating: boolean;
  error: string | null;
  successMessage: string | null;
  userInfo: { name: string; email: string } | null;
  isTokenValid: boolean | null;
  validateToken: (token: string, email: string) => Promise<void>;
  updatePassword: (
    token: string,
    email: string,
    data: ResetPasswordFormData
  ) => Promise<{ success: boolean; error?: string }>;
  clearMessages: () => void;
}

export function useLostPassword(): UseLostPasswordReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetPassword = useCallback(async (data: LostPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const result = await lostPasswordAction(data);

      if (result.success) {
        setSuccessMessage(result.message || "Email enviado com sucesso!");
        return { success: true, message: result.message };
      } else {
        setError(result.error || "Erro ao solicitar recuperação");
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    isLoading,
    error,
    successMessage,
    resetPassword,
    clearMessages,
  };
}

export function useResetPassword(): UseResetPasswordReturn {
  const [isValidating, setIsValidating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const validateToken = useCallback(async (token: string, email: string) => {
    try {
      setIsValidating(true);
      setError(null);

      const result = await checkLostPasswordAction(token, email);

      if (result.isValid && result.name && result.email) {
        setIsTokenValid(true);
        setUserInfo({ name: result.name, email: result.email });
      } else {
        setIsTokenValid(false);
        setError("Link inválido ou expirado");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      setIsTokenValid(false);
      setError(errorMessage);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const updatePassword = useCallback(
    async (token: string, email: string, data: ResetPasswordFormData) => {
      try {
        setIsUpdating(true);
        setError(null);
        setSuccessMessage(null);

        const result = await updateLostPasswordAction(token, email, data);

        if (result.passwordUpdated) {
          setSuccessMessage("Senha alterada com sucesso!");
          return { success: true };
        } else {
          setError("Falha ao alterar senha. Tente novamente");
          return { success: false, error: "Falha ao alterar senha" };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro inesperado";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    isValidating,
    isUpdating,
    error,
    successMessage,
    userInfo,
    isTokenValid,
    validateToken,
    updatePassword,
    clearMessages,
  };
}
