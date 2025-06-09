"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth.hook";
import { useEffect } from "react";
import { useUserEdit } from "@/hooks/useUserEdit.hook";
import { useSession } from "@/hooks/useSession.hook";
import { useRouter } from "next/navigation";

export default function UserDropDown() {
  const { logout } = useAuth();
  const router = useRouter();
  const { session, isLoading: isLoadingSession } = useSession();
  const { userData, isLoadingUser, loadUserData } = useUserEdit();

  // Carrega dados do usuário quando a sessão estiver disponível
  useEffect(() => {
    if (session?.userId) {
      loadUserData(session.userId);
    }
  }, [session?.userId, loadUserData]);

  const useRedirectEdit = () => {
    router.push("/home/user-edit");
  };
  
  const useRedirectHome = () => {
    router.push("/home");
  };

  if (isLoadingSession || isLoadingUser) {
    return (
      <div className="flex items-center justify-center p-1">
        <div className="text-center">
          <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer">
          <User className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
          <span className="sr-only">User Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end">
        <DropdownMenuLabel className="text-center">
          {userData ? userData.name : "Carregando..."}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={useRedirectHome}>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={useRedirectEdit}>
            Editar Dados
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>Sair / Logout</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
