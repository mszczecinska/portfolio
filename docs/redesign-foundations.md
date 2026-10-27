# Foundations redesignu

Źródło: [Figma — strona - redesign](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=428-8615).
Implementacja: `src/layouts/foundations.css`, wspólne kontrolki: `src/layouts/layout.css`.
Podgląd lokalny: `/dev/foundations` (dostępny tylko w trybie development, bez eksportu do produkcji).

## Ustalenia

- Jeden jasny motyw. Bez ikony motywu, automatycznego dopasowania do systemu i filtrów przyciemniających multimedia.
- Satoshi Regular w tekście i nawigacji; Satoshi Medium w aktywnej pozycji menu. Funnel Display pomijamy.
- Geist Mono Regular w etykietach, metadanych i przyciskach. Fonty są hostowane lokalnie.
- Polska wersja ma polskie menu. Przełącznik języka oraz angielskie treści i trasy wymagają osobnego zadania — obecny projekt nie ma jeszcze obsługi języków. Nie dodajemy pozornego przełącznika.
- Rekomendacje oraz ich zdjęcia zachowujemy z obecnego kodu.
- Docelowe mockupy dostarczy Magda jako PNG. Do tego czasu można stosować `.media-placeholder` z proporcjami zgodnymi z makietą. Nie zastępujemy automatycznie obecnych materiałów.

## Kolory

| Rola / zmienna | Wartość |
| --- | --- |
| Tło `--color-background` | `#ffffff` |
| Powierzchnia `--color-surface` | `#eeeeec` |
| Tekst / akcent `--color-text` | `#171717` |
| Tekst pomocniczy `--color-text-muted` | `#676767` |
| Linie / obramowania `--color-border` | `#c8c8c5` |

Dotychczasowe zmienne (np. `--color-meta`, `--color-divider`) są aliasami wspólnych ról. Kolory sukcesu, ostrzeżeń i błędów pozostają dla istniejących przykładów wewnątrz case studies. Kolorów i fontów widocznych wewnątrz grafik projektowych nie traktujemy jako stylów portfolio.

## Typografia

Rozmiary podano dla bazowego rozmiaru przeglądarki 16 px. Duże style płynnie skalują się między mobile a desktopem.

| Klasa | Rozmiar | Interlinia |
| --- | --- | --- |
| `.type-display` | 64 px przy 393 px viewportu, do 128 px na desktopie; mniejszy na wąskich ekranach | 1 |
| `.type-title` | 40–64 px | 1.15 |
| `.type-heading` | 32–40 px | 1.3 |
| `.type-subheading` | 24–32 px | 1.3 |
| `.type-body` | 16 px | 1.6 |
| `.type-small` | 14 px | 1.6 |
| `.type-label` | 12 px, Geist Mono, uppercase | 1.5 |
| `.type-nav` | 20 px / aktywne 32 px | 1.5 |

Interlinie są świadomie ujednolicone: nie przenosimy błędnych wartości z makiety (np. 38 px dla nagłówka 64 px). `.content-prose` ogranicza długie akapity do 65ch. Style nowych nagłówków są jawne, aby nie przebudowywać istniejących podstron globalną regułą `h1`/`h2`.

## Odstępy i kontenery

Skala `--space-*`: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 i 120 px. Przy doborze odstępów korzystamy z tej skali, zamiast kopiować przypadkowe wartości z Figmy.

- `.page-container`: maks. 1280 px łącznie z marginesami wewnętrznymi. Przy 1280 px viewportu treść ma 1216 px szerokości.
- Margines wewnętrzny `--page-gutter`: 16 px poniżej 768 px, 32 px od 768 px.
- `.page-container--reading`: maks. 1074 px z marginesami, czyli 1010 px treści na desktopie (układ About).
- `.section-space`: odstęp przed sekcją, 64 px na mobile i 120 px od 1024 px. Nie nakładamy go jednocześnie na sekcję i jej rodzica.
- `.content-stack`: układ pionowy, odstęp 20 px na mobile i 40 px od 768 px.
- `--column-gap`: 20 px na mobile/tablecie, 40 px od 1024 px. Stosowany podczas składania nowych sekcji.
- Zagnieżdżone sekcje nie powinny powielać `.page-container`, aby nie podwajać bocznych marginesów.

Przykład:

```astro
<section class="page-container section-space" aria-labelledby="process-title">
  <div class="content-stack">
    <h2 id="process-title" class="type-heading">Proces</h2>
    <p class="type-body content-prose">Opis procesu projektowego.</p>
  </div>
</section>
```

## Wspólne kontrolki

`.btn-primary`: prostokątny obrys 1 px, biały środek, subtelny cień. `.btn-secondary`: link tekstowy z przezroczystym obramowaniem. Oba style mają Geist Mono Regular, uppercase, padding 12/16 px i font 12 px na mobile oraz padding 16/24 px i font 16 px od 768 px. Minimalny obszar kontrolki wynosi 44 px. Hover i pressed używają neutralnych kolorów; focus jest widoczny. Przejścia respektują `prefers-reduced-motion`.

## Zakres migracji

Globalna paleta, fonty i przyciski już działają w obecnych widokach. Nagłówek i stopka korzystają z nowego kontenera i polskich nazw; menu używa poprawnych wag. Docelowa kompozycja nagłówka, układy stron, nowe sekcje i multimedia będą wdrażane w kolejnych zadaniach. Stare lokalne wymiary i klasy typograficzne migrujemy przy przebudowie odpowiedniego widoku, bez zbiorczego zastępowania wartości we wszystkich plikach.

## Źródła fontów

- Satoshi Regular / Medium: oficjalne pliki z Fontshare, pobrane przez `https://api.fontshare.com/v2/css?f[]=satoshi@400,500&display=swap`. Licencja: [ITF Free Font License](https://www.fontshare.com/licenses/itf-free-font-license).
- Geist Mono Regular: Google Fonts; licencja SIL OFL znajduje się w `public/fonts/GeistMono-OFL.txt`.
- Dotychczasowy `Satoshi.woff2` pozostaje w repozytorium, ale layout ładuje jawnie nowe pliki Regular i Medium.
