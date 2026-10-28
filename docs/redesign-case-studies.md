# Wspólne sekcje case studies

## OBRYS Studio

Źródło: [desktop](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=358-65027) i [mobile](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=361-65117).

Podstrona `/work/obrys-studio` wykorzystuje wspólne intro i sekcje: Założenia projektu, Identyfikacja wizualna, Projekt strony i Podsumowanie. Intro przyjmuje opcjonalną etykietę `roleLabel`; Obrys używa „Zakres”, pozostałe projekty zachowują „Rola”. Projekt pozostaje w kategorii Eksperymenty.

Zgodnie z prośbą wszystkie multimedia pozostają placeholderami. Proporcje mobile / desktop: okładka 361:186 / 1216:520, telefon 1:1, warianty znaku 361:78.335 / 1218:268, paleta 361:279 / 988:465, typografia 361:179.52 / 195:465, wizytówki 361:241 / 1216:778, motion 1440:880, dwa podglądy stron po 597:900, magazyn 2000:1333. Paleta i typografia układają się pionowo na mobile i obok siebie na desktopie. Podglądy realizacji i procesu pozostają w dwóch kolumnach także na telefonie. Tekst założeń poprzedza mockup na mobile, a na desktopie mockup znajduje się po lewej.

Pierwsze wdrożenie: [Akademia — desktop](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=224-649) i [mobile](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=285-37946).

## Komponenty

Wszystkie komponenty znajdują się w `src/components/work/`.

| Komponent | Zastosowanie |
| --- | --- |
| `CaseStudyShell.astro` | Layout nowego case study, kompaktowa nawigacja, odstępy między sekcjami; bez stopki, zgodnie z makietą Akademii |
| `CaseStudyIntro.astro` | Okładka, tytuł i podtytuł, opcjonalny link live, metadane i pasek problem / cel / efekt |
| `CaseStudyFacts.astro` | Wspólny pasek trzech informacji: problem / cel / efekt lub filary koncepcji produktu |
| `CaseStudySection.astro` | Układy `split` (tekst i multimedia), `editorial` (nagłówek obok opisu) i `centered` (węższy, wyśrodkowany opis procesu) |
| `CaseStudyMedia.astro` | Opisany placeholder z zarezerwowanymi proporcjami; po podaniu `src` — obraz lub film |
| `CaseStudyGallery.astro` | Dwa materiały jeden pod drugim na mobile i obok siebie na desktopie; wariant `phones` utrzymuje parę telefonów również na mobile |
| `CaseStudyPagination.astro` | Linki do poprzedniego i następnego projektu; kolejność mobile: następny, poprzedni |
| `CaseStudyScreens.astro` | Cztery ekrany: przewijana galeria z przyciskami wyboru na mobile, kompozycja ekranów i opisu od 1024 px |

Style wspólne dla nowych case studies są w `case-study.css` i korzystają z foundations. Dotychczasowy `WorkCaseShell.astro` pozostaje dla pozostałych projektów do czasu ich migracji. Nowe style są ograniczone do nowych komponentów / `.case-study`.

## Mobile first

Bazowy układ jest jednokolumnowy, z tekstem przed multimediami. Od 1024 px sekcje przechodzą w układy desktopowe. Odstępy między sekcjami: 64 / 120 px; boczne marginesy: 16 / 32 px zgodnie z foundations.

Treść ma 14 px na mobile i 16 px na desktopie, z interlinią 1.6. Nagłówki sekcji mają 24 / 40 px, wagę Medium i interlinię 1.3. Korygujemy nadmierną interlinię 30 px przy tekście 14 px w Figmie. Wysokości tekstów pozostają automatyczne.

Nagłówek strony ma wariant `caseStudy`, włączany przez `caseStudyHeader` w `Layout`. Używa istniejącej obsługi menu mobilnego. Pozostałe strony zachowują swój wariant nagłówka. Obsługa języka pozostaje osobnym zadaniem, zgodnie z dokumentacją foundations.

## Przykład sekcji

```astro
<CaseStudySection id="context" title="Punkt wyjścia" layout="split" mediaSide="left">
  <p>Opis kontekstu projektu.</p>
  <CaseStudyMedia slot="media" label="Porównanie widoków" />
</CaseStudySection>
```

Treść trafia do głównego slotu, materiał obok tekstu do `media`, a materiały pod całym układem do `visuals`. Opcjonalne `align="center"` wyśrodkowuje tekst w pionie na desktopie. `mediaWidth="wide"` poszerza kolumnę materiału (np. bibliotekę e-booków). `mediaFirstMobile` umieszcza materiał przed opisem na mobile, zachowując układ kolumn na desktopie. Style wariantów dotyczą bezpośrednich dzieci sekcji, dzięki czemu zagnieżdżone sekcje zachowują własny układ.

Sekcja może pominąć widoczny `title`, jeśli otrzyma opisowe `label` dla czytników ekranu. `contained={false}` wyłącza kontener z marginesami przy zagnieżdżaniu sekcji, aby nie powielać bocznych odstępów. Wyśrodkowany wariant rezerwuje naturalną szerokość nagłówka oraz do 598 px na tekst, dzięki czemu dłuższy nagłówek (np. „Testy prototypu”) nie jest sztucznie ściskany.

## Multimedia Akademii

Wszystkie zdjęcia, mockupy i filmy są placeholderami. Zachowany jest istniejący lokalny logotyp Figmy w metadanych. Nie pobieramy tymczasowych assetów z Figmy.

| Materiał | Proporcje mobile | Proporcje desktop |
| --- | --- | --- |
| Okładka projektu | 361 / 186 | 1216 / 520 |
| Porównanie stron | 1 / 1 | 1 / 1 |
| Mapa serwisu | 1216 / 791.47 | 1216 / 791.47 |
| Paleta i typografia | 1 / 1 | 1 / 1 |
| Szeroki mockup | 361 / 186 | 1216 / 520 |
| Karta e-booka, dane do płatności (2 filmy) | 1 / 1 każdy | 1 / 1 każdy |
| Biblioteka e-booków | 683 / 454.14 | 683 / 454.14 |
| Konto i zamówienia (2 telefony) | 175.07 / 359.39 każdy | 322.48 / 656 każdy |
| Podglądy poprzedniego i następnego projektu | 8 / 5 każdy | 8 / 5 każdy |

Po otrzymaniu materiałów dodajemy lokalne `src` do odpowiedniego `CaseStudyMedia` albo pozycji galerii. Komponent ma osobne `ratio` i `desktopRatio`; proporcje nie zależą od załadowania pliku. Obrazy mają `alt`, filmy opis i kontrolki.

Link „Zobacz live” pochodzi z `project.links.live` w `src/lib/projects.ts`. Adres Akademii przekazany przez Magdę: `https://studionauczaniakursy.pl/`.

Nawigacja między projektami wykorzystuje istniejące trasy Mova i InsightX. Powielony w makiecie opis InsightX pod Movą zastępujemy właściwym podtytułem Movy.

## Nawigacja między projektami

Dwa równorzędne podglądy: etykieta kierunku ze strzałką, miniatura 8:5 oraz tytuł i opis pod spodem. Od 768 px poprzedni projekt jest po lewej, następny po prawej. Na mobile następny poprzedza poprzedni. Obie miniatury pozostają placeholderami.

## Miropoix

Źródło: [desktop](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=260-11984), [mobile](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=289-39966), [hover przycisku Live](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=391-5357).

Wykorzystuje ten sam shell, intro, sekcje, galerie i nawigację co Akademia. Sekcje: Punkt wyjścia, Proces, Design i decyzje projektowe, Motion, Wdrożenie, Rezultat i wnioski. Po rezultacie dodajemy wspólną nawigację do Akademii i InsightX. Ikony narzędzi pochodzą z istniejących plików: Figma, Jitter, Claude Code, Cursor.

Wszystkie zdjęcia i filmy pozostają placeholderami. Proporcje:

| Materiał | Mobile | Desktop |
| --- | --- | --- |
| Okładka | 361 / 186 | 1216 / 520 |
| Porównanie aplikacji | 1 / 1 | 1 / 1 |
| Animacje procesu (2) | 598 / 424.206 | 598 / 424.206 |
| Typografia i paleta | 1 / 1 | 1 / 1 |
| Ekrany aplikacji (4) | 207 / 424.94 | 322.48 / 662 |
| Motion | 1 / 1 | 1 / 1 |
| Wdrożona strona | 361 / 186 | 1216 / 520 |

`CaseStudyScreens` utrzymuje opis nad ekranami na mobile. Ekrany można przewijać dotykiem, wybierać czterema przyciskami lub klawiszami ArrowLeft / ArrowRight / Home / End po ustawieniu fokusu na galerii. Aktywny przycisk ma `aria-pressed="true"`. Przy ograniczeniu animacji zmiana ekranu jest natychmiastowa. Na desktopie cztery ekrany są widoczne równocześnie, a przyciski są ukryte.

Przycisk Live prowadzi do `https://miropoix.com/en/` (adres zachowany z poprzedniego case study). `CaseStudyIntro` przyjmuje `liveHoverColor`, `liveHoverTextColor` i `liveHoverBorderColor`. Miropoix używa tła `#B44B23`, tekstu/strzałki i obramowania `#FAFAF9`. Domyślne wartości pozostałych przycisków się nie zmieniają; Akademia zachowuje tło hover `#F5EDE5`.

## InsightX

Źródło: [desktop](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=270-13151) i [mobile](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=291-41567).

Wspólne sekcje obsługują intro, punkt wyjścia, proces, dwie hipotezy, persony, analizę narzędzi, wizję InfoFi oraz rezultat. Sekcja może otrzymać `subtitle` (druga linia nagłówka) i slot `heading-extra` (np. odnośnik do Figmy). Pasek założeń InfoFi używa tego samego `CaseStudyFacts` co intro; etykiety zachowują ustalone 20 px, a odstęp od tekstu wynosi 16 px na mobile / 24 px na desktopie.

Zachowujemy istniejącą zawartość `HypothesisSecurityCards` i `HypothesisNewbiesCards`. Ich wspólny styl jest w `hypothesis-cards.css`, a obsługa w `hypothesis-tabs.ts`. Kategorie mają prostokątne przełączniki z Geist Mono, ciemne aktywne tło i role tab / tabpanel. Strzałki oraz Home / End zmieniają kategorię. Na mobile karty przewijają się poziomo i mają przyciski wyboru, z obsługą klawiatury i ograniczenia animacji. Od 1024 px przechodzą w trzykolumnową siatkę.

Multimedia pozostają placeholderami: okładka 361:186 / 1216:520, ilustracja punktu wyjścia i mapa person 1:1, analiza Arkham 1216:506.765625. Lokalne ikony Figma, Notion i OpenAI pozostają w metadanych. Karty i ich przykłady są renderowane jako HTML, nie obrazy. Zachowane są dotychczasowe odnośniki do odpowiednich map w FigJam.

W mobilnej makiecie druga hipoteza powiela opis Security. Wdrożenie korzysta z właściwej treści Newbie friendly z desktopu i istniejącego kodu. Poprawione są oczywiste literówki: „Technologia” oraz „konfigurowalnej przestrzeni”. Nawigacja na końcu prowadzi do Miropoix i ReadySet.

## ReadySet

Źródło: [desktop](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=274-15865) i [mobile](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=292-41990).

Wdrożenie używa wspólnego shellu, intro, paska wniosków, sekcji, galerii i nawigacji. Treści obejmują badania, wnioski z trzech wywiadów, podział na Planowanie i Harmonogram, rozwiązanie, testy prototypu i rezultat. W metadanych pozostają lokalne ikony Figma, Notion i OpenAI. Nie dodajemy przycisku Live do projektu koncepcyjnego.

Na mobile opis poprzedza materiały. Sekcja rozwiązania pokazuje kolejno opis, pierwszą parę telefonów, tekst o Material Design i drugą parę. Na desktopie dwie pary telefonów i opisy tworzą naprzemienne układy z szerszą kolumną multimediów. Cztery telefony zachowują jednakowe proporcje i rozmiary. Sekcje bez widocznego nagłówka mają etykiety dostępności; wewnętrzny układ rozwiązania nie dubluje marginesów kontenera.

Multimedia są placeholderami:

| Materiał | Mobile | Desktop |
| --- | --- | --- |
| Okładka | 361 / 186 | 1216 / 520 |
| Wywiady / notatki badawcze | 1 / 1 | 1 / 1 |
| Synteza badań | 1216 / 515.375 | 1216 / 515.375 |
| Przepływ Planowania i Harmonogramu | 361 / 598 | 1 / 1 |
| Ekrany aplikacji (4, w parach) | 175.07 / 361.32 | 175.07 / 361.32 |
| Nagrania testów prototypu (2) | 598 / 424.206 | 598 / 424.206 |

Nawigacja prowadzi do InsightX i Movy. Poprawiono oczywistą literówkę w opisie badań: „zawiłe o chaotyczne” → „zawiłe i chaotyczne”. Nie przenosimy błędnych przesunięć warstw i sztywnych wysokości tekstu z makiety do kodu.

## Mova

Źródło: [desktop](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=295-43688) i [mobile](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=308-52398).

Wdrożenie wykorzystuje wspólne intro, sekcje, galerię telefonów i nawigację. Treści obejmują badania, rozwiązanie i kluczowe decyzje, design oraz rezultat i wnioski. W metadanych pozostaje lokalna ikona Figmy. Projekt koncepcyjny nie ma przycisku Live.

Na mobile sekcja rozwiązania pokazuje opis, parę telefonów, tekst o kontekstach nauki i podgląd web. Na desktopie opis kontekstów znajduje się po lewej stronie telefonów, a podgląd web poniżej, wyrównany do lewej. Pozostałe sekcje zachowują wspólną typografię i odstępy.

Wszystkie multimedia, w tym animowane ekrany z Figmy, pozostają placeholderami:

| Materiał | Mobile | Desktop |
| --- | --- | --- |
| Okładka | 361 / 186 | 1216 / 520 |
| Kontekst nauki | 1 / 1 | 1 / 1 |
| Ekrany aplikacji (2) | 175.07 / 359.547 | 175.07 / 359.547 |
| Widok web | 854 / 563.9766 | 854 / 563.9766 |
| Paleta, typografia i UI Kit | 1 / 1 | 1 / 1 |

Opis fontu Nunito Sans dotyczy interfejsu Movy; portfolio nadal korzysta z Satoshi. Nawigacja prowadzi do ReadySet i AuraPura.

## AuraPura

Źródło: [desktop](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=321-56156) i [mobile](https://www.figma.com/design/W7f7HK7jCeRUHyU5BzJYi8/portfolio-magda?node-id=328-58141).

Wspólne komponenty obsługują intro, proces, fundamenty systemu, komponenty i responsywność oraz rezultat i wnioski. Na mobile tekst poprzedza materiały. Od 1024 px proces ma grafikę po lewej, a pozostałe sekcje nagłówek obok opisu. Zachowujemy lokalną ikonę Figmy i nie dodajemy przycisku Live do projektu koncepcyjnego.

Zgodnie z ustaleniem nowe grafiki pozostają placeholderami: okładka (361:186 / 1216:520) i materiał procesu (1:1). Wykorzystane istniejące materiały z `public/assets/aurapura`:

| Sekcja | Plik | Proporcje |
| --- | --- | --- |
| Fundamenty systemu | `grid-photos-small.png` | 4156 / 2292 |
| Komponenty i responsywność | `grid-photo.png` | 4160 / 5340 |
| Siatki tablet i mobile | `mobile+tablet-grid.png` | 4148 / 3684 |
| Siatka desktop | `desktop-grid-aurapura.png` | 3612 / 3388 |

Kolejność materiałów odpowiada obu makietom. Proporcje wynikają z lokalnych eksportów; obrazy są wyświetlane w całości, bez przycinania. Nawigacja prowadzi do Movy i Akademii, z placeholderami podglądów jak w pozostałych case studies. Nie pobrano nowych assetów ani nie dodano zależności.
