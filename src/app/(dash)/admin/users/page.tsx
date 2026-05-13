"use client";

import { UserLock } from "lucide-react";
import { useRef } from "react";

import {
  AddUserTab,
  type AddUserTabHandle,
} from "@/components/admin/users/add-user-tab";
import {
  ManageUsersTab,
  type ManageUsersTabHandle,
} from "@/components/admin/users/manage-users-tab";
import { PageHeader } from "@/components/layout/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useSession } from "@/hooks/useSession.hook";

export default function UsersPage() {
  const { session } = useSession();

  const manageRef = useRef<ManageUsersTabHandle | null>(null);
  const addRef = useRef<AddUserTabHandle | null>(null);

  const handleLinked = () => {
    manageRef.current?.refetch();
    addRef.current?.refetch();
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        icon={UserLock}
        title="Gerenciamento de Usuários"
        subtitle="Adicionar ou configurar acesso de usuários"
      />

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
