import { defineConfig } from 'vite'

export default defineConfig({
  base: '/0825/',
  plugins: [
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
    port: 5173
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
