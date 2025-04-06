import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url'; // Import fileURLToPath for resolving paths
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(fileURLToPath(import.meta.url), 'src'), // Resolve path using import.meta.url
    },
  },
});
