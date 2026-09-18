import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // "server-only" throws outside a React Server environment; stub it for unit tests.
      "server-only": path.resolve(__dirname, "src/test/server-only-stub.ts"),
    },
  },
});
