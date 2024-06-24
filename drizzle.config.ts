import type { Config } from "drizzle-kit";
export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "turso",
} satisfies Config;
