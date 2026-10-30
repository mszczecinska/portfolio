import { uiText } from "../../../i18n/ui";
export function setupHypothesisCards() {
  document.querySelectorAll<HTMLElement>(".security-cards, .newbies-cards").forEach(root => {
    if (root.dataset.tabsInitialized) return;
    root.dataset.tabsInitialized = "true";
    const security = root.classList.contains("security-cards");
    const prefix = security ? "security" : "newbies";
    const tabAttribute = security ? "data-tab" : "data-newbies-tab";
    const panelAttribute = security ? "data-panel" : "data-newbies-panel";
    const buttons = [...root.querySelectorAll<HTMLButtonElement>(`[${tabAttribute}]`)];
    const panels = [...root.querySelectorAll<HTMLElement>(`[${panelAttribute}]`)];
    root.querySelector("nav")?.setAttribute("role", "tablist");

    buttons.forEach(button => {
      const key = button.getAttribute(tabAttribute);
      button.id = `${prefix}-tab-${key}`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", `${prefix}-panel-${key}`);
    });

    panels.forEach(panel => {
      const key = panel.getAttribute(panelAttribute);
      panel.id = `${prefix}-panel-${key}`;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", `${prefix}-tab-${key}`);
      const grid = panel.querySelector<HTMLElement>(".security-grid, .newbies-grid");
      if (!grid) return;
      grid.id = `${prefix}-cards-${key}`;
      grid.tabIndex = 0;
      grid.setAttribute("role", "group");
      grid.setAttribute("aria-label", uiText("Karty koncepcji — przewijaj strzałkami"));
      const cards = [...grid.querySelectorAll<HTMLElement>("article")];
      const controls = document.createElement("div");
      controls.className = "hypothesis-pages";
      controls.setAttribute("role", "group");
      controls.setAttribute("aria-label", uiText("Wybierz kartę"));
      const step = () => (cards[0]?.getBoundingClientRect().width || 1) + (parseFloat(getComputedStyle(grid).columnGap) || 0);
      const current = () => Math.round(grid.scrollLeft / step());
      const goTo = (index: number) => {
        const target = Math.max(0, Math.min(cards.length - 1, index));
        grid.scrollTo({ left: target * step(), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      };
      cards.forEach((card, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", `${uiText("Karta")} ${index + 1}: ${card.querySelector("h3")?.textContent ?? ""}`);
        button.setAttribute("aria-controls", grid.id);
        button.setAttribute("aria-pressed", String(index === 0));
        const dot = document.createElement("span");
        dot.setAttribute("aria-hidden", "true");
        button.append(dot);
        button.addEventListener("click", () => goTo(index));
        controls.append(button);
      });
      panel.append(controls);
      grid.addEventListener("scroll", () => {
        [...controls.children].forEach((button, index) => button.setAttribute("aria-pressed", String(index === current())));
      }, { passive: true });
      grid.addEventListener("keydown", event => {
        if (matchMedia("(min-width: 64rem)").matches) return;
        const targets: Record<string, number> = { ArrowLeft: current() - 1, ArrowRight: current() + 1, Home: 0, End: cards.length - 1 };
        if (event.key in targets) { event.preventDefault(); goTo(targets[event.key]); }
      });
    });

    const activate = (index: number, focus = false) => {
      const key = buttons[index].getAttribute(tabAttribute);
      buttons.forEach((button, i) => {
        button.classList.toggle("is-active", i === index);
        button.setAttribute("aria-selected", String(i === index));
        button.tabIndex = i === index ? 0 : -1;
      });
      panels.forEach(panel => {
        const active = panel.getAttribute(panelAttribute) === key;
        panel.hidden = !active;
        panel.classList.toggle("hidden", !active);
      });
      if (focus) {
        buttons[index].focus();
        buttons[index].scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    };
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => activate(index));
      button.addEventListener("keydown", event => {
        const targets: Record<string, number> = { ArrowLeft: (index - 1 + buttons.length) % buttons.length, ArrowRight: (index + 1) % buttons.length, Home: 0, End: buttons.length - 1 };
        if (event.key in targets) { event.preventDefault(); activate(targets[event.key], true); }
      });
    });
    activate(0);
  });
}
