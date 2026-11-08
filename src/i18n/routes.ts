export type Language = 'pl' | 'en';

export const aboutPath = '/o-mnie';
export const workPath = '/realizacje';
export const experimentsPath = '/eksperymenty';

export function languageFromPath(pathname: string): Language {
  return /^\/en(?:\/|$)/.test(pathname) ? 'en' : 'pl';
}

export function withoutLanguage(pathname: string): string {
  return pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '') || '/';
}

export function languagePath(pathname: string, language: Language): string {
  const path = withoutLanguage(pathname);
  if (path === aboutPath || path === '/about') return language === 'en' ? '/en/about' : aboutPath;
  if (path === workPath || path === '/work') return language === 'en' ? '/en/work' : workPath;
  if (path === experimentsPath || path === '/experiments') return language === 'en' ? '/en/experiments' : experimentsPath;
  return language === 'en' ? `/en${path}` : path;
}
