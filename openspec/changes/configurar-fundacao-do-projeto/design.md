# Design

## Context

O repositório tem apenas o README e as pastas de ferramentas (OpenSpec e regras do agente de
IA). O design do site existe como um PDF do Illustrator (30 telas de 1920×1080) que simula uma
IDE escura no estilo Eclipse; ele é a fonte visual e não é versionado. Veja `proposal.md` para
a motivação.

## Goals / Non-Goals

**Goals:**
- Projeto Angular pronto para receber as seções do portfólio, com qualidade verificada
  automaticamente desde o primeiro commit.
- Publicação estática sem servidor e sem segredos de terceiros.

**Non-Goals:**
- Implementar telas, design tokens ou animações (cada seção terá sua própria change).
- Internacionalização (será decidida numa change futura).
- Domínio próprio.

## Decisions

### Angular 22 com componentes standalone, signals e zoneless
É o padrão atual do framework e o que o portfólio quer demonstrar. NgModules e Zone.js
deixariam o projeto com cara de legado.

### Pré-renderização (SSG) com `@angular/ssr` e `outputMode: "static"`
O conteúdo é fixo, então cada rota vira HTML no build. Isso dá carregamento rápido, SEO e nota
alta no Lighthouse, sem precisar de servidor Node em produção.
- Alternativa: SPA pura. Descartada porque entregaria HTML vazio para buscadores.
- Alternativa: SSR com servidor. Descartada por custo e complexidade sem ganho para conteúdo
  estático.

### Testes unitários com Vitest (builder `@angular/build:unit-test`)
É o executor padrão das versões recentes do Angular, mais rápido que Karma. A cobertura usa
`@vitest/coverage-v8`, com mínimo de 80% configurado no `angular.json`.

### E2E com Playwright
Padrão de mercado, roda headless no CI e serve o build de produção para testar o que vai ao ar.

### ESLint (angular-eslint) + Prettier, separados
O ESLint cuida de regras de código e de templates (inclusive acessibilidade); o Prettier cuida
só da formatação. `eslint-config-prettier` evita conflitos entre os dois.

### Husky + lint-staged + commitlint
Mantêm o histórico limpo localmente, antes do CI. O commitlint usa
`@commitlint/config-conventional`, com a lista de tipos alinhada às regras do projeto.

### GitHub Pages via GitHub Actions
Gratuito, nativo do GitHub e sem tokens externos. O build usa `--base-href` com o nome do
repositório. Uma cópia de `index.html` como `404.html` faz rotas inexistentes abrirem a
aplicação.
- Alternativa: Vercel/Netlify. Mais recursos, mas exigiria segredos e conta externa. Pode ser
  adotada depois sem mudar o código.

### Dois workflows: `ci.yml` e `deploy.yml`
O CI roda em PRs e na `main`. O deploy roda só na `main` e depende de um build próprio. Assim o
deploy pode ser reexecutado sem repetir todo o pipeline, e a permissão de escrita no Pages
fica restrita a esse workflow.

### Organização por feature
```
src/app/
  core/       serviços e configurações globais (singletons)
  shared/     componentes, diretivas e pipes reutilizáveis
  features/   uma pasta por seção do portfólio
  layout/     casca da "IDE" (barra superior, árvore lateral, editor)
```
Segue a regra do projeto de organizar por domínio e não por tipo de arquivo.

## Risks / Trade-offs

- [O Pages exige configuração manual da fonte "GitHub Actions"] → documentado no README e na
  seção Impact da proposta.
- [`base-href` errado quebra os assets] → o valor vem do nome do repositório no workflow e o
  E2E roda contra o build de produção.
- [Cobertura de 80% num projeto com poucos testes no início] → o código inicial é mínimo e
  testado; o limite vale desde o começo para não acumular dívida.

## Migration Plan

1. Mesclar o PR desta change na `main`.
2. Em Settings → Pages, escolher a fonte "GitHub Actions".
3. Reexecutar o workflow de deploy, se o primeiro tiver rodado antes da configuração.

Rollback: reverter o merge; o Pages volta a servir a última publicação bem-sucedida.
