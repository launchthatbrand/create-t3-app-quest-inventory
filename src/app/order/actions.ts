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

export interface Events {
  data: {
    items_page_by_column_values: {
      items: Event[];
    };
  };
}

export interface Event {
  id: string;
  name: string;
  group: {
    id: number;
    title: string;
  };
  column_values: [
    {
      time: string;
      date: string;
    },
  ];
}

export type GroupedEvents = Record<
  number,
  {
    // Use string if your actual data uses string IDs for groups
    groupId: number; // Or string
    title: string;
    items: Omit<Event, "group">[]; // Omit the 'group' property from Event in items array
  }
>;

export async function fetchEvents() {
  try {
    const query =
      'query { items_page_by_column_values ( limit:50 , board_id: 5385787000 , columns: [{ column_id: "dropdown4", column_values: ["Yes"] }]) {items {id name group {id title} column_values(ids: "text7") { ... on DateValue { time date} }} }}';
    const result1 = (await monday.api(query, options)) as Events;
    // console.log("result1", result1);
    const result2 = result1.data.items_page_by_column_values.items;
    const result3 = result2[0];
    console.log("result3", result3);

    const groupedData = result2.reduce<GroupedEvents>((acc, item) => {
      // Use the group id as the key for each group
      const { id, title } = item.group;

      // If the group hasn't been added to the accumulator, add it
      if (!acc[id]) {
        acc[id] = {
          groupId: id,
          title,
          items: [],
        };
      }

      // Add the current item to the group's items array
      acc[id]?.items.push({
        id: item.id,
        name: item.name,
        column_values: item.column_values,
      });

      return acc;
    }, {});

    return groupedData;
  } catch (error) {
    console.log("error", error);
  }
}

export async function fetchLocations() {
  try {
    const query =
      "{ boards (ids: 5987199810) { items_page (limit: 500) { items { id name } } } }";
    const result = await monday.api(query, options);
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
