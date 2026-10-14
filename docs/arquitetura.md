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
(barra superior, faixa de ferramentas, painel do projeto, faixa de abas, editor e barra de status) é montada uma vez e não recarrega entre
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

### Painel do Git

O indicador `master` da barra de ferramentas e o ícone Commit da faixa abrem o **painel do Git**,
com o histórico real do repositório ([ADR-0013](adr/0013-historico-do-git-gerado-no-build.md)).

- **Histórico gerado no build.** `scripts/gerar-historico-do-git.mjs` roda nos scripts `pre*`
  (junto do de informações do build), lê o `git log` com `execFileSync` (sem shell) e grava
  `public/git/historico.json`, que está no `.gitignore`. Cada commit tem SHA, pais, nome do autor,
  data, assunto e, nos merges de PR, o número e a branch. **Não há e-mails** no arquivo, e não há
  token nem chamada à API do GitHub. Sem `git`, sem repositório ou em clone raso, o script grava a
  lista vazia e nunca falha o build.
- **Nome do autor unificado.** O `.mailmap` da raiz junta as grafias do nome (`%aN`, o nome já
  passado pelo `.mailmap`), então o painel mostra uma só.
- **Histórico completo no CI.** Os jobs que fazem build (`build-e2e`, `deploy-preview` e
  `deploy-producao`) usam `fetch-depth: 0` no checkout; com o checkout raso, o histórico sairia
  vazio.
- **`core/git/`.** `historico.ts` tem os tipos (`CommitDoHistorico`, `HistoricoDoGit`);
  `ler-historico.ts` valida o JSON no limite do sistema (`lerHistorico` devolve `null` se o formato
  estiver errado) e monta os endereços do commit e do PR; `faixas.ts` tem `calcularFaixas`.
- **Faixas do grafo no navegador.** `calcularFaixas` é uma função pura: cada commit ocupa uma
  coluna, o primeiro pai herda a coluna e os outros pais abrem colunas novas, que fecham quando o
  pai é alcançado. Ela roda no navegador, e não no script, para ser testada com o Vitest e manter o
  script simples. O painel desenha o resultado em SVG (`layout/painel-do-git/grafo.ts`), com as
  cores `--cor-grafo-1` a `--cor-grafo-6`.
- **Carregamento sob demanda.** O serviço `PainelDoGit` (`core/painel-do-git.ts`) guarda se o painel
  está aberto, o estado do histórico (`ocioso`, `carregando`, `pronto` ou `erro`) e o JSON. O
  arquivo só é baixado na **primeira abertura**, nunca no servidor nem no carregamento inicial, e
  fica guardado no serviço. O painel não é pré-renderizado aberto, então as datas relativas só são
  calculadas no navegador.

### Gaveta no celular

Abaixo de 768px o painel do projeto vira uma **gaveta**. O botão Projeto da barra superior
(`aria-expanded` e `aria-controls`) a abre e leva o foco ao primeiro item; Escape, o botão "Fechar
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

`color-scheme: dark` (controles e barras de rolagem nativos escuros), `theme-color` (a barra do navegador no
celular, na cor da barra do design), números tabulares nos números de linha e na posição do cursor
e `translate="no"` no código, para o tradutor automático não mexer no Java exibido.

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

## SEO e compartilhamento

O portfólio é divulgado no LinkedIn, e o link precisa aparecer com imagem e resumo. Como o
LinkedIn e os buscadores **não executam JavaScript**, tudo isto é escrito durante a
pré-renderização e já está no HTML de cada rota.

- **Serviço `Seo`** (`core/seo.ts`, `@Service`): a cada `NavigationEnd` atualiza, com `Meta` e
  `DOCUMENT` (sem `window`, por isso funciona no servidor), a `description`, o
  `link[rel=canonical]`, as tags Open Graph (`og:*`) e as do Twitter/X (`twitter:*`). O título vem de
  `EstrategiaDeTitulo.tituloDaJanela`, o mesmo cálculo que grava o título da janela.
- **Domínio:** a constante `URL_DO_SITE` é o único lugar a trocar quando o site ganhar domínio próprio.
- **Descrições:** cada `Secao` (`core/secoes.ts`) tem um campo `descricao` em pt-BR, de até 160
  caracteres. As páginas internas (`/skills/2`) usam a da seção, e o Início usa
  `DESCRICAO_DO_INICIO`.
- **JSON-LD:** o `<script type="application/ld+json">` com o `Person` (nome, cargo, LinkedIn, GitHub
  e stack) existe só no Início e é removido nas outras rotas.
- **Imagem de compartilhamento:** `public/compartilhamento/portfolio.png`, 1200x630, versionada e
  gerada por `scripts/gerar-imagem-de-compartilhamento.mjs` (Playwright, com movimento reduzido).
- **Sitemap e robots:** `scripts/gerar-sitemap.mjs` roda no script `build`, depois do `ng build`,
  percorre os `index.html` pré-renderizados em `dist/` e escreve o `sitemap.xml`, então ele
  acompanha as rotas sozinho. O `public/robots.txt` é estático e aponta para o sitemap.

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
