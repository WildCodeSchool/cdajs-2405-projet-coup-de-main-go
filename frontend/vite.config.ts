import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.ts",
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
    },
    exclude: ["**/e2e/**"],
  },
  resolve: {
    alias: [
      { find: "@public", replacement: "/public" },
      { find: "@components", replacement: "/src/components" },
    ],
  },
});
