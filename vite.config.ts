import { defineConfig } from 'vite';

export default defineConfig({
  base: '/boids-2.0/',
  server: {
    port: 3000,
    open: true, // Opens browser automatically on npm run dev
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // Helpful for debugging
  },
});
