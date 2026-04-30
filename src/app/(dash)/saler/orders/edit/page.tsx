"use client";

import { Suspense, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  Loader2,
  LocateFixed,
  MapPin,
  Package,
  Phone,
  Plus,
  Receipt,
  ShoppingCart,
  Trash2,
  Truck,
  IdCard,
} from "lucide-react";

import { useEditarPedido } from "@/hooks/useEditarPedido.hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Callout,
  CalloutTitle,
  CalloutDescription,
} from "@/components/ui/callout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FieldError } from "@/components/form/field-error";
import { formatBRL } from "@/lib/format/currency";
import { formatQty } from "@/lib/format/number";

const formatNum = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className="gap-2">
      <ArrowLeft size={16} />
      Voltar
    </Button>
  );
}

function EditOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idRaw = searchParams.get("id");
  const idNumber = idRaw ? Number(idRaw) : NaN;
  const idPedido = Number.isFinite(idNumber) && idNumber > 0 ? idNumber : null;

  const pedidoHook = useEditarPedido(idPedido);
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
  } = pedidoHook;

  const {
    control: fechamentoControl,
    register: registerFechamento,
    watch: watchFechamento,
    formState: { errors: fechamentoErrors },
  } = fechamentoForm;
  const obsInterValue = watchFechamento("obsInter");

  const produtoBuscaRef = useRef<HTMLInputElement | null>(null);
  const qtdeInputRef = useRef<HTMLInputElement | null>(null);
  const wasAddingRef = useRef(false);

  // foco inicial no campo de busca
  useEffect(() => {
    produtoBuscaRef.current?.focus();
  }, []);

  // foco de volta na busca após adicionar item
  useEffect(() => {
    if (wasAddingRef.current && !isAddingItem) {
      produtoBuscaRef.current?.focus();
    }
    wasAddingRef.current = isAddingItem;
  }, [isAddingItem]);

  // foco na quantidade quando produto+preço carregam
  useEffect(() => {
    if (selectedProduto && preco && qtdeInputRef.current) {
      qtdeInputRef.current.focus();
      qtdeInputRef.current.select();
    }
  }, [selectedProduto, preco]);

  const goBack = () => router.push("/home");
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
        <BackButton onClick={goBack} />
        <Callout variant="destructive">
          <CalloutTitle>Não foi possível carregar o pedido</CalloutTitle>
          <CalloutDescription>
            {loadError?.message || "Pedido não encontrado."}
          </CalloutDescription>
        </Callout>
      </div>
    );
  }

  const tipoFatLabel = isFiscal ? "Fiscal" : "Estimativa";

  return (
    <div className="container mx-auto max-w-xl px-3 py-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <BackButton onClick={goBack} />
        <span className="text-xs text-muted-foreground font-mono">
          #{pedido.id}
        </span>
      </div>

      {/* BLOCO 1 — Tabs Pedido / Fechar */}
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
          <Card>
            {/* Barra de título */}
            <div className="flex items-center justify-between gap-3 px-4 pt-1">
              <div className="flex items-center gap-2 min-w-0">
                <ShoppingCart size={20} className="text-primary shrink-0" />
                <span className="text-lg font-semibold font-mono truncate">
                  Pedido #{pedido.id}
                </span>
              </div>
              <span
                className={[
                  "inline-flex items-center gap-1.5 rounded-[100px] px-3 py-1 text-xs font-semibold border",
                  isFiscal
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-accent/30 bg-accent/10 text-accent",
                ].join(" ")}
              >
                {isFiscal ? <Receipt size={12} /> : <Truck size={12} />}
                {tipoFatLabel}
              </span>
            </div>

            <CardContent className="space-y-4">
              {/* Dados do Cliente */}
              <div className="border border-border rounded-(--radius) overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border">
                  <Building2 size={16} className="text-primary shrink-0" />
                  <span className="font-semibold text-sm truncate">
                    {pedido.razaoCliente}
                  </span>
                  <span className="ml-auto text-xs font-mono text-muted-foreground shrink-0">
                    #{pedido.idcli}
                  </span>
                </div>
                {pedido.cliente && (
                  <div className="px-4 py-3 grid gap-2 text-sm">
                    {pedido.cliente.fone && (
                      <div className="flex text-muted-foreground justify-between">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="shrink-0" />
                          <span className="font-bold">{pedido.cliente.fone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IdCard size={14} className="shrink-0" />
                          <span className="font-mono">
                            {pedido.cliente.docformatado}
                          </span>
                        </div>
                      </div>
                    )}
                    {(pedido.cliente.endereco) && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <LocateFixed size={14} className="shrink-0 mt-0.5" />
                        <span>
                          {[
                            pedido.cliente.endereco,
                            pedido.cliente.nroend,
                            pedido.cliente.bairro,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                    {(pedido.cliente.cidade ||
                      pedido.cliente.uf) && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin size={14} className="shrink-0 mt-0.5" />
                        <span className="font-semibold">
                          {[
                            pedido.cliente.cidade,
                            pedido.cliente.uf,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Totais */}
              <div className="grid gap-2 rounded-(--radius) border border-border bg-muted/20 p-4 md:w-2/3 ml-auto">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Produtos</span>
                  <span className="font-mono">
                    {formatBRL(pedido.vlrbruto)}
                  </span>
                </div>
                {pedido.desconto > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="font-mono text-destructive">
                      -{formatNum(pedido.desconto)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total ST</span>
                  <span className="font-mono">{formatNum(pedido.st)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total IPI</span>
                  <span className="font-mono">{formatNum(pedido.ipi)}</span>
                </div>
                <div className="mt-1 pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="font-mono text-lg font-bold text-primary">
                    {formatBRL(pedido.vlrtotal)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fechar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Check size={20} className="text-primary" />
                Fechar Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isAberto && (
                <Callout variant="info">
                  <CalloutDescription>
                    Pedido já fechado. Os dados abaixo são somente leitura.
                  </CalloutDescription>
                </Callout>
              )}

              <form onSubmit={onFechar} noValidate className="space-y-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="forma">Forma de pagamento</Label>
                  {isLoadingFormas ? (
                    <div className="flex items-center gap-2 h-9 px-3 border rounded-(--radius) bg-muted/40">
                      <Spinner size="sm" tone="muted" />
                      <span className="text-sm text-muted-foreground">
                        Carregando formas…
                      </span>
                    </div>
                  ) : (
                    <Controller
                      control={fechamentoControl}
                      name="idForma"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isAberto || formas.length === 0}
                        >
                          <SelectTrigger id="forma" className="w-full">
                            <SelectValue placeholder="Selecione a forma" />
                          </SelectTrigger>
                          <SelectContent>
                            {formas.map((f) => (
                              <SelectItem key={f.id} value={f.id.toString()}>
                                {f.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                  <FieldError>{fechamentoErrors.idForma?.message}</FieldError>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="cond">Condição de pagamento</Label>
                  {isLoadingFormas ? (
                    <div className="flex items-center gap-2 h-9 px-3 border rounded-(--radius) bg-muted/40">
                      <Spinner size="sm" tone="muted" />
                      <span className="text-sm text-muted-foreground">
                        Carregando condições…
                      </span>
                    </div>
                  ) : (
                    <Controller
                      control={fechamentoControl}
                      name="idCond"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isAberto || condicoes.length === 0}
                        >
                          <SelectTrigger id="cond" className="w-full">
                            <SelectValue placeholder="Selecione a condição" />
                          </SelectTrigger>
                          <SelectContent>
                            {condicoes.map((c) => (
                              <SelectItem key={c.id} value={c.id.toString()}>
                                {c.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                  <FieldError>{fechamentoErrors.idCond?.message}</FieldError>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="obs">Observação interna</Label>
                  <Textarea
                    id="obs"
                    maxLength={255}
                    placeholder="Anotação interna (opcional)"
                    disabled={!isAberto}
                    {...registerFechamento("obsInter")}
                  />
                  <span className="text-xs text-muted-foreground text-right">
                    {obsInterValue.length}/255
                  </span>
                </div>

                {fecharError && (
                  <Callout variant="destructive">
                    <CalloutTitle>Erro ao fechar pedido</CalloutTitle>
                    <CalloutDescription>{fecharError}</CalloutDescription>
                  </Callout>
                )}

                <Button type="submit" className="w-full" disabled={!canFechar}>
                  {isFechando ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Gravando…
                    </>
                  ) : (
                    "Gravar Fechamento"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* BLOCO 2 — Inclusão de Produto */}
      {isAberto && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Plus size={20} className="text-primary" />
              Adicionar Produto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="produto-busca">Produto</Label>
              <div className="relative">
                <div className="relative flex items-center">
                  <Input
                    id="produto-busca"
                    ref={produtoBuscaRef}
                    value={produtoQuery}
                    onChange={(e) => onProdutoQueryChange(e.target.value)}
                    onFocus={() => {
                      if (produtoResults.length > 0) setShowResults(true);
                    }}
                    placeholder="Nome, código ou descrição (mín. 2 caracteres)"
                    autoComplete="off"
                  />
                  {(isSearching || isLoadingPreco) && (
                    <div className="absolute right-3">
                      <Spinner size="sm" tone="muted" />
                    </div>
                  )}
                </div>

                {showResults && !isSearching && (
                  <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-(--radius) shadow-lg overflow-hidden">
                    {produtoResults.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-muted-foreground">
                        Nenhum produto encontrado
                      </div>
                    ) : (
                      <ul className="max-h-56 overflow-y-auto divide-y divide-border">
                        {produtoResults.map((p) => (
                          <li key={p.id}>
                            <button
                              type="button"
                              className="w-full text-left px-4 py-2.5 hover:bg-muted/60 transition-colors grid grid-cols-[1fr_auto] gap-4 items-center"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                onProdutoSelect(p);
                              }}
                            >
                              <span className="text-sm font-medium truncate">
                                {p.nome}
                              </span>
                              <span className="text-xs font-mono text-muted-foreground shrink-0">
                                #{p.id}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quantidade e Display */}
            {selectedProduto && preco && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 items-end">
                  <div className="grid gap-1.5">
                    <Label htmlFor="qtde">Quantidade</Label>
                    <Input
                      id="qtde"
                      ref={qtdeInputRef}
                      type="number"
                      inputMode="decimal"
                      min="0.001"
                      step="0.001"
                      value={qtde}
                      onChange={(e) => setQtde(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && canAddItem) {
                          e.preventDefault();
                          onAdicionarItem();
                        }
                      }}
                      className="font-mono"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="preco-unit">Preço unit.</Label>
                    <Input
                      id="preco-unit"
                      type="text"
                      inputMode="decimal"
                      value={precoEdit}
                      onChange={(e) => setPrecoEdit(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && canAddItem) {
                          e.preventDefault();
                          onAdicionarItem();
                        }
                      }}
                      className="font-mono"
                    />
                  </div>
                </div>

                {/* Display de cálculo */}
                <div className="rounded-(--radius) border border-border bg-muted/20 p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono">{formatBRL(subtotal)}</span>
                  </div>

                  {isFiscal ? (
                    isCalcImposto ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Spinner size="sm" tone="muted" />
                        Calculando impostos…
                      </div>
                    ) : impostos ? (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">IPI</span>
                          <span className="font-mono">
                            {formatBRL(impostos.ipi)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">ICMS-ST</span>
                          <span className="font-mono">
                            {formatBRL(impostos.st)}
                          </span>
                        </div>
                      </>
                    ) : null
                  ) : (
                    <div className="text-xs text-muted-foreground italic">
                      Estimativa — impostos não aplicáveis
                    </div>
                  )}

                  <div className="pt-1.5 mt-1 border-t border-border flex items-center justify-between">
                    <span className="text-sm font-semibold">Total do item</span>
                    <span className="font-mono font-bold text-primary">
                      {formatBRL(subtotal + (impostos?.total ?? 0))}
                    </span>
                  </div>

                  {preco.cfop && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span>CFOP</span>
                      <span className="font-mono">{preco.cfop}</span>
                    </div>
                  )}
                </div>

                {addError && (
                  <Callout variant="destructive">
                    <CalloutDescription>{addError}</CalloutDescription>
                  </Callout>
                )}

                <Button
                  className="w-full"
                  disabled={!canAddItem}
                  onClick={onAdicionarItem}
                >
                  {isAddingItem ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Adicionando…
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Adicionar ao Pedido
                    </>
                  )}
                </Button>
              </div>
            )}

            {selectedProduto && isLoadingPreco && !preco && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner size="sm" tone="muted" />
                Carregando preço…
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* BLOCO 3 — Lista de Itens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Package size={20} className="text-primary" />
            Itens do Pedido
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {(pedido.itens ?? []).length}{" "}
              {(pedido.itens ?? []).length === 1 ? "item" : "itens"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(pedido.itens ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
              <AlertCircle size={24} />
              <span className="text-sm">Nenhum item adicionado</span>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {(pedido.itens ?? []).map((item) => {
                const impItem = (item.vIPI ?? 0) + (item.vST ?? 0);
                const totalLinha = item.total + impItem;
                return (
                  <li key={item.seq} className="py-3">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground pt-0.5 w-12 shrink-0">
                        #{item.idprod}
                      </span>
                      <span className="text-sm font-medium flex-1 leading-snug">
                        {item.nomeProduto}
                      </span>
                      <div className="flex items-start gap-1 shrink-0">
                        <span className="font-mono text-sm font-semibold">
                          {formatBRL(totalLinha)}
                        </span>
                        {isAberto && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 -mt-0.5 text-muted-foreground hover:text-destructive"
                            disabled={removingSeq === item.seq}
                            onClick={() => onRemoverItem(item.seq)}
                            aria-label={`Remover ${item.nomeProduto}`}
                          >
                            {removingSeq === item.seq ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 pl-14 text-xs font-mono text-muted-foreground">
                      <span>
                        {formatQty(item.qtde)} × {formatBRL(item.unitario)}
                      </span>
                      {impItem > 0 && <span>imp. {formatBRL(impItem)}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={fechouOk}
        onOpenChange={(open) => {
          if (!open) setFechouOk(false);
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Pedido fechado com sucesso</DialogTitle>
            <DialogDescription>O que deseja fazer agora?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={goHome}>
              Voltar para Home
            </Button>
            <Button onClick={goNovoPedido}>
              <Plus size={16} />
              Novo Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
