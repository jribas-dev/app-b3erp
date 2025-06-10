"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  preRegisterSchema,
  PreRegisterFormData,
} from "@/lib/validations/register.form";
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
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-400 mt-1">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                {/* Campo Token */}
                <div className="grid gap-1">
                  <div className="flex items-center">
                    <Label htmlFor="token">Token</Label>
                  </div>
                  <Textarea
                    id="token"
                    placeholder="Digite seu token"
                    {...register("token")}
                    className={
                      errors.token ? "border-red-500 font-mono" : "font-mono"
                    }
                    disabled={isSubmitting}
                    rows={3}
                    onChange={handleChange}
                  />
                  {errors.token && (
                    <span className="text-xs text-red-400 mt-1">
                      {errors.token.message}
                    </span>
                  )}
                </div>
                {errorMessage && (
                  <div className="bg-red-100 p-3 rounded-md text-red-700">
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
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
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
