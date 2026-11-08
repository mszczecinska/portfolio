import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from 'parse5';

test('Route stylesheets are in the parsed head so Astro can preload them', async () => {
  for (const path of ['index.html', 'realizacje/index.html', 'eksperymenty/index.html', 'o-mnie/index.html', 'miropoix/index.html', 'en/index.html']) {
    const source = await readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8');
    const html = parse(source).childNodes.find(node => node.tagName === 'html');
    const head = html.childNodes.find(node => node.tagName === 'head');
    const stylesheets = head.childNodes.filter(node =>
      node.tagName === 'link' && node.attrs.some(attr => attr.name === 'rel' && attr.value === 'stylesheet')
    );
    assert.ok(stylesheets.length > 0, `${path}: missing stylesheets in <head>`);
  }
});
