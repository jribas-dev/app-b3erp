"use client";

import { Tag, Users, Search, Loader2, Package } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Callout, CalloutTitle, CalloutDescription } from "@/components/ui/callout";
import { useTabelaPrecos } from "@/hooks/useTabelaPrecos.hook";
import { formatBRL } from "@/lib/format/currency";
import { formatDecimal, formatPct } from "@/lib/format/number";

export default function PriceTablePage() {
  const {
    isLoadingInit,
    clientes,
    clienteQuery,
    onClienteQueryChange,
    showDropdown,
    setShowDropdown,
    filteredClientes,
    selectedCliente,
    onClienteSelect,
    tabela,
    isLoadingTabela,
    tabelaError,
    filtro,
    setFiltro,
    filteredTabela,
    cabecalho,
    clienteInputRef,
    filtroInputRef,
  } = useTabelaPrecos();

  return (
    <div className="container mx-auto max-w-5xl px-3 py-4 space-y-4">
      <PageHeader icon={Tag} title="Tabela de Preços" subtitle="Consultar tabela de preços do cliente selecionado" />

      {/* Seletor de cliente */}
      <div className="grid gap-1.5">
        <Label htmlFor="cliente-select">Cliente</Label>
        {isLoadingInit ? (
          <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40">
            <Spinner size="sm" tone="muted" />
            <span className="text-sm text-muted-foreground">Carregando clientes…</span>
          </div>
        ) : clientes.length === 0 ? (
          <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40">
            <Users size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Nenhum cliente elegível encontrado
            </span>
          </div>
        ) : (
          <div className="relative">
            <div className="relative">
              <Input
                id="cliente-select"
                ref={clienteInputRef}
                value={clienteQuery}
                onChange={(e) => onClienteQueryChange(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setShowDropdown(false)}
                placeholder="Buscar por nome ou CNPJ/CPF"
                autoComplete="off"
              />
              {isLoadingTabela && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Spinner size="sm" tone="muted" />
                </div>
              )}
            </div>

            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-(--radius) shadow-lg overflow-hidden">
                {filteredClientes.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    Nenhum cliente encontrado
                  </div>
                ) : (
                  <ul className="max-h-56 overflow-y-auto divide-y divide-border">
                    {filteredClientes.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2.5 hover:bg-muted/60 transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            onClienteSelect(c);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium flex-1 leading-snug">
                              {c.nome}
                            </span>
                            {c.docfed && (
                              <span className="text-xs font-mono text-muted-foreground shrink-0">
                                {c.docfed}
                              </span>
                            )}
                            {c.cidade && (
                              <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                                {c.cidade}
                              </span>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Carregando tabela */}
      {isLoadingTabela && (
        <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Carregando tabela de preços…</span>
        </div>
      )}

      {/* Erro */}
      {tabelaError && (
        <Callout variant="destructive">
          <CalloutTitle>Erro ao carregar tabela</CalloutTitle>
          <CalloutDescription>{tabelaError}</CalloutDescription>
        </Callout>
      )}

      {/* Sem produtos */}
      {!isLoadingTabela && selectedCliente && !tabelaError && tabela.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
          <Package size={36} className="opacity-40" />
          <p className="text-sm">Este cliente não possui tabela de preços configurada</p>
        </div>
      )}

      {/* Conteúdo: cabeçalho + filtro + lista */}
      {!isLoadingTabela && cabecalho && (
        <div className="space-y-3">
          {/* Cabeçalho da tabela */}
          <div className="rounded-(--radius) border border-primary/30 bg-primary/5 px-4 py-3 flex flex-wrap gap-x-6 gap-y-1.5 items-center">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs text-muted-foreground shrink-0">Operação:</span>
              <span className="text-sm font-semibold">{cabecalho.operacao}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground shrink-0">Tabela:</span>
              <span className="text-sm font-semibold">{cabecalho.nometab}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground shrink-0">UF base:</span>
              <span className="text-sm font-semibold">{cabecalho.ufbase}</span>
            </div>
          </div>

          {/* Filtro */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              ref={filtroInputRef}
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Filtrar por nome, código ou código de barras"
              className="pl-9"
            />
          </div>

          {/* Contagem */}
          <p className="text-xs text-muted-foreground px-1">
            {filteredTabela.length}{" "}
            {filteredTabela.length === 1 ? "produto" : "produtos"}
            {filtro.trim() ? " encontrado" + (filteredTabela.length !== 1 ? "s" : "") : ""}
          </p>

          {/* Lista vazia após filtro */}
          {filteredTabela.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
              <Package size={32} className="opacity-40" />
              <p className="text-sm">Nenhum produto encontrado para &ldquo;{filtro}&rdquo;</p>
            </div>
          ) : (
            <>
              {/* Cards mobile (< md) */}
              <div className="md:hidden space-y-2">
                {filteredTabela.map((item) => (
                  <div
                    key={item.id}
                    className="border border-border rounded-(--radius) px-3 py-2.5 bg-card"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-mono text-muted-foreground w-12 shrink-0">
                        #{item.id}
                      </span>
                      <span className="text-sm font-medium flex-1 leading-snug">{item.nome}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {item.unidade ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5 pl-14 gap-2">
                      <span className="text-sm font-semibold text-primary">
                        {formatBRL(item.venda)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ST {formatDecimal(item.vicmsst)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        IPI {formatDecimal(item.vipi)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabela desktop (md+) */}
              <div className="hidden md:block overflow-x-auto rounded-(--radius) border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                        #
                      </th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                        Nome
                      </th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                        Un
                      </th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                        Ref
                      </th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                        Barras
                      </th>
                      <th className="text-right py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                        Preço
                      </th>
                      <th className="text-right py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                        ST %
                      </th>
                      <th className="text-right py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                        VL. ST
                      </th>
                      <th className="text-right py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                        IPI %
                      </th>
                      <th className="text-right py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                        VL. IPI
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredTabela.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-3 text-xs font-mono text-muted-foreground">
                          {item.id}
                        </td>
                        <td className="py-2 px-3 font-medium">{item.nome}</td>
                        <td className="py-2 px-3 text-xs text-muted-foreground">
                          {item.unidade ?? "—"}
                        </td>
                        <td className="py-2 px-3 text-xs font-mono text-muted-foreground">
                          {item.ref ?? "—"}
                        </td>
                        <td className="py-2 px-3 text-xs font-mono text-muted-foreground">
                          {item.barras ?? "—"}
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-primary">
                          {formatBRL(item.venda)}
                        </td>
                        <td className="py-2 px-3 text-right text-muted-foreground">
                          {formatPct(item.ivast)}
                        </td>
                        <td className="py-2 px-3 text-right text-muted-foreground">
                          {formatDecimal(item.vicmsst)}
                        </td>
                        <td className="py-2 px-3 text-right text-muted-foreground">
                          {formatPct(item.ipisaliq)}
                        </td>
                        <td className="py-2 px-3 text-right text-muted-foreground">
                          {formatDecimal(item.vipi)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
