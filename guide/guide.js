/* guide.js — active sidebar nav tracking via IntersectionObserver */

(function () {
  "use strict";

  const navLinks = document.querySelectorAll(".guide-nav-link");
  const sections = document.querySelectorAll(".guide-section");

  if (!navLinks.length || !sections.length) return;

  // Build a map from section id → nav link
  const linkMap = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      linkMap.set(href.slice(1), link);
    }
  });

  let currentActive = null;

  function setActive(id) {
    if (id === currentActive) return;
    currentActive = id;
    navLinks.forEach((l) => l.classList.remove("is-active"));
    const active = linkMap.get(id);
    if (active) {
      active.classList.add("is-active");
      // Scroll sidebar link into view on mobile (sidebar is not sticky)
      if (window.innerWidth <= 820) return;
      const sidebar = document.querySelector(".guide-sidebar");
      if (sidebar) {
        const linkTop = active.offsetTop;
        const sidebarScrollTop = sidebar.scrollTop;
        const sidebarHeight = sidebar.clientHeight;
        if (linkTop < sidebarScrollTop || linkTop > sidebarScrollTop + sidebarHeight - 60) {
          sidebar.scrollTo({ top: linkTop - 80, behavior: "smooth" });
        }
      }
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      // Find the topmost intersecting section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) {
        setActive(visible[0].target.id);
      }
    },
    {
      rootMargin: "-80px 0px -55% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));

  // Fallback: update on scroll for older browsers
  window.addEventListener(
    "scroll",
    () => {
      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-height")
      ) || 70;
      let lastVisible = null;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= headerH + 32) {
          lastVisible = section.id;
        }
      });
      if (lastVisible) setActive(lastVisible);
    },
    { passive: true }
  );

  // Smooth scroll for sidebar links (already handled by CSS scroll-behavior,
  // but this ensures scroll-margin-top is respected on all browsers)
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const target = document.getElementById(href.slice(1));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, "", href);
        }
      }
    });
  });
})();
