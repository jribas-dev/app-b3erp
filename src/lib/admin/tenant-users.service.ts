"use server";

import { createAction } from "@/lib/api-action";
import { fetchWithAuth } from "@/lib/api-client";
import { logError } from "@/lib/observability/log";
import type {
  CreateUserInstancePayload,
  TenantUserAccount,
  TenantUserInstance,
  TenantUserRow,
  UpdateUserInstancePayload,
} from "@/types/tenant-users";

const listUserInstancesByDbAction = createAction<[string], TenantUserInstance[]>(
  {
    path: (dbId) => `/user-instances/db/${dbId}`,
    errorMsg: "Erro ao listar usuários da instância",
    scope: "tenant-users.list-by-db",
    onStatus: {
      404: async () => ({ success: true, data: [] }),
    },
  }
);

const getUserAccountAction = createAction<[string], TenantUserAccount>({
  path: (userId) => `/users/${userId}`,
  errorMsg: "Erro ao carregar dados do usuário",
  scope: "tenant-users.get-account",
});

export async function listTenantUsersAction(
  dbId: string
): Promise<
  | { success: true; data: TenantUserRow[] }
  | { success: false; error: string }
> {
  const instancesResult = await listUserInstancesByDbAction(dbId);
  if (!instancesResult.success) {
    return { success: false, error: instancesResult.error };
  }

  const instances = instancesResult.data;
  if (instances.length === 0) return { success: true, data: [] };

  const accounts = await Promise.all(
    instances.map((inst) => getUserAccountAction(inst.userId))
  );

  const rows: TenantUserRow[] = [];
  for (let i = 0; i < instances.length; i++) {
    const accRes = accounts[i];
    if (accRes.success) {
      rows.push({ account: accRes.data, instance: instances[i] });
    }
  }

  rows.sort((a, b) =>
    a.account.name.localeCompare(b.account.name, "pt-BR", {
      sensitivity: "base",
    })
  );

  return { success: true, data: rows };
}

export const updateUserInstanceAction = createAction<
  [number, UpdateUserInstancePayload],
  TenantUserInstance
>({
  path: (id) => `/user-instances/${id}`,
  method: "PATCH",
  body: (_id, payload) => payload,
  errorMsg: "Erro ao atualizar vínculo do usuário",
  scope: "tenant-users.update-instance",
});

export const listUsersNotInAction = createAction<[], TenantUserAccount[]>({
  path: () => "/users/notin",
  errorMsg: "Erro ao listar usuários disponíveis",
  scope: "tenant-users.list-notin",
});

export const createUserInstanceAction = createAction<
  [CreateUserInstancePayload],
  TenantUserInstance
>({
  path: () => "/user-instances",
  method: "POST",
  body: (payload) => payload,
  errorMsg: "Erro ao vincular usuário à instância",
  scope: "tenant-users.create-instance",
});

export async function setUserActiveAction(
  userId: string,
  isActive: boolean
): Promise<
  | { success: true; data: TenantUserAccount }
  | { success: false; error: string }
> {
  try {
    const response = await fetchWithAuth(`/users/active`, {
      method: "PATCH",
      body: JSON.stringify({ userId, isActive }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const message =
        (err && typeof err === "object" && "message" in err && typeof err.message === "string"
          ? err.message
          : null) || "Erro ao atualizar status do usuário";
      return { success: false, error: message };
    }

    const data = (await response.json()) as TenantUserAccount;
    return { success: true, data };
  } catch (error) {
    logError("tenant-users.set-active", error, { userId, isActive });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
