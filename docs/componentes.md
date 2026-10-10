# Componentes

Inventário dos componentes que montam a IDE e o guia para criar uma seção nova. Os nomes abaixo
existem no código; os caminhos são relativos a `src/app/`.

Todas as seções seguem o mesmo esqueleto: muda só o conteúdo do editor e o item selecionado da
árvore. Por isso o conteúdo é **dado tipado**, e não um componente por seção.

## Inventário das telas

| Elemento da tela                                               | Telas            | Componente                     | Pasta                          |
| -------------------------------------------------------------- | ---------------- | ------------------------------ | ------------------------------ |
| Barra de ferramentas e controles de janela                     | todas            | `BarraDeFerramentas`           | `layout/barra-de-ferramentas/` |
| Painel lateral (título, controles, rodapé)                     | todas            | `PainelLateral`                | `layout/painel-lateral/`       |
| Árvore de seções com ícones                                    | todas            | `ArvoreDeSecoes`               | `layout/arvore-de-secoes/`     |
| Faixa de abas dos arquivos abertos                             | todas (nossa)    | `FaixaDeAbas`                  | `layout/faixa-de-abas/`        |
| Barra de status no rodapé                                      | (nossa)          | `BarraDeStatus`                | `layout/barra-de-status/`      |
| Busca de seções (Ctrl/Cmd+P)                                   | (nossa)          | `BuscaDeSecoes`                | `layout/busca-de-secoes/`      |
| Casca (junta tudo e hospeda as rotas)                          | todas            | `Casca`                        | `layout/casca/`                |
| Editor com numeração e sintaxe                                 | todas            | `EditorDeCodigo`               | `shared/editor-de-codigo/`     |
| Bloco de comentário com `*`                                    | 02-04, 07-18, 29 | parte do `EditorDeCodigo`      | `shared/editor-de-codigo/`     |
| Ícones (arquivo, pasta, ferramenta, IA...)                     | todas            | `Icone`                        | `shared/icone/`                |
| "×" fino do Eclipse                                            | todas            | `GlifoFechar`                  | `shared/glifo-fechar/`         |
| Início                                                         | 01               | `Inicio`                       | `features/inicio/`             |
| Sobre Mim                                                      | 02               | `SobreMim`                     | `features/sobre-mim/`          |
| Diferenciais                                                   | 03               | `Diferenciais`                 | `features/diferenciais/`       |
| Como uso a IA                                                  | 04               | `ComoUsoIa`                    | `features/como-uso-ia/`        |
| Skills / STACK (3 páginas, a 3ª com os níveis de conhecimento) | 05, 06 e níveis  | `Skills`                       | `features/skills/`             |
| Controle de páginas (1/2, setas SVG)                           | 05, 06 (nosso)   | `PaginasDaSecao`               | `shared/paginas-da-secao/`     |
| Experiências (3 páginas)                                       | 07-09            | `Experiencias`                 | `features/experiencias/`       |
| Eventos                                                        | 22               | `Eventos`                      | `features/eventos/`            |
| Certificações (3 páginas, 9 cursos)                            | (nossa)          | `Certificacoes`                | `features/certificacoes/`      |
| Formação                                                       | 28               | `Formacao`                     | `features/formacao/`           |
| Idiomas                                                        | 28               | `Idiomas`                      | `features/idiomas/`            |
| Contato (links reais)                                          | 30               | `Contato`                      | `features/contato/`            |
| Seção sem conteúdo ainda                                       | 10-21, 23-27, 29 | `SecaoEmConstrucao`            | `shared/secao-em-construcao/`  |
| Janela de preview de site                                      | 11-15            | fora do escopo (change futura) | -                              |

O design é **referência de identidade visual** ([ADR-0010](adr/0010-design-como-referencia-e-java-moderno.md)).
Por isso o site tem o que as telas, estáticas, não mostram: a faixa de abas, a barra de status, a
busca, a digitação do código, o botão "Seções" e a gaveta do celular. As linhas marcadas como
"nossa" não existem no design.

## Layout (`layout/`)

### `Casca`

- **Onde:** `layout/casca/casca.ts`, seletor `app-casca`.
- **O que faz:** é a rota-pai de todas as páginas. Monta a barra de ferramentas, o painel lateral,
  a `FaixaDeAbas` com o botão de busca, o `<router-outlet>` dentro do `<main>`, a `BarraDeStatus`
  e a `BuscaDeSecoes`. A casca **ocupa a janela inteira** (`100dvh`, sem rolagem da página): só a
  área do editor rola, e cada navegação volta ao topo. O atalho Ctrl/Cmd+P (`keydown.control.p` e
  `keydown.meta.p` no `host`) abre a busca com `preventDefault`. Contém o `h1` visualmente oculto, com o título
  da rota (vem da `EstrategiaDeTitulo`). Abaixo de 768px controla a gaveta: abre pelo botão
  "Seções" (`aria-expanded`, `aria-controls`), move o foco para o primeiro item e, com Escape ou
  ao escolher uma seção, fecha e devolve o foco ao botão.
- **Entradas e saídas:** nenhuma. Quem a usa é o roteador (`app.routes.ts`).
- **Estado:** `gavetaAberta` (signal). O painel recebe `data-aberta`, que o CSS usa para animar.

### `PainelLateral`

- **Onde:** `layout/painel-lateral/painel-lateral.ts`, seletor `app-painel-lateral`.
- **O que faz:** moldura da árvore: cabeçalho decorativo (`aria-hidden`), a `ArvoreDeSecoes` e o
  rodapé com a barra de rolagem decorativa. No celular mostra o botão "Fechar seções".
- **Saídas:** `secaoEscolhida` (repassa a escolha da árvore) e `fecharGaveta` (botão "Fechar
  seções"). Método público: `focarPrimeiroItem()`.

```html
<app-painel-lateral (secaoEscolhida)="fechar()" (fecharGaveta)="fechar()" />
```

### `ArvoreDeSecoes`

- **Onde:** `layout/arvore-de-secoes/arvore-de-secoes.ts`, seletor `app-arvore-de-secoes`.
- **O que faz:** gera a navegação (`<nav aria-label="Seções do portfólio">`) a partir de `SECOES`.
  Cada item é um `routerLink`; o item da rota ativa recebe a classe `atual` e
  `aria-current="page"`. A navegação por teclado usa **roving tabindex**: só um item fica na
  ordem de Tab (o atual ou o último focado), e as setas para cima e para baixo, Home e End movem o
  foco entre os itens.
- **Entrada:** `noInicio = input(false)`: no Início a primeira seção aparece destacada, sem
  `aria-current`.
- **Saídas:** `secaoEscolhida`, emitida a cada clique em um item. Método público:
  `focarPrimeiroItem()`.

### `BarraDeFerramentas`

- **Onde:** `layout/barra-de-ferramentas/barra-de-ferramentas.ts`, seletor
  `app-barra-de-ferramentas`.
- **O que faz:** imita a barra do Eclipse (degradê, ícones e controles de janela). É decorativa:
  `aria-hidden="true"` e fora da ordem de foco. Os ícones que não cabem no celular ficam ocultos.
- **Entradas e saídas:** nenhuma.

### `FaixaDeAbas`

- **Onde:** `layout/faixa-de-abas/faixa-de-abas.ts`, seletor `app-faixa-de-abas`.
- **O que faz:** uma aba por arquivo aberto (`SobreMim.java`, `Skills.java`...), no padrão
  `tablist` do WAI-ARIA: `role="tablist"` com `aria-label="Arquivos abertos"`, abas com
  `aria-selected` e roving tabindex. Setas e Home/End movem o foco, Enter e Espaço abrem e Delete
  fecha. Os botões de fechar ficam **fora do `tablist`** (que só pode ter abas), cada um sobre a
  ponta da sua aba, com `aria-label` "Fechar `<arquivo>`". A aba ativa é levada à área visível
  (sem animar com movimento reduzido). O estado vem do serviço `AbasAbertas`.
- **Entradas e saídas:** nenhuma.

### `BarraDeStatus`

- **Onde:** `layout/barra-de-status/barra-de-status.ts`, seletor `app-barra-de-status`.
- **O que faz:** rodapé de IDE com o arquivo aberto, a posição `linha:coluna` (do `EstadoDoEditor`, que conta a **linha visual**, já que o Javadoc ocupa várias linhas),
  `UTF-8`, `Java 21` e o ramo `main`. É um `<footer role="status">`, mas só o nome do arquivo é
  lido: a posição muda a cada clique e fica em `aria-hidden`.
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
- **Entrada:** `conteudo = input.required<ConteudoDoEditor>()`.

```html
<app-editor-de-codigo [conteudo]="conteudo" />
```

### `Icone`

- **Onde:** `shared/icone/icone.ts`, seletor `app-icone`.
- **O que faz:** mostra um SVG de `public/icones/` com `NgOptimizedImage` e `alt=""` (decorativo:
  o texto ao lado já é o rótulo). A lista de nomes válidos é `NOMES_DE_ICONE`; o tipo é
  `NomeDoIcone`.
- **Entrada:** `nome = input.required<NomeDoIcone>()`. O tamanho vem do token `--tamanho-icone`.

```html
<app-icone nome="pasta" />
```

### `GlifoFechar`

- **Onde:** `shared/glifo-fechar/glifo-fechar.ts`, seletor `app-glifo-fechar`.
- **O que faz:** o "×" fino do Eclipse, em SVG, decorativo. Herda a cor do texto; o tamanho vem do
  token `--tamanho-glifo`.
- **Entradas e saídas:** nenhuma.

### `PaginasDaSecao`

- **Onde:** `shared/paginas-da-secao/paginas-da-secao.ts`, seletor `app-paginas-da-secao`.
- **O que faz:** o controle de páginas de uma seção com mais de uma tela do design (hoje, Skills):
  setas em SVG para anterior e próxima e o texto `1/2` entre elas, num
  `<nav aria-label="Páginas da seção">`. Os links são `routerLink` para `/<slug>` (página 1) e
  `/<slug>/N`. As setas têm `aria-label` "Página anterior" e "Próxima página"; o número tem o
  rótulo "página X de N" e `aria-current="page"`. Na primeira e na última página, o lado sem
  destino fica como espaço vazio decorativo. **Não aparece quando `total` é 1.** Esse controle
  não existe no design (as telas são estáticas): é o mínimo para navegar entre as páginas de uma
  mesma seção, só com tokens.
- **Entradas:** `slug = input.required<string>()`, `pagina = input.required<number>()` e
  `total = input.required<number>()`.

```html
<app-paginas-da-secao slug="skills" [pagina]="pagina()" [total]="totalDePaginas()" />
```

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
  `ARQUIVO_INICIO` (`ViniciusMachado.java`).

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

O papel `valor` (verde-azulado, `#4fafac`) é o dos valores literais que não são texto, como
`true`, e aparece na tela 03.

### Construtoras

Funções curtas para o arquivo de conteúdo ficar legível:

| Função                             | Cria                                        |
| ---------------------------------- | ------------------------------------------- |
| `palavraChave(texto)`              | `Trecho` rosa (`public class`, `extends`)   |
| `declaracao(texto)`                | `Trecho` laranja (`String cargo`)           |
| `literal(texto)`                   | `Trecho` verde (`“Java”`)                   |
| `valor(texto)`                     | `Trecho` verde-azulado (`true`)             |
| `anotacao(texto)`                  | `Trecho` azul (`@Anotacao`)                 |
| `comentario(texto)`                | `Trecho` cinza de comentário (`// 2x`)      |
| `link(trecho, href)`               | O mesmo trecho com `href` (link)            |
| `comum(texto)`                     | `Trecho` na cor padrão do texto             |
| `linha(recuo, ...trechos)`         | `LinhaDeCodigo`                             |
| `linhaCompacta(recuo, ...trechos)` | `LinhaDeCodigo` com `densidade: 'compacta'` |
| `linhaApertada(recuo, ...trechos)` | `LinhaDeCodigo` com `densidade: 'apertada'` |
| `paragrafo(recuo, texto)`          | `LinhaDeParagrafo`                          |
| `javadoc(recuo, texto)`            | `LinhaDeJavadoc`                            |
| `vazia()`                          | `LinhaVazia`                                |
| `vaziaCompacta()`                  | `LinhaVazia` com `densidade: 'compacta'`    |
| `vaziaApertada()`                  | `LinhaVazia` com `densidade: 'apertada'`    |

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

**Links.** `link(trecho, href)` transforma um trecho em link (`https://`, `mailto:` ou `tel:`). A
seção Contato usa isso com links reais: `link(literal('"viniciusmassuncao@gmail.com"'),
'mailto:viniciusmassuncao@gmail.com')`.

## Regra de conteúdo: Java moderno

Por decisão do [ADR-0010](adr/0010-design-como-referencia-e-java-moderno.md), o código exibido é
**Java 21 sintaticamente válido**, com padrões de mercado, e **preserva todas as informações** das
telas. O design é referência de identidade visual, não de sintaxe: o "pseudo-Java" das telas não é
copiado.

| Informação                 | Em Java moderno                                          |
| -------------------------- | -------------------------------------------------------- |
| Dados de uma entidade      | `record` (`record Experience(String company, ...)`)      |
| Listas de textos           | `List.of("Java", "Spring Boot", ...)`, não `String[]`    |
| Datas e períodos           | `YearMonth.of(2026, 8)`                                  |
| Valor que pode não existir | um texto que já diz o resultado (`"08/2026 - Presente"`) |
| Texto longo                | Javadoc (`javadoc()`) acima da declaração                |
| Contatos                   | texto literal com `link()` (sem `URI.create`)            |

Identificadores seguem as convenções do Java (classes em PascalCase, campos e métodos em
camelCase, constantes em UPPER_SNAKE_CASE) e ficam **em inglês**; os textos para o leitor (cargos,
descrições) ficam em pt-BR.

Exemplo real, de `features/experiencias/experiencias.conteudo.ts`: o `record` e uma constante com
o período já escrito como texto e os destaques.

```java
public class Experiences {

  record Experience(
      String company,
      String role,
      String period,
      List<String> highlights) {}

  // Experiência atual
  static final Experience MEMORA = new Experience(
      "Memora",
      "Desenvolvedor Full Stack Júnior",
      "08/2026 - Presente",
      List.of("Liderança de squad", ...)
  );
}
```

Em TypeScript, o arquivo de conteúdo monta as linhas com as construtoras, por exemplo
`linha(2, comentario('// Experiência atual'))`.

### Guia de legibilidade

O site é lido por recrutadores, não só por quem programa em Java. Por isso o código precisa ser
**Java que qualquer pessoa entende** (decisão 2 do design da change
`certificacoes-niveis-e-legibilidade`):

- **Nomes que se explicam.** `Certification(String course, int hours, LocalDate completedOn)` dispensa
  explicação.
- **Um comentário `//` em pt-BR por bloco**, no início, dizendo o que o bloco é (por exemplo,
  `// Inglês` em Idiomas). Os identificadores continuam em inglês.
- **Listas de até 5 tecnologias numa linha.** Listas maiores são quebradas por grupos.
- **Sem ruído técnico.** Evite `Optional`, `URI.create`, genéricos aninhados e imports que não
  ajudam: quando um texto resolve, use o texto (`"08/2026 - Presente"` no lugar de
  `Optional<YearMonth>`). Os links continuam clicáveis via `link()`.
- **Javadoc só para parágrafos** de texto.

Manter `record`, `List.of` e `java.time` onde ajudam: simplificar não é abrir mão do Java moderno.
`legibilidade-das-secoes.spec.ts` cobre parte destas regras.

### Escala de tipografia

Os tamanhos vêm de `src/styles/_tokens.scss`. A escala 1,2× das telas deixava o site grande
demais (código em 23px); os tokens foram multiplicados por ~0,74 sem mexer em componentes:

| Elemento                    | Token                                             | Valor (desktop) |
| --------------------------- | ------------------------------------------------- | --------------- |
| Código e comentário         | `--texto-codigo`, `--texto-comentario`            | 1,06rem (~17px) |
| Árvore, abas e barra status | `--texto-arvore`, `--texto-aba`, `--texto-status` | 1rem (16px)     |
| Números de linha            | `--texto-numero-linha`                            | 1,29rem         |

As alturas de linha, recuos, a coluna de números, as linhas da árvore, as abas, a barra de status
e o painel lateral foram reduzidos na mesma proporção, e as cores não mudaram. No editor cabem
cerca de 28 linhas (antes, ~15). Abaixo de 768px vale uma **escala própria** (código e comentário
em 0,95rem), definida no bloco `@media (max-width: 767.98px)` do mesmo arquivo.

## Como criar uma seção nova só com dados

Todas as seções publicadas foram feitas assim e servem de exemplo real: o Início
(`features/inicio/`), **Sobre Mim**, **Diferenciais**, **Como uso a IA**, **Skills / STACK**,
**Experiências** (3 páginas), **Eventos**, **Formação**, **Idiomas** e **Contato**. As demais
seções (projetos, certificações e depoimentos) ainda mostram `SecaoEmConstrucao`. Para dar conteúdo a uma delas não é preciso criar componente de editor,
estilo nem item de árvore.

1. **Confirme a seção em `core/secoes.ts`.** A lista `SECOES` (`slug`, `titulo`, `icone`, `arquivo` e,
   opcionalmente, `paginas`) é a fonte única: dela saem os itens da árvore, as rotas e os títulos. Para uma seção nova, acrescente um
   item na posição em que ela deve aparecer, com o `arquivo` `.java` dela (por exemplo,
   `Eventos.java`). O `icone` precisa estar em `NOMES_DE_ICONE`.
2. **Crie o conteúdo em `features/<slug>/<slug>.conteudo.ts`**, exportando um `ConteudoDoEditor`
   montado com as construtoras, em Java moderno (veja a regra acima). Confira as informações com
   a tela e com `design/telas/textos.md`. Exemplo, de `features/sobre-mim/sobre-mim.conteudo.ts`
   (tela 02):

   ```ts
   export const CONTEUDO_SOBRE_MIM: ConteudoDoEditor = [
     vazia(),
     linha(0, palavraChave('public interface'), comum(' Developer {')),
     linha(1, palavraChave('String'), comum(' aboutMe();')),
     linha(0, comum('}')),
     vazia(),
     // ... a classe ViniciusMachado implements Developer, com a constante ABOUT_ME
     javadoc(1, 'Sou desenvolvedor Full Stack com cerca de 2 anos de experiência...'),
     linha(1, anotacao('@Override')),
     linha(1, palavraChave('public'), comum(' String aboutMe() {')),
     linha(2, palavraChave('return'), comum(' ABOUT_ME;')),
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

### Seção com várias páginas

Algumas seções têm mais de uma tela no design (Skills tem as telas 05 e 06). Em vez de uma rota
com parâmetro, cada página é uma rota estática pré-renderizada, e o mecanismo é todo dados:

1. **Declare `paginas` em `core/secoes.ts`.** É o único lugar:

   ```ts
   { slug: 'skills', titulo: 'Skills / STACK', icone: 'ferramenta', paginas: 2 },
   ```

   A função `totalDePaginas(secao)` devolve `paginas ?? 1`.

2. **Rotas e título saem sozinhos.** `rotasDaSecao` gera `/<slug>` (página 1) e `/<slug>/2` até
   `/<slug>/N`, cada uma com `data: { pagina, totalDePaginas }` (tipo `DadosDePagina`). A
   `EstrategiaDeTitulo` acrescenta `(X/N)` ao título a partir da página 2, como em
   `Skills / STACK (2/2) | Vinicius Machado`. A árvore mantém a seção como atual em qualquer página.
   Uma página fora do intervalo cai no `**` e volta ao Início.
3. **O conteúdo é um array, um item por página.** Em `features/skills/skills.conteudo.ts`:

   ```ts
   export const CONTEUDOS_SKILLS: readonly ConteudoDoEditor[] = [
     [vazia(), CABECALHO, ...arrayDeTextos('linguagens', ['Java', 'TypeScript'])],
     [vazia(), CABECALHO, ...arrayDeTextos('cloudAndInfra', ['Docker', 'Kubernetes'])],
   ];
   ```

4. **A feature recebe a página como `input()`.** O roteador entrega o `data` da rota aos inputs
   do componente (`withComponentInputBinding`, em `app.config.ts`), e o componente escolhe o
   conteúdo e mostra o controle:

   ```ts
   @Component({
     selector: 'app-skills',
     imports: [EditorDeCodigo, PaginasDaSecao],
     template: `
       <app-editor-de-codigo [conteudo]="conteudo()" />
       <app-paginas-da-secao slug="skills" [pagina]="pagina()" [total]="totalDePaginas()" />
     `,
   })
   export class Skills {
     readonly pagina = input(1);
     readonly totalDePaginas = input(CONTEUDOS_SKILLS.length);

     protected readonly conteudo = computed(() => CONTEUDOS_SKILLS[this.pagina() - 1]);
   }
   ```

Seções de uma página só (como `ComoUsoIa`) não precisam de nada disso. A mesma estrutura serve às
próximas seções com várias telas, só declarando quantas páginas têm.

Uma feature não importa de outra feature: o editor e as construtoras vêm de `shared/`, e a lista
de seções vem de `core/`.
