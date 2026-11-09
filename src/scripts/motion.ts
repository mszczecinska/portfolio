// Keep pointer interactions expressive and keyboard actions immediate, including
// the synthetic click fired by Enter/Space and Astro's subsequent page swap.
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let keyboardInput = false;

function syncInput() {
  document.documentElement.dataset.motionInput = keyboardInput ? "keyboard" : "pointer";
}

function setInput(keyboard: boolean) {
  if (keyboardInput === keyboard) return;
  keyboardInput = keyboard;
  syncInput();
}

document.addEventListener("keydown", event => {
  if (["Shift", "Control", "Alt", "Meta"].includes(event.key)) return;
  setInput(true);
}, { capture: true });
document.addEventListener("pointerdown", () => setInput(false), { capture: true });
document.addEventListener("pointermove", () => setInput(false), { capture: true, passive: true });
document.addEventListener("wheel", () => setInput(false), { capture: true, passive: true });
document.addEventListener("click", event => setInput(event.detail === 0), { capture: true });
document.addEventListener("astro:after-swap", syncInput);

export function shouldAnimate() {
  return !reducedMotion.matches && !keyboardInput;
}
