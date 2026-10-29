import { readdir, readFile, stat, unlink } from "node:fs/promises";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }));
  return files.flat();
}

// Astro emits imported originals alongside Picture's optimized variants. Only
// prune unreferenced originals from the static output, never source assets.
export async function pruneUnusedImages(directory) {
  const files = await filesIn(directory);
  const documents = files.filter(path => /\.(?:html|css|js|json|webmanifest|xml|svg|txt)$/.test(path));
  const references = (await Promise.all(documents.map(async path => {
    const text = await readFile(path, "utf8");
    // Literal percentages in CSS/text must not break URL decoding.
    return text.replace(/(?:%[\da-f]{2})+/gi, encoded => {
      try { return decodeURIComponent(encoded); } catch { return encoded; }
    });
  }))).join("\n");

  // Transformed images have an additional _hash after the source hash.
  // Keep all variants and any originals linked from the generated output.
  const unused = files.filter(path =>
    path.startsWith(join(directory, "_astro") + "/")
    && /\.[\w-]{8}\.(?:png|jpe?g|webp|avif)$/.test(basename(path))
    && !references.includes(basename(path))
  );
  let bytes = 0;
  for (const path of unused) {
    bytes += (await stat(path)).size;
    await unlink(path);
  }
  return { count: unused.length, bytes };
}

export default function integration() {
  return {
    name: "prune-unused-images",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const { count, bytes } = await pruneUnusedImages(fileURLToPath(dir));
        logger.info(`Removed ${count} unused image originals (${(bytes / 1e6).toFixed(1)} MB).`);
      },
    },
  };
}
