import { languageFromPath, languagePath } from '../i18n/routes';

// Read the current URL on click: work filters can change it without a page load.
// The static href also keeps switching available without JavaScript.
function updateSwitches() {
  const target = languageFromPath(location.pathname) === 'pl' ? 'en' : 'pl';
  document.querySelectorAll<HTMLAnchorElement>('[data-language-switch]').forEach(link => {
    link.href = languagePath(location.pathname, target) + location.search + location.hash;
  });
}
const refreshSwitch = (event: Event) => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('[data-language-switch]');
  if (!link) return;
  updateSwitches();
};
for (const event of ['click', 'auxclick', 'contextmenu']) {
  document.addEventListener(event, refreshSwitch, { capture: true });
}
updateSwitches();
document.addEventListener('astro:page-load', updateSwitches);
window.addEventListener('popstate', updateSwitches);
