"use client";

import { UserStar } from "lucide-react";
import { useRef } from "react";

import { PageHeader } from "@/components/layout/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CreateInviteTab } from "@/components/user-pre/create-invite-tab";
import {
  InvitesTab,
  type InvitesTabHandle,
} from "@/components/user-pre/invites-tab";

export default function UserPrePage() {
  const invitesRef = useRef<InvitesTabHandle | null>(null);

  const handleCreated = () => {
    invitesRef.current?.refetch();
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader icon={UserStar} title="Convidar Usuário" subtitle="Gerenciar convites pendentes / Ativar usuários na API" />

      <Tabs defaultValue="manage">
        <TabsList>
          <TabsTrigger value="manage">Convites enviados</TabsTrigger>
          <TabsTrigger value="create">Criar convite</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <InvitesTab refHandle={invitesRef} />
        </TabsContent>

        <TabsContent value="create">
          <CreateInviteTab onCreated={handleCreated} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
