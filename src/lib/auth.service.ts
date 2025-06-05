"use server";

import { sleep } from "@/lib/utils";
import { redirect } from "next/navigation";
import { SignInFormData } from "./validations";
import { ApiResponse } from "@/types/api-response";
import { cookies } from "next/headers";

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
