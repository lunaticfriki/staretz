// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { rehypeImageCaption } from "./src/core/infrastructure/markdown/rehype-image-caption.ts";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [rehypeImageCaption],
  },
});
