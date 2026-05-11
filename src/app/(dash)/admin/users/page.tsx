"use client";

import { ArrowLeft, UserLock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import {
  AddUserTab,
  type AddUserTabHandle,
} from "@/components/admin/users/add-user-tab";
import {
  ManageUsersTab,
  type ManageUsersTabHandle,
} from "@/components/admin/users/manage-users-tab";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useSession } from "@/hooks/useSession.hook";

export default function UsersPage() {
  const router = useRouter();
  const { session } = useSession();

  const manageRef = useRef<ManageUsersTabHandle | null>(null);
  const addRef = useRef<AddUserTabHandle | null>(null);

  const handleLinked = () => {
    manageRef.current?.refetch();
    addRef.current?.refetch();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/home")}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <UserLock size={20} />
          Gerenciamento de Usuários
        </h1>
      </div>

      <Tabs defaultValue="manage">
        <TabsList>
          <TabsTrigger value="manage">Usuários da instância</TabsTrigger>
          <TabsTrigger value="add">Incluir usuário</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <ManageUsersTab
            ref={manageRef}
            dbId={session?.dbId}
            currentUserId={session?.userId}
          />
        </TabsContent>

        <TabsContent value="add">
          <AddUserTab
            ref={addRef}
            dbId={session?.dbId}
            onLinked={handleLinked}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
