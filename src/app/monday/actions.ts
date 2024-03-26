/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
    // console.log("saveFormResponse_server", dbData);
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

    const updateWithMondayData =
      await api.formResponse.updateWithMondayData.mutate({
        id: dbData.id,
        mondayItemId: MondayItemId,
        data: updatedFormData,
      });

    console.log("updateWithMondayData", updateWithMondayData);
  } catch (error) {
    console.log("Error saving to database", error);
    // Handle this error specifically, maybe return or throw a custom error
    throw new Error("Database save failed");
  }
}

export async function updateFormResponse(values: string) {
  console.log("updateFormResponse", values);
  const data = JSON.parse(values);
  const mondayItemId = data.MondayItemId;
  try {
    // Step 1: Change item status to checkin

    const result1 = await checkinOrder(mondayItemId);

    // Step 2: Change checkin quantity on subitems

    const result2 = await changeSubitemQuantity(data);

    // Step 3: update quantity field on Inventory board

    // Step 4: update database

    // const result3 = await updateInventoryItemQuantity();
  } catch (error) {}
}

export async function checkinOrder(id: string) {
  console.log("checkinOrder_init", id);
  try {
    const mutation = `mutation { change_simple_column_value (board_id: 6309440166, item_id: \"${id}\", column_id:\"status\", value: \"1\") { id }}`;
    const updateMondayOrder = await monday.api(mutation, options);
    console.log("updateMondayOrder", updateMondayOrder);
    return updateMondayOrder;
  } catch (error) {}
}

export async function changeSubitemQuantity(data: any) {
  const updatedItems = await Promise.all(
    data.items.map(async (item: any) => {
      const itemId = await updateSubitem(item); // Your function to create an item on Monday
      return { ...item }; // Append the itemId to the item
    }),
  );
}

export async function updateSubitem(data: any) {
  try {
    const { itemId, quantity } = data;
    console.log("updateSubitem_id", itemId);
    const mutation1 = `mutation { change_simple_column_value (board_id: 6314721404, item_id: \"${itemId}\", column_id:\"numbers2\", value: \"${quantity.checkin}\") { id }}`;
    const result1 = await monday.api(mutation1, options);

    const query1 = `query { items (ids: \"${itemId}\") { column_values (ids: [\"text\"]) { text }} }`;
    const result2 = await monday.api(query1, options);
    const sku = result2.data.items[0].column_values[0].text;

    const query2 = `query { items (ids: \"${sku}\") { column_values (ids: [\"numbers5\"]) { text }} }`;
    const query3 = `query { items (ids: \"${sku}\") { column_values (ids: [\"numbers\"]) { text }} }`;
    const query4 = `query { items (ids: \"${sku}\") { column_values (ids: [\"numbers6\"]) { text }} }`;

    const result5 = await monday.api(query4, options);
    const alterTriggerQuantity =
      result5.data.items[0].column_values[0].text || 0;

    const result3 = await monday.api(query2, options);
    const currentStock = result3.data.items[0].column_values[0].text;
    const result4 = await monday.api(query3, options);
    const currentCheckedOut = result4.data.items[0].column_values[0].text;

    const newQuantity = parseInt(currentStock, 10) + quantity.checkin;
    const newCheckOut = parseInt(currentCheckedOut, 10) - quantity.checkin;

    const newStockBeforeRestock =
      newQuantity - parseInt(alterTriggerQuantity, 10);
    console.log("newStockBeforeRestock", newStockBeforeRestock);
    const mutation2 = `mutation { change_multiple_column_values (board_id: 5798486455, item_id: \"${sku}\", column_values: \"{ \\\"numbers5\\\": \\\"${newQuantity}\\\", \\\"numbers\\\": \\\"${newCheckOut}\\\", \\\"numbers67\\\": \\\"${newStockBeforeRestock}\\\"}\") { id }}`;
    const result6 = await monday.api(mutation2, options);
    console.log("result6", result6);
    return result1;
  } catch (error) {
    console.log("error", error);
  }
}

export async function updateInventoryColumn(data: any) {
  try {
    const { itemId, quantity } = data;
    console.log("updateSubitem_id", itemId);
    const mutation = `mutation { change_simple_column_value (board_id: 6314721404, item_id: \"${itemId}\", column_id:\"numbers2\", value: \"${quantity.checkin}\") { id }}`;
    const result = await monday.api(mutation, options);
    console.log("updateSubitem_end", result);
    return result;
  } catch (error) {
    console.log("error", error);
  }
}

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

    // Insert the createMondayItemId into formData
    formData.MondayItemId = createMondayItemId;

    const updatedItems = await Promise.all(
      formData.items.map(async (item: any) => {
        const itemId = await createSubitem(
          item,
          createMondayItemResult.data.create_item.id,
        ); // Your function to create an item on Monday
        return { ...item, itemId }; // Append the itemId to the item
      }),
    );

    // Update the formData with the updated items
    const updatedFormData = { ...formData, items: updatedItems };

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

// export async function updateFormDataInDatabase(
//   databaseId: number,
//   updatedFormData: JsonObject,
// ) {}

export async function createSubitem(
  data: InventoryFormData["items"][number],
  newItemId: string,
) {
  try {
    const { name, id, quantity } = data;
    const mutation = `mutation { create_subitem (parent_item_id: ${newItemId}, item_name: \"${name}\", column_values: \"{ \\\"numbers\\\": \\\"${quantity.checkout}\\\",\\\"text\\\": \\\"${id}\\\" }\") { id board { id } } }`;
    const result = await monday.api(mutation, options);

    const query2 = `query { items (ids: \"${id}\") { column_values (ids: [\"numbers5\"]) { text }} }`;
    const query3 = `query { items (ids: \"${id}\") { column_values (ids: [\"numbers\"]) { text }} }`;
    const query4 = `query { items (ids: \"${id}\") { column_values (ids: [\"numbers6\"]) { text }} }`;

    const result3 = await monday.api(query2, options);
    const currentStock = result3.data.items[0].column_values[0].text;
    console.log("currentStock", currentStock);
    const result4 = await monday.api(query3, options);
    const currentCheckedOut = result4.data.items[0].column_values[0].text || 0;
    const result5 = await monday.api(query4, options);
    const alterTriggerQuantity =
      result5.data.items[0].column_values[0].text || 0;

    console.log("currentCheckedOut", currentCheckedOut);

    const alterTriggerQuantityNum = parseInt(alterTriggerQuantity, 10);

    const newQuantity = parseInt(currentStock, 10) - quantity.checkout;
    console.log("newQuantity", newQuantity);
    console.log("alterTriggerQuantityNum", alterTriggerQuantityNum);
    const newCheckOut = parseInt(currentCheckedOut, 10) + quantity.checkout;
    const newStockBeforeRestock =
      newQuantity - parseInt(alterTriggerQuantity, 10);
    console.log("newStockBeforeRestock", newStockBeforeRestock);

    const mutation2 = `mutation { change_multiple_column_values (board_id: 5798486455, item_id: \"${id}\", column_values: \"{ \\\"numbers5\\\": \\\"${newQuantity}\\\", \\\"numbers\\\": \\\"${newCheckOut}\\\", \\\"numbers67\\\": \\\"${newStockBeforeRestock}\\\"}\") { id }}`;
    const result6 = await monday.api(mutation2, options);
    console.log("result6", result6);

    return result.data.create_subitem.id;
  } catch (error) {
    console.log("error", error);
  }
}
