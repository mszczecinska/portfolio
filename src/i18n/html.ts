import { parse, serialize, type DefaultTreeAdapterMap } from 'parse5';
import english from './en.json';
import type { Language } from './routes';
import { keepPolishShortWords } from './typography';

const translations: Record<string, string> = english;
const textAttributes = new Set(['alt', 'title', 'placeholder', 'aria-label', 'aria-description', 'aria-roledescription', 'data-image-label']);
const nonProseElements = new Set(['head', 'pre', 'code', 'kbd', 'samp', 'textarea', 'svg', 'math']);

// Translate only complete text nodes and human-readable attributes. Never replace
// substrings in markup, scripts, CSS, asset URLs, IDs or component state.
export function translateText(value: string): string {
  const key = value.replace(/\s+/g, ' ').trim();
  const translated = translations[key];
  if (translated === undefined) return value;
  return value.replace(/\S(?:[\s\S]*\S)?/, () => translated);
}

export function localizeHtml(html: string, language: Language): string {
  const document = parse(html);
  const polish = language === 'pl';
  function visit(node: DefaultTreeAdapterMap['node']) {
    if (node.nodeName === '#text') {
      const text = node as DefaultTreeAdapterMap['textNode'];
      text.value = polish ? keepPolishShortWords(text.value) : translateText(text.value);
    }
    if ('tagName' in node) {
      if (['script', 'style'].includes(node.tagName)) return;
      if (polish) {
        if (nonProseElements.has(node.tagName)) return;
        const imageLabel = node.attrs.find(attr => attr.name === 'data-image-label');
        if (imageLabel) imageLabel.value = keepPolishShortWords(imageLabel.value);
      } else {
        const hasLocalisedContent = node.tagName === 'meta' && node.attrs.some(attr =>
          (attr.name === 'name' && attr.value === 'description')
          || (attr.name === 'property' && ['og:title', 'og:description', 'og:image:alt'].includes(attr.value)));
        for (const attr of node.attrs) {
          if (textAttributes.has(attr.name) || (hasLocalisedContent && attr.name === 'content')) attr.value = translateText(attr.value);
          if (attr.name === 'href' && attr.value.startsWith('mailto:')) {
            const url = new URL(attr.value);
            if (url.searchParams.has('subject')) url.searchParams.set('subject', 'Project enquiry');
            attr.value = url.href;
          }
        }
      }
    }
    if ('childNodes' in node) node.childNodes.forEach(visit);
  }
  visit(document);
  return serialize(document);
}
