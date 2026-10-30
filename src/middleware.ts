import { defineMiddleware } from 'astro:middleware';
import { languageFromPath } from './i18n/routes';
import { translateHtml } from './i18n/html';

// With Astro's static output this runs during the build: English pages ship as
// translated HTML, with no translation dictionary or HTML parser in the browser.
export const onRequest = defineMiddleware(async ({ url }, next) => {
  const response = await next();
  if (languageFromPath(url.pathname) !== 'en' || !response.headers.get('content-type')?.includes('text/html')) return response;
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(translateHtml(await response.text()), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
