"use client";

import { Button } from "@/components/ui/button";
import {
  Callout,
  CalloutActions,
  CalloutDescription,
  CalloutTitle,
} from "@/components/ui/callout";
import { DashboardMenu } from "@/components/home/dashboard-menu";
import { InstanceBanner } from "@/components/home/instance-banner";
import { InstanceSelector } from "@/components/home/instance-selector";
import { LoadingFallbackLarge } from "@/components/home/loading-fallback";
import { useInstanceSelector } from "@/hooks/useInstanceSelector.hook";

export default function HomePage() {
  const {
    session,
    isLoading,
    error,
    instances,
    hasLoadedInstances,
    isLoadingInstances,
    showInstanceSelector,
    selectedInstanceId,
    instanceError,
    isPending,
    handleInstanceSelect,
    handleShowInstanceSelector,
    handleLogout,
    handleRetry,
  } = useInstanceSelector();

  if (isLoading) {
    return <LoadingFallbackLarge />;
  }

  if (error || !session) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <Callout variant="destructive" className="max-w-md">
          <CalloutTitle>Erro ao carregar dados</CalloutTitle>
          {error && <CalloutDescription>{error}</CalloutDescription>}
          <CalloutActions>
            <Button variant="destructive" size="sm" onClick={handleRetry}>
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
          <InstanceBanner
            email={session.email}
            instanceName={
              showInstanceSelector ? undefined : session.instanceName
            }
            showSwitch={instances.length > 1}
            onSwitch={handleShowInstanceSelector}
          />

          {showInstanceSelector && (
            <InstanceSelector
              instances={instances}
              selectedInstanceId={selectedInstanceId}
              isPending={isPending}
              instanceError={instanceError}
              onSelect={handleInstanceSelect}
            />
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:px-2 lg:px-4">
        {session.instanceName && (
          <div className="flex-col">
            <div className="max-w-6xl mx-auto px-2">
              <DashboardMenu userRoles={session.roleFront} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
