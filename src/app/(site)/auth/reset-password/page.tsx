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
import { Lock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useResetPassword } from "@/hooks/useLostPassword.hook";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/validations/reset-password.form";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { Callout, CalloutDescription } from "@/components/ui/callout";
import { FieldError } from "@/components/form/field-error";
import { Spinner } from "@/components/ui/spinner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

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

  useEffect(() => {
    if (token && email && !hasValidated.current) {
      hasValidated.current = true;
      validateToken(token, email);
    }
  }, [token, email, validateToken]);

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

  if (!token || !email) {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div
              aria-hidden="true"
              className="mx-auto w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4"
            >
              <XCircle width={24} height={24} />
            </div>
            <CardTitle>Link inválido</CardTitle>
            <CardDescription>
              Este link de recuperação de senha é inválido ou está malformado.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Callout variant="destructive" className="mb-4">
              <CalloutDescription>
                Parâmetros necessários não encontrados na URL.
              </CalloutDescription>
            </Callout>
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

  if (isValidating || isTokenValid === null) {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
            <Spinner size="md" />
            <p className="text-sm text-muted-foreground">
              Validando link de recuperação...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isTokenValid === false) {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div
              aria-hidden="true"
              className="mx-auto w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4"
            >
              <XCircle width={24} height={24} />
            </div>
            <CardTitle>Link inválido</CardTitle>
            <CardDescription>
              Este link de recuperação de senha é inválido ou já expirou.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {error && (
              <Callout variant="destructive" className="mb-4">
                <CalloutDescription>{error}</CalloutDescription>
              </Callout>
            )}
            <div className="flex flex-col gap-3">
              <Link href="/auth/lost-password">
                <Button variant="outline" className="w-full cursor-pointer">
                  Solicitar novo link
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost" className="w-full cursor-pointer">
                  <ArrowLeft width={16} height={16} className="mr-2" />
                  Voltar ao login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div
              aria-hidden="true"
              className="mx-auto w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle width={24} height={24} />
            </div>
            <CardTitle>Senha alterada!</CardTitle>
            <CardDescription>
              Sua senha foi alterada com sucesso. Você já pode fazer login com
              sua nova senha.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Callout variant="success" className="mb-4">
              <CalloutDescription>{successMessage}</CalloutDescription>
            </Callout>
            <p className="text-sm text-muted-foreground mb-4">
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

  return (
    <div className="flex items-center justify-center min-h-full p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock width={20} height={20} />
            Redefinir senha
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
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo?.email || email}
                  disabled
                  readOnly
                />
              </div>

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
                <FieldError id="password-error">
                  {form.formState.errors.password?.message}
                </FieldError>
              </div>

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
                <FieldError id="passwordConfirm-error">
                  {form.formState.errors.passwordConfirm?.message}
                </FieldError>
              </div>

              {error && (
                <Callout variant="destructive">
                  <CalloutDescription>{error}</CalloutDescription>
                </Callout>
              )}

              <Button
                type="submit"
                disabled={isUpdating}
                className="w-full flex items-center gap-2 cursor-pointer"
              >
                {isUpdating ? (
                  <>
                    <Spinner size="sm" tone="current" />
                    Alterando senha...
                  </>
                ) : (
                  <>
                    <Lock width={16} height={16} />
                    Alterar senha
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              <ArrowLeft aria-hidden="true" width={16} height={16} />
              Voltar para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
