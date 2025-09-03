import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/0825/',
  plugins: [
    react(),
    {
      name: 'replace-base-url',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          return html.replace(/%BASE_URL%/g, '/0825/');
        }
      }
    }
  ],
  server: {
    host: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  preview: {
    port: 3001
  }
})
