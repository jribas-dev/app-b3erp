"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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
import { ArrowLeft, User, Lock, Save, KeyRound } from "lucide-react";
import { useSession } from "@/hooks/useSession.hook";
import { useUserEdit } from "@/hooks/useUserEdit.hook";
import {
  UserEditFormData,
  UserEditFormSchema,
  PasswordChangeFormData,
  PasswordChangeSchema,
} from "@/lib/forms/user-edit.form";
import { LoadingFallbackLarge } from "@/components/home/loading-fallback";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Callout, CalloutDescription } from "@/components/ui/callout";
import { FieldError } from "@/components/form/field-error";

export default function UserEditPage() {
  const router = useRouter();
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
    return <LoadingFallbackLarge />;
  }

  if (!session?.userId || !userData) {
    return (
      <div className="flex items-center justify-center px-3 py-4">
        <Callout variant="destructive" className="max-w-md">
          <CalloutDescription>
            Erro ao carregar dados do usuário.
          </CalloutDescription>
        </Callout>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-3 py-4 max-w-xl mx-auto">
      <div>
        <Button variant="outline" size="sm" onClick={() => router.push("/home")} className="gap-2">
          <ArrowLeft size={16} />
          Cancelar
        </Button>
      </div>

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
            <div className="flex flex-col gap-4">
              <div className="grid gap-1">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  disabled={isUpdatingUser}
                  aria-invalid={!!userForm.formState.errors.name}
                  aria-describedby={
                    userForm.formState.errors.name ? "name-error" : undefined
                  }
                  {...userForm.register("name")}
                />
                <FieldError id="name-error">
                  {userForm.formState.errors.name?.message}
                </FieldError>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  disabled={isUpdatingUser}
                  aria-invalid={!!userForm.formState.errors.email}
                  aria-describedby={
                    userForm.formState.errors.email ? "email-error" : undefined
                  }
                  {...userForm.register("email")}
                />
                <FieldError id="email-error">
                  {userForm.formState.errors.email?.message}
                </FieldError>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="phone">Telefone</Label>
                <Controller
                  name="phone"
                  control={userForm.control}
                  render={({ field }) => (
                    <PhoneInput
                      id="phone"
                      disabled={isUpdatingUser}
                      error={!!userForm.formState.errors.phone}
                      {...field}
                    />
                  )}
                />
                <FieldError id="phone-error">
                  {userForm.formState.errors.phone?.message}
                </FieldError>
              </div>

              {userError && (
                <Callout variant="destructive">
                  <CalloutDescription>{userError}</CalloutDescription>
                </Callout>
              )}

              {userUpdateSuccess && (
                <Callout variant="success">
                  <CalloutDescription>
                    Dados atualizados com sucesso!
                  </CalloutDescription>
                </Callout>
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
              <div className="flex flex-col gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="password">Senha</Label>
                  <Controller
                    name="newPassword"
                    control={passwordForm.control}
                    render={({ field }) => (
                      <PasswordInput
                        id="newPassword"
                        placeholder="Utilize uma senha segura"
                        disabled={isUpdatingPassword}
                        autoComplete="new-password"
                        showStrengthMeter={true}
                        error={!!passwordForm.formState.errors.newPassword}
                        {...field}
                      />
                    )}
                  />
                  <FieldError id="newPassword-error">
                    {passwordForm.formState.errors.newPassword?.message}
                  </FieldError>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Controller
                    name="confirmPassword"
                    control={passwordForm.control}
                    render={({ field }) => (
                      <PasswordInput
                        id="confirmPassword"
                        placeholder="Repita sua senha"
                        disabled={isUpdatingPassword}
                        showStrengthMeter={false}
                        error={!!passwordForm.formState.errors.confirmPassword}
                        {...field}
                      />
                    )}
                  />
                  <FieldError id="confirmPassword-error">
                    {passwordForm.formState.errors.confirmPassword?.message}
                  </FieldError>
                </div>

                {passwordError && (
                  <Callout variant="destructive">
                    <CalloutDescription>{passwordError}</CalloutDescription>
                  </Callout>
                )}

                {passwordUpdateSuccess && (
                  <Callout variant="success">
                    <CalloutDescription>
                      Senha alterada com sucesso!
                    </CalloutDescription>
                  </Callout>
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
