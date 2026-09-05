/* home.js — preenche o grid de 4 produtos em destaque da Home. */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var mount = document.querySelector("[data-featured-grid]");
    if (!mount) return;

    TLStore.loadCatalog().then(function (catalog) {
      var featured = (catalog.products || []).filter(function (p) { return p.featured; }).slice(0, 4);
      if (!featured.length) featured = (catalog.products || []).slice(0, 4);
      mount.innerHTML = "";
      featured.forEach(function (p) {
        mount.appendChild(TLStore.productCard(p, { installmentsMax: catalog.installmentsMax }));
      });
    }).catch(function (err) {
      mount.innerHTML = '<p class="center">Não foi possível carregar os produtos agora.</p>';
      console.error(err);
    });
  });
})();
