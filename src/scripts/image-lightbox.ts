type Point = { x: number; y: number };

export function setupImageLightbox(dialog: HTMLDialogElement) {
  const controller = new AbortController();
  const { signal } = controller;
  const stage = dialog.querySelector<HTMLElement>("[data-lightbox-stage]")!;
  const image = dialog.querySelector<HTMLImageElement>("[data-lightbox-image]")!;
  const title = dialog.querySelector<HTMLElement>("[data-lightbox-title]")!;
  const message = dialog.querySelector<HTMLElement>("[data-lightbox-message]")!;
  const status = dialog.querySelector<HTMLElement>("[data-lightbox-status]")!;
  const original = dialog.querySelector<HTMLAnchorElement>("[data-lightbox-original]")!;
  const zoomIn = dialog.querySelector<HTMLButtonElement>("[data-zoom-in]")!;
  const zoomOut = dialog.querySelector<HTMLButtonElement>("[data-zoom-out]")!;
  const reset = dialog.querySelector<HTMLButtonElement>("[data-zoom-reset]")!;
  const level = dialog.querySelector<HTMLOutputElement>("[data-zoom-level]")!;
  let trigger: HTMLAnchorElement | null = null;
  let pageOverflow = "";
  let pagePadding = "";
  let ready = false;
  let zoom = 1;
  let maxZoom = 6;
  let width = 0;
  let height = 0;
  let x = 0;
  let y = 0;
  const pointers = new Map<number, Point>();
  let pointerStart: Point = { x: 0, y: 0 };
  let moved = false;
  let startedOnBackground = false;
  let zoomAnimation: Animation | null = null;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  const render = (duration = 0) => {
    const from = duration && ready && !image.hidden && !reducedMotion.matches
      ? getComputedStyle(image).transform : null;
    zoomAnimation?.cancel();
    zoomAnimation = null;
    x = Math.max(-Math.max(0, (width * zoom - stage.clientWidth) / 2), Math.min(Math.max(0, (width * zoom - stage.clientWidth) / 2), x));
    y = Math.max(-Math.max(0, (height * zoom - stage.clientHeight) / 2), Math.min(Math.max(0, (height * zoom - stage.clientHeight) / 2), y));
    image.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${zoom})`;
    if (from && from !== image.style.transform) {
      const animation = image.animate([
        { transform: from },
        { transform: image.style.transform },
      ], { duration, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
      zoomAnimation = animation;
      animation.onfinish = () => { if (zoomAnimation === animation) zoomAnimation = null; };
    }
    stage.toggleAttribute("data-zoomed", zoom > 1.001);
    level.value = `${Math.round(zoom * 100)}%`;
    zoomIn.disabled = !ready || zoom >= maxZoom - .001;
    zoomOut.disabled = !ready || zoom <= 1.001;
    reset.disabled = !ready;
  };
  const fit = (duration = 0) => {
    if (!ready) return;
    const ratio = Math.min((stage.clientWidth - 32) / image.naturalWidth, (stage.clientHeight - 32) / image.naturalHeight, 1);
    width = image.naturalWidth * ratio;
    height = image.naturalHeight * ratio;
    maxZoom = Math.max(4, Math.min(12, 2 / ratio));
    image.style.width = `${width}px`;
    image.style.height = `${height}px`;
    zoom = Math.min(zoom, maxZoom);
    render(duration);
  };
  const setZoom = (value: number, point?: Point, duration = 180) => {
    if (!ready) return;
    const next = Math.max(1, Math.min(maxZoom, value));
    const rect = stage.getBoundingClientRect();
    const px = point ? point.x - rect.left - rect.width / 2 : 0;
    const py = point ? point.y - rect.top - rect.height / 2 : 0;
    const ratio = next / zoom;
    x = px - (px - x) * ratio;
    y = py - (py - y) * ratio;
    zoom = next;
    render(duration);
  };
  const resetView = (duration = 0) => { zoom = 1; x = y = 0; fit(duration); };
  const restorePage = () => {
    zoomAnimation?.cancel();
    zoomAnimation = null;
    document.documentElement.style.overflow = pageOverflow;
    document.body.style.paddingRight = pagePadding;
    pointers.clear();
    stage.removeAttribute("data-dragging");
    ready = false;
    image.hidden = true;
    image.removeAttribute("src");
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    trigger = null;
  };

  document.addEventListener("click", event => {
    if (!(event.target instanceof Element) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest<HTMLAnchorElement>("[data-image-zoom]");
    if (!link || dialog.open) return;
    event.preventDefault();
    trigger = link;
    title.textContent = link.dataset.imageLabel || "Podgląd obrazu";
    image.alt = title.textContent;
    message.hidden = false;
    status.textContent = "Wczytywanie obrazu…";
    original.href = link.href;
    original.hidden = true;
    stage.setAttribute("aria-busy", "true");
    ready = false;
    image.hidden = true;
    zoom = 1;
    x = y = 0;
    render();
    pageOverflow = document.documentElement.style.overflow;
    pagePadding = document.body.style.paddingRight;
    const scrollbar = innerWidth - document.documentElement.clientWidth;
    if (scrollbar) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
    image.src = link.href;
  }, { signal });

  image.addEventListener("load", () => {
    if (!dialog.open) return;
    ready = true;
    message.hidden = true;
    stage.setAttribute("aria-busy", "false");
    resetView();
    image.hidden = false;
  }, { signal });
  image.addEventListener("error", () => {
    if (!dialog.open) return;
    ready = false;
    stage.setAttribute("aria-busy", "false");
    status.textContent = "Nie udało się wczytać obrazu.";
    original.hidden = false;
    render();
  }, { signal });
  dialog.querySelector("[data-lightbox-close]")!.addEventListener("click", () => dialog.close(), { signal });
  dialog.addEventListener("close", restorePage, { signal });
  // Native dialog handles Escape, focus containment and background inertness.
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); }, { signal });
  zoomIn.addEventListener("click", () => setZoom(zoom * 1.5), { signal });
  zoomOut.addEventListener("click", () => setZoom(zoom / 1.5), { signal });
  reset.addEventListener("click", () => resetView(180), { signal });
  stage.addEventListener("wheel", event => {
    if (!ready) return;
    event.preventDefault();
    setZoom(zoom * Math.exp(-event.deltaY * .002), { x: event.clientX, y: event.clientY }, 100);
  }, { signal, passive: false });

  const center = (points: Point[]): Point => ({ x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 });
  const distance = (points: Point[]) => Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  stage.addEventListener("pointerdown", event => {
    if (!ready || event.button !== 0) return;
    event.preventDefault();
    // Continue from the displayed position when a drag interrupts a zoom.
    // Touch gestures should follow the fingers immediately, without easing.
    if (zoomAnimation) {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(image).transform);
      zoom = matrix.a;
      x = matrix.e + width / 2;
      y = matrix.f + height / 2;
      render();
    }
    if (!pointers.size) {
      pointerStart = { x: event.clientX, y: event.clientY };
      moved = false;
      startedOnBackground = event.target === stage;
    } else moved = true;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    stage.setPointerCapture(event.pointerId);
    stage.setAttribute("data-dragging", "");
  }, { signal });
  stage.addEventListener("pointermove", event => {
    const old = pointers.get(event.pointerId);
    if (!old) return;
    const before = [...pointers.values()];
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 4) moved = true;
    if (pointers.size === 2) {
      const after = [...pointers.values()];
      const from = center(before);
      const to = center(after);
      setZoom(zoom * distance(after) / Math.max(1, distance(before)), from, 0);
      x += to.x - from.x;
      y += to.y - from.y;
    } else if (pointers.size === 1) {
      x += event.clientX - old.x;
      y += event.clientY - old.y;
    }
    render();
  }, { signal });
  const releasePointer = (event: PointerEvent) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.delete(event.pointerId);
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    if (pointers.size) return;
    stage.removeAttribute("data-dragging");
    if (!moved && event.type === "pointerup") {
      if (startedOnBackground) dialog.close();
      else setZoom(zoom > 1.001 ? 1 : 2, { x: event.clientX, y: event.clientY });
    }
  };
  stage.addEventListener("pointerup", releasePointer, { signal });
  stage.addEventListener("pointercancel", releasePointer, { signal });
  stage.addEventListener("lostpointercapture", event => {
    pointers.delete(event.pointerId);
    if (!pointers.size) stage.removeAttribute("data-dragging");
  }, { signal });
  dialog.addEventListener("keydown", event => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (["+", "=", "-", "0", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) event.preventDefault();
    if (event.key === "+" || event.key === "=") setZoom(zoom * 1.5);
    else if (event.key === "-") setZoom(zoom / 1.5);
    else if (event.key === "0") resetView(180);
    else if (event.key === "ArrowLeft") { x += 60; render(140); }
    else if (event.key === "ArrowRight") { x -= 60; render(140); }
    else if (event.key === "ArrowUp") { y += 60; render(140); }
    else if (event.key === "ArrowDown") { y -= 60; render(140); }
  }, { signal });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      zoomAnimation?.cancel();
      zoomAnimation = null;
    }
  }, { signal });
  const observer = new ResizeObserver(() => { if (dialog.open && ready) fit(); });
  observer.observe(stage);

  return () => {
    if (dialog.open) { dialog.close(); restorePage(); }
    observer.disconnect();
    controller.abort();
  };
}
