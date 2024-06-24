import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { getEnv } from "waku/server";
import { z } from "zod";
import * as schema from "./schema";

const env = z
  .object({
    DATABASE_URL: z.string().min(1),
    DATABASE_AUTH_TOKEN: z.string().min(1),
  })
  .parse({
    DATABASE_URL: getEnv("DATABASE_URL") ?? process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN:
      getEnv("DATABASE_AUTH_TOKEN") ?? process.env.DATABASE_AUTH_TOKEN,
  });

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
