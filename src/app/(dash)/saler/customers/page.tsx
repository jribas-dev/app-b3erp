"use client";

import {
  ArrowLeft,
  Loader2,
  Plus,
  Save,
  Search,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { ComercialSection } from "@/components/customers/comercial-section";
import { ContatoSection } from "@/components/customers/contato-section";
import { EnderecoSection } from "@/components/customers/endereco-section";
import { IdentificacaoSection } from "@/components/customers/identificacao-section";
import { ModeBadge } from "@/components/customers/mode-badge";
import { SearchDialog } from "@/components/customers/search-dialog";
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
import { useCustomerForm } from "@/hooks/useCustomerForm.hook";

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

  const showForm = mode !== "idle";
  const watchedRazao = form.watch("razao");

  return (
    <div className="container mx-auto max-w-2xl px-3 py-4 space-y-4">
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

        {isLoadingCliente && (
          <CardContent className="py-10">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Carregando dados do cliente…</span>
            </div>
          </CardContent>
        )}

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

        {!isLoadingCliente && showForm && (
          <form onSubmit={onSubmit} noValidate>
            <CardContent className="space-y-5">
              <IdentificacaoSection
                form={form}
                onDocfedChange={onDocfedChange}
              />

              <ContatoSection form={form} />

              <EnderecoSection
                form={form}
                onCepChange={onCepChange}
                onCepBlur={onCepBlur}
                isCepLoading={isCepLoading}
              />

              <ComercialSection
                form={form}
                isLoadingInit={isLoadingInit}
                isSupervisor={isSupervisor}
                emitentes={emitentes}
                selectedIdemp={selectedIdemp}
                onIdemandChange={onIdemandChange}
                operacoes={operacoes}
                equipe={equipe}
              />
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

              <div className="flex mt-4 gap-3 w-full justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    router.push("/saler/customers");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
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
