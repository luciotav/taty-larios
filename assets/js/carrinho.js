/* =========================================================
   carrinho.js — renderiza o carrinho, edição de quantidade,
   resumo com frete grátis acima do limite. Checkout é feito
   pelo checkout.js (botão [data-checkout]).
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var listEl = document.querySelector("[data-cart-list]");
    var emptyEl = document.querySelector("[data-cart-empty]");
    var summaryEl = document.querySelector("[data-cart-summary]");
    var subtotalEl = document.querySelector("[data-cart-subtotal]");
    var shippingEl = document.querySelector("[data-cart-shipping]");
    var totalEl = document.querySelector("[data-cart-total]");
    var freeHintEl = document.querySelector("[data-cart-freehint]");
    var checkoutBtn = document.querySelector("[data-checkout]");
    if (!listEl) return;

    var threshold = 0;

    TLStore.loadCatalog()
      .then(function (cat) { threshold = Number(cat.freeShippingThreshold) || 0; })
      .then(render);

    document.addEventListener("tl:cart-change", render);

    listEl.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-act]");
      if (!btn) return;
      var id = btn.getAttribute("data-id");
      var act = btn.getAttribute("data-act");
      var cur = (TLStore.readCart().filter(function (i) { return i.id === id; })[0] || {}).qty || 0;
      if (act === "inc") TLStore.setQty(id, cur + 1);
      if (act === "dec") TLStore.setQty(id, cur - 1);
      if (act === "rm") TLStore.removeFromCart(id);
    });

    function render() {
      TLStore.cartDetailed().then(function (d) {
        var has = d.lines.length > 0;
        emptyEl.hidden = has;
        summaryEl.hidden = !has;
        listEl.hidden = !has;
        if (checkoutBtn) checkoutBtn.disabled = !has;

        listEl.innerHTML = d.lines.map(function (l) {
          return (
            '<article class="cart-row">' +
              '<img class="cart-row__img" src="' + esc(l.image) + '" alt="' + esc(l.name) + '" width="90" height="90">' +
              '<div class="cart-row__info">' +
                '<span class="cart-row__name">' + esc(l.name) + "</span>" +
                '<span class="cart-row__unit">' + TLStore.formatBRL(l.price) + " / un</span>" +
                '<button class="cart-row__rm" type="button" data-act="rm" data-id="' + esc(l.id) + '">Remover</button>' +
              "</div>" +
              '<div class="cart-row__qty">' +
                '<button type="button" data-act="dec" data-id="' + esc(l.id) + '" aria-label="Diminuir">−</button>' +
                "<span>" + l.qty + "</span>" +
                '<button type="button" data-act="inc" data-id="' + esc(l.id) + '" aria-label="Aumentar">+</button>' +
              "</div>" +
              '<span class="cart-row__sub">' + TLStore.formatBRL(l.subtotal) + "</span>" +
            "</article>"
          );
        }).join("");

        subtotalEl.textContent = TLStore.formatBRL(d.total);
        var freeShip = threshold > 0 && d.total >= threshold;
        shippingEl.textContent = freeShip ? "Grátis" : "a calcular no checkout";
        totalEl.textContent = TLStore.formatBRL(d.total);

        if (freeHintEl) {
          if (threshold > 0 && !freeShip) {
            freeHintEl.hidden = false;
            freeHintEl.textContent = "Faltam " + TLStore.formatBRL(threshold - d.total) + " para o frete grátis.";
          } else {
            freeHintEl.hidden = true;
          }
        }
      });
    }

    function esc(s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }
  });
})();
