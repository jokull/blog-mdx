import { fileURLToPath } from "node:url";
import type { UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default {
  plugins: [
    tsconfigPaths({
      root: fileURLToPath(new URL(".", import.meta.url)),
    }),
  ],
} satisfies UserConfig;
