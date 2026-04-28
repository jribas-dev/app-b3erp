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
import { Controller } from "react-hook-form";
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
import { FieldError } from "@/components/form/field-error";
import {
  useCustomerForm,
  type CustomerMode,
} from "@/hooks/useCustomerForm.hook";
import type {
  ClienteBusca,
  MembroEquipe,
  Operacao,
  Emitente,
} from "@/types/vendas.types";

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
              <p className="text-sm text-muted-foreground">
                Nenhum cliente encontrado
              </p>
            </div>
          ) : (
            results.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className="w-full text-left px-3 py-2.5 rounded-(--radius) hover:bg-muted/60 transition-colors"
              >
                <p className="text-sm font-medium leading-snug">{c.razao}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {c.display}
                </p>
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
    onSubmit,
    onIdemandChange,
  } = useCustomerForm();

  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const showForm = mode !== "idle";
  const watchedRazao = watch("razao");

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
              <ModeBadge mode={mode} name={watchedRazao || undefined} />
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
                Clique em <strong>Buscar cliente</strong> para editar um
                cadastro existente, ou em <strong>Novo</strong> para criar um
                novo.
              </p>
            </div>
          </CardContent>
        )}

        {/* Form */}
        {!isLoadingCliente && showForm && (
          <form onSubmit={onSubmit} noValidate>
            <CardContent className="space-y-5">
              {/* Seção: Identificação */}
              <SectionTitle>Identificação</SectionTitle>

              {/* Tipo de Pessoa */}
              <FieldRow>
                <Label>Tipo de Pessoa</Label>
                <Controller
                  control={control}
                  name="tipopessoa"
                  render={({ field }) => (
                    <div
                      role="radiogroup"
                      aria-label="Tipo de Pessoa"
                      className="grid grid-cols-4 gap-1.5"
                    >
                      {[
                        { value: "F", label: "Física" },
                        { value: "J", label: "Jurídica" },
                        { value: "E", label: "Estatal" },
                        { value: "R", label: "Rural" },
                      ].map(({ value, label }) => {
                        const active = field.value === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => field.onChange(value)}
                            className={[
                              "rounded-(--radius) border px-2 py-2 text-sm font-medium transition-colors",
                              active
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card text-foreground hover:bg-muted/60",
                            ].join(" ")}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </FieldRow>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldRow>
                  <Label htmlFor="razao">
                    Razão Social / Nome{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="razao"
                    maxLength={100}
                    placeholder="Nome completo ou razão social"
                    aria-invalid={!!errors.razao}
                    aria-describedby={errors.razao ? "razao-error" : undefined}
                    {...register("razao")}
                  />
                  <FieldError id="razao-error">
                    {errors.razao?.message}
                  </FieldError>
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="fantasia">Nome Fantasia</Label>
                  <Input
                    id="fantasia"
                    maxLength={60}
                    placeholder="Nome fantasia (opcional)"
                    {...register("fantasia")}
                  />
                </FieldRow>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldRow>
                  <Label htmlFor="docfed">CNPJ / CPF</Label>
                  <Input
                    id="docfed"
                    inputMode="numeric"
                    value={watch("docfedDisplay")}
                    onChange={(e) => onDocfedChange(e.target.value)}
                    maxLength={18}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    aria-invalid={!!errors.docfedDisplay}
                    aria-describedby={
                      errors.docfedDisplay ? "docfed-error" : undefined
                    }
                  />
                  <FieldError id="docfed-error">
                    {errors.docfedDisplay?.message}
                  </FieldError>
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="docest">IE / Identidade</Label>
                  <Input
                    id="docest"
                    maxLength={20}
                    placeholder="IE (opcional)"
                    {...register("docest")}
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
                    placeholder="email@empresa.com.br"
                    {...register("email")}
                  />
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="emailnfe">E-mail NF-e</Label>
                  <Input
                    id="emailnfe"
                    type="email"
                    placeholder="Para envio de NF-e"
                    {...register("emailnfe")}
                  />
                </FieldRow>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldRow>
                  <Label htmlFor="emailcob">E-mail Cobrança</Label>
                  <Input
                    id="emailcob"
                    type="email"
                    placeholder="Para cobranças"
                    {...register("emailcob")}
                  />
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="site">Site</Label>
                  <Input
                    id="site"
                    maxLength={120}
                    placeholder="www.empresa.com.br"
                    {...register("site")}
                  />
                </FieldRow>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <FieldRow>
                  <Label htmlFor="fone">Telefone</Label>
                  <Controller
                    control={control}
                    name="fone"
                    render={({ field }) => (
                      <PhoneInput
                        id="fone"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="fone2">Telefone 2</Label>
                  <Controller
                    control={control}
                    name="fone2"
                    render={({ field }) => (
                      <PhoneInput
                        id="fone2"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="cel">Celular / WhatsApp</Label>
                  <Controller
                    control={control}
                    name="cel"
                    render={({ field }) => (
                      <PhoneInput
                        id="cel"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
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
                      value={watch("cepDisplay")}
                      onChange={(e) => onCepChange(e.target.value)}
                      onBlur={onCepBlur}
                      maxLength={9}
                      placeholder="00000-000"
                    />
                    {isCepLoading && (
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                        <Loader2
                          size={14}
                          className="animate-spin text-muted-foreground"
                        />
                      </div>
                    )}
                  </div>
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="uf">UF</Label>
                  <Input
                    id="uf"
                    value={watch("uf")}
                    onChange={(e) =>
                      setValue(
                        "uf",
                        e.target.value.toUpperCase().slice(0, 2),
                        { shouldValidate: true },
                      )
                    }
                    maxLength={2}
                    placeholder="SP"
                    className="uppercase"
                    aria-invalid={!!errors.uf}
                    aria-describedby={errors.uf ? "uf-error" : undefined}
                  />
                  <FieldError id="uf-error">{errors.uf?.message}</FieldError>
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="nroend">Número</Label>
                  <Input
                    id="nroend"
                    maxLength={10}
                    placeholder="Nº"
                    {...register("nroend")}
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
                  maxLength={120}
                  placeholder="Rua, Av., Alameda…"
                  {...register("endereco")}
                />
              </FieldRow>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldRow>
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    maxLength={60}
                    placeholder="Bairro"
                    {...register("bairro")}
                  />
                </FieldRow>

                <FieldRow>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    maxLength={60}
                    placeholder="Cidade"
                    {...register("cidade")}
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
                      <span className="text-sm text-muted-foreground">
                        Carregando…
                      </span>
                    </div>
                  ) : (
                    <Controller
                      control={control}
                      name="idoper"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar operação" />
                          </SelectTrigger>
                          <SelectContent>
                            {operacoes.map((o: Operacao) => (
                              <SelectItem
                                key={o.id}
                                value={o.id.toString()}
                              >
                                {o.operacao}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                </FieldRow>

                {/* Vendedor responsável */}
                <FieldRow>
                  <Label>Vendedor Responsável</Label>
                  {isLoadingInit ? (
                    <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40">
                      <Spinner size="sm" tone="muted" />
                      <span className="text-sm text-muted-foreground">
                        Carregando…
                      </span>
                    </div>
                  ) : isSupervisor ? (
                    <Controller
                      control={control}
                      name="idvende"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar vendedor" />
                          </SelectTrigger>
                          <SelectContent>
                            {equipe.map((m: MembroEquipe) => (
                              <SelectItem
                                key={m.id}
                                value={m.id.toString()}
                              >
                                {m.razao}
                                {m.liderado === 0 ? " (você)" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
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
                  maxLength={255}
                  rows={3}
                  placeholder="Observação exibida ao criar pedidos para este cliente"
                  {...register("obsvenda")}
                />
              </FieldRow>
            </CardContent>

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
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/saler/customers")}
                  className="gap-1.5"
                  disabled={isSubmitting}
                >
                  <X size={14} />
                  Cancelar
                </Button>

                <Button type="submit" disabled={!canSave} className="gap-2">
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Gravar
                </Button>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
