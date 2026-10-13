# Proposal

## Why

Depois da change de tokens, o site já tem as cores e a escala do IntelliJ New UI, mas a moldura
continua a do Eclipse: barra de ferramentas com ícones coloridos antigos espalhados, cabeçalho
`Portfolio_Vinicius × — ▢`, botão de texto "Seções" no celular e uma barra de status sem os
elementos da New UI. Esta é a change 2 do [ADR-0011](../../../docs/adr/0011-identidade-visual-intellij-new-ui.md)
(itens 5 e 6 do briefing): é a que tira de vez a cara de Eclipse.

## What Changes

- **Barra superior da New UI (40px):** à esquerda, o widget do projeto (`PV portfolio-vinicius ▾`)
  e o da branch (`⎇ master ▾`); à direita, a configuração de execução
  (`PortfolioApplication ▾`), **Executar** (o mesmo botão de hoje, ativo só nos projetos com
  preview), **Depurar**, **Buscar** (abre a busca de seções que já existe) e **Configurações**.
- **Faixa de ferramentas à esquerda (40px):** **Projeto** (mostra e esconde o painel do projeto),
  **Commit** e **Estrutura**.
- **Painel do projeto** com cabeçalho "Projeto" no estilo da New UI, no lugar de
  `Portfolio_Vinicius × — ▢`.
- **Barra de status da New UI (24px):** breadcrumbs do arquivo à esquerda
  (`portfolio-vinicius › src › main › java › … › Skills.java`) e, à direita, `linha:coluna`,
  `LF`, `UTF-8`, `4 spaces` e a branch `master`, mais o **SHA curto do commit real do deploy**
  com link para o GitHub.
- **Ícones oficiais da IntelliJ Platform** (New UI, tema escuro), em toda a casca, na árvore e
  nas abas, no lugar dos ícones desenhados no estilo Eclipse, com o arquivo de créditos.
- **Celular:** a barra superior compacta, sem a faixa de ferramentas; o botão do projeto (ícone)
  abre a gaveta.
- Entrada 0011 do diário.

Fora do escopo: árvore em pacotes e fim da paginação (change 3), Executar na calha (change 4),
janela de Run (change 5) e a reescrita do Java (change 6). O campo `pacote` entra agora só para
os breadcrumbs.

## Capabilities

### New Capabilities

- `barra-superior`: widgets de projeto e branch, configuração de execução e ações da barra
  superior.

### Modified Capabilities

- `casca-da-ide`: estrutura com barra superior, faixa de ferramentas e painel do projeto da New
  UI; quais controles são decorativos; o botão do projeto no celular.
- `barra-de-status`: breadcrumbs e os indicadores da New UI no lugar de `Java 21` e `main`;
  commit do deploy.
- `sistema-visual`: ícones oficiais com créditos.

## Impact

- Código: `layout/` (barra superior, faixa de ferramentas, painel, status), `shared/icone`
  (conjunto novo), `public/icones/` (ícones da New UI), `core/secoes.ts` (campo `pacote`), um
  script que gera as informações do build (SHA) e o `package.json`.
- Licença: `public/icones/CREDITOS.md` (ou `NOTICE`), menção no README.
- Testes: unitários e E2E das barras, da faixa, do status e do celular; axe.
- Documentação: `docs/componentes.md`, `docs/arquitetura.md`, README e a entrada 0011 do diário.
