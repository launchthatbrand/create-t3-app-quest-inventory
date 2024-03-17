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

export async function getUserOrders() {
  const result = await api.formResponse.getAll.query();
  return result;
}

export async function deleteOrder(id: number) {
  const result = await api.formResponse.deleteResponse.mutate({ id });
  return result;
}
