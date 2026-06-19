const header = document.querySelector("[data-site-header]");
document.documentElement.classList.add("js");

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));

const revealElement = (element) => {
  element.classList.add("is-visible");
};

if (!reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealElement(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  window.setTimeout(() => {
    revealElements.forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight * 1.1) {
        revealElement(element);
      }
    });
  }, 80);

  window.setTimeout(() => {
    revealElements.forEach(revealElement);
  }, 4000);

  const hero = document.querySelector(".hero");
  if (hero) {
    hero.addEventListener(
      "pointermove",
      (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        hero.style.setProperty("--mx", x.toFixed(3));
        hero.style.setProperty("--my", y.toFixed(3));
      },
      { passive: true },
    );
  }
} else {
  revealElements.forEach(revealElement);
}

const tabs = Array.from(document.querySelectorAll("[data-tour-target]"));
const panels = Array.from(document.querySelectorAll("[data-tour-panel]"));

const activateTour = (target) => {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tourTarget === target;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.tourPanel === target;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateTour(tab.dataset.tourTarget));
});
