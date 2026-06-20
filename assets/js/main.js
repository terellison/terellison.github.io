(function () {
  "use strict";

  var root = document.documentElement;

  // ---- Theme toggle ----------------------------------------
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  // Follow the OS preference if the user hasn't chosen explicitly.
  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function (e) {
        try {
          if (localStorage.getItem("theme") === null) {
            root.setAttribute("data-theme", e.matches ? "dark" : "light");
          }
        } catch (err) {}
      });
  }

  // ---- Mobile navigation -----------------------------------
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---- Header border on scroll -----------------------------
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---- Remove preload class (enables transitions) ----------
  window.addEventListener("load", function () {
    document.body.classList.remove("preload");
  });
  // Fallback in case load already fired.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.remove("preload");
    });
  });
})();
