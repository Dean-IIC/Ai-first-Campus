"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SignInState = { message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Staff sign-in with email and password. Only accounts on the editors list stay signed in. */
export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const password = String(formData.get("password") ?? "").slice(0, 200);
  if (!EMAIL.test(email)) return { message: "Enter your college email address." };
  if (password.length < 6) return { message: "Enter your password." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { message: "The website is not connected to Supabase yet." };

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { message: "The email or password is not correct." };
    const { data: isEditor } = await supabase.rpc("is_editor");
    if (isEditor !== true) {
      await supabase.auth.signOut();
      return { message: "This account is not on the editors list. Ask the website administrator to add you." };
    }
  } catch (err) {
    console.error("[auth] sign-in failed:", err instanceof Error ? err.message : err);
    return { message: "We could not reach the server. Check your connection and try again." };
  }
  redirect("/ai-quantum/champions");
}

/** Signs the current user out and returns to the home page. */
export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  try {
    await supabase?.auth.signOut();
  } catch (err) {
    console.error("[auth] sign-out failed:", err instanceof Error ? err.message : err);
  }
  redirect("/");
}
