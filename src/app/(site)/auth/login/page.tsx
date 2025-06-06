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
import { SignInFormData, SignInFormSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth.hook";

export default function LoginPage() {
  const { login, isPending } = useAuth();
  const [error, setError] = useState("");

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

    const result = await login(data);

    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex items-center justify-center p-6 md:p-10">
      <div className="flex flex-col gap-6 w-full max-w-sm md:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Acesso B3Erp</CardTitle>
            <CardDescription className="text-center">
              Informe seu e-mail e senha
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
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-400 mt-1">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="grid gap-1">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    disabled={isSubmitting || isPending}
                    {...register("password")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <span className="text-xs text-red-400 mt-1">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="remember">Lembrar-me</Label>
                  </div>
                  <Link
                    href="/auth/reset-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                {error && (
                  <div className="bg-red-100 p-3 rounded-md text-red-700">
                    <p className="text-sm">{error}</p>
                  </div>
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
