import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, access, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pruneUnusedImages } from "../scripts/prune-unused-images.mjs";

test("only prunes unused originals, keeping encoded references, variants and public files", async () => {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-images-"));
  try {
    await mkdir(join(directory, "_astro"));
    await mkdir(join(directory, "assets"));
    const files = [
      "_astro/unused.Abc12345.png",
      "_astro/zażółć gęślą.Abc12345.png",
      "_astro/css-image.Abc12345.jpg",
      "_astro/js-image.Abc12345.webp",
      "_astro/variant.Abc12345_Z1test.png",
      "assets/public.Abc12345.png",
    ];
    for (const file of files) await writeFile(join(directory, file), "image");
    await writeFile(join(directory, "index.html"), `<img src="/_astro/${encodeURIComponent("zażółć gęślą.Abc12345.png")}">`);
    await writeFile(join(directory, "_astro/style.css"), 'div {width:100%;background:url(./css-image.Abc12345.jpg)}');
    await writeFile(join(directory, "_astro/client.js"), 'const image="/_astro/js-image.Abc12345.webp";');
    assert.deepEqual(await pruneUnusedImages(directory), { count: 1, bytes: 5 });
    await assert.rejects(access(join(directory, files[0])));
    for (const file of files.slice(1)) await access(join(directory, file));
    assert.deepEqual(await pruneUnusedImages(directory), { count: 0, bytes: 0 });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
