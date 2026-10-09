# Arquitetura

## Visão geral

O portfólio é uma aplicação Angular 22 **pré-renderizada**: no build, cada rota vira um arquivo
HTML estático em `dist/portfolio/browser/`. No navegador, o Angular faz a hidratação e assume a
navegação e as animações. Não há servidor em produção; o site é servido como arquivos estáticos pela Vercel
(veja [CI/CD e deploy](deploy.md)).

```
npm run build
  └─ @angular/build:application (outputMode: static)
       ├─ bundle do navegador (JS/CSS com hash)
       └─ pré-renderização das rotas (app.routes.server.ts → RenderMode.Prerender)
            └─ dist/portfolio/browser/index.html  ← HTML com o conteúdo já renderizado
```

## Decisões principais

| Decisão                         | Motivo                                                                  |
| ------------------------------- | ----------------------------------------------------------------------- |
| Standalone, signals, zoneless   | Padrão atual do Angular; menos código e detecção de mudanças previsível |
| Pré-renderização (SSG)          | Conteúdo fixo: HTML pronto para SEO e carregamento rápido, sem servidor |
| Vitest                          | Executor padrão do Angular atual, mais rápido que Karma                 |
| Playwright contra o build       | O E2E testa exatamente o que vai ao ar                                  |
| Vercel com deploy pelo Actions  | Feita para frontend, preview por PR; deploy só com o pipeline verde     |
| Casca como rota-pai             | A IDE monta uma vez; só o editor muda e a transição anima só ele        |
| Conteúdo como dados tipados     | Todas as seções têm o mesmo esqueleto; muda só o conteúdo do editor     |
| Só design tokens nos estilos    | Um lugar para ajustar o visual; nada de cor ou tamanho solto            |
| Fonte servida pelo próprio site | Sem Google Fonts: nenhuma requisição externa para a fonte               |
| axe nos E2E                     | Acessibilidade verificada em todo PR (ADR-0009)                         |
| Design como referência          | Experiência de IDE de verdade e Java moderno no código (ADR-0010)       |

O raciocínio completo, com alternativas descartadas, está no design da change de fundação em
`openspec/`.

## Rotas e casca da IDE

`app.routes.ts` tem uma rota-pai `''` com o componente `Casca` (`layout/`) e as rotas filhas:
o Início (`''`) e as 15 seções de `core/secoes.ts` (`sobre-mim`, `skills`, `contato` etc.), mais
uma rota por página extra das seções que declaram `paginas` (`/skills/2`). A casca
(barra de ferramentas, painel lateral, faixa de abas, editor e barra de status) é montada uma vez e não recarrega entre
seções: só o conteúdo do `<router-outlet>` troca, e a View Transitions API anima apenas ele.

`core/secoes.ts` é a fonte única da lista de seções: dela saem os itens da árvore, as rotas e os
títulos. Enquanto uma seção não tem feature própria, a rota dela carrega `SecaoEmConstrucao`
(`shared/`). O Início e as 15 seções são todos pré-renderizados (`RenderMode.Prerender` em `**`),
então cada um vira um HTML estático com o conteúdo já desenhado.

O título da janela segue o formato `<seção> | Vinicius Machado` (`EstrategiaDeTitulo`) e o mesmo
texto vira o `h1` visualmente oculto da casca. Os componentes e o modelo de conteúdo do editor
estão em [componentes.md](componentes.md).

### Casca que ocupa a janela

A casca tem a altura da janela (`100dvh`) e a página não rola: só a área do editor rola, como numa
IDE. Cada navegação volta o editor ao topo. A barra de status fica sempre visível no rodapé.

### Experiência de IDE

Além da estrutura do design, a casca tem comportamento de IDE ([ADR-0010](adr/0010-design-como-referencia-e-java-moderno.md)):

- **Faixa de abas** (`FaixaDeAbas`): uma aba por arquivo `.java` aberto, no padrão `tablist`, com
  os botões de fechar fora do `tablist`. O estado fica no serviço `AbasAbertas` (`core/`), guardado
  em `sessionStorage` e restaurado só no navegador depois da hidratação. No servidor existe apenas
  a aba da rota atual, para o HTML pré-renderizado e a hidratação coincidirem.
- **Barra de status** (`BarraDeStatus`): arquivo aberto, `linha:coluna` (serviço `EstadoDoEditor`),
  codificação, versão do Java e ramo.
- **Busca de seções** (`BuscaDeSecoes`): Ctrl/Cmd+P abre um `<dialog>` com combobox; o filtro
  ignora acentos e maiúsculas. A árvore de seções também se navega por setas (roving tabindex).
- **Digitação, cursor e linha atual** (`EditorDeCodigo`): o código aparece digitado na primeira
  abertura de cada página, em até 1,5 s. É só visual, uma máscara de CSS: o texto completo fica
  sempre no DOM, então o HTML pré-renderizado, o SEO e os leitores de tela recebem o código
  inteiro. Com `prefers-reduced-motion` o código aparece pronto e o cursor não pisca.

O código exibido é Java 21 válido, e as informações do design são preservadas. Os detalhes de
cada componente e o modelo de conteúdo estão em [componentes.md](componentes.md).

### Gaveta no celular

Abaixo de 768px o painel lateral vira uma **gaveta**. O botão "Seções" (`aria-expanded` e
`aria-controls`) a abre e leva o foco ao primeiro item; Escape, o botão "Fechar seções" ou a
escolha de uma seção a fecham e devolvem o foco ao botão. O design só tem telas de desktop, então
esse comportamento é decisão nossa, mantendo as cores e fontes do design.

## Design tokens e estilos

Todo valor visual vem de variáveis CSS declaradas em `:root`:

- `src/styles/_tokens.scss`: cores da interface e da sintaxe, tipografia, medidas, espaços, raios
  e bordas, extraídos das telas.
- `src/styles/_movimento.scss`: durações (`--duracao-*`), curvas (`--curva-*`) e a animação da
  troca de seção. Com `prefers-reduced-motion: reduce` as durações zeram e a transição de rota é
  pulada.

**Regra:** os componentes usam só tokens. Cor, tamanho ou duração solta num componente é erro de
revisão; se faltar um valor, cria-se o token. As animações usam apenas `transform` e `opacity`.

### Fonte

A **JetBrains Mono** vem do pacote `@fontsource/jetbrains-mono` (pesos 400 e 700, subset latino,
`font-display: swap`) e é servida pelo próprio site. Não há Google Fonts nem outra requisição
externa para texto.

## Acessibilidade

A meta é WCAG AA. Os E2E rodam o **axe** (`@axe-core/playwright`, tags `wcag2a` e `wcag2aa`) no
Início e nas 15 rotas, e qualquer violação reprova o PR. Elementos decorativos (barra de
ferramentas, numeração, posição do cursor) usam `aria-hidden`; as regras do axe não são desligadas. A decisão
está no [ADR-0009](adr/0009-acessibilidade-automatizada-com-axe.md).

## Testes E2E e servidor próprio

O Playwright testa o build de produção servido por `e2e/servidor.mjs`, um servidor estático de
poucas linhas que **imita a Vercel**: entrega o HTML pré-renderizado da rota e, se não existir,
cai no `index.csr.html`. O `serve --single` foi removido porque devolveria o `index.html` da raiz
também para `/contato`, escondendo um erro de pré-renderização que só apareceria em produção.

## Diário de desenvolvimento

Cada change do OpenSpec ganha uma entrada em [`docs/diario/`](diario/README.md), com o problema, o
que foi decidido e descartado e um rascunho de post para o LinkedIn. O processo está no
[ADR-0008](adr/0008-diario-de-desenvolvimento.md).

## Estrutura de pastas

Organização por **feature**, não por tipo de arquivo:

```
src/app/
  app.ts, app.routes.ts       componente raiz e rotas (lazy loading por feature)
  app.config.ts               providers do navegador (router, hidratação)
  app.config.server.ts        providers da pré-renderização
  core/                       singletons e configurações globais
  shared/                     componentes, diretivas e pipes reutilizáveis
  layout/                     casca da IDE: barra de ferramentas, árvore, abas, status e busca
  features/<secao>/           uma pasta por seção do portfólio
```

Regras de dependência:

- `features/` pode importar de `shared/` e `core/`, mas nunca de outra feature.
- `shared/` não importa de `features/` nem de `layout/`.
- Cada feature é carregada sob demanda (`loadComponent`).

## Convenções de arquivos

Seguimos o guia de estilo de 2025 do Angular: `inicio.ts` (e não `inicio.component.ts`), com o
teste ao lado (`inicio.spec.ts`).

## Design

O design de referência (identidade visual, não especificação pixel a pixel: veja o
[ADR-0010](adr/0010-design-como-referencia-e-java-moderno.md)) é um PDF do Illustrator (30 telas, exportadas do PDF original de 1920×1080) que simula uma IDE escura
no estilo Eclipse: barra de ferramentas no topo, árvore de seções à esquerda e editor com código
Java à direita. Como o PDF não é legível pelas ferramentas de IA, cada tela foi exportada como
imagem (`design/telas/tela-01.png` a `tela-30.png`, de 1600×900: o design real é o PNG × 1,2), e os textos de cada tela ficam em
`design/telas/textos.md`. Nada disso é versionado (`design/` está no `.gitignore`). Cores,
tipografia e medidas foram extraídos das imagens para os design tokens descritos acima.
