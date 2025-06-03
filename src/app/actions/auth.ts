import { sleep } from "@/lib/utils";
import { FormState, SignInFormSchema } from "@/lib/validations";
import { redirect } from "next/navigation";

export async function signIn(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await sleep(1500);
  // const response = await fetch("http://localhost:3002/auth/login", {
  //     method: "POST",
  //     headers: {
  //     "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ email, password }),
  // });

  // if (!response.ok) {
  //     const errorData = await response.json();
  //     return {
  //         error: errorData.message || "Failed to sign in",
  //     }
  // }
  // redirect to the dashboard after successful login
  redirect("/home");
}

export async function signOut() {
  // Perform sign-out logic here, such as clearing cookies or session storage
  // For example, you might clear a cookie named 'session'
  // document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
  // Redirect to the login page after signing out
  await sleep(300);
  redirect("/auth/login");
}
