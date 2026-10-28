# Strona główna

Źródła: [desktop](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=151-3075), [mobile](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=395-5581).

Implementacja: `src/pages/index.astro`. Wykorzystuje wspólne foundations, przyciski oraz wariant `homePage` nagłówka i stopki. Zachowuje polskie menu, Satoshi i Geist Mono. Na prośbę Magdy nagłówek zawiera przycisk PL na desktopie i mobile; na tym etapie jest tylko elementem interfejsu, bez tłumaczenia treści.

Przyciski „Zobacz moje prace”, „Zobacz wszystkie projekty” i „Porozmawiajmy” mają wspólny hover i focus klawiatury zgodne z [wariantem Figmy](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=395-5438): tło #171717, tekst i lokalna ikona #eeeeec.

Sekcje: imię i nazwisko z opisem, wyróżnione Akademia i Miropoix, pięć obszarów usług, zaproszenie do kontaktu. Opisy i metadane projektów odpowiadają zakładce Realizacje: nie powielamy omyłkowego opisu ReadySet z makiety. Przyciski prowadzą do istniejących `/work`, `/about` i `/contact`; karty prowadzą do właściwych case studies.

Zdjęcie portretowe i oba mockupy pozostają szarymi placeholderami. Portret ma proporcje 229:172 na mobile i 412:309 na desktopie. Karty mają układ pionowy i minimalną wysokość 425 px na mobile; od 1024 px są dwukolumnowe, z mediami o wysokości co najmniej 388 px. Teksty mogą zwiększać wysokość karty. Przycisk wszystkich projektów jest widoczny na desktopie, zgodnie z makietą.

Usunięto poprzedni typewriter i uzależnienie widoczności treści od skryptu oraz localStorage. Menu i obsługa przejść pozostają wspólne. Ikona 46 px jest używana z istniejącego `public/assets/work`, a wariant 24 px z Figmy zapisano w `public/assets/home`. Brak zdalnych adresów assetów w kodzie.
