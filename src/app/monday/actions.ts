"use server";

import supabaseServer from "~/lib/supabase/server";
import { api } from "~/trpc/server";

export async function saveFormResponse(values: string) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("user", user);
  if (!user?.id) {
    console.error("No user id found");
    return { error: "No user id found" };
  }

  try {
    const result = await api.formResponse.create.mutate({
      data: values,
      createdById: user.id,
    });
    console.log("result", result);
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
