"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { preRegisterSchema, PreRegisterFormData } from "@/lib/validations";
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

export default function UserPre() {
  const router = useRouter();

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

  const onSubmit = async (data: PreRegisterFormData) => {
    const response = await checkPreRegisterToken(data.email, data.token);
    if (!response.success) {
      // Exibir mensagem de erro se o token for inválido
      alert(response.message || "Erro ao verificar o token");
      return;
    }

    // Construir a URL com os parâmetros de consulta
    const queryParams = new URLSearchParams({
      email: data.email,
      token: data.token,
    }).toString();

    // Redirecionar para a segunda rota com os parâmetros
    router.push(`/user-pre/confirm?${queryParams}`);
  };

  return (
    <div className="flex items-center justify-center p-6 md:p-10">
      <div className="flex flex-col w-full max-w-sm md:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Pré cadastro</CardTitle>
            <CardDescription className="text-center">
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
                  />
                  {errors.token && (
                    <span className="text-xs text-red-400 mt-1">
                      {errors.token.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
