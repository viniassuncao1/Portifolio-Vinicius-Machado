# Proposal

## Why

O portfólio ganhou um endereço próprio, `vinimachado.wattscompany.com.br`, no domínio da Watts
Company (CNAME na Hostinger apontando para a Vercel, configurado em 16/10). O endereço
`portfolio-vinicius-machado.vercel.app` ainda está fixo no SEO, no sitemap, no `robots.txt`, no
README e no cartão de compartilhamento, então buscadores e o LinkedIn continuariam usando o
endereço antigo.

## What Changes

- **Endereço canônico novo:** `https://vinimachado.wattscompany.com.br` em `core/seo.ts`
  (canônico, `og:url`, dados estruturados), no sitemap e no `robots.txt`.
- **Cartão de compartilhamento:** a URL no rodapé da imagem passa a ser o domínio novo; a imagem é
  gerada de novo (o `ViniciusMachado.java` continua, por decisão do Vinicius).
- **Endereço antigo:** na Vercel, `portfolio-vinicius-machado.vercel.app` redireciona para o
  domínio novo (configuração do projeto, fora do código).
- README e `docs/` com o endereço novo.
- Entrada do diário.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `seo-e-compartilhamento`: o canônico usa o domínio próprio.

## Impact

- Código: `core/seo.ts`, `scripts/gerar-sitemap.mjs`, `public/robots.txt`,
  `scripts/compartilhamento/cartao.html` e `public/compartilhamento/portfolio.png`.
- Testes: unitários de SEO e E2E (`seo.spec.ts`, `secoes-sem-paginacao.spec.ts`).
- Fora do código: redirecionamento do `.vercel.app` na Vercel; depois do deploy, revalidar a
  prévia no LinkedIn Post Inspector e registrar o domínio no Google Search Console.
