// HTML sizes uses the browser's initial rem. Mirror the wide layout's root
// scale from foundations.css when describing the rendered width to the browser.
export function wideImageSize(widthInRem: number) {
  return `(min-width: 120rem) calc(${widthInRem} * clamp(1rem, 0.75vw + 0.1rem, 3.5rem))`;
}
