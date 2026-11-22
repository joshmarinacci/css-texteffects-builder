import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

const dir = import.meta.dirname

// The app is served from https://apps.josh.earth/texteffects/, so every asset URL needs that prefix.
export default defineConfig({
  base: '/texteffects/',
  plugins: [react()],
  resolve: {
    alias: {
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
