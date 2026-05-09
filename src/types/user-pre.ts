export interface UserPre {
  userPreId: number;
  email: string;
  token: string;
  expiresAt: string;
  userInviteId: string;
}

export interface BackofficeUser {
  id: number;
  login: string;
}

export interface RelationUserPre {
  dbId: string;
  roleBack: "admin" | "supervisor" | "user" | "notallow";
  roleFront: Array<
    "admin" | "supersaler" | "saler" | "inventory" | "buyer" | "notallow"
  >;
  idBackendUser?: number | null;
}

export interface CreateInvitePayload {
  email: string;
  dblist: RelationUserPre[];
}
