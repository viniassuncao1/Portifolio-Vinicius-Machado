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

### Vercel, com deploy feito pelo GitHub Actions
A Vercel é feita para frontend e sites estáticos, tem plano gratuito e gera uma URL de preview
por deploy. O deploy é feito pela CLI da Vercel dentro do pipeline (`vercel pull` →
`vercel build` → `vercel deploy --prebuilt`), e não pela integração Git automática da Vercel.
Assim o deploy só acontece depois que as verificações passam, e todo o processo fica explícito e
versionado no repositório.
- Alternativa: integração Git automática da Vercel. Mais simples, mas publicaria mesmo com testes
  falhando e esconderia o processo no painel da Vercel.
- Alternativa: GitHub Pages. Sem preview por PR e com `base-href` atrelado ao nome do
  repositório.
- Alternativa: Railway. Pensado para backends e containers; para um site estático exigiria um
  servidor (por exemplo, nginx em Docker) sem ganho.

A configuração de build fica em `vercel.json` (infraestrutura como código). Um `rewrite` envia
rotas inexistentes para `index.csr.html`, e o roteador do Angular redireciona para a página
inicial.

### Deploy como jobs do mesmo workflow do CI
Os jobs `deploy-preview` (em PRs) e `deploy-producao` (em push na `main`) declaram `needs` sobre
os três jobs de verificação. Assim, o deploy nunca acontece com o pipeline vermelho. Na `main`,
a concorrência não cancela execuções em andamento, para não interromper um deploy de produção. A
versão da CLI da Vercel é fixa no workflow.

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

- [Token da Vercel vazado dá acesso à conta] → o token fica só em GitHub Secrets, com escopo
  restrito e expiração definida; PRs de forks não recebem secrets.
- [Diferença entre o build testado no E2E e o build publicado] → os dois usam o mesmo
  `npm run build`; o `vercel build` lê o mesmo comando do `vercel.json`.
- [Cobertura de 80% num projeto com poucos testes no início] → o código inicial é mínimo e
  testado; o limite vale desde o começo para não acumular dívida.

## Migration Plan

1. Criar o projeto na Vercel com `vercel link`, sem conectar o repositório Git.
2. Cadastrar `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` em GitHub Secrets.
3. Abrir o PR desta change: o preview é publicado quando as verificações passarem.
4. Mesclar na `main`: a produção é publicada.

Rollback: reverter o merge, ou promover um deploy anterior no painel da Vercel
(`vercel rollback`).
