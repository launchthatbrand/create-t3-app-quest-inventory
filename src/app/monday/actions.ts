"use server";
import { type APIOptions } from "monday-sdk-js/types/client-api.interface";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();
monday.setApiVersion("2023-10");

export interface Workspace {
  name?: string;
  id?: number;
  description?: string;
}

interface MondayWorkspacesApiResponse {
  data: {
    workspaces: Workspace[];
    account_id: number;
  };
}

const options: APIOptions = {
  token: process.env.MONDAY_TOKEN,
};

export async function fetchAllWorkspaces() {
  "use server";
  try {
    const query = "{ workspaces (limit:100) {name id description} }";
    const result = (await monday.api(
      query,
      options,
    )) as MondayWorkspacesApiResponse;
    console.log("result", result);
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
