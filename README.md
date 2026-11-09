# portfolio

## Redesign

- [Foundations](docs/redesign-foundations.md) - kolory, typografia, odstępy i kontenery.
- [Wspólne sekcje case studies](docs/redesign-case-studies.md) - komponenty, układy mobile first i miejsca na multimedia Akademii.

Podgląd lokalny: `bun dev`. Build: `bun run build`.

## Utrzymanie

- Dane projektów, teksty kart i wybór projektów na główną: `src/lib/projects.ts`.
- Wspólne linki społecznościowe: `src/lib/social.ts`.
- Filmy: WebM/VP9 i zapasowy MP4 z natywnym autoplay i `preload="metadata"`, podgląd `<nazwa>.poster.webp`, zatrzymywanie poza ekranem i widoczny przycisk ręcznego odtwarzania. Preferencja ograniczenia ruchu wyłącza autoplay; kontrolki pozostają dostępne.
- Build automatycznie usuwa z `dist/_astro` nieużywane oryginały obrazów. Pliki źródłowe i wygenerowane warianty responsywne zostają. Mechanizm dotyczy obecnej strony statycznej; przy dynamicznym składaniu adresów obrazów należy go ponownie zweryfikować.
- Przekierowania starych adresów są w `vercel.json`. Podgląd statyczny korzysta z tych samych celów. Sitemap zawiera tylko aktualne adresy.

Weryfikacja: `bun run build`, `bun x tsc --noEmit`, `node --test tests/*.test.mjs`.

## Języki PL / EN

Polski jest domyślny (`/`, `/o-mnie`, `/realizacje`, `/eksperymenty`), a angielski ma prefiks `/en` (`/en/`, `/en/about`, `/en/work`, `/en/experiments`). Case studies mają krótkie adresy, np. `/miropoix` i `/en/miropoix`.
Przełącznik w menu otwiera odpowiednik bieżącej podstrony, zachowując parametry i kotwicę.
Wybrany język jest zapisany w adresie, więc pozostaje po odświeżeniu i przejściu na kolejną podstronę.

- `src/i18n/en.json` - tłumaczenia pełnych tekstów i etykiet; klucze to polskie treści z normalizacją białych znaków. Po zmianie polskiej treści trzeba zaktualizować także jej klucz i tłumaczenie.
- `src/i18n/ui.ts` - krótkie komunikaty tworzone przez skrypty (kopiowanie adresu, multimedia, karty).
- `src/pages/[...path].astro` - wspólne widoki PL i EN. Nowe case studies w `src/views/work` są dodawane automatycznie, a nazwa pliku określa ich adres.
- `src/middleware.ts` i `src/i18n/html.ts` - tłumaczenie tekstów, opisów i tematów e-maili przy generowaniu statycznego HTML. Słownik case studies i parser HTML nie są wysyłane do przeglądarki.
- Treść osadzona w obrazach i filmach pozostaje częścią oryginalnych materiałów projektowych; jej zmiana wymaga przygotowania nowych assetów.

Po buildzie testy `node --test tests/*.test.mjs` sprawdzają tłumaczenia, język linków i metadane SEO wszystkich podstron.

Pełny zestaw testów wraz ze świeżym buildem: `npm test` (Node.js 22.18+). Testy obejmują także komunikaty interaktywne, przełączanie języka, historię, otwieranie przełącznika w nowej karcie i przekierowania.
