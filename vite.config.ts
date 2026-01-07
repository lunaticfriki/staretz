/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact({
      babel: {
        presets: [['@babel/preset-typescript', { allowDeclareFields: true }]],
        plugins: [
          ['babel-plugin-transform-typescript-metadata'],
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
        ],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@blog': '/src/modules/blog',
    },
  },
  test: {
    globals: true,
  },
});
