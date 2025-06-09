export interface UserData {
  userId: string;
  email: string;
  phone: string;
  name: string;
  isRoot: boolean;
  isActive: boolean;
}

export interface UserUpdateResponse {
  success: boolean;
  error?: string;
  data?: UserData;
}

export interface PasswordUpdateResponse {
  success: boolean;
  error?: string;
}
