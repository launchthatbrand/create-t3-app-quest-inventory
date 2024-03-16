"use server";

import { api } from "~/trpc/server";

export async function saveFormResponse(values: string) {
  try {
    const result = await api.formResponse.create.mutate({
      data: values,
    });
    console.log("result", result);
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
