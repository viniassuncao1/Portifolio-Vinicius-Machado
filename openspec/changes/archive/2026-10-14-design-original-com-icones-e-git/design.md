# Design

## Context

A branch já tem, da primeira versão desta change: ícones da IntelliJ Platform com créditos
(`public/icones/new-ui/`), o campo `pacote` e `core/breadcrumbs.ts`, o script do SHA do build
(com `SHA_DO_COMMIT` no preview), a barra superior e a faixa no estilo da New UI, o painel
escondível, a barra de status nova, o celular compacto e os testes (`e2e/barras-da-new-ui.spec.ts`).
A `main` tem os tokens do IntelliJ (change 1, PR #26). Os valores do design original estão nos
tokens anteriores ao merge `cd6b428` (`git show cd6b428^1:src/styles/_tokens.scss`).
Referência: ADR-0012 e as telas `design/telas/` (01, 02, 05, 07 e 24).

## Goals / Non-Goals

**Goals:**

- O design original volta a predominar: paleta, degradê, controles de janela, editor arredondado,
  abas e cabeçalho do painel, como nas telas.
- Mantém, sem perder função: ícones de IDE, faixa de ferramentas, painel escondível, barra de
  status com caminho e Git, commit do deploy, Executar, Buscar e o celular.

**Non-Goals:**

- Voltar a tipografia e os tamanhos do design: ficam Inter 13px, JetBrains Mono 14px e a
  densidade compacta da change 1 (o Vinicius já tinha achado o design grande demais).
- Árvore em pacotes, Executar na calha, janela de Run e reescrita do Java.

## Decisions

### 1. Tokens

Cores, degradê da barra, controles de janela, raios do editor e das abas e a forma do cabeçalho
voltam aos valores de `cd6b428^1` (que já trazem os ajustes de contraste registrados na note
"Design Tokens"). Tipografia, alturas de linha, larguras e alturas das barras ficam como na
change 1, salvo onde a forma do design pedir uma medida (ex.: raio e altura do cabeçalho do
painel), registrado pelo Pincel. Acento e foco voltam ao rosa `#DE60D2` com anel de 2px;
`theme-color` volta a `#2B2B2B`. A opção ativa da busca usa o realce do design e passa no
contraste.

### 2. Barra de ferramentas

Volta o degradê e os controles de janela do design. À esquerda, os ícones da IntelliJ Platform na
variante **clara** (`*.svg` sem `_dark`, com o mesmo arquivo de créditos), na ordem e na
quantidade da tela, incluindo Executar e Buscar funcionais, e o indicador de branch `master`.
Os widgets `PV portfolio-vinicius` e `PortfolioApplication` saem.

### 3. Painel, faixa e status

O cabeçalho do painel volta a `Portfolio_Vinicius × — ▢` do design. A faixa de ferramentas e a
barra de status ficam, nas cores do design (cinzas do painel e da faixa de abas, texto
`--cor-texto`). O rodapé decorativo do painel continua, porque é do design.

### 4. Celular

Barra compacta com Projeto e Buscar, no degradê do design; rodapé com o arquivo e
`linha:coluna`.

### 5. Revisão do Vinicius (ícones do design e barra escura)

Depois de ver a versão com degradê, o Vinicius pediu: manter a árvore em pastas, usar os **ícones
do design** (os SVGs de `public/icones/*.svg`, no estilo das telas) e trocar a **barra branca de
cima**, que destoava. Decisões, que prevalecem sobre as seções 2 e 4:

- Barra de ferramentas e barra do celular com fundo escuro nos cinzas do design (sem degradê),
  ícones do design, `master`, controles de janela e foco rosa (o anel escuro da exceção sai).
- Árvore, arquivos e abas com os ícones do design; os da IntelliJ Platform ficam só no ▶ da
  calha, na branch e na faixa de ferramentas, e a variante clara sai.
- As cores de sintaxe do Java do IntelliJ, a árvore em pastas e o ▶ da calha continuam.

## Risks / Trade-offs

- [Ícones escuros sobre o degradê claro] → variante clara na barra, conferida no contraste.
- [Testes fixados nas cores do IntelliJ] → a Sentinela troca os valores esperados pelos do
  design, sem afrouxar os testes de contraste e axe.
- [Diário e docs com o rumo antigo] → o Escriba reescreve a entrada 0011 contando a virada.

## Faixas da equipe

| Faixa  | Quem      | O quê                                                         |
| ------ | --------- | ------------------------------------------------------------- |
| Visual | Pincel    | Tokens do design, ícones claros, barra, painel, faixa, status |
| Testes | Sentinela | Valores esperados do design, axe e foco                       |
| Docs   | Escriba   | README, `docs/`, diário 0011 com a virada de rumo             |
