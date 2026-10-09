# Proposal

## Why

O Vinicius redefiniu a direção do portfólio: o design passa a ser referência visual, e não uma
especificação a copiar pixel a pixel. O site deve parecer uma IDE de verdade, com abas,
digitação, barra de status, atalhos e animações, e o código exibido deve mostrar Java moderno
e padrões de mercado, porque o portfólio também prova o que ele sabe. Ao mesmo tempo, faltam
seções de conteúdo simples que já cabem no mecanismo existente.

## What Changes

- **Design como referência** (ADR-0010): mantém a identidade visual da IDE, mas permite
  desvios que melhorem a experiência, a acessibilidade ou a modernidade do código. **BREAKING**
  para a regra de fidelidade do `CLAUDE.md` e do requisito "Fidelidade ao design de
  referência".
- **Java moderno** em todo o conteúdo: records, `List.of`, `var`, `Optional`, `YearMonth`, text
  blocks, Javadoc e convenções de mercado (nomes em inglês no código, arquivos `.java` por
  seção). As cinco seções já publicadas são reescritas nesse estilo, mantendo as informações.
- **Abas por seção**: abrir uma seção abre uma aba (`SobreMim.java`, `Skills.java`...) na faixa
  de abas; dá para alternar e fechar abas, como numa IDE.
- **Digitação e cursor**: ao abrir uma seção, o código aparece digitado rapidamente, com cursor
  piscando e a linha atual destacada; com "reduzir movimento", aparece pronto.
- **Barra de status** no rodapé: arquivo aberto, linha:coluna, codificação, versão do Java e
  branch.
- **Busca de seções** com Ctrl/Cmd+P (como "Go to File") e navegação da árvore por setas.
- **Seções novas**: Experiências (3 páginas: Memora, estágio na Memora e Watts Company, telas 07
  a 09), Eventos (tela 22), Formação e Idiomas (tela 28) e Contato (tela 30, com links reais de
  e-mail, LinkedIn e GitHub).
- **Equipe**: dois especialistas novos, Grafite e Nanquim, com o papel "Seções", para
  escrever o conteúdo em paralelo.
- Entrada 0005 do diário.

## Capabilities

### New Capabilities

- `conteudo-em-java-moderno`: estilo do código exibido (Java moderno e padrões de mercado).
- `abas-do-editor`: abas por seção, alternar e fechar.
- `digitacao-do-codigo`: digitação animada, cursor e linha atual.
- `barra-de-status`: rodapé de IDE com informações do arquivo aberto.
- `busca-de-secoes`: Ctrl/Cmd+P e navegação da árvore por teclado.
- `secao-experiencias`, `secao-eventos`, `secao-formacao`, `secao-idiomas`, `secao-contato`.

### Modified Capabilities

- `sistema-visual`: "Fidelidade ao design de referência" passa a "Design como referência".
- `casca-da-ide`: "Estrutura fixa da IDE" passa a ter a faixa de abas e a barra de status.
- `editor-de-codigo`: novos papéis de sintaxe (comentário de linha, link) e links clicáveis.
- `secao-inicio`, `secao-sobre-mim`, `secao-diferenciais`, `secao-como-uso-ia`,
  `secao-skills`: o código exato das telas dá lugar às informações em Java moderno.

## Impact

- Código: `layout/` (abas, barra de status, busca, árvore), `shared/editor-de-codigo/`
  (papéis, links, digitação), um serviço de abas em `core/`, as dez features de seção e as
  rotas.
- Testes: unitários e E2E de todos os comportamentos novos; axe em todas as rotas.
- Documentação: ADR-0010, `CLAUDE.md`, papéis da equipe (novo `secoes.md`), README da equipe,
  `docs/componentes.md`, `docs/arquitetura.md` e a entrada 0005 do diário.
- Sem dependências novas.
