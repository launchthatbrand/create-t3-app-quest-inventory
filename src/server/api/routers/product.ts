import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { eq } from "drizzle-orm";
import { products } from "~/server/db/schema";
import { z } from "zod";

export const productRouter = createTRPCRouter({
  createProduct: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        quantity: z.number().int().min(0),
        price: z.number().min(0),
        category: z.string().optional(),
        image: z.string().url("Invalid URL").optional().or(z.literal("")),
        importance: z.enum(["low", "medium", "high"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(products).values(input);
    }),

  getProducts: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.products.findMany();
  }),

  getProductById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.products.findFirst({
        where: eq(products.id, input.id),
      });
    }),

  updateProduct: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        quantity: z.number().int().min(0).optional(),
        price: z.number().min(0).optional(),
        category: z.string().optional(),
        image: z.string().url("Invalid URL").optional().or(z.literal("")),
        importance: z.enum(["low", "medium", "high"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.update(products).set(data).where(eq(products.id, id));
    }),

  deleteProduct: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(products).where(eq(products.id, input.id));
    }),
});
