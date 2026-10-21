# Briefing para o Maestri: experiência focada em recrutadores

Data: 2026-10-21. Autor: Vinicius, com o plano montado por uma sessão do Claude Code.
Change: [`refatorar-experiencia-do-usuario`](../../openspec/changes/archive/2026-10-21-refatorar-experiencia-do-usuario/).
Branch: `feat/refatorar-experiencia` (já criada, com trabalho não commitado no checkout).

## 0. Autorização e regras de execução (leia primeiro)

**O Vinicius não estará disponível para aprovar nada durante a execução.** Ele aprovou este plano
por antecipação, com estas palavras: "pode reformular tudo, não se prenda ao design antigo; use as
skills do ECC de design, motion e UI/UX; quero referências ao design antigo e à IDE, mas sem me
prender a ele; faça tudo de uma vez". Isso vale como a aprovação da change exigida pelo
`CLAUDE.md`. Portanto:

1. **Execute tudo de uma vez, em trilhas paralelas** (seção 4), sem pausar para pedir aprovação. Se
   uma decisão estiver aberta, **escolha a opção recomendada neste documento**, registre-a no ADR-0019
   (ou num ADR novo) e no diário, e siga.
2. **O design antigo (`design/telas/`) e o ADR-0012 deixam de ser vinculantes.** A IDE continua
   como linguagem (seção 2). Nada do que existe é sagrado, exceto: rotas e slugs (SEO), o conteúdo
   das seções, Java 21 válido no código exibido, pré-renderização (SSG), acessibilidade AA e os
   testes que protegem esses itens.
3. **Prioridade é UI/UX e recrutadores**: quem recruta entende em 30 segundos quem é o Vinicius, o
   que entrega e como chamá-lo, num desktop ou num celular.
4. **Use as skills indicadas na seção 3**, de fato (carregue-as com a ferramenta de skills antes de
   escrever código ou CSS de cada trilha) e cite no PR quais usou.
5. **Git:** o Regente é o dono do git. Commits pequenos, um assunto por commit, Conventional
   Commits em pt-BR, na branch `feat/refatorar-experiencia`. Nunca na `main`, nunca `--force`.
   Abra o PR com a descrição completa e **deixe-o pronto para o merge; o merge é do Vinicius** ao
   acordar (não mergeie sozinho nesta rodada).
6. Antes de dar qualquer trilha por concluída: `npm run lint && npm run test:ci && npm run build &&
npm run e2e`. A máquina do Vinicius fica lenta sob carga; rode o E2E com `--workers=2` e confira
   falhas isoladas antes de concluir que algo quebrou.
7. **Não deixe nada pela metade.** Se uma trilha atrasar, entregue a menor versão completa e
   funcional dela e registre o resto como follow-up no diário. Prefira 6 coisas excelentes a 12
   pela metade.

## 1. Estado atual (o que já está pronto no checkout)

Feito e verificado nesta branch (lint, 922 testes unitários, build e E2E da vitrine passando):

- **ADR-0019** (`docs/adr/0019-experiencia-focada-em-recrutadores.md`), índice dos ADRs e status
  dos ADRs 0012 e 0017 atualizados.
- **Linha de base** em `docs/diario/0023-experiencia-focada-em-recrutadores.md`: Lighthouse móvel
  100 em tudo, LCP 0,9 a 1,1 s, 0 violações no axe. (A primeira medição, com LCP de 4,5 s, vinha de
  um servidor local sem compressão; foi corrigida.) A meta passa a ser **não piorar**.
- **Temas de cor por seção** (`src/styles/_temas-de-secao.scss`, claros e escuros) com teste que
  falha se qualquer par de texto e fundo ficar abaixo de 4,5:1 (`src/app/core/temas-de-secao.spec.ts`).
- **Camada de movimento com `motion`** (API vanilla, 24,6 KB gzip com `animate` e `inView`):
  `src/app/core/movimento/` (tokens, molas, `MovimentoConfig` com `signal` de movimento reduzido e
  `carregar()` por `import()`), e as diretivas `appRevelar`, `appMagnetico` e `appContador` em
  `src/app/shared/movimento/`.
- **Vitrine de projetos** em `/projetos` (e `/projetos/:slug`), na árvore como `Vitrine.java`:
  - `src/app/core/projetos.ts` (dados dos 6 projetos), capas WebP em `public/projetos/`
    (21 a 29 KB) e capa em código para os 4 projetos sem captura;
  - carrossel de scroll-snap com arrasto, botões, pontos e setas; grade alternativa; sem autoplay;
  - detalhes em `<dialog>` nativo (foco preso, Esc, galeria, "Ver em código", anterior e próximo);
  - expansão do cartão até a tela cheia e volta por View Transition conduzida pelo roteador
    (`core/transicao-de-projeto.ts` e `core/transicao-de-rota.ts`); o E2E confere que a animação
    `::view-transition-group(projeto)` roda na ida e na volta;
  - `e2e/vitrine.spec.ts` com 23 testes (arrasto, teclado, foco preso, Voltar, movimento reduzido,
    celular, tema claro, axe, peso das imagens).
- **Currículo** em `public/CV_Vinicius_Machado_Desenvolvedor_FullStack_Java.pdf`.
- **Servidor dos E2E** (`e2e/servidor.mjs`) serve `.pdf`, `.webp` e `.avif`.

**Pendente (é o que este briefing manda fazer):** tudo da seção 4. Em especial: a visão geral `/`
nova, o hero "código que vira cartão", a barra de ações do recrutador, o sistema visual v2, o
movimento no resto do site, as visões "Cartão" das seções, o desempenho (LCP) e as medições finais.

## 2. Direção de design v2 (reformulada; liberdade total)

**Design Read** (método da skill `design-taste-frontend`): portfólio de desenvolvedor, lido por
recrutadores técnicos e não técnicos com pouco tempo; tom editorial-técnico, vivo e preciso; a IDE
é a identidade, não o caminho obrigatório. Dials: variância média-alta (7), movimento alto mas
com propósito (7), densidade média (5). **Detalhe memorável: o código que vira cartão.**

### 2.1 Estrutura em duas camadas

1. **Visão geral `/` (camada do recrutador):** página rolável, escaneável, com a linguagem de IDE
   como acabamento. Blocos: hero → provas rápidas → sobre → stack → experiência → formação →
   projetos (a vitrine) → contato. Cada bloco tem um tema de cor próprio (tokens `--s-*`) que muda
   suavemente ao rolar, e um atalho para a rota completa da seção.
2. **Modo IDE (camada do curioso):** a casca atual, em `/<seção>`, com o arquivo `.java` de cada
   seção, abas, árvore, barra de status e ▶ Executar. Ganha o tratamento visual novo (tokens,
   tipografia, raios concêntricos) mas mantém a estrutura.

As duas camadas se conectam por: botão "Ver como código" em cada bloco, a busca Ctrl/Cmd+K
(que também lista as ações do recrutador) e a barra de ações.

### 2.2 O que fica do design antigo e da IDE (referências, não regras)

- Editor de cantos arredondados, abas com o arquivo `Portfolio_Vinicius`, árvore em pacotes Java,
  números de linha e as cores de sintaxe (rosa nas palavras-chave) como **textura e detalhe**.
- A **janela flutuante de preview** das telas 12 e 13 do design (controles de janela, site dentro
  de uma moldura de IDE) vira o contêiner dos detalhes de projeto e da apresentação no hero.
- Barra de status com caminho, branch `master`, relógio de Brasília e "Disponível".
- ▶ Executar como CTA principal ("▶ Ver projetos").
- O rosa `#DE60D2` continua como acento herdado, mas cada tema de seção pode ter o seu (a skill
  `redesign-existing-projects` pede um acento por superfície; já estão nos tokens `--s-*`).

### 2.3 O que muda (liberdade para reformular)

- Layout, paleta, formas e proporções saem do design antigo. Permitido trocar a barra de
  ferramentas por uma **ilha flutuante** ("fluid island": pílula de vidro com Buscar, Currículo,
  Tema e ▶), e a faixa de ferramentas à esquerda por navegação contextual.
- Tipografia: **uma família de display/UI com personalidade** (recomendado: **Geist** variável, ou
  Bricolage Grotesque) + **JetBrains Mono** para código; duas famílias no máximo, servidas pelo
  próprio site (`@fontsource-variable/*`), sem fontes de terceiros. Inter sai (as skills de design
  a tratam como padrão genérico); registre a troca no ADR.
- Superfícies: **double-bezel** (casca externa de 1 px translúcida + miolo com raio concêntrico),
  botões em pílula com **seta em círculo aninhado**, rótulos "eyebrow" em caixa-alta fina,
  macro-espaço entre blocos, sombras tingidas (nunca preto puro), um leve ruído/grão nos fundos
  escuros, `text-wrap: balance/pretty`, `tabular-nums` nos números.
- Proibido (skills `design-taste-frontend` e `high-end-visual-design`): grade de 3 cartões
  iguais, gradiente roxo "de IA", blobs decorativos, cartão dentro de cartão, hero genérico,
  `transition: all`, `height: 100vh` (use `100dvh`), seção escura isolada no meio de página clara.

### 2.4 Ideias novas para recrutadores (todas entram)

1. **Hero "código que vira cartão":** a classe `ViniciusMachado extends DesenvolvedorFullStack` é
   digitada e se resolve (em até 2,5 s) no cartão de apresentação: nome, cargo, stack em chips,
   "Disponível", e três ações. Sem movimento: o cartão aparece direto. O conteúdo está no HTML
   desde o primeiro quadro (não pode piorar o LCP).
2. **Barra de ações sempre à vista:** Currículo (PDF), LinkedIn, GitHub e e-mail com "copiar" e
   confirmação em `aria-live`; as mesmas ações como comandos da busca.
3. **Prova em números:** faixa com fatos reais já presentes no site (Java 21, 6 projetos, X anos),
   com `appContador`. Nada inventado.
4. **Projetos como janela de preview** (já iniciado): evoluir os detalhes para abas "Visão geral /
   Código / Stack" e um bloco "build" com papel, stack e resultado.
5. **Skills como `build.gradle`:** dependências com selo de nível; cada uma leva aos projetos em
   que foi usada (evidência no lugar de autoavaliação).
6. **Experiência como `git log --graph`** que se desenha ao rolar, reaproveitando o painel do Git.
7. **Contato como terminal** (`$ contato --email`) com os links reais abaixo e cópia com
   confirmação; funciona sem o terminal.
8. **Transições:** barra fina de "compilando" na troca de rota, indicador deslizante nas abas e na
   ilha, expansão do cartão (feita), revelação de títulos por linha, texto que se acende no scroll,
   linha do tempo que se desenha, botões magnéticos e tema que muda por seção.
9. **Cartão ⇄ Código** em cada seção (visão inicial: cartão; escolha lembrada com `try/catch`).

## 3. Skills a usar (carregar antes de cada trilha)

Todas já estão instaladas; carregue-as com a ferramenta `Skill` e siga-as. Skills de movimento
`motion-*` descrevem `motion/react`: aqui valem os **princípios e tokens**, com a API vanilla do
`motion` (já adaptada em `src/app/core/movimento/`).

| Trilha                  | Skills                                                                                                                        | Para quê                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Direção e design system | `frontend-design-direction`, `design-taste-frontend`, `high-end-visual-design`, `redesign-existing-projects`, `design-system` | Design Read, dials, anti-padrões, double-bezel, tokens                          |
| Acabamento              | `make-interfaces-feel-better`, `minimalist-ui` (só para o tom de espaço e tipografia)                                         | Raio concêntrico, sombras, texto, estados, hit areas                            |
| Movimento               | `motion-foundations`, `motion-patterns`, `motion-advanced`                                                                    | Tokens, molas, reduced-motion, SSR seguro, reveal, stagger, contador, magnético |
| Acessibilidade          | `accessibility`, `frontend-a11y` e o agente `a11y-architect`                                                                  | WCAG 2.2 AA, foco, teclado, leitores de tela                                    |
| Qualidade               | `web-design-guidelines`, `browser-qa`, `playwright-cli`, `e2e-testing`, `verification-loop`, `tdd-workflow`                   | Revisão de UI, regressão visual, E2E, gates                                     |
| Desempenho e SEO        | agente `performance-optimizer`, skill `seo`, agente `seo-specialist`                                                          | LCP, CLS, imagens, meta tags                                                    |
| Angular                 | `angular-developer` (e o MCP `angular-cli`: `get_best_practices`)                                                             | Signals, `@Service`, `host`, SSR, `afterNextRender`                             |
| Processo                | `openspec-apply-change`, `architecture-decision-records`, `living-docs-governance`                                            | Tarefas, ADR, documentação                                                      |

Referências extras consultadas na pesquisa de skills: `frontend-design` e `landing-page-guide-v2`
(da conta; só os princípios, pois o segundo é para Next.js), `gpt-taste` (padrões de GSAP: **não
usar GSAP**), `industrial-brutalist-ui` e `stitch-design-taste` (inspiração de tipografia e grade,
sem adotar o estilo).

## 4. Trilhas de trabalho (todas ao mesmo tempo)

Cada trilha tem dono por arquivos para não haver conflito. O Regente integra e roda os gates.

### Trilha A: Pincel (design system v2 e visão geral)

Skills: seção 3, linhas 1, 2, 4 e 5. Escopo: `src/styles/`, `src/app/layout/`, nova
`src/app/features/visao-geral/`, `src/app/shared/`.

- A1. **Sistema visual v2:** tokens (cores por tema de seção já prontos; adicionar tipografia,
  espaçamento em escala, raios concêntricos, sombras tingidas, grão), fontes `@fontsource-variable`,
  componentes base (`superficie` com double-bezel, `botao-pilula` com seta aninhada, `etiqueta`,
  `eyebrow`). Atualize `docs/componentes.md`.
- A2. **Visão geral `/`** com os blocos da seção 2.1, usando os dados de `core/` e das features (não
  duplique conteúdo: leia dos mesmos `*.conteudo.ts` quando possível). Mantenha `Inicio.java` como
  o arquivo da rota de código.
- A3. **Hero** (estrutura e CSS; a animação é da trilha B) e **barra de ações** do recrutador
  (Currículo, LinkedIn, GitHub, e-mail com copiar), também como comandos na busca.
- A4. **Ilha de navegação** (substitui a barra de ferramentas na visão geral) e **navegação no
  celular** (barra de ações inferior: Seções, Projetos, Contato; vitrine em grade).
- A5. **Visões "Cartão"** das seções (Sobre, Diferenciais, Como uso a IA, Skills, Experiências,
  Certificações, Eventos, Formação, Idiomas, Depoimentos, Contato) e o controle "Cartão ⇄ Código",
  com a escolha lembrada. Pode ser delegado a Grafite e Nanquim por conjunto de seções
  (`features/<seção>/`), seguindo `docs/equipe-de-agentes/papeis/secoes.md`.
- A6. **Vitrine v2:** detalhes com abas "Visão geral / Código / Stack" e bloco de build; capa e
  destaques revisados com o `make-interfaces-feel-better`.
- A7. **Restyling da casca de IDE** com os tokens v2 (sem mudar a estrutura nem as rotas).

### Trilha B: Compasso (movimento)

Skills: `motion-foundations`, `motion-patterns`, `motion-advanced`, `make-interfaces-feel-better`.
Escopo: `src/app/core/movimento/`, `src/app/shared/movimento/`, `src/styles/_movimento.scss`.
Regras: só `transform` e `opacity`; durações e molas só dos tokens; CSS e View Transitions antes da
biblioteca; HTML pré-renderizado é o estado final; reduced-motion sem baixar a biblioteca.

- B1. **Hero código → cartão** (digitação e resolução em até 2,5 s; modo direto sem movimento; o
  LCP não pode piorar).
- B2. **Tema por seção:** `IntersectionObserver` troca `data-secao` no `<html>`; as variáveis
  transitam em 900 ms (já em CSS). Na visão geral e nas rotas de seção.
- B3. **Revelações:** títulos por linha (máscara), blocos (`appRevelar`), frase de abertura que se
  acende palavra a palavra, contadores (`appContador`).
- B4. **Indicadores deslizantes** (ilha e abas) e **barra "compilando"** na troca de rota.
- B5. **Linha do tempo / git graph** que se desenha ao rolar (`animation-timeline: view()` com
  fallback).
- B6. **Interações de ponteiro** (só com mouse): botões magnéticos, inclinação 3D dos cartões,
  parallax da foto; cursor opcional que não esconde o cursor nativo.
- B7. **Barra de status viva:** relógio de Brasília (30 s, fora de `aria-live`) e "Disponível".
- B8. **Abertura (Run) opcional:** pular com toque ou tecla, não repetir na visita seguinte e não
  atrasar o LCP (revisão do item 5 do ADR-0017, já registrada no ADR-0019).

### Trilha C: Sentinela (testes e medição)

Skills: `e2e-testing`, `browser-qa`, `playwright-cli`, `verification-loop`, `tdd-workflow`.

- C1. Teste unitário e E2E para **cada** requisito novo das specs da change; cobertura ≥ 80% nos
  arquivos novos.
- C2. **Regressão visual** (screenshots Playwright em 320, 768, 1024 e 1440, claro e escuro) das
  telas principais: hero, visão geral, vitrine, detalhes, contato.
- C3. **axe** em todas as rotas, nos dois temas e com os detalhes abertos; **reduced-motion** em
  todas as telas; teste sem JavaScript (o HTML tem todo o texto).
- C4. **Orçamentos no CI:** imagem de projeto ≤ 200 KB; JS inicial sem a biblioteca de animação;
  checagem do chunk do `motion`.
- C5. **Lighthouse móvel** em `/`, `/projetos` e uma rota de seção. Meta: desempenho ≥ 95,
  acessibilidade, boas práticas e SEO = 100, LCP ≤ 2,5 s, CLS ≤ 0,05 (hoje: 70 a 74 e LCP 4,5 a
  5,1 s). Salve o relatório em `docs/diario/`.

### Trilha D: desempenho (Pincel + Sentinela, com o agente `performance-optimizer`)

- D1. Descobrir por que o LCP é 4,5 a 5,1 s (suspeitos: abertura animada, fontes, JS inicial, imagem
  do hero) e corrigir: fontes com `font-display: swap` e preload só da crítica, imagens com
  `NgOptimizedImage`, `fetchpriority` no que for o LCP, JS inicial enxuto, carga tardia do resto.
- D2. Garantir que nenhuma animação bloqueie ou atrase o conteúdo.

### Trilha E: Escriba (documentação)

- E1. Atualizar ADR-0019 com as decisões desta rodada (fonte, ilha de navegação, duas camadas,
  visões cartão/código) e criar ADRs novos se houver decisão nova.
- E2. Atualizar `README.md`, `docs/arquitetura.md`, `docs/componentes.md` e a entrada 0023 do
  diário (problema, decisões, números antes e depois, aprendizado, rascunho de post para o
  LinkedIn).
- E3. Manter `openspec/changes/archive/2026-10-21-refatorar-experiencia-do-usuario/` consistente (specs, design e
  `tasks.md` com as caixas marcadas conforme o que for entregue).

### Trilha F: Regente (integração)

- F1. Ordem de integração sugerida (dependências reais): A1 → (A2, A3, A4, B2, B3) → (A5, A6, B1,
  B4, B5, B6, B7) → A7 → B8 → D1/D2 → C1 a C5 → E1 a E3. As trilhas podem começar juntas; A1 é a
  única que bloqueia as demais, então termine-a primeiro (tokens e componentes base).
- F2. Commits pequenos, PR único com a descrição completa e o checklist da seção 5; CI verde;
  **não mergear** (o Vinicius faz isso).

## 5. Critérios de pronto (todos obrigatórios)

- [ ] `npm run lint && npm run test:ci && npm run build && npm run e2e` verdes.
- [ ] Visão geral `/` com os 8 blocos, tema de cor por seção, hero código → cartão, barra de ações
      e visão "Cartão" nas seções.
- [ ] Vitrine v2 (abas nos detalhes) e a expansão do cartão ainda verificada por E2E.
- [ ] axe sem violações em todas as rotas, nos dois temas, em desktop e celular.
- [ ] `prefers-reduced-motion`: nada se move sozinho e a biblioteca de animação não é baixada.
- [ ] Sem JavaScript: todo o texto e os cartões estão no HTML.
- [ ] Lighthouse móvel: desempenho ≥ 95, demais 100; LCP ≤ 2,5 s; CLS ≤ 0,05.
- [ ] Nenhuma imagem de projeto acima de 200 KB; JS inicial sem o `motion`.
- [ ] Nenhuma rota ou slug existente quebrou; o sitemap lista as páginas pré-renderizadas.
- [ ] ADR, README, `docs/componentes.md` e diário atualizados; `tasks.md` da change marcado.
- [ ] PR aberto, descrição completa, CI verde, **sem merge**.

## 6. Decisões já tomadas (não reabra)

- Duas camadas: visão geral rolável em `/` + rotas de seção com o arquivo `.java`.
- `motion` (vanilla), **não** GSAP, **não** Lenis; scroll nativo.
- Carrossel de projetos **sem autoplay** (decisão de UX: recrutador decide quando mudar).
- `<dialog>` nativo para os detalhes; View Transition conduzida pelo roteador.
- Currículo em `public/CV_Vinicius_Machado_Desenvolvedor_FullStack_Java.pdf`.
- Conteúdo das seções (textos e Java) não é reescrito nesta rodada.

## 7. Se algo der errado

- Falha de E2E sob carga: rode de novo com `--workers=2` e confira o erro isolado antes de mexer
  no código (a máquina já gerou falsos negativos com load average acima de 90).
- Conflito entre trilhas: vale o dono do arquivo (seção 4). Em dúvida, o Regente decide e registra.
- Algo exige decisão do Vinicius (por exemplo, texto novo sobre ele): use um placeholder honesto e
  claramente marcado, registre no diário e **não invente fatos**.
