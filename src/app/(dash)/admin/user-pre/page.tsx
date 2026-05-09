"use client";

import { ArrowLeft, UserStar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
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
  const router = useRouter();
  const invitesRef = useRef<InvitesTabHandle | null>(null);

  const handleCreated = () => {
    invitesRef.current?.refetch();
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
          <UserStar size={20} />
          Convidar Usuário
        </h1>
      </div>

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
