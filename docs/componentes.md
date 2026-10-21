# Componentes

Inventário dos componentes que montam a IDE e o guia para criar uma seção nova. Os nomes abaixo
existem no código; os caminhos são relativos a `src/app/`.

Todas as seções seguem o mesmo esqueleto: muda só o conteúdo do editor e o item selecionado da
árvore. Por isso o conteúdo é **dado tipado**, e não um componente por seção.

## Inventário das telas

| Elemento da tela                                             | Telas            | Componente                        | Pasta                          |
| ------------------------------------------------------------ | ---------------- | --------------------------------- | ------------------------------ |
| Barra de ferramentas do design (ícones, branch, Buscar)      | todas            | `BarraDeFerramentas`              | `layout/barra-de-ferramentas/` |
| Faixa de ferramentas à esquerda (Projeto, Commit, Estrutura) | desktop (nossa)  | `FaixaDeFerramentas`              | `layout/faixa-de-ferramentas/` |
| Página do repositório (estilo do GitHub, numa aba)           | (nossa)          | `Repositorio`                     | `features/repositorio/`        |
| Abertura com Run (splash, ▶, build e log do Spring)          | (nossa)          | `Abertura`                        | `layout/abertura/`             |
| Próximo arquivo e code vision                                | (nossos)         | `ProximoArquivo`, `VisaoDeCodigo` | `shared/`                      |
| Janela de Run (log de inicialização do Spring)               | (nosso)          | `JanelaDeRunComponente`           | `layout/janela-de-run/`        |
| Painel do projeto (cabeçalho "Projeto", árvore, rodapé)      | todas            | `PainelLateral`                   | `layout/painel-lateral/`       |
| Árvore de seções com ícones                                  | todas            | `ArvoreDeSecoes`                  | `layout/arvore-de-secoes/`     |
| Faixa de abas dos arquivos abertos                           | todas (nossa)    | `FaixaDeAbas`                     | `layout/faixa-de-abas/`        |
| Barra de status no rodapé                                    | (nossa)          | `BarraDeStatus`                   | `layout/barra-de-status/`      |
| Busca de seções (Ctrl/Cmd+P)                                 | (nossa)          | `BuscaDeSecoes`                   | `layout/busca-de-secoes/`      |
| Casca (junta tudo e hospeda as rotas)                        | todas            | `Casca`                           | `layout/casca/`                |
| Editor com numeração e sintaxe                               | todas            | `EditorDeCodigo`                  | `shared/editor-de-codigo/`     |
| Bloco de comentário com `*`                                  | 02-04, 07-18, 29 | parte do `EditorDeCodigo`         | `shared/editor-de-codigo/`     |
| Ícones (arquivo, pasta, ferramenta, IA...)                   | todas            | `Icone`                           | `shared/icone/`                |
| "×" fino                                                     | todas            | `GlifoFechar`                     | `shared/glifo-fechar/`         |
| Início                                                       | 01               | `Inicio`                          | `features/inicio/`             |
| Sobre Mim                                                    | 02               | `SobreMim`                        | `features/sobre-mim/`          |
| Diferenciais                                                 | 03               | `Diferenciais`                    | `features/diferenciais/`       |
| Como uso a IA                                                | 04               | `ComoUsoIa`                       | `features/como-uso-ia/`        |
| Skills / STACK (com os níveis de conhecimento)               | 05, 06 e níveis  | `Skills`                          | `features/skills/`             |
| Experiências                                                 | 07-09            | `Experiencias`                    | `features/experiencias/`       |
| Eventos                                                      | 22               | `Eventos`                         | `features/eventos/`            |
| Projeto 1: cases da Memora                                   | 16-18            | `Projeto1`                        | `features/projeto-1/`          |
| Projeto 2: este portfólio, um estudo com IA                  | (nosso)          | `Projeto2`                        | `features/projeto-2/`          |
| Projeto 3: launcher de TV para Android 4.4                   | (nosso)          | `Projeto3`                        | `features/projeto-3/`          |
| Projeto 4: Ana, agente de IA no WhatsApp                     | 10               | `Projeto4`                        | `features/projeto-4/`          |
| Projeto 5: landing page da Dra. Juliana (com preview)        | 11-13            | `Projeto5`                        | `features/projeto-5/`          |
| Projeto 6: landing page da Watts Company (com preview)       | 14, 15           | `Projeto6`                        | `features/projeto-6/`          |
| Certificações (9 cursos)                                     | (nossa)          | `Certificacoes`                   | `features/certificacoes/`      |
| Formação                                                     | 28               | `Formacao`                        | `features/formacao/`           |
| Idiomas                                                      | 28               | `Idiomas`                         | `features/idiomas/`            |
| Contato (links com cara de link e Copiar e-mail)             | 30               | `Contato`                         | `features/contato/`            |
| Seção sem conteúdo ainda                                     | 10-21, 23-27, 29 | `SecaoEmConstrucao`               | `shared/secao-em-construcao/`  |
| Janela de preview de site                                    | 11-15            | `JanelaDePreviewComponente`       | `shared/janela-de-preview/`    |
| ▶ Executar na calha (abre o preview)                         | (nosso)          | `BotaoExecutar`                   | `shared/botao-executar/`       |

O design é **referência de identidade visual** ([ADR-0010](adr/0010-design-como-referencia-e-java-moderno.md)).
Por isso o site tem o que as telas, estáticas, não mostram: a faixa de abas, a barra de status, a
busca, a digitação do código, o botão "Seções" e a gaveta do celular. As linhas marcadas como
"nossa" não existem no design.

## Layout (`layout/`)

### `Casca`

- **Onde:** `layout/casca/casca.ts`, seletor `app-casca`.
- **O que faz:** é a rota-pai de todas as páginas. Monta a barra superior, a faixa de ferramentas, o painel do projeto,
  a `FaixaDeAbas` com o botão de busca, o `<router-outlet>` dentro do `<main>`, a `BarraDeStatus`
  e a `BuscaDeSecoes`. A casca **ocupa a janela inteira** (`100dvh`, sem rolagem da página): só a
  área do editor rola, e cada navegação volta ao topo. O atalho Ctrl/Cmd+P (`keydown.control.p` e
  `keydown.meta.p` no `host`) abre a busca com `preventDefault`. Contém o `h1` visualmente oculto, com o título
  da rota (vem da `EstrategiaDeTitulo`). No desktop, o botão Projeto da faixa de ferramentas
  mostra e esconde o painel do projeto. Abaixo de 768px controla a gaveta: abre pelo botão
  Projeto da barra superior (`aria-expanded`, `aria-controls`), move o foco para o primeiro item e,
  com Escape ou ao escolher uma seção, fecha e devolve o foco ao botão.
- **Entradas e saídas:** nenhuma. Quem a usa é o roteador (`app.routes.ts`).
- **Estado:** `gavetaAberta` (celular) e `painelVisivel` (desktop), ambos signals. O painel recebe
  `data-aberta`, que o CSS usa para animar, e a área do editor recebe `data-painel`.

### `PainelLateral`

- **Onde:** `layout/painel-lateral/painel-lateral.ts`, seletor `app-painel-lateral`.
- **O que faz:** moldura da árvore: cabeçalho `Portfolio_Vinicius` do design, com os controles de janela
  (decorativo, `aria-hidden`), a `ArvoreDeSecoes` e o
  rodapé com a barra de rolagem decorativa. No celular mostra o botão "Fechar seções"; a gaveta abre pelo botão **Seções** da barra (ícone com o
  rótulo visível) e com as **pastas já abertas**, para o visitante ver os arquivos de cara.
- **Saídas:** `secaoEscolhida` (repassa a escolha da árvore) e `fecharGaveta` (botão "Fechar
  seções"). Método público: `focarPrimeiroItem()`.

```html
<app-painel-lateral (secaoEscolhida)="fechar()" (fecharGaveta)="fechar()" />
```

### `ArvoreDeSecoes`

- **Onde:** `layout/arvore-de-secoes/arvore-de-secoes.ts`, seletor `app-arvore-de-secoes`.
- **O que faz:** gera a navegação (`<nav aria-label="Seções do portfólio">`) em **pastas** (pacotes
  Java) a partir de `SECOES` e do campo `pacote`: `sobre`, `skills`, `experiencias`, `projetos`,
  `formacao`, `recomendacoes` e `contato`, com o ícone de pacote, em minúsculas. Cada seção é um
  arquivo `.java` (campo `arquivo`, ícone de Java, sem seta) com `routerLink`; o arquivo da rota
  ativa recebe a classe `atual` e `aria-current="page"`, e a sua pasta abre ao navegar. Segue o
  padrão ARIA de **tree view** (`role="tree"`, `treeitem`, `aria-expanded`, `aria-level`) com
  **roving tabindex**: só um item fica na ordem de Tab (o arquivo atual ou o último focado). Setas
  para cima e para baixo, Home e End movem o foco; Direita expande a pasta (ou vai ao primeiro
  arquivo), Esquerda recolhe (ou volta à pasta); Enter e Espaço alternam a pasta. Ao expandir, os
  arquivos entram com `opacity` e `transform` (`--duracao-rapida`); com `prefers-reduced-motion`,
  sem movimento.
- **Entrada:** `noInicio = input(false)`: no Início `SobreMim.java` aparece destacado e a pasta `sobre`
  expandida, sem `aria-current`.
- **Saídas:** `secaoEscolhida`, emitida a cada clique em um item. Método público:
  `focarPrimeiroItem()`.

### `BarraDeFerramentas`

- **Onde:** `layout/barra-de-ferramentas/barra-de-ferramentas.ts`, seletor
  `app-barra-de-ferramentas`.
- **O que faz:** a barra de ferramentas do design, mas **sem o degradê**: usa a cor do painel,
  escura no tema escuro e clara no tema claro. Foi um desvio pedido pelo Vinicius: a faixa clara destoava do resto da interface
  ([ADR-0012](adr/0012-design-original-com-elementos-do-intellij.md)). Usa os **ícones do design**
  (`public/icones/*.svg`) e os controles de janela do design. Dos ícones da IntelliJ Platform ficam
  só a **busca** e a **branch** `master`. Quase tudo só imita a IDE e fica fora da leitura e do
  foco. É botão de verdade o **Buscar** (emite `buscar`, que abre a busca de seções) e, no celular,
  o **Projeto**, que abre e fecha a gaveta. O **Executar** (play) sempre tem função: nas rotas com preview
  (`JanelaDePreview.previewDaRota()`) abre o site do projeto ("Executar o projeto"); nas demais
  abre a janela de Run e reinicia o log ("Executar PortfolioApplication"). O foco é um anel rosa.
- **Entrada e saídas:** `gavetaAberta = input(false)`; `alternarGaveta` e `buscar`. Método
  público: `focarProjeto()`, usado para devolver o foco quando a gaveta fecha.
- **Botão de tema:** à direita do Buscar, troca entre o tema claro e o escuro (ícone de sol no
  escuro e de lua no claro, desenhados no padrão dos ícones do design). Tem `aria-label` "Usar tema
  claro" ou "Usar tema escuro" e `aria-pressed` no claro; chama `Tema.alternar()`, que troca com um crossfade curto (View Transition) quando o navegador e o movimento reduzido permitem. Não existe no
  design nem no IntelliJ (desvio do [ADR-0014](adr/0014-tema-claro.md)).
- **Branch `master`:** é um botão de verdade que abre a aba da página do repositório
  (`/repositorio`, [ADR-0016](adr/0016-repositorio-no-estilo-do-github.md)).
- **Ícones decorativos** (os que só imitam a IDE) ficam mais apagados (opacidade 0,55) e sem efeito
  de hover, para não parecerem clicáveis.
- **Celular:** a barra fica compacta e escura, com Projeto (ícone) e Buscar.

### `FaixaDeFerramentas`

- **Onde:** `layout/faixa-de-ferramentas/faixa-de-ferramentas.ts`, seletor
  `app-faixa-de-ferramentas`.
- **O que faz:** a faixa de 40px à esquerda, só no desktop. **Projeto** mostra e esconde o painel
  do projeto; **Commit** abre a aba do repositório; **Estrutura** só imita a
  IDE (fora da leitura e do foco).
- **Entrada e saída:** `painelVisivel = input.required<boolean>()` e `alternarPainel`.

### `Repositorio` (página do repositório)

- **Onde:** `features/repositorio/repositorio.ts`, rota `/repositorio` (`loadComponent`), com a aba
  `Portfolio-Vinicius-Machado`, fora da árvore de seções. Substituiu o painel do Git
  ([ADR-0016](adr/0016-repositorio-no-estilo-do-github.md)); o `master` da barra e o Commit da faixa
  abrem essa aba.
- **O que faz:** uma página no estilo de um repositório do GitHub, dentro da IDE e nos dois temas,
  em uma coluna de até ~960 px. Cabeçalho com o nome, o selo "Público", uma frase que explica o que
  o repositório mostra e o botão "Ver no GitHub" (nova aba); os números (commits, pull requests
  mesclados, desde quando, último deploy); **"Como o trabalho se divide"**, uma barra com a
  proporção de commits por tipo, com legenda em texto e porcentagem (nunca só cor). A barra mostra
  os tipos com **3% ou mais dos commits, por frequência** (hoje `docs`, `feat`, `test`, `fix`,
  `refactor` e `chore`) e, no fim, um segmento **listrado "outros"** que reúne os tipos abaixo de 3%
  e os commits sem tipo; a legenda diz quais entram nele (`agrupar-tipos.ts`); os **últimos pull requests** (título, número, branch, data e link); os
  **últimos commits de código**, sem os de marcar tarefas; e "Ver todo o histórico no GitHub →".
- **Dados.** O serviço `HistoricoDoRepositorio` (`core/repositorio.ts`) baixa
  `git/historico.json` na primeira vez que a página pede (nunca no servidor nem no carregamento
  inicial) e guarda o resultado; estados `ocioso`, `carregando`, `pronto` e `erro` (com "Tentar de
  novo"). O resumo (contagem por tipo, últimos PRs e commits) vem de funções puras calculadas no
  navegador. A geração do JSON é a do [ADR-0013](adr/0013-historico-do-git-gerado-no-build.md), que
  agora guarda também o título de cada PR.
- **Entradas e saídas:** nenhuma.

### `Abertura`

- **Onde:** `layout/abertura/`, montada na `Casca`, com o serviço `core/abertura.ts`
  ([ADR-0017](adr/0017-abertura-com-run.md), que substituiu a `TelaDeBoasVindas` do ADR-0015).
- **O que faz:** a abertura do site como a IDE rodando o projeto, em fases: o **cartão da splash**
  (foto, nome, cargo, "Seja bem-vindo ao meu portfólio" e as etapas "Opening Portfolio_Vinicius…" até
  "Project ready", 3 s); o **widget de Run** do IntelliJ (`PortfolioApplication ▾`, ▶ verde, debug
  apagado) com o foco no ▶; a **janela Build/Run**, que compila as classes reais (uma por seção, hoje 17) e mostra o log
  do Spring; e a **entrada da IDE**, em que a janela recolhe para a barra de status e os painéis
  aparecem em sequência. A linha do tempo completa está em
  [arquitetura](arquitetura.md#abertura-com-run).
- **Executar.** Enter, clique no ▶ ou o atalho (⌃R no Mac, ⇧F10 nos demais, em `aria-keyshortcuts`)
  executam; se ninguém executar, o ▶ é acionado sozinho 5 s depois de pronto. **Não há Pular**:
  nem botão nem Esc (Esc não faz nada).
- **Quando aparece.** Só em `/` e uma vez por sessão (`sessionStorage['abertura-exibida']`; um script inline em `index.html` liga `data-abertura` no `<html>`). Em link direto de uma seção, não aparece, e a
  barra de status mostra só `PortfolioApplication started in 1.8 s`.
- **Log compartilhado.** O texto do log do Spring vem de `core/log-do-spring.ts`, o mesmo que a janela
  de Run usa; a linha do tempo e a lista de classes (derivada de `core/secoes.ts`) ficam em
  `core/linha-do-tempo-da-abertura.ts`. O componente é `layout/abertura/abertura.ts`, com os estilos
  separados em `abertura.scss`, `widget-de-run.scss` e `janela-de-build.scss`; os tokens de movimento
  (`--duracao-entrada-abertura`, `--duracao-reduzida-abertura`…) e de cor (`--cor-fundo-abertura`,
  `--sombra-abertura`) estão nos arquivos de tokens.
- **Acessibilidade e movimento.** `role="dialog"` modal com o resto da casca `inert`; o foco vai ao ▶ e
  depois ao editor; uma região `aria-live` anuncia só os marcos. Com `prefers-reduced-motion`, as
  mesmas etapas sem animação.

### `FaixaDeAbas`

- **Onde:** `layout/faixa-de-abas/faixa-de-abas.ts`, seletor `app-faixa-de-abas`.
- **O que faz:** uma aba por arquivo aberto (`SobreMim.java`, `Skills.java`...), no padrão
  `tablist` do WAI-ARIA: `role="tablist"` com `aria-label="Arquivos abertos"`, abas com
  `aria-selected` e roving tabindex. Setas e Home/End movem o foco, Enter e Espaço abrem e Delete
  fecha. Os botões de fechar ficam **fora do `tablist`** (que só pode ter abas), cada um sobre a
  ponta da sua aba, com `aria-label` "Fechar `<arquivo>`". A aba ativa é levada à área visível
  (sem animar com movimento reduzido). O estado vem do serviço `AbasAbertas`. Há no **máximo 5 abas** (`LIMITE_DE_ABAS`): abrir a sexta
  fecha a menos usada recentemente, nunca a ativa, como o "Tab limit" do IntelliJ. A aba do Início
  se chama `PortfolioApplication.java` e a do repositório, `Portfolio-Vinicius-Machado`.
- **Entradas e saídas:** nenhuma.

### `BarraDeStatus`

- **Onde:** `layout/barra-de-status/barra-de-status.ts`, seletor `app-barra-de-status`.
- **O que faz:** a barra de status (24px), nas cores do design. À esquerda, os **breadcrumbs** do arquivo
  aberto (`portfolio-vinicius › src › main › java › … › Skills.java`, calculados por
  `core/breadcrumbs.ts`; o trecho do meio encolhe com reticências quando falta espaço). À direita,
  `linha:coluna` (do `EstadoDoEditor`, que conta a **linha visual**, já que o Javadoc ocupa várias
  linhas), `LF`, `UTF-8`, `4 spaces`, a branch `master` e o **SHA curto do commit do deploy**, com
  link para o commit no GitHub. Sem SHA (build local), o item não aparece.
- **Leitura por tecnologias assistivas:** é um `<footer role="status">`, mas só o nome do arquivo é
  lido; o caminho e a posição, que muda a cada clique, ficam em `aria-hidden`.
- **No celular:** só o arquivo e `linha:coluna`.
- **Entradas e saídas:** nenhuma.

### `BuscaDeSecoes`

- **Onde:** `layout/busca-de-secoes/busca-de-secoes.ts`, seletor `app-busca-de-secoes`.
- **O que faz:** busca no estilo "Go to File". Um `<dialog>` modal com um **combobox** WAI-ARIA
  (`role="combobox"`, `aria-activedescendant`, lista `role="listbox"` e contagem em `role="status"`).
  Ctrl/Cmd+P ou o botão da faixa de abas chamam `abrir()`. O filtro é **sem acento e sem
  diferença de maiúsculas** (`normalize('NFD')`): "exp" encontra `Experiencias.java`. Setas movem
  a opção ativa, Enter abre a seção, Escape ou o clique fora fecham, e o foco volta para onde
  estava.
- **Método público:** `abrir()`.

```html
<app-busca-de-secoes />
```

## Compartilhados (`shared/`)

### `EditorDeCodigo`

- **Onde:** `shared/editor-de-codigo/editor-de-codigo.ts`, seletor `app-editor-de-codigo`.
- **O que faz:** desenha um `ConteudoDoEditor` como código: coluna de números, recuo, cores de
  sintaxe e parágrafos em bloco de comentário. A coluna de números tem 99 linhas e é recortada
  pela altura da área (mínimo de 15 linhas), então cresce com o conteúdo sem medir o DOM, o que
  mantém a pré-renderização compatível. A coluna é `aria-hidden`.
- **Digitação, cursor e linha atual:** na primeira abertura de cada página o código aparece
  "digitado", com um cursor que pisca no fim da linha atual (a linha destacada). É **só visual**: o
  texto completo fica sempre no DOM e a digitação é uma máscara de CSS (`clip-path`, controlada por
  `--digitado`), então leitores de tela e o HTML pré-renderizado recebem o código inteiro. Dura no
  máximo 1,5 s e qualquer clique ou tecla a completa. Com `prefers-reduced-motion: reduce` o código
  aparece pronto e o cursor não pisca. As páginas já vistas (`HistoricoDeDigitacao`, só em memória)
  não digitam de novo. Clicar numa linha a torna a atual e informa a posição ao `EstadoDoEditor`.
- **Links:** um trecho com `href` vira `<a>` com a cor do papel. Links externos abrem em nova aba
  com `rel="noopener noreferrer"`.
- **Modo de leitura do Javadoc.** Ligado por padrão, mostra o Javadoc como texto formatado, a
  "Rendered View" do IntelliJ: Inter 14 px, largura de até 65 caracteres, fundo próprio
  (`--cor-javadoc-renderizado`, nos dois temas) e sem a coluna de `*` nem o `/**` e o `*/`. Um botão
  de livro na calha (`aria-pressed`) alterna para o comentário cru; a escolha vale para o site todo
  e fica no `sessionStorage` (serviço `ModoDeLeitura`). Retrato e `@author` continuam, a digitação
  revela o bloco de uma vez e o texto copiado é o mesmo nos dois modos.
- **Quebra suave no celular.** Abaixo de 768px as linhas longas quebram (`white-space: pre-wrap`),
  com recuo pendurado e a numeração alinhada à primeira linha visual, em vez de cortar o texto à
  direita.
- **Code vision e Próximo arquivo.** O editor renderiza o `VisaoDeCodigo` acima da classe executável
  (sem número de linha) e o `ProximoArquivo` no fim do conteúdo.
- **Entrada:** `conteudo = input.required<ConteudoDoEditor>()`.

```html
<app-editor-de-codigo [conteudo]="conteudo" />
```

### `VisaoDeCodigo` (code vision)

- **Onde:** `shared/visao-de-codigo/visao-de-codigo.ts`, seletor `app-visao-de-codigo`.
- **O que faz:** a linha de _code vision_ do IntelliJ acima da declaração da classe, só nos projetos
  com site: o botão `▶ Executar · Ver o site ao vivo`, menor e em cinza. Abre a janela de preview,
  com o mesmo efeito do ▶ da calha, para o visitante achar o site sem procurar. Nos projetos que não
  têm site para a janela mas têm um endereço externo, ele vira um **link** (nova aba, com o aviso
  "abre em nova aba" para leitores de tela): hoje o Projeto 2 e o Projeto 3, `▶ Executar · Ver no GitHub`,
  definido em `LINKS_EXTERNOS_DE_PROJETO` (`core/previews.ts`).

### `ProximoArquivo`

- **Onde:** `shared/proximo-arquivo/proximo-arquivo.ts`, seletor `app-proximo-arquivo`.
- **O que faz:** um comentário clicável no fim de cada seção, `// Próximo: Diferenciais.java →`, que
  leva ao arquivo seguinte na ordem da árvore, para seguir lendo sem voltar a ela. A seção seguinte
  vem de `core/proxima-secao.ts`. Não aparece no Início (que tem os atalhos `// Próximo: ver os
projetos →` e `// Fale comigo →`) nem na última seção.

### `Icone`

- **Onde:** `shared/icone/icone.ts`, seletor `app-icone`.
- **O que faz:** mostra um SVG decorativo com `NgOptimizedImage` e `alt=""` (o nome ao lado já é o
  rótulo). Há dois conjuntos, e o prefixo do nome diz de qual:
  - **Ícones do design** (`design-pasta`, `design-arquivo`, `design-projeto`, `design-executar`,
    `design-ferramenta`, `design-ia`, `design-globo`, `design-relogio`, `design-monitor`,
    `design-sol`, `design-lua`), de
    `public/icones/*.svg`, usados na árvore, nas abas e na barra de ferramentas.
  - **Ícones da IntelliJ Platform** (`projeto`, `commit`, `estrutura`, `ramo`, `executar`,
    `buscar`), de `public/icones/new-ui/`, só onde o design não tem equivalente: o ▶ da calha, a
    branch, a busca e a faixa de ferramentas. Têm licença Apache 2.0, com créditos em
    [`CREDITOS.md`](../public/icones/new-ui/CREDITOS.md); nenhum logotipo de produto da JetBrains
    é usado.
- **Tema:** os ícones do design servem nos dois temas. Os da IntelliJ Platform têm duas variantes,
  a escura (`_dark`) e a clara (`claro/`), e o componente renderiza as duas `<img>`: os tokens
  `--exibir-icone-escuro` e `--exibir-icone-claro` mostram a do tema ativo, sem JavaScript.
- **Entrada:** `nome = input.required<NomeDoIcone>()`; `NOMES_DE_ICONE` lista os nomes válidos. O
  tamanho vem do token `--tamanho-icone`.

```html
<app-icone nome="design-pasta" />
```

### `GlifoFechar`

- **Onde:** `shared/glifo-fechar/glifo-fechar.ts`, seletor `app-glifo-fechar`.
- **O que faz:** o "×" fino, em SVG, decorativo. Herda a cor do texto; o tamanho vem do
  token `--tamanho-glifo`.
- **Entradas e saídas:** nenhuma.

### `JanelaDePreviewComponente`

- **Onde:** `shared/janela-de-preview/janela-de-preview.ts`, seletor `app-janela-de-preview`,
  montada uma vez na `Casca`.
- **O que faz:** janela no estilo da IDE, sobre a casca, que mostra o site de um projeto. É um
  `<dialog>` modal: o foco fica preso dentro dela e Escape fecha (o `cancel` passa pela animação de
  saída). A barra de título tem o nome do projeto, dois controles decorativos e o "×" funcional.
- **Captura primeiro, ao vivo sob demanda.** A janela abre com a **captura** do site (uma imagem
  rolável, com `NgOptimizedImage`). O botão **"Ver ao vivo"** troca a captura por um `<iframe>` do
  site real; **"Ver captura"** volta. O iframe só é criado a pedido do visitante, para não
  carregar site de terceiros sem ele querer, com `sandbox="allow-scripts allow-same-origin
allow-popups allow-forms"`, `referrerpolicy="no-referrer"`, `loading="lazy"` e `title`.
  **"Abrir em nova aba"** é um link com `rel="noopener noreferrer"`.
- **Foco e animação.** Ao fechar, o foco volta ao elemento que abriu a janela. A abertura e o
  fechamento animam `transform` e `opacity` (`data-estado`: `aberto` e `fechando`), com um teto de
  300 ms para fechar mesmo se `animationend` não vier (aba oculta). Com `prefers-reduced-motion:
reduce` não há animação e a janela fecha direto.
- **Celular.** Abaixo de 768px a janela ocupa a tela inteira (`100dvh`, sem borda); no desktop
  ocupa 70% da largura e 88% da altura.
- **Entradas e saídas:** nenhuma; o estado vem do serviço `JanelaDePreview`.

### `JanelaDeRunComponente`

- **Onde:** `layout/janela-de-run/janela-de-run.ts`, seletor `app-janela-de-run`, montado na `Casca`
  com `id="janela-de-run"`.
- **O que faz:** a janela de Run na parte de baixo da IDE, sozinha nessa área (o Git virou a página do
  repositório). Mostra o **log de inicialização** do `PortfolioApplication`: o banner do Spring
  Boot, `Starting PortfolioApplication using Java 21`, `Tomcat started on port 8080` e `Started
PortfolioApplication in 1.8 seconds`. O texto vem de `core/log-do-spring.ts`, o mesmo da abertura; a data e a hora vêm
  do relógio do navegador, na abertura, e nunca entram no pré-render. O log é texto, nunca imagem.
- **Revelação do log.** O banner aparece de uma vez e as demais linhas uma a cada ~200 ms, com teto
  de **2,5 s** para o log completo. O texto completo fica sempre no DOM; as linhas ainda não
  reveladas só ficam escondidas. **Pular** completa na hora. Uma região `aria-live="polite"` anuncia
  a linha final uma vez, quando o log termina.
- **Quando abre.** **Só pelo Executar** da barra: abre (ou reexecuta o log) e leva o foco para a
  janela. Ela **não abre mais sozinha** na primeira visita: a abertura agora é a
  [abertura com Run](adr/0017-abertura-com-run.md). Com `prefers-reduced-motion: reduce` o log
  nasce completo.
- **Teclado.** Esc, o "×" e o foco devolvido ao botão que abriu fecham a janela.
- **Entradas e saídas:** nenhuma; o estado vem do serviço `JanelaDeRun`.

### `BotaoExecutar`

- **Onde:** `shared/botao-executar/botao-executar.ts`, seletor `app-botao-executar`. O
  `EditorDeCodigo` o renderiza dentro da linha marcada como executável.
- **O que faz:** o **▶ na calha** do editor, à esquerda dos números e na linha da declaração
  `public class`, como no IntelliJ: abre o site do projeto na janela de preview. Só aparece nas
  rotas com preview; é um botão de verdade, com o nome da seção (`Executar Projeto 2`) e foco
  visível. Ele substituiu o botão "Executar" que ficava sobre o código.
- **Como marcar a linha:** `linhaExecutavel(recuo, ...trechos)` (em `conteudo.ts`) cria uma
  `LinhaDeCodigo` com `executavel: true`. O editor reserva a calha (`com-calha`) só quando alguma
  linha é executável.

### `SecaoEmConstrucao`

- **Onde:** `shared/secao-em-construcao/secao-em-construcao.ts`, seletor
  `app-secao-em-construcao`.
- **O que faz:** mostra a classe `EmConstrucao` com um comentário de aviso. É a página de toda
  rota de `SECOES` que ainda não tem feature própria.
- **Entradas e saídas:** nenhuma.

## Serviços da IDE (`core/`)

O estado da IDE mora em serviços (`@Service`), e não nos componentes da casca.

- **`AbasAbertas`** (`core/abas-abertas.ts`): a lista de abas (`abas`, signal somente leitura) e a
  aba ativa (`ativa`). A aba da rota atual abre a cada navegação (`abrir(slug)`); `fechar(slug)`
  ativa a vizinha (à direita, senão à esquerda) ou volta ao Início. A lista é guardada em
  `sessionStorage` (com `try/catch`) e **restaurada só no navegador, depois da hidratação**. No
  servidor existe apenas a aba da rota atual, para o HTML pré-renderizado e a hidratação
  coincidirem.
- **`EstadoDoEditor`** (`core/estado-do-editor.ts`): os signals `linha` e `coluna` (base 1). O
  `EditorDeCodigo` escreve (`posicionar`, `reiniciar`) e a `BarraDeStatus` lê.
- **`Secao.arquivo`** (`core/secoes.ts`): o nome do arquivo `.java` de cada seção
  (`SobreMim.java`), usado pela aba, pela barra de status e pela busca. O Início tem
  `ARQUIVO_INICIO` (`PortfolioApplication.java`).
- **`JanelaDeRun`** (`core/janela-de-run.ts`): o estado da janela de Run (`aberto`, `execucao`,
  `inicio`, `terminado`, `focarAoAbrir`). `executar(origem)` abre ou reinicia o log,
  `concluir()` marca o fim da revelação (ou o "Pular") e `fechar()` devolve o foco à origem.
- **`JanelaDePreview`** (`core/janela-de-preview.ts`): guarda o preview aberto (`preview`, signal
  somente leitura), o elemento que abriu a janela e o preview da rota atual (`previewDaRota`, calculado
  a partir da URL). `abrir(preview, origem)` abre; `fechar()` fecha e devolve o foco à origem.
  O componente da janela, o ▶ da calha (`BotaoExecutar`) e o play da barra de ferramentas usam este serviço.
- **`breadcrumbs`** (`core/breadcrumbs.ts`): função pura que devolve os segmentos do caminho de um
  arquivo, do projeto até o `.java` (`portfolio-vinicius › src › main › java › dev › vinicius ›
portfolio › <pacote> › <Arquivo>`). Usa o campo `pacote` de cada `Secao` (`sobre`, `skills`,
  `experiencias`, `projetos`, `formacao`, `recomendacoes` ou `contato`, conforme o ADR-0011, mantido pelo ADR-0012); o
  Início não tem pacote e fica na raiz. Truncar os segmentos do meio é com quem desenha a barra.
- **`PREVIEWS`** (`core/previews.ts`): o registro `slug -> PreviewDeProjeto` (`titulo`, `url` e
  `captura` com `src`, `largura`, `altura` e `alt`). Só os projetos que estão aqui mostram o
  "Executar".

### Como acrescentar o preview de um projeto novo

1. Acrescente o site em `SITES` de `scripts/capturar-previews.mjs` (`arquivo`, `url` e, se
   precisar, `css` para ajustar a captura) e gere a imagem (abaixo).
2. Registre o slug da seção em `PREVIEWS` (`core/previews.ts`) com o título, a `url` e a captura
   (`src` relativo, como `projetos/dra-juliana.jpg`, e as dimensões reais).
3. Confira nos cabeçalhos do site que ele aceita `iframe` (sem `X-Frame-Options` nem CSP
   `frame-ancestors` restritiva); se não aceitar, o "Ver ao vivo" não funcionará.

O play da barra e o ▶ da calha passam a aparecer na rota, sem mais nenhuma mudança.

### Capturas dos sites (`scripts/capturar-previews.mjs`)

O script usa o Playwright do projeto para gerar uma captura de página inteira de cada site,
em 1440px de largura, e salva um JPEG em `public/projetos/` (até 400 KB, baixando a qualidade se
precisar). Ele rola a página até o fim para carregar as imagens, fecha banners de cookies e
**emula `prefers-reduced-motion`**, porque alguns sites animam a entrada de elementos e a
captura saía sem eles (a foto da Dra. Juliana, por exemplo). Para atualizar quando um site mudar:

```bash
node scripts/capturar-previews.mjs
```

Confira as imagens antes de commitar.

## Modelo de conteúdo do editor

Fica em `shared/editor-de-codigo/conteudo.ts`. O conteúdo de uma seção é uma lista de linhas
tipadas, todas `readonly`.

| Tipo               | Forma                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `Papel`            | `'palavra-chave' \| 'declaracao' \| 'literal' \| 'valor' \| 'anotacao' \| 'comentario' \| 'comum'` |
| `Trecho`           | `{ texto, papel, href? }`: um pedaço de código com uma cor; com `href`, um link                    |
| `LinhaDeCodigo`    | `{ tipo: 'codigo', recuo, densidade?, trechos }`                                                   |
| `LinhaDeParagrafo` | `{ tipo: 'paragrafo', recuo, texto }`: texto em bloco de comentário                                |
| `LinhaDeJavadoc`   | `{ tipo: 'javadoc', recuo, texto }`: bloco Javadoc com asteriscos só visuais                       |
| `LinhaVazia`       | `{ tipo: 'vazia', densidade? }`                                                                    |
| `Densidade`        | `'compacta' \| 'apertada'`: altura da linha (sem valor, a linha normal)                            |
| `ConteudoDoEditor` | `readonly Linha[]`                                                                                 |

`recuo` é o nível de indentação (0, 1, 2...). Cada papel tem uma cor de sintaxe nos tokens:

| Papel           | Token                         | Exemplo                |
| --------------- | ----------------------------- | ---------------------- |
| `palavra-chave` | `--cor-sintaxe-palavra-chave` | `public class`         |
| `declaracao`    | `--cor-sintaxe-campo`         | `String cargo`         |
| `literal`       | `--cor-sintaxe-literal`       | `“Java”`               |
| `valor`         | `--cor-sintaxe-valor`         | `true`                 |
| `anotacao`      | `--cor-sintaxe-anotacao`      | `@Override`            |
| `comentario`    | `--cor-sintaxe-comentario`    | `// em andamento`      |
| `comum`         | `--cor-sintaxe-texto`         | pontuação e o restante |

As cores de sintaxe são as do Java no IntelliJ ([ADR-0012](adr/0012-design-original-com-elementos-do-intellij.md)):
palavra-chave `#CF8E6D`, campo `#C77DBA`, string `#6AAB73`, número e valor `#2AACB8`, anotação
`#B3AE60`. O comentário usa `#8F939A`, mais claro que o `#7A7E85` original do IntelliJ, porque este
reprovava no contraste AA. O papel `valor` é o dos literais que não são texto, como `true`.

### Construtoras

Funções curtas para o arquivo de conteúdo ficar legível:

| Função                                             | Cria                                         |
| -------------------------------------------------- | -------------------------------------------- |
| `palavraChave(texto)`                              | `Trecho` laranja (`public class`, `extends`) |
| `declaracao(texto)`                                | `Trecho` lilás (`String cargo`)              |
| `literal(texto)`                                   | `Trecho` verde (`“Java”`)                    |
| `valor(texto)`                                     | `Trecho` turquesa (`true`)                   |
| `anotacao(texto)`                                  | `Trecho` amarelo-oliva (`@Anotacao`)         |
| `comentario(texto)`                                | `Trecho` cinza de comentário (`// 2x`)       |
| `link(trecho, href)`                               | O mesmo trecho com `href` (link)             |
| `comum(texto)`                                     | `Trecho` na cor padrão do texto              |
| `linha(recuo, ...trechos)`                         | `LinhaDeCodigo`                              |
| `linhaCompacta(recuo, ...trechos)`                 | `LinhaDeCodigo` com `densidade: 'compacta'`  |
| `linhaApertada(recuo, ...trechos)`                 | `LinhaDeCodigo` com `densidade: 'apertada'`  |
| `linhaExecutavel(recuo, ...trechos)`               | `LinhaDeCodigo` com o ▶ de executar na calha |
| `paragrafo(recuo, texto)`                          | `LinhaDeParagrafo`                           |
| `javadoc(recuo, texto)`                            | `LinhaDeJavadoc`                             |
| `javadocComRetrato(recuo, texto, retrato, autor?)` | `LinhaDeJavadoc` com foto e `@author`        |
| `vazia()`                                          | `LinhaVazia`                                 |
| `vaziaCompacta()`                                  | `LinhaVazia` com `densidade: 'compacta'`     |
| `vaziaApertada()`                                  | `LinhaVazia` com `densidade: 'apertada'`     |

**Densidade das linhas.** Sem `densidade`, a linha tem a altura normal. As listas das telas
ocupam menos espaço que o número de linha, e o campo `densidade` reproduz isso:

| Densidade  | Altura da linha     | Onde aparece                                    |
| ---------- | ------------------- | ----------------------------------------------- |
| (nenhuma)  | normal              | a maior parte do código                         |
| `compacta` | 3/4 da linha normal | lista de strings da tela 01 e campos da tela 03 |
| `apertada` | 3/5 da linha normal | listas e campos das telas 04 a 06               |

As construtoras `linhaCompacta`/`linhaApertada` e `vaziaCompacta`/`vaziaApertada` são atalhos do
mesmo campo. Uma linha vazia no meio de um bloco precisa ter a densidade do bloco (por exemplo,
`vaziaApertada()` entre os arrays da tela 05), senão a numeração deixa de seguir o design. Use a
densidade só quando a tela de referência tiver esse espaçamento.

**Largura do parágrafo:** o texto de um `paragrafo` quebra em 72 colunas, como no design. O limite
vem do token `--colunas-paragrafo` (72,5, para a última coluna não quebrar por arredondamento) e é
calculado com o avanço da fonte monoespaçada, então acompanha o tamanho do texto. Não é preciso
quebrar o texto à mão: passe o parágrafo inteiro numa string.

**Javadoc.** Para textos longos, use `javadoc(recuo, texto)`: o editor desenha a abertura `/**`, a
coluna de asteriscos e o fechamento `*/` como elementos **só visuais**, e quebra o texto em 72
colunas, alinhado ao recuo da declaração que vem logo depois. O texto copiado e lido por leitores
de tela é apenas o `texto`, então o Java continua válido. Prefira `javadoc` ao `paragrafo` quando o
texto documenta uma declaração.

**Retrato no Javadoc.** `javadocComRetrato(recuo, texto, retrato, autor?)` acrescenta ao Javadoc uma
**foto redonda à esquerda do texto**, como o IntelliJ mostra uma imagem num comentário de
documentação renderizado. O código exibido não muda: o retrato é só visual.

- `retrato` é `{ src, alt, tamanho, prioridade? }`. `src` é relativo ao `base href`
  (`fotos/vinicius.webp`), `alt` descreve a foto ("Foto de Vinicius Machado") e `tamanho` é
  `'grande'` (96 px, Início e Sobre Mim) ou `'pequeno'` (64 px, recomendação); no celular são 64 e
  48 px. A imagem usa `NgOptimizedImage` com largura e altura fixas, então não desloca o layout, e
  tem borda de 1 px por token nos dois temas. `prioridade: true` só para a foto acima da dobra (a do
  Início); as demais carregam sob demanda.
- `autor` é `{ nome, href }`. Quando existe, o Javadoc termina com uma linha `@author <nome>` em que
  o nome é **link externo** (nova aba, `rel="noopener noreferrer"`, com indicação acessível).
- As fotos ficam em `public/fotos/`, em WebP, com 2x o maior tamanho exibido (192x192 para o
  Vinicius e 128x128 para a Luana), cada uma com poucos KB.

**Como acrescentar uma recomendação com foto.** Em `features/depoimentos/depoimentos.conteudo.ts`:

1. Coloque a foto, **enviada pela pessoa ou com autorização dela** (nunca baixada de um perfil), em
   WebP quadrado em `public/fotos/<nome>.webp`, com 2x o tamanho exibido (128x128 para `'pequeno'`).
2. Escreva o texto da recomendação como parágrafos e junte-os com `\n\n` num só Javadoc.
3. Use `javadocComRetrato(1, texto, { src: 'fotos/<nome>.webp', alt: 'Foto de <Nome>', tamanho:
'pequeno' }, { nome: '<Nome>', href: '<link do LinkedIn>' })` e, abaixo dele, o
   `var <nome> = new Recomendacao(...)`.
4. Se a foto ainda não existir, use `javadoc(...)` sem retrato: o `@author` só aparece com o
   retrato.

**Links.** `link(trecho, href)` transforma um trecho em link (`https://`, `mailto:` ou `tel:`). A
seção Contato usa isso com links reais: `link(literal('"viniciusmassuncao@gmail.com"'),
'mailto:viniciusmassuncao@gmail.com')`.

**Contato.** Os contatos parecem links: sublinhado pontilhado, ícone ↗ nos externos
(`aria-hidden`) e área de toque de pelo menos 24 px (44 px no celular, o `--tamanho-alvo-toque`), o
que também resolveu a falha `target-size` do axe. O botão **"Copiar e-mail"** usa a Clipboard API e
avisa "E-mail copiado" numa região `aria-live="polite"`; sem a API, ele não aparece.

## Regra de conteúdo: Java para leitura

O código exibido é **Java 21 sintaticamente válido**, com padrões de mercado, e **preserva todas as
informações** das telas ([ADR-0010](adr/0010-design-como-referencia-e-java-moderno.md)). O
[ADR-0011](adr/0011-identidade-visual-intellij-new-ui.md) acrescentou que ele precisa **ler-se como
frase** para quem recruta, e por isso os identificadores de domínio são **em português** (a change
`java-para-leitura`). O inglês fica só nas palavras da linguagem e do Spring (`record`, `List.of`,
`@SpringBootApplication`).

### Guia de estilo

- **Pacote por pasta.** Cada seção abre com `package dev.vinicius.portfolio.<pasta>;` (`sobre`,
  `skills`, `experiencias`, `projetos`, `formacao`, `recomendacoes` ou `contato`), o mesmo pacote
  que a árvore e os breadcrumbs mostram. A página inicial fica no pacote raiz,
  `dev.vinicius.portfolio`.
- **Domínio em português, sem acento nos identificadores.** `record Experiencia(String empresa,
String cargo, String periodo, ...)`, `record Recomendacao(String autora, ...)`. Os textos que o
  leitor vê (cargos, descrições, strings) continuam em pt-BR, com acento.
- **Sem cerimônia.** Nada de `static final` nem de constantes em caixa alta (`MY_SKILLS`,
  `LUANA_PORTO`) para dados: o dado é um campo ou uma variável com nome que diz o que é
  (`List<Evento> participei = List.of(...)`, `var luana = new Recomendacao(...)`).
- **Nomes que dizem o que fazem.** Métodos e variáveis como `participei` ou `sobreMim()` valem mais
  que um comentário.
- **Um comentário `//` curto em pt-BR por bloco**, no início (`// Eventos de tecnologia dos quais
participei`). Texto longo vai em Javadoc (`javadoc()`) ou em text block.
- **Listas de até 5 itens numa linha;** maiores, quebradas por grupos. `List.of(...)` direto, sem
  `String[]`.
- **Sem ruído técnico.** Nada de `Optional`, `URI.create` ou genéricos aninhados quando um texto
  resolve (`"08/2026 - Presente"` no lugar de `Optional<YearMonth>`). Links continuam clicáveis
  via `link()`.
- **`PortfolioApplication.java`** é a página inicial: `@SpringBootApplication` e um `main` que
  apresenta o Vinicius com `var vinicius = new Desenvolvedor(...)` e `SpringApplication.run(...)`.

Exemplo real, de `features/eventos/eventos.conteudo.ts` (a seção de referência do estilo):

```java
package dev.vinicius.portfolio.formacao;

import java.util.List;

public class Eventos {

  // Cada evento tem o nome e quantas vezes eu participei
  record Evento(String nome, int vezes) {}

  // Eventos de tecnologia dos quais participei
  List<Evento> participei = List.of(
      new Evento("Brasília IT", 1),
      new Evento("Campus Party Brasília", 2),   // 2x
      new Evento("BB Digital Week", 1));
}
```

Em TypeScript, o arquivo de conteúdo monta as linhas com as construtoras, por exemplo
`linha(1, comentario('// Eventos de tecnologia dos quais participei'))`. Os testes
`legibilidade-das-secoes.spec.ts` e os de cada seção cobrem parte das regras.

## Como criar uma seção nova só com dados

Todas as seções publicadas foram feitas assim e servem de exemplo real: o Início
(`features/inicio/`), **Sobre Mim**, **Diferenciais**, **Como uso a IA**, **Skills / STACK**,
**Experiências**, **Eventos**, **Formação**, **Idiomas** e **Contato**. As demais
seções (projetos, certificações e depoimentos) ainda mostram `SecaoEmConstrucao`. Para dar conteúdo a uma delas não é preciso criar componente de editor,
estilo nem item de árvore.

1. **Confirme a seção em `core/secoes.ts`.** A lista `SECOES` (`slug`, `titulo`, `icone`, `arquivo` e `pacote`) é a fonte única: dela saem os itens da árvore, as rotas e os títulos. Para uma seção nova, acrescente um
   item na posição em que ela deve aparecer, com o `arquivo` `.java` dela (por exemplo,
   `Eventos.java`). O `icone` precisa estar em `NOMES_DE_ICONE`.
2. **Crie o conteúdo em `features/<slug>/<slug>.conteudo.ts`**, exportando um `ConteudoDoEditor`
   montado com as construtoras, em Java moderno (veja a regra acima). Confira as informações com
   a tela e com `design/telas/textos.md`. Exemplo, de `features/sobre-mim/sobre-mim.conteudo.ts`
   (tela 02):

   ```ts
   export const CONTEUDO_SOBRE_MIM: ConteudoDoEditor = [
     vazia(),
     linha(0, palavraChave('interface'), comum(' Desenvolvedor {')),
     linha(1, palavraChave('String'), comum(' sobreMim();')),
     linha(0, comum('}')),
     vazia(),
     // ... a classe ViniciusMachado implements Desenvolvedor, com o método sobreMim()
     javadoc(1, 'Sou desenvolvedor Full Stack com cerca de 2 anos de experiência...'),
     linha(1, anotacao('@Override')),
     linha(1, palavraChave('public'), comum(' String sobreMim() {')),
     linha(
       2,
       palavraChave('return'),
       comum(' '),
       literal('"Full Stack: Java, Spring Boot, Angular e SQL"'),
       comum(';'),
     ),
     linha(1, comum('}')),
     linha(0, comum('}')),
   ];
   ```

   `features/diferenciais/diferenciais.conteudo.ts` (tela 03) mostra `valor('true')`,
   `linhaCompacta` e `vaziaCompacta()` juntos:

   ```ts
   linhaCompacta(1, declaracao('boolean curioso'), comum(' = '), valor('true'), comum(';')),
   vaziaCompacta(),
   ```

3. **Crie o componente em `features/<slug>/<slug>.ts`**, igual ao `SobreMim`:

   ```ts
   import { Component } from '@angular/core';

   import { EditorDeCodigo } from '../../shared/editor-de-codigo/editor-de-codigo';
   import { CONTEUDO_SOBRE_MIM } from './sobre-mim.conteudo';

   // O h1 da página vem da casca.
   @Component({
     selector: 'app-sobre-mim',
     imports: [EditorDeCodigo],
     template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
   })
   export class SobreMim {
     protected readonly conteudo = CONTEUDO_SOBRE_MIM;
   }
   ```

4. **Troque a rota.** Em `app.routes.ts`, toda rota de seção é gerada de `SECOES` (função
   `rotasDaSecao`) e carrega `SecaoEmConstrucao` enquanto o slug não tem feature. Para trocar,
   registre o carregador da feature em `FEATURES_DAS_SECOES`, indexado pelo slug; `path` e `title`
   continuam vindo de `SECOES`:

   ```ts
   const FEATURES_DAS_SECOES: Readonly<Record<string, CarregadorDeSecao>> = {
     'sobre-mim': () => import('./features/sobre-mim/sobre-mim').then((m) => m.SobreMim),
     diferenciais: () => import('./features/diferenciais/diferenciais').then((m) => m.Diferenciais),
     'como-uso-ia': () => import('./features/como-uso-ia/como-uso-ia').then((m) => m.ComoUsoIa),
     skills: () => import('./features/skills/skills').then((m) => m.Skills),
     experiencias: () => import('./features/experiencias/experiencias').then((m) => m.Experiencias),
     // ...eventos, formacao, idiomas e contato
   };
   ```

5. **Teste.** Um `<slug>.spec.ts` ao lado do componente e um cenário no E2E. O teste de
   acessibilidade (`e2e/acessibilidade.spec.ts`) já percorre as rotas geradas da lista.

### Seção longa: um arquivo só

Algumas seções têm várias partes (Skills, Experiências, Certificações, Projeto 1 e Projeto 2). Elas
**não são paginadas**: o controle `◂ n/N ▸` saiu do site, junto com o campo `paginas` de
`core/secoes.ts` e as rotas por página ([ADR-0018](adr/0018-secoes-num-arquivo-so.md)). Cada seção é
um **único `ConteudoDoEditor`**, que se rola.

1. **O cabeçalho aparece uma vez.** `package`, `import` e a declaração da classe abrem o arquivo.
2. **Cada parte vira um bloco da mesma classe,** com um comentário de cabeçalho (`// Memora`,
   `// Watts Company`), o Javadoc (no modo de leitura) e a instância do `record`, sem repetir o resto.
3. **A feature só desenha o conteúdo.** Sem `input()` de página nem controle:

   ```ts
   @Component({
     selector: 'app-skills',
     imports: [EditorDeCodigo],
     template: `<app-editor-de-codigo [conteudo]="conteudo" />`,
   })
   export class Skills {
     protected readonly conteudo = CONTEUDO_SKILLS;
   }
   ```

4. **Links antigos.** `/<slug>/<n>` redireciona para `/<slug>`, e o sitemap lista só as seções.
   O "Próximo arquivo" fica no fim do arquivo e leva à seção seguinte da árvore.

Uma feature não importa de outra feature: o editor e as construtoras vêm de `shared/`, e a lista
de seções vem de `core/`.

## Movimento e temas de seção (ADR-0019)

- **Temas de cor por seção.** `src/styles/_temas-de-secao.scss` define, para `hero`, `sobre`,
  `stack`, `formacao`, `projetos` e `contato`, as variáveis `--s-fundo`, `--s-texto`,
  `--s-secundario`, `--s-linha`, `--s-acento`, `--s-acento-2` e `--s-sobre-acento`, nas variantes
  escura e clara. O `<html>` recebe `data-secao` e as variáveis transitam em 900 ms (sem movimento
  reduzido, a troca é imediata). `src/app/core/temas-de-secao.spec.ts` compila o SCSS e falha se
  qualquer par de texto e fundo ficar abaixo de 4,5:1.
- **`MovimentoConfig`** (`core/movimento/movimento-config.ts`): `reduzido` (signal que acompanha o
  sistema), `ponteiroFino`, `deveAnimar()` e `carregar()`, que baixa o `motion` por `import()` só
  quando há movimento. Tokens de duração, curvas, distâncias e molas em `movimento.tokens.ts`.
- **Diretivas** (`shared/movimento/`): `appRevelar` (entra uma vez ao chegar perto do fim da
  janela), `appMagnetico` (segue de leve o ponteiro) e `[appContador]` (conta até o valor). O HTML
  pré-renderizado já é o estado final: elas só animam elementos que ainda estão fora da janela,
  depois da hidratação, e não fazem nada com movimento reduzido.

## Vitrine de projetos (ADR-0019)

Rota `/projetos` (e `/projetos/:slug`), na árvore como `Vitrine.java`. Dados em
`src/app/core/projetos.ts` (os seis projetos: slug, número, etiquetas, até três destaques,
imagens, capa em código e link com o rótulo "Ver site" ou "Ver repositório").

- **`CartaoDeProjeto`:** um link real para `/projetos/<slug>`; o clique comum é interceptado para
  abrir os detalhes, e com Ctrl ou Shift segue o link normal. Sem captura de tela mostra a
  `CapaEmCodigoDoProjeto` (a classe e um trecho em Java), escondida de leitores de tela.
- **`CarrosselDeProjetos`:** rolagem horizontal nativa com `scroll-snap`; o mouse arrasta
  (limiar de 6 px, e um arrasto não abre o cartão), botões e pontos levam a um cartão, as setas do
  teclado andam de cartão em cartão e nas pontas o primeiro e o último valem como ativos. Não anda
  sozinho e não clona cartões. A grade (`modo = 'grade'`) mostra todos de uma vez; no celular a
  vitrine já abre em grade. `data-pronto` marca a hidratação (os testes esperam por ele).
- **`DetalhesDoProjeto`:** `<dialog>` modal nativo (foco inicial em Fechar, Tab preso, Esc pede o
  fechamento à vitrine) com contador, galeria, link, "Ver em código" e anterior/próximo.
- **Expansão do cartão:** `TransicaoDoProjeto` (`core/transicao-de-projeto.ts`) combina com o
  handler de View Transition do roteador (`core/transicao-de-rota.ts`): na ida o cartão carrega o
  `view-transition-name: projeto` e o painel dos detalhes o recebe por CSS; na volta, o contrário.
  Voltar do navegador e anterior/próximo não animam. Com movimento reduzido nada anima.
- **Endereço:** `/projetos/:slug` é uma rota filha sem componente (a vitrine segue montada e o
  carrossel não perde a posição); abre direto pelo endereço e o Voltar fecha os detalhes.
- **Capas:** `node scripts/gerar-capas-dos-projetos.mjs` gera os WebP (960x600, até 200 KB).

## Visão geral e visões "Cartão" (ADR-0019)

- **`VisaoDoConteudoEscolhida`** (`core/visao-do-conteudo.ts`): `cartao` ou `codigo`, lembrada em
  `localStorage` (sempre em `try/catch`); antes da hidratação vale o cartão, que é o que o HTML
  pré-renderizado traz. **`AlternarVisao`** é o botão ("Ver como código" / "Ver como cartão") com
  `aria-pressed`. **`SecaoEmDuasVisoes`** recebe o conteúdo do editor e um `<ng-template #cartao>`
  (e, opcional, `#extraDoCodigo`) e mostra um ou outro; as seções Sobre Mim, Skills, Experiências,
  Formação e Contato usam, e o Início tem a visão geral própria.
- **`core/perfil.ts`:** fatos do Vinicius (contatos, resumo, stack por nível, experiências, formação,
  idiomas, provas) lidos pelos cartões; `perfil.spec.ts` confere que continuam nas seções em código.
- **Visão geral do Início** (`features/inicio/`): `Hero` (a classe `ViniciusMachado` é digitada na
  janela da IDE e se resolve no cartão; sem movimento, sem JavaScript e com movimento reduzido o
  cartão já está lá, e o texto do hero existe no HTML desde o primeiro quadro), `VisaoGeral` (as seis
  faixas, cada uma com o tema de cor, a barra de ações no topo e os atalhos Projetos, Currículo e
  Contato colados embaixo no celular).
- **Cartões** (`shared/cartoes/`): `Provas` (números que contam), `SobreEmCartoes` (bento
  assimétrico), `StackEmGradle` (a stack como `build.gradle`; cada tecnologia aponta o projeto da
  vitrine que a usa), `ExperienciaEmGrafo` (um `git log --graph`; a linha se desenha ao rolar com
  `animation-timeline: view()`), `FormacaoEIdiomas`, `ProjetosEmDestaque` e `ContatoEmTerminal`.
- **`AcoesDoRecrutador`:** Currículo (PDF), LinkedIn, GitHub e Copiar e-mail; o botão de copiar
  ocupa o lugar desde o HTML (não muda o layout na hidratação) e confirma no próprio rótulo e numa
  região `aria-live`. No celular as ações viram uma fileira que rola.
- **`TemaDeSecao`** (`appTemaDeSecao`): quando a seção passa da metade da janela, o `<html>` recebe
  `data-secao`. **Superfícies** em `src/styles/_recrutador.scss`: `.casca-dupla` (moldura de 1px e
  miolo com raio concêntrico), `.pilula` (botão com a seta num círculo aninhado), `.eyebrow`, `.chip`.
- **Busca (Ctrl/Cmd+K):** ao digitar, aparecem os comandos "Baixar currículo", "Abrir o LinkedIn",
  "Abrir o GitHub" e "Copiar e-mail".
- **Abertura:** Esc ou o botão Pular encerram a abertura na hora (item 5 do ADR-0017 revisto).
- **Faixa de abas:** o indicador deslizante é um fio de acento sob a aba ativa (só `transform`).
  **`BarraDeCarregamento`:** o fio no topo que "compila" a cada troca de rota (some com movimento
  reduzido).
- **Cartões das demais seções:** `shared/cartoes/` também traz os cartões de Diferenciais, Como uso a
  IA, Certificações, Eventos, Idiomas, Depoimentos e `ProjetoEmCartao` (papel, destaques e o link
  "Ver na vitrine"). `SecaoEmDuasVisoes` aceita `?visao=codigo` para abrir o arquivo Java sem mudar a
  escolha lembrada (é o destino do "Ver em código" da vitrine). Os dados vêm de `core/perfil.ts`.
- **Interações de ponteiro:** `appInclinar` (inclinação 3D com o `motion`), `appParallax` (foto do
  hero) e `CursorDoSite` (anel que cresce sobre alvos e fica `aria-hidden`). Só com ponteiro fino, fora
  de aparelho fraco e nunca com `prefers-reduced-motion`; o cursor nativo não é escondido.
