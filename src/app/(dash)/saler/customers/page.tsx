"use client";

import {
  ArrowLeft,
  Users,
  Search,
  Plus,
  Loader2,
  MapPin,
  Save,
  UserCheck,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  CalloutDescription,
  CalloutTitle,
} from "@/components/ui/callout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  useCustomerForm,
  type CustomerMode,
} from "@/hooks/useCustomerForm.hook";
import type { ClienteBusca, MembroEquipe, Operacao, Emitente } from "@/types/vendas.types";

// ── search dialog ──────────────────────────────────────────────────────────────

function SearchDialog({
  open,
  query,
  results,
  isSearching,
  onQueryChange,
  onSelect,
  onClose,
}: {
  open: boolean;
  query: string;
  results: ClienteBusca[];
  isSearching: boolean;
  onQueryChange: (q: string) => void;
  onSelect: (id: number) => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Search size={16} className="text-primary" />
            Buscar Cliente Existente
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pt-3 pb-2">
          <Input
            autoFocus
            placeholder="Nome, razão social ou CNPJ/CPF…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          {query.length > 0 && query.length < 2 && (
            <p className="text-xs text-muted-foreground mt-1">
              Digite pelo menos 2 caracteres para pesquisar
            </p>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto px-2 pb-3">
          {isSearching ? (
            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Pesquisando…</span>
            </div>
          ) : results.length === 0 && query.length >= 2 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">Nenhum cliente encontrado</p>
            </div>
          ) : (
            results.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className="w-full text-left px-3 py-2.5 rounded-(--radius) hover:bg-muted/60 transition-colors"
              >
                <p className="text-sm font-medium leading-snug">{c.razao}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.display}</p>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── mode badge ─────────────────────────────────────────────────────────────────

function ModeBadge({ mode, name }: { mode: CustomerMode; name?: string }) {
  if (mode === "idle") return null;
  if (mode === "new")
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
        <Plus size={11} />
        Novo cadastro
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
      <UserCheck size={11} />
      {name ? `Editando: ${name}` : "Editando"}
    </span>
  );
}

// ── field row helper ───────────────────────────────────────────────────────────

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-1.5">{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">
      {children}
    </p>
  );
}

// ── page ───────────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const router = useRouter();
  const {
    mode,
    isLoadingInit,
    isSupervisor,
    equipe,
    emitentes,
    selectedIdemp,
    operacoes,
    form,
    setField,
    docfedError,
    onDocfedChange,
    onCepChange,
    onCepBlur,
    isCepLoading,
    isLoadingCliente,
    isSubmitting,
    submitError,
    submitSuccess,
    canSave,
    searchOpen,
    searchQuery,
    searchResults,
    isSearching,
    openSearch,
    closeSearch,
    onSearchQueryChange,
    onSelectFromSearch,
    onNewCliente,
    onSave,
    onIdemandChange,
  } = useCustomerForm();

  const showForm = mode !== "idle";

  return (
    <div className="container mx-auto max-w-2xl px-3 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/home")}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>
        <Users size={20} className="text-primary shrink-0" />
        <h1 className="text-xl font-semibold">Cadastro de Clientes</h1>
      </div>

      {/* Search dialog */}
      <SearchDialog
        open={searchOpen}
        query={searchQuery}
        results={searchResults}
        isSearching={isSearching}
        onQueryChange={onSearchQueryChange}
        onSelect={onSelectFromSearch}
        onClose={closeSearch}
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <CardTitle className="flex items-center gap-2 text-base">
              <ModeBadge mode={mode} name={form.razao || undefined} />
              {mode === "idle" && (
                <span className="text-muted-foreground text-sm font-normal">
                  Busque um cliente ou inicie um novo cadastro
                </span>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openSearch}
                className="gap-1.5"
                disabled={isLoadingInit}
              >
                <Search size={14} />
                Buscar cliente
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onNewCliente}
                className="gap-1.5"
                disabled={isLoadingInit}
              >
                <Plus size={14} />
                Novo
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Loading overlay when fetching cliente */}
        {isLoadingCliente && (
          <CardContent className="py-10">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Carregando dados do cliente…</span>
            </div>
          </CardContent>
        )}

        {/* Idle placeholder */}
        {!isLoadingCliente && !showForm && (
          <CardContent className="py-10">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Users size={36} className="opacity-30" />
              <p className="text-sm text-center">
                Clique em <strong>Buscar cliente</strong> para editar um cadastro
                existente, ou em <strong>Novo</strong> para criar um novo.
              </p>
            </div>
          </CardContent>
        )}

        {/* Form */}
        {!isLoadingCliente && showForm && (
          <CardContent className="space-y-5">
            {/* Seção: Identificação */}
            <SectionTitle>Identificação</SectionTitle>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldRow>
                <Label htmlFor="razao">
                  Razão Social / Nome <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="razao"
                  value={form.razao}
                  onChange={(e) => setField("razao", e.target.value)}
                  maxLength={100}
                  placeholder="Nome completo ou razão social"
                />
              </FieldRow>

              <FieldRow>
                <Label htmlFor="fantasia">Nome Fantasia</Label>
                <Input
                  id="fantasia"
                  value={form.fantasia}
                  onChange={(e) => setField("fantasia", e.target.value)}
                  maxLength={60}
                  placeholder="Nome fantasia (opcional)"
                />
              </FieldRow>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldRow>
                <Label htmlFor="docfed">CPF / CNPJ</Label>
                <Input
                  id="docfed"
                  inputMode="numeric"
                  value={form.docfedDisplay}
                  onChange={(e) => onDocfedChange(e.target.value)}
                  maxLength={18}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  aria-invalid={!!docfedError}
                />
                {docfedError && (
                  <p className="text-xs text-destructive">{docfedError}</p>
                )}
              </FieldRow>

              <FieldRow>
                <Label htmlFor="docest">Inscrição Estadual</Label>
                <Input
                  id="docest"
                  value={form.docest}
                  onChange={(e) => setField("docest", e.target.value)}
                  maxLength={20}
                  placeholder="IE (opcional)"
                />
              </FieldRow>
            </div>

            {/* Seção: Contato */}
            <SectionTitle>Contato</SectionTitle>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldRow>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="email@empresa.com.br"
                />
              </FieldRow>

              <FieldRow>
                <Label htmlFor="emailnfe">E-mail NF-e</Label>
                <Input
                  id="emailnfe"
                  type="email"
                  value={form.emailnfe}
                  onChange={(e) => setField("emailnfe", e.target.value)}
                  placeholder="Para envio de NF-e"
                />
              </FieldRow>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldRow>
                <Label htmlFor="emailcob">E-mail Cobrança</Label>
                <Input
                  id="emailcob"
                  type="email"
                  value={form.emailcob}
                  onChange={(e) => setField("emailcob", e.target.value)}
                  placeholder="Para cobranças"
                />
              </FieldRow>

              <FieldRow>
                <Label htmlFor="site">Site</Label>
                <Input
                  id="site"
                  value={form.site}
                  onChange={(e) => setField("site", e.target.value)}
                  maxLength={120}
                  placeholder="www.empresa.com.br"
                />
              </FieldRow>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FieldRow>
                <Label htmlFor="fone">Telefone</Label>
                <PhoneInput
                  id="fone"
                  value={form.fone}
                  onChange={(v) => setField("fone", v)}
                />
              </FieldRow>

              <FieldRow>
                <Label htmlFor="fone2">Telefone 2</Label>
                <PhoneInput
                  id="fone2"
                  value={form.fone2}
                  onChange={(v) => setField("fone2", v)}
                />
              </FieldRow>

              <FieldRow>
                <Label htmlFor="cel">Celular / WhatsApp</Label>
                <PhoneInput
                  id="cel"
                  value={form.cel}
                  onChange={(v) => setField("cel", v)}
                />
              </FieldRow>
            </div>

            {/* Seção: Endereço */}
            <SectionTitle>Endereço</SectionTitle>

            <div className="grid gap-4 sm:grid-cols-3">
              <FieldRow>
                <Label htmlFor="cep">CEP</Label>
                <div className="relative">
                  <Input
                    id="cep"
                    inputMode="numeric"
                    value={form.cepDisplay}
                    onChange={(e) => onCepChange(e.target.value)}
                    onBlur={onCepBlur}
                    maxLength={9}
                    placeholder="00000-000"
                  />
                  {isCepLoading && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                      <Loader2 size={14} className="animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </FieldRow>

              <FieldRow>
                <Label htmlFor="uf">UF</Label>
                <Input
                  id="uf"
                  value={form.uf}
                  onChange={(e) =>
                    setField("uf", e.target.value.toUpperCase().slice(0, 2))
                  }
                  maxLength={2}
                  placeholder="SP"
                  className="uppercase"
                />
              </FieldRow>

              <FieldRow>
                <Label htmlFor="nroend">Número</Label>
                <Input
                  id="nroend"
                  value={form.nroend}
                  onChange={(e) => setField("nroend", e.target.value)}
                  maxLength={10}
                  placeholder="Nº"
                />
              </FieldRow>
            </div>

            <FieldRow>
              <Label htmlFor="endereco">
                <MapPin size={12} className="inline mr-1" />
                Logradouro
              </Label>
              <Input
                id="endereco"
                value={form.endereco}
                onChange={(e) => setField("endereco", e.target.value)}
                maxLength={120}
                placeholder="Rua, Av., Alameda…"
              />
            </FieldRow>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldRow>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={form.bairro}
                  onChange={(e) => setField("bairro", e.target.value)}
                  maxLength={60}
                  placeholder="Bairro"
                />
              </FieldRow>

              <FieldRow>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={form.cidade}
                  onChange={(e) => setField("cidade", e.target.value)}
                  maxLength={60}
                  placeholder="Cidade"
                />
              </FieldRow>
            </div>

            {/* Seção: Comercial */}
            <SectionTitle>Comercial</SectionTitle>

            {/* Emitente selector (needed to populate operacoes) */}
            {emitentes.length > 1 && (
              <FieldRow>
                <Label>Empresa (referência para operações)</Label>
                <Select
                  value={selectedIdemp?.toString() ?? ""}
                  onValueChange={(v) => onIdemandChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {emitentes.map((e: Emitente) => (
                      <SelectItem key={e.id} value={e.id.toString()}>
                        {e.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldRow>
                <Label>Operação Fiscal Padrão</Label>
                {isLoadingInit ? (
                  <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40">
                    <Spinner size="sm" tone="muted" />
                    <span className="text-sm text-muted-foreground">Carregando…</span>
                  </div>
                ) : (
                  <Select
                    value={form.idoper}
                    onValueChange={(v) => setField("idoper", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar operação" />
                    </SelectTrigger>
                    <SelectContent>
                      {operacoes.map((o: Operacao) => (
                        <SelectItem key={o.id} value={o.id.toString()}>
                          {o.operacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FieldRow>

              {/* Vendedor responsável */}
              <FieldRow>
                <Label>Vendedor Responsável</Label>
                {isLoadingInit ? (
                  <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40">
                    <Spinner size="sm" tone="muted" />
                    <span className="text-sm text-muted-foreground">Carregando…</span>
                  </div>
                ) : isSupervisor ? (
                  <Select
                    value={form.idvende}
                    onValueChange={(v) => setField("idvende", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipe.map((m: MembroEquipe) => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          {m.razao}
                          {m.liderado === 0 ? " (você)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40">
                    <span className="text-sm text-muted-foreground">
                      {equipe.find((m) => m.liderado === 0)?.razao ?? "—"}
                    </span>
                  </div>
                )}
              </FieldRow>
            </div>

            <FieldRow>
              <Label htmlFor="obsvenda">Observação de Venda</Label>
              <Textarea
                id="obsvenda"
                value={form.obsvenda}
                onChange={(e) => setField("obsvenda", e.target.value)}
                maxLength={255}
                rows={3}
                placeholder="Observação exibida ao criar pedidos para este cliente"
              />
            </FieldRow>
          </CardContent>
        )}

        {!isLoadingCliente && showForm && (
          <CardFooter className="flex-col gap-3 pt-0">
            {submitError && (
              <Callout variant="destructive" className="w-full">
                <CalloutTitle>Erro ao salvar</CalloutTitle>
                <CalloutDescription>{submitError}</CalloutDescription>
              </Callout>
            )}

            {submitSuccess && (
              <Callout variant="default" className="w-full">
                <CalloutDescription>
                  Cliente salvo com sucesso.
                </CalloutDescription>
              </Callout>
            )}

            <div className="flex gap-2 w-full justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setField("razao", form.razao); // no-op to satisfy lint — resets via onNewCliente
                  // Clear form back to idle
                  router.push("/saler/customers");
                }}
                className="gap-1.5"
                disabled={isSubmitting}
              >
                <X size={14} />
                Cancelar
              </Button>

              <Button
                onClick={onSave}
                disabled={!canSave}
                className="gap-2"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Gravar
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
