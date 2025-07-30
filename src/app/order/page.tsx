"use client";

import React from "react";
import { type inferProcedureOutput } from "@trpc/server";
import { useRouter } from "next/navigation";

import { type AppRouter } from "~/server/api/root";
import { deleteOrder, duplicateOrder } from "./actions";

import { DefaultTable } from "../_components/Table";
import { toast } from "../_components/ui/use-toast";
import { api } from "~/trpc/react";
import { readUserSession } from "../(auth)/actions";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

export type orderType = inferProcedureOutput<
  AppRouter["formResponse"]["getOrders"]
>;

export default function OrderPage({}: Props) {
  const { data, isLoading } = api.formResponse.getOrders.useQuery();
  const utils = api.useUtils();
  const router = useRouter();
  console.log("data", data);

  // const [data, setData] = useState<orderType>([]);
  // const [loading, setLoading] = useState(true);

  async function handleDelete(id: number) {
    console.log(`Deleting item with id: ${id}`);
    // Implement your delete logic here
    const result = deleteOrder(id);
    console.log("handleDelete", result);

    toast({
      title: "Successfully Submitted:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          Successfully Deleted:
          <code className="text-white">{JSON.stringify(id, null, 2)}</code>
        </pre>
      ),
    });
  }

  async function handleDuplicate(id: number) {
    try {
      console.log(`Duplicating order with id: ${id}`);
      const result = await duplicateOrder(id);
      console.log("Duplicate order result:", result);

      if (result.success && result.data) {
        console.log("Storing duplicate data in session storage:", result.data);
        // Store the duplicate data in session storage on the client side
        sessionStorage.setItem(
          "duplicateOrderData",
          JSON.stringify(result.data),
        );

        // Verify it was stored
        const storedData = sessionStorage.getItem("duplicateOrderData");
        console.log(
          "Verified stored data:",
          storedData ? "present" : "missing",
        );

        // Redirect to checkout page
        router.push("/order/checkout?mode=duplicate");

        toast({
          title: "Order Ready for Duplication:",
          description: "Redirecting to checkout page with pre-filled data...",
        });
      } else {
        console.error("Duplicate order failed or no data returned:", result);
        throw new Error("No data returned from duplicate order");
      }
    } catch (error) {
      console.error("handleDuplicate error:", error);
      toast({
        title: "Error:",
        description: "Failed to prepare duplicate order. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (data)
    return (
      <div className="container flex flex-1 flex-col">
        <DefaultTable
          data={data}
          handleDelete={handleDelete}
          handleDuplicate={handleDuplicate}
        />
      </div>
    );
}
