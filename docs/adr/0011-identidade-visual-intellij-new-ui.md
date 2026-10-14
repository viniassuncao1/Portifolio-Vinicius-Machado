# ADR-0011: Identidade visual do IntelliJ IDEA New UI

- **Status:** Aceito; substituído em parte pelo [ADR-0012](0012-design-original-com-elementos-do-intellij.md)
- **Data:** 2026-10-13
- **Substitui em parte:** [ADR-0010](0010-design-como-referencia-e-java-moderno.md) (a referência
  de identidade visual e a regra de identificadores em inglês)

## Contexto

O [ADR-0010](0010-design-como-referencia-e-java-moderno.md) tornou as telas do design (inspiradas
no Eclipse) a referência de identidade visual. Com o site completo e no ar, o Vinicius revisou o
resultado com as skills `design-taste-frontend` e `web-design-guidelines` e com medições em
produção, e registrou um briefing de redesign (`design/briefing-redesign-intellij.md`, fora do
Git). Os problemas apontados:

- **Tudo grande demais** para uma IDE: árvore com texto de 16px e linhas de 33px, painel lateral
  de 395px, abas de 294px fixos, barra de status com texto de 16px, editor com raio de 18px.
- **Visual de IDE antiga:** barra de ferramentas cinza com degradê, ícones coloridos do Eclipse e
  abas grandes e arredondadas. O público principal (vagas Java/Spring) usa o IntelliJ IDEA, cuja
  New UI é escura, compacta e de cor sólida.
- **Paginação e botão Executar** que não existem numa IDE de verdade, e uma árvore plana que não
  parece um projeto.
- **Java ainda técnico demais** para quem recruta: nomes em inglês e cerimônia de linguagem
  (`static final` em tudo, constantes em caixa alta) atrapalham a leitura da informação.

## Decisão

1. **A identidade visual passa a ser a do IntelliJ IDEA New UI, tema escuro.** O objetivo é parecer
   o IntelliJ de verdade: paleta Dark da New UI (fundo do editor `#1E1F22`, painéis `#2B2D30`, um
   único acento azul `#3574F0`), interface em **Inter 13px**, código em **JetBrains Mono 14px**,
   densidade compacta, barras de cor sólida, ícones oficiais da IntelliJ Platform (licença
   Apache 2.0, com créditos) e comportamentos da IDE (árvore de projeto, abas por arquivo,
   executar na calha, janela de Run). As telas de `design/telas/` deixam de ser a referência
   visual e passam a valer só como fonte das **informações**.
2. **A árvore de seções vira um projeto Spring Boot organizado por funcionalidade:** pacotes por
   assunto (`sobre/`, `skills/`, `experiencias/`, `projetos/`, `formacao/`, `recomendacoes/`,
   `contato/`), com as seções como arquivos e `PortfolioApplication.java` como página inicial.
   Seções com várias páginas viram vários arquivos no pacote. As rotas e os slugs não mudam.
3. **Os identificadores de domínio do Java exibido passam a ser em português** (`record
Evento(String nome, int vezes)`, `participei(...)`); o inglês fica só nas palavras da
   linguagem e do Spring (`record`, `List.of`, `@RestController`). Continua valendo o resto do
   ADR-0010: Java 21 sintaticamente válido, informações preservadas e textos para o leitor em
   pt-BR.

O redesign é entregue em seis changes, nesta ordem: tokens e tipografia; barra superior, faixa de
ferramentas e barra de status; árvore de projeto Spring e fim da paginação; Executar na calha e
na barra superior; janela de Run com a inicialização do Spring; reescrita do Java para leitura.

## Alternativas consideradas

- **Manter o Eclipse e só diminuir os tamanhos.** Resolveria a escala, mas manteria o visual
  datado e a distância do que o público usa no dia a dia.
- **Um visual "inspirado em IDE" próprio.** Daria liberdade, mas perderia o reconhecimento
  imediato que uma IDE real provoca em quem programa.
- **Pacotes por camada** (`controller/`, `service/`, `model/`). Mais "cara de Spring", mas
  forçaria seções que não são controllers e leria pior para quem recruta.
- **Manter os identificadores em inglês.** Segue a convenção de mercado, mas o portfólio é lido
  principalmente por brasileiros, muitos não técnicos; em português o código se lê como frase.

## Consequências

- Os tokens de `src/styles/_tokens.scss` são trocados pela paleta e pela escala do IntelliJ; a
  fonte Inter entra servida pelo próprio site.
- O requisito "Design como referência" da spec `sistema-visual` passa a apontar para o IntelliJ
  New UI, e as telas do design deixam de ser a comparação visual.
- Os ícones da IntelliJ Platform exigem manter o aviso de copyright e citar a origem (arquivo de
  créditos e menção no README).
- Os testes que fixam cores, tamanhos e textos do visual antigo serão atualizados change a
  change.
- O Java exibido será reescrito com nomes em português na sexta change; até lá convivem os dois
  estilos.
- A barra de status mostra a branch `master` por escolha visual do Vinicius, sem afirmar que é a
  branch real do repositório (que é `main`).
