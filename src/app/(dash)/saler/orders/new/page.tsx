"use client";

import {
  Building2,
  ShoppingCart,
  User,
  MapPin,
  LocateFixed,
  Phone,
  Smartphone,
  FileText,
  Loader2,
  Receipt,
  Truck,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useNovoPedido } from "@/hooks/useNovoPedido.hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
          {/* Empresa Emitente */}
          <div className="grid gap-1.5">
            <Label htmlFor="emitente">Empresa Emitente</Label>
            {isLoadingEmitentes ? (
              <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40">
                <Spinner size="sm" tone="muted" />
                <span className="text-sm text-muted-foreground">
                  Carregando empresas…
                </span>
              </div>
            ) : (
              <Select
                value={selectedIdemp?.toString() ?? ""}
                onValueChange={(v) => onIdemandChange(Number(v))}
                disabled={emitentes.length === 1}
              >
                <SelectTrigger
                  id="emitente"
                  ref={emitenteTriggerRef}
                  className="w-full"
                >
                  <SelectValue placeholder="Selecione a empresa emitente" />
                </SelectTrigger>
                <SelectContent>
                  {emitentes.map((e) => (
                    <SelectItem key={e.id} value={e.id.toString()}>
                      {e.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Operação Fiscal */}
          <div className="grid gap-1.5">
            <Label htmlFor="operacao">Operação Fiscal</Label>
            {isLoadingOperacoes ? (
              <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40">
                <Spinner size="sm" tone="muted" />
                <span className="text-sm text-muted-foreground">
                  Carregando operações…
                </span>
              </div>
            ) : (
              <Select
                value={selectedIdOper?.toString() ?? ""}
                onValueChange={(v) => setSelectedIdOper(Number(v))}
                disabled={!selectedIdemp || operacoes.length === 0}
              >
                <SelectTrigger
                  id="operacao"
                  ref={operacaoTriggerRef}
                  className="w-full"
                >
                  <SelectValue
                    placeholder={
                      !selectedIdemp
                        ? "Selecione a empresa primeiro"
                        : "Selecione a operação fiscal"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {operacoes.map((op) => (
                    <SelectItem key={op.id} value={op.id.toString()}>
                      {op.operacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Busca de Cliente */}
          <div className="grid gap-1.5">
            <Label htmlFor="cliente-busca">Cliente</Label>
            <div className="relative">
              <div className="relative flex items-center">
                <Input
                  id="cliente-busca"
                  ref={clienteInputRef}
                  value={clienteQuery}
                  onChange={(e) => onClienteQueryChange(e.target.value)}
                  onFocus={() => {
                    if (clienteResults.length > 0) setShowResults(true);
                  }}
                  placeholder="Nome, ID ou CNPJ/CPF do cliente (mín. 3 caracteres)"
                  autoComplete="off"
                  disabled={!selectedIdemp}
                />
                {(isSearching || isLoadingCliente) && (
                  <div className="absolute right-3">
                    <Spinner size="sm" tone="muted" />
                  </div>
                )}
              </div>

              {/* Dropdown de resultados */}
              {showResults && !isSearching && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-(--radius) shadow-lg overflow-hidden">
                  {clienteResults.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      Nenhum cliente encontrado
                    </div>
                  ) : (
                    <ul className="max-h-56 overflow-y-auto divide-y divide-border">
                      {clienteResults.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-2.5 hover:bg-muted/60 transition-colors grid grid-cols-[1fr_auto_auto] gap-4 items-center"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              onClienteSelect(c.id);
                            }}
                          >
                            <span className="text-sm font-medium truncate">
                              {c.razao}
                            </span>
                            <span className="text-xs font-mono text-muted-foreground shrink-0">
                              #{c.id}
                            </span>
                            <span className="text-xs font-mono text-muted-foreground shrink-0 hidden sm:block">
                              {c.display.match(/\(([^)]+)\)/)?.[1] ?? "—"}
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

          {/* Card do Cliente */}
          {selectedCliente && (
            <div className="border border-border rounded-(--radius) overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border">
                <Building2 size={16} className="text-primary shrink-0" />
                <span className="font-semibold text-sm truncate">
                  {selectedCliente.razao}
                </span>
                {selectedCliente.docfed && (
                  <span className="ml-auto text-xs font-mono text-muted-foreground shrink-0">
                    {selectedCliente.docformatado}
                  </span>
                )}
              </div>

              <div className="px-4 py-3 grid gap-2 text-sm">
                {selectedCliente.fone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone size={14} className="shrink-0" />
                    <span>{selectedCliente.fone}</span>
                  </div>
                )}

                {selectedCliente.cel && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Smartphone size={14} className="shrink-0" />
                    <span>{selectedCliente.cel}</span>
                  </div>
                )}

                {(selectedCliente.endereco || selectedCliente.cidade) && (
                  <>
                    {(selectedCliente.endereco ||
                      selectedCliente.nroend ||
                      selectedCliente.bairro) && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <LocateFixed size={14} className="shrink-0 mt-0.5" />
                        <span>
                          {[
                            selectedCliente.endereco,
                            selectedCliente.nroend,
                            selectedCliente.bairro,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}

                    {(selectedCliente.cidade || selectedCliente.uf) && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin size={14} className="shrink-0 mt-0.5" />
                        <span>
                          <strong>
                            {selectedCliente.cidade && selectedCliente.uf
                              ? `${selectedCliente.cidade} — ${selectedCliente.uf}`
                              : selectedCliente.cidade || selectedCliente.uf}
                          </strong>
                        </span>
                      </div>
                    )}
                  </>
                )}

                {!selectedCliente.fone &&
                  !selectedCliente.endereco &&
                  !selectedCliente.cidade && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User size={14} className="shrink-0" />
                      <span>Sem dados de contato cadastrados</span>
                    </div>
                  )}
              </div>

              {selectedCliente.obsvenda && (
                <div className="px-4 pb-3">
                  <Callout variant="warning" className="py-2.5">
                    <div className="flex items-start gap-2">
                      <FileText
                        size={14}
                        className="shrink-0 mt-0.5 text-warning"
                      />
                      <p className="text-sm leading-snug">
                        {selectedCliente.obsvenda}
                      </p>
                    </div>
                  </Callout>
                </div>
              )}
            </div>
          )}

          {/* Toggle Tipo de Pedido */}
          {selectedCliente && (
            <div className="rounded-(--radius) border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tipo do Pedido
                </Label>
                <span className="text-xs text-muted-foreground">
                  Escolha uma opção
                </span>
              </div>
              <div
                role="radiogroup"
                aria-label="Tipo do Pedido"
                className="grid grid-cols-2 gap-2"
              >
                {[
                  {
                    value: "F" as const,
                    icon: Receipt,
                    title: "Fiscal",
                    subtitle: "Faturado",
                  },
                  {
                    value: "E" as const,
                    icon: Truck,
                    title: "Estimativa",
                    subtitle: "Entregue",
                  },
                ].map(({ value, icon: Icon, title, subtitle }) => {
                  const active = rcfat === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setRcfat(value)}
                      className={[
                        "relative flex items-center gap-3 rounded-(--radius) border px-3 py-2.5 text-left transition-colors",
                        active
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-muted/60",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        ].join(" ")}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          className={[
                            "text-sm font-semibold leading-tight",
                            active ? "text-primary" : "text-foreground",
                          ].join(" ")}
                        >
                          {title}
                        </span>
                        <span className="text-xs text-muted-foreground leading-tight">
                          {subtitle}
                        </span>
                      </div>
                      {active && (
                        <Check
                          size={16}
                          className="absolute right-2 top-2 text-primary"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Erro de submissão */}
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
          <Button
            className="flex-1"
            disabled={!canSubmit}
            onClick={onSubmit}
          >
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
