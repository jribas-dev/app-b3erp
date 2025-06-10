"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User, Lock, Save, KeyRound } from "lucide-react";
import { useSession } from "@/hooks/useSession.hook";
import { useUserEdit } from "@/hooks/useUserEdit.hook";
import {
  UserEditFormData,
  UserEditFormSchema,
  PasswordChangeFormData,
  PasswordChangeSchema,
} from "@/lib/validations";
import { LoadingFallbackLargeFinish } from "@/components/home/loading-fallback";

export default function UserEditPage() {
  const { session, isLoading: isLoadingSession } = useSession();
  const {
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
  } = useUserEdit();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

  // Form para dados do usuário
  const userForm = useForm<UserEditFormData>({
    resolver: zodResolver(UserEditFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Form para alteração de senha
  const passwordForm = useForm<PasswordChangeFormData>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Carrega dados do usuário quando a sessão estiver disponível
  useEffect(() => {
    if (session?.userId) {
      loadUserData(session.userId);
    }
  }, [session?.userId, loadUserData]);

  // Popula o formulário quando os dados do usuário são carregados
  useEffect(() => {
    if (userData) {
      userForm.reset({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      });
    }
  }, [userData, userForm]);

  // Limpa mensagens de sucesso após 3 segundos
  useEffect(() => {
    if (userUpdateSuccess) {
      const timer = setTimeout(() => setUserUpdateSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [userUpdateSuccess]);

  useEffect(() => {
    if (passwordUpdateSuccess) {
      const timer = setTimeout(() => {
        setPasswordUpdateSuccess(false);
        setShowChangePassword(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [passwordUpdateSuccess]);

  const onSubmitUserData = async (data: UserEditFormData) => {
    if (!session?.userId) return;

    clearErrors();
    setUserUpdateSuccess(false);

    const result = await updateUser(session.userId, data);
    if (result.success) {
      setUserUpdateSuccess(true);
    }
  };

  const onSubmitPassword = async (data: PasswordChangeFormData) => {
    if (!session?.userId) return;

    clearErrors();
    setPasswordUpdateSuccess(false);

    const result = await updatePassword(session.userId, data);
    if (result.success) {
      setPasswordUpdateSuccess(true);
      passwordForm.reset();
    }
  };

  const handleCancelPasswordChange = () => {
    setShowChangePassword(false);
    passwordForm.reset();
    clearErrors();
  };

  if (isLoadingSession || isLoadingUser) {
    return <LoadingFallbackLargeFinish />;
  }

  if (!session?.userId || !userData) {
    return (
      <div className="flex items-center justify-center p-6 md:p-10">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Erro ao carregar dados do usuário</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-2xl mx-auto">
      {/* Card principal - Dados do usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados do Usuário
          </CardTitle>
          <CardDescription>Atualize suas informações pessoais</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={userForm.handleSubmit(onSubmitUserData)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-1">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  disabled={isUpdatingUser}
                  {...userForm.register("name")}
                  className={
                    userForm.formState.errors.name ? "border-red-500" : ""
                  }
                />
                {userForm.formState.errors.name && (
                  <span className="text-xs text-red-400 mt-1">
                    {userForm.formState.errors.name.message}
                  </span>
                )}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  disabled={isUpdatingUser}
                  {...userForm.register("email")}
                  className={
                    userForm.formState.errors.email ? "border-red-500" : ""
                  }
                />
                {userForm.formState.errors.email && (
                  <span className="text-xs text-red-400 mt-1">
                    {userForm.formState.errors.email.message}
                  </span>
                )}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  disabled={isUpdatingUser}
                  {...userForm.register("phone")}
                  className={
                    userForm.formState.errors.phone ? "border-red-500" : ""
                  }
                />
                {userForm.formState.errors.phone && (
                  <span className="text-xs text-red-400 mt-1">
                    {userForm.formState.errors.phone.message}
                  </span>
                )}
              </div>

              {userError && (
                <div className="bg-red-100 p-3 rounded-md text-red-700">
                  <p className="text-sm">{userError}</p>
                </div>
              )}

              {userUpdateSuccess && (
                <div className="bg-green-100 p-3 rounded-md text-green-700">
                  <p className="text-sm">Dados atualizados com sucesso!</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isUpdatingUser}
                className="w-full flex items-center gap-2 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {isUpdatingUser ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Card de alteração de senha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Segurança
          </CardTitle>
          <CardDescription>Altere sua senha de acesso</CardDescription>
        </CardHeader>
        <CardContent>
          {!showChangePassword ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowChangePassword(true)}
              className="w-full flex items-center gap-2"
            >
              <KeyRound className="h-4 w-4" />
              Alterar Senha
            </Button>
          ) : (
            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-1">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha"
                      disabled={isUpdatingPassword}
                      {...passwordForm.register("newPassword")}
                      className={`pr-10 ${
                        passwordForm.formState.errors.newPassword
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer"
                      disabled={isUpdatingPassword}
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordForm.formState.errors.newPassword && (
                    <span className="text-xs text-red-400 mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </span>
                  )}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      disabled={isUpdatingPassword}
                      {...passwordForm.register("confirmPassword")}
                      className={`pr-10 ${
                        passwordForm.formState.errors.confirmPassword
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer"
                      disabled={isUpdatingPassword}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordForm.formState.errors.confirmPassword && (
                    <span className="text-xs text-red-400 mt-1">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </span>
                  )}
                </div>

                {passwordError && (
                  <div className="bg-red-100 p-3 rounded-md text-red-700">
                    <p className="text-sm">{passwordError}</p>
                  </div>
                )}

                {passwordUpdateSuccess && (
                  <div className="bg-green-100 p-3 rounded-md text-green-700">
                    <p className="text-sm">Senha alterada com sucesso!</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="flex-1 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    {isUpdatingPassword ? "Salvando..." : "Salvar Nova Senha"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelPasswordChange}
                    disabled={isUpdatingPassword}
                    className="flex-1 cursor-pointer"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
