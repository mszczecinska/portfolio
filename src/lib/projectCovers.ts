import type { ImageMetadata } from "astro";
import akademia from "../assets/case-studies/Akademia/okładka.jpg";
import obrys from "../assets/case-studies/obrys/okładka projektu.jpg";

const covers: Record<string, ImageMetadata> = {
  "akademia-e-commerce-dla-e-bookow-edukacyjnych": akademia,
  "obrys-studio": obrys,
};

export function getProjectCover(slug: string): ImageMetadata | undefined {
  return covers[slug];
}
