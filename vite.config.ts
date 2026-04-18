/// <reference types="vitest" />
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      reportsDirectory: './coverage',
      include: [
        'src/pages/**/*.tsx',
        'src/components/auth/**/*.tsx',
        'src/features/ivr-architectures/IVRArchitecturesPage.tsx',
        'src/features/test-cases/TestCasesPage.tsx',
        'src/features/executions/ExecutionsPage.tsx',
        'src/features/executions/NewExecutionTab.tsx',
        'src/features/executions/ExecutionHistoryTab.tsx',
        'src/features/executions/pages/ExecutionDetailsPage.tsx',
        'src/features/metrics/MetricsPage.tsx',
      ],
      exclude: [
        'node_modules/**',
        'src/test/**',
        '**/*.d.ts',
        'src/components/ui/**',
        'src/hooks/**',
        'src/lib/http/**',
        'src/**/types.ts',
        'src/features/**/api.ts',
        'src/features/**/hooks.ts',
        'src/features/**/schemas.ts',
        'src/features/**/columns.tsx',
        'src/main.tsx',
        'src/App.tsx',
        'src/index.css',
        'src/App.css',
      ],
      thresholds: {
        lines: 85,
      },
    },
  },
})
