/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";

import { type APIOptions } from "monday-sdk-js/types/client-api.interface";
import mondaySdk from "monday-sdk-js";
import { InventoryFormData } from "~/app/_components/DefaultForm";
import supabaseServer from "~/lib/supabase/server";
import { gql } from "@apollo/client";
import createApolloClient from "~/lib/apollo-client";

const client = createApolloClient();

const monday = mondaySdk();
monday.setApiVersion("2023-10");

const options: APIOptions = {
  token: process.env.MONDAY_TOKEN,
};

export async function readUserSession() {
  const supabase = await supabaseServer();
  return supabase.auth.getSession();
}

export async function fetchCategories2() {
  const result = await client.query({
    query: gql`
      query {
        boards(ids: 5798486455) {
          groups {
            title
            id
          }
        }
      }
    `,
  });
  const categories = result.data.boards[0];
  console.log("fetchCategories2", categories);
}
