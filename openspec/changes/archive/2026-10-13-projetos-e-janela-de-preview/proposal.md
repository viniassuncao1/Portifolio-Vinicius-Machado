# Proposal

## Why

As quatro seções de projetos ainda mostram o aviso de "em construção", e são elas que mostram
trabalho real entregue. Dois projetos são sites no ar (a landing page da Dra. Juliana e a da
Watts Company), e o design mostra uma janela de preview abrindo sobre a IDE (telas 11 a 15).

## What Changes

- **Janela de preview**: uma janela no estilo da IDE, sobre a casca, que abre com uma captura do
  site (rolável), tem o botão **"Ver ao vivo"** para trocar pelo site real num iframe e
  **"Abrir em nova aba"**. Decisão do Vinicius.
- **Executar (▶)**: o botão de play da barra de ferramentas e um botão "▶ Executar" no projeto
  abrem a janela de preview, como rodar o projeto numa IDE. Só aparecem ativos nos projetos com
  site.
- **Projeto 1, Ana** (tela 10): agente de IA em n8n para atendimento via WhatsApp, com o painel
  em React.
- **Projeto 2, landing page da Dra. Juliana Maluhy** (telas 11 a 13), com preview de
  https://www.drajulianamaluhy.com/.
- **Projeto 3, landing page da Watts Company** (telas 14 e 15), com preview de
  https://wattscompany.com.br/.
- **Projeto 4, cases da Memora** (telas 16 a 18) em três páginas: migração Oracle →
  PostgreSQL, scraper de licitações e AyoForms.
- Tudo no estilo de Java legível já adotado; entrada 0007 do diário.

## Capabilities

### New Capabilities

- `janela-de-preview`: abrir, rolar, ver ao vivo, abrir em nova aba e fechar a janela de preview
  de um projeto.
- `secao-projetos`: conteúdo dos quatro projetos e quais têm preview.

### Modified Capabilities

Nenhuma.

## Impact

- Código: `shared/janela-de-preview/`, serviço em `core/`, botão Executar na
  `BarraDeFerramentas`, `features/projeto-1` a `projeto-4`, capturas em `public/projetos/` e o
  registro das rotas (Projeto 4 com `paginas: 3`).
- Testes: unitários e E2E da janela (teclado, foco, ao vivo, fechar) e dos projetos; axe com a
  janela aberta.
- Documentação: `docs/componentes.md` e a entrada 0007 do diário.
