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
