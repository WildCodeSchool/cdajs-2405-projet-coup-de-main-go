import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        globals : true , 
        environment : "jsdom", 
        setupFiles : "./src/tests/setup.ts"
    },
    resolve: {
        alias: [
            { find: "@public", replacement: "/public" },
            { find: "@components", replacement: "/src/components" },
        ],
    },
});
