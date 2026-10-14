# Proposal

## Why

O código das seções ainda é técnico demais para quem recruta: nomes em inglês (`TechSkills`,
`Recommendation`, `author`), cerimônia de linguagem (`static final` em tudo, constantes em caixa
alta como `MY_SKILLS` e `LUANA_PORTO`) e a página inicial num arquivo `ViniciusMachado.java`
que não se parece com um projeto Spring. O
[ADR-0011](../../../docs/adr/0011-identidade-visual-intellij-new-ui.md) decidiu identificadores de
domínio em português; esta é a change que aplica isso.

## What Changes

- **Identificadores de domínio em português** em todas as seções (`record Evento(String nome,
  int vezes)`, `record Recomendacao(String autora, String cargo, …)`); o inglês fica só nas
  palavras da linguagem e do Spring (`record`, `List.of`, `@Component`).
- **Menos cerimônia:** sem `static final` e sem constantes em caixa alta para dados; o código se
  lê como frase (`var luana = new Recomendacao(...)`, `List.of(...)` direto no campo).
- **Página inicial como `PortfolioApplication.java`**, com `@SpringBootApplication` e o `main`
  apresentando o Vinicius, no pacote raiz `dev.vinicius.portfolio`; cada seção declara o
  `package` da sua pasta (`dev.vinicius.portfolio.sobre`, …).
- Java 21 válido e todas as informações preservadas; textos para o leitor continuam em pt-BR.
- Entrada do diário.

Fora do escopo: fim da paginação (as seções com várias páginas continuam paginadas) e fotos de
perfil (change própria, quando as imagens chegarem).

## Capabilities

### Modified Capabilities

- `conteudo-em-java-moderno`: convenções com domínio em português e sem cerimônia.
- `secao-inicio`: a página inicial vira `PortfolioApplication.java`.

## Impact

- Código: os 16 `<secao>.conteudo.ts` de `src/app/features/`, `core/secoes.ts`
  (`ARQUIVO_INICIO`), breadcrumbs e abas (nome do arquivo inicial).
- Testes: unitários e E2E que conferem textos de código.
- SEO: os textos das páginas mudam, as rotas não.
