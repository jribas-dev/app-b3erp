"use client";

import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Lock, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { useResetPassword } from "@/hooks/useLostPassword.hook";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/validations/reset-password.form";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Flag para evitar múltiplas validações
  const hasValidated = useRef(false);

  const {
    isValidating,
    isUpdating,
    error,
    successMessage,
    userInfo,
    isTokenValid,
    validateToken,
    updatePassword,
    clearMessages,
  } = useResetPassword();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  // Valida o token quando a página carrega (apenas uma vez)
  useEffect(() => {
    if (token && email && !hasValidated.current) {
      hasValidated.current = true;
      validateToken(token, email);
    }
  }, [token, email, validateToken]);

  // Redireciona após 3 segundos quando há sucesso
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email) return;

    clearMessages();
    const result = await updatePassword(token, email, data);

    if (result.success) {
      form.reset();
    }
  };

  // Se os parâmetros não existem
  if (!token || !email) {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Link Inválido</CardTitle>
            <CardDescription>
              Este link de recuperação de senha é inválido ou está malformado.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-red-50 border border-red-200 p-3 rounded-md mb-4">
              <p className="text-sm text-red-700">
                Parâmetros necessários não encontrados na URL
              </p>
            </div>
            <Link href="/auth/lost-password">
              <Button variant="outline" className="w-full cursor-pointer">
                Solicitar novo link
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se está validando o token OU ainda não validou
  if (isValidating || isTokenValid === null) {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
            <p className="text-gray-600">Validando link de recuperação...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se o token é inválido
  if (isTokenValid === false) {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Link Inválido</CardTitle>
            <CardDescription>
              Este link de recuperação de senha é inválido ou já expirou.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {error && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-md mb-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div className="space-y-3">
              <Link href="/auth/lost-password">
                <Button variant="outline" className="w-full cursor-pointer">
                  Solicitar novo link
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost" className="w-full cursor-pointer">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se há mensagem de sucesso
  if (successMessage) {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-800">Senha Alterada!</CardTitle>
            <CardDescription>
              Sua senha foi alterada com sucesso. Você já pode fazer login com
              sua nova senha.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Você será redirecionado para o login em alguns segundos...
            </p>
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full cursor-pointer"
            >
              Ir para o login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Formulário principal
  return (
    <div className="flex items-center justify-center min-h-full p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Redefinir Senha
          </CardTitle>
          <CardDescription>
            {userInfo?.name && (
              <span className="block mb-2">
                Olá, <strong>{userInfo.name}</strong>!
              </span>
            )}
            Digite sua nova senha para finalizar a recuperação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Email (visível mas desabilitado) */}
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo?.email || email}
                  disabled
                  className="bg-gray-50 text-gray-600"
                />
              </div>

              {/* Nova senha */}
              <div className="grid gap-1">
                <Label htmlFor="password">Nova senha</Label>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <PasswordInput
                      id="password"
                      placeholder="Digite sua nova senha"
                      disabled={isUpdating}
                      autoComplete="new-password"
                      showStrengthMeter={true}
                      error={!!form.formState.errors.password}
                      {...field}
                    />
                  )}
                />
                {form.formState.errors.password && (
                  <span className="text-xs text-red-400 mt-1">
                    {form.formState.errors.password.message}
                  </span>
                )}
              </div>

              {/* Confirmar senha */}
              <div className="grid gap-1">
                <Label htmlFor="passwordConfirm">Confirmar nova senha</Label>
                <Controller
                  name="passwordConfirm"
                  control={form.control}
                  render={({ field }) => (
                    <PasswordInput
                      id="passwordConfirm"
                      placeholder="Confirme sua nova senha"
                      disabled={isUpdating}
                      showStrengthMeter={false}
                      error={!!form.formState.errors.passwordConfirm}
                      {...field}
                    />
                  )}
                />
                {form.formState.errors.passwordConfirm && (
                  <span className="text-xs text-red-400 mt-1">
                    {form.formState.errors.passwordConfirm.message}
                  </span>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isUpdating}
                className="w-full flex items-center gap-2 cursor-pointer"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Alterando senha...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Alterar senha
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
