"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useActionState } from "react";
import { signIn } from "@/app/actions/auth";

export const FormLogin: React.FC = () => {
  const [state, action, pending] = useActionState(signIn, undefined);

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
            <form action={action}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="mail@example.com"
                    autoComplete="username"
                    required
                  />
                  {state?.errors?.email && (
                    <p style={{ color: "red" }}>{state.errors.email}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" name="password" type="password" autoComplete="current-password" required />
                  {state?.errors?.password && (
                    <div>
                      <p>Campo senha deve:</p>
                      <ul>
                        {state.errors.password.map((error) => (
                          <li key={error}>- {error}</li>
                        ))}
                      </ul>
                    </div>
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
                <div className="flex flex-col gap-3">
                  <Button
                    disabled={pending}
                    type="submit"
                    className="w-full cursor-pointer shadow-md"
                  >
                    Login
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
