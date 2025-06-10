"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CadastroConcluido() {
  const router = useRouter();

  // Redirecionar para a home após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center bg-gray-200 dark:bg-gray-800 shadow-lg p-6 rounded-md mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-6">Cadastro Concluído!</h1>
        <p className="text-center mb-6">
          Seu cadastro foi realizado com sucesso.
          <br />
          Você já pode acessar a plataforma.
        </p>

        <div className="w-full mx-auto">
          <Link href="/auth/login">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mb-8 transition-colors">
              Ir para o Login
            </button>
          </Link>

          <p className="text-center text-sm">
            Você será redirecionado em breve.
          </p>
        </div>
      </div>
    </div>
  );
}
