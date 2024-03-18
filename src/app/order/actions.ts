"use server";

import { api } from "~/trpc/server";
import { redirect } from "next/navigation";

import { type APIOptions } from "monday-sdk-js/types/client-api.interface";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();
monday.setApiVersion("2023-10");

const options: APIOptions = {
  token: process.env.MONDAY_TOKEN,
};

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

export async function fetchCategories() {
  try {
    const query = "query { boards (ids: 5798486455) { groups { title id }} }";
    const result = await monday.api(query, options);
    // console.log("fetchCategories", result);
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
