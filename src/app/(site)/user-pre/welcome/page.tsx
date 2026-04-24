"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CadastroConcluido() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container max-w-xl mx-auto p-6">
      <Card>
        <CardContent className="flex flex-col items-center text-center gap-4 p-6">
          <div
            aria-hidden="true"
            className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center"
          >
            <CheckCircle2 width={32} height={32} />
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            Cadastro concluído!
          </h1>
          <p className="text-muted-foreground">
            Seu cadastro foi realizado com sucesso.
            <br />
            Você já pode acessar a plataforma.
          </p>

          <Link href="/auth/login" className="w-full">
            <Button className="w-full">Ir para o login</Button>
          </Link>

          <p className="text-center text-sm text-muted-foreground">
            Você será redirecionado em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
