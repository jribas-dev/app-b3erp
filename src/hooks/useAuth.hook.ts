"use client";

import { useTransition } from "react";
import {
  loginAction,
  selectInstanceAction,
  logoutAction,
  redirectAfterLogin,
  redirectToLogin,
} from "@/lib/auth.service";
import { SignInFormData } from "@/lib/validations";

export function useAuth() {
  const [isPending, startTransition] = useTransition();

  const login = async (
    credentials: SignInFormData
  ): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const result = await loginAction(credentials);

          if (result.success) {
            await redirectAfterLogin();
          }

          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            error: error instanceof Error ? error.message : "Erro inesperado",
          });
        }
      });
    });
  };

  const selectInstance = async (
    instanceId: string
  ): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const result = await selectInstanceAction(instanceId);

          // Remove o redirecionamento automático - deixa o componente gerenciar
          // A atualização da sessão será feita via refetch no componente
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            error: error instanceof Error ? error.message : "Erro inesperado",
          });
        }
      });
    });
  };

  const logout = async (): Promise<void> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          await logoutAction();
          await redirectToLogin();
        } catch (error) {
          console.error("Erro durante logout:", error);
          await redirectToLogin();
        } finally {
          resolve();
        }
      });
    });
  };

  return {
    login,
    selectInstance,
    logout,
    isPending,
  };
}
