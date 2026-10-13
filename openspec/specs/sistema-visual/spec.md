# sistema-visual Specification

## Purpose
Definir a linguagem visual do portfólio (cores, sintaxe, tipografia, espaçamentos e movimento)
num único conjunto de tokens, para que todas as telas fiquem fiéis ao design e acessíveis.

## Requirements

### Requirement: Estilos vêm dos design tokens
O sistema SHALL definir cores, tipografia, espaçamentos, raios, bordas, durações e curvas de
animação como design tokens globais, e os componentes MUST usar esses tokens em vez de valores
escritos diretamente.

#### Scenario: Troca de um token
- **WHEN** o valor do token de cor de fundo do editor é alterado
- **THEN** o fundo do editor muda em todas as telas, sem alterar nenhum componente

### Requirement: Contraste mínimo
Todo texto exibido MUST ter contraste de pelo menos 4,5:1 com o fundo (WCAG AA). Quando uma cor
do design não atingir esse mínimo, o token SHALL usar a cor mais próxima que atinja.

#### Scenario: Cor de sintaxe com contraste baixo
- **WHEN** uma cor de sintaxe extraída do design tem contraste menor que 4,5:1 com o fundo do
  editor
- **THEN** o token correspondente usa uma variação da mesma cor que atinge 4,5:1

### Requirement: Fonte monoespaçada servida pelo próprio site
O sistema SHALL exibir a interface da IDE (árvore, abas e barras) na fonte Inter e o código na
fonte JetBrains Mono, ambas servidas pelo próprio site, sem requisições a serviços de fontes de
terceiros.

#### Scenario: Carregamento da fonte
- **WHEN** a página inicial é carregada
- **THEN** a Inter e a JetBrains Mono vêm do mesmo domínio do site e nenhuma requisição é feita a
  serviços externos de fontes

### Requirement: Movimento reduzido
Toda animação ou transição MUST ser desativada quando o usuário ativa a preferência de reduzir
movimento no sistema, exibindo o estado final diretamente.

#### Scenario: Preferência de reduzir movimento ativada
- **WHEN** o usuário com `prefers-reduced-motion: reduce` troca de seção ou expande a árvore
- **THEN** o novo estado aparece imediatamente, sem animação

### Requirement: Design como referência
O IntelliJ IDEA New UI, tema escuro, SHALL ser a referência da identidade visual (paleta,
tipografia, densidade e estrutura de IDE); as telas em `design/telas/` valem só como fonte das
informações. Desvios MUST ser permitidos quando melhoram a experiência de IDE, a acessibilidade
ou a modernidade do código, e MUST ser registrados no design da change.

#### Scenario: Comparação com a tela 01
- **WHEN** a página inicial é aberta numa janela de 1920x1080
- **THEN** as informações batem com a `tela-01.png`, mas o editor, os painéis e as barras usam a
  paleta Dark da New UI, sem degradês e sem cantos arredondados no editor

#### Scenario: Desvio intencional
- **WHEN** uma change acrescenta algo que não existe no IntelliJ
- **THEN** o elemento usa os tokens do sistema visual e o desvio está descrito no design da
  change

### Requirement: Escala da tipografia
Numa tela de desktop, a interface SHALL usar 13px (árvore com linhas de 24px, barra de status com
texto de 12px) e o código 14px com linhas de 22px e números de linha de 13px, com o painel
lateral de 280px, a barra superior de 40px e a barra de status de 24px, todos definidos por
tokens.

#### Scenario: Desktop de 1920x1080
- **WHEN** a seção Skills é aberta numa janela de 1920x1080
- **THEN** o código está em 14px com linhas de 22px, a árvore em 13px com linhas de 24px e o
  painel lateral tem 280px

### Requirement: Acento único e foco
O sistema SHALL usar um único acento, o azul `#3574F0`, só em bordas, ícones e indicadores, e
todo controle focável MUST mostrar um anel de foco azul de 2px.

#### Scenario: Foco no teclado
- **WHEN** o visitante navega com Tab pela árvore, pelas abas e pelos botões
- **THEN** cada controle focado mostra o anel azul de 2px, e nenhum elemento usa o rosa antigo

### Requirement: Ajustes nativos do navegador
O sistema SHALL declarar `color-scheme: dark`, um `theme-color` igual ao fundo dos painéis
(`#2B2D30`) e números tabulares nos números de linha e na posição do cursor.

#### Scenario: Controles nativos no escuro
- **WHEN** a página é aberta num navegador com tema claro
- **THEN** as barras de rolagem e os controles nativos aparecem no tema escuro
