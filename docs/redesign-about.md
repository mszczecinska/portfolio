# O mnie

Źródła: [desktop](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=415-7669), [mobile](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=415-7992).

Implementacja: `src/pages/about.astro`, wariant `aboutPage` wspólnego layoutu, nagłówka i stopki. Zachowane ustalenia foundations: Satoshi i Geist Mono, polskie menu i istniejące rekomendacje wraz ze zdjęciami. PL to oznaczenie aktualnego języka.

Sekcje: portret i bio, jedenaście narzędzi, „Jak pracuję”, rekomendacje, kontakt. Na desktopie układ dwukolumnowy i sześć narzędzi w wierszu; na mobile portret pod tytułem, trzy narzędzia w wierszu, przewijane obszary współpracy z aktywnymi kropkami. Obszary można wybierać dotykiem, przyciskami i strzałkami klawiatury. Rekomendacje mają przyciski poprzednia/następna z ograniczeniem na końcach oraz ogłaszanie aktualnej opinii czytnikom ekranu. Przy wyłączonym JavaScripcie dostępna jest pierwsza opinia i wszystkie opisy sposobu pracy.

Zamiast lorem ipsum wykorzystano oryginalne rekomendacje Kamila, Andrzeja, Martyny i Natalii. Tekst opinii może zwiększać wysokość sekcji. Nie poprawiano treści cytatów. Poprawiono literówki w etykietach makiety („LinkedIn”, „Jak pracuję”).

Portret i nowe ikony pobrano lokalnie z Figmy do `public/assets/about`. Ikony identyczne z obecnymi wykorzystują `public/icons`. ChatGPT i Vercel mają osobne pliki SVG dla dwóch rozmiarów z makiety. Kadrowanie Codex odwzorowuje projekt. CTA używa istniejących lokalnych ikon i stanów hover/focus ze strony głównej.
