## Context

Estado atual, observado no código e nas specs:

- A casca (`src/app/layout/casca`) tem barra de ferramentas, faixa de ferramentas, painel lateral
  com a árvore em pacotes, faixa de abas, editor com `<router-outlet>`, janela de Run, barra de
  status, busca e abertura animada. Cada seção é uma rota que mostra um arquivo `.java` rolando
  (ADR-0018). O site é pré-renderizado (SSG) e usa `withViewTransitions` com pulo em movimento
  reduzido (`core/transicao-de-rota.ts`).
- O movimento existente é a abertura, a digitação do código, a janela de Run/preview e a troca de
  tema com View Transition. Não há movimento de scroll, carrossel nem interações de ponteiro.
- Só existem capturas de tela de dois projetos (`public/projetos/*.jpg`); os demais não têm imagem.
- O ADR-0012 manda seguir o design de `design/telas/`; a spec `sistema-visual` repete isso.

Referência analisada: um portfólio estático (GSAP, ScrollTrigger, Lenis; aqui trocados por `motion`) com carrossel em loop,
expansão do cartão por `clip-path`, tema por seção via variáveis CSS e revelações no scroll. Dele
vêm as técnicas; suas falhas (contraste, carrossel sem pausa, imagens pesadas, `role="button"` em
`article`, cópias do laço no DOM) viram requisitos nas specs.

Ver `proposal.md` (Why) para a motivação.

## Direção de design (prioridade: recrutadores)

Definida com `frontend-design-direction` e `make-interfaces-feel-better` do ECC:

- **Propósito:** em 30 segundos, o recrutador entende quem é o Vinicius, o que entrega e como
  chamá-lo. A IDE é a identidade, não o caminho obrigatório.
- **Público:** recrutadores técnicos e não técnicos, em desktop e celular, com pouco tempo.
- **Tom:** editorial-técnico e vivo: tipografia forte, código como textura, movimento que explica.
- **Detalhe memorável:** **o código que vira cartão**. `class ViniciusMachado extends
  DesenvolvedorFullStack` é escrita na primeira dobra e se resolve no cartão de apresentação; um
  controle troca qualquer seção entre "Cartão" e "Código".
- **Do design original, fica:** editor de cantos arredondados, aba `Portfolio_Vinicius`, árvore
  com pastas Java, números de linha, cores de sintaxe (rosa nas palavras-chave), a **janela
  flutuante de preview** das telas 12 e 13 e a barra de status. **Sai:** a obrigação de tudo ser
  código e a fidelidade de paleta, ícones e proporções.
- **Detalhes de acabamento:** raio concêntrico, `text-wrap: balance/pretty`, `tabular-nums` no
  relógio e contadores, contorno sutil nas imagens, `transition` com propriedades explícitas (nunca
  `all`), saída mais curta que a entrada e `scale(.96)` no pressionar com opção de desligar.
- **Evitar:** blobs decorativos, cartões dentro de cartões, hero vago, efeito que esconde conteúdo.
- **Skills do ECC de movimento** (`motion-*`) são para React; aqui só valem os princípios (tokens
  de duração, reduced-motion, SSR seguro), não o código.

### Ideias novas para recrutadores

1. **Cartão ⇄ Código** em cada seção (visão inicial: cartão).
2. **Barra de ações** (Currículo, LinkedIn, GitHub, e-mail com copiar) sempre à vista e como
   comandos da busca Ctrl/Cmd+K.
3. **Projetos como janela de preview:** o cartão expande numa janela no estilo das telas 12/13,
   com abas "Visão geral / Código / Stack" e um bloco de "build" com fatos (papel, stack, resultado).
4. **Skills como `build.gradle`** com selos de nível; cada dependência leva aos projetos onde foi
   usada (evidência no lugar de autoavaliação solta).
5. **Experiência como `git log --graph`** que se desenha ao rolar, reaproveitando o painel do Git.
6. **Contato como terminal** (`$ contato --email`) com os mesmos links reais abaixo, copiar com
   confirmação e sem depender do terminal para funcionar.
7. **Transições:** barra fina de "compilando" na troca de rota, aba que desliza, cartão que expande
   com View Transition, linhas de código em cascata e tema que muda por seção.

## Goals / Non-Goals

**Goals:**

- Uma casca de IDE reimaginada, com a mesma gramática (pacotes, abas, status, Run) e uma
  hierarquia mais clara para quem recruta.
- Vitrine de projetos, movimento e orientação prontos para teclado, toque e movimento reduzido.
- Metas medidas: AXE sem violações, contraste AA por tema, Lighthouse mobile 95/100/100/100,
  LCP ≤ 2,5 s, CLS ≤ 0,05.

**Non-Goals:**

- Reescrever textos e o Java exibido; mudar rotas e slugs existentes; trocar framework ou deploy.
- Scroll suave por biblioteca (Lenis), GSAP e animações de página inteira baseadas em scroll por
  biblioteca, salvo prova de necessidade na prototipagem (ver Decisão 4).

## Decisions

### 1. Duas camadas de navegação: visão geral rolável e arquivos por rota

A página inicial (`/`) vira uma **visão geral em scroll** com blocos-resumo (apresentação, sobre,
stack, formação, projetos, contato), cada um com o seu tema; cada bloco leva à rota completa da
seção (`/skills`, `/experiencias`...), que continua sendo o arquivo `.java` de hoje. Assim o tema
por seção, as revelações e a linha do tempo vivem na visão geral, e SEO, endereços e o ADR-0018
ficam intactos. As rotas de seção ganham o tema da sua pasta, trocado pela View Transition.

- Alternativa descartada: transformar tudo em uma página rolável única. Quebra rotas, abas e SEO,
  e contradiz o ADR-0018.
- Alternativa descartada: manter `/` como o arquivo `Inicio.java`. Não responde em segundos a
  "quem é e onde ver projetos".

### 2. Casca reimaginada (layout)

Barra superior com identidade do projeto, busca (Ctrl/Cmd+K) e ▶ Executar; painel do projeto
recolhível; abas com indicador deslizante; barra de status com caminho, branch, relógio de Brasília
e "disponível". No celular: barra de ações inferior (Seções, Projetos, Contato) e a vitrine em
grade. Proporções e paleta saem dos tokens novos, sem copiar as telas; os desvios entram no ADR.

### 3. Vitrine: dialog nativo + View Transitions + rota própria

- Cartões são `<button>` (ou `<a>`) com `aria-label`; nada de `article role="button"`.
- Os detalhes são um `<dialog>` aberto com `showModal()`, que entrega foco preso, Esc, `inert` no
  fundo e camada superior sem código próprio. Foco inicial no fechar; ao fechar, volta ao cartão.
- A expansão do cartão à tela cheia usa `document.startViewTransition` com `view-transition-name`
  atribuído ao cartão de origem só durante a transição (a rota do Angular já usa View Transitions;
  nomes únicos evitam conflito). Sem suporte ou com movimento reduzido, abre direto.
- Endereço dos detalhes: `/projetos/:slug` (nova rota, filha da vitrine, pré-renderizada com os
  seis slugs). O arquivo em código segue em `/projeto-N`. Voltar do navegador fecha o diálogo.
- Carrossel sem cópias: o laço visual usa deslocamento com módulo sobre a lista original e
  duplica só o necessário via CSS/`aria-hidden`; os pontos e a grade têm a mesma lista de dados.
  Pausa explícita, `aria-pressed`, pausa por foco/ponteiro e início parado em toque e movimento
  reduzido (spec `vitrine-de-projetos`).
- Dados dos projetos num único arquivo tipado (`projetos.dados.ts`: slug, número, título, etiquetas,
  destaques, imagens, link e rótulo), com a ordem e o conteúdo vindos das specs existentes.
- Capas sem captura (Projetos 1, 2, 3 e 4): componente que renderiza a capa no estilo do editor
  (nome da classe e trecho Java). Capturas dos sites no ar geradas por um script Playwright
  reproduzível em AVIF/WebP, até 200 KB, com `NgOptimizedImage`.

### 4. Movimento: a biblioteca `motion` (vanilla) adaptada ao Angular

As skills `motion-foundations`, `motion-patterns` e `motion-advanced` do ECC descrevem `motion/react`
(hooks, `<motion.div>`, `AnimatePresence`). Isso não roda no Angular. O mesmo pacote tem a API
**sem framework** (`animate`, `scroll`, `inView`, `hover`, `press`, `stagger`, `spring`), que
funciona com qualquer DOM. Decisão: usar `motion` vanilla no lugar do GSAP, mantendo das skills os
**tokens, as molas, as regras de acessibilidade e de SSR**, e traduzindo os padrões de React para
serviço + diretivas.

Tradução das regras das skills:

| Skill (React) | Angular |
| --- | --- |
| Importar só de `motion/react` | Importar só de `motion` (e `motion/mini` onde bastar) por `import()` dinâmico; nunca `framer-motion` |
| `"use client"` | Código de DOM só dentro de `afterNextRender`/`isPlatformBrowser` |
| `initial` igual ao HTML do servidor | O HTML pré-renderizado já é o estado final; o JS só aplica o estado inicial depois da hidratação e anima de volta |
| `useReducedMotion` / `useSafeMotion` | `MovimentoConfig` (`@Service`) com `signal` de `prefers-reduced-motion`; sem movimento, não carrega a biblioteca |
| `motionTokens` e `springs` | `movimento.tokens.ts`, única fonte de durações, curvas, distâncias e molas |
| `shouldAnimate()` | `MovimentoConfig.deveAnimar({ essencial })` |
| Só `transform` e `opacity` | Mesma regra, conferida por lint de revisão |
| `AnimatePresence` (saída) | `animate.leave` do Angular (ou classe de saída em CSS) |
| `layout`/`layoutId` | View Transitions (`view-transition-name`) |
| `useScroll`/`whileInView` | `inView` e `scroll` do `motion`, ou `animation-timeline: view()` em CSS |
| `useInView`, contador, palavras | Diretivas `appRevelar`, `appContador`, `appPalavras` |
| `whileHover`/`whileTap` | `hover` e `press` do `motion` em `appMagnetico`/`appPressionar` |
| Seguidor de cursor, arrasto | `appCursor` e o carrossel com Pointer Events + `animate` com mola `release` |

CSS e View Transitions continuam primeiro: tema por seção (`@property` + `transition`), expansão
do cartão (View Transitions) e revelações simples (`animation-timeline: view()` com fallback). A
biblioteca entra para o que o CSS não faz bem: molas, inércia do carrossel, magnético, contador e
cascatas.

Esqueleto (referência para a implementação; não faz parte da change até o `/opsx:apply`):

```ts
// src/app/core/movimento/movimento.tokens.ts
export const MOVIMENTO = {
  duracao: { instante: 0.08, rapida: 0.18, normal: 0.35, lenta: 0.6, longa: 1 },
  curva: { suave: [0.22, 1, 0.36, 1], seca: [0.4, 0, 0.2, 1], salto: [0.34, 1.56, 0.64, 1] },
  distancia: { xs: 4, sm: 8, md: 16, lg: 24, xl: 48 },
  escala: { sutil: 0.98, pressionar: 0.95, destaque: 1.04 },
} as const;

export const MOLAS = {
  agil: { type: 'spring', stiffness: 300, damping: 30 },
  suave: { type: 'spring', stiffness: 120, damping: 14 },
  elastica: { type: 'spring', stiffness: 400, damping: 10 },
  instantanea: { type: 'spring', stiffness: 600, damping: 35 },
  soltar: { type: 'spring', stiffness: 200, damping: 20, restDelta: 0.001 },
} as const;
```

```ts
// src/app/core/movimento/movimento-config.ts
@Service()
export class MovimentoConfig {
  private readonly plataforma = inject(PLATFORM_ID);
  private readonly navegador = isPlatformBrowser(this.plataforma);
  private readonly consulta = this.navegador ? matchMedia('(prefers-reduced-motion: reduce)') : null;

  /** Preferência do sistema, reativa a mudanças. */
  readonly reduzido = signal(this.consulta?.matches ?? false);
  readonly aparelhoFraco = this.navegador && navigator.hardwareConcurrency <= 4;

  constructor() {
    this.consulta?.addEventListener('change', (e) => this.reduzido.set(e.matches));
  }

  deveAnimar({ essencial = false } = {}): boolean {
    if (!this.navegador || this.reduzido()) return false;
    return essencial || !this.aparelhoFraco;
  }

  /** Carrega a biblioteca só quando há movimento; senão devolve null. */
  async carregar() {
    return this.deveAnimar() ? import('motion') : null;
  }
}
```

```ts
// src/app/shared/movimento/revelar.ts  (diretiva)
@Directive({ selector: '[appRevelar]', host: { '[class.revelado]': 'revelado()' } })
export class Revelar {
  readonly atraso = input(0);
  protected readonly revelado = signal(true); // HTML do servidor já é o estado final

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement;
    const movimento = inject(MovimentoConfig);
    afterNextRender(async () => {
      const lib = await movimento.carregar();
      if (!lib) return; // sem movimento: fica visível, sem custo
      const { animate, inView } = lib;
      el.style.opacity = '0';
      inView(el, () => {
        animate(el, { opacity: 1, transform: ['translateY(16px)', 'none'] },
          { ...MOLAS.suave, delay: this.atraso() });
      }, { margin: '0px 0px -10% 0px' });
    });
  }
}
```

Em vez de GSAP, as dependências da change ficam: `motion` (carregado por `import()`, fora do
pacote inicial). **Sem GSAP, sem ScrollTrigger e sem Lenis**: o scroll nativo é mais seguro para
foco e leitores de tela. O tamanho real do `motion` (`animate` híbrido ou `motion/mini`) é medido na
tarefa 3; se o CSS bastar para o carrossel, só as diretivas pequenas ficam.

- Alternativa descartada: GSAP. Mesma capacidade para este caso, mas sem as convenções de
  tokens e molas das skills do ECC e com plugin extra para scroll.
- Alternativa descartada: `motion/react` dentro do Angular. Exige React no site, sem sentido.

### 5. Tema por seção e claro/escuro

Os temas por seção (fundo, texto, secundário, linha, acento, acento 2, texto sobre o acento) são
tokens, cada um com variante clara e escura, para conviver com o botão de tema existente
(`tema-claro`). Um teste calcula o contraste de todos os pares e falha abaixo de 4,5:1 (spec
`sistema-visual`). O anel de foco usa `outline` de 2px com contraste ≥ 3:1 em cada tema.

### 6. Abertura e primeira dobra

A abertura (Run + Spring) vira opcional: pula com toque ou tecla, não repete na visita seguinte
(estado em `sessionStorage`/`localStorage` com `try/catch`) e não atrasa o LCP: o conteúdo existe no
HTML pré-renderizado desde o primeiro quadro. A primeira dobra mostra nome, cargo, stack,
"disponível" e Projetos/Currículo/Contato.

### 7. Processo

ADR novo (número seguinte ao 0018) revisa o ADR-0012 e registra: desvio do design original,
a biblioteca `motion` (no lugar do GSAP), `dialog`/View Transitions. Trabalho em branch `feat/refatorar-experiencia`, em
trilhas por arquivos conforme `docs/equipe-de-agentes/`: Pincel (casca, tokens, vitrine), Compasso
(movimento), Sentinela (testes e e2e), Escriba (ADR, docs, diário). O Regente é dono do git.

## Risks / Trade-offs

- **Escopo grande** → entrega em grupos independentes e mergeáveis (tarefas), com a vitrine
  antes do resto do movimento, e metas medidas em cada PR.
- **View Transitions e `<dialog>` com nomes únicos** podem conflitar com a transição de rota →
  nome só durante a transição; teste e2e que abre o projeto logo após navegar.
- **Suporte de `animation-timeline`** (Firefox) → fallback por `IntersectionObserver` e estado
  final legível sem ele; testado em Chromium e WebKit pelo Playwright.
- **`motion` no SSR** → importado só no navegador, depois da hidratação; teste confirma que o pacote
  inicial não o contém.
- **Peso de imagens** → orçamento de 200 KB por imagem e script de captura reproduzível; CI falha
  se passar.
- **Perder a identidade que o Vinicius gosta** → manter pacotes, abas, status, Run e sintaxe Java;
  revisão visual com ele antes de cada merge de casca.
- **Capas sem captura reais** (4 dos 6 projetos) → capa gerada em código no estilo do editor, que
  reforça a identidade e evita imagens falsas.

## Migration Plan

1. Branch própria, mudanças incrementais atrás da casca atual: tokens e dados primeiro, vitrine
   depois, movimento em seguida, casca por último.
2. Cada grupo de tarefas passa lint, test:ci, build e e2e antes de seguir.
3. Rollback: reverter o PR do grupo; rotas e slugs não mudam, então nenhum link quebra.
4. Depois do merge, arquivar a change e atualizar as specs.

## Open Questions

- Número exato do ADR e nome do slug dos projetos em `/projetos/:slug` (podem ser decididos na
  implementação sem mudar specs nem tarefas).
- Se o carrossel só com CSS atingir a qualidade desejada, o `motion` fica só nas diretivas pequenas
  (resolvido pela tarefa 3 e registrado no ADR).
