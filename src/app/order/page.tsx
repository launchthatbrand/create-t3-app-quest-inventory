"use client";

import React from "react";
import { type inferProcedureOutput } from "@trpc/server";

import { type AppRouter } from "~/server/api/root";
import { deleteOrder } from "./actions";

import { DefaultTable } from "../_components/Table";
import { toast } from "../_components/ui/use-toast";
import { api } from "~/trpc/react";
import { readUserSession } from "../(auth)/actions";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

export type orderType = inferProcedureOutput<
  AppRouter["formResponse"]["getAll"]
>;

export default function OrderPage({}: Props) {
  const { data, isLoading } = api.formResponse.getOrdersByUserId.useQuery({
    userId: "72c73f99-1ba1-4aeb-8769-8bb3b159132d",
  });
  console.log("data", data);

  // const [data, setData] = useState<orderType>([]);
  // const [loading, setLoading] = useState(true);

  async function handleDelete(id: number) {
    console.log(`Deleting item with id: ${id}`);
    // Implement your delete logic here
    const result = deleteOrder(id);
    console.log("handleDelete", result);

    toast({
      title: "Sucessfully Submitted:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          Sucessfully Deleted:
          <code className="text-white">{JSON.stringify(id, null, 2)}</code>
        </pre>
      ),
    });
  }

  if (isLoading) return <div>Loading...</div>;
  if (data)
    return (
      <div className="container flex flex-col items-center justify-center py-40">
        <DefaultTable data={data} handleDelete={handleDelete} />
      </div>
    );
}
