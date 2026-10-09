function qs<T extends Element>(sel: string, root: ParentNode = document) {
  return root.querySelector<T>(sel);
}

function qsa<T extends Element>(sel: string, root: ParentNode = document) {
  return [...root.querySelectorAll<T>(sel)];
}

let zTop = 20;
let focusedId: string | null = null;

function focusWindow(win: HTMLElement) {
  zTop += 1;
  win.style.zIndex = String(zTop);
  win.classList.add("is-focused");
  focusedId = win.dataset.winId ?? null;
  qsa<HTMLElement>(".os-win").forEach((w) => {
    if (w !== win) w.classList.remove("is-focused");
  });
  const id = win.dataset.winId;
  if (id) {
    qsa<HTMLElement>(".os-taskbar__btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.winId === id && !win.hidden);
    });
  }
}

export function openWindow(id: string) {
  const win = qs<HTMLElement>(`.os-win[data-win-id="${id}"]`);
  if (!win) return;
  win.hidden = false;
  win.removeAttribute("aria-hidden");
  win.classList.add("is-open");
  focusWindow(win);
  qs<HTMLElement>(`.os-taskbar__btn[data-win-id="${id}"]`)?.classList.add("is-active");
  win.dispatchEvent(new CustomEvent("os:open"));
  playBlip();
}

function closeWindow(id: string) {
  const win = qs<HTMLElement>(`.os-win[data-win-id="${id}"]`);
  if (!win) return;
  win.hidden = true;
  win.setAttribute("aria-hidden", "true");
  win.classList.remove("is-open", "is-focused");
  qs<HTMLElement>(`.os-taskbar__btn[data-win-id="${id}"]`)?.classList.remove("is-active");
  if (focusedId === id) focusedId = null;
  playBlip(180);
}

function minimizeWindow(id: string) {
  closeWindow(id);
}

function toggleWindow(id: string) {
  const win = qs<HTMLElement>(`.os-win[data-win-id="${id}"]`);
  if (!win) return;
  if (win.hidden) openWindow(id);
  else if (win.classList.contains("is-focused")) minimizeWindow(id);
  else focusWindow(win);
}

function closeAllWindows() {
  qsa<HTMLElement>(".os-win").forEach((win) => {
    const id = win.dataset.winId;
    if (id && !win.hidden) closeWindow(id);
  });
  qsa(".os-icon").forEach((i) => i.classList.remove("is-selected"));
}

function playBlip(freq = 520) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.value = freq;
    g.gain.value = 0.04;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, 60);
  } catch {
    /* no audio */
  }
}

function initWindowControls() {
  qsa<HTMLButtonElement>("[data-win-close]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-win-close");
      if (id) closeWindow(id);
    });
  });

  qsa<HTMLButtonElement>("[data-win-min]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-win-min");
      if (id) minimizeWindow(id);
    });
  });

  qsa<HTMLElement>(".os-win").forEach((win) => {
    win.addEventListener("mousedown", (e) => {
      if ((e.target as HTMLElement).closest("[data-win-close],[data-win-min]")) return;
      focusWindow(win);
    });
  });
}

function initDrag() {
  qsa<HTMLElement>(".os-win").forEach((win) => {
    const handle = qs<HTMLElement>("[data-drag-handle]", win);
    if (!handle) return;

    let sx = 0;
    let sy = 0;
    let ox = 0;
    let oy = 0;

    handle.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      focusWindow(win);
      const rect = win.getBoundingClientRect();
      const desk = qs<HTMLElement>(".os-desktop")!.getBoundingClientRect();
      ox = rect.left - desk.left;
      oy = rect.top - desk.top;
      sx = e.clientX;
      sy = e.clientY;

      const move = (ev: PointerEvent) => {
        const nx = ox + (ev.clientX - sx);
        const ny = oy + (ev.clientY - sy);
        win.style.left = `${Math.max(8, nx)}px`;
        win.style.top = `${Math.max(8, ny)}px`;
      };
      const up = () => {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
      };
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
    });
  });
}

function initIcons() {
  qsa<HTMLElement>(".os-icon").forEach((icon) => {
    const id = icon.dataset.appId;
    const type = icon.dataset.appType;
    const href = icon.dataset.appHref;

    const activate = () => {
      qsa(".os-icon").forEach((i) => i.classList.remove("is-selected"));
      icon.classList.add("is-selected");
    };

    const launch = () => {
      activate();
      if (type === "link" && href) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }
      if (id) openWindow(id);
    };

    icon.addEventListener("dblclick", (e) => {
      e.preventDefault();
      launch();
    });

    icon.addEventListener("click", () => activate());
  });
}

function initProofLinks() {
  qsa<HTMLElement>("[data-open-win]").forEach((el) => {
    const open = () => {
      const id = el.dataset.openWin;
      if (id) openWindow(id);
    };
    el.addEventListener("click", open);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });
}

function initTaskbar() {
  qsa<HTMLElement>(".os-taskbar__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.winId;
      if (id) toggleWindow(id);
    });
  });

  qs<HTMLElement>("#show-desktop")?.addEventListener("click", closeAllWindows);
}

function initStartMenu() {
  const menu = qs<HTMLElement>("#start-menu");
  const toggle = qs<HTMLElement>("#start-btn");
  if (!menu || !toggle) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    playBlip(440);
  });

  document.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("#start-menu, #start-btn")) return;
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  });

  menu.addEventListener("click", (e) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>("[data-open-win]");
    if (!item) return;
    e.stopPropagation();
    const id = item.dataset.openWin;
    if (id) openWindow(id);
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  });
}

function initContextMenu() {
  const menu = qs<HTMLElement>("#ctx-menu");
  const desktop = qs<HTMLElement>(".os-desktop");
  if (!menu || !desktop) return;

  desktop.addEventListener("contextmenu", (e) => {
    if ((e.target as HTMLElement).closest(".os-win")) return;
    e.preventDefault();
    menu.hidden = false;
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
  });

  document.addEventListener("click", () => {
    menu.hidden = true;
  });

  menu.addEventListener("click", (e) => {
    const action = (e.target as HTMLElement).closest<HTMLElement>("[data-ctx]");
    if (!action) return;
    const kind = action.dataset.ctx;
    if (kind === "about") openWindow("about");
    if (kind === "projects") openWindow("projects");
    if (kind === "refresh") {
      qsa(".os-icon").forEach((i) => i.classList.remove("is-selected"));
      playBlip(300);
    }
    if (kind === "desktop") closeAllWindows();
    menu.hidden = true;
  });
}

function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    if (document.getElementById("os-boot")) return;
    if (e.key === "Escape" && focusedId) {
      closeWindow(focusedId);
    }
    if (e.altKey && e.key.toLowerCase() === "d") {
      e.preventDefault();
      closeAllWindows();
    }
  });
}

function enterDesktop() {
  const boot = qs<HTMLElement>("#os-boot");
  if (!boot || boot.classList.contains("is-done")) return;
  boot.classList.add("is-done");
  window.setTimeout(() => boot.remove(), 500);
  openWindow("about");
  playBlip(520);
}

function initBoot() {
  const boot = qs<HTMLElement>("#os-boot");
  if (!boot) return;

  const enterBtn = qs<HTMLButtonElement>("#boot-enter", boot);
  const fill = qs<HTMLElement>("#boot-progress-fill", boot);
  const label = qs<HTMLElement>("#boot-progress-label", boot);
  const lines = qsa<HTMLElement>("[data-boot-line]", boot);

  const go = (e?: Event) => {
    e?.preventDefault();
    e?.stopPropagation();
    enterDesktop();
  };

  boot.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-boot-action='enter'], #boot-enter, #boot-skip")) go(e);
  });

  document.addEventListener(
    "keydown",
    (e) => {
      if (!boot.isConnected) return;
      if (e.key === "Escape" || e.key === "Enter") go(e);
    },
    true,
  );

  const setProgress = (pct: number) => {
    const n = Math.min(100, Math.max(0, pct));
    if (fill) fill.style.width = `${n}%`;
    if (label) label.textContent = `${Math.round(n)}%`;
  };

  const finishBoot = () => {
    setProgress(100);
    enterBtn?.classList.add("is-ready");
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || lines.length === 0) {
    lines.forEach((l) => l.classList.add("is-visible"));
    finishBoot();
    return;
  }

  let step = 0;
  const total = lines.length;
  if (lines[0]?.classList.contains("is-visible") && total > 0) {
    setProgress((1 / total) * 100);
    step = 1;
  }

  const tick = () => {
    if (step < total) {
      lines[step].classList.add("is-visible");
      setProgress(((step + 1) / total) * 100);
      step += 1;
      window.setTimeout(tick, 320);
    } else {
      finishBoot();
    }
  };

  window.setTimeout(tick, 200);
  window.setTimeout(finishBoot, 3500);
}

function initExplorer() {
  const root = qs<HTMLElement>('[data-win-id="projects"]');
  if (!root) return;
  const items = qsa<HTMLElement>(".explorer__item", root);
  const panels = qsa<HTMLElement>(".explorer__panel", root);

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const pid = item.dataset.projectId;
      items.forEach((i) => i.classList.remove("is-active"));
      item.classList.add("is-active");
      panels.forEach((p) => {
        p.hidden = p.dataset.projectPanel !== pid;
      });
      playBlip(640);
    });
  });
}

function initTerminal() {
  const input = qs<HTMLInputElement>("#term-input");
  const out = qs<HTMLElement>("#term-out");
  if (!input || !out) return;

  const lines: string[] = [
    "SAN/OS terminal v1.0",
    "Type help for commands.",
  ];
  const render = () => {
    out.textContent = lines.join("\n");
    out.scrollTop = out.scrollHeight;
  };
  render();

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const cmd = input.value.trim().toLowerCase();
    lines.push(`> ${input.value.trim()}`);
    input.value = "";

    if (cmd === "help") {
      lines.push("help | about | projects | wins | contact | clear | whoami");
    } else if (cmd === "about") {
      openWindow("about");
      lines.push("Opening About Me...");
    } else if (cmd === "projects") {
      openWindow("projects");
      lines.push("Opening Projects explorer...");
    } else if (cmd === "wins") {
      openWindow("wins");
      lines.push("Opening Career Wins...");
    } else if (cmd === "contact") {
      openWindow("contact");
      lines.push("Opening Contact...");
    } else if (cmd === "whoami") {
      lines.push("santhosh — AI-first full stack engineer");
    } else if (cmd === "clear") {
      lines.length = 0;
      lines.push("SAN/OS terminal v1.0");
    } else if (cmd) {
      lines.push(`Unknown command: ${cmd}`);
    }
    render();
  });
}

function initClock() {
  const el = qs<HTMLElement>("#os-clock");
  if (!el) return;
  const tick = () => {
    const d = new Date();
    el.textContent = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  tick();
  setInterval(tick, 30_000);
}

function layoutMobileWindows() {
  const mobile = window.innerWidth <= 768;
  qsa<HTMLElement>(".os-win").forEach((win) => {
    if (mobile) {
      win.style.left = "8px";
      win.style.top = "8px";
      win.style.width = "calc(100% - 16px)";
    }
  });
}

export function initOS() {
  initBoot();
  initWindowControls();
  initDrag();
  initIcons();
  initProofLinks();
  initTaskbar();
  initStartMenu();
  initContextMenu();
  initKeyboard();
  initExplorer();
  initTerminal();
  initClock();
  layoutMobileWindows();
  window.addEventListener("resize", layoutMobileWindows);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOS);
} else {
  initOS();
}
