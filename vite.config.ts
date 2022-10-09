// vite.config.js
/// <reference types="histoire" />

import { defineConfig } from 'vite'

export default defineConfig((env) => {
  return {
    build: {
      lib: {
        entry: 'src/code-tex.ts',
        name: 'code-tex',
      },
    },
    test: {
      environment: 'happy-dom',
    },
  }
})
