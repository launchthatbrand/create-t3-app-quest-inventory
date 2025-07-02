import { createTRPCRouter } from "~/server/api/trpc";
import { formResponseRouter } from "./routers/formResponse";
import { postRouter } from "~/server/api/routers/post";
import { productRouter } from "./routers/product";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  formResponse: formResponseRouter,
  user: userRouter,
  product: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
