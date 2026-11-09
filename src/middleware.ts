import { defineMiddleware } from 'astro:middleware';
import { languageFromPath } from './i18n/routes';
import { localizeHtml } from './i18n/html';

// Translate English HTML and apply Polish typography during the static build.
export const onRequest = defineMiddleware(async ({ url }, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(localizeHtml(await response.text(), languageFromPath(url.pathname)), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
