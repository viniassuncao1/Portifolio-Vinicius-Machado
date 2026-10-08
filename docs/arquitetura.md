# Arquitetura

## Visão geral

O portfólio é uma aplicação Angular 22 **pré-renderizada**: no build, cada rota vira um arquivo
HTML estático em `dist/portfolio/browser/`. No navegador, o Angular faz a hidratação e assume a
navegação e as animações. Não há servidor em produção; o site é servido como arquivos estáticos pela Vercel
(veja [CI/CD e deploy](deploy.md)).

```
npm run build
  └─ @angular/build:application (outputMode: static)
       ├─ bundle do navegador (JS/CSS com hash)
       └─ pré-renderização das rotas (app.routes.server.ts → RenderMode.Prerender)
            └─ dist/portfolio/browser/index.html  ← HTML com o conteúdo já renderizado
```

## Decisões principais

| Decisão                        | Motivo                                                                  |
| ------------------------------ | ----------------------------------------------------------------------- |
| Standalone, signals, zoneless  | Padrão atual do Angular; menos código e detecção de mudanças previsível |
| Pré-renderização (SSG)         | Conteúdo fixo: HTML pronto para SEO e carregamento rápido, sem servidor |
| Vitest                         | Executor padrão do Angular atual, mais rápido que Karma                 |
| Playwright contra o build      | O E2E testa exatamente o que vai ao ar                                  |
| Vercel com deploy pelo Actions | Feita para frontend, preview por PR; deploy só com o pipeline verde     |

O raciocínio completo, com alternativas descartadas, está no design da change de fundação em
`openspec/`.

## Estrutura de pastas

Organização por **feature**, não por tipo de arquivo:

```
src/app/
  app.ts, app.routes.ts       componente raiz e rotas (lazy loading por feature)
  app.config.ts               providers do navegador (router, hidratação)
  app.config.server.ts        providers da pré-renderização
  core/                       singletons e configurações globais
  shared/                     componentes, diretivas e pipes reutilizáveis
  layout/                     casca da IDE: barra de ferramentas, árvore de seções, editor
  features/<secao>/           uma pasta por seção do portfólio
```

Regras de dependência:

- `features/` pode importar de `shared/` e `core/`, mas nunca de outra feature.
- `shared/` não importa de `features/` nem de `layout/`.
- Cada feature é carregada sob demanda (`loadComponent`).

## Convenções de arquivos

Seguimos o guia de estilo de 2025 do Angular: `inicio.ts` (e não `inicio.component.ts`), com o
teste ao lado (`inicio.spec.ts`).

## Design

O design de referência é um PDF do Illustrator (30 telas de 1920×1080) que simula uma IDE escura
no estilo Eclipse: barra de ferramentas no topo, árvore de seções à esquerda e editor com código
Java à direita. Como o PDF não é legível pelas ferramentas de IA, cada tela foi exportada como
imagem (`design/telas/tela-01.png` a `tela-30.png`), e os textos de cada tela ficam em
`design/telas/textos.md`. Nada disso é versionado (`design/` está no `.gitignore`). Cores,
tipografia e espaçamentos serão extraídos para design tokens (variáveis CSS) numa change própria.
