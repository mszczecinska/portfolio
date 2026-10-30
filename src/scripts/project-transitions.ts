import { isTransitionBeforePreparationEvent } from "astro:transitions/client";

// Decode the same responsive picture the destination will display before capture.
// A detached document does not load its images, so use a hidden, inert clone.
async function preparePicture(cover: HTMLElement, signal: AbortSignal) {
  const picture = cover.querySelector("picture");
  if (!picture) return false;
  const preload = picture.cloneNode(true) as HTMLPictureElement;
  const image = preload.querySelector("img")!;
  image.loading = "eager";
  preload.setAttribute("aria-hidden", "true");
  preload.style.cssText = "position:fixed;width:1px;height:1px;overflow:hidden;visibility:hidden;pointer-events:none;contain:strict";
  document.body.append(preload);
  let timeout: ReturnType<typeof setTimeout>;
  let abort = () => {};
  try {
    return await Promise.race([
      image.decode().then(() => !signal.aborted).catch(() => false),
      new Promise<boolean>(resolve => {
        timeout = setTimeout(() => resolve(false), 1500);
        abort = () => resolve(false);
        signal.addEventListener("abort", abort, { once: true });
      }),
    ]);
  } finally {
    clearTimeout(timeout!);
    signal.removeEventListener("abort", abort);
    preload.remove();
  }
}

document.addEventListener("astro:before-preparation", event => {
  if (!isTransitionBeforePreparationEvent(event)) return;
  document.querySelectorAll<HTMLElement>("[data-project-cover]").forEach(cover => {
    cover.style.removeProperty("view-transition-name");
  });
  // History uses the router's scroll restoration and a normal page swap.
  // Explicit links from home, the listing and adjacent-project cards share a cover.
  const fromPath = event.from.pathname.replace(/\/$/, "") || "/";
  const fromProject = /^\/work\/[^/]+$/.test(fromPath);
  if (event.navigationType === "traverse" || (!fromProject && !["/", "/work"].includes(fromPath))) return;
  const match = event.to.pathname.match(/^\/work\/([^/]+)\/?$/);
  if (!match || !document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const load = event.loader;
  event.loader = async () => {
    await load();
    if (event.signal.aborted || event.defaultPrevented) return;
    const selector = `[data-project-cover="${CSS.escape(match[1])}"]`;
    const source = document.querySelector<HTMLElement>(selector);
    const target = event.newDocument.querySelector<HTMLElement>(selector);
    if (!source || !target) return;
    const rect = source.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= innerHeight || !rect.width) return;
    if (!await preparePicture(target, event.signal)) return;
    const image = source.querySelector("img");
    if (!image?.complete || !image.naturalWidth || event.signal.aborted) return;
    source.style.viewTransitionName = "project-cover";
    target.style.viewTransitionName = "project-cover";
  };
});

document.addEventListener("astro:before-swap", event => {
  // Keep the name for the new snapshot, then clear it after the animation so
  // unrelated navigation never gets a lone cover fade.
  const transition = (event as import("astro:transitions/client").TransitionBeforeSwapEvent).viewTransition;
  void transition.finished.then(() => {
    document.querySelectorAll<HTMLElement>("[data-project-cover]").forEach(cover => {
      cover.style.removeProperty("view-transition-name");
    });
  });
});
