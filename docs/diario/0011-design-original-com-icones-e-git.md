# 0011: Design original com ícones e Git

- **Data:** 2026-10-14
- **Change:** [design-original-com-icones-e-git](../../openspec/changes/design-original-com-icones-e-git/) (começou como "barras e ícones da New UI")
- **PR:** a definir
- **ADRs:** [0012](../adr/0012-design-original-com-elementos-do-intellij.md), que substitui em parte o [0011](../adr/0011-identidade-visual-intellij-new-ui.md)

Capturas desta entrada: a definir (as imagens ainda não foram versionadas).

## Problema

Depois da [change de tokens](0010-tokens-e-tipografia-intellij.md), a segunda etapa do
[ADR-0011](../adr/0011-identidade-visual-intellij-new-ui.md) refez a moldura do site no IntelliJ
New UI: barra superior, faixa de ferramentas, painel do projeto, barra de status e ícones
oficiais. Quando o Vinicius viu o resultado, a conclusão foi que o site ficou **"literalmente o
IntelliJ"**. Tecnicamente estava certo, e era justamente o problema: o portfólio perdeu a
identidade do design feito sob encomenda para ele, que é o que o diferencia de qualquer outro
site com cara de IDE.

## Decisões

- **O design original volta e predomina.** O [ADR-0012](../adr/0012-design-original-com-elementos-do-intellij.md)
  devolve a paleta das telas (fundos `#2B2B2B` e `#1C1C1C`, palavras-chave e foco em rosa), a
  barra de ferramentas com degradê e controles de janela, o editor arredondado, as abas e o
  cabeçalho `Portfolio_Vinicius`.
- **Do IntelliJ ficam os elementos de IDE de verdade.** Os ícones da IntelliJ Platform (Java,
  pastas, pacotes, Executar, Buscar, Git), a estrutura do projeto em pacotes, as referências ao
  Git (a branch `master` e o commit do deploy), a faixa de ferramentas à esquerda, a barra de
  status com o caminho do arquivo e a tipografia da change de tokens (Inter na interface,
  JetBrains Mono no código, na escala compacta).
- **O que já tinha sido feito foi aproveitado.** Ícones e créditos, o campo `pacote` e os
  breadcrumbs, o script do commit do deploy, a faixa de ferramentas com o painel escondível, a
  barra de status e o celular continuam. Mudaram as cores e as formas, não a estrutura.
- **Ícones claros na barra de ferramentas.** O degradê do design é claro, então a barra usa a
  variante do tema claro dos ícones; no resto da interface, a escura.
- **A mudança de ideia virou um ADR.** Em vez de reverter em silêncio, o ADR-0012 registra o que
  eu pensei, o que vi e por que mudei, e mantém o ADR-0011 no histórico como "substituído em
  parte". Descartei manter o IntelliJ puro (fiel à IDE, mas apaga o design) e voltar ao design
  sem nada do IntelliJ (recupera a identidade, mas perde os elementos de IDE e a escala compacta
  que resolveram o "tudo grande demais").

## Aprendizado

- **Testar uma direção custa menos do que discuti-la.** Só vendo o IntelliJ no ar ficou claro que
  ele era demais. Fatiar o redesign em changes pequenas permitiu parar na segunda, antes de
  investir nas outras quatro no visual errado.
- **Dá para voltar mantendo o que funcionou.** A virada não jogou fora o trabalho: a escala
  compacta, os ícones, os pacotes e o Git ficaram. Separar "identidade" de "elementos de IDE"
  tornou possível ficar com uma parte e trocar a outra, e o fato de os valores visuais morarem em
  `_tokens.scss` fez a volta ser, em grande parte, troca de valores.
- **ADR também serve para mudar de ideia.** Registrar a reviravolta com o contexto e as
  alternativas é mais útil do que apagar a decisão antiga.
- **Ícones têm licença.** Os da IntelliJ Platform são Apache 2.0, então registrei os créditos em
  `public/icones/new-ui/CREDITOS.md`, com uma seção no README. O cuidado com marcas continua:
  nenhum logotipo do IntelliJ ou da JetBrains entrou, e o projeto não é afiliado à JetBrains.
- **No `pull_request`, o `GITHUB_SHA` é o commit de merge.** Esse commit temporário não existe na
  branch e o link do commit na barra de status quebrava no deploy de preview. O script do build lê
  primeiro `SHA_DO_COMMIT`, que o workflow define com `github.event.pull_request.head.sha`.
- **O índice do Git compartilhado misturou arquivos num commit.** Com vários agentes na mesma
  cópia do repositório, um commit levou arquivos de outra faixa. É a lição das entradas
  [0005](0005-experiencia-de-ide-e-java-moderno.md) e
  [0006](0006-certificacoes-niveis-e-legibilidade.md): `git add` só com o caminho exato.
- **Números finais.** Testes unitários: a definir. Testes E2E: a definir.

## Links

- Change: [`openspec/changes/design-original-com-icones-e-git`](../../openspec/changes/design-original-com-icones-e-git/)
- ADRs: [0012 design original com elementos do IntelliJ](../adr/0012-design-original-com-elementos-do-intellij.md)
  e [0011 identidade visual do IntelliJ New UI](../adr/0011-identidade-visual-intellij-new-ui.md)
- Documentação: [componentes](../componentes.md), [arquitetura](../arquitetura.md) e os
  [créditos dos ícones](../../public/icones/new-ui/CREDITOS.md)
- Entrada anterior: [0010 tokens e tipografia](0010-tokens-e-tipografia-intellij.md)

## Rascunho de post para o LinkedIn

> Testei uma direção de design, vi o resultado e voltei atrás. E acho que foi a melhor decisão do
> projeto.
>
> Meu portfólio simula uma IDE, e eu resolvi refazer a moldura no estilo do IntelliJ, a IDE mais
> usada em Java. Ficou fiel demais: quando vi no ar, estava literalmente o IntelliJ, e o design
> feito sob encomenda para mim, que é o que diferencia o site, tinha sumido.
>
> Em vez de insistir, registrei a mudança de ideia num ADR. O design original volta a predominar
> (paleta, degradê, formas), e do IntelliJ ficam só os elementos que dão cara de IDE de verdade:
> ícones de Java, pastas e pacotes, referências ao Git, a faixa de ferramentas, o caminho do
> arquivo na barra de status e a tipografia compacta.
>
> Três aprendizados: fatiar o redesign em etapas pequenas me deixou parar na segunda, antes de
> investir nas outras quatro no visual errado. Concentrar os valores visuais num arquivo de tokens
> fez a volta ser, em boa parte, trocar valores. E o ADR serve também para registrar que você
> mudou de ideia, e por quê.
>
> Quando foi a última vez que você voltou atrás num design e acertou?
>
> #Angular #Design #ADR
