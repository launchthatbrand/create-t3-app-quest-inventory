"use server";

import { createMondayUserItem } from "../monday/actions";
import supabaseServer from "~/lib/supabase/server";

export async function signInWithEmailAndPassword(data: {
  email: string;
  password: string;
}) {
  const supabase = await supabaseServer();
  const result = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  return result;
}

export async function signUpWithEmailAndPassword(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tel: string;
}) {
  const supabase = await supabaseServer();
  const result = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        tel: data.tel,
      },
    },
  });

  if (!result.error) {
    const result2 = await createMondayUserItem(result);
  }

  return result;
}

export async function signOut() {
  const supabase = await supabaseServer();
  const result = await supabase.auth.signOut();
  return result;
}

export async function readUserSession() {
  const supabase = await supabaseServer();
  return supabase.auth.getSession();
}

export async function sendResetPassword(email: string) {
  const supabase = await supabaseServer();
  const redirectTo =
    process.env.NODE_ENV === "production"
      ? "https://fdot-inventory.vercel.app/resetpass"
      : "http://localhost:3000/resetpass";
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
}

export async function resetPassword(data: { password: string; code: string }) {
  console.log("data", data);
  const supabase = await supabaseServer();
  try {
    const { data: session, error } = await supabase.auth.exchangeCodeForSession(
      data.code,
    );

    return supabase.auth.updateUser({
      password: data.password,
    });
  } catch (error) {
    return { error };
  }
}
