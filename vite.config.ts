import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

const dir = import.meta.dirname

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'josh_react_util': path.resolve(dir, 'node_modules/josh_react_util/lib/esm/index.js'),
      'josh_web_util': path.resolve(dir, 'node_modules/josh_web_util/dist/index.js'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
})
