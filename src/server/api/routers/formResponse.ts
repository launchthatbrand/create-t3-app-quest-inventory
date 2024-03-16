import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { formResponse } from "~/server/db/schema";
import { z } from "zod";

export const formResponseRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ data: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(formResponse).values({
        data: input.data,
      });
    }),
});
