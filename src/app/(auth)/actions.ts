"use server";

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

export async function signOut() {
  const supabase = await supabaseServer();
  const result = await supabase.auth.signOut();
  return result;
}

export async function readUserSession() {
  const supabase = await supabaseServer();
  return supabase.auth.getSession();
}
