import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // 👇 Base path: "/gfap-ultra/" for project page, "/" for root domain
  base: "/gfap-ultra/",
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
    sourcemap: false,
    assetsDir: "assets",
  },
});
