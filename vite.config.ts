import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (asset) => {
          if (asset.originalFileNames.some((name) => name.includes("pdfjs-dist/wasm/"))) {
            return "assets/pdfjs/[name][extname]"
          }
          return asset.names.some((name) => name.endsWith(".pdf"))
            ? "assets/[name][extname]"
            : "assets/[name]-[hash][extname]"
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
