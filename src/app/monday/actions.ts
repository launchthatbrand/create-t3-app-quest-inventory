/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";

import { api } from "~/trpc/server";
import supabaseServer from "~/lib/supabase/server";
import { type InventoryFormData } from "../_components/DefaultForm";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

import mondaySdk from "monday-sdk-js";
import { type APIOptions } from "monday-sdk-js/types/client-api.interface";
import { JsonObject } from "next-auth/adapters";

const monday = mondaySdk();
monday.setApiVersion("2023-10");

const options: APIOptions = {
  token: process.env.MONDAY_TOKEN,
};

export async function saveFormResponse(values: string) {
  try {
    // Step 1: Save the form response to the database
    const dbData = await saveToDatabase(values);
    console.log("saveFormResponse_server", dbData);
    if (!dbData) return;

    // Step 2: Create Monday Item and SubItems
    const createMondayItemResult = await createMondayItem(dbData);
    if (!createMondayItemResult) return;
    const MondayItemId = createMondayItemResult.createMondayItemId;
    const updatedFormData = JSON.stringify(
      createMondayItemResult.updatedFormData,
    );
    console.log("updatedFormData", updatedFormData);

    // Step 3: Update Database again

    const updateResponse = await api.formResponse.updateWithMondayData.mutate({
      id: dbData.id,
      mondayItemId: MondayItemId,
      data: updatedFormData,
    });
  } catch (error) {
    console.log("Error saving to database", error);
    // Handle this error specifically, maybe return or throw a custom error
    throw new Error("Database save failed");
  }
}

export async function updateFormResponse(values: string) {}

export async function readUserSession() {
  const supabase = await supabaseServer();
  return supabase.auth.getSession();
}

export async function saveToDatabase(values: string) {
  let session;
  try {
    const response = await readUserSession();
    session = response.data.session;
    // Check if session or session.user.id is not available
    if (!session?.user?.id) {
      throw new Error("No valid session or user ID found");
    }
  } catch (error) {
    console.error("Error reading user session:", error);
    throw new Error("Failed to retrieve user session");
  }

  try {
    const result = await api.formResponse.create.mutate({
      data: values,
      createdById: session.user.id,
    });
    return result;
  } catch (error) {
    console.error("Error saving to database:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
}

export async function createMondayItem(
  dbData: inferProcedureOutput<AppRouter["formResponse"]["getAll"]>[number],
) {
  const user = await api.user.getById.query({ id: dbData.createdById });

  const formData: InventoryFormData = JSON.parse(dbData.data);
  try {
    const mutation = `mutation { create_item (board_id: 6309440166, item_name: \"Order# ${dbData.id}\", column_values: \"{ \\\"email\\\": \\\"${user?.email} ${user?.email}\\\", \\\"text0\\\": \\\"${user?.tel}\\\", \\\"text3\\\": \\\"${formData.location.name}\\\",\\\"text4\\\": \\\"${formData.event.name}\\\", \\\"text\\\": \\\"${user?.firstName}\\\", \\\"status\\\": \\\"2\\\" }\") { id board { id } } }`;
    const createMondayItemResult = await monday.api(mutation, options);
    const createMondayItemId = createMondayItemResult.data.create_item.id;

    console.log("createMondayItemId", createMondayItemId);

    const updatedItems = await Promise.all(
      formData.items.map(async (item) => {
        const itemId = await createSubitem(
          item,
          createMondayItemResult.data.create_item.id,
        ); // Your function to create an item on Monday
        return { ...item, itemId }; // Append the itemId to the item
      }),
    );

    // Update the formData with the updated items
    const updatedFormData = { ...formData, items: updatedItems };
    console.log("");

    return { createMondayItemId, updatedFormData };

    // // Now, update the JSONB column in your database with this updatedFormData
    // await updateFormDataInDatabase(dbData.id, updatedFormData); // Implement this function based on your DB solution

    // const item_id = result1.data.create_item.id;
    // console.log("createItem_itemID", item_id);
    // const mutation2 = `mutation { change_multiple_column_values (board_id: 5980720965, item_id: \"${item_id}\", column_values: \"{ \\\"name\\\": \\\"${item_name} : ${item_id}\\\" }\") { id board { id } } }`;
    // const result2 = await monday.api(mutation2, options);
    // console.log("createItem_result2", result2);
    // return result2;
  } catch (error) {
    console.log("error", error);
  }
}

export async function updateFormDataInDatabase(
  databaseId: number,
  updatedFormData: JsonObject,
) {}

export async function createSubitem(
  data: InventoryFormData["items"][number],
  newItemId: string,
) {
  try {
    const { name, id, quantity } = data;
    const mutation = `mutation { create_subitem (parent_item_id: ${newItemId}, item_name: \"${name}\", column_values: \"{ \\\"numbers\\\": \\\"${quantity.checkout}\\\",\\\"text_1\\\": \\\"${id}\\\" }\") { id board { id } } }`;
    const result = await monday.api(mutation, options);
    return result.data.create_subitem.id;
  } catch (error) {
    console.log("error", error);
  }
}

export async function checkinOrder() {
  try {
  } catch (error) {
    console.log("error", error);
  }
}
