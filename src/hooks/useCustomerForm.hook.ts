"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  buscarClientesAction,
  getClienteAction,
  getEquipeAction,
  getEmitentesAction,
  getOperacoesAction,
  criarClienteAction,
  atualizarClienteAction,
  buscarCepAction,
} from "@/lib/vendas";
import { getSessionAction } from "@/lib/auth.service";
import { useSelectedEmitente } from "@/components/selected-emitente-provider";
import { maskCep, maskDocfed } from "@/lib/format/document";
import { isValidCPF } from "@/lib/validation/cpf";
import { isValidCNPJ } from "@/lib/validation/cnpj";
import {
  ClienteFormSchema,
  EMPTY_CLIENTE_FORM,
  toClienteFormPayload,
  type ClienteFormValues,
} from "@/lib/validations/cliente-form.form";
import type {
  ClienteBusca,
  MembroEquipe,
  Emitente,
  Operacao,
} from "@/types/vendas.types";

export type CustomerMode = "idle" | "new" | "edit";

export function useCustomerForm() {
  const { selectedIdemp, setSelectedIdemp } = useSelectedEmitente();
  const [mode, setMode] = useState<CustomerMode>("idle");
  const [clienteId, setClienteId] = useState<number | null>(null);

  const [isSupervisor, setIsSupervisor] = useState(false);
  const [selfVendId, setSelfVendId] = useState<number | null>(null);
  const [equipe, setEquipe] = useState<MembroEquipe[]>([]);
  const [emitentes, setEmitentes] = useState<Emitente[]>([]);
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);
  const [isLoadingInit, setIsLoadingInit] = useState(true);

  const [isLoadingCliente, setIsLoadingCliente] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ClienteBusca[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initDoneRef = useRef(false);

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(ClienteFormSchema),
    defaultValues: EMPTY_CLIENTE_FORM,
    mode: "onChange",
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isValid, isSubmitting },
  } = form;

  // ── init ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (initDoneRef.current) return;
    initDoneRef.current = true;

    async function init() {
      setIsLoadingInit(true);
      try {
        const [session, equipeRes, emitentesRes] = await Promise.all([
          getSessionAction(),
          getEquipeAction(),
          getEmitentesAction(),
        ]);

        const isSup = session?.roleFront?.includes("supersaler") ?? false;
        setIsSupervisor(isSup);

        if (equipeRes.success) {
          setEquipe(equipeRes.data);
          const self = equipeRes.data.find((m) => m.liderado === 0);
          if (self) {
            setSelfVendId(self.id);
            if (!isSup) {
              setValue("idvende", String(self.id));
            }
          }
        }

        if (emitentesRes.success && emitentesRes.data.length > 0) {
          setEmitentes(emitentesRes.data);
          let activeId: number | null = null;
          if (
            selectedIdemp != null &&
            emitentesRes.data.some((e) => e.id === selectedIdemp)
          ) {
            activeId = selectedIdemp;
          } else if (emitentesRes.data.length === 1) {
            activeId = emitentesRes.data[0].id;
            await setSelectedIdemp(activeId);
          }

          if (activeId != null) {
            const opsRes = await getOperacoesAction(activeId);
            if (opsRes.success) {
              setOperacoes(opsRes.data);
            }
          }
        }
      } finally {
        setIsLoadingInit(false);
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  // ── emitente change ────────────────────────────────────────────────────────

  const onIdemandChange = useCallback(
    async (id: number) => {
      await setSelectedIdemp(id);
      const opsRes = await getOperacoesAction(id);
      if (opsRes.success && opsRes.data) {
        setOperacoes(opsRes.data);
        setValue("idoper", "");
      }
    },
    [setValue, setSelectedIdemp],
  );

  // ── search dialog ──────────────────────────────────────────────────────────

  const openSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
  }, []);

  const onSearchQueryChange = useCallback((q: string) => {
    setSearchQuery(q);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (q.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    searchTimerRef.current = setTimeout(async () => {
      const res = await buscarClientesAction(q);
      setSearchResults(res.success && res.data ? res.data : []);
      setIsSearching(false);
    }, 400);
  }, []);

  const onSelectFromSearch = useCallback(
    async (id: number) => {
      setSearchOpen(false);
      setIsLoadingCliente(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      try {
        const res = await getClienteAction(id);
        if (res.success) {
          const c = res.data;
          setClienteId(c.id);
          setMode("edit");
          const rawDocfed = c.docfed ?? "";
          reset({
            tipopessoa: c.tipopessoa ?? "F",
            razao: c.razao ?? "",
            fantasia: c.fantasia ?? "",
            docfedDisplay: rawDocfed ? maskDocfed(rawDocfed) : "",
            docest: c.docest ?? "",
            email: c.email ?? "",
            emailnfe: c.emailnfe ?? "",
            emailcob: c.emailcob ?? "",
            site: c.site ?? "",
            cepDisplay: c.cep ? maskCep(c.cep) : "",
            endereco: c.endereco ?? "",
            nroend: c.nroend ?? "",
            bairro: c.bairro ?? "",
            cidade: c.cidade ?? "",
            uf: c.uf ?? "",
            fone: c.fone ?? "",
            fone2: c.fone2 ?? "",
            cel: c.cel ?? "",
            obsvenda: c.obsvenda ?? "",
            idoper: c.idoper ? String(c.idoper) : "",
            idvende: c.idvende ? String(c.idvende) : "",
          });
        } else {
          setSubmitError(res.error || "Erro ao carregar cliente");
        }
      } finally {
        setIsLoadingCliente(false);
      }
    },
    [reset],
  );

  // ── new cliente ────────────────────────────────────────────────────────────

  const onNewCliente = useCallback(() => {
    setClienteId(null);
    setMode("new");
    setSubmitError(null);
    setSubmitSuccess(false);
    reset({
      ...EMPTY_CLIENTE_FORM,
      idvende: selfVendId ? String(selfVendId) : "",
    });
  }, [selfVendId, reset]);

  // ── docfed field (masked) ──────────────────────────────────────────────────

  const onDocfedChange = useCallback(
    (v: string) => {
      setValue("docfedDisplay", maskDocfed(v), { shouldValidate: true });
      const raw = v.replace(/\D/g, "");
      if (raw.length === 11 && isValidCPF(raw)) {
        setValue("tipopessoa", "F");
      } else if (raw.length === 14 && isValidCNPJ(raw)) {
        if (getValues("tipopessoa") === "F") {
          setValue("tipopessoa", "J");
        }
      }
    },
    [setValue, getValues],
  );

  // ── cep field (masked + lookup) ────────────────────────────────────────────

  const onCepChange = useCallback(
    (v: string) => {
      setValue("cepDisplay", maskCep(v), { shouldValidate: true });
    },
    [setValue],
  );

  const onCepBlur = useCallback(async () => {
    const cepDisplay = getValues("cepDisplay");
    const raw = cepDisplay.replace(/\D/g, "");
    if (raw.length !== 8) return;
    setIsCepLoading(true);
    try {
      const res = await buscarCepAction(raw);
      if (res.success && res.data) {
        const d = res.data;
        if (d.logradouro) setValue("endereco", d.logradouro);
        if (d.bairro) setValue("bairro", d.bairro);
        if (d.localidade) setValue("cidade", d.localidade);
        if (d.uf) setValue("uf", d.uf);
      }
    } finally {
      setIsCepLoading(false);
    }
  }, [getValues, setValue]);

  // ── submit ─────────────────────────────────────────────────────────────────

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    const payload = toClienteFormPayload(values);

    let res;
    if (mode === "edit" && clienteId) {
      res = await atualizarClienteAction(clienteId, payload);
    } else {
      res = await criarClienteAction(payload);
      if (res.success) {
        setClienteId(res.data.id);
        setMode("edit");
      }
    }

    if (res.success) {
      setSubmitSuccess(true);
    } else {
      setSubmitError(res.error || "Erro ao salvar cliente");
    }
  });

  const canSave =
    mode !== "idle" && isValid && !isSubmitting && !isLoadingCliente;

  return {
    mode,
    isLoadingInit,
    isSupervisor,
    selfVendId,
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
  };
}
