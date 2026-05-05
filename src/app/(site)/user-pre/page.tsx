"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  preRegisterSchema,
  PreRegisterFormData,
} from "@/lib/forms/register.form";
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
import { Textarea } from "@/components/ui/textarea";
import { checkPreRegisterToken } from "@/lib/user-pre.service";
import { useState } from "react";
import { ArrowLeft, TicketCheck } from "lucide-react";
import Link from "next/link";
import { Callout, CalloutDescription } from "@/components/ui/callout";
import { FieldError } from "@/components/form/field-error";

export default function UserPre() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PreRegisterFormData>({
    resolver: zodResolver(preRegisterSchema),
    defaultValues: {
      email: "",
      token: "",
    },
  });

  const handleChange = () => {
    setErrorMessage("");
  };

  const onSubmit = async (data: PreRegisterFormData) => {
    const response = await checkPreRegisterToken(data.email, data.token);
    if (!response.success) {
      setErrorMessage(response.message || "Erro ao verificar o token");
      return;
    }
    const queryParams = new URLSearchParams({
      email: data.email,
      token: data.token,
    }).toString();
    router.push(`/user-pre/confirm?${queryParams}`);
  };

  return (
    <div className="flex items-center justify-center p-6 md:p-10">
      <div className="flex flex-col w-full max-w-sm md:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TicketCheck className="h-5 w-5" />
              Pré Cadastro
            </CardTitle>
            <CardDescription>
              Informe seu e-mail e token recebido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-8">
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Seu e-mail"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                    onChange={handleChange}
                  />
                  <FieldError id="email-error">
                    {errors.email?.message}
                  </FieldError>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="token">Token</Label>
                  <Textarea
                    id="token"
                    placeholder="Digite seu token"
                    {...register("token")}
                    className="font-mono"
                    aria-invalid={!!errors.token}
                    aria-describedby={errors.token ? "token-error" : undefined}
                    disabled={isSubmitting}
                    rows={3}
                    onChange={handleChange}
                  />
                  <FieldError id="token-error">
                    {errors.token?.message}
                  </FieldError>
                </div>
                {errorMessage && (
                  <Callout variant="destructive">
                    <CalloutDescription>{errorMessage}</CalloutDescription>
                  </Callout>
                )}
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary cursor-pointer"
                  >
                    <TicketCheck className="h-4 w-4" />
                    {isSubmitting ? "Validando..." : "Validar Dados"}
                  </Button>
                </div>
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
    </div>
  );
}
