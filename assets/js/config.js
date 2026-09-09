/* =========================================================
   Configuração central. Ainda placeholder: instagramHandle (confirmar),
   freeShippingThreshold. Ver TODO.md.
   ========================================================= */
window.TL_CONFIG = {
  // Instagram — CONFIRMAR handle real da marca
  instagramHandle: "taty.larios",
  instagramUrl: "https://instagram.com/taty.larios",

  // WhatsApp — formato internacional só com dígitos: 55 + DDD + número
  whatsappNumber: "5511940722489",
  whatsappMessage: "Olá! Vim pelo site e quero saber mais sobre as bolsas.",

  // Contato
  contactEmail: "taty.lariosta@gmail.com",

  // Endpoint do Cloudflare Worker que cria a preference do Mercado Pago (Checkout Pro).
  // Worker: ~/taty-larios/api  ·  deploy: cd api && npx wrangler deploy
  // LIGADO: o botão "Finalizar compra" cria a preference e redireciona pro Checkout Pro.
  // O Worker usa o Access Token de PRODUÇÃO (pagamento real).
  // Se cair (ou ficar ""), o botão usa o fallback de pedido via WhatsApp.
  checkoutApiUrl: "https://taty-larios-api.tatylarios-bolsas.workers.dev/create-preference",

  // Frete grátis (também vem do products.json; aqui só para textos da UI)
  freeShippingThreshold: 399.90, // PLACEHOLDER
};
