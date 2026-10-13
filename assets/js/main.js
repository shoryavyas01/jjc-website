/* Jai Jwala Contracts — progressive enhancement, no runtime dependencies. */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("primary-menu");
  function closeMenu() {
    menu?.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open navigation");
  }
  toggle?.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu?.classList.contains("open")) {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) closeMenu();
  });
  menu
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  window.matchMedia("(min-width: 901px)").addEventListener("change", closeMenu);
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("waiting");
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("waiting");
      observer.observe(el);
    });
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) {
        observer.disconnect();
        document
          .querySelectorAll(".waiting")
          .forEach((el) => el.classList.remove("waiting"));
      }
    });
  }

  const cards = [...document.querySelectorAll(".project-card")];
  const filters = [...document.querySelectorAll(".filter-btn")];
  filters.forEach((button) =>
    button.addEventListener("click", () => {
      filters.forEach((filter) => {
        const selected = filter === button;
        filter.classList.toggle("active", selected);
        filter.setAttribute("aria-pressed", String(selected));
      });
      let count = 0;
      cards.forEach((card) => {
        card.hidden =
          button.dataset.filter !== "all" &&
          card.dataset.category !== button.dataset.filter;
        if (!card.hidden) count++;
      });
      document.getElementById("project-count").textContent =
        `${count} featured ${count === 1 ? "work" : "works"}`;
    }),
  );

  const form = document.querySelector(".contact-form");
  if (!form) return;
  const service = document.getElementById("service");
  const requestedService = new URLSearchParams(window.location.search).get(
    "service",
  );
  if ([...service.options].some((option) => option.value === requestedService))
    service.value = requestedService;
  let sending = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const note = form.querySelector(".form-note");
    const fallback = form.querySelector(".form-fallback");
    const button = form.querySelector("button[type=submit]");
    const originalButton = button.innerHTML;
    for (const id of ["name", "email", "message"]) {
      const field = document.getElementById(id);
      if (!field.value.trim()) {
        note.textContent = "Please complete all required fields.";
        note.className = "form-note error";
        field.focus();
        return;
      }
    }
    if (document.getElementById("website").value) return;
    sending = true;
    button.disabled = true;
    button.textContent = "Sending enquiry…";
    form.setAttribute("aria-busy", "true");
    note.className = "form-note";
    note.textContent = "Sending your enquiry. Please wait.";
    fallback.hidden = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Submission was not accepted");
      note.textContent = "Thank you. Your enquiry has been sent to our team.";
      note.className = "form-note success";
      form.reset();
    } catch (error) {
      note.textContent =
        error.name === "AbortError"
          ? "The connection timed out. Delivery could not be confirmed. Please contact us directly or try again."
          : "We could not confirm delivery. Your details are still here. Please try again or contact us directly.";
      note.className = "form-note error";
      fallback.hidden = false;
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      button.innerHTML = originalButton;
      form.removeAttribute("aria-busy");
    }
  });
})();
