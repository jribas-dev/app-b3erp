"use server";

import { createAction } from "@/lib/api-action";
import type {
  BackofficeUser,
  CreateInvitePayload,
  UserPre,
} from "@/types/user-pre";

export const listMyInvitesAction = createAction<[], UserPre[]>({
  path: () => "/user-pre/my-invites",
  errorMsg: "Erro ao carregar convites enviados",
  scope: "user-pre.my-invites",
});

export const createUserPreAction = createAction<[CreateInvitePayload], UserPre>(
  {
    path: () => "/user-pre/create",
    method: "POST",
    body: (payload) => payload,
    errorMsg: "Erro ao criar convite",
    scope: "user-pre.create",
  }
);

export const resendInviteAction = createAction<[string], void>({
  path: () => "/user-pre/resend",
  method: "POST",
  body: (email) => ({ email }),
  expectsBody: false,
  errorMsg: "Erro ao reenviar convite",
  scope: "user-pre.resend",
});

export const regenerateInviteAction = createAction<[string], void>({
  path: () => "/user-pre/regenerate",
  method: "POST",
  body: (email) => ({ email }),
  expectsBody: false,
  errorMsg: "Erro ao regenerar token do convite",
  scope: "user-pre.regenerate",
});

export const listBackofficeUsersAction = createAction<
  [number],
  BackofficeUser[]
>({
  path: (idemp) => `/tenant/usu/backoffice?idemp=${idemp}`,
  errorMsg: "Erro ao listar usuários do back-office",
  scope: "user-pre.backoffice-list",
});
