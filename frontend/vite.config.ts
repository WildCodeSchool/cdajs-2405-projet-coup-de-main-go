import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: "@public", replacement: "/public" },
            { find: "@components", replacement: "/src/components" },
        ],
    },
});
