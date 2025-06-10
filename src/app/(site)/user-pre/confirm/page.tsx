"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import {
  completeRegisterSchema,
  CompleteRegisterFormData,
} from "@/lib/validations/register.form";
import {
  checkPreRegisterToken,
  completeUserRegistration,
} from "@/lib/user-pre.service";
import { PhoneInput } from "@/components/ui/phone-input";
import { PasswordInput } from "@/components/ui/password-input";
import { ShieldCheck } from "lucide-react";

// Status da validação do token
type ValidationStatus = "loading" | "valid" | "invalid" | "error";

export default function Confirmacao() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CompleteRegisterFormData>({
    resolver: zodResolver(completeRegisterSchema),
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      passwordConfirm: "",
    },
  });

  // Validar o token no backend quando a página carrega
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);

    // Se temos email e token, validamos no backend
    const validateToken = async () => {
      if (!emailParam || !tokenParam) {
        setValidationStatus("invalid");
        setErrorMessage("Parâmetros de validação ausentes");
        return;
      }

      setValidationStatus("loading");

      const response = await checkPreRegisterToken(emailParam, tokenParam);

      if (response.success) {
        setValidationStatus("valid");
      } else {
        setValidationStatus("invalid");
        setErrorMessage(response.message || "Falha na validação do token");
      }
    };
    validateToken();
  }, [searchParams]);

  // Função para enviar o formulário completo
  const onSubmit = async (data: CompleteRegisterFormData) => {
    setErrorMessage("");

    try {
      const response = await completeUserRegistration(email, token, data);

      if (response.success) {
        router.push("/user-pre/welcome");
      } else {
        setErrorMessage(response.message || "Erro ao completar o cadastro");
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      setErrorMessage(
        "Erro ao processar sua solicitação. Tente novamente mais tarde."
      );
    } finally {
    }
  };

  return (
    <div className="flex items-center justify-center p-6 md:p-10">
      <div className="flex flex-col w-full max-w-sm md:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Completar Cadastro
            </CardTitle>
            <CardDescription>
              Finalize o processo de criação da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Campo de email visível e token oculto */}
            <div className="w-full mb-6">
              <div className="flex flex-col w-full mb-4">
                <p className="text-sm font-medium">E-mail:</p>
                <p className="p-2 bg-gray-100 dark:bg-gray-600 rounded-sm border border-gray-400">
                  {email}
                </p>
              </div>
              <input type="hidden" name="token" value={token} />
            </div>

            {validationStatus === "loading" && (
              <div className="w-full flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="ml-2">Validando dados...</p>
              </div>
            )}

            {validationStatus === "invalid" && (
              <div className="w-full bg-red-100 p-4 rounded-md text-red-700 mb-4">
                <p className="text-center font-medium">Cadastro inválido</p>
                <p className="text-center text-sm">{errorMessage}</p>
              </div>
            )}

            {validationStatus === "error" && (
              <div className="w-full bg-red-100 p-4 rounded-md text-red-700 mb-4">
                <p className="text-center font-medium">Erro de comunicação</p>
                <p className="text-center text-sm">{errorMessage}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {validationStatus === "valid" && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <div className="grid gap-1">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu Nome Completo"
                    disabled={isSubmitting}
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <span className="text-xs text-red-400 mt-1">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="phone">Telefone</Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        id="phone"
                        disabled={isSubmitting}
                        error={!!errors.phone}
                        {...field}
                      />
                    )}
                  />
                  {errors.phone && (
                    <span className="text-xs text-red-400 mt-1">
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="password">Senha</Label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput
                        id="password"
                        placeholder="Utilize uma senha segura"
                        disabled={isSubmitting}
                        autoComplete="new-password"
                        showStrengthMeter={true}
                        error={!!errors.password}
                        {...field}
                      />
                    )}
                  />
                  {errors.password && (
                    <span className="text-xs text-red-400 mt-1">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="passwordConfirm">Confirmar Senha</Label>
                  <Controller
                    name="passwordConfirm"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput
                        id="passwordConfirm"
                        placeholder="Repita sua senha"
                        disabled={isSubmitting}
                        showStrengthMeter={false}
                        error={!!errors.passwordConfirm}
                        {...field}
                      />
                    )}
                  />
                  {errors.passwordConfirm && (
                    <span className="text-xs text-red-400 mt-1">
                      {errors.passwordConfirm.message}
                    </span>
                  )}
                </div>

                {errorMessage && (
                  <div className="bg-red-100 p-3 rounded-md text-red-700">
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                )}
                <div className="flex flex-col pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cursor-pointer shadow-md"
                  >
                    {isSubmitting ? "Concluindo..." : "Concluir Cadastro"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
