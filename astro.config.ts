// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
import pruneUnusedImages from './scripts/prune-unused-images.mjs';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  compressHTML: true,
  redirects: {
    "/en/contact": "/en/#footer-contact",
    "/en/work/szczecinska-design-portfolio": "/en/work",
    "/work/szczecinska-design-portfolio": "/work",
    "/project/szczecinska-design-portfolio": "/work",
  },
  site: 'https://szczecinska.design',
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return !/^\/en\/(?:contact|work\/szczecinska-design-portfolio)\/?$/.test(path)
          && !path.startsWith("/project/")
          && !/^\/contact\/?$/.test(path)
          && !/^\/work\/szczecinska-design-portfolio\/?$/.test(path);
      },
    }),
    pruneUnusedImages(),
    robotsTxt(),
  ],
});
