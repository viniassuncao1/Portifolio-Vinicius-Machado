> **Atenção:** este é o plano original. Por decisão do Vinicius (15/10), **não há pular** (nem
> botão nem Esc) e o ▶ é acionado sozinho 5 s depois de ficar pronto. Onde este texto falar em
> Pular ou Esc, vale o `design.md`.

# Abertura com Run: plano de design e animação

Proposta para substituir a tela de boas-vindas do [ADR-0015](../../docs/adr/0015-tela-de-boas-vindas.md)
(splash de 0,6 a 2 s, sem pular) por uma abertura em três atos: **splash de ~3 s → botão Run →
compilação e log do Spring → a IDE aparece**. O protótipo `prototipo.html` (na mesma pasta) roda a
sequência com os tempos e as curvas deste documento.

Skills do ECC consultadas: `motion-foundations`, `motion-patterns`, `motion-advanced`,
`frontend-design-direction`, `make-interfaces-feel-better` e `accessibility`. Em cada decisão,
a skill que a orientou aparece entre colchetes, por exemplo **[foundations]**.

---

## 1. Opinião franca

**A ideia é boa, e é a mais "sua" de todas as aberturas possíveis.** Um dev Java júnior que abre o
portfólio pedindo para o visitante apertar Run, compila as classes do próprio currículo e sobe um
Spring Boot na 8080 está mostrando que conhece o ecossistema, não só dizendo. É o "detalhe
memorável" que a `frontend-design-direction` pede: uma ideia só, coerente com o domínio (IDE, Java,
Spring), e não um enfeite genérico. Transformar espera em participação também muda a percepção do
tempo: 4 s olhando algo que você mesmo disparou passam mais rápido do que 2 s olhando uma barra.

**Mas, do jeito que foi pedido, ela cobra caro de quem tem pressa.** 3 s de splash + o tempo de
achar e clicar no Run (~1 s) + a compilação e o log (~3 a 4 s) dão **7 a 9 s até ver o
portfólio**, contra 2 s hoje. A carga real termina em menos de 1 s; o resto é espetáculo. Para um
recrutador que olha um currículo por poucos segundos, isso pode ser o tempo inteiro da visita. E
uma porta que só abre com clique é, na prática, uma tela que esconde o conteúdo.

O caminho é **manter a ideia inteira e dar saídas a quem não quer o show**. Os riscos e as
mitigações:

| Risco | Mitigação (sem descaracterizar) |
| --- | --- |
| **Recrutador impaciente** | "Pular para o portfólio" visível **desde o primeiro quadro** (não só depois dos 3 s), Esc pula a qualquer momento, Enter durante o splash adianta para o Run. O show após o clique tem **teto de 5 s** e cada fase pode ser pulada. |
| **Splash de 3 s parecer carregamento lento** | Os 3 s são **tempo de leitura** (foto, nome, cargo), não de espera: o texto aparece no primeiro quadro, sem fade, e a barra só acompanha. A barra mostra etapas de IDE ("Indexing Portfolio_Vinicius…"), não um carregamento genérico. |
| **Quem chega por link direto** (ex.: `/projeto-2` vindo do LinkedIn) | A abertura com Run **só em `/`**. Link direto vai direto ao conteúdo, com o aviso `PortfolioApplication started` na barra de status. Quem pediu uma seção quer ver a seção. |
| **Segunda visita** | Uma vez por sessão (`sessionStorage`), como hoje. Recarregar ou navegar não repete. Voltar outro dia mostra de novo (decisão 3). O Executar da barra continua rodando o log quando a pessoa quiser rever. |
| **E se a pessoa não clicar?** | Nada é executado sozinho (o Run é dela). Aos 6 s sem interação, um único pulso no ▶ e a dica "Enter para executar" ganha destaque. Nunca uma animação infinita. **[advanced]** regra 2. |
| **SEO e pré-render** | A abertura é uma camada **só do navegador** por cima do HTML pré-renderizado, que continua inteiro no DOM e opaco por baixo (opacidade 1, nunca `display:none`). Sem JavaScript ela não aparece. |
| **LCP** | Hoje a camada nasce depois da hidratação. Proposta: um script inline no `<head>` (como o do tema) marca `<html data-abertura>` antes da primeira pintura; o cartão já vem pintado no primeiro quadro, e o nome (texto, sem fade) vira o candidato a LCP. Nada de `opacity: 0` no elemento LCP. **[foundations]** regra 2 (estado inicial igual ao servidor). |
| **WCAG 2.2.1 (tempo ajustável)** | Não há limite de tempo: a tela espera o clique indefinidamente e oferece Pular. |
| **WCAG 2.2.2 (pausar, parar, ocultar)** | O que se move sozinho dura < 5 s: splash 3 s; show após clique ≤ 5 s e iniciado pelo usuário. Pular e Esc param tudo. Nenhum loop infinito. |
| **WCAG 2.1.1 (teclado)** | Run é um `<button>` nativo (Enter/Espaço), Pular é botão, Esc pula, atalho do IntelliJ (⌃R no Mac, Shift+F10 nos outros) como extra. Nada só por mouse. |
| **WCAG 2.4.3 (ordem do foco)** | A abertura é um `role="dialog"` com `aria-modal`; o resto da casca fica `inert`. No estado pronto o foco vai para o Run (ação primária do diálogo); ordem: Run → Pular. Ao terminar, o foco vai para o `<main>` do editor (com `tabindex="-1"`), não fica perdido no `<body>`. |
| **Atalho ⌃R** | No Windows e Linux, Ctrl+R recarrega a página: interceptar seria hostil. Por isso o atalho segue o IntelliJ de cada sistema: **⌃R no macOS**, **Shift+F10** no resto. O rótulo muda conforme `navigator.userAgentData?.platform`. |
| **`prefers-reduced-motion`** | Mesmo roteiro, sem transform: cartão estático, Run disponível na hora, log completo de uma vez, transições só de opacidade ≤ 150 ms. **[foundations]** regra 3. |
| **Leitores de tela** | O log não é lido linha a linha (seria ruído). Uma região `aria-live="polite"` anuncia só 3 marcos: "Compilando 16 classes", "Iniciando o Spring Boot", "Portfólio pronto". O log é texto (não imagem), dentro de uma região com nome, para quem quiser navegar. |
| **Celular** | Cartão em largura total com gutter de 16 px; janela de build/log em 100% da largura, linhas do log sem data e PID (formato curto), banner do Spring em 9 px; alvos de toque ≥ 44 px. Sem rolagem horizontal. |

**Veredito:** faça, mas com Pular desde o primeiro quadro, só na rota `/`, uma vez por sessão e com
o show depois do clique em ~4 s. Assim o recrutador apressado perde 1 s (o tempo de achar o Pular)
e o curioso ganha o melhor momento do portfólio.

O protótipo usa a Web Animations API (`element.animate`) só para poder reiniciar a sequência; no
site, as mesmas animações viram keyframes e transitions CSS com os tokens abaixo.

---

## 2. Direção de design

**[design-direction]** Propósito: apresentar o Vinicius e provar familiaridade com Java/Spring.
Tom: técnico e preciso, como uma IDE (rápido, denso, sem bounce). Detalhe memorável: **a janela
de Run recolhe para a barra de status e a IDE "acende" atrás dela**. Restrições: tokens existentes
(`_tokens.scss`, `_movimento.scss`), WCAG AA, pré-render intacto, sem biblioteca nova.

- Cores: as do site (painel `#2B2B2B`, página `#1C1C1C`, acento `#DE60D2`; claro `#ECECEC`,
  `#D9D9D9`, `#9A2A8C`). O verde do Run segue o ícone da IntelliJ Platform (`#5FB865` escuro,
  `#1F7A36` claro, ambos ≥ 3:1 sobre o painel); o stop é `#DB5C5C` / `#C23B3B`.
- Console: as cores de sintaxe do site (INFO em `--cor-sintaxe-literal`, PID em `--cor-sintaxe-campo`,
  logger em `--cor-sintaxe-valor`, data e thread em `--cor-sintaxe-comentario`, 4,59:1).
- Tipografia: Inter 13 px na interface, JetBrains Mono 12 px no console (14 px no código).
  **[feel-better]** `font-variant-numeric: tabular-nums` no contador "7/16" e nos tempos;
  `text-wrap: balance` no nome e na frase.
- Raios concêntricos **[feel-better]**: cartão `--raio-aba` (0,74 rem) com padding 2 rem é tratado
  como superfície separada; o botão Run dentro do widget usa `--raio-controle` (0,5 rem) e o
  widget 0,5 rem + 2 px de padding.
- Foto com contorno neutro de 1 px (`rgb(255 255 255 / 10%)` / `rgb(0 0 0 / 10%)`) **[feel-better]**.
- Nada de cartão dentro de cartão **[design-direction]**: o widget de Run é uma faixa do próprio
  cartão, não uma caixa nova.

---

## 3. Tokens de movimento

O site já tem `--duracao-rapida` 120 ms, `--duracao-media` 160 ms, `--duracao-lenta` 200 ms e as
curvas `--curva-saida`, `--curva-entrada` e `--curva-padrao`. A abertura é o único momento de
"storytelling" do site, então ganha três tokens novos (no mesmo arquivo, zerados com movimento
reduzido) **[foundations]** regra 5 (nada de valor solto no componente):

| Token | Valor | Uso | Skill |
| --- | --- | --- | --- |
| `--duracao-entrada-abertura` | 280 ms | Entrada do cartão, da janela e dos painéis | [foundations] `normal`/`slow` para entrada de página |
| `--duracao-recolher` | 360 ms | Janela de Run recolhendo para a barra de status | [foundations] `slow`, transição de página inteira |
| `--intervalo-escalonado` | 60 ms | Stagger de linhas, classes e painéis | [patterns] regra 5 (50 a 100 ms) |
| `--curva-suave` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entradas que "assentam" (cartão, janela, painéis) | [foundations] `easing.smooth` |
| `--curva-saida` (existente) | `cubic-bezier(0.2, 0, 0, 1)` | Barra de progresso, troca de aba | [foundations] chega rápido e assenta |
| `--curva-entrada` (existente) | `cubic-bezier(0.4, 0, 1, 1)` | Tudo que sai de cena (cartão, fundo) | [feel-better] saída mais curta e quieta que a entrada |
| `--curva-padrao` (existente) | `cubic-bezier(0.4, 0, 0.2, 1)` | Movimento entre dois estados visíveis (recolher, indicador da aba) | [foundations] `easing.sharp` |

Sem molas nem bounce: a IDE é precisa, e `bouncy` é para "momentos lúdicos" **[foundations]**.
Propriedades animadas: **só `transform`, `opacity` e `clip-path`** **[foundations]** regra 4.
Nunca `transition: all`; `will-change` só no cartão e na janela durante a própria animação
**[feel-better]**.

---

## 4. Storyboard quadro a quadro

Tempos em ms. `t` zera no início de cada ato. Desktop com movimento liberado.

### (a) Splash: 0 a 3000

| t (ms) | Elemento | Animação | Duração / curva |
| --- | --- | --- | --- |
| 0 | Fundo (`--cor-fundo-pagina` com 92% de opacidade + blur 6 px) e cartão | Já pintados no primeiro quadro pelo script inline. **Sem fade** (LCP). | — |
| 0 | Nome "Vinicius Machado" | Estático, opacidade 1 desde o primeiro quadro (candidato a LCP). | — |
| 0 | Foto (círculo 96 px) | `opacity 0→1`, `scale(.96)→1` | 280 ms, `--curva-suave` |
| 60 / 120 | Cargo, frase "Seja bem-vindo ao meu portfólio" | `opacity 0→1`, `translateY(6px)→0`, stagger 60 ms | 280 ms, `--curva-suave` |
| 0 | "Pular para o portfólio" (canto inferior do cartão) | Visível desde o início, discreto (texto esmaecido, sublinhado no foco/hover) | — |
| 400 | Barra + linha de etapa (mono 12 px) | `scaleX` 0→0,25: "Opening Portfolio_Vinicius…" | 500 ms, `--curva-saida` |
| 1100 | idem | 0,25→0,5: "Resolving Gradle dependencies…" (texto troca com crossfade de 120 ms) | 500 ms |
| 1800 | idem | 0,5→0,8: "Indexing 16 Java classes…" | 500 ms |
| 2500 | idem | 0,8→1: "Project ready" | 400 ms |
| 3000 | → ato (b) | | |

A barra avança em degraus que só terminam quando a página está pronta de verdade (fontes +
`whenStable`). Se demorar além de 3 s (rede ruim), o último degrau espera, com teto em 5 s.
**[foundations]** "motion communicates state": a barra comunica algo real.

Enter durante o splash adianta para (b); Esc ou Pular vão direto ao portfólio pela saída curta (240 ms).

### (b) Pronto para executar: 3000 em diante (sem limite)

| t (ms) | Elemento | Animação | Duração / curva |
| --- | --- | --- | --- |
| 0 | Barra e linha de etapa | `opacity 1→0` | 120 ms, `--curva-entrada` |
| 60 | Widget de Run (no lugar da barra) | `opacity 0→1`, `translateY(4px)→0` | 200 ms, `--curva-saida` |
| 120 | Dica "Enter para executar · Esc para pular" | `opacity 0→1` | 200 ms |
| 260 | Foco vai para o botão ▶ | anel de foco 2 px `--cor-foco` (`:focus-visible`) | — |
| 300 | Ícone ▶ | **um** pulso: `scale 1→1.12→1` | 480 ms, `--curva-padrao` |
| 6000 sem interação | Ícone ▶ + dica | segundo e último pulso; a dica passa de esmaecida para `--cor-texto` | 480 ms |

**Widget de Run (fiel ao IntelliJ New UI):**

```
[ ☕ PortfolioApplication ▾ ] [ ▶ ] [ 🐞 ]          ⌃R
```

- Seletor de configuração com ícone de classe Spring Boot e "PortfolioApplication ▾" (não
  interativo, `aria-hidden`; é cenário).
- **Botão ▶ verde**, 32×32 visível com área de toque de 44×44 por pseudo-elemento
  **[feel-better]** hit areas / **[accessibility]** 2.5.8; nome acessível "Executar
  PortfolioApplication"; `aria-keyshortcuts="Control+R"` (Mac) ou `"Shift+F10"`.
- Botão de debug esmaecido e desabilitado (cenário, `aria-hidden`).
- Pressionar: `scale(.96)` em 80 ms **[feel-better]** press; hover com fundo `--cor-linha-selecionada`.
- Ícone ▶ centralizado opticamente (deslocado 1 px à direita) **[feel-better]** optical alignment.

### (c) Execução: compilação e log do Spring (0 a ~3440 após o clique)

A janela que aparece imita o tool window do IntelliJ: cabeçalho com duas abas, **Build** e
**Run: PortfolioApplication**, barra de progresso fina embaixo do cabeçalho e o conteúdo em mono.

| t (ms) | Elemento | Animação | Duração / curva |
| --- | --- | --- | --- |
| 0 | ▶ → ■ (stop vermelho), como o IntelliJ faz ao rodar | crossfade com `scale(.8)→1` | 120 ms, `--curva-saida` [feel-better] icon swap |
| 0 | Cartão de boas-vindas | `opacity 1→0`, `scale(1)→.98` | 160 ms, `--curva-entrada` |
| 80 | Janela Build/Run (centralizada, `min(880px, 100% − 32px)` × `min(520px, 72dvh)`) | `opacity 0→1`, `translateY(16px)→0`, `scale(.98)→1` | 280 ms, `--curva-suave` [patterns] modal |
| 200 | Aba Build: `> Task :compileJava` | linha aparece (`opacity`, 120 ms) | |
| 260 a 1160 | 16 classes, uma a cada 60 ms: `✓ dev/vinicius/portfolio/sobre/SobreMim.java` … `PortfolioApplication.java` | cada linha `opacity 0→1`, `translateX(-4px)→0` | 120 ms, `--curva-saida`, stagger 60 ms [patterns] regra 5 |
| 260 a 1160 | Contador "Compilando 7/16" (tabular-nums) e barra de progresso | `scaleX(i/16)` | 120 ms, linear |
| 1220 | `> Task :processResources`, `> Task :classes` (60 ms entre si) | idem | |
| 1340 | `> Task :bootRun` e, na árvore à esquerda, "✓ Portfolio_Vinicius: build successful" | idem | |
| 1460 | Troca para a aba **Run**: o indicador da aba desliza | `translateX` | 160 ms, `--curva-padrao` |
| 1460 | Conteúdo Build → Run | crossfade | 120 ms |
| 1580 | Banner do Spring + `:: Spring Boot :: (v3.5.0)` (8 linhas de uma vez) | `opacity 0→1` | 160 ms |
| 1740 a 2940 | 9 linhas do log (as mesmas de `montarLog()`), uma a cada 150 ms | `opacity 0→1` (sem deslocamento: log de verdade não "escorrega") | 120 ms |
| 2940 | `Started PortfolioApplication in 2.9 seconds` | fundo da linha `--cor-linha-selecionada` + ✓ verde entra (`opacity`) | 160 ms |
| 2940 | Anúncio `aria-live`: "Portfólio pronto" | — | |
| 2940 a 3440 | Pausa de leitura (500 ms) | nada se move [foundations] "responsiveness > smoothness": a pausa existe para ler, não para enfeitar | |

Classes compiladas, na ordem dos pacotes (`core/secoes.ts`): `sobre/SobreMim`, `sobre/Diferenciais`,
`sobre/ComoUsoIA`, `skills/Skills`, `experiencias/Experiencias`, `projetos/Projeto1` a `Projeto4`,
`formacao/Certificacoes`, `formacao/Eventos`, `formacao/Formacao`, `formacao/Idiomas`,
`recomendacoes/Depoimentos`, `contato/Contato` e `PortfolioApplication`. O Gradle real não lista
arquivo por arquivo; aqui é uma licença assumida (como a árvore de saída do Build do IntelliJ, que
lista arquivos), para o visitante reconhecer as seções no que compila.

Esc ou "Pular" no cabeçalho da janela: saída curta (a camada inteira some em 240 ms, `--curva-entrada`), sem a coreografia de (d); a barra de status mostra o aviso do mesmo jeito.

### (d) A IDE aparece: 3440 a ~4160 após o clique

| t (ms, relativo a 3440) | Elemento | Animação | Duração / curva |
| --- | --- | --- | --- |
| 0 | Janela de Run **recolhe para o widget da barra de status** | View Transition com `view-transition-name: console-de-run` na janela e no item da barra de status (elemento compartilhado); sem a API, `transform: translate(...) scale(...)` + `clip-path: inset()` até o retângulo do item | 360 ms, `--curva-padrao` [patterns] shared element / [foundations] spatial continuity |
| 0 | Fundo da abertura | `opacity 1→0` | 280 ms, `--curva-entrada` |
| 60 | Barra de ferramentas | `opacity 0→1`, `translateY(-6px)→0` | 280 ms, `--curva-suave` |
| 120 | Faixa de ferramentas | `opacity`, `translateX(-6px)→0` | 280 ms |
| 180 | Painel do projeto (árvore) | `opacity`, `translateX(-12px)→0` | 280 ms |
| 240 | Faixa de abas | `opacity`, `translateY(-4px)→0` | 280 ms |
| 300 | Editor com o Início | `opacity 0→1`, `translateY(8px)→0`; o código revela com `clip-path: inset(0 0 100% 0)→inset(0)` | 280 ms / 360 ms, `--curva-suave` |
| 360 | Barra de status: `● PortfolioApplication started in 2.9 s` (ponto verde), fica 6 s | `opacity` | 160 ms |
| 720 | Foco no `<main>`; abertura removida do DOM; `sessionStorage` marcado | — | |

As entradas dos painéis são **keyframes com `animation-fill-mode: backwards`** aplicados por uma
classe só durante a revelação. Em repouso todos os painéis têm opacidade 1, então o pré-render,
o SEO e quem não tem JS nunca veem a casca transparente. **[feel-better]** keyframes para entradas
encenadas, transitions para estados interativos.

### Tempos totais

| Trecho | Alvo | Teto |
| --- | --- | --- |
| Splash | 3,0 s | 5,0 s (rede lenta) |
| Do clique ao portfólio | **~4,2 s** | 5,0 s |
| Pular ou Esc (a qualquer momento) até o portfólio | 0,24 s | 0,4 s |
| Visita com clique imediato | ~8 s | — |

---

## 5. Variações

### Movimento reduzido (`prefers-reduced-motion: reduce`)
**[foundations]** regra 3: nenhum transform; só opacidade ≤ 150 ms.

- Splash: cartão estático e completo; **o Run já está disponível** (não há o que assistir nos 3 s,
  a pessoa lê no ritmo dela). Barra cheia, sem animação.
- Clique: a janela aparece com o build e o log **completos de uma vez** (fade 150 ms). Pausa de
  1,2 s para ler "Started PortfolioApplication", depois o fundo some em 150 ms. Sem recolher, sem
  stagger, sem pulso.
- Total do clique ao portfólio: ~1,5 s.

### Sem JavaScript
O script inline não roda, `data-abertura` não existe, a camada fica `display: none` e o portfólio
pré-renderizado aparece direto. Nada a fazer além de não quebrar isso.

### Celular (390×844)
- Cartão: `inline-size: calc(100% - 32px)`, foto 72 px, nome 20 px.
- Widget de Run: seletor encurtado para "PortfolioApp…", botão 44×44, dica sem o atalho de
  teclado ("Toque em ▶ para executar").
- Janela de build/log: largura total menos 16 px de cada lado, altura `72dvh`. As linhas do log
  usam o formato curto `INFO  TomcatWebServer : Tomcat started on port 8080` (sem data, PID e
  thread), `white-space: pre-wrap` e `overflow-wrap: anywhere`; o banner do Spring em 9 px. Zero
  rolagem horizontal.
- Recolher: vai para a barra de status do celular (o mesmo item). Painel lateral não entra (está
  fechado no celular).

### Tema claro
Os mesmos tokens com `[data-tema='claro']`. Console no claro do IntelliJ Light com contraste
ajustado: INFO `#067D17`, PID `#871094`, logger `#00627A`, data/thread `#616161` sobre `#F7F7F7`
(todos ≥ 4,5:1). O fundo da abertura vira `rgb(217 217 217 / 92%)`. A troca de tema durante a
abertura funciona (é só token).

---

## 6. Implementação em Angular 22

**Princípio:** CSS faz a animação; signals guardam a fase; um único serviço manda no relógio.
Sem biblioteca (as skills de motion usam `motion/react`, que não se aplica a Angular; os valores e as
regras delas foram traduzidos para tokens CSS) **[foundations]** regras 4, 5 e 8.

### Arquivos

| Arquivo | Mudança |
| --- | --- |
| `src/index.html` | Script inline (junto ao do tema): se a rota é `/`, há `sessionStorage` sem a chave e há JS, põe `data-abertura` no `<html>`. É ele que faz o cartão nascer no primeiro quadro. |
| `src/app/core/abertura.ts` (novo, substitui `boas-vindas.ts`) | `@Service()` com `fase = signal<'splash' \| 'pronto' \| 'compilando' \| 'iniciando' \| 'revelando' \| 'encerrada'>()`, `executar()`, `pular()`, `adiantar()`, linha do tempo em constantes nomeadas, cancelamento de temporizadores e `aviso` da barra de status. |
| `src/app/core/linha-do-tempo-da-abertura.ts` (novo) | Constantes puras dos tempos (ms) e a lista de classes, derivada de `secoes.ts` (`pacote` + `arquivo`). Testável sem DOM. |
| `src/app/layout/abertura/abertura.ts\|html\|scss` (novo, substitui `tela-de-boas-vindas/`) | Diálogo (`role="dialog"`, `aria-modal="true"`, `aria-labelledby` no nome), `host` com `(keydown.escape)`, `inert` no resto da casca (lógica atual de `bloquearOResto`). |
| `src/app/layout/abertura/widget-de-run.ts` (novo) | O seletor + ▶ + debug; `output()` `executar`; atalho por plataforma. |
| `src/app/layout/abertura/janela-de-build.ts` (novo) | Abas Build/Run, lista de classes e o log. Reaproveita `montarLog()`: mover `janela-de-run/log.ts` para `src/app/core/log-do-spring.ts`, usado pela abertura e pela janela de Run. |
| `src/app/layout/casca/casca.ts\|scss` | `host: { '[attr.data-revelando]': ... }` e os keyframes das entradas dos painéis com `--ordem` para o stagger (`animation-delay: calc(var(--ordem) * var(--intervalo-escalonado))`). |
| `src/app/layout/barra-de-status/` | Item `view-transition-name: console-de-run` (só durante a revelação) e o aviso com ponto verde. |
| `src/styles/_movimento.scss` | Tokens novos e as regras de `::view-transition-*(console-de-run)`. |
| `e2e/fixtures.ts`, `e2e/apoio.ts` | A fixture que marca a sessão continua pulando a abertura; `verAbertura(page)` para os testes dela. |
| Docs | **ADR-0016** "Abertura com Run interativo" (substitui o item 2 do ADR-0015), change no OpenSpec com deltas em `tela-de-boas-vindas` (ou capability nova `abertura`) e `janela-de-run`, README. |

### Esboço do serviço

```ts
@Service()
export class Abertura {
  readonly fase = signal<FaseDaAbertura>('encerrada');
  readonly classesCompiladas = signal(0);
  readonly linhasDoLog = signal(0);
  readonly progresso = computed(() => /* 0..1 por fase */);

  executar(): void { /* 'pronto' → 'compilando'; agenda os passos pela linha do tempo */ }
  pular(): void { /* cancela tudo, completa e vai para 'revelando' curto */ }
}
```

A revelação usa `document.startViewTransition` quando existe e o movimento não é reduzido (o site
já tem `core/transicao-de-rota.ts` e `transicao-de-tema.ts` como referência); sem a API, a mesma
coreografia por classes CSS. Um teto de tempo garante a remoção mesmo sem `animationend` (padrão
que o componente atual já usa).

### Pré-render e DOM
- O conteúdo da rota fica sempre no DOM, opaco, por baixo da camada; a camada só ganha
  `display: grid` com `html[data-abertura]`.
- O cartão (foto, nome, cargo) pode vir no HTML pré-renderizado com `hidden` por CSS: são textos
  que já existem no Início, sem risco de SEO. O resto (widget, janela de build) só existe no
  navegador.
- `withEventReplay()` (já padrão na hidratação) cobre um clique em Pular antes da hidratação.
- Google renderiza JS sem `sessionStorage`: verá a abertura, mas o conteúdo continua no DOM e
  visível (opacidade 1), só coberto. Validar no Search Console (Inspeção de URL) depois do deploy.

### Testes
- **Unitários** (`abertura.spec.ts`, relógio falso): transições de fase, `pular()` em cada fase,
  teto de 5 s, sessão marcada, rota diferente de `/` não abre, movimento reduzido.
- **e2e** (Playwright com `page.clock.install()` para controlar o tempo):
  - `/`: splash com foto e nome; aos 3 s o Run aparece **com foco**; Enter executa; em ≤ 5 s o
    editor do Início está visível e o foco está no `<main>`.
  - Pular no splash e Esc durante o log levam ao portfólio em ≤ 400 ms.
  - Link direto `/projeto-2`: sem abertura.
  - Recarregar na mesma sessão: sem abertura.
  - `emulateMedia({ reducedMotion: 'reduce' })`: Run disponível de imediato, sem transform
    (checar `getAnimations()` vazio ou só opacidade).
  - `javaScriptEnabled: false`: sem abertura, conteúdo visível.
  - Viewport 390×844: `document.documentElement.scrollWidth <= 390` em todas as fases.
  - **axe** em cada fase (splash, pronto, compilando, log, final), nos dois temas e no celular, sem
    exclusões.
- **Desempenho:** Lighthouse/`web-vitals` em `/` confirmando LCP no nome do cartão e CLS 0.

---

## 7. Recomendação final

**Faça a abertura com Run, com quatro salvaguardas que não mudam a ideia:**

1. "Pular para o portfólio" e Esc **desde o primeiro quadro**.
2. **Só em `/`** e **uma vez por sessão**; link direto vai direto ao conteúdo.
3. Do clique ao portfólio em **~4,2 s, teto de 5 s**, com o log reaproveitado do Spring e as 16
   classes reais compilando.
4. Cartão pintado no primeiro quadro pelo script inline (LCP bom) e conteúdo sempre no DOM.

O efeito final que vende a ideia é o último: a janela de Run recolhendo para a barra de status
enquanto a IDE acende atrás. Isso fica.

### Decisões para o Vinicius

1. **Se a pessoa não clicar no Run.**
   - **Recomendado:** nada roda sozinho; aos 6 s, um pulso no ▶ e a dica em destaque. Pular
     sempre visível.
   - Alternativa: executar sozinho aos 10 s. Garante o show, mas tira o "você aperta o Run", que é
     a graça.
2. **Link direto para uma seção** (`/projeto-2`, `/contato`).
   - **Recomendado:** sem abertura; só o aviso `PortfolioApplication started` na barra de status.
   - Alternativa: o splash curto de hoje (≤ 2 s, sem Run).
3. **Frequência.**
   - **Recomendado:** uma vez por sessão do navegador (como hoje); outra visita outro dia vê de
     novo.
   - Alternativa: uma vez por navegador (`localStorage`), e nas visitas seguintes só o splash
     curto. Melhor para quem volta muito, mas o recrutador que volta para comparar candidatos
     raramente reabre o mesmo site.
