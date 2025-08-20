import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  preview: {
    port: 3001
  }
})