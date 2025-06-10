export function LoadingFallbackLarge() {
  return (
    <div className="min-h-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin animate-ease-in-out rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}

export function LoadingFallbackSmall() {
  return (
    <div className="flex items-center justify-center p-1">
      <div className="text-center">
        <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}
