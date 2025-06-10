"use client";

import { useCallback, useState } from "react";
import {
  getUserDataAction,
  updateUserDataAction,
  updateUserPasswordAction,
} from "@/lib/user-edit.service";
import { UserEditFormData, PasswordChangeFormData } from "@/lib/validations/user-edit.form";
import { UserData } from "@/types/user-edit";

interface UseUserEditReturn {
  userData: UserData | null;
  isLoadingUser: boolean;
  isUpdatingUser: boolean;
  isUpdatingPassword: boolean;
  userError: string | null;
  passwordError: string | null;
  loadUserData: (userId: string) => Promise<void>;
  updateUser: (
    userId: string,
    data: UserEditFormData
  ) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (
    userId: string,
    data: PasswordChangeFormData
  ) => Promise<{ success: boolean; error?: string }>;
  clearErrors: () => void;
}

export function useUserEdit(): UseUserEditReturn {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const loadUserData = useCallback(async (userId: string) => {
    try {
      setIsLoadingUser(true);
      setUserError(null);

      const data = await getUserDataAction(userId);
      if (data) {
        setUserData(data);
      } else {
        setUserError("Erro ao carregar dados do usuário");
      }
    } catch (error) {
      setUserError(
        error instanceof Error
          ? error.message
          : "Erro ao carregar dados do usuário"
      );
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  const updateUser = async (userId: string, data: UserEditFormData) => {
    try {
      setIsUpdatingUser(true);
      setUserError(null);

      const result = await updateUserDataAction(userId, data);

      if (result.success && result.data) {
        setUserData(result.data);
        return { success: true };
      } else {
        setUserError(result.error || "Erro ao atualizar dados");
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar dados";
      setUserError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const updatePassword = async (
    userId: string,
    data: PasswordChangeFormData
  ) => {
    try {
      setIsUpdatingPassword(true);
      setPasswordError(null);

      const result = await updateUserPasswordAction(userId, data.newPassword);

      if (result.success) {
        return { success: true };
      } else {
        setPasswordError(result.error || "Erro ao alterar senha");
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao alterar senha";
      setPasswordError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const clearErrors = () => {
    setUserError(null);
    setPasswordError(null);
  };

  return {
    userData,
    isLoadingUser,
    isUpdatingUser,
    isUpdatingPassword,
    userError,
    passwordError,
    loadUserData,
    updateUser,
    updatePassword,
    clearErrors,
  };
}
