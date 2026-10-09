# 0001: Fundação do projeto

- **Data:** 2026-10-08
- **Tipo:** entrada retroativa, escrita depois da fundação já concluída
- **Change:** [configurar-fundacao-do-projeto](../../openspec/changes/archive/2026-10-08-configurar-fundacao-do-projeto/)
  (arquivada)
- **PRs:** [#1](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/1),
  [#8](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/8),
  [#9](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/9),
  [#10](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/10) e
  [#11](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/11)
- **ADRs:** [0001](../adr/0001-registrar-decisoes-com-adrs.md) a
  [0007](../adr/0007-equipe-de-agentes-no-maestri.md)

## Problema

Eu queria um portfólio que também fosse prova de como eu trabalho. Para isso, antes de desenhar
qualquer tela, o projeto precisava de uma base que garantisse qualidade e publicação automática,
e de um processo em que as decisões ficassem registradas. Boa parte do código seria escrita com
agentes de IA, e sem um plano explícito a IA tende a mudar o escopo no meio do caminho e deixar
decisões sem registro.

## Decisões

- **Angular 22 com pré-renderização estática (SSG).** O conteúdo é fixo, então cada rota vira
  HTML no build. Isso dá carregamento rápido, SEO e boa pré-visualização de links. Descartei a
  SPA pura (HTML vazio) e o SSR com servidor Node (servidor em produção sem ganho para conteúdo
  fixo). ADRs [0002](../adr/0002-angular-como-framework.md) e
  [0003](../adr/0003-pre-renderizacao-estatica.md).
- **Qualidade automatizada.** ESLint, Prettier, commitlint com Husky, testes unitários com
  cobertura mínima de 80% e testes E2E com Playwright sobre o build pré-renderizado.
- **CI/CD com GitHub Actions e deploy na Vercel.** O deploy é feito pelo próprio workflow, com a
  CLI da Vercel, e só roda depois de lint, testes e E2E passarem. Cada PR ganha uma URL de
  preview. Descartei a integração Git automática da Vercel (publicaria mesmo com testes
  falhando), o GitHub Pages (sem preview por PR) e o Railway (feito para backends). ADR
  [0004](../adr/0004-vercel-com-deploy-pelo-github-actions.md).
- **Dependabot** para manter dependências e ações do GitHub atualizadas, com agrupamento das
  atualizações do Angular, dos testes e do lint.
- **ADRs.** Cada decisão importante vira um documento curto com contexto, alternativas e
  consequências. ADR [0001](../adr/0001-registrar-decisoes-com-adrs.md).
- **OpenSpec (desenvolvimento orientado a specs).** Toda funcionalidade começa como uma change
  com proposta, specs, design e tarefas, revisada antes do código. ADR
  [0005](../adr/0005-desenvolvimento-orientado-a-specs.md).
- **Regras de código do ECC.** Só as regras que valem para o projeto ficam versionadas em
  `.claude/rules/ecc/`; o resto do pacote fica fora do Git. ADR
  [0006](../adr/0006-regras-de-codigo-com-ecc.md).
- **Equipe de agentes no Maestri.** Um maestro, o Regente (Claude Opus 5.5), planeja, delega e
  integra. Quatro especialistas (Claude Sonnet 5.5) têm escopos próprios: Pincel (design/UI),
  Compasso (animações), Sentinela (testes) e Escriba (documentação). Descartei usar um único
  agente e usar subagentes dentro de uma sessão. ADR
  [0007](../adr/0007-equipe-de-agentes-no-maestri.md).

## Aprendizado

- O primeiro pipeline publicava no GitHub Pages. Troquei por Vercel ainda antes do primeiro
  deploy, porque o Pages não oferece preview por Pull Request. Valeu ter a decisão no OpenSpec:
  a troca foi uma edição de proposta, não uma reescrita.
- PRs do Dependabot não recebem os secrets do repositório, então o deploy de preview precisou
  ser pulado neles.
- Os primeiros PRs do Dependabot propuseram TypeScript 7 e `@types/node` 26. Fechei os dois e
  configurei o `dependabot.yml` para ignorar essas versões, porque o TypeScript segue a
  compatibilidade com o Angular e os tipos do Node seguem o Node do projeto.
- Agentes trabalhando na mesma cópia do repositório podem gerar conflitos. Por isso o maestro só
  dispara em paralelo tarefas que mexem em arquivos diferentes.

## Links

- Change arquivada:
  [`openspec/changes/archive/2026-10-08-configurar-fundacao-do-projeto`](../../openspec/changes/archive/2026-10-08-configurar-fundacao-do-projeto/)
- Specs resultantes: [`publicacao-do-site`](../../openspec/specs/publicacao-do-site/spec.md) e
  [`pipeline-de-qualidade`](../../openspec/specs/pipeline-de-qualidade/spec.md)
- Pull Requests:
  [#1 fundação](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/1),
  [#8 arrumação pós-fundação](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/8),
  [#9 ADRs e equipe de agentes](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/9),
  [#10 telas do design](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/10),
  [#11 notes e portals](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/11).
  Os PRs [#2](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/2) a
  [#5](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/5) são atualizações do
  Dependabot.
- Documentação: [arquitetura](../arquitetura.md), [CI/CD e deploy](../deploy.md),
  [equipe de agentes](../equipe-de-agentes/README.md)

## Rascunho de post para o LinkedIn

> Antes de desenhar a primeira tela do meu portfólio, passei o dia montando a fundação.
>
> Parece exagero para um site pessoal, mas o portfólio também é a prova de como eu trabalho. Então
> o primeiro passo foi garantir que cada mudança passe por lint, testes e uma revisão antes de ir
> ao ar, com uma URL de preview para cada Pull Request.
>
> O que ficou de pé: Angular 22 pré-renderizado, deploy automático na Vercel, e cada decisão
> importante registrada num ADR, com as alternativas que descartei.
>
> O processo também é diferente do que eu fazia antes. Toda funcionalidade começa como uma
> especificação (com o OpenSpec) e só depois vira código. E quem escreve o código é uma equipe de
> agentes de IA: um maestro que planeja e revisa, e quatro especialistas, cada um com o seu papel
> (design, animações, testes e documentação).
>
> Também errei no caminho: comecei publicando no GitHub Pages e troquei para a Vercel antes do
> primeiro deploy, porque o Pages não gera preview por Pull Request.
>
> Daqui para frente vou contar a construção do portfólio por aqui, uma etapa de cada vez.
>
> Você trabalha com IA no seu desenvolvimento? Como organiza o que ela pode ou não decidir?
>
> #Angular #DesenvolvimentoDeSoftware #IA
