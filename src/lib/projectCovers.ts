import type { ImageMetadata } from "astro";
import akademia from "../assets/case-studies/Akademia/okładka.jpg";
import obrys from "../assets/case-studies/obrys/okładka projektu.jpg";

import miropoix from "../assets/case-studies/Miropoix/okładka.jpg";
import insightx from "../assets/case-studies/INX/hero-inx.png";

import readyset from "../assets/case-studies/readyset/okładka.jpg";

import mova from "../assets/case-studies/mova/okładka.jpg";

import aurapura from "../assets/case-studies/Aurapura/okładka.jpg";

const covers: Record<string, ImageMetadata> = {
  "akademia": akademia,
  "obrys": obrys,
  "miropoix": miropoix,
  "insightx": insightx,
  "readyset": readyset,
  "mova": mova,
  "aurapura": aurapura,
};

export function getProjectCover(slug: string): ImageMetadata | undefined {
  return covers[slug];
}
