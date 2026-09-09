# TODO — pendências e placeholders

Tudo aqui é **placeholder** e precisa ser confirmado/substituído antes do lançamento.
Cada item lista o(s) arquivo(s) onde mexer.

## 1. Conteúdo da marca

| Item | Onde | Situação |
|---|---|---|
| Nomes finais dos produtos | `data/products.json` (`name`) | exemplos: Cosmopolitan, Motivos Florais, Bali, Bag Moude, Atena, Chefirka, Cecília, Arizona |
| Preços | `data/products.json` (`price`, `compareAt`) | **campanha 30% OFF** definida a pedido: venda de R$ 329 a R$ 479 (teto), `compareAt` = price / 0,70. A escala entre as peças foi escolha minha — ajustar se tiver tabela real. |
| Selos | `data/products.json` (`badge`) | todas com **"30% OFF"** (Atena e Motivos Florais perderam o "NOVO" — readicionar depois se quiser um selo combinado) |
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
| `logo.png` (monograma TL + wordmark) | `assets/img/` — hoje usa `logo.svg` provisório | **não recebido como arquivo** (só veio como imagem no chat — salvar em `~/Downloads/logo.png`) |
| `atena.jpg`, `chefirka.jpg`, `bali.jpg`, `cecilia.jpg`, `arizona.jpg` | `assets/img/products/` | ✅ todas adicionadas (fotos reais, recortadas 1000×1000). **Confirmar** categoria/tamanho/cor que inferi da imagem — hoje: atena=Bolsas de mão/Pequena/Vinho · chefirka=Bolsas de mão/Pequena/Café · bali=Transversais/Média/Caramelo · cecilia=Bolsas de mão/Média/Cru · arizona=Clutches/Pequena/Areia |
| Confirmar que bali/cecilia/arizona batem com as páginas 3/7/8 do catálogo | — | as imagens vêm de `~/Downloads/{bali,cecilia,arizona}_files/` (páginas salvas do Canva); o Canva pré-carrega páginas vizinhas, então revisar se a bolsa certa foi para o produto certo |
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

- [x] Conta Cloudflare + `wrangler login` (luciotav@gmail.com). Worker no ar:
      **https://taty-larios-api.tatylarios-bolsas.workers.dev** (subdomínio workers.dev `tatylarios-bolsas`).
- [x] App Mercado Pago **"Taty Larios Loja"** (ID 6552344602639545, conta `tatiane` / nick `TATIANELARIOS`).
      O app antigo "TatyLariossite" foi apagado.
- [x] `ALLOWED_ORIGIN` / `PAGES_ORIGIN` no `api/wrangler.toml` = `https://luciotav.github.io[/taty-larios]`.
- [x] `checkoutApiUrl` em `assets/js/config.js` → `.../create-preference`.
- [x] Fluxo verificado ponta a ponta: carrinho → Worker → Checkout Pro abre com Pix/Cartão/Boleto e total correto.
- [x] Página `carrinho.html` + `carrinho.js` (lista, quantidade, resumo). `checkout-retorno.html` (sucesso/pendente/falha).
- [x] **CHECKOUT ONLINE LIGADO** (`checkoutApiUrl` aponta pro Worker). Testado com preços de campanha:
      carrinho de 2 itens → Checkout Pro mostrou R$ 808,00 correto. **Pagamento real ativo.**

- [ ] ⚠️ **TOKEN EM USO É DE PRODUÇÃO** (`APP_USR-...`). As credenciais de TESTE nunca ativaram
      (bug do painel MP nessa conta — erro `DXT40-*` por dias, em 2 apps). Retomar o ambiente de teste
      quando o painel voltar, pra validar sem cobrança real.
- [ ] 🔒 **ROTACIONAR o Access Token de produção**: foi colado em texto puro no chat durante a config.
      MP → Credenciais de produção → menu (⋮) do Access Token → *Renovar*. Depois:
      `cd api && npx wrangler secret put MP_ACCESS_TOKEN` com o novo valor (sem re-deploy).
- [ ] Nome do vendedor no checkout aparece como **"modelagem"** — ajustar em MP → configurações da conta / "Meu negócio" (nome fantasia).
- [ ] Retomar o ambiente de **teste** quando o painel MP voltar (ativar credenciais de teste do app novo)
      e usar o token `TEST-...`/`APP_USR-` de teste para validar sem cobrança real.
- [ ] Frete: a preference **não** inclui frete (`shipments`). Definir política e implementar.
- [ ] Webhook (`notification_url`) para status de pagamento — não implementado (`checkout-retorno.html` é só visual).
- [ ] Persistência de pedidos (KV/D1/planilha) — não implementado; hoje nada é salvo no servidor.
- [ ] `auto_return`/`back_urls` do Worker apontam para `checkout-retorno.html` — ok, página existe.

## 5. Publicação — GitHub Pages  ✅ NO AR

- Repo: **github.com/luciotav/taty-larios** (público).
- Source: **GitHub Actions** (workflow `.github/workflows/deploy.yml`). Cada push em `main` republica.
- Site: **https://luciotav.github.io/taty-larios/** — verificado (Home + Coleção + catálogo carregando).
- Caminhos são relativos, então funciona na subpasta `/taty-larios/`.
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
