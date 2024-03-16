import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { eq } from "drizzle-orm";
import { formResponses } from "~/server/db/schema";
import { z } from "zod";

export const formResponseRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ data: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(formResponses).values({
        data: input.data,
      });
    }),
  getFormResponseById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.formResponses.findFirst({
        where: eq(formResponses.id, input.id),
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.formResponses.findMany({
      orderBy: (formResponses, { desc }) => [desc(formResponses.createdAt)],
    });
  }),
});
