// A nonbreaking space keeps a one-letter conjunction or preposition with the next word.
export function keepPolishShortWords(text: string): string {
  return text.replace(/(?<=^|[\s(\[„“«])([aiouwz])[ \t\n\r\f]+(?=\S)/giu, '$1\u00a0');
}
