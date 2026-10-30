import { isTransitionBeforeSwapEvent } from "astro:transitions/client";

type LinkPosition = { x: number; centerY: number; width: number; height: number };
let previous = new Map<string, LinkPosition>();
let animations: Animation[] = [];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

document.addEventListener("astro:before-swap", event => {
  animations.forEach(animation => animation.cancel());
  animations = [];
  previous.clear();
  if (!isTransitionBeforeSwapEvent(event) || event.from.pathname === event.to.pathname
    || !event.newDocument.querySelector(".home-page, .work-page, .about-page")
    || reducedMotion.matches || !matchMedia("(min-width: 1024px)").matches) return;

  document.querySelectorAll<HTMLElement>("[data-nav-key]").forEach(link => {
    const rect = link.getBoundingClientRect();
    if (!rect.width || !rect.height || rect.bottom <= 0) return;
    previous.set(link.dataset.navKey!, {
      x: rect.x, centerY: rect.y + rect.height / 2, width: rect.width, height: rect.height,
    });
  });
});

document.addEventListener("astro:after-swap", () => {
  if (reducedMotion.matches) { previous.clear(); return; }
  document.querySelectorAll<HTMLElement>("[data-nav-key]").forEach(link => {
    const old = previous.get(link.dataset.navKey!);
    const rect = link.getBoundingClientRect();
    if (!old || !rect.width || !rect.height) return;
    // Animate position and size on the live links, independently of the page
    // snapshot, so the entrance of the content never has to wait for the menu.
    const animation = link.animate([
      { transform: `translate(${old.x - rect.x}px, ${old.centerY - rect.y - rect.height / 2}px) scale(${old.width / rect.width}, ${old.height / rect.height})` },
      { transform: "none" },
    ], {
      duration: 280,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    link.style.transformOrigin = "left center";
    animations.push(animation);
  });
  previous.clear();
});

reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) {
    animations.forEach(animation => animation.cancel());
    animations = [];
    previous.clear();
  }
});
