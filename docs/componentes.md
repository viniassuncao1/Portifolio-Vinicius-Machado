# Componentes

Inventário dos componentes que montam a IDE e o guia para criar uma seção nova. Os nomes abaixo
existem no código; os caminhos são relativos a `src/app/`.

Todas as seções seguem o mesmo esqueleto: muda só o conteúdo do editor e o item selecionado da
árvore. Por isso o conteúdo é **dado tipado**, e não um componente por seção.

## Inventário das telas

| Elemento da tela                           | Telas            | Componente                     | Pasta                          |
| ------------------------------------------ | ---------------- | ------------------------------ | ------------------------------ |
| Barra de ferramentas e controles de janela | todas            | `BarraDeFerramentas`           | `layout/barra-de-ferramentas/` |
| Painel lateral (título, controles, rodapé) | todas            | `PainelLateral`                | `layout/painel-lateral/`       |
| Árvore de seções com ícones                | todas            | `ArvoreDeSecoes`               | `layout/arvore-de-secoes/`     |
| Aba do editor `Portfolio_Vinicius`         | todas            | `AbaDoEditor`                  | `layout/aba-do-editor/`        |
| Casca (junta tudo e hospeda as rotas)      | todas            | `Casca`                        | `layout/casca/`                |
| Editor com numeração e sintaxe             | todas            | `EditorDeCodigo`               | `shared/editor-de-codigo/`     |
| Bloco de comentário com `*`                | 02-04, 07-18, 29 | parte do `EditorDeCodigo`      | `shared/editor-de-codigo/`     |
| Ícones (arquivo, pasta, ferramenta, IA...) | todas            | `Icone`                        | `shared/icone/`                |
| "×" fino do Eclipse                        | todas            | `GlifoFechar`                  | `shared/glifo-fechar/`         |
| Início                                     | 01               | `Inicio`                       | `features/inicio/`             |
| Sobre Mim                                  | 02               | `SobreMim`                     | `features/sobre-mim/`          |
| Diferenciais                               | 03               | `Diferenciais`                 | `features/diferenciais/`       |
| Seção sem conteúdo ainda                   | 04-30            | `SecaoEmConstrucao`            | `shared/secao-em-construcao/`  |
| Janela de preview de site                  | 11-15            | fora do escopo (change futura) | -                              |

O botão "Seções" e a gaveta do celular **não existem no design** (só há telas de desktop). São
decisão nossa e moram na `Casca` e no `PainelLateral`.

## Layout (`layout/`)

### `Casca`

- **Onde:** `layout/casca/casca.ts`, seletor `app-casca`.
- **O que faz:** é a rota-pai de todas as páginas. Monta a barra de ferramentas, o painel lateral,
  a aba e o `<router-outlet>` dentro do `<main>`. Contém o `h1` visualmente oculto, com o título
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
  `aria-current="page"`.
- **Saídas:** `secaoEscolhida`, emitida a cada clique em um item. Método público:
  `focarPrimeiroItem()`.

### `BarraDeFerramentas`

- **Onde:** `layout/barra-de-ferramentas/barra-de-ferramentas.ts`, seletor
  `app-barra-de-ferramentas`.
- **O que faz:** imita a barra do Eclipse (degradê, ícones e controles de janela). É decorativa:
  `aria-hidden="true"` e fora da ordem de foco. Os ícones que não cabem no celular ficam ocultos.
- **Entradas e saídas:** nenhuma.

### `AbaDoEditor`

- **Onde:** `layout/aba-do-editor/aba-do-editor.ts`, seletor `app-aba-do-editor`.
- **O que faz:** a aba `Portfolio_Vinicius` sobre o editor. Decorativa (`aria-hidden`); o título
  real da página é o `h1` da casca.
- **Entradas e saídas:** nenhuma.

## Compartilhados (`shared/`)

### `EditorDeCodigo`

- **Onde:** `shared/editor-de-codigo/editor-de-codigo.ts`, seletor `app-editor-de-codigo`.
- **O que faz:** desenha um `ConteudoDoEditor` como código: coluna de números, recuo, cores de
  sintaxe e parágrafos em bloco de comentário. A coluna de números tem 99 linhas e é recortada
  pela altura da área (mínimo de 15 linhas), então cresce com o conteúdo sem medir o DOM, o que
  mantém a pré-renderização compatível. A coluna é `aria-hidden`.
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

### `SecaoEmConstrucao`

- **Onde:** `shared/secao-em-construcao/secao-em-construcao.ts`, seletor
  `app-secao-em-construcao`.
- **O que faz:** mostra a classe `EmConstrucao` com um comentário de aviso. É a página de toda
  rota de `SECOES` que ainda não tem feature própria.
- **Entradas e saídas:** nenhuma.

## Modelo de conteúdo do editor

Fica em `shared/editor-de-codigo/conteudo.ts`. O conteúdo de uma seção é uma lista de linhas
tipadas, todas `readonly`.

| Tipo               | Forma                                                                              |
| ------------------ | ---------------------------------------------------------------------------------- |
| `Papel`            | `'palavra-chave' \| 'declaracao' \| 'literal' \| 'valor' \| 'anotacao' \| 'comum'` |
| `Trecho`           | `{ texto, papel }`: um pedaço de código com uma cor                                |
| `LinhaDeCodigo`    | `{ tipo: 'codigo', recuo, compacta?, trechos }`                                    |
| `LinhaDeParagrafo` | `{ tipo: 'paragrafo', recuo, texto }`: texto em bloco de comentário                |
| `LinhaVazia`       | `{ tipo: 'vazia', compacta? }`                                                     |
| `ConteudoDoEditor` | `readonly Linha[]`                                                                 |

`recuo` é o nível de indentação (0, 1, 2...). Cada papel tem uma cor de sintaxe nos tokens:

| Papel           | Token                         | Exemplo                |
| --------------- | ----------------------------- | ---------------------- |
| `palavra-chave` | `--cor-sintaxe-palavra-chave` | `public class`         |
| `declaracao`    | `--cor-sintaxe-campo`         | `String cargo`         |
| `literal`       | `--cor-sintaxe-literal`       | `“Java”`               |
| `valor`         | `--cor-sintaxe-valor`         | `true`                 |
| `anotacao`      | `--cor-sintaxe-anotacao`      | `@Override`            |
| `comum`         | `--cor-sintaxe-texto`         | pontuação e o restante |

O papel `valor` (verde-azulado, `#4fafac`) é o dos valores literais que não são texto, como
`true`, e aparece na tela 03.

### Construtoras

Funções curtas para o arquivo de conteúdo ficar legível:

| Função                             | Cria                                      |
| ---------------------------------- | ----------------------------------------- |
| `palavraChave(texto)`              | `Trecho` rosa (`public class`, `extends`) |
| `declaracao(texto)`                | `Trecho` laranja (`String cargo`)         |
| `literal(texto)`                   | `Trecho` verde (`“Java”`)                 |
| `valor(texto)`                     | `Trecho` verde-azulado (`true`)           |
| `anotacao(texto)`                  | `Trecho` azul (`@Anotacao`)               |
| `comum(texto)`                     | `Trecho` na cor padrão do texto           |
| `linha(recuo, ...trechos)`         | `LinhaDeCodigo`                           |
| `linhaCompacta(recuo, ...trechos)` | `LinhaDeCodigo` com `compacta: true`      |
| `paragrafo(recuo, texto)`          | `LinhaDeParagrafo`                        |
| `vazia()`                          | `LinhaVazia`                              |
| `vaziaCompacta()`                  | `LinhaVazia` com `compacta: true`         |

**`linhaCompacta`** existe para a lista de strings da tela 01, em que 4 linhas de código ocupam
só 3 linhas de número. Use-a apenas quando a tela de referência tiver esse espaçamento apertado.
Quando uma linha vazia fica no meio de um bloco compacto (tela 03), use **`vaziaCompacta()`**:
ela ocupa a altura de uma linha compacta, e não a de uma linha comum, para a numeração seguir o
design.

**Largura do parágrafo:** o texto de um `paragrafo` quebra em 72 colunas, como no design. O limite
vem do token `--colunas-paragrafo` (72,5, para a última coluna não quebrar por arredondamento) e é
calculado com o avanço da fonte monoespaçada, então acompanha o tamanho do texto. Não é preciso
quebrar o texto à mão: passe o parágrafo inteiro numa string.

Exemplo (trecho de `features/inicio/inicio.conteudo.ts`):

```ts
export const CONTEUDO_INICIO: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum('   portfolio.viniciusmachado;')),
  linha(1, declaracao('String cargo'), comum('  = '), literal('“Full Stack Júnior”'), comum(';')),
  linhaCompacta(2, literal('“Java”'), comum(',')),
  paragrafo(1, 'Texto longo que quebra de linha dentro do bloco de comentário.'),
  linha(0, comum('}')),
];
```

## Como criar uma seção nova só com dados

As seções **Sobre Mim** e **Diferenciais** foram feitas assim e servem de exemplo real
(`features/sobre-mim/` e `features/diferenciais/`). As demais seções ainda mostram
`SecaoEmConstrucao`. Para dar conteúdo a uma delas não é preciso criar componente de editor,
estilo nem item de árvore.

1. **Confirme a seção em `core/secoes.ts`.** A lista `SECOES` (`slug`, `titulo`, `icone`) é a fonte
   única: dela saem os itens da árvore, as rotas e os títulos. Para uma seção nova, acrescente um
   item na posição em que ela deve aparecer. O `icone` precisa estar em `NOMES_DE_ICONE`.
2. **Crie o conteúdo em `features/<slug>/<slug>.conteudo.ts`**, exportando um `ConteudoDoEditor`
   montado com as construtoras. Os textos visíveis ficam em pt-BR. Confira com a tela e com
   `design/telas/textos.md`. Exemplo, de `features/sobre-mim/sobre-mim.conteudo.ts` (tela 02):

   ```ts
   export const CONTEUDO_SOBRE_MIM: ConteudoDoEditor = [
     vazia(),
     linha(0, palavraChave('public interface'), comum('  ViniciusMachado {')),
     linha(1, palavraChave('void'), comum(' sobreMim();')),
     linha(0, comum('}')),
     vazia(),
     linha(1, anotacao('@Override')),
     linha(1, palavraChave('public void'), comum(' sobreMim() {')),
     paragrafo(0, 'Sou desenvolvedor Full Stack com cerca de 2 anos de experiência...'),
     vazia(),
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

4. **Troque a rota.** Em `app.routes.ts`, toda rota de seção é gerada de `SECOES` e carrega
   `SecaoEmConstrucao` enquanto o slug não tem feature. Para trocar, registre o carregador da
   feature em `FEATURES_DAS_SECOES`, indexado pelo slug; `path` e `title` continuam vindo de
   `SECOES`:

   ```ts
   const FEATURES_DAS_SECOES: Readonly<Record<string, CarregadorDeSecao>> = {
     'sobre-mim': () => import('./features/sobre-mim/sobre-mim').then((m) => m.SobreMim),
     diferenciais: () => import('./features/diferenciais/diferenciais').then((m) => m.Diferenciais),
   };
   ```

5. **Teste.** Um `<slug>.spec.ts` ao lado do componente e um cenário no E2E. O teste de
   acessibilidade (`e2e/acessibilidade.spec.ts`) já percorre as 15 rotas.

Uma feature não importa de outra feature: o editor e as construtoras vêm de `shared/`, e a lista
de seções vem de `core/`.
