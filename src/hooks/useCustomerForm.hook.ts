"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { maskCep, maskDocfed } from "@/lib/format/document";
import { validateDocfed } from "@/lib/validation/docfed";
import type {
  ClienteBusca,
  MembroEquipe,
  Emitente,
  Operacao,
  ClienteFormPayload,
} from "@/types/vendas.types";

// ── types ──────────────────────────────────────────────────────────────────────

export type CustomerMode = "idle" | "new" | "edit";

export interface CustomerFormState {
  razao: string;
  fantasia: string;
  docfedDisplay: string;
  docest: string;
  email: string;
  emailnfe: string;
  emailcob: string;
  site: string;
  cepDisplay: string;
  endereco: string;
  nroend: string;
  bairro: string;
  cidade: string;
  uf: string;
  fone: string;
  fone2: string;
  cel: string;
  obsvenda: string;
  idoper: string;
  idvende: string;
}

const EMPTY_FORM: CustomerFormState = {
  razao: "",
  fantasia: "",
  docfedDisplay: "",
  docest: "",
  email: "",
  emailnfe: "",
  emailcob: "",
  site: "",
  cepDisplay: "",
  endereco: "",
  nroend: "",
  bairro: "",
  cidade: "",
  uf: "",
  fone: "",
  fone2: "",
  cel: "",
  obsvenda: "",
  idoper: "",
  idvende: "",
};

// ── hook ───────────────────────────────────────────────────────────────────────

export function useCustomerForm() {
  const [mode, setMode] = useState<CustomerMode>("idle");
  const [clienteId, setClienteId] = useState<number | null>(null);

  const [isSupervisor, setIsSupervisor] = useState(false);
  const [selfVendId, setSelfVendId] = useState<number | null>(null);
  const [equipe, setEquipe] = useState<MembroEquipe[]>([]);
  const [emitentes, setEmitentes] = useState<Emitente[]>([]);
  const [selectedIdemp, setSelectedIdemp] = useState<number | null>(null);
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);
  const [isLoadingInit, setIsLoadingInit] = useState(true);

  const [form, setForm] = useState<CustomerFormState>(EMPTY_FORM);
  const [docfedError, setDocfedError] = useState<string | null>(null);

  const [isLoadingCliente, setIsLoadingCliente] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ClienteBusca[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initDoneRef = useRef(false);

  const setField = useCallback(
    <K extends keyof CustomerFormState>(key: K, val: CustomerFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: val }));
    },
    [],
  );

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

        const isSup = session?.roleFront === "supervisor";
        setIsSupervisor(isSup);

        if (equipeRes.success) {
          setEquipe(equipeRes.data);
          const self = equipeRes.data.find((m) => m.liderado === 0);
          if (self) {
            setSelfVendId(self.id);
            if (!isSup) {
              setForm((f) => ({ ...f, idvende: String(self.id) }));
            }
          }
        }

        if (emitentesRes.success && emitentesRes.data.length > 0) {
          setEmitentes(emitentesRes.data);
          const firstId = emitentesRes.data[0].id;
          setSelectedIdemp(firstId);

          const opsRes = await getOperacoesAction(firstId);
          if (opsRes.success) {
            setOperacoes(opsRes.data);
          }
        }
      } finally {
        setIsLoadingInit(false);
      }
    }

    init();
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  // ── emitente change ────────────────────────────────────────────────────────

  const onIdemandChange = useCallback(async (id: number) => {
    setSelectedIdemp(id);
    const opsRes = await getOperacoesAction(id);
    if (opsRes.success && opsRes.data) {
      setOperacoes(opsRes.data);
      setField("idoper", "");
    }
  }, [setField]);

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

  const onSelectFromSearch = useCallback(async (id: number) => {
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
        setDocfedError(validateDocfed(rawDocfed));
        setForm({
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
  }, []);

  // ── new cliente ────────────────────────────────────────────────────────────

  const onNewCliente = useCallback(() => {
    setClienteId(null);
    setMode("new");
    setDocfedError(null);
    setSubmitError(null);
    setSubmitSuccess(false);
    setForm({
      ...EMPTY_FORM,
      idvende: selfVendId ? String(selfVendId) : "",
    });
  }, [selfVendId]);

  // ── docfed field ───────────────────────────────────────────────────────────

  const onDocfedChange = useCallback(
    (v: string) => {
      setField("docfedDisplay", maskDocfed(v));
      setDocfedError(validateDocfed(v));
    },
    [setField],
  );

  // ── cep field ──────────────────────────────────────────────────────────────

  const onCepChange = useCallback(
    (v: string) => {
      setField("cepDisplay", maskCep(v));
    },
    [setField],
  );

  const onCepBlur = useCallback(async () => {
    const raw = form.cepDisplay.replace(/\D/g, "");
    if (raw.length !== 8) return;
    setIsCepLoading(true);
    try {
      const res = await buscarCepAction(raw);
      if (res.success && res.data) {
        const d = res.data;
        setForm((f) => ({
          ...f,
          endereco: d.logradouro || f.endereco,
          bairro: d.bairro || f.bairro,
          cidade: d.localidade || f.cidade,
          uf: d.uf || f.uf,
        }));
      }
    } finally {
      setIsCepLoading(false);
    }
  }, [form.cepDisplay]);

  // ── can save ───────────────────────────────────────────────────────────────

  const canSave =
    mode !== "idle" &&
    form.razao.trim().length >= 2 &&
    !docfedError &&
    !isSubmitting &&
    !isLoadingCliente;

  // ── submit ─────────────────────────────────────────────────────────────────

  const onSave = useCallback(async () => {
    if (!canSave) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const payload: ClienteFormPayload = {
      razao: form.razao.trim(),
      ...(form.fantasia.trim() && { fantasia: form.fantasia.trim() }),
      ...(form.docfedDisplay && {
        docfed: form.docfedDisplay.replace(/\D/g, ""),
      }),
      ...(form.docest.trim() && { docest: form.docest.trim() }),
      ...(form.email.trim() && { email: form.email.trim() }),
      ...(form.emailnfe.trim() && { emailnfe: form.emailnfe.trim() }),
      ...(form.emailcob.trim() && { emailcob: form.emailcob.trim() }),
      ...(form.site.trim() && { site: form.site.trim() }),
      ...(form.cepDisplay && { cep: form.cepDisplay }),
      ...(form.endereco.trim() && { endereco: form.endereco.trim() }),
      ...(form.nroend.trim() && { nroend: form.nroend.trim() }),
      ...(form.bairro.trim() && { bairro: form.bairro.trim() }),
      ...(form.cidade.trim() && { cidade: form.cidade.trim() }),
      ...(form.uf.trim() && { uf: form.uf.trim().toUpperCase().slice(0, 2) }),
      ...(form.fone && { fone: form.fone }),
      ...(form.fone2 && { fone2: form.fone2 }),
      ...(form.cel && { cel: form.cel }),
      ...(form.obsvenda.trim() && { obsvenda: form.obsvenda.trim() }),
      ...(form.idoper && { idoper: parseInt(form.idoper) }),
      ...(form.idvende && { idvende: parseInt(form.idvende) }),
    };

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

    setIsSubmitting(false);
  }, [canSave, form, mode, clienteId]);

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
  };
}
