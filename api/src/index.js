/**
 * Cloudflare Worker — cria uma "preference" do Mercado Pago (Checkout Pro)
 * a partir do carrinho enviado pelo site estático (GitHub Pages).
 *
 * Segurança:
 *  - O cliente manda apenas { id, qty }. Os PREÇOS são relidos do
 *    products.json publicado no Pages — nunca confiamos no valor do navegador.
 *  - O MP_ACCESS_TOKEN fica só aqui (secret do Worker), nunca no site.
 *
 * Variáveis (ver wrangler.toml / `wrangler secret put`):
 *  - MP_ACCESS_TOKEN  (secret)  Access Token do Mercado Pago (TEST-... ou APP_USR-...)
 *  - ALLOWED_ORIGIN   (var)     Origem exata do site, ex: https://usuario.github.io
 *  - PAGES_ORIGIN      (var)    Base pública onde está products.json (normalmente = site).
 *                               Ex: https://usuario.github.io/taty-larios
 */

export default {
  async fetch(request, env) {
    const cors = buildCors(env.ALLOWED_ORIGIN, request.headers.get("Origin"));

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "JSON inválido" }, 400, cors);
    }

    const requested = Array.isArray(body.items) ? body.items : [];
    if (!requested.length) {
      return json({ error: "Carrinho vazio" }, 400, cors);
    }

    // 1) Catálogo autoritativo
    let catalog;
    try {
      const res = await fetch(`${env.PAGES_ORIGIN}/data/products.json`, {
        cf: { cacheTtl: 60, cacheEverything: true },
      });
      if (!res.ok) throw new Error(`products.json HTTP ${res.status}`);
      catalog = await res.json();
    } catch (err) {
      return json({ error: "Não foi possível ler o catálogo", detail: String(err) }, 502, cors);
    }

    const byId = new Map((catalog.products || []).map((p) => [p.id, p]));

    // 2) Monta itens com preço do servidor
    const items = [];
    for (const line of requested) {
      const p = byId.get(line.id);
      const qty = Math.max(1, Math.min(20, parseInt(line.qty, 10) || 0));
      if (!p) return json({ error: `Produto inexistente: ${line.id}` }, 400, cors);
      if (p.inStock === false) return json({ error: `Sem estoque: ${p.name}` }, 409, cors);
      items.push({
        id: p.id,
        title: p.name,
        quantity: qty,
        currency_id: catalog.currency || "BRL",
        unit_price: Number(p.price),
        picture_url: p.image && p.image.startsWith("http") ? p.image : `${env.PAGES_ORIGIN}/${String(p.image).replace(/^\//, "")}`,
      });
    }

    // 3) Cria a preference
    const pref = {
      items,
      back_urls: {
        success: `${env.PAGES_ORIGIN}/checkout-retorno.html?status=sucesso`,
        failure: `${env.PAGES_ORIGIN}/checkout-retorno.html?status=falha`,
        pending: `${env.PAGES_ORIGIN}/checkout-retorno.html?status=pendente`,
      },
      auto_return: "approved",
      statement_descriptor: "TATY LARIOS",
      // TODO: adicionar frete (shipments), notification_url (webhook) e metadata do pedido.
    };

    try {
      const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(pref),
      });
      const data = await mpRes.json();
      if (!mpRes.ok) {
        return json({ error: "Mercado Pago recusou a preference", detail: data }, 502, cors);
      }
      return json(
        {
          id: data.id,
          init_point: data.init_point,
          sandbox_init_point: data.sandbox_init_point,
        },
        200,
        cors,
      );
    } catch (err) {
      return json({ error: "Falha ao falar com o Mercado Pago", detail: String(err) }, 502, cors);
    }
  },
};

function buildCors(allowed, origin) {
  // Se ALLOWED_ORIGIN não estiver setado, ecoa a origem (útil em dev). Em produção, setar.
  const allow = allowed && allowed !== "*" ? allowed : origin || "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(obj, status, extraHeaders) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...(extraHeaders || {}) },
  });
}
