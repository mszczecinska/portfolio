// Keep interactive messages separate so the browser never downloads case studies.
const messages: Record<string, string> = {
  'Skopiuj adres e-mail': 'Copy email address',
  'Skopiowano adres': 'Email address copied',
  'Skopiowano adres e-mail': 'Email address copied',
  'Zaznacz i skopiuj adres e-mail.': 'Select and copy the email address.',
  'Podgląd obrazu': 'Image preview',
  'Wczytywanie obrazu…': 'Loading image…',
  'Nie udało się wczytać obrazu.': 'The image could not be loaded.',
  'Nie udało się pobrać filmu.': 'The video could not be downloaded.',
  'Przeglądarka nie mogła odczytać filmu.': 'The browser could not decode the video.',
  'Przeglądarka nie obsługuje dostępnych formatów filmu.': 'The browser does not support the available video formats.',
  'Nie udało się odtworzyć filmu.': 'The video could not be played.',
  'Karty koncepcji — przewijaj strzałkami': 'Concept cards — use the arrow keys to scroll',
  'Wybierz kartę': 'Choose a card',
  'Karta': 'Card',
};
export function uiText(text: string): string {
  return document.documentElement.lang === 'en' ? messages[text] ?? text : text;
}
