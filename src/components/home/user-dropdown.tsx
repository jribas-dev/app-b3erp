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
import { DoorClosedLocked, LayoutDashboard, User, UserCircle, UserCog } from "lucide-react";
import { useAuth } from "@/hooks/useAuth.hook";
import { useEffect } from "react";
import { useUserEdit } from "@/hooks/useUserEdit.hook";
import { useSession } from "@/hooks/useSession.hook";
import { useRouter } from "next/navigation";
import { LoadingFallbackSmall } from "./loading-fallback";

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
      <LoadingFallbackSmall />
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
        <DropdownMenuLabel>
          <UserCircle className="mr-2 h-4 w-4 inline-block" />
          {userData ? userData.name : "Carregando..."}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={useRedirectHome}>
            <LayoutDashboard className="mr-2 h-4 w-4 inline-block" />
            Dashboard principal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={useRedirectEdit}>
            <UserCog className="mr-2 h-4 w-4 inline-block" />
            Editar meu perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <DoorClosedLocked className="mr-2 h-4 w-4 inline-block" />
            Sair com segurança
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
