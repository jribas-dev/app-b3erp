"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PedidoSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoHome: () => void;
  onGoNovoPedido: () => void;
}

export function PedidoSuccessDialog({
  open,
  onOpenChange,
  onGoHome,
  onGoNovoPedido,
}: PedidoSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Pedido fechado com sucesso</DialogTitle>
          <DialogDescription>O que deseja fazer agora?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onGoHome}>
            Voltar para Home
          </Button>
          <Button onClick={onGoNovoPedido}>
            <Plus size={16} />
            Novo Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
