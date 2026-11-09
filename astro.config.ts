// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
import pruneUnusedImages from './scripts/prune-unused-images.mjs';
import { redirects } from './vercel.json';
import { languageFromPath, languagePath } from './src/i18n/routes';

const legacyPaths = new Set(redirects.filter(rule => !rule.has).map(({ source }) => source));

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  compressHTML: true,
  site: 'https://szczecinska.design',
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '');
        return path !== '/contact' && !legacyPaths.has(path);
      },
      serialize: (item) => {
        const url = new URL(item.url);
        url.pathname = languagePath(url.pathname, languageFromPath(url.pathname));
        return { ...item, url: url.href };
      },
    }),
    pruneUnusedImages(),
    robotsTxt({
      policy: [
        { userAgent: "GPTBot", disallow: "/" },
        { userAgent: "OAI-SearchBot", allow: "/" },
        { userAgent: "ChatGPT-User", allow: "/" },
        { userAgent: "*", allow: "/" },
      ],
    }),
  ],
});
