import { Spinner } from "@/components/ui/spinner";

export function LoadingFallbackLarge() {
  return (
    <div className="min-h-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

export function LoadingFallbackSmall() {
  return (
    <div className="flex items-center justify-center p-1">
      <Spinner size="sm" />
    </div>
  );
}
