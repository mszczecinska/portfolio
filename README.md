# portfolio

## Redesign

- [Foundations](docs/redesign-foundations.md) — kolory, typografia, odstępy i kontenery.
- [Wspólne sekcje case studies](docs/redesign-case-studies.md) — komponenty, układy mobile first i miejsca na multimedia Akademii.

Podgląd lokalny: `bun dev`. Build: `bun run build`.

## Utrzymanie

- Dane projektów, teksty kart i wybór projektów na główną: `src/lib/projects.ts`.
- Wspólne linki społecznościowe: `src/lib/social.ts`.
- Filmy: WebM/VP9 i zapasowy MP4 z natywnym autoplay i `preload="metadata"`, podgląd `<nazwa>.poster.webp`, zatrzymywanie poza ekranem i widoczny przycisk ręcznego odtwarzania. Preferencja ograniczenia ruchu wyłącza autoplay; kontrolki pozostają dostępne.
- Build automatycznie usuwa z `dist/_astro` nieużywane oryginały obrazów. Pliki źródłowe i wygenerowane warianty responsywne zostają. Mechanizm dotyczy obecnej strony statycznej; przy dynamicznym składaniu adresów obrazów należy go ponownie zweryfikować.
- Stare adresy case study portfolio prowadzą do `/work`. Przekierowania nie trafiają do sitemap.

Weryfikacja: `bun run build`, `bun x tsc --noEmit`, `node --test tests/*.test.mjs`.
