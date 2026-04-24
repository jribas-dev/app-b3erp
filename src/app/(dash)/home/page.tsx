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
import { Button } from "@/components/ui/button";
import {
  Callout,
  CalloutActions,
  CalloutDescription,
  CalloutTitle,
} from "@/components/ui/callout";
import { Spinner } from "@/components/ui/spinner";

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
      <div className="min-h-full flex items-center justify-center p-4">
        <Callout variant="destructive" className="max-w-md">
          <CalloutTitle>Erro ao carregar dados</CalloutTitle>
          {error && <CalloutDescription>{error}</CalloutDescription>}
          <CalloutActions>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                refetchSession();
                if (session?.userId) {
                  fetchUserInstances(session.userId);
                }
              }}
            >
              Tentar novamente
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </CalloutActions>
        </Callout>
      </div>
    );
  }

  // Situação: usuário sem instâncias
  if (hasLoadedInstances && !isLoadingInstances && instances.length === 0) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <Callout variant="warning" className="max-w-md">
          <CalloutTitle>Nenhuma instância disponível</CalloutTitle>
          <CalloutDescription>
            Você não possui acesso a nenhuma instância ativa. Entre em contato
            com o administrador.
          </CalloutDescription>
          <CalloutActions>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isPending}
            >
              {isPending ? "Saindo..." : "Sair"}
            </Button>
          </CalloutActions>
        </Callout>
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
                <div className="flex items-center gap-3 bg-secondary/40 text-secondary-foreground px-3 py-2 rounded-(--radius) border border-border">
                  <DatabaseZap
                    aria-hidden="true"
                    width={18}
                    height={18}
                    className="text-primary"
                  />
                  <p className="text-foreground text-xs font-semibold">
                    {session.instanceName}
                  </p>
                  {instances.length > 1 && (
                    <button
                      type="button"
                      onClick={handleShowInstanceSelector}
                      className="text-xs font-medium text-accent hover:underline
                                 focus-visible:outline-none focus-visible:ring-2
                                 focus-visible:ring-primary focus-visible:ring-offset-1
                                 rounded"
                      aria-label="Trocar instância"
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
                          <span className="ml-auto text-primary text-xs flex items-center gap-1.5">
                            <Spinner size="sm" />
                            Abrindo...
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {instanceError && (
                  <Callout variant="destructive" className="mt-3">
                    <CalloutDescription>{instanceError}</CalloutDescription>
                  </Callout>
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
