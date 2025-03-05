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
    exclude: ["**/e2e/**", "node_modules"],
  },
  resolve: {
    alias: [
      { find: "@public", replacement: "/public" },
      { find: "@components", replacement: "/src/components" },
    ],
  },
  server: {
    allowedHosts: ['frontend', 'backend', 'localhost', '0.0.0.0'],
    proxy: {
      '/hooks': {
        target: 'https://ops.quest-demo.wns.wilders.dev',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/hooks/, ''),
      },
    },
  }
});
