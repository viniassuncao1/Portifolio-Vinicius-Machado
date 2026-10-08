# ADR-0003: Pré-renderização estática (SSG)

- **Status:** Aceito
- **Data:** 2026-10-08

## Contexto

O conteúdo do portfólio é fixo e muda só quando eu publico uma nova versão. O site precisa
carregar rápido, ser indexado por buscadores e funcionar bem em links compartilhados no LinkedIn.

## Decisão

Gerar cada rota como HTML estático no build, com `@angular/ssr` e `outputMode: "static"`. No
navegador, o Angular faz a hidratação e assume a navegação e as animações.

## Alternativas consideradas

- **SPA pura:** entrega um HTML vazio, ruim para SEO e para a pré-visualização de links.
- **SSR com servidor Node:** renderiza a cada acesso, mas exige servidor em produção sem nenhum
  ganho para conteúdo fixo.

## Consequências

- Não há servidor em produção: o site é um conjunto de arquivos estáticos (ADR-0004).
- O código não pode depender de APIs do navegador durante a renderização (`window`, `document`).
  Esse acesso deve ficar protegido (`afterNextRender`, `isPlatformBrowser`).
- Um teste E2E garante que o conteúdo aparece com o JavaScript desligado.
