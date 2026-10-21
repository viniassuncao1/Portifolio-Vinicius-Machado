# ADR-0019: Experiência focada em recrutadores

- **Status:** Aceito
- **Data:** 2026-10-20
- **Substitui em parte:** [ADR-0012](0012-design-original-com-elementos-do-intellij.md) (o design
  original como referência visual fiel) e o item 5 do [ADR-0017](0017-abertura-com-run.md) (a
  abertura sem como pular)

## Contexto

O portfólio é lido sobretudo por quem recruta para vagas Java e Angular, com pouco tempo e em
desktop e celular. A casca de IDE atual funciona, mas a experiência é estática e presa ao design
de `design/telas/`: cada seção é um arquivo de código, os projetos não têm vitrine visual, o
movimento se limita à abertura, à digitação e às transições de rota e de tema, e o visitante
precisa entender a árvore antes de achar o que importa. O Vinicius pediu transições, movimento e
interação, com a IDE como referência mínima e prioridade para UI/UX e recrutadores, sem seguir
fielmente o design original.

Foi analisado um portfólio de referência (carrossel de projetos que expande até a tela cheia, tema
por seção, revelações no scroll). Dele vêm as técnicas; as falhas medidas (contraste abaixo de
4,5:1, carrossel que não pausa, PNGs de 1,8 MB, `role="button"` em `article`, cópias do laço no
DOM) viram requisitos. O plano completo está na change `refatorar-experiencia-do-usuario`.

## Decisão

1. **A IDE vira linguagem, não caminho obrigatório.** Ficam os pacotes, as abas, a barra de status,
   o ▶ Executar, a sintaxe do Java e a janela flutuante de preview. Layout, paleta, formas e
   proporções deixam de seguir as telas do design.
2. **Cartão e código são duas visões do mesmo conteúdo.** A visão "Cartão" (escaneável) é a
   inicial; o arquivo Java é uma alternativa que o visitante escolhe. A primeira dobra mostra a
   classe `ViniciusMachado` sendo escrita e se resolvendo no cartão de apresentação.
3. **Vitrine de projetos** com carrossel arrastável (sem movimento automático e com grade alternativa),
   expansão do cartão até a tela cheia por View Transitions (conduzida pelo roteador) e detalhes num
   `<dialog>` nativo, com rota própria `/projetos/:slug`. O carrossel usa `scroll-snap` e Pointer
   Events, sem a biblioteca de animação (o protótipo atendeu). O arquivo `.java` de cada projeto continua em `/projeto-N`.
4. **Movimento: CSS e View Transitions primeiro; a biblioteca `motion` onde o CSS não basta.** O
   `motion` (API sem framework) substitui o GSAP que estava previsto. Das skills `motion-*` do ECC
   ficam os tokens, as molas e as regras de acessibilidade e de SSR, traduzidos para Angular
   (serviço `MovimentoConfig` e diretivas). A biblioteca é carregada por `import()` depois da
   hidratação e nunca com `prefers-reduced-motion`. Sem GSAP e sem Lenis. Tamanho medido com o
   esbuild: `animate` e `inView` somam 24,6 KB gzip; `motion/mini` (só `animate`) tem 3,3 KB e
   serve se as diretivas não precisarem de `x`/`y` nem de animação de valores.
5. **A abertura passa a poder ser pulada.** O item 5 do ADR-0017 ("sem pular") é revisto: a
   abertura é opcional, não repete em visitas seguintes e não atrasa o conteúdo, que continua no
   HTML desde o primeiro quadro. A prioridade passa a ser o tempo até o conteúdo.
6. **Metas medidas:** AXE sem violações, contraste AA em todos os temas por seção, Lighthouse mobile
   95/100/100/100, LCP até 2,5 s, CLS até 0,05 e imagens de projeto até 200 KB.

7. **Tipografia de duas camadas.** As superfícies para quem recruta (visão geral, vitrine, barra de
   ações) usam **Geist** (variável, só o subconjunto latino, servida pelo próprio site, com
   `font-display: block` para o texto grande do hero não trocar de métrica) e o código segue em
   JetBrains Mono. A casca de IDE mantém a Inter (as escalas e os testes dela não mudam).
8. **Visão "Cartão" em seis seções.** Início, Sobre Mim, Skills, Experiências, Formação e Contato
   têm as duas visões; as demais (Diferenciais, Como uso a IA, Certificações, Eventos, Idiomas,
   Depoimentos e os seis projetos) continuam só em código, e os projetos têm a vitrine. Os cartões
   leem os mesmos fatos das seções em código (`core/perfil.ts`), e `perfil.spec.ts` falha se os dois
   lados divergirem.
9. **Medição com compressão.** O servidor dos testes passa a comprimir (brotli e gzip) como a
   Vercel. A primeira medição sem compressão tinha dado LCP de 4,5 s; com compressão a linha de
   base é 100 e LCP de 0,9 a 1,1 s (ver o diário 0023), então a meta é não piorar.

## Alternativas consideradas

- **Manter a casca e só animar.** Entrega movimento, mas não resolve a leitura rápida por
  recrutadores nem a vitrine de projetos.
- **Página rolável única, sem rotas por seção.** Quebra os endereços, as abas e o SEO, e contradiz o
  [ADR-0018](0018-secoes-num-arquivo-so.md).
- **GSAP, ScrollTrigger e Lenis, como no site de referência.** Pesa cerca de 100 KB, o scroll
  suave interfere em teclado e em `inert`, e o CSS e o `motion` cobrem o necessário.
- **`motion/react` no Angular.** Exigiria React no site, sem sentido.

## Consequências

- O requisito "Design como referência" da spec `sistema-visual` é substituído por "Linguagem mínima
  de IDE"; os desvios do design original ficam registrados aqui e no design da change.
- Cada seção ganha uma visão em cartão, e a visão em código precisa continuar com o mesmo
  conteúdo; os testes passam a conferir os dois.
- Entra uma dependência (`motion`), carregada sob demanda; o tamanho medido fica no diário da
  change.
- Quatro dos seis projetos não têm captura de tela; eles usam uma capa gerada em código no estilo
  do editor, sem imagens inventadas.
- As abas, a busca, o tema claro e a digitação do código continuam como estão e só ganham o
  tratamento visual novo.
