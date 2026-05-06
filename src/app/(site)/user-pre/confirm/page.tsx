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
} from "@/lib/forms/register.form";
import {
  checkPreRegisterToken,
  completeUserRegistration,
} from "@/lib/user-pre.service";
import { PhoneInput } from "@/components/ui/phone-input";
import { PasswordInput } from "@/components/ui/password-input";
import { logError } from "@/lib/observability/log";
import { ShieldCheck } from "lucide-react";
import {
  Callout,
  CalloutActions,
  CalloutDescription,
  CalloutTitle,
} from "@/components/ui/callout";
import { FieldError } from "@/components/form/field-error";
import { Spinner } from "@/components/ui/spinner";

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

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);

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
      logError("user-pre.confirm.submit", error);
      setErrorMessage(
        "Erro ao processar sua solicitação. Tente novamente mais tarde."
      );
    }
  };

  return (
    <div className="flex items-center justify-center p-6 md:p-10">
      <div className="flex flex-col w-full max-w-sm md:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck width={20} height={20} />
              Completar Cadastro
            </CardTitle>
            <CardDescription>
              Finalize o processo de criação da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full mb-6">
              <div className="flex flex-col w-full mb-4">
                <p className="text-sm font-medium text-foreground">E-mail:</p>
                <p className="p-2 bg-muted text-foreground rounded-(--radius) border border-border">
                  {email}
                </p>
              </div>
              <input type="hidden" name="token" value={token} />
            </div>

            {validationStatus === "loading" && (
              <div className="w-full flex items-center justify-center gap-3 py-8">
                <Spinner size="md" />
                <p className="text-sm text-muted-foreground">
                  Validando dados...
                </p>
              </div>
            )}

            {validationStatus === "invalid" && (
              <Callout variant="destructive" className="mb-4">
                <CalloutTitle>Cadastro inválido</CalloutTitle>
                <CalloutDescription>{errorMessage}</CalloutDescription>
              </Callout>
            )}

            {validationStatus === "error" && (
              <Callout variant="destructive" className="mb-4">
                <CalloutTitle>Erro de comunicação</CalloutTitle>
                <CalloutDescription>{errorMessage}</CalloutDescription>
                <CalloutActions>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    Tentar novamente
                  </Button>
                </CalloutActions>
              </Callout>
            )}

            {validationStatus === "valid" && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-4"
              >
                <div className="grid gap-1">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    {...register("name")}
                  />
                  <FieldError id="name-error">
                    {errors.name?.message}
                  </FieldError>
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
                  <FieldError id="phone-error">
                    {errors.phone?.message}
                  </FieldError>
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
                  <FieldError id="password-error">
                    {errors.password?.message}
                  </FieldError>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="passwordConfirm">Confirmar senha</Label>
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
                  <FieldError id="passwordConfirm-error">
                    {errors.passwordConfirm?.message}
                  </FieldError>
                </div>

                {errorMessage && (
                  <Callout variant="destructive">
                    <CalloutDescription>{errorMessage}</CalloutDescription>
                  </Callout>
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
