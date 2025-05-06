import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./server/test/setup.js'],
    testTimeout: 10000,
    hookTimeout: 10000,
    include: ['./test/server/**/*.test.js'],
    exclude: ['node_modules', 'dist', '.idea', '.git', 'cache'],
    deps: {
      inline: ['node:crypto']
    },
    server: {
      deps: {
        inline: ['node:crypto']
      }
    }
  }
}); 