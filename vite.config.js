import { defineConfig } from 'vite'

export default defineConfig({
  base: '/0925/',
  plugins: [
    {
      name: 'replace-base-url',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          return html.replace(/%BASE_URL%/g, '/0925/');
        }
      }
    }
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api/cloud-functions': {
        target: 'https://europe-west3-igfap-452720.cloudfunctions.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cloud-functions/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
    target: 'es2018',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        manualChunks: (id) => {
          // Medical core chunk (critical for all modules)
          if (id.includes('src/state/store.js') ||
              id.includes('src/logic/validate.js') ||
              id.includes('src/patterns/observer.js') ||
              id.includes('src/performance/medical-performance-monitor.js')) {
            return 'medical-core';
          }

          // Prediction models chunk (ML/AI components)
          if (id.includes('src/logic/ich-volume-calculator.js') ||
              id.includes('src/logic/lvo-local-model.js') ||
              id.includes('src/logic/shap.js') ||
              id.includes('src/api/')) {
            return 'prediction-models';
          }

          // UI components chunk (visualization)
          if (id.includes('src/ui/components/brain-visualization.js') ||
              id.includes('src/ui/components/stroke-center-map.js') ||
              id.includes('src/ui/components/tachometer.js') ||
              id.includes('src/ui/components/probability-ring.js')) {
            return 'ui-components';
          }

          // Research tools chunk (research mode)
          if (id.includes('src/research/') ||
              id.includes('src/analytics/')) {
            return 'research-tools';
          }

          // Security and performance chunk
          if (id.includes('src/security/') ||
              id.includes('src/sync/') ||
              id.includes('src/workers/')) {
            return 'enterprise-features';
          }

          // Third-party vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }

          // Default main chunk for core app logic
          return 'main';
        },
      },
    },
    minify: 'esbuild', // Use esbuild for faster builds
    esbuild: {
      drop: ['console', 'debugger'], // Remove console.logs and debuggers in production
      legalComments: 'none',
    },
  },
  preview: {
    port: 3020,
    strictPort: true
  }
})
