import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    // Each test builds a database from every migration and the seed.
    testTimeout: 60_000,
  },
});
