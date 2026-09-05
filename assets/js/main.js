/* =========================================================
   main.js — comportamento comum a todas as páginas:
   menu mobile, WhatsApp flutuante, links sociais, newsletter (stub), ano.
   ========================================================= */
(function () {
  "use strict";
  var CFG = window.TL_CONFIG || {};

  document.addEventListener("DOMContentLoaded", function () {
    /* ---- menu mobile ---- */
    var burger = document.querySelector("[data-burger]");
    var nav = document.querySelector("[data-mobile-nav]");
    var close = document.querySelector("[data-mobile-close]");
    function setNav(open) {
      if (!nav) return;
      nav.setAttribute("data-open", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (burger) burger.setAttribute("aria-expanded", String(open));
    }
    if (burger) burger.addEventListener("click", function () { setNav(true); });
    if (close) close.addEventListener("click", function () { setNav(false); });
    if (nav) nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setNav(false); });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });

    /* ---- WhatsApp (flutuante + qualquer [data-wa]) ---- */
    var waHref = "https://wa.me/" + encodeURIComponent(CFG.whatsappNumber || "") +
      "?text=" + encodeURIComponent(CFG.whatsappMessage || "");
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      a.setAttribute("href", waHref);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });

    /* ---- links de Instagram / handle ---- */
    document.querySelectorAll("[data-ig-url]").forEach(function (a) {
      a.setAttribute("href", CFG.instagramUrl || "#");
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
    document.querySelectorAll("[data-ig-handle]").forEach(function (el) {
      el.textContent = "@" + (CFG.instagramHandle || "taty.larios");
    });

    /* ---- e-mail de contato ---- */
    document.querySelectorAll("[data-email]").forEach(function (a) {
      var mail = CFG.contactEmail || "";
      a.setAttribute("href", "mailto:" + mail);
      if (!a.textContent.trim()) a.textContent = mail;
    });

    /* ---- ano no rodapé ---- */
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    /* ---- newsletter: stub (sem backend ainda) ---- */
    var nl = document.querySelector("[data-newsletter]");
    if (nl) nl.addEventListener("submit", function (e) {
      e.preventDefault();
      // TODO: integrar com provedor de e-mail (Mailchimp / Brevo / etc).
      var msg = nl.querySelector("[data-newsletter-msg]");
      if (msg) msg.textContent = "Obrigada! Em breve você recebe nossas novidades.";
      nl.reset();
    });
  });
})();
