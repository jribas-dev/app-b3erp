"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth.hook";
import { useSession } from "@/hooks/useSession.hook";
import { useUserInstances } from "@/hooks/useUserInstances.hook";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DashboardMenu } from "@/components/home/dashboard-menu";
import { GitCommitHorizontal } from "lucide-react";
import { LoadingFallbackLargeFinish } from "@/components/home/loading-fallback";

export default function HomePage() {
  const {
    session,
    isLoading: isSessionLoading,
    error: sessionError,
    refetch: refetchSession,
  } = useSession();
  const { selectInstance, logout, isPending } = useAuth();
  const { instances, isLoadingInstances, errorInstances, fetchUserInstances } =
    useUserInstances();

  const [instanceError, setInstanceError] = useState("");
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null
  );
  const [showInstanceSelector, setShowInstanceSelector] = useState(false);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const [hasLoadedInstances, setHasLoadedInstances] = useState(false);

  // Memoiza o estado de loading geral
  const isLoading = useMemo(
    () => isSessionLoading || isLoadingInstances,
    [isSessionLoading, isLoadingInstances]
  );

  // Memoiza o erro geral
  const error = useMemo(
    () => sessionError || errorInstances,
    [sessionError, errorInstances]
  );

  // Carrega as instâncias quando a sessão estiver disponível
  useEffect(() => {
    if (session?.userId && !hasLoadedInstances && !isLoadingInstances) {
      setHasLoadedInstances(true);
      fetchUserInstances(session.userId);
    }
  }, [
    session?.userId,
    fetchUserInstances,
    hasLoadedInstances,
    isLoadingInstances,
  ]);

  // Determina se deve mostrar o seletor
  useEffect(() => {
    if (instances.length > 1 && !session?.instanceName) {
      setShowInstanceSelector(true);
    } else if (session?.instanceName) {
      setShowInstanceSelector(false);
    }
  }, [instances.length, session?.instanceName]);

  // Atualiza a sessão após selecionar instância
  useEffect(() => {
    if (selectedInstanceId && !isPending) {
      const timer = setTimeout(() => {
        refetchSession();
        setSelectedInstanceId(null);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [selectedInstanceId, isPending, refetchSession]);

  const handleInstanceSelect = useCallback(
    async (instanceId: string) => {
      setInstanceError("");
      setSelectedInstanceId(instanceId);

      try {
        const result = await selectInstance(instanceId);
        if (!result.success && result.error) {
          if (
            result.error !== "NEXT_REDIRECT" &&
            !result.error.includes("NEXT_REDIRECT")
          ) {
            setInstanceError(result.error);
          }
          setSelectedInstanceId(null);
        }
      } catch (error) {
        console.error("Erro ao selecionar instância:", error);
        setInstanceError("Erro inesperado ao selecionar instância");
        setSelectedInstanceId(null);
      }
    },
    [selectInstance]
  );

  // Lógica para auto-seleção de instância única
  useEffect(() => {
    if (
      instances.length === 1 &&
      !session?.instanceName &&
      !hasAutoSelected &&
      !isPending
    ) {
      setHasAutoSelected(true);
      handleInstanceSelect(instances[0].dbId);
    }
  }, [
    instances,
    session?.instanceName,
    hasAutoSelected,
    isPending,
    handleInstanceSelect,
  ]);

  const handleShowInstanceSelector = useCallback(() => {
    setShowInstanceSelector(true);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Componente de loading
  if (isLoading) {
    return <LoadingFallbackLargeFinish />;
  }

  // Componente de erro
  if (error || !session) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-red-800 font-medium">Erro ao carregar dados</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <div className="mt-3 space-x-2">
              <button
                onClick={() => {
                  refetchSession();
                  if (session?.userId) {
                    fetchUserInstances(session.userId);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Tentar novamente
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Situação: usuário sem instâncias
  if (hasLoadedInstances && !isLoadingInstances && instances.length === 0) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6">
            <h3 className="text-yellow-800 font-medium text-lg mb-2">
              Nenhuma instância disponível
            </h3>
            <p className="text-yellow-600 text-sm mb-4">
              Você não possui acesso a nenhuma instância ativa. Entre em contato
              com o administrador.
            </p>
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saindo..." : "Sair"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-t-lg border border-gray-200 dark:border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-lg font-bold">Bem-vindo, {session.email}</h1>
              {session.instanceName && (
                <div className="flex items-center space-x-2">
                  <p className="flex text-sm">
                    <GitCommitHorizontal size={16} />
                    &nbsp;{session.instanceName}
                  </p>
                  {instances.length > 1 && (
                    <button
                      onClick={handleShowInstanceSelector}
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-200 dark:hover:text-indigo-400 text-xs px-2 py-1 rounded border border-indigo-300 hover:border-indigo-400 transition-colors"
                      title="Trocar instância"
                    >
                      Trocar
                    </button>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saindo..." : "Sair"}
            </button>
          </div>

          {/* Seletor de instância */}
          {showInstanceSelector && (
            <div className="pb-6">
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
                        value={instance.dbId}
                        disabled={isPending}
                        className="leading-10"
                      >
                        <GitCommitHorizontal size={16} />
                        {instance.instanceName}
                        {selectedInstanceId === instance.dbId && (
                          <span className="ml-2 text-indigo-600 text-xs">
                            Abrindo...
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {instanceError && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded-md p-3">
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
          )}
        </div>
      </div>

      {/* Dashboard - só aparece quando uma instância está selecionada */}
      <div className="max-w-7xl mx-auto py-4 sm:px-2 lg:px-4">
        {session.instanceName && (
          <div className="flex-col">
            <div className="max-w-6xl mx-auto px-4">
              {/* Dashboard Menu */}
              <DashboardMenu userRole={session.roleFront} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
