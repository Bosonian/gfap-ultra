import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/0925/", // ✅ THIS must match your repo name, not "./"
  plugins: [tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api/cloud-functions": {
        target: "https://europe-west3-igfap-452720.cloudfunctions.net",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/cloud-functions/, ""),
        configure: proxy => {
          proxy.on("error", err => console.log("Proxy error:", err));
          proxy.on("proxyReq", (proxyReq, req) =>
            console.log("Sending Request to the Target:", req.method, req.url)
          );
          proxy.on("proxyRes", (proxyRes, req) =>
            console.log("Received Response from the Target:", proxyRes.statusCode, req.url)
          );
        },
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    target: "es2018",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
      },
    },
    minify: "esbuild",
    esbuild: {
      drop: ["console", "debugger"],
      legalComments: "none",
    },
  },
  preview: {
    port: 3020,
    strictPort: true,
  },
});
