import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, access } from 'node:fs/promises';
import { parse } from 'parse5';

const dictionary = JSON.parse(await readFile(new URL('../src/i18n/en.json', import.meta.url), 'utf8'));
const dist = new URL('../dist/', import.meta.url);
const normalise = value => value.replace(/\s+/g, ' ').trim();
function inspect(html) {
  const nodes = [];
  const texts = [];
  function visit(node) {
    if (['script', 'style'].includes(node.tagName)) return;
    if (node.tagName) nodes.push(node);
    if (node.nodeName === '#text' && normalise(node.value)) texts.push(normalise(node.value));
    for (const attr of node.attrs ?? []) {
      if (['alt', 'aria-label', 'aria-roledescription', 'title', 'data-image-label'].includes(attr.name)) texts.push(normalise(attr.value));
      if (node.tagName === 'meta' && attr.name === 'content' && node.attrs.some(a => a.name === 'name' && a.value === 'description')) texts.push(normalise(attr.value));
    }
    node.childNodes?.forEach(visit);
  }
  visit(parse(html));
  return { nodes, texts };
}
const attr = (node, name) => node.attrs.find(a => a.name === name)?.value;
async function pages(directory, prefix = '') {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) result.push(...await pages(new URL(`${entry.name}/`, directory), `${prefix}${entry.name}/`));
    else if (entry.name === 'index.html') result.push(`${prefix}index.html`);
  }
  return result;
}
const englishPages = (await pages(new URL('en/', dist))).filter(path => !path.startsWith('contact/') && !path.startsWith('work/szczecinska-design-portfolio/'));

test('All ten public pages have a complete English equivalent', async () => {
  assert.equal(englishPages.length, 10);
  for (const path of englishPages) {
    const pl = inspect(await readFile(new URL(path, dist), 'utf8'));
    const en = inspect(await readFile(new URL(`en/${path}`, dist), 'utf8'));
    const translated = new Set(en.texts);
    for (const source of pl.texts) {
      if (dictionary[source]) assert.ok(translated.has(dictionary[source]), `${path}: Missing translation of ${source}`);
    }
    const untranslated = en.texts.filter(text => /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(text.replace(/(?:Magdalena|Magda)?\s*Szczecińska/g, '')));
    assert.deepEqual(untranslated, [], `${path}: Polish copy in English HTML`);
    assert.equal(attr(en.nodes.find(n => n.tagName === 'html'), 'lang'), 'en');
    assert.equal(attr(pl.nodes.find(n => n.tagName === 'html'), 'lang'), 'pl');
  }
});

test('English navigation stays in English and every local destination exists', async () => {
  for (const path of englishPages) {
    const { nodes } = inspect(await readFile(new URL(`en/${path}`, dist), 'utf8'));
    for (const node of nodes.filter(n => n.tagName === 'a')) {
      const href = attr(node, 'href');
      if (!href?.startsWith('/') || href.startsWith('//')) continue;
      if (node.attrs.some(a => a.name === 'data-language-switch')) {
        assert.ok(!href.startsWith('/en'), `${path}: Switch must return to Polish`);
        continue;
      }
      if (/^\/(?:work|about|contact)(?:[/?#]|$)/.test(href) || /^\/(?:#|$)/.test(href)) assert.fail(`${path}: Language lost at ${href}`);
      if (href.startsWith('/en')) {
        const target = new URL(href, 'https://szczecinska.design').pathname.replace(/\/$/, '');
        await access(new URL(`${target.slice(1)}/index.html`, dist));
      }
    }
  }
});

test('Canonical and alternate language URLs identify the corresponding pages', async () => {
  for (const path of englishPages) {
    const suffix = path === 'index.html' ? '' : path.replace('/index.html', '');
    for (const language of ['pl', 'en']) {
      const { nodes } = inspect(await readFile(new URL(`${language === 'en' ? 'en/' : ''}${path}`, dist), 'utf8'));
      const links = nodes.filter(n => n.tagName === 'link');
      const expectedPl = `https://szczecinska.design/${suffix}`;
      const expectedEn = `https://szczecinska.design/en/${suffix}`.replace(/\/$/, suffix ? '' : '/');
      assert.equal(attr(links.find(n => attr(n, 'rel') === 'canonical'), 'href'), language === 'pl' ? expectedPl : expectedEn);
      for (const [lang, url] of [['pl', expectedPl], ['en', expectedEn], ['x-default', expectedPl]]) {
        assert.equal(attr(links.find(n => attr(n, 'hreflang') === lang), 'href'), url);
      }
    }
  }
});
