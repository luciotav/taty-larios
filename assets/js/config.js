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

  // Endpoint do Cloudflare Worker que cria a preference do Mercado Pago (Checkout Pro).
  // Worker: ~/taty-larios/api  ·  deploy: cd api && npx wrangler deploy
  // LIGADO: o botão "Finalizar compra" cria a preference e redireciona pro Checkout Pro.
  // O Worker usa o Access Token de PRODUÇÃO (pagamento real).
  // Se cair (ou ficar ""), o botão usa o fallback de pedido via WhatsApp.
  checkoutApiUrl: "https://taty-larios-api.tatylarios-bolsas.workers.dev/create-preference",

  // Frete grátis (também vem do products.json; aqui só para textos da UI)
  freeShippingThreshold: 399.90, // PLACEHOLDER
};
