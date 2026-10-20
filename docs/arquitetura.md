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
o Início (`''`) e as 17 seções de `core/secoes.ts` (`sobre-mim`, `skills`, `contato` etc.), mais
redirecionamentos dos endereços antigos de página (`/skills/2` leva a `/skills`), porque cada seção é um
arquivo só, sem paginação ([ADR-0018](adr/0018-secoes-num-arquivo-so.md)). A casca
(barra superior, faixa de ferramentas, painel do projeto, faixa de abas, editor e barra de status) é montada uma vez e não recarrega entre
seções: só o conteúdo do `<router-outlet>` troca, e a View Transitions API anima apenas ele.

`core/secoes.ts` é a fonte única da lista de seções: dela saem os itens da árvore, as rotas e os
títulos. Enquanto uma seção não tem feature própria, a rota dela carrega `SecaoEmConstrucao`
(`shared/`). O Início e as 17 seções são todos pré-renderizados (`RenderMode.Prerender` em `**`),
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

### Moldura: design original com elementos do IntelliJ

O [ADR-0011](adr/0011-identidade-visual-intellij-new-ui.md) trocou a identidade pela do IntelliJ
New UI, mas o resultado ficou "literalmente o IntelliJ" e apagou o design feito sob encomenda. O
[ADR-0012](adr/0012-design-original-com-elementos-do-intellij.md) o substituiu em parte: **o design
original predomina** (paleta dos cinzas, **ícones do design**, controles de janela, formas e
cabeçalho `Portfolio_Vinicius`) e do IntelliJ ficam:

- **Árvore em pastas:** as seções são arquivos `.java` dentro de pacotes (`sobre`, `skills`,
  `experiencias`, `projetos`, `formacao`, `recomendacoes`, `contato`), a partir do campo `pacote`.
  Todos os links ficam no HTML pré-renderizado, e só a pasta aberta pelo visitante anima.
- **Cores de sintaxe do Java do IntelliJ** no código (o comentário em `#8F939A`, que passa no
  contraste AA).
- **▶ Executar na calha:** o botão fica à esquerda dos números, na linha `public class` dos
  projetos com site, e abre a janela de preview. A calha só existe nas páginas com esse botão.
- **Barra de ferramentas do design, escura:** desvio pedido pelo Vinicius. Sem o degradê claro das
  telas, nos cinzas do design, com os ícones do design e foco rosa. Dos ícones da IntelliJ
  Platform ficam só a busca e a branch `master`.
- **Faixa de ferramentas (40px, só no desktop):** o botão Projeto mostra e esconde o painel do
  projeto (signal `painelVisivel` na casca, com transição que respeita `prefers-reduced-motion`);
  Commit e Estrutura são decorativos.
- **Barra de status com o caminho do arquivo:** vem de `core/breadcrumbs.ts`, que usa o campo
  `pacote` de cada `Secao` em `core/secoes.ts`. Mostra também `linha:coluna`, `LF`, `UTF-8`,
  `4 spaces`, a branch e o commit do deploy.
- **Ícones da IntelliJ Platform** (Apache 2.0) só onde o design não tem equivalente (▶, branch,
  busca e faixa de ferramentas), em `public/icones/new-ui/`, com os créditos em `CREDITOS.md`.
- **Tipografia e densidade compactas** da change de tokens (Inter na interface, JetBrains Mono no
  código).

### Commit do deploy na barra de status

O SHA mostrado na barra vem de `scripts/gerar-informacoes-do-build.mjs`, que roda nos scripts `pre*`
(`prestart`, `prebuild`, `pretest`, `prelint`, `pretest:ci`) e escreve `src/app/core/build.gerado.ts`
(no `.gitignore`). O script só lê variáveis de ambiente, sem `git`, na ordem `SHA_DO_COMMIT`,
`GITHUB_SHA` e `VERCEL_GIT_COMMIT_SHA`; sem nenhuma, o valor é `null` e o item não aparece.

`SHA_DO_COMMIT` existe porque, num evento `pull_request`, o `GITHUB_SHA` é o commit temporário de
**merge**, que não existe na branch e daria um link quebrado. O deploy de preview do
`ci.yml` define `SHA_DO_COMMIT` com `github.event.pull_request.head.sha`, o commit real da branch.

### Abertura com Run

O site abre como o IntelliJ rodando o projeto ([ADR-0017](adr/0017-abertura-com-run.md), que
substituiu a tela de boas-vindas do ADR-0015). A sequência tem fases, cada uma com teto de tempo, e
**não pode ser pulada** (nem botão nem Esc, que não faz nada):

| Fase          | Tempo                                        | O que acontece                                                                           |
| ------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Splash        | 3 s (teto de 5 s com rede lenta)             | Foto, nome, cargo e as etapas da IDE ("Indexing 17 Java classes…", "Project ready")      |
| Pronto        | até o clique; execução automática aos 5 s    | Widget de Run com o foco no ▶ (Enter, clique, ⌃R ou ⇧F10); pulso do ▶ e uma dica aos 3 s |
| Build         | 17 classes, uma a cada 60 ms                 | `> Task :compileJava`, `:processResources`, `:classes`, `:bootRun`                       |
| Log do Spring | banner + 9 linhas a cada 150 ms, pausa 0,5 s | O log até `Started PortfolioApplication`, o mesmo da janela de Run                       |
| A IDE aparece | ~0,7 s                                       | A janela recolhe para a barra de status e os painéis entram em sequência                 |

Do clique ao portfólio leva cerca de 4,3 s (teto de 5 s); sem clique, o pior caso é cerca de 12 s.

- **Quando aparece.** Só em `/`, com JavaScript e uma vez por sessão (`sessionStorage['abertura-exibida']`).
  Quem chega por link direto de uma seção vai ao conteúdo, só com o aviso na barra de status
  (`PortfolioApplication started in 1.8 s`).
- **Sem prejudicar o HTML.** Um script inline no `<head>`, como o do tema, liga `data-abertura` no
  `<html>` antes da primeira pintura; o cartão aparece no primeiro quadro e o nome não anima (LCP).
  O conteúdo da rota fica no DOM, por baixo. Sem JavaScript, nada muda.
- **Log do Spring compartilhado.** O texto do log vive em `core/log-do-spring.ts` e é usado pela
  abertura e pela janela de Run do Executar; a linha do tempo (todos os tempos em constantes) e a lista das classes compiladas ficam em
  `core/linha-do-tempo-da-abertura.ts`. A lista, `CLASSES_COMPILADAS`, é **derivada de `core/secoes.ts`**
  (uma classe por seção, na ordem da árvore, mais `PortfolioApplication`), então são 17 hoje e uma
  seção nova entra sozinha; cada classe a mais empurra o resto do build em 60 ms. O serviço `Abertura` (`core/abertura.ts`) conduz as fases e o componente `layout/abertura/`
  (`abertura.ts`/`.html`, `abertura.scss`, `widget-de-run.scss` e `janela-de-build.scss`) as desenha.
- **Movimento.** Tokens em `_movimento.scss` (`--duracao-entrada-abertura`, `--duracao-recolher`,
  `--intervalo-escalonado`, `--curva-suave`) e só `transform`, `opacity` e `clip-path`. O recolher
  usa a View Transitions API com `view-transition-name` compartilhado entre a janela e o item da
  barra de status; sem a API, a mesma coreografia por classes. Com `prefers-reduced-motion`, as
  mesmas etapas sem animação (log completo de uma vez, fades de até 150 ms).
- **Acessibilidade.** É um `role="dialog"` com `aria-modal="true"` e o resto da casca `inert`. O foco
  vai ao ▶ quando fica pronto e ao editor no fim; uma região `aria-live` anuncia só os marcos. O ▶ tem
  área de toque de 44 px e `aria-keyshortcuts`.

### Janela de Run

A **janela de Run** simula rodar o projeto e ocupa sozinha a área de baixo da IDE. Mostra o log de
inicialização do `PortfolioApplication` (banner do Spring, `Starting PortfolioApplication using
Java 21`, `Tomcat started on port 8080`, `Started PortfolioApplication in 1.8 seconds`). O texto é
fixo (`layout/janela-de-run/log.ts`), com data e hora geradas no navegador, e **nunca entra no HTML
pré-renderizado**. Abre **só pelo Executar** da barra (que, nos projetos com site, abre o preview);
revela o log em até 2,5 s, e "Pular", Esc e o fechar estão sempre à mão.

### Página do repositório

O indicador `master` da barra e o ícone Commit da faixa abrem a aba `Portfolio-Vinicius-Machado`,
na rota `/repositorio`: uma página no estilo de um repositório do GitHub, com o que o projeto é, os
números, a proporção de commits por tipo, os últimos pull requests e commits e um link para o
histórico completo ([ADR-0016](adr/0016-repositorio-no-estilo-do-github.md)). Ela substituiu o
painel do Git da área de baixo.

- **Histórico gerado no build** ([ADR-0013](adr/0013-historico-do-git-gerado-no-build.md)).
  `scripts/gerar-historico-do-git.mjs` roda nos scripts `pre*`, lê o `git log` com `execFileSync`
  (sem shell) e grava `public/git/historico.json`, que está no `.gitignore`. Cada commit tem SHA,
  pais, nome do autor, data, assunto e, nos merges de PR, o número, a branch e o **título do PR**.
  **Não há e-mails**, token nem chamada à API do GitHub. Sem `git`, sem repositório ou em clone
  raso, grava a lista vazia e nunca falha o build.
- **Nome do autor unificado** pelo `.mailmap` (`%aN`).
- **Histórico completo no CI.** Os jobs de build (`build-e2e`, `deploy-preview` e `deploy-producao`)
  usam `fetch-depth: 0`.
- **`core/git/`.** `historico.ts` tem os tipos; `ler-historico.ts` valida o JSON no limite do
  sistema (`lerHistorico` devolve `null` se o formato estiver errado) e monta os endereços do commit
  e do PR.
- **Resumo no navegador.** Funções puras calculam a contagem por tipo do Conventional Commits, os
  últimos PRs e os últimos commits de código (sem os de marcar tarefas), e por isso são testadas com
  o Vitest. Commits de merge não entram na contagem por tipo. Na barra, `agruparTiposPequenos`
  (`features/repositorio/agrupar-tipos.ts`) mostra os tipos com 3% ou mais dos commits, por
  frequência, e reúne os menores e os commits sem tipo num segmento "outros", que a legenda detalha.
- **Carregamento sob demanda.** O serviço `HistoricoDoRepositorio` (`core/repositorio.ts`) guarda o
  estado (`ocioso`, `carregando`, `pronto` ou `erro`) e baixa o JSON só na primeira abertura da
  página, nunca no servidor nem no carregamento inicial. A rota é pré-renderizada com o esqueleto, e
  as datas relativas só são calculadas no navegador.

### Gaveta no celular

Abaixo de 768px o painel do projeto vira uma **gaveta**. O botão **Seções** da barra superior
(ícone com rótulo visível, `aria-expanded` e `aria-controls`) a abre, com as pastas já abertas, e leva o foco ao primeiro item; Escape, o botão "Fechar
seções" ou a escolha de uma seção a fecham e devolvem o foco ao botão. O design só tem telas de
desktop, então esse comportamento é decisão nossa.

## Design tokens e estilos

Todo valor visual vem de variáveis CSS declaradas em `:root`:

- `src/styles/_tokens.scss`: cores da interface e da sintaxe (a paleta do design original, com o
  rosa como acento), tipografia (Inter e JetBrains Mono), medidas, espaços, raios e bordas.
- `src/styles/_movimento.scss`: durações (`--duracao-*`), curvas (`--curva-*`) e a animação da
  troca de seção. Com `prefers-reduced-motion: reduce` as durações zeram e a transição de rota é
  pulada.

**Regra:** os componentes usam só tokens. Cor, tamanho ou duração solta num componente é erro de
revisão; se faltar um valor, cria-se o token. As animações usam apenas `transform` e `opacity`.

### Fontes

Duas fontes, mantidas da change de tokens do ADR-0011: **Inter** (13px) na interface, do pacote
`@fontsource/inter` (pesos 400 e 500), e **JetBrains Mono** (14px) no código, de
`@fontsource/jetbrains-mono` (pesos 400 e 700). As duas usam o subset latino e `font-display: swap`
e são servidas pelo próprio site: não há Google Fonts nem outra requisição externa para texto.

### Ajustes nativos

`color-scheme` e `theme-color` acompanham o tema (veja abaixo), números tabulares nos números de linha e na posição do cursor
e `translate="no"` no código, para o tradutor automático não mexer no Java exibido.

### Tema claro e escuro

O site tem dois temas ([ADR-0014](adr/0014-tema-claro.md)), feitos só por tokens.

- **Tokens.** O bloco `:root` de `_tokens.scss` é o tema escuro. O claro redefine os mesmos tokens
  em `:root[data-tema='claro']`, com a paleta derivada do design (mesma hierarquia de cinzas) e o
  Java do IntelliJ Light. Um `@mixin tema-claro` evita repetir os valores.
- **Sem piscar num site SSG.** O HTML chega pré-renderizado e o Angular hidrata depois, então o
  tema não pode esperar o JavaScript do app. Um **script inline** mínimo no `<head>` do
  `index.html`, antes dos estilos, lê `localStorage['tema']` (ou, sem valor,
  `prefers-color-scheme`), aplica `data-tema` no `<html>` e ajusta `color-scheme` e `theme-color`,
  tudo com `try/catch`. É a única exceção à regra de não ter JavaScript fora do Angular.
- **Sem JavaScript.** Enquanto o `<html>` não tem `data-tema`, um
  `@media (prefers-color-scheme: light) { :root:not([data-tema]) { … } }` aplica o claro pelo CSS.
- **Serviço `Tema`** (`core/tema.ts`, `@Service`): lê o `data-tema` que o script já aplicou (e não o
  recalcula, para não divergir do pré-render), expõe os signals `tema` e `claro` e troca com
  `alternar()` ou `escolher()`: atualiza `data-tema`, `color-scheme`, a meta `theme-color` (a cor
  vem do token `--cor-painel`) e grava no `localStorage`. No servidor não toca em
  `localStorage`, `matchMedia` nem no `<html>`.
- **Troca com transição.** `core/transicao-de-tema.ts` envolve a troca num crossfade curto da View
  Transitions API (`document.startViewTransition`), com a classe `transicao-de-tema` no `<html>`
  durante a animação (os estilos ficam em `_movimento.scss`). Ela só anima se o navegador tem
  `startViewTransition`, se não há movimento reduzido e se não há uma transição de rota ativa, já que duas
  transições não convivem; nos demais casos a troca é direta. Espera o Angular renderizar o novo
  tema por no máximo 100 ms, para a transição nunca segurar a página.
- **Tokens claros no CSS crítico.** O Angular inlina só o CSS crítico no HTML pré-renderizado
  (beasties), e ele leva apenas as regras que casam com esse HTML, que não tem `data-tema`: sem
  tratamento, o primeiro quadro no tema claro saía **escuro** até o `styles-*.css` carregar. Os
  tokens claros ficam entre os marcadores `/*! tokens-claros:inicio */` e
  `/*! tokens-claros:fim */` em `_tokens.scss`; `removeSpecialComments: false` no `angular.json`
  mantém os marcadores no CSS final (só comentários com `!` sobrevivem ao Sass e ao esbuild), e
  `scripts/inlinar-tokens-claros.mjs`, que roda depois do `ng build` no script `build`, injeta um
  `<style id="tokens-claros">` em cada HTML (cerca de 2 KB por página). Se os marcadores sumirem, o
  script falha o build.
- **`theme-color`.** Acompanha o tema: `#2B2B2B` no escuro e `#ECECEC` no claro, a cor da barra do
  navegador no celular.
- **Ícones.** Os do design servem nos dois temas; os da IntelliJ Platform têm a variante clara em
  `public/icones/new-ui/claro/`, escolhida pelos tokens `--exibir-icone-escuro` e
  `--exibir-icone-claro`, sem JavaScript.
- **Testes.** O `playwright.config.ts` fixa `colorScheme: 'dark'`: a suíte foi escrita para o escuro
  e, com o script inline respeitando o sistema, o Playwright (que sem isso emula o claro) passaria
  a rodar tudo no claro. O tema claro é pedido por teste, com `emulateMedia`.

## Acessibilidade

A meta é WCAG AA. Os E2E rodam o **axe** (`@axe-core/playwright`, tags `wcag2a` e `wcag2aa`) no
Início e nas 16 rotas, e qualquer violação reprova o PR. Elementos decorativos (barra de
ferramentas, numeração, posição do cursor) usam `aria-hidden`; as regras do axe não são desligadas. A decisão
está no [ADR-0009](adr/0009-acessibilidade-automatizada-com-axe.md).

## Testes E2E e servidor próprio

O Playwright testa o build de produção servido por `e2e/servidor.mjs`, um servidor estático de
poucas linhas que **imita a Vercel**: entrega o HTML pré-renderizado da rota e, se não existir,
cai no `index.csr.html`. O `serve --single` foi removido porque devolveria o `index.html` da raiz
também para `/contato`, escondendo um erro de pré-renderização que só apareceria em produção.

## SEO e compartilhamento

O portfólio é divulgado no LinkedIn, e o link precisa aparecer com imagem e resumo. Como o
LinkedIn e os buscadores **não executam JavaScript**, tudo isto é escrito durante a
pré-renderização e já está no HTML de cada rota.

- **Serviço `Seo`** (`core/seo.ts`, `@Service`): a cada `NavigationEnd` atualiza, com `Meta` e
  `DOCUMENT` (sem `window`, por isso funciona no servidor), a `description`, o
  `link[rel=canonical]`, as tags Open Graph (`og:*`) e as do Twitter/X (`twitter:*`). O título vem de
  `EstrategiaDeTitulo.tituloDaJanela`, o mesmo cálculo que grava o título da janela.
- **Domínio:** o site usa o domínio próprio `https://vinimachado.wattscompany.com.br`. A constante
  `URL_DO_SITE` (`core/seo.ts`) é a fonte para o canônico, o `og:url` e os dados estruturados; o
  sitemap e o `robots.txt` repetem o endereço (o script do sitemap é Node e roda antes do build, e um
  teste confere se as duas constantes batem).
- **Descrições:** cada `Secao` (`core/secoes.ts`) tem um campo `descricao` em pt-BR, de até 160
  caracteres. Os endereços antigos de página (`/skills/2`) redirecionam para a seção, e o Início usa
  `DESCRICAO_DO_INICIO`.
- **JSON-LD:** o `<script type="application/ld+json">` com o `Person` (nome, cargo, LinkedIn, GitHub
  e stack) existe só no Início e é removido nas outras rotas.
- **Imagem de compartilhamento:** `public/compartilhamento/portfolio-v2.png`, 2400x1260 (layout de 1200x630 com `deviceScaleFactor` 2), versionada e
  gerada por `scripts/gerar-imagem-de-compartilhamento.mjs` (Playwright, com movimento reduzido).
- **Sitemap e robots:** `scripts/gerar-sitemap.mjs` roda no script `build`, depois do `ng build`,
  percorre os `index.html` pré-renderizados em `dist/` e escreve o `sitemap.xml`, então ele
  acompanha as rotas sozinho (só os endereços das seções, sem os de página, que redirecionam). O `public/robots.txt` é estático e aponta para o sitemap.

## Ícone do site

O site tinha o favicon padrão do Angular. Ele passou a ser um "VM" num quadrado arredondado, como o
ícone de projeto do IntelliJ New UI, para reforçar a identidade de IDE já na aba do navegador.

- **Desenho:** quadrado com raio de cerca de 22% do lado, preenchido com o acento `#9A2A8C` (contraste
  melhor com letras brancas e legível sobre abas claras e escuras). "VM" em branco, Inter 600
  convertida em contornos no SVG, ocupando cerca de 70% da largura (a 55% o "VM" ficava com 4 px de altura em 16 px e não lia). Sem borda nem sombra.
- **Arquivos:** `public/favicon.svg` é a fonte. `scripts/gerar-icones.mjs` (Playwright, como o do
  cartão) renderiza PNG de 16, 32, 48 e 180 px, e o `favicon.ico` reúne 16, 32 e 48.
- **HTML:** `src/index.html` declara o SVG (`rel="icon"`, `image/svg+xml`), o `favicon.ico`
  (`sizes="any"`, para navegadores que pedem esse caminho direto) e o `apple-touch-icon.png`.
- **Fora do escopo:** manifesto de PWA e ícones por tema do sistema.

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

O design original (fonte das **informações** e, pelo
[ADR-0012](adr/0012-design-original-com-elementos-do-intellij.md), também da referência visual; veja
também o [ADR-0010](adr/0010-design-como-referencia-e-java-moderno.md)) é um PDF do Illustrator (30 telas, exportadas do PDF original de 1920×1080) que simula uma IDE escura: barra de ferramentas no topo, árvore de seções à esquerda e editor com código
Java à direita. Como o PDF não é legível pelas ferramentas de IA, cada tela foi exportada como
imagem (`design/telas/tela-01.png` a `tela-30.png`, de 1600×900: o design real é o PNG × 1,2), e os textos de cada tela ficam em
`design/telas/textos.md`. Nada disso é versionado (`design/` está no `.gitignore`). Cores,
tipografia e medidas foram extraídos das imagens para os design tokens descritos acima.
