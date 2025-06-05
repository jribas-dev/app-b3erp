"use server";

import { sleep } from "@/lib/utils";
import { redirect } from "next/navigation";
import { SignInFormData } from "./validations";
import { ApiResponse } from "@/types/api-response";
import { cookies } from "next/headers";
import { AuthResponse } from "@/types/auth-response";
import { SessionData } from "@/types/session-data";


class AuthService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.BACKEND_URL || ''
  }

  // Primeiro passo: Login com email e senha
  async login(credentials: SignInFormData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao fazer login')
    }

    return response.json()
  }

  // Segundo passo: Seleção de instância
  async selectInstance(dbId: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/instance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dbId }),
      credentials: 'include', // Inclui cookies automaticamente
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao selecionar instância')
    }

    return response.json()
  }

  // Obter dados da sessão atual
  async getSession(): Promise<SessionData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/backend/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Inclui cookies automaticamente
      })

      if (!response.ok) {
        return null
      }

      return response.json()
    } catch (error) {
      console.error('Erro ao obter sessão:', error)
      return null
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      // Limpar cookies no client-side também
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      
      // Redirecionar para login
      redirect("/auth/login");
    }
  }

  // Verificar se usuário tem permissão para uma rota
  hasPermission(userRole: string | undefined, requiredRoles: string[]): boolean {
    if (!userRole || requiredRoles.length === 0) return true
    return requiredRoles.includes(userRole)
  }
}

// Instância singleton do serviço de autenticação
export const authService = new AuthService()

export async function signIn(data: SignInFormData): Promise<ApiResponse> {
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3002";
  const url = new URL(`${BACKEND_URL}/auth/login`);

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const status = response.status;

    if (response.ok) {
      const cookieStore = await cookies();
      cookieStore.delete("session");

      const payload: {
        accessToken: string;
        tokenType: string;
        expiresIn: number;
      } = await response.json();

      if (payload.accessToken) {
        // Set the session cookie with the access token
        cookieStore.set("session", payload.accessToken, {
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          maxAge: payload.expiresIn,
          expires: new Date(Date.now() + payload.expiresIn * 1000),
        });
      }
      return {
        success: true,
        status,
        message: "Autenticação bem-sucedida",
        data: payload,
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        status,
        message: errorData.message || "Email ou senha inválidos",
      };
    }
  } catch (error) {
    console.log("Erro Autenticação /auth/login:", error);
    return {
      success: false,
      status: 500,
      message: "Erro interno do servidor",
    };
  }
}

export async function signOut() {
  // Perform sign-out logic here, such as clearing cookies or session storage
  // For example, you might clear a cookie named 'session'
  // document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Redirect to the login page after signing out
  await sleep(300);
  redirect("/auth/login");
}

export async function userEdit() {
  // Perform user edit logic here, such as updating user information
  // Redirect to the user edit page after editing
  await sleep(300);
  redirect("/home/user-edit");
}
