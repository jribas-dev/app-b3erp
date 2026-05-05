"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AdicionarProduto } from "@/components/orders/edit/adicionar-produto";
import { FechamentoForm } from "@/components/orders/edit/fechamento-form";
import { ItensList } from "@/components/orders/edit/itens-list";
import {
  BackButton,
  PedidoHeader,
} from "@/components/orders/edit/pedido-header";
import { PedidoResumo } from "@/components/orders/edit/pedido-resumo";
import { PedidoSuccessDialog } from "@/components/orders/edit/pedido-success-dialog";
import {
  Callout,
  CalloutDescription,
  CalloutTitle,
} from "@/components/ui/callout";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditarPedido } from "@/hooks/useEditarPedido.hook";

function EditOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idRaw = searchParams.get("id");
  const idNumber = idRaw ? Number(idRaw) : NaN;
  const idPedido = Number.isFinite(idNumber) && idNumber > 0 ? idNumber : null;

  const {
    pedido,
    isLoading,
    loadError,
    isFiscal,
    isAberto,
    produtoQuery,
    onProdutoQueryChange,
    produtoResults,
    isSearching,
    showResults,
    setShowResults,
    selectedProduto,
    onProdutoSelect,
    preco,
    isLoadingPreco,
    precoEdit,
    setPrecoEdit,
    qtde,
    setQtde,
    subtotal,
    impostos,
    isCalcImposto,
    canAddItem,
    isAddingItem,
    addError,
    onAdicionarItem,
    removingSeq,
    onRemoverItem,
    loadFormasCondicoes,
    isLoadingFormas,
    formas,
    condicoes,
    fechamentoForm,
    canFechar,
    isFechando,
    fecharError,
    onFechar,
    fechouOk,
    setFechouOk,
  } = useEditarPedido(idPedido);

  const goList = () => router.push("/saler/orders/find");
  const goHome = () => router.push("/home");
  const goNovoPedido = () => router.push("/saler/orders/new");

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (loadError || !pedido) {
    return (
      <div className="container mx-auto max-w-xl px-3 py-4 space-y-4">
        <BackButton onClick={goHome} />
        <Callout variant="destructive">
          <CalloutTitle>Não foi possível carregar o pedido</CalloutTitle>
          <CalloutDescription>
            {loadError?.message || "Pedido não encontrado."}
          </CalloutDescription>
        </Callout>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-xl px-3 py-4 space-y-4">
      <PedidoHeader
        idPedido={pedido.id}
        onGoHome={goHome}
        onGoList={goList}
      />

      <Tabs
        defaultValue="pedido"
        onValueChange={(v) => {
          if (v === "fechar" && formas.length === 0) loadFormasCondicoes();
        }}
      >
        <TabsList>
          <TabsTrigger value="pedido">
            <ShoppingCart size={16} />
            Pedido
          </TabsTrigger>
          <TabsTrigger value="fechar" disabled={!isAberto}>
            <Check size={16} />
            Fechar Pedido
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pedido">
          <PedidoResumo pedido={pedido} isFiscal={isFiscal} />
        </TabsContent>

        <TabsContent value="fechar">
          <FechamentoForm
            form={fechamentoForm}
            isAberto={isAberto}
            isLoadingFormas={isLoadingFormas}
            formas={formas}
            condicoes={condicoes}
            canFechar={canFechar}
            isFechando={isFechando}
            fecharError={fecharError}
            onFechar={onFechar}
          />
        </TabsContent>
      </Tabs>

      {isAberto && (
        <AdicionarProduto
          produtoQuery={produtoQuery}
          onProdutoQueryChange={onProdutoQueryChange}
          produtoResults={produtoResults}
          isSearching={isSearching}
          showResults={showResults}
          setShowResults={setShowResults}
          selectedProduto={selectedProduto}
          onProdutoSelect={onProdutoSelect}
          preco={preco}
          isLoadingPreco={isLoadingPreco}
          precoEdit={precoEdit}
          setPrecoEdit={setPrecoEdit}
          qtde={qtde}
          setQtde={setQtde}
          subtotal={subtotal}
          impostos={impostos}
          isCalcImposto={isCalcImposto}
          isFiscal={isFiscal}
          canAddItem={canAddItem}
          isAddingItem={isAddingItem}
          addError={addError}
          onAdicionarItem={onAdicionarItem}
        />
      )}

      <ItensList
        itens={pedido.itens ?? []}
        isAberto={isAberto}
        removingSeq={removingSeq}
        onRemoverItem={onRemoverItem}
      />

      <PedidoSuccessDialog
        open={fechouOk}
        onOpenChange={(open) => {
          if (!open) setFechouOk(false);
        }}
        onGoHome={goHome}
        onGoNovoPedido={goNovoPedido}
      />
    </div>
  );
}

export default function OrderEditPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-xl px-3 py-4">
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        </div>
      }
    >
      <EditOrderContent />
    </Suspense>
  );
}
