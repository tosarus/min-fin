import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist/build',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3010',
    },
  },
});
