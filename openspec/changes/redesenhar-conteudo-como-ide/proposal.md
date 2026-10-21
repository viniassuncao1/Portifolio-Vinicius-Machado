# Proposal

## Why

A refatoração anterior (ADR-0019) deixou o conteúdo em cartões, hero gigante e bento: na prática, o
visual de um portfólio de referência dentro da moldura da IDE. O Vinicius reprovou isso. Ele quer a
IDE e o Java como **linguagem do conteúdo** (cada seção com a forma do seu arquivo, sidebar fixa,
ícones, movimento), sem perder a leitura rápida de quem recruta.

## What Changes

- Cada seção passa a ter forma própria de IDE, em vez de cartões genéricos:
  - **Início:** o editor mostra `public class ViniciusMachado` com cargo, stack e provas, e um painel
    **Run** digita `./gradlew bootRun`, cujo resultado é a apresentação ("Disponível para propostas").
  - **Skills:** um `build.gradle` interativo; passar o mouse, focar ou tocar numa dependência mostra os
    projetos da vitrine que a usam.
  - **Experiência:** `git log --graph` que se desenha ao rolar.
  - **Projetos:** janela de Run com preview vivo (a vitrine atual vira o conteúdo dela).
  - **Contato:** terminal com os contatos como links reais.
  - Sobre, Formação e demais seções: arquivo renderizado (README, `pom`/`record`) com o mesmo cuidado.
- **Sidebar fixa** (árvore do projeto sempre visível, com ícones e marca deslizante no item atual,
  breadcrumb que acompanha a rolagem), abas com indicador e paleta de comandos (Ctrl/Cmd+K).
- **Primeira dobra para recrutador:** cargo, stack, Currículo (PDF), LinkedIn, GitHub e e-mail visíveis
  sem rolar, sem exigir que o visitante entenda a metáfora.
- **Remove** o cartão como visão padrão e o hero/bento de referência. O toggle Cartão ⇄ Código fica
  só se o protótipo mostrar que ele ainda ajuda (decisão em aberto no design).
- Preserva: `core/perfil.ts` (fonte única de fatos), vitrine de projetos, movimento (`motion` só após a
  hidratação, nunca com movimento reduzido), a11y/AXE, currículo, SSG e a suíte de testes (adaptada).

## Capabilities

### New Capabilities
- `conteudo-em-linguagem-de-ide`: como as seções usam elementos de IDE e Java como forma do conteúdo,
  a sidebar fixa e o que um recrutador vê na primeira dobra.

### Modified Capabilities
- `orientacao-do-visitante`: saem as duas visões (Cartão ⇄ Código) e o código que vira cartão na
  abertura.
- `vitrine-de-projetos`: a vitrine passa a ser o conteúdo de uma janela de Run.

## Impact

- `src/app/features/*`, `src/app/shared/cartoes/*` (removidos ou reaproveitados), `src/app/layout/*`
  (sidebar, abas, painel Run), `src/styles/*`.
- Testes unitários e e2e que assumem o cartão como padrão (`visao-geral`, `cartoes-das-secoes`, `secoes*`).
- Docs: novo ADR que revisa o item 8 do ADR-0019; README e `docs/componentes.md`.
- Protótipo de referência: https://claude.ai/artifact/79LwBdGnav5GqbkZ9XRk4M (2 telas: Início e Skills).
