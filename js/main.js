/**
 * Flavor House — Premium scroll interactions & animations
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Scroll progress ── */
  const progressBar = document.querySelector(".scroll-progress");

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }

  /* ── Navbar scroll state ── */
  const navbar = document.querySelector(".navbar");
  let scrollTicking = false;
  let isScrolling = false;
  let scrollTimeout;

  function onScroll() {
    updateProgress();

    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 60);
    }

    document.body.classList.add("scrolling");
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => document.body.classList.remove("scrolling"), 150);

    if (!scrollTicking && !prefersReducedMotion) {
      scrollTicking = true;
      requestAnimationFrame(parallaxFrame);
    }
  }

  /* ── Parallax ── */
  const heroBg = document.querySelector(".hero-bg");
  const promoBg = document.querySelector(".promo-bg");
  const aboutParallax = document.querySelector(".about-parallax-bg");
  const floatEls = document.querySelectorAll("[data-parallax]");

  function parallaxFrame() {
    const y = window.scrollY;

    if (heroBg) {
      const heroRect = heroBg.closest(".hero")?.getBoundingClientRect();
      if (heroRect && heroRect.bottom > 0) {
        const speed = 0.35;
        heroBg.style.transform = `scale(1.08) translateY(${y * speed}px)`;
      }
    }

    if (promoBg) {
      const promo = promoBg.closest(".promo-inner");
      if (promo) {
        const rect = promo.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        promoBg.style.transform = `translateY(${center * 0.12}px) scale(1.05)`;
      }
    }

    if (aboutParallax) {
      aboutParallax.style.transform = `translateY(${y * 0.08}px)`;
    }

    floatEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });

    scrollTicking = false;
  }

  /* ── Intersection Observer — reveal ── */
  const revealSelectors = ".reveal, .reveal-left, .reveal-right, .menu-card, .gallery-item, .stat-item";

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          const delay = entry.target.dataset.delay;
          if (delay) entry.target.style.transitionDelay = delay + "ms";
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(revealSelectors).forEach((el, i) => {
    if (el.classList.contains("menu-card") || el.classList.contains("gallery-item")) {
      el.dataset.delay = (i % 6) * 80;
    }
    revealObserver.observe(el);
  });

  /* ── Section title character reveal ── */
  function initTitleReveal() {
    document.querySelectorAll("[data-reveal-title]").forEach((title) => {
      const text = title.textContent.trim();
      title.innerHTML = "";
      [...text].forEach((char, i) => {
        const span = document.createElement("span");
        span.className = "reveal-char";
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.transitionDelay = i * 35 + "ms";
        title.appendChild(span);
      });
    });

    const titleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal-char").forEach((c) => {
              c.style.opacity = "1";
              c.style.transform = "translateY(0)";
            });
            titleObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-reveal-title]").forEach((t) => titleObserver.observe(t));
  }

  /* ── Hero entrance ── */
  function heroEntrance() {
    const targets = [
      ".hero-eyebrow",
      ".hero-subtitle",
      ".hero-buttons",
    ];

    targets.forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (!el) return;
      setTimeout(() => {
        el.style.transition = "opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 400 + i * 200);
    });

    document.querySelectorAll(".hero-title .word").forEach((word, i) => {
      setTimeout(() => {
        word.style.transition = "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)";
        word.style.opacity = "1";
        word.style.transform = "translateY(0)";
      }, 200 + i * 120);
    });
  }

  /* ── Animated counters ── */
  function animateCounters() {
    const counters = document.querySelectorAll("[data-count]");

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || "";
          const duration = 2000;
          const start = performance.now();

          function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else {
              el.textContent =
                target >= 1000 ? target.toLocaleString() + suffix : target + suffix;
            }
          }

          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => counterObserver.observe(c));
  }

  /* ── Menu card 3D tilt ── */
  function initTilt() {
    if (prefersReducedMotion || window.innerWidth < 768) return;

    document.querySelectorAll(".menu-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ── Mobile menu ── */
  function initMobileNav() {
    const toggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!toggle || !navLinks) return;

    toggle.addEventListener("click", () => {
      toggle.classList.toggle("active");
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        toggle.classList.remove("active");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ── Glow orb follows scroll ── */
  function initGlowOrbs() {
    const orbs = document.querySelectorAll(".glow-orb");
    if (!orbs.length || prefersReducedMotion) return;

    window.addEventListener(
      "scroll",
      () => {
        const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
        orbs.forEach((orb, i) => {
          orb.style.top = 20 + pct * 60 + i * 10 + "%";
          orb.style.left = i % 2 === 0 ? "10%" : "75%";
        });
      },
      { passive: true }
    );
  }

  /* ── Smooth anchor offset for fixed nav ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  /* ── Contact form (demo) ── */
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = "¡Mensaje enviado!";
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = orig;
          btn.disabled = false;
          form.reset();
        }, 2500);
      }
    });
  }

  /* ── Init ── */
  function init() {
    initTitleReveal();
    heroEntrance();
    animateCounters();
    initTilt();
    initMobileNav();
    initGlowOrbs();
    updateProgress();
    if (!prefersReducedMotion) parallaxFrame();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(parallaxFrame);
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
