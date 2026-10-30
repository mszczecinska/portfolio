import { parse, serialize, type DefaultTreeAdapterMap } from 'parse5';
import english from './en.json';
import { languagePath } from './routes';

const translations: Record<string, string> = english;
const textAttributes = new Set(['alt', 'title', 'placeholder', 'aria-label', 'aria-description', 'aria-roledescription', 'data-image-label']);

// Translate only complete text nodes and human-readable attributes. Never replace
// substrings in markup, scripts, CSS, asset URLs, IDs or component state.
export function translateText(value: string): string {
  const key = value.replace(/\s+/g, ' ').trim();
  const translated = translations[key];
  if (translated === undefined) return value;
  return value.replace(/\S(?:[\s\S]*\S)?/, () => translated);
}

export function translateHtml(html: string): string {
  const document = parse(html);
  function visit(node: DefaultTreeAdapterMap['node']) {
    if (node.nodeName === '#text') {
      const text = node as DefaultTreeAdapterMap['textNode'];
      text.value = translateText(text.value);
    }
    if ('tagName' in node) {
      if (['script', 'style'].includes(node.tagName)) return;
      const isSwitch = node.attrs.some(attr => attr.name === 'data-language-switch');
      const isDescription = node.tagName === 'meta' && node.attrs.some(attr => attr.name === 'name' && attr.value === 'description');
      for (const attr of node.attrs) {
        if (textAttributes.has(attr.name) || (isDescription && attr.name === 'content')) attr.value = translateText(attr.value);
        if (node.tagName === 'a' && attr.name === 'href' && !isSwitch && /^\/(?:$|#|work(?:[/?#]|$)|about(?:[/?#]|$)|contact(?:[/?#]|$))/.test(attr.value)) {
          const url = new URL(attr.value, 'https://szczecinska.design');
          attr.value = languagePath(url.pathname, 'en') + url.search + url.hash;
        }
        if (attr.name === 'href' && attr.value.startsWith('mailto:')) {
          const url = new URL(attr.value);
          if (url.searchParams.has('subject')) url.searchParams.set('subject', 'Project enquiry');
          attr.value = url.href;
        }
      }
    }
    if ('childNodes' in node) node.childNodes.forEach(visit);
  }
  visit(document);
  return serialize(document);
}
