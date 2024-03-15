import { type inferProcedureOutput } from "@trpc/server";
import React from "react";
import { type AppRouter } from "~/server/api/root";

function SinglePostComponent(
  props?: inferProcedureOutput<AppRouter["post"]["getAll"]>[number],
) {
  return (
    <div className="rounded-md bg-white bg-opacity-10 p-3 shadow-md">
      <p>{props?.name}</p>
      <p>{props?.id}</p>
    </div>
  );
}

export default SinglePostComponent;
