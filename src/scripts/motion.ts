const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initParallax() {
  if (reduced) return;

  const layers = document.querySelectorAll<HTMLElement>("[data-parallax]");
  if (!layers.length) return;

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    layers.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax ?? "0.2");
      const base = parseFloat(el.dataset.base ?? "0");
      el.style.transform = `translate3d(0, ${base + scrollY * speed}px, ${el.dataset.z ?? 0}px)`;
    });
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

function initTilt() {
  if (reduced) return;

  const cards = document.querySelectorAll<HTMLElement>("[data-tilt]");
  cards.forEach((card) => {
    const max = 12;
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateZ(8px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)";
    });
  });
}

function initHeroTilt() {
  if (reduced) return;

  const hero = document.querySelector<HTMLElement>("[data-hero-stage]");
  if (!hero) return;

  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    hero.style.setProperty("--rx", `${-y * 8}deg`);
    hero.style.setProperty("--ry", `${x * 10}deg`);
  });
  hero.addEventListener("mouseleave", () => {
    hero.style.setProperty("--rx", "0deg");
    hero.style.setProperty("--ry", "0deg");
  });
}

function initReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (reduced) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  els.forEach((el) => io.observe(el));
}

function initScrollSpin() {
  if (reduced) return;

  const spinners = document.querySelectorAll<HTMLElement>("[data-scroll-spin]");
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    spinners.forEach((el) => {
      const factor = parseFloat(el.dataset.scrollSpin ?? "0.15");
      el.style.transform = `translate3d(0,0,40px) rotateY(${y * factor}deg) rotateX(${y * factor * 0.4}deg)`;
    });
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
}

export function initMotion() {
  initParallax();
  initTilt();
  initHeroTilt();
  initReveal();
  initScrollSpin();
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMotion);
  } else {
    initMotion();
  }
}
