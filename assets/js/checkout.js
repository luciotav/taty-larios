/* =========================================================
   checkout.js — envia o carrinho ao Worker (Cloudflare) que cria a
   preference do Mercado Pago (Checkout Pro) e redireciona pro init_point.
   Fallback: se não houver API configurada ou a chamada falhar,
   monta um pedido no WhatsApp.
   ========================================================= */
(function () {
  "use strict";
  var CFG = window.TL_CONFIG || {};

  function waFallback(detail) {
    var linhas = detail.lines.map(function (l) {
      return "• " + l.name + " x" + l.qty + " — " + TLStore.formatBRL(l.subtotal);
    });
    var texto = "Olá! Quero finalizar este pedido:\n\n" + linhas.join("\n") +
      "\n\nTotal: " + TLStore.formatBRL(detail.total);
    var url = "https://wa.me/" + encodeURIComponent(CFG.whatsappNumber || "") +
      "?text=" + encodeURIComponent(texto);
    window.open(url, "_blank", "noopener");
  }

  function startCheckout(btn) {
    return TLStore.cartDetailed().then(function (detail) {
      if (!detail.count) { alert("Seu carrinho está vazio."); return; }

      if (!CFG.checkoutApiUrl) {
        // Ainda sem Worker + conta Mercado Pago. Ver TODO.md.
        waFallback(detail);
        return;
      }

      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Redirecionando…"; }

      // O Worker NÃO confia nos preços do cliente: recebe só id + qty e
      // revalida contra data/products.json antes de criar a preference.
      var payload = {
        items: detail.lines.map(function (l) { return { id: l.id, qty: l.qty }; }),
      };

      return fetch(CFG.checkoutApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (data) {
          var url = data.init_point || data.sandbox_init_point;
          if (!url) throw new Error("Resposta sem init_point");
          window.location.href = url;
        })
        .catch(function (err) {
          console.error("Checkout falhou, usando WhatsApp:", err);
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Finalizar compra"; }
          waFallback(detail);
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-checkout]").forEach(function (btn) {
      btn.addEventListener("click", function () { startCheckout(btn); });
    });
  });

  window.TLCheckout = { start: startCheckout };
})();
