export type Language = 'pl' | 'en';

export function languageFromPath(pathname: string): Language {
  return /^\/en(?:\/|$)/.test(pathname) ? 'en' : 'pl';
}

export function withoutLanguage(pathname: string): string {
  return pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '') || '/';
}

export function languagePath(pathname: string, language: Language): string {
  const path = withoutLanguage(pathname);
  return language === 'en' ? (path === '/' ? '/en/' : `/en${path}`) : path;
}
