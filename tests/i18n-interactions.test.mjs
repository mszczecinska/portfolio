import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
import { languageFromPath, languagePath, withoutLanguage } from '../src/i18n/routes.ts';
import { uiText } from '../src/i18n/ui.ts';

test('Language routes round-trip every page, without mistaking similar prefixes for English', () => {
  for (const path of ['/', '/about', '/work', '/work/obrys-studio']) {
    for (const ending of path === '/' ? [''] : ['', '/']) {
      const original = path + ending;
      const en = languagePath(original, 'en');
      assert.equal(languageFromPath(en), 'en');
      assert.equal(languagePath(en, 'pl'), withoutLanguage(original));
      assert.equal(languagePath(en, 'en'), en);
    }
  }
  assert.equal(languageFromPath('/en'), 'en');
  assert.equal(withoutLanguage('/en/'), '/');
  for (const path of ['/english', '/enough', '/work/en', '/en-US/about']) {
    assert.equal(languageFromPath(path), 'pl');
    assert.equal(withoutLanguage(path), path);
  }
});

test('Interactive messages read the current language after each page swap', () => {
  const saved = globalThis.document;
  try {
    globalThis.document = { documentElement: { lang: 'en' } };
    for (const [pl, en] of [
      ['Skopiuj adres e-mail', 'Copy email address'],
      ['Skopiowano adres', 'Email address copied'],
      ['Zaznacz i skopiuj adres e-mail.', 'Select and copy the email address.'],
      ['Podgląd obrazu', 'Image preview'],
      ['Wczytywanie obrazu…', 'Loading image…'],
      ['Nie udało się wczytać obrazu.', 'The image could not be loaded.'],
      ['Nie udało się pobrać filmu.', 'The video could not be downloaded.'],
      ['Przeglądarka nie mogła odczytać filmu.', 'The browser could not decode the video.'],
      ['Przeglądarka nie obsługuje dostępnych formatów filmu.', 'The browser does not support the available video formats.'],
      ['Nie udało się odtworzyć filmu.', 'The video could not be played.'],
      ['Karty koncepcji — przewijaj strzałkami', 'Concept cards — use the arrow keys to scroll'],
      ['Wybierz kartę', 'Choose a card'],
      ['Karta', 'Card'],
    ]) {
      document.documentElement.lang = 'en';
      assert.equal(uiText(pl), en);
      document.documentElement.lang = 'pl';
      assert.equal(uiText(pl), pl);
    }
  } finally {
    if (saved === undefined) delete globalThis.document;
    else globalThis.document = saved;
  }
});

const switchCode = stripTypeScriptTypes((await readFile(new URL('../src/scripts/language-switch.ts', import.meta.url), 'utf8')).replace(/^import .*;\n/, ''));
function switchPage() {
  const handlers = new Map();
  const location = { pathname: '/work', search: '', hash: '' };
  const link = { href: '' };
  class Element { closest() { return link; } }
  const document = {
    querySelectorAll: () => [link],
    addEventListener: (name, fn) => handlers.set(name, fn),
  };
  const window = { addEventListener: (name, fn) => handlers.set(name, fn) };
  runInNewContext(switchCode, { document, window, location, Element, languageFromPath, languagePath });
  return { handlers, location, link, Element };
}

for (const event of ['click', 'auxclick', 'contextmenu']) {
  test(`Language switch preserves a changed filter and anchor for ${event}`, () => {
    const { handlers, location, link, Element } = switchPage();
    assert.equal(link.href, '/en/work');
    location.search = '?category=experiments';
    location.hash = '#work-experiments';
    handlers.get(event)?.({ target: new Element() });
    assert.equal(link.href, '/en/work?category=experiments#work-experiments');
  });
}

test('Language switch refreshes its destination after navigation and browser history', () => {
  const { handlers, location, link } = switchPage();
  location.pathname = '/en/about';
  handlers.get('astro:page-load')();
  assert.equal(link.href, '/about');
  location.pathname = '/work';
  location.search = '?category=experiments';
  handlers.get('popstate')();
  assert.equal(link.href, '/en/work?category=experiments');
});
