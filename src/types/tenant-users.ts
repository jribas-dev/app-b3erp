import type {
  RoleBackValue,
  RoleFrontValue,
} from "@/lib/forms/invite.form";

export interface TenantUserInstance {
  id: number;
  userId: string;
  dbId: string;
  idBackendUser: number | null;
  roleback: RoleBackValue;
  rolefront: RoleFrontValue[];
  isActive: boolean;
  instanceName: string;
  instanceDbName: string;
  instanceDbHost: string;
}

export interface TenantUserAccount {
  userId: string;
  name: string;
  email: string;
  phone: string;
  isRoot: boolean;
  isActive: boolean;
}

export interface TenantUserRow {
  account: TenantUserAccount;
  instance: TenantUserInstance;
}

export interface UpdateUserInstancePayload {
  roleback?: RoleBackValue;
  rolefront?: RoleFrontValue[];
  isActive?: boolean;
}

export interface CreateUserInstancePayload {
  userId: string;
  dbId: string;
  roleback: RoleBackValue;
  rolefront: RoleFrontValue[];
  idBackendUser?: number;
}
