"use client";

import { Loader2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import { ClienteCard } from "@/components/orders/new/cliente-card";
import { ClienteSearch } from "@/components/orders/new/cliente-search";
import { EmitenteSelector } from "@/components/orders/new/emitente-selector";
import { OperacaoSelector } from "@/components/orders/new/operacao-selector";
import { TipoPedidoToggle } from "@/components/orders/new/tipo-pedido-toggle";
import { Button } from "@/components/ui/button";
import {
  Callout,
  CalloutDescription,
  CalloutTitle,
} from "@/components/ui/callout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNovoPedido } from "@/hooks/useNovoPedido.hook";

export default function OrderNewPage() {
  const router = useRouter();
  const {
    emitentes,
    isLoadingEmitentes,
    selectedIdemp,
    onIdemandChange,
    operacoes,
    isLoadingOperacoes,
    selectedIdOper,
    setSelectedIdOper,
    clienteQuery,
    onClienteQueryChange,
    clienteResults,
    isSearching,
    showResults,
    setShowResults,
    selectedCliente,
    isLoadingCliente,
    onClienteSelect,
    rcfat,
    setRcfat,
    isSubmitting,
    submitError,
    onSubmit,
    canSubmit,
    emitenteTriggerRef,
    operacaoTriggerRef,
    clienteInputRef,
  } = useNovoPedido();

  return (
    <div className="container mx-auto max-w-xl px-3 py-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart size={20} className="text-primary" />
            Novo Pedido
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <EmitenteSelector
            emitentes={emitentes}
            isLoading={isLoadingEmitentes}
            selectedIdemp={selectedIdemp}
            onChange={onIdemandChange}
            triggerRef={emitenteTriggerRef}
          />

          <OperacaoSelector
            operacoes={operacoes}
            isLoading={isLoadingOperacoes}
            selectedIdemp={selectedIdemp}
            selectedIdOper={selectedIdOper}
            onChange={setSelectedIdOper}
            triggerRef={operacaoTriggerRef}
          />

          <ClienteSearch
            inputRef={clienteInputRef}
            query={clienteQuery}
            onQueryChange={onClienteQueryChange}
            results={clienteResults}
            isSearching={isSearching}
            isLoadingCliente={isLoadingCliente}
            showResults={showResults}
            setShowResults={setShowResults}
            selectedIdemp={selectedIdemp}
            onSelect={onClienteSelect}
          />

          {selectedCliente && <ClienteCard cliente={selectedCliente} />}

          {selectedCliente && (
            <TipoPedidoToggle value={rcfat} onChange={setRcfat} />
          )}

          {submitError && (
            <Callout variant="destructive">
              <CalloutTitle>Erro ao abrir pedido</CalloutTitle>
              <CalloutDescription>{submitError}</CalloutDescription>
            </Callout>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={isSubmitting}
            onClick={() => router.push("/home")}
          >
            Cancelar
          </Button>
          <Button className="flex-1" disabled={!canSubmit} onClick={onSubmit}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Abrindo Pedido…
              </>
            ) : (
              "Abrir Pedido"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
