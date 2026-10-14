# Proposal

## Why

As duas primeiras changes do [ADR-0011](../../../docs/adr/0011-identidade-visual-intellij-new-ui.md)
deixaram o site "literalmente o IntelliJ" e apagaram a identidade do design feito sob encomenda.
O Vinicius decidiu ([ADR-0012](../../../docs/adr/0012-design-original-com-elementos-do-intellij.md))
que o **design original predomina**, mantendo do IntelliJ o que dá cara de IDE de verdade: ícones
de Java, projeto em pastas e pacotes, referências ao Git, a faixa de ferramentas, a barra de
status com o caminho do arquivo e a tipografia nova (Inter e escala compacta).

Esta change começou como "barras e ícones da New UI" (ícones, campo `pacote`, SHA do build, barra
superior, faixa e status já implementados na branch) e é ajustada para o novo rumo antes do merge.

## What Changes

- **Paleta e formas do design de volta:** fundos `#2B2B2B`/`#1C1C1C`, sintaxe com palavras-chave
  em rosa, foco rosa, barra de ferramentas com degradê e controles de janela, editor com cantos
  arredondados, abas e cabeçalho do painel `Portfolio_Vinicius × — ▢` do design. A tipografia
  (Inter 13px, JetBrains Mono 14px) e a densidade compacta da change de tokens continuam.
- **Barra de ferramentas do design com Git:** os ícones da IntelliJ Platform (variante clara, por
  causa do fundo claro do degradê), o indicador de branch `master`, Executar (preview nos
  projetos com site) e Buscar (abre a busca); o resto decorativo.
- **Faixa de ferramentas à esquerda** (Projeto mostra e esconde o painel; Commit e Estrutura
  decorativos), nas cores do design.
- **Barra de status** com o caminho do arquivo, `linha:coluna`, `LF`, `UTF-8`, `4 spaces`,
  `master` e o commit do deploy, nas cores e no estilo do design.
- **Ícones da IntelliJ Platform** (Java, pastas, pacotes) na árvore e nas abas, com créditos.
- **Celular:** barra compacta com Projeto (abre a gaveta) e Buscar.
- **Árvore em pastas** (pedido do Vinicius, antecipado da change 3): `sobre`, `skills`,
  `experiencias`, `projetos`, `formacao`, `recomendacoes` e `contato`, que expandem e recolhem
  mostrando os arquivos `.java` das seções. A paginação continua por enquanto.
- **Cores de sintaxe do Java do IntelliJ** no editor (laranja, verde, ciano), sobre os fundos do
  design.
- **Executar na calha** (antecipado da change 4): ▶ na linha `public class` dos projetos com
  site, no lugar do botão "▶ Executar" sobre o código.
- **Revisão final do Vinicius:** ícones do design na árvore, nas abas e na barra, e barra de
  ferramentas escura no lugar do degradê claro (detalhes na seção 5 do design).
- ADR-0012, `CLAUDE.md` e a entrada 0011 do diário contando a virada de rumo.

Fora do escopo: árvore em pacotes e fim da paginação (change 3), Executar na calha (4), janela de
Run (5) e a reescrita do Java (6), agora no visual do design original.

## Capabilities

### New Capabilities

- `barra-superior`: barra de ferramentas do design com o indicador de branch, Executar e Buscar.

### Modified Capabilities

- `casca-da-ide`: estrutura com a barra do design, faixa de ferramentas, painel com o cabeçalho
  do design e editor arredondado; controles decorativos; o botão Projeto no celular.
- `barra-de-status`: caminho do arquivo e indicadores de IDE; commit do deploy.
- `janela-de-preview`: o Executar passa para a calha.
- `sistema-visual`: o design original volta a ser a referência visual; acento e foco rosa;
  `theme-color` do design; ícones com créditos.

## Impact

- Código: `src/styles/_tokens.scss` (paleta, degradê, raios), `layout/` (barra, faixa, painel,
  status), `shared/icone` (variantes clara e escura), `public/icones/new-ui/`, `index.html`.
- Já entregue na branch: ícones e créditos, campo `pacote` e breadcrumbs, script do SHA do build
  com `SHA_DO_COMMIT` no preview, faixa, painel escondível, status e celular.
- Testes: os de cor, foco e formas voltam aos valores do design; os de barras, faixa, status e
  axe continuam.
- Documentação: ADR-0012, `CLAUDE.md`, README, `docs/` e o diário 0011.
