# API — Checkout Pro (Mercado Pago) via Cloudflare Worker

Função serverless única: recebe o carrinho do site (`{ items: [{ id, qty }] }`),
revalida os preços contra `data/products.json` publicado no GitHub Pages, cria uma
**preference** no Mercado Pago e devolve `init_point` para redirecionar o cliente
ao Checkout Pro.

O site continua 100% no GitHub Pages. Só as chamadas `POST /create-preference`
vão para este Worker.

## Pré-requisitos

1. **Conta Mercado Pago** + aplicação criada em
   <https://www.mercadopago.com.br/developers/panel/app> → você recebe:
   - `Access Token` de **teste** (`TEST-...`)
   - `Access Token` de **produção** (`APP_USR-...`)
2. **Conta Cloudflare** (grátis). `npm i -g wrangler` ou usar `npx wrangler`.

## Configurar

```bash
cd api
npm install
npx wrangler login
```

Edite `wrangler.toml` e troque os `TODO`:
- `ALLOWED_ORIGIN` = origem exata do site, ex. `https://SEU-USUARIO.github.io`
- `PAGES_ORIGIN`  = base onde está `data/products.json`, ex. `https://SEU-USUARIO.github.io/taty-larios`

Defina o token como **secret** (nunca commitar):

```bash
npx wrangler secret put MP_ACCESS_TOKEN
# cole o TEST-... para validar; depois repita com o APP_USR-... no go-live
```

## Rodar local

```bash
npx wrangler dev
# POST http://localhost:8787/create-preference
# body: {"items":[{"id":"cosmopolitan","qty":1}]}
```

## Publicar

```bash
npx wrangler deploy
# saída: https://taty-larios-api.SEU-SUBDOMINIO.workers.dev
```

Cole essa URL (com `/create-preference`) em `assets/js/config.js` →
`checkoutApiUrl`. Enquanto estiver vazio, o site usa o fallback de pedido por
WhatsApp.

## Pendências (ver TODO.md na raiz)

- [ ] Frete: adicionar `shipments` na preference (hoje sem frete).
- [ ] Webhook: `notification_url` + endpoint para status do pagamento.
- [ ] Página `checkout-retorno.html` no site (success/failure/pending).
- [ ] Guardar pedidos (KV / D1 / planilha) — hoje nada é persistido.
