# ADR-0010: Design como referência e Java moderno no código exibido

- **Status:** Aceito
- **Data:** 2026-10-09

## Contexto

Até aqui o design (as 30 telas em `design/telas/`) era tratado como uma especificação fixa: o
`CLAUDE.md` mandava implementar "fielmente" e não inventar layout. As changes anteriores seguiram
isso à risca. A classe da tela 03 ficou sem a chave de fechamento, porque o design não a tinha, e
a grafia `ArtificialItenligence` da tela 04 só foi corrigida por uma exceção explícita do
Vinicius, para não parecer erro de digitação.

Esse rigor tinha um custo. O código exibido não era Java válido nem seguia as convenções de
mercado (arrays `String[]`, nomes em português, datas como texto), justamente num portfólio que
também prova o que o Vinicius sabe. E o site parecia uma imagem de IDE, e não uma IDE: a faixa de
abas era decorativa e não havia barra de status, busca, digitação nem cursor.

## Decisão

O design passa a ser **referência de identidade visual**, e não uma especificação pixel a pixel.

- Mantêm-se as cores, a tipografia, as proporções e a estrutura de IDE (barra de ferramentas,
  árvore de seções, aba e editor). Um desvio é aceito quando melhora a experiência, a
  acessibilidade ou a modernidade do código, e nunca quando contradiz a identidade.
- O site ganha experiência de IDE de verdade: abas por seção, digitação do código, cursor, linha
  atual, barra de status, busca de seções e animações.
- O código exibido é **Java moderno (21)** com padrões de mercado: `record`, `List.of`, `var`,
  `Optional`, `java.time`, text blocks e Javadoc, identificadores em inglês e textos para o leitor
  em pt-BR. O código precisa ser sintaticamente válido.
- As **informações** do design são preservadas: nomes, cargos, períodos, tecnologias e textos. O
  que muda é a forma do código que as carrega.

## Alternativas consideradas

- **Manter a fidelidade estrita.** Previsível e fácil de conferir contra as telas, mas o código
  continuaria sem ser Java válido e o site, sem comportamento de IDE. Seria o contrário do que o
  portfólio quer demonstrar.
- **Java "do design" só nas seções novas.** Evitaria reescrever o que já está pronto, mas deixaria
  o site com dois estilos de código lado a lado, o antigo e o moderno, o que parece descuido.

## Consequências

- As specs das seções passam a exigir as **informações**, e não o código exato das telas. O
  requisito "Fidelidade ao design de referência" vira "Design como referência".
- O `CLAUDE.md` troca "implemente fielmente" por "use como referência", e as regras de Java
  moderno passam a valer para todo conteúdo novo.
- As cinco seções já publicadas são reescritas em Java moderno, mantendo as informações.
- Quem confere uma tela compara identidade visual e informações, não pixels e caracteres. A revisão
  fica mais subjetiva; por isso o Vinicius continua validando o resultado nos portals.
- Os desvios dos casos anteriores (a chave que faltava e a grafia corrigida) deixam de ser
  exceções e passam a ser a regra.
