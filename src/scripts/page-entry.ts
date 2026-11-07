import { isTransitionBeforeSwapEvent } from "astro:transitions/client";
import { shouldAnimate } from "./motion";

const pageSelector = ".home-page, .work-page, .about-page, .case-study";
const entrance = {
  duration: 440,
  revealDuration: 580,
  revealStagger: 65,
  stagger: 55,
  maxDelay: 140,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
};
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let animations: Animation[] = [];
let scrollContentObserver: IntersectionObserver | null = null;
const pendingScrollContent = new Set<HTMLElement>();

function clearScrollContent() {
  scrollContentObserver?.disconnect();
  scrollContentObserver = null;
  pendingScrollContent.forEach(card => card.removeAttribute("data-content-entry-pending"));
  pendingScrollContent.clear();
}

function visible(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < innerHeight && rect.width > 0;
}

function track(animation: Animation) {
  animations.push(animation);
  const remove = () => { animations = animations.filter(item => item !== animation); };
  void animation.finished.then(remove, remove);
}

function enterContent(element: HTMLElement, delay: number, duration = entrance.duration) {
  if (!shouldAnimate()) return;
  const distance = matchMedia("(max-width: 767px)").matches ? 10 : 14;
  track(element.animate([
    { opacity: 0, transform: `translateY(${distance}px)` },
    { opacity: 1, transform: "translateY(0)" },
  ], {
    duration,
    delay,
    easing: entrance.easing,
    fill: "backwards",
  }));
}

function enterScrollContent(root: HTMLElement, selector: string, enter = enterContent, threshold = .08, stagger = 0) {
  clearScrollContent();
  const reveal = (card: HTMLElement, delay = 0) => {
    card.removeAttribute("data-content-entry-pending");
    pendingScrollContent.delete(card);
    scrollContentObserver?.unobserve(card);
    enter(card, delay);
  };
  scrollContentObserver = new IntersectionObserver(entries => {
    let index = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= threshold && pendingScrollContent.has(entry.target as HTMLElement)) {
        reveal(entry.target as HTMLElement, Math.min(index++ * stagger, entrance.maxDelay));
      }
    });
  }, { threshold });
  let index = 0;
  root.querySelectorAll<HTMLElement>(selector).forEach(card => {
    if (visible(card)) reveal(card, stagger ? Math.min(index++ * stagger, entrance.maxDelay) : 100);
    else if (card.getBoundingClientRect().top >= innerHeight) {
      card.setAttribute("data-content-entry-pending", "");
      pendingScrollContent.add(card);
      scrollContentObserver!.observe(card);
      // Keyboard navigation should reveal a focused card immediately too.
      card.addEventListener("focusin", () => {
        if (!pendingScrollContent.has(card)) return;
        card.removeAttribute("data-content-entry-pending");
        pendingScrollContent.delete(card);
        scrollContentObserver?.unobserve(card);
      }, { once: true });
    }
  });
}

function enterCaseText(element: HTMLElement, delay: number) {
  if (!shouldAnimate()) return;
  const title = element.querySelector<HTMLElement>("[data-entry-reveal]");
  if (!title) {
    enterContent(element, delay);
    return;
  }
  track(title.animate([
    { transform: "translateY(105%)" },
    { transform: "translateY(0)" },
  ], {
    duration: entrance.revealDuration,
    delay,
    easing: entrance.easing,
    fill: "backwards",
  }));
}

export function enterRecommendation(slide: HTMLElement) {
  animations.forEach(animation => {
    const target = (animation.effect as KeyframeEffect | null)?.target;
    if (target instanceof HTMLElement && target.closest("[data-recommendation]")) animation.cancel();
  });
  if (!shouldAnimate()) return;
  slide.querySelectorAll<HTMLElement>("blockquote, figcaption").forEach((element, index) => {
    enterContent(element, index * 35, 220);
  });
}

export function enterWorkCategory(group: HTMLElement) {
  // Fast toggles should restart the cards, never stack entrances on them.
  animations.forEach(animation => {
    const target = (animation.effect as KeyframeEffect | null)?.target;
    if (target instanceof HTMLElement && target.matches(".work-card__link")) animation.cancel();
  });
  if (!shouldAnimate()) return;
  group.querySelectorAll<HTMLElement>(".work-card__link").forEach(card => {
    if (visible(card)) enterContent(card, 0, 220);
  });
}

function enterPage(root: HTMLElement) {
  if (!root.isConnected || root.dataset.entryPlayed) return;
  root.dataset.entryPlayed = "true";
  if (!shouldAnimate()) return;

  if (root.matches(".case-study")) {
    // Only text enters on scroll. The cover retains its shared view transition.
    enterScrollContent(root, "[data-case-entry]", enterCaseText, 0, entrance.stagger);
    return;
  }

  if (root.matches(".home-page")) enterScrollContent(root, ".home-project__link");
  if (root.matches(".about-page")) enterScrollContent(root, ".about-tools__grid li");

  // The original home entrance is the shared language: masked title lines,
  // followed by a lighter fade and short upward movement for supporting content.
  const revealLines = [...root.querySelectorAll<HTMLElement>("[data-entry-reveal]")];
  const selectors = root.matches(".home-page")
    ? [".home-hero__portrait", ".home-hero__intro > p", ".home-hero__actions", ".home-hero__role"]
    : root.matches(".work-page")
      ? [".work-grid:not([hidden]) .work-card__link"]
      : [".about-portrait", ".about-bio", ".about-socials"];
  const elements = selectors.flatMap(selector => [...root.querySelectorAll<HTMLElement>(selector)]);
  revealLines.forEach((element, index) => {
    // Measure the mask, which stays in place while its text moves.
    if (!visible(element.parentElement!)) return;
    track(element.animate([
      { transform: "translateY(105%)" },
      { transform: "translateY(0)" },
    ], {
      duration: entrance.revealDuration,
      delay: index * entrance.revealStagger,
      easing: entrance.easing,
      fill: "backwards",
    }));
  });
  let index = 0;
  elements.forEach(element => {
    if (!visible(element)) return;
    const delay = element.matches(".work-card__link")
      ? 0
      : element.matches(".home-hero__role")
      ? entrance.maxDelay
      : Math.min(index++ * entrance.stagger, entrance.maxDelay);
    enterContent(element, delay);
  });
}

function enterInitialPage() {
  const root = document.querySelector<HTMLElement>(pageSelector);
  if (root) enterPage(root);
}

// Finish any ongoing entrances before capturing a project cover on navigation.
document.addEventListener("astro:before-preparation", () => {
  clearScrollContent();
  animations.forEach(animation => animation.cancel());
  animations = [];
});

document.addEventListener("astro:before-swap", event => {
  if (!isTransitionBeforeSwapEvent(event)) return;
  const root = event.newDocument.querySelector<HTMLElement>(pageSelector);
  // Capture the complete incoming page so the hero can crossfade with the rest.
  if (root) root.dataset.entryPlayed = "true";
  const enteringHomeFromProject = root?.matches(".home-page")
    && event.navigationType !== "traverse" && !event.to.hash && document.querySelector(".case-study");
  void event.viewTransition.ready.catch(() => {
    if (!root || !enteringHomeFromProject) return;
    // The native transition can be skipped when the viewport changes during the swap.
    return event.viewTransition.updateCallbackDone.then(() => {
      if (event.signal.aborted || !root.isConnected || !shouldAnimate()) return;
      delete root.dataset.entryPlayed;
      enterPage(root);
    }, () => {});
  });
  if (!shouldAnimate()) event.viewTransition.skipTransition();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", enterInitialPage, { once: true });
} else {
  enterInitialPage();
}
document.addEventListener("astro:page-load", enterInitialPage);
document.addEventListener("focusin", event => {
  if (!(event.target instanceof Node)) return;
  const focused = event.target;
  animations.forEach(animation => {
    const target = (animation.effect as KeyframeEffect | null)?.target;
    if (target instanceof HTMLElement && target.contains(focused)) animation.cancel();
  });
});
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) {
    clearScrollContent();
    animations.forEach(animation => animation.cancel());
    animations = [];
  }
});
