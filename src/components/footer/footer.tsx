export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 p-2 text-center text-sm">
      <p>B3Erp WebApp © {year}</p>
      <p className="text-gray-600">Todos os direitos reservados</p>
    </footer>
  );
}