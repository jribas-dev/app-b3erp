export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="p-2 text-center text-sm border-t">
      <p>B3Erp WebApp © {year}</p>
      <p className="text-xs">Todos os direitos reservados</p>
    </footer>
  );
}