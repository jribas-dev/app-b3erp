"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { Mail, ArrowLeft } from "lucide-react";
import { useLostPassword } from "@/hooks/useLostPassword.hook";
import {
  LostPasswordFormData,
  LostPasswordFormSchema,
} from "@/lib/validations/lost-password.form";
import Link from "next/link";

export default function LostPasswordPage() {
  const router = useRouter();
  const { isLoading, error, successMessage, resetPassword, clearMessages } =
    useLostPassword();

  const form = useForm<LostPasswordFormData>({
    resolver: zodResolver(LostPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleChange = () => {
    clearMessages();
  };

  // Redireciona após 6 segundos quando há sucesso
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, router]);

  const onSubmit = async (data: LostPasswordFormData) => {
    clearMessages();
    await resetPassword(data);
  };

  // Se há mensagem de sucesso, mostra tela de confirmação
  if (successMessage) {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-800">Email Enviado!</CardTitle>
            <CardDescription>
              Verifique sua caixa de entrada e siga as instruções para redefinir
              sua senha.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Você será redirecionado automaticamente em alguns segundos...
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full cursor-pointer"
            >
              Voltar ao início
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
            <Mail className="h-5 w-5" />
            Esqueci minha senha
          </CardTitle>
          <CardDescription>
            Digite seu email para receber as instruções de recuperação
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
                  placeholder="seu@email.com"
                  disabled={isLoading}
                  {...form.register("email")}
                  className={
                    form.formState.errors.email ? "border-red-500" : ""
                  }
                  onChange={handleChange}
                />
                {form.formState.errors.email && (
                  <span className="text-xs text-red-400 mt-1">
                    {form.formState.errors.email.message}
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
                disabled={isLoading}
                className="w-full flex items-center gap-2 cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                {isLoading ? "Enviando..." : "Enviar email de recuperação"}
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
