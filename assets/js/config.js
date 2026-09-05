/* =========================================================
   Configuração central — TODOS os valores abaixo são PLACEHOLDER.
   Ver TODO.md. Ao publicar, substituir cada campo pelos dados reais.
   ========================================================= */
window.TL_CONFIG = {
  // Instagram — CONFIRMAR handle real da marca
  instagramHandle: "taty.larios",
  instagramUrl: "https://instagram.com/taty.larios",

  // WhatsApp — número no formato internacional só com dígitos: 55 + DDD + número
  whatsappNumber: "5500000000000", // PLACEHOLDER
  whatsappMessage: "Olá! Vim pelo site e quero saber mais sobre as bolsas.",

  // Contato
  contactEmail: "contato@exemplo.com.br", // PLACEHOLDER

  // Endpoint do Cloudflare Worker que cria a preference do Mercado Pago.
  // Enquanto não houver Worker publicado + conta MP, deixar vazio: o checkout
  // cai no fallback de pedido via WhatsApp.
  checkoutApiUrl: "", // ex: "https://taty-larios-api.SEU-SUBDOMINIO.workers.dev/create-preference"

  // Frete grátis (também vem do products.json; aqui só para textos da UI)
  freeShippingThreshold: 399.90, // PLACEHOLDER
};
