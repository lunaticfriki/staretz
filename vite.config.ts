/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss()],
  test: {
    globals: true,
  },
})
