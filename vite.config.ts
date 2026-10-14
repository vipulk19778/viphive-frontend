import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/")
          ) {
            return "react";
          }
          if (id.includes("node_modules/@tanstack/react-router/")) {
            return "router";
          }
          if (
            id.includes("node_modules/@tanstack/react-query/") ||
            id.includes("node_modules/axios/") ||
            id.includes("node_modules/zustand/")
          ) {
            return "data";
          }
          if (
            id.includes("node_modules/@hookform/") ||
            id.includes("node_modules/react-hook-form/") ||
            id.includes("node_modules/zod/")
          ) {
            return "forms";
          }
          if (id.includes("node_modules/lucide-react/")) return "icons";
          if (id.includes("node_modules/swiper/")) return "swiper";
          return undefined;
        },
      },
    },
  },
});
