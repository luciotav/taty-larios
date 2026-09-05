# TODO — pendências e placeholders

Tudo aqui é **placeholder** e precisa ser confirmado/substituído antes do lançamento.
Cada item lista o(s) arquivo(s) onde mexer.

## 1. Conteúdo da marca

| Item | Onde | Situação |
|---|---|---|
| Nomes finais dos produtos | `data/products.json` (`name`) | exemplos: Cosmopolitan, Motivos Florais, Bali, Bag Moude, Atena, Chefirka, Cecília, Arizona |
| Preços reais | `data/products.json` (`price`, `compareAt`) | todos fictícios |
| Selos (`NOVO`, `15% OFF`) | `data/products.json` (`badge`) | definir quais peças têm desconto/são novidade |
| Categorias / Tamanho / Cor | `data/products.json` | valores de exemplo — alimentam os filtros da Coleção |
| Descrições dos produtos | `data/products.json` (`description`) | todas começam com "PLACEHOLDER" |
| Texto da história da marca | `index.html` seção `#historia` | 2 parágrafos genéricos |
| Headline + subtítulo do hero | `index.html` seção `.hero` | provisórios |
| Nº de parcelas / juros | `assets/js/store.js` (`installmentText`) + textos em `index.html` | assumido "6x sem juros" |
| CNPJ no rodapé | `index.html`, `colecao.html` (`.footer__bottom`) | `00.000.000/0000-00` |
| Páginas "Trocas e devoluções" e "Envio e prazos" | links no rodapé apontam para `#` | criar páginas |

## 2. Assets faltando

| Arquivo | Onde vai | Situação |
|---|---|---|
| `logo.png` (monograma TL + wordmark) | `assets/img/` — hoje usa `logo.svg` provisório | **não recebido** |
| `bali.jpg` | `assets/img/products/` | **não recebido** (card usa `_placeholder.svg`) |
| `atena.jpg`, `chefirka.jpg`, `cecilia.jpg`, `arizona.jpg` | `assets/img/products/` | **não recebidos** |
| Fotos reais do Instagram (6 tiles) | `index.html` seção Instagram | hoje reaproveita fotos de produto |
| Imagem da seção "Nossa história" | `index.html` `.story__media` | hoje usa `motivos_florais.jpg` |

Ao adicionar `logo.png`: trocar `assets/img/logo.svg` por `assets/img/logo.png`
nos 3 HTML (`index.html`, `colecao.html`, `checkout-retorno.html`) e no `favicon`.

## 3. Contatos e redes

| Item | Onde | Valor atual |
|---|---|---|
| Número de WhatsApp | `assets/js/config.js` → `whatsappNumber` | `5500000000000` (fake) |
| Mensagem padrão WhatsApp | `assets/js/config.js` → `whatsappMessage` | genérica |
| Handle do Instagram | `assets/js/config.js` → `instagramHandle` / `instagramUrl` | `@taty.larios` — **confirmar se existe** |
| E-mail de contato | `assets/js/config.js` → `contactEmail` | `contato@exemplo.com.br` |
| Valor do frete grátis | `data/products.json` → `freeShippingThreshold`, `assets/js/config.js`, textos das barras de anúncio nos HTML | `R$ 399,90` |

## 4. Pagamento — Mercado Pago (Cloudflare Worker em `api/`)

- [ ] Criar conta Mercado Pago + aplicação → obter Access Token de **teste** e **produção**.
- [ ] Criar conta Cloudflare e `npx wrangler login`.
- [ ] Em `api/wrangler.toml`: preencher `ALLOWED_ORIGIN` e `PAGES_ORIGIN` com a URL real do GitHub Pages.
- [ ] `cd api && npx wrangler secret put MP_ACCESS_TOKEN` (teste primeiro).
- [ ] `npx wrangler deploy` → copiar a URL do Worker.
- [ ] Colar `https://<worker>/create-preference` em `assets/js/config.js` → `checkoutApiUrl`.
- [ ] Enquanto `checkoutApiUrl` estiver vazio, o botão de compra cai no **fallback de pedido via WhatsApp** (funcional, mas sem pagamento online).
- [ ] Frete: hoje a preference **não** inclui frete (`shipments`). Definir política e implementar.
- [ ] Webhook (`notification_url`) para status de pagamento — não implementado.
- [ ] Persistência de pedidos (KV/D1/planilha) — não implementado; hoje nada é salvo.
- [ ] Trocar o token de teste pelo de produção no go-live.

## 5. Publicação — GitHub Pages

- Repo: **github.com/luciotav/taty-larios** (público).
- [ ] No GitHub: Settings → Pages → Source: **GitHub Actions**
      (o workflow `.github/workflows/deploy.yml` já está pronto).
- [ ] URL final esperada: `https://luciotav.github.io/taty-larios/`.
- Caminhos no site são **relativos** (`assets/...`), então funciona em subpasta.
  `PAGES_ORIGIN` do Worker já aponta para essa URL.

## 6. Domínio próprio (depois)

- [ ] Registrar `tatylarios.com.br` (ou equivalente).
- [ ] Criar arquivo `CNAME` na raiz com o domínio.
- [ ] DNS: `CNAME` de `www` → `<usuario>.github.io` e ALIAS/ANAME da raiz, ou 4 registros A do GitHub Pages.
- [ ] Atualizar `ALLOWED_ORIGIN` / `PAGES_ORIGIN` no Worker para o domínio novo.

## 7. Melhorias previstas (fora do escopo atual)

- [ ] Página de produto individual (`produto.html?id=...`) — os links já existem, a página não.
- [ ] Carrinho / mini-cart com edição de quantidade (hoje: adicionar ao carrinho + checkout direto).
- [ ] Integração da newsletter com provedor de e-mail (hoje é stub).
- [ ] SEO: Open Graph/Twitter cards, `sitemap.xml`, `robots.txt`, dados estruturados de produto.
- [ ] Analytics (Plausible/GA).
