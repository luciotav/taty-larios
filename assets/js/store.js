/* =========================================================
   store.js — catálogo + carrinho (localStorage) + helpers de render.
   Sem dependências. Usado por home.js, colecao.js e checkout.js.
   ========================================================= */
(function () {
  "use strict";

  var CART_KEY = "tl_cart_v1";
  var CFG = window.TL_CONFIG || {};

  /* ---------- formatação ---------- */
  function formatBRL(value) {
    return (value || 0).toLocaleString("pt-BR", {
      style: "currency", currency: "BRL",
    });
  }

  function installmentText(price, max) {
    max = max || 6;
    if (!price) return "";
    var n = max;
    var parcela = price / n;
    // Regra simples: nº fixo de parcelas sem juros. Ajustar se a política mudar.
    return n + "x de " + formatBRL(parcela) + " sem juros";
  }

  /* ---------- catálogo ---------- */
  var _cache = null;
  function loadCatalog() {
    if (_cache) return Promise.resolve(_cache);
    return fetch("data/products.json", { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("Falha ao carregar catálogo (" + r.status + ")");
        return r.json();
      })
      .then(function (data) {
        _cache = data;
        return data;
      });
  }

  function findProduct(catalog, id) {
    return (catalog.products || []).filter(function (p) { return p.id === id; })[0] || null;
  }

  /* ---------- carrinho ---------- */
  function readCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }

  function writeCart(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {}
    updateCartBadges();
    document.dispatchEvent(new CustomEvent("tl:cart-change", { detail: items }));
  }

  function addToCart(id, qty) {
    qty = qty || 1;
    var items = readCart();
    var line = items.filter(function (i) { return i.id === id; })[0];
    if (line) line.qty += qty;
    else items.push({ id: id, qty: qty });
    writeCart(items);
  }

  function setQty(id, qty) {
    var items = readCart().map(function (i) {
      return i.id === id ? { id: id, qty: Math.max(0, qty) } : i;
    }).filter(function (i) { return i.qty > 0; });
    writeCart(items);
  }

  function removeFromCart(id) { setQty(id, 0); }
  function clearCart() { writeCart([]); }

  function cartCount() {
    return readCart().reduce(function (n, i) { return n + i.qty; }, 0);
  }

  // Junta as linhas do carrinho com os dados do catálogo. Retorna Promise.
  function cartDetailed() {
    return loadCatalog().then(function (catalog) {
      var lines = readCart().map(function (i) {
        var p = findProduct(catalog, i.id);
        if (!p) return null;
        return {
          id: p.id, name: p.name, price: p.price, qty: i.qty,
          image: p.image, subtotal: p.price * i.qty,
        };
      }).filter(Boolean);
      var total = lines.reduce(function (s, l) { return s + l.subtotal; }, 0);
      return { lines: lines, total: total, count: lines.reduce(function (n, l) { return n + l.qty; }, 0) };
    });
  }

  function updateCartBadges() {
    var count = cartCount();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.setAttribute("data-count", String(count));
      el.setAttribute("aria-label", "Carrinho, " + count + " item(ns)");
    });
  }

  /* ---------- render de card de produto ---------- */
  function productCard(p, opts) {
    opts = opts || {};
    var el = document.createElement("article");
    el.className = "product-card";
    el.setAttribute("data-id", p.id);

    var badge = "";
    if (p.badge) {
      var isNew = /novo/i.test(p.badge);
      badge = '<span class="product-card__badge' + (isNew ? " product-card__badge--new" : "") + '">' +
        escapeHtml(p.badge) + "</span>";
    }

    var priceBlock =
      '<div class="product-card__price">' +
        (p.compareAt ? '<span class="product-card__old">' + formatBRL(p.compareAt) + "</span>" : "") +
        '<span class="product-card__now">' + formatBRL(p.price) + "</span>" +
      "</div>" +
      '<span class="product-card__installments">' + installmentText(p.price, opts.installmentsMax) + "</span>";

    el.innerHTML =
      '<a class="product-card__media" href="produto.html?id=' + encodeURIComponent(p.id) + '">' +
        badge +
        '<img src="' + escapeAttr(p.image) + '" alt="' + escapeAttr(p.name) + '" loading="lazy" width="600" height="600">' +
      "</a>" +
      '<div class="product-card__body">' +
        '<span class="product-card__cat">' + escapeHtml(p.category || "") + "</span>" +
        '<a class="product-card__name" href="produto.html?id=' + encodeURIComponent(p.id) + '">' + escapeHtml(p.name) + "</a>" +
        priceBlock +
        '<div class="product-card__actions">' +
          '<button class="btn btn--ghost btn--sm btn--block" type="button" data-add="' + escapeAttr(p.id) + '">' +
            (p.inStock ? "Adicionar" : "Esgotado") + "</button>" +
        "</div>" +
      "</div>";

    var addBtn = el.querySelector("[data-add]");
    if (!p.inStock) { addBtn.disabled = true; }
    else {
      addBtn.addEventListener("click", function () {
        addToCart(p.id, 1);
        addBtn.textContent = "Adicionado ✓";
        setTimeout(function () { addBtn.textContent = "Adicionar"; }, 1400);
      });
    }
    return el;
  }

  /* ---------- utils ---------- */
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function escapeAttr(s) { return escapeHtml(s); }

  document.addEventListener("DOMContentLoaded", updateCartBadges);

  /* ---------- API pública ---------- */
  window.TLStore = {
    formatBRL: formatBRL,
    installmentText: installmentText,
    loadCatalog: loadCatalog,
    findProduct: findProduct,
    productCard: productCard,
    addToCart: addToCart,
    setQty: setQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    readCart: readCart,
    cartCount: cartCount,
    cartDetailed: cartDetailed,
    updateCartBadges: updateCartBadges,
  };
})();
