"use client";

import { useCallback, useState } from "react";

import { createUserPreAction } from "@/lib/admin/user-pre.service";
import { toast } from "@/lib/toast";
import type {
  RoleBackValue,
  RoleFrontValue,
} from "@/lib/forms/invite.form";
import type { CreateInvitePayload, RelationUserPre } from "@/types/user-pre";

interface SubmitInput {
  email: string;
  dbId: string;
  roleBack: RoleBackValue;
  roleFront: RoleFrontValue[];
  idBackendUser?: number | null;
}

interface UseCreateInviteReturn {
  isSubmitting: boolean;
  submit: (
    input: SubmitInput
  ) => Promise<{ success: boolean; error?: string }>;
}

export function useCreateInvite(): UseCreateInviteReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(async (input: SubmitInput) => {
    setIsSubmitting(true);
    const relation: RelationUserPre = {
      dbId: input.dbId,
      roleBack: input.roleBack,
      roleFront: input.roleFront,
    };
    if (typeof input.idBackendUser === "number") {
      relation.idBackendUser = input.idBackendUser;
    }
    const payload: CreateInvitePayload = {
      email: input.email,
      dblist: [relation],
    };
    const result = await createUserPreAction(payload);
    setIsSubmitting(false);

    if (result.success) {
      toast.sucesso(`Convite enviado para ${input.email}`);
      return { success: true };
    }

    const friendly =
      result.status === 401
        ? "Já existe usuário ou convite ativo para este e-mail"
        : result.error;
    toast.erro(friendly);
    return { success: false, error: friendly };
  }, []);

  return { isSubmitting, submit };
}
