# 0011: Barras e ícones da New UI

- **Data:** 2026-10-13
- **Change:** [barras-e-icones-da-new-ui](../../openspec/changes/barras-e-icones-da-new-ui/)
- **PR:** a definir
- **ADRs:** [0011](../adr/0011-identidade-visual-intellij-new-ui.md)

Capturas desta entrada: a definir (as imagens `new-ui-*.png` ainda não foram versionadas).

## Problema

Depois da [change de tokens](0010-tokens-e-tipografia-intellij.md), o site já tinha as cores e a
escala do IntelliJ New UI, mas a **moldura continuava a do Eclipse**: uma barra de ferramentas com
ícones coloridos antigos, o cabeçalho `Portfolio_Vinicius × — ▢`, o botão de texto "Seções" no
celular e uma barra de status sem os elementos da New UI. Esta é a segunda das seis changes do
[ADR-0011](../adr/0011-identidade-visual-intellij-new-ui.md), e a que tira de vez a cara de
Eclipse.

## Decisões

- **Barra superior da New UI (40px).** Os widgets de projeto e branch, a configuração de execução,
  Executar, Depurar, Buscar e Configurações. Só Buscar (abre a busca de seções que já existia) e
  Executar (nos projetos com preview) funcionam; o resto é decorativo, fora da leitura e do foco.
- **Faixa de ferramentas e painel escondível.** Uma faixa de 40px à esquerda, só no desktop: o
  botão Projeto mostra e esconde o painel do projeto, cujo cabeçalho agora é só "Projeto". Commit e
  Estrutura são decorativos.
- **Barra de status com breadcrumbs.** O caminho do arquivo
  (`portfolio-vinicius › src › main › java › … › Skills.java`) vem de `core/breadcrumbs.ts`, a
  partir do novo campo `pacote` de cada seção. À direita, `linha:coluna`, `LF`, `UTF-8`,
  `4 spaces`, a branch e o **commit do deploy**, com link para o GitHub. `Java 21` e `main` saíram.
- **Celular.** Barra superior compacta, sem a faixa; o botão Projeto abre a gaveta e o botão de
  texto "Seções" saiu.
- **Ícones oficiais da IntelliJ Platform**, copiados de `JetBrains/intellij-community`
  (`platform/icons/src/expui`, versões `_dark`) só nos usados, e renderizados por `shared/icone` com
  `NgOptimizedImage`. Descartei desenhar ícones "parecidos" à mão: o objetivo é parecer o IntelliJ
  de verdade.
- **O SHA do commit sai de um script**, `scripts/gerar-informacoes-do-build.mjs`, que roda nos
  scripts `pre*` e lê só variáveis de ambiente, sem `git` no build.

## Aprendizado

- **Ícones têm licença.** O repositório da JetBrains é Apache 2.0, então dá para usar os ícones
  de interface, desde que o aviso de copyright e a origem fiquem registrados. Criei
  `public/icones/new-ui/CREDITOS.md` (com o original de cada arquivo) e uma seção de créditos no
  README. O cuidado extra foi com **marcas**: a licença cobre os ícones genéricos, não os
  logotipos de produto. Nenhum logotipo do IntelliJ ou da JetBrains entrou, o selo `PV` faz o papel
  do ícone do projeto, e o texto diz que o projeto não é afiliado à JetBrains.
- **No `pull_request`, o `GITHUB_SHA` é o commit de merge.** É um commit temporário que não existe
  na branch, então o link do commit na barra de status dava errado no deploy de preview. Por isso
  o script lê primeiro uma variável própria, `SHA_DO_COMMIT`, que o workflow define com
  `github.event.pull_request.head.sha`. No deploy de produção o `GITHUB_SHA` já é o commit certo.
- **O índice do Git compartilhado misturou arquivos num commit.** Com vários agentes na mesma
  cópia do repositório, um commit levou junto arquivos de outra faixa. É a mesma lição da
  [entrada 0005](0005-experiencia-de-ide-e-java-moderno.md) e da
  [0006](0006-certificacoes-niveis-e-legibilidade.md): `git add` só com o caminho exato.
- **Números finais.** Testes unitários: a definir. Testes E2E: a definir.

## Links

- Change: [`openspec/changes/barras-e-icones-da-new-ui`](../../openspec/changes/barras-e-icones-da-new-ui/)
- ADR: [0011 identidade visual do IntelliJ New UI](../adr/0011-identidade-visual-intellij-new-ui.md)
- Documentação: [componentes](../componentes.md), [arquitetura](../arquitetura.md) e os
  [créditos dos ícones](../../public/icones/new-ui/CREDITOS.md)
- Entrada anterior: [0010 tokens e tipografia do IntelliJ](0010-tokens-e-tipografia-intellij.md)

## Rascunho de post para o LinkedIn

> Trocar as cores do meu portfólio pelas do IntelliJ não bastou: a moldura ainda parecia Eclipse.
>
> Na segunda etapa do redesign refiz as barras. A barra superior ganhou os widgets de projeto e
> branch e as ações de Executar e Buscar, o painel do projeto passou a esconder e mostrar pela
> faixa lateral, e a barra de status ganhou o caminho do arquivo, como num projeto Maven, e o
> commit do deploy, com link para o GitHub. Os ícones agora são os oficiais da IntelliJ Platform.
>
> Três aprendizados. Ícones têm licença: os da JetBrains são Apache 2.0, então registrei os
> créditos e deixei de fora qualquer logotipo de produto. No pull request, o GITHUB_SHA é o commit
> de merge, que não existe na branch, então criei uma variável própria para o link do commit não
> quebrar. E com vários agentes trabalhando na mesma cópia do repositório, um commit levou
> arquivos de outra pessoa: git add só com o caminho exato.
>
> Você confere a licença dos ícones que usa nos seus projetos?
>
> #Angular #IntelliJ #OpenSource
