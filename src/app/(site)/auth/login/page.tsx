import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-6 md:p-10">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Acesso B3Erp</CardTitle>
            <CardDescription>Informe seu e-mail e senha</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mail@example.com"
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" required />
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
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Esqueceu sua senha?
                  </a>
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Ainda não tem conta?{" "}
                <a href="#" className="underline underline-offset-4">
                  Criar agora
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
