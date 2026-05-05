"use client";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = "Home" }: BackButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className="gap-2">
      <ArrowLeft size={16} />
      {label}
    </Button>
  );
}

interface PedidoHeaderProps {
  idPedido: number;
  onGoHome: () => void;
  onGoList: () => void;
}

export function PedidoHeader({
  idPedido,
  onGoHome,
  onGoList,
}: PedidoHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <BackButton onClick={onGoHome} />
      <BackButton onClick={onGoList} label="Histórico" />
      <span className="text-muted-foreground font-mono font-bold">
        #{idPedido}
      </span>
    </div>
  );
}
