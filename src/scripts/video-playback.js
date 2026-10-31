import { uiText } from "../i18n/ui";
// Native autoplay and controls handle the initial HTML. This controller restores
// playback after ClientRouter swaps, pauses distant videos, and offers a visible
// manual fallback when a browser blocks automatic playback.
export function startAutoplayVideos(root = document) {
  const videos = [...root.querySelectorAll("video[data-autoplay]")];
  const nearby = new Set();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const listeners = new AbortController();
  const { signal } = listeners;
  let disposed = false;

  const play = async (video, manual = false) => {
    if (disposed || (!manual && (document.hidden || reducedMotion.matches))) return;
    video.muted = true;
    // DOMParser-created videos may need an explicit load after a page swap.
    if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load();
    try {
      await video.play();
      if (disposed || document.hidden) video.pause();
    } catch {
      // Controls and the explicit play button remain available for another try.
      video.controls = true;
    }
  };
  const updatePlayback = () => {
    for (const video of nearby) {
      if (document.hidden || reducedMotion.matches) video.pause();
      else void play(video);
    }
  };

  for (const video of videos) {
    video.muted = true;
    video.controls = true;
    const player = video.closest("[data-video-player]");
    const button = player?.querySelector("[data-video-play]");
    const errorMessage = player?.querySelector("[data-video-error]");
    const showError = () => {
      if (button) button.hidden = false;
      if (!errorMessage) return;
      const text = errorMessage.querySelector("[data-video-error-message]");
      const messages = {
        2: uiText("Nie udało się pobrać filmu."),
        3: uiText("Przeglądarka nie mogła odczytać filmu."),
        4: uiText("Przeglądarka nie obsługuje dostępnych formatów filmu."),
      };
      if (text) text.textContent = messages[video.error?.code] ?? uiText("Nie udało się odtworzyć filmu.");
      errorMessage.hidden = false;
    };
    const updateButton = () => {
      if (button) button.hidden = !video.paused && !video.ended;
    };
    video.addEventListener("playing", updateButton, { signal });
    video.addEventListener("pause", updateButton, { signal });
    video.addEventListener("ended", updateButton, { signal });
    video.addEventListener("error", showError, { signal });
    video.addEventListener("playing", () => {
      if (errorMessage) errorMessage.hidden = true;
    }, { signal });
    button?.addEventListener("click", () => void play(video, true), { signal });
    if (reducedMotion.matches) {
      video.autoplay = false;
      video.pause();
    }
    updateButton();
    // A source can fail before this module initializes on a full reload.
    if (video.error) showError();
  }

  const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver(entries => {
    for (const { target: video, isIntersecting } of entries) {
      if (isIntersecting) {
        nearby.add(video);
        void play(video);
      } else {
        nearby.delete(video);
        video.pause();
      }
    }
  }, { rootMargin: "300px 0px" }) : null;

  for (const video of videos) {
    if (observer) observer.observe(video);
    else {
      nearby.add(video);
      void play(video);
    }
  }
  document.addEventListener("visibilitychange", updatePlayback, { signal });
  reducedMotion.addEventListener("change", updatePlayback, { signal });

  return () => {
    disposed = true;
    observer?.disconnect();
    listeners.abort();
    videos.forEach(video => video.pause());
    nearby.clear();
  };
}
