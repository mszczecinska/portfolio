import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
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
    if (node.nodeName === '#text' && normalise(node.value) && !node.parentNode?.attrs?.some(a => a.name === 'data-language-switch')) texts.push(normalise(node.value));
    for (const attr of node.attrs ?? []) {
      if (['alt', 'aria-label', 'aria-description', 'aria-roledescription', 'title', 'placeholder', 'data-image-label'].includes(attr.name)) texts.push(normalise(attr.value));
      if (node.tagName === 'meta' && attr.name === 'content' && node.attrs.some(a => a.name === 'name' && a.value === 'description')) texts.push(normalise(attr.value));
    }
    node.childNodes?.forEach(visit);
  }
  visit(parse(html));
  return { nodes, texts };
}
const attr = (node, name) => node.attrs.find(a => a.name === name)?.value;
const site = 'https://szczecinska.design';
const redirects = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8')).redirects;
const pagePairs = [
  ['/', '/en/'],
  ['/o-mnie', '/en/about'],
  ['/realizacje', '/en/work'],
  ['/eksperymenty', '/en/experiments'],
  ...['akademia', 'aurapura', 'insightx', 'miropoix', 'mova', 'obrys', 'readyset']
    .map(slug => [`/${slug}`, `/en/${slug}`]),
];
const pageFile = path => new URL(`.${path.replace(/\/$/, '')}/index.html`, dist);
const readPage = path => readFile(pageFile(path), 'utf8');

test('Polish pages keep short words together in rendered copy', async () => {
  const polish = await readPage('/');
  const english = await readPage('/en/');
  assert.match(polish, /użytkowników z(?:&nbsp;|\u00a0)dopracowanym UI/);
  assert.match(polish, /O(?:&nbsp;|\u00a0)mnie/);
  assert.match(english, /I design websites and apps/);
});

test('All public pages have a complete English equivalent', async () => {
  for (const [path, englishPath] of pagePairs) {
    const pl = inspect(await readPage(path));
    const en = inspect(await readPage(englishPath));
    assert.deepEqual(en.texts, pl.texts.map(source => dictionary[source] ?? source), `${path}: Every text and accessible label must match its counterpart`);
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

test('Internal links use canonical paths in the current language', async () => {
  for (const index of [0, 1]) {
    const paths = new Set(pagePairs.map(pair => pair[index]));
    for (const path of paths) {
      const { nodes } = inspect(await readPage(path));
      for (const node of nodes.filter(n => n.tagName === 'a' && attr(n, 'data-language-switch') === undefined)) {
        const href = attr(node, 'href');
        if (!href?.startsWith('/') || href.startsWith('//')) continue;
        const target = new URL(href, site);
        if (target.pathname.startsWith('/_astro/') || target.pathname.startsWith('/assets/')) {
          await access(new URL('.' + target.pathname, dist));
        } else {
          assert.ok(paths.has(target.pathname), `${path}: ${href}`);
          assert.equal(target.searchParams.has('category'), false, href);
        }
      }
    }
  }
});

test('Canonical and alternate language URLs identify the corresponding pages', async () => {
  for (const [plPath, enPath] of pagePairs) {
    const expectedPl = site + plPath;
    const expectedEn = site + enPath;
    for (const [path, canonical] of [[plPath, expectedPl], [enPath, expectedEn]]) {
      const { nodes } = inspect(await readPage(path));
      const links = nodes.filter(n => n.tagName === 'link');
      assert.equal(attr(links.find(n => attr(n, 'rel') === 'canonical'), 'href'), canonical);
      for (const [lang, url] of [['pl', expectedPl], ['en', expectedEn], ['x-default', expectedPl]]) {
        assert.equal(attr(links.find(n => attr(n, 'hreflang') === lang), 'href'), url);
      }
    }
  }
});

test('Social previews use the localised metadata and an existing image', async () => {
  for (const [plPath, enPath] of pagePairs) {
    let polishImage;
    for (const [path, language] of [[plPath, 'pl'], [enPath, 'en']]) {
      const { nodes } = inspect(await readPage(path));
      const meta = nodes.filter(n => n.tagName === 'meta');
      const og = name => attr(meta.find(n => attr(n, 'property') === `og:${name}`), 'content');
      const canonical = nodes.find(n => n.tagName === 'link' && attr(n, 'rel') === 'canonical');
      const title = nodes.find(n => n.tagName === 'title').childNodes[0].value;
      assert.equal(og('title'), title, path);
      assert.equal(og('description'), attr(meta.find(n => attr(n, 'name') === 'description'), 'content'), path);
      assert.equal(og('url'), attr(canonical, 'href'), path);
      assert.equal(og('locale'), language === 'en' ? 'en_GB' : 'pl_PL', path);
      assert.equal(og('image:width'), '1200', path);
      assert.equal(og('image:height'), '630', path);
      assert.ok(og('image:alt'), path);
      const image = new URL(og('image'));
      assert.equal(image.origin, new URL(og('url')).origin, path);
      await access(new URL(image.pathname.slice(1), dist));
      if (language === 'pl') polishImage = image.href;
      else assert.equal(image.href, polishImage, path);
    }
  }
});

test('Both language switches point to the exact same page in the other language', async () => {
  for (const [plPath, enPath] of pagePairs) {
    for (const [path, target, targetLanguage] of [[plPath, enPath, 'en'], [enPath, plPath, 'pl']]) {
      const { nodes } = inspect(await readPage(path));
      const switches = nodes.filter(n => n.attrs.some(a => a.name === 'data-language-switch'));
      assert.equal(switches.length, 1);
      assert.equal(attr(switches[0], 'href'), target);
      assert.equal(attr(switches[0], 'hreflang'), targetLanguage);
      const visibleLabel = normalise(switches[0].childNodes[0].value);
      assert.equal(visibleLabel, targetLanguage.toUpperCase());
      assert.ok(attr(switches[0], 'aria-label').startsWith(visibleLabel + ' '), path);
    }
  }
});

test('Translation preserves images, videos, scripts, IDs and external links', async () => {
  const resources = nodes => nodes.flatMap(node => node.attrs
    .filter(a => ['src', 'srcset', 'poster', 'id', 'aria-controls', 'aria-labelledby', 'aria-describedby'].includes(a.name)
      || (node.tagName === 'a' && a.name === 'href' && /^(?:https?:\/\/|\/\/)/.test(a.value)))
    .map(a => `${node.tagName}:${a.name}:${a.value}`));
  for (const [path, englishPath] of pagePairs) {
    const pl = inspect(await readPage(path));
    const en = inspect(await readPage(englishPath));
    assert.deepEqual(resources(en.nodes), resources(pl.nodes), path);
    const scripts = html => [...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(match => match[0]);
    assert.deepEqual(scripts(await readPage(englishPath)), scripts(await readPage(path)), path);
  }
});

test('Email links have an English subject and keep the same recipient', async () => {
  for (const [, englishPath] of pagePairs) {
    const { nodes } = inspect(await readPage(englishPath));
    const mailLinks = nodes.filter(n => attr(n, 'href')?.startsWith('mailto:'));
    assert.ok(mailLinks.length > 0);
    for (const link of mailLinks) {
      const url = new URL(attr(link, 'href'));
      assert.equal(url.pathname, 'mszczecinska01@gmail.com');
      assert.equal(url.searchParams.get('subject'), 'Project enquiry');
    }
  }
});

test('Sitemap lists only the canonical public URLs', async () => {
  const sitemap = await readFile(new URL('sitemap-0.xml', dist), 'utf8');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(locations.sort(), pagePairs.flat().map(path => site + path).sort());
});

test('Legacy paths have a permanent Vercel rule and a static fallback', async () => {
  const publicPaths = new Set(pagePairs.flat());
  for (const { source, destination, permanent, has } of redirects) {
    const target = new URL(destination, site);
    assert.ok(publicPaths.has(target.pathname), destination);
    assert.equal(permanent, true, source);
    if (has) {
      assert.deepEqual(has, [{ type: 'query', key: 'category', value: 'experiments' }]);
      assert.equal(target.pathname, source.startsWith('/en/') ? '/en/experiments' : '/eksperymenty');
      continue;
    }
    assert.ok(!publicPaths.has(source), source);
    const { nodes } = inspect(await readPage(source));
    const refresh = nodes.find(n => n.tagName === 'meta' && attr(n, 'http-equiv') === 'refresh');
    const canonical = nodes.find(n => n.tagName === 'link' && attr(n, 'rel') === 'canonical');
    assert.equal(attr(refresh, 'content'), `0;url=${destination}`);
    assert.equal(attr(canonical, 'href'), target.href);
  }
});

test('Robots policy separates training from ChatGPT search and reading', async () => {
  const robots = await readFile(new URL('robots.txt', dist), 'utf8');
  assert.match(robots, /^User-agent: GPTBot\r?\nDisallow: \/$/m);
  assert.match(robots, /^User-agent: OAI-SearchBot\r?\nAllow: \/$/m);
  assert.match(robots, /^User-agent: ChatGPT-User\r?\nAllow: \/$/m);
  assert.match(robots, /^User-agent: \*\r?\nAllow: \/$/m);
  assert.match(robots, /^Sitemap: https:\/\/[^/]+\/sitemap-index\.xml$/m);
});
