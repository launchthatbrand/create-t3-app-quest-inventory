import * as schema from "./schema";

import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "~/env.js";
import postgres from "postgres";

export const db = drizzle(postgres(env.DATABASE_URL), { schema });
