// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  compressHTML: false,
  site: 'https://szczecinska.design',
  integrations: [
    sitemap(),
    robotsTxt(),
  ],
});
