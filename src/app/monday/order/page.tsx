"use client";

import React, { useEffect, useState } from "react";
import { type inferProcedureOutput } from "@trpc/server";

import { type AppRouter } from "~/server/api/root";
import { getOrders } from "./actions";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

type orderType = inferProcedureOutput<AppRouter["formResponse"]["getAll"]>;

export default function OrderPage({}: Props) {
  const router = useRouter();
  const [data, setData] = useState<orderType>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      const allFormResponses = await getOrders();
      console.log("allFormResponses", allFormResponses);
      setData(allFormResponses);
      setLoading(false);
    }

    void getData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-3">
      {data?.map((response, index) => {
        return (
          <div
            key={index}
            className="flex cursor-pointer flex-col rounded-md bg-slate-200 p-3 text-black"
            onClick={() => router.push(`/monday/order/${response.id}`)}
          >
            <span>{response.id}</span>
            <span>{response.data}</span>
          </div>
        );
      })}
    </div>
  );
}
