import { shouldAnimate } from "./motion";

export function setupHomeServices() {
  const root = document.querySelector<HTMLElement>("[data-home-services]");
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = "true";
  const buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-service-trigger]")];
  const panels = [...root.querySelectorAll<HTMLElement>("[data-service-preview]")];
  const rows = buttons.map(button => button.closest<HTMLElement>(".service")!);
  const stage = root.querySelector<HTMLElement>("[data-service-stage]")!;
  const content = root.querySelector<HTMLElement>(".services-content")!;
  const desktop = matchMedia("(min-width: 64rem)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const listeners = new AbortController();
  const { signal } = listeners;
  const players = [...root.querySelectorAll<HTMLVideoElement>("video")].map(video => ({
    video,
    index: panels.indexOf(video.closest<HTMLElement>("[data-service-preview]")!),
  }));
  let selected = -1;
  let nearby = false;
  let contentAnimations: Animation[] = [];
  const rowAnimations = new Map<HTMLElement, Animation>();

  const loadVideo = (video: HTMLVideoElement) => {
    if (video.dataset.loaded) return;
    video.querySelectorAll<HTMLSourceElement>("source[data-src]").forEach(source => {
      source.src = source.dataset.src!;
    });
    video.dataset.loaded = "true";
    video.load();
  };
  const videoIsVisible = (index: number) => nearby && !document.hidden && selected === index;
  const updatePlayback = () => {
    players.forEach(({ video, index }) => {
      if (!videoIsVisible(index)) { video.pause(); return; }
      loadVideo(video);
      if (reducedMotion.matches) { video.pause(); return; }
      void video.play().then(() => {
        if (signal.aborted || !videoIsVisible(index) || reducedMotion.matches) video.pause();
      }).catch(() => { /* Native controls remain available when autoplay is blocked. */ });
    });
  };
  const positionStage = (index: number, animate: boolean) => {
    stage.style.transition = animate ? "" : "none";
    stage.classList.toggle("is-visible", index >= 0);
    if (index < 0) return;
    const top = rows[index].offsetTop + (rows[index].offsetHeight - stage.offsetHeight) / 2;
    const bounded = Math.max(0, Math.min(top, content.offsetHeight - stage.offsetHeight));
    stage.style.transform = `translateY(${bounded}px)`;
  };
  const select = (index: number, animate: boolean) => {
    const previous = selected;
    const previousHeights = rows.map(row => row.getBoundingClientRect().height);
    rowAnimations.forEach(animation => animation.cancel());
    rowAnimations.clear();
    rows.forEach(row => { row.style.overflow = ""; });
    contentAnimations.forEach(animation => animation.cancel());
    contentAnimations = [];
    buttons.forEach((button, i) => button.setAttribute("aria-expanded", String(i === index)));
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
      panel.inert = i !== index;
      panel.setAttribute("aria-hidden", String(i !== index));
    });
    selected = index;
    if (desktop.matches) {
      positionStage(index, animate);
      // Keep the outgoing image just long enough to blend into the next one.
      if (previous >= 0 && previous !== index && animate) {
        const outgoing = panels[previous];
        outgoing.hidden = false;
        const exit = outgoing.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 160, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards",
        });
        contentAnimations.push(exit);
        exit.onfinish = () => {
          if (selected !== previous) outgoing.hidden = true;
        };
      }
    } else if (animate) {
      // Mobile is an accordion; desktop rows keep exactly the same height.
      rows.forEach((row, i) => {
        const height = row.getBoundingClientRect().height;
        if (Math.abs(previousHeights[i] - height) < 1) return;
        row.style.overflow = "clip";
        const transition = row.animate([{ height: `${previousHeights[i]}px` }, { height: `${height}px` }], {
          duration: 240, easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        });
        rowAnimations.set(row, transition);
        transition.onfinish = () => {
          if (rowAnimations.get(row) !== transition) return;
          row.style.overflow = "";
          rowAnimations.delete(row);
        };
      });
    }
    if (index >= 0 && animate) {
      contentAnimations.push(panels[index].animate(
        [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 280, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      ));
    }
    updatePlayback();
  };
  const syncLayout = () => {
    select(-1, false);
    panels.forEach((panel, i) => {
      if (desktop.matches) stage.append(panel);
      else rows[i].insertBefore(panel, rows[i].querySelector(".service-project-link"));
    });
  };
  buttons.forEach((button, index) => {
    button.disabled = false;
    rows[index].addEventListener("pointerenter", event => {
      if (!desktop.matches || !finePointer.matches || event.pointerType === "touch" || selected === index) return;
      select(index, shouldAnimate());
    }, { signal });
    button.addEventListener("focus", () => {
      if (desktop.matches && selected !== index) select(index, false);
    }, { signal });
    button.addEventListener("click", () => {
      if (selected === index && desktop.matches) return;
      select(selected === index ? -1 : index, shouldAnimate());
    }, { signal });
    rows[index].addEventListener("click", event => {
      if (desktop.matches || (event.target as Element).closest("a, button, video, [data-service-preview]")) return;
      select(selected === index ? -1 : index, shouldAnimate());
    }, { signal });
    button.addEventListener("keydown", event => {
      const targets: Record<string, number> = { ArrowDown: (index + 1) % buttons.length, ArrowUp: (index - 1 + buttons.length) % buttons.length, Home: 0, End: buttons.length - 1 };
      if (!(event.key in targets)) return;
      event.preventDefault();
      buttons[targets[event.key]].focus();
    }, { signal });
  });
  root.addEventListener("pointerleave", () => {
    if (!desktop.matches || !finePointer.matches) return;
    const focused = buttons.findIndex(button => button.closest(".service")!.contains(document.activeElement) && !!document.activeElement?.matches(":focus-visible"));
    select(focused, shouldAnimate());
  }, { signal });
  root.addEventListener("focusout", event => {
    if (desktop.matches && !root.contains(event.relatedTarget as Node | null) && !root.matches(":hover")) select(-1, false);
  }, { signal });
  window.addEventListener("resize", () => {
    if (desktop.matches && selected >= 0) positionStage(selected, false);
  }, { signal });
  desktop.addEventListener("change", syncLayout, { signal });
  document.addEventListener("visibilitychange", updatePlayback, { signal });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) select(selected, false);
    updatePlayback();
  }, { signal });
  const observer = new IntersectionObserver(([entry]) => {
    nearby = entry.isIntersecting;
    updatePlayback();
  }, { threshold: 0.1 });
  observer.observe(root);
  syncLayout();
  document.addEventListener("astro:before-swap", () => {
    listeners.abort();
    observer.disconnect();
    contentAnimations.forEach(animation => animation.cancel());
    rowAnimations.forEach(animation => animation.cancel());
    players.forEach(({ video }) => video.pause());
  }, { once: true });
}
