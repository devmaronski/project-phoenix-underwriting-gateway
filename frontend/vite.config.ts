import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import tailwindPostcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    postcss: {
      plugins: [tailwindPostcss(), autoprefixer()]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
