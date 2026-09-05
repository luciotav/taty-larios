# Taty Larios — site de vendas

Bolsas de crochê feitas à mão. Site estático (GitHub Pages) + uma função
serverless (Cloudflare Workers) para o checkout do Mercado Pago.

## Por que HTML/CSS/JS puro (sem Astro/11ty)

- São 2 páginas hoje (Home + Coleção) e mais 2 previstas. Não há volume que
  justifique um passo de build.
- GitHub Pages serve o repositório direto — zero configuração de build, nada que
  quebre em atualização de dependência.
- O catálogo é **data-driven**: `data/products.json` é a única fonte de verdade e
  alimenta tanto o grid de destaque da Home quanto a Coleção (filtros, ordenação,
  "carregar mais"). Isso dá o benefício de templating sem o custo de um gerador.
- Se o catálogo crescer muito ou a marca quiser um CMS, dá para migrar para Astro
  reaproveitando todo o CSS/HTML.

## Estrutura

```
index.html              Home
colecao.html            Listagem / loja (filtros, grid, carregar mais)
checkout-retorno.html   Página de retorno do Mercado Pago (success/failure/pending)
data/products.json      CATÁLOGO — fonte de verdade (preços/nomes = placeholder)
assets/css/styles.css   Folha única. Tokens de cor/tipografia aprovados no topo.
assets/js/
  config.js             Placeholders: WhatsApp, Instagram, e-mail, URL da API
  store.js              Catálogo + carrinho (localStorage) + render de card
  main.js               Menu mobile, WhatsApp, links sociais, newsletter (stub)
  home.js               Grid de destaque
  colecao.js            Filtros / ordenação / paginação
  checkout.js           Envia carrinho ao Worker; fallback = pedido no WhatsApp
api/                    Cloudflare Worker — cria a preference do Mercado Pago
.github/workflows/deploy.yml   Publica a raiz no GitHub Pages (ignora api/)
```

## Rodar local

```bash
# qualquer servidor estático na raiz (o fetch de products.json precisa de http)
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Publicar (resumo — detalhes em TODO.md)

1. Criar repo no GitHub (sugestão: `taty-larios`), `git push`.
2. Settings → Pages → Source: **GitHub Actions**.
3. Checkout Mercado Pago: seguir [`api/README.md`](api/README.md), depois colar a
   URL do Worker em `assets/js/config.js` → `checkoutApiUrl`.

## Identidade visual

Paleta e tipografia (Cormorant Garamond + Jost) estão fixadas como CSS custom
properties no topo de `assets/css/styles.css`. **Não alterar sem combinar.**

## Pendências

Ver [`TODO.md`](TODO.md) — preços, nomes, fotos faltando, WhatsApp/e-mail reais,
conta Mercado Pago, domínio próprio.
