"use client";

import { GitCommitHorizontal } from "lucide-react";

import {
  Callout,
  CalloutDescription,
} from "@/components/ui/callout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { UserInstanceList } from "@/types/user-instance-list";

interface InstanceSelectorProps {
  instances: UserInstanceList[];
  selectedInstanceId: string | null;
  isPending: boolean;
  instanceError: string;
  onSelect: (id: string) => void;
}

export function InstanceSelector({
  instances,
  selectedInstanceId,
  isPending,
  instanceError,
  onSelect,
}: InstanceSelectorProps) {
  return (
    <div className="py-4 border-t border-border/80 animate-in fade-in-20 slide-in-from-top-1">
      <div className="w-full max-w-sm mx-auto">
        <p className="text-sm font-medium text-center mb-2">
          Selecione uma instância para continuar
        </p>
        <Select
          value={selectedInstanceId || ""}
          onValueChange={onSelect}
          disabled={isPending}
        >
          <SelectTrigger
            aria-label="Selecione uma instância"
            className="w-full"
          >
            <SelectValue placeholder="Escolha uma instância" />
          </SelectTrigger>
          <SelectContent>
            {instances.map((instance) => (
              <SelectItem
                key={instance.id}
                value={instance.dbId}
                disabled={isPending}
                className="flex items-center gap-2"
              >
                <GitCommitHorizontal className="h-4 w-4 text-muted-foreground" />
                <span>{instance.instanceName}</span>
                {selectedInstanceId === instance.dbId && (
                  <span className="ml-auto text-primary text-xs flex items-center gap-1.5">
                    <Spinner size="sm" />
                    Abrindo...
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {instanceError && (
          <Callout variant="destructive" className="mt-3">
            <CalloutDescription>{instanceError}</CalloutDescription>
          </Callout>
        )}
      </div>
    </div>
  );
}
