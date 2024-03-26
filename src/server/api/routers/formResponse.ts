import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { InventoryFormData } from "~/app/_components/DefaultForm";
import { eq } from "drizzle-orm";
import { formResponses } from "~/server/db/schema";
import { z } from "zod";

export const formResponseRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ data: z.string().min(1), createdById: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [newRecord] = await ctx.db
        .insert(formResponses)
        .values({
          data: input.data,
          createdById: input.createdById,
          status: "checkout"
        })
        .returning();

      return newRecord;
    }),
  updateWithMondayData: publicProcedure
    .input(
      z.object({
        id: z.number(),
        mondayItemId: z.string().optional(),
        data: z.string().optional(),
        status: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newRecord] = await ctx.db
        .update(formResponses)
        .set({
          mondayItemId: input.mondayItemId,
          data: input.data,
          status: input.status,
        })
        .where(eq(formResponses.id, input.id))
        .returning();

      return newRecord;
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
  getOrdersByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.formResponses.findMany({
        where:
          eq(formResponses.createdById, input.userId) &&
          eq(formResponses.status, "checkout"),
      });
    }),
  deleteResponse: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(formResponses).where(eq(formResponses.id, input.id));
    }),
});
