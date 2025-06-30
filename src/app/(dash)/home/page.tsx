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
import { DatabaseZap, GitCommitHorizontal } from "lucide-react";
import { LoadingFallbackLarge } from "@/components/home/loading-fallback";

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
    return <LoadingFallbackLarge />;
  }

  // Componente de erro
  if (error || !session) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
            <h3 className="text-destructive-foreground font-medium">
              Erro ao carregar dados
            </h3>
            <p className="text-destructive text-sm mt-1">{error}</p>
            <div className="mt-3 space-x-2">
              <button
                onClick={() => {
                  refetchSession();
                  if (session?.userId) {
                    fetchUserInstances(session.userId);
                  }
                }}
                className="bg-destructive hover:bg-destructive/90 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Tentar novamente
              </button>
              <button
                onClick={handleLogout}
                className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-md text-sm font-medium"
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
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-6">
            <h3 className="text-yellow-800 dark:text-yellow-300 font-medium text-lg mb-2">
              Nenhuma instância disponível
            </h3>
            <p className="text-yellow-600 dark:text-yellow-400 text-sm mb-4">
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
      <div className="bg-card shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1 py-3">
            {/* Saudação ao usuário - agora com um destaque maior */}
            <div className="flex-shrink-0">
              <h1 className="text-lg font-medium text-foreground">
                Bem-vindo, <span className="font-bold">{session.email}</span>
              </h1>
            </div>

            {/* Seção da Instância - alinhada à direita em telas maiores */}
            <div className="flex items-center gap-4">
              {session.instanceName && !showInstanceSelector && (
                <div className="flex items-center gap-3 bg-secondary/20 text-secondary-foreground p-2 rounded-lg">
                  <DatabaseZap className="h-5 w-5 text-destructive" />
                  <p className="text-foreground text-xs font-semibold">
                    {session.instanceName}
                  </p>
                  {instances.length > 1 && (
                    <button
                      onClick={handleShowInstanceSelector}
                      className="text-xs font-medium text-destructive hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                      title="Trocar instância"
                    >
                      Trocar
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Seletor de instância - aparece em uma nova seção para maior clareza */}
          {showInstanceSelector && (
            <div className="py-4 border-t border-border/80 animate-in fade-in-20 slide-in-from-top-1">
              <div className="w-full max-w-sm mx-auto">
                <p className="text-sm font-medium text-center mb-2">
                  Selecione uma instância para continuar
                </p>
                <Select
                  value={selectedInstanceId || ""}
                  onValueChange={(value) => handleInstanceSelect(value)}
                  disabled={isPending}
                >
                  <SelectTrigger aria-label="Selecione uma instância" className="w-full">
                    <SelectValue placeholder="Escolha uma instância" />
                  </SelectTrigger>
                  <SelectContent>
                    {instances.map((instance) => (
                      <SelectItem
                        key={instance.id}
                        value={instance.dbId}
                        disabled={isPending}
                        // Melhorando o alinhamento interno do item
                        className="flex items-center gap-2"
                      >
                        <GitCommitHorizontal className="h-4 w-4 text-muted-foreground" />
                        <span>{instance.instanceName}</span>
                        {selectedInstanceId === instance.dbId && (
                          <span className="ml-auto text-primary text-xs flex items-center gap-1">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                            Abrindo...
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {instanceError && (
                  <div className="mt-2 text-center bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    <p className="text-destructive text-sm">{instanceError}</p>
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
            <div className="max-w-6xl mx-auto px-2">
              {/* Dashboard Menu */}
              <DashboardMenu userRole={session.roleFront} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
