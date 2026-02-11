import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/',
        'src/mocks/',
        'src/main.tsx',
        'src/App.tsx',
        'src/vite-env.d.ts',
        'src/types/',
        'src/lib/',
        'src/utils/format.ts'
      ],
      thresholds: {
        lines: 60,
        functions: 45,
        branches: 70,
        statements: 60
      }
    }
  }
});
