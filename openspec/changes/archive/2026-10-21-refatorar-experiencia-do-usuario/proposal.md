## Why

O portfólio cumpre bem a ideia de IDE, mas a experiência é estática e presa ao design original: cada
seção é um arquivo de código que se rola, os projetos são arquivos `.java` sem vitrine visual, o
movimento se limita à abertura, à digitação do código e a transições de rota e de tema, e o visitante
precisa entender a árvore antes de achar o que importa. O Vinicius quer uma experiência mais viva e
mais clara para quem recruta, mantendo só uma referência mínima ao Java e ao IntelliJ, sem seguir
fielmente o design de `design/telas/`.

A análise de um portfólio de referência (carrossel de projetos que expande até a tela cheia, tema que
muda por seção, revelações no scroll, indicador deslizante na navegação) mostrou técnicas que cabem
aqui, e também falhas a evitar (contraste abaixo de 4,5:1, carrossel que não pausa, PNGs de
1,8 MB, `role="button"` em `<article>`).

## What Changes

- **Casca de IDE reimaginada.** Mantém a linguagem de IDE (abas, árvore do projeto em pacotes, barra
  de status com caminho do arquivo e Git, ▶ Executar), mas redesenha layout, hierarquia, ritmo e
  navegação com liberdade em relação às telas do design. **BREAKING** para o requisito "Design como
  referência" da spec `sistema-visual` e para o ADR-0012, que serão revisados por um ADR novo.
- **Vitrine de projetos.** Os seis projetos passam a ter uma vitrine visual: cartões com captura de
  tela e destaques curtos num carrossel arrastável, com pausa explícita e alternativa estática,
  expansão do cartão até a tela cheia (e volta) com galeria e navegação entre projetos. O arquivo
  `.java` de cada projeto continua existindo como o "detalhe em código".
- **Movimento e microinterações.** Tema de cores por seção via tokens, revelação de títulos por
  linha, texto que se acende no scroll, indicador deslizante nas abas, linha do tempo que se
  desenha, botões magnéticos, cursor opcional em ponteiro fino e relógio e status vivos na barra.
  Preferir CSS e View Transitions; a biblioteca **`motion`** (API vanilla, adaptada ao Angular a partir das skills do ECC) entra só onde o CSS não basta, carregada sob demanda.
- **Navegação e orientação.** A primeira dobra responde em segundos "quem é, o que faz, onde ver
  projetos e como contatar", com atalhos diretos, e a navegação no celular deixa de depender de
  entender a árvore.
- **Acessibilidade e desempenho.** AXE sem violações, contraste AA em todos os temas por seção,
  controle de pausa de qualquer movimento contínuo, teclado completo no carrossel e no modal,
  `prefers-reduced-motion` sem carregar a biblioteca de animação, imagens em AVIF/WebP com
  `NgOptimizedImage` e Lighthouse alto (meta definida no design).
- **Registro.** ADR novo que revisa o ADR-0012 e justifica a biblioteca `motion`; documentação e diário atualizados.

Fora do escopo: reescrever o conteúdo (textos, Java exibido) das seções, trocar o framework ou a
publicação (Vercel), criar backend ou CMS, e remover as rotas e slugs atuais (SEO).

## Capabilities

### New Capabilities

- `vitrine-de-projetos`: cartões de projeto em carrossel arrastável com pausa e alternativa
  estática, expansão do cartão até a tela cheia e volta, galeria de imagens, destaques curtos e
  navegação entre projetos, tudo operável por teclado.
- `movimento-e-microinteracoes`: linguagem de movimento do site (tema por seção, revelações, scroll,
  indicador deslizante, linha do tempo, interações de ponteiro, relógio e status vivos), com
  `prefers-reduced-motion`, controle de pausa e carregamento da biblioteca sob demanda.
- `orientacao-do-visitante`: primeira dobra e caminhos rápidos para recrutador (projetos, contato,
  currículo), orientação de onde o visitante está e navegação clara no celular.

### Modified Capabilities

- `sistema-visual`: o design de `design/telas/` deixa de ser referência fiel (só a identidade de
  IDE permanece); entram tokens de tema por seção, com contraste AA garantido em cada um.
- `casca-da-ide`: nova estrutura e hierarquia da casca, mantendo árvore em pacotes, abas e barra de
  status, e a adaptação a telas pequenas.
- `secao-projetos`: a seção de projetos ganha a vitrine como porta de entrada, e cada projeto
  mantém seu arquivo `.java` como detalhe em código.

## Impact

- **Código:** `src/app/layout/*` (casca, árvore, abas, barra de status, abertura), nova feature da
  vitrine em `src/app/features/projetos/`, tokens em `src/styles`, serviços de movimento em
  `src/app/core/`, e ajustes nos componentes de seção para a nova orientação.
- **Dependências:** `motion` (API vanilla), carregado por `import()` dinâmico, fora do
  bundle inicial. Sem GSAP e sem Lenis.
- **Ativos:** capturas de tela dos projetos em AVIF/WebP (hoje só há `public/projetos/*.jpg` de
  dois deles) e fotos otimizadas.
- **Testes:** specs unitárias novas, e2e (Playwright + AXE) para carrossel, modal, teclado, mobile
  e reduced-motion, e checagem de contraste por tema de seção.
- **Documentação:** ADR novo (revisa o ADR-0012), `README.md`, `docs/arquitetura.md`,
  `docs/componentes.md` e a entrada do diário de desenvolvimento.
- **Processo:** implementação em branch `feat/...` pela equipe de agentes no Maestri, com o Regente
  como dono do git (ver `docs/equipe-de-agentes/`).
