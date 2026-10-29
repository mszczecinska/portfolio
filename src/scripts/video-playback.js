// ClientRouter inserts a document parsed with DOMParser. Reapply playback state
// after the swap: browsers may not start these videos from HTML attributes alone.
export function startAutoplayVideos(root = document) {
  for (const video of root.querySelectorAll("video[autoplay]")) {
    video.muted = video.hasAttribute("muted");

    if (video.readyState === 0) video.load();

    // Keep playback available when browser policy prevents automatic playback.
    void video.play().catch(() => {
      if (video.isConnected) video.controls = true;
    });
  }
}
