/* =========================================================
   colecao.js — página de listagem/loja.
   Filtros (Categoria / Tamanho / Cor), Ordenar, "Carregar mais".
   Tudo client-side sobre data/products.json.
   ========================================================= */
(function () {
  "use strict";

  var PAGE_SIZE = 8;
  var state = { all: [], filtered: [], shown: 0, installmentsMax: 6 };

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector("[data-shop-grid]");
    var moreBtn = document.querySelector("[data-shop-more]");
    var countEl = document.querySelector("[data-shop-count]");
    var emptyEl = document.querySelector("[data-shop-empty]");
    var selCat = document.querySelector("[data-filter-category]");
    var selSize = document.querySelector("[data-filter-size]");
    var selColor = document.querySelector("[data-filter-color]");
    var selSort = document.querySelector("[data-filter-sort]");
    var resetBtn = document.querySelector("[data-filter-reset]");
    if (!grid) return;

    TLStore.loadCatalog().then(function (catalog) {
      state.all = catalog.products || [];
      state.installmentsMax = catalog.installmentsMax || 6;
      populate(selCat, unique(state.all, "category"), "Todas as categorias");
      populate(selSize, unique(state.all, "size"), "Todos os tamanhos");
      populate(selColor, unique(state.all, "color"), "Todas as cores");
      readUrl();
      apply();
    }).catch(function (err) {
      grid.innerHTML = '<p class="center">Não foi possível carregar a coleção agora.</p>';
      console.error(err);
    });

    [selCat, selSize, selColor, selSort].forEach(function (el) {
      if (el) el.addEventListener("change", function () { state.shown = 0; writeUrl(); apply(); });
    });
    if (resetBtn) resetBtn.addEventListener("click", function () {
      [selCat, selSize, selColor].forEach(function (s) { if (s) s.value = ""; });
      if (selSort) selSort.value = "relevancia";
      state.shown = 0; writeUrl(); apply();
    });
    if (moreBtn) moreBtn.addEventListener("click", function () {
      state.shown += PAGE_SIZE; render();
    });

    function apply() {
      var cat = selCat && selCat.value;
      var size = selSize && selSize.value;
      var color = selColor && selColor.value;
      var sort = (selSort && selSort.value) || "relevancia";

      var list = state.all.filter(function (p) {
        return (!cat || p.category === cat) &&
               (!size || p.size === size) &&
               (!color || p.color === color);
      });

      list.sort(function (a, b) {
        if (sort === "menor-preco") return a.price - b.price;
        if (sort === "maior-preco") return b.price - a.price;
        if (sort === "novidades") return (b.badge === "NOVO") - (a.badge === "NOVO");
        if (sort === "nome") return a.name.localeCompare(b.name, "pt-BR");
        // relevância: destaque primeiro, depois com desconto
        return (b.featured - a.featured) || ((b.compareAt ? 1 : 0) - (a.compareAt ? 1 : 0));
      });

      state.filtered = list;
      if (state.shown === 0) state.shown = PAGE_SIZE;
      render();
    }

    function render() {
      var list = state.filtered;
      grid.innerHTML = "";
      list.slice(0, state.shown).forEach(function (p) {
        grid.appendChild(TLStore.productCard(p, { installmentsMax: state.installmentsMax }));
      });
      if (countEl) countEl.textContent = list.length + (list.length === 1 ? " peça" : " peças");
      if (emptyEl) emptyEl.hidden = list.length !== 0;
      if (moreBtn) moreBtn.hidden = state.shown >= list.length;
    }

    /* ---- URL <-> filtros (compartilhável) ---- */
    function readUrl() {
      var q = new URLSearchParams(location.search);
      if (selCat && q.get("categoria")) selCat.value = q.get("categoria");
      if (selSize && q.get("tamanho")) selSize.value = q.get("tamanho");
      if (selColor && q.get("cor")) selColor.value = q.get("cor");
      if (selSort && q.get("ordenar")) selSort.value = q.get("ordenar");
    }
    function writeUrl() {
      var q = new URLSearchParams();
      if (selCat && selCat.value) q.set("categoria", selCat.value);
      if (selSize && selSize.value) q.set("tamanho", selSize.value);
      if (selColor && selColor.value) q.set("cor", selColor.value);
      if (selSort && selSort.value && selSort.value !== "relevancia") q.set("ordenar", selSort.value);
      var qs = q.toString();
      history.replaceState(null, "", qs ? "?" + qs : location.pathname);
    }
  });

  function unique(arr, key) {
    var seen = {};
    return arr.map(function (o) { return o[key]; })
      .filter(function (v) { if (!v || seen[v]) return false; seen[v] = 1; return true; })
      .sort(function (a, b) { return a.localeCompare(b, "pt-BR"); });
  }
  function populate(sel, values, allLabel) {
    if (!sel) return;
    sel.innerHTML = '<option value="">' + allLabel + "</option>" +
      values.map(function (v) { return '<option value="' + v + '">' + v + "</option>"; }).join("");
  }
})();
