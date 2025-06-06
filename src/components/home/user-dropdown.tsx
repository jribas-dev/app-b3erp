import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth.hook"; 
import { useRouter } from "next/router";

export default function UserDropDown() {
  const { logout } = useAuth();

  const useRedirectEdit = () => {
    const router = useRouter();
    router.push("/user/edit");
  };

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
          João Manoel Z Ribas
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="pt-2 space-y-2">
          <DropdownMenuItem onClick={useRedirectEdit}>
            Editar Dados
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            Sair / Logout
            <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
