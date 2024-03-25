import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
      });
    }),
});
