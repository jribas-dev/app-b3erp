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
} from "@/lib/forms/lost-password.form";
import Link from "next/link";
import { Callout, CalloutDescription } from "@/components/ui/callout";
import { FieldError } from "@/components/form/field-error";

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
            <div
              aria-hidden="true"
              className="mx-auto w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mb-4"
            >
              <Mail width={24} height={24} />
            </div>
            <CardTitle>Email enviado!</CardTitle>
            <CardDescription>
              Verifique sua caixa de entrada e siga as instruções para redefinir
              sua senha.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Callout variant="success" className="mb-4">
              <CalloutDescription>{successMessage}</CalloutDescription>
            </Callout>
            <p className="text-sm text-muted-foreground mb-4">
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
                  aria-invalid={!!form.formState.errors.email}
                  aria-describedby={
                    form.formState.errors.email ? "email-error" : undefined
                  }
                  {...form.register("email")}
                  onChange={handleChange}
                />
                <FieldError id="email-error">
                  {form.formState.errors.email?.message}
                </FieldError>
              </div>

              {error && (
                <Callout variant="destructive">
                  <CalloutDescription>{error}</CalloutDescription>
                </Callout>
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
