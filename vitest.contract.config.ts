import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Contract tests call the live NHTSA, EPA and ZIP services. They are slow and
// need the network, so they run on their own: npm run test:contract
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["tests/contract/**/*.test.ts"],
    testTimeout: 60_000,
  },
});
