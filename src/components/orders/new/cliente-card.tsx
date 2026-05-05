"use client";

import {
  Building2,
  FileText,
  LocateFixed,
  MapPin,
  Phone,
  Smartphone,
  User,
} from "lucide-react";

import { Callout } from "@/components/ui/callout";
import type { ClienteDetalhe } from "@/lib/vendas/schemas";

interface ClienteCardProps {
  cliente: ClienteDetalhe;
}

export function ClienteCard({ cliente }: ClienteCardProps) {
  const semDadosContato =
    !cliente.fone && !cliente.endereco && !cliente.cidade;

  return (
    <div className="border border-border rounded-(--radius) overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border">
        <Building2 size={16} className="text-primary shrink-0" />
        <span className="font-semibold text-sm truncate">{cliente.razao}</span>
        {cliente.docfed && (
          <span className="ml-auto text-xs font-mono text-muted-foreground shrink-0">
            {cliente.docformatado}
          </span>
        )}
      </div>

      <div className="px-4 py-3 grid gap-2 text-sm">
        {cliente.fone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone size={14} className="shrink-0" />
            <span>{cliente.fone}</span>
          </div>
        )}

        {cliente.cel && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Smartphone size={14} className="shrink-0" />
            <span>{cliente.cel}</span>
          </div>
        )}

        {(cliente.endereco || cliente.cidade) && (
          <>
            {(cliente.endereco || cliente.nroend || cliente.bairro) && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <LocateFixed size={14} className="shrink-0 mt-0.5" />
                <span>
                  {[cliente.endereco, cliente.nroend, cliente.bairro]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}

            {(cliente.cidade || cliente.uf) && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                <span>
                  <strong>
                    {cliente.cidade && cliente.uf
                      ? `${cliente.cidade} — ${cliente.uf}`
                      : (cliente.cidade ?? cliente.uf)}
                  </strong>
                </span>
              </div>
            )}
          </>
        )}

        {semDadosContato && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <User size={14} className="shrink-0" />
            <span>Sem dados de contato cadastrados</span>
          </div>
        )}
      </div>

      {cliente.obsvenda && (
        <div className="px-4 pb-3">
          <Callout variant="warning" className="py-2.5">
            <div className="flex items-start gap-2">
              <FileText
                size={14}
                className="shrink-0 mt-0.5 text-warning"
              />
              <p className="text-sm leading-snug">{cliente.obsvenda}</p>
            </div>
          </Callout>
        </div>
      )}
    </div>
  );
}
