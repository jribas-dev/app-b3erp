"use client";

import Link from "next/link";
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
import { useForm } from "react-hook-form";
import { SignInFormData, SignInFormSchema } from "@/lib/validations/sign-in.form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth.hook";
import { KeyRound } from "lucide-react";
import { Callout, CalloutDescription } from "@/components/ui/callout";
import { FieldError } from "@/components/form/field-error";
import { PasswordToggleButton } from "@/components/form/password-toggle-button";

export default function LoginPage() {
  const { login, isPending } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setError("");

    const result = await login(data, rememberMe);

    if (!result.success && result.error) {
      if (
        result.error !== "NEXT_REDIRECT" &&
        !result.error.includes("NEXT_REDIRECT")
      ) {
        setError(result.error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center p-6 md:p-10">
      <div className="flex flex-col gap-6 w-full max-w-sm md:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Acesso B3Erp
            </CardTitle>
            <CardDescription>
              Informe suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mail@example.com"
                    autoComplete="username"
                    disabled={isSubmitting || isPending}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                  <FieldError id="email-error">{errors.email?.message}</FieldError>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      disabled={isSubmitting || isPending}
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      className="pr-10"
                      {...register("password")}
                    />
                    <PasswordToggleButton
                      visible={showPassword}
                      onToggle={togglePasswordVisibility}
                      disabled={isSubmitting || isPending}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 flex items-center px-3"
                    />
                  </div>
                  <FieldError id="password-error">
                    {errors.password?.message}
                  </FieldError>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Input
                      id="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary accent-primary focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    <Label htmlFor="remember">Permanecer conectado</Label>
                  </div>
                  <Link
                    href="/auth/lost-password"
                    className="text-sm text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                {error && (
                  <Callout variant="destructive">
                    <CalloutDescription>{error}</CalloutDescription>
                  </Callout>
                )}
                <div className="flex flex-col gap-3">
                  <Button
                    disabled={isSubmitting || isPending}
                    type="submit"
                    className="w-full cursor-pointer shadow-md"
                  >
                    {isSubmitting ? "Entrando..." : "Fazer login"}
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Ainda não tem conta?{" "}
                <Link href="/user-pre" className="underline underline-offset-4">
                  Criar agora
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
