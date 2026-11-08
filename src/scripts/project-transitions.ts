import { experimentsPath, languagePath, withoutLanguage, workPath } from "../i18n/routes";
import { isTransitionBeforePreparationEvent, isTransitionBeforeSwapEvent } from "astro:transitions/client";
import { shouldAnimate } from "./motion";

const coverImageProperty = "--project-cover-image";

function isWorkListing(pathname: string) {
  const path = languagePath(pathname, "pl");
  return path === workPath || path === experimentsPath;
}

// Decode the same responsive picture the destination will display before capture.
// A detached document does not load its images, so use a hidden, inert clone.
async function preparePicture(cover: HTMLElement, signal: AbortSignal) {
  const picture = cover.querySelector("picture");
  if (!picture) return null;
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
      image.decode().then(() => image.currentSrc, () => null),
      new Promise<null>(resolve => {
        // Keep navigation responsive if the larger cover is slow to load.
        timeout = setTimeout(() => resolve(null), 300);
        abort = () => resolve(null);
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
  if (event.navigationType === "traverse") return;
  const fromProject = document.querySelector("main .case-study");
  const fromPath = event.from.pathname;
  if (!fromProject && withoutLanguage(fromPath) !== "/" && !isWorkListing(fromPath)) return;
  const slug = withoutLanguage(event.to.pathname).slice(1);
  if (!slug || slug.includes("/") || !document.startViewTransition || !shouldAnimate()) return;
  const selector = `[data-project-cover="${CSS.escape(slug)}"]`;
  const source = event.sourceElement?.querySelector<HTMLElement>(selector);
  const image = source?.querySelector("img");
  if (!source || !image) return;

  const load = event.loader;
  event.loader = async () => {
    await load();
    if (event.signal.aborted || event.defaultPrevented) return;
    const target = event.newDocument.querySelector<HTMLElement>(selector);
    if (!target || !image.complete || !image.naturalWidth) return;
    const rect = source.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= innerHeight || !rect.width) return;
    const coverUrl = await preparePicture(target, event.signal);
    if (!coverUrl || event.signal.aborted || !shouldAnimate()) return;
    event.newDocument.documentElement.style.setProperty(coverImageProperty, `url(${JSON.stringify(coverUrl)})`);
    source.style.viewTransitionName = "project-cover";
    target.style.viewTransitionName = "project-cover";
  };
});

document.addEventListener("astro:before-swap", event => {
  if (!isTransitionBeforeSwapEvent(event)) return;
  const cover = [...event.newDocument.querySelectorAll<HTMLElement>("[data-project-cover]")]
    .find(cover => cover.style.viewTransitionName === "project-cover");
  if (!cover) return;
  const clearCover = () => {
    cover.style.removeProperty("view-transition-name");
    if (cover.isConnected) document.documentElement.style.removeProperty(coverImageProperty);
  };
  void event.viewTransition.finished.then(clearCover, clearCover);
});
