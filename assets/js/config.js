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
  // Worker (FUNCIONANDO, testado): https://taty-larios-api.tatylarios-bolsas.workers.dev/create-preference
  //
  // DESLIGADO DE PROPÓSITO enquanto os preços em data/products.json forem placeholder,
  // porque o Worker está com o Access Token de PRODUÇÃO (cobra de verdade).
  // Para RELIGAR o checkout online: colar a URL acima aqui e dar push. É só isso.
  // Com string vazia, o botão "Finalizar compra" abre um pedido pré-preenchido no WhatsApp.
  checkoutApiUrl: "",

  // Frete grátis (também vem do products.json; aqui só para textos da UI)
  freeShippingThreshold: 399.90, // PLACEHOLDER
};
