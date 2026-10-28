import type { ImageMetadata } from "astro";
import akademia from "../assets/case-studies/Akademia/okładka.jpg";
import obrys from "../assets/case-studies/obrys/okładka projektu.jpg";

import miropoix from "../assets/case-studies/Miropoix/okładka.jpg";

const covers: Record<string, ImageMetadata> = {
  "akademia-e-commerce-dla-e-bookow-edukacyjnych": akademia,
  "obrys-studio": obrys,
  "miropoix-saas-dla-szefow-kuchni": miropoix,
};

export function getProjectCover(slug: string): ImageMetadata | undefined {
  return covers[slug];
}
