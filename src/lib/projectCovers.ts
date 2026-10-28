import type { ImageMetadata } from "astro";
import akademia from "../assets/case-studies/Akademia/okładka.jpg";
import obrys from "../assets/case-studies/obrys/okładka projektu.jpg";

import miropoix from "../assets/case-studies/Miropoix/okładka.jpg";
import insightx from "../assets/case-studies/INX/hero-inx.png";

const covers: Record<string, ImageMetadata> = {
  "akademia-e-commerce-dla-e-bookow-edukacyjnych": akademia,
  "obrys-studio": obrys,
  "miropoix-saas-dla-szefow-kuchni": miropoix,
  "koncepcja-wizji-produktu-b2c": insightx,
};

export function getProjectCover(slug: string): ImageMetadata | undefined {
  return covers[slug];
}
