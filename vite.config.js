import { defineConfig } from 'vite';

export default defineConfig({
  base: '/0925/',
  plugins: [
    {
      name: 'replace-base-url',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          return html.replace(/%BASE_URL%/g, '/0925/');
        },
      },
    },
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api/cloud-functions': {
        target: 'https://europe-west3-igfap-452720.cloudfunctions.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/cloud-functions/, ''),
        configure: proxy => {
          proxy.on('error', err => console.log('Proxy error:', err));
          proxy.on('proxyReq', (proxyReq, req) =>
            console.log('Sending Request to the Target:', req.method, req.url)
          );
          proxy.on('proxyRes', (proxyRes, req) =>
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url)
          );
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
  },
  preview: {
    port: 3020,
    strictPort: true,
  },
});
