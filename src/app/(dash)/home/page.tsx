"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth.hook";
import { useSession } from "@/hooks/useSession.hook";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function HomePage() {
  const { session, isLoading, error, refetch } = useSession();
  const { selectInstance, logout, isPending } = useAuth();
  const [instanceError, setInstanceError] = useState("");
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null
  );
  const [instances] = useState([
    { id: "g009qh2hnvwzp4likl3hgr1h", name: "Área de Desenvolvimento" },
    { id: "cprd7b8uvkbe1ng8qyut79m3", name: "Área de Demonstração" },
  ]); // Você deve buscar as instâncias do backend

  // Atualiza a sessão quando uma instância é selecionada
  useEffect(() => {
    if (selectedInstanceId && !isPending) {
      // Aguarda um pouco para o backend processar e depois atualiza a sessão
      const timer = setTimeout(() => {
        refetch();
        setSelectedInstanceId(null); // Reset do estado
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [selectedInstanceId, isPending, refetch]);

  const handleInstanceSelect = async (instanceId: string) => {
    setInstanceError("");
    setSelectedInstanceId(instanceId);

    try {
      const result = await selectInstance(instanceId);
      if (!result.success && result.error) {
        // Filtra o erro NEXT_REDIRECT que não é um erro real
        if (
          result.error !== "NEXT_REDIRECT" &&
          !result.error.includes("NEXT_REDIRECT")
        ) {
          setInstanceError(result.error);
        }
        setSelectedInstanceId(null);
      }
      // Se success é true, o useEffect vai lidar com o refetch
    } catch (error) {
      console.error("Erro ao selecionar instância:", error);
      setInstanceError("Erro inesperado ao selecionar instância");
      setSelectedInstanceId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-red-800 font-medium">
              Erro ao carregar sessão
            </h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={refetch}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Bem-vindo, {session.email}
              </h1>
              {session.instanceName && (
                <p className="text-sm text-gray-600">
                  Instância:{" "}
                  <span className="text-blue-600">{session.instanceName}</span>
                </p>
              )}
            </div>
            <button
              onClick={logout}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saindo..." : "Sair"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:px-2 lg:px-4">
        <div className="bg-white overflow-hidden shadow rounded-lg mx-4">
          <div className="px-4 py-4">
            <div className="max-w-full">
              <Select
                value={selectedInstanceId || ""}
                onValueChange={(value) => handleInstanceSelect(value)}
                disabled={isPending}
              >
                <SelectTrigger
                  className="w-full"
                  aria-label="Selecione uma instância"
                >
                  <SelectValue placeholder="Escolha uma instância" />
                </SelectTrigger>
                <SelectContent>
                  {instances.map((instance) => (
                    <SelectItem
                      key={instance.id}
                      value={instance.id}
                      disabled={isPending}
                    >
                      {instance.name}
                      {selectedInstanceId === instance.id && (
                        <span className="ml-2 text-indigo-600 text-xs">
                          Abrindo...
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {instanceError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{instanceError}</p>
                </div>
              )}
              {selectedInstanceId && isPending && (
                <div className="flex items-center mt-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                  <span className="text-xs text-indigo-600">Abrindo...</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {session.instanceName && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Dashboard Principal
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <a
                    href="/saler"
                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Área de Vendas
                      </p>
                    </div>
                  </a>
                  <a
                    href="/buyer"
                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Área de Compras
                      </p>
                    </div>
                  </a>
                  {session.roleFront === "supervisor" && (
                    <a
                      href="/super"
                      className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          Supervisão
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
