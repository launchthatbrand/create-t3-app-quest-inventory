"use server";

import { api } from "~/trpc/server";
import { redirect } from "next/navigation";

export async function goToOrder(id: string) {
  redirect(`/order/${id}`);
}

export async function getOrders() {
  const result = await api.formResponse.getAll.query();
  return result;
}
