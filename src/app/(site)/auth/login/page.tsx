import { FormLogin } from "@/components/home/form-login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - B3ERP",
  description: "Autenticação de usuário para acessar o B3ERP",
};

export default function LoginPage() {
  return (
    <FormLogin />
  );
}
